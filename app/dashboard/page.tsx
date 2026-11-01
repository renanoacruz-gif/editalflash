"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/lib/auth-context";
import { CheckoutModal } from "@/components/CheckoutModal";
import { AuditHistoryTable } from "@/components/AuditHistoryTable";
import { ReportCard } from "@/components/ReportCard";
import { RoiDashboard } from "@/components/RoiDashboard";
import { EditalAnalysisResponse, AuditedTenderHistoryItem } from "@/lib/types";
import { getAuditHistory } from "@/lib/audit-history";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Plus, ShieldCheck, Database, Calendar, AlertTriangle } from "lucide-react";

export default function DashboardHome() {
  const { user } = useAuth();
  const [checkoutItem, setCheckoutItem] = useState<any>(null);
  const [selectedAuditData, setSelectedAuditData] = useState<EditalAnalysisResponse | null>(null);
  const [auditList, setAuditList] = useState<AuditedTenderHistoryItem[]>([]);

  React.useEffect(() => {
    async function loadRealAudits() {
      if (user?.id) {
        const { fetchAuditsFromCloud } = await import("@/lib/audit-history");
        const res = await fetchAuditsFromCloud(user.id);
        setAuditList(res.items);
      } else {
        setAuditList(getAuditHistory(user?.email));
      }
    }
    loadRealAudits();
  }, [user?.id, user?.email]);

  if (selectedAuditData) {
    return (
      <DashboardLayout activeTab="analises">
        <div className="space-y-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between pb-3 border-b border-[#253745]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedAuditData(null)}
              className="gap-1.5"
            >
              ← Voltar ao Histórico
            </Button>
            <span className="text-xs font-mono text-[#9BA8AB]">
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

  const armadilhasTotal = auditList.reduce((acc, item) => acc + (item.armadilhasCount || 0), 0);

  return (
    <DashboardLayout activeTab="analises">
      <div className="space-y-10 max-w-6xl mx-auto pb-16">
        
        {/* CABEÇALHO SÓBRIO SEM CARDS FECHADOS */}
        <section className="border-b border-[#253745] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#11212D] border border-[#253745] text-[#CCD0CF] text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                {user?.primary_vertical || "Serviços Contínuos"}
              </span>
              <span className="text-xs font-mono text-[#4A5C6A]">Lei 14.133/2021</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight font-display">
              {user?.name?.split(" ")[0] ? `Olá, ${user.name.split(" ")[0]}` : "Painel de Auditoria"}
            </h1>
            <p className="text-sm text-[#9BA8AB] max-w-2xl leading-relaxed">
              Auditoria preventiva de conformidade documental para certames públicos. Verificação pericial com prova de página e linha.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/dashboard/nova-analise">
              <Button variant="primary" size="md" className="gap-2 bg-[#11212D] hover:bg-[#253745] border-[#253745]">
                <Plus className="w-4 h-4 text-[#CCD0CF]" />
                <span>Auditar Novo Edital</span>
              </Button>
            </Link>
          </div>
        </section>

        {/* MÉTRICAS FLUIDAS EM LINHA - SEM BORDAS PESADAS DE CARD (LINEAR/STRIPE PATTERN) */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-8 py-2 border-b border-[#253745] pb-8">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#9BA8AB] block">
              Saldo de Auditorias
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold font-mono text-white">
                {user?.analysesLimit || 5}
              </span>
              <button
                type="button"
                onClick={() =>
                  setCheckoutItem({
                    type: "CREDIT_PACKAGE",
                    id: "credits_pack_5",
                    title: "Pacote de 5 Créditos de Auditoria",
                    amount: 145,
                    creditsToAdd: 5,
                    description: "5 auditorias de editais com veredito, cálculo de PL e citação de páginas.",
                  })
                }
                className="text-xs font-mono font-medium text-[#CCD0CF] hover:underline cursor-pointer"
              >
                + Comprar
              </button>
            </div>
            <span className="text-xs text-[#4A5C6A] block mt-1">Plano {user?.plan || "Starter"}</span>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#9BA8AB] block">
              Editais Auditados
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold font-mono text-white">
                {auditList.length}
              </span>
              <span className="text-xs text-[#9BA8AB] font-mono">no histórico</span>
            </div>
            <span className="text-xs text-[#4A5C6A] block mt-1">Criptografia AES-256</span>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#9BA8AB] block">
              Cláusulas Restritivas
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-3xl font-bold font-mono ${armadilhasTotal > 0 ? "text-[#F59E0B]" : "text-white"}`}>
                {armadilhasTotal}
              </span>
              <span className="text-xs text-[#9BA8AB] font-mono">apontadas</span>
            </div>
            <span className="text-xs text-[#4A5C6A] block mt-1">Mapeadas para Art. 164</span>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#9BA8AB] block">
              Cofre Documental
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold font-mono text-[#10B981]">
                {auditList.length > 0 ? 4 : 0}
              </span>
              <span className="text-xs text-[#10B981] font-mono">vigentes</span>
            </div>
            <span className="text-xs text-[#4A5C6A] block mt-1">Cruzamento Art. 62</span>
          </div>
        </section>

        {/* NAVEGAÇÃO LIMPA DE AÇÕES E MÓDULOS - LISTA SEM CARDS PESADOS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#253745]">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#9BA8AB]">
              Ações Rápidas & Módulos
            </h2>
            <span className="text-xs font-mono text-[#4A5C6A]">Lei 14.133/2021</span>
          </div>

          <div className="divide-y divide-[#253745]">
            <Link
              href="/dashboard/nova-analise?tab=pncp"
              className="py-4 flex items-center justify-between group hover:bg-[#11212D]/40 px-2 rounded transition-colors"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#9BA8AB]">01. RADAR</span>
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#CCD0CF] transition-colors">Busca PNCP</h3>
                </div>
                <p className="text-xs text-[#9BA8AB] leading-relaxed">
                  Localize editais abertos no Portal Nacional de Contratações Públicas.
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#4A5C6A] group-hover:text-white transition-colors shrink-0 ml-4" />
            </Link>

            <Link
              href="/dashboard/cofre"
              className="py-4 flex items-center justify-between group hover:bg-[#11212D]/40 px-2 rounded transition-colors"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#9BA8AB]">02. COFRE</span>
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#CCD0CF] transition-colors">Documentos Art. 62</h3>
                </div>
                <p className="text-xs text-[#9BA8AB] leading-relaxed">
                  Custódia de CNDs, balanço patrimonial e atestados de acervo técnico.
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#4A5C6A] group-hover:text-white transition-colors shrink-0 ml-4" />
            </Link>

            <Link
              href="/dashboard/calendario"
              className="py-4 flex items-center justify-between group hover:bg-[#11212D]/40 px-2 rounded transition-colors"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#9BA8AB]">03. PRAZOS</span>
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#CCD0CF] transition-colors">Calendário do Certame</h3>
                </div>
                <p className="text-xs text-[#9BA8AB] leading-relaxed">
                  Validade das certidões cruzada com a data de sessão pública.
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#4A5C6A] group-hover:text-white transition-colors shrink-0 ml-4" />
            </Link>

            <Link
              href="/dashboard/acervo"
              className="py-4 flex items-center justify-between group hover:bg-[#11212D]/40 px-2 rounded transition-colors"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#9BA8AB]">04. ACERVO</span>
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#CCD0CF] transition-colors">Súmula 263/TCU</h3>
                </div>
                <p className="text-xs text-[#9BA8AB] leading-relaxed">
                  Portfólio de atestados quantitativos e somatório de parcelas.
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#4A5C6A] group-hover:text-white transition-colors shrink-0 ml-4" />
            </Link>
          </div>
        </section>

        {/* HISTÓRICO DE AUDITORIAS - TABELA LIMPA */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#253745]">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#9BA8AB]">
              Histórico de Editais Auditados
            </h2>
            <span className="text-xs font-mono text-[#4A5C6A]">Registros: {auditList.length}</span>
          </div>

          <AuditHistoryTable
            companyName={user?.company || "51.926.034 RENAN OSCAR ARAUJO CRUZ"}
            companyCnpj={user?.cnpj || "51.926.034/0001-42"}
            onSelectAudit={(payload) => setSelectedAuditData(payload)}
          />
        </section>

        {/* ROI / DESEMPENHO */}
        <RoiDashboard
          auditHistory={auditList}
          planPriceMonthly={user?.plan === "Enterprise" ? 890 : user?.plan === "Pro" ? 297 : 97}
        />

        {/* Modal de Checkout */}
        <CheckoutModal
          isOpen={Boolean(checkoutItem)}
          onClose={() => setCheckoutItem(null)}
          item={checkoutItem}
        />
      </div>
    </DashboardLayout>
  );
}
