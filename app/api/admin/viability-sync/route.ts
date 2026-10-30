import { NextRequest, NextResponse } from "next/server";
import { saveInternalCostStructure, getInternalCostStructure } from "@/lib/cost-structure";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fixedMonthlyOverheadYear1Cents,
      fixedMonthlyOverheadYear5Cents,
      variableCostPerAnalysisCents,
      version,
      source,
    } = body;

    const current = getInternalCostStructure();

    const updated = saveInternalCostStructure({
      ...(fixedMonthlyOverheadYear1Cents ? { fixedMonthlyOverheadYear1Cents } : {}),
      ...(fixedMonthlyOverheadYear5Cents ? { fixedMonthlyOverheadYear5Cents } : {}),
      ...(variableCostPerAnalysisCents ? { variableCostPerAnalysisCents } : {}),
      syncMetadata: {
        lastSyncTimestamp: new Date().toISOString(),
        version: version || "2026.10.v2",
        source: source || "external-cloud-viability-calculator",
        isStale: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Estrutura de custos sincronizada com sucesso com a Calculadora de Viabilidade Cloud.",
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao sincronizar pressupostos de viabilidade." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const current = getInternalCostStructure();
  return NextResponse.json({
    success: true,
    data: current,
  });
}
