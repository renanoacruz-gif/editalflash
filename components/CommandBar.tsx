"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FileText,
  ShieldCheck,
  Award,
  Calendar,
  Scale,
  Sparkles,
  ArrowRight,
  Zap,
  X,
  PlusCircle,
  TrendingUp,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  category: "Ações Rápidas" | "Navegação" | "Auditoria";
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const commands: CommandItem[] = [
    {
      id: "nova-auditoria",
      title: "Auditar Novo Edital em PDF",
      category: "Ações Rápidas",
      shortcut: "N",
      icon: <PlusCircle className="w-4 h-4 text-[var(--brand)]" />,
      action: () => {
        router.push("/dashboard/nova-analise");
        setIsOpen(false);
      },
    },
    {
      id: "buscar-pncp",
      title: "Buscar Licitações no Radar PNCP",
      category: "Ações Rápidas",
      shortcut: "P",
      icon: <Search className="w-4 h-4 text-emerald-500" />,
      action: () => {
        router.push("/dashboard/nova-analise?tab=pncp");
        setIsOpen(false);
      },
    },
    {
      id: "ver-acervo",
      title: "Portfólio de Acervo & Capacidade Técnica",
      category: "Navegação",
      shortcut: "A",
      icon: <Award className="w-4 h-4 text-amber-500" />,
      action: () => {
        router.push("/dashboard/acervo");
        setIsOpen(false);
      },
    },
    {
      id: "ver-cofre",
      title: "Cofre de Documentos (Art. 62)",
      category: "Navegação",
      shortcut: "C",
      icon: <ShieldCheck className="w-4 h-4 text-blue-500" />,
      action: () => {
        router.push("/dashboard/cofre");
        setIsOpen(false);
      },
    },
    {
      id: "ver-calendario",
      title: "Calendário Unificado de Vencimentos",
      category: "Navegação",
      shortcut: "V",
      icon: <Calendar className="w-4 h-4 text-rose-500" />,
      action: () => {
        router.push("/dashboard/calendario");
        setIsOpen(false);
      },
    },
    {
      id: "desempenho-roi",
      title: "Cockpit de Desempenho & ROI de Licitações",
      category: "Navegação",
      shortcut: "R",
      icon: <TrendingUp className="w-4 h-4 text-purple-500" />,
      action: () => {
        router.push("/dashboard/performance");
        setIsOpen(false);
      },
    },
    {
      id: "historico-auditorias",
      title: "Histórico de Editais Auditados",
      category: "Auditoria",
      shortcut: "H",
      icon: <FileText className="w-4 h-4 text-[var(--ink-2)]" />,
      action: () => {
        router.push("/dashboard/history");
        setIsOpen(false);
      },
    },
  ];

  const filtered = query.trim()
    ? commands.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-[var(--surface)] border border-[var(--line)] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--line)]">
          <Search className="w-4 h-4 text-[var(--brand)] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="O que você precisa fazer? (Ex: auditar, PNCP, acervo, cofre...)"
            className="flex-1 bg-transparent text-sm text-[var(--ink)] placeholder-[var(--ink-2)] focus:outline-none"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-[var(--line)]/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[var(--ink-2)] font-mono">
              Nenhuma ação encontrada para "{query}".
            </div>
          ) : (
            filtered.map((cmd) => (
              <button
                key={cmd.id}
                onClick={cmd.action}
                className="w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs hover:bg-[var(--brand-tint)]/40 text-[var(--ink)] transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-[var(--bg)] border border-[var(--line)] group-hover:border-[var(--brand)]/30">
                    {cmd.icon}
                  </div>
                  <div>
                    <span className="font-semibold block">{cmd.title}</span>
                    <span className="text-[10px] text-[var(--ink-2)] font-mono">
                      {cmd.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {cmd.shortcut && (
                    <span className="keycap">{cmd.shortcut}</span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--ink-2)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[var(--line)] bg-[var(--bg)]/50 flex items-center justify-between text-[11px] font-mono text-[var(--ink-2)]">
          <div className="flex items-center gap-3">
            <span>Navegar: <strong>↑ ↓</strong></span>
            <span>Executar: <strong>↵ Enter</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Atalho global:</span>
            <span className="keycap">Ctrl</span>
            <span className="keycap">K</span>
          </div>
        </div>
      </div>
    </div>
  );
};