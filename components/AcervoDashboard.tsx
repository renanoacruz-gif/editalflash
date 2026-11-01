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

  const [acervos] = useState<AcervoItemAggregation[]>([
    {
      verticalCode: "OBR",
      categoria: "Obras Públicas / Pavimentação",
      subcategoria: "Pavimentação Asfáltica em CBUQ / Recapeamento",
      volumeAcumulado: 48500,
      unidade: "m²",
      mediaEditalMercado: 20000,
      atestadosCount: 3,
      atestadoMaximoIndividual: 22000,
      statusCompetitividade: "COMPETITIVO",
      recomendacao: "Volume acumulado cobre 242% da média licitada. Apto para certames de grande porte.",
    },
    {
      verticalCode: "OBR",
      categoria: "Obras Civis / Edificações",
      subcategoria: "Construção e Reforma de Prédios Públicos",
      volumeAcumulado: 3400,
      unidade: "m²",
      mediaEditalMercado: 5000,
      atestadosCount: 2,
      atestadoMaximoIndividual: 2100,
      statusCompetitividade: "MODERADO",
      recomendacao: "Apto para lotes médios. Para editais acima de R$ 5M, recomenda-se somatório com novo acervo ou consórcio.",
    },
    {
      verticalCode: "SRV",
      categoria: "Serviços Terceirizados / Contínuos",
      subcategoria: "Postos Efetivos de Vigilância Armada e Limpeza",
      volumeAcumulado: 35,
      unidade: "postos/mês",
      mediaEditalMercado: 50,
      atestadosCount: 1,
      atestadoMaximoIndividual: 35,
      statusCompetitividade: "MODERADO",
      recomendacao: "Atende editais de pequeno e médio porte. Recomenda-se registrar atestados adicionais para certames estaduais.",
    },
    {
      verticalCode: "SAU",
      categoria: "Saúde Pública & Medicamentos",
      subcategoria: "Fornecimento de Insumos Hospitalares & Medicamentos Éticos",
      volumeAcumulado: 120000,
      unidade: "unidades",
      mediaEditalMercado: 80000,
      atestadosCount: 4,
      atestadoMaximoIndividual: 60000,
      statusCompetitividade: "COMPETITIVO",
      recomendacao: "Capacidade de fornecimento cobre 150% do lote médio de registro de preços municipal.",
    },
    {
      verticalCode: "TIC",
      categoria: "Tecnologia da Informação & Comunicação",
      subcategoria: "Desenvolvimento e Sustentação de Sistemas em Nuvem",
      volumeAcumulado: 1200,
      unidade: "UST (Unidade de Serviço Técnico)",
      mediaEditalMercado: 1500,
      atestadosCount: 2,
      atestadoMaximoIndividual: 800,
      statusCompetitividade: "MODERADO",
      recomendacao: "Requer atenção para editais de órgãos federais que exigem comprovação mínima de 1.000 UST em atestado único.",
    },
  ]);

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
    </div>
  );
};
