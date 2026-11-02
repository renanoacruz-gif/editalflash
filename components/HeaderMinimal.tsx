"use client";

import React from "react";
import { ShieldCheck, User } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export const HeaderMinimal: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0E1626]/90 backdrop-blur-xl border-b border-[#26324A] shadow-md py-3 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo Oficial */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Logo variant="fundo-escuro" size="sm" href="" />
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide bg-[#2740F0]/15 text-[#8F9CFF] border border-[#2740F0]/30 ml-1">
            V2 Pro
          </span>
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
