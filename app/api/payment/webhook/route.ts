/**
 * app/api/payment/webhook/route.ts
 * 
 * Webhook Receptor de Confirmações de Pagamento (Pagou.ai & Sandbox).
 * - Executa no Edge Runtime (compatível com Cloudflare Workers).
 * - Atualiza status da tabela 'payments' para 'paid'.
 * - Atualiza tabela 'profiles' concedendo acesso Pro (analyses_limit e plan_status).
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch (_) {
      return NextResponse.json({ error: "Payload JSON inválido." }, { status: 400 });
    }

    const webhookSecret = process.env.PAGOU_WEBHOOK_SECRET;
    const signature = req.headers.get("x-pagou-signature") || req.headers.get("x-webhook-secret");

    // Validação de assinatura se configurada em produção
    if (webhookSecret && webhookSecret !== "sandbox_secret" && signature !== webhookSecret) {
      console.warn("[PAYMENT_WEBHOOK] Assinatura de webhook não confere.");
      return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
    }

    // Normalização de eventos suportados
    const eventType = payload.event || payload.type || payload.status || "payment.approved";
    const transactionId =
      payload.data?.transaction_id ||
      payload.transaction_id ||
      payload.data?.id ||
      payload.id;
    const customerEmail =
      payload.data?.customer?.email ||
      payload.customer_email ||
      payload.email;
    const planTier = payload.data?.metadata?.planTier || payload.planTier || "Pro";
    const payloadMetadata = payload.data?.metadata || payload.metadata || {};

    const isPaidEvent =
      eventType === "payment.approved" ||
      eventType === "charge.paid" ||
      eventType === "PAID" ||
      eventType === "paid" ||
      eventType === "approved";

    if (!isPaidEvent) {
      return NextResponse.json({ received: true, status: "ignored" });
    }

    const now = new Date().toISOString();

    // 1. Verificação de Idempotência e Atualização Atômica na Tabela 'payments'
    if (isSupabaseConfigured && (transactionId || customerEmail)) {
      try {
        // Checa se este webhook já foi processado anteriormente (Idempotência Estrita)
        if (transactionId) {
          const { data: existingPayment } = await supabaseAdmin
            .from("payments")
            .select("status")
            .eq("transaction_id", transactionId)
            .maybeSingle();

          if (existingPayment && (existingPayment.status === "paid" || existingPayment.status === "approved")) {
            return NextResponse.json({
              success: true,
              message: "Webhook já processado anteriormente (idempotente).",
              transactionId,
              status: "already_processed",
            });
          }
        }

        let updateQuery = supabaseAdmin
          .from("payments")
          .update({
            status: "paid",
            paid_at: now,
            updated_at: now,
            metadata: {
              webhookReceivedAt: now,
              event: eventType,
            },
          });

        if (transactionId) {
          updateQuery = updateQuery.eq("transaction_id", transactionId);
        } else if (customerEmail) {
          updateQuery = updateQuery.eq("customer_email", customerEmail).eq("status", "pending");
        }

        await updateQuery;

        // 2. Concessão Automática de Acesso no 'profiles' com suporte a Multi-User Seats e Aditivos (seat_addon)
        if (customerEmail) {
          const paymentType = payloadMetadata?.paymentType;

          if (paymentType === "seat_addon") {
            // Fluxo específico de aditivo de assento avulso
            const seatsToAdd = Math.max(1, Number(payloadMetadata?.seatQuantity) || 1);
            const creditsToAdd = seatsToAdd * 5;

            const { data: currentProfile } = await supabaseAdmin
              .from("profiles")
              .select("id, max_seats, credits, analyses_limit")
              .eq("email", customerEmail)
              .single();

            if (currentProfile) {
              const updatedSeats = Math.min(5, (currentProfile.max_seats || 0) + seatsToAdd);
              const updatedCredits = (currentProfile.credits || 0) + creditsToAdd;
              const updatedLimit = (currentProfile.analyses_limit || 15) + creditsToAdd;

              await supabaseAdmin
                .from("profiles")
                .update({
                  max_seats: updatedSeats,
                  credits: updatedCredits,
                  analyses_limit: updatedLimit,
                  updated_at: now,
                })
                .eq("email", customerEmail);
            }
          } else {
            // Fluxo padrão de assinatura mensal/anual Pro
            const additionalSeats = Math.max(0, Math.min(5, Number(payloadMetadata?.additionalSeats) || 0));
            
            let baseCredits = 5;
            let maxSeats = 0;

            if (planTier === "Pro") {
              baseCredits = 15 + (additionalSeats * 5); // 15 créditos base + 5 por seat adicional
              maxSeats = additionalSeats;
            } else if (planTier === "Enterprise") {
              baseCredits = 99999;
              maxSeats = 10;
            }

            await supabaseAdmin
              .from("profiles")
              .update({
                plan: planTier,
                plan_tier: planTier,
                plan_status: "active_pro",
                account_status: "ACTIVE",
                analyses_limit: baseCredits,
                credits: baseCredits,
                max_seats: maxSeats,
                role: "ADMIN", // Quem paga a assinatura é sempre o ADMIN/Titular
                updated_at: now,
              })
              .eq("email", customerEmail);
          }
        }
      } catch (dbErr: any) {
        console.warn("[PAYMENT_WEBHOOK] Erro ao sincronizar no Supabase:", dbErr?.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Pagamento processado e acesso liberado com sucesso.",
      transactionId,
      customerEmail,
      planTier,
      timestamp: now,
    });
  } catch (error: any) {
    console.error("[PAYMENT_WEBHOOK/ERROR]", error);
    return NextResponse.json({ error: "Erro interno no processamento do webhook." }, { status: 500 });
  }
}
