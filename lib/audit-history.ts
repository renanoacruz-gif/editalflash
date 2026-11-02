import { AuditedTenderHistoryItem, EditalAnalysisResponse, DesfechoLicitacao, SemaforoStatus } from "./types";
import { supabase, isSupabaseConfigured } from "./supabase";

function mapSupabaseToHistoryItem(row: any): AuditedTenderHistoryItem {
  const payload: EditalAnalysisResponse = row.report_data || {};
  const semaforo = payload.semaforo_habilitacao || [];
  const passaCount = semaforo.filter((i: any) => i.status === "PASSA").length;
  const ressalvaCount = semaforo.filter((i: any) => i.status === "RESSALVA").length;
  const eliminatoriaCount = semaforo.filter((i: any) => i.status === "ELIMINATORIA").length;
  const revisaoCount = semaforo.filter((i: any) => i.status === "REVISAO_HUMANA_NECESSARIA").length;

  return {
    id: row.id,
    dataAuditoria: row.created_at,
    numeroEdital: row.edital_pncp_id || row.edital_title || "Edital",
    orgao: payload.dados_gerais?.orgao || "Órgão Convocante",
    objeto: payload.dados_gerais?.objeto || row.edital_title || "Objeto da Licitação",
    valorEstimado: payload.dados_gerais?.valor_estimado || "Não informado",
    vereditoGeral: (row.verdict as SemaforoStatus) || payload.veredito_habilitacao || "PASSA",
    passaCount,
    ressalvaCount,
    eliminatoriaCount,
    revisaoCount,
    armadilhasCount: payload.armadilhas?.length || 0,
    fileName: row.edital_title || "Edital_Auditado.pdf",
    desfecho: row.desfecho || "EM_ANDAMENTO",
    valorHomologadoGanha: row.valor_homologado_ganha ? Number(row.valor_homologado_ganha) : undefined,
    motivoPerda: row.motivo_perda || undefined,
    segmento: row.segmento || "Obras Públicas e Engenharia",
    payload,
  };
}

export function getAuditHistory(userEmail?: string): AuditedTenderHistoryItem[] {
  return [];
}

export async function fetchAuditsFromCloud(
  userId?: string,
  options?: {
    verdict?: string;
    searchTerm?: string;
  }
): Promise<{ items: AuditedTenderHistoryItem[]; source: "cloud" | "cache" }> {
  if (!isSupabaseConfigured || !userId) {
    return { items: [], source: "cloud" };
  }

  try {
    let query = supabase
      .from("audited_tenders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (options?.verdict && options.verdict !== "ALL") {
      if (options.verdict === "ELIMINATORIA") {
        query = query.in("verdict", ["ELIMINATORIA", "ELIMINATÓRIA"]);
      } else {
        query = query.eq("verdict", options.verdict);
      }
    }

    if (options?.searchTerm && options.searchTerm.trim().length > 0) {
      query = query.ilike("edital_title", `%${options.searchTerm.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.warn("[AUDIT_HISTORY] Erro na consulta ao Supabase:", error.message);
      return { items: [], source: "cloud" };
    }

    if (data && data.length > 0) {
      const cloudItems = data.map(mapSupabaseToHistoryItem);
      return { items: cloudItems, source: "cloud" };
    }

    return { items: [], source: "cloud" };
  } catch (err: any) {
    console.error("[AUDIT_HISTORY] Falha de rede ao buscar do Supabase:", err);
    return { items: [], source: "cloud" };
  }
}

export async function syncPendingAuditsToCloud(userId?: string) {
  // Sem localStorage
}

export async function updateTenderOutcome(
  id: string,
  desfecho: DesfechoLicitacao,
  valorHomologado?: number,
  motivoPerda?: string,
  userId?: string
): Promise<boolean> {
  if (isSupabaseConfigured && userId) {
    try {
      const { error } = await supabase
        .from("audited_tenders")
        .update({
          desfecho,
          valor_homologado_ganha: valorHomologado || null,
          motivo_perda: motivoPerda || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", userId);

      if (error) {
        console.warn("[AUDIT_HISTORY] Erro ao atualizar desfecho no Supabase:", error.message);
      }
    } catch (err) {
      console.warn("[AUDIT_HISTORY] Falha de conexão ao atualizar desfecho no Supabase:", err);
    }
  }
  return true;
}

export function saveAuditHistoryItem(
  data: EditalAnalysisResponse,
  fileName?: string,
  userId?: string
): AuditedTenderHistoryItem {
  const semaforo = data.semaforo_habilitacao || [];
  const passaCount = semaforo.filter((i) => i.status === "PASSA").length;
  const ressalvaCount = semaforo.filter((i) => i.status === "RESSALVA").length;
  const eliminatoriaCount = semaforo.filter((i) => i.status === "ELIMINATORIA").length;
  const revisaoCount = semaforo.filter((i) => i.status === "REVISAO_HUMANA_NECESSARIA").length;

  const vereditoGeral =
    data.veredito_habilitacao ||
    (eliminatoriaCount > 0
      ? "ELIMINATORIA"
      : ressalvaCount > 0
      ? "RESSALVA"
      : revisaoCount > 0
      ? "REVISAO_HUMANA_NECESSARIA"
      : "PASSA");

  const itemId = data.analysis_id || ("hist-local-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6));

  const newItem: AuditedTenderHistoryItem = {
    id: itemId,
    dataAuditoria: new Date().toISOString(),
    numeroEdital: data.dados_gerais.numero_edital || "Edital sem número",
    orgao: data.dados_gerais.orgao || "Órgão Convocante",
    objeto: data.dados_gerais.objeto || "Sem descrição de objeto",
    valorEstimado: data.dados_gerais.valor_estimado || "Não informado",
    vereditoGeral,
    passaCount,
    ressalvaCount,
    eliminatoriaCount,
    revisaoCount,
    armadilhasCount: data.armadilhas?.length || 0,
    fileName: fileName || "Edital_Auditado.pdf",
    desfecho: "EM_ANDAMENTO",
    segmento: data.detected_vertical || data.vertical || "Obras Públicas e Engenharia",
    payload: data,
  };

  // Se o cliente estiver conectado e houver userId, dispara inserção assíncrona no Supabase
  if (isSupabaseConfigured && userId && !data.analysis_id) {
    (async () => {
      try {
        const { error } = await supabase.from("audited_tenders").insert({
          user_id: userId,
          edital_pncp_id: newItem.numeroEdital,
          edital_title: newItem.numeroEdital || newItem.fileName || "Edital",
          verdict: newItem.vereditoGeral,
          report_data: data,
          segmento: newItem.segmento,
          desfecho: "EM_ANDAMENTO",
        });
        if (error) {
          console.warn("[AUDIT_HISTORY] Erro ao gravar no Supabase:", error.message);
        }
      } catch (err: any) {
        console.warn("[AUDIT_HISTORY] Falha ao persistir no Supabase:", err?.message);
      }
    })();
  }

  return newItem;
}
