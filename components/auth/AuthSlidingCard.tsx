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
  Cpu,
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

  // Modo: "login" ou "signup"
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [isAnimating, setIsAnimating] = useState(false);
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
      setLoginError("Informe seu e-mail no campo acima para receber o link de recuperação.");
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
      setResetSuccess("Link de redefinição de senha enviado para seu e-mail.");
      setTimeout(() => setResetSuccess(null), 6000);
    } catch (err: any) {
      setLoginError(err?.message || "Falha ao enviar e-mail de recuperação de senha.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Estados do Formulário de Cadastro (Multi-step)
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupCompany, setSignupCompany] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupVertical, setSignupVertical] = useState<PrimaryVertical>("Obras Públicas e Engenharia");
  const [signupConsent, setSignupConsent] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  // Detecção de prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  // Sincronização com query string se houver
  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "signup" || modeParam === "login") {
      setMode(modeParam);
    }
  }, [searchParams]);

  // Transição de modo com controle de animação para inert
  const switchMode = (newMode: "login" | "signup") => {
    if (newMode === mode || isAnimating) return;
    setIsAnimating(true);
    setMode(newMode);
    setLoginError(null);
    setSignupError(null);

    // Duração da animação física (600ms padrão, 0ms se reduced-motion)
    const duration = reducedMotion ? 50 : 650;
    setTimeout(() => {
      setIsAnimating(false);
    }, duration);
  };

  // Submissão do Login
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

  // Submissão do Cadastro
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
    { id: "Compras e Fornecimentos", label: "Compras & Fornecimentos", icon: ShoppingBag },
    { id: "Serviços Contínuos (Limpeza, Segurança, Manutenção)", label: "Serviços Contínuos", icon: Briefcase },
    { id: "Saúde e Medicamentos", label: "Saúde & Medicamentos", icon: HeartPulse },
    { id: "Tecnologia da Informação", label: "Tecnologia da Informação", icon: Laptop },
    { id: "Todos / Não tenho preferência definida", label: "Geral / Todos", icon: Layers },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#06141B] text-[#CCD0CF] selection:bg-[#11212D] selection:text-[#CCD0CF]">
      {/* Background Decorativo Sutil */}
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#9BA8AB 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-[#11212D]/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-[#11212D]/30 rounded-full blur-[140px] pointer-events-none" />

      {/* =========================================================================
          CONTAINER PRINCIPAL DO CARTÃO (MÁXIMO 1080px)
          ========================================================================= */}
      <div className="relative w-full max-w-5xl min-h-[640px] rounded-3xl bg-white text-slate-900 shadow-2xl border border-[#253745]/40 overflow-hidden flex flex-col md:flex-row">
        
        {/* =======================================================================
            CONTROLE MOBILE DE ABAS (VISÍVEL APENAS EM TELAS < 768px)
            ======================================================================= */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#06141B] border-b border-[#253745] text-white">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#11212D] border border-[#253745] flex items-center justify-center text-[#CCD0CF]">
              <Scale className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm tracking-tight">
              Edital<span className="text-[#CCD0CF]">Flash</span>
            </span>
          </Link>

          <div className="flex bg-[#11212D] p-1 rounded-xl border border-[#253745]">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
                mode === "login"
                  ? "bg-[#253745] text-white shadow-xs"
                  : "text-[#9BA8AB] hover:text-white"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all ${
                mode === "signup"
                  ? "bg-[#253745] text-white shadow-xs"
                  : "text-[#9BA8AB] hover:text-white"
              }`}
            >
              Cadastrar
            </button>
          </div>
        </div>

        {/* =======================================================================
            PAINEL ESQUERDO DA BASE: FORMULÁRIO DE LOGIN (50% DESKTOP)
            ======================================================================= */}
        <div
          inert={mode !== "login"}
          className={`w-full md:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-between transition-opacity duration-300 ${
            mode === "login" ? "opacity-100 z-10" : "opacity-0 pointer-events-none md:pointer-events-auto"
          }`}
          aria-hidden={mode !== "login"}
        >
          <div>
            <div className="hidden md:flex items-center gap-3 mb-8">
              <Link href="/" className="inline-flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-xl bg-[#0E1626] border border-slate-200 flex items-center justify-center text-white shadow-xs">
                  <Scale className="w-4 h-4 text-[#8F9CFF]" />
                </div>
                <span className="text-lg font-bold tracking-tight text-[#0E1626] font-display">
                  Edital<span className="text-[#2740F0]">Flash</span>
                </span>
              </Link>
            </div>

            <div className="space-y-2 mb-6">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#2740F0] font-bold block">
                Ambiente de Auditoria Jurídica
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0E1626] font-display tracking-tight">
                Acesse sua conta
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-sans">
                Insira suas credenciais corporativas para auditar editais da Lei 14.133/21.
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            {resetSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span>{resetSuccess}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium text-slate-700 mb-1.5 uppercase">
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
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2740F0] focus:bg-white focus:ring-2 focus:ring-[#2740F0]/10 transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono font-medium text-slate-700 uppercase">
                    Senha de Acesso
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-medium text-[#2740F0] hover:underline cursor-pointer bg-transparent border-none p-0"
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
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2740F0] focus:bg-white focus:ring-2 focus:ring-[#2740F0]/10 transition-all font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full h-11 sm:h-12 rounded-xl text-xs font-mono font-bold text-white bg-[#2740F0] hover:bg-blue-600 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              >
                {loginLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Autenticando sessão...</span>
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

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className="text-[#2740F0] font-bold hover:underline font-mono"
            >
              Criar nova conta corporativa →
            </button>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>TLS 1.3 • LGPD</span>
            </div>
          </div>
        </div>

        {/* =======================================================================
            PAINEL DIREITO DA BASE: FORMULÁRIO DE CADASTRO (50% DESKTOP)
            ======================================================================= */}
        <div
          inert={mode !== "signup"}
          className={`w-full md:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-between transition-opacity duration-300 ${
            mode === "signup" ? "opacity-100 z-10" : "opacity-0 pointer-events-none md:pointer-events-auto"
          }`}
          aria-hidden={mode !== "signup"}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#2740F0] font-bold">
                Passo {signupStep} de 2: {signupStep === 1 ? "Dados Corporativos" : "Vertical de Atuação"}
              </span>
              {signupStep === 2 && (
                <button
                  type="button"
                  onClick={() => setSignupStep(1)}
                  className="text-xs font-mono text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                </button>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0E1626] font-display tracking-tight mb-2">
              Cadastre sua Empresa
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-sans mb-6">
              Comece a auditar a habilitação jurídica e fiscal em menos de 3 minutos.
            </p>

            {signupError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{signupError}</span>
              </div>
            )}

            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              {signupStep === 1 ? (
                <>
                  <div>
                    <label className="block text-[11px] font-mono font-medium text-slate-700 mb-1 uppercase">
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
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2740F0] transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-medium text-slate-700 mb-1 uppercase">
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
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2740F0] transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-medium text-slate-700 mb-1 uppercase">
                      Razão Social / Nome da Empresa
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={signupCompany}
                        onChange={(e) => setSignupCompany(e.target.value)}
                        placeholder="Ex: Andrade Engenharia LTDA"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2740F0] transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-medium text-slate-700 mb-1 uppercase">
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
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2740F0] transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={signupConsent}
                        onChange={(e) => setSignupConsent(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-[#2740F0] focus:ring-[#2740F0]"
                      />
                      <span>
                        Declaro que li e concordo com os Termos de Uso e a Política de Privacidade (LGPD).
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 sm:h-12 rounded-xl text-xs font-mono font-bold text-white bg-[#2740F0] hover:bg-blue-600 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer mt-2"
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
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-3 ${
                            isSelected
                              ? "bg-blue-50 border-[#2740F0] text-[#0E1626] font-semibold"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${isSelected ? "bg-[#2740F0] text-white" : "bg-white text-slate-500"}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-sans">{v.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="submit"
                    disabled={signupLoading}
                    className="w-full h-11 sm:h-12 rounded-xl text-xs font-mono font-bold text-white bg-[#2740F0] hover:bg-blue-600 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer mt-4"
                  >
                    {signupLoading ? (
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Criando conta corporativa...</span>
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

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="text-[#2740F0] font-bold hover:underline font-mono"
            >
              ← Já tem uma conta? Entrar
            </button>
            <span className="font-mono text-[11px] text-slate-400">100% Determinístico</span>
          </div>
        </div>

        {/* =======================================================================
            O PAINEL DESLIZANTE INCLINADO (DESKTOP: md:block)
            - Camada Externa: transform: translateX(...) skewX(-6deg)
            - Camada Interna: transform: skewX(+6deg) (anula distorção de conteúdo)
            ======================================================================= */}
        <div
          aria-hidden="true"
          className={`hidden md:block absolute top-0 bottom-0 w-[56%] z-20 pointer-events-none transition-transform ${
            reducedMotion ? "duration-75" : "duration-600 ease-[cubic-bezier(0.65,0,0.35,1)]"
          } ${
            mode === "login"
              ? "right-0 translate-x-[6%] -skew-x-6"
              : "left-0 -translate-x-[6%] -skew-x-6"
          }`}
          style={{ willChange: "transform" }}
        >
          {/* Caixa escura com gradiente institucional */}
          <div className="w-full h-full bg-[#0A111F] border-x border-[#26324A] relative overflow-hidden shadow-2xl p-12 lg:p-14 flex flex-col justify-between">
            {/* Fundo com Malha */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `radial-gradient(#8F9CFF 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
              }}
            />
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#2740F0]/20 rounded-full blur-[100px]" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#2740F0]/15 rounded-full blur-[100px]" />

            {/* Conteúdo Interno com Contratransformação skewX(+6deg) para anular distorção */}
            <div className={`relative z-10 h-full flex flex-col justify-between skew-x-6 ${
              reducedMotion ? "transition-opacity duration-150" : "transition-opacity duration-300"
            }`}>
              {/* Topo do Painel Institucional */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B2347] border border-[#4A5FFF]/40 text-[#8F9CFF] text-[11px] font-mono font-bold uppercase tracking-wider">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Lei 14.133/21 • Habilitação Prévia</span>
                </div>
              </div>

              {/* Meio: Mensagens Alternadas por Modo */}
              <div className="my-auto space-y-4 max-w-sm">
                {mode === "login" ? (
                  <>
                    <h3 className="text-3xl font-extrabold text-white font-display leading-tight">
                      Auditoria Preventiva para Licitantes.
                    </h3>
                    <p className="text-xs text-[#A3AEC4] leading-relaxed font-sans">
                      Proteja sua empresa contra inabilitações sumárias por Tríade de Liquidez e armadilhas no edital.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => switchMode("signup")}
                        className="pointer-events-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-[#2740F0] hover:bg-blue-600 border border-blue-400/30 transition-all active:scale-95 cursor-pointer shadow-lg shadow-blue-600/30"
                      >
                        <span>Não tem conta? Cadastre-se</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-3xl font-extrabold text-white font-display leading-tight">
                      Bem-vindo de volta ao EditalFlash.
                    </h3>
                    <p className="text-xs text-[#A3AEC4] leading-relaxed font-sans">
                      Já possui cadastro institucional? Acesse seu cofre documental e o semáforo de certidões.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => switchMode("login")}
                        className="pointer-events-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-[#121B2D] hover:bg-[#1B273F] border border-[#26324A] transition-all active:scale-95 cursor-pointer"
                      >
                        <span>Já sou cadastrado • Entrar</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Rodapé do Painel Escuro */}
              <div className="pt-6 border-t border-[#26324A]/60 flex items-center justify-between text-[11px] font-mono text-[#A3AEC4]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Semáforo Tripartite</span>
                </div>
                <span>Cofre Criptografado</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
