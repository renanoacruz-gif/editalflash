import React from "react";

export interface BrandIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  strokeWidth?: number;
}

/**
 * EditalFlash Brand Icon
 * Abstract combination of FileText + ShieldCheck merged into a single geometric legal-tech mark.
 * Clean lines, no gradients, monochrome (adapts to dark/light mode via currentColor).
 */
export const BrandIcon: React.FC<BrandIconProps> = ({
  size = 24,
  className = "",
  strokeWidth = 1.5,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Document boundary with folded corner */}
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />

      {/* Embedded Legal Shield Crest & Verification Check */}
      <path d="M12 11c1.8 0 3.2 0.6 3.5 1.5 0 2-1.5 4-3.5 4.8-2-0.8-3.5-2.8-3.5-4.8 0.3-0.9 1.7-1.5 3.5-1.5z" />
      <polyline points="10.5 13.5 11.5 14.5 13.5 12.5" />
    </svg>
  );
};

export const brandIconSvgString = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 11c1.8 0 3.2 0.6 3.5 1.5 0 2-1.5 4-3.5 4.8-2-0.8-3.5-2.8-3.5-4.8 0.3-0.9 1.7-1.5 3.5-1.5z"/><polyline points="10.5 13.5 11.5 14.5 13.5 12.5"/></svg>`;

export default BrandIcon;