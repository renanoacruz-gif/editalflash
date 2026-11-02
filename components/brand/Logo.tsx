import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "cor" | "fundo-escuro" | "mono-tinta" | "mono-branco";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  showText?: boolean;
}

export function Logo({
  variant = "cor",
  size = "md",
  href = "/",
  className = "",
  showText = true,
}: LogoProps) {
  // Escala oficial de proporções:
  // Lockup: "Edital" peso 500 + "Flash" peso 800 em Bricolage, tracking -3.5%
  // Altura do símbolo = 1.5x o corpo do logotipo
  // Espaço entre símbolo e logotipo = 0.3x o corpo
  // Largura mínima do logo horizontal = 96px
  
  const sizeMap = {
    sm: { symbol: 24, fontSize: "text-base", gap: "gap-1.5", minW: "min-w-[96px]" },
    md: { symbol: 30, fontSize: "text-xl", gap: "gap-2", minW: "min-w-[120px]" },
    lg: { symbol: 38, fontSize: "text-2xl", gap: "gap-2.5", minW: "min-w-[150px]" },
  };

  const currentSize = sizeMap[size];

  const symbolSrc =
    variant === "fundo-escuro"
      ? "/brand/ef-simbolo-fundo-escuro.svg"
      : variant === "mono-branco"
      ? "/brand/ef-simbolo-mono-branco.svg"
      : variant === "mono-tinta"
      ? "/brand/ef-simbolo-mono-tinta.svg"
      : "/brand/ef-simbolo-cor.svg";

  const textColorClass =
    variant === "fundo-escuro" || variant === "mono-branco"
      ? "text-[#FFFFFF]"
      : "text-[#0E1626]";

  const content = (
    <div
      className={`inline-flex items-center select-none ${currentSize.gap} ${
        showText ? currentSize.minW : ""
      } ${className}`}
    >
      <Image
        src={symbolSrc}
        alt="EditalFlash Símbolo"
        width={currentSize.symbol}
        height={currentSize.symbol}
        className="shrink-0"
        priority
      />
      {showText && (
        <span
          className={`font-bricolage tracking-[-0.035em] whitespace-nowrap leading-none ${currentSize.fontSize} ${textColorClass}`}
        >
          <span className="font-medium">Edital</span>
          <span className="font-extrabold">Flash</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;
