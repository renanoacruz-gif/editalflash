import { supabase, isSupabaseConfigured } from "./supabase";
import { CompanyDocumentVaultItem } from "./types";

export function mapRowToVaultItem(row: any): CompanyDocumentVaultItem {
  const meta = row.metadata || {};
  let diasParaVencer = meta.diasParaVencer;
  if (diasParaVencer === undefined || diasParaVencer === null) {
    if (row.data_validade) {
      const diff = new Date(row.data_validade).getTime() - new Date().getTime();
      diasParaVencer = Math.ceil(diff / (1000 * 60 * 60 * 24));
    } else {
      diasParaVencer = 9999;
    }
  }

  let status: "VALIDO" | "EXPIRANDO" | "VENCIDO" = "VALIDO";
  if (row.status) {
    status = row.status;
  } else if (diasParaVencer < 0) {
    status = "VENCIDO";
  } else if (diasParaVencer <= 30) {
    status = "EXPIRANDO";
  }

  return {
    id: row.id.startsWith("doc-") ? row.id : `doc-${row.id}`,
    tipo: row.tipo || (row.doc_type === "ATESTADO" ? "Qualificação Técnica" : "Certidão Fiscal"),
    nome: row.file_name || row.nome || "Documento",
    emissor: row.emissor || "Órgão Emissor",
    dataEmissao: row.data_emissao || new Date().toISOString().split("T")[0],
    dataValidade: row.data_validade || "2099-12-31",
    diasParaVencer,
    status,
    arquivoUrl: row.file_path,
  };
}

export async function getVaultDocuments(userId?: string): Promise<CompanyDocumentVaultItem[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    let query = supabase.from("vault_documents").select("*").order("created_at", { ascending: false });
    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("[VAULT] Erro ao carregar documentos do Supabase:", error.message);
      return [];
    }

    return (data || []).map(mapRowToVaultItem);
  } catch (err: any) {
    console.warn("[VAULT] Exceção ao consultar documentos:", err?.message);
    return [];
  }
}
