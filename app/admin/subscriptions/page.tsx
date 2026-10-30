"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Tag,
  RefreshCw,
  Scale,
  ShieldCheck,
  Download,
  Calendar,
} from "lucide-react";

export default function AdminSubscriptionsPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAction = (id: string, action: "ativar" | "cancelar" | "desconto") => {
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          if (action === "ativar") {
            showToast(`Assinatura ${id} ativada manualmente`);
            return { ...s, status: "Ativa" };
          }
          if (action === "cancelar") {
            showToast(`Assinatura ${id} cancelada`);
            return { ...s, status: "Cancelada" };
          }
          if (action === "desconto") {
            showToast(`Desconto de 20% aplicado à assinatura ${id}`);
            return { ...s, amount: "R$ 157,60/mês (-20%)" };
          }
        }
        return s;
      })
    );
  };

  return (
    <AdminLayout activeTab="subscriptions">
      <div className="max-w-7xl mx-auto space-y-6">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a] border border-emerald-500/50 text-emerald-300 px-4 py-2.5 rounded-lg shadow-2xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono mb-1 border border-slate-700">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
              <span>Controle Financeiro & Margem por Auditoria</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight legal-serif">
              Faturamento Recorrente, Créditos & Modelos Híbridos
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Consumo real vs. faturamento no modelo de custo por licitação segura
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-400">Assinaturas Ativas: <strong className="text-emerald-400">{subscriptions.length}</strong></span>
            <span className="text-slate-400">Créditos em Circulação: <strong className="text-slate-200">0</strong></span>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0b101d] rounded-xl p-4 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Receita Mensal Recorrente (MRR)
            </span>
            <span className="text-2xl font-bold text-white font-mono">R$ 0,00</span>
            <p className="text-[11px] text-slate-400 font-mono">
              Aguardando primeiras adesões orgânicas
            </p>
          </div>

          <div className="bg-[#0b101d] rounded-xl p-4 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Créditos Avulsos (R$ 29/unid)
            </span>
            <span className="text-2xl font-bold text-white font-mono">R$ 0,00</span>
            <p className="text-[11px] text-slate-400 font-mono">
              0 análises individuais vendidas no mês
            </p>
          </div>

          <div className="bg-[#0b101d] rounded-xl p-4 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Setup & Parametrização (R$ 497)
            </span>
            <span className="text-2xl font-bold text-white font-mono">R$ 0,00</span>
            <p className="text-[11px] text-slate-400 font-mono">
              0 clientes com cofre inicial auditado
            </p>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-[#0b101d] rounded-xl border border-slate-800 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-[#070b14] text-slate-400 font-semibold border-b border-slate-800 font-mono text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Contrato</th>
                  <th className="py-2.5 px-4">Licitante</th>
                  <th className="py-2.5 px-3">Modelo</th>
                  <th className="py-2.5 px-3">Valor Cobrado</th>
                  <th className="py-2.5 px-3">Créditos (Consumo/Alocado)</th>
                  <th className="py-2.5 px-3">Próxima Fatura</th>
                  <th className="py-2.5 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-slate-500 font-mono">
                      Nenhuma assinatura ou empresa cadastrada no momento. Base pronta para clientes reais.
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-300">{s.id}</td>
                      <td className="py-2.5 px-4">
                        <span className="font-bold text-white block">{s.user}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{s.email}</span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-200">{s.plan}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-white">{s.amount}</td>
                      <td className="py-2.5 px-3 font-mono">
                        <span className="text-emerald-400 font-bold">{s.creditsConsumed}</span>
                        <span className="text-slate-500"> / {s.creditsAllocated} créditos</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">{s.nextBilling}</td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleAction(s.id, "desconto")}
                            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] transition-colors"
                          >
                            -20%
                          </button>
                          <button
                            onClick={() => handleAction(s.id, "cancelar")}
                            className="px-2 py-1 rounded bg-slate-900 hover:bg-rose-950/40 border border-slate-700 text-slate-400 hover:text-rose-400 text-[11px] transition-colors"
                          >
                            Suspender
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
