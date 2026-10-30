"use client";

import React, { useState } from "react";

export default function InteractiveRoiCalculator() {
  const [bidsPerYear, setBidsPerYear] = useState<number>(36);
  const [ticketAvg, setTicketAvg] = useState<number>(850000);
  const [resourceCost, setResourceCost] = useState<number>(4500);

  // Lógica de cálculo preditivo:
  // Taxa média de inabilitação no Brasil sem automação: ~14% dos certames
  // Taxa com EditalFlash: reduzida para < 1.5%
  const failureRateManual = 0.14;
  const failureRateEditalFlash = 0.015;

  const lostContractsManual = Math.round(bidsPerYear * failureRateManual);
  const lostContractsEditalFlash = Math.max(1, Math.round(bidsPerYear * failureRateEditalFlash));
  const contractsSaved = Math.max(0, lostContractsManual - lostContractsEditalFlash);

  // Economia em recursos administrativos e impugnações evitadas
  const appealSavings = contractsSaved * resourceCost;
  // Volume de faturamento sob proteção direta
  const volumeProtected = contractsSaved * ticketAvg;
  // Horas técnicas de análise economizadas (média 4.2h por edital manual vs 2min automatizado)
  const hoursSavedYear = Math.round(bidsPerYear * 4.2);

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)] overflow-hidden bg-[#05080F]">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[var(--brand)]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 text-xs font-mono text-[var(--brand)] uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
            Simulador de Impacto Financeiro
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[var(--foreground)] tracking-tight">
            Calcule o Retorno Real e o Risco Mitigado da sua Operação
          </h2>
          <p className="mt-4 text-base text-[var(--muted)] font-sans">
            A inabilitação em um único lote por erro formal no balanço ou atestado custa centenas de vezes mais que uma assinatura anual.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controles Táteis (Sliders) */}
          <div className="lg:col-span-6 bg-[#0B101B] border border-[var(--border)] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <span className="text-xs font-mono uppercase text-[var(--muted)] tracking-wider">Parâmetros da Empresa</span>
                <span className="text-xs font-mono text-[var(--brand)] bg-[var(--brand)]/10 px-2 py-0.5 rounded border border-[var(--brand)]/20">
                  Ajuste em tempo real
                </span>
              </div>

              {/* Slider 1: Certames por ano */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">
                    Licitações disputadas por ano
                  </label>
                  <span className="font-mono text-base font-semibold text-[var(--brand)]">
                    {bidsPerYear} certames
                  </span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={240}
                  step={2}
                  value={bidsPerYear}
                  onChange={(e) => setBidsPerYear(Number(e.target.value))}
                  className="w-full h-2 bg-[#1A2333] rounded-lg appearance-none cursor-pointer accent-[var(--brand)] focus:outline-none"
                />
                <div className="flex justify-between text-[11px] font-mono text-[var(--muted)] mt-1">
                  <span>6/ano</span>
                  <span>120/ano</span>
                  <span>240/ano</span>
                </div>
              </div>

              {/* Slider 2: Ticket Médio do Lote */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">
                    Ticket médio dos lotes disputados
                  </label>
                  <span className="font-mono text-base font-semibold text-[var(--foreground)]">
                    {formatBRL(ticketAvg)}
                  </span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={5000000}
                  step={50000}
                  value={ticketAvg}
                  onChange={(e) => setTicketAvg(Number(e.target.value))}
                  className="w-full h-2 bg-[#1A2333] rounded-lg appearance-none cursor-pointer accent-[var(--brand)] focus:outline-none"
                />
                <div className="flex justify-between text-[11px] font-mono text-[var(--muted)] mt-1">
                  <span>R$ 100k</span>
                  <span>R$ 2.5M</span>
                  <span>R$ 5.0M</span>
                </div>
              </div>

              {/* Slider 3: Custo por Recurso/Impugnação */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[var(--foreground)]">
                    Custo estimado com peça recursal/hora jurídica
                  </label>
                  <span className="font-mono text-base font-semibold text-[var(--muted)]">
                    {formatBRL(resourceCost)}
                  </span>
                </div>
                <input
                  type="range"
                  min={1500}
                  max={12000}
                  step={500}
                  value={resourceCost}
                  onChange={(e) => setResourceCost(Number(e.target.value))}
                  className="w-full h-2 bg-[#1A2333] rounded-lg appearance-none cursor-pointer accent-[var(--brand)] focus:outline-none"
                />
                <div className="flex justify-between text-[11px] font-mono text-[var(--muted)] mt-1">
                  <span>R$ 1.500</span>
                  <span>R$ 6.000</span>
                  <span>R$ 12.000</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[var(--border)] text-xs text-[var(--muted)] font-mono flex items-center justify-between">
              <span>Taxa de inabilitação manual de mercado: 14%</span>
              <span className="text-[var(--brand)]">EditalFlash: 1.5%</span>
            </div>
          </div>

          {/* Placar de Retorno e Valor Protegido */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#0D1524] to-[#0A0E18] border border-[var(--brand)]/30 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[var(--brand)]/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <span className="text-xs font-mono uppercase text-[var(--brand)] tracking-wider font-semibold">
                  Impacto Financeiro Projetado
                </span>
                <span className="text-xs font-mono text-[var(--muted)]">Base anual estimada</span>
              </div>

              {/* Destaque Principal: Volume de Contratos Salvos */}
              <div className="my-6">
                <span className="text-xs font-mono uppercase text-[var(--muted)] block mb-1">
                  Volume de Contratos Protegidos de Inabilitação
                </span>
                <div className="text-3xl sm:text-4xl font-bold font-mono text-[var(--brand)] tracking-tight">
                  {formatBRL(volumeProtected)}
                </div>
                <p className="text-xs text-[var(--muted)] mt-1 font-sans">
                  Aproximadamente <strong className="text-[var(--foreground)]">{contractsSaved} certames</strong> salvos de desclassificação por erros de índices contábeis ou atestados.
                </p>
              </div>

              {/* Grid Secundário */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
                <div className="bg-[#080D16] p-3.5 rounded-xl border border-[var(--border)]">
                  <span className="text-[11px] font-mono text-[var(--muted)] block">Economia em Recursos/Peças</span>
                  <span className="text-lg font-bold font-mono text-[var(--foreground)] mt-0.5 block">
                    {formatBRL(appealSavings)}
                  </span>
                  <span className="text-[10px] text-[var(--brand)] font-mono">Sem custos de retrabalho</span>
                </div>

                <div className="bg-[#080D16] p-3.5 rounded-xl border border-[var(--border)]">
                  <span className="text-[11px] font-mono text-[var(--muted)] block">Horas Técnicas Poupadas</span>
                  <span className="text-lg font-bold font-mono text-[var(--foreground)] mt-0.5 block">
                    {hoursSavedYear}h / ano
                  </span>
                  <span className="text-[10px] text-[var(--brand)] font-mono">Pareceres em 32s</span>
                </div>
              </div>
            </div>

            {/* Veredito e CTA */}
            <div className="mt-8 pt-4 border-t border-[var(--border)]">
              <div className="flex items-center justify-between mb-3 text-xs font-mono">
                <span className="text-[var(--muted)]">Payback Médio do Plano Pro:</span>
                <span className="text-[var(--brand)] font-semibold">1ª Licitação Salva</span>
              </div>
              <a
                href="#pricing"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--brand)] text-[#05080F] font-semibold text-sm hover:brightness-110 transition-all font-sans"
              >
                Auditar Meu Primeiro Edital Gratuitamente
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
