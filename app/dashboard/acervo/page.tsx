"use client";

import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AcervoDashboard } from "@/components/AcervoDashboard";
import { Award, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AcervoPage() {
  return (
    <DashboardLayout activeTab="cofre">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#253745]">
          <div>
            <Link
              href="/dashboard/cofre"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#CCD0CF] hover:underline mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Cofre Geral</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Portfólio de Acervo Técnico & Capacidade Operacional
            </h1>
            <p className="text-xs sm:text-sm text-[#9BA8AB] mt-1">
              Consolidação de CATs e atestados por especialidade técnica para autoavaliação de competitividade em licitações (Lei 14.133/2021).
            </p>
          </div>
        </div>

        <AcervoDashboard />
      </div>
    </DashboardLayout>
  );
}
