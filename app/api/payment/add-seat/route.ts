/**
 * app/api/payment/add-seat/route.ts
 * 
 * Endpoint de Checkout para Compra de Assentos Adicionais (Seats Pro).
 * - Gera cobrança PIX via Pagou.ai com fallback sandbox.
 * - Registra transação como 'seat_addon' na tabela 'payments' do Supabase.
 * - Compatível com Edge Runtime e Cloudflare Workers.
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { checkRateLimit } from "@/lib/rate-limit";
import { PRICING_CONFIG } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  try {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateResult = checkRateLimit(`rate:add-seat:${clientIp}`, 10, 60000);
    if (!rateResult.success) {
      return NextResponse.json(
        { error: "Muitas tentativas de adição de assentos. Aguarde um instante." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { userId, quantity = 1, customerEmail, customerName } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Identificador do usuário (userId) é obrigatório." },
        { status: 400 }
      );
    }

    const qty = Math.max(1, Math.min(PRICING_CONFIG.MAX_ADDITIONAL_SEATS, Number(quantity) || 1));

    // 1. Validação de Elegibilidade: O usuário precisa ser ADMIN de uma conta Pro
    if (isSupabaseConfigured && supabaseAdmin) {
      const { data: profile, error: profileErr } = await supabaseAdmin
        .from("profiles")
        .select("id, email, plan_tier, role, max_seats, active_seats")
        .eq("id", userId)
        .single();

      if (profileErr || !profile) {
        return NextResponse.json(
          { error: "Perfil de usuário não encontrado." },
          { status: 404 }
        );
      }

      if (profile.role === "MEMBER") {
        return NextResponse.json(
          { error: "Apenas o titular (ADMIN) pode contratar assentos adicionais para a organização." },
          { status: 403 }
        );
      }

      const currentMaxSeats = profile.max_seats || 0;
      if (currentMaxSeats + qty > PRICING_CONFIG.MAX_ADDITIONAL_SEATS) {
        return NextResponse.json(
          {
            error: `Limite de assentos excedido. Sua conta já possui ${currentMaxSeats} assento(s) e o limite máximo permitido é ${PRICING_CONFIG.MAX_ADDITIONAL_SEATS}.`,
            currentMaxSeats,
            maxAllowed: PRICING_CONFIG.MAX_ADDITIONAL_SEATS,
          },
          { status: 400 }
        );
      }
    }

    const amountCents = qty * PRICING_CONFIG.ADDITIONAL_SEAT_PRICE_CENTS;
    const creditsToAdd = qty * PRICING_CONFIG.CREDITS_PER_ADDITIONAL_SEAT;
    const transactionId = "seat_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    const checkoutId = "chk_seat_" + Math.random().toString(36).substring(2, 10);
    const payerEmail = customerEmail || "gestor@licitacoes.com.br";
    const payerName = customerName || "Gestor de Licitações";

    let pixPayload = {
      qrCode: "",
      qrCodeUrl: "",
      copyPaste: "",
    };

    const pagouApiKey = process.env.PAGOU_API_KEY;

    // 2. Chamada à API Pagou.ai (se configurada)
    if (pagouApiKey && !pagouApiKey.includes("placeholder")) {
      try {
        const pagouRes = await fetch("https://api.pagou.ai/v1/charges", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${pagouApiKey}`,
          },
          body: JSON.stringify({
            amount: amountCents,
            payment_method: "pix",
            customer: {
              email: payerEmail,
              name: payerName,
            },
            metadata: {
              transactionId,
              userId,
              paymentType: "seat_addon",
              seatQuantity: qty,
              creditsToAdd,
            },
          }),
        });

        if (pagouRes.ok) {
          const pagouData = await pagouRes.json();
          pixPayload = {
            qrCode: pagouData.point_of_interaction?.transaction_data?.qr_code || "",
            qrCodeUrl: pagouData.point_of_interaction?.transaction_data?.qr_code_base64 || "",
            copyPaste: pagouData.point_of_interaction?.transaction_data?.qr_code || "",
          };
        }
      } catch (pagouErr: any) {
        console.warn("[SEAT_CHECKOUT] Fallback sandbox ativado:", pagouErr?.message);
      }
    }

    // Fallback PIX Sandbox
    if (!pixPayload.copyPaste) {
      const mockPixCode = `00020126580014br.gov.bcb.pix0136${transactionId}520400005303986540${(amountCents / 100).toFixed(2)}5802BR5915EDITALFLASH SAAS6009SAO PAULO62070503***6304SEAT`;
      pixPayload = {
        qrCode: mockPixCode,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(mockPixCode)}`,
        copyPaste: mockPixCode,
      };
    }

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutos

    // 3. Gravação na Tabela 'payments'
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        await supabaseAdmin.from("payments").insert({
          user_id: userId,
          customer_email: payerEmail,
          customer_name: payerName,
          provider: pagouApiKey ? "pagou_ai" : "sandbox",
          payment_method: "pix",
          transaction_id: transactionId,
          checkout_id: checkoutId,
          amount_cents: amountCents,
          currency: "BRL",
          plan_tier: "Pro",
          billing_cycle: "monthly",
          status: "pending",
          pix_qr_code: pixPayload.qrCode,
          pix_qr_code_url: pixPayload.qrCodeUrl,
          pix_copy_paste: pixPayload.copyPaste,
          expires_at: expiresAt,
          metadata: {
            clientIp,
            paymentType: "seat_addon",
            seatQuantity: qty,
            creditsToAdd,
            createdAt: new Date().toISOString(),
          },
        });
      } catch (dbErr: any) {
        console.warn("[SEAT_CHECKOUT/SUPABASE] Aviso na gravação:", dbErr?.message);
      }
    }

    return NextResponse.json({
      success: true,
      transactionId,
      checkoutId,
      amountCents,
      amountReais: (amountCents / 100).toFixed(2),
      seatQuantity: qty,
      creditsToAdd,
      expiresAt,
      pix: pixPayload,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Erro ao gerar checkout de assentos: " + err.message },
      { status: 500 }
    );
  }
}
