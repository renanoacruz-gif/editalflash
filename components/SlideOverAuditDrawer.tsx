"use client";

import React, { useEffect, useState } from "react";

export interface ExecutiveAuditItem {
  id: string;
  category: "JURÍDICO" | "QUALIFICAÇÃO TÉCNICA" | "ECONÔMICO-FINANCEIRO" | "FISCAL";
  requirement: string;
  status: "CONFORME" | "RESSALVA" | "CRÍTICO";
  lawArticle: string;
  excerptEdital: string;
  analysisJustification: string;
  tcuJurisprudence?: string;
  suggestedAction: string;
}

interface SlideOverAuditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  item: ExecutiveAuditItem | null;
}

export default function SlideOverAuditDrawer({ isOpen, onClose, item }: SlideOverAuditDrawerProps) {
  const [activeTab, setActiveTab] = useState<"fundamentacao" | "edital_raw" | "peca">("fundamentacao");

  // Fechar no ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop com Blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Gaveta Lateral (Slide-Over Drawer) */}
      <div className="relative w-full max-w-xl bg-[#090D17] border-l border-[var(--border)] h-full overflow-y-auto shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
        {/* Header da Gaveta */}
        <div className="p-6 border-b border-[var(--border)] bg-[#0C1220] sticky top-0 z-20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20">
              {item.category}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#141C2E] hover:bg-[#1E2B44] text-[var(--muted)] hover:text-white flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
          <h3 className="text-xl font-bold font-serif text-[var(--foreground)] tracking-tight">
            {item.requirement}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-xs font-mono text-[var(--muted)]">
            <span>Base Legal:</span>
            <strong className="text-[var(--foreground)]">{item.lawArticle}</strong>
          </div>
        </div>

        {/* Abas Rápidas da Inspeção */}
        <div className="flex border-b border-[var(--border)] bg-[#070B14] px-6 text-xs font-mono">
          <button
            onClick={() => setActiveTab("fundamentacao")}
            className={`py-3 px-3 border-b-2 font-medium transition-colors ${
              activeTab === "fundamentacao"
                ? "border-[var(--brand)] text-[var(--brand)]"
                : "border-transparent text-[var(--muted)] hover:text-white"
            }`}
          >
            Fundamentação & Risco
          </button>
          <button
            onClick={() => setActiveTab("edital_raw")}
            className={`py-3 px-3 border-b-2 font-medium transition-colors ${
              activeTab === "edital_raw"
                ? "border-[var(--brand)] text-[var(--brand)]"
                : "border-transparent text-[var(--muted)] hover:text-white"
            }`}
          >
            Recorte do Edital (OCR)
          </button>
          <button
            onClick={() => setActiveTab("peca")}
            className={`py-3 px-3 border-b-2 font-medium transition-colors ${
              activeTab === "peca"
                ? "border-[var(--brand)] text-[var(--brand)]"
                : "border-transparent text-[var(--muted)] hover:text-white"
            }`}
          >
            Minuta de Impugnação
          </button>
        </div>

        {/* Conteúdo Dinâmico */}
        <div className="p-6 space-y-6 flex-1">
          {activeTab === "fundamentacao" && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#0F1626] border border-[var(--border)]">
                <span className="text-[11px] font-mono text-[var(--muted)] uppercase block mb-1">Diagnóstico do Auditor</span>
                <p className="text-sm text-neutral-200 leading-relaxed font-sans">
                  {item.analysisJustification}
                </p>
              </div>

              {item.tcuJurisprudence && (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                    <span>⚖️ Jurisprudência TCU Consolidada</span>
                  </div>
                  <p className="text-xs text-amber-200/90 font-mono leading-relaxed">
                    {item.tcuJurisprudence}
                  </p>
                </div>
              )}

              <div className="p-4 rounded-xl bg-[#0C1220] border border-[var(--brand)]/30">
                <span className="text-[11px] font-mono text-[var(--brand)] uppercase block mb-1">Estratégia Recomendada</span>
                <p className="text-sm font-semibold text-[var(--foreground)] font-sans">
                  {item.suggestedAction}
                </p>
              </div>
            </div>
          )}

          {activeTab === "edital_raw" && (
            <div className="space-y-4">
              <span className="text-xs font-mono text-[var(--muted)] block">Trecho extraído do documento original:</span>
              <div className="bg-[#05070D] p-4 rounded-xl border border-[var(--border)] font-mono text-xs text-neutral-300 leading-relaxed border-l-4 border-l-[var(--brand)]">
                {item.excerptEdital}
              </div>
              <p className="text-[11px] font-mono text-[var(--muted)]">
                * OCR validado com correspondência de hash SHA-256 da página 14.
              </p>
            </div>
          )}

          {activeTab === "peca" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-[var(--muted)]">Minuta de Petição Prévia</span>
                <button
                  onClick={() => alert("Texto copiado para a área de transferência!")}
                  className="px-2.5 py-1 text-xs font-mono rounded bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/30 hover:bg-[var(--brand)]/20"
                >
                  Copiar Peça
                </button>
              </div>
              <div className="bg-[#05070D] p-4 rounded-xl border border-[var(--border)] font-mono text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                {`ILUSTRÍSSIMO SENHOR PREGOEIRO DA COMISSÃO DE CONTRATAÇÃO\n\nREF: EDITAL PREGÃO ELETRÔNICO Nº 44/2024\nIMPUGNAÇÃO AO EDITAL COM BASE NO ART. 164 DA LEI 14.133/2021\n\nA empresa licitante vem, respeitosamente, impugnar o subitem correspondente por violação expressa ao Princípio da Ampla Competitividade (Art. 9º, I e Art. 67, § 2º) e Súmula 263 do Tribunal de Contas da União, requerendo a retificação do instrumento convocatório.`}
              </div>
            </div>
          )}
        </div>

        {/* Footer com Ações */}
        <div className="p-6 border-t border-[var(--border)] bg-[#0C1220] flex items-center justify-between gap-4">
          <span className="text-xs font-mono text-[var(--muted)]">Status: {item.status}</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[var(--brand)] text-[#05080F] font-semibold text-xs font-sans hover:brightness-110"
          >
            Concluir Inspeção
          </button>
        </div>
      </div>
    </div>
  );
}
