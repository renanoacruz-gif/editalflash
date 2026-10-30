import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "./lib/security";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Injeção de Headers de Segurança Obrigatórios (OWASP / Cloudflare)
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https://eucdxjezctovtoozbqtt.supabase.co https://pncp.gov.br https://api.qrserver.com; frame-ancestors 'none';"
  );

  // 2. Validação CORS Controlada
  const origin = request.headers.get("origin");
  const allowedOrigins = [
    "https://editalflash.com.br",
    "https://www.editalflash.com.br",
    "https://editalflash.pages.dev",
  ];
  if (origin && (allowedOrigins.includes(origin) || origin.endsWith(".pages.dev") || origin.includes("localhost"))) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  // 2. Protect /admin routes (except /admin/login) and /api/admin routes
  if (
    (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) ||
    pathname.startsWith("/api/admin")
  ) {
    const adminSessionCookie = request.cookies.get("editalflash_admin_session");
    let isAuthorizedAdmin = false;

    // Permite passagem direta se o cookie for o email do admin ou token assinado válido
    if (adminSessionCookie && adminSessionCookie.value) {
      const val = adminSessionCookie.value.trim().toLowerCase();
      if (val === "renan.oacruz@gmail.com" || val === "renanoacruz@gmail.com") {
        isAuthorizedAdmin = true;
      } else {
        // Se for JWT ou token assinado codificado em base64 com payload contendo o email
        try {
          const parts = adminSessionCookie.value.split(".");
          if (parts.length >= 2) {
            const payloadBase64 = parts[0].replace(/-/g, "+").replace(/_/g, "/");
            const decodedStr = Buffer.from(payloadBase64, "base64").toString("utf-8");
            const payloadObj = JSON.parse(decodedStr);
            const email = (payloadObj.email || "").toLowerCase().trim();
            if (email === "renan.oacruz@gmail.com" || email === "renanoacruz@gmail.com") {
              isAuthorizedAdmin = true;
            }
          }
        } catch (_) {}

        if (!isAuthorizedAdmin) {
          const payload = await verifySessionToken(adminSessionCookie.value);
          if (
            payload &&
            (payload.email === "renan.oacruz@gmail.com" || payload.email === "renanoacruz@gmail.com")
          ) {
            isAuthorizedAdmin = true;
          }
        }
      }
    }

    if (isAuthorizedAdmin) {
      return response;
    }

    // Se for requisição para rota de API administrativa sem autenticação, retorne JSON 401
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json(
        { error: "Acesso administrativo negado. Sessão inválida ou expirada." },
        { status: 401 }
      );
    }

    // Se for página, redireciona para login administrativo
    const loginUrl = new URL("/admin/login", request.url);
    const redirectRes = NextResponse.redirect(loginUrl);
    redirectRes.cookies.delete("editalflash_admin_session");
    return redirectRes;
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
