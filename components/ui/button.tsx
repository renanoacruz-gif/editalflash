import * as React from "react";
import clsx from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg";

    const variants = {
      primary: "bg-[#1E3A8A] text-white hover:bg-[#1E40AF] active:bg-[#1E3A8A] shadow-xs",
      secondary: "bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0] border border-[#E2E8F0]",
      outline: "bg-white text-[#0F172A] border border-[#CBD5E1] hover:bg-[#F8FAFC]",
      ghost: "bg-transparent text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]",
      danger: "bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA] hover:bg-[#FEE2E2]",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
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
