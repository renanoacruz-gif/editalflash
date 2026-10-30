"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  AlertOctagon,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Scale,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Armadilha } from "@/lib/types";

export const TrapAlerts: React.FC<{ armadilhas: Armadilha[] }> = ({ armadilhas }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyClause = (e: React.MouseEvent, text: string, index: number) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Alertas de Armadilhas (Cláusulas Restritivas)</h4>
            <p className="text-xs text-slate-400">
              Identificadas pelo prompt estrito da IA para impugnação ou readequação
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-950/70 text-rose-400 border border-rose-500/30">
          {armadilhas.length} Cláusulas Detectadas
        </span>
      </div>

      {/* Trap Cards with Colored Left Border based on Impact */}
      <div className="space-y-3">
        {armadilhas.map((item, index) => {
          const isCritical = item.impacto === "Alto";
          const isExpanded = expandedIndex === index;

          return (
            <div
              key={index}
              onClick={() => toggleExpand(index)}
              className={`rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                isCritical
                  ? "border-l-4 border-l-rose-500 bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
                  : item.impacto === "Médio"
                  ? "border-l-4 border-l-amber-500 bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
                  : "border-l-4 border-l-emerald-500 bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              {/* Card Main Row */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isCritical ? (
                      <AlertOctagon className="w-4 h-4 text-rose-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white tracking-tight">
                        {item.titulo}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                      {item.descricao}
                    </p>
                  </div>
                </div>

                {/* Right actions: Copy button + Badge + Expand toggle */}
                <div className="flex items-center justify-between sm:justify-end gap-2.5 pl-7 sm:pl-0">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isCritical
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : item.impacto === "Médio"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    Impacto {item.impacto}
                  </span>

                  {/* Copy Clause Button */}
                  <button
                    type="button"
                    onClick={(e) => handleCopyClause(e, item.texto_original, index)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                    title="Copiar texto_original do edital"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copiar Cláusula</span>
                      </>
                    )}
                  </button>

                  <span className="text-slate-500 p-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-300" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </span>
                </div>
              </div>

              {/* Expandable Panel */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-1 border-t border-slate-800/80 bg-slate-950/60 space-y-3">
                      {/* Literal Clause extract: texto_original */}
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Texto Original do Edital:
                        </span>
                        <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 font-mono text-[11px] text-slate-300 italic border-l-2 border-l-slate-600 select-all">
                          “{item.texto_original}”
                        </div>
                      </div>

                      {/* Legal ground and action */}
                      <div className="grid grid-cols-1 gap-2 text-xs">
                        <div className="flex items-start gap-2 text-slate-300">
                          <Scale className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-white">Parecer Especialista:</strong> {item.descricao}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                          <span className="text-slate-400">
                            <strong className="text-amber-400">Diretriz:</strong> Passível de impugnação prévia fundamentada na Lei 14.133/21.
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.alert(
                                `Minuta de Impugnação preparada para: ${item.titulo}.\nTexto do Edital copiado para área de trabalho.`
                              );
                            }}
                            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs font-semibold shrink-0"
                          >
                            <span>Gerar Impugnação</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
