"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Radar,
  TrendingDown,
  Building2,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Clock,
  DollarSign,
  FileText,
} from "lucide-react";
import { OrgaoEstatisticasComerciais, CompetitorStatsEngine } from "@/lib/competitor-stats-engine";

export default function RadarComercialPage() {
  const [searchTerm, setSearchTerm] = useState("Prefeitura Municipal de Campinas");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<OrgaoEstatisticasComerciais | null>(null);

  const carregarEstatisticas = async (orgaoNome: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/competitors/stats?orgao=${encodeURIComponent(orgaoNome)}`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Erro ao carregar estatísticas comerciais:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEstatisticas(searchTerm);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      carregarEstatisticas(searchTerm.trim());
    }
  };

  return (
    <DashboardLayout activeTab="radar">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--line)]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-tint)] border border-[var(--brand)]/30 text-[var(--brand)] text-xs font-semibold mb-2 font-mono">
              <Radar className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Inteligência Comercial &amp; Dados Abertos PNCP</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] tracking-tight">
              Radar de Concorrentes &amp; Histórico do Órgão
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ink-2)] mt-1">
              Estatísticas objetivas de pregões anteriores: concorrentes vencedores recorrentes, deságio médio e pontualidade de pagamento. Zero análise jurídica.
            </p>
          </div>
        </div>

        {/* Busca por Órgão Licitante */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Digite o nome do órgão (ex: Prefeitura Municipal de Campinas, DNIT, UFRJ)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-xs text-[var(--ink)] focus:outline-none focus:border-[#11212D]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-[#11212D] hover:bg-[#253745] text-[#CCD0CF] font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Consultando PNCP..." : "Consultar Órgão"}
          </button>
        </form>

        {/* Painel de Indicadores Gerais do Órgão */}
        {stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1: Deságio Médio Geral */}
              <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--ink-2)]">
                  <span>Deságio Médio das Propostas</span>
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold font-mono text-emerald-600">
                  {stats.desagioMedioGeral}%
                </div>
                <p className="text-[11px] text-[var(--ink-2)] leading-tight">
                  Média de desconto ofertado pelos vencedores em relação ao valor de referência nos últimos {stats.totalPregoesAnalisados} pregões.
                </p>
              </div>

              {/* Card 2: Pontualidade de Pagamento */}
              <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--ink-2)]">
                  <span>Pontualidade Estimada</span>
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xl font-bold font-mono text-[var(--ink)]">
                  {stats.pontualidadePagamentoEstimada}
                </div>
                <p className="text-[11px] text-[var(--ink-2)] leading-tight">
                  Baseado no prazo médio entre liquidação da nota e ordem de pagamento no Portal da Transparência.
                </p>
              </div>

              {/* Card 3: Volume de Certames Analisados */}
              <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--ink-2)]">
                  <span>Amostragem no PNCP</span>
                  <Building2 className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-3xl font-bold font-mono text-[var(--ink)]">
                  {stats.totalPregoesAnalisados} certames
                </div>
                <p className="text-[11px] text-[var(--ink-2)] leading-tight">
                  CNPJ Convocante: <strong className="font-mono">{stats.cnpjOrgao}</strong>
                </p>
              </div>
            </div>

            {/* Tabela dos Concorrentes Mais Vencedores no Órgão */}
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[var(--ink)] font-display">
                    Top Concorrentes Recorrentes Vencedores neste Órgão
                  </h3>
                  <p className="text-xs text-[var(--ink-2)] mt-0.5">
                    Empresas que mais arremataram lotes em certames anteriores e o desconto médio praticado por elas.
                  </p>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                  Dados Abertos PNCP
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[var(--line)] text-[10px] uppercase font-mono text-[var(--ink-2)]">
                      <th className="py-2.5 px-3">Empresa Vencedora</th>
                      <th className="py-2.5 px-3 text-center">Vitórias</th>
                      <th className="py-2.5 px-3">Valor Total Homologado</th>
                      <th className="py-2.5 px-3 text-center">Deságio Médio</th>
                      <th className="py-2.5 px-3">Último Lote Homologado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]">
                    {stats.concorrentesTop3.map((c, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-[var(--ink)]">{c.razaoSocial}</div>
                          <div className="text-[10px] text-[var(--ink-2)] font-mono">{c.cnpjParcial}</div>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                          {c.vitoriasNoOrgao}x
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {c.valorTotalHomologado.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600">
                          -{c.desagioMedioPercentual}%
                        </td>
                        <td className="py-3 px-3 text-[11px] text-slate-600">
                          {c.ultimoLoteGanho}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
