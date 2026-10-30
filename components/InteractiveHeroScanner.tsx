"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Scale,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
} from "lucide-react";

export const InteractiveHeroScanner: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "1. Leitura Estruturada",
      highlightLine: "Cláusula 9.2: Exigência de Balanço Patrimonial com Patrimônio Líquido ≥ 10% do valor estimado.",
      page: "Pág. 38, Linhas 14-18",
      verdict: "PASSA",
      statusText: "PL da sua empresa: R$ 420.000 (14,0%) vs Exigido: R$ 300.000 (10%). Conforme Art. 69.",
      statusColor: "text-emerald-500",
      badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    },
    {
      title: "2. Verificação de Atestados",
      highlightLine: "Cláusula 10.4: Comprovação de 15.000 m² de pavimentação asfáltica CBUQ. Vedado somatório.",
      page: "Pág. 44, Linhas 2-6",
      verdict: "RESSALVA / IMPUGNAÇÃO",
      statusText: "Vedação de somatório ilegal (Súmula 263 TCU). Seu cofre possui 48.500 m² em 3 CATs. Minuta gerada.",
      statusColor: "text-amber-500",
      badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    },
    {
      title: "3. Validação de Certidões",
      highlightLine: "Cláusula 8.1: Apresentação de Certidão Negativa de Falência com validade na data da sessão.",
      page: "Pág. 29, Linhas 9-11",
      verdict: "PASSA",
      statusText: "Certidão Estadual emitida em 10/10/2026. Validade restante: 42 dias. Conforme Art. 68.",
      statusColor: "text-emerald-500",
      badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [steps.length]);

  const current = steps[activeStep];

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 text-left">
      {/* Container Bento Estilo Linear/Stripe */}
      <div className="bento-card border border-[var(--line)] bg-[#0A111F] text-[#E8ECF5] shadow-2xl rounded-2xl overflow-hidden relative">
        {/* Topo do Arquivo Simulado */}
        <div className="px-4 py-3 border-b border-[#26324A] bg-[#121B2D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-xs font-mono text-[#A3AEC4] hidden sm:inline">
              Edital_Pregao_Eletronico_14133_Obras.pdf
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1B2347] border border-[#4A5FFF]/30 text-[#8F9CFF] text-[10px] font-mono font-bold">
              <Cpu className="w-3 h-3 animate-pulse" />
              <span>Simulador Pericial em Tempo Real</span>
            </span>
          </div>
        </div>

        {/* Corpo: Edital Sendo Escaneado + Card de Diagnóstico Brotanto */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 relative min-h-[300px]">
          {/* Laser Scanner Effect */}
          <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#4A5FFF] to-transparent pointer-events-none radar-scanner-line z-20" />

          {/* Coluna 1: O Texto Bruto do Edital com Marca-Texto Dinâmico */}
          <div className="md:col-span-7 space-y-4 font-mono text-xs text-[#A3AEC4] leading-relaxed relative">
            <div className="text-[10px] uppercase text-[#6B7A99] tracking-wider font-bold">
              Varredura de Conformidade • Lei 14.133/2021
            </div>

            <p className="opacity-60 text-[11px]">
              "O MUNICÍPIO, por meio de sua Comissão de Contratação, torna público que realizará licitação na modalidade PREGÃO ELETRÔNICO..."
            </p>

            <div className="p-3.5 rounded-lg bg-[#121B2D] border border-[#4A5FFF]/40 text-[#E8ECF5] shadow-inner relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#4A5FFF]" />
              <div className="text-[10px] text-[#8F9CFF] font-bold mb-1 flex items-center justify-between">
                <span>{current.page}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#1B2347] text-[#8F9CFF]">
                  Extração Conforme
                </span>
              </div>
              <p className="font-semibold text-xs text-white">
                "{current.highlightLine}"
              </p>
            </div>

            <p className="opacity-60 text-[11px]">
              "A inabilitação da licitante importará preclusão do direito de participar das fases subsequentes, lavrando-se ata circunstanciada..."
            </p>

            {/* Stepper Dots */}
            <div className="pt-2 flex items-center gap-2">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeStep === idx ? "w-8 bg-[#4A5FFF]" : "w-2 bg-[#26324A] hover:bg-[#4A5FFF]/50"
                  }`}
                  aria-label={`Ir para etapa ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Coluna 2: Card de Veredito Imediato (Harvey / Stripe style) */}
          <div className="md:col-span-5 flex flex-col justify-between p-5 rounded-xl bg-[#121B2D]/80 border border-[#26324A] backdrop-blur-sm relative z-10 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#A3AEC4]">
                  Diagnóstico Automático
                </span>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${current.badgeBg}`}>
                  {current.verdict}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white font-display mb-2">
                {current.title}
              </h4>

              <p className="text-xs text-[#A3AEC4] leading-relaxed">
                {current.statusText}
              </p>
            </div>

            <div className="pt-3 border-t border-[#26324A] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#8F9CFF] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4A5FFF]" />
                <span>Auditoria Pericial</span>
              </span>
              <span className="text-[10px] font-mono text-[#6B7A99]">
                Tempo de cálculo: 1.2s
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
