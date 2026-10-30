"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  History,
  GitCompare,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { BrandIcon } from "@/components/brand-icons";

interface RetificationRadarCardProps {
  previousDate?: string;
  changes?: string[];
  editalTitle?: string;
  previousHash?: string;
  currentHash?: string;
}

export const RetificationRadarCard: React.FC<RetificationRadarCardProps> = ({
  previousDate = "sessão anterior",
  changes = [
    "Prazo de entrega de propostas adiado em 5 dias úteis.",
    "Item 9.2: Redução da exigência de Patrimônio Líquido de 15% para 10% (Art. 69).",
    "Exclusão da cláusula 11.4 que vedava o somatório de atestados técnicos (Súmula 263 TCU).",
  ],
  editalTitle = "Certame Auditado",
  previousHash = "sha256:4f8e...92c1",
  currentHash = "sha256:a7b3...81e9",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bento-card border-2 border-amber-500/50 bg-[var(--surface)] shadow-md rounded-xl p-5 sm:p-6 space-y-4">
      {/* Header com Alerta de Defesa Operacional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--line)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
            <GitCompare className="w-5 h-5 animate-pulse" strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Radar de Retificações Ativo
              </span>
              <span className="text-[10px] font-mono text-[var(--ink-2)]">
                Diff Engine v1.2
              </span>
            </div>
            <h3 className="text-base font-bold text-[var(--ink)] font-display mt-0.5">
              Alteração Detectada no Edital desde {previousDate}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[var(--warn-bg)] text-[var(--warn-fg)] font-bold border border-[var(--warn)]/40">
            {changes.length} Erratas Mapeadas
          </span>
        </div>
      </div>

      {/* Explicação Pericial */}
      <p className="text-xs text-[var(--ink)] leading-relaxed">
        O órgão licitante republicou o documento convocatório. O motor de auditoria cruzou os hashes criptográficos e identificou modificações críticas que impactam seus prazos e requisitos de habilitação:
      </p>

      {/* Lista Comparativa Estilo Bento Diff */}
      <div className="space-y-2.5">
        {changes.map((change, idx) => (
          <div
            key={idx}
            className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--line)] flex items-start gap-3 hover:border-amber-500/40 transition-colors"
          >
            <div className="mt-0.5 p-1 rounded bg-amber-500/10 text-amber-500 shrink-0">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs text-[var(--ink)] leading-relaxed flex-1">
              <span className="font-mono text-[10px] uppercase font-bold text-amber-500 block mb-0.5">
                Alteração #{idx + 1}
              </span>
              <span>{change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detalhes Criptográficos Expansíveis */}
      <div className="pt-2 border-t border-[var(--line)]">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-[11px] font-mono text-[var(--ink-2)] hover:text-[var(--ink)] py-1 transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Evidências Criptográficas do Certame (Hashes SHA-256)</span>
          </div>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isExpanded && (
          <div className="mt-3 p-3.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] font-mono text-[11px] space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-[var(--ink-2)]">
              <span>Hash da Versão Anterior ({previousDate}):</span>
              <strong className="text-[var(--ink)]">{previousHash}</strong>
            </div>
            <div className="flex items-center justify-between text-[var(--ink-2)]">
              <span>Hash da Versão Atual (Publicação Vigente):</span>
              <strong className="text-emerald-500">{currentHash}</strong>
            </div>
            <p className="text-[10px] text-[var(--ink-2)] italic pt-1 border-t border-[var(--line)]">
              Divergência confirmada via integridade de bytes. As regras de conformidade foram atualizadas conforme a versão vigente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
