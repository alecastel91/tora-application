"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useLabels } from "./i18n";

/* Share on the public page: the page as an Instagram story or feed image
   (shared straight to the apps where the phone allows it, downloaded
   otherwise), the usual channels, and the link. */

type Kind = "story" | "post";

const Glyph = ({ d, stroke }: { d: string; stroke?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"
    {...(stroke ? { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const } : { fill: "currentColor" })}>
    <path d={d} />
  </svg>
);

// Brand marks from Simple Icons (CC0).
const WHATSAPP = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z";
const X_MARK = "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z";
const FACEBOOK = "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z";
const TELEGRAM = "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z";
const MAIL = "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm18 2-10 7L2 6";
const LINK = "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71";
const MORE = "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13";
export const SHARE_GLYPH = MORE;

export function ShareButton({ name, slug, url }: { name: string; slug: string; url: string }) {
  const { t } = useLabels();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={t.share} title={t.share}
        className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl border border-[#33333D] text-white transition-colors hover:border-white/50">
        <Glyph d={SHARE_GLYPH} stroke />
      </button>
      {open && <ShareSheet name={name} slug={slug} url={url} onClose={() => setOpen(false)} />}
    </>
  );
}

function ShareSheet({ name, slug, url, onClose }: { name: string; slug: string; url: string; onClose: () => void }) {
  const { t } = useLabels();
  const [busy, setBusy] = useState<Kind | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const card = (kind: Kind) => `/p/${slug}/card/${kind}`;
  const text = t.shareText(name);
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = overflow; };
  }, [onClose]);

  // The image goes to the phone's share sheet (Instagram → Story/Feed) when
  // the browser can share files; elsewhere it downloads.
  const shareImage = async (kind: Kind) => {
    if (busy) return;
    setBusy(kind);
    setNote(null);
    // Instagram can't take a link with the image: copy it now (still inside the
    // tap) so it is one paste into the Link sticker.
    const linkCopied = await navigator.clipboard?.writeText(url).then(() => true, () => false);
    try {
      const blob = await (await fetch(card(kind))).blob();
      const file = new File([blob], `${slug}-tora-${kind}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] }).catch(() => {});
        if (linkCopied) setNote(t.linkReady);
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = file.name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        setNote(t.imageSaved);
      }
    } catch {
      setNote(t.imageFailed);
    } finally {
      setBusy(null);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt(t.copyPrompt, url);
    }
  };

  const u = encodeURIComponent(url);
  const tx = encodeURIComponent(text);
  const channels: { key: string; label: string; icon: ReactNode; href?: string; onClick?: () => void }[] = [
    { key: "wa", label: "WhatsApp", icon: <Glyph d={WHATSAPP} />, href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}` },
    { key: "x", label: "X", icon: <Glyph d={X_MARK} />, href: `https://x.com/intent/post?text=${tx}&url=${u}` },
    { key: "fb", label: "Facebook", icon: <Glyph d={FACEBOOK} />, href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { key: "tg", label: "Telegram", icon: <Glyph d={TELEGRAM} />, href: `https://t.me/share/url?url=${u}&text=${tx}` },
    { key: "mail", label: t.email, icon: <Glyph d={MAIL} stroke />, href: `mailto:?subject=${tx}&body=${encodeURIComponent(`${text}\n${url}`)}` },
    ...(canNativeShare ? [{ key: "more", label: t.more, icon: <Glyph d={MORE} stroke />, onClick: () => { navigator.share({ title: text, url }).catch(() => {}); } }] : []),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 md:items-center" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={t.shareTitle} onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-[#2A2A33] bg-[#0c0c11] px-5 pb-7 pt-5 md:max-w-[480px] md:rounded-2xl md:px-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="m-0 font-[family-name:var(--font-space-grotesk)] text-[22px] font-bold text-[#F4F4F6]">{t.shareTitle}</h2>
            <p className="m-0 mt-1 text-sm text-[#8A8A99]">{t.shareSub(name)}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t.close} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#2A2A33] text-[#B9B9C6] hover:text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {(["story", "post"] as Kind[]).map((kind) => (
            <button key={kind} type="button" onClick={() => shareImage(kind)} disabled={busy !== null}
              className="group flex flex-col items-stretch gap-2 text-left disabled:opacity-60">
              <span className="flex h-[210px] items-center justify-center overflow-hidden rounded-xl border border-[#23232c] bg-[#15151b]">
                {/* eslint-disable-next-line @next/next/no-img-element -- generated on the fly */}
                <img src={card(kind)} alt="" loading="lazy" className={`block h-full object-cover ${kind === "story" ? "aspect-[9/16]" : "aspect-[4/5]"}`} />
              </span>
              <span className="text-[13px] font-semibold text-[#F4F4F6] group-hover:text-[#FF3366]">
                {busy === kind ? "…" : kind === "story" ? t.igStory : t.igPost}
              </span>
            </button>
          ))}
        </div>
        {note && <p className="m-0 mt-3 text-xs leading-relaxed text-[#B9B9C6]" aria-live="polite">{note}</p>}

        <div className="mt-6 grid grid-cols-4 gap-y-4">
          {channels.map((c) => {
            const body = (
              <>
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#2A2A33] bg-[#15151b] text-white">{c.icon}</span>
                <span className="text-[11px] text-[#B9B9C6]">{c.label}</span>
              </>
            );
            return c.href ? (
              <a key={c.key} href={c.href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 hover:[&>span:first-child]:border-white/40">{body}</a>
            ) : (
              <button key={c.key} type="button" onClick={c.onClick} className="flex flex-col items-center gap-1.5 hover:[&>span:first-child]:border-white/40">{body}</button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-xl border border-[#2A2A33] bg-[#101015] py-1.5 pl-3.5 pr-1.5">
          <span className="min-w-0 flex-1 truncate text-sm text-[#E4E4EA]">{url.replace(/^https?:\/\/(www\.)?/, "")}</span>
          <button type="button" onClick={copy} className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 text-[13px] font-semibold text-black">
            <Glyph d={LINK} stroke />
            <span aria-live="polite">{copied ? t.copied : t.copyLink}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
