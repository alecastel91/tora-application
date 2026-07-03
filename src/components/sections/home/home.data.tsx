import type { ReactNode } from "react";

/**
 * Home-page narrative data. Roles are reframed as one-line VALUE props (not the
 * paragraph copy on /roles); the 10 platform features are regrouped into 5
 * SOLUTIONS. Icons/colors are copied from the /roles and /features detail pages
 * (kept in sync manually — those pages are intentionally left untouched).
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

const stroke = (color: string) =>
  ({ fill: "none", stroke: color, strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const);

export const ROLES: Role[] = [
  {
    id: "artist",
    labelKey: "role_artists_title",
    valueKey: "home_role_artist_value",
    color: "#667EEA",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" {...stroke("#667EEA")}>
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2-3h2l2 3" opacity="0.5" />
        <path d="M8 16c0-2.2 1.8-4 4-4s4 1.8 4 4" />
        <circle cx="12" cy="8" r="2" />
      </svg>
    ),
  },
  {
    id: "agent",
    labelKey: "role_agents_title",
    valueKey: "home_role_agent_value",
    color: "#43E97B",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" {...stroke("#43E97B")}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" opacity="0.5" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "promoter",
    labelKey: "role_promoters_title",
    valueKey: "home_role_promoter_value",
    color: "#FFC107",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" {...stroke("#FFC107")}>
        <path d="M18 3v12" />
        <path d="M18 3L6 8H2v4h4l12 5V3z" />
        <path d="M6 15v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "venue",
    labelKey: "role_venues_title",
    valueKey: "home_role_venue_value",
    color: "#F5576C",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" {...stroke("#F5576C")}>
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <rect x="9" y="13" width="6" height="8" rx="1" opacity="0.4" />
        <line x1="12" y1="9" x2="12" y2="11" opacity="0.5" />
      </svg>
    ),
  },
];

export const SOLUTIONS: Solution[] = [
  {
    id: "discover",
    titleKey: "home_solution_discover_title",
    descKey: "home_solution_discover_desc",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" {...stroke("#FF3366")}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <circle cx="11" cy="11" r="3" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: "book",
    titleKey: "home_solution_book_title",
    descKey: "home_solution_book_desc",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" {...stroke("#FF3366")}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M9 15l2 2 4-4" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "contract",
    titleKey: "home_solution_contract_title",
    descKey: "home_solution_contract_desc",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" {...stroke("#FF3366")}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" opacity="0.5" />
        <path d="M8 17l2 2 4-4" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "tour",
    titleKey: "home_solution_tour_title",
    descKey: "home_solution_tour_desc",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" {...stroke("#FF3366")}>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    id: "connect",
    titleKey: "home_solution_connect_title",
    descKey: "home_solution_connect_desc",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" {...stroke("#FF3366")}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <line x1="8" y1="9" x2="16" y2="9" opacity="0.4" />
        <line x1="8" y1="13" x2="13" y2="13" opacity="0.4" />
      </svg>
    ),
  },
];
