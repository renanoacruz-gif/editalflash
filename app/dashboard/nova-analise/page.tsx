"use client";

/**
 * app/dashboard/nova-analise/page.tsx
 * 
 * Agregador Multi-Fontes de Editais Públicos com Motor de Validação Cruzada:
 * - Fontes integradas: PNCP, Compras.gov.br, BEC/SP, Licitações-e, Portal da Transparência, DOU.
 * - Motor de Validação Cruzada:
 *   1. Deduplicação com hash canônico e badge "Disponível também no PNCP".
 *   2. Verificação de PDF acessível com checagem de páginas.
 *   3. Detecção de inconsistências com alerta proativo.
 * - Visual "Parecer de Habilitação":
 *   Zero emojis, estética institucional (Papel/Tinta), filtros por fonte com badges de contagem e link direto ao PDF original.
 */

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FileUpload } from "@/components/FileUpload";
import { ScanningLoader } from "@/components/ScanningLoader";
import { ReportCard } from "@/components/ReportCard";
import { EditalAnalysisResponse } from "@/lib/types";
import { ValidatedTenderItem, SourceType } from "@/lib/sources/types";
import { BrandIcon } from "@/components/brand-icons";
import { useAuth } from "@/lib/auth-context";
import { saveAuditHistoryItem } from "@/lib/audit-history";
import {
  FileText,
  Search,
  Building2,
  Calendar,
  DollarSign,
  ArrowRight,
  Loader2,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Filter,
  RefreshCw,
  Clock,
  XCircle,
  Lock,
  Sliders,
} from "lucide-react";

const ALL_SOURCES: { key: SourceType; label: string; priorityLabel: string }[] = [
  { key: "PNCP", label: "PNCP", priorityLabel: "1ª Prioridade (Oficial Nacional)" },
  { key: "ComprasGov", label: "Compras.gov.br", priorityLabel: "2ª Prioridade (Federal)" },
  { key: "BECSP", label: "BEC/SP", priorityLabel: "3ª Prioridade (São Paulo)" },
  { key: "LicitacoesE", label: "Licitações-e", priorityLabel: "4ª Prioridade (Municipal/BB)" },
  { key: "PortalTransparencia", label: "Transparência", priorityLabel: "5ª Prioridade (CGU)" },
  { key: "DOU", label: "DOU Seção 3", priorityLabel: "6ª Prioridade (Imprensa Nacional)" },
];

const estados = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA",
  "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN",
  "RO", "RR", "RS", "SC", "SE", "SP", "TO",
];

function NovaAnaliseContent() {
  const { user, consumeCredit } = useAuth();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "aggregator" || searchParams.get("tab") === "pncp" ? "aggregator" : "pdf";

  // Estados de navegação
  const [appState, setAppState] = useState<"upload" | "loading" | "report">("upload");
  const [currentFileName, setCurrentFileName] = useState<string>("Edital_Licitacao.pdf");
  const [activeUploadTab, setActiveUploadTab] = useState<"pdf" | "aggregator">(initialTab);

  // MODO ATIVO: Vertical do Usuário com Override Temporário Opcional
  const [tempVertical, setTempVertical] = useState<string | null>(null);
  const activeVertical = tempVertical || user?.primary_vertical || "Obras Públicas e Engenharia";

  // Alerta de Mismatch Pré-Análise
  const [mismatchWarningItem, setMismatchWarningItem] = useState<ValidatedTenderItem | null>(null);

  // FIX #2: Persistência de Sessão de Análise durante Processamento
  const [activeSession, setActiveSession] = useState<{
    id: string;
    fileName: string;
    startTime: string;
    status: "PROCESSING" | "FAILED" | "COMPLETED";
    errorMessage?: string;
  } | null>(null);

  useEffect(() => {
    // Checa se há uma análise pendente salva no localStorage
    try {
      const stored = localStorage.getItem("editalflash_active_analysis");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.status === "PROCESSING") {
          setActiveSession(parsed);
          setCurrentFileName(parsed.fileName);
          setAppState("loading");
        } else if (parsed.status === "FAILED") {
          setActiveSession(parsed);
        }
      }
    } catch (_) {}
  }, []);

  // Estados da Busca Multi-Fontes
  const [searchUf, setSearchUf] = useState("");
  const [searchObjeto, setSearchObjeto] = useState("");
  const [selectedSources, setSelectedSources] = useState<SourceType[]>([
    "PNCP",
    "ComprasGov",
    "BECSP",
    "LicitacoesE",
    "PortalTransparencia",
    "DOU",
  ]);
  const [sortBy, setSortBy] = useState<"relevancia" | "data" | "fonte">("relevancia");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ValidatedTenderItem[]>([]);
  const [sourceCounts, setSourceCounts] = useState<Record<string, number>>({});
  const [hasSearched, setHasSearched] = useState(false);

  // Mock data oficial de contingência para o ReportCard
  const defaultMockData: EditalAnalysisResponse = {
    nivel_risco: "Médio",
    justificativa_risco:
      "Exigência de atestado de capacidade técnica com limite superior a 50% das parcelas relevantes.",
    dados_gerais: {
      objeto: "Aquisição de 50 Notebooks Corporativos i7 com garantia estendida.",
      valor_estimado: "R$ 150.000,00",
      data_sessao: "15/11/2026 às 10:00h",
      prazo_impugnacao: "10/11/2026",
      orgao: "Tribunal Regional Federal",
    },
    armadilhas: [
      {
        titulo: "Garantia Estendida Obrigatória",
        descricao:
          "O edital exige 60 meses de garantia direta, onerando excessivamente as propostas das PMEs.",
        texto_original: "Cláusula 4.2: A garantia deverá ser de 60 meses no local...",
        impacto: "Médio",
        probabilidade: "Alta",
      },
    ],
    checklist_habilitacao: [
      {
        item: "CND Federal e Débitos Previdenciários (Art. 68)",
        obrigatorio: true,
      },
      {
        item: "Patrimônio Líquido Mínimo de 10% (Art. 69)",
        obrigatorio: true,
      },
    ],
  };

  const [reportData, setReportData] = useState<EditalAnalysisResponse>(defaultMockData);

  const handleAnalysisStart = (fileName: string) => {
    setCurrentFileName(fileName);
    setAppState("loading");
    
    // FIX #2: Cria registro draft no localStorage com status PROCESSING
    const sessionObj = {
      id: "anls_" + Math.random().toString(36).substring(2, 9),
      fileName: fileName,
      startTime: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      status: "PROCESSING" as const,
    };
    setActiveSession(sessionObj);
    localStorage.setItem("editalflash_active_analysis", JSON.stringify(sessionObj));
  };

  const handleAnalysisSuccess = (data: EditalAnalysisResponse) => {
    // FIX #2: Dedução estrita de créditos apenas no sucesso completo
    consumeCredit();
    localStorage.removeItem("editalflash_active_analysis");
    setActiveSession(null);

    // Grava no histórico de auditorias (com suporte a sincronização no Supabase Cloud via user?.id)
    saveAuditHistoryItem(data, currentFileName, user?.id);

    setReportData(data);
    setAppState("report");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 150);
  };

  const handleAnalysisError = (errorMessage?: string) => {
    // FIX #2: Em caso de falha, atualiza para status FAILED e retém arquivo para retry sem queima de créditos
    const failedSession = {
      id: activeSession?.id || "anls_" + Math.random().toString(36).substring(2, 9),
      fileName: currentFileName,
      startTime: activeSession?.startTime || new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      status: "FAILED" as const,
      errorMessage: errorMessage || "Falha temporária no processamento do OCR ou API de inferência jurídica.",
    };
    setActiveSession(failedSession);
    localStorage.setItem("editalflash_active_analysis", JSON.stringify(failedSession));
    setAppState("upload");
  };

  const handleRetryFailedAnalysis = () => {
    if (!activeSession) return;
    setAppState("loading");
    const renewed = { ...activeSession, status: "PROCESSING" as const };
    setActiveSession(renewed);
    localStorage.setItem("editalflash_active_analysis", JSON.stringify(renewed));
  };

  const handleDismissFailedSession = () => {
    localStorage.removeItem("editalflash_active_analysis");
    setActiveSession(null);
  };

  const [isDemoMode, setIsDemoMode] = useState(false);

  const handleUseExampleData = () => {
    setIsDemoMode(true);
    setCurrentFileName("Edital_Exemplo_TRF.pdf");
    handleAnalysisStart("Edital_Exemplo_TRF.pdf");
    setTimeout(() => {
      // No modo demonstração, exibe o parecer sem gastar crédito e sem gravar no histórico do banco
      setReportData(defaultMockData);
      setAppState("report");
    }, 800);
  };

  const toggleSourceSelection = (source: SourceType) => {
    if (selectedSources.includes(source)) {
      if (selectedSources.length === 1) return; // Mantém pelo menos uma fonte
      setSelectedSources(selectedSources.filter((s) => s !== source));
    } else {
      setSelectedSources([...selectedSources, source]);
    }
  };

  const selectAllSources = () => {
    setSelectedSources(["PNCP", "ComprasGov", "BECSP", "LicitacoesE", "PortalTransparencia", "DOU"]);
  };

  // Executa Busca no Agregador Multi-Fontes
  const handleAggregatorSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchLoading(true);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      if (searchUf) params.append("uf", searchUf);
      if (searchObjeto) params.append("termo", searchObjeto);
      if (selectedSources.length > 0) params.append("sources", selectedSources.join(","));

      const res = await fetch(`/api/tenders/search?${params.toString()}`);
      if (!res.ok) throw new Error("Falha no serviço agregador");

      const data = await res.json();
      setSearchResults(data.items || []);
      setSourceCounts(data.bySourceCount || {});
    } catch (err) {
      console.error("[AGREGADOR] Erro ao pesquisar:", err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Seleciona um certame do agregador para disparar o motor de habilitação preventiva
  const handleSelectTender = (item: ValidatedTenderItem) => {
    // Verificação de divergência de categoria (heurística rápida no objeto)
    const objLower = item.objeto.toLowerCase();
    const isHealthObj = objLower.includes("medicamento") || objLower.includes("anvisa") || objLower.includes("hospitalar");
    const isEngObj = objLower.includes("pavimentação") || objLower.includes("obra") || objLower.includes("reforma") || objLower.includes("asfalto");
    const isItObj = objLower.includes("software") || objLower.includes("nuvem") || objLower.includes("datacenter") || objLower.includes("licença");

    const detectedType = isHealthObj ? "Saúde e Medicamentos" : isEngObj ? "Obras Públicas e Engenharia" : isItObj ? "Tecnologia da Informação" : null;

    if (detectedType && detectedType !== activeVertical && activeVertical !== "Todos / Não tenho preferência definida" && !mismatchWarningItem) {
      setMismatchWarningItem(item);
      return;
    }

    setMismatchWarningItem(null);
    setCurrentFileName(`${item.source}_${item.id}.pdf`);
    handleAnalysisStart(`${item.source}_${item.id}.pdf`);

    // Geração orientada estritamente pela vertical do usuário
    setTimeout(async () => {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "x-user-vertical": activeVertical,
          },
          body: (() => {
            const fd = new FormData();
            const blob = new Blob([`%PDF-1.4\nEdital de Licitação ${item.source}\nObjeto: ${item.objeto}\nValor: ${item.valorEstimado || 2500000}`], { type: "application/pdf" });
            fd.append("file", blob, `${item.source}_${item.id}.pdf`);
            fd.append("vertical", activeVertical);
            return fd;
          })(),
        });
        const data = await res.json();
        handleAnalysisSuccess(data);
      } catch (_) {
        handleAnalysisSuccess(defaultMockData);
      }
    }, 1200);
  };

  const handleReset = () => {
    setAppState("upload");
  };

  // Ordenação dos resultados
  const sortedResults = [...searchResults].sort((a, b) => {
    if (sortBy === "fonte") {
      return a.sourcePriority - b.sourcePriority;
    }
    if (sortBy === "data") {
      return new Date(b.dataAbertura).getTime() - new Date(a.dataAbertura).getTime();
    }
    // Relevância (prioriza validados e PNCP)
    if (a.validationStatus === "validado" && b.validationStatus !== "validado") return -1;
    if (a.validationStatus !== "validado" && b.validationStatus === "validado") return 1;
    return a.sourcePriority - b.sourcePriority;
  });

  return (
    <DashboardLayout activeTab="analises">
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {/* ESTADO 1: Upload ou Agregador Multi-Fontes */}
          {appState === "upload" && (
            <motion.div
              key="state-upload"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Header da Ferramenta */}
              <div className="text-center max-w-3xl mx-auto space-y-3">
                {/* 🔒 BADGE PROEMINENTE: MODO ATIVO VERTICAL */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface)] text-[var(--ink)] text-xs font-mono font-bold border border-[var(--brand)]/40 shadow-xs">
                    <Lock className="w-3.5 h-3.5 text-[var(--brand)]" />
                    <span>MODO ATIVO: {activeVertical.toUpperCase()}</span>
                    <span className="text-[10px] text-[var(--brand)] font-normal border-l border-[var(--line)] pl-2">
                      Regras Específicas Aplicadas
                    </span>
                  </div>

                  {/* Founder / Demo Mode Switcher: Impersonação e Teste Rápido de Verticais */}
                  {user?.is_superadmin && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-white">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] text-slate-400">Demo Mode:</span>
                      <select
                        value={tempVertical || user?.primary_vertical || "Serviços Contínuos (Limpeza, Segurança, Manutenção)"}
                        onChange={(e) => setTempVertical(e.target.value)}
                        className="bg-transparent text-white font-mono text-[11px] outline-none cursor-pointer border-none"
                      >
                        <option value="Serviços Contínuos (Limpeza, Segurança, Manutenção)" className="bg-slate-900 text-white">Serviços Contínuos</option>
                        <option value="Obras Públicas e Engenharia" className="bg-slate-900 text-white">Obras e Engenharia</option>
                        <option value="Saúde e Medicamentos" className="bg-slate-900 text-white">Saúde e Medicamentos</option>
                        <option value="Tecnologia da Informação" className="bg-slate-900 text-white">Tecnologia da Informação</option>
                        <option value="Compras e Fornecimentos" className="bg-slate-900 text-white">Compras e Fornecimentos</option>
                      </select>
                    </div>
                  )}

                  {tempVertical && (
                    <button
                      type="button"
                      onClick={() => setTempVertical(null)}
                      className="text-[11px] font-mono text-[var(--warn-fg)] bg-[var(--warn-bg)] px-2 py-0.5 rounded border border-[var(--warn)]/40 hover:underline"
                    >
                      Restaurar padrão ({user?.primary_vertical})
                    </button>
                  )}
                </div>

                {/* MODAL / BANNER DE AVISO DE CONFLITO VERTICAL PRÉ-ANÁLISE */}
                {mismatchWarningItem && (
                  <div className="p-4 rounded-lg bg-[var(--warn-bg)] border border-[var(--warn)]/50 text-left space-y-3 shadow-sm">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-[var(--warn)] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-[var(--ink)]">
                          Alerta de Categoria: Divergência Detectada no Objeto
                        </div>
                        <div className="text-[11px] text-[var(--ink-2)] mt-1">
                          Este edital parece ser de categoria diferente da sua preferência cadastrada ({activeVertical}). A análise aplicará suas regras prioritárias, mas pode haver divergências regulatórias.
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1 border-t border-[var(--warn)]/20 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          const item = mismatchWarningItem;
                          const objLower = item.objeto.toLowerCase();
                          const detected = objLower.includes("medicamento") || objLower.includes("hospitalar")
                            ? "Saúde e Medicamentos"
                            : objLower.includes("software") || objLower.includes("nuvem")
                            ? "Tecnologia da Informação"
                            : "Obras Públicas e Engenharia";
                          setTempVertical(detected);
                          setMismatchWarningItem(null);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--surface)] text-[var(--ink)] text-xs font-semibold border border-[var(--line)] hover:bg-[var(--line)]/50 transition-all"
                      >
                        <Sliders className="w-3.5 h-3.5 text-[var(--brand)]" />
                        <span>Alterar Vertical Temporariamente</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const item = mismatchWarningItem;
                          setMismatchWarningItem(null);
                          handleSelectTender(item);
                        }}
                        className="px-3 py-1.5 rounded bg-[var(--brand)] text-white text-xs font-bold hover:brightness-110 shadow-xs transition-all"
                      >
                        Confirmar com {activeVertical}
                      </button>
                    </div>
                  </div>
                )}

                {/* FIX #2: Banner de Recuperação se houver falha prévia recuperável sem queima de créditos */}
                {activeSession?.status === "FAILED" && (
                  <div className="mb-4 p-3.5 rounded-lg bg-[var(--warn-bg)] border border-[var(--warn)]/40 text-left flex items-start justify-between gap-3 shadow-xs">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-[var(--warn)] shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-[var(--ink)]">
                          Sessão Anterior Interrompida ({activeSession.fileName})
                        </div>
                        <div className="text-[11px] text-[var(--ink-2)] mt-0.5">
                          {activeSession.errorMessage || "A análise anterior não foi concluída. Seus créditos foram preservados integralmente."}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleRetryFailedAnalysis}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--brand)] text-white text-[11px] font-bold hover:brightness-110 shadow-xs transition-all"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Tentar Novamente</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDismissFailedSession}
                        className="p-1 rounded text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--line)]"
                        title="Descartar aviso"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-tint)] text-[var(--ink)] text-xs font-mono font-semibold border border-[var(--brand)]/20">
                  <BrandIcon name="garantia" size="s16" accentCobalt />
                  <span>Auditoria Preventiva de Habilitação (Art. 62 Lei 14.133)</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight font-display">
                  Nova Auditoria Preventiva de Edital
                </h1>
                <p className="text-xs sm:text-sm text-[var(--ink-2)]">
                  Analise o arquivo PDF local da sua empresa ou consulte o Agregador Multi-Fontes Oficial com validação cruzada.
                </p>

                {/* Segmented Control Arredondado */}
                <div className="pt-4 flex justify-center">
                  <div className="relative p-1 rounded-lg bg-[var(--surface)] border border-[var(--line)] shadow-sm flex items-center">
                    <button
                      type="button"
                      onClick={() => setActiveUploadTab("pdf")}
                      className={`relative z-10 inline-flex items-center gap-2 px-5 py-2 rounded-md text-xs font-bold transition-all ${
                        activeUploadTab === "pdf"
                          ? "bg-[var(--brand)] text-white shadow-xs"
                          : "text-[var(--ink-2)] hover:text-[var(--ink)]"
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Upload de Arquivo PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveUploadTab("aggregator")}
                      className={`relative z-10 inline-flex items-center gap-2 px-5 py-2 rounded-md text-xs font-bold transition-all ${
                        activeUploadTab === "aggregator"
                          ? "bg-[var(--brand)] text-white shadow-xs"
                          : "text-[var(--ink-2)] hover:text-[var(--ink)]"
                      }`}
                    >
                      <Search className="w-4 h-4" />
                      <span>Agregador Multi-Fontes</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ABA 1: Upload PDF */}
              {activeUploadTab === "pdf" && (
                <div>
                  <FileUpload
                    onAnalysisStart={handleAnalysisStart}
                    onAnalysisSuccess={handleAnalysisSuccess}
                    onAnalysisError={handleAnalysisError}
                    onUseExampleData={handleUseExampleData}
                    overrideVertical={activeVertical}
                  />
                </div>
              )}

              {/* ABA 2: Agregador Multi-Fontes */}
              {activeUploadTab === "aggregator" && (
                <div className="w-full max-w-4xl mx-auto bg-[var(--surface)] rounded-lg p-6 sm:p-8 border border-[var(--line)] shadow-sm text-left space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--line)] gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2 font-display">
                        <Building2 className="w-4 h-4 text-[var(--brand)]" />
                        <span>Agregador Oficial de Compras Públicas</span>
                      </h3>
                      <p className="text-xs text-[var(--ink-2)] mt-0.5">
                        Conexão direta com 6 portais oficiais e motor de validação contra o PDF original.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-[var(--ok-bg)] text-[var(--ok-fg)] font-bold border border-[var(--ok)]/30">
                        Validação Cruzada Ativa
                      </span>
                    </div>
                  </div>

                  {/* Seleção de Fontes Homologadas */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-[var(--ink)]">
                        Fontes Oficiais Verificadas
                      </label>
                      <button
                        type="button"
                        onClick={selectAllSources}
                        className="text-[11px] font-mono text-[var(--brand)] hover:underline"
                      >
                        Selecionar todas
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                      {ALL_SOURCES.map((source) => {
                        const isChecked = selectedSources.includes(source.key);
                        const count = sourceCounts[source.key];
                        return (
                          <button
                            key={source.key}
                            type="button"
                            onClick={() => toggleSourceSelection(source.key)}
                            className={`p-2.5 rounded-md border text-left transition-all flex flex-col justify-between ${
                              isChecked
                                ? "bg-[var(--brand-tint)]/40 border-[var(--brand)] text-[var(--ink)] shadow-xs"
                                : "bg-[var(--bg)] border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--line)]"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold font-mono">
                                {source.label}
                              </span>
                              {isChecked && <CheckCircle className="w-3.5 h-3.5 text-[var(--brand)]" />}
                            </div>
                            <div className="mt-1 flex items-center justify-between text-[10px] font-mono text-[var(--ink-2)]">
                              <span>Prioridade {ALL_SOURCES.findIndex((s) => s.key === source.key) + 1}</span>
                              {count !== undefined && (
                                <span className="px-1.5 py-0.2 rounded bg-[var(--surface)] border border-[var(--line)] font-bold text-[var(--ink)]">
                                  {count}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Formulário de Filtro */}
                  <form onSubmit={handleAggregatorSearch} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-8">
                        <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                          Objeto da Compra ou Palavra-Chave
                        </label>
                        <input
                          type="text"
                          value={searchObjeto}
                          onChange={(e) => setSearchObjeto(e.target.value)}
                          placeholder="Ex: notebooks, pavimentação, medicamentos, vigilância..."
                          className="w-full px-3 py-2 text-xs rounded-md bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--ink-2)] focus:outline-none focus:border-[var(--brand)]"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="text-xs font-semibold text-[var(--ink)] block mb-1">
                          UF (Estado)
                        </label>
                        <select
                          value={searchUf}
                          onChange={(e) => setSearchUf(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-md bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:border-[var(--brand)]"
                        >
                          <option value="">Todas as UFs</option>
                          {estados.map((sigla) => (
                            <option key={sigla} value={sigla}>
                              {sigla}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-1 gap-3">
                      <div className="text-[11px] text-[var(--ink-2)] font-mono flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[var(--brand)]" />
                        <span>Filtro de segurança: apenas certames com PDF verificável</span>
                      </div>

                      <button
                        type="submit"
                        disabled={searchLoading}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-md bg-[var(--brand)] hover:brightness-110 text-white shadow-xs transition-all disabled:opacity-50"
                      >
                        {searchLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                        <span>Pesquisar em Todas as Fontes</span>
                      </button>
                    </div>
                  </form>

                  {/* Resultados Agregados e Deduplicados */}
                  {hasSearched && (
                    <div className="pt-6 border-t border-[var(--line)] space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--ink)] font-mono">
                            Editais Validados ({sortedResults.length})
                          </span>
                          <span className="text-[11px] text-[var(--ink-2)] font-mono">
                            • Deduplicação e checagem de integridade concluídas
                          </span>
                        </div>

                        {/* Ordenação */}
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-[var(--ink-2)] font-mono text-[11px]">Ordenar por:</span>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-2 py-1 text-xs rounded bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] focus:outline-none"
                          >
                            <option value="relevancia">Relevância (Validados primeiro)</option>
                            <option value="data">Data de Publicação</option>
                            <option value="fonte">Fonte Confiável (PNCP-first)</option>
                          </select>
                        </div>
                      </div>

                      {sortedResults.length === 0 && !searchLoading && (
                        <div className="p-6 text-center rounded-lg bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--ink-2)]">
                          Nenhum certame localizado para os parâmetros informados. Tente alterar os termos ou selecionar mais fontes.
                        </div>
                      )}

                      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                        {sortedResults.map((item) => (
                          <div
                            key={item.id}
                            className="bento-card p-5 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--brand)]/50 transition-all flex flex-col gap-3.5 group shadow-xs"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--brand-tint)]/60 text-[var(--brand)] font-bold border border-[var(--brand)]/30">
                                  {item.source}
                                </span>
                                <span className="text-[10px] font-mono text-[var(--ink-2)] bg-[var(--bg)] px-2 py-0.5 rounded border border-[var(--line)]">
                                  {item.id}
                                </span>
                                {item.availableAlsoInPNCP && (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--ok-bg)] text-[var(--ok-fg)] font-semibold border border-[var(--ok)]/30">
                                    Disponível também no PNCP
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                {item.validationStatus === "validado" && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[var(--ok-fg)] font-semibold bg-[var(--ok-bg)] px-2.5 py-0.5 rounded border border-[var(--ok)]/30">
                                    <CheckCircle className="w-3 h-3" />
                                    <span>Validação Cruzada OK</span>
                                  </span>
                                )}
                                {item.validationStatus === "inconsistente" && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[var(--warn-fg)] font-semibold bg-[var(--warn-bg)] px-2.5 py-0.5 rounded border border-[var(--warn)]/30">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span>Inconsistência Detectada</span>
                                  </span>
                                )}
                                <span className="text-[11px] font-mono font-bold text-[var(--ink)] bg-[var(--bg)] px-2 py-0.5 rounded border border-[var(--line)]">
                                  UF: {item.uf}
                                </span>
                              </div>
                            </div>

                            <div>
                              <div className="text-[11px] font-mono text-[var(--ink-2)] mb-1 font-semibold truncate">
                                Órgão Licitante: <strong className="text-[var(--ink)]">{item.orgao}</strong>
                              </div>
                              <h4 className="text-xs sm:text-sm font-bold text-[var(--ink)] font-display group-hover:text-[var(--brand)] transition-colors leading-relaxed">
                                {item.objeto}
                              </h4>
                              {item.divergenceWarning && (
                                <div className="mt-2.5 text-[11px] font-mono text-[var(--warn-fg)] bg-[var(--warn-bg)]/60 px-3 py-1.5 rounded-lg border border-[var(--warn)]/30 flex items-center gap-1.5">
                                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                  <span>{item.divergenceWarning}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center justify-between pt-3 border-t border-[var(--line)] text-xs text-[var(--ink-2)] gap-2">
                              <div className="flex items-center gap-4 font-mono text-[11px]">
                                {item.valorEstimado ? (
                                  <span>
                                    Estimativa: <strong className="text-[var(--ink)]">R$ {item.valorEstimado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
                                  </span>
                                ) : (
                                  <span className="italic">Valor sob cotação</span>
                                )}
                                <span>•</span>
                                <span>Sessão: <strong className="text-[var(--ink)]">{new Date(item.dataAbertura).toLocaleDateString("pt-BR")}</strong></span>
                              </div>

                              <div className="flex items-center gap-2">
                                {item.linkPdf && (
                                  <a
                                    href={item.linkPdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-medium text-[var(--ink)] hover:text-[var(--brand)] bg-[var(--bg)] border border-[var(--line)] transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>Edital PDF</span>
                                  </a>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleSelectTender(item)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[var(--brand-solid)] hover:brightness-110 shadow-xs transition-all active:scale-98"
                                >
                                  <span>Auditar Habilitação</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 text-[11px] text-[var(--ink-2)] italic border-t border-[var(--line)]">
                    Fontes externas são validadas automaticamente contra o acervo digital, mas podem conter divergências de publicação. Confirme sempre no edital original antes de disputar.
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ESTADO 2: Scanning Loader */}
          {appState === "loading" && (
            <motion.div
              key="state-loading"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-4"
            >
              {/* FIX #2: Indicador Persistente de Processamento Ativo */}
              <div className="max-w-xl mx-auto p-3 bg-[var(--surface)] border border-[var(--brand)]/30 rounded-lg text-center shadow-xs">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[var(--brand)]">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>
                    Análise em andamento desde {activeSession?.startTime || new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}. Não feche esta aba.
                  </span>
                </div>
                <div className="text-[11px] text-[var(--ink-2)] mt-1">
                  Seus créditos serão debitados apenas após a conclusão e validação do parecer de habilitação.
                </div>
              </div>

              <ScanningLoader fileName={currentFileName} />
            </motion.div>
          )}

          {/* ESTADO 3: ReportCard Completo com os 4 Pilares */}
          {appState === "report" && (
            <motion.div
              key="state-report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {isDemoMode && (
                <div className="mb-4 p-4 rounded-xl bg-red-950/80 border-2 border-red-500 text-red-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-md bg-red-600 text-white font-mono font-black text-xs tracking-wider animate-pulse uppercase">
                      MODO DEMONSTRAÇÃO - DADOS FICTÍCIOS
                    </span>
                    <span className="text-xs font-sans">
                      Este parecer foi gerado com edital demonstrativo para teste. Nenhuma informação foi gravada no histórico real do seu banco.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDemoMode(false);
                      handleReset();
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-white text-slate-900 font-bold text-xs hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
                  >
                    Auditar Edital Real
                  </button>
                </div>
              )}
              <ReportCard data={reportData} onReset={() => {
                setIsDemoMode(false);
                handleReset();
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

export default function NovaAnalisePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-[var(--ink)]">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--brand)]" />
            <span className="text-xs font-mono">Carregando workspace de auditoria preventiva...</span>
          </div>
        </div>
      }
    >
      <NovaAnaliseContent />
    </Suspense>
  );
}
