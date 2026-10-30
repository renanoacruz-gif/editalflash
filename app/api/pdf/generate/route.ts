import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { ParecerExecutivoPDF } from "@/components/ParecerExecutivoPDF";
import { ChecklistExportPDF } from "@/components/ChecklistExportPDF";

// Simple in-memory cache with 5-minute TTL to reduce repetitive rendering overhead
const pdfCache = new Map<string, { buffer: Buffer; expiresAt: number }>();

function generateHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(36);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type = "parecer", data, companyName = "EMPRESA LICITANTE LTDA", companyCnpj, docs } = body;

    const cacheKey = `${type}_${generateHash(JSON.stringify(body))}`;
    const cached = pdfCache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return new NextResponse(cached.buffer as any, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${type === "checklist" ? "Checklist_Contabil" : "Parecer_Habilitacao"}.pdf"`,
          "X-PDF-Cache": "HIT",
        },
      });
    }

    let pdfElement: any;

    if (type === "checklist") {
      if (!Array.isArray(docs)) {
        return NextResponse.json({ error: "Campo 'docs' é obrigatório para exportação de checklist." }, { status: 400 });
      }
      pdfElement = React.createElement(ChecklistExportPDF, {
        companyName,
        cnpj: companyCnpj,
        docs,
      });
    } else {
      if (!data) {
        return NextResponse.json({ error: "Dados da análise são obrigatórios para emissão do parecer." }, { status: 400 });
      }
      pdfElement = React.createElement(ParecerExecutivoPDF, {
        data,
        companyName,
        companyCnpj,
      });
    }

    // Set 15-second execution timeout guard
    const renderPromise = renderToBuffer(pdfElement as React.ReactElement<any>);
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Tempo limite de geração de PDF excedido (15s).")), 15000);
    });

    const buffer = await Promise.race([renderPromise, timeoutPromise]);

    // Store in cache for 5 minutes
    pdfCache.set(cacheKey, {
      buffer,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    // Clean old entries
    if (pdfCache.size > 50) {
      const now = Date.now();
      for (const [key, value] of pdfCache.entries()) {
        if (value.expiresAt <= now) {
          pdfCache.delete(key);
        }
      }
    }

    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${type === "checklist" ? "Checklist_Contabil" : "Parecer_Habilitacao"}.pdf"`,
        "X-PDF-Cache": "MISS",
      },
    });
  } catch (error: any) {
    console.error("[API PDF GENERATE ERROR]:", error);
    return NextResponse.json(
      {
        error: "Falha ao compilar parecer executivo nativo em PDF.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
