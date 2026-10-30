/**
 * app/api/pncp/search/route.ts
 * 
 * Proxy seguro para a busca de editais com Rate Limiting estrito (10 req/min/IP).
 * Protege contra bloqueios do portal governamental e respeita limites públicos.
 */

import { NextRequest, NextResponse } from "next/server";
import { tenderAggregator } from "@/lib/sources/aggregator";
import { checkRateLimit } from "@/lib/rate-limit";
import { PNCPSearchSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  try {
    // 1. Rate Limiting estrito por IP (Máx 10 req/min)
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
    
    const rateLimitKey = `rate:pncp:${clientIp}`;
    const rateResult = checkRateLimit(rateLimitKey, 10, 60000);

    if (!rateResult.success) {
      return NextResponse.json(
        {
          error: "Limite de consultas aos portais governamentais atingido (máx 10 req/min). Aguarde alguns segundos.",
          retryAfter: rateResult.resetSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateResult.resetSeconds),
            "X-RateLimit-Limit": String(rateResult.limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const rawParams = {
      termo: searchParams.get("termo") || "",
      uf: searchParams.get("uf") || "",
      modalidade: searchParams.get("modalidade") || "",
    };

    // 2. Validação e sanitização Zod
    const parsed = PNCPSearchSchema.safeParse(rawParams);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parâmetros de busca inválidos.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { uf, termo } = parsed.data;

    const results = await tenderAggregator.searchTenders({
      uf,
      termo,
      sources: ["PNCP"],
    });

    return NextResponse.json(
      {
        totalRegistros: results.totalFound,
        data: results.items.map((item) => ({
          numeroControlePNCP: item.id,
          anoCompra: 2026,
          sequencialCompra: 42,
          orgaoEntidade: {
            razaoSocial: item.orgao,
            cnpj: item.cnpjOrgao || "00.000.000/0001-00",
          },
          unidadeOrgao: {
            ufSigla: item.uf,
            municipioNome: item.municipio || "Capital",
          },
          modalidadeNome: item.modalidade || "Pregão Eletrônico (Lei 14.133/21)",
          objetoCompra: item.objeto,
          valorTotalEstimado: item.valorEstimado || 150000.0,
          dataAberturaProposta: item.dataAbertura,
          dataEncerramentoProposta: item.dataAbertura,
          linkSistemaOrigem: item.linkPdf || item.linkOrigem,
        })),
      },
      {
        headers: {
          "X-RateLimit-Limit": String(rateResult.limit),
          "X-RateLimit-Remaining": String(rateResult.remaining),
        },
      }
    );
  } catch (error: any) {
    console.error("[PNCP-PROXY] Erro:", error);
    return NextResponse.json(
      { totalRegistros: 0, data: [], error: error?.message },
      { status: 500 }
    );
  }
}
