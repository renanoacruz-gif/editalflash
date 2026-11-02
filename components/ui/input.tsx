import * as React from "react";
import clsx from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={clsx(
        "flex h-10 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#0F172A] placeholder:text-[#64748B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] focus-visible:border-[#1E3A8A] transition-colors disabled:cursor-not-allowed disabled:opacity-50 shadow-xs",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
