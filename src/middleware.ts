import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken, adminSession } from "@/lib/adminAuth";

const PUBLIC_API_PATHS = new Set([
  "/api/admin/login",
  "/api/admin/logout",
  "/api/admin/session",
]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_API_PATHS.has(pathname)) return NextResponse.next();

  const token = request.cookies.get(adminSession.cookieName)?.value;
  const payload = token ? await verifyAdminSessionToken(token) : null;

  if (payload) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/admin/:path*",
    "/api/send-invitation",
    "/api/send-decline",
    "/api/send-add-profile-approved",
  ],
};
