"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Building2,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Eye,
  RefreshCw,
  FileSpreadsheet,
  PenLine,
  X,
  Copy,
  Check,
  Scale,
} from "lucide-react";
import { AuditedTenderHistoryItem, EditalAnalysisResponse, Armadilha } from "@/lib/types";
import { getAuditHistory, fetchAuditsFromCloud } from "@/lib/audit-history";
import { useAuth } from "@/lib/auth-context";
import { VerdictBadge } from "./VerdictBadge";
import { calculateRemainingBusinessDays } from "@/lib/business-days";
import { generateImpugnation } from "@/lib/legal-drafts";

interface AuditHistoryTableProps {
  onSelectAudit?: (analysis: EditalAnalysisResponse, fileName?: string) => void;
  companyName?: string;
  companyCnpj?: string;
  userGestorName?: string;
}

export const AuditHistoryTable: React.FC<AuditHistoryTableProps> = ({
  onSelectAudit,
  companyName = "51.926.034 RENAN OSCAR ARAUJO CRUZ",
  companyCnpj = "51.926.034/0001-42",
  userGestorName = "Gestor de Licitações",
}) => {
  const { user } = useAuth();
  const [history, setHistory] = useState<AuditedTenderHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PASSA" | "RESSALVA" | "ELIMINATORIA">("ALL");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoadingCloud, setIsLoadingCloud] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<"cloud" | "cache">("cache");

  // Estados para modal de Minuta Rápida Art. 164 direto do histórico
  const [activeMinutaItem, setActiveMinutaItem] = useState<{
    edital: string;
    armadilha: Armadilha;
    draft: string;
  } | null>(null);
  const [copiedMinuta, setCopiedMinuta] = useState(false);

  // Carregamento com prioridade Supabase Cloud + fallback instantâneo de cache local
  useEffect(() => {
    // 1. Imediato: carrega cache do localStorage para evitar tela em branco
    const cached = getAuditHistory();
    setHistory(cached);

    // 2. Consulta assíncrona ao Supabase com filtros aplicados no servidor
    const loadFromCloud = async () => {
      setIsLoadingCloud(true);
      try {
        const { items, source } = await fetchAuditsFromCloud(user?.id, {
          verdict: statusFilter,
          searchTerm: searchTerm,
        });
        setHistory(items);
        setDataSource(source);
      } catch (e) {
        console.warn("Erro ao buscar auditorias da nuvem:", e);
      } finally {
        setIsLoadingCloud(false);
      }
    };

    loadFromCloud();
  }, [user?.id, statusFilter, searchTerm]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownloadPDF = async (item: AuditedTenderHistoryItem) => {
    try {
      setDownloadingId(item.id);
      showToast("Compilando Parecer Executivo em PDF nativo...");

      const res = await fetch("/api/pdf/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "parecer",
          data: item.payload,
          companyName,
          companyCnpj,
        }),
      });

      if (!res.ok) throw new Error("Erro na geração do PDF.");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Parecer_${item.numeroEdital.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast("PDF baixado com sucesso.");
    } catch (err: any) {
      showToast("Falha ao exportar PDF: " + (err?.message || "Erro"));
    } finally {
      setDownloadingId(null);
    }
  };

  // SUGESTÃO #1: Exportação do Histórico em Planilha (CSV)
  const handleExportCSV = () => {
    if (history.length === 0) {
      showToast("Nenhum registro para exportar.");
      return;
    }

    const headers = [
      "ID",
      "Data Auditoria",
      "Numero Edital",
      "Orgao Convocante",
      "Valor Estimado",
      "Veredito Geral",
      "Conformes (Passa)",
      "Corrigiveis (Ressalva)",
      "Criticos (Eliminatoria)",
      "Clausulas Restritivas",
      "Objeto",
    ];

    const rows = history.map((item) => {
      const escape = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;
      return [
        escape(item.id),
        escape(new Date(item.dataAuditoria).toLocaleString("pt-BR")),
        escape(item.numeroEdital),
        escape(item.orgao),
        escape(item.valorEstimado),
        escape(item.vereditoGeral),
        escape(item.passaCount),
        escape(item.ressalvaCount),
        escape(item.eliminatoriaCount),
        escape(item.armadilhasCount),
        escape(item.objeto.replace(/[\n\r]/g, " ")),
      ].join(";");
    });

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Relatorio_Auditorias_Editais_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("Relatório de auditorias exportado em CSV.");
  };

  // SUGESTÃO #4: Abertura rápida da minuta de impugnação
  const handleOpenQuickMinuta = (item: AuditedTenderHistoryItem) => {
    const armadilhas = item.payload.armadilhas || [];
    if (armadilhas.length === 0) {
      showToast("Nenhuma cláusula restritiva identificada para este edital.");
      return;
    }
    const principalArmadilha = armadilhas[0];
    const draft = generateImpugnation(
      principalArmadilha.texto_original,
      principalArmadilha.descricao,
      companyName,
      companyCnpj,
      userGestorName
    );
    setActiveMinutaItem({
      edital: item.numeroEdital,
      armadilha: principalArmadilha,
      draft,
    });
  };

  const filtered = history.filter((item) => {
    if (statusFilter !== "ALL" && item.vereditoGeral !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.numeroEdital.toLowerCase().includes(q) ||
        item.orgao.toLowerCase().includes(q) ||
        item.objeto.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const passaTotal = history.filter((h) => h.vereditoGeral === "PASSA").length;
  const ressalvaTotal = history.filter((h) => h.vereditoGeral === "RESSALVA").length;
  const eliminatoriaTotal = history.filter((h) => h.vereditoGeral === "ELIMINATORIA").length;

  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-5 sm:p-6 space-y-5 shadow-sm">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0E1626] border border-[#2740F0] text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#4A5FFF]" strokeWidth={1.75} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal de Minuta Rápida Art. 164 */}
      {activeMinutaItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b101d] border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-[#253745]">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
                  <Scale className="w-3.5 h-3.5 text-blue-400" />
                  <span>Art. 164 da Lei 14.133/2021 • Minuta Administrativa</span>
                </div>
                <h3 className="text-base font-bold text-white font-display">
                  {activeMinutaItem.edital} — {activeMinutaItem.armadilha.titulo}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveMinutaItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-[#06141B] border border-[#253745] text-slate-300 font-mono text-xs leading-relaxed whitespace-pre-wrap select-all">
              {activeMinutaItem.draft}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#253745] flex-wrap gap-2">
              <span className="text-[11px] text-slate-500 font-mono">
                Petição fundamentada em acórdãos do TCU e dispositivos da Lei 14.133/21
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMinutaItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(activeMinutaItem.draft);
                    setCopiedMinuta(true);
                    setTimeout(() => setCopiedMinuta(false), 2000);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#11212D] hover:bg-[#253745] shadow-md shadow-blue-600/30 transition-all active:scale-98"
                >
                  {copiedMinuta ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copiado com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Petição Completa</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header do Histórico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-[11px] font-mono font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Rastreabilidade & Registro de Decisão Pré-Edital</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[var(--ink)] font-display">
            Histórico de Editais Auditados
          </h2>
          <p className="text-xs text-[var(--ink-2)]">
            Acesse pareceres anteriores, relatórios executivos em PDF e cláusulas restritivas sem consumir novos créditos.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-[var(--line)] bg-[var(--bg)] text-[11px] text-[var(--ink-2)]">
            <span className={`w-2 h-2 rounded-full ${dataSource === "cloud" ? "bg-[var(--pass-fg)]" : "bg-[var(--warn-fg)]"}`} />
            <span>{dataSource === "cloud" ? "Nuvem Sincronizada" : "Modo Cache / Offline"}</span>
            {isLoadingCloud && <RefreshCw className="w-3 h-3 animate-spin text-[var(--brand)] ml-1" />}
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--surface)] hover:bg-[var(--line)] text-[var(--ink)] border border-[var(--line)] transition-all active:scale-98 shadow-xs"
            title="Exportar dados para Excel/Planilha"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[var(--brand)]" />
            <span>Exportar CSV</span>
          </button>

          <span className="px-2.5 py-1 rounded bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] font-semibold">
            {history.length} Auditorias
          </span>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filtros de Veredito */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setStatusFilter("ALL")}
            className={`min-h-[36px] px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all border ${
              statusFilter === "ALL"
                ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                : "bg-[var(--surface)] text-[var(--ink-2)] border-[var(--line)] hover:border-[var(--ink)]"
            }`}
          >
            Todos ({history.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("PASSA")}
            className={`min-h-[36px] px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all border flex items-center gap-1.5 ${
              statusFilter === "PASSA"
                ? "bg-[var(--ok-bg)] text-[var(--ok-fg)] border-[var(--ok)] font-bold"
                : "bg-[var(--surface)] text-[var(--ok-fg)] border-[var(--ok)]/40 hover:bg-[var(--ok-bg)]/40"
            }`}
          >
            <span>Passa ({passaTotal})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("RESSALVA")}
            className={`min-h-[36px] px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all border flex items-center gap-1.5 ${
              statusFilter === "RESSALVA"
                ? "bg-[var(--warn-bg)] text-[var(--warn-fg)] border-[var(--warn)] font-bold"
                : "bg-[var(--surface)] text-[var(--warn-fg)] border-[var(--warn)]/40 hover:bg-[var(--warn-bg)]/40"
            }`}
          >
            <span>Ressalva ({ressalvaTotal})</span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("ELIMINATORIA")}
            className={`min-h-[36px] px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-all border flex items-center gap-1.5 ${
              statusFilter === "ELIMINATORIA"
                ? "bg-[var(--bad-bg)] text-[var(--bad-fg)] border-[var(--bad)] font-bold"
                : "bg-[var(--surface)] text-[var(--bad-fg)] border-[var(--bad)]/40 hover:bg-[var(--bad-bg)]/40"
            }`}
          >
            <span>Eliminatória ({eliminatoriaTotal})</span>
          </button>
        </div>

        {/* Input de Busca */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[var(--ink-2)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por edital, órgão ou termo..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] placeholder-[var(--ink-2)] focus:outline-none focus:border-[var(--brand)] font-sans"
          />
        </div>
      </div>

      {/* Tabela de Histórico (Visível no Desktop md:block) */}
      <div className="hidden md:block overflow-x-auto border border-[var(--line)] rounded-lg">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[var(--bg)] border-b border-[var(--line)] text-[10px] font-mono uppercase tracking-wider text-[var(--ink-2)]">
              <th className="py-4 px-4 font-bold">Data / Hora</th>
              <th className="py-4 px-4 font-bold">Certame &amp; Órgão</th>
              <th className="py-4 px-4 font-bold">Valor Estimado</th>
              <th className="py-4 px-4 font-bold">Veredito Art. 62</th>
              <th className="py-4 px-4 font-bold">Cláusulas / Prazos</th>
              <th className="py-4 px-4 font-bold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-[var(--ink-2)] font-mono">
                  Nenhuma auditoria encontrada com os filtros selecionados.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const dateObj = new Date(item.dataAuditoria);
                const dateStr = dateObj.toLocaleDateString("pt-BR");
                const timeStr = dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

                const prazoImpugnacaoStr = item.payload.dados_gerais?.prazo_impugnacao;
                const businessDaysCalc = prazoImpugnacaoStr
                  ? calculateRemainingBusinessDays(prazoImpugnacaoStr)
                  : null;

                const plData = item.payload.calculo_patrimonio_liquido;
                let plFolgaLabel: string | null = null;
                let plFolgaPositive = false;
                if (plData && plData.plMinimoExigido > 0 && plData.plEmpresaCadastrado > 0) {
                  const diffPercent = Math.round(
                    ((plData.plEmpresaCadastrado - plData.plMinimoExigido) / plData.plMinimoExigido) * 100
                  );
                  if (diffPercent >= 0) {
                    plFolgaLabel = `PL: +${diffPercent}% folga`;
                    plFolgaPositive = true;
                  } else {
                    plFolgaLabel = `PL: ${diffPercent}% abaixo`;
                    plFolgaPositive = false;
                  }
                }

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[var(--bg)]/60 transition-colors group"
                  >
                    {/* Data / Hora */}
                    <td className="py-4 px-4 align-top whitespace-nowrap font-mono text-[11px] text-[var(--ink-2)]">
                      <div className="text-[var(--ink)] font-semibold">{dateStr}</div>
                      <div>{timeStr}</div>
                    </td>

                    {/* Certame & Órgão */}
                    <td className="py-4 px-4 align-top max-w-xs sm:max-w-sm">
                      <div className="font-bold text-[var(--ink)] font-display text-xs group-hover:text-[var(--brand)] transition-colors">
                        {item.numeroEdital}
                      </div>
                      <div className="text-[11px] text-[var(--ink-2)] line-clamp-1 mt-0.5">
                        {item.orgao}
                      </div>
                      <div className="text-[10px] text-[var(--ink-2)] font-mono line-clamp-1 mt-0.5 italic">
                        {item.objeto}
                      </div>
                    </td>

                    {/* Valor Estimado + Margem de Folga de PL */}
                    <td className="py-4 px-4 align-top whitespace-nowrap font-mono text-xs font-semibold text-[var(--ink)]">
                      <div>{item.valorEstimado}</div>
                      {plFolgaLabel && (
                        <div
                          className={`text-[9.5px] font-mono font-bold mt-1 inline-block px-1.5 py-0.2 rounded border ${
                            plFolgaPositive
                              ? "bg-[var(--ok-bg)] text-[var(--ok-fg)] border-[var(--ok)]/30"
                              : "bg-[var(--bad-bg)] text-[var(--bad-fg)] border-[var(--bad)]/30"
                          }`}
                        >
                          {plFolgaLabel}
                        </div>
                      )}
                    </td>

                    {/* Veredito */}
                    <td className="py-4 px-4 align-top whitespace-nowrap">
                      <VerdictBadge status={item.vereditoGeral} size="sm" />
                      <div className="text-[10px] font-mono text-[var(--ink-2)] mt-1">
                        {item.passaCount}P • {item.ressalvaCount}R • {item.eliminatoriaCount}E
                      </div>
                    </td>

                    {/* Cláusulas / Prazos de Impugnação */}
                    <td className="py-4 px-4 align-top whitespace-nowrap font-mono text-[11px]">
                      {item.armadilhasCount > 0 ? (
                        <div className="space-y-1">
                          <span className="text-[var(--bad-fg)] font-semibold bg-[var(--bad-bg)] px-2 py-0.5 rounded border border-[var(--bad)]/30 inline-block">
                            {item.armadilhasCount} Restritiva(s)
                          </span>

                          {businessDaysCalc && (
                            <div className="text-[10px] flex items-center gap-1 font-semibold">
                              {businessDaysCalc.isUrgent ? (
                                <span className="text-[var(--warn-fg)] bg-[var(--warn-bg)] px-1.5 py-0.5 rounded border border-[var(--warn)]/40 flex items-center gap-1 animate-pulse">
                                  <Clock className="w-3 h-3 text-[var(--warn)]" />
                                  <span>Impugnação: {businessDaysCalc.days}d úteis</span>
                                </span>
                              ) : businessDaysCalc.isExpired ? (
                                <span className="text-slate-500 line-through">
                                  Impugnação encerrada
                                </span>
                              ) : (
                                <span className="text-[var(--ink-2)]">
                                  Prazo Art. 164: {businessDaysCalc.days}d úteis
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[var(--ink-2)]">Nenhuma restrição</span>
                      )}
                    </td>

                    {/* Ações */}
                    <td className="py-4 px-4 align-top whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.armadilhasCount > 0 && (
                          <button
                            type="button"
                            onClick={() => handleOpenQuickMinuta(item)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded text-xs font-semibold bg-[var(--warn-bg)] hover:bg-[var(--warn-bg)]/80 text-[var(--warn-fg)] border border-[var(--warn)]/40 transition-all active:scale-95"
                            title="Gerar Minuta de Impugnação Art. 164 com 1 Clique"
                          >
                            <PenLine className="w-3 h-3" />
                            <span>Minuta</span>
                          </button>
                        )}

                        {onSelectAudit && (
                          <button
                            type="button"
                            onClick={() => onSelectAudit(item.payload, item.fileName)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-semibold bg-[var(--surface)] hover:bg-[var(--line)] text-[var(--ink)] border border-[var(--line)] transition-all active:scale-95"
                            title="Abrir Parecer Completo"
                          >
                            <Eye className="w-3.5 h-3.5 text-[var(--brand)]" />
                            <span>Abrir</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDownloadPDF(item)}
                          disabled={downloadingId === item.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-semibold bg-[var(--surface)] hover:bg-[var(--line)] text-[var(--ink)] border border-[var(--line)] transition-all active:scale-95 disabled:opacity-50"
                          title="Baixar Parecer Executivo em PDF Nativo"
                        >
                          <Download className="w-3.5 h-3.5 text-[var(--brand)]" />
                          <span>{downloadingId === item.id ? "PDF..." : "PDF"}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Visualização Mobile em Cards Empilhados (Visível exclusivamente em md:hidden) */}
      <div className="block md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-xs text-[var(--ink-2)] font-mono border border-[var(--line)] rounded-lg bg-[var(--surface)]">
            Nenhuma auditoria encontrada com os filtros selecionados.
          </div>
        ) : (
          filtered.map((item) => {
            const dateObj = new Date(item.dataAuditoria);
            const dateStr = dateObj.toLocaleDateString("pt-BR");
            const prazoImpugnacaoStr = item.payload.dados_gerais?.prazo_impugnacao;
            const businessDaysCalc = prazoImpugnacaoStr
              ? calculateRemainingBusinessDays(prazoImpugnacaoStr)
              : null;

            return (
              <div
                key={`mobile-${item.id}`}
                className="p-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[var(--ink-2)]">
                      {dateStr} • {item.orgao}
                    </span>
                    <h3 className="text-sm font-bold font-display text-[var(--ink)]">
                      {item.numeroEdital}
                    </h3>
                  </div>
                  <VerdictBadge status={item.vereditoGeral} size="sm" />
                </div>

                <p className="text-xs text-[var(--ink-2)] line-clamp-2 italic font-sans">
                  {item.objeto}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-[var(--line)]">
                  <div>
                    <span className="text-[10px] text-[var(--ink-2)] block uppercase">Valor Estimado</span>
                    <span className="font-bold text-[var(--ink)]">{item.valorEstimado}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--ink-2)] block uppercase">Cláusulas Restritivas</span>
                    {item.armadilhasCount > 0 ? (
                      <span className="text-[var(--bad-fg)] font-bold">{item.armadilhasCount} restrição(ões)</span>
                    ) : (
                      <span className="text-[var(--ok-fg)] font-bold">0 apontamentos</span>
                    )}
                  </div>
                </div>

                {businessDaysCalc && businessDaysCalc.isUrgent && (
                  <div className="text-[11px] font-mono font-semibold bg-[var(--warn-bg)] text-[var(--warn-fg)] p-2 rounded border border-[var(--warn)]/30 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Impugnação: {businessDaysCalc.days} dias úteis restantes</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2 border-t border-[var(--line)]">
                  {item.armadilhasCount > 0 && (
                    <button
                      type="button"
                      onClick={() => handleOpenQuickMinuta(item)}
                      className="flex-1 py-2 rounded text-xs font-semibold bg-[var(--warn-bg)] text-[var(--warn-fg)] border border-[var(--warn)]/40 flex items-center justify-center gap-1"
                    >
                      <PenLine className="w-3 h-3" />
                      <span>Minuta Art. 164</span>
                    </button>
                  )}
                  {onSelectAudit && (
                    <button
                      type="button"
                      onClick={() => onSelectAudit(item.payload, item.fileName)}
                      className="flex-1 py-2 rounded text-xs font-semibold bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-[var(--brand)]" />
                      <span>Ver Parecer</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDownloadPDF(item)}
                    disabled={downloadingId === item.id}
                    className="py-2 px-3 rounded text-xs font-semibold bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5 text-[var(--brand)]" />
                    <span>{downloadingId === item.id ? "..." : "PDF"}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
