import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminToken,
} from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Extract admin session token from cookie or Authorization header
  let token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
      token = authHeader.slice(7).trim();
    }
  }

  const isValidAdmin = token ? await verifyAdminToken(token) : null;

  // 1. Protect all Backend Admin APIs (/api/admin/*)
  if (pathname.startsWith("/api/admin")) {
    if (!isValidAdmin) {
      return NextResponse.json(
        {
          error: "Unauthorized: Secure administrator access required",
          code: "ADMIN_AUTH_REQUIRED",
        },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 2. Protect Admin Frontend Pages (/admin/*)
  if (pathname.startsWith("/admin")) {
    // If accessing subroutes (e.g. /admin/products/edit, /admin/categories/edit) without admin session:
    // Redirect to the main admin page with return url
    if (!isValidAdmin && pathname !== "/admin") {
      const loginUrl = new URL("/admin", request.url);
      loginUrl.searchParams.set("redirect", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

