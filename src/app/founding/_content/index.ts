import type { FoundingContent, LangCode } from "./types";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { it } from "./it";
import { pt } from "./pt";
import { jp } from "./jp";
import { cn } from "./cn";
import { kr } from "./kr";

export const CONTENT: Record<LangCode, FoundingContent> = {
  en,
  es,
  fr,
  it,
  pt,
  jp,
  cn,
  kr,
};

export { LANGS } from "./types";
export type { FoundingContent, LangCode } from "./types";
