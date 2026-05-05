import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminSessionToken, adminSession } from "@/lib/adminAuth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminSession.cookieName)?.value;
  if (!token) return NextResponse.json({ authenticated: false });

  const payload = await verifyAdminSessionToken(token);
  return NextResponse.json({ authenticated: payload !== null });
}
