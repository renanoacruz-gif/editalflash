"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { adminStore } from "@/lib/admin-store";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import {
  DollarSign,
  TrendingUp,
  Users,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Target,
  FileCheck,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [tenants, setTenants] = useState<any[]>([]);

  useEffect(() => {
    const data = adminStore.getSaaSMetrics();
    const allTenants = adminStore.getTenants();
    setMetrics(data);
    setTenants(allTenants);
  }, []);

  if (!metrics) {
    return (
      <AdminLayout activeTab="dashboard">
        <div className="p-8 text-slate-400 text-xs">Carregando métricas reais do SaaS...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="dashboard">
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Header: SuperAdmin & Founder Cockpit */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 tracking-wide uppercase">
                Founder Cockpit • SuperAdmin
              </span>
              <span className="text-xs text-slate-400 font-mono">Governança & RLS Estrito</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight legal-serif">
              Contabilidade da Plataforma & SaaS Metrics
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Visão agregada de todos os tenants, performance financeira e conformidade da Lei 14.133/2021.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors shadow-sm"
            >
              <Users className="w-4 h-4" />
              <span>Gerenciar Tenants ({metrics.totalTenants})</span>
            </Link>
          </div>
        </div>

        {/* PILAR 2: SaaS METRICS & CONTABILIDADE DA PLATAFORMA */}
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-3 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pilar 2: Indicadores Executivos em Tempo Real</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: MRR */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">MRR Recorrente</span>
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white font-mono">
                  <AnimatedNumber value={metrics.mrr} prefix="R$ " suffix=",00" />
                </span>
                <span className="text-[11px] font-semibold text-emerald-400">/mês</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {metrics.activeSubs} assinaturas ativas no Plano Pro (R$ 197/mês)
              </p>
            </div>

            {/* Metric 2: Receita de Créditos e Setup */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Receita de Setups & Avulsos</span>
                <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white font-mono">
                  R$ {metrics.totalAdHocRevenue.toLocaleString("pt-BR")},00
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {metrics.setupsCount} setups de R$ 497 + créditos avulsos (R$ 29/análise)
              </p>
            </div>

            {/* Metric 3: Assinaturas Ativas vs Inadimplentes vs Trial */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Status dos Tenants</span>
                <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-2xl font-bold text-white font-mono">{metrics.activeSubs}</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  Ativas
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-xs font-bold text-amber-400 font-mono">{metrics.pastDueSubs}</span>
                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
                  Atraso
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-xs font-bold text-blue-400 font-mono">{metrics.trialSubs}</span>
                <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded">
                  Trial
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Total de {metrics.totalTenants} licitantes cadastrados na base
              </p>
            </div>

            {/* Metric 4: Conversão de Setup */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Conversão de Setup para Pro</span>
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <Target className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white font-mono">
                  {metrics.setupConversionRate}%
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ({metrics.convertedFromSetup} de {metrics.setupsCount})
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Clientes que contrataram setup inicial e ativaram Pro recorrente
              </p>
            </div>
          </div>

          {/* Âncora de Valor Estratégica */}
          <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase font-mono tracking-wide block">
                  Âncora de Valor Comercial (Custo de Consultoria)
                </span>
                <p className="text-sm text-slate-200">
                  MRR Atual de R$ {metrics.mrr.toLocaleString("pt-BR")},00 equivale a{" "}
                  <strong className="text-emerald-400 font-bold font-mono">
                    {metrics.mrrVsConsultingPct}%
                  </strong>{" "}
                  do custo de uma única consultoria tradicional (R$ 4.666/mês).
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Preço médio por consulta de habilitação:</span>
              <span className="text-xs font-bold text-slate-300 font-mono">
                R$ 19,70 (no Pro) vs. R$ 466,60 (Consultoria Humana)
              </span>
            </div>
          </div>
        </div>

        {/* PILAR 5: PIPELINE DE ONBOARDING & FUNIL DE ADOÇÃO */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Pilar 5: Pipeline de Onboarding & Funil de Adoção dos Tenants</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Acompanhamento dos 4 marcos críticos de ativação para prevenir churn prematuro.
              </p>
            </div>
            {metrics.atRiskTenantsCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{metrics.atRiskTenantsCount} Tenants em Risco de Abandono</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {/* Passo 1 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Passo 1</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-xs font-bold text-white">Cadastro & Vertical</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Seleção da Vertical Operacional no signup.
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
                <span className="text-lg font-bold text-white font-mono">{metrics.funnel.step1}</span>
                <span className="text-[10px] text-slate-400 font-mono">100% da base</span>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Passo 2</span>
                <FileCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-xs font-bold text-white">Upload no Cofre</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Custódia de CNDs, Balanço e CATs.
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
                <span className="text-lg font-bold text-white font-mono">{metrics.funnel.step2}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {((metrics.funnel.step2 / metrics.funnel.step1) * 100).toFixed(0)}% de conclusão
                </span>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Passo 3</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-xs font-bold text-white">1ª Análise & Semáforo</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Auditoria executada e citação gerada.
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
                <span className="text-lg font-bold text-white font-mono">{metrics.funnel.step3}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {((metrics.funnel.step3 / metrics.funnel.step1) * 100).toFixed(0)}% ativos
                </span>
              </div>
            </div>

            {/* Passo 4 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Passo 4</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-xs font-bold text-white">Ativação Pro / Recorrência</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Assinatura confirmada e retenção ativa.
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
                <span className="text-lg font-bold text-emerald-400 font-mono">{metrics.funnel.step4}</span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  {((metrics.funnel.step4 / metrics.funnel.step1) * 100).toFixed(0)}% conversão final
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT TENANTS AT-A-GLANCE */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Visão de Tenants Recentes & Risco</span>
            </h2>
            <Link
              href="/admin/users"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono"
            >
              <span>Abrir Tenants Hub Completo</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
                  <th className="py-2.5 px-3">Empresa / CNPJ</th>
                  <th className="py-2.5 px-3">Vertical Principal</th>
                  <th className="py-2.5 px-3">Plano / Status</th>
                  <th className="py-2.5 px-3 text-center">Créditos</th>
                  <th className="py-2.5 px-3 text-center">Último Semáforo</th>
                  <th className="py-2.5 px-3">Onboarding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {tenants.slice(0, 5).map((t) => (
                  <tr key={t.id} className="hover:bg-slate-850/40">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{t.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{t.cnpj}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] text-slate-300 block truncate max-w-[200px]">
                        {t.primary_vertical}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-white">Plano {t.plan}</span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                            t.subscriptionStatus === "active"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : t.subscriptionStatus === "past_due"
                              ? "bg-rose-500/15 text-rose-400"
                              : "bg-blue-500/15 text-blue-400"
                          }`}
                        >
                          {t.subscriptionStatus}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-200">
                      {t.creditsRemaining}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          t.lastSemaforoStatus === "PASSA"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : t.lastSemaforoStatus === "RESSALVA"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : t.lastSemaforoStatus === "ELIMINATORIA"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {t.lastSemaforoStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {t.onboardingStep < 3 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-mono font-semibold bg-amber-500/10 px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Passo {t.onboardingStep} (Risco)</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                          Concluído (Passo {t.onboardingStep})
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
