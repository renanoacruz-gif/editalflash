import * as React from "react";
import clsx from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "pass" | "warning" | "danger" | "neutral";
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = "neutral", children, ...props }) => {
  const variants = {
    pass: "bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]",
    warning: "bg-[#FEFCE8] text-[#854D0E] border border-[#FEF08A]",
    danger: "bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]",
    neutral: "bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1]",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium font-sans",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
