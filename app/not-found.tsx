"use client";

import React from "react";
import Link from "next/link";
import { BrandIcon } from "@/components/brand-icons";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col justify-center items-center px-4 font-sans selection:bg-[var(--brand)] selection:text-white">
      <div className="max-w-md w-full bg-[var(--surface)] border border-[var(--line)] rounded-xl p-8 text-center space-y-6 shadow-sm">
        <div className="w-12 h-12 rounded-lg bg-[var(--brand-tint)]/40 border border-[var(--brand-tint)] flex items-center justify-center mx-auto text-[var(--brand)]">
          <BrandIcon name="auditoria" size="s24" accentCobalt />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--ink-2)] font-semibold">
            Erro 404 • Página Não Encontrada
          </span>
          <h1 className="text-2xl font-bold font-display text-[var(--ink)] tracking-tight">
            Página não encontrada. Retorne ao painel.
          </h1>
          <p className="text-xs text-[var(--ink-2)] leading-relaxed">
            O endereço acessado não corresponde a nenhum módulo ou relatório ativo no sistema de auditoria preventiva.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-[var(--brand)] hover:brightness-110 active:scale-98 text-white font-semibold text-xs shadow-xs transition-all border border-[var(--brand)]"
          >
            <BrandIcon name="edital" size="s16" accentCobalt={false} />
            <span>Retornar ao Dashboard</span>
          </Link>
        </div>

        <div className="pt-2 border-t border-[var(--line)] text-[11px] font-mono text-[var(--ink-2)]">
          EditalFlash • Auditoria Preventiva de Habilitação (Art. 62 Lei 14.133)
        </div>
      </div>
    </div>
  );
}
