"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  Scale,
  User,
  Building,
  HardHat,
  Briefcase,
  Laptop,
  HeartPulse,
  ShoppingBag,
  Layers,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { PrimaryVertical } from "@/lib/types";

interface AuthSlidingCardProps {
  initialMode?: "login" | "signup";
}

export function AuthSlidingCard({ initialMode = "login" }: AuthSlidingCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signup } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Estados do Formulário de Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      setLoginError("Informe seu e-mail corporativo no campo para receber o link de recuperação.");
      return;
    }
    setLoginLoading(true);
    setLoginError(null);
    try {
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.auth.resetPasswordForEmail(loginEmail.trim().toLowerCase(), {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : "https://editalflash.pages.dev"}/dashboard/configuracoes`,
      });
      if (error) throw error;
      setResetSuccess("Link de redefinição de senha enviado para o e-mail informado.");
      setTimeout(() => setResetSuccess(null), 6000);
    } catch (err: any) {
      setLoginError(err?.message || "Falha ao enviar e-mail de recuperação de senha.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Estados do Formulário de Cadastro
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupCompany, setSignupCompany] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupVertical, setSignupVertical] = useState<PrimaryVertical>("Obras Públicas e Engenharia");
  const [signupConsent, setSignupConsent] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "signup" || modeParam === "login") {
      setMode(modeParam);
    }
  }, [searchParams]);

  const switchMode = (newMode: "login" | "signup") => {
    if (newMode === mode) return;
    setMode(newMode);
    setLoginError(null);
    setSignupError(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;
    setLoginLoading(true);
    setLoginError(null);
    try {
      await login(loginEmail, loginPassword);
    } catch (err: any) {
      setLoginError(err?.message || "Credenciais inválidas. Verifique seu e-mail e senha.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupStep === 1) {
      if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
        setSignupError("Preencha todos os campos obrigatórios.");
        return;
      }
      if (!signupConsent) {
        setSignupError("Você precisa aceitar os Termos e a Política de Privacidade.");
        return;
      }
      setSignupError(null);
      setSignupStep(2);
      return;
    }

    setSignupLoading(true);
    setSignupError(null);
    try {
      await signup(signupName.trim(), signupEmail.trim(), signupPassword, signupCompany.trim() || "Minha Empresa Licitante", signupVertical);
    } catch (err: any) {
      setSignupError(err?.message || "Erro ao criar conta.");
      setSignupLoading(false);
    }
  };

  const verticalOptions: { id: PrimaryVertical; label: string; icon: any }[] = [
    { id: "Obras Públicas e Engenharia", label: "Obras & Engenharia", icon: HardHat },
    { id: "Serviços Contínuos (Limpeza, Segurança, Manutenção)", label: "Serviços Contínuos & Terceirização", icon: Briefcase },
    { id: "Tecnologia da Informação", label: "TI & Telecomunicações", icon: Laptop },
    { id: "Saúde e Medicamentos", label: "Saúde & Medicamentos", icon: HeartPulse },
    { id: "Compras e Fornecimentos", label: "Compras e Fornecimentos", icon: ShoppingBag },
    { id: "Todos / Não tenho preferência definida", label: "Geral / Todos", icon: Layers },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Painel Esquerdo: Formulário */}
        <div className="w-full md:w-7/12 p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            {/* Header / Logo */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="inline-flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                  <Scale className="w-4 h-4" />
                </div>
                <span className="text-base font-bold tracking-tight text-slate-900 font-display">
                  Edital<span className="text-blue-600">Flash</span>
                </span>
              </Link>

              {/* Botão de Alternar Modo */}
              <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    mode === "login"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    mode === "signup"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Cadastrar
                </button>
              </div>
            </div>

            {mode === "login" ? (
              <div>
                <div className="space-y-1 mb-6">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
                    Acesse sua conta
                  </h1>
                  <p className="text-sm text-slate-500">
                    Insira suas credenciais corporativas para auditar editais.
                  </p>
                </div>

                {loginError && (
                  <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    <span>{loginError}</span>
                  </div>
                )}

                {resetSuccess && (
                  <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    <span>{resetSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      E-mail Corporativo
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="gestor@suaempresa.com.br"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-slate-700">
                        Senha de Acesso
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs font-medium text-blue-900 hover:underline cursor-pointer bg-transparent border-none p-0"
                      >
                        Esqueceu a senha?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full h-11 rounded-lg text-sm font-semibold text-white bg-blue-950 hover:bg-blue-900 active:bg-blue-950/90 shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer mt-2"
                  >
                    {loginLoading ? (
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full motion-safe:animate-spin" />
                        <span>Autenticando…</span>
                      </div>
                    ) : (
                      <>
                        <span>Entrar no EditalFlash</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <div className="space-y-1 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      Etapa {signupStep} de 2
                    </span>
                    {signupStep === 2 && (
                      <button
                        type="button"
                        onClick={() => setSignupStep(1)}
                        className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                      </button>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
                    Cadastre sua empresa
                  </h1>
                  <p className="text-sm text-slate-500">
                    Comece a auditar sua habilitação jurídica e fiscal em minutos.
                  </p>
                </div>

                {signupError && (
                  <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    <span>{signupError}</span>
                  </div>
                )}

                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  {signupStep === 1 ? (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                          Nome do Gestor / Responsável
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            required
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            placeholder="Ex: Carlos Andrade"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                          E-mail Corporativo
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="email"
                            required
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="carlos@licitante.com.br"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                          Razão Social / Nome da Empresa
                        </label>
                        <div className="relative">
                          <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            value={signupCompany}
                            onChange={(e) => setSignupCompany(e.target.value)}
                            placeholder="Ex: Andrade Engenharia LTDA"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                          Senha Corporativa
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="password"
                            required
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            placeholder="Mínimo 8 dígitos"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="pt-1">
                        <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                          <input
                            type="checkbox"
                            checked={signupConsent}
                            onChange={(e) => setSignupConsent(e.target.checked)}
                            className="mt-0.5 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                          />
                          <span>
                            Declaro que li e concordo com os Termos de Uso e a Política de Privacidade (LGPD).
                          </span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full h-11 rounded-lg text-sm font-semibold text-white bg-blue-950 hover:bg-blue-900 shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
                      >
                        <span>Continuar para Vertical</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {verticalOptions.map((v) => {
                          const Icon = v.icon;
                          const isSelected = signupVertical === v.id;
                          return (
                            <div
                              key={v.id}
                              onClick={() => setSignupVertical(v.id)}
                              className={`p-3 rounded-lg border text-left cursor-pointer transition-colors flex items-center gap-3 ${
                                isSelected
                                  ? "bg-blue-50/60 border-blue-600 text-slate-900 font-medium"
                                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <div className={`p-2 rounded-md ${isSelected ? "bg-blue-950 text-white" : "bg-slate-100 text-slate-600"}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className="text-xs">{v.label}</span>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        type="submit"
                        disabled={signupLoading}
                        className="w-full h-11 rounded-lg text-sm font-semibold text-white bg-blue-950 hover:bg-blue-900 active:bg-blue-950/90 shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer mt-4"
                      >
                        {signupLoading ? (
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full motion-safe:animate-spin" />
                            <span>Criando conta…</span>
                          </div>
                        ) : (
                          <>
                            <span>Concluir Cadastro</span>
                            <CheckCircle2 className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </>
                  )}
                </form>
              </div>
            )}
          </div>

          {/* Rodapé Interno */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Ambiente Seguro • TLS 1.3</span>
            <span>Lei 14.133/2021</span>
          </div>
        </div>

        {/* Painel Direito: Contexto Institucional */}
        <div className="hidden md:flex md:w-5/12 bg-slate-50 border-l border-slate-200 p-8 sm:p-10 lg:p-12 flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-blue-900">
                Auditoria Preliminar de Editais
              </span>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight font-display">
                O segundo par de olhos da sua equipe contra inabilitações surpresa.
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verifique certidões, índices contábeis exigidos e identifique cláusulas restritivas antes da abertura da sessão pública.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200 text-xs text-slate-700">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tríade de Liquidez calculada automaticamente</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Identificação de cláusulas impugnáveis (Art. 164)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cofre de certidões com semáforo de validade</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Dados protegidos em conformidade com a LGPD</span>
          </div>
        </div>

      </div>
    </div>
  );
}
