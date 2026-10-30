"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Scale,
  Lock,
  Mail,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Loader2,
  Clock,
} from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("renan.oacruz@gmail.com");
  const [password, setPassword] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError(data.message || "Acesso negado. Apenas o auditor corporativo possui permissão.");
      }
    } catch (err: any) {
      setError("Erro ao autenticar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-slate-700 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-200">
            <Scale className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight legal-serif">
            Centro de Operações de Auditoria
          </span>
        </Link>
        <p className="text-xs text-slate-400">
          Acesso restrito para auditores técnicos e governança jurídica da Lei 14.133/2021
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#0b101d] rounded-xl p-8 border border-slate-800 shadow-xl space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" strokeWidth={1.5} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                E-mail do Auditor Autorizado
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
                  placeholder="auditor@editalflash.com.br"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Chave de Acesso Operacional
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                    <span>Autenticando sessão...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar no Centro de Auditoria</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 space-y-1 font-mono">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Sessão com auto-logout em 30 min de inatividade</span>
            </div>
            <p className="text-[10px] text-slate-500">
              Todas as ações, consultas e revisões de semáforo são assinadas digitalmente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
