import * as React from "react";
import clsx from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#253745] disabled:opacity-50 disabled:pointer-events-none rounded-md";

    const variants = {
      primary: "bg-[#11212D] text-[#CCD0CF] hover:bg-[#253745] border border-[#253745]",
      secondary: "bg-[#162a39] text-[#CCD0CF] hover:bg-[#253745] border border-[#253745]",
      outline: "bg-transparent text-[#CCD0CF] border border-[#253745] hover:bg-[#11212D]",
      ghost: "bg-transparent text-[#9BA8AB] hover:text-[#CCD0CF] hover:bg-[#11212D]",
      danger: "bg-[rgba(239,68,68,0.12)] text-[#EF4444] border border-[rgba(239,68,68,0.25)] hover:bg-[rgba(239,68,68,0.2)]",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-9 px-4 text-sm",
      lg: "h-11 px-6 text-base",
    };

    return (
      <button ref={ref} className={clsx(base, variants[variant], sizes[size], className)} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
