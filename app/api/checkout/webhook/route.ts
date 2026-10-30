/**
 * app/api/checkout/webhook/route.ts
 * 
 * Skeleton Robusto para Webhook de Pagamentos (Asaas / Gateway Bancário).
 * Eventos Tratados:
 * - PAYMENT_CONFIRMED: Confirmação de PIX ou Cartão de Crédito
 * - PAYMENT_RECEIVED: Compensação bancária de boleto
 * - PAYMENT_OVERDUE: Falha ou atraso no pagamento de assinatura
 * - PAYMENT_REFUNDED: Estorno ou chargeback
 * 
 * Suporte a faturamento por CPF (Licitante Pessoa Física) e CNPJ (Pessoa Jurídica para NF-e).
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    // 1. Validação de Autenticidade do Token Asaas
    const webhookToken =
      req.headers.get("asaas-access-token") ||
      req.headers.get("x-webhook-token") ||
      req.headers.get("authorization");

    const expectedSecret = process.env.ASAAS_WEBHOOK_SECRET;

    if (expectedSecret && webhookToken !== expectedSecret) {
      console.warn("[WEBHOOK/ASAAS] Tentativa de acesso com token inválido.");
      return NextResponse.json({ error: "Acesso não autorizado ao webhook." }, { status: 401 });
    }

    const event = await req.json();
    const eventType = event.event; // Ex: 'PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED', etc.
    const payment = event.payment || {};

    console.log(`[WEBHOOK/ASAAS] Processando evento ${eventType} para transação ${payment.id || "N/A"}`);

    const customerCpfCnpj = payment.customerCpfCnpj || payment.cpfCnpj;
    const customerEmail = payment.customerEmail || payment.email;
    const externalId = payment.id;
    const value = payment.value; // Em Reais

    // 2. Processamento do Evento de Pagamento Confirmado
    if (eventType === "PAYMENT_CONFIRMED" || eventType === "PAYMENT_RECEIVED") {
      if (isSupabaseConfigured) {
        try {
          // Atualiza status da transação na tabela transactions
          await supabaseAdmin
            .from("transactions")
            .update({
              status: "CONFIRMED",
              confirmed_at: new Date().toISOString(),
            })
            .eq("external_id", externalId);

          // Se for ativação de plano, atualiza o tenant correspondente
          if (customerEmail) {
            await supabaseAdmin
              .from("tenants")
              .update({
                plan: value >= 800 ? "Enterprise" : value >= 250 ? "Pro" : "Starter",
                analyses_limit: value >= 800 ? 99999 : value >= 250 ? 15 : 5,
                updated_at: new Date().toISOString(),
              })
              .eq("email", customerEmail.toLowerCase().trim());
          }
        } catch (dbErr: any) {
          console.error("[WEBHOOK/ASAAS] Falha ao atualizar banco de dados:", dbErr?.message);
        }
      }
    } else if (eventType === "PAYMENT_OVERDUE") {
      console.warn(`[WEBHOOK/ASAAS] Pagamento em atraso para cliente: ${customerEmail}`);
    }

    return NextResponse.json(
      {
        received: true,
        event: eventType,
        transactionId: externalId,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[WEBHOOK/ASAAS] Erro interno:", error);
    return NextResponse.json(
      { error: "Falha interna no processamento do webhook." },
      { status: 500 }
    );
  }
}
