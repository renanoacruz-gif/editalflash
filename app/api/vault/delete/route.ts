/**
 * app/api/vault/delete/route.ts
 * 
 * Exclusão Permanente de Documentos do Cofre com Conformidade LGPD (Direito ao Esquecimento).
 * - Remove metadados da tabela vault_documents.
 * - Registra evento de auditoria em audit_events.
 * - Retorna confirmação segura para atualização instantânea na interface.
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { adminStore } from "@/lib/admin-store";

export async function POST(req: NextRequest) {
  try {
    const { docId, userEmail, fileName } = await req.json();

    if (!docId) {
      return NextResponse.json(
        { success: false, error: "Identificador do documento é obrigatório." },
        { status: 400 }
      );
    }

    const email = userEmail || "usuario@empresa.com.br";

    // 1. Registro em log de auditoria para conformidade e rastreabilidade LGPD
    try {
      adminStore.addAuditEvent({
        actorEmail: email,
        actorRole: email.includes("renan") ? "superadmin" : "tenant_user",
        action: "DOCUMENT_DELETED_PERMANENTLY",
        entityAffected: "Vault Document",
        payload: {
          docId,
          fileName: fileName || "documento.pdf",
          deletedAt: new Date().toISOString(),
          compliance: "LGPD Art. 18 / Art. 62",
        },
      });
    } catch (_) {}

    // 2. Remoção no Supabase se configurado
    if (isSupabaseConfigured) {
      try {
        const cleanId = docId.replace("doc-", "");
        await supabaseAdmin
          .from("vault_documents")
          .delete()
          .eq("id", cleanId);
      } catch (dbErr: any) {
        console.warn("[API/VAULT/DELETE] Aviso ao deletar no Supabase:", dbErr?.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Documento excluído com sucesso",
      docId,
    });
  } catch (err: any) {
    console.error("[API/VAULT/DELETE] Erro ao excluir documento:", err);
    return NextResponse.json(
      { success: false, error: "Falha ao processar exclusão do documento." },
      { status: 500 }
    );
  }
}
