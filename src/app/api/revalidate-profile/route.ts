import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { cleanSlug } from "@/lib/publicProfile";

/**
 * POST /api/revalidate-profile  { slugs: string[] }   header x-revalidate-secret
 *
 * Called by tora-backend (utils/publicRevalidate.js) after a member saves,
 * publishes, unpublishes or renames their public page, so torahub.io/@slug
 * shows the change at once instead of after its cache window. The same
 * value on both sides: PUBLIC_REVALIDATE_SECRET on the backend, PROFILE_REVALIDATE_SECRET
 * here (Vercel refuses to keep a PUBLIC_-prefixed variable as a secret).
 */
export async function POST(request: NextRequest) {
  const secret = process.env.PROFILE_REVALIDATE_SECRET || "";
  const given = request.headers.get("x-revalidate-secret") || "";
  const ok = secret.length > 0 && given.length === secret.length
    && timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { slugs?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const slugs = (Array.isArray(body.slugs) ? body.slugs : [])
    .slice(0, 10)
    .map((s) => cleanSlug(String(s)))
    .filter(Boolean);
  for (const slug of slugs) revalidatePath(`/p/${slug}`);
  if (slugs.length) revalidatePath("/sitemap.xml");
  return NextResponse.json({ revalidated: slugs });
}
