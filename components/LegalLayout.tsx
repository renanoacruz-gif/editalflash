import React from "react";
import Link from "next/link";
import { BrandIcon } from "@/components/brand-icons";

interface LegalLayoutProps {
  children: React.ReactNode;
  activeDoc: "termos" | "privacidade" | "seguranca";
  title: string;
  version?: string;
  lastUpdated?: string;
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({
  children,
  activeDoc,
  title,
  version = "1.1.0",
  lastUpdated = "28 de Outubro de 2026",
}) => {
  const docs = [
    { id: "termos", label: "Termos de Uso", href: "/termos" },
    { id: "privacidade", label: "Privacidade (LGPD)", href: "/privacidade" },
    { id: "seguranca", label: "Segurança da Informação", href: "/seguranca" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-[var(--line)] bg-[var(--surface)] px-4 sm:px-8 py-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandIcon name="mark" size={24} />
            <span className="text-lg font-bold font-display tracking-tight text-[var(--ink)]">
              Edital<span className="font-extrabold text-[var(--brand)]">Flash</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-semibold px-3 py-1.5 rounded-md border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--ink-2)] transition-colors"
            >
              Voltar ao Painel
            </Link>
          </div>
        </div>
      </header>

      {/* Main Document Frame */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-[var(--line)] overflow-x-auto pb-px">
          {docs.map((doc) => {
            const isActive = activeDoc === doc.id;
            return (
              <Link
                key={doc.id}
                href={doc.href}
                className={`px-4 py-2 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? "border-[var(--brand)] text-[var(--brand)] font-bold"
                    : "border-transparent text-[var(--ink-2)] hover:text-[var(--ink)]"
                }`}
              >
                {doc.label}
              </Link>
            );
          })}
        </div>

        {/* Document Header */}
        <div className="space-y-3 pb-6 border-b border-[var(--line)]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-[var(--brand-tint)] text-[var(--ink)] border border-[var(--brand)]/20">
              Versão {version} · Parecer de Habilitação
            </span>
            <span className="text-xs text-[var(--ink-2)] font-mono">
              Vigência: {lastUpdated}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--ink)] tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-[var(--ink-2)] leading-relaxed">
            Documentação jurídica oficial vinculante alinhada à Lei Federal nº 14.133/2021 e à Lei Geral de Proteção de Dados (Lei 13.709/2018).
          </p>
        </div>

        {/* Document Body */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-lg p-6 sm:p-10 shadow-sm space-y-8 text-[15px] leading-relaxed text-[var(--ink-2)] font-body">
          {children}
        </div>

        {/* Disclaimer Persistente */}
        <div className="p-4 rounded-md border border-[var(--line)] bg-[var(--surface)] text-center text-xs text-[var(--ink-2)] font-mono">
          EditalFlash é ferramenta de suporte à decisão. A responsabilidade jurídica pela análise e envio de propostas permanece exclusivamente com a empresa licitante.
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--line)] bg-[var(--surface)] py-6 px-4 text-center text-xs text-[var(--ink-2)] font-mono space-y-1">
        <div>
          EditalFlash · 51.926.034 RENAN OSCAR ARAUJO CRUZ · CNPJ: 51.926.034/0001-42
        </div>
        <div>
          AV SANTA BERNADETHE, 310, LINDOIA, CURITIBA - PR, CEP 81.010-200 · Contato: contatoeditalflash@gmail.com
        </div>
      </footer>
    </div>
  );
};
