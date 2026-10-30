"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  TrendingUp,
  DollarSign,
  PieChart,
  Target,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Award,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { AuditedTenderHistoryItem, DesfechoLicitacao } from "@/lib/types";
import { getAuditHistory, fetchAuditsFromCloud, updateTenderOutcome } from "@/lib/audit-history";
import { useAuth } from "@/lib/auth-context";

interface PerformanceRoiDashboardProps {
  userPlan?: string | null;
}

export const PerformanceRoiDashboard: React.FC<PerformanceRoiDashboardProps> = ({
  userPlan = "Pro",
}) => {
  const { user } = useAuth();
  const [history, setHistory] = useState<AuditedTenderHistoryItem[]>([]);
  const [selectedItemToUpdate, setSelectedItemToUpdate] = useState<AuditedTenderHistoryItem | null>(null);
  const [editOutcome, setEditOutcome] = useState<DesfechoLicitacao>("GANHA");
  const [editValorHomologado, setEditValorHomologado] = useState<string>("");
  const [editMotivoPerda, setEditMotivoPerda] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);

  const loadData = async () => {
    // 1. Carrega dados instantâneos de cache
    setHistory(getAuditHistory());

    // 2. Sincroniza dados da nuvem Supabase (Step 5 do Plano)
    if (user?.id) {
      setIsCloudSyncing(true);
      try {
        const { items } = await fetchAuditsFromCloud(user.id);
        setHistory(items);
      } catch (err) {
        console.warn("Falha ao sincronizar métricas de ROI com nuvem:", err);
      } finally {
        setIsCloudSyncing(false);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveOutcome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemToUpdate) return;

    const valorNum = editValorHomologado
      ? parseFloat(editValorHomologado.replace(/[^\d,.-]/g, "").replace(",", "."))
      : undefined;

    const success = await updateTenderOutcome(
      selectedItemToUpdate.id,
      editOutcome,
      valorNum,
      editMotivoPerda,
      user?.id
    );

    if (success) {
      showToast("Desfecho do certame atualizado com sucesso!");
      setSelectedItemToUpdate(null);
      setEditValorHomologado("");
      setEditMotivoPerda("");
      loadData();
    }
  };

  // 1. Métricas de Desfecho Real
  const totalAuditados = history.length;
  const ganhas = history.filter((h) => h.desfecho === "GANHA");
  const perdidas = history.filter((h) => h.desfecho === "PERDIDA");
  const emAndamento = history.filter((h) => !h.desfecho || h.desfecho === "EM_ANDAMENTO");
  const naoDisputadas = history.filter((h) => h.desfecho === "NAO_DISPUTADA");

  const totalValorContratado = ganhas.reduce((acc, curr) => {
    if (curr.valorHomologadoGanha) return acc + curr.valorHomologadoGanha;
    const est = parseFloat((curr.valorEstimado || "").replace(/[^\d]/g, "")) / 100;
    return acc + (isNaN(est) ? 0 : est);
  }, 0);

  // Taxa de Conversão (Win Rate das disputadas)
  const totalDisputadasFechadas = ganhas.length + perdidas.length;
  const winRate = totalDisputadasFechadas > 0 ? Math.round((ganhas.length / totalDisputadasFechadas) * 100) : 0;

  // 2. Segmentos com Maior Sucesso
  const segmentosCount: Record<string, { total: number; ganhas: number; volume: number }> = {};
  history.forEach((h) => {
    const seg = h.segmento || h.payload.detected_vertical || h.payload.vertical || "Obras Públicas e Engenharia";
    if (!segmentosCount[seg]) {
      segmentosCount[seg] = { total: 0, ganhas: 0, volume: 0 };
    }
    segmentosCount[seg].total++;
    if (h.desfecho === "GANHA") {
      segmentosCount[seg].ganhas++;
      segmentosCount[seg].volume += h.valorHomologadoGanha || 0;
    }
  });

  const segmentosSorted = Object.entries(segmentosCount).sort((a, b) => b[1].ganhas - a[1].ganhas);

  // 3. Economia Operacional & Prejuízos Evitados
  const custoHoraEspecialista = 120;
  const horasPoupadas = totalAuditados * 3.5;
  const valorHorasPoupadas = horasPoupadas * custoHoraEspecialista;
  const clausulasMapeadas = history.reduce((acc, curr) => acc + (curr.armadilhasCount || 0), 0);
  const honorariosImpugnacaoPoupados = clausulasMapeadas * 1500;
  const inabilitacoesBarradas = history.filter((h) => h.vereditoGeral === "ELIMINATORIA").length;
  const prejuizoEvitado = inabilitacoesBarradas * 18500;
  const economiaTotalOperacional = valorHorasPoupadas + honorariosImpugnacaoPoupados + prejuizoEvitado;

  const custoPlanoMensal = userPlan === "Enterprise" ? 890 : userPlan === "Starter" ? 97 : 297;
  const roiOperacional = (economiaTotalOperacional / custoPlanoMensal).toFixed(1);

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0E1626] border border-[#2740F0] text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#4A5FFF]" strokeWidth={1.75} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal de Atualização de Desfecho */}
      {selectedItemToUpdate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--line)] w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wide text-[var(--brand)]">
                  Registro de Resultado
                </span>
                <h3 className="text-sm font-bold text-[var(--ink)] font-display mt-0.5">
                  {selectedItemToUpdate.numeroEdital}
                </h3>
                <p className="text-xs text-[var(--ink-2)] line-clamp-1">{selectedItemToUpdate.orgao}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItemToUpdate(null)}
                className="text-[var(--ink-2)] hover:text-[var(--ink)] text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOutcome} className="space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="font-semibold text-[var(--ink)]">Desfecho da Licitação:</label>
                <select
                  value={editOutcome}
                  onChange={(e) => setEditOutcome(e.target.value as DesfechoLicitacao)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] font-mono text-xs focus:outline-none focus:border-[var(--brand)]"
                >
                  <option value="GANHA">Vencida / Contrato Homologado (Ganha)</option>
                  <option value="PERDIDA">Perdida em Disputa de Preço / Recurso</option>
                  <option value="EM_ANDAMENTO">Em Andamento / Sessão Aberta</option>
                  <option value="NAO_DISPUTADA">Não Disputada (Desistência Estratégica / Habilitação Crítica)</option>
                  <option value="REVOGADA_ANULADA">Revogada / Anulada pelo Órgão</option>
                </select>
              </div>

              {editOutcome === "GANHA" && (
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--ink)]">Valor Final Homologado (R$):</label>
                  <input
                    type="text"
                    value={editValorHomologado}
                    onChange={(e) => setEditValorHomologado(e.target.value)}
                    placeholder="Ex: 3.980.000,00"
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] font-mono text-xs focus:outline-none focus:border-[var(--brand)]"
                  />
                  <span className="text-[10px] text-[var(--ink-2)] font-mono">
                    Valor de contrato que entrará no montante de receita conquistada da empresa.
                  </span>
                </div>
              )}

              {editOutcome === "PERDIDA" && (
                <div className="space-y-1.5">
                  <label className="font-semibold text-[var(--ink)]">Motivo da Perda (para análise de gargalo):</label>
                  <input
                    type="text"
                    value={editMotivoPerda}
                    onChange={(e) => setEditMotivoPerda(e.target.value)}
                    placeholder="Ex: Preço de concorrente 2% abaixo da margem"
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] text-xs focus:outline-none focus:border-[var(--brand)]"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setSelectedItemToUpdate(null)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-[var(--ink-2)] hover:bg-[var(--line)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-[var(--brand-solid)] hover:brightness-110 text-white shadow-xs"
                >
                  Salvar Desfecho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header da Aba */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--line)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Cockpit Executivo de Performance de Licitações</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight font-display">
            Desempenho Comercial &amp; ROI do Licitante
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ink-2)] mt-1">
            Monitore contratos ganhos, taxa de conversão por vertical e o retorno financeiro da auditoria preventiva.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isCloudSyncing && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--line)] bg-[var(--surface)] text-[var(--ink-2)] text-xs font-mono">
              <Clock className="w-3.5 h-3.5 animate-spin text-[var(--brand)]" />
              <span>Sincronizando Nuvem...</span>
            </div>
          )}
          <div className="px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-right shadow-xs">
            <span className="text-[10px] font-mono text-[var(--ink-2)] block uppercase">ROI Total do SaaS</span>
            <span className="text-base font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {roiOperacional}x Economizado
            </span>
          </div>
        </div>
      </div>

      {/* CARDS PRINCIPAIS: RESUMO GERAL DE CONQUISTAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Contratos Ganhos */}
        <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--line)] space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--ink-2)] uppercase font-semibold">Contratos Ganhos</span>
            <div className="w-7 h-7 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--ink)]">
            {ganhas.length} certames
          </div>
          <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            R$ {totalValorContratado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} em carteira
          </p>
        </div>

        {/* Win Rate das Disputadas */}
        <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--line)] space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--ink-2)] uppercase font-semibold">Taxa de Conversão (Win Rate)</span>
            <div className="w-7 h-7 rounded-md bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--ink)]">
            {winRate}%
          </div>
          <p className="text-[11px] font-mono text-[var(--ink-2)]">
            {ganhas.length} vitórias / {totalDisputadasFechadas} disputadas fechadas
          </p>
        </div>

        {/* Economia Operacional Real */}
        <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--line)] space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--ink-2)] uppercase font-semibold">Economia Operacional</span>
            <div className="w-7 h-7 rounded-md bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--ink)]">
            R$ {economiaTotalOperacional.toLocaleString("pt-BR")}
          </div>
          <p className="text-[11px] font-mono text-[var(--ink-2)]">
            {horasPoupadas}h de equipe + {clausulasMapeadas} minutas Art. 164
          </p>
        </div>

        {/* Inabilitações Evitadas */}
        <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--line)] space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[var(--ink-2)] uppercase font-semibold">Inabilitações Barradas</span>
            <div className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[var(--ink)]">
            {inabilitacoesBarradas} certames
          </div>
          <p className="text-[11px] font-mono text-[var(--ok-fg)]">
            Zero surpresas na sessão pública
          </p>
        </div>
      </div>

      {/* GRID DUPLO: DESEMPENHO POR SEGMENTO & GARGALOS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Principais Segmentos Ganhos (7 colunas) */}
        <div className="lg:col-span-7 bg-[var(--surface)] p-5 sm:p-6 rounded-xl border border-[var(--line)] space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
            <div>
              <h3 className="text-sm font-bold text-[var(--ink)] font-display flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[var(--brand)]" />
                <span>Segmentos com Maior Volume de Conquistas</span>
              </h3>
              <p className="text-xs text-[var(--ink-2)] mt-0.5">
                Distribuição de vitórias e taxa de êxito por vertical de contratação.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {segmentosSorted.map(([seg, data], idx) => {
              const percVit = data.total > 0 ? Math.round((data.ganhas / data.total) * 100) : 0;
              return (
                <div key={idx} className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--ink)] font-display">{seg}</span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {data.ganhas} ganha(s) • R$ {data.volume.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[var(--line)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${Math.max(percVit, 5)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[var(--ink-2)]">
                    <span>{data.total} certames auditados</span>
                    <span>Taxa de Vitória: <strong>{percVit}%</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coluna Direita: Status Atual do Pipeline (5 colunas) */}
        <div className="lg:col-span-5 bg-[var(--surface)] p-5 sm:p-6 rounded-xl border border-[var(--line)] space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
            <div>
              <h3 className="text-sm font-bold text-[var(--ink)] font-display flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--brand)]" />
                <span>Status do Pipeline de Certames</span>
              </h3>
              <p className="text-xs text-[var(--ink-2)] mt-0.5">
                Situação consolidada de todas as disputas cadastradas.
              </p>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] flex items-center justify-between">
              <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Contratos Ganhos
              </span>
              <span className="font-bold text-[var(--ink)]">{ganhas.length}</span>
            </div>

            <div className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] flex items-center justify-between">
              <span className="flex items-center gap-2 text-blue-500 font-bold">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Em Andamento / Sessão Aberta
              </span>
              <span className="font-bold text-[var(--ink)]">{emAndamento.length}</span>
            </div>

            <div className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] flex items-center justify-between">
              <span className="flex items-center gap-2 text-rose-500 font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Perdidas em Disputa de Preço
              </span>
              <span className="font-bold text-[var(--ink)]">{perdidas.length}</span>
            </div>

            <div className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] flex items-center justify-between">
              <span className="flex items-center gap-2 text-amber-500 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Não Disputadas (Inabilitação Preventiva)
              </span>
              <span className="font-bold text-[var(--ink)]">{naoDisputadas.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABELA DE DECLARAÇÃO DE RESULTADOS POR CERTAME */}
      <div className="bg-[var(--surface)] p-5 sm:p-6 rounded-xl border border-[var(--line)] space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
          <div>
            <h3 className="text-sm font-bold text-[var(--ink)] font-display flex items-center gap-2">
              <Award className="w-4 h-4 text-[var(--brand)]" />
              <span>Declarar Desfecho de Licitações Auditadas</span>
            </h3>
            <p className="text-xs text-[var(--ink-2)] mt-0.5">
              Clique em &quot;Atualizar Desfecho&quot; para alimentar os gráficos de receita contratada e win rate.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-[var(--line)] rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[var(--bg)] border-b border-[var(--line)] text-[10px] font-mono uppercase tracking-wider text-[var(--ink-2)]">
                <th className="py-2.5 px-3.5 font-bold">Certame &amp; Órgão</th>
                <th className="py-2.5 px-3.5 font-bold">Valor Estimado</th>
                <th className="py-2.5 px-3.5 font-bold">Veredito Art. 62</th>
                <th className="py-2.5 px-3.5 font-bold">Desfecho Atual</th>
                <th className="py-2.5 px-3.5 font-bold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--bg)]/60 transition-colors">
                  <td className="py-3 px-3.5 align-middle max-w-sm">
                    <div className="font-bold text-[var(--ink)] font-display">{item.numeroEdital}</div>
                    <div className="text-[11px] text-[var(--ink-2)] line-clamp-1">{item.orgao}</div>
                  </td>
                  <td className="py-3 px-3.5 align-middle font-mono font-semibold text-[var(--ink)] whitespace-nowrap">
                    {item.valorEstimado}
                  </td>
                  <td className="py-3 px-3.5 align-middle whitespace-nowrap">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        item.vereditoGeral === "PASSA"
                          ? "bg-[var(--ok-bg)] text-[var(--ok-fg)] border-[var(--ok)]/30"
                          : item.vereditoGeral === "RESSALVA"
                          ? "bg-[var(--warn-bg)] text-[var(--warn-fg)] border-[var(--warn)]/30"
                          : "bg-[var(--bad-bg)] text-[var(--bad-fg)] border-[var(--bad)]/30"
                      }`}
                    >
                      {item.vereditoGeral}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 align-middle whitespace-nowrap">
                    {item.desfecho === "GANHA" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        <Trophy className="w-3 h-3" />
                        <span>GANHA (R$ {(item.valorHomologadoGanha || 0).toLocaleString("pt-BR")})</span>
                      </span>
                    ) : item.desfecho === "PERDIDA" ? (
                      <span className="text-[11px] font-mono font-semibold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                        PERDIDA {item.motivoPerda ? `(${item.motivoPerda})` : ""}
                      </span>
                    ) : item.desfecho === "NAO_DISPUTADA" ? (
                      <span className="text-[11px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        NÃO DISPUTADA (PREVENIDA)
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                        EM ANDAMENTO
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3.5 align-middle text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedItemToUpdate(item);
                        setEditOutcome(item.desfecho || "GANHA");
                        setEditValorHomologado(
                          item.valorHomologadoGanha ? item.valorHomologadoGanha.toString() : ""
                        );
                        setEditMotivoPerda(item.motivoPerda || "");
                      }}
                      className="px-2.5 py-1.5 rounded text-xs font-semibold bg-[var(--surface)] hover:bg-[var(--line)] text-[var(--ink)] border border-[var(--line)] transition-all active:scale-95 shadow-xs"
                    >
                      Atualizar Desfecho
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
