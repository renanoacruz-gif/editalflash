import * as React from "react";
import clsx from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2740F0] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg cursor-pointer";

    const variants = {
      primary: "bg-[#2740F0] text-white hover:bg-[#1E34D9] active:bg-[#2740F0] shadow-xs",
      secondary: "bg-[#F3F5F9] text-[#0E1626] hover:bg-[#E5E9F2] border border-[#D6DCE8]",
      outline: "bg-white text-[#0E1626] border border-[#D6DCE8] hover:bg-[#F3F5F9]",
      ghost: "bg-transparent text-[#47526A] hover:text-[#0E1626] hover:bg-[#F3F5F9]",
      danger: "bg-[#FBE0DE] text-[#A3201C] border border-[#F7BFBD] hover:bg-[#F8D2D0]",
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
