"use client";

import React from "react";
import { FileSearch, Sparkles, ShieldCheck, User } from "lucide-react";

export const HeaderMinimal: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#090d16]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-md py-3.5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[1px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#090d16] rounded-xl flex items-center justify-center">
              <FileSearch className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-white">
              Edital<span className="text-emerald-400">Flash</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-2.5 h-2.5" /> V2 Pro
            </span>
          </div>
        </div>

        {/* User Status / Minimal Profile on the right */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 border-r border-slate-800 pr-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Auditoria Lei 14.133/21</span>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-900/80 border border-slate-800 rounded-full px-3 py-1.5">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200">
                Dr. Gabriel (Jurídico B2B)
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">Plano Enterprise Ativo</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
