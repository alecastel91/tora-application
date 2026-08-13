import type { ReactNode } from "react";

/**
 * Home-page narrative data. Roles are reframed as one-line VALUE props (not the
 * paragraph copy on /roles); the 10 platform features are regrouped into 5
 * SOLUTIONS, ordered as the chronological booking pipeline:
 * Discover → Connect → Book → Contract → Tour.
 *
 * Icons are a bespoke set (not the stock outlines used on /roles & /features):
 * one geometric language across all nine — 1.25px strokes, orbital/line motifs
 * echoing the TORA globe, a single accent element per mark. Role icons carry the
 * role color; solution icons are infrared with a white secondary layer.
 */

export type Role = {
  id: string;
  /** Role name shown on the card — English brand term, same as /founding. */
  label: string;
  labelKey: string; // existing key, e.g. role_artists_title
  valueKey: string; // new key, e.g. home_role_artist_value
  descKey: string; // founding-page role sentence, e.g. home_role_artist_desc
  color: string;
  icon: ReactNode;
};

export type Solution = {
  id: string;
  titleKey: string;
  descKey: string;
  icon: ReactNode;
};

export type JourneyStep = {
  id: string; // HomeDrawer entry id
  titleKey: string;
  descKey: string;
  icon: ReactNode;
};

const stroke = (color: string, width = 1.25) =>
  ({ fill: "none", stroke: color, strokeWidth: width, strokeLinecap: "round", strokeLinejoin: "round" } as const);

export const ROLES: Role[] = [
  {
    id: "artist",
    label: "Artist",
    labelKey: "role_artists_title",
    valueKey: "home_role_artist_value",
    descKey: "home_role_artist_desc",
    color: "#6B5FFF",
    icon: (
      // The artist — headphones (standardized icon)
      <svg width="30" height="30" viewBox="0 0 24 24" {...stroke("#6B5FFF", 1.4)}>
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <rect x="3" y="14" width="4" height="6" rx="1.5" />
        <rect x="17" y="14" width="4" height="6" rx="1.5" />
      </svg>
    ),
  },
  {
    id: "agent",
    label: "Agent",
    labelKey: "role_agents_title",
    valueKey: "home_role_agent_value",
    descKey: "home_role_agent_desc",
    color: "#00C875",
    icon: (
      // The agent — one person representing another
      <svg width="30" height="30" viewBox="0 0 24 24" {...stroke("#00C875", 1.4)}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 19.5c0-3.3 2.7-5.7 6-5.7s6 2.4 6 5.7" />
        <circle cx="16.8" cy="9" r="2.4" opacity="0.5" />
        <path d="M16.6 13.9c2.6.4 4.4 2.5 4.4 5.1" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "promoter",
    label: "Promoter",
    labelKey: "role_promoters_title",
    valueKey: "home_role_promoter_value",
    descKey: "home_role_promoter_desc",
    color: "#FFB800",
    icon: (
      // The promoter — a megaphone, sound leaving the horn
      <svg width="30" height="30" viewBox="0 0 24 24" {...stroke("#FFB800", 1.4)}>
        <path d="M17.5 4 6.8 8.6H4.2a1.7 1.7 0 0 0-1.7 1.7v3.4a1.7 1.7 0 0 0 1.7 1.7h2.6L17.5 20z" />
        <path d="M7.2 15.6v3.2a1.2 1.2 0 0 0 1.2 1.2h1.4" opacity="0.5" />
        <path d="M20.2 9.2a4.2 4.2 0 0 1 0 5.6" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "venue",
    label: "Venue",
    labelKey: "role_venues_title",
    valueKey: "home_role_venue_value",
    descKey: "home_role_venue_desc",
    color: "#FF5757",
    icon: (
      // The venue — house / entrance (standardized icon)
      <svg width="30" height="30" viewBox="0 0 24 24" {...stroke("#FF5757", 1.4)}>
        <path d="M4 20V9l8-5 8 5v11" />
        <path d="M9 20v-5a3 3 0 0 1 6 0v5" />
      </svg>
    ),
  },
];

const INFRARED = "#FF3366";
const GHOST = "rgba(255,255,255,0.45)";

export const SOLUTIONS: Solution[] = [
  {
    id: "discover",
    titleKey: "home_solution_discover_title",
    descKey: "home_solution_discover_desc",
    icon: (
      // Search — a magnifier with a live result inside the lens
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke(INFRARED)}>
        <circle cx="10.8" cy="10.8" r="5.8" stroke={GHOST} />
        <path d="M15.1 15.1 20 20" stroke={GHOST} />
        <path d="M8 10.8a2.8 2.8 0 0 1 2.8-2.8" opacity="0.9" />
        <circle cx="12.6" cy="12.2" r="1" fill={INFRARED} stroke="none" />
      </svg>
    ),
  },
  {
    id: "connect",
    titleKey: "home_solution_connect_title",
    descKey: "home_solution_connect_desc",
    icon: (
      // Messaging — a chat bubble, conversation live
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke(INFRARED)}>
        <path d="M20.5 14a2 2 0 0 1-2 2H8.2L4 19.5v-13a2 2 0 0 1 2-2h12.5a2 2 0 0 1 2 2z" stroke={GHOST} />
        <circle cx="8.8" cy="10.3" r="0.8" fill="rgba(255,255,255,0.35)" stroke="none" />
        <circle cx="12.2" cy="10.3" r="0.95" fill={INFRARED} stroke="none" />
        <circle cx="15.6" cy="10.3" r="0.8" fill="rgba(255,255,255,0.35)" stroke="none" />
      </svg>
    ),
  },
  {
    id: "book",
    titleKey: "home_solution_book_title",
    descKey: "home_solution_book_desc",
    icon: (
      // Calendar — the date confirmed
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke(INFRARED)}>
        <rect x="3.8" y="5.3" width="16.4" height="15" rx="2.4" stroke={GHOST} />
        <path d="M8.3 3.2v3.4M15.7 3.2v3.4" stroke={GHOST} />
        <path d="M3.8 10h16.4" stroke={GHOST} opacity="0.6" />
        <path d="M9 14.8l2.1 2.1 4-4.2" />
      </svg>
    ),
  },
  {
    id: "contract",
    titleKey: "home_solution_contract_title",
    descKey: "home_solution_contract_desc",
    icon: (
      // Document — signed
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke(INFRARED)}>
        <path d="M14 3.3H7a2 2 0 0 0-2 2v13.4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.3z" stroke={GHOST} />
        <path d="M14 3.3v5h5" stroke={GHOST} opacity="0.6" />
        <path d="M8.6 16.2c1.2-1 1.8 1 3 0s1.8 1 3.4 0" />
      </svg>
    ),
  },
  {
    id: "tour",
    titleKey: "home_solution_tour_title",
    descKey: "home_solution_tour_desc",
    icon: (
      // Map pin + route — city to city
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke(INFRARED)}>
        <path d="M18.3 3.5a3 3 0 0 1 3 3c0 2.2-3 5.2-3 5.2s-3-3-3-5.2a3 3 0 0 1 3-3z" stroke={GHOST} />
        <circle cx="18.3" cy="6.5" r="1" fill={INFRARED} stroke="none" />
        <path d="M4.5 20c6 0 4.5-7.5 9.3-8.8" stroke={GHOST} strokeDasharray="2.5 3" />
        <circle cx="4.5" cy="20" r="1.7" />
      </svg>
    ),
  },
];

const solutionIcon = (id: string) => SOLUTIONS.find((s) => s.id === id)!.icon;

/**
 * The 5-step booking journey, mirrored from /founding (Discover → Connect →
 * Offer & negotiate → Sign the contract → Confirmed). Icons stay in the same
 * 26px line language as SOLUTIONS / the /features page; "offer" gets the
 * exchange mark (offer out, counter back) from the features set.
 */
export const JOURNEY: JourneyStep[] = [
  { id: "discover", titleKey: "home_journey_discover_title", descKey: "home_journey_discover_desc", icon: solutionIcon("discover") },
  { id: "connect", titleKey: "home_journey_connect_title", descKey: "home_journey_connect_desc", icon: solutionIcon("connect") },
  {
    id: "offer",
    titleKey: "home_journey_offer_title",
    descKey: "home_journey_offer_desc",
    icon: (
      // Exchange — offer out, counter back
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke(INFRARED)}>
        <path d="M19.8 10.5a8 8 0 0 0-14.4-3" stroke={GHOST} />
        <path d="M5.4 4.6v3h3" stroke={GHOST} />
        <path d="M4.2 13.5a8 8 0 0 0 14.4 3" />
        <path d="M18.6 19.4v-3h-3" />
      </svg>
    ),
  },
  { id: "contract", titleKey: "home_journey_contract_title", descKey: "home_journey_contract_desc", icon: solutionIcon("contract") },
  { id: "confirmed", titleKey: "home_journey_confirmed_title", descKey: "home_journey_confirmed_desc", icon: solutionIcon("book") },
];
