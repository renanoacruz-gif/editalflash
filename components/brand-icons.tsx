import React from "react";

export type IconSize = "s16" | "s20" | "s24" | "s32" | "s48";

interface BrandIconProps extends React.SVGProps<SVGSVGElement> {
  name:
    | "mark"
    | "edital"
    | "auditoria"
    | "cofre"
    | "calendario"
    | "citacao"
    | "semaforo"
    | "upload"
    | "download"
    | "busca"
    | "minuta"
    | "alerta"
    | "relogio"
    | "balanco"
    | "atestado"
    | "certidao"
    | "registro"
    | "garantia"
    | "ocr"
    | "humano"
    | "licitantes"
    | "assinatura"
    | "mrr"
    | "config"
    | "sino"
    | "filtro"
    | "check"
    | "fechar"
    | "seta"
    | "mais"
    | "fontes"
    | "conflito"
    | "acuracia"
    | "obras"
    | "compras"
    | "servicos"
    | "saude"
    | "tic"
    | "geral";
  size?: IconSize | number;
  accentCobalt?: boolean;
}

export const BrandIcon: React.FC<BrandIconProps> = ({
  name,
  size = "s24",
  className = "",
  accentCobalt = true,
  ...props
}) => {
  // Map size tokens to inline pixel dimension if no explicit width/height is passed
  const sizeMap: Record<IconSize, number> = {
    s16: 16,
    s20: 20,
    s24: 24,
    s32: 32,
    s48: 48,
  };

  const pixelDimension =
    typeof size === "number"
      ? size
      : typeof size === "string" && size in sizeMap
      ? sizeMap[size as IconSize]
      : 24;

  if (name === "mark") {
    return (
      <svg
        width={pixelDimension}
        height={pixelDimension}
        viewBox="0 0 48 48"
        className={`brand-mark shrink-0 ${className}`}
        aria-hidden="true"
        {...props}
      >
        <path
          d="M11 4h20l10 10v30H11z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinejoin="miter"
        />
        <path d="M31 4v10h10" fill="none" stroke="currentColor" strokeWidth="3" />
        <rect x="17" y="20" width="14" height="3" fill="currentColor" opacity=".4" />
        <rect x="17" y="38" width="16" height="3" fill="currentColor" opacity=".4" />
        <polygon
          points="15,27 45,27 41,34 11,34"
          fill="var(--brand-solid, #2740F0)"
        />
      </svg>
    );
  }

  return (
    <svg
      width={pixelDimension}
      height={pixelDimension}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={`brand-icon shrink-0 ${className}`}
      aria-hidden="true"
      {...props}
    >
      {renderIconPaths(name, accentCobalt)}
    </svg>
  );
};

function renderIconPaths(name: BrandIconProps["name"], accent: boolean) {
  const cobaltStyle = accent
    ? { stroke: "var(--brand-solid, #2740F0)" }
    : undefined;

  switch (name) {
    case "edital":
      return (
        <>
          <path d="M6 3h9l4 4v14H6z" />
          <path d="M15 3v4h4" />
          <path d="M9 11h6" />
          <path d="M9 15.5h8" style={cobaltStyle} />
        </>
      );

    case "auditoria":
      return (
        <>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M8 10.5l2 2 3.5-4" />
          <path d="M15.5 15.5L21 21" style={cobaltStyle} />
        </>
      );

    case "cofre":
      return (
        <>
          <path d="M3 5h18v14H3z" />
          <circle cx="12" cy="12" r="3.5" />
          <path d="M6 19v2M18 19v2" />
          <path d="M12 12l2-2" style={cobaltStyle} />
        </>
      );

    case "calendario":
      return (
        <>
          <path d="M3 5h18v16H3z" />
          <path d="M3 10h18M8 3v4M16 3v4" />
          <path d="M7 15h5" style={cobaltStyle} />
        </>
      );

    case "citacao":
      return (
        <>
          <path d="M4 6h16M4 18h10" />
          <path d="M3 10.5h18v3H3z" style={cobaltStyle} />
        </>
      );

    case "semaforo":
      return (
        <>
          <path d="M8 2h8v20H8z" />
          <circle cx="12" cy="7" r="1.6" />
          <circle cx="12" cy="17" r="1.6" />
          <circle cx="12" cy="12" r="1.6" style={cobaltStyle} />
        </>
      );

    case "upload":
      return (
        <>
          <path d="M4 16v4h16v-4" />
          <path d="M12 15V4M7.5 8.5L12 4l4.5 4.5" style={cobaltStyle} />
        </>
      );

    case "download":
      return (
        <>
          <path d="M4 16v4h16v-4" />
          <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5" style={cobaltStyle} />
        </>
      );

    case "busca":
      return (
        <>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5L21 21" style={cobaltStyle} />
        </>
      );

    case "minuta":
      return (
        <>
          <path d="M6 3h9l4 4v4" />
          <path d="M6 3v18h6" />
          <path d="M15 3v4h4" />
          <path d="M9 11h6M9 15h3" />
          <path d="M14 20l6-6 2 2-6 6h-2z" style={cobaltStyle} />
        </>
      );

    case "alerta":
      return (
        <>
          <path d="M12 3l10 18H2z" />
          <path d="M12 10v5" />
          <path d="M12 18v1" style={cobaltStyle} />
        </>
      );

    case "relogio":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.5 2" style={cobaltStyle} />
        </>
      );

    case "balanco":
      return (
        <>
          <path d="M3 21h18" />
          <path d="M5 21v-6h4v6M15 21v-9h4v9" />
          <path d="M10 21V7h4v14" style={cobaltStyle} />
        </>
      );

    case "atestado":
      return (
        <>
          <circle cx="12" cy="9" r="6" />
          <path d="M8.5 14l-2 7 5.5-3 5.5 3-2-7" />
          <path d="M9.5 9l2 2 3-3.5" style={cobaltStyle} />
        </>
      );

    case "certidao":
      return (
        <>
          <path d="M5 3h10l4 4v14H5z" />
          <path d="M15 3v4h4" />
          <path d="M8 8h4" />
          <circle cx="12" cy="15" r="3" style={cobaltStyle} />
        </>
      );

    case "registro":
      return (
        <>
          <path d="M3 6h18v12H3z" />
          <circle cx="8.5" cy="11" r="2" />
          <path d="M5.5 16c.5-2.5 5.5-2.5 6 0" />
          <path d="M14 10h4" />
          <path d="M14 14h4" style={cobaltStyle} />
        </>
      );

    case "garantia":
      return (
        <>
          <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
          <path d="M8.5 12l2.5 2.5 4.5-5" style={cobaltStyle} />
        </>
      );

    case "ocr":
      return (
        <>
          <path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" />
          <path d="M4 12h16" style={cobaltStyle} />
        </>
      );

    case "humano":
      return (
        <>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 21c0-4 3-6 7-6s7 2 7 6" style={cobaltStyle} />
        </>
      );

    case "licitantes":
      return (
        <>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-3.5 2.5-5.5 6-5.5s6 2 6 5.5" />
          <circle cx="17" cy="9" r="2.5" style={cobaltStyle} />
          <path d="M17 14.5c2.5 0 4 1.7 4 4.5" style={cobaltStyle} />
        </>
      );

    case "assinatura":
      return (
        <>
          <path d="M3 6h18v12H3z" />
          <path d="M3 10h18" />
          <path d="M6 15h4" style={cobaltStyle} />
        </>
      );

    case "mrr":
      return (
        <>
          <path d="M3 17l6-6 4 4 7-7" />
          <path d="M15 8h5v5" style={cobaltStyle} />
        </>
      );

    case "config":
      return (
        <>
          <path d="M4 7h16M4 12h16M4 17h16" />
          <path d="M15 5v4M8 10v4M13 15v4" style={cobaltStyle} />
        </>
      );

    case "sino":
      return (
        <>
          <path d="M6 17v-6a6 6 0 0112 0v6l2 2H4z" />
          <path d="M10 21h4" style={cobaltStyle} />
        </>
      );

    case "filtro":
      return <path d="M3 5h18l-7 8v6l-4 2v-8z" />;

    case "check":
      return <path d="M4 12.5l5 5L20 6.5" style={cobaltStyle} />;

    case "fechar":
      return <path d="M5 5l14 14M19 5L5 19" />;

    case "seta":
      return (
        <>
          <path d="M4 12h15" />
          <path d="M13 6l6 6-6 6" style={cobaltStyle} />
        </>
      );

    case "mais":
      return <path d="M12 4v16M4 12h16" />;

    case "fontes":
      return (
        <>
          <path d="M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z" />
          <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
          <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" style={cobaltStyle} />
        </>
      );

    case "conflito":
      return (
        <>
          <path d="M4 8h14M14 4l4 4-4 4" />
          <path d="M20 16H6M10 12l-4 4 4 4" style={cobaltStyle} />
        </>
      );

    case "acuracia":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle
            cx="12"
            cy="12"
            r="1.5"
            style={{
              fill: "var(--brand-solid, #2740F0)",
              stroke: "var(--brand-solid, #2740F0)",
            }}
          />
        </>
      );

    case "obras":
      return (
        <>
          <path d="M3 21h18" />
          <path d="M5 21V11h8v10M13 21v-7h6v7" />
          <path d="M5 11V4h12M17 4v4" style={cobaltStyle} />
        </>
      );

    case "compras":
      return (
        <>
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
          <path d="M4 7.5l8 4.5 8-4.5" />
          <path d="M12 12v9" style={cobaltStyle} />
        </>
      );

    case "servicos":
      return (
        <>
          <path d="M4 12a8 8 0 0114-5.3M20 4v4h-4" />
          <path d="M20 12a8 8 0 01-14 5.3M4 20v-4h4" style={cobaltStyle} />
        </>
      );

    case "saude":
      return (
        <>
          <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />
          <path d="M12 9v6" style={cobaltStyle} />
        </>
      );

    case "tic":
      return (
        <>
          <path d="M7 7h10v10H7z" />
          <path d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4" />
          <path d="M10 10h4v4h-4z" style={cobaltStyle} />
        </>
      );

    case "geral":
      return (
        <>
          <path d="M4 4h7v7H4zM4 13h7v7H4zM13 13h7v7h-7z" />
          <path d="M13 4h7v7h-7z" style={cobaltStyle} />
        </>
      );

    default:
      return <path d="M12 4v16M4 12h16" />;
  }
}
