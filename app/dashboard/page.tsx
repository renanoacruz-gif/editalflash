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
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* CHECKLIST DE ATIVAÇÃO & BOAS-VINDAS (CONTA NOVA / ZERO DADOS) */}
        {auditList.length === 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/40 rounded-2xl p-6 sm:p-8 border-2 border-blue-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-200/60">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-[#2740F0] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  1
                </span>
                <div>
                  <h2 className="text-base font-bold text-slate-900 font-display">
                    Etapas Iniciais para Ativar a Auditoria da sua Empresa
                  </h2>
                  <p className="text-xs text-slate-600">
                    Sua conta está limpa e pronta. Complete estas 3 ações rápidas para blindar suas disputas:
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/configuracoes"
                className="text-xs font-mono font-bold text-[#2740F0] hover:underline shrink-0"
              >
                Gerenciar Perfil →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              {/* Etapa 1 */}
              <div className="bg-white p-4 rounded-xl border border-blue-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    Passo 1
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Pendente</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900">Completar Dados da Empresa</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Confirme CNPJ e selecione a sua Vertical Dominante (Engenharia, TI, Saúde, Serviços).
                </p>
                <Link
                  href="/dashboard/configuracoes"
                  className="inline-block text-[11px] font-bold text-[#2740F0] hover:underline pt-1"
                >
                  Configurar agora →
                </Link>
              </div>

              {/* Etapa 2 */}
              <div className="bg-white p-4 rounded-xl border border-blue-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    Passo 2
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Pendente</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900">Carregar Documentos no Cofre</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Faça o upload do Balanço Patrimonial e das Certidões (CND Federal, CNDT e FGTS).
                </p>
                <Link
                  href="/dashboard/cofre"
                  className="inline-block text-[11px] font-bold text-[#2740F0] hover:underline pt-1"
                >
                  Ir para o Cofre →
                </Link>
              </div>

              {/* Etapa 3 */}
              <div className="bg-white p-4 rounded-xl border border-blue-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    Passo 3
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Pronto</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900">Auditar seu Primeiro Edital</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Submeta o PDF ou informe o número do certame no PNCP para gerar o parecer executivo.
                </p>
                <Link
                  href="/dashboard/nova-analise"
                  className="inline-block text-[11px] font-bold text-[#2740F0] hover:underline pt-1"
                >
                  Submeter edital →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Banner Institucional */}
        <div className="bg-[var(--surface)] rounded-lg p-6 sm:p-8 border border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[var(--brand-tint)] text-[var(--ink)] text-xs font-mono font-semibold border border-[var(--brand)]/20">
              <BrandIcon name="garantia" size="s16" />
              <span>Painel de Auditoria Preventiva • Modo Ativo: {user?.primary_vertical || "Serviços Contínuos"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight font-display">
              Bem-vindo, {user?.name || "Gestor de Licitações"}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ink-2)] max-w-xl leading-relaxed">
              Responda antes de disputar se a sua empresa passa na habilitação (Art. 62 da Lei 14.133/2021) com prova literal de página e linha do edital.
            </p>
          </div>

          <Link
            href="/dashboard/nova-analise"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-xs font-bold bg-[var(--brand-solid)] hover:brightness-110 text-white shadow-sm transition-all shrink-0 active:scale-98"
          >
            <BrandIcon name="upload" size="s16" accentCobalt={false} />
            <span>Nova Análise de Edital</span>
            <BrandIcon name="seta" size="s16" accentCobalt={false} />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="bg-[var(--surface)] rounded-lg p-4 border border-[var(--line)] space-y-1 shadow-xs">
            <span className="text-[11px] font-mono text-[var(--ink-2)] uppercase tracking-wider font-medium">
              Créditos &amp; Análises
            </span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-bold font-mono text-[var(--ink)]">
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
                className="text-[11px] text-[var(--brand)] font-mono font-bold hover:underline"
              >
                + Comprar
              </button>
            </div>
            <p className="text-[11px] text-[var(--ink-2)] font-mono">
              Plano: {user?.plan || "Starter"}
            </p>
          </div>

          <div className="bg-[var(--surface)] rounded-lg p-4 border border-[var(--line)] space-y-1 shadow-xs">
            <span className="text-[11px] font-mono text-[var(--ink-2)] uppercase tracking-wider font-medium">
              Editais Salvos
            </span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-bold font-mono text-[var(--ink)]">{auditList.length}</span>
              <span className="text-xs text-[var(--brand)] font-mono font-semibold">Base Ativa</span>
            </div>
            <p className="text-[11px] text-[var(--ink-2)] font-mono">Criptografia AES-256</p>
          </div>

          <div className="bg-[var(--surface)] rounded-lg p-4 border border-[var(--line)] space-y-1 shadow-xs">
            <span className="text-[11px] font-mono text-[var(--ink-2)] uppercase tracking-wider font-medium">
              Cláusulas Restritivas
            </span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-bold font-mono text-[var(--bad-fg)]">
                {auditList.reduce((acc, item) => acc + (item.armadilhasCount || 0), 0)}
              </span>
              <span className="text-[11px] text-[var(--ink-2)] font-mono">Art. 164</span>
            </div>
            <p className="text-[11px] text-[var(--ink-2)] font-mono">Mapeadas para impugnação</p>
          </div>

          <div className="bg-[var(--surface)] rounded-lg p-4 border border-[var(--line)] space-y-1 shadow-xs">
            <span className="text-[11px] font-mono text-[var(--ink-2)] uppercase tracking-wider font-medium">
              Cofre de Documentos
            </span>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-bold font-mono text-[var(--ok-fg)]">
                {auditList.length > 0 ? 4 : 0}
              </span>
              <span className="text-[11px] text-[var(--ok-fg)] font-mono font-semibold">Válidos</span>
            </div>
            <p className="text-[11px] text-[var(--ink-2)] font-mono">Cruzamento em tempo real</p>
          </div>
        </div>

        {/* Acesso aos 4 Pilares da Auditoria Preventiva */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[var(--ink)] font-mono uppercase tracking-wider">
              Pilares da Auditoria Preventiva
            </h2>
            <span className="text-xs text-[var(--ink-2)] font-mono">Lei Federal 14.133/2021</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <Link
              href="/dashboard/nova-analise?tab=pncp"
              className="bg-[var(--surface)] p-4 rounded-lg border border-[var(--line)] hover:border-[var(--brand)] transition-colors flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-[var(--bg)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] shrink-0">
                  <BrandIcon name="busca" size="s20" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--ink)] font-display group-hover:text-[var(--brand)] transition-colors">
                    Pilar 1: Radar de Editais PNCP
                  </h3>
                  <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                    Localize certames da sua vertical diretamente na base oficial do governo.
                  </p>
                </div>
              </div>
              <BrandIcon name="seta" size="s16" accentCobalt={false} className="group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>

            <Link
              href="/dashboard/cofre"
              className="bg-[var(--surface)] p-4 rounded-lg border border-[var(--line)] hover:border-[var(--brand)] transition-colors flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-[var(--bg)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] shrink-0">
                  <BrandIcon name="cofre" size="s20" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--ink)] font-display group-hover:text-[var(--brand)] transition-colors">
                    Pilar 2: Cofre de Documentos (Art. 62)
                  </h3>
                  <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                    Custódia de certidões, balanços e acervos técnicos (CATs/ARTs).
                  </p>
                </div>
              </div>
              <BrandIcon name="seta" size="s16" accentCobalt={false} className="group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>

            <Link
              href="/dashboard/calendario"
              className="bg-[var(--surface)] p-4 rounded-lg border border-[var(--line)] hover:border-[var(--brand)] transition-colors flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-[var(--bg)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] shrink-0">
                  <BrandIcon name="calendario" size="s20" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--ink)] font-display group-hover:text-[var(--brand)] transition-colors">
                    Pilar 3: Calendário Unificado
                  </h3>
                  <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                    Cruzamento da vigência de certidões com a data de abertura da sessão.
                  </p>
                </div>
              </div>
              <BrandIcon name="seta" size="s16" accentCobalt={false} className="group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>

            <Link
              href="/dashboard/nova-analise"
              className="bg-[var(--surface)] p-4 rounded-lg border border-[var(--line)] hover:border-[var(--brand)] transition-colors flex items-center justify-between group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-[var(--bg)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] shrink-0">
                  <BrandIcon name="semaforo" size="s20" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--ink)] font-display group-hover:text-[var(--brand)] transition-colors">
                    Pilar 4: Semáforo de Habilitação & Minutas
                  </h3>
                  <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                    Veredito com prova de página/linha e minutas prontas do Art. 164.
                  </p>
                </div>
              </div>
              <BrandIcon name="seta" size="s16" accentCobalt={false} className="group-hover:translate-x-1 transition-transform shrink-0" />
            </Link>
          </div>
        </div>

        {/* DASHBOARD DE ROI PARA O GESTOR DE LICITAÇÕES */}
        <RoiDashboard
          auditHistory={auditList}
          planPriceMonthly={user?.plan === "Enterprise" ? 890 : user?.plan === "Pro" ? 297 : 97}
        />

        {/* Histórico Centralizado de Editais Auditados */}
        <AuditHistoryTable
          companyName={user?.company || "51.926.034 RENAN OSCAR ARAUJO CRUZ"}
          companyCnpj={user?.cnpj || "51.926.034/0001-42"}
          onSelectAudit={(payload) => setSelectedAuditData(payload)}
        />

        {/* Modal de Checkout Seguro para aquisição de créditos */}
        <CheckoutModal
          isOpen={Boolean(checkoutItem)}
          onClose={() => setCheckoutItem(null)}
          item={checkoutItem}
        />
      </div>
    </DashboardLayout>
  );
}
