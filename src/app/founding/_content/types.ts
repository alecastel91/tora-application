/**
 * Self-contained content model for the /founding presentation. Each supported
 * language exports one `FoundingContent` object of this exact shape, so
 * TypeScript enforces full parity across translations. Role/feature *labels*
 * that appear inside the app screenshots (Artist, Agent, Promoter, Venue,
 * "TORA", "Tour Kickstart", "Where music meets") intentionally stay in English.
 */

export type LangCode = "en" | "es" | "fr" | "it" | "pt" | "jp" | "cn" | "kr";

export const LANGS: { code: LangCode; native: string }[] = [
  { code: "en", native: "English" },
  { code: "es", native: "Español" },
  { code: "fr", native: "Français" },
  { code: "it", native: "Italiano" },
  { code: "pt", native: "Português" },
  { code: "jp", native: "日本語" },
  { code: "cn", native: "中文" },
  { code: "kr", native: "한국어" },
];

export interface TitleBody {
  title: string;
  body: string;
}

/** Translatable slice of a HomeDrawer entry (kind/color/shot/video stay in code). */
export interface DrawerText {
  label: string;
  title: string;
  body: string;
}

export type DrawerId =
  | "discover"
  | "connect"
  | "offer"
  | "contract"
  | "confirmed"
  | "travel"
  | "tour";

export interface FoundingContent {
  hero: {
    eyebrow: string;
    title: string;
    subline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    footer: string;
  };
  problem: {
    eyebrow: string;
    heading: string;
    items: TitleBody[]; // 4
  };
  solution: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
    body: string;
    chooseRole: string;
    tapToExplore: string;
    allRoles: string;
  };
  /** 4 role blurbs, order: artist, agent, promoter, venue. */
  roles: { body: string }[];
  /** 4 role deep-dives, same order. */
  deepdives: { headline: [string, string]; body: string; points: string[] }[];
  journey: {
    eyebrow: string;
    heading: string;
    steps: TitleBody[]; // 5
  };
  touring: {
    eyebrow: string;
    heading: string;
    body: string;
    tiles: TitleBody[]; // 2
  };
  why: {
    eyebrow: string;
    headingLead: string;
    headingAccent: string;
    body: string;
  };
  cta: {
    eyebrow: string;
    headingLine1: string;
    headingLine2: string;
    body: string;
    cards: TitleBody[]; // 2
    button: string;
    foot: string;
  };
  drawer: {
    role: string;
    feature: string;
    join: string;
    scroll: string;
    items: Record<DrawerId, DrawerText>;
  };
  chapters: {
    intro: string;
    pitch: string;
    how: string;
    touring: string;
    why: string;
    join: string;
  };
  ui: { language: string };
}
