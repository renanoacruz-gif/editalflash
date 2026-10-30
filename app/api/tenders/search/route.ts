/**
 * app/api/tenders/search/route.ts
 * 
 * Endpoint REST Unificado para o Agregador Multi-Fontes de Editais Públicos.
 * Conecta com PNCP, Compras.gov.br, BEC/SP, Licitações-e, Portal da Transparência e DOU.
 */

import { NextRequest, NextResponse } from "next/server";
import { tenderAggregator } from "@/lib/sources/aggregator";
import { SourceType } from "@/lib/sources/types";
import { CircuitBreakerManager } from "@/lib/sources/circuit-breaker";
import { CrossValidator } from "@/lib/validation/cross-validator";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const uf = searchParams.get("uf") || "";
    const termo = searchParams.get("termo") || "";
    const sourcesParam = searchParams.get("sources");
    const includeUnavailable = searchParams.get("includeUnavailable") === "true";

    let sources: SourceType[] | undefined = undefined;
    if (sourcesParam) {
      sources = sourcesParam.split(",").map((s) => s.trim()) as SourceType[];
    }

    const results = await tenderAggregator.searchTenders({
      uf,
      termo,
      sources,
      includeUnavailable,
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...results,
    });
  } catch (error: any) {
    console.error("[API/TENDERS/SEARCH] Erro no agregador:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Erro interno ao consultar agregador de editais.",
      },
      { status: 500 }
    );
  }
}

/**
 * Endpoint de métricas de saúde dos conectores para o SuperAdmin /admin/system
 */
export async function POST() {
  const health = CircuitBreakerManager.getHealthSummary();
  const metrics = CrossValidator.getMetrics();
  return NextResponse.json({
    health,
    metrics,
  });
}
