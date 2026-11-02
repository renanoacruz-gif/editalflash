"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  FileCheck2,
} from "lucide-react";
import { cenarioExemplo, getEstatisticasExemplo } from "@/data/exemplo";

export const InteractiveParecerPreview: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  const [activeTab, setActiveTab] = useState<"todos" | "conformes" | "ressalvas">("todos");

  const auditoriaItems = cenarioExemplo.requisitos;
  const stats = getEstatisticasExemplo(auditoriaItems);

  const filtered = auditoriaItems.filter((item) => {
    if (activeTab === "conformes") return item.status === "PASSA";
    if (activeTab === "ressalvas") return item.status === "RESSALVA";
    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Moldura de Visualizador de Documento Interativo */}
      <div className="bg-white border border-[var(--line)] rounded-2xl shadow-xl overflow-hidden text-left">
        {/* Barra Superior do Visualizador (Estilo Document Viewer) */}
        <div className="px-5 py-3.5 border-b border-[var(--line)] bg-[#FAFAFA] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[var(--ink)]/70">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-[var(--ink)] font-semibold text-xs ml-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[var(--flash)]" />
              <span>Parecer_Preliminar_Concorrencia_042_2026.pdf</span>
            </span>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[var(--mist)] text-[var(--ink)] border border-[var(--line)]">
              Exemplo ilustrativo
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center rounded-lg border border-[var(--line)] bg-white p-0.5 text-xs font-mono shadow-xs">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  currentPage === 1
                    ? "bg-[var(--ink)] text-white font-bold"
                    : "text-[var(--ink)]/70 hover:text-[var(--ink)] hover:bg-[var(--mist)]/40"
                }`}
              >
                Pág. 1
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(2)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  currentPage === 2
                    ? "bg-[var(--ink)] text-white font-bold"
                    : "text-[var(--ink)]/70 hover:text-[var(--ink)] hover:bg-[var(--mist)]/40"
                }`}
              >
                Pág. 2
              </button>
            </div>
          </div>
        </div>

        {/* Viewport da Folha A4 Completa: Sem scroll interno, sombra suave e rotação responsiva */}
        <div className="p-4 sm:p-8 md:p-10 bg-[var(--mist)]/30 flex justify-center">
          {/* Folha A4: rotate-[-1deg] com transição suave ao hover */}
          <div className="w-full max-w-3xl bg-white text-[var(--ink)] p-6 sm:p-10 md:p-12 rounded-xl shadow-xl hover:shadow-2xl border border-[var(--line)] transition-all duration-300 md:rotate-[-1deg] md:hover:rotate-0 transform origin-center space-y-6 font-sans">
            
            {currentPage === 1 ? (
              /* ================== PÁGINA 1 ================== */
              <div className="space-y-6">
                {/* Cabeçalho Oficial do Parecer */}
                <div className="border-b-2 border-[var(--ink)] pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--flash)]">
                      PARECER TÉCNICO DE HABILITAÇÃO PRELIMINAR (LEI 14.133/2021)
                    </span>
                    <span className="text-xs font-mono text-[var(--ink)]/60">
                      Emissão: {cenarioExemplo.edital.dataEmissao}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-[var(--ink)] mt-1.5">
                    PARECER TÉCNICO PRELIMINAR DE HABILITAÇÃO
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-[13px] text-[var(--ink)]/80 mt-3 font-mono">
                    <div>Licitante: <strong className="text-[var(--ink)]">{cenarioExemplo.licitante.razaoSocial}</strong></div>
                    <div>CNPJ: <strong className="text-[var(--ink)]">{cenarioExemplo.licitante.cnpj}</strong></div>
                    <div>Edital: <strong className="text-[var(--ink)]">{cenarioExemplo.edital.numero}</strong></div>
                    <div>Órgão: <strong className="text-[var(--ink)]">{cenarioExemplo.edital.orgao}</strong></div>
                  </div>
                </div>

                {/* Quadro de Síntese Executiva em 4 Colunas + Veredito Geral */}
                <div className="bg-[var(--paper)] p-4 sm:p-5 rounded-xl border border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="grid grid-cols-4 gap-3 w-full sm:w-auto text-center font-mono">
                    <div className="border-r border-[var(--line)] pr-2">
                      <div className="text-xs uppercase text-[var(--ink)]/60 font-bold">Conformes</div>
                      <div className="text-xl font-bold text-[var(--ok)]">{stats.conformes}</div>
                    </div>
                    <div className="border-r border-[var(--line)] pr-2">
                      <div className="text-xs uppercase text-[var(--ink)]/60 font-bold">Ressalvas</div>
                      <div className="text-xl font-bold text-amber-600">{stats.ressalvas}</div>
                    </div>
                    <div className="border-r border-[var(--line)] pr-2">
                      <div className="text-xs uppercase text-[var(--ink)]/60 font-bold">Eliminatórias</div>
                      <div className="text-xl font-bold text-[var(--bad)]">{stats.eliminatorias}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase text-[var(--ink)]/60 font-bold">Revisões</div>
                      <div className="text-xl font-bold text-[var(--ink)]/70">{stats.revisões}</div>
                    </div>
                  </div>

                  <div className="sm:border-l sm:border-[var(--line)] sm:pl-4 w-full sm:w-auto text-center sm:text-right">
                    <span className="inline-block px-3.5 py-1.5 rounded-lg bg-[var(--ok)] text-white font-mono text-xs font-bold uppercase shadow-xs">
                      HABILITAÇÃO PROVÁVEL (PASSA)
                    </span>
                    <span className="block text-xs text-[var(--ink)]/60 font-mono mt-1">
                      Sem riscos impeditivos de inabilitação
                    </span>
                  </div>
                </div>

                {/* Abas de Filtro Interativo Dentro do Próprio Documento */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] pb-2.5">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("todos")}
                      className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                        activeTab === "todos"
                          ? "bg-[var(--ink)] text-white font-bold"
                          : "text-[var(--ink)]/70 hover:bg-[var(--mist)]/50"
                      }`}
                    >
                      Todos ({stats.total})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("conformes")}
                      className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                        activeTab === "conformes"
                          ? "bg-[var(--ok)] text-white font-bold"
                          : "text-[var(--ink)]/70 hover:bg-[var(--mist)]/50"
                      }`}
                    >
                      Conformes ({stats.conformes})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("ressalvas")}
                      className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                        activeTab === "ressalvas"
                          ? "bg-amber-600 text-white font-bold"
                          : "text-[var(--ink)]/70 hover:bg-[var(--mist)]/50"
                      }`}
                    >
                      Ressalvas ({stats.ressalvas})
                    </button>
                  </div>

                  <span className="text-xs font-mono text-[var(--ink)]/60">
                    5 requisitos auditados
                  </span>
                </div>

                {/* Tabela Pericial Responsiva (Tabela em telas ≥ md, Lista de Cartões em telas &lt; md / 390px) */}
                
                {/* 1. Visão Tabela Desktop / Tablet (md+) */}
                <div className="hidden md:block border border-[var(--line)] rounded-xl overflow-hidden">
                  <div className="bg-[var(--paper)] text-[var(--ink)] p-3 font-bold font-mono text-xs grid grid-cols-12 gap-2 border-b border-[var(--line)] uppercase">
                    <span className="col-span-3">Requisito &amp; Artigo</span>
                    <span className="col-span-3">Local no Edital</span>
                    <span className="col-span-4">Diagnóstico Pericial</span>
                    <span className="col-span-2 text-right">Veredito</span>
                  </div>

                  <div className="divide-y divide-[var(--line)]">
                    {filtered.map((item, idx) => (
                      <div key={idx} className="p-3.5 grid grid-cols-12 gap-2 items-center hover:bg-[var(--mist)]/20 transition-colors">
                        <div className="col-span-3">
                          <span className="text-xs font-mono text-[var(--flash)] font-bold block">
                            {item.artigo}
                          </span>
                          <strong className="text-[13px] text-[var(--ink)] block leading-snug">{item.exigencia}</strong>
                        </div>

                        <div className="col-span-3 font-mono text-xs text-[var(--ink)]/70">
                          {item.localEdital}
                        </div>

                        <div className="col-span-4 text-[13px] text-[var(--ink)] leading-relaxed font-sans">
                          {item.diagnostico}
                        </div>

                        <div className="col-span-2 text-right">
                          <span className={`inline-block px-2.5 py-1 rounded-md border text-xs font-mono font-bold ${item.badgeBg}`}>
                            {item.statusLabel}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Visão Lista de Cartões Mobile (&lt; md / 390px) sem overflow horizontal */}
                <div className="md:hidden space-y-3">
                  {filtered.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--paper)] space-y-2 text-left"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-[var(--flash)]">
                          {item.artigo}
                        </span>
                        <span className={`px-2 py-0.5 rounded border text-xs font-mono font-bold ${item.badgeBg}`}>
                          {item.statusLabel}
                        </span>
                      </div>
                      <div>
                        <strong className="text-[14px] text-[var(--ink)] block leading-snug">
                          {item.exigencia}
                        </strong>
                        <span className="text-xs font-mono text-[var(--ink)]/60 block mt-0.5">
                          {item.localEdital}
                        </span>
                      </div>
                      <p className="text-[13px] text-[var(--ink)]/90 leading-relaxed font-sans pt-1 border-t border-[var(--line)]">
                        {item.diagnostico}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Conclusão e Rodapé da Página 1 */}
                <div className="pt-3 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--ink)]/60 font-mono">
                  <p>
                    Documento de suporte técnico à decisão emitido pelo EditalFlash.
                  </p>
                  <div className="flex items-center gap-3 shrink-0">
                    <span>Hash: {cenarioExemplo.edital.hashDocumento}</span>
                    <span>•</span>
                    <span className="font-bold text-[var(--ink)]">Página 1 de 2</span>
                  </div>
                </div>
              </div>
            ) : (
              /* ================== PÁGINA 2 ================== */
              <div className="space-y-6 text-left">
                {/* Cabeçalho da Página 2 */}
                <div className="border-b-2 border-[var(--ink)] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--flash)] block">
                      PARECER TÉCNICO PRELIMINAR • CONCLUSÃO &amp; PLANO DE AÇÃO
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight text-[var(--ink)] mt-1">
                      CONCLUSÕES &amp; CONDUTAS RECOMENDADAS
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-[var(--ink)]/60 shrink-0">
                    Edital: {cenarioExemplo.edital.numero}
                  </span>
                </div>

                {/* Resumo da Análise Técnica */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-2">
                    <h3 className="font-display font-bold text-sm text-[var(--ink)] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[var(--ok)]" />
                      <span>1. Veredito Geral de Habilitação Jurídico-Fiscal</span>
                    </h3>
                    <p className="text-[13px] sm:text-[14px] text-[var(--ink)]/80 leading-relaxed font-sans">
                      A empresa <strong>{cenarioExemplo.licitante.razaoSocial}</strong> apresenta solidez documental e contábil compatível com o objeto licitado. O patrimônio líquido apurado de <strong>{cenarioExemplo.metricas.plApuradoValorFormatado}</strong> supera a exigência mínima regulamentar com margem prudencial de <strong>+{cenarioExemplo.metricas.plFolgaValorFormatado}</strong> (+32%).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                    <h3 className="font-display font-bold text-sm text-amber-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                      <span>2. Ponto de Atenção Preventivo (Ressalva Ativa)</span>
                    </h3>
                    <p className="text-[13px] sm:text-[14px] text-amber-950 leading-relaxed font-sans">
                      A Certidão Conjunta Federal perante a RFB/PGFN encontra-se com prazo de expiração estimado em <strong>{cenarioExemplo.metricas.cndFederalDiasRestantes} dias úteis</strong>. Recomenda-se a reemissão preventiva no portal e-CAC para mitigar riscos de descontinuidade no dia do certame.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--paper)] border border-[var(--line)] space-y-2">
                    <h3 className="font-display font-bold text-sm text-[var(--ink)] flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-[var(--flash)]" />
                      <span>3. Capacidade Técnico-Operacional (Súmula 263 TCU)</span>
                    </h3>
                    <p className="text-[13px] sm:text-[14px] text-[var(--ink)]/80 leading-relaxed font-sans">
                      Atestados técnicos em acervo cobrem amplamente o quantitativo exigido (<strong>{cenarioExemplo.metricas.atestadoComprovado}</strong> frente à exigência de <strong>{cenarioExemplo.metricas.atestadoExigido}</strong>), assegurando a defensabilidade jurídica da proposta.
                    </p>
                  </div>
                </div>

                {/* Assinatura Digital & Hash pericial */}
                <div className="pt-6 border-t border-[var(--line)] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-[var(--ink)]/70">
                  <div className="p-3 rounded-lg bg-[var(--paper)] border border-[var(--line)]">
                    <div className="text-[11px] uppercase text-[var(--ink)]/60 font-bold mb-1">Assinatura do Laudo</div>
                    <div className="text-[var(--ink)] font-semibold">Motor Pericial EditalFlash</div>
                    <div className="text-[var(--ink)]/60 text-[11px]">Conformidade Lei 14.133/2021</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[var(--paper)] border border-[var(--line)]">
                    <div className="text-[11px] uppercase text-[var(--ink)]/60 font-bold mb-1">Integridade do Laudo</div>
                    <div className="text-[var(--ink)] font-semibold truncate">{cenarioExemplo.edital.hashDocumento}</div>
                    <div className="text-[var(--ink)]/60 text-[11px]">Timestamp ICP-Brasil 2026</div>
                  </div>
                </div>

                {/* Rodapé da Página 2 */}
                <div className="pt-3 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--ink)]/60 font-mono">
                  <p>
                    EditalFlash Auditoria Preventiva de Editais.
                  </p>
                  <div className="flex items-center gap-3 shrink-0">
                    <span>Hash: {cenarioExemplo.edital.hashDocumento}</span>
                    <span>•</span>
                    <span className="font-bold text-[var(--ink)]">Página 2 de 2</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controles e CTAs Inferiores: Troca de Página + Botão Grande "Baixar Parecer em PDF" */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {currentPage === 1 ? (
            <button
              type="button"
              onClick={() => setCurrentPage(2)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--mist)]/40 font-semibold text-sm transition-all shadow-xs"
            >
              <span>Ver página 2</span>
              <ChevronRight className="w-4 h-4 text-[var(--flash)]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--mist)]/40 font-semibold text-sm transition-all shadow-xs"
            >
              <ChevronLeft className="w-4 h-4 text-[var(--flash)]" />
              <span>Voltar para página 1</span>
            </button>
          )}
        </div>

        <a
          href="/assets/exemplo-parecer-editalflash.pdf"
          download="exemplo-parecer-editalflash.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[var(--flash)] hover:brightness-110 active:scale-98 text-white font-bold text-[15px] transition-all shadow-lg shadow-[var(--flash)]/20"
        >
          <Download className="w-4 h-4" />
          <span>Baixar Parecer em PDF</span>
        </a>
      </div>
    </div>
  );
};
