"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/lib/auth-context";
import { BrandIcon } from "@/components/brand-icons";
import { CheckoutModal } from "@/components/CheckoutModal";
import { AuditHistoryTable } from "@/components/AuditHistoryTable";
import { ReportCard } from "@/components/ReportCard";
import { RoiDashboard } from "@/components/RoiDashboard";
import { EditalAnalysisResponse, AuditedTenderHistoryItem } from "@/lib/types";
import { getAuditHistory } from "@/lib/audit-history";
import { ArrowUpRight, ShieldCheck, Sparkles, Plus, Clock, FileText, CheckCircle2 } from "lucide-react";

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
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setSelectedAuditData(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900 transition-all cursor-pointer"
            >
              ← Voltar ao Histórico
            </button>
            <span className="text-xs font-mono text-slate-500">
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
        
        {/* CABEÇALHO LIMPO E DIRETO - SEM CARDS FECHADOS */}
        <section className="border-b border-slate-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[#2740F0] text-xs font-mono font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {user?.primary_vertical || "Serviços Contínuos"}
              </span>
              <span className="text-xs font-mono text-slate-400">Lei 14.133/2021</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Olá, {user?.name?.split(" ")[0] || "Gestor"}
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Auditoria preventiva de habilitação. Descubra com prova de página e linha se sua empresa passa antes de disputar.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dashboard/nova-analise"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-[#2740F0] hover:bg-blue-600 text-white shadow-md shadow-blue-500/15 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Auditar Novo Edital</span>
            </Link>
          </div>
        </section>

        {/* MÉTRICAS FLUIDAS EM LINHA - SEM BORDAS PESADAS DE CARD */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-2 border-b border-slate-200 pb-8">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block">
              Saldo de Auditorias
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono text-slate-900">
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
                className="text-xs font-mono font-bold text-[#2740F0] hover:underline cursor-pointer"
              >
                + Comprar
              </button>
            </div>
            <span className="text-xs text-slate-500 block mt-0.5">Plano {user?.plan || "Starter"}</span>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block">
              Editais Auditados
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono text-slate-900">
                {auditList.length}
              </span>
              <span className="text-xs text-slate-500 font-mono">no histórico</span>
            </div>
            <span className="text-xs text-slate-500 block mt-0.5">Criptografia AES-256</span>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block">
              Cláusulas Restritivas
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-3xl font-black font-mono ${armadilhasTotal > 0 ? "text-rose-600" : "text-slate-900"}`}>
                {armadilhasTotal}
              </span>
              <span className="text-xs text-slate-500 font-mono">apontadas</span>
            </div>
            <span className="text-xs text-slate-500 block mt-0.5">Mapeadas para Art. 164</span>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 block">
              Cofre Documental
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono text-emerald-600">
                {auditList.length > 0 ? 4 : 0}
              </span>
              <span className="text-xs text-emerald-700 font-mono font-semibold">vigentes</span>
            </div>
            <span className="text-xs text-slate-500 block mt-0.5">Cruzamento Art. 62</span>
          </div>
        </section>

        {/* GUIA INICIAL (SE AINDA NÃO HOUVER ANÁLISES) */}
        {auditList.length === 0 && (
          <section className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Comece por aqui: Ativação rápida em 3 passos
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Complete as etapas abaixo para auditar com precisão máxima do seu CNPJ.
                </p>
              </div>
              <Link
                href="/dashboard/configuracoes"
                className="text-xs font-mono font-bold text-[#2740F0] hover:underline"
              >
                Gerenciar Perfil →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold text-[#2740F0]">01. Empresa & Vertical</span>
                <h4 className="text-sm font-bold text-slate-900">Confirmar CNPJ</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Defina sua vertical dominante para calibrar o semáforo de acervos técnicos.
                </p>
                <Link href="/dashboard/configuracoes" className="text-xs text-[#2740F0] font-bold hover:underline inline-block pt-1">
                  Configurar agora →
                </Link>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold text-[#2740F0]">02. Cofre (Art. 62)</span>
                <h4 className="text-sm font-bold text-slate-900">Upload de Balanço e CNDs</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Guarde suas certidões e balanço para cálculo automático de PL e índices.
                </p>
                <Link href="/dashboard/cofre" className="text-xs text-[#2740F0] font-bold hover:underline inline-block pt-1">
                  Acessar cofre →
                </Link>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold text-[#2740F0]">03. Primeiro Edital</span>
                <h4 className="text-sm font-bold text-slate-900">Auditar com 1 Clique</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Suba o PDF do certame e receba o parecer de risco e minutas administrativas.
                </p>
                <Link href="/dashboard/nova-analise" className="text-xs text-[#2740F0] font-bold hover:underline inline-block pt-1">
                  Submeter edital →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* NAVEGAÇÃO LIMPA DE PILARES OPERACIONAIS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-700">
              Módulos do Sistema
            </h2>
            <span className="text-xs font-mono text-slate-400">Lei Federal 14.133/2021</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/dashboard/nova-analise?tab=pncp"
              className="p-5 rounded-xl border border-slate-200 hover:border-[#2740F0] hover:bg-slate-50 transition-all group block space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#2740F0]">01. PNCP</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#2740F0] transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-display">Radar de Editais</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Busca de certames abertos diretamente na base do governo.
              </p>
            </Link>

            <Link
              href="/dashboard/cofre"
              className="p-5 rounded-xl border border-slate-200 hover:border-[#2740F0] hover:bg-slate-50 transition-all group block space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#2740F0]">02. Documentos</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#2740F0] transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-display">Cofre Art. 62</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Custódia de CNDs, balanços e acervos técnicos (CATs).
              </p>
            </Link>

            <Link
              href="/dashboard/calendario"
              className="p-5 rounded-xl border border-slate-200 hover:border-[#2740F0] hover:bg-slate-50 transition-all group block space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#2740F0]">03. Prazos</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#2740F0] transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-display">Calendário de Abertura</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cruzamento da validade das certidões com a data de disputa.
              </p>
            </Link>

            <Link
              href="/dashboard/nova-analise"
              className="p-5 rounded-xl border border-slate-200 hover:border-[#2740F0] hover:bg-slate-50 transition-all group block space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#2740F0]">04. Auditoria</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#2740F0] transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 font-display">Semáforo de Risco</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Parecer de habilitação com prova de página e minutas prontas.
              </p>
            </Link>
          </div>
        </section>

        {/* HISTÓRICO DE AUDITORIAS */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-700">
              Histórico de Editais Auditados
            </h2>
            <span className="text-xs font-mono text-slate-400">Total: {auditList.length}</span>
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
