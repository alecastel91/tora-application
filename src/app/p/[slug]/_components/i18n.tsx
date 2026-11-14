"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";

/* Labels of the public artist page in the site's 8 languages. Typed like the
   /founding content: a missing label in any language fails the build. Section
   names, play styles and "Represented by" are the app's own wording
   (tora-app translations, artistPage.* / profile.representedBy); "Apply to
   join" is the website's reviewed apply_for_membership. Brand terms stay
   English. Headlines never end with a full stop.

   The page is rendered in English (what search engines index); on the
   visitor's browser it switches to their saved site language, else their
   browser's language. */

export type Lang = "EN" | "JP" | "CN" | "KR" | "ES" | "FR" | "IT" | "PT";

type Labels = {
  memberSignIn: string;
  applyToJoin: string;
  book: string;
  copyLink: string;
  copied: string;
  copyPrompt: string;
  artist: string;
  verified: string;
  bio: string;
  representedBy: string;
  sets: string;
  mixes: (n: number) => string;
  releases: string;
  highlights: string;
  videos: string;
  play: string;
  closePlayer: string;
  pressPhotos: string;
  photoBy: (name: string) => string;
  pressKit: string;
  download: string;
  identityChecked: string;
  joinLine1: string;
  joinLine2: string;
  play_DJ_SET: string;
  play_VINYL: string;
  play_HYBRID: string;
  play_LIVE: string;
};

const L: Record<Lang, Labels> = {
  EN: {
    memberSignIn: "Member sign in", applyToJoin: "Apply to join", book: "Book",
    copyLink: "Copy link", copied: "Copied", copyPrompt: "Copy this link",
    artist: "Artist", verified: "Verified on TORA", bio: "Bio", representedBy: "Represented by",
    sets: "Sets", mixes: (n) => `${n} ${n === 1 ? "mix" : "mixes"}`, releases: "Releases", highlights: "Highlights",
    videos: "Videos", play: "Play", closePlayer: "Close player", pressPhotos: "Press photos",
    photoBy: (name) => `Photo: ${name}`, pressKit: "Press kit", download: "Download",
    identityChecked: "Every TORA profile is identity-checked before it can go public.",
    joinLine1: "In the scene?", joinLine2: "Join TORA",
    play_DJ_SET: "DJ set", play_VINYL: "Vinyl only", play_HYBRID: "Hybrid", play_LIVE: "Live",
  },
  JP: {
    memberSignIn: "メンバーログイン", applyToJoin: "参加を申し込む", book: "ブッキングする",
    copyLink: "リンクをコピー", copied: "コピーしました", copyPrompt: "このリンクをコピーしてください",
    artist: "アーティスト", verified: "TORA認証済み", bio: "プロフィール文", representedBy: "所属",
    sets: "セット", mixes: (n) => `${n}本のミックス`, releases: "リリース", highlights: "ハイライト",
    videos: "動画", play: "再生", closePlayer: "プレーヤーを閉じる", pressPhotos: "プレス写真",
    photoBy: (name) => `撮影：${name}`, pressKit: "プレスキット", download: "ダウンロード",
    identityChecked: "TORAのプロフィールはすべて、公開前に本人確認を行っています。",
    joinLine1: "シーンにいるなら", joinLine2: "TORAに参加しよう",
    play_DJ_SET: "DJセット", play_VINYL: "レコードのみ", play_HYBRID: "ハイブリッド", play_LIVE: "ライブ",
  },
  CN: {
    memberSignIn: "会员登录", applyToJoin: "申请加入", book: "预订",
    copyLink: "复制链接", copied: "已复制", copyPrompt: "复制此链接",
    artist: "艺人", verified: "已通过 TORA 认证", bio: "简介", representedBy: "经纪方",
    sets: "Set", mixes: (n) => `${n} 个混音`, releases: "发行作品", highlights: "亮点",
    videos: "视频", play: "播放", closePlayer: "关闭播放器", pressPhotos: "媒体照片",
    photoBy: (name) => `摄影：${name}`, pressKit: "媒体资料包", download: "下载",
    identityChecked: "每个 TORA 主页在公开前都经过身份验证。",
    joinLine1: "身在圈中？", joinLine2: "加入 TORA",
    play_DJ_SET: "DJ Set", play_VINYL: "仅黑胶", play_HYBRID: "混合", play_LIVE: "现场演出",
  },
  KR: {
    memberSignIn: "회원 로그인", applyToJoin: "가입 신청", book: "부킹하기",
    copyLink: "링크 복사", copied: "복사됨", copyPrompt: "이 링크를 복사하세요",
    artist: "아티스트", verified: "TORA 인증 완료", bio: "소개", representedBy: "소속 에이전트",
    sets: "세트", mixes: (n) => `믹스 ${n}개`, releases: "발매작", highlights: "하이라이트",
    videos: "영상", play: "재생", closePlayer: "플레이어 닫기", pressPhotos: "프레스 사진",
    photoBy: (name) => `사진: ${name}`, pressKit: "프레스 키트", download: "다운로드",
    identityChecked: "모든 TORA 프로필은 공개 전에 본인 확인을 거칩니다.",
    joinLine1: "씬에 있다면", joinLine2: "TORA에 합류하세요",
    play_DJ_SET: "DJ 세트", play_VINYL: "바이닐만", play_HYBRID: "하이브리드", play_LIVE: "라이브",
  },
  ES: {
    memberSignIn: "Acceso miembros", applyToJoin: "Solicita tu acceso", book: "Contratar",
    copyLink: "Copiar enlace", copied: "Copiado", copyPrompt: "Copia este enlace",
    artist: "Artista", verified: "Verificado en TORA", bio: "Bio", representedBy: "Representado por",
    sets: "Sets", mixes: (n) => `${n} ${n === 1 ? "mix" : "mixes"}`, releases: "Lanzamientos", highlights: "Destacados",
    videos: "Vídeos", play: "Reproducir", closePlayer: "Cerrar reproductor", pressPhotos: "Fotos de prensa",
    photoBy: (name) => `Foto: ${name}`, pressKit: "Press kit", download: "Descargar",
    identityChecked: "Cada perfil de TORA pasa una verificación de identidad antes de hacerse público.",
    joinLine1: "¿Estás en la escena?", joinLine2: "Únete a TORA",
    play_DJ_SET: "DJ set", play_VINYL: "Solo vinilo", play_HYBRID: "Híbrido", play_LIVE: "Live",
  },
  FR: {
    memberSignIn: "Connexion membre", applyToJoin: "Devenir membre", book: "Booker",
    copyLink: "Copier le lien", copied: "Copié", copyPrompt: "Copiez ce lien",
    artist: "Artiste", verified: "Vérifié sur TORA", bio: "Bio", representedBy: "Représenté par",
    sets: "Sets", mixes: (n) => `${n} mix`, releases: "Sorties", highlights: "Temps forts",
    videos: "Vidéos", play: "Lire", closePlayer: "Fermer le lecteur", pressPhotos: "Photos presse",
    photoBy: (name) => `Photo : ${name}`, pressKit: "Press kit", download: "Télécharger",
    identityChecked: "Chaque profil TORA fait l'objet d'une vérification d'identité avant d'être rendu public.",
    joinLine1: "Vous êtes dans la scène ?", joinLine2: "Rejoignez TORA",
    play_DJ_SET: "DJ set", play_VINYL: "Vinyle uniquement", play_HYBRID: "Hybride", play_LIVE: "Live",
  },
  IT: {
    memberSignIn: "Accesso membri", applyToJoin: "Candidati per entrare", book: "Ingaggia",
    copyLink: "Copia link", copied: "Copiato", copyPrompt: "Copia questo link",
    artist: "Artista", verified: "Verificato su TORA", bio: "Bio", representedBy: "Rappresentato da",
    sets: "Set", mixes: (n) => `${n} mix`, releases: "Uscite", highlights: "Momenti salienti",
    videos: "Video", play: "Riproduci", closePlayer: "Chiudi il player", pressPhotos: "Foto stampa",
    photoBy: (name) => `Foto: ${name}`, pressKit: "Press kit", download: "Scarica",
    identityChecked: "Ogni profilo TORA supera una verifica d'identità prima di diventare pubblico.",
    joinLine1: "Fai parte della scena?", joinLine2: "Entra in TORA",
    play_DJ_SET: "DJ set", play_VINYL: "Solo vinile", play_HYBRID: "Ibrido", play_LIVE: "Live",
  },
  PT: {
    memberSignIn: "Login de membro", applyToJoin: "Candidate-se a Membro", book: "Contratar",
    copyLink: "Copiar link", copied: "Copiado", copyPrompt: "Copie este link",
    artist: "Artista", verified: "Verificado na TORA", bio: "Bio", representedBy: "Representado por",
    sets: "Sets", mixes: (n) => `${n} ${n === 1 ? "mix" : "mixes"}`, releases: "Lançamentos", highlights: "Destaques",
    videos: "Vídeos", play: "Reproduzir", closePlayer: "Fechar player", pressPhotos: "Fotos de imprensa",
    photoBy: (name) => `Foto: ${name}`, pressKit: "Press kit", download: "Baixar",
    identityChecked: "Todo perfil da TORA passa por verificação de identidade antes de ficar público.",
    joinLine1: "Você faz parte da cena?", joinLine2: "Entre na TORA",
    play_DJ_SET: "DJ set", play_VINYL: "Só vinil", play_HYBRID: "Híbrido", play_LIVE: "Live",
  },
};

const LANGS = Object.keys(L) as Lang[];
// Browser language → site code (the site's codes, not ISO: JP/CN/KR).
const FROM_BROWSER: Record<string, Lang> = { en: "EN", ja: "JP", zh: "CN", ko: "KR", es: "ES", fr: "FR", it: "IT", pt: "PT" };
// The apply form's ?lang= takes lower-case site codes (see /founding CTAs).
export const applyLang = (lang: Lang) => lang.toLowerCase();

function detect(): Lang {
  try {
    const q = new URLSearchParams(window.location.search).get("lang")?.toUpperCase();
    if (q && LANGS.includes(q as Lang)) return q as Lang;
    const saved = localStorage.getItem("tora-language");
    if (saved && LANGS.includes(saved as Lang)) return saved as Lang;
  } catch {
    /* storage blocked: fall through to the browser language */
  }
  for (const l of navigator.languages || [navigator.language]) {
    const code = FROM_BROWSER[String(l).slice(0, 2).toLowerCase()];
    if (code) return code;
  }
  return "EN";
}

const Cx = createContext<Lang>("EN");
const HTML_LANG: Record<Lang, string> = { EN: "en", JP: "ja", CN: "zh", KR: "ko", ES: "es", FR: "fr", IT: "it", PT: "pt" };
// The language doesn't change while the page is open.
const noSubscribe = () => () => {};

export function PageLang({ children }: { children: ReactNode }) {
  // English on the server and during hydration, the visitor's language right after.
  const lang = useSyncExternalStore(noSubscribe, detect, () => "EN" as Lang);
  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
  }, [lang]);
  return <Cx.Provider value={lang}>{children}</Cx.Provider>;
}

export const useLabels = () => {
  const lang = useContext(Cx);
  return { lang, t: L[lang] };
};

type TextKey = { [K in keyof Labels]: Labels[K] extends string ? K : never }[keyof Labels];

/** One label, for use inside the server-rendered page. */
export function T({ k }: { k: TextKey }) {
  return <>{useLabels().t[k]}</>;
}

export function Mixes({ n }: { n: number }) {
  return <>{useLabels().t.mixes(n)}</>;
}

export function PhotoBy({ name }: { name: string }) {
  return <>{useLabels().t.photoBy(name)}</>;
}

/** A link to the apply form that opens in the visitor's language. */
export function ApplyLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  const { lang } = useLabels();
  const url = lang === "EN" ? href : `${href}${href.includes("?") ? "&" : "?"}lang=${applyLang(lang)}`;
  return <a href={url} className={className}>{children}</a>;
}
