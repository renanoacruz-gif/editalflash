import * as React from "react";
import clsx from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "pass" | "warning" | "danger" | "neutral";
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = "neutral", children, ...props }) => {
  const variants = {
    pass: "bg-[#DDF3E9] text-[#0B6B49] border border-[#B7E6D0]",
    warning: "bg-[#FBEFC9] text-[#6F4B00] border border-[#F6E29B]",
    danger: "bg-[#FBE0DE] text-[#A3201C] border border-[#F7BFBD]",
    neutral: "bg-[#F3F5F9] text-[#0E1626] border border-[#D6DCE8]",
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
