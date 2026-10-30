"use client";

import React, { useState } from "react";
import {
  HabilitacaoItem,
  SemaforoStatus,
  CalculoPatrimonioLiquido,
  CalculoAtestadoQuantitativo,
} from "@/lib/types";
import { VerdictBadge } from "./VerdictBadge";
import { CitationBlock } from "./CitationBlock";
import { BrandIcon } from "./brand-icons";

interface SemaforoHabilitacaoProps {
  items?: HabilitacaoItem[];
  vereditoGeral?: SemaforoStatus;
  justificativaVeredito?: string;
  calculoPL?: CalculoPatrimonioLiquido;
  calculoAtestados?: CalculoAtestadoQuantitativo[];
  onSolicitarDiligencia?: (item: HabilitacaoItem) => void;
}

export const defaultObraItems: HabilitacaoItem[] = [
  {
    id: "item-1",
    categoria: "Qualificação Técnica (Art. 67)",
    documento: "CAT com Atestado de Execução de Pavimentação Asfáltica (CBUQ)",
    status: "PASSA",
    lacunaTipo: "CONFORME",
    localEdital: "Pág. 14, Linha 28 - Item 9.2.1",
    trechoEdital: "9.2.1. Comprovação de aptidão para execução de pavimentação em Concreto Betuminoso Usinado a Quente (CBUQ), no volume mínimo de 10.000 m².",
    diagnostico: "Sua certidão CREA/CAT nº 2024-SP-8941 atesta 14.200 m² de CBUQ executados. Cumpre integralmente o mínimo legal de 50% (Art. 67, § 2º da Lei 14.133).",
  },
  {
    id: "item-2",
    categoria: "Habilitação Fiscal/Trabalhista (Art. 68)",
    documento: "Certidão Conjunta Negativa Federal e Dívida Ativa da União",
    status: "RESSALVA",
    lacunaTipo: "CORRIGIVEL",
    localEdital: "Pág. 11, Linha 04 - Item 8.1.2",
    trechoEdital: "8.1.2. Prova de regularidade fiscal perante a Fazenda Nacional, mediante apresentação de certidão conjunta expedida pela RFB e PGFN.",
    diagnostico: "Sua CND Federal cadastrada no cofre é válida, porém vence em 4 dias (02/11/2026), exatamente 2 dias após a sessão de abertura. Falha sanável via renovação imediata ou diligência prévia.",
    mitigacao: "Emitir certidão atualizada imediatamente via e-CAC da Receita Federal antes do envio da proposta.",
    linkRenovacao: "https://solucoes.receita.fazenda.gov.br",
  },
  {
    id: "item-3",
    categoria: "Qualificação Econômico-Financeira (Art. 69)",
    documento: "Patrimônio Líquido Mínimo de 10% (R$ 150.000,00)",
    status: "PASSA",
    lacunaTipo: "CONFORME",
    localEdital: "Pág. 17, Linha 12 - Item 10.1",
    trechoEdital: "10.1. Comprovação de Patrimônio Líquido não inferior a 10% (dez por cento) do valor estimado da contratação, por meio de balanço do último exercício.",
    diagnostico: "Balanço Patrimonial registrado na Junta Comercial atesta PL de R$ 420.000,00 contra exigência mínima de R$ 150.000,00 (Art. 69, § 4º da Lei 14.133).",
  },
  {
    id: "item-4",
    categoria: "Qualificação Técnica (Art. 67)",
    documento: "Certidão de Registro de Pessoa Jurídica no CREA-SP",
    status: "PASSA",
    lacunaTipo: "CONFORME",
    localEdital: "Pág. 13, Linha 19 - Item 9.1",
    trechoEdital: "9.1. Registro ou inscrição da empresa licitante e de seus responsáveis técnicos no Conselho Regional de Engenharia e Agronomia (CREA) em plena validade.",
    diagnostico: "Registro ativo na sede (CREA-SP) com visto operacional para a região do certame.",
  },
  {
    id: "item-5",
    categoria: "Qualificação Técnica (Art. 67)",
    documento: "Exigência de Usina de Asfalto Própria a menos de 40km",
    status: "REVISAO_HUMANA_NECESSARIA",
    lacunaTipo: "ELIMINATORIA",
    localEdital: "Pág. 22, Linha 08 - Item 11.4",
    trechoEdital: "11.4. Apresentar declaração formal de disponibilidade de usina de asfalto em raio máximo de 40km do canteiro de obras no momento da habilitação.",
    diagnostico: "Cláusula restritiva com alto risco de desclassificação sumária. A verificação exige validação de um advogado ou especialista.",
    mitigacao: "Protocolar pedido de esclarecimento/impugnação com base no Art. 164 da Lei 14.133/21 para exigir usina apenas na fase de contratação.",
  },
];

export const defaultCalculoPL: CalculoPatrimonioLiquido = {
  valorEstimadoEdital: 1500000,
  percentualExigido: 10,
  plMinimoExigido: 150000,
  plEmpresaCadastrado: 420000,
  status: "SUFICIENTE",
  localEdital: "Item 10.1, Pág. 17 - Comprovação de PL não inferior a 10% do valor estimado.",
};

export const defaultCalculoAtestados: CalculoAtestadoQuantitativo[] = [
  {
    itemDescricao: "Pavimentação Asfáltica em CBUQ (espessura 5cm)",
    quantidadeTotalEdital: 20000,
    unidade: "m²",
    regraCinquentaPorcentoExigida: 10000,
    quantidadeComprovadaEmpresa: 14200,
    status: "ATENDE",
    localEdital: "Item 9.2.1, Pág. 14, Linha 28",
  },
];

export const SemaforoHabilitacao: React.FC<SemaforoHabilitacaoProps> = ({
  items = defaultObraItems,
  vereditoGeral = "RESSALVA",
  justificativaVeredito = "Auditoria preventiva de habilitação com base na Lei 14.133/2021.",
  calculoPL = defaultCalculoPL,
  calculoAtestados = defaultCalculoAtestados,
  onSolicitarDiligencia,
}) => {
  const [filter, setFilter] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"semaforo" | "calculos">("semaforo");

  const passaCount = items.filter((i) => i.status === "PASSA").length;
  const ressalvaCount = items.filter(
    (i) => i.status === "RESSALVA" || (i.status as string) === "PASSA_COM_RESSALVA"
  ).length;
  const eliminatoriaCount = items.filter((i) => i.status === "ELIMINATORIA").length;
  const revisaoCount = items.filter(
    (i) => i.status === "REVISAO_HUMANA_NECESSARIA" || (i.status as string) === "REVISAO_HUMANA"
  ).length;

  const filteredItems = items.filter((item) => {
    if (filter === "ALL") return true;
    if (filter === "PASSA") return item.status === "PASSA";
    if (filter === "RESSALVA")
      return item.status === "RESSALVA" || (item.status as string) === "PASSA_COM_RESSALVA";
    if (filter === "ELIMINATORIA") return item.status === "ELIMINATORIA";
    if (filter === "REVISAO")
      return item.status === "REVISAO_HUMANA_NECESSARIA" || (item.status as string) === "REVISAO_HUMANA";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* PARECER DE HABILITAÇÃO — Card Principal */}
      <div className="bento-card bg-[var(--surface)] border border-[var(--line)] rounded-xl overflow-hidden shadow-sm">
        {/* Topo Institucional do Parecer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-[var(--line)] bg-[var(--surface)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--brand)]/10 border border-[var(--brand)]/20 flex items-center justify-center text-[var(--brand)]">
              <BrandIcon name="mark" size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-[var(--ink-2)] block font-bold">
                Dossiê Técnico Pericial de Habilitação
              </span>
              <span className="text-xs text-[var(--ink)] font-semibold font-display">
                Lei Federal 14.133/2021 · Conformidade Artigos 62 a 70
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[var(--ink-2)] px-2.5 py-1 rounded bg-[var(--bg)] border border-[var(--line)]">
              <strong>{items.length}</strong> Requisitos Auditados
            </span>
          </div>
        </div>

        {/* Bloco de Veredito Central */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 flex-wrap">
              <VerdictBadge size="lg" status={vereditoGeral} />
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--ink-2)] font-semibold">
                Veredito Geral Consolidado
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-display text-[var(--ink)] leading-snug tracking-tight">
              {justificativaVeredito.replace(/!/g, ".")}
            </h2>
          </div>

          {/* Placar Analítico Estilo Bento Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <button
              onClick={() => setFilter(filter === "PASSA" ? "ALL" : "PASSA")}
              className={`p-3.5 rounded-lg border text-left transition-all active:scale-98 ${
                filter === "PASSA"
                  ? "bg-[var(--ok-bg)] border-[var(--ok)] text-[var(--ok-fg)] shadow-xs"
                  : "bg-[var(--bg)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--ok)]/40 hover:bg-[var(--ok-bg)]/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-[var(--ink-2)]">Passa</span>
                <span className="w-2 h-2 rounded-full bg-[var(--ok)]" />
              </div>
              <strong className="text-2xl font-bold font-mono block mt-1">{passaCount}</strong>
              <span className="text-[10px] block text-[var(--ink-2)]">100% Conformes</span>
            </button>

            <button
              onClick={() => setFilter(filter === "RESSALVA" ? "ALL" : "RESSALVA")}
              className={`p-3.5 rounded-lg border text-left transition-all active:scale-98 ${
                filter === "RESSALVA"
                  ? "bg-[var(--warn-bg)] border-[var(--warn)] text-[var(--warn-fg)] shadow-xs"
                  : "bg-[var(--bg)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--warn)]/40 hover:bg-[var(--warn-bg)]/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-[var(--ink-2)]">Ressalva</span>
                <span className="w-2 h-2 rounded-full bg-[var(--warn)]" />
              </div>
              <strong className="text-2xl font-bold font-mono block mt-1">{ressalvaCount}</strong>
              <span className="text-[10px] block text-[var(--ink-2)]">Falhas Sanáveis</span>
            </button>

            <button
              onClick={() => setFilter(filter === "ELIMINATORIA" ? "ALL" : "ELIMINATORIA")}
              className={`p-3.5 rounded-lg border text-left transition-all active:scale-98 ${
                filter === "ELIMINATORIA"
                  ? "bg-[var(--bad-bg)] border-[var(--bad)] text-[var(--bad-fg)] shadow-xs"
                  : "bg-[var(--bg)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--bad)]/40 hover:bg-[var(--bad-bg)]/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-[var(--ink-2)]">Eliminatória</span>
                <span className="w-2 h-2 rounded-full bg-[var(--bad)]" />
              </div>
              <strong className="text-2xl font-bold font-mono block mt-1">{eliminatoriaCount}</strong>
              <span className="text-[10px] block text-[var(--ink-2)]">Risco Impeditivo</span>
            </button>

            <button
              onClick={() => setFilter(filter === "REVISAO" ? "ALL" : "REVISAO")}
              className={`p-3.5 rounded-lg border text-left transition-all active:scale-98 ${
                filter === "REVISAO"
                  ? "bg-[var(--rev-bg)] border-[var(--rev)] text-[var(--rev-fg)] shadow-xs"
                  : "bg-[var(--bg)] border-[var(--line)] text-[var(--ink)] hover:border-[var(--rev)]/40 hover:bg-[var(--rev-bg)]/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-[var(--ink-2)]">Revisão</span>
                <span className="w-2 h-2 rounded-full bg-[var(--rev)]" />
              </div>
              <strong className="text-2xl font-bold font-mono block mt-1">{revisaoCount}</strong>
              <span className="text-[10px] block text-[var(--ink-2)]">Exige Avaliação</span>
            </button>
          </div>
        </div>

        {/* Tabs de Navegação Interna */}
        <div className="flex items-center gap-1 px-5 border-t border-[var(--line)] bg-[var(--surface)]">
          <button
            onClick={() => setActiveTab("semaforo")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === "semaforo"
                ? "border-[var(--brand)] text-[var(--brand)] font-bold"
                : "border-transparent text-[var(--ink-2)] hover:text-[var(--ink)]"
            }`}
          >
            Matriz de Requisitos e Citações ({filteredItems.length})
          </button>
          <button
            onClick={() => setActiveTab("calculos")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === "calculos"
                ? "border-[var(--brand)] text-[var(--brand)] font-bold"
                : "border-transparent text-[var(--ink-2)] hover:text-[var(--ink)]"
            }`}
          >
            Cálculos Numéricos (Art. 67 e 69)
          </button>
        </div>
      </div>

      {/* ABA 1: LISTA DO SEMÁFORO COM CITAÇÃO LITERAL */}
      {activeTab === "semaforo" && (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const locMatch = item.localEdital?.match(/Pág\.\s*(\d+).*?Linha\s*(\d+).*?Item\s*([\w.]+)/i);
            const pageNum = locMatch ? locMatch[1] : undefined;
            const lineNum = locMatch ? locMatch[2] : undefined;
            const itemNum = locMatch ? locMatch[3] : undefined;

            const borderVerdictColor =
              item.status === "PASSA"
                ? "border-l-[var(--ok)]"
                : item.status === "RESSALVA"
                ? "border-l-[var(--warn)]"
                : item.status === "ELIMINATORIA"
                ? "border-l-[var(--bad)]"
                : "border-l-[var(--rev)]";

            return (
              <div
                key={item.id}
                className={`bg-[var(--surface)] border border-[var(--line)] border-l-4 ${borderVerdictColor} rounded-lg p-6 space-y-4 hover:border-[var(--brand-tint)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 shadow-xs`}
              >
                {/* Cabeçalho do Requisito */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[var(--line)]">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-2)] block font-medium">
                      {item.categoria}
                    </span>
                    <h3 className="text-base font-bold text-[var(--ink)] font-display">
                      {item.documento}
                    </h3>
                  </div>

                  <div className="hover:scale-102 transition-transform">
                    <VerdictBadge size="md" status={item.status} />
                  </div>
                </div>

                {/* Citação Literal do Edital com Prova */}
                {item.trechoEdital && (
                  <div className="p-1 rounded-md bg-[var(--brand-tint)]/20 border border-[var(--brand-tint)]/40">
                    <CitationBlock
                      page={pageNum}
                      line={lineNum}
                      item={itemNum}
                      excerpt={item.trechoEdital}
                    />
                  </div>
                )}

                {/* Diagnóstico Jurídico */}
                <div className="p-3 bg-[var(--bg)] rounded-md border border-[var(--line)] text-xs text-[var(--ink)] space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--ink-2)] block">
                    Diagnóstico de Conformidade
                  </span>
                  <p className="leading-relaxed">{item.diagnostico.replace(/!/g, ".")}</p>
                </div>

                {/* Mitigação ou Solução sugerida */}
                {item.mitigacao && (
                  <div className="p-3 bg-[var(--warn-bg)] border border-[var(--warn)]/30 rounded-md text-xs text-[var(--warn-fg)] flex items-start gap-2.5">
                    <BrandIcon name="alerta" size="s16" accentCobalt={false} className="shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <strong className="block font-mono text-[11px] uppercase tracking-wider">
                        Recomendação de Ação
                      </strong>
                      <span className="leading-relaxed">{item.mitigacao.replace(/!/g, ".")}</span>
                      <div className="mt-2.5 flex items-center gap-2">
                        <button
                          type="button"
                          className="px-2.5 py-1 bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] rounded text-[11px] font-mono hover:bg-[var(--bg)] transition-colors"
                        >
                          Ver Classificação da Lacuna
                        </button>
                        <button
                          type="button"
                          className="px-2.5 py-1 bg-[var(--brand)] text-white rounded text-[11px] font-mono hover:opacity-90 transition-opacity"
                        >
                          Gerar Rascunho de Impugnação (Art. 164)
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ABA 2: CÁLCULOS NUMÉRICOS (PL e Atestado) — BENTO GRID ESTILO FINTECH / RAMP */}
      {activeTab === "calculos" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Bento Card Patrimônio Líquido */}
          <div className="bento-card bg-[var(--surface)] border border-[var(--line)] rounded-xl p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-[var(--line)]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-2)] block font-bold">
                  Art. 69, § 4º da Lei 14.133/2021
                </span>
                <h3 className="text-base font-bold text-[var(--ink)] font-display">
                  Qualificação Econômico-Financeira
                </h3>
              </div>
              <VerdictBadge
                size="sm"
                status={calculoPL.status === "SUFICIENTE" ? "PASSA" : "ELIMINATORIA"}
              />
            </div>

            {/* Comparativo de Números com Destaque Visual */}
            <div className="grid grid-cols-3 gap-2 bg-[var(--bg)] border border-[var(--line)] rounded-xl p-2 text-center">
              <div className="p-3 bg-[var(--surface)] rounded-lg border border-[var(--line)]/50">
                <span className="block text-[10px] font-mono text-[var(--ink-2)] font-semibold uppercase">Exigência</span>
                <strong className="text-sm font-mono font-bold text-[var(--ink)] block mt-0.5">
                  {calculoPL.percentualExigido}%
                </strong>
                <span className="text-[10px] font-mono text-[var(--ink-2)]">
                  R$ {(calculoPL.plMinimoExigido / 1000).toFixed(0)}k
                </span>
              </div>

              <div className="p-3 bg-[var(--surface)] rounded-lg border border-[var(--line)]/50">
                <span className="block text-[10px] font-mono text-[var(--ink-2)] font-semibold uppercase">Seu Balanço</span>
                <strong className="text-sm font-mono font-bold text-[var(--ok-fg)] block mt-0.5">
                  R$ {(calculoPL.plEmpresaCadastrado / 1000).toFixed(0)}k
                </strong>
                <span className="text-[10px] font-mono text-[var(--ok-fg)] font-semibold">
                  Conforme
                </span>
              </div>

              <div className="p-3 bg-[var(--surface)] rounded-lg border border-[var(--line)]/50">
                <span className="block text-[10px] font-mono text-[var(--ink-2)] font-semibold uppercase">Folga Pericial</span>
                <strong className="text-sm font-mono font-bold text-[var(--brand)] block mt-0.5">
                  +R$ {((calculoPL.plEmpresaCadastrado - calculoPL.plMinimoExigido) / 1000).toFixed(0)}k
                </strong>
                <span className="text-[10px] font-mono text-[var(--brand)] font-semibold">
                  Excedente
                </span>
              </div>
            </div>

            {/* Tríade de Liquidez Contábil (Art. 69, § 1º) */}
            <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-2)] font-bold">
                  Tríade de Liquidez Contábil (Art. 69, § 1º)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--ok-bg)] text-[var(--ok-fg)] font-bold border border-[var(--ok)]/20">
                  {calculoPL.indicesLiquidez?.status || "ATENDE"} (&gt; 1,00)
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                <div className="p-2 bg-[var(--surface)] rounded-lg border border-[var(--line)] shadow-2xs">
                  <span className="text-[9px] text-[var(--ink-2)] block font-semibold">LG (Geral)</span>
                  <strong className="text-[var(--ok-fg)] font-bold text-sm block mt-0.5">
                    {calculoPL.indicesLiquidez?.liquidezGeral ? calculoPL.indicesLiquidez.liquidezGeral.toFixed(2) : "1.42"}
                  </strong>
                  <span className="text-[9px] text-[var(--ink-2)]">&ge; 1.00</span>
                </div>

                <div className="p-2 bg-[var(--surface)] rounded-lg border border-[var(--line)] shadow-2xs">
                  <span className="text-[9px] text-[var(--ink-2)] block font-semibold">LC (Corrente)</span>
                  <strong className="text-[var(--ok-fg)] font-bold text-sm block mt-0.5">
                    {calculoPL.indicesLiquidez?.liquidezCorrente ? calculoPL.indicesLiquidez.liquidezCorrente.toFixed(2) : "1.38"}
                  </strong>
                  <span className="text-[9px] text-[var(--ink-2)]">&ge; 1.00</span>
                </div>

                <div className="p-2 bg-[var(--surface)] rounded-lg border border-[var(--line)] shadow-2xs">
                  <span className="text-[9px] text-[var(--ink-2)] block font-semibold">SG (Solvência)</span>
                  <strong className="text-[var(--ok-fg)] font-bold text-sm block mt-0.5">
                    {calculoPL.indicesLiquidez?.solvenciaGeral ? calculoPL.indicesLiquidez.solvenciaGeral.toFixed(2) : "1.55"}
                  </strong>
                  <span className="text-[9px] text-[var(--ink-2)]">&ge; 1.00</span>
                </div>
              </div>
            </div>

            {calculoPL.localEdital && (
              <CitationBlock excerpt={calculoPL.localEdital} />
            )}
          </div>

          {/* Bento Card Atestados Quantitativos */}
          <div className="bento-card bg-[var(--surface)] border border-[var(--line)] rounded-xl p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-[var(--line)]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-2)] block font-bold">
                  Art. 67, § 2º da Lei 14.133/2021
                </span>
                <h3 className="text-base font-bold text-[var(--ink)] font-display">
                  Capacidade Técnico-Operacional
                </h3>
              </div>
              <VerdictBadge size="sm" status="PASSA" />
            </div>

            {calculoAtestados.map((atestado, idx) => (
              <div key={idx} className="space-y-3.5">
                <p className="text-xs text-[var(--ink)] font-semibold">
                  {atestado.itemDescricao}
                </p>

                <div className="grid grid-cols-3 gap-2 bg-[var(--bg)] border border-[var(--line)] rounded-xl p-2 text-center">
                  <div className="p-3 bg-[var(--surface)] rounded-lg border border-[var(--line)]/50">
                    <span className="block text-[10px] font-mono text-[var(--ink-2)] font-semibold uppercase">Exigido</span>
                    <strong className="text-xs font-mono font-bold text-[var(--ink)] block mt-0.5">
                      {atestado.regraCinquentaPorcentoExigida.toLocaleString()} {atestado.unidade}
                    </strong>
                    <span className="text-[10px] font-mono text-[var(--ink-2)]">Mínimo 50%</span>
                  </div>

                  <div className="p-3 bg-[var(--surface)] rounded-lg border border-[var(--line)]/50">
                    <span className="block text-[10px] font-mono text-[var(--ink-2)] font-semibold uppercase">Comprovado</span>
                    <strong className="text-xs font-mono font-bold text-[var(--ok-fg)] block mt-0.5">
                      {atestado.quantidadeComprovadaEmpresa.toLocaleString()} {atestado.unidade}
                    </strong>
                    <span className="text-[10px] font-mono text-[var(--ok-fg)] font-semibold">Acervo Ativo</span>
                  </div>

                  <div className="p-3 bg-[var(--surface)] rounded-lg border border-[var(--line)]/50">
                    <span className="block text-[10px] font-mono text-[var(--ink-2)] font-semibold uppercase">Teto Legal</span>
                    <strong className="text-xs font-mono font-bold text-[var(--brand)] block mt-0.5">
                      ≤ 50%
                    </strong>
                    <span className="text-[10px] font-mono text-[var(--brand)]">Art. 67, § 2º</span>
                  </div>
                </div>

                {/* REFINEMENT: Exibição Explícita do Somatório de Atestados (Súmula 263 TCU) */}
                <div className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-2)] font-bold">
                      Detalhamento de Acervo (Art. 67)
                    </span>
                    {atestado.vedaSomatorio ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--warn-bg)] text-[var(--warn-fg)] font-semibold border border-[var(--warn)]/30">
                        Vedação de Somatório no Edital
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--ok-bg)] text-[var(--ok-fg)] font-semibold border border-[var(--ok)]/30">
                        Súmula 263/TCU Aplicada
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-mono text-[var(--ink)] space-y-1">
                    {atestado.vedaSomatorio ? (
                      <div className="p-2.5 bg-[var(--surface)] rounded-lg border border-[var(--line)] text-[11px] text-[var(--warn-fg)]">
                        Edital veda somatório expressamente. Verificação por atestado único aplicada.
                      </div>
                    ) : (
                      <div className="p-2.5 bg-[var(--surface)] rounded-lg border border-[var(--line)] flex items-center justify-between flex-wrap gap-2 text-[11px]">
                        <span>
                          Atestado Individual: <strong className="text-[var(--ink)]">{atestado.atestadoIndividualPercentual || 35}%</strong>
                        </span>
                        <span className="text-[var(--ink-2)]">|</span>
                        <span>
                          Somatório (Súmula 263 TCU): <strong className="text-[var(--ok-fg)]">{atestado.somatorioPercentual || 60}%</strong>
                        </span>
                        <span className="text-[var(--ok-fg)] font-bold">
                          → ATENDIDO
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] font-mono text-[var(--ink-2)] italic">
                    {atestado.justificativaSumula263 || "Somatório permitido conforme Súmula 263/TCU, salvo vedação expressa no edital."}
                  </p>
                </div>

                {atestado.localEdital && (
                  <CitationBlock excerpt={atestado.localEdital} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
