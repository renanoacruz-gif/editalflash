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
import { Plus, ArrowRight } from "lucide-react";

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
          <div className="flex items-center justify-between pb-4 border-b border-[#1f313f]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedAuditData(null)}
              className="gap-1.5"
            >
              ← Voltar ao Histórico
            </Button>
            <span className="text-xs font-mono text-[#8C9DA8]">
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
      <div className="space-y-12 max-w-5xl mx-auto pb-24 font-sans">
        
        {/* CABEÇALHO EDITORIAL ABERTO — SEM CAIXAS */}
        <section className="pt-2 pb-6 border-b border-[#1f313f] flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#8C9DA8]">
              <span>Ambiente de Auditoria Documental</span>
              <span>•</span>
              <span className="text-white font-medium">{user?.primary_vertical || "Serviços Contínuos"}</span>
              <span>•</span>
              <span>Lei 14.133/2021</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-normal text-white tracking-tight font-display">
              {user?.name?.split(" ")[0] ? `Olá, ${user.name.split(" ")[0]}` : "Visão Geral"}
            </h1>
            <p className="text-sm text-[#8C9DA8] max-w-xl leading-relaxed">
              Auditoria de conformidade e prevenção de inabilitações antes da disputa em licitações públicas.
            </p>
          </div>

          <div className="shrink-0">
            <Link href="/dashboard/nova-analise">
              <Button variant="primary" size="md" className="gap-2 bg-[#CCD0CF] text-[#06141B] hover:bg-white border-0 font-medium px-5">
                <Plus className="w-4 h-4 text-[#06141B]" />
                <span>Auditar Novo Edital</span>
              </Button>
            </Link>
          </div>
        </section>

        {/* MÉTRICAS FLUIDAS EM LINHA — ZERO CARDS (LINEAR/STRIPE PATTERN) */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-8 py-2 border-b border-[#1f313f] pb-10">
          <div>
            <span className="text-xs text-[#8C9DA8] block">
              Saldo de Auditorias
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-semibold font-mono text-white tracking-tight">
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
                className="text-xs text-[#CCD0CF] hover:underline cursor-pointer"
              >
                + Comprar
              </button>
            </div>
            <span className="text-xs text-[#4A5C6A] block mt-1">Plano {user?.plan || "Starter"}</span>
          </div>

          <div>
            <span className="text-xs text-[#8C9DA8] block">
              Editais Auditados
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-semibold font-mono text-white tracking-tight">
                {auditList.length}
              </span>
              <span className="text-xs text-[#8C9DA8]">no histórico</span>
            </div>
            <span className="text-xs text-[#4A5C6A] block mt-1">Criptografia AES-256</span>
          </div>

          <div>
            <span className="text-xs text-[#8C9DA8] block">
              Cláusulas Restritivas
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-4xl font-semibold font-mono tracking-tight ${armadilhasTotal > 0 ? "text-[#F59E0B]" : "text-white"}`}>
                {armadilhasTotal}
              </span>
              <span className="text-xs text-[#8C9DA8]">apontadas</span>
            </div>
            <span className="text-xs text-[#4A5C6A] block mt-1">Mapeadas para Art. 164</span>
          </div>

          <div>
            <span className="text-xs text-[#8C9DA8] block">
              Cofre Documental
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-semibold font-mono text-[#10B981] tracking-tight">
                {auditList.length > 0 ? 4 : 0}
              </span>
              <span className="text-xs text-[#10B981]">vigentes</span>
            </div>
            <span className="text-xs text-[#4A5C6A] block mt-1">Cruzamento Art. 62</span>
          </div>
        </section>

        {/* NAVEGAÇÃO ENTRE MÓDULOS — LISTA EDITORIAL FLUIDA SEM CAIXAS */}
        <section className="space-y-4">
          <div className="pb-2 border-b border-[#1f313f] flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-wider text-[#8C9DA8] font-mono">
              Acesso Rápido aos Módulos
            </h2>
          </div>

          <div className="divide-y divide-[#1f313f]">
            <Link
              href="/dashboard/nova-analise?tab=pncp"
              className="py-4 flex items-center justify-between group hover:bg-[#11212D]/50 px-3 rounded-lg transition-colors"
            >
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium text-white group-hover:text-[#CCD0CF] transition-colors">
                  Busca e Radar PNCP
                </h3>
                <p className="text-xs text-[#8C9DA8] leading-relaxed">
                  Localize certames abertos diretamente na base do Portal Nacional de Contratações Públicas.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#4A5C6A] group-hover:text-white transition-all transform group-hover:translate-x-1 shrink-0 ml-4" />
            </Link>

            <Link
              href="/dashboard/cofre"
              className="py-4 flex items-center justify-between group hover:bg-[#11212D]/50 px-3 rounded-lg transition-colors"
            >
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium text-white group-hover:text-[#CCD0CF] transition-colors">
                  Cofre de Documentos (Art. 62)
                </h3>
                <p className="text-xs text-[#8C9DA8] leading-relaxed">
                  Custódia segura de certidões negativas, balanço patrimonial e atestados de acervo técnico.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#4A5C6A] group-hover:text-white transition-all transform group-hover:translate-x-1 shrink-0 ml-4" />
            </Link>

            <Link
              href="/dashboard/calendario"
              className="py-4 flex items-center justify-between group hover:bg-[#11212D]/50 px-3 rounded-lg transition-colors"
            >
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium text-white group-hover:text-[#CCD0CF] transition-colors">
                  Calendário de Sessões e Prazos
                </h3>
                <p className="text-xs text-[#8C9DA8] leading-relaxed">
                  Monitoramento de validade das certidões cruzado com as datas de disputa e prazos de impugnação.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#4A5C6A] group-hover:text-white transition-all transform group-hover:translate-x-1 shrink-0 ml-4" />
            </Link>

            <Link
              href="/dashboard/acervo"
              className="py-4 flex items-center justify-between group hover:bg-[#11212D]/50 px-3 rounded-lg transition-colors"
            >
              <div className="space-y-0.5">
                <h3 className="text-sm font-medium text-white group-hover:text-[#CCD0CF] transition-colors">
                  Portfólio de Acervo Técnico (Súmula 263/TCU)
                </h3>
                <p className="text-xs text-[#8C9DA8] leading-relaxed">
                  Análise de quantitativos comprovados e regra de somatório de parcelas de maior relevância.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#4A5C6A] group-hover:text-white transition-all transform group-hover:translate-x-1 shrink-0 ml-4" />
            </Link>
          </div>
        </section>

        {/* HISTÓRICO DE AUDITORIAS — TABELA LIMPA */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1f313f]">
            <h2 className="text-xs uppercase tracking-wider text-[#8C9DA8] font-mono">
              Histórico Recente de Editais
            </h2>
            <span className="text-xs text-[#4A5C6A]">Registros: {auditList.length}</span>
          </div>

          <AuditHistoryTable
            companyName={user?.company || "51.926.034 RENAN OSCAR ARAUJO CRUZ"}
            companyCnpj={user?.cnpj || "51.926.034/0001-42"}
            onSelectAudit={(payload) => setSelectedAuditData(payload)}
          />
        </section>

        {/* ROI E ECONOMIA */}
        <section className="pt-4 border-t border-[#1f313f]">
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
