"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Clock,
  ShieldAlert,
  Award,
  CheckCircle2,
  FileCheck2,
  ArrowUpRight,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AuditedTenderHistoryItem } from "@/lib/types";

interface RoiDashboardProps {
  auditHistory: AuditedTenderHistoryItem[];
  planPriceMonthly?: number; // Preço pago pelo plano mensal (ex: R$ 297 no Pro)
}

export const RoiDashboard: React.FC<RoiDashboardProps> = ({
  auditHistory = [],
  planPriceMonthly = 297,
}) => {
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  // 1. Constantes benchmark de mercado de licitações
  // Custo médio por hora de engenheiro orçamentista / advogado especializado em licitações
  const CUSTO_HORA_ESPECIALISTA = 120; // R$ 120/hora
  // Média de horas necessárias para ler manualmente edital de 150 páginas e cruzar certidões
  const HORAS_LEITURA_MANUAL = 3.5; // 3.5 horas por certame
  // Custo de uma impugnação terceirizada feita por escritório jurídico avulso
  const CUSTO_PETICAO_JURIDICA_AVULSA = 1500; // R$ 1.500 por petição Art. 164
  // Custo médio de oportunidade / prejuízo de uma inabilitação em certame que a empresa disputou e foi desclassificada
  const CUSTO_MEDIO_PREJUIZO_INABILITACAO = 18500; // R$ 18.500 (tempo de proposta, orçamentação, visitas e perda da margem)

  // 2. Cálculos baseados nos editais reais auditados pelo usuário
  const totalAuditados = auditHistory.length;
  const totalClausulasRestritivas = auditHistory.reduce((acc, curr) => acc + (curr.armadilhasCount || 0), 0);
  const totalInabilitacoesPrevenidas = auditHistory.filter((h) => h.vereditoGeral === "ELIMINATORIA").length;

  // Economia de Horas Operacionais
  const horasEconomizadas = Math.round(totalAuditados * HORAS_LEITURA_MANUAL);
  const valorEconomizadoHoras = horasEconomizadas * CUSTO_HORA_ESPECIALISTA;

  // Economia com Minutas Jurídicas Automáticas (Art. 164)
  const peticoesElaboradas = Math.min(totalClausulasRestritivas, totalAuditados * 2);
  const valorEconomizadoJuridico = peticoesElaboradas * CUSTO_PETICAO_JURIDICA_AVULSA;

  // Prejuízos de Inabilitação Evitados (Proposta que a empresa NÃO perdeu tempo precificando por já saber que o PL/Atestado não passava)
  const valorPrejuizoEvitado = totalInabilitacoesPrevenidas * CUSTO_MEDIO_PREJUIZO_INABILITACAO;

  // Economia Total Bruta
  const economiaTotalBruta = valorEconomizadoHoras + valorEconomizadoJuridico + valorPrejuizoEvitado;

  // Múltiplo de Retorno sobre o Investimento (ROI)
  const investimentoSaaS = planPriceMonthly;
  const roiMultiplo = investimentoSaaS > 0 ? (economiaTotalBruta / investimentoSaaS).toFixed(1) : "0.0";

  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Topo Institucional do ROI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--line)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-bold mb-1 border border-emerald-500/20">
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Retorno Sobre o Investimento (ROI da Operação)</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[var(--ink)] font-display">
            Demonstrativo de Economia &amp; Eficiência Operacional
          </h2>
          <p className="text-xs text-[var(--ink-2)]">
            Cálculo financeiro do tempo de equipe poupado, honorários advocatícios evitados e inabilitações prevenidas.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-right">
            <span className="text-[10px] font-mono text-[var(--ink-2)] block uppercase">Retorno do Plano</span>
            <span className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {roiMultiplo}x o Investimento
            </span>
          </div>
        </div>
      </div>

      {/* Grid com 4 Indicadores Chave de ROI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Economia Total */}
        <div className="p-4 rounded-lg bg-[var(--bg)] border border-[var(--line)] space-y-1 shadow-xs">
          <span className="text-[11px] font-mono text-[var(--ink-2)] uppercase tracking-wider block">
            Economia Total Estimada
          </span>
          <div className="text-2xl font-bold font-mono text-[var(--ink)]">
            R$ {economiaTotalBruta.toLocaleString("pt-BR")}
          </div>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>Baseado em {totalAuditados} certames</span>
          </p>
        </div>

        {/* Card 2: Horas Pouparam de Engenharia / Jurídico */}
        <div className="p-4 rounded-lg bg-[var(--bg)] border border-[var(--line)] space-y-1 shadow-xs">
          <span className="text-[11px] font-mono text-[var(--ink-2)] uppercase tracking-wider block">
            Horas de Equipe Poupadas
          </span>
          <div className="text-2xl font-bold font-mono text-[var(--ink)]">
            {horasEconomizadas} horas
          </div>
          <p className="text-[10px] text-[var(--ink-2)] font-mono">
            Economia: R$ {valorEconomizadoHoras.toLocaleString("pt-BR")} em folha
          </p>
        </div>

        {/* Card 3: Honorários de Impugnação Poupados */}
        <div className="p-4 rounded-lg bg-[var(--bg)] border border-[var(--line)] space-y-1 shadow-xs">
          <span className="text-[11px] font-mono text-[var(--ink-2)] uppercase tracking-wider block">
            Minutas Art. 164 Geradas
          </span>
          <div className="text-2xl font-bold font-mono text-[var(--brand)]">
            {peticoesElaboradas} petições
          </div>
          <p className="text-[10px] text-[var(--ink-2)] font-mono">
            Economia: R$ {valorEconomizadoJuridico.toLocaleString("pt-BR")} em pareceres
          </p>
        </div>

        {/* Card 4: Prejuízos de Inabilitação Mitigados */}
        <div className="p-4 rounded-lg bg-[var(--bg)] border border-[var(--line)] space-y-1 shadow-xs">
          <span className="text-[11px] font-mono text-[var(--ink-2)] uppercase tracking-wider block">
            Certames Invulneráveis
          </span>
          <div className="text-2xl font-bold font-mono text-[var(--ok-fg)]">
            {totalInabilitacoesPrevenidas} riscos barrados
          </div>
          <p className="text-[10px] text-[var(--ink-2)] font-mono">
            R$ {valorPrejuizoEvitado.toLocaleString("pt-BR")} poupados em orçamentação
          </p>
        </div>
      </div>

      {/* Explicação da Metodologia de Cálculo (Toggle) */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="text-xs font-mono text-[var(--brand)] hover:underline flex items-center gap-1.5 focus:outline-none"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Como calculamos o ROI da sua operação?</span>
          {showFormulaDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showFormulaDetails && (
          <div className="mt-3 p-4 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--ink-2)] space-y-2 font-mono leading-relaxed">
            <p>
              <strong>1. Horas de Análise Manual:</strong> Estimativa de {HORAS_LEITURA_MANUAL} horas de leitura por edital completo (100 a 200 páginas) a um custo hora médio de R$ {CUSTO_HORA_ESPECIALISTA},00 para analistas seniores/engenheiros orçamentistas.
            </p>
            <p>
              <strong>2. Petições Art. 164:</strong> Custo médio de mercado de R$ {CUSTO_PETICAO_JURIDICA_AVULSA},00 por impugnação administrativa fundamentada em jurisprudência do TCU redigida por advogado externo.
            </p>
            <p>
              <strong>3. Custo de Inabilitação:</strong> Valor poupado ao evitar que a equipe passe semanas precificando, visitando locais de obra e mobilizando certidões para certames onde o PL ou o acervo técnico comprovadamente não passariam na habilitação.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
