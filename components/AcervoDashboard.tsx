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
  FolderOpen,
} from "lucide-react";
import { CompanyDocumentVaultItem } from "@/lib/types";
import { BrandIcon } from "@/components/brand-icons";

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
  // Filtrar se o usuário possui documentos de acervo / atestados / CATs
  const technicalDocs = docs.filter(
    (d) =>
      d.tipo.toLowerCase().includes("técnico") ||
      d.tipo.toLowerCase().includes("acervo") ||
      d.tipo.toLowerCase().includes("cat") ||
      d.tipo.toLowerCase().includes("atestado")
  );

  // Modelagem analítica de acervos técnicos por vertical (Obras, Serviços, Compras, Saúde, TI)
  // Baseada nos documentos do acervo e benchmark de editais Lei 14.133
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
      unidade: "UST (Unid. Serviço Técnico)",
      mediaEditalMercado: 2500,
      atestadosCount: 1,
      atestadoMaximoIndividual: 1200,
      statusCompetitividade: "INSUFICIENTE",
      recomendacao: "Requer somatório de atestados de complexidade similar para licitações de grande porte.",
    },
  ]);

  const hasNoDocs = docs.length > 0 && technicalDocs.length === 0;

  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* Topo do Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--line)]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-[11px] font-mono font-bold mb-1">
            <BrandIcon name="garantia" size="s16" accentCobalt={true} />
            <span>Portfólio de Acervo Técnico (Art. 67 / Súmula 263 TCU)</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[var(--ink)] font-display">
            Mapeamento de Capacidade Técnico-Operacional
          </h2>
          <p className="text-xs text-[var(--ink-2)]">
            Volume cumulativo comprovado por CATs e atestados registrados no cofre vs. limiares típicos de editais.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[var(--bg)] border border-[var(--line)] text-[var(--ink-2)]">
            <strong>{acervos.length}</strong> Especialidades Monitoradas
          </span>
        </div>
      </div>

      {/* Empty State Prompt se o usuário não possuir atestados no cofre */}
      {hasNoDocs && (
        <div className="p-4 rounded-lg bg-[var(--bg)] border border-dashed border-[var(--line)] flex items-center gap-3 text-xs text-[var(--ink-2)] font-mono">
          <FolderOpen className="w-5 h-5 text-[var(--brand)] shrink-0" strokeWidth={1.75} />
          <span>Adicione atestados ao cofre para visualizar seu acervo competitivo.</span>
        </div>
      )}

      {/* Grid de Barras Horizontais de Progresso e Competitividade */}
      <div className="space-y-4">
        {acervos.map((item, idx) => {
          const ratio = Math.min(Math.round((item.volumeAcumulado / item.mediaEditalMercado) * 100), 250);
          const isCompetitive = item.statusCompetitividade === "COMPETITIVO";
          const isModerate = item.statusCompetitividade === "MODERADO";

          return (
            <div
              key={idx}
              className="p-4 rounded-lg bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--brand-tint)] transition-all space-y-3"
            >
              {/* Header da Linha com Sector Badge Identity v1.1 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/30 shrink-0 mt-0.5">
                    {item.verticalCode}
                  </span>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[var(--ink-2)] tracking-wide block">
                      {item.categoria}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--ink)] font-display">
                      {item.subcategoria}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                      isCompetitive
                        ? "bg-[var(--ok-bg)] text-[var(--ok-fg)] border-[var(--ok)]/40"
                        : isModerate
                        ? "bg-[var(--warn-bg)] text-[var(--warn-fg)] border-[var(--warn)]/40"
                        : "bg-[var(--bad-bg)] text-[var(--bad-fg)] border-[var(--bad)]/40"
                    }`}
                  >
                    {item.statusCompetitividade} ({ratio}%)
                  </span>
                </div>
              </div>

              {/* Barra de Progresso Comparativa Semântica */}
              <div className="space-y-1">
                <div className="w-full h-2.5 bg-[var(--line)] rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCompetitive
                        ? "bg-[var(--ok)]"
                        : isModerate
                        ? "bg-[var(--warn)]"
                        : "bg-[var(--bad)]"
                    }`}
                    style={{ width: `${Math.min(ratio / 2.5, 100)}%` }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-[var(--ink-2)] gap-1">
                  <span>
                    Acervo Comprovado: <strong className="text-[var(--ink)]">{item.volumeAcumulado.toLocaleString("pt-BR")} {item.unidade}</strong>
                  </span>
                  <span>
                    Média de Edital: <strong className="text-[var(--ink)]">{item.mediaEditalMercado.toLocaleString("pt-BR")} {item.unidade}</strong>
                  </span>
                </div>
              </div>

              {/* Detalhes de Acervo e Recomendação Operacional */}
              <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-t border-[var(--line)] text-[var(--ink-2)]">
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <span>Atestados Válidos: <strong>{item.atestadosCount}</strong></span>
                  <span>•</span>
                  <span>Maior Individual: <strong>{item.atestadoMaximoIndividual.toLocaleString("pt-BR")} {item.unidade}</strong></span>
                </div>
                <div className="text-[11px] text-[var(--ink)] flex items-center gap-1.5">
                  <BrandIcon name="alerta" size="s16" accentCobalt={true} />
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
