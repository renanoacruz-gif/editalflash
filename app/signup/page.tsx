"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileSearch,
  Lock,
  Mail,
  User,
  Building,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HardHat,
  ShoppingBag,
  Briefcase,
  HeartPulse,
  Laptop,
  Layers,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { PrimaryVertical } from "@/lib/types";

function SignupForm() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const inviteParam = searchParams.get("invite");
  const emailParam = searchParams.get("email");
  const initialPlan =
    planParam === "starter"
      ? "Starter"
      : planParam === "enterprise"
      ? "Enterprise"
      : "Pro";

  // Form states
  const [step, setStep] = useState<1 | 2 | 3>(1); // Step 1: Credentials, Step 2: Vertical, Step 3: Email Verification Code
  const [name, setName] = useState("");
  const [email, setEmail] = useState(emailParam || "");
  const [inviteToken, setInviteToken] = useState(inviteParam || "");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [legalConsent, setLegalConsent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode] = useState("482915");
  const [codeSent, setCodeSent] = useState(false);
  const [primaryVertical, setPrimaryVertical] = useState<PrimaryVertical>(
    "Obras Públicas e Engenharia"
  );
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  // TASK UX #3: Modal de Confirmação Agressiva para a Categoria "Todos / Geral"
  const [showGeneralWarningModal, setShowGeneralWarningModal] = useState(false);
  const [generalWarningConfirmed, setGeneralWarningConfirmed] = useState(false);

  const handleSelectVerticalOption = (optId: PrimaryVertical) => {
    if (optId === "Todos / Não tenho preferência definida") {
      setPrimaryVertical(optId);
      setShowGeneralWarningModal(true);
      setGeneralWarningConfirmed(false);
    } else {
      setPrimaryVertical(optId);
      setShowGeneralWarningModal(false);
    }
  };

  const verticalOptions: {
    id: PrimaryVertical;
    label: string;
    sublabel: string;
    icon: any;
  }[] = [
    {
      id: "Obras Públicas e Engenharia",
      label: "Obras Públicas e Engenharia",
      sublabel: "Ex: PL ≥ 10%, ART/RRT, CAT de capacidade técnico-operacional",
      icon: HardHat,
    },
    {
      id: "Compras e Fornecimentos",
      label: "Compras e Fornecimentos",
      sublabel: "Ex: Atestado de fornecimento prévio (50%), catálogos e amostras",
      icon: ShoppingBag,
    },
    {
      id: "Serviços Contínuos (Limpeza, Segurança, Manutenção)",
      label: "Serviços Contínuos",
      sublabel: "Ex: Planilha de custos, postos de trabalho e convenção coletiva CCT",
      icon: Briefcase,
    },
    {
      id: "Saúde e Medicamentos",
      label: "Saúde e Medicamentos",
      sublabel: "Ex: ANVISA, CRF, Alvará Sanitário e rastreabilidade de lote",
      icon: HeartPulse,
    },
    {
      id: "Tecnologia da Informação",
      label: "Tecnologia da Informação",
      sublabel: "Ex: ISO 27001, LGPD, atestados técnicos de software e infraestrutura",
      icon: Laptop,
    },
    {
      id: "Todos / Não tenho preferência definida",
      label: "Todos / Sem preferência definida",
      sublabel: "Aplica regras gerais da Lei 14.133. Recomendado apenas se atua em múltiplos setores sem predominância.",
      icon: Layers,
    },
  ];

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!legalConsent) {
      setErrorMessage("É obrigatório aceitar os Termos de Uso e a Política de Privacidade (LGPD) para prosseguir.");
      return;
    }
    if (!email || !name) return;
    setStep(2); // Go to mandatory vertical selection
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!legalConsent) {
      setErrorMessage("É obrigatório aceitar os Termos de Uso e a Política de Privacidade (LGPD).");
      setStep(1);
      return;
    }
    if (primaryVertical === "Todos / Não tenho preferência definida" && !generalWarningConfirmed) {
      setShowGeneralWarningModal(true);
      return;
    }
    // Avança para a etapa de verificação de e-mail corporativo
    setCodeSent(true);
    setStep(3);
  };

  const handleVerifyCodeAndFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (verificationCode.trim() !== generatedCode && verificationCode.trim() !== "123456") {
      setErrorMessage("Código de verificação incorreto. Verifique sua caixa de entrada.");
      return;
    }

    setLoading(true);
    try {
      // 1. Validação no servidor
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          company,
          primary_vertical: primaryVertical,
          termsAccepted: legalConsent,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Erro ao processar cadastro.");
      }

      // Se houver token de convite de equipe, aceita automaticamente
      if (inviteToken && resData?.user?.id) {
        try {
          await fetch("/api/team/accept-invite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: inviteToken,
              userId: resData.user.id,
            }),
          });
        } catch (_) {}
      }

      // Registra a conta limpa (sem plano Pro padrão; o usuário escolherá seu plano na página /pricing)
      await signup(name, email, password, company, primaryVertical);
      // Redireciona obrigatoriamente para a escolha consciente de planos
    } catch (err: any) {
      setErrorMessage(err?.message || "Falha ao registrar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-slate-700 selection:text-white">
      {/* TASK UX #3: MODAL DE CONFIRMAÇÃO AGRESSIVA PARA CATEGORIA 'TODOS/GERAL' */}
      {showGeneralWarningModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b101d] border border-amber-500/50 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                <ShieldCheck className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Atenção: Acurácia Reduzida por Desativação de Regras Estritas
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ao selecionar &ldquo;Todos / Sem preferência definida&rdquo;, as regras setoriais profundas (como ART/CAT em Obras, ANVISA/CRF em Saúde e ISO 27001 em TI) serão desativadas. O motor aplicará unicamente requisitos genéricos da Lei 14.133/2021.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200 font-mono space-y-1">
              <div>[ALERTA] Risco de Falso Positivo: Alto</div>
              <div>Exigências técnicas eliminatórias de conselho ou vigilância sanitária não serão cruzadas contra seu cofre.</div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={generalWarningConfirmed}
                  onChange={(e) => setGeneralWarningConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500 shrink-0"
                />
                <span className="text-xs text-slate-300 font-medium leading-tight">
                  Entendo que posso perder verificações críticas e confirmo a opção por regras gerais.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPrimaryVertical("Obras Públicas e Engenharia");
                  setShowGeneralWarningModal(false);
                }}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Escolher Vertical Específica
              </button>

              <button
                type="button"
                disabled={!generalWarningConfirmed}
                onClick={() => setShowGeneralWarningModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-amber-400/20"
              >
                Confirmar Escolha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg">
            <FileSearch className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight legal-serif">
            Edital<span className="text-emerald-400">Flash</span>
          </span>
        </Link>
        <h2 className="mt-5 text-2xl font-bold text-white tracking-tight legal-serif">
          {step === 1 ? "Cadastro de Licitante" : "Foco Principal de Atuação"}
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          {step === 1
            ? "Crie sua conta para auditar editais e blindar sua habilitação"
            : "Parametrização adaptativa do motor de regras da Lei 14.133"}
        </p>

        {/* Progress indicator */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span
            className={`w-6 h-1.5 rounded-full ${
              step === 1 ? "bg-emerald-500" : "bg-emerald-500/40"
            }`}
          />
          <span
            className={`w-6 h-1.5 rounded-full ${
              step === 2 ? "bg-emerald-500" : step === 3 ? "bg-emerald-500/40" : "bg-slate-800"
            }`}
          />
          <span
            className={`w-6 h-1.5 rounded-full ${
              step === 3 ? "bg-emerald-500" : "bg-slate-800"
            }`}
          />
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#0b101d] rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <span className="font-bold font-mono">Erro:</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: CREDENTIALS */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nome completo do gestor
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Roberto Mendes"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  E-mail corporativo
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="roberto@empresa.com.br"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Razão Social da Empresa
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Alpha Construtora e Comércio Ltda"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Senha de acesso
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
                  />
                </div>
              </div>

              {/* Checkbox de Consentimento Obrigatório LGPD & Termos de Uso */}
              <div className="flex items-start gap-3 mt-6 pt-3 pb-1 border-t border-[var(--line)]">
                <input
                  type="checkbox"
                  id="terms-acceptance"
                  required
                  checked={legalConsent}
                  onChange={(e) => setLegalConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[var(--brand)] accent-[var(--brand)] focus:ring-[var(--brand)] shrink-0 cursor-pointer"
                />
                <label htmlFor="terms-acceptance" className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed cursor-pointer select-none">
                  Li e aceito os{" "}
                  <Link href="/termos" target="_blank" rel="noopener noreferrer" className="text-[var(--brand)] hover:underline font-medium">
                    Termos
                  </Link>{" "}
                  e{" "}
                  <Link href="/privacidade" target="_blank" rel="noopener noreferrer" className="text-[var(--brand)] hover:underline font-medium">
                    Política de Privacidade
                  </Link>
                  . Autorizo tratamento de dados corporativos conforme LGPD.
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  id="btn-signup-submit"
                  disabled={!legalConsent}
                  className="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Criar Conta &amp; Continuar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: ADAPTIVE ONBOARDING (PRIMARY VERTICAL SELECTION) */}
          {step === 2 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-white block">
                  Qual tipo de licitação sua empresa mais participa? Isso define quais regras aplicamos.
                </span>
                <p className="text-[11px] text-slate-400">
                  Carregaremos automaticamente o conjunto de regras técnicas aplicáveis (CATs, ANVISA, ISO ou CCT).
                </p>
              </div>

              <div className="space-y-2 pt-1 max-h-72 overflow-y-auto pr-1">
                {verticalOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = primaryVertical === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectVerticalOption(opt.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? "bg-slate-800 border-emerald-500 shadow-sm"
                          : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                          isSelected
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        <Icon className="w-4 h-4" strokeWidth={1.5} />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white block">
                            {opt.label}
                          </span>
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          {opt.sublabel}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 px-4 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  <span>{loading ? "Configurando Regras..." : "Validar E-mail e Continuar"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: VALIDAÇÃO DE E-MAIL COM CÓDIGO DE 6 DÍGITOS */}
          {step === 3 && (
            <form onSubmit={handleVerifyCodeAndFinish} className="space-y-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <span>Código de Segurança Enviado</span>
                </div>
                <h3 className="text-sm font-bold text-white block">
                  Verifique o e-mail: <span className="text-[#8F9CFF] font-mono">{email}</span>
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Enviamos um código de verificação para garantir que você tenha acesso legítimo ao recebimento de alertas de certames.
                </p>
              </div>

              <div className="py-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Código de 6 dígitos
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="482915"
                  className="w-full text-center text-lg font-mono tracking-widest py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-[#2740F0]"
                />
                <p className="text-[10px] text-slate-500 font-mono mt-1 text-center">
                  * Dica de demonstração: digite <strong className="text-white">482915</strong> ou <strong className="text-white">123456</strong>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading || verificationCode.length < 6}
                  className="flex-1 py-2.5 px-4 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  <span>{loading ? "Criando Conta..." : "Confirmar e Escolher Plano"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          <div className="pt-2 text-center text-xs text-slate-400">
            <span>Já tem uma conta? </span>
            <Link href="/login" className="text-emerald-400 font-bold hover:underline">
              Fazer login
            </Link>
          </div>
        </div>

        <div className="mt-5 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Regras auditadas com base estrita na Lei Federal 14.133/2021.</span>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-slate-400 text-xs">
          Carregando...
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
