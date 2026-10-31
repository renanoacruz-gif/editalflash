"use client";

import React, { useState } from "react";

export default function SplitDiffViewer() {
  const [sliderPos, setSliderPos] = useState<number>(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)] overflow-hidden bg-[#070B14]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 text-xs font-mono text-[var(--brand)] uppercase tracking-wider mb-4">
            Auditoria Comparativa
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[var(--foreground)] tracking-tight">
            Antes vs. Depois: O Salto de Segurança Jurídica
          </h2>
          <p className="mt-4 text-base text-[var(--muted)] font-sans">
            Arraste o divisor para comparar a triagem artesanal com a precisão determinística do EditalFlash.
          </p>
        </div>

        {/* Card Container com Slider Interativo */}
        <div
          className="relative w-full h-[540px] rounded-2xl border border-[var(--border)] overflow-hidden select-none cursor-ew-resize shadow-2xl bg-[#090D17]"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* LADO DIREITO: EditalFlash (Base completa por baixo) */}
          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#0B1220] to-[#060911] text-[var(--foreground)]">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--brand)]/20">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[var(--brand)] animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-wider text-[var(--brand)] uppercase">
                  Com EditalFlash • 32 segundos
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded">
                Auditoria 100% Conforme TCU
              </span>
            </div>

            <div className="space-y-4 my-auto">
              <div className="bg-[#0D1626] border border-[var(--brand)]/30 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--brand)] mb-1">
                  <span>ÍNDICES CONTÁBEIS (SG, LG, LC)</span>
                  <span>Art. 69, Lei 14.133</span>
                </div>
                <div className="text-lg font-bold font-mono text-[var(--foreground)]">
                  LC: 1.42 • LG: 1.28 • SG: 1.35
                </div>
                <p className="text-xs text-emerald-400 mt-1 font-mono">
                  ✓ Todos superiores a 1.00. Exigência atendida com margem de segurança.
                </p>
              </div>

              <div className="bg-[#0D1626] border border-amber-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-1">
                  <span>ALERTA PREVENTIVO DE CLÁUSULA ILEGAL</span>
                  <span>Súmula 263 TCU</span>
                </div>
                <div className="text-sm font-semibold text-[var(--foreground)]">
                  Edital exige atestado exclusivo com CAT do Estado de SP
                </div>
                <p className="text-xs text-amber-300 mt-1 font-mono">
                  ⚠️ Restrição territorial vedada pelo Art. 9º. Peça de impugnação pré-gerada pronta para protocolo.
                </p>
              </div>

              <div className="bg-[#0D1626] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-[var(--muted)]">Tempo de Resposta:</span>
                  <div className="text-base font-bold font-mono text-[var(--foreground)]">32 segundos</div>
                </div>
                <div>
                  <span className="text-xs font-mono text-[var(--muted)]">Veredito Executivo:</span>
                  <div className="text-base font-bold font-mono text-[var(--brand)]">Habilitável com Impugnação</div>
                </div>
                <div>
                  <span className="text-xs font-mono text-[var(--muted)]">Risco Residual:</span>
                  <div className="text-base font-bold font-mono text-emerald-400">Mitigação Preventiva de Riscos</div>
                </div>
              </div>
            </div>

            <div className="text-xs font-mono text-[var(--muted)] border-t border-[var(--border)] pt-3 flex justify-between">
              <span>Parecer assinado com Hash Criptográfico</span>
              <span className="text-[var(--brand)]">Visualização Automatizada</span>
            </div>
          </div>

          {/* LADO ESQUERDO: Manual (Clipada pela porcentagem do slider) */}
          <div
            className="absolute inset-y-0 left-0 bg-[#0F141F] border-r border-red-500/40 p-6 sm:p-8 flex flex-col justify-between overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <div className="min-w-[500px]">
              <div className="flex items-center justify-between pb-4 border-b border-red-500/20">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-xs font-mono font-bold tracking-wider text-red-400 uppercase">
                    Processo Manual • 4 a 6 horas
                  </span>
                </div>
                <span className="text-xs font-mono text-red-400 bg-red-950/60 border border-red-500/30 px-2.5 py-1 rounded">
                  Alto Risco de Inabilitação
                </span>
              </div>

              <div className="space-y-4 my-6">
                <div className="bg-[#151C2C] border border-red-500/30 rounded-xl p-4 opacity-90">
                  <span className="text-xs font-mono text-red-400 block mb-1">CONFERÊNCIA DE PDF ESCANEADO</span>
                  <p className="text-sm text-neutral-300 font-mono">
                    "Edital_Pregao_44_2024_com_anexos_v3_final.pdf" (184 páginas)
                  </p>
                  <p className="text-xs text-red-300 mt-2 font-mono">
                    ❌ Cláusula restritiva na página 142 não notada na leitura rápida.
                  </p>
                </div>

                <div className="bg-[#151C2C] border border-[var(--border)] rounded-xl p-4 opacity-90">
                  <span className="text-xs font-mono text-[var(--muted)] block mb-1">CÁLCULO MANUAL EM PLANILHA</span>
                  <div className="text-sm font-mono text-neutral-300">
                    Fórmulas de SG/LG digitadas à mão. Risco de erro de digitação no Balanço.
                  </div>
                  <p className="text-xs text-red-300 mt-2 font-mono">
                    ❌ Atestado aceito internamente, mas desclassificado na sessão pública.
                  </p>
                </div>

                <div className="bg-[#151C2C] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-[var(--muted)]">Tempo Médio:</span>
                    <div className="text-base font-bold font-mono text-red-400">4h 45min</div>
                  </div>
                  <div>
                    <span className="text-xs font-mono text-[var(--muted)]">Status do Parecer:</span>
                    <div className="text-base font-bold font-mono text-neutral-400">Rascunho informal</div>
                  </div>
                  <div>
                    <span className="text-xs font-mono text-[var(--muted)]">Risco Residual:</span>
                    <div className="text-base font-bold font-mono text-red-400">14% de Inabilitação</div>
                  </div>
                </div>
              </div>

              <div className="text-xs font-mono text-[var(--muted)] border-t border-[var(--border)] pt-3">
                <span>Leitura manual passível de fadiga e perda de impugnação</span>
              </div>
            </div>
          </div>

          {/* Divisor Visual Central (Arrastável 60fps) */}
          <div
            className="absolute inset-y-0 w-[2px] bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] pointer-events-none transition-transform"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-slate-900 border-2 border-slate-900 flex items-center justify-center shadow-2xl text-xs font-bold transition-transform hover:scale-110 active:scale-95">
              <span className="font-mono tracking-tighter">⇄</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 text-xs font-mono text-[var(--muted)] px-2">
          <span>◀ Processo Manual (4-6h)</span>
          <span className="text-[var(--brand)]">Arraste para os lados para comparar</span>
          <span>EditalFlash (32s) ▶</span>
        </div>
      </div>
    </section>
  );
}
