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

    // 1. Atualização da tabela 'payments'
    if (isSupabaseConfigured && (transactionId || customerEmail)) {
      try {
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

        // 2. Concessão Automática de Acesso no 'profiles'
        if (customerEmail) {
          const analysesLimit = planTier === "Enterprise" ? 99999 : planTier === "Pro" ? 15 : 5;
          await supabaseAdmin
            .from("profiles")
            .update({
              plan: planTier,
              plan_status: "active_pro",
              analyses_limit: analysesLimit,
              updated_at: now,
            })
            .eq("email", customerEmail);
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
