import { AuditedTenderHistoryItem, EditalAnalysisResponse, DesfechoLicitacao, SemaforoStatus } from "./types";
import { supabase, isSupabaseConfigured } from "./supabase";

const HISTORY_STORAGE_KEY = "editalflash_audit_history";
const PENDING_SYNC_KEY = "editalflash_pending_sync_audits";

export const initialMockHistory: AuditedTenderHistoryItem[] = [
  {
    id: "hist-001",
    dataAuditoria: "2026-10-27T14:30:00.000Z",
    numeroEdital: "Concorrência Eletrônica nº 042/2026",
    orgao: "Departamento de Estradas de Rodagem (DER-SP)",
    objeto: "Execução de obras e serviços de engenharia para restauração de pavimento asfáltico em CBUQ com sinalização vertical e horizontal.",
    valorEstimado: "R$ 4.250.000,00",
    vereditoGeral: "PASSA",
    passaCount: 11,
    ressalvaCount: 1,
    eliminatoriaCount: 0,
    revisaoCount: 0,
    armadilhasCount: 2,
    fileName: "Edital_DER_042_2026.pdf",
    desfecho: "GANHA",
    valorHomologadoGanha: 3980000,
    segmento: "Obras Públicas e Engenharia",
    payload: {
      nivel_risco: "Baixo",
      justificativa_risco: "Exigências proporcionais e aderentes à jurisprudência do TCU.",
      veredito_habilitacao: "PASSA",
      justificativa_veredito: "A empresa atende plenamente ao índice de liquidez, patrimônio líquido exigido e qualificação técnico-operacional.",
      dados_gerais: {
        objeto: "Execução de obras e serviços de engenharia para restauração de pavimento asfáltico em CBUQ.",
        valor_estimado: "R$ 4.250.000,00",
        data_sessao: "2026-11-18T10:00:00",
        prazo_impugnacao: "2026-11-11",
        numero_edital: "Concorrência Eletrônica nº 042/2026",
        orgao: "Departamento de Estradas de Rodagem (DER-SP)",
      },
      armadilhas: [
        {
          titulo: "Exigência de Vistoria Técnica Obrigatória sem Opção de Declaração",
          descricao: "O edital exige visita técnica presencial obrigatória por engenheiro responsável, em contradição com o Art. 63 da Lei 14.133/2021.",
          texto_original: "Item 9.1: A visita técnica ao local das obras é obrigatória e condicionante de habilitação.",
          impacto: "Médio",
        },
      ],
      checklist_habilitacao: [],
    },
  },
  {
    id: "hist-002",
    dataAuditoria: "2026-10-25T11:15:00.000Z",
    numeroEdital: "Pregão Eletrônico nº 118/2026",
    orgao: "Tribunal Regional Federal da 3ª Região (TRF-3)",
    objeto: "Contratação de empresa especializada em serviços continuados de manutenção predial com fornecimento de materiais e peças.",
    valorEstimado: "R$ 1.890.000,00",
    vereditoGeral: "RESSALVA",
    passaCount: 9,
    ressalvaCount: 2,
    eliminatoriaCount: 0,
    revisaoCount: 0,
    armadilhasCount: 1,
    fileName: "PE_TRF3_118_2026.pdf",
    desfecho: "EM_ANDAMENTO",
    segmento: "Serviços Contínuos (Limpeza, Segurança, Manutenção)",
    payload: {
      nivel_risco: "Médio",
      justificativa_risco: "Certidão de Falência expirada no cofre, sanável por emissão online imediata.",
      veredito_habilitacao: "RESSALVA",
      justificativa_veredito: "Pendência documental sanável antes do encerramento da sessão de julgamento conforme Art. 64, §1º da Lei 14.133.",
      dados_gerais: {
        objeto: "Contratação de empresa especializada em manutenção predial preventiva e corretiva.",
        valor_estimado: "R$ 1.890.000,00",
        data_sessao: "2026-11-05T09:30:00",
        prazo_impugnacao: "2026-10-29",
        numero_edital: "Pregão Eletrônico nº 118/2026",
        orgao: "Tribunal Regional Federal da 3ª Região (TRF-3)",
      },
      armadilhas: [],
      checklist_habilitacao: [],
    },
  },
  {
    id: "hist-003",
    dataAuditoria: "2026-10-22T16:45:00.000Z",
    numeroEdital: "Concorrência nº 007/2026",
    orgao: "Prefeitura Municipal de Campinas / Secretaria de Infraestrutura",
    objeto: "Construção de Unidade Básica de Saúde (UBS) Tipo II no Distrito de Barão Geraldo.",
    valorEstimado: "R$ 3.800.000,00",
    vereditoGeral: "ELIMINATORIA",
    passaCount: 7,
    ressalvaCount: 1,
    eliminatoriaCount: 2,
    revisaoCount: 0,
    armadilhasCount: 3,
    fileName: "Edital_UBS_Campinas_007.pdf",
    desfecho: "NAO_DISPUTADA",
    motivoPerda: "Inabilitação preventiva identificada pelo EditalFlash (PL insuficiente).",
    segmento: "Obras Públicas e Engenharia",
    payload: {
      nivel_risco: "Alto",
      justificativa_risco: "Patrimônio Líquido cadastrado insuficiente para a exigência de 10% (Art. 69).",
      veredito_habilitacao: "ELIMINATORIA",
      justificativa_veredito: "A empresa possui PL de R$ 350.000,00 enquanto o edital exige o mínimo de R$ 380.000,00.",
      dados_gerais: {
        objeto: "Construção de Unidade Básica de Saúde (UBS) Tipo II.",
        valor_estimado: "R$ 3.800.000,00",
        data_sessao: "2026-11-03T14:00:00",
        prazo_impugnacao: "2026-10-27",
        numero_edital: "Concorrência nº 007/2026",
        orgao: "Prefeitura Municipal de Campinas",
      },
      armadilhas: [
        {
          titulo: "Vedação ao Somatório de Atestados sem Justificativa Técnica",
          descricao: "Cláusula 12.4 veda expressamente o somatório de atestados técnicos sem estudo prévio que justifique a singularidade da obra, afrontando a Súmula 263 do TCU.",
          texto_original: "Item 12.4: Fica expressamente vedado o somatório de atestados de capacidade técnica para fins de quantitativos mínimos.",
          impacto: "Alto",
        },
      ],
      checklist_habilitacao: [],
    },
  },
];

/**
 * Converte registro do Supabase para formato tipado AuditedTenderHistoryItem
 */
export function mapSupabaseToHistoryItem(row: any): AuditedTenderHistoryItem {
  const payload = row.report_data || {};
  const semaforo = payload.semaforo_habilitacao || [];
  
  let verdict: SemaforoStatus = "PASSA";
  if (row.verdict === "ELIMINATÓRIA" || row.verdict === "ELIMINATORIA") verdict = "ELIMINATORIA";
  else if (row.verdict === "RESSALVA") verdict = "RESSALVA";
  else if (row.verdict === "REVISÃO_HUMANA" || row.verdict === "REVISAO_HUMANA_NECESSARIA") verdict = "REVISAO_HUMANA_NECESSARIA";
  
  return {
    id: row.id,
    dataAuditoria: row.analysis_date || row.created_at || new Date().toISOString(),
    numeroEdital: row.edital_pncp_id || payload.dados_gerais?.numero_edital || row.edital_title || "Edital",
    orgao: payload.dados_gerais?.orgao || "Órgão Convocante",
    objeto: payload.dados_gerais?.objeto || row.edital_title || "Objeto da Licitação",
    valorEstimado: payload.dados_gerais?.valor_estimado || "Não informado",
    vereditoGeral: verdict,
    passaCount: semaforo.filter((i: any) => i.status === "PASSA").length,
    ressalvaCount: semaforo.filter((i: any) => i.status === "RESSALVA").length,
    eliminatoriaCount: semaforo.filter((i: any) => i.status === "ELIMINATORIA").length,
    revisaoCount: semaforo.filter((i: any) => i.status === "REVISAO_HUMANA_NECESSARIA").length,
    armadilhasCount: payload.armadilhas?.length || 0,
    fileName: row.edital_title || "Edital_Auditado.pdf",
    desfecho: row.desfecho || "EM_ANDAMENTO",
    valorHomologadoGanha: row.valor_homologado_ganha ? Number(row.valor_homologado_ganha) : undefined,
    motivoPerda: row.motivo_perda || undefined,
    segmento: row.segmento || payload.detected_vertical || payload.vertical || "Obras Públicas e Engenharia",
    payload,
  };
}

/**
 * Lê histórico de auditorias do localStorage (síncrono, para fallback instantâneo)
 */
export function getAuditHistory(userEmail?: string): AuditedTenderHistoryItem[] {
  if (typeof window === "undefined") {
    return [];
  }
  const cleanEmail = (userEmail || "").toLowerCase().trim();
  const isAdmin = cleanEmail === "renan.oacruz@gmail.com" || cleanEmail === "renanoacruz@gmail.com";

  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) {
      if (isAdmin) {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(initialMockHistory));
        return initialMockHistory;
      }
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : (isAdmin ? initialMockHistory : []);
  } catch (err) {
    console.error("Erro ao ler histórico de auditorias do localStorage:", err);
    return isAdmin ? initialMockHistory : [];
  }
}

/**
 * Busca histórico em nuvem (Supabase) com fallback e merge com localStorage
 */
export async function fetchAuditsFromCloud(
  userId?: string,
  options?: {
    verdict?: string;
    searchTerm?: string;
  }
): Promise<{ items: AuditedTenderHistoryItem[]; source: "cloud" | "cache" }> {
  const localList = getAuditHistory();

  if (!isSupabaseConfigured || !userId) {
    return { items: localList, source: "cache" };
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
      console.warn("[AUDIT_HISTORY] Erro na consulta ao Supabase, recorrendo a cache:", error.message);
      return { items: localList, source: "cache" };
    }

    if (data && data.length > 0) {
      const cloudItems = data.map(mapSupabaseToHistoryItem);

      // Sincronização e merge: prioridade para dados da nuvem
      if (typeof window !== "undefined") {
        const cloudIds = new Set(cloudItems.map((c) => c.id));
        // Preserva rascunhos locais que ainda não subiram para a nuvem
        const pendingLocalDrafts = localList.filter((l) => !cloudIds.has(l.id) && l.id.startsWith("hist-local-"));
        const merged = [...cloudItems, ...pendingLocalDrafts];
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(merged));
      }

      return { items: cloudItems, source: "cloud" };
    }

    // Se o banco estiver vazio mas houver dados locais, tenta sincronizar os rascunhos para a nuvem
    syncPendingAuditsToCloud(userId);
    return { items: localList, source: "cache" };
  } catch (err: any) {
    console.error("[AUDIT_HISTORY] Falha de rede ao buscar do Supabase:", err);
    return { items: localList, source: "cache" };
  }
}

/**
 * Tenta enviar auditorias pendentes gravadas offline para o Supabase
 */
export async function syncPendingAuditsToCloud(userId?: string) {
  if (!isSupabaseConfigured || !userId || typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem(PENDING_SYNC_KEY);
    if (!raw) return;

    const pendingQueue: AuditedTenderHistoryItem[] = JSON.parse(raw);
    if (!Array.isArray(pendingQueue) || pendingQueue.length === 0) return;

    for (const item of pendingQueue) {
      await supabase.from("audited_tenders").insert({
        user_id: userId,
        edital_pncp_id: item.numeroEdital,
        edital_title: item.numeroEdital || item.fileName || "Edital",
        verdict: item.vereditoGeral,
        report_data: item.payload,
        desfecho: item.desfecho || "EM_ANDAMENTO",
        valor_homologado_ganha: item.valorHomologadoGanha || null,
        motivo_perda: item.motivoPerda || null,
        segmento: item.segmento || "Obras Públicas e Engenharia",
      });
    }

    localStorage.removeItem(PENDING_SYNC_KEY);
  } catch (err) {
    console.warn("[AUDIT_HISTORY] Falha ao sincronizar fila offline:", err);
  }
}

/**
 * Atualiza o desfecho da licitação no Supabase e no localStorage
 */
export async function updateTenderOutcome(
  id: string,
  desfecho: DesfechoLicitacao,
  valorHomologado?: number,
  motivoPerda?: string,
  userId?: string
): Promise<boolean> {
  // 1. Atualização imediata no cache do localStorage
  if (typeof window !== "undefined") {
    try {
      const list = getAuditHistory();
      const updated = list.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            desfecho,
            valorHomologadoGanha: valorHomologado || item.valorHomologadoGanha,
            motivoPerda: motivoPerda || item.motivoPerda,
          };
        }
        return item;
      });
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Erro ao atualizar desfecho local:", err);
    }
  }

  // 2. Atualização remota no Supabase Cloud
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

/**
 * Salva novo item auditado tanto no localStorage quanto no Supabase
 */
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

  // 1. Grava no localStorage imediatamente
  if (typeof window !== "undefined") {
    try {
      const current = getAuditHistory();
      const updated = [newItem, ...current.filter((item) => item.id !== newItem.id)].slice(0, 50);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));

      // Se for offline ou Supabase não configurado no momento, enfileira para sincronização posterior
      if (userId && !isSupabaseConfigured) {
        const rawPending = localStorage.getItem(PENDING_SYNC_KEY);
        const pendingQueue = rawPending ? JSON.parse(rawPending) : [];
        pendingQueue.push(newItem);
        localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(pendingQueue));
      }
    } catch (e) {
      console.error("Erro ao gravar item no histórico local:", e);
    }
  }

  // 2. Se o cliente estiver conectado e houver userId, dispara inserção assíncrona no Supabase
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
          console.warn("[AUDIT_HISTORY] Erro ao gravar no Supabase em segundo plano:", error.message);
        }
      } catch (err: any) {
        console.warn("[AUDIT_HISTORY] Falha de rede ao persistir no Supabase:", err?.message);
      }
    })();
  }

  return newItem;
}
