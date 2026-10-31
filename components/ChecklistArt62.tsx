"use client";

/**
 * components/ChecklistArt62.tsx
 * 
 * Pilar 4: Checklist de Habilitação estritamente baseado no Art. 62 da Lei 14.133/2021.
 * Agrupa os documentos em 4 seções jurídicas expansíveis:
 *   - Habilitação Jurídica (Art. 66)
 *   - Qualificação Técnico-Profissional e Operacional (Art. 67)
 *   - Habilitação Fiscal, Social e Trabalhista (Art. 68)
 *   - Qualificação Econômico-Financeira (Art. 69)
 * 
 * Cada item exibe:
 *   - Status (Checkbox interativo com CheckCircle2)
 *   - Documento Necessário (com ClipboardList)
 *   - Link Oficial (com ExternalLink para Receita Federal, Caixa, TST)
 *   Botão "Exportar Checklist PDF" para geração de relatório para impressão.
 */

import React, { useState } from "react";
import {
  FileCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  Printer,
  ShieldCheck,
  Check,
  CheckSquare,
  Square,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";
import { ChecklistItemArt62 } from "@/lib/types";

export const defaultArt62Items: ChecklistItemArt62[] = [
  // 1. Habilitação Jurídica (Art. 66)
  {
    id: "jur-1",
    categoria: "Habilitação Jurídica (Art. 66)",
    documento: "Contrato Social Consolidado ou Estatuto Social",
    descricao: "Ato constitutivo registrado na Junta Comercial competente com objeto compatível.",
    obrigatorio: true,
    linkOficial: "https://www.gov.br/empresas-e-negocios/pt-br/redesim",
  },
  {
    id: "jur-2",
    categoria: "Habilitação Jurídica (Art. 66)",
    documento: "Procuração e Documento de Identidade dos Sócios/Administradores",
    descricao: "Comprovação de poderes de representação legal e assinatura de propostas.",
    obrigatorio: true,
  },

  // 2. Qualificação Técnica (Art. 67)
  {
    id: "tec-1",
    categoria: "Qualificação Técnico-Profissional e Operacional (Art. 67)",
    documento: "Atestado de Capacidade Técnica Operacional (mínimo 50%)",
    descricao: "Fornecido por pessoa jurídica de direito público ou privado comprovando fornecimento pertinente.",
    obrigatorio: true,
  },
  {
    id: "tec-2",
    categoria: "Qualificação Técnico-Profissional e Operacional (Art. 67)",
    documento: "Registro ou Inscrição na Entidade Profissional Competente (se aplicável)",
    descricao: "Certidão de Registro de Quitação (CREA, CRA, CRC ou respectivo conselho de classe).",
    obrigatorio: false,
    linkOficial: "https://www.confea.org.br",
  },

  // 3. Fiscal, Social e Trabalhista (Art. 68)
  {
    id: "fisc-1",
    categoria: "Habilitação Fiscal, Social e Trabalhista (Art. 68)",
    documento: "CND Conjunta de Tributos Federais e Dívida Ativa da União (PGFN)",
    descricao: "Certidão expedida conjuntamente pela Receita Federal e Procuradoria-Geral da Fazenda Nacional.",
    obrigatorio: true,
    linkOficial: "https://solucoes.receita.fazenda.gov.br/servicos/certidaointernet/pj/emitir",
  },
  {
    id: "fisc-2",
    categoria: "Habilitação Fiscal, Social e Trabalhista (Art. 68)",
    documento: "Certificado de Regularidade do FGTS (CRF)",
    descricao: "Emitido online perante a Caixa Econômica Federal em plena validade.",
    obrigatorio: true,
    linkOficial: "https://consulta-crf.caixa.gov.br/consultacrf/pages/consultaEmpregador.jsf",
  },
  {
    id: "fisc-3",
    categoria: "Habilitação Fiscal, Social e Trabalhista (Art. 68)",
    documento: "CNDT - Certidão Negativa de Débitos Trabalhistas",
    descricao: "Expedida pela Justiça do Trabalho atestando ausência de pendências no BNDT.",
    obrigatorio: true,
    linkOficial: "https://www.tst.jus.br/certidao",
  },

  // 4. Qualificação Econômico-Financeira (Art. 69)
  {
    id: "econ-1",
    categoria: "Qualificação Econômico-Financeira (Art. 69)",
    documento: "Balanço Patrimonial e DRE do Último Exercício Social",
    descricao: "Comprovação de índices de Liquidez Geral (LG), Solvência (SG) e Liquidez Corrente (LC) superiores a 1,0.",
    obrigatorio: true,
  },
  {
    id: "econ-2",
    categoria: "Qualificação Econômico-Financeira (Art. 69)",
    documento: "Certidão Negativa de Falência e Recuperação Judicial",
    descricao: "Expedida pelo distribuidor da sede da pessoa jurídica competente.",
    obrigatorio: true,
  },
];

export const ChecklistArt62: React.FC = () => {
  const [checkedIds, setCheckedIds] = useState<string[]>(["jur-1", "fisc-1", "fisc-2"]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "Habilitação Jurídica (Art. 66)": true,
    "Qualificação Técnico-Profissional e Operacional (Art. 67)": true,
    "Habilitação Fiscal, Social e Trabalhista (Art. 68)": true,
    "Qualificação Econômico-Financeira (Art. 69)": true,
  });

  const categories = [
    "Habilitação Jurídica (Art. 66)",
    "Qualificação Técnico-Profissional e Operacional (Art. 67)",
    "Habilitação Fiscal, Social e Trabalhista (Art. 68)",
    "Qualificação Econômico-Financeira (Art. 69)",
  ] as const;

  const toggleSection = (cat: string) => {
    setExpandedSections((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleItem = (id: string) => {
    let nextChecked: string[];
    if (checkedIds.includes(id)) {
      nextChecked = checkedIds.filter((item) => item !== id);
    } else {
      nextChecked = [...checkedIds, id];
      if (nextChecked.length === defaultArt62Items.length) {
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.65 },
          colors: ["#10b981", "#3b82f6", "#60a5fa"],
        });
      }
    }
    setCheckedIds(nextChecked);
  };

  const total = defaultArt62Items.length;
  const completed = checkedIds.length;
  const percent = Math.round((completed / total) * 100);

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="rounded-2xl p-6 border border-slate-700/80 bg-[#0c1322] shadow-xl space-y-6">
      {/* Header com Progresso & Botão Exportar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white">
                Checklist de Habilitação Integral (Art. 62 da Lei 14.133/21)
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-bold">
                {percent}% Concluído
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Auditoria documental estruturada com links oficiais para emissão direta das certidões
            </p>
          </div>
        </div>

        {/* Botão de Exportação */}
        <button
          type="button"
          onClick={handleExportPDF}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all shadow-sm active:scale-95"
        >
          <Printer className="w-3.5 h-3.5 text-blue-400" />
          <span>Exportar Checklist PDF</span>
        </button>
      </div>

      {/* Categorias Expansíveis do Art. 62 */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const catItems = defaultArt62Items.filter((i) => i.categoria === cat);
          const isExpanded = expandedSections[cat] ?? true;
          const completedInCat = catItems.filter((i) => checkedIds.includes(i.id)).length;

          return (
            <div
              key={cat}
              className="rounded-xl border border-slate-700/80 bg-slate-900/60 overflow-hidden shadow-sm"
            >
              {/* Header da Categoria */}
              <button
                type="button"
                onClick={() => toggleSection(cat)}
                className="w-full px-4 py-3 bg-slate-900/90 flex items-center justify-between text-left hover:bg-slate-800/80 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{cat}</span>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {completedInCat}/{catItems.length} prontos
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Itens da Categoria */}
              {isExpanded && (
                <div className="p-3 space-y-2.5 divide-y divide-slate-800/60">
                  {catItems.map((item) => {
                    const isChecked = checkedIds.includes(item.id);

                    return (
                      <div
                        key={item.id}
                        className={`pt-2.5 first:pt-0 flex items-start justify-between gap-3 p-2 rounded-lg transition-colors ${
                          isChecked ? "bg-emerald-950/20" : "hover:bg-slate-800/40"
                        }`}
                      >
                        {/* Checkbox + Descrição */}
                        <div
                          onClick={() => toggleItem(item.id)}
                          className="flex items-start gap-2.5 flex-1 cursor-pointer select-none"
                        >
                          <div className="mt-0.5 text-slate-400">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400 hover:text-slate-200" />
                            )}
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-xs font-semibold ${
                                  isChecked ? "line-through text-slate-500" : "text-slate-100"
                                }`}
                              >
                                {item.documento}
                              </span>
                              {item.obrigatorio ? (
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30">
                                  Obrigatório
                                </span>
                              ) : (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                  Facultativo
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              {item.descricao}
                            </p>
                          </div>
                        </div>

                        {/* Link Oficial para Emissão */}
                        {item.linkOficial && (
                          <a
                            href={item.linkOficial}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 bg-blue-950/40 hover:bg-blue-900/50 px-2.5 py-1 rounded-lg border border-blue-500/30 transition-colors shrink-0"
                            title="Acessar portal oficial para emissão da certidão"
                          >
                            <span>Emitir Online</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {percent === 100 && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">
              Todos os documentos do Art. 62 conferidos com sucesso!
            </span>
          </div>
          <span className="text-[10px] font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded">
            Empresa 100% Habilitada
          </span>
        </div>
      )}
    </div>
  );
};
