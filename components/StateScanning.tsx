"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles, ShieldCheck } from "lucide-react";

interface StateScanningProps {
  fileName?: string;
  isRealProcessing?: boolean;
}

export const StateScanning: React.FC<StateScanningProps> = ({
  fileName = "Edital_Licitacao.pdf",
  isRealProcessing = true,
}) => {
  // Status text progression as requested
  const messages = [
    "Enviando arquivo...",
    "Processando na nuvem...",
    "IA analisando cláusulas...",
    "Lendo estrutura do edital...",
    "Identificando cláusulas críticas...",
    "Calculando riscos jurídicos...",
  ];

  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Cycles messages every 3 seconds while waiting for the real backend
    const textInterval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev < messages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 3000);

    // Continuous progress bar progression
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) {
          return 92; // Waits for real response
        }
        return prev + 8;
      });
    }, 1200);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, [messages.length]);

  return (
    <div className="relative w-full max-w-2xl mx-auto py-16 px-4">
      {/* Subtle linear progress bar fixed at the very top of the screen */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-slate-800">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-400 shadow-[0_0_12px_#3b82f6]"
          initial={{ width: "10%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Main Glassmorphic Scanning Card */}
      <div className="glass-card rounded-3xl p-10 sm:p-14 border border-slate-700/80 shadow-2xl relative overflow-hidden backdrop-blur-2xl text-center">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-36 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Visual: Document icon with glowing blue scanner bar moving up & down infinitely */}
        <div className="relative mx-auto w-32 h-40 mb-8 rounded-2xl bg-slate-900 border border-slate-700 shadow-xl overflow-hidden flex flex-col justify-between p-4">
          {/* Document fake text lines */}
          <div className="space-y-2 opacity-35">
            <div className="h-2 bg-slate-500 rounded w-1/2" />
            <div className="h-1.5 bg-slate-600 rounded w-full" />
            <div className="h-1.5 bg-slate-600 rounded w-5/6" />
            <div className="h-1.5 bg-slate-600 rounded w-4/5" />
            <div className="h-1.5 bg-slate-600 rounded w-full" />
            <div className="h-1.5 bg-slate-600 rounded w-3/4" />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono truncate">
            <span className="truncate max-w-[80px]">{fileName}</span>
            <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          </div>

          {/* Glowing Blue Scanner Bar (Infinite sweep) */}
          <div className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_18px_#3b82f6] animate-blue-scanner z-20 pointer-events-none" />
        </div>

        {/* Step Indicator Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/70 border border-blue-500/40 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Processamento em Tempo Real</span>
        </div>

        {/* Dynamic Status Text */}
        <h3 className="text-2xl font-extrabold text-white tracking-tight min-h-[36px] transition-all duration-300">
          {messages[messageIndex]}
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Extraindo texto com <code className="text-blue-300 font-mono text-xs">pdf-parse</code> e cruzando normas da Lei 14.133/21 com o Claude AI.
        </p>

        {/* Linear progress inside card */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>IA Neural & Extração de Texto</span>
            <span className="text-blue-400 font-bold">{progress}%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-sky-400 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Security footnote */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Criptografia de ponta a ponta e anonimização ativa</span>
        </div>
      </div>
    </div>
  );
};
