"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { adminStore, AuditEvent } from "@/lib/admin-store";
import {
  History,
  Search,
  Filter,
  ShieldCheck,
  Eye,
  FileCheck,
  Sparkles,
  Lock,
  Download,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function AdminAuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);

  useEffect(() => {
    setEvents(adminStore.getAuditEvents());
  }, []);

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.actorEmail.toLowerCase().includes(search.toLowerCase()) ||
      (e.tenantName && e.tenantName.toLowerCase().includes(search.toLowerCase())) ||
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      e.entityAffected.toLowerCase().includes(search.toLowerCase());

    const matchesAction = actionFilter === "all" || e.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  return (
    <AdminLayout activeTab="audit">
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/10 border border-purple-500/30 text-purple-400 tracking-wide uppercase">
                Pilar 6 • Trilha de Auditoria Imutável (Append-Only)
              </span>
              <span className="text-xs text-slate-400 font-mono">Segurança Jurídica & LGPD</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight legal-serif">
              Linha do Tempo de Governança & Auditoria
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Registro append-only de sessões de suporte, calibrações de IA, uploads no cofre e disparos de minutas.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar evento por ator, empresa, ação ou entidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-950/80 border border-slate-700/80 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="all">Todas as Ações</option>
              <option value="ANALYSIS_GENERATED">Análise de Edital Gerada</option>
              <option value="SUPPORT_IMPERSONATION_STARTED">Modo Suporte Iniciado</option>
              <option value="SUPPORT_IMPERSONATION_ENDED">Modo Suporte Finalizado</option>
              <option value="RULE_SET_UPDATED">Atualização de Rule Set (IA)</option>
              <option value="TENANT_UPDATED">Tenant Alterado</option>
              <option value="ANNOUNCEMENT_CREATED">Comunicado Criado</option>
            </select>
          </div>
        </div>

        {/* Timeline Table */}
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
                  <th className="py-3 px-4">Timestamp (BRT)</th>
                  <th className="py-3 px-4">Ator / Papel</th>
                  <th className="py-3 px-4">Ação Registrada</th>
                  <th className="py-3 px-4">Tenant Afetado</th>
                  <th className="py-3 px-4">Entidade / Objeto</th>
                  <th className="py-3 px-4 text-right">Detalhes Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                      Nenhum registro de auditoria encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(evt.timestamp).toLocaleString("pt-BR", {
                          timeZone: "America/Sao_Paulo",
                        })}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{evt.actorEmail}</div>
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase mt-0.5 ${
                            evt.actorRole === "superadmin"
                              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                              : evt.actorRole === "system"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {evt.actorRole}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-xs text-slate-200">
                          {evt.action}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {evt.tenantName ? (
                          <div>
                            <div className="font-medium text-white">{evt.tenantName}</div>
                            <span className="text-[10px] text-slate-500 font-mono">{evt.tenantId}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 font-mono text-[11px]">— Plataforma Global —</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300 text-[11px]">
                        {evt.entityAffected}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedEvent(evt)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] transition-colors"
                        >
                          Ver JSON
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Payload JSON */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#0b101d] border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono">
                    Evento: {selectedEvent.action}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">ID: {selectedEvent.id}</span>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs rounded text-slate-300"
                >
                  Fechar
                </button>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-60">
                  {JSON.stringify(selectedEvent.payload, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
