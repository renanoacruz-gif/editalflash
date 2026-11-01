"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/lib/auth-context";
import {
  Users,
  UserPlus,
  Shield,
  Trash2,
  Copy,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  Mail,
  Clock,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { AddSeatCheckout } from "@/components/AddSeatCheckout";

interface Member {
  id: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  joinedAt: string | null;
  isCurrentUser: boolean;
}

interface Invitation {
  id: string;
  invited_email: string;
  role: string;
  status: string;
  expires_at: string;
  created_at: string;
}

export default function TeamManagementPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [seats, setSeats] = useState({ max: 0, active: 0, available: 0, hasReachedLimit: false });
  const [poolCredits, setPoolCredits] = useState(0);
  const [currentUserRole, setCurrentUserRole] = useState<"ADMIN" | "MEMBER">("ADMIN");

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [generatedInviteLink, setGeneratedInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Carrega os dados da equipe
  const fetchTeamData = async () => {
    if (!user?.id) return;
    setLoading(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/team/members?userId=${user.id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setMembers(data.members || []);
        setInvitations(data.invitations || []);
        setSeats(data.seats || { max: 0, active: 0, available: 0, hasReachedLimit: false });
        setPoolCredits(data.poolCredits || 0);
        setCurrentUserRole(data.currentUserRole || "ADMIN");
      } else {
        setActionError(data.error || "Não foi possível carregar a equipe.");
      }
    } catch (err: any) {
      setActionError("Erro de conexão ao carregar equipe.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, [user?.id]);

  // Enviar convite
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !user?.id) return;

    setInviting(true);
    setActionError(null);
    setActionSuccess(null);
    setGeneratedInviteLink(null);

    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: user.id,
          invitedEmail: inviteEmail.trim(),
          role: "MEMBER",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccess(`Convite gerado para ${inviteEmail}!`);
        setGeneratedInviteLink(window.location.origin + data.inviteUrl);
        setInviteEmail("");
        fetchTeamData();
      } else {
        setActionError(data.error || "Falha ao emitir convite.");
      }
    } catch (err: any) {
      setActionError("Erro de comunicação ao enviar convite.");
    } finally {
      setInviting(false);
    }
  };

  // Remover membro
  const handleRemoveMember = async (memberId: string, memberEmail: string) => {
    if (!user?.id) return;
    if (!confirm(`Tem certeza que deseja revogar o acesso de ${memberEmail}?`)) return;

    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch("/api/team/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: user.id,
          memberId,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionSuccess(`Membro ${memberEmail} desvinculado com sucesso.`);
        fetchTeamData();
      } else {
        setActionError(data.error || "Não foi possível revogar o membro.");
      }
    } catch (err: any) {
      setActionError("Erro de comunicação ao revogar membro.");
    }
  };

  const copyToClipboard = () => {
    if (!generatedInviteLink) return;
    navigator.clipboard.writeText(generatedInviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <DashboardLayout activeTab="equipe">
      <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-6 pb-20">
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#253745] pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-[#11212D] text-[#CCD0CF] border border-[#253745]">
                <Users className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold font-display text-white tracking-tight">
                Equipe & Assentos Multi-User
              </h1>
            </div>
            <p className="text-sm text-[#9BA8AB] mt-1">
              Gerencie sócios, contadores e analistas com permissões segmentadas e pool de créditos unificado.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchTeamData}
              disabled={loading}
              className="px-3 py-2 text-xs font-mono font-medium rounded-lg border border-[#253745] text-[#CCD0CF] hover:bg-[#11212D] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </button>
            {currentUserRole === "ADMIN" && (
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
                className="px-4 py-2 text-xs font-mono font-bold rounded-lg bg-[#11212D] border border-[#253745] hover:bg-[#253745] text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Contratar Assentos (R$ 29/mês)
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Alertas Operacionais */}
        {actionError && (
          <div className="p-4 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)] text-rose-800 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Atenção</p>
              <p className="text-rose-700 mt-0.5">{actionError}</p>
            </div>
          </div>
        )}

        {actionSuccess && (
          <div className="p-4 rounded-xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.25)] text-emerald-800 text-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Sucesso</p>
              <p className="text-emerald-700 mt-0.5">{actionSuccess}</p>
            </div>
          </div>
        )}

        {/* Cards Bento de Métricas e Capacidade */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-[#11212D] border border-[#253745] shadow-sm space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#9BA8AB]">
              Assentos Adicionais Contratados
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-white">
                {seats.active}
              </span>
              <span className="text-sm font-mono text-[#4A5C6A]">/ {seats.max} assentos</span>
            </div>
            <p className="text-xs text-[#9BA8AB] pt-1">
              {seats.available > 0
                ? `${seats.available} convite(s) disponível(is) para envio imediato.`
                : seats.max === 0
                ? "Plano individual. Faça upgrade para habilitar assentos extras."
                : "Limite máximo de assentos atingido. Adquira mais no checkout."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#11212D] border border-[#253745] shadow-sm space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#9BA8AB]">
              Pool de Créditos Compartilhados
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-[#CCD0CF]">
                {poolCredits}
              </span>
              <span className="text-sm font-mono text-[#4A5C6A]">auditorias restantes</span>
            </div>
            <p className="text-xs text-[#9BA8AB] pt-1">
              Todos os membros consom do mesmo saldo de auditorias da organização.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#11212D] border border-[#253745] shadow-sm space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#9BA8AB]">
              Seu Nível de Acesso (RBAC)
            </span>
            <div className="flex items-center gap-2 pt-1">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                  currentUserRole === "ADMIN"
                    ? "bg-purple-100 text-purple-800 border border-purple-200"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                {currentUserRole === "ADMIN" ? "ADMIN (Titular)" : "MEMBER (Operador)"}
              </span>
            </div>
            <p className="text-xs text-[#9BA8AB] pt-1">
              {currentUserRole === "ADMIN"
                ? "Acesso irrestrito a faturamento, convites e exclusão de contas."
                : "Acesso a auditorias e cofre. Protegido contra cancelamento e faturamento."}
            </p>
          </div>
        </div>

        {/* Formulário de Envio de Convite (Apenas para ADMIN) */}
        {currentUserRole === "ADMIN" && (
          <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-md border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-bold font-display">Convidar Novo Membro da Equipe</h2>
            </div>
            <p className="text-xs text-slate-300">
              Adicione o e-mail do seu contador, sócio ou analista. Ele terá acesso para auditar editais e consultar documentos do cofre.
            </p>

            <form onSubmit={handleSendInvite} className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-[#4A5C6A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="exemplo@contabilidade.com.br"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={inviting || seats.hasReachedLimit}
                className="px-6 py-2.5 rounded-xl bg-[#11212D] border border-[#253745] hover:bg-[#253745] disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm text-white flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                {inviting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Gerando Convite...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Gerar Convite
                  </>
                )}
              </button>
            </form>

            {generatedInviteLink && (
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2 mt-3">
                <span className="text-xs font-mono text-blue-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Link de Convite Gerado (Validade: 7 dias)
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedInviteLink}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-[#11212D]0 text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabela de Membros Ativos */}
        <div className="bg-[#11212D] rounded-2xl border border-[#253745] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#1c2b36] flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-display text-white">Membros Ativos na Organização</h2>
              <p className="text-xs text-[#9BA8AB]">Usuários com acesso concedido ao ambiente compartilhado.</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold">
              {members.length} membro(s)
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {members.map((member) => (
              <div key={member.id} className="p-4 flex items-center justify-between hover:bg-[#11212D] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-[#253745] flex items-center justify-center font-bold text-slate-700 font-mono text-sm">
                    {member.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{member.email}</span>
                      {member.isCurrentUser && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#11212D] text-blue-700 border border-blue-200">
                          Você
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#4A5C6A] font-mono">
                      {member.joinedAt ? `Ingressou em: ${new Date(member.joinedAt).toLocaleDateString("pt-BR")}` : "Conta Titular"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-mono px-2.5 py-1 rounded-md font-semibold ${
                      member.role === "ADMIN"
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {member.role}
                  </span>

                  {currentUserRole === "ADMIN" && !member.isCurrentUser && member.role !== "ADMIN" && (
                    <button
                      onClick={() => handleRemoveMember(member.id, member.email)}
                      className="p-2 text-[#4A5C6A] hover:text-rose-600 hover:bg-[rgba(239,68,68,0.1)] rounded-lg transition-colors"
                      title="Revogar acesso deste membro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabela de Convites Pendentes */}
        {invitations.length > 0 && (
          <div className="bg-[#11212D] rounded-2xl border border-[#253745] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#1c2b36]">
              <h2 className="text-base font-bold font-display text-white">Convites Pendentes</h2>
              <p className="text-xs text-[#9BA8AB]">Aguardando aceite pelo destinatário.</p>
            </div>
            <div className="divide-y divide-slate-100">
              {invitations.map((inv) => (
                <div key={inv.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white">{inv.invited_email}</p>
                      <p className="text-xs text-[#4A5C6A] font-mono">
                        Expira em: {new Date(inv.expires_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-mono font-medium">
                    Aguardando Aceite
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal de Checkout PIX de Assentos Pro */}
        <AddSeatCheckout
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          userId={user?.id || ""}
          userEmail={user?.email || ""}
          currentSeats={seats.active}
          maxSeats={seats.max}
          onSuccess={() => {
            fetchTeamData();
          }}
        />
      </div>
    </DashboardLayout>
  );
}
