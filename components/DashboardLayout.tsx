"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandIcon } from "@/components/brand-icons";
import { useAuth } from "@/lib/auth-context";
import { CommandBar } from "@/components/CommandBar";
import { BackToTopButton } from "@/components/BackToTopButton";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileText,
  BarChart2,
  Lock,
  Award,
  Calendar,
  Radio,
  CreditCard,
  LogOut,
  Sliders,
  Menu,
  X,
  Search,
  Settings,
  Users,
} from "lucide-react";

export const DashboardLayout: React.FC<{ children: React.ReactNode; activeTab?: string }> = ({
  children,
  activeTab = "analises",
}) => {
  const { user, isLoading, logout, isSuperAdmin, impersonation, stopImpersonation } = useAuth();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Recupera preferência de recolhimento persistida no localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("editalflash_sidebar_collapsed");
      if (saved !== null) {
        setCollapsed(saved === "true");
      }
    } catch (_) {}
  }, []);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("editalflash_sidebar_collapsed", String(next));
      } catch (_) {}
      return next;
    });
  };

  // Proteção de rota
  useEffect(() => {
    if (!isLoading && !user) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      } else {
        router.push("/login");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-500 text-xs font-mono gap-3">
        <span className="w-5 h-5 border-2 border-[#2740F0]/30 border-t-[#2740F0] rounded-full animate-spin" />
        <span>Carregando workspace do EditalFlash...</span>
      </div>
    );
  }

  const cleanEmail = user?.email?.toLowerCase().trim() || "";
  const isAdmin = isSuperAdmin || cleanEmail === "renan.oacruz@gmail.com" || cleanEmail === "renanoacruz@gmail.com";

  const navItems = [
    { id: "analises", label: "Auditoria de Habilitação", icon: ShieldCheck, href: "/dashboard" },
    { id: "history", label: "Histórico de Auditorias", icon: FileText, href: "/dashboard/history" },
    { id: "performance", label: "Desempenho & ROI", icon: BarChart2, href: "/dashboard/performance" },
    { id: "cofre", label: "Cofre de Documentos (Art. 62)", icon: Lock, href: "/dashboard/cofre" },
    { id: "acervo", label: "Portfólio de Acervo", icon: Award, href: "/dashboard/acervo" },
    { id: "calendario", label: "Calendário Unificado", icon: Calendar, href: "/dashboard/calendario" },
    { id: "pncp", label: "Radar PNCP", icon: Radio, href: "/dashboard/nova-analise?tab=pncp" },
    { id: "radar", label: "Inteligência & Concorrentes", icon: Radio, href: "/dashboard/radar" },
    { id: "equipe", label: "Equipe & Assentos", icon: Users, href: "/dashboard/equipe" },
    { id: "plano", label: "Créditos e Assinatura", icon: CreditCard, href: "/pricing" },
    { id: "configuracoes", label: "Gestão da Conta", icon: Settings, href: "/dashboard/configuracoes" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col md:flex-row font-sans antialiased selection:bg-[#2740F0] selection:text-[#0F172A]">
      {/* SIDEBAR DESKTOP — Tinta Sólida Nobre (#0E1626) com suporte a recolhimento suave */}
      <aside
        className={`hidden md:flex flex-col border-r border-[#E2E8F0] bg-white text-[#0F172A] p-3 justify-between shrink-0 select-none transition-all duration-300 relative ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {/* Botão Flutuante de Recolhimento/Expansão com Alto Contraste & Destaque */}
        <button
          type="button"
          onClick={toggleCollapse}
          title={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
          className="absolute -right-4 top-5 z-40 w-8 h-8 rounded-full bg-[#2740F0] hover:bg-blue-500 text-[#0F172A] border-2 border-white flex items-center justify-center shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
        >
          {collapsed ? <ChevronRight className="w-4 h-4 stroke-[2.5]" /> : <ChevronLeft className="w-4 h-4 stroke-[2.5]" />}
        </button>

        <div className="space-y-6">
          {/* Logo Oficial com Wordmark */}
          <Link
            href="/dashboard"
            className={`flex items-center gap-2.5 pb-4 border-b border-[#253745] ${
              collapsed ? "justify-center px-0" : "px-1"
            }`}
          >
            <div className="w-8 h-8 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] shrink-0">
              <BrandIcon name="mark" size={20} />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="text-base tracking-tight block font-display leading-none">
                  <span className="font-medium text-[#0F172A]">Edital</span>
                  <span className="font-extrabold text-[#0F172A]">Flash</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono block mt-1 truncate">
                  Auditoria de Habilitação
                </span>
              </div>
            )}
          </Link>

          {/* Badge de Preferência Operacional Ativa */}
          {!collapsed ? (
            <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#1E3A8A] uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A]" />
                  <span>Vertical Ativa</span>
                </span>
              </div>
              <p className="text-xs font-bold text-[#0F172A] truncate" title={user.primary_vertical}>
                {user.primary_vertical || "Obras Públicas e Engenharia"}
              </p>
            </div>
          ) : (
            <div
              className="flex justify-center p-2 rounded-lg bg-[#11212D] border border-[#253745]"
              title={`Vertical Ativa: ${user.primary_vertical}`}
            >
              <span className="w-2 h-2 rounded-full bg-[#1E3A8A]" />
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {!collapsed && (
              <div className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Operações
              </div>
            )}
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    collapsed ? "justify-center px-0" : ""
                  } ${
                    isActive
                      ? "bg-[#EFF6FF] text-[#1E3A8A] font-semibold border-l-4 border-[#1E3A8A]"
                      : "text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#1E3A8A]" : "text-slate-400"}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card e Logout */}
        <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
          <div className={`flex items-center gap-2.5 px-1 ${collapsed ? "justify-center" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] font-bold font-mono text-xs shrink-0">
              {user.name?.charAt(0).toUpperCase() || "L"}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-[#0F172A] truncate block">{user.name}</span>
                <span className="text-[10px] text-[#1E3A8A] font-semibold block uppercase font-mono">
                  Plano {user.plan}
                </span>
              </div>
            )}
          </div>

          {/* Link Admin Master */}
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              title="Acessar Centro de Gestão e Operações SaaS"
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold bg-[#1B2347] hover:bg-[#273360] text-[#0F172A] border border-[#2740F0]/50 transition-colors shadow-sm ${
                collapsed ? "px-0" : ""
              }`}
            >
              <Sliders className="w-4 h-4 text-[#1E3A8A]" />
              {!collapsed && <span>Painel Master</span>}
            </Link>
          )}

          <button
            type="button"
            onClick={logout}
            title={collapsed ? "Sair da conta" : undefined}
            className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F8FAFC] hover:bg-rose-50 text-[#475569] hover:text-rose-700 border border-[#E2E8F0] transition-colors cursor-pointer ${
              collapsed ? "px-0" : ""
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE BAR */}
      <div className="md:hidden flex items-center justify-between p-3.5 border-b border-[#253745] bg-[#F8FAFC] text-[#0F172A]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <BrandIcon name="mark" size={20} />
          <span className="text-sm font-bold font-display">
            Edital<span className="font-extrabold text-[#1E3A8A]">Flash</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 text-slate-300 hover:text-[#0F172A]"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-[#F8FAFC] border-b border-[#253745] p-3 space-y-1.5 text-[#0F172A]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-[#11212D]"
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold text-[#0F172A] bg-[#1B2347] border border-[#2740F0]/50"
            >
              <Sliders className="w-4 h-4 text-[#1E3A8A]" />
              <span>Painel do Administrador (Master)</span>
            </Link>
          )}
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 text-xs text-rose-400 font-semibold"
          >
            Sair da conta
          </button>
        </div>
      )}

      {/* ÁREA DE CONTEÚDO PRINCIPAL — Fundo Branco Puro e Limpo (#FFFFFF / Slate-50) */}
      <main className="flex-1 overflow-y-auto flex flex-col min-w-0 bg-[#F8FAFC]">
        {/* Sticky Header Limpo com Fundo Branco Suave */}
        <header className="sticky top-0 z-40 backdrop-blur-md bg-[#F8FAFC]/95 border-b border-[#253745] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold font-display text-[#0F172A] tracking-tight">
              {navItems.find((n) => n.id === activeTab)?.label || "Workspace de Habilitação"}
            </h2>
            <span className="hidden sm:inline-block text-[11px] font-mono text-[#475569] bg-[#F1F5F9] px-2.5 py-0.5 rounded border border-[#E2E8F0]">
              Lei Federal 14.133/2021
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
              }}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-[#253745] text-slate-600 text-[11px] transition-all shadow-xs cursor-pointer"
              title="Abrir Command Palette (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Comandos Rápidos</span>
              <span className="keycap">Ctrl K</span>
            </button>

            <span className="text-[#64748B] hidden sm:inline">
              Empresa: <strong className="text-[#0F172A]">{user.company || "Licitante"}</strong>
            </span>
            
          </div>
        </header>

        {/* Banner de Impersonation / Modo Suporte */}
        {impersonation?.isImpersonating && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center justify-between text-amber-900 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <strong className="font-mono uppercase tracking-wider">MODO SUPORTE ATIVO:</strong>
              <span>
                Visualizando como <strong>{impersonation.tenant.name}</strong> ({impersonation.tenant.email})
              </span>
              <span className="bg-white text-slate-800 px-2 py-0.5 rounded text-[10px] font-mono border border-[#253745]">
                Vertical: {impersonation.tenant.primary_vertical}
              </span>
            </div>
            <button
              type="button"
              onClick={stopImpersonation}
              className="px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded font-semibold text-xs transition-colors"
            >
              Encerrar Suporte
            </button>
          </div>
        )}

        {/* Workspace de Páginas Internas */}
        <div className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</div>
      </main>

      <CommandBar />
      <BackToTopButton />
    </div>
  );
};
