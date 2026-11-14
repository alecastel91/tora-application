"use client";

import { useEffect, useState } from "react";
import type { MediaItem } from "@/lib/publicProfile";
import { PROVIDER_LABEL } from "@/lib/publicProfile";

/* The interactive bits of a public artist page: the sets mini-player, videos
   that play where their preview is, and Copy link. Player rules mirror the
   app's utils/mediaLinks.js playerUrl — items are sanitised by the backend,
   so provider and host already agree. */

const parse = (link?: string | null) => {
  try { return new URL(String(link || "").trim()); } catch { return null; }
};

export function youtubeId(link?: string | null): string | null {
  const u = parse(link);
  if (!u) return null;
  const host = u.hostname.toLowerCase().replace(/^(www\.|m\.|music\.)/, "");
  let id: string | null | undefined = null;
  if (host === "youtu.be") id = u.pathname.slice(1).split("/")[0];
  else if (host === "youtube.com") id = u.searchParams.get("v") || (u.pathname.match(/^\/(?:live|shorts|embed)\/([^/?#]+)/) || [])[1];
  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}

/** The embed for one set or video; autoplays because it only opens on a tap. */
function playerUrl(item: MediaItem): string | null {
  const u = parse(item.url);
  if (!u) return null;
  switch (item.provider) {
    case "soundcloud": {
      if (!/^(m\.|www\.)?soundcloud\.com$/i.test(u.hostname)) return null;
      u.hostname = "soundcloud.com";
      return `https://w.soundcloud.com/player/?url=${encodeURIComponent(u.toString())}&color=%23ff3366&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`;
    }
    case "mixcloud":
      return `https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&autoplay=1&feed=${encodeURIComponent(u.pathname)}`;
    case "youtube": {
      const id = youtubeId(item.url);
      return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&controls=1&playsinline=1` : null;
    }
    case "vimeo": {
      const id = (u.pathname.match(/\/(\d+)/) || [])[1];
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
    }
    default:
      return null;
  }
}

const PlayGlyph = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
);

const Art = ({ src, label, className }: { src?: string | null; label: string; className: string }) =>
  src ? (
    // eslint-disable-next-line @next/next/no-img-element -- artwork comes from many stores' CDNs
    <img src={src} alt="" loading="lazy" className={`block object-cover ${className}`} />
  ) : (
    <span className={`flex items-center justify-center bg-[#15151b] font-[family-name:var(--font-space-grotesk)] text-[10px] uppercase tracking-[0.15em] text-white/30 ${className}`}>{label}</span>
  );

/** Sets: a swipe row on the phone, a grid on desktop; one player bar at the bottom. */
export function SetsGrid({ sets }: { sets: MediaItem[] }) {
  const [playing, setPlaying] = useState<MediaItem | null>(null);
  const src = playing ? playerUrl(playing) : null;

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPlaying(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing]);

  return (
    <>
      <div className="pp-scroller -mx-5 flex gap-3 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0">
        {sets.map((s) => {
          const label = PROVIDER_LABEL[s.provider] || s.provider;
          return (
            <button key={s.url} type="button" onClick={() => setPlaying(s)} className="group w-[200px] shrink-0 text-left md:w-auto">
              <span className="relative block">
                <Art src={s.image} label={label} className="aspect-square w-full rounded-[10px] border border-[#23232c]" />
                <span className="absolute bottom-2.5 right-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#FF3366] text-white transition-transform group-hover:scale-105">
                  <PlayGlyph />
                </span>
              </span>
              <span className="mt-2 block truncate text-sm font-semibold text-[#F4F4F6]">{s.title || label}</span>
              <span className="block text-xs text-[#8A8A99]">{label}</span>
            </button>
          );
        })}
      </div>
      {playing && src && (
        <div role="region" aria-label={playing.title || PROVIDER_LABEL[playing.provider]} className="fixed inset-x-2.5 bottom-4 z-50 mx-auto max-w-[560px] overflow-hidden rounded-[14px] border border-[#2A2A33] bg-[rgba(22,22,28,0.97)] shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-3 px-3 py-2">
            <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-white">{playing.title || PROVIDER_LABEL[playing.provider]}</span>
            <a href={playing.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-[11px] text-white/50 hover:text-white">
              {PROVIDER_LABEL[playing.provider]} ↗
            </a>
            <button type="button" onClick={() => setPlaying(null)} aria-label="Close player" className="flex h-8 w-8 items-center justify-center text-[#8A8A99] hover:text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <iframe key={src} src={src} title={playing.title || PROVIDER_LABEL[playing.provider]} allow="autoplay; encrypted-media" className="block h-[120px] w-full border-0" />
        </div>
      )}
    </>
  );
}

/** Videos play right where their preview is, with the provider's own controls. */
export function VideosGrid({ videos }: { videos: MediaItem[] }) {
  const [playing, setPlaying] = useState<string | null>(null);
  return (
    <div className="pp-scroller -mx-5 flex gap-3 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0">
      {videos.map((v) => {
        const label = PROVIDER_LABEL[v.provider] || v.provider;
        const src = playing === v.url ? playerUrl(v) : null;
        const yt = youtubeId(v.url);
        const thumb = v.image || (yt ? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` : null);
        return (
          <div key={v.url} className="w-[280px] shrink-0 md:w-auto">
            {src ? (
              <iframe src={src} title={v.title || label} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen className="block aspect-video w-full rounded-[10px] border-0 bg-black" />
            ) : (
              <button type="button" onClick={() => setPlaying(v.url)} className="group relative block w-full">
                <Art src={thumb} label={label} className="aspect-video w-full rounded-[10px] border border-[#23232c]" />
                <span className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FF3366] text-white transition-transform group-hover:scale-105">
                  <PlayGlyph />
                </span>
                <span className="sr-only">Play {v.title || label}</span>
              </button>
            )}
            <span className="mt-2 block truncate text-sm font-semibold text-[#F4F4F6]">{v.title || label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard blocked (old browser, insecure context): fall back to the share sheet or a prompt.
      if (navigator.share) { navigator.share({ url }).catch(() => {}); return; }
      window.prompt("Copy this link", url);
      return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button type="button" onClick={copy} className="flex h-[50px] shrink-0 items-center gap-2 rounded-xl border border-[#33333D] px-4 text-[15px] font-semibold text-white transition-colors hover:border-white/50">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      <span aria-live="polite">{copied ? "Copied" : "Copy link"}</span>
    </button>
  );
}
