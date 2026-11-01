"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandIcon } from "@/components/brand-icons";
import { useAuth } from "@/lib/auth-context";
import { CheckoutModal } from "@/components/CheckoutModal";
import {
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
  HelpCircle,
  FileSpreadsheet,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { validateProPlanPrice, calculateBreakEvenMetrics } from "@/lib/pricing-validator";
import { getInternalCostStructure } from "@/lib/cost-structure";

export default function PricingPage() {
  const { user, logout } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [checkoutItem, setCheckoutItem] = useState<any>(null);

  // Validação Dinâmica da Margem Unitária e Cobertura de Custo Fixo
  const proValidation = validateProPlanPrice(29700, billingCycle === "annual" ? 20 : 0, 10);
  const isHealthyMargin = proValidation.grossMarginPercent >= 40; // Exige margem > 40%

  // Cálculo da Cobertura de Custos Fixos Atuais
  const metrics = calculateBreakEvenMetrics(148500, 5); // 5 clientes Pro ativos de base
  const showStarterOption = metrics.costCoveragePercent >= 80; // Oculta Starter se cobertura < 80%

  const handleOpenCheckout = (item: any) => {
    setCheckoutItem(item);
  };

  // Preços alinhados rigorosamente à Landing Page e ao Benchmark B2B:
  // Starter: R$ 97/mês (ou R$ 78/mês no anual = R$ 936/ano)
  // Pro: R$ 297/mês (ou R$ 237/mês no anual = R$ 2.844/ano)
  // Enterprise: R$ 890/mês (ou R$ 712/mês no anual = R$ 8.544/ano)

  const starterPrice = billingCycle === "monthly" ? 97 : 78;
  const proPrice = billingCycle === "monthly" ? 297 : 237;
  const enterprisePrice = billingCycle === "monthly" ? 890 : 712;

  const proAnnualTotal = 2844;
  const starterAnnualTotal = 936;
  const enterpriseAnnualTotal = 8544;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col py-8 px-4 sm:px-6 lg:px-8 relative selection:bg-[var(--brand)] selection:text-[#0F172A] font-sans">
      {/* Header Institucional */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-[var(--line)]">
        <div className="flex items-center gap-4">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[var(--surface)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)]">
              <BrandIcon name="mark" size={20} />
            </div>
            <span className="text-lg font-bold text-[var(--ink)] tracking-tight font-display">
              Edital<span className="text-[var(--brand)] font-extrabold">Flash</span>
            </span>
          </Link>

          {user && (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--surface)] hover:bg-[var(--line)]/50 text-[var(--ink)] border border-[var(--line)] text-xs font-semibold transition-all shadow-xs"
            >
              <BrandIcon name="seta" size="s16" accentCobalt={false} className="rotate-180" />
              <span>Voltar ao Dashboard</span>
            </Link>
          )}
        </div>

        {user ? (
          <div className="flex items-center gap-3 text-xs">
            <div className="text-right hidden sm:block">
              <span className="text-[var(--ink)] font-semibold block">{user.name}</span>
              <span className="text-[var(--ink-2)] font-mono text-[11px]">{user.email}</span>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--surface)] hover:bg-[var(--bg)] text-[var(--ink-2)] hover:text-[var(--ink)] border border-[var(--line)] transition-colors"
            >
              <BrandIcon name="fechar" size="s16" accentCobalt={false} />
              <span>Sair</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Link href="/login" className="text-[var(--ink-2)] hover:text-[var(--ink)] px-3 py-1.5">
              Entrar
            </Link>
            <Link
              href="/signup"
              className="bg-[var(--brand-solid)] hover:brightness-110 text-[#0F172A] px-3.5 py-1.5 rounded-md shadow-sm transition-all"
            >
              Criar Conta
            </Link>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full flex-1 pt-10 pb-16 space-y-12">
        {/* Painel de Status do Licitante Logado */}
        {user && (
          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--line)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-[var(--ink-2)] font-semibold">
                  Status Atual da Conta
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[var(--brand-tint)] text-[var(--brand)] border border-[var(--brand)]/20">
                  Plano {user.plan || "Starter"}
                </span>
              </div>
              <p className="text-xs text-[var(--ink)]">
                Empresa: <strong>{user.company || "Minha Empresa"}</strong> • Limite: <strong>{user.analysesUsed || 0}/{user.analysesLimit || 15} auditorias utilizadas</strong>
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[var(--brand)] hover:brightness-110 text-[#0F172A] font-semibold text-xs transition-all shadow-xs shrink-0"
            >
              <BrandIcon name="seta" size="s16" accentCobalt={false} className="rotate-180" />
              <span>Voltar ao Dashboard</span>
            </Link>
          </div>
        )}

        {/* Heading & Ancoragem de Mercado */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-2)] text-xs font-semibold font-mono">
            <ShieldCheck className="w-4 h-4 text-[var(--brand)]" />
            <span>Auditoria Preventiva de Habilitação · Lei Federal 14.133/2021</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--ink)] tracking-tight leading-tight font-display">
            Planos Corporativos com Retorno Imediato
          </h1>

          <p className="text-sm sm:text-base text-[var(--ink-2)] max-w-2xl mx-auto">
            Uma única inabilitação evitada ou cláusula restritiva impugnada a tempo paga múltiplos anos de assinatura.
          </p>

          {/* Ancoragem de Valor de Mercado */}
          {/* Âncora Externa com Consultoria Jurídica Externa (R$ 4.666/mês) — Exibida apenas se margem Pro > 40% */}
          {isHealthyMargin && (
            <div className="p-3.5 rounded-md bg-[var(--surface)] border border-[var(--line)] text-xs text-[var(--ink-2)] max-w-xl mx-auto flex items-center justify-center gap-2 font-mono">
              <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                Economia vs. Consultoria: <strong className="text-[var(--ink)]">Custo mensal inferior a 6% dos honorários de uma única petição externa</strong> (R$ 1.500/petição).
              </span>
            </div>
          )}

          {/* Seletor Mensal vs. Anual Ativo */}
          <div className="pt-2 flex items-center justify-center">
            <div className="inline-flex items-center p-1 rounded-lg bg-[var(--surface)] border border-[var(--line)] gap-1 shadow-xs">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-[var(--brand-solid)] text-[#0F172A] shadow-xs font-bold"
                    : "text-[var(--ink-2)] hover:text-[var(--ink)]"
                }`}
              >
                Cobrança Mensal
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  billingCycle === "annual"
                    ? "bg-[var(--brand-solid)] text-[#0F172A] shadow-xs font-bold"
                    : "text-[var(--ink-2)] hover:text-[var(--ink)]"
                }`}
              >
                <span>Cobrança Anual</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                    billingCycle === "annual"
                      ? "bg-white text-[var(--brand-solid)]"
                      : "bg-[var(--ok-bg)] text-[var(--ok-fg)]"
                  }`}
                >
                  -20% OFF
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Grade com os Planos Condizentes com a Landing Page e Validação Preditiva */}
        <div className={`grid grid-cols-1 ${showStarterOption ? "md:grid-cols-3" : "md:grid-cols-2 max-w-4xl"} gap-6 max-w-5xl mx-auto items-stretch`}>
          {/* PLANO STARTER (Ocultado dinamicamente se a cobertura de custo fixo for < 80%) */}
          {showStarterOption && (
            <div className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--line)] flex flex-col justify-between space-y-6 shadow-xs hover:border-[var(--line)] transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--ink-2)] uppercase tracking-wider block font-mono">
                    Plano Starter
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--line)] text-[var(--ink-2)] font-semibold">
                    Pontual
                  </span>
                </div>
                <p className="text-xs text-[var(--ink-2)]">
                  Para fornecedores que disputam certames pontuais (até 5 por mês).
                </p>

                <div className="pt-2 font-mono">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-[var(--ink)]">R$ {starterPrice}</span>
                    <span className="text-xs text-[var(--ink-2)]">/mês</span>
                  </div>
                  <p className="text-[11px] text-[var(--ink-2)] mt-1">
                    {billingCycle === "annual"
                      ? `Faturado anualmente em R$ ${starterAnnualTotal},00 (-20%)`
                      : "Faturado mensalmente (cancele a qualquer momento)"}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--line)] space-y-2.5 text-xs text-[var(--ink)]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span><strong>5 auditorias de editais</strong> por mês</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Semáforo de Vereditos Art. 62 com prova literal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Parecer Executivo em PDF nativo (A4 institucional)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Cálculo de PL e Índices de Liquidez (LC, LG, SG)</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--ink-2)] opacity-60">
                    <span className="font-mono text-[10px]">✕</span>
                    <span>Sem minutas automáticas de impugnação (Art. 164)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  handleOpenCheckout({
                    type: "PLAN_UPGRADE",
                    id: billingCycle === "annual" ? "plan_starter_annual" : "plan_starter_monthly",
                    title: billingCycle === "annual" ? "Plano Starter Anual (-20%)" : "Plano Starter Mensal",
                    amount: billingCycle === "annual" ? starterAnnualTotal : 97,
                    newPlan: "Starter",
                    billingCycle,
                    description: "5 auditorias de editais por mês e Parecer Executivo em PDF nativo.",
                  })
                }
                className="w-full py-3 px-4 rounded-lg text-xs font-bold text-[var(--ink)] bg-[var(--bg)] hover:bg-[var(--line)]/50 border border-[var(--line)] transition-colors active:scale-98"
              >
                Assinar Starter (R$ {starterPrice}/mês)
              </button>
            </div>
          )}

          {/* PLANO PROFISSIONAL — MAIS ESCOLHIDO */}
          <div className="bg-[var(--surface)] rounded-xl p-6 border-2 border-[var(--brand)] shadow-md relative flex flex-col justify-between space-y-6">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--brand)] text-[#0F172A] text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>Mais Escolhido por Empresas</span>
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--brand)] uppercase tracking-wider block font-mono">
                  Plano Profissional
                </span>
                {billingCycle === "annual" && (
                  <span className="text-[10px] font-mono font-bold text-[var(--ok-fg)] bg-[var(--ok-bg)] px-2 py-0.5 rounded">
                    Economia de R$ 720/ano
                  </span>
                )}
              </div>

              <p className="text-xs text-[var(--ink-2)]">
                Para equipes que necessitam de agilidade na emissão de petições e acervos.
              </p>

              <div className="pt-2 font-mono">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[var(--ink)]">R$ {proPrice}</span>
                  <span className="text-xs text-[var(--ink-2)]">/mês</span>
                </div>
                <p className="text-xs text-[var(--brand)] font-semibold mt-1">
                  {billingCycle === "annual"
                    ? `Faturado anualmente em R$ ${proAnnualTotal.toLocaleString("pt-BR")},00 (R$ 237/mês)`
                    : "Faturado mensalmente em R$ 297,00 (cancele quando quiser)"}
                </p>
                <p className="text-[11px] text-[var(--ink-2)] mt-0.5">
                  R$ {(proPrice / 15).toFixed(2)} por certame auditado
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--line)] space-y-2.5 text-xs text-[var(--ink)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--brand)] shrink-0" />
                  <span><strong>15 Auditorias de Habilitação</strong> por mês</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--brand)] shrink-0" />
                  <span><strong>Minutas Automáticas de Impugnação (Art. 164)</strong> com 1 clique</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--brand)] shrink-0" />
                  <span><strong>Portfólio de Acervo &amp; Regra do Somatório (Súmula 263 TCU)</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--brand)] shrink-0" />
                  <span><strong>Radar de Retificações (Diff Engine)</strong> com alerta de erratas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--brand)] shrink-0" />
                  <span>Exportação de Histórico em CSV/Excel para diretoria</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--brand)] shrink-0" />
                  <span>Cofre de Documentos e Calendário Unificado</span>
                </div>
                {/* TOOLTIP DE DISPONIBILIDADE E SUPORTE DE IA */}
                <div className="pt-1 text-[11px] font-mono text-[var(--brand)] flex items-center gap-1.5 bg-[var(--brand-tint)]/40 p-2 rounded border border-[var(--brand)]/20">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Inclui suporte prioritário e garantia de disponibilidade de IA com infraestrutura dedicada.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                handleOpenCheckout({
                  type: "PLAN_UPGRADE",
                  id: billingCycle === "annual" ? "plan_pro_annual" : "plan_pro_monthly",
                  title: billingCycle === "annual" ? "Plano Profissional Anual (-20%)" : "Plano Profissional Mensal",
                  amount: billingCycle === "annual" ? proAnnualTotal : 297,
                  newPlan: "Pro",
                  billingCycle,
                  description: "15 auditorias mensais, Minutas do Art. 164, Súmula 263 TCU e Diff Engine.",
                })
              }
              className="w-full py-3.5 px-4 rounded-lg text-xs font-bold text-[#0F172A] bg-[var(--brand-solid)] hover:brightness-110 shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>{billingCycle === "annual" ? "Assinar Profissional Anual" : "Assinar Profissional Mensal"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* PLANO ENTERPRISE */}
          <div className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--line)] flex flex-col justify-between space-y-6 shadow-xs hover:border-[var(--line)] transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--ink-2)] uppercase tracking-wider block font-mono">
                  Enterprise Corporativo
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--brand)]/10 text-[var(--brand)] font-semibold border border-[var(--brand)]/20">
                  Multi-CNPJ
                </span>
              </div>
              <p className="text-xs text-[var(--ink-2)]">
                Para construtoras, concessionárias e distribuidoras com alta demanda de disputas.
              </p>

              <div className="pt-2 font-mono">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[var(--ink)]">R$ {enterprisePrice}</span>
                  <span className="text-xs text-[var(--ink-2)]">/mês</span>
                </div>
                <p className="text-[11px] text-[var(--ink-2)] mt-1">
                  {billingCycle === "annual"
                    ? `Faturado anualmente em R$ ${enterpriseAnnualTotal},00 (-20%)`
                    : "Faturado mensalmente em R$ 890,00"}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--line)] space-y-2.5 text-xs text-[var(--ink)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Auditorias Ilimitadas</strong> de editais</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Múltiplos CNPJs</strong> (implantação assistida matriz/filiais)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Dashboard de ROI &amp; Cockpit de Performance</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Relatórios com Marca Customizada da sua empresa (setup pericial)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Canal prioritário de atendimento pericial</span>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                handleOpenCheckout({
                  type: "PLAN_UPGRADE",
                  id: billingCycle === "annual" ? "plan_enterprise_annual" : "plan_enterprise_monthly",
                  title: billingCycle === "annual" ? "Plano Enterprise Anual (-20%)" : "Plano Enterprise Mensal",
                  amount: billingCycle === "annual" ? enterpriseAnnualTotal : 890,
                  newPlan: "Enterprise",
                  billingCycle,
                  description: "Auditorias ilimitadas, múltiplos CNPJs, Dashboard de ROI e suporte prioritário.",
                })
              }
              className="w-full py-3 px-4 rounded-lg text-xs font-bold text-[var(--ink)] bg-[var(--bg)] hover:bg-[var(--line)]/50 border border-[var(--line)] transition-colors active:scale-98"
            >
              Assinar Enterprise (R$ {enterprisePrice}/mês)
            </button>
          </div>
        </div>

        {/* SEÇÃO: CRÉDITOS AVULSOS COM NUDGE DE SETUP RECOMENDADO (R$ 497) */}
        <div className="max-w-4xl mx-auto w-full pt-8 pb-4">
          <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--line)] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-[var(--ink-2)] block">
                  Necessidade Pontual • Créditos Pré-Pagos
                </span>
                <h3 className="text-base font-bold text-[var(--ink)] font-display mt-0.5">
                  Pacote de Análises Avulsas
                </h3>
                <p className="text-xs text-[var(--ink-2)]">
                  Ideal para testar a plataforma ou suprir picos de editais sem compromisso mensal.
                </p>
              </div>

              {/* Selo Setup Recomendado para alavancar LTV */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold shrink-0 self-start sm:self-auto">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Setup Assistido Recomendado (R$ 497)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--line)] flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-[var(--ink)] block">Pacote 5 Créditos</span>
                  <span className="font-mono text-xs text-[var(--ink-2)]">R$ 29,00 por análise com parecer</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleOpenCheckout({
                      type: "CREDIT_PACKAGE",
                      id: "credits_pack_5",
                      title: "Pacote 5 Auditorias",
                      amount: 145,
                      creditsToAdd: 5,
                      description: "5 créditos de auditoria de editais com veredito e cálculo de PL.",
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--line)] border border-[var(--line)] text-xs font-bold font-mono text-[var(--ink)] transition-colors"
                >
                  R$ 145,00
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg)] border border-[var(--brand)]/30 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-[var(--ink)]">Setup + 10 Créditos</span>
                    <span className="text-[9px] font-mono font-bold bg-[var(--brand-solid)] text-[#0F172A] px-1.5 py-0.2 rounded">
                      Melhor LTV
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[var(--ink-2)]">Implantação pericial com cofre de certidões</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleOpenCheckout({
                      type: "SETUP_FEE",
                      id: "setup_assisted_497",
                      title: "Setup Assistido + 10 Auditorias",
                      amount: 497,
                      creditsToAdd: 10,
                      description: "Parametrização completa do cofre de certidões + 10 análises de editais.",
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-[var(--brand-solid)] hover:brightness-110 text-[#0F172A] text-xs font-bold font-mono transition-all shadow-xs"
                >
                  R$ 497,00
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé Legal Persistente com Links LGPD */}
        <div className="max-w-3xl mx-auto text-center space-y-3 pt-6 border-t border-[var(--line)] text-xs text-[var(--ink-2)] font-mono">
          <p>
            EditalFlash é uma ferramenta de suporte técnico-operacional à decisão. A responsabilidade jurídica pela análise e envio de propostas permanece exclusivamente com a empresa licitante.
          </p>
          <div className="flex items-center justify-center gap-4 text-[11px]">
            <Link href="/termos" className="hover:text-[var(--brand)] transition-colors">
              Termos de Uso
            </Link>
            <span>·</span>
            <Link href="/privacidade" className="hover:text-[var(--brand)] transition-colors">
              Política de Privacidade (LGPD)
            </Link>
            <span>·</span>
            <Link href="/seguranca" className="hover:text-[var(--brand)] transition-colors">
              Segurança da Informação
            </Link>
          </div>
        </div>
      </main>

      {/* Modal de Checkout Seguro Integrado */}
      <CheckoutModal
        isOpen={Boolean(checkoutItem)}
        onClose={() => setCheckoutItem(null)}
        item={checkoutItem}
      />
    </div>
  );
}
