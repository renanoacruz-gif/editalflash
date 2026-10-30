import { ImageResponse } from "next/og";

export const alt = "EditalFlash | Auditoria Preventiva de Habilitação";
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
          backgroundColor: "#0A111F",
          padding: "60px 80px",
        }}
      >
        {/* Topo: Logo & Badge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#121B2D",
                border: "1px solid #26324A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8F9CFF",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              EF
            </div>
            <div style={{ display: "flex", fontSize: "28px", fontWeight: "800", color: "#FFFFFF" }}>
              EditalFlash
            </div>
          </div>
          <div
            style={{
              display: "flex",
              padding: "8px 20px",
              borderRadius: "999px",
              backgroundColor: "#1B2347",
              border: "1px solid rgba(74, 95, 255, 0.4)",
              color: "#8F9CFF",
              fontSize: "14px",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Lei 14.133/2021 • Art. 62
          </div>
        </div>

        {/* Centro: Título e Descrição */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "900px" }}>
          <div
            style={{
              display: "flex",
              fontSize: "54px",
              fontWeight: "900",
              color: "#FFFFFF",
              lineHeight: 1.15,
            }}
          >
            Auditoria Preventiva de Habilitação em Licitações
          </div>
          <div style={{ display: "flex", fontSize: "22px", color: "#A3AEC4", lineHeight: 1.5 }}>
            Cruzamos seu cofre documental com o edital e emitimos o veredito determinístico (Passa ou Eliminatória) com prova de página e linha.
          </div>
        </div>

        {/* Rodapé: Veredito e Tríade */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #26324A",
            paddingTop: "24px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "24px", fontSize: "16px", color: "#A3AEC4" }}>
            <span style={{ display: "flex", color: "#10B981", fontWeight: "bold" }}>● Semáforo Tripartite</span>
            <span style={{ display: "flex" }}>● Tríade de Liquidez</span>
            <span style={{ display: "flex" }}>● Súmula 263 TCU</span>
          </div>
          <div style={{ display: "flex", fontSize: "15px", color: "#64748B", fontWeight: "500" }}>
            51.926.034 RENAN OSCAR ARAUJO CRUZ
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
