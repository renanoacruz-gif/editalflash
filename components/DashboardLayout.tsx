"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BrandIcon } from "@/components/brand-icons";
import { useAuth } from "@/lib/auth-context";
import { Logo } from "@/components/brand/Logo";
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
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center text-[#71717A] text-xs font-mono gap-3">
        <span className="w-5 h-5 border-2 border-[#18181B]/20 border-t-[#18181B] rounded-full animate-spin" />
        <span>Carregando EditalFlash...</span>
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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAFAFA] text-[#09090B]">
      {/* SIDEBAR DESKTOP 3D AZUL */}
      <aside
        className={`hidden md:flex flex-col justify-between p-3 bg-gradient-to-b from-[#0B1528] via-[#0F1E36] to-[#0A1324] text-white border-r border-[#1E3A8A]/40 shadow-[4px_0_24px_-2px_rgba(15,23,42,0.25)] transition-all duration-200 select-none relative z-20 ${
          collapsed ? "w-18" : "w-64"
        }`}
      >
        <div className="space-y-4">
          {/* Logo e Botão de Recolher */}
          <div className="flex items-center justify-between px-1.5 py-1">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              {collapsed ? (
                <div className="w-8 h-8 rounded-lg bg-[#0E1626] border border-[#26324A] flex items-center justify-center p-1 shadow-md">
                  <Image
                    src="/brand/ef-simbolo-fundo-escuro.svg"
                    alt="EditalFlash"
                    width={22}
                    height={22}
                  />
                </div>
              ) : (
                <div className="flex flex-col">
                  <Logo variant="fundo-escuro" size="sm" href="" />
                  <span className="text-[10px] text-blue-300 font-mono leading-none tracking-wide mt-1 pl-0.5">
                    Auditoria Lei 14.133
                  </span>
                </div>
              )}
            </Link>

            <button
              type="button"
              onClick={toggleCollapse}
              title={collapsed ? "Expandir barra" : "Recolher barra"}
              className="p-1.5 rounded-lg text-blue-300 hover:text-white hover:bg-white/10 active:bg-white/15 transition-all shadow-xs cursor-pointer border border-transparent hover:border-blue-400/20"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Banner Impersonação se ativo */}
          {impersonation && !collapsed && (
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs space-y-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
              <span className="font-semibold block text-amber-300">Visão de Usuário</span>
              <p className="text-xs text-amber-200 truncate">{user.email}</p>
              <button
                type="button"
                onClick={stopImpersonation}
                className="text-xs font-semibold underline text-amber-300 hover:text-white cursor-pointer"
              >
                Voltar ao Admin
              </button>
            </div>
          )}

          {/* Vertical Ativa do Usuário (Card 3D com baixo-relevo) */}
          {!collapsed ? (
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-blue-400/20 space-y-0.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.35),0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-xs">
              <span className="text-[10px] font-semibold text-blue-300 uppercase tracking-wider font-mono">
                Segmento Ativo
              </span>
              <p className="text-xs font-semibold text-white truncate drop-shadow-xs" title={user.primary_vertical}>
                {user.primary_vertical || "Obras e Serviços"}
              </p>
            </div>
          ) : (
            <div
              className="flex justify-center p-2 rounded-xl bg-white/[0.04] border border-blue-400/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.35)]"
              title={`Segmento: ${user.primary_vertical}`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            </div>
          )}

          {/* Links de Navegação (Módulos 3D) */}
          <nav className="space-y-1">
            {!collapsed && (
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-blue-300/80 font-mono">
                Módulos
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
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 relative ${
                    collapsed ? "justify-center px-0" : ""
                  } ${
                    isActive
                      ? "bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] text-white font-semibold shadow-[0_4px_12px_rgba(29,78,216,0.45),inset_0_1px_1px_rgba(255,255,255,0.35)] border-l-4 border-cyan-300 -translate-y-0.5"
                      : "text-slate-300 hover:text-white hover:bg-white/[0.08] hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.1)] active:translate-y-0 active:shadow-xs"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform duration-150 ${
                    isActive ? "text-cyan-200 drop-shadow-xs" : "text-blue-300/80 group-hover:scale-110"
                  }`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Rodapé da Sidebar: Usuário e Sair */}
        <div className="pt-3 border-t border-blue-900/40 space-y-2">
          <div className={`flex items-center gap-2.5 px-1 ${collapsed ? "justify-center" : ""}`}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-[0_2px_6px_rgba(37,99,235,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-blue-300/30">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-white truncate block drop-shadow-xs">{user.name}</span>
                <span className="text-[11px] text-blue-300 block font-mono">
                  Plano {user.plan}
                </span>
              </div>
            )}
          </div>

          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className={`w-full flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-white/[0.07] hover:bg-white/12 active:bg-white/5 text-blue-100 border border-blue-400/20 shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-0.5 ${
                collapsed ? "px-0" : ""
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-300" />
              {!collapsed && <span>Painel Master</span>}
            </Link>
          )}

          <button
            type="button"
            onClick={logout}
            title={collapsed ? "Sair da conta" : undefined}
            className={`w-full flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-rose-200 hover:bg-rose-500/15 hover:border-rose-400/30 border border-transparent transition-all cursor-pointer ${
              collapsed ? "px-0" : ""
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            {!collapsed && <span>Encerrar Sessão</span>}
          </button>
        </div>
      </aside>

      {/* BARRA SUPERIOR MOBILE 3D AZUL */}
      <div className="md:hidden flex items-center justify-between p-3.5 bg-gradient-to-r from-[#0B1528] via-[#0F1E36] to-[#0A1324] border-b border-blue-900/40 text-white shadow-md">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo variant="fundo-escuro" size="sm" href="" />
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          aria-label={mobileSidebarOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* DROPDOWN MENU MOBILE 3D AZUL */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-gradient-to-b from-[#0F1E36] to-[#0A1324] border-b border-blue-900/40 p-3 space-y-1.5 shadow-xl text-white">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] text-white font-semibold border-l-4 border-cyan-300 shadow-md"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-cyan-200" : "text-blue-300"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-100 bg-white/10 border border-blue-400/20"
            >
              <Sliders className="w-4 h-4 text-cyan-300" />
              <span>Painel Master</span>
            </Link>
          )}
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 text-xs text-rose-300 font-medium hover:bg-rose-500/15 rounded-xl transition-colors cursor-pointer"
          >
            Encerrar Sessão
          </button>
        </div>
      )}

      {/* ÁREA DE CONTEÚDO PRINCIPAL (100% CLEAN LIGHT) */}
      <main className="flex-1 overflow-y-auto flex flex-col min-w-0 bg-[#F8FAFC]">
        {/* Header Superior Limpo */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E2E8F0] px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-[#0F172A] tracking-tight">
              {navItems.find((n) => n.id === activeTab)?.label || "Workspace"}
            </h1>
            <span className="hidden sm:inline-block text-xs font-mono text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0]">
              Lei 14.133/21
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Saldo de Auditorias / Créditos */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F8FAFC] border border-[#CBD5E1] font-mono">
              <span className="text-xs text-[#64748B]">Créditos:</span>
              <strong className="text-xs text-[#0F172A]">
                {isAdmin ? "∞ Ilimitado" : `${user.analysesLimit ?? 1}`}
              </strong>
            </div>

            <Link
              href="/dashboard/nova-analise"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1E3A8A] text-white hover:bg-[#1E40AF] font-medium transition-colors shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Nova Auditoria</span>
            </Link>
          </div>
        </header>

        {/* Viewport dos Componentes */}
        <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      <CommandBar />
      <BackToTopButton />
    </div>
  );
};
