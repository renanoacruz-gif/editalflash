"use client";

import React, { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  DollarSign,
  Calendar,
  Clock,
  Building2,
  Copy,
  Check,
  CheckSquare,
  Square,
  AlertTriangle,
  RotateCcw,
  Download,
  Share2,
  Sparkles,
  ShieldCheck,
  Info,
} from "lucide-react";
import confetti from "canvas-confetti";

export interface MockDataType {
  nivel_risco: "Baixo" | "Médio" | "Alto";
  justificativa_risco: string;
  dados_gerais: {
    objeto: string;
    valor_estimado: string;
    data_sessao: string;
    prazo_impugnacao: string;
    orgao?: string;
  };
  armadilhas: Array<{
    titulo: string;
    descricao: string;
    texto_original: string;
    impacto?: "Alto" | "Médio" | "Baixo";
  }>;
  checklist_habilitacao: Array<{
    item: string;
    obrigatorio: boolean;
  }>;
}

interface StateExecutiveReportProps {
  data: MockDataType;
  onReset: () => void;
}

export const StateExecutiveReport: React.FC<StateExecutiveReportProps> = ({
  data,
  onReset,
}) => {
  // Checklist Interactive State
  const [checkedItems, setCheckedItems] = useState<number[]>([0]);
  const [copiedClauseIndex, setCopiedClauseIndex] = useState<number | null>(null);

  const toggleChecklist = (index: number) => {
    let nextChecked: number[];
    if (checkedItems.includes(index)) {
      nextChecked = checkedItems.filter((i) => i !== index);
    } else {
      nextChecked = [...checkedItems, index];
      if (nextChecked.length === data.checklist_habilitacao.length) {
        confetti({
          particleCount: 70,
          spread: 75,
          origin: { y: 0.65 },
          colors: ["#3b82f6", "#10b981", "#60a5fa"],
        });
      }
    }
    setCheckedItems(nextChecked);
  };

  const copyClause = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedClauseIndex(index);
    setTimeout(() => setCopiedClauseIndex(null), 1800);
  };

  // Circular progress math
  const totalDocs = data.checklist_habilitacao.length;
  const completedDocs = checkedItems.length;
  const percentComplete = Math.round((completedDocs / totalDocs) * 100);
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentComplete / 100) * circumference;

  // Dynamic Risk Card Theme (Green / Yellow / Red)
  const getRiskTheme = () => {
    switch (data.nivel_risco) {
      case "Baixo":
        return {
          textColor: "text-emerald-400",
          border: "border-emerald-500/40 shadow-emerald-500/10",
          bgBadge: "bg-emerald-950/70 border-emerald-500/40 text-emerald-300",
          progressColor: "bg-emerald-400",
          score: 28,
        };
      case "Médio":
        return {
          textColor: "text-amber-400",
          border: "border-amber-500/40 shadow-amber-500/10",
          bgBadge: "bg-amber-950/70 border-amber-500/40 text-amber-300",
          progressColor: "bg-amber-400",
          score: 64,
        };
      case "Alto":
        return {
          textColor: "text-rose-400",
          border: "border-rose-500/40 shadow-rose-500/20",
          bgBadge: "bg-rose-950/70 border-rose-500/40 text-rose-300",
          progressColor: "bg-rose-400",
          score: 88,
        };
    }
  };

  const riskTheme = getRiskTheme();

  // Staggered motion variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
    >
      {/* Top Action Bar */}
      <motion.div
        variants={itemVariants}
        className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Relatório Executivo Gerado</h2>
              <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded">
                Lei 14.133/21
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Análise concluída com sucesso • Documento estruturado para tomada de decisão
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Analisar Outro Edital</span>
          </button>

          <button
            onClick={() => alert("Exportando Parecer em PDF...")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar PDF</span>
          </button>

          <button
            onClick={() => alert("Link seguro copiado para área de transferência.")}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Compartilhar</span>
          </button>
        </div>
      </motion.div>

      {/* Main Grid: 2/3 (Left) and 1/3 (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ==================== LEFT COLUMN (2/3) ==================== */}
        <div className="lg:col-span-8 space-y-6">
          {/* Objeto da Licitação */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-6 border border-slate-800"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-2">
              Objeto da Licitação
            </span>
            <p className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {data.dados_gerais.objeto}
            </p>
          </motion.div>

          {/* Dados Rápidos (Grid of 4 small cards) */}
          <motion.div variants={itemVariants} className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block pl-1">
              Dados Rápidos do Certame
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Card 1: Valor */}
              <div className="glass-card rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Valor Estimado</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-base font-bold text-emerald-400 tracking-tight">
                  {data.dados_gerais.valor_estimado}
                </span>
              </div>

              {/* Card 2: Data Sessão */}
              <div className="glass-card rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Data da Sessão</span>
                  <Calendar className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-sm font-bold text-slate-100">
                  {data.dados_gerais.data_sessao}
                </span>
              </div>

              {/* Card 3: Prazo Impugnação */}
              <div className="glass-card rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Prazo Impugnação</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <span className="text-sm font-bold text-amber-400 block">
                    {data.dados_gerais.prazo_impugnacao}
                  </span>
                  <span className="text-[10px] text-slate-400">Até 3 dias úteis antes</span>
                </div>
              </div>

              {/* Card 4: Órgão */}
              <div className="glass-card rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Órgão Licitante</span>
                  <Building2 className="w-4 h-4 text-slate-300" />
                </div>
                <span className="text-xs font-bold text-slate-200 truncate">
                  {data.dados_gerais.orgao || "Prefeitura Municipal / Ente Público"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Armadilhas Identificadas (Cards with Red Left-Borders) */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block pl-1">
                Armadilhas Identificadas ({data.armadilhas.length})
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Cláusulas de Alta Atenção Jurídica
              </span>
            </div>

            <div className="space-y-3.5">
              {data.armadilhas.map((armadilha, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 border-l-4 border-l-rose-500 bg-slate-900/60 p-5 shadow-lg space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {armadilha.titulo}
                      </h4>
                    </div>

                    {/* Copy Clause Button */}
                    <button
                      type="button"
                      onClick={() => copyClause(armadilha.texto_original, idx)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors w-fit"
                    >
                      {copiedClauseIndex === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copiar Cláusula</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {armadilha.descricao}
                  </p>

                  {/* Original Text Excerpt */}
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 font-mono text-[11px] text-slate-400 italic select-all">
                    “{armadilha.texto_original}”
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ==================== RIGHT COLUMN (1/3) ==================== */}
        <div className="lg:col-span-4 space-y-6">
          {/* Nível de Risco (Dynamic Prominent Card: Green / Yellow / Red) */}
          <motion.div
            variants={itemVariants}
            className={`glass-card rounded-2xl p-6 border ${riskTheme.border} shadow-xl relative overflow-hidden backdrop-blur-xl bg-gradient-to-b from-slate-900/90 to-[#0c1220]/90 space-y-4`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Nível de Risco do Edital
                </h4>
                <p className="text-[11px] text-slate-500">Classificação Algorítmica</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${riskTheme.bgBadge}`}
              >
                Risco {data.nivel_risco}
              </span>
            </div>

            {/* Score & Progress */}
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className={`text-4xl font-extrabold tracking-tight ${riskTheme.textColor}`}>
                  {riskTheme.score}
                  <span className="text-sm font-normal text-slate-400"> / 100</span>
                </span>
                <span className="text-xs font-semibold text-slate-400">Índice Contratual</span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
                <div
                  className={`h-full rounded-full ${riskTheme.progressColor}`}
                  style={{ width: `${riskTheme.score}%` }}
                />
              </div>
            </div>

            {/* Justificativa */}
            <div className="pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p>{data.justificativa_risco}</p>
            </div>
          </motion.div>

          {/* Checklist de Habilitação (Interactive + Circular Counter) */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">
                  Checklist de Habilitação
                </h4>
                <p className="text-xs text-slate-400">
                  {completedDocs} de {totalDocs} conferidos
                </p>
              </div>

              {/* Circular Progress Counter (e.g. 2/5 or %) */}
              <div className="relative flex items-center justify-center">
                <svg className="w-14 h-14 transform -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-slate-800"
                    fill="transparent"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="text-blue-500 transition-all duration-500 ease-out"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white font-mono">
                    {completedDocs}/{totalDocs}
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-2.5">
              {data.checklist_habilitacao.map((item, index) => {
                const isChecked = checkedItems.includes(index);

                return (
                  <div
                    key={index}
                    onClick={() => toggleChecklist(index)}
                    className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer select-none flex items-start gap-3 ${
                      isChecked
                        ? "bg-blue-950/20 border-blue-500/30 text-slate-400 opacity-75"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-200 hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="mt-0.5 text-slate-400">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 hover:text-slate-300" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-xs font-medium block transition-all ${
                          isChecked ? "line-through text-slate-500" : "text-white"
                        }`}
                      >
                        {item.item}
                      </span>
                      {item.obrigatorio && (
                        <span className="text-[9px] text-rose-400 font-semibold uppercase tracking-wider block mt-0.5">
                          Obrigatório
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {percentComplete === 100 && (
              <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-500/40 text-xs text-blue-300 font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Documentação completa para habilitação.</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
