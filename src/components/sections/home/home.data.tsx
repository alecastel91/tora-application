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
      // Signal — a continuous audio pulse
      <svg width="30" height="30" viewBox="0 0 24 24" {...stroke("#667EEA")}>
        <path d="M2.5 12h3l2-4.5 2.5 9L13 4l2.5 12.5 2-7.5 1.5 3h2.5" />
        <circle cx="13" cy="4" r="0.9" fill="#667EEA" stroke="none" opacity="0.9" />
      </svg>
    ),
  },
  {
    id: "agent",
    labelKey: "role_agents_title",
    valueKey: "home_role_agent_value",
    color: "#43E97B",
    icon: (
      // Orbit — the connector at the centre of moving parts
      <svg width="30" height="30" viewBox="0 0 24 24" {...stroke("#43E97B")}>
        <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(-25 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(55 12 12)" opacity="0.45" />
        <circle cx="12" cy="12" r="1.4" fill="#43E97B" stroke="none" />
        <circle cx="19.6" cy="8.4" r="1" fill="#43E97B" stroke="none" opacity="0.85" />
        <circle cx="6" cy="17.4" r="0.8" fill="#43E97B" stroke="none" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "promoter",
    labelKey: "role_promoters_title",
    valueKey: "home_role_promoter_value",
    color: "#FFC107",
    icon: (
      // Broadcast — arcs radiating from the source
      <svg width="30" height="30" viewBox="0 0 24 24" {...stroke("#FFC107")}>
        <circle cx="6.5" cy="17.5" r="1.4" fill="#FFC107" stroke="none" />
        <path d="M6.5 13.5A4 4 0 0 1 10.5 17.5" />
        <path d="M6.5 10.5A7 7 0 0 1 13.5 17.5" opacity="0.55" />
        <path d="M6.5 7.5A10 10 0 0 1 16.5 17.5" opacity="0.28" />
      </svg>
    ),
  },
  {
    id: "venue",
    labelKey: "role_venues_title",
    valueKey: "home_role_venue_value",
    color: "#F5576C",
    icon: (
      // Portal — the arch where it happens
      <svg width="30" height="30" viewBox="0 0 24 24" {...stroke("#F5576C")}>
        <path d="M5.5 19.5v-6a6.5 6.5 0 0 1 13 0v6" />
        <path d="M3 19.5h18" />
        <path d="M9.5 19.5v-4a2.5 2.5 0 0 1 5 0v4" opacity="0.45" />
        <circle cx="12" cy="6" r="0.9" fill="#F5576C" stroke="none" opacity="0.9" />
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
      // Radar — the scene, scanned
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke(INFRARED)}>
        <circle cx="12" cy="12" r="8" stroke={GHOST} />
        <path d="M12 12l4.6-4.6" />
        <path d="M20 12a8 8 0 0 1-2.34 5.66" opacity="0.5" />
        <circle cx="12" cy="12" r="1" fill={INFRARED} stroke="none" />
        <circle cx="15.4" cy="15.2" r="1.1" fill={INFRARED} stroke="none" opacity="0.9" />
        <path d="M12 3.5v1.2M12 19.3v1.2M3.5 12h1.2M19.3 12h1.2" stroke={GHOST} opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "connect",
    titleKey: "home_solution_connect_title",
    descKey: "home_solution_connect_desc",
    icon: (
      // Nodes — two sides of the scene, linked
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke(INFRARED)}>
        <circle cx="6.5" cy="16.5" r="2.4" stroke={GHOST} />
        <circle cx="17.5" cy="7.5" r="2.4" />
        <path d="M8.4 14.9l7.2-5.8" />
        <circle cx="19" cy="17" r="1" fill={INFRARED} stroke="none" opacity="0.8" />
        <path d="M17.9 15.9l-6-4" stroke={GHOST} opacity="0.5" strokeDasharray="1.5 2.5" />
      </svg>
    ),
  },
  {
    id: "book",
    titleKey: "home_solution_book_title",
    descKey: "home_solution_book_desc",
    icon: (
      // Date — held
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke(INFRARED)}>
        <rect x="4" y="5.5" width="16" height="14.5" rx="2.5" stroke={GHOST} />
        <path d="M8.5 3.5v3M15.5 3.5v3" stroke={GHOST} />
        <path d="M4 10h16" stroke={GHOST} opacity="0.6" />
        <circle cx="15" cy="14.5" r="1.3" fill={INFRARED} stroke="none" />
        <circle cx="9" cy="14.5" r="0.8" fill="rgba(255,255,255,0.35)" stroke="none" />
      </svg>
    ),
  },
  {
    id: "contract",
    titleKey: "home_solution_contract_title",
    descKey: "home_solution_contract_desc",
    icon: (
      // Terms — signed
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke(INFRARED)}>
        <path d="M14 3.5H7A2 2 0 0 0 5 5.5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5z" stroke={GHOST} />
        <path d="M14 3.5v5h5" stroke={GHOST} opacity="0.6" />
        <path d="M8.5 15.5c1.2-1 1.8 1 3 0s1.8 1 3.5 0" />
        <circle cx="15.8" cy="12" r="0.9" fill={INFRARED} stroke="none" opacity="0.9" />
      </svg>
    ),
  },
  {
    id: "tour",
    titleKey: "home_solution_tour_title",
    descKey: "home_solution_tour_desc",
    icon: (
      // Route — plotted city to city
      <svg width="26" height="26" viewBox="0 0 24 24" {...stroke(INFRARED)}>
        <path d="M5 18.5c6.5 0 3.5-11.5 13-12.5" stroke={GHOST} strokeDasharray="2.5 3" />
        <circle cx="5" cy="18.5" r="1.8" />
        <circle cx="18.5" cy="5.8" r="1.8" stroke={GHOST} />
        <circle cx="18.5" cy="5.8" r="0.7" fill={INFRARED} stroke="none" />
        <circle cx="11.2" cy="11.6" r="0.8" fill={INFRARED} stroke="none" opacity="0.7" />
      </svg>
    ),
  },
];
