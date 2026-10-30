"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { annotatedCorpusStore, AnnotatedEdital, AnnotatedRequirement } from "@/lib/annotated-corpus-store";
import {
  ShieldCheck,
  Target,
  FileCheck2,
  Download,
  Plus,
  AlertTriangle,
  Lock,
  Users,
  CheckCircle2,
  Scale,
  Sparkles,
} from "lucide-react";

export default function AdminAnnotatePage() {
  const [metrics, setMetrics] = useState(annotatedCorpusStore.getMetrics());
  const [corpus, setCorpus] = useState(annotatedCorpusStore.getCorpus());
  const [pilots, setPilots] = useState(annotatedCorpusStore.getPilots());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Formulário rápido de anotação (< 2 min)
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [editalNumero, setEditalNumero] = useState("");
  const [orgao, setOrgao] = useState("");
  const [valorEstimado, setValorEstimado] = useState("");
  const [specialistName, setSpecialistName] = useState("Auditor Sênior (Lei 14.133)");

  const [reqCategory, setReqCategory] = useState<"Art. 66 (Jurídica)" | "Art. 67 (Técnica)" | "Art. 68 (Fiscal)" | "Art. 69 (Econômica)">("Art. 67 (Técnica)");
  const [reqDesc, setReqDesc] = useState("");
  const [reqClause, setReqClause] = useState("");
  const [reqGroundTruth, setReqGroundTruth] = useState<"PASSA" | "RESSALVA" | "ELIMINATORIA">("PASSA");
  const [reqAiVerdict, setReqAiVerdict] = useState<"PASSA" | "RESSALVA" | "ELIMINATORIA" | "REVISAO_HUMANA_NECESSARIA">("PASSA");
  const [reqOverrideReason, setReqOverrideReason] = useState<any>("");
  const [reqPage, setReqPage] = useState("14");

  const [currentRequirements, setCurrentRequirements] = useState<AnnotatedRequirement[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddRequirement = () => {
    if (!reqDesc) return;
    const newReq: AnnotatedRequirement = {
      id: `req-${Date.now()}`,
      category: reqCategory,
      description: reqDesc,
      originalClause: reqClause || reqDesc,
      groundTruthVerdict: reqGroundTruth,
      aiVerdict: reqAiVerdict,
      overrideReason: reqGroundTruth !== reqAiVerdict ? reqOverrideReason || "Falso Positivo" : undefined,
      pageNumber: reqPage,
    };
    setCurrentRequirements([...currentRequirements, newReq]);
    setReqDesc("");
    setReqClause("");
    showToast("Requisito anotado com sucesso.");
  };

  const handleSaveEditalAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editalNumero || currentRequirements.length === 0) {
      alert("Preencha o número do edital e adicione ao menos um requisito anotado.");
      return;
    }

    annotatedCorpusStore.addAnnotatedEdital({
      numero: editalNumero,
      orgao: orgao || "Órgão Licitante Convocante",
      vertical: metrics.activeVertical,
      valorEstimado: valorEstimado || "R$ 1.500.000,00",
      annotatedDate: new Date().toISOString().split("T")[0],
      specialistName,
      requirements: currentRequirements,
      verified: true,
    });

    setMetrics(annotatedCorpusStore.getMetrics());
    setCorpus(annotatedCorpusStore.getCorpus());
    setIsAnnotating(false);
    setCurrentRequirements([]);
    setEditalNumero("");
    setOrgao("");
    setValorEstimado("");
    showToast(`Edital ${editalNumero} incorporado ao Corpus de Ground Truth.`);
  };

  const handleExportJSON = () => {
    const jsonStr = annotatedCorpusStore.exportCorpusJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `editalflash_corpus_${Date.now()}.json`;
    a.click();
    showToast("Corpus anotado exportado com sucesso.");
  };

  return (
    <AdminLayout activeTab="annotate">
      <div className="max-w-7xl mx-auto space-y-6 text-slate-100">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0b101d] border border-emerald-500/50 text-emerald-300 px-4 py-2.5 rounded-lg shadow-2xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[11px] font-mono mb-1 border border-emerald-500/30">
              <Lock className="w-3.5 h-3.5" />
              <span>Vertical Ativa Trancada: {metrics.activeVertical}</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight legal-serif">
              Validação Vertical &amp; Corpus Anotado (Ground Truth)
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Instrumento pericial de benchmarking para 50 editais reais. Trava de segurança ativa: liberação restrita a acurácia &ge; 95%.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Exportar Corpus (JSON)</span>
            </button>
            <button
              onClick={() => setIsAnnotating(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Anotação (&lt; 2 min)</span>
            </button>
          </div>
        </div>

        {/* Métricas do Corpus & Gatekeeper de Produção */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0b101d] rounded-xl border border-slate-800 p-4 space-y-2">
            <span className="text-[11px] font-mono uppercase text-slate-400 flex items-center justify-between">
              <span>Progresso do Corpus</span>
              <Target className="w-3.5 h-3.5 text-emerald-400" />
            </span>
            <div className="flex items-baseline gap-2 pt-1 font-mono">
              <span className="text-2xl font-bold text-white">{metrics.totalAnnotatedEditais}</span>
              <span className="text-xs text-slate-400">/ {metrics.targetGoal} editais</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${(metrics.totalAnnotatedEditais / metrics.targetGoal) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-[#0b101d] rounded-xl border border-slate-800 p-4 space-y-2">
            <span className="text-[11px] font-mono uppercase text-slate-400 flex items-center justify-between">
              <span>Recall Médio da IA</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </span>
            <div className="flex items-baseline justify-between pt-1 font-mono">
              <span className="text-2xl font-bold text-emerald-400">{metrics.averageRecall}%</span>
              <span className="text-[11px] text-emerald-500/80">Meta &ge; 95%</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Taxa de recuperação exata das cláusulas eliminatórias sem omissões.
            </p>
          </div>

          <div className="bg-[#0b101d] rounded-xl border border-slate-800 p-4 space-y-2">
            <span className="text-[11px] font-mono uppercase text-slate-400 flex items-center justify-between">
              <span>Trava de Produção</span>
              <AlertTriangle className={`w-3.5 h-3.5 ${metrics.isProductionBlocked ? "text-rose-400" : "text-emerald-400"}`} />
            </span>
            <div className="flex items-baseline justify-between pt-1 font-mono">
              <span className={`text-base font-bold ${metrics.isProductionBlocked ? "text-rose-400" : "text-emerald-400"}`}>
                {metrics.isProductionBlocked ? "BLOQUEADO (< 95%)" : "LIBERADO PARA PILOTOS"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {metrics.isProductionBlocked
                ? "Produção suspensa até validação pericial de 95% de recall."
                : "Acurácia comprovada perante o benchmark do Art. 62."}
            </p>
          </div>

          <div className="bg-[#0b101d] rounded-xl border border-slate-800 p-4 space-y-2">
            <span className="text-[11px] font-mono uppercase text-slate-400 flex items-center justify-between">
              <span>Retenção de Pilotos (30d)</span>
              <Users className="w-3.5 h-3.5 text-cyan-400" />
            </span>
            <div className="flex items-baseline justify-between pt-1 font-mono">
              <span className="text-2xl font-bold text-cyan-400">{metrics.retentionRate}%</span>
              <span className="text-[11px] text-cyan-500/80">{metrics.totalPilots} empresas</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Percentual de construtoras do piloto que retornaram para 2º certame.
            </p>
          </div>
        </div>

        {/* MODAL DE ANOTAÇÃO RÁPIDA (< 2 MIN) */}
        {isAnnotating && (
          <div className="bg-[#0b101d] border border-slate-700 rounded-xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>Painel de Anotação Rápida de Edital (Ground Truth)</span>
              </h3>
              <button
                onClick={() => setIsAnnotating(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Número do Edital / Ano:</label>
                <input
                  type="text"
                  value={editalNumero}
                  onChange={(e) => setEditalNumero(e.target.value)}
                  placeholder="Ex: PE 049/2026"
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Órgão Convocante:</label>
                <input
                  type="text"
                  value={orgao}
                  onChange={(e) => setOrgao(e.target.value)}
                  placeholder="Ex: Prefeitura Municipal de Santos"
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Valor Estimado:</label>
                <input
                  type="text"
                  value={valorEstimado}
                  onChange={(e) => setValorEstimado(e.target.value)}
                  placeholder="Ex: R$ 3.200.000,00"
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>

            {/* Adição de Requisito Específico */}
            <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-3">
              <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold block">
                + Adicionar Exigência do Edital
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Categoria Art. 62:</label>
                  <select
                    value={reqCategory}
                    onChange={(e: any) => setReqCategory(e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="Art. 67 (Técnica)">Art. 67 (Técnica)</option>
                    <option value="Art. 69 (Econômica)">Art. 69 (Econômica)</option>
                    <option value="Art. 68 (Fiscal)">Art. 68 (Fiscal)</option>
                    <option value="Art. 66 (Jurídica)">Art. 66 (Jurídica)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Página do PDF:</label>
                  <input
                    type="text"
                    value={reqPage}
                    onChange={(e) => setReqPage(e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Veredito Humano Real:</label>
                  <select
                    value={reqGroundTruth}
                    onChange={(e: any) => setReqGroundTruth(e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="PASSA">PASSA</option>
                    <option value="RESSALVA">RESSALVA</option>
                    <option value="ELIMINATORIA">ELIMINATÓRIA</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Veredito Inicial da IA:</label>
                  <select
                    value={reqAiVerdict}
                    onChange={(e: any) => setReqAiVerdict(e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="PASSA">PASSA</option>
                    <option value="RESSALVA">RESSALVA</option>
                    <option value="ELIMINATORIA">ELIMINATÓRIA</option>
                    <option value="REVISAO_HUMANA_NECESSARIA">REVISÃO HUMANA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs block mb-1">Descrição do Requisito Obrigatório:</label>
                <input
                  type="text"
                  value={reqDesc}
                  onChange={(e) => setReqDesc(e.target.value)}
                  placeholder="Ex: CAT de pavimentação asfáltica em CBUQ com volume mínimo de 5.000m²"
                  className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              {reqGroundTruth !== reqAiVerdict && (
                <div>
                  <label className="text-amber-400 text-xs block mb-1">Motivo da Divergência / Sobrescrita (Override):</label>
                  <select
                    value={reqOverrideReason}
                    onChange={(e) => setReqOverrideReason(e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-slate-900 border border-amber-500/50 text-amber-300 text-xs"
                  >
                    <option value="Falso Positivo">Falso Positivo</option>
                    <option value="Falso Negativo">Falso Negativo</option>
                    <option value="OCR Falhou">OCR Falhou</option>
                    <option value="Citação Ambígua">Citação Ambígua</option>
                    <option value="Regra Inexistente">Regra Inexistente</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddRequirement}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                >
                  Adicionar Requisito
                </button>
              </div>
            </div>

            {/* Requisitos Listados */}
            {currentRequirements.length > 0 && (
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Requisitos Anotados ({currentRequirements.length}):</span>
                {currentRequirements.map((r, i) => (
                  <div key={i} className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span>{r.description} (Pág. {r.pageNumber})</span>
                    <span className="text-emerald-400">Real: {r.groundTruthVerdict} | IA: {r.aiVerdict}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleSaveEditalAnnotation}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950"
              >
                Salvar Anotação no Corpus
              </button>
            </div>
          </div>
        )}

        {/* Tabela de Editais Anotados no Benchmark */}
        <div className="bg-[#0b101d] rounded-xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white legal-serif flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>Corpus de 50 Editais — Benchmark Obras Públicas</span>
              </h3>
              <p className="text-xs text-slate-400">
                Amostragem auditada manualmente com requisitos etiquetados pelo Art. 62 da Lei 14.133/2021.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-mono uppercase text-slate-400 border-b border-slate-800/80 bg-slate-950/40">
                <tr>
                  <th className="py-2.5 px-3">Código Corpus</th>
                  <th className="py-2.5 px-3">Edital / Órgão</th>
                  <th className="py-2.5 px-3">Especialista Revisor</th>
                  <th className="py-2.5 px-3">Exigências</th>
                  <th className="py-2.5 px-3">Acurácia / Recall</th>
                  <th className="py-2.5 px-3 text-right">Status do Selo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {corpus.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">{item.id}</td>
                    <td className="py-3 px-3 font-semibold text-white">
                      <div>{item.numero}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{item.orgao}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-sans">{item.specialistName}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{item.requirements.length} itens</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">{item.aiRecallScore}%</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        Validado Art. 62
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coorte de Empresas Piloto (30-day Retention Tracker) */}
        <div className="bg-[#0b101d] rounded-xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white legal-serif flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Rastreamento de Pilotos de Obras Públicas (Retenção 30d)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Licitantes reais operando no piloto fechado e recorrência de auditorias preventivas.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-mono uppercase text-slate-400 border-b border-slate-800/80 bg-slate-950/40">
                <tr>
                  <th className="py-2.5 px-3">Empresa Licitante</th>
                  <th className="py-2.5 px-3">CNPJ</th>
                  <th className="py-2.5 px-3">1ª Auditoria</th>
                  <th className="py-2.5 px-3">2ª Auditoria (&lt; 30d)</th>
                  <th className="py-2.5 px-3">Total Auditado</th>
                  <th className="py-2.5 px-3 text-right">Retenção</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {pilots.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">{p.companyName}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{p.cnpj}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{p.firstEditalDate}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{p.secondEditalDate || "Pendente"}</td>
                    <td className="py-3 px-3 font-mono font-bold text-white">{p.totalAnalyses} certames</td>
                    <td className="py-3 px-3 text-right">
                      {p.returnedWithin30Days ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                          Recorrente Ativo
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">
                          Em Onboarding
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
