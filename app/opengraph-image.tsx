import { ImageResponse } from "next/og";

export const alt = "EditalFlash | Auditoria Preventiva de Editais e Habilitação";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0B1B2B",
          padding: "70px 80px",
          position: "relative",
        }}
      >
        {/* Brilho sutil no fundo */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-150px",
            width: "500px",
            height: "500px",
            borderRadius: "999px",
            backgroundColor: "#2F5BFF",
            opacity: 0.18,
          }}
        />

        {/* Topo: Logo & Badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#2F5BFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              EF
            </div>
            <div style={{ display: "flex", fontSize: "30px", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.5px" }}>
              EditalFlash
            </div>
          </div>
          <div
            style={{
              display: "flex",
              padding: "8px 20px",
              borderRadius: "999px",
              backgroundColor: "rgba(47, 91, 255, 0.15)",
              border: "1px solid rgba(138, 162, 255, 0.35)",
              color: "#8AA2FF",
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "0.5px",
            }}
          >
            Lei 14.133/2021 · Habilitação
          </div>
        </div>

        {/* Centro: Título e Descrição */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "980px", position: "relative" }}>
          <div
            style={{
              display: "flex",
              fontSize: "52px",
              fontWeight: "800",
              color: "#FFFFFF",
              lineHeight: 1.15,
              letterSpacing: "-1px",
            }}
          >
            Descubra antes da sessão se sua empresa pode ser inabilitada.
          </div>
          <div style={{ display: "flex", fontSize: "22px", color: "#E6EAF2", lineHeight: 1.5, opacity: 0.9 }}>
            Auditoria preventiva do edital com prova de página e linha para cada exigência e parecer pronto em PDF.
          </div>
        </div>

        {/* Rodapé: Pilares e Domínio Oficial */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(217, 222, 232, 0.2)",
            paddingTop: "24px",
            width: "100%",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "28px", fontSize: "16px", color: "#E6EAF2" }}>
            <span style={{ display: "flex", color: "#12A150", fontWeight: "bold" }}>● Parecer Técnico Pronto</span>
            <span style={{ display: "flex" }}>● Balanço Patrimonial &amp; PL</span>
            <span style={{ display: "flex" }}>● Acervo (Súmula 263 TCU)</span>
          </div>
          <div style={{ display: "flex", fontSize: "16px", color: "#8AA2FF", fontWeight: "600" }}>
            editalflash.com.br
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
