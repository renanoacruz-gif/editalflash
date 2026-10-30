"use client";

/**
 * components/PncpModal.tsx
 * 
 * Pilar 1: Leitor de Editais PNCP (Portal Nacional de Contratações Públicas).
 * Modal interativo de busca em tempo real com filtros por:
 * - UF (Estado)
 * - Termo/Objeto (ex: TI, notebooks, computação em nuvem)
 * - Seleção de edital que auto-preenche a análise diretamente, sem precisar de PDF.
 */

import React, { useState } from "react";
import {
  Search,
  X,
  Building2,
  Calendar,
  DollarSign,
  ArrowRight,
  Loader2,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { PNCPEditalResult, EditalAnalysisResponse } from "@/lib/types";
import { classifyTender } from "@/lib/classifier";
import { buildAdaptiveAnalysis } from "@/lib/ai-manager";

interface PncpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEdital: (editalData: EditalAnalysisResponse, title: string) => void;
}

export const PncpModal: React.FC<PncpModalProps> = ({
  isOpen,
  onClose,
  onSelectEdital,
}) => {
  const [uf, setUf] = useState("");
  const [termo, setTermo] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PNCPEditalResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setHasSearched(true);

    try {
      const params = new URLSearchParams();
      if (uf) params.append("uf", uf);
      if (termo) params.append("termo", termo);

      const res = await fetch(`/api/pncp/search?${params.toString()}`);
      if (!res.ok) throw new Error("Erro na busca do PNCP");

      const data = await res.json();
      setResults(data.data || []);
    } catch (err: any) {
      console.error("Erro ao buscar no PNCP:", err);
      setErrorMsg("Não foi possível carregar os editais do PNCP no momento.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Converte o edital selecionado do PNCP no formato estruturado do EditalFlash
   * aplicando a Classificação Dinâmica e o Rule Set exato correspondente ao objeto.
   */
  const handleSelect = (item: PNCPEditalResult) => {
    // 1. Classificação do objeto do PNCP
    const classification = classifyTender(item.objetoCompra);
    
    // 2. Constrói análise adaptativa com as regras da categoria detectada
    const analysis = buildAdaptiveAnalysis(
      item.objetoCompra,
      "Obras Públicas e Engenharia", // perfil de contexto
      classification.vertical // regra estrita do edital detectado
    );

    // Ajusta dados com as informações oficiais do PNCP
    analysis.dados_gerais = {
      ...analysis.dados_gerais,
      objeto: item.objetoCompra,
      valor_estimado: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(item.valorTotalEstimado ?? 0),
      data_sessao: new Date(item.dataAberturaProposta).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }),
      prazo_impugnacao: new Date(
        new Date(item.dataAberturaProposta).getTime() - 3 * 24 * 60 * 60 * 1000
      ).toLocaleDateString("pt-BR"),
      orgao: item.orgaoEntidade.razaoSocial,
      uf: item.unidadeOrgao?.ufSigla,
      modalidade: item.modalidadeNome,
      numero_edital: item.numeroControlePNCP,
    };

    onSelectEdital(analysis, item.objetoCompra);
    onClose();
  };

  const estadosBrasil = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO",
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl glass-card rounded-3xl border border-slate-700 shadow-2xl overflow-hidden bg-[#0c1322] flex flex-col max-h-[90vh]">
        {/* Header do Modal */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Buscar no Portal Nacional (PNCP)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  API Oficial v1
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Selecione um edital público em andamento para auditar sem precisar fazer upload de PDF
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filtros de Busca */}
        <form onSubmit={handleSearch} className="p-6 border-b border-slate-800/80 bg-slate-900/30 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Campo Objeto */}
            <div className="sm:col-span-8">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Termo do Objeto / Palavra-Chave
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={termo}
                  onChange={(e) => setTermo(e.target.value)}
                  placeholder="Ex: notebooks, nuvem, limpeza, software..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filtro UF */}
            <div className="sm:col-span-4">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Estado (UF)
              </label>
              <select
                value={uf}
                onChange={(e) => setUf(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Todas as UFs</option>
                {estadosBrasil.map((sigla) => (
                  <option key={sigla} value={sigla}>
                    {sigla}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Cache inteligente de 5 minutos respeitando limites do PNCP
            </span>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Consultar Editais</span>
            </button>
          </div>
        </form>

        {/* Resultados da Busca */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1 divide-y divide-slate-800/60">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/50 text-xs text-rose-300 text-center">
              {errorMsg}
            </div>
          )}

          {!loading && results.length === 0 && hasSearched && !errorMsg && (
            <div className="py-12 text-center text-xs text-slate-500">
              Nenhum edital encontrado com estes filtros no momento. Tente buscar com termos mais amplos.
            </div>
          )}

          {!hasSearched && !loading && (
            <div className="py-10 text-center text-xs text-slate-500">
              Clique em <strong>Consultar Editais</strong> para visualizar certames em tempo real no banco oficial.
            </div>
          )}

          {results.map((item, idx) => (
            <div
              key={idx}
              className="pt-3.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-300 border border-slate-700">
                    PNCP: {item.numeroControlePNCP}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                    {item.unidadeOrgao?.ufSigla || "BR"}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[200px]">
                    {item.orgaoEntidade.razaoSocial}
                  </span>
                </div>

                <p className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                  {item.objetoCompra}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <DollarSign className="w-3.5 h-3.5" />
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(item.valorTotalEstimado ?? 0)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Sessão: {new Date(item.dataAberturaProposta).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>

              {/* Ação de Selecionar Edital */}
              <button
                type="button"
                onClick={() => handleSelect(item)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700 hover:border-blue-500 transition-all shrink-0"
              >
                <span>Analisar Este Edital</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
