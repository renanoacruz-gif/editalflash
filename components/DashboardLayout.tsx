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
      {/* SIDEBAR DESKTOP */}
      <aside
        className={`hidden md:flex flex-col justify-between p-3 border-r border-[#E2E8F0] bg-white transition-all duration-200 select-none ${
          collapsed ? "w-18" : "w-64"
        }`}
      >
        <div className="space-y-5">
          {/* Logo e Botão de Recolher */}
          <div className="flex items-center justify-between px-1.5 py-1">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                EF
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-tight text-[#0F172A] font-sans">
                    EditalFlash
                  </span>
                  <span className="text-[11px] text-[#64748B] font-mono leading-none">
                    Auditoria Lei 14.133
                  </span>
                </div>
              )}
            </Link>

            <button
              type="button"
              onClick={toggleCollapse}
              title={collapsed ? "Expandir barra" : "Recolher barra"}
              className="p-1 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Banner Impersonação se ativo */}
          {impersonation && !collapsed && (
            <div className="p-2.5 rounded-lg bg-[#FEFCE8] border border-[#FEF08A] text-[#854D0E] text-xs space-y-1">
              <span className="font-semibold block">Visão de Usuário</span>
              <p className="text-xs text-[#854D0E] truncate">{user.email}</p>
              <button
                type="button"
                onClick={stopImpersonation}
                className="text-xs font-semibold underline text-[#854D0E] hover:text-black"
              >
                Voltar ao Admin
              </button>
            </div>
          )}

          {/* Vertical Ativa do Usuário */}
          {!collapsed ? (
            <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-0.5">
              <span className="text-xs font-medium text-[#64748B] uppercase tracking-wider font-mono">
                Segmento Ativo
              </span>
              <p className="text-xs font-semibold text-[#0F172A] truncate" title={user.primary_vertical}>
                {user.primary_vertical || "Obras e Serviços"}
              </p>
            </div>
          ) : (
            <div
              className="flex justify-center p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]"
              title={`Segmento: ${user.primary_vertical}`}
            >
              <span className="w-2 h-2 rounded-full bg-[#1E3A8A]" />
            </div>
          )}

          {/* Links de Navegação */}
          <nav className="space-y-0.5">
            {!collapsed && (
              <div className="px-2 pb-1.5 text-xs font-medium uppercase tracking-wider text-[#64748B] font-mono">
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
                  className={`flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    collapsed ? "justify-center px-0" : ""
                  } ${
                    isActive
                      ? "bg-[#EFF6FF] text-[#1E3A8A] border-l-3 border-[#1E3A8A] font-semibold"
                      : "text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#1E3A8A]" : "text-[#64748B]"}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Rodapé da Sidebar: Usuário e Sair */}
        <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
          <div className={`flex items-center gap-2.5 px-1 ${collapsed ? "justify-center" : ""}`}>
            <div className="w-7 h-7 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-[#0F172A] truncate block">{user.name}</span>
                <span className="text-xs text-[#64748B] block font-mono">
                  Plano {user.plan}
                </span>
              </div>
            )}
          </div>

          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className={`w-full flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] border border-[#CBD5E1] transition-colors ${
                collapsed ? "px-0" : ""
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-[#0F172A]" />
              {!collapsed && <span>Painel Master</span>}
            </Link>
          )}

          <button
            type="button"
            onClick={logout}
            title={collapsed ? "Sair da conta" : undefined}
            className={`w-full flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#64748B] hover:text-[#991B1B] hover:bg-[#FEF2F2] transition-colors ${
              collapsed ? "px-0" : ""
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            {!collapsed && <span>Encerrar Sessão</span>}
          </button>
        </div>
      </aside>

      {/* BARRA SUPERIOR MOBILE */}
      <div className="md:hidden flex items-center justify-between p-3.5 border-b border-[#E4E4E7] bg-white text-[#09090B]">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#18181B] text-white flex items-center justify-center font-bold text-xs">
            EF
          </div>
          <span className="text-sm font-semibold tracking-tight text-[#09090B]">
            EditalFlash
          </span>
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 text-[#52525B] hover:text-[#09090B]"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* DROPDOWN MENU MOBILE */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-white border-b border-[#E4E4E7] p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#09090B]"
              >
                <Icon className="w-4 h-4 text-[#71717A]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#09090B] bg-[#F4F4F5]"
            >
              <Sliders className="w-4 h-4" />
              <span>Painel Master</span>
            </Link>
          )}
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 text-xs text-red-600 font-medium"
          >
            Encerrar Sessão
          </button>
        </div>
      )}

      {/* ÁREA DE CONTEÚDO PRINCIPAL (100% CLEAN LIGHT) */}
      <main className="flex-1 overflow-y-auto flex flex-col min-w-0 bg-[#FAFAFA]">
        {/* Header Superior Limpo */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-[#E4E4E7] px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-[#09090B] tracking-tight">
              {navItems.find((n) => n.id === activeTab)?.label || "Workspace"}
            </h1>
            <span className="hidden sm:inline-block text-[10px] font-mono text-[#71717A] bg-[#F4F4F5] px-2 py-0.5 rounded border border-[#E4E4E7]">
              Lei 14.133/21
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Saldo de Auditorias / Créditos */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F4F4F5] border border-[#E4E4E7] font-mono">
              <span className="text-[11px] text-[#71717A]">Créditos:</span>
              <strong className="text-xs text-[#09090B]">
                {isAdmin ? "∞ Ilimitado" : `${user.analysesLimit ?? 1}`}
              </strong>
            </div>

            <Link
              href="/dashboard/nova-analise"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#18181B] text-white hover:bg-black font-medium transition-colors shadow-xs"
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
