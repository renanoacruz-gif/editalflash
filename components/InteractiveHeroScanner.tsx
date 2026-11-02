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
import { cenarioExemplo } from "@/data/exemplo";

export const InteractiveHeroScanner: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "1. Leitura Estruturada (PL)",
      highlightLine: cenarioExemplo.requisitos[0].highlightLine,
      page: cenarioExemplo.requisitos[0].localEdital,
      verdict: cenarioExemplo.requisitos[0].status,
      statusText: `PL da empresa: ${cenarioExemplo.metricas.plApuradoValorFormatado} (${cenarioExemplo.metricas.plApuradoPercentual}%) vs Exigido: ${cenarioExemplo.metricas.plMinimoValorFormatado} (${cenarioExemplo.metricas.plMinimoPercentual}%). Conforme Art. 69.`,
      statusColor: "text-emerald-700",
      badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
    },
    {
      title: "2. Verificação de Atestados",
      highlightLine: cenarioExemplo.requisitos[1].highlightLine,
      page: cenarioExemplo.requisitos[1].localEdital,
      verdict: "RESSALVA / IMPUGNAÇÃO",
      statusText: `Vedação de somatório ilegal (Súmula 263 TCU). Seu cofre comprova ${cenarioExemplo.metricas.atestadoComprovado} para exigência de ${cenarioExemplo.metricas.atestadoExigido}. Minuta gerada.`,
      statusColor: "text-amber-800",
      badgeBg: "bg-amber-50 border-amber-200 text-amber-900",
    },
    {
      title: "3. Validação de Certidões",
      highlightLine: cenarioExemplo.requisitos[2].highlightLine,
      page: cenarioExemplo.requisitos[2].localEdital,
      verdict: cenarioExemplo.requisitos[2].status,
      statusText: `Certidão Conjunta Federal regular perante a RFB/PGFN, porém com validade restante de ${cenarioExemplo.metricas.cndFederalDiasRestantes} dias úteis. Alerta de renovação emitido.`,
      statusColor: "text-amber-800",
      badgeBg: "bg-amber-50 border-amber-200 text-amber-900",
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
      <div className="bento-card border border-[var(--line)] bg-white text-[#09090B] shadow-2xl rounded-2xl overflow-hidden relative">
        {/* Topo do Arquivo Simulado */}
        <div className="px-5 py-3.5 border-b border-[#E4E4E7] bg-[#FAFAFA] flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block transition-transform hover:scale-125" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block transition-transform hover:scale-125" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block transition-transform hover:scale-125" />
            <span className="ml-2.5 text-xs font-mono text-[#71717A] hidden sm:inline tracking-tight">
              {cenarioExemplo.edital.arquivoNome}
            </span>
            <span className="ml-2 text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-[var(--mist)] text-[var(--ink)] border border-[var(--line)]">
              Exemplo ilustrativo
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F4F5] border border-[#E4E4E7] text-[#09090B] text-xs font-mono font-bold shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-[#18181B] animate-pulse" />
              <span>Simulador Pericial 60fps</span>
            </span>
          </div>
        </div>

        {/* Corpo: Edital Sendo Escaneado + Card de Diagnóstico Brotanto */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 relative min-h-[300px]">
          {/* Laser Scanner Effect com Gradiente Radial Suave (60fps GPU-accelerated) */}
          <div
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#4A5FFF] to-transparent pointer-events-none z-20 opacity-80"
            style={{
              boxShadow: "0 0 16px 2px rgba(74, 95, 255, 0.45)",
              animation: "scannerLaser 4s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate",
              willChange: "transform",
            }}
          />

          {/* Coluna 1: O Texto Bruto do Edital com Marca-Texto Dinâmico */}
          <div className="md:col-span-7 space-y-4 font-mono text-sm text-[#52525B] leading-relaxed relative">
            <div className="text-xs uppercase text-[#71717A] tracking-wider font-bold flex items-center justify-between">
              <span>Varredura de Conformidade • Lei 14.133/2021</span>
              <span className="text-[#18181B] font-mono text-xs">Passo {activeStep + 1} de {steps.length}</span>
            </div>

            <p className="opacity-60 text-xs sm:text-[13px] leading-relaxed select-none">
              "A PREFEITURA MUNICIPAL, por meio de sua Comissão de Contratação, torna público que realizará licitação na modalidade {cenarioExemplo.edital.modalidade}..."
            </p>

            <div className="p-4 sm:p-5 rounded-xl bg-[#FAFAFA] border border-[#E4E4E7] text-[#09090B] shadow-md relative overflow-hidden transition-all duration-300 transform translate-y-0">
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#18181B]" />
              <div className="text-xs text-[#18181B] font-bold mb-2 flex items-center justify-between">
                <span className="font-mono tracking-tight">{current.page}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1B2347] border border-[#4A5FFF]/30 text-white font-mono font-semibold">
                  Extração Conforme
                </span>
              </div>
              <p className="font-semibold text-sm sm:text-[15px] text-[#09090B] leading-snug">
                "{current.highlightLine}"
              </p>
            </div>

            <p className="opacity-60 text-xs sm:text-[13px] leading-relaxed select-none">
              "Objeto: {cenarioExemplo.edital.objeto}. A inabilitação da licitante importará preclusão do direito de participar das fases subsequentes..."
            </p>

            {/* Stepper Dots com Transição Fluida 60fps */}
            <div className="pt-2 flex items-center gap-2">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeStep === idx
                      ? "w-8 bg-[#18181B] shadow-[0_0_8px_rgba(74,95,255,0.6)]"
                      : "w-2 bg-[#E4E4E7] hover:bg-[#18181B]/50"
                  }`}
                  aria-label={`Ir para etapa ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Coluna 2: Card de Veredito Imediato (Estilo Linear / GetLayers) */}
          <div className="md:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-[#FAFAFA] border border-[#E4E4E7] backdrop-blur-md relative z-10 space-y-4 shadow-md transition-all duration-300 hover:border-[#4A5FFF]/40">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-xs font-mono uppercase tracking-wider text-[#71717A] font-semibold">
                  Diagnóstico Automático
                </span>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border shadow-sm ${current.badgeBg}`}>
                  {current.verdict}
                </span>
              </div>

              <h4 className="text-base font-bold text-[#09090B] font-display mb-2 tracking-tight">
                {current.title}
              </h4>

              <p className="text-sm text-[#52525B] leading-relaxed font-sans">
                {current.statusText}
              </p>
            </div>

            <div className="pt-3.5 border-t border-[#D9DEE8] flex items-center justify-between">
              <span className="text-xs font-mono text-[#18181B] flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#18181B]" />
                <span>Auditoria Pericial</span>
              </span>
              <span className="text-xs font-mono text-[#71717A]">
                Tempo de cálculo: 1.2s
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
