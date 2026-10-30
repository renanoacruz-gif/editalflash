"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  RefreshCw,
  Cpu,
  Zap,
} from "lucide-react";
import { getInternalCostStructure, InternalCostStructure } from "@/lib/cost-structure";
import { calculateBreakEvenMetrics, BreakEvenMetrics } from "@/lib/pricing-validator";

export default function AdminViabilityPage() {
  const [costStructure, setCostStructure] = useState<InternalCostStructure>(getInternalCostStructure());
  const [activeUsersCount, setActiveUsersCount] = useState<number>(5); // Mock inicial de 5 clientes
  const [growthRateSlider, setGrowthRateSlider] = useState<number>(10); // Novos usuários/mês
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentMrrCents = activeUsersCount * 29700; // 5 clientes * R$ 297,00 = R$ 1.485,00
  const metrics: BreakEvenMetrics = calculateBreakEvenMetrics(currentMrrCents, activeUsersCount);

  // Meses até a lucratividade total dependendo do slider de crescimento
  const remainingProUsersToBreakEven = Math.max(0, metrics.breakEvenProUsersYear1 - activeUsersCount);
  const monthsToProfitability = remainingProUsersToBreakEven === 0 
    ? 0 
    : (remainingProUsersToBreakEven / growthRateSlider).toFixed(1);

  // Simulação de Utilização da Assinatura de IA (Tokens consumidos vs Cap contratado)
  const [tokenUsagePercent, setTokenUsagePercent] = useState<number>(42); // 42%

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSyncFromCloud = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/admin/viability-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "external-cloud-viability-calculator",
          version: "2026.10.v2",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Pressupostos de viabilidade sincronizados com a nuvem!");
        setCostStructure(getInternalCostStructure());
      } else {
        showToast("Falha na sincronização: " + (data.error || "Erro"));
      }
    } catch (err: any) {
      showToast("Erro de conexão ao sincronizar custos.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Cores de cobertura
  const coverageBadgeClass =
    metrics.costCoveragePercent >= 120
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      : metrics.costCoveragePercent >= 80
      ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
      : "bg-rose-500/10 text-rose-400 border-rose-500/30";

  return (
    <AdminLayout activeTab="viability">
      <div className="space-y-6 max-w-6xl mx-auto font-sans">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0E1626] border border-[#2740F0] text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Banner de Aviso de Dados Desatualizados (>30 dias) */}
        {metrics.isStaleData && (
          <div className="p-4 rounded-xl bg-[var(--warn-bg)] border border-[var(--warn)]/40 text-[var(--warn-fg)] text-xs flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[var(--warn)] shrink-0" />
              <span>
                <strong>Atenção:</strong> Dados de viabilidade desatualizados há {metrics.daysSinceLastSync} dias. Recalcule margens com a Calculadora de Viabilidade Externa.
              </span>
            </div>
            <button
              onClick={handleSyncFromCloud}
              className="px-3 py-1.5 rounded-md bg-[var(--surface)] hover:bg-[var(--line)] text-[var(--ink)] font-mono text-[11px] font-bold border border-[var(--line)] shrink-0"
            >
              Recalcular Agora
            </button>
          </div>
        )}

        {/* Header do Cockpit */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--line)]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-semibold mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Painel Executivo de Viabilidade Financeira &amp; Break-Even Preditivo</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight font-display">
              Saúde Financeira &amp; Cobertura de Custos Fixos
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ink-2)] mt-1">
              Engenharia financeira baseada nos custos operacionais reais do Ano 1 (R$ 788,32/mês) e projeção Ano 5 (R$ 829,32/mês).
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-[var(--ink-2)] block">Última atualização de custos:</span>
              <span className="font-bold text-[var(--ink)]">
                {new Date(costStructure.syncMetadata.lastSyncTimestamp).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <button
              type="button"
              onClick={handleSyncFromCloud}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[var(--surface)] hover:bg-[var(--line)] text-[var(--ink)] border border-[var(--line)] transition-all font-semibold active:scale-98 shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[var(--brand)] ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Sincronizando..." : "Sincronizar Calculadora"}</span>
            </button>
          </div>
        </div>

        {/* 1. CARDS DE BREAK-EVEN & COBERTURA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Break-Even Users */}
          <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--line)] space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[var(--ink-2)] uppercase font-semibold">Break-Even de Clientes</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--brand-tint)] text-[var(--brand)] font-bold">Ano 1</span>
            </div>
            <div className="text-2xl font-bold font-mono text-[var(--ink)]">
              {metrics.breakEvenProUsersYear1} clientes Pro
            </div>
            <p className="text-xs text-[var(--ink-2)] leading-relaxed">
              Precisa de <strong>{metrics.breakEvenProUsersYear1} assinantes Pro</strong> (R$ 297/mês) ativos para pagar 100% das contas fixas.
            </p>
          </div>

          {/* Card 2: Cobertura de Custo Fixo % */}
          <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--line)] space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[var(--ink-2)] uppercase font-semibold">Cobertura de Custo Fixo</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${coverageBadgeClass}`}>
                {metrics.costCoveragePercent}%
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-[var(--ink)]">
              R$ {(metrics.currentMrrCents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-[var(--ink-2)] leading-relaxed">
              MRR atual sobre o custo fixo de R$ {(metrics.totalFixedCostsYear1Cents / 100).toFixed(2)}/mês.
            </p>
          </div>

          {/* Card 3: Margem de Contribuição Líquida */}
          <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--line)] space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[var(--ink-2)] uppercase font-semibold">Contribuição por Pro</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              R$ {(metrics.avgProContributionPerUserCents / 100).toFixed(2)}
            </div>
            <p className="text-xs text-[var(--ink-2)] leading-relaxed">
              Receita líquida após Gateway (-3,5% + R$ 0,70) e 10 análises com IA (-R$ 18,00).
            </p>
          </div>

          {/* Card 4: Meses para Lucratividade */}
          <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--line)] space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[var(--ink-2)] uppercase font-semibold">Tempo p/ Lucro Pleno</span>
              <Clock className="w-4 h-4 text-[var(--brand)]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[var(--ink)]">
              {monthsToProfitability === 0 ? "Em Lucro Pleno" : `${monthsToProfitability} meses`}
            </div>
            <p className="text-xs text-[var(--ink-2)] leading-relaxed">
              Com o ritmo atual de +{growthRateSlider} novos clientes/mês.
            </p>
          </div>
        </div>

        {/* 2. CRONÔMETRO DE IMPACTO ANTIGRAVITY & UTILIZAÇÃO DE IA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Alerta de Custo Antigravity Outubro/2030 */}
          <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--line)] space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold font-display text-[var(--ink)]">
              <Calendar className="w-4 h-4 text-[var(--warn)]" />
              <span>Transição de Plano Antigravity (Outubro de 2030)</span>
            </div>
            <div className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--ink-2)]">Contagem Regressiva:</span>
                <span className="font-bold text-[var(--brand)]">{metrics.antigravityMonthsRemaining} meses</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--ink-2)]">Salto no Custo Fixo:</span>
                <span className="font-bold text-[var(--warn-fg)]">+R$ 41,00/mês (de R$ 23,99 para R$ 64,99)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--ink-2)]">Clientes Extras Necessários:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">+{metrics.extraUsersNeededYear5} cliente Pro</span>
              </div>
            </div>
            <p className="text-[11px] text-[var(--ink-2)] leading-tight">
              Em {metrics.antigravityMonthsRemaining} meses, o custo fixo mensal sobe para R$ {(metrics.totalFixedCostsYear5Cents / 100).toFixed(2)}. O impacto é facilmente absorvido com apenas 1 cliente Pro adicional.
            </p>
          </div>

          {/* Utilização da Cota de Assinatura de IA */}
          <div className="bg-[var(--surface)] p-5 rounded-xl border border-[var(--line)] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold font-display text-[var(--ink)]">
                <Cpu className="w-4 h-4 text-[var(--brand)]" />
                <span>Utilização da Assinatura de IA (R$ 240/mês)</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${tokenUsagePercent > 80 ? "bg-rose-500/10 text-rose-400 border border-rose-500/30" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"}`}>
                {tokenUsagePercent}% Consumido
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="w-full bg-[var(--bg)] h-3 rounded-full overflow-hidden border border-[var(--line)]">
                <div
                  className={`h-full transition-all ${tokenUsagePercent > 80 ? "bg-rose-500" : "bg-[var(--brand-solid)]"}`}
                  style={{ width: `${tokenUsagePercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--ink-2)]">
                <span>0 tokens</span>
                <span>Alerta Crítico em 80%</span>
                <span>Cap Máximo da Assinatura</span>
              </div>
            </div>

            {tokenUsagePercent > 80 && (
              <p className="text-[11px] text-rose-500 font-semibold">
                Alerta de Consumo: A cota mensal de IA atingiu {tokenUsagePercent}%. Considere adquirir um pacote adicional para evitar interrupções de auditoria.
              </p>
            )}
          </div>
        </div>

        {/* 3. SIMULADOR INTERATIVO DE CRESCIMENTO */}
        <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--line)] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--ink)] font-display">
                Simulador de Aceleração Comercial
              </h3>
              <p className="text-xs text-[var(--ink-2)]">
                Ajuste o ritmo de novas aquisições de clientes por mês para recalcular o tempo de retorno financeiro.
              </p>
            </div>
            <span className="font-mono text-sm font-extrabold text-[var(--brand)] px-3 py-1 rounded bg-[var(--bg)] border border-[var(--line)]">
              +{growthRateSlider} clientes/mês
            </span>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={growthRateSlider}
              onChange={(e) => setGrowthRateSlider(Number(e.target.value))}
              className="w-full accent-[var(--brand)] cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] font-mono text-[var(--ink-2)]">
              <span>5 novos/mês (Crescimento Orgânico)</span>
              <span>25 novos/mês (Tráfego Pago Otimizado)</span>
              <span>50 novos/mês (Escala Máxima B2B)</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
