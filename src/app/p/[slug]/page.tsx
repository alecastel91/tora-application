import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import type { ReactNode } from "react";
import {
  APP_URL, SITE, STORE_LABEL,
  applyHref, cleanSlug, fetchPublicProfile, pressKitHref, raProfileUrl, safeHttpUrl,
  type PublicProfile,
} from "@/lib/publicProfile";
import { CopyLinkButton, SetsGrid, VideosGrid } from "./_components/players";
import { ApplyLink, Mixes, PageLang, PhotoBy, T } from "./_components/i18n";

/* torahub.io/@slug (rewritten here by next.config). A verified artist's
   public page, laid out to the approved mock (round 2–9 decisions, see the
   app's public-profile notes): one photo, identity, link icons, Book + Copy
   link, Bio under the buttons, then Sets / Releases / Highlights / Videos /
   Press photos / Press kit. Phone = one column, desktop = identity column +
   content column. Built on demand and cached; the app's saves rebuild it. */

// Must be a literal (Next reads it statically); same as PAGE_REVALIDATE.
export const revalidate = 300;
// Pages are built the first time someone opens them, never at deploy.
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

type Params = { params: Promise<{ slug: string }> };

async function load(raw: string): Promise<PublicProfile> {
  const slug = cleanSlug(raw);
  if (!slug) notFound();
  const found = await fetchPublicProfile(slug);
  if (!found) notFound();
  if ("redirectTo" in found) permanentRedirect(`/@${found.redirectTo}`);
  return found.profile;
}

const place = (p: { city: string | null; country: string | null }) => [p.city, p.country].filter(Boolean).join(", ");
const roleLabel = (role: string) => role.charAt(0) + role.slice(1).toLowerCase();
const PLAY_STYLES = ["DJ_SET", "VINYL", "HYBRID", "LIVE"] as const;
type PlayStyle = (typeof PLAY_STYLES)[number];
const FOCUS_RE = /^\d{1,3}(\.\d+)?% \d{1,3}(\.\d+)?%$/;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = await load((await params).slug);
  const url = `${SITE}/@${p.slug}`;
  const where = place(p);
  const lead = [roleLabel(p.role), where && `from ${where}`].filter(Boolean).join(" ");
  const description = [
    `${lead}${p.genres.length ? ` · ${p.genres.slice(0, 3).join(", ")}` : ""}.`,
    p.bio ? p.bio.replace(/\s+/g, " ").slice(0, 150) : "Verified on TORA.",
  ].join(" ");
  const images = p.photo ? [{ url: p.photo, alt: p.name }] : undefined;
  return {
    title: p.name,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${p.name} on TORA`, description, url, siteName: "TORA", type: "profile", images },
    twitter: { card: p.photo ? "summary_large_image" : "summary", title: `${p.name} on TORA`, description, images: p.photo ? [p.photo] : undefined },
  };
}

/* ---------- small pieces ---------- */

const H2 = ({ children, aside }: { children: ReactNode; aside?: ReactNode }) => (
  <div className="flex items-baseline justify-between">
    <h2 className="pp-label m-0 font-[family-name:var(--font-space-grotesk)] text-[13px] font-medium uppercase tracking-[0.16em] text-[#B9B9C6]">{children}</h2>
    {aside}
  </div>
);

const Section = ({ title, aside, children }: { title: ReactNode; aside?: ReactNode; children: ReactNode }) => (
  <section className="flex flex-col gap-3.5">
    <H2 aside={aside}>{title}</H2>
    {children}
  </section>
);

const VerifiedTick = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" role="img" aria-label="Verified on TORA" className="shrink-0">
    <title>Verified on TORA</title>
    <path fill="#FF3366" d="M12 1.5l2.6 1.9 3.2-.2 1 3 2.7 1.8-1 3 1 3-2.7 1.8-1 3-3.2-.2L12 22.5l-2.6-1.9-3.2.2-1-3-2.7-1.8 1-3-1-3 2.7-1.8 1-3 3.2.2z" />
    <path d="M7.5 12.3l3 3 6-6.2" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Brand marks from Simple Icons (CC0), as in the app's LinkIcons.
const ICONS: Record<string, ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  soundcloud: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M23.999 14.165c-.052 1.796-1.612 3.169-3.4 3.169h-8.18a.68.68 0 0 1-.675-.683V7.862a.747.747 0 0 1 .452-.724s.75-.513 2.333-.513a5.364 5.364 0 0 1 2.763.755 5.433 5.433 0 0 1 2.57 3.54c.282-.08.574-.121.868-.12.884 0 1.73.358 2.347.992s.948 1.49.922 2.373ZM10.721 8.421c.247 2.98.427 5.697 0 8.672a.264.264 0 0 1-.53 0c-.395-2.946-.22-5.718 0-8.672a.264.264 0 0 1 .53 0ZM9.072 9.448c.285 2.659.37 4.986-.006 7.655a.277.277 0 0 1-.55 0c-.331-2.630-.256-5.020 0-7.655a.277.277 0 0 1 .556 0Zm-1.663-.257c.27 2.726.39 5.171 0 7.904a.266.266 0 0 1-.532 0c-.38-2.69-.257-5.21 0-7.904a.266.266 0 0 1 .532 0Zm-1.647.77a26.108 26.108 0 0 1-.008 7.147.272.272 0 0 1-.542 0 27.955 27.955 0 0 1 0-7.147.275.275 0 0 1 .55 0Zm-1.67 1.769c.421 1.865.228 3.5-.029 5.388a.257.257 0 0 1-.514 0c-.21-1.858-.398-3.549 0-5.389a.272.272 0 0 1 .543 0Zm-1.655-.273c.388 1.897.26 3.508-.01 5.412-.026.28-.514.283-.54 0-.244-1.878-.347-3.54-.01-5.412a.283.283 0 0 1 .56 0Zm-1.668.911c.4 1.268.257 2.292-.026 3.572a.257.257 0 0 1-.514 0c-.241-1.262-.354-2.312-.023-3.572a.283.283 0 0 1 .563 0Z" /></svg>
  ),
  bandcamp: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M0 18.75l7.437-13.5H24l-7.438 13.5H0z" /></svg>,
  spotify: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>
  ),
  residentAdvisor: <span className="font-[family-name:var(--font-space-grotesk)] text-[13px] font-bold">RA</span>,
  website: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
};

function profileLinks(p: PublicProfile) {
  const l = p.links || {};
  return [
    l.instagram && { key: "instagram", label: "Instagram", href: `https://instagram.com/${l.instagram.replace(/^@/, "")}` },
    l.soundcloud && { key: "soundcloud", label: "SoundCloud", href: safeHttpUrl(l.soundcloud) },
    l.spotify && { key: "spotify", label: "Spotify", href: safeHttpUrl(l.spotify) },
    l.bandcamp && { key: "bandcamp", label: "Bandcamp", href: safeHttpUrl(l.bandcamp) },
    l.residentAdvisor && { key: "residentAdvisor", label: "Resident Advisor", href: raProfileUrl(l.residentAdvisor) },
    l.website && { key: "website", label: "Website", href: safeHttpUrl(l.website) },
  ].filter((x): x is { key: string; label: string; href: string } => Boolean(x && x.href));
}

// eslint-disable-next-line @next/next/no-img-element -- remote photos from Supabase and store CDNs
const Img = (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...props} />;

/* ---------- page ---------- */

export default async function PublicArtistPage({ params }: Params) {
  const p = await load((await params).slug);
  const url = `${SITE}/@${p.slug}`;
  const links = profileLinks(p);
  const focus = p.photoFocus && FOCUS_RE.test(p.photoFocus) ? p.photoFocus : "50% 22%";
  const where = place(p);
  const plays = p.playStyles.filter((s): s is PlayStyle => PLAY_STYLES.includes(s as PlayStyle));
  const pressPhotos = p.pressPhotos;

  // Search engines get the same facts the page shows, nothing more.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    url,
    image: p.photo || undefined,
    description: p.bio || undefined,
    homeLocation: where ? { "@type": "Place", name: where } : undefined,
    genre: p.genres.length ? p.genres : undefined,
    sameAs: links.map((l) => l.href),
  };

  const identity = (
    <div className="flex flex-col gap-2.5">
      <div className="pp-label flex items-center gap-2 font-[family-name:var(--font-space-grotesk)] text-[11px] uppercase tracking-[0.16em] text-[#B9B9C6]">
        <span className="h-2 w-2 shrink-0 rounded-full bg-[#6B5FFF]" aria-hidden="true" />
        <T k="artist" />{where && ` · ${where}`}
      </div>
      <div className="flex items-center gap-2.5">
        <h1 className="m-0 font-[family-name:var(--font-space-grotesk)] text-[38px] font-bold leading-none tracking-[-0.01em] text-[#F4F4F6] md:text-[44px]">{p.name}</h1>
        {p.verified && <VerifiedTick />}
      </div>
      {p.pronouns && <div className="text-sm text-[#B9B9C6]">{p.pronouns}</div>}
      {p.genres.length > 0 && (
        <ul className="mt-0.5 flex list-none flex-wrap gap-1.5 p-0">
          {p.genres.map((g) => (
            <li key={g} className="rounded-full border border-[#2A2A33] px-[11px] py-[5px] text-xs text-[#E4E4EA]">{g}</li>
          ))}
        </ul>
      )}
      {links.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2.5">
          {links.map((l) => (
            <a key={l.key} href={l.href} target="_blank" rel="noopener noreferrer me" aria-label={l.label} title={l.label}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#22222B] bg-[#101015] text-white transition-colors hover:border-white/40">
              {ICONS[l.key]}
            </a>
          ))}
        </div>
      )}
      <div className="mt-3 flex gap-2.5">
        <ApplyLink href={applyHref(p.slug)} className="flex h-[50px] flex-1 items-center justify-center rounded-xl bg-[#FF3366] text-[15px] font-semibold text-white transition-colors hover:bg-[#ff4d7a]">
          <T k="book" />
        </ApplyLink>
        <CopyLinkButton url={url} />
      </div>
      {(p.bio || plays.length > 0 || p.label) && (
        <div className="mt-[18px] flex flex-col gap-2.5">
          <H2><T k="bio" /></H2>
          {p.bio && <p className="m-0 whitespace-pre-line text-[15px] leading-relaxed text-[#E4E4EA]">{p.bio}</p>}
          {(plays.length > 0 || p.label) && (
            <div className="flex flex-wrap gap-x-3.5 gap-y-1.5 text-[13px] text-[#B9B9C6]">
              {plays.length > 0 && (
                <span>{plays.map((s, i) => <span key={s}>{i > 0 && " · "}<T k={`play_${s}`} /></span>)}</span>
              )}
              {p.label && <span>{p.label}</span>}
            </div>
          )}
        </div>
      )}
      {p.representedBy.length > 0 && (
        <div className="mt-2 flex flex-col gap-2">
          <H2><T k="representedBy" /></H2>
          {p.representedBy.map((a) => (
            <div key={`${a.name}-${a.agency}`} className="flex items-center gap-3 rounded-xl border border-[#22222B] bg-[#101015] px-3.5 py-3">
              {a.avatar
                ? <Img src={a.avatar} className="h-11 w-11 shrink-0 rounded-full border-2 border-[#00C875] object-cover" />
                : <span className="h-11 w-11 shrink-0 rounded-full border-2 border-[#00C875] bg-[#1C1C24]" aria-hidden="true" />}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-[#F4F4F6]">{a.name}</span>
                <span className="block truncate text-xs text-[#8A8A99]">{[a.agency, place(a)].filter(Boolean).join(" · ")}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <PageLang>
    <div className="min-h-screen bg-black text-[#F4F4F6] [font-family:var(--font-inter),-apple-system,sans-serif]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <header className="absolute inset-x-0 top-0 z-10 md:static">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-4 py-3.5 md:px-8 md:py-[22px]">
          <Link href="/" className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold tracking-[0.02em] text-white md:text-[22px]">TORA</Link>
          <nav className="flex items-center gap-[22px] text-sm">
            <a href={APP_URL} className="rounded-full bg-black/45 px-3.5 py-[9px] text-[13px] text-white md:bg-transparent md:p-0 md:text-sm md:text-[#B9B9C6] md:hover:text-white"><T k="memberSignIn" /></a>
            <ApplyLink href="/apply?start=role" className="hidden h-[38px] items-center rounded-[10px] bg-white px-4 font-semibold text-black md:flex"><T k="applyToJoin" /></ApplyLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] pb-40 md:flex md:items-start md:gap-14 md:px-8 md:pt-3">
        {/* Identity column (desktop) / hero + identity (phone) */}
        <aside className="md:sticky md:top-6 md:w-[380px] md:shrink-0">
          {p.photo ? (
            <div className="relative h-[400px] md:h-auto">
              <Img src={p.photo} alt={p.name} style={{ objectPosition: focus }}
                className="block h-[400px] w-full object-cover md:aspect-[4/5] md:h-auto md:rounded-2xl" />
              <div className="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-b from-transparent to-black md:hidden" aria-hidden="true" />
            </div>
          ) : (
            <div className="h-28 md:hidden" aria-hidden="true" />
          )}
          <div className={`relative px-5 md:mt-5 md:px-0 ${p.photo ? "-mt-[92px] md:mt-5" : ""}`}>{identity}</div>
        </aside>

        {/* Content column */}
        <div className="mt-9 flex min-w-0 flex-1 flex-col gap-9 px-5 md:mt-0 md:px-0">
          {p.sets.length > 0 && (
            <Section title={<T k="sets" />} aside={<span className="text-xs text-[#8A8A99]"><Mixes n={p.sets.length} /></span>}>
              <SetsGrid sets={p.sets} />
            </Section>
          )}

          {p.releases.length > 0 && (
            <Section title={<T k="releases" />}>
              <div className="pp-scroller -mx-5 flex gap-3 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0">
                {p.releases.map((r) => {
                  const first = r.links?.map((l) => safeHttpUrl(l.url)).find(Boolean);
                  return (
                    <div key={`${r.title}-${r.year}`} className="flex w-[150px] shrink-0 flex-col gap-[7px] md:w-auto">
                      <a href={first || undefined} target="_blank" rel="noopener noreferrer" className="block">
                        {r.image
                          ? <Img src={r.image} loading="lazy" className="block aspect-square w-full rounded-lg border border-[#23232c] object-cover" />
                          : <span className="block aspect-square w-full rounded-lg border border-[#23232c] bg-[#15151B]" />}
                      </a>
                      <span className="truncate text-sm font-semibold">{r.title}</span>
                      <span className="truncate text-xs text-[#8A8A99]">{[r.label, r.year, r.type].filter(Boolean).join(" · ")}</span>
                      {r.links && r.links.length > 0 && (
                        <span className="flex flex-wrap gap-[5px]">
                          {r.links.map((l) => {
                            const href = safeHttpUrl(l.url);
                            return href ? (
                              <a key={l.store} href={href} target="_blank" rel="noopener noreferrer"
                                className="rounded bg-[#1A1A22] px-[7px] py-0.5 text-[10px] uppercase tracking-[0.06em] text-[#B9B9C6] hover:text-white">
                                {STORE_LABEL[l.store] || l.store}
                              </a>
                            ) : null;
                          })}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {p.highlights.length > 0 && (
            <section>
              <div className="mb-1.5"><H2><T k="highlights" /></H2></div>
              <ul className="m-0 list-none p-0">
                {p.highlights.map((h, i) => {
                  const ra = safeHttpUrl(h.raUrl);
                  return (
                    <li key={`${h.venue}-${h.year}-${i}`} className="flex items-baseline gap-3 border-b border-[#1C1C24] py-3">
                      <span className="min-w-0 flex-1 text-[15px] font-medium">
                        {ra ? <a href={ra} target="_blank" rel="noopener noreferrer" className="text-[#F4F4F6] hover:text-[#FF3366]">{h.venue}</a> : h.venue}
                      </span>
                      {h.city && <span className="text-xs text-[#8A8A99]">{h.city}</span>}
                      {h.year && <span className="text-xs tabular-nums text-[#8A8A99]">{h.year}</span>}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {p.videos.length > 0 && (
            <Section title={<T k="videos" />}>
              <VideosGrid videos={p.videos} />
            </Section>
          )}

          {pressPhotos.length > 0 && (
            <Section title={<T k="pressPhotos" />}>
              <div className="grid grid-cols-3 gap-1.5 md:gap-2">
                {pressPhotos.map((ph) => (
                  <a key={ph.url} href={ph.url} target="_blank" rel="noopener noreferrer" className="group block">
                    <Img src={ph.url} loading="lazy" alt={ph.credit ? `${p.name}, photo by ${ph.credit}` : `${p.name}, press photo`}
                      className="block aspect-[3/4] w-full rounded-md object-cover" />
                    {ph.credit && <span className="mt-1 block truncate text-[11px] text-[#8A8A99]"><PhotoBy name={ph.credit} /></span>}
                  </a>
                ))}
              </div>
            </Section>
          )}

          {p.pressKit && p.pressKit.files.length > 0 && (
            <section id="presskit">
              <div className="mb-1"><H2><T k="pressKit" /></H2></div>
              {p.pressKit.files.map((f, i) => (
                <a key={f.id} href={pressKitHref(f.url)} rel="noopener noreferrer"
                  className={`flex items-center justify-between py-3 text-sm text-[#F4F4F6] hover:text-[#FF3366] ${i < p.pressKit!.files.length - 1 ? "border-b border-[#1C1C24]" : ""}`}>
                  <span>{f.title}</span>
                  <span className="text-xs text-[#8A8A99]"><T k="download" /> ↓</span>
                </a>
              ))}
            </section>
          )}

          <footer className="mt-2 flex flex-col items-start gap-3.5 border-t border-[#1C1C24] pt-7">
            <span className="text-xs text-[#8A8A99]"><T k="identityChecked" /></span>
            <span className="font-[family-name:var(--font-space-grotesk)] text-[22px] font-bold leading-tight"><T k="joinLine1" /><br /><T k="joinLine2" /></span>
            <ApplyLink href="/apply?start=role" className="flex h-11 items-center rounded-[10px] bg-white px-[18px] text-sm font-semibold text-black"><T k="applyToJoin" /></ApplyLink>
          </footer>
        </div>
      </main>
    </div>
    </PageLang>
  );
}
