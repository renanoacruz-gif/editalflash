import { NextRequest, NextResponse } from "next/server";
import { CompetitorStatsEngine } from "@/lib/competitor-stats-engine";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orgao = searchParams.get("orgao") || "Prefeitura Municipal de Campinas";
  const stats = CompetitorStatsEngine.obterEstatisticasOrgao(orgao);
  return NextResponse.json(stats);
}
