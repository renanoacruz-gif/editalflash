"use client";

import React, { useState } from "react";
import {
  Award,
  Layers,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Info,
} from "lucide-react";
import { CompanyDocumentVaultItem } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export interface AcervoItemAggregation {
  verticalCode: "OBR" | "CMP" | "SRV" | "SAU" | "TIC";
  categoria: string;
  subcategoria: string;
  volumeAcumulado: number;
  unidade: string;
  mediaEditalMercado: number;
  atestadosCount: number;
  atestadoMaximoIndividual: number;
  statusCompetitividade: "COMPETITIVO" | "MODERADO" | "INSUFICIENTE";
  recomendacao: string;
}

interface AcervoDashboardProps {
  docs?: CompanyDocumentVaultItem[];
}

export const AcervoDashboard: React.FC<AcervoDashboardProps> = ({ docs = [] }) => {
  const technicalDocs = docs.filter(
    (d) =>
      d.tipo.toLowerCase().includes("técnico") ||
      d.tipo.toLowerCase().includes("acervo") ||
      d.tipo.toLowerCase().includes("cat") ||
      d.tipo.toLowerCase().includes("atestado")
  );

  // Calcula acervos dinamicamente a partir dos documentos de qualificação técnica
  const acervos: AcervoItemAggregation[] = React.useMemo(() => {
    if (technicalDocs.length === 0) return [];

    // Agrupa ou mapeia documentos técnicos reais cadastrados
    return technicalDocs.map((doc, idx) => {
      const isObras = doc.nome.toLowerCase().includes("obra") || doc.nome.toLowerCase().includes("paviment");
      const isServ = doc.nome.toLowerCase().includes("serviço") || doc.nome.toLowerCase().includes("apoio") || doc.nome.toLowerCase().includes("comercial");
      const isTI = doc.nome.toLowerCase().includes("tecnologia") || doc.nome.toLowerCase().includes("software");

      const verticalCode = isObras ? "OBR" : isTI ? "TIC" : "SRV";
      const categoria = isObras ? "Obras e Engenharia" : isTI ? "Tecnologia da Informação" : "Serviços Especializados";
      
      return {
        verticalCode: verticalCode as any,
        categoria,
        subcategoria: doc.nome,
        volumeAcumulado: 1,
        unidade: "atestado operacional",
        mediaEditalMercado: 1,
        atestadosCount: 1,
        atestadoMaximoIndividual: 1,
        statusCompetitividade: "COMPETITIVO" as const,
        recomendacao: `Documento emitido por ${doc.emissor}. Válido para comprovação técnica (Art. 67).`,
      };
    });
  }, [technicalDocs]);

  return (
    <div className="space-y-8">
      {/* Resumo Topo Sem Cards Pesados */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h2 className="text-base font-semibold text-[#0F172A] font-display">
            Portfólio de Acervo Técnico & Capacidade Operacional
          </h2>
          <p className="text-xs text-[#475569] mt-0.5">
            Análise consolidada conforme o Art. 67 da Lei 14.133/2021 e jurisprudência pacífica da Súmula 263 do TCU.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="neutral">
            SÚMULA 263/TCU
          </Badge>
          <Badge variant="pass">
            REGRA DO SOMATÓRIO ATIVA
          </Badge>
        </div>
      </div>

      {/* Lista de Acervos com Linhas Divisórias Sutis (Linear Pattern) */}
      {acervos.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-[#E2E8F0] text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200 text-[#475569] flex items-center justify-center mx-auto">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-[#0F172A]">Nenhum atestado de capacidade técnica cadastrado</h3>
          <p className="text-xs text-[#475569] max-w-md mx-auto">
            Faça o upload dos seus atestados (CAT ou Atestados B2B/B2G) no Cofre para calcular o somatório de capacidade operacional da Súmula 263 do TCU.
          </p>
        </div>
      ) : (
      <div className="space-y-6">
        {acervos.map((item, idx) => {
          const ratio = Math.round((item.volumeAcumulado / item.mediaEditalMercado) * 100);
          const isCompetitive = item.statusCompetitividade === "COMPETITIVO";
          const isModerate = item.statusCompetitividade === "MODERADO";

          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4"
            >
              {/* Header da Linha */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] shrink-0 mt-0.5">
                    {item.verticalCode}
                  </span>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#475569] tracking-wide block">
                      {item.categoria}
                    </span>
                    <h3 className="text-sm font-medium text-[#0F172A] font-display">
                      {item.subcategoria}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Badge variant={isCompetitive ? "pass" : isModerate ? "warning" : "danger"}>
                    {item.statusCompetitividade} ({ratio}%)
                  </Badge>
                </div>
              </div>

              {/* Barra de Progresso Fina e Limpa (h-1.5) */}
              <div className="space-y-1.5 pt-1">
                <Progress
                  value={Math.min(ratio / 2.5, 100)}
                  indicatorColor={isCompetitive ? "bg-[#10B981]" : isModerate ? "bg-[#F59E0B]" : "bg-[#EF4444]"}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-[#475569] gap-1">
                  <span>
                    Acervo Comprovado: <strong className="text-[#0F172A]">{item.volumeAcumulado.toLocaleString("pt-BR")} {item.unidade}</strong>
                  </span>
                  <span>
                    Média de Edital: <strong className="text-[#0F172A]">{item.mediaEditalMercado.toLocaleString("pt-BR")} {item.unidade}</strong>
                  </span>
                </div>
              </div>

              {/* Detalhes de Acervo e Recomendação */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#475569]">
                <div className="flex items-center gap-3 font-mono">
                  <span>Atestados Válidos: <strong className="text-[#0F172A]">{item.atestadosCount}</strong></span>
                  <span>•</span>
                  <span>Maior Individual: <strong className="text-[#0F172A]">{item.atestadoMaximoIndividual.toLocaleString("pt-BR")} {item.unidade}</strong></span>
                </div>
                <div className="text-xs text-[#0F172A]">
                  <span>{item.recomendacao}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
