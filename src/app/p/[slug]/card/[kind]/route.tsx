import { ImageResponse } from "next/og";
import sharp from "sharp";
import { cleanSlug, fetchPublicProfile } from "@/lib/publicProfile";
import { TORA_LOGO } from "./logo";

/* GET /p/<slug>/card/story | /p/<slug>/card/post — the artist's page as an
   image to share: a 1080×1920 Instagram story or a 1080×1350 feed post.
   Opened from the Share sheet on the public page and in the app (which
   fetches it cross-origin, hence the CORS header). English on purpose: the
   card is the brand, the page link carries the visitor's language. */

const SIZES = { story: { width: 1080, height: 1920 }, post: { width: 1080, height: 1350 } } as const;
type Kind = keyof typeof SIZES;

const HEADERS = {
  "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
  "Access-Control-Allow-Origin": "*",
};

/** One Google font as TTF (Google serves TTF when no browser UA is sent); `text` subsets it. */
async function googleFont(family: string, weight: number, text?: string): Promise<ArrayBuffer | null> {
  try {
    const q = `family=${family.replace(/ /g, "+")}:wght@${weight}${text ? `&text=${encodeURIComponent(text)}` : ""}`;
    const css = await (await fetch(`https://fonts.googleapis.com/css2?${q}`, { next: { revalidate: 86400 } })).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url, { next: { revalidate: 86400 } })).arrayBuffer() : null;
  } catch {
    return null;
  }
}

/** The profile photo as a JPEG data URL (avatars are WebP, which the renderer can't read). */
async function photoDataUrl(src: string, width: number, height: number): Promise<string | null> {
  try {
    const res = await fetch(src);
    if (!res.ok) return null;
    const jpg = await sharp(Buffer.from(await res.arrayBuffer())).resize(width, height, { fit: "cover", position: "attention" }).jpeg({ quality: 82 }).toBuffer();
    return `data:image/jpeg;base64,${jpg.toString("base64")}`;
  } catch {
    return null;
  }
}

const NON_LATIN = /[^\u0000-ɏḀ-ỿ -⁯]/;

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string; kind: string }> }) {
  const { slug: raw, kind: rawKind } = await params;
  const kind = rawKind.replace(/\.png$/, "") as Kind;
  const slug = cleanSlug(raw);
  if (!slug || !(kind in SIZES)) return new Response("Not found", { status: 404 });
  const found = await fetchPublicProfile(slug);
  if (!found || !("profile" in found)) return new Response("Not found", { status: 404 });
  const p = found.profile;

  const { width, height } = SIZES[kind];
  const story = kind === "story";
  // Stories keep text clear of Instagram's own header (top ~250px) and reply bar (bottom ~250px).
  const photoH = story ? 1180 : height;
  const where = [p.city, p.country].filter(Boolean).join(", ");
  const link = `torahub.io/@${p.slug}`;
  const nameSize = p.name.length <= 10 ? (story ? 132 : 112) : p.name.length <= 16 ? (story ? 108 : 92) : (story ? 84 : 72);

  const [photo, bold, medium, cjk] = await Promise.all([
    p.photo ? photoDataUrl(p.photo, width, photoH) : Promise.resolve(null),
    googleFont("Space Grotesk", 700),
    googleFont("Inter", 500),
    // Names in Japanese, Chinese or Korean: only the glyphs the name needs.
    NON_LATIN.test(p.name) ? googleFont(/[가-힯]/.test(p.name) ? "Noto Sans KR" : "Noto Sans JP", 700, p.name) : Promise.resolve(null),
  ]);
  const fonts = [
    bold && { name: "Display", data: bold, weight: 700 as const },
    medium && { name: "Body", data: medium, weight: 500 as const },
    cjk && { name: "CJK", data: cjk, weight: 700 as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 500 | 700 }[];

  const genres = p.genres.slice(0, 3);

  return new ImageResponse(
    (
      <div style={{ width, height, display: "flex", flexDirection: "column", position: "relative", background: "#000", color: "#F4F4F6", fontFamily: "Body" }}>
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" width={width} height={photoH} style={{ position: "absolute", top: 0, left: 0, width, height: photoH, objectFit: "cover" }} />
        )}
        <div style={{ position: "absolute", left: 0, right: 0, top: photoH - (story ? 620 : 760), height: story ? 620 : 760, display: "flex", backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0), #000)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: story ? 520 : 260, display: "flex", backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0))" }} />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={TORA_LOGO} alt="TORA" width={230} height={65} style={{ position: "absolute", top: story ? 250 : 76, left: 72 }} />

        <div style={{ position: "absolute", left: 72, right: 72, bottom: story ? 330 : 84, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 28, letterSpacing: 5, color: "#B9B9C6", textTransform: "uppercase" }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: "#6B5FFF", marginRight: 16 }} />
            {`Artist${where ? ` · ${where}` : ""}`}
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 22 }}>
            <div style={{ display: "flex", fontFamily: "Display, CJK", fontSize: nameSize, fontWeight: 700, lineHeight: 1, letterSpacing: -2 }}>{p.name}</div>
            {p.verified && (
              <svg width="64" height="64" viewBox="0 0 24 24" style={{ marginLeft: 20 }}>
                <path fill="#FF3366" d="M12 1.5l2.6 1.9 3.2-.2 1 3 2.7 1.8-1 3 1 3-2.7 1.8-1 3-3.2-.2L12 22.5l-2.6-1.9-3.2.2-1-3-2.7-1.8 1-3-1-3 2.7-1.8 1-3 3.2.2z" />
                <path d="M7.5 12.3l3 3 6-6.2" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          {genres.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: 30 }}>
              {genres.map((g) => (
                <div key={g} style={{ display: "flex", border: "2px solid #3A3A45", borderRadius: 40, padding: "10px 26px", fontSize: 28, color: "#E4E4EA", marginRight: 14, marginBottom: 12 }}>{g}</div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", marginTop: story ? 70 : 34 }}>
            <div style={{ display: "flex", fontFamily: "Display", fontWeight: 700, fontSize: story ? 46 : 38, letterSpacing: 1 }}>Find me on TORA</div>
            <div style={{ display: "flex", alignSelf: "flex-start", marginTop: 20, background: "#FF3366", borderRadius: 18, padding: story ? "22px 34px" : "18px 30px", fontSize: story ? 40 : 34, fontWeight: 500, color: "#fff" }}>{link}</div>
          </div>
        </div>
        {story && (
          <div style={{ position: "absolute", left: 72, right: 72, bottom: 260, display: "flex", fontSize: 22, letterSpacing: 6, color: "#8A8A99" }}>WHERE MUSIC MEETS</div>
        )}
      </div>
    ),
    { width, height, fonts, headers: HEADERS },
  );
}
