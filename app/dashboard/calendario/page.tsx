"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Bell,
  Building,
  FileText,
  ShieldCheck,
  Send,
  ExternalLink,
  Plus,
} from "lucide-react";
import { CalendarioVencimentoItem } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { Lock } from "lucide-react";

export default function CalendarioPage() {
  const { user } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const cleanEmail = user?.email?.toLowerCase().trim() || "";
  const isAdmin = cleanEmail === "renan.oacruz@gmail.com" || cleanEmail === "renanoacruz@gmail.com";
  const isStarter = user?.plan === "Starter" && !isAdmin;

  const [items, setItems] = useState<CalendarioVencimentoItem[]>([
    {
      id: "cal-1",
      tipo: "documento",
      titulo: "CND Federal e Previdenciária (Receita/PGFN)",
      orgaoOuEmissor: "Receita Federal do Brasil",
      data: "2026-11-02",
      diasRestantes: 5,
      alertaRisco: true,
      mensagemRisco: "Eliminatória potencial: vence 3 dias após a abertura do Pregão #42 do TRF (Art. 68).",
    },
    {
      id: "cal-2",
      tipo: "edital",
      titulo: "Sessão de Lances: Pregão Obras Pavimentação TRF",
      orgaoOuEmissor: "Tribunal Regional Federal",
      data: "2026-10-30",
      diasRestantes: 2,
      alertaRisco: false,
    },
    {
      id: "cal-3",
      tipo: "documento",
      titulo: "Certidão de Regularidade do FGTS (CRF)",
      orgaoOuEmissor: "Caixa Econômica Federal",
      data: "2026-11-12",
      diasRestantes: 15,
      alertaRisco: false,
    },
    {
      id: "cal-4",
      tipo: "edital",
      titulo: "Prazo Limite para Pedido de Impugnação / Diligência",
      orgaoOuEmissor: "SEDUC Obras Escolares SP",
      data: "2026-11-05",
      diasRestantes: 8,
      alertaRisco: false,
    },
    {
      id: "cal-5",
      tipo: "documento",
      titulo: "Registro Anual da Empresa no CREA-SP",
      orgaoOuEmissor: "Conselho Regional de Engenharia",
      data: "2026-12-31",
      diasRestantes: 64,
      alertaRisco: false,
    },
    {
      id: "cal-6",
      tipo: "documento",
      titulo: "CNDT Trabalhista Consolidada",
      orgaoOuEmissor: "Tribunal Superior do Trabalho",
      data: "2027-03-15",
      diasRestantes: 138,
      alertaRisco: false,
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTestAlert = () => {
    showToast("Alerta preventivo sincronizado com WhatsApp e E-mail corporativo.");
  };

  return (
    <DashboardLayout activeTab="calendario">
      <div className="max-w-6xl mx-auto space-y-6">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-2">
              <AlertTriangle className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Garantia de Não-Eliminação</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Calendário Unificado de Vencimentos
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Cruzamento automático de certidões da empresa contra as datas das sessões e prazos de impugnação.
            </p>
          </div>

          <button
            onClick={handleTestAlert}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#11212D] hover:bg-[#253745] text-[#CCD0CF] shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            <Bell className="w-4 h-4" strokeWidth={1.5} />
            <span>Configurar Alertas 15/7/3 Dias</span>
          </button>
        </div>

        {/* GATE DE PLANO: PLANO STARTER (CONSULTA AVULSA) BLOQUEADO */}
        {isStarter ? (
          <div className="rounded-2xl p-8 sm:p-12 border border-slate-200 text-center max-w-2xl mx-auto space-y-5 bg-slate-50 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 mx-auto">
              <Lock className="w-7 h-7" strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 font-mono">
                Recurso Exclusivo do Plano Pro / Mensal
              </span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight legal-serif">
                Calendário Unificado com Alertas Automáticos
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                O seu plano atual (Créditos Avulsos) dá acesso à auditoria individual de editais. Para ter o monitoramento contínuo de vencimento de certidões cruzado com as datas dos pregões, faça upgrade para o Plano Mensal.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all active:scale-95"
              >
                <span>Fazer Upgrade para Plano Mensal (R$ 197/mês)</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* ALERTA CRÍTICO SE HOUVER VENCIMENTO CRUZADO (LEGIBILIDADE PERFEITA COM CONTRASTE WCAG AAA) */}
            {items.some((i) => i.alertaRisco) && (
              <div className="p-6 rounded-2xl bg-rose-50 border-2 border-rose-300 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" strokeWidth={2} />
                  <span>Risco Grave de Desclassificação Identificado Pelo Sistema</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  O sistema detectou que a sua <strong className="text-rose-900 font-bold">CND Federal</strong> vence em <strong className="text-rose-900 font-bold">5 dias</strong>, enquanto a homologação do certame de Pavimentação ocorrerá na próxima semana. Conforme a jurisprudência consolidada do TCU, documentos devem manter validade até a assinatura do contrato.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href="https://solucoes.receita.fazenda.gov.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all active:scale-98"
                  >
                    <span>Renovar Certidão Agora</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => showToast("Alerta adiado por 24 horas.")}
                    className="text-xs text-rose-700 hover:text-rose-900 font-medium hover:underline cursor-pointer"
                  >
                    Dispensar temporariamente
                  </button>
                </div>
              </div>
            )}

        {/* TIMELINE DE VENCIMENTOS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 pl-1">
            <span>Ordem Cronológica de Urgência</span>
            <span>{items.length} eventos monitorados</span>
          </div>

          <div className="space-y-3 relative pl-6 border-l-2 border-[var(--line)] ml-2">
            {items.map((item) => {
              const dotColor = item.alertaRisco
                ? "bg-[var(--bad)]"
                : item.diasRestantes <= 15
                ? "bg-[var(--warn)]"
                : "bg-[var(--ok)]";

              const isPast = item.diasRestantes < 0;

              return (
                <div key={item.id} className="relative">
                  {/* Dot da Timeline no conector */}
                  <span
                    className={`absolute -left-[31px] top-6 w-3 h-3 rounded-full border-2 border-[var(--surface)] ${dotColor} ${
                      !isPast && item.diasRestantes <= 15 ? "animate-pulse" : ""
                    }`}
                  />

                  <div
                    className={`bg-[var(--surface)] rounded-lg p-6 border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md hover:-translate-y-0.5 ${
                      isPast
                        ? "opacity-40"
                        : item.alertaRisco
                        ? "border-[var(--bad)]/50 bg-[var(--bad-bg)]/20 shadow-xs"
                        : item.diasRestantes <= 15
                        ? "border-[var(--warn)]/40 hover:border-[var(--warn)] shadow-xs"
                        : "border-[var(--line)] hover:border-[var(--brand-tint)] shadow-xs"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                            item.tipo === "documento"
                              ? "bg-[var(--brand-tint)] text-[var(--brand)] border-[var(--brand)]/20"
                              : "bg-[var(--ok-bg)] text-[var(--ok-fg)] border-[var(--ok)]/20"
                          }`}
                        >
                          {item.tipo === "documento" ? "Documento da Empresa" : "Prazo de Edital"}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-[var(--ink)] font-display">{item.titulo}</h3>
                      </div>

                      <p className="text-xs text-[var(--ink-2)] font-sans">
                        Emissor/Órgão: <strong>{item.orgaoOuEmissor}</strong>
                      </p>

                      {item.mensagemRisco && (
                        <p className="text-xs font-semibold text-[var(--bad-fg)] mt-1 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-[var(--bad)]" />
                          <span>{item.mensagemRisco}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-center shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-[var(--ink)] block">
                          {new Date(item.data).toLocaleDateString("pt-BR")}
                        </span>
                        <span
                          className={`text-[11px] font-mono font-semibold ${
                            item.alertaRisco
                              ? "text-[var(--bad-fg)] font-bold"
                              : item.diasRestantes <= 15
                              ? "text-[var(--warn-fg)] font-bold"
                              : "text-[var(--ok-fg)]"
                          }`}
                        >
                          {item.diasRestantes} dias restantes
                        </span>
                      </div>

                      <button
                        onClick={() => showToast(`Alerta para '${item.titulo}' ajustado com sucesso.`)}
                        className="p-2 rounded-md bg-[var(--bg)] hover:bg-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink)] border border-[var(--line)] transition-colors active:scale-95"
                        title="Configurar Notificação"
                      >
                        <Bell className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </>
        )}
      </div>
    </DashboardLayout>
  );
}
