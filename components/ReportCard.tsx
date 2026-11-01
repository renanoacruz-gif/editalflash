"use client";

/**
 * components/ReportCard.tsx
 * 
 * CORE PRODUCT: AUDITOR DE HABILITAÇÃO PRÉ-EDITAL (Lei 14.133/2021)
 * Vertical Hard-Locked: Obras Públicas
 * 
 * Estrutura:
 * - Topo Absoluto: <SemaforoHabilitacao /> (Veredito PASSA / RESSALVA / ELIMINATÓRIA com citações de página/linha)
 * - Checagens Numéricas: PL ≥ 10% e Volume de Atestado Técnico
 * - Resumo Estruturado do Edital (Objeto, Datas, Valores)
 * - Checklist de Documentos da Habilitação Art. 62 (<ChecklistArt62 />)
 * - Minuta de Impugnação Administrativa Art. 164 para cláusulas ilegais
 * - Disclaimer Jurídico Persistente
 */

import React, { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  DollarSign,
  Calendar,
  Clock,
  Building2,
  Copy,
  Check,
  AlertTriangle,
  RotateCcw,
  Download,
  Share2,
  Info,
  Scale,
  X,
  FileText,
  PenLine,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { EditalAnalysisResponse, Armadilha } from "@/lib/types";
import { SemaforoHabilitacao } from "./SemaforoHabilitacao";
import { ChecklistArt62 } from "./ChecklistArt62";
import { generateImpugnation } from "@/lib/legal-drafts";
import { useAuth } from "@/lib/auth-context";
import { calculateRemainingBusinessDays } from "@/lib/business-days";
import { ParecerHeader } from "./ParecerHeader";
import { ParecerExecutivoPDF } from "./ParecerExecutivoPDF";
import { pdf } from "@react-pdf/renderer";
import { RetificationRadarCard } from "./RetificationRadarCard";

interface ReportCardProps {
  data: EditalAnalysisResponse;
  onReset: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ data, onReset }) => {
  const { user } = useAuth();
  const [copiedClauseIndex, setCopiedClauseIndex] = useState<number | null>(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const handleExportParecerPDF = async () => {
    try {
      setIsExportingPDF(true);
      setDownloadToast("Compilando Parecer Técnico Executivo em PDF...");

      // Geração direta no navegador (Client-Side) compatível com Cloudflare Pages
      let blob: Blob;
      try {
        const docElement = React.createElement(ParecerExecutivoPDF, {
          data,
          companyName,
          companyCnpj,
        });
        blob = await pdf(docElement as any).toBlob();
      } catch (clientErr) {
        // Fallback de contingência caso o renderizador local encontre restrição no worker
        const res = await fetch("/api/pdf/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "parecer",
            data,
            companyName,
            companyCnpj,
          }),
        });
        if (!res.ok) {
          throw clientErr || new Error("Erro na geração do PDF.");
        }
        blob = await res.blob();
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Parecer_Habilitacao_${(data.dados_gerais.numero_edital || "Edital").replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setDownloadToast("Parecer executivo gerado com sucesso.");
      setTimeout(() => setDownloadToast(null), 3000);
    } catch (err: any) {
      // Fallback final: diálogo nativo de impressão
      try {
        window.print();
        setDownloadToast("Janela de impressão/PDF acionada.");
        setTimeout(() => setDownloadToast(null), 3000);
      } catch (_) {
        setDownloadToast("Falha ao gerar PDF: " + (err?.message || "Erro desconhecido"));
        setTimeout(() => setDownloadToast(null), 4000);
      }
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Estados para Minuta de Impugnação Art. 164 (Preenchimento automático do perfil e persistência local)
  const [activeMinutaText, setActiveMinutaText] = useState<string | null>(null);
  const [activeMinutaTitle, setActiveMinutaTitle] = useState<string>("");
  const [activeArmadilha, setActiveArmadilha] = useState<Armadilha | null>(null);
  const [copiedMinuta, setCopiedMinuta] = useState(false);
  const [showUpgradeModalMinuta, setShowUpgradeModalMinuta] = useState(false);

  // Auto-população de dados com fallback para valores persistidos localmente
  const [companyName, setCompanyName] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("editalflash_last_impugnation_company");
      if (saved) return saved;
    }
    return user?.company || "EMPRESA LICITANTE LTDA";
  });

  const [companyCnpj, setCompanyCnpj] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("editalflash_last_impugnation_cnpj");
      if (saved) return saved;
    }
    return user?.cnpj || "51.926.034/0001-42";
  });

  const [gestorName, setGestorName] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("editalflash_last_impugnation_gestor");
      if (saved) return saved;
    }
    return user?.name || "Gestor de Licitações";
  });

  const copyClause = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedClauseIndex(index);
    setTimeout(() => setCopiedClauseIndex(null), 1800);
  };

  const handleOpenMinuta = (armadilha: Armadilha) => {
    // Gate de Plano: Usuários Starter não possuem minutas automatizadas de impugnação
    const isStarter = user?.plan === "Starter" && !user?.is_superadmin && user?.role !== "superadmin";
    if (isStarter) {
      setShowUpgradeModalMinuta(true);
      return;
    }

    setActiveArmadilha(armadilha);
    setActiveMinutaTitle(armadilha.titulo);
    const draft = generateImpugnation(
      armadilha.texto_original,
      armadilha.descricao,
      companyName,
      companyCnpj,
      gestorName
    );
    setActiveMinutaText(draft);
  };

  const handleUpdateDraft = (newCompany: string, newCnpj: string, newGestor: string) => {
    setCompanyName(newCompany);
    setCompanyCnpj(newCnpj);
    setGestorName(newGestor);
    if (typeof window !== "undefined") {
      localStorage.setItem("editalflash_last_impugnation_company", newCompany);
      localStorage.setItem("editalflash_last_impugnation_cnpj", newCnpj);
      localStorage.setItem("editalflash_last_impugnation_gestor", newGestor);
    }
    if (activeArmadilha) {
      const draft = generateImpugnation(
        activeArmadilha.texto_original,
        activeArmadilha.descricao,
        newCompany,
        newCnpj,
        newGestor
      );
      setActiveMinutaText(draft);
    }
  };

  const handleCopyMinuta = () => {
    if (activeMinutaText) {
      navigator.clipboard.writeText(activeMinutaText);
      setCopiedMinuta(true);
      setTimeout(() => setCopiedMinuta(false), 2000);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <>
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0E1626] border border-[#2740F0] text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2">
          <Download className="w-4 h-4 text-[#4A5FFF]" strokeWidth={1.75} />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Modal da Minuta de Impugnação Administrativa Art. 164 */}
      {activeMinutaText && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b101d] border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
                  <Scale className="w-3.5 h-3.5 text-blue-400" />
                  <span>Art. 164 da Lei 14.133/2021 • Impugnação de Edital</span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {activeMinutaTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveMinutaText(null)}
                className="p-1 rounded-lg text-[#4A5C6A] hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TASK UX #2: Auto-Fill Impugnation Drafts com Campos Editáveis e Persistência */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#4A5C6A]">
                  Razão Social (Perfil):
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => handleUpdateDraft(e.target.value, companyCnpj, gestorName)}
                  placeholder="Nome da Empresa"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#4A5C6A]">
                  CNPJ:
                </label>
                <input
                  type="text"
                  value={companyCnpj}
                  onChange={(e) => handleUpdateDraft(companyName, e.target.value, gestorName)}
                  placeholder="00.000.000/0001-00"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#4A5C6A]">
                  Gestor / Procurador:
                </label>
                <input
                  type="text"
                  value={gestorName}
                  onChange={(e) => handleUpdateDraft(companyName, companyCnpj, e.target.value)}
                  placeholder="Nome do Gestor"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-[#060a12] border border-slate-800 text-slate-300 font-mono text-xs leading-relaxed whitespace-pre-wrap select-all">
              {activeMinutaText}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 flex-wrap gap-2">
              <span className="text-[11px] text-[#9BA8AB]">
                Petição fundamentada em acórdãos do TCU e dispositivos da Lei 14.133/21
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMinutaText(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#4A5C6A] hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={handleCopyMinuta}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all active:scale-[0.98]"
                >
                  {copiedMinuta ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copiado para Área de Transferência.</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Minuta Completa</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Upgrade para Minutas Art. 164 (Gate do Plano Starter) */}
      {showUpgradeModalMinuta && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--line)] w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto">
              <Lock className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wide text-amber-500">
                Recurso do Plano Pro / Enterprise
              </span>
              <h3 className="text-base font-bold text-[var(--ink)] font-display">
                Minutas Automáticas de Impugnação (Art. 164)
              </h3>
              <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                O seu plano atual (Starter) dá acesso ao veredito e cálculo de habilitação. A geração de petições fundamentadas em acórdãos do TCU com 1 clique é exclusiva dos planos Pro e Enterprise.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="/pricing"
                className="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-white bg-[var(--brand-solid)] hover:brightness-110 shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>Fazer Upgrade para Plano Pro (R$ 297/mês)</span>
              </a>
              <button
                type="button"
                onClick={() => setShowUpgradeModalMinuta(false)}
                className="w-full py-2 text-xs font-semibold text-[var(--ink-2)] hover:text-[var(--ink)]"
              >
                Voltar ao Parecer
              </button>
            </div>
          </div>
        </div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6"
      >
        {/* REFINEMENT #3: Carimbo e Cabeçalho Executivo Exclusivo para Exportação / Impressão */}
        <ParecerHeader
          companyName={companyName}
          numeroEdital={data.dados_gerais.numero_edital}
          orgao={data.dados_gerais.orgao}
          vereditoGeral={data.veredito_habilitacao || "RESSALVA"}
          passaCount={(data.semaforo_habilitacao || []).filter((i) => i.status === "PASSA").length}
          ressalvaCount={(data.semaforo_habilitacao || []).filter((i) => i.status === "RESSALVA").length}
          eliminatoriaCount={(data.semaforo_habilitacao || []).filter((i) => i.status === "ELIMINATORIA").length}
          revisaoCount={(data.semaforo_habilitacao || []).filter((i) => i.status === "REVISAO_HUMANA_NECESSARIA").length}
        />

        {/* TASK: RETIFICATION DIFF ENGINE ALERT (Defense Moat Bento Redesign) */}
        {data.dados_gerais.retificationAlert?.retified && (
          <motion.div variants={itemVariants}>
            <RetificationRadarCard
              previousDate={data.dados_gerais.retificationAlert.previousDate}
              changes={data.dados_gerais.retificationAlert.changes}
              editalTitle={data.dados_gerais.numero_edital}
            />
          </motion.div>
        )}

        {/* TASK: UI FEEDBACK FOR MISMATCH (SEU PERFIL vs CATEGORIA DO EDITAL) */}
        {data.vertical_mismatch && (
          <motion.div
            variants={itemVariants}
            className="p-4 rounded-xl bg-[var(--warn-bg)] border border-[var(--warn)]/40 text-[var(--warn-fg)] text-xs space-y-1.5 shadow-sm font-sans"
          >
            <div className="flex items-center gap-2 font-bold text-[var(--warn-fg)]">
              <AlertTriangle className="w-4 h-4 text-[var(--warn)] shrink-0" strokeWidth={1.75} />
              <span className="font-mono text-xs uppercase tracking-wide">Divergência de Vertical Detectada</span>
            </div>
            <p className="text-xs leading-relaxed text-[var(--ink)]">
              {data.vertical_mismatch_warning ||
                `Divergência de Vertical: Seu perfil é ${data.user_primary_vertical || "Não definido"}, mas este edital é ${data.detected_vertical || data.vertical}. As regras de habilitação foram ajustadas para o edital.`}
            </p>
            <p className="text-[11px] font-mono text-[var(--ink-2)]">
              Dica de Acervo: Seu cofre é focado em {data.user_primary_vertical || "outro segmento"}. Verifique se a sua empresa possui as certidões e atestados específicos exigidos para este objeto.
            </p>
          </motion.div>
        )}

        {/* =========================================================================
            FEATURE CORE #1: SEMÁFORO DE HABILITAÇÃO ART. 62 NO TOPO ABSOLUTO
            O veredito de aprovação/eliminação é a primeira decisão do gestor.
           ========================================================================= */}
        <motion.div variants={itemVariants}>
          <SemaforoHabilitacao
            items={data.semaforo_habilitacao}
            vereditoGeral={data.veredito_habilitacao || "RESSALVA"}
            justificativaVeredito={data.justificativa_veredito || "Auditoria preventiva de habilitação com base na Lei 14.133/2021."}
          />
        </motion.div>

        {/* Barra de Ações Superior com Badges de Categoria */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl p-4 sm:p-5 border border-[#253745] bg-[#11212D] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Auditoria de Habilitação Concluída
                </span>
                <span className="text-[10px] bg-[#06141B] text-[#CCD0CF] px-2 py-0.5 rounded-full border border-[#253745] font-mono">
                  CATEGORIA DETECTADA: {data.detected_vertical || data.vertical || "Obras Públicas"}
                </span>
                {data.user_primary_vertical && (
                  <span className="text-[10px] bg-[#06141B] text-[#9BA8AB] px-2 py-0.5 rounded-full border border-[#253745] font-mono">
                    SUA PREFERÊNCIA: {data.user_primary_vertical}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#CCD0CF] tracking-tight">
                {data.dados_gerais.numero_edital || "Certame Licitatório Auditado"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#253745] hover:bg-[#324859] text-[#CCD0CF] hover:text-white border border-[#9BA8AB]/30 transition-all active:scale-[0.98]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Auditar Outro Edital</span>
            </button>

            <button
              type="button"
              onClick={handleExportParecerPDF}
              disabled={isExportingPDF}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#253745] hover:bg-[#324859] shadow-md border border-[#9BA8AB]/40 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>{isExportingPDF ? "Compilando PDF..." : "Exportar Parecer Nativo (PDF)"}</span>
            </button>
          </div>
        </motion.div>

        {/* =========================================================================
            CORPO DA AUDITORIA:
            - Coluna Esquerda (lg:col-span-5): Resumo do Objeto, Metadados & Cláusulas Críticas
            - Coluna Direita (lg:col-span-7): Checklist Art. 62 Completo com Vínculo ao Cofre
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUNA ESQUERDA: RESUMO ESTRUTURADO + CLÁUSULAS RESTRITIVAS (5 colunas) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Objeto */}
            <motion.div
              variants={itemVariants}
              className="rounded-3xl p-6 border border-[#253745] bg-[#11212D] shadow-xl space-y-2.5"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-[#9BA8AB] block">
                Objeto da Licitação
              </span>
              <p className="text-sm font-semibold text-[#CCD0CF] leading-relaxed">
                {data.dados_gerais.objeto}
              </p>
            </motion.div>

            {/* Metadados do Certame */}
            <motion.div variants={itemVariants} className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9BA8AB] block pl-1">
                Metadados Convocatórios
              </span>

              {/* Valor Estimado */}
              <div className="rounded-2xl p-4 border border-[#253745] bg-[#11212D] shadow-md flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#9BA8AB] font-medium block">Valor Estimado da Contratação</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">
                    {data.dados_gerais.valor_estimado}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>

              {/* Data da Sessão */}
              <div className="rounded-2xl p-4 border border-[#253745] bg-[#11212D] shadow-md flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#9BA8AB] font-medium block">Data e Hora da Sessão Pública</span>
                  <span className="text-sm font-semibold text-[#CCD0CF] font-mono">
                    {data.dados_gerais.data_sessao}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>

              {/* Prazo Limite de Impugnação com Contagem Regressiva Útil (REFINEMENT #2) */}
              {(() => {
                const countdown = calculateRemainingBusinessDays(data.dados_gerais.prazo_impugnacao);
                const bgClass = countdown.isExpired
                  ? "bg-rose-950/40 border-rose-500/40"
                  : countdown.isUrgent
                  ? "bg-amber-950/40 border-amber-500/40"
                  : "bg-[#11212D] border-[#253745]";
                const textClass = countdown.isExpired
                  ? "text-rose-400"
                  : countdown.isUrgent
                  ? "text-amber-400"
                  : "text-[#CCD0CF]";

                return (
                  <div className={`rounded-xl p-4 border shadow-sm flex items-center justify-between transition-colors ${bgClass}`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] text-[#9BA8AB] font-medium block">
                          Prazo Limite de Impugnação (Art. 164)
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                            countdown.isExpired
                              ? "bg-rose-950/80 text-rose-300 border-rose-500/50"
                              : countdown.isUrgent
                              ? "bg-amber-950/80 text-amber-300 border-amber-500/50"
                              : "bg-[#06141B] text-[#CCD0CF] border-[#253745]"
                          }`}
                        >
                          {countdown.label}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-sm font-bold font-mono ${textClass}`}>
                          {data.dados_gerais.prazo_impugnacao}
                        </span>
                        <span className="text-[11px] font-mono text-[#9BA8AB]">
                          · {countdown.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#9BA8AB] block">
                        3 dias úteis antes da abertura da sessão pública (Lei 14.133/2021)
                      </span>
                    </div>
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        countdown.isExpired
                          ? "bg-rose-500/10 text-rose-400"
                          : countdown.isUrgent
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-[#253745] text-[#CCD0CF]"
                      }`}
                    >
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                );
              })()}

              {/* Órgão Licitante */}
              {data.dados_gerais.orgao && (
                <div className="rounded-2xl p-4 border border-[#253745] bg-[#11212D] shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#9BA8AB] font-medium block">Órgão Convocante</span>
                    <span className="text-xs font-semibold text-[#CCD0CF]">
                      {data.dados_gerais.orgao}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#06141B] text-[#9BA8AB]">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Cláusulas Restritivas & Minutas Art. 164 */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 pl-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Cláusulas Restritivas Identificadas ({data.armadilhas.length})</span>
              </span>

              {data.armadilhas.map((armadilha, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="rounded-2xl border border-[#253745] border-l-4 border-l-rose-500 bg-[#11212D] p-4 sm:p-5 space-y-3 shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-[#CCD0CF] tracking-tight leading-snug">
                      {armadilha.titulo}
                    </h4>
                    {armadilha.impacto && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                        {armadilha.impacto}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#9BA8AB] leading-relaxed font-normal">
                    {armadilha.descricao}
                  </p>

                  <div className="p-3 rounded-xl bg-[#06141B] border border-[#253745] font-mono text-[11px] text-[#CCD0CF] italic select-all leading-relaxed">
                    “{armadilha.texto_original}”
                  </div>

                  <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleOpenMinuta(armadilha)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#253745] hover:bg-[#324859] text-white shadow-md border border-[#9BA8AB]/30 transition-all active:scale-[0.98]"
                    >
                      <PenLine className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>Gerar Minuta Art. 164</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => copyClause(armadilha.texto_original, idx)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#06141B] hover:bg-[#253745] text-[#9BA8AB] hover:text-[#CCD0CF] border border-[#253745] transition-all active:scale-[0.98]"
                    >
                      {copiedClauseIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#9BA8AB]" />
                          <span>Copiar Trecho</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* COLUNA DIREITA: CHECKLIST ART. 62 COMPLETO (7 colunas) */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div variants={itemVariants}>
              <ChecklistArt62 />
            </motion.div>
          </div>
        </div>

        {/* DISCLAIMER JURÍDICO PERSISTENTE OBRIGATÓRIO */}
        <motion.div
          variants={itemVariants}
          className="p-4 rounded-xl bg-[#0c1322] border border-slate-700/80 text-center text-xs text-slate-300 space-y-1 shadow-sm"
        >
          <p className="font-semibold text-slate-200">
            Ferramenta de suporte à decisão. Responsabilidade jurídica permanece com a empresa licitante.
          </p>
          <p className="text-[11px] text-[#4A5C6A]">
            A auditoria preventiva de habilitação indica aderência e conformidade com base no Art. 62 da Lei 14.133/2021 e nos documentos do cofre cadastrado.
          </p>
        </motion.div>
      </motion.div>
    </>
  );
};
