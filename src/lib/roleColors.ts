/**
 * Canonical role palette — mirrors tora-app/src/utils/roles.js (the source
 * of truth). Change there first, then here.
 */
export const ROLE_COLORS: Record<string, string> = {
  ARTIST: '#667EEA',
  AGENT: '#43E97B',
  PROMOTER: '#FFC107',
  VENUE: '#F5576C',
};

export const roleColor = (role?: string | null) => ROLE_COLORS[(role || '').toUpperCase()] || '#999999';
