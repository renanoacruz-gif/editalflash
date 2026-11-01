"use client";

import React from "react";
import Link from "next/link";
import { BrandIcon } from "@/components/brand-icons";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--line)] pt-12 pb-10 text-[var(--ink-2)] text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[var(--line)]">
          {/* Col 1: Brand & Positioning */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <BrandIcon name="mark" size={22} />
              <span className="text-base font-bold text-[var(--ink)] tracking-tight font-display">
                Edital<span className="text-[var(--brand)] font-extrabold">Flash</span>
              </span>
            </Link>

            <p className="text-xs text-[var(--ink-2)] leading-relaxed">
              Auditoria preventiva de habilitação documental para licitações públicas sob a Lei Federal nº 14.133/2021.
            </p>

            <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--ink-2)] pt-1">
              <span>AES-256</span>
              <span>·</span>
              <span>TLS 1.3</span>
              <span>·</span>
              <span>LGPD Compliant</span>
            </div>
          </div>

          {/* Col 2: Documentação Jurídica Oficial */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink)] font-mono">
              Documentação Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/termos" className="hover:text-[var(--brand)] transition-colors">
                  Termos de Uso e Responsabilidade
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-[var(--brand)] transition-colors">
                  Política de Privacidade (LGPD)
                </Link>
              </li>
              <li>
                <Link href="/seguranca" className="hover:text-[var(--brand)] transition-colors">
                  Declaração de Segurança (RLS)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legislação & Conformidade */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink)] font-mono">
              Bases Normativas
            </h4>
            <ul className="space-y-2 text-xs font-mono text-[var(--ink-2)]">
              <li>Lei 14.133/2021 (Art. 62 a 70)</li>
              <li>Lei 13.709/2018 (LGPD)</li>
              <li>Decreto Federal 10.024/2019</li>
              <li>Jurisprudência Vinculante TCU</li>
            </ul>
          </div>

          {/* Col 4: Contato & DPO */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink)] font-mono">
              Encarregado e Contato
            </h4>
            <p className="text-xs text-[var(--ink-2)]">
              Canal para exercício de direitos de titular e atendimento corporativo:
            </p>
            <div className="font-mono text-xs text-[var(--brand)] space-y-1">
              <div>privacidade@editalflash.com.br</div>
              <div>dpo@editalflash.com.br</div>
            </div>
          </div>
        </div>

        {/* Disclaimer Persistente Obrigatório */}
        <div className="p-3.5 rounded-md border border-[var(--line)] bg-[var(--bg)] text-center text-xs text-[var(--ink-2)] font-mono leading-relaxed space-y-1">
          <div>
            <strong>Aviso Institucional:</strong> O EditalFlash é uma ferramenta de suporte técnico-operacional à decisão. A responsabilidade jurídica pela análise, envio de propostas e participação nos certames permanece exclusivamente com a empresa licitante.
          </div>
          <div className="text-[11px] text-[var(--ink-3)]">
            51.926.034 RENAN OSCAR ARAUJO CRUZ · CNPJ: 51.926.034/0001-42 · AV SANTA BERNADETHE, 310, LINDOIA, CURITIBA - PR, CEP 81.010-200 · contatoeditalflash@gmail.com
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--ink-2)] font-mono">
          <p>© 2026 EditalFlash. Todos os direitos reservados. Versão 1.1.0.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--bg)] hover:bg-[var(--line)]/50 text-[var(--ink)] transition-colors border border-[var(--line)]"
          >
            <span>Voltar ao topo</span>
            <BrandIcon name="seta" size="s16" accentCobalt={false} className="-rotate-90" />
          </button>
        </div>
      </div>
    </footer>
  );
};
