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
import { Plus, ArrowRight, ShieldCheck, Database, Calendar, Award } from "lucide-react";

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
        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedAuditData(null)}
              className="gap-1.5"
            >
              ← Voltar ao Histórico
            </Button>
            <span className="text-xs font-mono text-[#64748B]">
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
      <div className="space-y-8 max-w-6xl mx-auto pb-16 font-sans">
        
        {/* CABEÇALHO RECOURA: MINIMALISTA COM TEXT-2XL */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">
              {user?.name?.split(" ")[0] ? `Olá, ${user.name.split(" ")[0]}` : "Visão Geral"}
            </h1>
            <p className="text-sm text-[#475569] mt-1">
              Auditoria de conformidade e verificação prévia de habilitação em licitações (Lei 14.133/2021).
            </p>
          </div>

          <Link href="/dashboard/nova-analise">
            <Button variant="primary" size="md" className="gap-2">
              <Plus className="w-4 h-4 text-white" />
              <span>Auditar Novo Edital</span>
            </Button>
          </Link>
        </section>

        {/* MÉTRICAS RECOURA: 4 CARDS BRANCOS COM BORDA SUTIL, SHADOW-SM E ROUNDED-2XL */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xs uppercase tracking-wider text-[#475569] font-medium block">
              Saldo de Auditorias
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-mono text-3xl font-bold text-[#0F172A]">
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
                className="text-xs font-medium text-[#1E3A8A] hover:underline cursor-pointer"
              >
                + Comprar
              </button>
            </div>
            <span className="text-xs text-[#94A3B8] block mt-1">Plano {user?.plan || "Starter"}</span>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xs uppercase tracking-wider text-[#475569] font-medium block">
              Editais Auditados
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-mono text-3xl font-bold text-[#0F172A]">
                {auditList.length}
              </span>
              <span className="text-xs text-[#64748B]">no histórico</span>
            </div>
            <span className="text-xs text-[#94A3B8] block mt-1">Criptografia AES-256</span>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xs uppercase tracking-wider text-[#475569] font-medium block">
              Cláusulas Restritivas
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`font-mono text-3xl font-bold ${armadilhasTotal > 0 ? "text-[#D97706]" : "text-[#0F172A]"}`}>
                {armadilhasTotal}
              </span>
              <span className="text-xs text-[#64748B]">apontadas</span>
            </div>
            <span className="text-xs text-[#94A3B8] block mt-1">Mapeadas para Art. 164</span>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xs uppercase tracking-wider text-[#475569] font-medium block">
              Cofre Documental
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-mono text-3xl font-bold text-[#059669]">
                {auditList.length > 0 ? 4 : 0}
              </span>
              <span className="text-xs text-[#059669] font-medium">vigentes</span>
            </div>
            <span className="text-xs text-[#94A3B8] block mt-1">Cruzamento Art. 62</span>
          </div>
        </section>

        {/* PILARES DA AUDITORIA: CARD ÚNICO BRANCO P-8 COM DIVIDE-Y SUBTLE */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm">
          <div className="pb-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#0F172A]">
                Módulos e Ações Rápidas
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Navegação direta pelas ferramentas periciais do EditalFlash.
              </p>
            </div>
            <span className="text-xs font-mono text-[#94A3B8]">Lei 14.133/2021</span>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            <Link
              href="/dashboard/nova-analise?tab=pncp"
              className="py-4 flex items-center justify-between group hover:bg-[#F8FAFC] -mx-4 px-4 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#1E3A8A] flex items-center justify-center shrink-0">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors">
                    Busca e Radar PNCP
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Localize certames abertos diretamente na base do Portal Nacional de Contratações Públicas.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1E3A8A] transition-all transform group-hover:translate-x-1 shrink-0 ml-4" />
            </Link>

            <Link
              href="/dashboard/cofre"
              className="py-4 flex items-center justify-between group hover:bg-[#F8FAFC] -mx-4 px-4 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#F0FDF4] text-[#059669] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors">
                    Cofre de Documentos (Art. 62)
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Custódia segura de certidões negativas, balanço patrimonial e atestados de acervo técnico.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1E3A8A] transition-all transform group-hover:translate-x-1 shrink-0 ml-4" />
            </Link>

            <Link
              href="/dashboard/calendario"
              className="py-4 flex items-center justify-between group hover:bg-[#F8FAFC] -mx-4 px-4 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors">
                    Calendário de Sessões e Prazos
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Monitoramento de validade das certidões cruzado com as datas de disputa e prazos de impugnação.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1E3A8A] transition-all transform group-hover:translate-x-1 shrink-0 ml-4" />
            </Link>

            <Link
              href="/dashboard/acervo"
              className="py-4 flex items-center justify-between group hover:bg-[#F8FAFC] -mx-4 px-4 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors">
                    Portfólio de Acervo Técnico (Súmula 263/TCU)
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Análise de quantitativos comprovados e regra de somatório de parcelas de maior relevância.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1E3A8A] transition-all transform group-hover:translate-x-1 shrink-0 ml-4" />
            </Link>
          </div>
        </section>

        {/* HISTÓRICO DE AUDITORIAS: TABELA LIMPA EM CARD BRANCO */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <h2 className="text-sm font-semibold text-[#0F172A]">
              Histórico de Editais Auditados
            </h2>
            <span className="text-xs text-[#64748B]">Total: {auditList.length}</span>
          </div>

          <AuditHistoryTable
            companyName={user?.company || "51.926.034 RENAN OSCAR ARAUJO CRUZ"}
            companyCnpj={user?.cnpj || "51.926.034/0001-42"}
            onSelectAudit={(payload) => setSelectedAuditData(payload)}
          />
        </section>

        {/* ROI E ECONOMIA */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
          <RoiDashboard
            auditHistory={auditList}
            planPriceMonthly={user?.plan === "Enterprise" ? 890 : user?.plan === "Pro" ? 297 : 97}
          />
        </section>

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
