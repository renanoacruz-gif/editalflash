"use client";

import React from "react";
import { VerdictBadge } from "./VerdictBadge";

interface ParecerHeaderProps {
  companyName: string;
  dataEmissao?: string;
  passaCount: number;
  ressalvaCount: number;
  eliminatoriaCount: number;
  revisaoCount: number;
  vereditoGeral: "PASSA" | "RESSALVA" | "ELIMINATORIA" | "REVISAO_HUMANA_NECESSARIA";
  numeroEdital?: string;
  orgao?: string;
}

export const ParecerHeader: React.FC<ParecerHeaderProps> = ({
  companyName,
  dataEmissao,
  passaCount,
  ressalvaCount,
  eliminatoriaCount,
  revisaoCount,
  vereditoGeral,
  numeroEdital,
  orgao,
}) => {
  const dataFormatada =
    dataEmissao ||
    new Date().toLocaleDateString("pt-BR") + " " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="hidden print:block w-full border-b-2 border-black pb-4 mb-6 text-black bg-white">
      {/* Topo Institucional */}
      <div className="flex items-start justify-between gap-4 border-b border-gray-300 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-gray-600 block">
            Auditoria Preventiva de Habilitação (Art. 62 da Lei 14.133/2021)
          </span>
          <h1 className="text-xl font-bold tracking-tight font-display text-black uppercase mt-0.5">
            Parecer Técnico Preliminar de Habilitação
          </h1>
          <div className="text-xs font-sans text-gray-700 mt-1">
            Emitido para: <strong className="text-black font-semibold">{companyName}</strong> em <span className="font-mono">{dataFormatada}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] font-mono text-gray-600">Edital / Processo</div>
          <div className="text-sm font-bold font-mono text-black">{numeroEdital || "PE 048/2026"}</div>
          <div className="text-[10px] text-gray-500 max-w-[200px] truncate">{orgao || "Órgão Licitante Convocante"}</div>
        </div>
      </div>

      {/* Box de Resumo Executivo (GO / NO-GO) - 3 colunas + Veredito Geral */}
      <div className="grid grid-cols-4 gap-2 mt-3 p-3 bg-gray-50 border border-gray-300 rounded">
        <div className="text-center p-2 border-r border-gray-200">
          <span className="text-[9px] font-mono uppercase text-gray-500 block">Conformes</span>
          <strong className="text-base font-mono font-bold text-black">{passaCount}</strong>
          <span className="text-[9px] text-gray-500 block">PASSA</span>
        </div>
        <div className="text-center p-2 border-r border-gray-200">
          <span className="text-[9px] font-mono uppercase text-gray-500 block">Corrigíveis</span>
          <strong className="text-base font-mono font-bold text-black">{ressalvaCount}</strong>
          <span className="text-[9px] text-gray-500 block">RESSALVA</span>
        </div>
        <div className="text-center p-2 border-r border-gray-200">
          <span className="text-[9px] font-mono uppercase text-gray-500 block">Críticos</span>
          <strong className="text-base font-mono font-bold text-black">{eliminatoriaCount}</strong>
          <span className="text-[9px] text-gray-500 block">ELIMINATÓRIA</span>
        </div>
        <div className="text-center p-2 flex flex-col items-center justify-center">
          <span className="text-[9px] font-mono uppercase text-gray-500 block mb-1">Veredito Executivo</span>
          <VerdictBadge status={vereditoGeral} size="sm" />
        </div>
      </div>

      {/* Disclaimer Legal Obrigatório para Decisão de Diretoria */}
      <div className="mt-2 text-[9px] font-mono text-gray-600 text-center italic">
        Documento de suporte à decisão. A responsabilidade jurídica pela análise e envio de propostas permanece com a empresa licitante.
      </div>
    </div>
  );
};
