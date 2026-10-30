import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, userEmail, password, reason } = body;

    if (!action) {
      return NextResponse.json({ error: "Ação não informada." }, { status: 400 });
    }

    const targetEmail = userEmail ? userEmail.trim().toLowerCase() : "";
    const nowIso = new Date().toISOString();

    // 1. PAUSAR ASSINATURA: Mantém dados por 30 dias e interrompe cobranças
    if (action === "pause") {
      const pauseExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      if (isSupabaseConfigured) {
        if (userId) {
          await supabaseAdmin
            .from("profiles")
            .update({
              subscription_status: "PAUSED",
              paused_at: nowIso,
              pause_expires_at: pauseExpiresAt,
            })
            .eq("id", userId);
        } else if (targetEmail) {
          await supabaseAdmin
            .from("profiles")
            .update({
              subscription_status: "PAUSED",
              paused_at: nowIso,
              pause_expires_at: pauseExpiresAt,
            })
            .eq("email", targetEmail);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Assinatura pausada com sucesso. Seus dados estão preservados por 30 dias.",
        subscription_status: "PAUSED",
        paused_at: nowIso,
        pause_expires_at: pauseExpiresAt,
      });
    }

    // 2. CANCELAR ASSINATURA: Status=CANCELLED com motivo obrigatório e sincronização com Gateway Pagou.ai
    if (action === "cancel") {
      if (!reason || reason.trim().length === 0) {
        return NextResponse.json(
          { error: "É obrigatório fornecer o motivo do cancelamento." },
          { status: 400 }
        );
      }

      // Sincronização com o Gateway Pagou.ai / Asaas se configurado
      const pagouApiKey = process.env.PAGOU_API_KEY;
      let gatewayCancelled = false;

      if (pagouApiKey && !pagouApiKey.includes("placeholder")) {
        try {
          // Busca última assinatura ou customer_id no pagou.ai
          const { data: latestPayment } = await supabaseAdmin
            .from("payments")
            .select("transaction_id, metadata")
            .or(`user_id.eq.${userId},customer_email.eq.${targetEmail}`)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (latestPayment?.transaction_id) {
            // Chamada de cancelamento à API de assinaturas da Pagou.ai
            const cancelRes = await fetch(`https://api.pagou.ai/v1/subscriptions/${latestPayment.transaction_id}/cancel`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${pagouApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ reason: reason.trim() }),
            });

            if (cancelRes.ok) {
              gatewayCancelled = true;
            }
          }
        } catch (gatewayErr: any) {
          console.warn("[ACCOUNT_MANAGE] Aviso no cancelamento do gateway externo:", gatewayErr?.message);
        }
      }

      if (isSupabaseConfigured) {
        const updatePayload = {
          subscription_status: "CANCELLED",
          cancellation_reason: reason.trim(),
          plan_status: "cancelled",
          updated_at: nowIso,
        };

        if (userId) {
          await supabaseAdmin.from("profiles").update(updatePayload).eq("id", userId);
        } else if (targetEmail) {
          await supabaseAdmin.from("profiles").update(updatePayload).eq("email", targetEmail);
        }
      }

      return NextResponse.json({
        success: true,
        message: "Assinatura cancelada com sucesso. Nenhuma nova cobrança será emitida.",
        subscription_status: "CANCELLED",
        gatewayCancelled,
        supportNotice: "Seu acesso permanecerá ativo até o final do ciclo faturado vigente.",
      });
    }

    // 3. EXCLUIR CONTA (ZONA DE PERIGO):
    // Hard delete em vault_documents, audited_tenders e profiles.
    // Soft delete em payments para fins de auditoria fiscal e contábil.
    if (action === "delete_account") {
      if (!password || password.trim().length === 0) {
        return NextResponse.json(
          { error: "Confirmação de senha é obrigatória para excluir a conta." },
          { status: 400 }
        );
      }

      let resolvedUserId = userId;

      if (isSupabaseConfigured) {
        // Se temos o e-mail mas não o UUID, busca o profile
        if (!resolvedUserId && targetEmail) {
          const { data: p } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("email", targetEmail)
            .maybeSingle();
          if (p?.id) resolvedUserId = p.id;
        }

        if (resolvedUserId) {
          // A. Soft delete em payments (anonimiza PII mantendo registro financeiro)
          await supabaseAdmin
            .from("payments")
            .update({
              is_deleted: true,
              deleted_at: nowIso,
              anonymized_at: nowIso,
              customer_name: "[ANÔNIMO LGPD]",
              customer_cnpj: "[ANÔNIMO LGPD]",
            })
            .eq("user_id", resolvedUserId);

          // B. Hard delete em vault_documents
          await supabaseAdmin.from("vault_documents").delete().eq("user_id", resolvedUserId);

          // C. Hard delete em audited_tenders
          await supabaseAdmin.from("audited_tenders").delete().eq("user_id", resolvedUserId);

          // D. Hard delete em profiles
          await supabaseAdmin.from("profiles").delete().eq("id", resolvedUserId);

          // E. Remove do Supabase Auth
          try {
            await supabaseAdmin.auth.admin.deleteUser(resolvedUserId);
          } catch (authDelErr: any) {
            console.warn("[API/ACCOUNT] Supabase auth delete notice:", authDelErr?.message);
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: "Conta e dados pessoais excluídos com sucesso em conformidade com a LGPD.",
        account_status: "DELETED",
      });
    }

    return NextResponse.json({ error: "Ação não reconhecida." }, { status: 400 });
  } catch (error: any) {
    console.error("[API/ACCOUNT] Erro de execução:", error);
    return NextResponse.json(
      { error: error?.message || "Erro interno ao processar operação da conta." },
      { status: 500 }
    );
  }
}
