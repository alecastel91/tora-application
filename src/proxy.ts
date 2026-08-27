import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken, adminSession } from "@/lib/adminAuth";

const PUBLIC_API_PATHS = new Set([
  "/api/admin/login",
  "/api/admin/logout",
  "/api/admin/session",
]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_API_PATHS.has(pathname)) return NextResponse.next();

  const token = request.cookies.get(adminSession.cookieName)?.value;
  const payload = token ? await verifyAdminSessionToken(token) : null;

  if (payload) {
    // Beta-scoped sessions (Jenn) reach ONLY the beta cockpit APIs.
    const scope = (payload as { scope?: string }).scope || "full";
    // Segment match, not prefix — "/api/admin/beta-anything" must NOT pass.
    if (scope === "beta" && pathname.startsWith("/api/")
      && pathname !== "/api/admin/beta" && !pathname.startsWith("/api/admin/beta/")) {
      return NextResponse.json({ error: "Beta access only" }, { status: 403 });
    }
    return NextResponse.next();
  }

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
