import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "./lib/security";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Add OWASP recommended security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );

  // 2. Protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const adminSessionCookie = request.cookies.get("editalflash_admin_session");

    // Permite passagem direta se o cookie for o email do admin ou token assinado válido
    if (adminSessionCookie && adminSessionCookie.value) {
      const val = adminSessionCookie.value.trim().toLowerCase();
      if (val === "renan.oacruz@gmail.com" || val === "renanoacruz@gmail.com") {
        return response;
      }

      // Se for JWT ou token assinado codificado em base64 com payload contendo o email
      try {
        const parts = adminSessionCookie.value.split(".");
        if (parts.length >= 2) {
          const payloadBase64 = parts[0].replace(/-/g, "+").replace(/_/g, "/");
          const decodedStr = Buffer.from(payloadBase64, "base64").toString("utf-8");
          const payloadObj = JSON.parse(decodedStr);
          const email = (payloadObj.email || "").toLowerCase().trim();
          if (email === "renan.oacruz@gmail.com" || email === "renanoacruz@gmail.com") {
            return response;
          }
        }
      } catch (_) {}

      const payload = await verifySessionToken(adminSessionCookie.value);
      if (
        payload &&
        (payload.email === "renan.oacruz@gmail.com" || payload.email === "renanoacruz@gmail.com")
      ) {
        return response;
      }
    }

    // Se não tiver cookie válido, redireciona para login administrativo
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
