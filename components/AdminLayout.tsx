"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrandIcon } from "@/components/brand-icons";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab?: "dashboard" | "users" | "subscriptions" | "system" | "audit" | "announcements" | "annotate" | "viability";
  onQuickAction?: (action: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab = "dashboard", onQuickAction }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sessionMinutesLeft, setSessionMinutesLeft] = useState(30);

  // Auto-logout após 30 minutos de inatividade
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetInactivity = () => {
      setSessionMinutesLeft(30);
    };

    timer = setInterval(() => {
      setSessionMinutesLeft((prev) => {
        if (prev <= 1) {
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 60000);

    window.addEventListener("mousemove", resetInactivity);
    window.addEventListener("keydown", resetInactivity);
    window.addEventListener("click", resetInactivity);

    return () => {
      clearInterval(timer);
      window.removeEventListener("mousemove", resetInactivity);
      window.removeEventListener("keydown", resetInactivity);
      window.removeEventListener("click", resetInactivity);
    };
  }, []);

  const navItems = [
    { id: "dashboard", label: "Cockpit Executivo (MRR)", icon: "mrr" as const, href: "/admin/dashboard" },
    { id: "viability", label: "Viabilidade & Break-Even", icon: "garantia" as const, href: "/admin/viability" },
    { id: "users", label: "Tenants Hub & Suporte", icon: "licitantes" as const, href: "/admin/users" },
    { id: "subscriptions", label: "Faturamento & Pacotes", icon: "assinatura" as const, href: "/admin/subscriptions" },
    { id: "audit", label: "Trilha de Auditoria (LGPD)", icon: "auditoria" as const, href: "/admin/audit" },
    { id: "annotate", label: "Validação & Corpus (50)", icon: "certidao" as const, href: "/admin/annotate" },
    { id: "announcements", label: "Comunicados Globais", icon: "sino" as const, href: "/admin/announcements" },
    { id: "system", label: "Saúde Operacional & OCR", icon: "ocr" as const, href: "/admin/system" },
  ];

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div
      data-theme="dark"
      className="min-h-screen bg-[#070B14] text-[#E8ECF5] flex flex-col md:flex-row selection:bg-[#2740F0] selection:text-white font-sans"
    >
      {/* DESKTOP ADMIN SIDEBAR — Pure Solid Ink (#0E1626) sem gradientes */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#26324A] bg-[#0E1626] text-[#E8ECF5] p-3 justify-between shrink-0 select-none">
        <div className="space-y-4">
          {/* Logo & Operational Title */}
          <div className="pb-3 border-b border-[#26324A]">
            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#121B2D] border border-[#26324A] flex items-center justify-center text-[#E8ECF5] shrink-0">
                <BrandIcon name="mark" size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-white tracking-tight block font-display">
                  Centro de Operações
                </span>
                <span className="text-[10px] text-[#A3AEC4] font-mono block">
                  EditalFlash Admin · Lei 14.133
                </span>
              </div>
            </Link>
          </div>

          {/* Multi-Vertical Status Badge (Compact Solid Ink) */}
          <div className="p-2.5 rounded-md bg-[#121B2D] border border-[#26324A] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-[#8F9CFF] uppercase tracking-wider font-mono flex items-center gap-1">
                <BrandIcon name="garantia" size="s16" accentCobalt={false} />
                <span>Motor Multi-Vertical</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A5FFF]" />
            </div>
            <p className="text-[11px] font-bold text-white font-mono">5 Verticais Ativas</p>
            <p className="text-[10px] text-[#A3AEC4] leading-tight">
              Obras, Compras, Serviços, Saúde e TI operando com rule sets autônomos.
            </p>
          </div>

          {/* Navigation Items — Solid Ink, Left border 3px #2740F0, Background rgba(39,64,240,0.12) */}
          <nav className="space-y-1">
            <div className="px-2 pb-1 text-[9px] font-bold uppercase tracking-wider text-[#A3AEC4] font-mono">
              Governança
            </div>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-2 px-2.5 py-2 rounded-md text-[11px] font-mono transition-all ${
                    isActive
                      ? "bg-[rgba(39,64,240,0.12)] text-white font-bold border-l-3 border-[#2740F0]"
                      : "text-[#A3AEC4] hover:text-white hover:bg-[rgba(255,255,255,0.04)]"
                  }`}
                >
                  <BrandIcon name={item.icon} size="s16" accentCobalt={isActive} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer & Session Control (Compact) */}
        <div className="pt-3 border-t border-[#26324A] space-y-2">
          <div className="p-2 rounded-md bg-[#121B2D] border border-[#26324A] text-[10px] font-mono space-y-0.5">
            <div className="flex items-center justify-between text-[#A3AEC4]">
              <span className="font-semibold flex items-center gap-1 text-white">
                <BrandIcon name="garantia" size="s16" accentCobalt={false} />
                <span>SuperAdmin</span>
              </span>
              <span className="text-[#8F9CFF]">{sessionMinutesLeft}m</span>
            </div>
            <span className="text-[#A3AEC4] truncate block text-[10px]">
              renanoacruz@gmail.com
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href="/dashboard"
              className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-bold bg-[#1B2347] hover:bg-[#273360] text-white border border-[var(--brand)]/40 transition-colors"
              title="Acessar Área do Cliente / Modo Demonstração"
            >
              <span>Visão Cliente</span>
              <BrandIcon name="seta" size="s16" accentCobalt={false} />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-medium bg-[#121B2D] hover:bg-rose-950/40 text-[#A3AEC4] hover:text-rose-300 border border-[#26324A] transition-colors"
              title="Encerrar sessão"
            >
              <BrandIcon name="fechar" size="s16" accentCobalt={false} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE BAR */}
      <div className="md:hidden flex items-center justify-between p-3 border-b border-[#26324A] bg-[#0E1626] text-white">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <BrandIcon name="mark" size={18} />
          <span className="text-xs font-bold font-display">EditalFlash Ops</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1 text-[#A3AEC4] hover:text-white"
        >
          <BrandIcon name={mobileOpen ? "fechar" : "config"} size="s20" />
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0E1626] border-b border-[#26324A] p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-mono text-[#A3AEC4] hover:bg-[#121B2D]"
            >
              <BrandIcon name={item.icon} size="s16" />
              <span>{item.label}</span>
            </Link>
          ))}
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold text-white bg-[#1B2347]"
          >
            <span>Visão Cliente (Demo)</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-xs text-rose-400 font-semibold"
          >
            Sair da sessão
          </button>
        </div>
      )}

      {/* ADMIN MAIN CONTENT (Alta Densidade) */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0B101D] text-slate-100">
        {/* Sticky Header com Backdrop Blur Glass */}
        <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0E1626]/95 border-b border-[#26324A] px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold font-display text-white tracking-tight">
              {navItems.find((n) => n.id === activeTab)?.label || "Painel de Governança Master"}
            </h2>
            <span className="hidden sm:inline-block text-[10px] font-mono text-slate-400 bg-[#121B2D] px-2 py-0.5 rounded border border-[#26324A]">
              SuperAdmin Cockpit
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">Fundador: <strong className="text-white">renanoacruz@gmail.com</strong></span>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5 text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sessão Master {sessionMinutesLeft}m
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 min-w-0 bg-[#0B101D] text-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
};
