import { NextRequest, NextResponse } from "next/server";
import { AutoCNDService } from "@/lib/auto-cnd-service";

export async function POST(req: NextRequest) {
  try {
    const { cnpj } = await req.json();
    const result = await AutoCNDService.autoRenovarCertidoes(cnpj);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Erro ao renovar certidões." }, { status: 500 });
  }
}
