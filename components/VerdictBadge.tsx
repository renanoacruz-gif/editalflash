import React from "react";

export type VerdictType = "PASSA" | "RESSALVA" | "ELIMINATORIA" | "REVISAO_HUMANA";

interface VerdictBadgeProps {
  status: VerdictType | "PASSA_COM_RESSALVA" | "REVISAO_HUMANA_NECESSARIA";
  size?: "sm" | "md" | "lg";
  label?: string;
  showExplanation?: boolean;
  explanation?: string;
  legalBase?: string;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({
  status,
  size = "md",
  label,
  showExplanation = false,
  explanation,
  legalBase,
}) => {
  const normalized: VerdictType =
    status === "PASSA_COM_RESSALVA"
      ? "RESSALVA"
      : status === "REVISAO_HUMANA_NECESSARIA"
      ? "REVISAO_HUMANA"
      : (status as VerdictType);

  const config = {
    PASSA: {
      defaultLabel: "PASSA",
      bgClass: "bg-[var(--ok-bg)] text-[var(--ok-fg)] border border-[var(--ok)]/30",
      shape: "circle",
      icon: (
        <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 fill-current" aria-hidden="true">
          <circle cx="8" cy="8" r="7" />
          <path
            d="M4.6 8.2l2.4 2.4 4.4-4.8"
            fill="none"
            stroke="var(--surface, #fff)"
            strokeWidth="1.8"
            strokeLinecap="square"
          />
        </svg>
      ),
    },
    RESSALVA: {
      defaultLabel: "RESSALVA",
      bgClass: "bg-[var(--warn-bg)] text-[var(--warn-fg)] border border-[var(--warn)]/30",
      shape: "triangle",
      icon: (
        <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 fill-current" aria-hidden="true">
          <path d="M8 1.2l7 12.6H1z" />
          <path d="M8 5.8v3.6M8 11v1.2" stroke="var(--warn-bg, #fff)" strokeWidth="1.7" />
        </svg>
      ),
    },
    ELIMINATORIA: {
      defaultLabel: "ELIMINATÓRIA",
      bgClass: "bg-[var(--bad-bg)] text-[var(--bad-fg)] border border-[var(--bad)]/30",
      shape: "square",
      icon: (
        <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 fill-current" aria-hidden="true">
          <rect x="1.5" y="1.5" width="13" height="13" rx="1.5" />
          <path d="M5.3 5.3l5.4 5.4M10.7 5.3l-5.4 5.4" stroke="var(--bad-bg, #fff)" strokeWidth="1.8" />
        </svg>
      ),
    },
    REVISAO_HUMANA: {
      defaultLabel: "REVISÃO HUMANA NECESSÁRIA",
      bgClass: "bg-[var(--rev-bg)] text-[var(--rev-fg)] border border-[var(--rev)]/30",
      shape: "diamond",
      icon: (
        <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0 fill-current" aria-hidden="true">
          <path d="M8 .9l7.1 7.1L8 15.1.9 8z" />
          <path
            d="M6.3 6.4a1.8 1.8 0 113 1.3c-.7.5-1.2.8-1.2 1.6M8.1 11.2v.2"
            fill="none"
            stroke="var(--rev-bg, #fff)"
            strokeWidth="1.6"
          />
        </svg>
      ),
    },
  }[normalized];

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 gap-1.5",
    md: "text-xs px-2.5 py-1 gap-2",
    lg: "text-sm px-3.5 py-1.5 gap-2.5 font-bold",
  }[size];

  const displayLabel = label || config.defaultLabel;

  return (
    <div className="inline-flex items-center flex-wrap gap-2">
      <span
        className={`inline-flex items-center font-mono uppercase tracking-wider font-semibold rounded-md shadow-sm ${config.bgClass} ${sizeClasses}`}
      >
        {config.icon}
        <span>{displayLabel}</span>
      </span>

      {showExplanation && explanation && (
        <span className="text-xs text-[var(--ink-2)] font-sans">
          {explanation}
          {legalBase && <strong className="font-mono text-[var(--ink)] ml-1">({legalBase})</strong>}
        </span>
      )}
    </div>
  );
};
