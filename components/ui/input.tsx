import * as React from "react";
import clsx from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={clsx(
        "flex h-10 w-full rounded-md border border-[#253745] bg-[#06141B] px-3 py-2 text-sm text-[#CCD0CF] placeholder:text-[#4A5C6A] focus:outline-none focus:ring-1 focus:ring-[#9BA8AB] focus:border-[#9BA8AB] transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
