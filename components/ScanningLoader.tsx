"use client";

/**
 * components/ScanningLoader.tsx
 * 
 * Componente Visual de Processamento Legal-Tech:
 * - "Data Stream" de auditoria com tipografia mono e fluxo vertical analítico.
 * - Barra de progresso com ponteiro iluminado em cobalto (--brand).
 * - Mensagens em conformidade estrita com o Art. 62 da Lei 14.133/2021.
 * - Zero efeitos lúdicos ou spinners genéricos.
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandIcon } from "@/components/brand-icons";

interface ScanningLoaderProps {
  fileName?: string;
}

const LEGAL_DATA_STREAM = [
  "LEI_14133_ART62: INICIANDO CONFERÊNCIA DE REQUISITOS GERAIS...",
  "ART66_HABILITACAO_JURIDICA: VERIFICANDO CONTRATO SOCIAL E PODERES DE GESTÃO...",
  "ART67_TECNICA: ANALISANDO CATS E ARTS DE PARCELAS DE MAIOR RELEVÂNCIA...",
  "SUMULA_263_TCU: LIMITANDO EXIGÊNCIAS TÉCNICAS AO TETO DE 50%...",
  "ART68_FISCAL_TRABALHISTA: CONFERINDO CND FEDERAL, FGTS E CNDT...",
  "ART69_ECONOMICO_FINANCEIRA: CALCULANDO ÍNDICES ILG, ILC, ISG...",
  "ART69_PARAGRAFO4: VERIFICANDO TETO DE 10% DE PATRIMÔNIO LÍQUIDO...",
  "VEREDITO_PREVENTIVO: CONSOLIDANDO SEMÁFORO DE HABILITAÇÃO E PROVAS LITERAIS...",
];

export const ScanningLoader: React.FC<ScanningLoaderProps> = ({
  fileName = "Edital_Licitacao.pdf",
}) => {
  const [streamIndex, setStreamIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const streamInterval = setInterval(() => {
      setStreamIndex((prev) => (prev + 1) % LEGAL_DATA_STREAM.length);
    }, 1800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return 92;
        return prev + 6;
      });
    }, 700);

    return () => {
      clearInterval(streamInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto py-12 px-4 font-sans">
      {/* Barra de Progresso Superior com Ponteiro Iluminado */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[var(--line)]">
        <motion.div
          className="h-full bg-[var(--brand)] relative"
          initial={{ width: "10%" }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut", duration: 0.5 }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_var(--brand)]" />
        </motion.div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-lg p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header do Processamento */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[var(--brand-tint)] flex items-center justify-center text-[var(--brand)]">
              <BrandIcon name="edital" size="s16" accentCobalt />
            </div>
            <div>
              <span className="text-[11px] font-mono text-[var(--ink-2)] block uppercase font-semibold">
                Auditoria Preventiva em Andamento
              </span>
              <span className="text-sm font-bold text-[var(--ink)] font-mono truncate max-w-xs block">
                {fileName}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-mono font-bold text-[var(--brand)]">{progress}%</span>
            <span className="text-[10px] text-[var(--ink-2)] font-mono block">Art. 62 Lei 14.133</span>
          </div>
        </div>

        {/* Data Stream Box (Simulação de Análise Analítica de Precisão) */}
        <div className="p-4 rounded bg-[#0A111F] border border-[#26324A] font-mono text-xs space-y-2 overflow-hidden shadow-inner">
          <div className="flex items-center justify-between text-[10px] text-slate-400 pb-2 border-b border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              MOTOR_COMPLIANCE_V1.1
            </span>
            <span>RITO_PROBATORIO</span>
          </div>

          <div className="space-y-1 py-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={streamIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="text-[11px] text-emerald-400 font-semibold tracking-wide"
              >
                &gt; {LEGAL_DATA_STREAM[streamIndex]}
              </motion.div>
            </AnimatePresence>
            <div className="text-[10px] text-slate-500 truncate">
              {LEGAL_DATA_STREAM[(streamIndex - 1 + LEGAL_DATA_STREAM.length) % LEGAL_DATA_STREAM.length]}
            </div>
          </div>
        </div>

        {/* Informações de Rigor */}
        <div className="flex items-center justify-between text-[11px] text-[var(--ink-2)] font-mono pt-2">
          <span className="flex items-center gap-1.5">
            <BrandIcon name="check" size="s16" accentCobalt />
            Citação literal de página e cláusula
          </span>
          <span>Semáforo de Vereditos</span>
        </div>
      </div>
    </div>
  );
};
