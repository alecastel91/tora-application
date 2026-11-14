/**
 * Public artist pages (torahub.io/@slug) — data from the backend's one
 * visitor whitelist (tora-backend src/utils/publicProfile.js). Everything a
 * visitor may see is in this shape; fees, deals, tours, contacts and the
 * members-only network never reach the website at all.
 */

export type MediaItem = { url: string; provider: string; title?: string | null; image?: string | null };
export type ReleaseLink = { store: string; url: string };
export type Release = {
  title: string;
  type?: string | null;
  year?: string | number | null;
  label?: string | null;
  image?: string | null;
  links?: ReleaseLink[] | null;
};
export type PublicProfile = {
  slug: string;
  role: string;
  name: string;
  pronouns: string | null;
  verified: boolean;
  photo: string | null;
  photoFocus: string | null;
  city: string | null;
  country: string | null;
  genres: string[];
  playStyles: string[];
  label: string | null;
  bio: string | null;
  links: Partial<Record<"instagram" | "residentAdvisor" | "soundcloud" | "bandcamp" | "spotify" | "website", string>>;
  representedBy: { name: string; agency: string | null; avatar: string | null; city: string | null; country: string | null }[];
  sets: MediaItem[];
  releases: Release[];
  videos: MediaItem[];
  highlights: { venue: string; city: string | null; year: string | number | null; raUrl: string | null }[];
  pressPhotos: { url: string; credit: string | null }[];
  pressKit: { files: { id: string; title: string; url: string }[]; photos: { url: string; credit: string | null }[] } | null;
  updatedAt: string;
};

export const SITE = "https://www.torahub.io";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.torahub.io";
// How long a page is served from cache before it is rebuilt. Saves in the
// app rebuild it at once through /api/revalidate-profile; this is the backstop.
export const PAGE_REVALIDATE = 300;

// The backend's origin: BACKEND_API_URL is set with its "/api" suffix.
const backend = () => (process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || "").replace(/\/+$/, "").replace(/\/api$/, "");

/** Same rule as the backend's normalizeSlug, so junk never costs a request. */
export function cleanSlug(raw: string): string {
  const v = decodeURIComponent(String(raw || "")).trim().toLowerCase().replace(/^@/, "");
  return /^[a-z0-9](?:[a-z0-9._-]{1,28}[a-z0-9])$/.test(v) && !/[._-]{2}/.test(v) ? v : "";
}

export type Lookup = { profile: PublicProfile } | { redirectTo: string } | null;

export async function fetchPublicProfile(slug: string): Promise<Lookup> {
  const base = backend();
  if (!base || !slug) return null;
  const res = await fetch(`${base}/api/public/profiles/${encodeURIComponent(slug)}`, {
    next: { revalidate: PAGE_REVALIDATE },
  });
  if (res.status === 404) return null;
  // Anything else unexpected throws, so a backend hiccup shows the error page
  // (and keeps the last good cached page) instead of caching a false 404.
  if (!res.ok) throw new Error(`public profile ${slug}: HTTP ${res.status}`);
  const body = await res.json();
  if (body.redirectTo) return { redirectTo: String(body.redirectTo) };
  return body.profile ? { profile: body.profile as PublicProfile } : null;
}

export async function fetchPublicSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  const base = backend();
  if (!base) return [];
  try {
    const res = await fetch(`${base}/api/public/profiles`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const body = await res.json();
    return Array.isArray(body.profiles) ? body.profiles : [];
  } catch {
    return [];
  }
}

/** Absolute URL for a press-kit file (uploads are served by the backend). */
export const pressKitHref = (url: string) => (url.startsWith("/api/") ? `${backend()}${url}` : url);

export const PROVIDER_LABEL: Record<string, string> = {
  soundcloud: "SoundCloud", mixcloud: "Mixcloud", youtube: "YouTube", vimeo: "Vimeo",
};
export const STORE_LABEL: Record<string, string> = {
  bandcamp: "Bandcamp", spotify: "Spotify", beatport: "Beatport", soundcloud: "SoundCloud",
};

/** RA stores either a full URL or an artist name ("DNG (1)" → ra.co/dj/dng-1); same rule as the app. */
export function raProfileUrl(value: string): string {
  if (value.startsWith("http")) return value;
  const slug = value.toLowerCase().replace(/\s+\(([^)]+)\)/g, "-$1").replace(/\s+/g, "").replace(/--+/g, "-").replace(/^-|-$/g, "");
  return `https://ra.co/dj/${slug}`;
}

export function safeHttpUrl(value?: string | null): string | null {
  if (!value) return null;
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

/** The "Book" button: the apply page, tagged so the application records which page sent it. */
export const applyHref = (slug: string) =>
  `/apply?start=role&ref=${encodeURIComponent(slug)}&utm_source=tora-profile&utm_medium=public-page&utm_content=${encodeURIComponent(slug)}`;
