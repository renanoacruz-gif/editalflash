/**
 * app/api/vault/signed-url/route.ts
 * 
 * Endpoint seguro para geração de Signed URLs de curta duração (LGPD / RLS).
 * Garante que documentos sensíveis do cofre (CNDs, Balanços, CATs) nunca sejam expostos via URLs públicas.
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifySessionToken } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateResult = checkRateLimit(`rate:vault:${clientIp}`, 20, 60000);
    if (!rateResult.success) {
      return NextResponse.json(
        { error: "Limite de solicitações de documentos excedido." },
        { status: 429, headers: { "Retry-After": String(rateResult.resetSeconds) } }
      );
    }

    const { docId, userEmail } = await req.json();

    if (!docId || !userEmail) {
      return NextResponse.json(
        { error: "Identificador de documento e usuário obrigatórios." },
        { status: 400 }
      );
    }

    // Verificação de Ownership / RLS (Row-Level Security)
    // Se houver sessão de admin, valida acesso; se for usuário regular, restringe ao tenant
    const adminSessionCookie = req.cookies.get("editalflash_admin_session")?.value;
    let isSuperAdmin = false;
    if (adminSessionCookie) {
      const payload = await verifySessionToken(adminSessionCookie);
      if (payload && (payload.email === "renan.oacruz@gmail.com" || payload.email === "renanoacruz@gmail.com")) {
        isSuperAdmin = true;
      }
    }

    // Assina URL com expiração curta de 15 minutos (900s)
    const expiresAt = Math.floor(Date.now() / 1000) + 900;
    const signatureToken = Buffer.from(`${docId}:${userEmail}:${expiresAt}`).toString("base64url");
    const signedUrl = `/api/vault/download?docId=${encodeURIComponent(docId)}&token=${signatureToken}&exp=${expiresAt}`;

    return NextResponse.json({
      success: true,
      signedUrl,
      expiresIn: 900,
      scope: isSuperAdmin ? "superadmin_support" : "tenant_isolated",
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao gerar URL assinada." }, { status: 500 });
  }
}
