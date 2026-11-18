"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { normLang } from "@/lib/langCode";

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
  share: string;
  shareTitle: string;
  shareSub: (name: string) => string;
  shareText: (name: string) => string;
  igStory: string;
  igPost: string;
  imageSaved: string;
  linkReady: string;
  imageFailed: string;
  email: string;
  more: string;
  format: string;
  labelName: string;
  artist: string;
  agent: string;
  promoter: string;
  venue: string;
  connect: string;
  roster: string;
  photos: string;
  pastEvents: string;
  capacity: (n: number) => string;
  rooms: (n: number) => string;
  agencyArtists: (n: number) => string;
  verified: string;
  bio: string;
  fullBio: string;
  readFullBio: string;
  close: string;
  showLess: string;
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
    share: "Share", shareTitle: "Share this page", shareSub: (name) => `Send ${name}'s page to a promoter, a friend or your story`, shareText: (name) => `${name} on TORA`, igStory: "Instagram story", igPost: "Instagram post", imageSaved: "Image saved and link copied. Post it, then add a Link sticker and paste the link", linkReady: "Link copied. In Instagram, add a Link sticker and paste it", imageFailed: "The image couldn't be made. Try again in a moment", email: "Email", more: "More", format: "Format", labelName: "Label",
    artist: "Artist", verified: "Verified on TORA", bio: "Bio", fullBio: "Full bio", readFullBio: "Read full bio", close: "Close", showLess: "Show less", representedBy: "Represented by",
    agent: "Agent", promoter: "Promoter", venue: "Venue", connect: "Connect", roster: "Roster", photos: "Photos", pastEvents: "Past events", capacity: (n) => `${n.toLocaleString("en")} capacity`, rooms: (n) => `${n} ${n === 1 ? "room" : "rooms"}`, agencyArtists: (n) => `${n} ${n === 1 ? "artist" : "artists"}`,
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
    share: "シェア", shareTitle: "このページをシェア", shareSub: (name) => `${name}のページをプロモーターや友達、ストーリーズでシェア`, shareText: (name) => `TORAの${name}`, igStory: "Instagramストーリーズ", igPost: "Instagram投稿", imageSaved: "画像を保存し、リンクをコピーしました。投稿してリンクスタンプを追加し、リンクを貼り付けてください", linkReady: "リンクをコピーしました。Instagramでリンクスタンプを追加して貼り付けてください", imageFailed: "画像を作成できませんでした。しばらくしてからもう一度お試しください", email: "メール", more: "その他", format: "プレイスタイル", labelName: "レーベル",
    artist: "アーティスト", verified: "TORA認証済み", bio: "プロフィール文", fullBio: "プロフィール全文", readFullBio: "全文を読む", close: "閉じる", showLess: "閉じる", representedBy: "所属",
    agent: "エージェント", promoter: "プロモーター", venue: "ヴェニュー", connect: "つながる", roster: "所属アーティスト", photos: "写真", pastEvents: "過去のイベント", capacity: (n) => `キャパシティ${n.toLocaleString("ja")}人`, rooms: (n) => `${n}フロア`, agencyArtists: (n) => `アーティスト${n}組`,
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
    share: "分享", shareTitle: "分享此页面", shareSub: (name) => `把${name}的页面分享给主办方、朋友或发到快拍`, shareText: (name) => `${name} · TORA`, igStory: "Instagram 快拍", igPost: "Instagram 帖子", imageSaved: "图片已保存，链接已复制。发布后添加链接贴纸并粘贴链接", linkReady: "链接已复制。在 Instagram 中添加链接贴纸并粘贴", imageFailed: "无法生成图片，请稍后重试", email: "邮件", more: "更多", format: "演出形式", labelName: "厂牌",
    artist: "艺人", verified: "已通过 TORA 认证", bio: "简介", fullBio: "完整简介", readFullBio: "阅读完整简介", close: "关闭", showLess: "收起", representedBy: "经纪方",
    agent: "经纪人", promoter: "主办方", venue: "场地", connect: "建立联系", roster: "旗下艺人", photos: "照片", pastEvents: "往期活动", capacity: (n) => `容纳${n.toLocaleString("zh")}人`, rooms: (n) => `${n}个厅`, agencyArtists: (n) => `${n}位艺人`,
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
    share: "공유", shareTitle: "이 페이지 공유", shareSub: (name) => `${name}의 페이지를 프로모터, 친구 또는 스토리에 공유하세요`, shareText: (name) => `TORA의 ${name}`, igStory: "인스타그램 스토리", igPost: "인스타그램 게시물", imageSaved: "이미지를 저장하고 링크를 복사했습니다. 게시한 뒤 링크 스티커를 추가해 붙여넣으세요", linkReady: "링크를 복사했습니다. 인스타그램에서 링크 스티커를 추가해 붙여넣으세요", imageFailed: "이미지를 만들지 못했습니다. 잠시 후 다시 시도하세요", email: "이메일", more: "더보기", format: "플레이 방식", labelName: "레이블",
    artist: "아티스트", verified: "TORA 인증 완료", bio: "소개", fullBio: "전체 소개", readFullBio: "전체 소개 보기", close: "닫기", showLess: "접기", representedBy: "소속 에이전트",
    agent: "에이전트", promoter: "프로모터", venue: "베뉴", connect: "연결하기", roster: "소속 아티스트", photos: "사진", pastEvents: "지난 이벤트", capacity: (n) => `수용 인원 ${n.toLocaleString("ko")}명`, rooms: (n) => `룸 ${n}개`, agencyArtists: (n) => `아티스트 ${n}명`,
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
    share: "Compartir", shareTitle: "Comparte esta página", shareSub: (name) => `Envía la página de ${name} a un promotor, a un amigo o a tu story`, shareText: (name) => `${name} en TORA`, igStory: "Story de Instagram", igPost: "Post de Instagram", imageSaved: "Imagen guardada y enlace copiado. Publícala, añade un sticker de enlace y pega el enlace", linkReady: "Enlace copiado. En Instagram, añade un sticker de enlace y pégalo", imageFailed: "No se pudo crear la imagen. Inténtalo de nuevo en un momento", email: "Email", more: "Más", format: "Formato", labelName: "Sello",
    artist: "Artista", verified: "Verificado en TORA", bio: "Bio", fullBio: "Bio completa", readFullBio: "Leer bio completa", close: "Cerrar", showLess: "Ver menos", representedBy: "Representado por",
    agent: "Agente", promoter: "Promotor", venue: "Sala", connect: "Conectar", roster: "Roster", photos: "Fotos", pastEvents: "Eventos anteriores", capacity: (n) => `Aforo de ${n.toLocaleString("es")}`, rooms: (n) => `${n} ${n === 1 ? "sala" : "salas"}`, agencyArtists: (n) => `${n} ${n === 1 ? "artista" : "artistas"}`,
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
    share: "Partager", shareTitle: "Partager cette page", shareSub: (name) => `Envoie la page de ${name} à un promoteur, un ami ou en story`, shareText: (name) => `${name} sur TORA`, igStory: "Story Instagram", igPost: "Post Instagram", imageSaved: "Image enregistrée et lien copié. Publie-la, ajoute un sticker lien et colle le lien", linkReady: "Lien copié. Dans Instagram, ajoute un sticker lien et colle-le", imageFailed: "Impossible de créer l'image. Réessaie dans un instant", email: "E-mail", more: "Plus", format: "Format", labelName: "Label",
    artist: "Artiste", verified: "Vérifié sur TORA", bio: "Bio", fullBio: "Bio complète", readFullBio: "Lire la bio complète", close: "Fermer", showLess: "Voir moins", representedBy: "Représenté par",
    agent: "Agent", promoter: "Promoteur", venue: "Lieu", connect: "Se connecter", roster: "Roster", photos: "Photos", pastEvents: "Événements passés", capacity: (n) => `Capacité ${n.toLocaleString("fr")}`, rooms: (n) => `${n} ${n === 1 ? "salle" : "salles"}`, agencyArtists: (n) => `${n} ${n === 1 ? "artiste" : "artistes"}`,
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
    share: "Condividi", shareTitle: "Condividi questa pagina", shareSub: (name) => `Manda la pagina di ${name} a un promoter, a un amico o nelle storie`, shareText: (name) => `${name} su TORA`, igStory: "Storia Instagram", igPost: "Post Instagram", imageSaved: "Immagine salvata e link copiato. Pubblicala, aggiungi lo sticker link e incolla il link", linkReady: "Link copiato. Su Instagram aggiungi lo sticker link e incollalo", imageFailed: "Impossibile creare l'immagine. Riprova tra poco", email: "Email", more: "Altro", format: "Formato", labelName: "Etichetta",
    artist: "Artista", verified: "Verificato su TORA", bio: "Bio", fullBio: "Bio completa", readFullBio: "Leggi la bio completa", close: "Chiudi", showLess: "Mostra meno", representedBy: "Rappresentato da",
    agent: "Agente", promoter: "Promoter", venue: "Venue", connect: "Connettiti", roster: "Roster", photos: "Foto", pastEvents: "Eventi passati", capacity: (n) => `Capienza ${n.toLocaleString("it")}`, rooms: (n) => `${n} ${n === 1 ? "sala" : "sale"}`, agencyArtists: (n) => `${n} ${n === 1 ? "artista" : "artisti"}`,
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
    share: "Compartilhar", shareTitle: "Compartilhe esta página", shareSub: (name) => `Envie a página de ${name} para um promoter, um amigo ou nos seus stories`, shareText: (name) => `${name} na TORA`, igStory: "Story do Instagram", igPost: "Post do Instagram", imageSaved: "Imagem salva e link copiado. Publique, adicione um sticker de link e cole o link", linkReady: "Link copiado. No Instagram, adicione um sticker de link e cole", imageFailed: "Não foi possível criar a imagem. Tente de novo em instantes", email: "E-mail", more: "Mais", format: "Formato", labelName: "Selo",
    artist: "Artista", verified: "Verificado na TORA", bio: "Bio", fullBio: "Bio completa", readFullBio: "Ler bio completa", close: "Fechar", showLess: "Ver menos", representedBy: "Representado por",
    agent: "Agente", promoter: "Promoter", venue: "Casa", connect: "Conectar", roster: "Roster", photos: "Fotos", pastEvents: "Eventos anteriores", capacity: (n) => `Capacidade de ${n.toLocaleString("pt-BR")}`, rooms: (n) => `${n} ${n === 1 ? "pista" : "pistas"}`, agencyArtists: (n) => `${n} ${n === 1 ? "artista" : "artistas"}`,
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
// The language doesn't change while the page is open.
const noSubscribe = () => () => {};

export function PageLang({ children }: { children: ReactNode }) {
  // English on the server and during hydration, the visitor's language right after.
  const lang = useSyncExternalStore(noSubscribe, detect, () => "EN" as Lang);
  useEffect(() => {
    document.documentElement.lang = normLang(lang);
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

type CountKey = "capacity" | "rooms" | "agencyArtists";

/** A counted label ("600 capacity", "3 rooms"), in the visitor's language. */
export function Count({ k, n }: { k: CountKey; n: number }) {
  return <>{useLabels().t[k](n)}</>;
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
