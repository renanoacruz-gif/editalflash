"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { adminStore, GlobalAnnouncement } from "@/lib/admin-store";
import { PrimaryVertical } from "@/lib/types";
import {
  Megaphone,
  PlusCircle,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Radio,
  Lock,
  X,
  Send,
  Bell,
} from "lucide-react";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<GlobalAnnouncement[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New announcement form state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "warning" | "critical" | "update">("info");
  const [targetVertical, setTargetVertical] = useState<PrimaryVertical | "ALL">("ALL");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const reloadData = () => {
    setAnnouncements(adminStore.getAnnouncements());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    adminStore.addAnnouncement({
      title,
      message,
      type,
      targetVertical,
      active: true,
      createdBy: "renanoacruz@gmail.com",
    });

    showToast("Comunicado publicado e propagado para os tenants.");
    setTitle("");
    setMessage("");
    setShowModal(false);
    reloadData();
  };

  const handleToggleActive = (id: string) => {
    adminStore.toggleAnnouncement(id);
    showToast("Status do comunicado atualizado.");
    reloadData();
  };

  const handleDelete = (id: string) => {
    adminStore.deleteAnnouncement(id);
    showToast("Comunicado removido.");
    reloadData();
  };

  return (
    <AdminLayout activeTab="announcements">
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-emerald-600 text-slate-950 text-xs font-bold shadow-xl border border-emerald-400 flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400 tracking-wide uppercase">
                Pilar 7 • Comunicados Globais & Segmentação Vertical
              </span>
              <span className="text-xs text-slate-400 font-mono">Notificações em Tempo Real</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight legal-serif">
              Central de Avisos aos Tenants
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Publique banners fixos de manutenção ou alertas regulatórios específicos por vertical diretamente no topo do painel do cliente.
            </p>
          </div>

          <div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Novo Comunicado</span>
            </button>
          </div>
        </div>

        {/* Announcements List */}
        <div className="grid grid-cols-1 gap-4">
          {announcements.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-xs">
              Nenhum comunicado publicado no momento.
            </div>
          ) : (
            announcements.map((ann) => (
              <div
                key={ann.id}
                className={`p-5 rounded-xl border transition-all ${
                  ann.active
                    ? "bg-slate-900/80 border-slate-700"
                    : "bg-slate-950/40 border-slate-800/80 opacity-60"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                          ann.type === "warning"
                            ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                            : ann.type === "critical"
                            ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
                            : "bg-blue-500/15 border-blue-500/30 text-blue-300"
                        }`}
                      >
                        {ann.type}
                      </span>
                      <h3 className="text-sm font-bold text-white">{ann.title}</h3>
                      {ann.active ? (
                        <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Ativo no Painel</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">Pausado</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">{ann.message}</p>
                    <div className="flex items-center gap-3 pt-2 text-[10px] font-mono text-slate-400">
                      <span>
                        Público-Alvo:{" "}
                        <strong className="text-slate-200">
                          {ann.targetVertical === "ALL" ? "Todos os Tenants" : ann.targetVertical}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>Criado em: {new Date(ann.createdAt).toLocaleDateString("pt-BR")}</span>
                      <span>•</span>
                      <span>Por: {ann.createdBy}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => handleToggleActive(ann.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                        ann.active
                          ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                          : "bg-emerald-950/40 text-emerald-400 border-emerald-500/40 hover:bg-emerald-900/60"
                      }`}
                    >
                      {ann.active ? "Desativar" : "Ativar"}
                    </button>
                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Excluir comunicado"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de Criação de Comunicado */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#0b101d] border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white legal-serif">
                  Publicar Comunicado nos Painéis dos Clientes
                </h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Título do Comunicado</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Atualização nas regras de PL para Obras"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Mensagem do Comunicado</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Descreva claramente o aviso de manutenção ou aprimoramento normativo..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-700 rounded-lg text-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Tipo de Destaque</label>
                    <select
                      value={type}
                      onChange={(e: any) => setType(e.target.value)}
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    >
                      <option value="info">Informativo (Azul)</option>
                      <option value="warning">Alerta / Manutenção (Amarelo)</option>
                      <option value="critical">Crítico / Urgente (Vermelho)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Público-Alvo (Segmentação)</label>
                    <select
                      value={targetVertical}
                      onChange={(e: any) => setTargetVertical(e.target.value)}
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-700 rounded-lg text-white font-medium"
                    >
                      <option value="ALL">Todos os Tenants (Global)</option>
                      <option value="Obras Públicas e Engenharia">Apenas Obras Públicas</option>
                      <option value="Compras e Fornecimentos">Apenas Compras</option>
                      <option value="Serviços Contínuos (Limpeza, Segurança, Manutenção)">Apenas Serviços Contínuos</option>
                      <option value="Saúde e Medicamentos">Apenas Saúde</option>
                      <option value="Tecnologia da Informação">Apenas TI</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publicar Agora</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
