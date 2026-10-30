"use client";

import React, { useState } from "react";
import { Check, FileCheck2, Award } from "lucide-react";
import confetti from "canvas-confetti";
import { ChecklistHabilitacaoItem } from "@/lib/types";

export const ComplianceList: React.FC<{ items: ChecklistHabilitacaoItem[] }> = ({
  items,
}) => {
  // Inicialmente marca os 2 primeiros itens como conferidos
  const [checkedIndices, setCheckedIndices] = useState<number[]>([0, 1]);

  const toggleItem = (index: number) => {
    let nextChecked: number[];
    if (checkedIndices.includes(index)) {
      nextChecked = checkedIndices.filter((i) => i !== index);
    } else {
      nextChecked = [...checkedIndices, index];
      if (nextChecked.length === items.length) {
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#10b981", "#34d399", "#6ee7b7"],
        });
      }
    }
    setCheckedIndices(nextChecked);
  };

  const total = items.length;
  const completed = checkedIndices.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // SVG Circular progress values
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-xl bg-slate-900/60 flex flex-col justify-between">
      {/* Top Header with Circular Progress Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              Checklist de Habilitação
            </h4>
            <p className="text-[11px] text-slate-400">
              {completed} de {total} documentos verificados
            </p>
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative flex items-center justify-center">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="currentColor"
              strokeWidth="5"
              className="text-slate-800"
              fill="transparent"
            />
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="currentColor"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-emerald-400 transition-all duration-700 ease-out"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-xs font-bold text-white font-mono">{percent}%</span>
          </div>
        </div>
      </div>

      {/* List items with strike-through and faded style */}
      <div className="mt-4 space-y-2.5">
        {items.map((doc, index) => {
          const isChecked = checkedIndices.includes(index);

          return (
            <div
              key={index}
              onClick={() => toggleItem(index)}
              className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer select-none flex items-start gap-2.5 ${
                isChecked
                  ? "bg-emerald-950/20 border-emerald-500/30 text-slate-400 opacity-80"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isChecked ? (
                  <div className="w-4 h-4 rounded bg-emerald-500 text-slate-950 flex items-center justify-center shadow">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded border border-slate-600 hover:border-emerald-400 transition-colors" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`text-xs font-semibold transition-all ${
                      isChecked ? "line-through text-slate-500" : "text-white"
                    }`}
                  >
                    {doc.item}
                  </span>
                  {doc.obrigatorio ? (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30 font-semibold">
                      Obrigatório
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      Facultativo
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Success banner if 100% */}
      {percent === 100 && (
        <div className="mt-3.5 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-[11px]">Habilitação 100% Conferida.</span>
          </div>
          <span className="text-[10px] font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded">
            Pronto para Disputa
          </span>
        </div>
      )}
    </div>
  );
};
