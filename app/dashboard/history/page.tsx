"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/lib/auth-context";
import { BrandIcon } from "@/components/brand-icons";
import { AuditHistoryTable } from "@/components/AuditHistoryTable";
import { ReportCard } from "@/components/ReportCard";
import { EditalAnalysisResponse } from "@/lib/types";

export default function HistoryPage() {
  const { user } = useAuth();
  const [selectedAuditData, setSelectedAuditData] = useState<EditalAnalysisResponse | null>(null);

  if (selectedAuditData) {
    return (
      <DashboardLayout activeTab="analises">
        <div className="space-y-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
            <button
              type="button"
              onClick={() => setSelectedAuditData(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-semibold bg-[var(--surface)] hover:bg-[var(--line)] text-[var(--ink)] border border-[var(--line)] transition-all"
            >
              ← Voltar ao Histórico
            </button>
            <span className="text-xs font-mono text-[var(--ink-2)]">
              Visualizando Parecer Salvo (Sem consumo de créditos)
            </span>
          </div>

          <ReportCard
            data={selectedAuditData}
            onReset={() => setSelectedAuditData(null)}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="analises">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--line)]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[var(--brand-tint)] text-[var(--ink)] text-xs font-mono font-semibold border border-[var(--brand)]/20 mb-2">
              <BrandIcon name="auditoria" size="s16" />
              <span>Arquivo Centralizado de Auditorias</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight font-display">
              Histórico de Habilitações & Editais
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ink-2)] mt-1">
              Todos os editais analisados com persistência em nuvem multi-dispositivo e consultas otimizadas.
            </p>
          </div>

          <Link
            href="/dashboard/nova-analise"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold bg-[var(--brand-solid)] hover:brightness-110 text-white shadow-xs transition-all shrink-0 self-start sm:self-auto"
          >
            <BrandIcon name="upload" size="s16" accentCobalt={false} />
            <span>Nova Auditoria</span>
          </Link>
        </div>

        {/* Tabela de Histórico Conectada ao Supabase Cloud com Queries de Servidor */}
        <AuditHistoryTable
          companyName={user?.company || "EMPRESA LICITANTE LTDA"}
          companyCnpj={user?.cnpj || "12.345.678/0001-90"}
          onSelectAudit={(payload) => setSelectedAuditData(payload)}
        />
      </div>
    </DashboardLayout>
  );
}
