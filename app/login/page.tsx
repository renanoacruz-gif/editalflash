"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileSearch, Sparkles, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/20">
            <FileSearch className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight">
            Edital<span className="text-blue-400">Flash</span>
          </span>
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Acesse sua conta corporativa
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Inteligência artificial jurídica especializada na Lei 14.133/21
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl backdrop-blur-2xl bg-slate-900/70 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                E-mail corporativo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gestor@suaempresa.com.br"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Senha de acesso</label>
                <a href="#" className="text-[11px] text-blue-400 hover:text-blue-300">
                  Esqueceu a senha?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <span>{loading ? "Autenticando..." : "Entrar no EditalFlash"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Fill */}
          <div className="pt-2 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={() => {
                setEmail("gestor.licitacoes@construtora.com.br");
                setPassword("licitacao2026");
              }}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Preencher com credenciais de demonstração</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800/60 text-center text-xs text-slate-400">
            <span>Ainda não possui conta? </span>
            <Link href="/signup" className="text-blue-400 font-bold hover:underline">
              Cadastre-se para teste gratuito
            </Link>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-8 flex items-center justify-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Criptografia TLS 1.3
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
            LGPD Compliant
          </span>
        </div>
      </div>
    </div>
  );
}
