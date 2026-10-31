"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Search,
  AlertTriangle,
  Scale,
} from "lucide-react";

export const HeroSection = ({ onCtaClick }: { onCtaClick: () => void }) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background radial gradients for depth */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Grid Pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-slate-300 text-xs font-medium mb-6 shadow-sm backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Nova Lei de Licitações (14.133/2021) Integrada</span>
              <span className="text-slate-500">|</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3" /> Extração Instantânea
              </span>
            </div>

            {/* H1 Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Transforme{" "}
              <span className="relative whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-400">
                200 páginas
              </span>{" "}
              de burocracia em{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                2 minutos de clareza.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
              IA especializada em licitações públicas brasileiras que extrai prazos,
              multas desproporcionais e requisitos críticos de habilitação antes da sua concorrência.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <button
                onClick={onCtaClick}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold rounded-xl text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 bg-[length:200%_auto] hover:bg-right transition-all duration-300 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-[0.98]"
              >
                <Sparkles className="w-5 h-5 text-slate-950 animate-pulse" />
                <span>Analisar meu primeiro edital</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onCtaClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold rounded-xl text-slate-300 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 backdrop-blur-md transition-all active:scale-[0.98]"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span>Ver Demonstração ao Vivo</span>
              </button>
            </div>

            {/* Proof Points */}
            <div className="mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-6 w-full max-w-lg">
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">120s</p>
                <p className="text-xs text-slate-400 mt-0.5">Tempo médio de análise</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400 tracking-tight">99.4%</p>
                <p className="text-xs text-slate-400 mt-0.5">Precisão jurídica comprovada</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">0 Risco</p>
                <p className="text-xs text-slate-400 mt-0.5">Cláusulas de armadilha mapeadas</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Animated Document Scanner to Structured Data Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Visual glow frame */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="rounded-2xl p-5 border border-[#253745] shadow-2xl relative overflow-hidden backdrop-blur-xl bg-[#11212D]">
                {/* Header Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-[#253745]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-xs font-mono text-[#9BA8AB] ml-2">scanner_edital_v2.ai</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    <Clock className="w-3 h-3" /> Análise Ativa
                  </span>
                </div>

                {/* Document Preview with Laser Scan effect */}
                <div className="mt-4 relative bg-[#06141B] rounded-xl p-4 border border-[#253745] overflow-hidden">
                  {/* Laser Beam */}
                  <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-laser z-20 pointer-events-none" />

                  {/* Document Simulated text lines */}
                  <div className="space-y-2 opacity-50">
                    <div className="h-2.5 bg-[#253745] rounded w-3/4"></div>
                    <div className="h-2 bg-[#11212D] rounded w-full"></div>
                    <div className="h-2 bg-[#11212D] rounded w-5/6"></div>
                    <div className="h-2 bg-[#11212D] rounded w-4/5"></div>
                  </div>

                  {/* Overlay Extraction Badges popping up */}
                  <div className="mt-4 space-y-2.5 relative z-10">
                    {/* Badge 1: Objeto */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="p-2.5 rounded-lg bg-[#11212D] border border-[#253745] flex items-center justify-between text-xs"
                    >
                      <span className="text-[#9BA8AB] flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#CCD0CF]" />
                        Objeto Identificado
                      </span>
                      <span className="text-[#CCD0CF] font-medium truncate max-w-[160px]">
                        Serviços de Nuvem e TI
                      </span>
                    </motion.div>

                    {/* Badge 2: Alerta de Armadilha */}
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                      className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 flex items-center justify-between text-xs text-rose-300"
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        Armadilha: Multa abusiva (25%)
                      </span>
                      <span className="text-[10px] uppercase font-bold bg-rose-500/20 px-1.5 py-0.5 rounded text-rose-400">
                        Alto Risco
                      </span>
                    </motion.div>

                    {/* Badge 3: Prazo Impugnação */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3 }}
                      className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-300"
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Prazo de Impugnação
                      </span>
                      <span className="font-bold text-white">3 dias úteis restantes</span>
                    </motion.div>
                  </div>
                </div>

                {/* Bottom Card Summary */}
                <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    <span>Conformidade Lei 14.133</span>
                  </div>
                  <span className="font-semibold text-slate-300">188 pág analisadas</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
