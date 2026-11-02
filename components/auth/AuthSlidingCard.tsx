"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Sparkles,
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

  // Estados de controle de modo e animação
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [activeForm, setActiveForm] = useState<"login" | "signup">(initialMode);
  const [isAnimating, setIsAnimating] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const endTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    if ((modeParam === "signup" || modeParam === "login") && modeParam !== mode) {
      switchMode(modeParam);
    }
  }, [searchParams]);

  const switchMode = (newMode: "login" | "signup") => {
    if (newMode === mode) return;

    // Se estiver no passo 2 do cadastro e for para login, reseta para passo 1
    if (newMode === "login" && signupStep === 2) {
      setSignupStep(1);
    }

    setLoginError(null);
    setSignupError(null);

    // Se usuário tiver prefers-reduced-motion ativo, altera sem animação espacial
    if (reducedMotion) {
      setMode(newMode);
      setActiveForm(newMode);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", newMode === "signup" ? "/signup" : "/login");
      }
      return;
    }

    // Inicia deslizamento do painel
    setIsAnimating(true);
    setMode(newMode);

    // Limpa timers anteriores caso haja cliques rápidos
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    if (endTimerRef.current) clearTimeout(endTimerRef.current);

    // Mid-point swap: troca o formulário no ponto central de oclusão total (300ms de 600ms)
    transitionTimerRef.current = setTimeout(() => {
      setActiveForm(newMode);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", newMode === "signup" ? "/signup" : "/login");
      }
    }, 280);

    endTimerRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 600);
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
    <div className="relative min-h-screen w-full bg-[#F8FAFC] text-[#0F172A] selection:bg-[#1E3A8A] selection:text-white overflow-hidden flex flex-col justify-between">
      
      {/* ========================================================= */}
      {/* GRID DA TELA TODA (2 Colunas Desktop)                    */}
      {/* ========================================================= */}
      <div className="relative flex-1 w-full grid grid-cols-1 md:grid-cols-2">
        
        {/* ========================================================= */}
        {/* COLUNA 1: LADO ESQUERDO (Formulário de Login)             */}
        {/* ========================================================= */}
        <div className="w-full flex flex-col justify-between p-6 sm:p-10 lg:p-16 max-w-xl mx-auto md:max-w-none md:mx-0 z-10 md:pr-16 lg:pr-24">
          <div>
            {/* Header: Logo & Alternador Mobile */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="inline-flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-[#1E3A8A] flex items-center justify-center text-white shadow-sm">
                  <Scale className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold tracking-tight text-[#0F172A] font-sans">
                  EditalFlash
                </span>
              </Link>

              {/* Alternador em abas para telas estreitas / mobile */}
              <div className="flex items-center bg-[#F1F5F9] p-1 rounded-lg border border-[#E2E8F0] md:hidden">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    activeForm === "login"
                      ? "bg-white text-[#1E3A8A] shadow-xs"
                      : "text-[#475569] hover:text-[#0F172A]"
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    activeForm === "signup"
                      ? "bg-white text-[#1E3A8A] shadow-xs"
                      : "text-[#475569] hover:text-[#0F172A]"
                  }`}
                >
                  Cadastrar
                </button>
              </div>
            </div>

            {/* ÁREA CENTRAL ESQUERDA (Formulário de Login no Desktop) */}
            <div className="w-full max-w-md mx-auto md:ml-auto md:mr-4 pt-2 lg:pt-6">
              
              {/* FORMULÁRIO DE LOGIN */}
              <div
                className={`transition-opacity duration-300 ${
                  activeForm === "login" ? "opacity-100 block" : "opacity-0 hidden pointer-events-none"
                }`}
                inert={activeForm !== "login"}
                aria-hidden={activeForm !== "login"}
              >
                <div className="space-y-1.5 mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight font-sans">
                    Acesse sua conta
                  </h1>
                  <p className="text-sm text-[#475569]">
                    Insira suas credenciais corporativas para auditar editais.
                  </p>
                </div>

                {loginError && (
                  <div className="mb-4 p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B] flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#991B1B]" />
                    <span>{loginError}</span>
                  </div>
                )}

                {resetSuccess && (
                  <div className="mb-4 p-3 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-xs text-[#065F46] flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#065F46]" />
                    <span>{resetSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                      E-mail Corporativo
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="gestor@suaempresa.com.br"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 transition-colors shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-[#0F172A]">
                        Senha de Acesso
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs font-semibold text-[#1E3A8A] hover:underline cursor-pointer bg-transparent border-none p-0"
                      >
                        Esqueceu a senha?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 transition-colors shadow-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full h-11 rounded-lg text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#1E40AF] active:bg-[#1E3A8A] shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer mt-3"
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

              {/* FORMULÁRIO DE CADASTRO (Exibido aqui no Mobile quando ativo) */}
              <div
                className={`md:hidden transition-opacity duration-300 ${
                  activeForm === "signup" ? "opacity-100 block" : "opacity-0 hidden pointer-events-none"
                }`}
                inert={activeForm !== "signup"}
                aria-hidden={activeForm !== "signup"}
              >
                <div className="space-y-1.5 mb-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#64748B] font-medium font-mono">
                      Etapa {signupStep} de 2
                    </span>
                    {signupStep === 2 && (
                      <button
                        type="button"
                        onClick={() => setSignupStep(1)}
                        className="text-xs font-medium text-[#475569] hover:text-[#0F172A] flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                      </button>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight font-sans">
                    Cadastre sua empresa
                  </h1>
                  <p className="text-xs text-[#475569]">
                    Comece a auditar sua habilitação jurídica e fiscal em minutos.
                  </p>
                </div>

                {signupError && (
                  <div className="mb-4 p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B] flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#991B1B]" />
                    <span>{signupError}</span>
                  </div>
                )}

                <form onSubmit={handleSignupSubmit} className="space-y-3">
                  {signupStep === 1 ? (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-[#0F172A] mb-1">
                          Nome do Gestor / Responsável
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            required
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            placeholder="Ex: Carlos Andrade"
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 transition-colors shadow-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#0F172A] mb-1">
                          E-mail Corporativo
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="email"
                            required
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="carlos@licitante.com.br"
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 transition-colors shadow-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#0F172A] mb-1">
                          Razão Social / Nome da Empresa
                        </label>
                        <div className="relative">
                          <Building className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            value={signupCompany}
                            onChange={(e) => setSignupCompany(e.target.value)}
                            placeholder="Ex: Andrade Engenharia LTDA"
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 transition-colors shadow-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#0F172A] mb-1">
                          Senha Corporativa
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="password"
                            required
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            placeholder="Mínimo 8 dígitos"
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 transition-colors shadow-xs"
                          />
                        </div>
                      </div>

                      <div className="pt-0.5">
                        <label className="flex items-start gap-2 cursor-pointer text-xs text-[#475569]">
                          <input
                            type="checkbox"
                            checked={signupConsent}
                            onChange={(e) => setSignupConsent(e.target.checked)}
                            className="mt-0.5 rounded border-[#CBD5E1] text-[#1E3A8A] focus:ring-[#1E3A8A]"
                          />
                          <span>
                            Declaro que li e concordo com os Termos de Uso e a Política de Privacidade (LGPD).
                          </span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full h-10 rounded-lg text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#1E40AF] shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
                      >
                        <span>Continuar para Vertical</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                        {verticalOptions.map((v) => {
                          const Icon = v.icon;
                          const isSelected = signupVertical === v.id;
                          return (
                            <div
                              key={v.id}
                              onClick={() => setSignupVertical(v.id)}
                              className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors flex items-center gap-2.5 ${
                                isSelected
                                  ? "bg-[#EFF6FF] border-[#1E3A8A] text-[#1E3A8A] font-semibold"
                                  : "bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]"
                              }`}
                            >
                              <div className={`p-1.5 rounded-md ${isSelected ? "bg-[#1E3A8A] text-white" : "bg-[#F1F5F9] text-[#475569]"}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-xs">{v.label}</span>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        type="submit"
                        disabled={signupLoading}
                        className="w-full h-10 rounded-lg text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#1E40AF] active:bg-[#1E3A8A] shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer mt-3"
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

            </div>
          </div>

          {/* Rodapé Esquerdo */}
          <div className="pt-6 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B] mt-8">
            <span>Ambiente Seguro • TLS 1.3</span>
            <span>Lei 14.133/2021</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUNA 2: LADO DIREITO (Formulário de Cadastro Desktop)    */}
        {/* ========================================================= */}
        <div className="hidden md:flex flex-col justify-between p-6 sm:p-10 lg:p-16 z-10 border-l border-[#E2E8F0] md:pl-16 lg:pl-24">
          <div>
            {/* Header Direito */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-xs font-semibold text-[#1E3A8A] uppercase tracking-wider font-mono">
                Cadastro Corporativo
              </span>
              <span className="text-xs text-[#64748B] font-mono">
                Acesso Imediato
              </span>
            </div>

            {/* ÁREA CENTRAL DIREITA (Formulário de Cadastro no Desktop) */}
            <div className="w-full max-w-md mx-auto md:mr-auto md:ml-4 pt-2 lg:pt-6">
              <div
                className={`transition-opacity duration-300 ${
                  activeForm === "signup" ? "opacity-100 block" : "opacity-0 hidden pointer-events-none"
                }`}
                inert={activeForm !== "signup"}
                aria-hidden={activeForm !== "signup"}
              >
                <div className="space-y-1.5 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#64748B] font-medium font-mono">
                      Etapa {signupStep} de 2
                    </span>
                    {signupStep === 2 && (
                      <button
                        type="button"
                        onClick={() => setSignupStep(1)}
                        className="text-xs font-medium text-[#475569] hover:text-[#0F172A] flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                      </button>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight font-sans">
                    Cadastre sua empresa
                  </h1>
                  <p className="text-sm text-[#475569]">
                    Comece a auditar sua habilitação jurídica e fiscal em minutos.
                  </p>
                </div>

                {signupError && (
                  <div className="mb-4 p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B] flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#991B1B]" />
                    <span>{signupError}</span>
                  </div>
                )}

                <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                  {signupStep === 1 ? (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                          Nome do Gestor / Responsável
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            required
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            placeholder="Ex: Carlos Andrade"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 transition-colors shadow-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                          E-mail Corporativo
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="email"
                            required
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="carlos@licitante.com.br"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 transition-colors shadow-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                          Razão Social / Nome da Empresa
                        </label>
                        <div className="relative">
                          <Building className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            value={signupCompany}
                            onChange={(e) => setSignupCompany(e.target.value)}
                            placeholder="Ex: Andrade Engenharia LTDA"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 transition-colors shadow-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
                          Senha Corporativa
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="password"
                            required
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            placeholder="Mínimo 8 dígitos"
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/20 transition-colors shadow-xs"
                          />
                        </div>
                      </div>

                      <div className="pt-0.5">
                        <label className="flex items-start gap-2 cursor-pointer text-xs text-[#475569]">
                          <input
                            type="checkbox"
                            checked={signupConsent}
                            onChange={(e) => setSignupConsent(e.target.checked)}
                            className="mt-0.5 rounded border-[#CBD5E1] text-[#1E3A8A] focus:ring-[#1E3A8A]"
                          />
                          <span>
                            Declaro que li e concordo com os Termos de Uso e a Política de Privacidade (LGPD).
                          </span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full h-11 rounded-lg text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#1E40AF] shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
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
                                  ? "bg-[#EFF6FF] border-[#1E3A8A] text-[#1E3A8A] font-semibold"
                                  : "bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]"
                              }`}
                            >
                              <div className={`p-2 rounded-md ${isSelected ? "bg-[#1E3A8A] text-white" : "bg-[#F1F5F9] text-[#475569]"}`}>
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
                        className="w-full h-11 rounded-lg text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#1E40AF] active:bg-[#1E3A8A] shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60 cursor-pointer mt-3"
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
            </div>
          </div>

          {/* Rodapé Direito */}
          <div className="pt-6 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B] mt-8">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#64748B]" />
              <span>Conformidade com a LGPD</span>
            </div>
            <span>Suporte Jurídico Contínuo</span>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* PAINEL ESCURO DESLIZANTE DE TELA TODA (Full-Viewport)       */}
      {/* Cobre exatamente 50% da viewport e desliza com translateX  */}
      {/* ========================================================= */}
      <div
        className={`hidden md:block absolute top-0 bottom-0 w-1/2 z-20 pointer-events-none transition-transform duration-700 ease-in-out ${
          mode === "login"
            ? "left-0 translate-x-full"
            : "left-0 translate-x-0"
        }`}
      >
        {/* Casca do Painel com Gradiente Profundo de Tela Toda */}
        <div className="w-full h-full bg-gradient-to-br from-[#070D1E] via-[#0F172A] to-[#1E3A8A] text-white shadow-2xl border-x border-slate-700/50 p-10 lg:p-16 flex flex-col justify-between overflow-hidden relative pointer-events-auto">
          {/* Efeitos de luz ambiente suave */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#1E3A8A]/35 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#3B82F6]/20 rounded-full blur-3xl pointer-events-none" />

          {/* CONTEÚDO 100% RETO E NÍTIDO */}
          <div className="h-full flex flex-col justify-between relative z-10 max-w-md mx-auto w-full">
            
            {/* Topo do painel */}
            <div className="flex items-center gap-2.5 text-blue-200/80 text-xs font-mono uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>EditalFlash • Inteligência Jurídica em Licitações</span>
            </div>

            {/* Mensagem central de impacto */}
            <div className="space-y-6 my-auto py-8">
              {mode === "login" ? (
                <>
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-blue-300 uppercase tracking-widest font-mono">
                      Novo por aqui?
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white font-sans leading-tight">
                      Audite editais antes de protocolar sua proposta.
                    </h2>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Cadastre sua empresa licitante para analisar editais em PDF em segundos, apontar exigências indevidas e impugnar antes da abertura da sessão pública.
                  </p>

                  <div className="space-y-3 pt-2 text-xs text-slate-200">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Tríade de Liquidez calculada automaticamente</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Identificação de cláusulas impugnáveis (Art. 164)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Cofre de certidões com semáforo de validade</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => switchMode("signup")}
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-[#0F172A] bg-white hover:bg-slate-100 active:bg-slate-200 transition-all shadow-lg hover:shadow-xl cursor-pointer"
                    >
                      <span>Criar minha conta gratuita</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-blue-300 uppercase tracking-widest font-mono">
                      Já possui cadastro?
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white font-sans leading-tight">
                      Acesse diretamente seu painel de auditoria.
                    </h2>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Acompanhe seus editais processados, relatórios com prova de página e linha e gerencie sua equipe de licitações.
                  </p>

                  <div className="space-y-3 pt-2 text-xs text-slate-200">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Pareceres preliminares com prova de página e linha</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Exportação executiva para PDF pronto para anexar</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-[#0F172A] bg-white hover:bg-slate-100 active:bg-slate-200 transition-all shadow-lg hover:shadow-xl cursor-pointer"
                    >
                      <span>Acessar minha conta</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Base do painel */}
            <div className="pt-6 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
              <span>Lei 14.133/2021 • Nova Lei de Licitações</span>
              <span className="font-mono text-xs text-slate-400">EditalFlash Platform</span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
