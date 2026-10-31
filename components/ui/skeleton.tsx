import * as React from "react";
import clsx from "clsx";

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      className={clsx("animate-pulse rounded bg-[#162a39]/60", className)}
      {...props}
    />
  );
};
