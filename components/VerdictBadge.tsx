import React from "react";

export type VerdictType = "PASSA" | "RESSALVA" | "ELIMINATORIA" | "REVISAO_HUMANA";

interface VerdictBadgeProps {
  status: VerdictType | "PASSA_COM_RESSALVA" | "REVISAO_HUMANA_NECESSARIA" | "ELIMINADO";
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
      : status === "ELIMINADO"
      ? "ELIMINATORIA"
      : (status as VerdictType);

  // Tokens Oficiais:
  // Passa: #1F9D6B / fundo #DDF3E9 / texto #0B6B49
  // Ressalva: #E3A008 / fundo #FBEFC9 / texto #6F4B00
  // Eliminado: #D93A35 / fundo #FBE0DE / texto #A3201C
  // Revisão humana: #6D5BE0 / fundo #E6E3FA / texto #4B3FB0
  const config = {
    PASSA: {
      defaultLabel: "PASSA",
      style: {
        backgroundColor: "#DDF3E9",
        color: "#0B6B49",
        borderColor: "#B7E6D0",
      },
      icon: (
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0" fill="#1F9D6B" aria-hidden="true">
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
      style: {
        backgroundColor: "#FBEFC9",
        color: "#6F4B00",
        borderColor: "#F6E29B",
      },
      icon: (
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0" fill="#E3A008" aria-hidden="true">
          <path d="M8 1.2l7 12.6H1z" />
          <path d="M8 5.8v3.6M8 11v1.2" stroke="#ffffff" strokeWidth="1.7" />
        </svg>
      ),
    },
    ELIMINATORIA: {
      defaultLabel: "ELIMINADO",
      style: {
        backgroundColor: "#FBE0DE",
        color: "#A3201C",
        borderColor: "#F7BFBD",
      },
      icon: (
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0" fill="#D93A35" aria-hidden="true">
          <rect x="1.5" y="1.5" width="13" height="13" rx="2" />
          <path d="M5.3 5.3l5.4 5.4M10.7 5.3l-5.4 5.4" stroke="#ffffff" strokeWidth="1.8" />
        </svg>
      ),
    },
    REVISAO_HUMANA: {
      defaultLabel: "REVISÃO HUMANA",
      style: {
        backgroundColor: "#E6E3FA",
        color: "#4B3FB0",
        borderColor: "#D1CCF5",
      },
      icon: (
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0" fill="#6D5BE0" aria-hidden="true">
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
        style={config.style}
        className={`inline-flex items-center font-bricolage uppercase tracking-wider font-bold rounded border shadow-2xs ${sizeClasses}`}
      >
        {config.icon}
        <span>{displayLabel}</span>
      </span>

      {showExplanation && explanation && (
        <span className="text-xs text-[#47526A] font-sans">
          {explanation}
          {legalBase && <strong className="font-mono text-[#0E1626] ml-1">({legalBase})</strong>}
        </span>
      )}
    </div>
  );
};
