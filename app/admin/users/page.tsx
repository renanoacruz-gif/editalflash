"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { adminStore, Tenant } from "@/lib/admin-store";
import { useAuth } from "@/lib/auth-context";
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  DollarSign,
  Eye,
  PlusCircle,
  Ban,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
  Lock,
  History,
  X,
  CreditCard,
} from "lucide-react";

export default function AdminUsersPage() {
  const { startImpersonation } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [search, setSearch] = useState("");
  const [verticalFilter, setVerticalFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit form state
  const [editPlan, setEditPlan] = useState<"Starter" | "Pro" | "Setup">("Pro");
  const [editCredits, setEditCredits] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<"active" | "blocked">("active");

  // Admin Ban modal state
  const [showBanModal, setShowBanModal] = useState(false);
  const [banTenantTarget, setBanTenantTarget] = useState<Tenant | null>(null);
  const [banReasonText, setBanReasonText] = useState("");
  const [adminActionLoading, setAdminActionLoading] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const reloadData = () => {
    setTenants(adminStore.getTenants());
  };

  const handleApproveTenant = async (t: Tenant) => {
    setAdminActionLoading(true);
    try {
      await fetch("/api/admin/user-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", userId: t.id, userEmail: t.responsibleEmail }),
      });
      adminStore.updateTenant(t.id, {
        status: "active",
        accessStatus: "ACTIVE",
      });
      showToast(`Acesso aprovado com sucesso para ${t.name}.`);
      reloadData();
    } catch (err: any) {
      showToast(`Falha ao aprovar: ${err?.message || "Erro de rede"}`);
    } finally {
      setAdminActionLoading(false);
    }
  };

  const handleOpenBanModal = (t: Tenant) => {
    setBanTenantTarget(t);
    setBanReasonText("");
    setShowBanModal(true);
  };

  const handleConfirmBan = async () => {
    if (!banTenantTarget || !banReasonText.trim()) return;
    setAdminActionLoading(true);
    try {
      await fetch("/api/admin/user-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ban",
          userId: banTenantTarget.id,
          userEmail: banTenantTarget.responsibleEmail,
          banReason: banReasonText.trim(),
        }),
      });
      adminStore.updateTenant(banTenantTarget.id, {
        status: "blocked",
        accessStatus: "BANNED",
        banReason: banReasonText.trim(),
      });
      showToast(`Conta de ${banTenantTarget.name} banida com sucesso.`);
      setShowBanModal(false);
      reloadData();
    } catch (err: any) {
      showToast(`Falha ao banir: ${err?.message || "Erro de rede"}`);
    } finally {
      setAdminActionLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleOpenEdit = (t: Tenant) => {
    setSelectedTenant(t);
    setEditPlan(t.plan);
    setEditCredits(t.creditsRemaining);
    setEditStatus(t.status);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!selectedTenant) return;

    adminStore.updateTenant(selectedTenant.id, {
      plan: editPlan,
      creditsRemaining: editCredits,
      status: editStatus,
      mrrContribution: editPlan === "Pro" && editStatus === "active" ? 197 : 0,
    });

    showToast(`Tenant ${selectedTenant.name} atualizado com sucesso.`);
    setShowEditModal(false);
    reloadData();
  };

  const handleToggleBlock = (t: Tenant) => {
    const nextStatus = t.status === "active" ? "blocked" : "active";
    adminStore.updateTenant(t.id, { status: nextStatus });
    showToast(`Acesso do tenant ${t.name} foi ${nextStatus === "active" ? "DESBLOQUEADO" : "BLOQUEADO"}.`);
    reloadData();
  };

  const handleAddCredits = (t: Tenant, amount: number) => {
    const nextCredits = t.creditsRemaining + amount;
    adminStore.updateTenant(t.id, { creditsRemaining: nextCredits });
    showToast(`+${amount} créditos adicionados para ${t.name}. Novo saldo: ${nextCredits}.`);
    reloadData();
  };

  const handleImpersonate = (t: Tenant) => {
    const success = startImpersonation(t.id);
    if (!success) {
      showToast("Não foi possível iniciar o modo suporte. Verifique credenciais de SuperAdmin.");
    }
  };

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.cnpj.includes(search) ||
      t.responsibleEmail.toLowerCase().includes(search.toLowerCase());

    const matchesVertical = verticalFilter === "all" || t.primary_vertical === verticalFilter;
    const matchesPlan = planFilter === "all" || t.plan === planFilter;
    const matchesStatus = statusFilter === "all" || t.subscriptionStatus === statusFilter;

    return matchesSearch && matchesVertical && matchesPlan && matchesStatus;
  });

  return (
    <AdminLayout activeTab="users">
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
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-500/10 border border-blue-500/30 text-blue-400 tracking-wide uppercase">
                Pilar 3 & 4 • Gestão de Tenants & Modo Suporte
              </span>
              <span className="text-xs text-slate-400 font-mono">Governança RLS & Auditoria</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight legal-serif">
              Tenants Hub & Central de Suporte Licitatório
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Gestão de licitantes, vertical preferencial, saldos de créditos, status do cofre e impersonation auditado.
            </p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por Empresa, CNPJ ou E-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <select
              value={verticalFilter}
              onChange={(e) => setVerticalFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-950/80 border border-slate-700/80 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Todas as Verticais</option>
              <option value="Obras Públicas e Engenharia">Obras Públicas e Engenharia</option>
              <option value="Compras e Fornecimentos">Compras e Fornecimentos</option>
              <option value="Serviços Contínuos (Limpeza, Segurança, Manutenção)">Serviços Contínuos</option>
              <option value="Saúde e Medicamentos">Saúde e Medicamentos</option>
              <option value="Tecnologia da Informação">Tecnologia da Informação</option>
            </select>
          </div>

          <div>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-950/80 border border-slate-700/80 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Todos os Planos</option>
              <option value="Pro">Plano Pro (R$ 197/mês)</option>
              <option value="Starter">Plano Starter (Avulso)</option>
              <option value="Setup">Setup Completo (R$ 497)</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-950/80 border border-slate-700/80 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Assinatura Ativa</option>
              <option value="past_due">Atraso no Pagamento</option>
              <option value="trial">Trial / Degustação</option>
              <option value="canceled">Cancelada</option>
            </select>
          </div>
        </div>

        {/* Tenants Table */}
        <div className="bg-[var(--surface)] rounded-lg border border-[var(--line)] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-[var(--surface)] z-10 border-b border-[var(--line)]">
                <tr className="text-[10px] uppercase font-mono text-[var(--ink-2)] font-semibold">
                  <th className="py-3 px-4">Licitante (CNPJ / Responsável)</th>
                  <th className="py-3 px-4">Vertical Principal</th>
                  <th className="py-3 px-4">Status Acesso</th>
                  <th className="py-3 px-4">Plano & Status</th>
                  <th className="py-3 px-4 text-center">Créditos</th>
                  <th className="py-3 px-4 text-center">Cofre Docs</th>
                  <th className="py-3 px-4 text-center">Termos Aceitos em (LGPD)</th>
                  <th className="py-3 px-4 text-center">Último Veredito (Data + Resultado)</th>
                  <th className="py-3 px-4 text-right">Ações de Gestão & Suporte</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)] font-sans">
                {filteredTenants.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[var(--ink-2)] text-xs font-mono">
                      Nenhum tenant cadastrado no momento. Base limpa e pronta para receber novos clientes.
                    </td>
                  </tr>
                ) : (
                  filteredTenants.map((t) => (
                    <tr
                      key={t.id}
                      className={`hover:bg-[var(--brand-tint)]/25 transition-colors ${
                        t.status === "blocked" ? "opacity-60 bg-[var(--bad-bg)]/20" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="font-bold text-[var(--ink)] text-sm">{t.name}</div>
                          {t.isFounder && (
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40 uppercase tracking-wider">
                              Founder
                            </span>
                          )}
                          {t.status === "blocked" && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--bad-bg)] text-[var(--bad-fg)] font-bold border border-[var(--bad)]/30">
                              BLOQUEADO
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[var(--ink-2)] font-mono mt-0.5">
                          CNPJ: {t.cnpj} • {t.responsibleName} ({t.responsibleEmail})
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-[var(--bg)] text-[var(--ink)] font-medium border border-[var(--line)]">
                          {t.primary_vertical}
                        </span>
                      </td>

                      {/* Coluna: Status Acesso (Badge Colorido) */}
                      <td className="py-3.5 px-4">
                        {(() => {
                          const currentAccess = t.accessStatus || (t.status === "blocked" ? "BANNED" : "ACTIVE");
                          if (currentAccess === "BANNED") {
                            return (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                                <Ban className="w-3 h-3 text-red-400" />
                                <span>BANNED</span>
                              </span>
                            );
                          }
                          if (currentAccess === "PENDING") {
                            return (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                <Clock className="w-3 h-3 text-amber-400" />
                                <span>PENDING</span>
                              </span>
                            );
                          }
                          return (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>ACTIVE</span>
                            </span>
                          );
                        })()}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[var(--ink)]">Plano {t.plan}</span>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                              t.subscriptionStatus === "active"
                                ? "bg-[var(--ok-bg)] text-[var(--ok-fg)] border border-[var(--ok)]/30"
                                : t.subscriptionStatus === "past_due"
                                ? "bg-[var(--warn-bg)] text-[var(--warn-fg)] border border-[var(--warn)]/30"
                                : t.subscriptionStatus === "trial"
                                ? "bg-[var(--brand-tint)] text-[var(--brand)] border border-[var(--brand)]/30"
                                : "bg-[var(--bad-bg)] text-[var(--bad-fg)] border border-[var(--bad)]/30"
                            }`}
                          >
                            {t.subscriptionStatus}
                          </span>
                        </div>
                        <span className="text-[10px] text-[var(--ink-2)] font-mono block mt-0.5">
                          {t.plan === "Pro" ? "R$ 197/mês" : t.setupPurchased ? "Setup R$ 497" : "Avulso R$ 29/cr"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <span className="font-mono font-bold text-sm text-[var(--ink)]">
                            {t.creditsRemaining}
                          </span>
                          <button
                            onClick={() => handleAddCredits(t, 5)}
                            className="p-1 rounded bg-[var(--bg)] hover:bg-[var(--line)] text-[var(--ok-fg)] text-[10px] font-mono font-bold border border-[var(--line)]"
                            title="Adicionar 5 créditos de teste"
                          >
                            +5
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono text-[var(--ink-2)]">
                        {t.docsInVault} docs
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono text-xs">
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--ok-fg)]">
                            <CheckCircle2 className="w-3 h-3 text-[var(--ok-fg)]" />
                            <span>{t.termsAcceptedAt ? new Date(t.termsAcceptedAt).toLocaleDateString("pt-BR") : "28/10/2026"}</span>
                          </span>
                          <span className="text-[10px] text-[var(--ink-2)] block">
                            v{t.termsVersion || "2026-10-28"}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                            t.lastSemaforoStatus === "PASSA"
                              ? "bg-[var(--ok-bg)] text-[var(--ok-fg)] border border-[var(--ok)]/30"
                              : t.lastSemaforoStatus === "RESSALVA"
                              ? "bg-[var(--warn-bg)] text-[var(--warn-fg)] border border-[var(--warn)]/30"
                              : t.lastSemaforoStatus === "ELIMINATORIA"
                              ? "bg-[var(--bad-bg)] text-[var(--bad-fg)] border border-[var(--bad)]/30"
                              : "bg-[var(--bg)] text-[var(--ink-2)] border border-[var(--line)]"
                          }`}
                        >
                          {t.lastSemaforoStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {(t.accessStatus === "PENDING" || t.status === "blocked") && (
                            <button
                              onClick={() => handleApproveTenant(t)}
                              disabled={adminActionLoading}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-mono font-bold transition-all shadow-xs disabled:opacity-50"
                              title="Aprovar Acesso Imediatamente"
                            >
                              Aprovar
                            </button>
                          )}
                          {t.accessStatus !== "BANNED" && t.status !== "blocked" && !t.isFounder && (
                            <button
                              onClick={() => handleOpenBanModal(t)}
                              disabled={adminActionLoading}
                              className="px-2 py-1 rounded bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/30 text-[11px] font-mono font-bold transition-all disabled:opacity-50"
                              title="Banir e Revogar Acesso"
                            >
                              Banir
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit(t)}
                            className="px-2.5 py-1 rounded bg-[var(--bg)] hover:bg-[var(--line)] text-[var(--ink)] border border-[var(--line)] text-[11px] font-mono font-semibold transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleImpersonate(t)}
                            className="px-2.5 py-1 rounded bg-[var(--brand)] hover:brightness-110 text-white text-[11px] font-mono font-bold transition-all shadow-xs"
                          >
                            Suporte
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

        {/* Modal de Edição Manual de Tenant */}
        {showEditModal && selectedTenant && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#0b101d] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white legal-serif">
                    Editar Tenant: {selectedTenant.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">CNPJ: {selectedTenant.cnpj}</span>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Plano Atual</label>
                  <select
                    value={editPlan}
                    onChange={(e: any) => setEditPlan(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Pro">Plano Pro (R$ 197/mês)</option>
                    <option value="Starter">Plano Starter (Avulso)</option>
                    <option value="Setup">Setup Completo (R$ 497)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Saldo de Créditos</label>
                  <input
                    type="number"
                    value={editCredits}
                    onChange={(e) => setEditCredits(parseInt(e.target.value) || 0)}
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Status de Acesso</label>
                  <select
                    value={editStatus}
                    onChange={(e: any) => setEditStatus(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="active">Ativo (Acesso Liberado)</option>
                    <option value="blocked">Bloqueado (Suspenso)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors shadow-sm"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Modal de Confirmação de Banimento com Motivo Obrigatório */}
        {showBanModal && banTenantTarget && (
          <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
            <div className="bg-[#0b101d] border border-red-500/50 rounded-2xl max-w-md w-full p-6 space-y-4 text-left shadow-2xl">
              <div className="flex items-center gap-2.5 text-red-400">
                <Ban className="w-5 h-5" />
                <h3 className="text-base font-bold text-white font-display">
                  Revogação Imediata de Acesso (Banir)
                </h3>
              </div>

              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200">
                Você está prestes a bloquear o acesso da empresa <strong>{banTenantTarget.name}</strong> ({banTenantTarget.responsibleEmail}). Todas as sessões ativas serão invalidadas.
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Motivo Obrigatório do Banimento:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ex: Fraude documental, violação reiterada dos termos de serviço ou solicitação judicial..."
                  value={banReasonText}
                  onChange={(e) => setBanReasonText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBanModal(false)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={!banReasonText.trim() || adminActionLoading}
                  onClick={handleConfirmBan}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-red-600/20"
                >
                  Confirmar e Banir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
