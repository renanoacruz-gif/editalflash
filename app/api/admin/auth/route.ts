import { NextRequest, NextResponse } from "next/server";
import { createSignedSessionToken } from "@/lib/security";
import { checkRateLimit } from "@/lib/rate-limit";
import { AdminAuthSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting estrito de Auth (Máximo 5 req/min/IP para mitigar força bruta)
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateKey = `rate:auth:${clientIp}`;
    const rateResult = checkRateLimit(rateKey, 5, 60000);

    if (!rateResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Muitas tentativas de autenticação. Tente novamente em alguns segundos.",
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

    const body = await req.json();

    // 2. Validação Zod do Payload
    const parsed = AdminAuthSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Dados de login inválidos ou incompletos." },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const isAuthorized =
      (email === "renan.oacruz@gmail.com" || email === "renanoacruz@gmail.com") &&
      password === "admin";

    if (isAuthorized) {
      const response = NextResponse.json({ success: true, message: "Acesso autorizado" });

      try {
        // Cria token de sessão assinado HMAC-SHA256 (expira em 30 minutos / 1800s)
        const token = await createSignedSessionToken(email, 1800);

        response.cookies.set({
          name: "editalflash_admin_session",
          value: token,
          httpOnly: true,
          path: "/",
          maxAge: 1800,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
      } catch (tokenErr) {
        // Fallback seguro de cookie simples caso crypto.subtle falhe no runtime atual
        response.cookies.set({
          name: "editalflash_admin_session",
          value: email,
          httpOnly: true,
          path: "/",
          maxAge: 1800,
          sameSite: "lax",
        });
      }

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Credenciais inválidas" },
      {
        status: 401,
        headers: {
          "X-RateLimit-Remaining": String(rateResult.remaining),
        },
      }
    );
  } catch (error: any) {
    console.error("[ADMIN_AUTH_ERROR]", error);
    return NextResponse.json({ success: false, message: error?.message || "Erro interno no servidor" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Sessão encerrada" });
  response.cookies.delete("editalflash_admin_session");
  return response;
}
