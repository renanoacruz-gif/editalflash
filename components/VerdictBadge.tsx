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
      bgClass: "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40",
      shape: "circle",
      icon: (
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0 fill-emerald-600 dark:fill-emerald-400" aria-hidden="true">
          <circle cx="8" cy="8" r="7" />
          <path
            d="M4.6 8.2l2.4 2.4 4.4-4.8"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinecap="square"
          />
        </svg>
      ),
    },
    RESSALVA: {
      defaultLabel: "RESSALVA",
      bgClass: "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40",
      shape: "triangle",
      icon: (
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0 fill-amber-600 dark:fill-amber-400" aria-hidden="true">
          <path d="M8 1.2l7 12.6H1z" />
          <path d="M8 5.8v3.6M8 11v1.2" stroke="#ffffff" strokeWidth="1.7" />
        </svg>
      ),
    },
    ELIMINATORIA: {
      defaultLabel: "ELIMINATÓRIA",
      bgClass: "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40",
      shape: "square",
      icon: (
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0 fill-rose-600 dark:fill-rose-400" aria-hidden="true">
          <rect x="1.5" y="1.5" width="13" height="13" rx="2" />
          <path d="M5.3 5.3l5.4 5.4M10.7 5.3l-5.4 5.4" stroke="#ffffff" strokeWidth="1.8" />
        </svg>
      ),
    },
    REVISAO_HUMANA: {
      defaultLabel: "REVISÃO HUMANA NECESSÁRIA",
      bgClass: "bg-indigo-50 text-indigo-800 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40",
      shape: "diamond",
      icon: (
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0 fill-indigo-600 dark:fill-indigo-400" aria-hidden="true">
          <path d="M8 .9l7.1 7.1L8 15.1.9 8z" />
          <path
            d="M6.3 6.4a1.8 1.8 0 113 1.3c-.7.5-1.2.8-1.2 1.6M8.1 11.2v.2"
            fill="none"
            stroke="#ffffff"
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
