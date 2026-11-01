import * as React from "react";
import clsx from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "pass" | "warning" | "danger" | "neutral";
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = "neutral", children, ...props }) => {
  const variants = {
    pass: "bg-[rgba(16,185,129,0.1)] text-[#059669] border border-[rgba(16,185,129,0.2)]",
    warning: "bg-[rgba(245,158,11,0.1)] text-[#D97706] border border-[rgba(245,158,11,0.2)]",
    danger: "bg-[rgba(239,68,68,0.1)] text-[#DC2626] border border-[rgba(239,68,68,0.2)]",
    neutral: "bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
