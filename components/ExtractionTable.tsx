"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileBadge,
  DollarSign,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Scale,
  HelpCircle,
} from "lucide-react";
import { DadosGerais } from "@/lib/types";

export const ExtractionTable: React.FC<{ data: DadosGerais }> = ({ data }) => {
  const [expandedId, setExpandedId] = useState<string | null>("prazo_impugnacao");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (e: React.MouseEvent, text: string, key: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const cards = [
    {
      id: "objeto",
      title: "Objeto do Edital",
      value: data.objeto,
      icon: FileBadge,
      highlightColor: "text-blue-400",
      tooltip: "Resumo executivo do escopo técnico licitado pela Administração Pública.",
      detail:
        "Escopo mapeado e normalizado pelo EditalFlash. Verifique detalhadamente os anexos técnicos para alinhar seu plano de trabalho comercial.",
    },
    {
      id: "valor_estimado",
      title: "Valor Estimado / Orçamento Total",
      value: data.valor_estimado,
      icon: DollarSign,
      highlightColor: "text-emerald-400 font-bold",
      tooltip: "Teto de referência orçamentária estipulado pelo Estudo Técnico Preliminar (ETP).",
      detail:
        "Propostas acima deste montante sem justificativa sofrerão desclassificação automática nos termos do Art. 59, III da Lei 14.133/21.",
    },
    {
      id: "data_sessao",
      title: "Abertura da Sessão Pública",
      value: data.data_sessao,
      icon: Calendar,
      highlightColor: "text-slate-100 font-semibold",
      tooltip: "Data e horário limite improrrogável para envio das propostas e início dos lances.",
      detail:
        "Disputa via Portal de Compras Públicas. Recomenda-se o upload prévio das propostas e documentos com pelo menos 2 horas de antecedência.",
    },
    {
      id: "prazo_impugnacao",
      title: "Prazo Limite para Impugnação",
      value: data.prazo_impugnacao,
      icon: Clock,
      highlightColor: "text-amber-400 font-bold",
      badge: "Prazo Crítico",
      tooltip: "Você tem até esta data para questionar regras injustas ou direcionamento de marca.",
      detail:
        "Qualquer licitante pode impugnar o edital até 3 (três) dias úteis antes da abertura da sessão pública conforme o Art. 164 da Lei 14.133/21.",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Metadados Estruturados (dados_gerais)</span>
          </h4>
          <p className="text-xs text-slate-400">
            Clique nos cards para expandir pareceres e orientações jurídicas
          </p>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
          {cards.length} Campos Analisados
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {cards.map((card) => {
          const Icon = card.icon;
          const isExpanded = expandedId === card.id;

          return (
            <motion.div
              key={card.id}
              onClick={() => toggleExpand(card.id)}
              className={`rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                isExpanded
                  ? "bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-black/40"
                  : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              {/* Card Header Row */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
                    <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-300">
                        {card.title}
                      </span>
                      {card.badge && (
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.5 rounded">
                          {card.badge}
                        </span>
                      )}
                    </div>
                    {/* Tooltip hint on hover */}
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <HelpCircle className="w-3 h-3 text-slate-500" />
                      <span>{card.tooltip}</span>
                    </p>
                  </div>
                </div>

                {/* Right side Value + Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pl-9 sm:pl-0">
                  <span className={`text-sm ${card.highlightColor} tracking-tight`}>
                    {card.value}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => copyText(e, card.value, card.id)}
                      className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Copiar texto"
                    >
                      {copiedKey === card.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <span className="text-slate-500 p-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expandable Smooth Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 bg-slate-950/50">
                      <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                        <Scale className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-semibold text-white">Análise Normativa:</p>
                          <p className="text-slate-400 leading-relaxed">{card.detail}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
