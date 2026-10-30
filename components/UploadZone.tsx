"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  FileText,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles,
  Zap,
  Clock,
} from "lucide-react";

interface UploadZoneProps {
  onStartAnalysis: () => void;
  isAnalyzing: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onStartAnalysis, isAnalyzing }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onStartAnalysis();
  };

  return (
    <div className="w-full max-w-3xl mx-auto relative">
      {/* Floating Badge V2: "Análise média: 45 segundos" */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 border border-emerald-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Análise média: 45 segundos</span>
        </span>
      </div>

      {/* Main Drag & Drop Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={onStartAnalysis}
        className={`relative group cursor-pointer rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 border-2 border-dashed ${
          isDragOver
            ? "border-emerald-400 bg-emerald-950/20 shadow-2xl shadow-emerald-500/10 scale-[1.01]"
            : "border-slate-700/80 hover:border-emerald-500/50 bg-slate-900/50 hover:bg-slate-900/80"
        } backdrop-blur-xl`}
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all" />

        <div className="flex flex-col items-center justify-center pt-2">
          {/* Icon */}
          <div className="relative mb-5">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-emerald-500/50 transition-all shadow-inner">
              <UploadCloud className="w-8 h-8 transition-transform group-hover:-translate-y-0.5" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full shadow">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Arraste seu edital em PDF ou DOCX aqui
          </h3>
          <p className="mt-2 text-sm text-slate-400 max-w-md leading-relaxed">
            Nossa IA jurídica processa até 400 páginas simultaneamente, extraindo exigências, prazos e armadilhas contratuais.
          </p>

          {/* Action Button inside dropzone */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              disabled={isAnalyzing}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Selecionar Arquivo</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <span className="text-xs text-slate-500 font-medium">ou</span>

            {/* Quick Demo Preload */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onStartAnalysis();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-emerald-300 border border-slate-700 hover:border-emerald-500/40 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Carregar Edital Modelo (TRF6 TI 2026)</span>
            </button>
          </div>

          {/* Compliance notice */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-4 text-xs text-slate-400 flex-wrap justify-center">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Anonimização LGPD Automática
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Compatível com PNCP, Comprasnet e BEC
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
