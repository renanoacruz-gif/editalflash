"use client";

import React, { useState } from "react";

interface TimelineMilestone {
  id: string;
  phase: string;
  title: string;
  legalDeadline: string;
  lawReference: string;
  status: "completed" | "critical" | "upcoming";
  details: string;
  actionPrompt: string;
}

const MILESTONES: TimelineMilestone[] = [
  {
    id: "pub",
    phase: "Fase 01",
    title: "Publicação no PNCP",
    legalDeadline: "D-0 • 08:00",
    lawReference: "Art. 54, Lei 14.133",
    status: "completed",
    details: "Edital e termo de referência capturados e indexados pelo motor EditalFlash em 4.2 segundos.",
    actionPrompt: "Auditoria automática executada",
  },
  {
    id: "esclarece",
    phase: "Fase 02",
    title: "Pedidos de Esclarecimento",
    legalDeadline: "Até 3 dias úteis antes",
    lawReference: "Art. 164, Lei 14.133",
    status: "completed",
    details: "Dúvidas técnicas sobre qualificação econômico-financeira enviadas preventivamente ao Pregoeiro.",
    actionPrompt: "2 esclarecimentos respondidos",
  },
  {
    id: "impugna",
    phase: "Fase 03",
    title: "Prazo Fatal de Impugnação",
    legalDeadline: "3 dias úteis antes da abertura",
    lawReference: "Art. 164, § único",
    status: "critical",
    details: "Identificada exigência restritiva no Art. 67 (Súmula 263 TCU). Risco iminente de perda do prazo de protocolo.",
    actionPrompt: "Peça jurídica pré-gerada pronta para protocolo",
  },
  {
    id: "abertura",
    phase: "Fase 04",
    title: "Abertura da Sessão de Disputa",
    legalDeadline: "Dia D • 10:00",
    lawReference: "Art. 56, Lei 14.133",
    status: "upcoming",
    details: "Envio das propostas de preços e lances em tempo real com documentação validada.",
    actionPrompt: "Monitoramento de lances",
  },
  {
    id: "recursal",
    phase: "Fase 05",
    title: "Intenção Recursal Imediata",
    legalDeadline: "Sessão Pública",
    lawReference: "Art. 165, I",
    status: "upcoming",
    details: "Manifestação motivada em caso de ilegalidade na aceitação de proposta de concorrente.",
    actionPrompt: "Minuta de recurso pronta",
  },
];

export default function LegalTimelineScrubber() {
  const [selectedMilestone, setSelectedMilestone] = useState<TimelineMilestone>(MILESTONES[2]); // Default no crítico (Impugnação)

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)] overflow-hidden bg-[#05080E]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-mono text-amber-400 uppercase tracking-wider mb-4">
            Rigor Processual & Prazos Fatais
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[var(--foreground)] tracking-tight">
            Linha do Tempo Legal da Lei 14.133/2021
          </h2>
          <p className="mt-4 text-base text-[var(--muted)] font-sans">
            Nunca mais perca o prazo de impugnar um edital viciado ou esclarecer uma exigência absurda.
          </p>
        </div>

        {/* Régua de Navegação Horizontal */}
        <div className="relative mb-10 pb-4 overflow-x-auto">
          {/* Linha de Conexão */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#1A2335] -translate-y-1/2 z-0" />

          <div className="relative z-10 flex justify-between min-w-[700px] gap-4">
            {MILESTONES.map((item) => {
              const isSelected = selectedMilestone.id === item.id;
              const isCritical = item.status === "critical";

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedMilestone(item)}
                  className={`flex flex-col items-center text-center p-3 rounded-xl transition-all ${
                    isSelected
                      ? "bg-[#0E1626] border border-[var(--brand)] shadow-lg shadow-[var(--brand)]/10 scale-105"
                      : "bg-[#0A0F1A] border border-[var(--border)] hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isCritical
                          ? "bg-amber-400 animate-ping"
                          : item.status === "completed"
                          ? "bg-emerald-400"
                          : "bg-neutral-600"
                      }`}
                    />
                    <span className="text-[10px] font-mono text-[var(--muted)] uppercase">{item.phase}</span>
                  </div>

                  <span className={`text-xs font-bold font-sans ${isSelected ? "text-[var(--brand)]" : "text-[var(--foreground)]"}`}>
                    {item.title}
                  </span>

                  <span className="text-[11px] font-mono text-[var(--muted)] mt-1">
                    {item.legalDeadline}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Detalhado do Marco Selecionado */}
        <div className="bg-[#0A0F1D] border border-[var(--border)] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[var(--border)] gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/30">
                  {selectedMilestone.phase}
                </span>
                <span className="text-xs font-mono text-[var(--muted)]">
                  Dispositivo Legal: <strong className="text-[var(--foreground)]">{selectedMilestone.lawReference}</strong>
                </span>
              </div>
              <h3 className="text-2xl font-bold font-serif text-[var(--foreground)] mt-2">
                {selectedMilestone.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase ${
                selectedMilestone.status === "critical"
                  ? "bg-amber-950/80 text-amber-400 border border-amber-500/40"
                  : selectedMilestone.status === "completed"
                  ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/40"
                  : "bg-neutral-900 text-neutral-400 border border-neutral-700"
              }`}>
                {selectedMilestone.status === "critical" ? "⚠️ Prazo Fatal Crucial" : selectedMilestone.status === "completed" ? "✓ Triagem Concluída" : "⏳ Próxima Etapa"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 items-center">
            <div className="md:col-span-8">
              <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
                {selectedMilestone.details}
              </p>
            </div>
            <div className="md:col-span-4 bg-[#060911] p-4 rounded-xl border border-[var(--border)]">
              <span className="text-[11px] font-mono text-[var(--muted)] uppercase block mb-1">Ação Preventiva</span>
              <div className="text-sm font-semibold font-mono text-[var(--brand)]">
                {selectedMilestone.actionPrompt}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-mono text-[var(--muted)]">
              Contagem regressiva sincronizada com o fuso horário oficial de Brasília (Art. 183)
            </span>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#141E33] hover:bg-[#1A2744] text-[var(--foreground)] border border-[var(--border)] text-xs font-mono transition-all"
            >
              Ativar Alertas deste Certame
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
