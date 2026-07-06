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
  labelKey: string; // existing key, e.g. role_artists_title
  valueKey: string; // new key, e.g. home_role_artist_value
  color: string;
  icon: ReactNode;
};

export type Solution = {
  id: string;
  titleKey: string;
  descKey: string;
  icon: ReactNode;
};

const stroke = (color: string, width = 1.25) =>
  ({ fill: "none", stroke: color, strokeWidth: width, strokeLinecap: "round", strokeLinejoin: "round" } as const);

export const ROLES: Role[] = [
  {
    id: "artist",
    labelKey: "role_artists_title",
    valueKey: "home_role_artist_value",
    color: "#667EEA",
    icon: (
      // The artist — a performer, with a signal leaving them
      <svg width="30" height="30" viewBox="0 0 24 24" {...stroke("#667EEA", 1.4)}>
        <circle cx="12" cy="7.5" r="3.2" />
        <path d="M5.5 19.5c0-3.6 2.9-6.2 6.5-6.2s6.5 2.6 6.5 6.2" />
        <path d="M17 3.6a4.8 4.8 0 0 1 1.5 2.9" opacity="0.55" />
        <circle cx="19.4" cy="3" r="0.8" fill="#667EEA" stroke="none" opacity="0.9" />
      </svg>
    ),
  },
  {
    id: "agent",
    labelKey: "role_agents_title",
    valueKey: "home_role_agent_value",
    color: "#43E97B",
    icon: (
      // The agent — one person representing another
      <svg width="30" height="30" viewBox="0 0 24 24" {...stroke("#43E97B", 1.4)}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 19.5c0-3.3 2.7-5.7 6-5.7s6 2.4 6 5.7" />
        <circle cx="16.8" cy="9" r="2.4" opacity="0.5" />
        <path d="M16.6 13.9c2.6.4 4.4 2.5 4.4 5.1" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "promoter",
    labelKey: "role_promoters_title",
    valueKey: "home_role_promoter_value",
    color: "#FFC107",
    icon: (
      // The promoter — a megaphone, sound leaving the horn
      <svg width="30" height="30" viewBox="0 0 24 24" {...stroke("#FFC107", 1.4)}>
        <path d="M17.5 4 6.8 8.6H4.2a1.7 1.7 0 0 0-1.7 1.7v3.4a1.7 1.7 0 0 0 1.7 1.7h2.6L17.5 20z" />
        <path d="M7.2 15.6v3.2a1.2 1.2 0 0 0 1.2 1.2h1.4" opacity="0.5" />
        <path d="M20.2 9.2a4.2 4.2 0 0 1 0 5.6" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "venue",
    labelKey: "role_venues_title",
    valueKey: "home_role_venue_value",
    color: "#F5576C",
    icon: (
      // The venue — a building with an arched entrance, light above the door
      <svg width="30" height="30" viewBox="0 0 24 24" {...stroke("#F5576C", 1.4)}>
        <path d="M5 20V8.8L12 4.5l7 4.3V20" />
        <path d="M3 20h18" />
        <path d="M9.6 20v-3.4a2.4 2.4 0 0 1 4.8 0V20" opacity="0.55" />
        <circle cx="12" cy="9.4" r="0.9" fill="#F5576C" stroke="none" opacity="0.9" />
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
