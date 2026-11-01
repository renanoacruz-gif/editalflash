import * as React from "react";
import clsx from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 disabled:opacity-50 disabled:pointer-events-none rounded-lg active:scale-[0.98]";

    const variants = {
      primary: "bg-[#1E3A8A] text-white hover:bg-[#1e40af] shadow-sm",
      secondary: "bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0] border border-[#E2E8F0]",
      outline: "bg-transparent text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC]",
      ghost: "bg-transparent text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]",
      danger: "bg-[rgba(239,68,68,0.1)] text-[#DC2626] border border-[rgba(239,68,68,0.2)] hover:bg-[rgba(239,68,68,0.18)]",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-5 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <button ref={ref} className={clsx(base, variants[variant], sizes[size], className)} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
