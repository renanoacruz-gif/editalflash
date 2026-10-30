import React from "react";

interface CitationBlockProps {
  page?: number | string;
  line?: number | string;
  item?: string;
  excerpt: string;
  className?: string;
  highlightWords?: string[];
}

export const CitationBlock: React.FC<CitationBlockProps> = ({
  page,
  line,
  item,
  excerpt,
  className = "",
}) => {
  return (
    <div
      className={`rounded-md border border-[var(--line)] bg-[var(--bg)] p-3.5 space-y-2.5 font-mono text-xs ${className}`}
    >
      {/* Location tags */}
      <div className="flex items-center gap-2 flex-wrap text-[11px] text-[var(--ink-2)]">
        {page && (
          <span className="bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] px-2 py-0.5 rounded font-medium">
            Pág. {page}
          </span>
        )}
        {line && (
          <span className="bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] px-2 py-0.5 rounded font-medium">
            Linha {line}
          </span>
        )}
        {item && (
          <span className="bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] px-2 py-0.5 rounded font-medium">
            Item {item}
          </span>
        )}
        <span className="text-[10px] tracking-wider uppercase text-[var(--ink-2)] ml-auto font-bold text-[var(--brand)]">
          PROVA NO EDITAL
        </span>
      </div>

      {/* Excerpt with cobalt marker highlight */}
      <div className="text-[13px] leading-relaxed text-[var(--ink)] bg-[var(--surface)] p-2.5 rounded border border-[var(--line)]/60">
        <mark className="bg-[var(--brand-tint)] text-[var(--ink)] px-1 py-0.5 rounded-sm shadow-[inset_0_-2px_0_var(--brand)] font-mono">
          &ldquo;{excerpt.replace(/^["“”]|["“”]$/g, "")}&rdquo;
        </mark>
      </div>
    </div>
  );
};
