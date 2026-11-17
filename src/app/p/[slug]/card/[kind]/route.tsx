import type React from "react";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { cleanSlug, fetchPublicProfile } from "@/lib/publicProfile";
import { TORA_LOGO } from "./logo";

// The app's role colours (tora-app utils/roles.js), as on the page itself.
const ROLE_DOT: Record<string, string> = { ARTIST: "#6B5FFF", AGENT: "#00C875", PROMOTER: "#FFB800", VENUE: "#FF5757" };

/* GET /p/<slug>/card/story | post | og — the artist's page as an image to
   share: a 1080×1920 Instagram story, a 1080×1350 feed post, or the
   1200×630 card link previews show (WhatsApp, X, LinkedIn…).
   Opened from the Share sheet on the public page and in the app (which
   fetches it cross-origin, hence the CORS header). English on purpose: the
   card is the brand, the page link carries the visitor's language. */

const SIZES = { story: { width: 1080, height: 1920 }, post: { width: 1080, height: 1350 }, og: { width: 1200, height: 630 } } as const;
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

export async function GET(req: Request, { params }: { params: Promise<{ slug: string; kind: string }> }) {
  const { slug: raw, kind: rawKind } = await params;
  const kind = rawKind.replace(/\.png$/, "") as Kind;
  const slug = cleanSlug(raw);
  if (!slug || !(kind in SIZES)) return new Response("Not found", { status: 404 });
  const found = await fetchPublicProfile(slug, { fresh: true });
  if (!found || !("profile" in found)) return new Response("Not found", { status: 404 });
  const p = found.profile;

  const { width, height } = SIZES[kind];
  const story = kind === "story";
  const og = kind === "og";
  // "Find me on TORA" only when the artist shares their own page (the app asks with ?v=me);
  // anyone can share from the public page, so there it stays neutral.
  const hook = new URL(req.url).searchParams.get("v") === "me" ? "Find me on TORA" : "Full profile on TORA";
  // Stories keep text clear of Instagram's own header (top ~250px) and reply bar (bottom ~250px).
  const photoW = og ? 520 : width;
  const photoH = story ? 1180 : height;
  const where = [p.city, p.country].filter(Boolean).join(", ");
  const link = `torahub.io/@${p.slug}`;
  const len = p.name.length;
  const nameSize = og ? (len <= 12 ? 76 : len <= 18 ? 62 : 50) : len <= 10 ? (story ? 132 : 112) : len <= 16 ? (story ? 108 : 92) : (story ? 84 : 72);

  const [photo, bold, medium, cjk] = await Promise.all([
    p.photo ? photoDataUrl(p.photo, photoW, photoH) : Promise.resolve(null),
    googleFont("Space Grotesk", 700),
    googleFont("Inter", 500),
    // Names in Japanese, Chinese or Korean: only the glyphs the name needs.
    NON_LATIN.test(p.name) ? googleFont(/[\uac00-\ud7af]/.test(p.name) ? "Noto Sans KR" : "Noto Sans JP", 700, p.name) : Promise.resolve(null),
  ]);
  const fonts = [
    bold && { name: "Display", data: bold, weight: 700 as const },
    medium && { name: "Body", data: medium, weight: 500 as const },
    cjk && { name: "CJK", data: cjk, weight: 700 as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 500 | 700 }[];

  // The artist's first five (their order), the rest as "+N".
  const genres = p.genres.slice(0, 5);
  const moreGenres = p.genres.length - genres.length;
  const s = og ? 0.62 : 1; // type scale for the small link-preview card

  const tick = p.verified && (
    <svg width={64 * s} height={64 * s} viewBox="0 0 24 24" style={{ marginLeft: 20 * s }}>
      <path fill="#FF3366" d="M12 1.5l2.6 1.9 3.2-.2 1 3 2.7 1.8-1 3 1 3-2.7 1.8-1 3-3.2-.2L12 22.5l-2.6-1.9-3.2.2-1-3-2.7-1.8 1-3-1-3 2.7-1.8 1-3 3.2.2z" />
      <path d="M7.5 12.3l3 3 6-6.2" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const identity = (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", fontSize: 28 * s, letterSpacing: 5 * s, color: "#B9B9C6", textTransform: "uppercase" }}>
        <div style={{ width: 16 * s, height: 16 * s, borderRadius: 8, background: ROLE_DOT[p.role] || ROLE_DOT.ARTIST, marginRight: 16 * s }} />
        {`${p.role.charAt(0)}${p.role.slice(1).toLowerCase()}${where ? ` · ${where}` : ""}`}
      </div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 22 * s }}>
        <div style={{ display: "flex", fontFamily: "Display, CJK", fontSize: nameSize, fontWeight: 700, lineHeight: 1, letterSpacing: -2 * s }}>{p.name}</div>
        {tick}
      </div>
      {genres.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 30 * s }}>
          {[...genres, ...(moreGenres > 0 ? [`+${moreGenres}`] : [])].map((g, i) => (
            <div key={g} style={{ display: "flex", border: "2px solid #3A3A45", borderRadius: 40, padding: `${10 * s}px ${26 * s}px`, fontSize: 28 * s, color: i < genres.length ? "#E4E4EA" : "#8A8A99", marginRight: 14 * s, marginBottom: 12 * s }}>{g}</div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", marginTop: (story ? 64 : 34) * s }}>
        <div style={{ display: "flex", fontFamily: "Display", fontWeight: 700, fontSize: (story ? 46 : 38) * s, letterSpacing: 1 }}>{hook}</div>
        <div style={{ display: "flex", alignSelf: "flex-start", marginTop: 20 * s, background: "#FF3366", borderRadius: 18 * s, padding: story ? "22px 34px" : `${18 * s}px ${30 * s}px`, fontSize: (story ? 40 : 34) * s, fontWeight: 500, color: "#fff" }}>{link}</div>
      </div>
    </div>
  );

  // eslint-disable-next-line @next/next/no-img-element
  const logo = (w: number, style: React.CSSProperties) => <img src={TORA_LOGO} alt="TORA" width={w} height={Math.round((w * 285) / 1015)} style={style} />;
  // eslint-disable-next-line @next/next/no-img-element
  const photoImg = photo && <img src={photo} alt="" width={photoW} height={photoH} style={{ position: "absolute", top: 0, left: 0, width: photoW, height: photoH, objectFit: "cover" }} />;

  if (og) {
    // Link previews (WhatsApp, X, LinkedIn, iMessage…): photo left, identity right.
    return new ImageResponse(
      (
        <div style={{ width, height, display: "flex", position: "relative", background: "#000", color: "#F4F4F6", fontFamily: "Body" }}>
          {photoImg}
          <div style={{ position: "absolute", top: 0, left: photoW - 160, width: 160, height, display: "flex", backgroundImage: "linear-gradient(to right, rgba(0,0,0,0), #000)" }} />
          {logo(150, { position: "absolute", top: 48, left: photoW + 40 })}
          <div style={{ position: "absolute", left: photoW + 40, right: 48, bottom: 52, display: "flex" }}>{identity}</div>
        </div>
      ),
      { width, height, fonts, headers: HEADERS },
    );
  }

  return new ImageResponse(
    (
      <div style={{ width, height, display: "flex", flexDirection: "column", position: "relative", background: "#000", color: "#F4F4F6", fontFamily: "Body" }}>
        {photoImg}
        <div style={{ position: "absolute", left: 0, right: 0, top: photoH - (story ? 620 : 760), height: story ? 620 : 760, display: "flex", backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0), #000)" }} />
        {!story && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 240, display: "flex", backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0))" }} />
        )}
        {/* Feed post: logo in the corner. Story: Instagram's own header covers the
            top, so the logo signs off at the bottom with the tagline, as one lockup. */}
        {!story && logo(210, { position: "absolute", top: 56, left: 60 })}
        <div style={{ position: "absolute", left: 72, right: 72, bottom: story ? 420 : 72, display: "flex" }}>{identity}</div>
        {story && (
          <div style={{ position: "absolute", left: 72, right: 72, bottom: 280, display: "flex", alignItems: "center" }}>
            {logo(150, {})}
            <div style={{ display: "flex", marginLeft: 22, paddingLeft: 22, borderLeft: "2px solid #3A3A45", fontSize: 22, letterSpacing: 6, color: "#B9B9C6" }}>WHERE MUSIC MEETS</div>
          </div>
        )}
      </div>
    ),
    { width, height, fonts, headers: HEADERS },
  );
}
