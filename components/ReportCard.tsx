"use client";

/**
 * components/ReportCard.tsx
 * 
 * PARECER TÉCNICO DIGITAL EXECUTIVO (Lei 14.133/2021)
 * Redesign Estratégico baseado no padrão Linear + Stripe + IBM Carbon.
 * 
 * Estrutura em 8 Seções Executivas (A a H):
 * - Seção A: Identificação Técnica da Auditoria
 * - Seção B: Resultado Executivo & Semáforo Tripartite
 * - Seção C: Matriz de Análise Documental (Art. 62) com expansão
 * - Seção D: Ressalvas & Pontos de Atenção Preventiva
 * - Seção E: Pendências Eliminatórias & Cláusulas Restritivas
 * - Seção F: Fundamentação Legal com Links Oficiais do Planalto
 * - Seção G: Plano de Regularização Priorizado
 * - Seção H: Conclusão Executiva & Próximos Passos
 */

import React, { useState } from "react";
import {
  FileText,
  Download,
  RotateCcw,
  Scale,
  Clock,
  Building2,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  PenLine,
  Copy,
  Check,
  X,
  Lock,
  ShieldCheck,
  Info,
} from "lucide-react";
import { EditalAnalysisResponse, HabilitacaoItem, Armadilha } from "@/lib/types";
import { generateImpugnation } from "@/lib/legal-drafts";
import { useAuth } from "@/lib/auth-context";
import { calculateRemainingBusinessDays } from "@/lib/business-days";
import { ParecerExecutivoPDF } from "./ParecerExecutivoPDF";
import { pdf } from "@react-pdf/renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ReportCardProps {
  data: EditalAnalysisResponse;
  onReset: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ data, onReset }) => {
  const { user } = useAuth();
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [copiedClauseIndex, setCopiedClauseIndex] = useState<number | null>(null);

  // Estados para Minuta de Impugnação Art. 164
  const [activeMinutaText, setActiveMinutaText] = useState<string | null>(null);
  const [activeMinutaTitle, setActiveMinutaTitle] = useState<string>("");
  const [activeArmadilha, setActiveArmadilha] = useState<Armadilha | null>(null);
  const [copiedMinuta, setCopiedMinuta] = useState(false);
  const [showUpgradeModalMinuta, setShowUpgradeModalMinuta] = useState(false);

  // Auto-população de dados cadastrais da empresa
  const [companyName, setCompanyName] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("editalflash_last_impugnation_company");
      if (saved) return saved;
    }
    return user?.company || "51.926.034 RENAN OSCAR ARAUJO CRUZ";
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

  // Métricas do resultado
  const items = data.semaforo_habilitacao || [];
  const totalDocs = items.length;
  const passaItems = items.filter((i) => i.status === "PASSA");
  const ressalvaItems = items.filter((i) => i.status === "RESSALVA");
  const eliminatoriaItems = items.filter((i) => i.status === "ELIMINATORIA" || i.status === "REVISAO_HUMANA_NECESSARIA");
  const armadilhas = data.armadilhas || [];

  const veredito = data.veredito_habilitacao || "RESSALVA";
  const vereditoLabel =
    veredito === "PASSA"
      ? "CONFORME (APTO À PARTICIPAÇÃO)"
      : veredito === "RESSALVA"
      ? "RESSALVAS IDENTIFICADAS (SANÁVEIS)"
      : "PENDÊNCIAS ELIMINATÓRIAS IDENTIFICADAS";

  const vereditoVariant =
    veredito === "PASSA" ? "pass" : veredito === "RESSALVA" ? "warning" : "danger";

  // Exportação nativa em PDF
  const handleExportParecerPDF = async () => {
    try {
      setIsExportingPDF(true);
      setDownloadToast("Compilando Parecer Técnico Executivo em PDF...");

      let blob: Blob;
      try {
        const docElement = React.createElement(ParecerExecutivoPDF, {
          data,
          companyName,
          companyCnpj,
        });
        blob = await pdf(docElement as any).toBlob();
      } catch (clientErr) {
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
        if (!res.ok) throw clientErr || new Error("Erro na geração do PDF.");
        blob = await res.blob();
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Parecer_Tecnico_${(data.dados_gerais.numero_edital || "Edital").replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setDownloadToast("Parecer executivo gerado com sucesso.");
      setTimeout(() => setDownloadToast(null), 3000);
    } catch (err: any) {
      try {
        window.print();
      } catch (_) {
        setDownloadToast("Falha ao gerar PDF.");
        setTimeout(() => setDownloadToast(null), 3000);
      }
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleOpenMinuta = (armadilha: Armadilha) => {
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

  const copyClause = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedClauseIndex(index);
    setTimeout(() => setCopiedClauseIndex(null), 1800);
  };

  const countdown = calculateRemainingBusinessDays(data.dados_gerais.prazo_impugnacao);

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20">
      {/* Toast Feedback */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#11212D] border border-[#253745] text-white px-4 py-3 rounded-lg shadow-xl text-xs font-mono flex items-center gap-2">
          <Download className="w-4 h-4 text-[#CCD0CF]" />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* SEÇÃO A — IDENTIFICAÇÃO TÉCNICA DA AUDITORIA */}
      <section className="border-b border-[#253745] pb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono uppercase tracking-wider text-[#9BA8AB]">
                Parecer Técnico Preliminar de Habilitação
              </span>
              <span className="text-xs font-mono text-[#4A5C6A]">|</span>
              <span className="text-xs font-mono text-[#CCD0CF]">Lei 14.133/2021</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight font-display">
              {data.dados_gerais.numero_edital || "Processo Licitatório"}
            </h1>
            <p className="text-xs text-[#9BA8AB]">
              Órgão Convocante: <strong className="text-white">{data.dados_gerais.orgao || "Administração Pública"}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button variant="outline" size="sm" onClick={onReset} className="gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Auditar Outro</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleExportParecerPDF}
              disabled={isExportingPDF}
              className="gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>{isExportingPDF ? "Compilando..." : "Exportar Parecer (PDF)"}</span>
            </Button>
          </div>
        </div>

        {/* Metadados Chave em Linha Fluida */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 text-xs font-mono border-t border-[#1c2b36]">
          <div>
            <span className="text-[#9BA8AB] block">Empresa Auditada:</span>
            <span className="text-white font-semibold truncate block">{companyName}</span>
          </div>
          <div>
            <span className="text-[#9BA8AB] block">Valor Estimado:</span>
            <span className="text-white font-semibold block">{data.dados_gerais.valor_estimado || "Não informado"}</span>
          </div>
          <div>
            <span className="text-[#9BA8AB] block">Data da Sessão:</span>
            <span className="text-white font-semibold block">{data.dados_gerais.data_sessao || "Conforme edital"}</span>
          </div>
          <div>
            <span className="text-[#9BA8AB] block">Prazo Impugnação:</span>
            <span className="text-white font-semibold block">{data.dados_gerais.prazo_impugnacao || "3 dias úteis antes"}</span>
          </div>
        </div>
      </section>

      {/* SEÇÃO B — RESULTADO EXECUTIVO */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#253745]">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[#9BA8AB]">
            Resultado Executivo
          </h2>
          <Badge variant={vereditoVariant} className="text-xs px-2.5 py-1">
            {vereditoLabel}
          </Badge>
        </div>

        {/* Indicadores Numéricos Consolidados */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-2 border-b border-[#253745] pb-6">
          <div>
            <span className="text-[11px] font-mono uppercase text-[#9BA8AB] block">Requisitos Auditados</span>
            <span className="text-3xl font-bold font-mono text-white mt-1 block">{totalDocs}</span>
            <span className="text-xs text-[#4A5C6A]">Conforme edital</span>
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase text-[#9BA8AB] block">Conformes (Passa)</span>
            <span className="text-3xl font-bold font-mono text-[#10B981] mt-1 block">{passaItems.length}</span>
            <span className="text-xs text-[#4A5C6A]">Aderência comprovada</span>
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase text-[#9BA8AB] block">Ressalvas Sanáveis</span>
            <span className="text-3xl font-bold font-mono text-[#F59E0B] mt-1 block">{ressalvaItems.length}</span>
            <span className="text-xs text-[#4A5C6A]">Ação recomendada</span>
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase text-[#9BA8AB] block">Pendências Críticas</span>
            <span className="text-3xl font-bold font-mono text-[#EF4444] mt-1 block">{eliminatoriaItems.length}</span>
            <span className="text-xs text-[#4A5C6A]">Risco eliminatório</span>
          </div>
        </div>

        <p className="text-sm text-[#CCD0CF] leading-relaxed">
          {data.justificativa_veredito || "Auditoria de habilitação parametrizada com base no Art. 62 da Lei Federal 14.133/2021."}
        </p>

        {/* Disclaimer Oficial Discreto */}
        <div className="p-3 rounded border border-[#253745] bg-[#11212D]/40 text-xs text-[#9BA8AB] flex items-start gap-2">
          <Info className="w-4 h-4 text-[#9BA8AB] shrink-0 mt-0.5" />
          <span>
            <strong>Observação de Apoio à Decisão:</strong> Este parecer constitui instrumento preventivo de suporte à análise de conformidade e não substitui a conferência integral do instrumento convocatório, dos documentos originais e da apreciação soberana do Agente de Contratação / Comissão de Licitação.
          </span>
        </div>
      </section>

      {/* SEÇÃO C — MATRIZ DE ANÁLISE DOCUMENTAL (ART. 62) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#253745]">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[#9BA8AB]">
            Matriz de Análise Documental (Art. 62 da Lei 14.133/2021)
          </h2>
          <span className="text-xs font-mono text-[#4A5C6A]">Clique para detalhar</span>
        </div>

        <div className="divide-y divide-[#253745]">
          {items.map((item) => {
            const isExpanded = expandedItemId === item.id;
            const statusVariant =
              item.status === "PASSA" ? "pass" : item.status === "RESSALVA" ? "warning" : "danger";

            return (
              <div key={item.id} className="py-3.5 space-y-2">
                <div
                  onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                  className="flex items-center justify-between cursor-pointer group hover:bg-[#11212D]/40 p-2 rounded transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-[#9BA8AB]">{item.categoria}</span>
                      <span className="text-xs font-mono text-[#4A5C6A]">•</span>
                      <span className="text-xs font-mono text-[#9BA8AB]">{item.localEdital}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-[#CCD0CF]">
                      {item.documento}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={statusVariant}>{item.status}</Badge>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#9BA8AB]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#4A5C6A] group-hover:text-[#9BA8AB]" />
                    )}
                  </div>
                </div>

                {/* Detalhamento Expansível */}
                {isExpanded && (
                  <div className="p-4 rounded border border-[#253745] bg-[#11212D] space-y-3 text-xs font-mono">
                    <div>
                      <span className="text-[#9BA8AB] block uppercase tracking-wider text-[10px]">
                        Diagnóstico Pericial:
                      </span>
                      <p className="text-[#CCD0CF] font-sans text-xs mt-1 leading-relaxed">
                        {item.diagnostico}
                      </p>
                    </div>

                    {item.trechoEdital && (
                      <div className="p-2.5 rounded bg-[#06141B] border border-[#253745] text-[#9BA8AB] italic">
                        "{item.trechoEdital}"
                      </div>
                    )}

                    {item.mitigacao && (
                      <div className="text-[#F59E0B]">
                        <strong>Orientação de Regularização:</strong> {item.mitigacao}
                      </div>
                    )}

                    {item.fonteOficialUrl && (
                      <div className="pt-1">
                        <a
                          href={item.fonteOficialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#CCD0CF] hover:underline"
                        >
                          <ExternalLink className="w-3 h-3 text-[#9BA8AB]" />
                          <span>{item.dispositivoLegal || "Consultar Texto Oficial Compilado no Planalto"}</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SEÇÃO D — RESSALVAS E PONTOS DE ATENÇÃO PREVENTIVA */}
      {ressalvaItems.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#253745]">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#F59E0B] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Ressalvas e Pontos de Atenção Preventiva ({ressalvaItems.length})</span>
            </h2>
            <span className="text-xs font-mono text-[#9BA8AB]">Falhas sanáveis</span>
          </div>

          <div className="space-y-3">
            {ressalvaItems.map((r, idx) => (
              <div key={idx} className="p-4 rounded border border-[#253745] bg-[#11212D] space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white">{r.documento}</h4>
                  <Badge variant="warning">Ressalva Sanável</Badge>
                </div>
                <p className="text-xs text-[#CCD0CF] leading-relaxed">{r.diagnostico}</p>
                {r.mitigacao && (
                  <p className="text-xs text-[#9BA8AB] border-t border-[#1c2b36] pt-2">
                    <strong className="text-[#F59E0B]">Ação de Mitigação:</strong> {r.mitigacao}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SEÇÃO E — PENDÊNCIAS ELIMINATÓRIAS & CLÁUSULAS RESTRITIVAS */}
      {armadilhas.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#253745]">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#EF4444] flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              <span>Cláusulas Restritivas & Risco de Inabilitação ({armadilhas.length})</span>
            </h2>
            <span className="text-xs font-mono text-[#9BA8AB]">Cabimento de Impugnação Art. 164</span>
          </div>

          <div className="space-y-4">
            {armadilhas.map((armadilha, idx) => (
              <div key={idx} className="p-4 rounded border border-[#253745] bg-[#11212D] space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-white">{armadilha.titulo}</h4>
                  {armadilha.impacto && <Badge variant="danger">{armadilha.impacto}</Badge>}
                </div>
                <p className="text-xs text-[#CCD0CF] leading-relaxed">{armadilha.descricao}</p>
                <div className="p-3 rounded bg-[#06141B] border border-[#253745] font-mono text-xs text-[#9BA8AB] italic">
                  "{armadilha.texto_original}"
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button variant="primary" size="sm" onClick={() => handleOpenMinuta(armadilha)} className="gap-1.5">
                    <PenLine className="w-3.5 h-3.5 text-[#CCD0CF]" />
                    <span>Gerar Minuta Art. 164</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyClause(armadilha.texto_original, idx)}
                    className="gap-1 text-xs"
                  >
                    {copiedClauseIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-[#10B981]" />
                        <span className="text-[#10B981]">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-[#9BA8AB]" />
                        <span>Copiar Trecho</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SEÇÃO F — FUNDAMENTAÇÃO LEGAL (LINKS PLANALTO) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#253745]">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[#9BA8AB]">
            Fundamentação Legal (Nova Lei de Licitações - 14.133/2021)
          </h2>
          <span className="text-xs font-mono text-[#4A5C6A]">Normas Legais Oficiais</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <a
            href="https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm#art62"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded border border-[#253745] bg-[#11212D]/40 hover:bg-[#11212D] transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="text-white font-semibold block">Art. 62 — Fases da Habilitação</span>
              <span className="text-[#9BA8AB] text-[11px] block mt-0.5">Conjunto de informações e documentos comprobatórios</span>
            </div>
            <ExternalLink className="w-4 h-4 text-[#4A5C6A] group-hover:text-white transition-colors" />
          </a>

          <a
            href="https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm#art67"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded border border-[#253745] bg-[#11212D]/40 hover:bg-[#11212D] transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="text-white font-semibold block">Art. 67 — Qualificação Técnica</span>
              <span className="text-[#9BA8AB] text-[11px] block mt-0.5">Atestados de capacidade técnica e limites de até 50%</span>
            </div>
            <ExternalLink className="w-4 h-4 text-[#4A5C6A] group-hover:text-white transition-colors" />
          </a>

          <a
            href="https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm#art68"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded border border-[#253745] bg-[#11212D]/40 hover:bg-[#11212D] transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="text-white font-semibold block">Art. 68 — Regularidade Fiscal e Trabalhista</span>
              <span className="text-[#9BA8AB] text-[11px] block mt-0.5">Certidões CND Federal, FGTS e CNDT</span>
            </div>
            <ExternalLink className="w-4 h-4 text-[#4A5C6A] group-hover:text-white transition-colors" />
          </a>

          <a
            href="https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm#art164"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded border border-[#253745] bg-[#11212D]/40 hover:bg-[#11212D] transition-colors flex items-center justify-between group"
          >
            <div>
              <span className="text-white font-semibold block">Art. 164 — Impugnação Administrativa</span>
              <span className="text-[#9BA8AB] text-[11px] block mt-0.5">Prazo legal de até 3 dias úteis antes da sessão</span>
            </div>
            <ExternalLink className="w-4 h-4 text-[#4A5C6A] group-hover:text-white transition-colors" />
          </a>
        </div>
      </section>

      {/* SEÇÃO G — PLANO DE REGULARIZAÇÃO PRIORIZADO */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#253745]">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[#9BA8AB]">
            Plano de Regularização e Ações Recomendadas
          </h2>
          <span className="text-xs font-mono text-[#4A5C6A]">Passo a Passo Pré-Disputa</span>
        </div>

        <div className="space-y-3 text-xs">
          {armadilhas.length > 0 && (
            <div className="p-3.5 rounded border border-[#253745] bg-[#11212D] flex items-start gap-3">
              <span className="font-mono font-bold text-[#EF4444] px-1.5 py-0.5 rounded bg-[rgba(239,68,68,0.12)] shrink-0">
                01. PRIORIDADE ALTA
              </span>
              <div>
                <strong className="text-white block">Avaliar Impugnação do Edital (Art. 164)</strong>
                <span className="text-[#9BA8AB] block mt-0.5 leading-relaxed">
                  Foram identificadas {armadilhas.length} cláusula(s) restritiva(s). Protocolar manifestação tempestiva perante o órgão dentro do prazo de 3 dias úteis.
                </span>
              </div>
            </div>
          )}

          {ressalvaItems.length > 0 && (
            <div className="p-3.5 rounded border border-[#253745] bg-[#11212D] flex items-start gap-3">
              <span className="font-mono font-bold text-[#F59E0B] px-1.5 py-0.5 rounded bg-[rgba(245,158,11,0.12)] shrink-0">
                02. PRIORIDADE MÉDIA
              </span>
              <div>
                <strong className="text-white block">Renovação e Saneamento de Certidões</strong>
                <span className="text-[#9BA8AB] block mt-0.5 leading-relaxed">
                  Verificar a vigência das certidões fiscais perante a Fazenda Nacional e FGTS antes do envio da proposta para evitar inabilitação por prazo expirado.
                </span>
              </div>
            </div>
          )}

          <div className="p-3.5 rounded border border-[#253745] bg-[#11212D] flex items-start gap-3">
            <span className="font-mono font-bold text-[#10B981] px-1.5 py-0.5 rounded bg-[rgba(16,185,129,0.12)] shrink-0">
              03. CONFORMIDADE
            </span>
            <div>
              <strong className="text-white block">Conferência Final da Documentação do Cofre</strong>
              <span className="text-[#9BA8AB] block mt-0.5 leading-relaxed">
                Confirmar indexação dos balanços e atestados técnicos no Portal de Compras do convocante.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO H — CONCLUSÃO EXECUTIVA */}
      <section className="space-y-4 border-t border-[#253745] pt-6">
        <h2 className="text-xs font-mono uppercase tracking-wider text-[#9BA8AB]">
          Conclusão Executiva
        </h2>
        <div className="p-4 rounded border border-[#253745] bg-[#11212D] space-y-2 text-xs text-[#CCD0CF] leading-relaxed">
          <p>
            A auditoria preventiva de conformidade indica que a empresa <strong>{companyName}</strong> apresenta aderência aos requisitos formais de qualificação do certame <strong>{data.dados_gerais.numero_edital || "Auditado"}</strong>.
          </p>
          <p className="text-[#9BA8AB]">
            Recomenda-se o cumprimento rigoroso das orientações preventivas constantes deste parecer técnico antes do encerramento do prazo de submissão de propostas.
          </p>
        </div>
      </section>

      {/* Modal da Minuta de Impugnação Art. 164 */}
      {activeMinutaText && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#11212D] border border-[#253745] w-full max-w-3xl rounded-xl shadow-2xl p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-[#253745]">
              <div className="space-y-1">
                <span className="text-xs font-mono text-[#CCD0CF]">
                  Art. 164 da Lei 14.133/2021 • Minuta de Impugnação
                </span>
                <h3 className="text-base font-semibold text-white font-display">
                  {activeMinutaTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveMinutaText(null)}
                className="text-[#9BA8AB] hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 rounded bg-[#06141B] border border-[#253745] text-[#CCD0CF] font-mono text-xs leading-relaxed whitespace-pre-wrap select-all">
              {activeMinutaText}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#253745] flex-wrap gap-2">
              <span className="text-[11px] text-[#9BA8AB] font-mono">
                Fundamentada no Art. 164 e precedentes do TCU
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setActiveMinutaText(null)}>
                  Fechar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (activeMinutaText) {
                      navigator.clipboard.writeText(activeMinutaText);
                      setCopiedMinuta(true);
                      setTimeout(() => setCopiedMinuta(false), 2000);
                    }
                  }}
                  className="gap-1.5"
                >
                  {copiedMinuta ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Copiado com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-white" />
                      <span>Copiar Petição Completa</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Upgrade do Plano Starter para Minutas */}
      {showUpgradeModalMinuta && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#11212D] border border-[#253745] w-full max-w-md rounded-xl shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-[rgba(245,158,11,0.12)] border border-[rgba(245,158,11,0.25)] flex items-center justify-center text-[#F59E0B] mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-[#F59E0B]">
                Recurso do Plano Pro / Enterprise
              </span>
              <h3 className="text-base font-semibold text-white font-display">
                Minutas Automáticas de Impugnação (Art. 164)
              </h3>
              <p className="text-xs text-[#9BA8AB] leading-relaxed">
                A geração de petições fundamentadas em acórdãos do TCU com 1 clique é exclusiva dos planos Pro e Enterprise.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <a href="/pricing">
                <Button variant="primary" size="md" className="w-full">
                  Fazer Upgrade para Plano Pro (R$ 297/mês)
                </Button>
              </a>
              <Button variant="ghost" size="sm" onClick={() => setShowUpgradeModalMinuta(false)}>
                Voltar ao Parecer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
