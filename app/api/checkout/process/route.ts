/**
 * app/api/checkout/process/route.ts
 * 
 * Endpoint de processamento do Checkout Seguro do EditalFlash
 */

import { NextRequest, NextResponse } from "next/server";
import { processCheckout, CheckoutRequest } from "@/lib/checkout-service";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateResult = checkRateLimit(`rate:checkout:${clientIp}`, 10, 60000);
    if (!rateResult.success) {
      return NextResponse.json(
        { error: "Muitas tentativas de pagamento. Aguarde alguns instantes." },
        { status: 429, headers: { "Retry-After": String(rateResult.resetSeconds) } }
      );
    }

    const payload: CheckoutRequest = await req.json();

    if (!payload.amount || payload.amount <= 0 || !payload.paymentMethod) {
      return NextResponse.json(
        { error: "Dados de checkout incompletos ou valor inválido." },
        { status: 400 }
      );
    }

    const result = await processCheckout(payload);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("[CHECKOUT] Erro no processamento:", error);
    return NextResponse.json(
      { error: error?.message || "Erro interno ao processar pagamento." },
      { status: 500 }
    );
  }
}
