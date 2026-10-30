"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/lib/auth-context";
import { PrimaryVertical } from "@/lib/types";
import {
  Building2,
  CreditCard,
  Share2,
  Bell,
  Shield,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  ExternalLink,
  Users,
  Gift,
  BookOpen,
  Sparkles,
} from "lucide-react";

export default function AccountSettingsPage() {
  const { user, selectPlan, updatePrimaryVertical } = useAuth();
  const [activeTab, setActiveTab] = useState<"perfil" | "plano" | "indicacao" | "seguranca" | "como-usar">("perfil");

  // Estados do formulário de Perfil
  const [companyName, setCompanyName] = useState(user?.company || "Alpha Construtora e Comércio Ltda");
  const [cnpj, setCnpj] = useState(user?.cnpj || "12.345.678/0001-90");
  const [contactName, setContactName] = useState(user?.name || "Roberto Mendes");
  const [contactEmail, setContactEmail] = useState(user?.email || "roberto@empresa.com.br");
  const [vertical, setVertical] = useState<PrimaryVertical>(user?.primary_vertical || "Obras Públicas e Engenharia");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Estados de Auto-Gestão de Assinatura e Conta (LGPD)
  const [subscriptionStatus, setSubscriptionStatus] = useState<"ACTIVE" | "PAUSED" | "CANCELLED">("ACTIVE");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelOtherText, setCancelOtherText] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmedCheckbox, setDeleteConfirmedCheckbox] = useState(false);
  const [accountActionLoading, setAccountActionLoading] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Estados da aba de Indicação
  const [copiedLink, setCopiedLink] = useState(false);
  const referralCode = user?.id ? user.id.slice(0, 8).toUpperCase() : "FLASH50";
  const referralLink = `https://editalflash.com.br/convite?ref=${referralCode}`;

  // Estados de Notificações
  const [alert15Days, setAlert15Days] = useState(true);
  const [alert7Days, setAlert7Days] = useState(true);
  const [alert3Days, setAlert3Days] = useState(true);
  const [alertRetificacoes, setAlertRetificacoes] = useState(true);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (updatePrimaryVertical) {
      updatePrimaryVertical(vertical);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <DashboardLayout activeTab="configuracoes">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="pb-4 border-b border-slate-200">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5 text-[#2740F0]" />
            <span>Central Gerencial do Licitante</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Configurações da Conta &amp; Gestão
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Gerencie o perfil da sua empresa, parâmetros da Lei 14.133, limites de plano e programa de parceiros.
          </p>
        </div>

        {/* Abas de Navegação */}
        <div className="flex border-b border-slate-200 gap-1 overflow-x-auto text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab("perfil")}
            className={`py-3 px-4 border-b-2 font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "perfil"
                ? "border-[#2740F0] text-[#2740F0]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Perfil Corporativo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("plano")}
            className={`py-3 px-4 border-b-2 font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "plano"
                ? "border-[#2740F0] text-[#2740F0]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Plano &amp; Faturamento</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("indicacao")}
            className={`py-3 px-4 border-b-2 font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "indicacao"
                ? "border-[#2740F0] text-[#2740F0]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Indicação &amp; Bônus (+5)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("seguranca")}
            className={`py-3 px-4 border-b-2 font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "seguranca"
                ? "border-[#2740F0] text-[#2740F0]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Alertas &amp; Segurança</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("como-usar")}
            className={`py-3 px-4 border-b-2 font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "como-usar"
                ? "border-[#2740F0] text-[#2740F0]"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Como Usar a Plataforma</span>
          </button>
        </div>

        {/* FEEDBACK DE SUCESSO */}
        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Configurações corporativas atualizadas com sucesso!</span>
          </div>
        )}

        {/* CONTEÚDO DAS ABAS */}

        {/* ABA 1: PERFIL CORPORATIVO */}
        {activeTab === "perfil" && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 font-display">
                Dados Cadastrais da Empresa Licitante
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Razão Social
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#2740F0]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    CNPJ da Matriz ou Filial
                  </label>
                  <input
                    type="text"
                    required
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#2740F0] font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nome do Responsável / Gestor de Licitações
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#2740F0]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    E-mail Corporativo para Envio de Pareceres
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#2740F0]"
                  />
                </div>
              </div>
            </div>

            {/* Configuração da Vertical Operacional */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Vertical Operacional Dominante (Calibração da Lei 14.133)
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Define quais regras específicas o motor de auditoria prioriza (ex: ART/CAT para Engenharia, ANVISA para Saúde, ISO 27001 para TI).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  {
                    id: "Obras Públicas e Engenharia",
                    title: "Obras Públicas e Engenharia",
                    desc: "Validação rigorosa de CAT, ART/RRT, PL ≥ 10% e Súmula 263 TCU.",
                  },
                  {
                    id: "Compras e Fornecimentos",
                    title: "Compras e Fornecimentos de Bens",
                    desc: "Atestados de fornecimento prévio (50%), catálogos e amostras.",
                  },
                  {
                    id: "Serviços Contínuos (Limpeza, Segurança, Manutenção)",
                    title: "Serviços Contínuos & Locação",
                    desc: "Planilhas de custos e formação de preços, encargos e convenções CCT.",
                  },
                  {
                    id: "Saúde e Medicamentos",
                    title: "Saúde, Medicamentos & OPME",
                    desc: "Alvará Sanitário, CRF, registros na ANVISA e rastreabilidade de lote.",
                  },
                  {
                    id: "Tecnologia da Informação",
                    title: "Tecnologia da Informação (TI)",
                    desc: "Atestados técnicos de software, ISO 27001, LGPD e nuvem pública.",
                  },
                  {
                    id: "Todos / Não tenho preferência definida",
                    title: "Todos / Regras Gerais da Lei 14.133",
                    desc: "Aplica apenas as regras comuns de habilitação da Lei 14.133.",
                  },
                ].map((item) => {
                  const isSelected = vertical === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setVertical(item.id as PrimaryVertical)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? "border-[#2740F0] bg-blue-50/50 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? "text-[#2740F0]" : "text-slate-900"}`}>
                          {item.title}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#2740F0]" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#2740F0] hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Salvar Alterações do Perfil
              </button>
            </div>
          </form>
        )}

        {/* ABA 2: PLANO & FATURAMENTO */}
        {activeTab === "plano" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="text-[11px] font-mono uppercase text-slate-500 font-bold block">
                  Plano Atual
                </span>
                <div className="text-2xl font-bold font-display text-slate-900">
                  {user?.plan || "Plano Pro"}
                </div>
                <p className="text-xs text-slate-600">
                  Cobrança {user?.billingCycle === "annual" ? "Anual (-20%)" : "Mensal"}
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ativo e Regular
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="text-[11px] font-mono uppercase text-slate-500 font-bold block">
                  Capacidade de Auditorias
                </span>
                <div className="text-2xl font-bold font-mono text-[#2740F0]">
                  {user?.plan === "Pro" || user?.plan === "Enterprise" ? "Ilimitadas" : "5 / mês"}
                </div>
                <p className="text-xs text-slate-600">
                  Uso no ciclo vigente: <strong className="text-slate-900">{user?.analysesUsed || 0} análises</strong>
                </p>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
                  <div className="bg-[#2740F0] h-full w-[25%]" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <span className="text-[11px] font-mono uppercase text-slate-500 font-bold block">
                  Cofre Documental
                </span>
                <div className="text-2xl font-bold font-display text-slate-900">
                  Espaço Ilimitado
                </div>
                <p className="text-xs text-slate-600">
                  CNDs, Balanços e Acervos sob custódia criptografada AES-256.
                </p>
              </div>
            </div>

            {/* Opções de Upgrade & Recarga */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Deseja migrar para o Ciclo Anual ou Plano Enterprise?
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Obtenha 20% de desconto adicional na anuidade ou suporte multi-CNPJs para grandes consórcios.
                </p>
              </div>
              <a
                href="/pricing"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shrink-0"
              >
                <span>Ver Todos os Planos</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* SEÇÃO: AUTO-GESTÃO DE ASSINATURA */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Gestão da Assinatura
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Pause temporariamente para preservar seus dados ou encerre a renovação automática.
                </p>
              </div>

              {actionNotice && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-mono">
                  {actionNotice}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={accountActionLoading || subscriptionStatus === "PAUSED"}
                  onClick={async () => {
                    if (!confirm("Deseja pausar sua assinatura por até 30 dias? Seus dados e cofre serão mantidos intactos.")) return;
                    setAccountActionLoading(true);
                    try {
                      const res = await fetch("/api/account/manage", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "pause", userId: user?.id, userEmail: user?.email }),
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error || "Erro ao pausar assinatura.");
                      setSubscriptionStatus("PAUSED");
                      setActionNotice("Assinatura pausada com sucesso. Seus dados permanecerão preservados por 30 dias.");
                    } catch (err: any) {
                      alert(err.message || "Falha na comunicação.");
                    } finally {
                      setAccountActionLoading(false);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border border-amber-300 font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {subscriptionStatus === "PAUSED" ? "Assinatura Pausada (30 dias)" : "Pausar Assinatura"}
                </button>

                <button
                  type="button"
                  disabled={accountActionLoading || subscriptionStatus === "CANCELLED"}
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {subscriptionStatus === "CANCELLED" ? "Assinatura Cancelada" : "Cancelar Assinatura"}
                </button>
              </div>
            </div>

            {/* SEÇÃO: ZONA DE PERIGO (EXCLUIR CONTA LGPD) */}
            <div className="p-6 rounded-2xl bg-red-50/50 border border-red-200 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-red-100 text-red-600 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-red-900 font-display">
                    Zona de Perigo: Exclusão Definitiva de Conta (LGPD)
                  </h3>
                  <p className="text-xs text-red-700 mt-1 leading-relaxed">
                    A exclusão da conta é irreversível. Todos os editais auditados, certidões e balanços do cofre documental serão excluídos permanentemente (hard delete). Registros contábeis e fiscais de faturamento são mantidos anonimizados para auditoria fiscal obrigatória (soft delete).
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Excluir Minha Conta
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ABA 3: PROGRAMA DE INDICAÇÃO BILATERAL */}
        {activeTab === "indicacao" && (
          <div className="space-y-6">
            {/* Banner de Apresentação da Bonificação */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white relative overflow-hidden shadow-lg">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono font-bold">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Benefício Bilateral: 5 + 5 Análises Gratuitas</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">
                  Convide o Contador ou Consultor da sua Empresa
                </h2>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-sans">
                  Para cada empresa ou profissional parceiro que se cadastrar através do seu link e realizar a primeira auditoria, <strong>você recebe 5 análises gratuitas</strong> na sua conta e o seu indicado também ganha <strong>5 análises de cortesia</strong>.
                </p>
              </div>
            </div>

            {/* Caixa com o Link Exclusivo de Indicação */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider block">
                Seu Link Exclusivo de Indicação
              </span>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 font-mono text-xs text-slate-800 truncate select-all">
                  {referralLink}
                </div>
                <button
                  type="button"
                  onClick={handleCopyReferral}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2740F0] hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer shrink-0"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? "Link Copiado!" : "Copiar Link"}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500">
                * As análises gratuitas são creditadas imediatamente após o convidado auditar o primeiro edital.
              </p>
            </div>

            {/* Placar de Indicações */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-xs font-mono text-slate-500 block mb-1">Convites Enviados</span>
                <span className="text-2xl font-bold font-mono text-slate-900">3</span>
                <span className="text-[11px] text-slate-400 block mt-1">Links acessados</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-xs font-mono text-slate-500 block mb-1">Parceiros Ativados</span>
                <span className="text-2xl font-bold font-mono text-emerald-600">2</span>
                <span className="text-[11px] text-emerald-700 block mt-1">Auditorias concluídas</span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <span className="text-xs font-mono text-slate-500 block mb-1">Análises Bônus Conquistadas</span>
                <span className="text-2xl font-bold font-mono text-[#2740F0]">+10</span>
                <span className="text-[11px] text-blue-700 block mt-1">Créditos vitalícios</span>
              </div>
            </div>
          </div>
        )}

        {/* ABA 4: ALERTAS & SEGURANÇA */}
        {activeTab === "seguranca" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 font-display">
                Alertas Preventivos de Habilitação
              </h2>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Avisar com 15 dias de antecedência antes de CNDs expirarem
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Dispara e-mail para o setor contábil providenciar certidões renovadas.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={alert15Days}
                    onChange={(e) => setAlert15Days(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2740F0] accent-[#2740F0] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Aviso Crítico de 7 e 3 dias antes da sessão pública
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Alerta se houver certidão com risco de vencimento durante o prazo recursal.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={alert7Days}
                    onChange={(e) => setAlert7Days(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2740F0] accent-[#2740F0] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Radar de Retificações do PNCP
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Notificar quando o órgão convocante publicar erratas ou alterar anexos de editais salvos.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={alertRetificacoes}
                    onChange={(e) => setAlertRetificacoes(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2740F0] accent-[#2740F0] cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Troca de Senha & Segurança */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 font-display">
                Segurança da Conta &amp; Autenticação
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#2740F0]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#2740F0]"
                  />
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => alert("Senha atualizada com sucesso!")}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Atualizar Senha
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ABA 5: GUIA COMO USAR A PLATAFORMA */}
        {activeTab === "como-usar" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 space-y-3 shadow-md">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-500/30">
                Guia Rápido de Sucesso
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">
                Como Funciona a Auditoria Preventiva da Lei 14.133/2021
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                O EditalFlash opera como o copiloto pericial da sua empresa, garantindo que você nunca entre em um pregão sem a certeza matemática de habilitação e com todas as peças jurídicas prontas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Passo 1 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#2740F0] font-bold font-mono text-sm flex items-center justify-center">
                    01
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">Alimente o Cofre Documental (Art. 62)</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Suba suas <strong>Certidões Negativas (CNDs)</strong>, <strong>Balanço Patrimonial</strong> e <strong>Atestados de Capacidade Técnica (CATs)</strong> uma única vez. O sistema indexa os índices contábeis (SG, LG, LC) e monitora automaticamente as datas de validade para você.
                </p>
              </div>

              {/* Passo 2 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#2740F0] font-bold font-mono text-sm flex items-center justify-center">
                    02
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">Audite Editais em 30 Segundos</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Em <strong>Nova Análise</strong>, arraste o PDF do edital ou busque diretamente pelo número de controle do <strong>PNCP</strong>. O motor isola os capítulos de habilitação e cruza as exigências contra os seus documentos cadastrados.
                </p>
              </div>

              {/* Passo 3 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#2740F0] font-bold font-mono text-sm flex items-center justify-center">
                    03
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">Interprete o Semáforo &amp; Súmula 263</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Os requisitos aparecem classificados em <strong>PASSA</strong>, <strong>RESSALVA</strong> ou <strong>ELIMINATÓRIA</strong> com citação exata de página e linha. Se o edital vedar o somatório de atestados de forma ilegal, o sistema alerta a afronta à Súmula 263 do TCU.
                </p>
              </div>

              {/* Passo 4 */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#2740F0] font-bold font-mono text-sm flex items-center justify-center">
                    04
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">Emita Parecer A4 ou Impugne com 1 Clique</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Gere o relatório pericial formal em PDF A4 institucional para apresentar à diretoria ou clique em <strong>"Gerar Minuta de Impugnação"</strong> para copiar uma petição do Art. 164 pronta com fundamentação do TCU para protocolo.
                </p>
              </div>
            </div>
          </div>
        )}
        {/* POPUP SURVEY DE CANCELAMENTO */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Confirmação de Cancelamento
                </h3>
                <p className="text-xs text-slate-500">
                  Por favor, informe o motivo principal do cancelamento para nos ajudar a melhorar o serviço:
                </p>
              </div>

              <div className="space-y-3">
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:border-[#2740F0]"
                >
                  <option value="">Selecione um motivo...</option>
                  <option value="Preço / Orçamento">Preço ou orçamento reduzido</option>
                  <option value="Não participo mais de licitações">Não participo mais de licitações no momento</option>
                  <option value="Dificuldade na usabilidade">Dificuldade técnica na usabilidade da plataforma</option>
                  <option value="Faltam recursos para meu nicho">Faltam recursos ou regras específicas para meu nicho</option>
                  <option value="Outro">Outro motivo</option>
                </select>

                {cancelReason === "Outro" && (
                  <textarea
                    rows={3}
                    placeholder="Conte-nos brevemente o que motivou sua decisão..."
                    value={cancelOtherText}
                    onChange={(e) => setCancelOtherText(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2740F0]"
                  />
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  disabled={!cancelReason || (cancelReason === "Outro" && !cancelOtherText.trim()) || accountActionLoading}
                  onClick={async () => {
                    const finalReason = cancelReason === "Outro" ? cancelOtherText.trim() : cancelReason;
                    setAccountActionLoading(true);
                    try {
                      const res = await fetch("/api/account/manage", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          action: "cancel",
                          userId: user?.id,
                          userEmail: user?.email,
                          reason: finalReason,
                        }),
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error || "Erro ao cancelar.");
                      setSubscriptionStatus("CANCELLED");
                      setShowCancelModal(false);
                      setActionNotice("Assinatura cancelada com sucesso. O acesso continuará até o término do ciclo.");
                    } catch (err: any) {
                      alert(err.message || "Erro na solicitação.");
                    } finally {
                      setAccountActionLoading(false);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Confirmar Cancelamento
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO DE CONTA (ZONA DE PERIGO) */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-red-200 shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center gap-2.5 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-lg font-bold font-display text-slate-900">
                  Exclusão Definitiva de Conta
                </h3>
              </div>

              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 space-y-1">
                <p className="font-bold">Aviso Crítico de Irreversibilidade:</p>
                <p>Todos os editais auditados e documentos do seu cofre serão eliminados permanentemente sem possibilidade de recuperação.</p>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Digite sua senha atual para autorizar:
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deleteConfirmedCheckbox}
                    onChange={(e) => setDeleteConfirmedCheckbox(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-red-600 accent-red-600 focus:ring-red-500 shrink-0"
                  />
                  <span className="text-xs text-slate-700 select-none">
                    Compreendo que esta ação é irreversível e autorizo a eliminação definitiva de todos os meus dados e documentos.
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Voltar com Segurança
                </button>
                <button
                  type="button"
                  disabled={!deletePassword || !deleteConfirmedCheckbox || accountActionLoading}
                  onClick={async () => {
                    setAccountActionLoading(true);
                    try {
                      const res = await fetch("/api/account/manage", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          action: "delete_account",
                          userId: user?.id,
                          userEmail: user?.email,
                          password: deletePassword,
                        }),
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error || "Erro ao excluir conta.");
                      alert("Conta excluída com sucesso em conformidade com a LGPD.");
                      window.location.href = "/";
                    } catch (err: any) {
                      alert(err.message || "Erro na comunicação.");
                    } finally {
                      setAccountActionLoading(false);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Excluir Permanentemente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
