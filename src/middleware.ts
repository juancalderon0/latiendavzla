import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

const REF_COOKIE = "ref_code";

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Captura el código de referido de un vendedor (?ref=CODIGO) y lo guarda
  // 30 días para atribuirle la venta aunque compre días después.
  const ref = searchParams.get("ref");
  let response: NextResponse | null = null;
  if (ref) {
    response = NextResponse.next();
    response.cookies.set(REF_COOKIE, ref, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  if (!isAdminRoute) {
    return response ?? NextResponse.next();
  }

  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return response ?? NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return response ?? NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico)$).*)",
  ],
};
