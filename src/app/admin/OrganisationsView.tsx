'use client';

import { useEffect, useState } from 'react';

/**
 * Agency organisations: several agents, each on their own subscription,
 * paying at the band of the agency's TOTAL artist count. This view exists so
 * support can answer "why did my price change" — total, band, who is in,
 * who is pending, whether each member actually has a live subscription —
 * and force a resync when a trigger was missed.
 */
type OrgRow = { id: string; name: string; verifiedDomains: string[]; artistTotal: number; band: number; memberCount: number; pendingCount: number; createdAt: string };
type Member = { memberId: string; status: string; role: string; matchedBy: string | null; invitedEmail: string | null; email: string | null; name: string | null; tier: string | null; seats: number | null; rosterCount: number; hasStripe: boolean; createdAt: string };
type OrgDetail = OrgRow & { members: Member[] };

// Band labels only. The amounts live in four places — tora-backend
// src/config/pricing.js, tora-app src/utils/money.js, the tokushoho page
// (the published price list) and here — change them together.
const BAND_LABEL = ['1–3', '4–10', '11–25', '26–50', '51+'];

export function OrganisationsView() {
  const [orgs, setOrgs] = useState<OrgRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [detail, setDetail] = useState<Record<string, OrgDetail>>({});
  const [busy, setBusy] = useState<string | null>(null);

  async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, { credentials: 'include', cache: 'no-store', ...init });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data as T;
  }

  const load = async () => {
    try { setOrgs((await getJson<{ organisations: OrgRow[] }>('/api/admin/organisations')).organisations); }
    catch (e) { setError(e instanceof Error ? e.message : 'Failed to load'); }
  };
  useEffect(() => { load(); }, []);

  const loadDetail = async (id: string) => {
    try {
      const d = await getJson<{ organisation: OrgDetail }>(`/api/admin/organisations/${id}`);
      setDetail((prev) => ({ ...prev, [id]: d.organisation }));
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to load the organisation'); }
  };

  const toggle = async (id: string) => {
    if (open === id) { setOpen(null); return; }
    setOpen(id);
    if (!detail[id]) await loadDetail(id);
  };

  const resync = async (id: string) => {
    setBusy(id);
    try {
      await getJson(`/api/admin/organisations/${id}/resync`, { method: 'POST' });
      await Promise.all([load(), loadDetail(id)]);
    } catch (e) { setError(e instanceof Error ? e.message : 'Resync failed'); } finally { setBusy(null); }
  };

  if (error) return <p className="text-red-300 text-sm">{error}</p>;
  if (!orgs) return <p className="text-white/50 text-sm">Loading…</p>;
  if (orgs.length === 0) return <p className="text-white/50 text-sm">No agency organisations yet.</p>;

  return (
    <div className="space-y-3">
      {orgs.map((o) => (
        <div key={o.id} className="rounded-lg border border-white/10 bg-white/[0.03]">
          <button type="button" onClick={() => toggle(o.id)} className="w-full flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-left">
            <span className="text-white font-medium">{o.name}</span>
            <span className="text-white/50 text-xs">{o.memberCount} agent{o.memberCount === 1 ? '' : 's'}{o.pendingCount > 0 ? ` · ${o.pendingCount} pending` : ''}</span>
            <span className="text-white/50 text-xs">{o.artistTotal} artists · band {BAND_LABEL[o.band]}{o.memberCount < 2 ? ' (single member — same as solo)' : ''}</span>
            {o.verifiedDomains.length > 0 && <span className="text-white/35 text-xs">{o.verifiedDomains.join(', ')}</span>}
            <span className="ml-auto text-white/40 text-xs">{open === o.id ? '▲' : '▼'}</span>
          </button>
          {open === o.id && (
            <div className="border-t border-white/10 px-4 py-3">
              {!detail[o.id] ? <p className="text-white/50 text-sm">Loading…</p> : (
                <table className="w-full text-xs">
                  <thead className="text-white/40 uppercase tracking-wider">
                    <tr><th className="text-left py-1">Agent</th><th className="text-left">Email</th><th className="text-left">Status</th><th className="text-right">Artists</th><th className="text-left pl-3">Plan</th><th className="text-left">Via</th></tr>
                  </thead>
                  <tbody>
                    {detail[o.id].members.map((m) => (
                      <tr key={m.memberId} className="border-t border-white/5 text-white/80">
                        <td className="py-1.5">{m.name || m.invitedEmail || '—'}{m.role === 'ADMIN' ? <span className="ml-1 text-white/40">admin</span> : null}</td>
                        <td>{m.email || m.invitedEmail || '—'}</td>
                        <td>{m.status}</td>
                        <td className="text-right tabular-nums">{m.rosterCount}</td>
                        <td className="pl-3">{m.tier || '—'}{m.seats != null ? ` · ${m.seats} seats` : ''}{m.hasStripe ? '' : m.tier && m.tier !== 'FREE' ? ' · no Stripe' : ''}</td>
                        <td className="text-white/40">{m.matchedBy || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="mt-3 flex items-center gap-3">
                <button type="button" disabled={busy === o.id} onClick={() => resync(o.id)} className="px-3 py-1.5 rounded text-xs uppercase tracking-wider border border-white/15 text-white/70 hover:text-white disabled:opacity-50">
                  {busy === o.id ? 'Resyncing…' : 'Resync rates'}
                </button>
                <span className="text-white/35 text-xs">Recounts artists and re-applies the band coupon on every member for their next invoice.</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
