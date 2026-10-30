"use client";

/**
 * components/PricingSection.tsx
 * 
 * Seção de Preços com Dois Cards Principais + Tabela Comparativa de Recursos:
 * - Card 1: Setup Único (R$ 497 - Pagamento Único)
 * - Card 2: Plano Pro Recorrente (R$ 297/mês - Destaque 'Mais Recomendado')
 * - Tabela de Comparação Completa abaixo dos cards.
 */

import React from "react";
import { Check, Sparkles, Shield, ArrowRight, Zap, X } from "lucide-react";

export const PricingSection: React.FC<{ onSelectPlan?: (plan: string) => void }> = ({
  onSelectPlan,
}) => {
  const comparisonRows = [
    { feature: "Análise profunda de editais com IA", setup: "Até 5 no Onboarding", pro: "Ilimitados por mês" },
    { feature: "Extração de metadados e prazos", setup: true, pro: true },
    { feature: "Detecção preditiva de armadilhas contratuais", setup: true, pro: true },
    { feature: "Checklist interativo de habilitação fiscal/técnica", setup: true, pro: true },
    { feature: "Geração de Minutas de Impugnação com jurisprudência do TCU", setup: false, pro: true },
    { feature: "Suporte prioritário via WhatsApp corporativo", setup: false, pro: true },
    { feature: "Workshop de treinamento e parametrização com a equipe", setup: true, pro: true },
  ];

  return (
    <section id="pricing" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold uppercase tracking-wider mb-3">
            Planos & Investimento
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Transparência total no modelo Setup + Recorrência
          </h2>
          <p className="mt-3 text-base text-slate-400">
            Implantação técnica assistida por especialistas jurídicos + assinatura contínua com análises completas.
          </p>
        </div>

        {/* Dois Cards Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Card 1: Setup Único */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 flex flex-col justify-between relative bg-slate-900/40">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">Setup & Onboarding</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Parametrização inicial e treinamento técnico da equipe.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800 text-slate-400">
                  <Shield className="w-6 h-6" />
                </div>
              </div>

              {/* Destaque do Preço Setup */}
              <div className="mt-6 pb-6 border-b border-slate-800">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                    R$ 497
                  </span>
                  <span className="text-sm font-semibold text-slate-400">pagamento único</span>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Sem taxas ocultas. Garante a configuração completa do seu ambiente.
                </p>
              </div>

              {/* Lista de Recursos */}
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                {[
                  "Parametrização dos nichos e segmentos da sua empresa",
                  "Treinamento de uso da ferramenta para até 5 colaboradores",
                  "Auditoria inicial de 5 editais assistida por especialista",
                  "Configuração de preferências de alerta e multas críticas",
                  "Garantia incondicional de 7 dias",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <button
                onClick={() => onSelectPlan && onSelectPlan("Setup Único (R$ 497)")}
                className="w-full py-3.5 px-6 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all active:scale-[0.98]"
              >
                Contratar Setup Inicial
              </button>
            </div>
          </div>

          {/* Card 2: Plano Pro Recorrente (Destacado como Recomendado) */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 border-2 border-blue-500/70 shadow-2xl shadow-blue-500/20 flex flex-col justify-between relative bg-gradient-to-b from-slate-900/95 via-[#0c162b]/95 to-slate-900/95">
            {/* Badge de Recomendação */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-600 text-white shadow-md shadow-blue-500/40">
                <Sparkles className="w-3.5 h-3.5" /> Mais Recomendado
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">Assinatura Pro</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Análise ilimitada e inteligência jurídica contínua.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <Zap className="w-6 h-6" />
                </div>
              </div>

              {/* Destaque do Preço Recorrência */}
              <div className="mt-6 pb-6 border-b border-slate-800">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-300 tracking-tight">
                    R$ 297
                  </span>
                  <span className="text-sm font-semibold text-slate-400">/mês</span>
                </div>
                <p className="mt-2 text-xs text-blue-400 font-medium">
                  Cancele quando quiser • Acesso imediato a todas as atualizações
                </p>
              </div>

              {/* Lista de Recursos Pro */}
              <ul className="mt-6 space-y-3 text-sm text-slate-200">
                {[
                  "Análise ilimitada de editais em PDF com Multi-IA",
                  "Detecção em tempo real de cláusulas ilegais e pegadinhas",
                  "Geração automática de minutas fundamentadas no TCU",
                  "Checklist completo e auditoria de requisitos de habilitação",
                  "Exportação em PDF executivo de alta fidelidade",
                  "Suporte prioritário via WhatsApp com SLA de resposta rápida",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <button
                onClick={() => onSelectPlan && onSelectPlan("Plano Pro (R$ 297/mês)")}
                className="w-full group inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
              >
                <span>Assinar Plano Pro</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabela de Comparação Completa (Comparison Table) */}
        <div className="mt-16 max-w-4xl mx-auto glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 bg-slate-900/80 border-b border-slate-800">
            <h4 className="text-sm font-bold text-white">Comparativo Detalhado de Recursos</h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/50 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3">Funcionalidade</th>
                  <th className="px-6 py-3 text-center">Setup (R$ 497)</th>
                  <th className="px-6 py-3 text-center text-blue-400">Pro (R$ 297/mês)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-slate-900/20" : "bg-slate-900/40"}>
                    <td className="px-6 py-3.5 font-medium text-slate-200">{row.feature}</td>
                    <td className="px-6 py-3.5 text-center">
                      {typeof row.setup === "boolean" ? (
                        row.setup ? (
                          <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-slate-400 font-medium">{row.setup}</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      {typeof row.pro === "boolean" ? (
                        row.pro ? (
                          <Check className="w-4 h-4 text-blue-400 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-slate-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-blue-300 font-semibold">{row.pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
