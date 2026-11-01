import * as React from "react";
import clsx from "clsx";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  indicatorColor?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  indicatorColor = "bg-[#1E3A8A]",
  className,
  ...props
}) => {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={clsx("relative h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]", className)}
      {...props}
    >
      <div
        className={clsx("h-full transition-all duration-300 rounded-full", indicatorColor)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};
