'use client';

import { useEffect, useState } from 'react';

/**
 * Agency organisations: an agency is a TEAM shown on its members' profiles,
 * nothing more. Since 2026-10-26 it does not change anyone's price — every
 * agent pays the same flat Agent plan for unlimited artists. This view exists
 * so support can see who is in, who is pending, how many artists the agency
 * carries between them, and whether each member actually has a live plan.
 *
 * No amounts here, deliberately. They live in tora-backend
 * src/config/pricing.js, tora-app src/utils/money.js and the tokushoho page
 * (the published price list) — never add a fourth.
 */
type OrgRow = { id: string; name: string; verifiedDomains: string[]; artistTotal: number; memberCount: number; pendingCount: number; createdAt: string };
type Member = { memberId: string; status: string; role: string; matchedBy: string | null; invitedEmail: string | null; email: string | null; name: string | null; tier: string | null; seats: number | null; rosterCount: number; hasStripe: boolean; createdAt: string };
type OrgDetail = OrgRow & { members: Member[] };

const PAID_TIERS = ['MONTHLY', 'YEARLY'];

// Which plan the backend bills this agent for: a paid tier first, then
// agentSeats picks which one — 0 = member plan, anything else = agent plan,
// null included, because comped agents never get a marker written. Not
// seats === 1: the column used to hold a real seat count and was never
// backfilled, so an older agent can still carry 5.
//
// NOT an exact mirror of isPaidAgent (tora-backend utils/agentTiers.js) —
// that reads the CURRENT tier, and this payload carries the stored tier with
// no expiry dates, so a lapsed row can still read as paid. The exact answer
// needs /organisations to send the plan itself.
const planLabel = (tier: string | null, seats: number | null) =>
  !tier || !PAID_TIERS.includes(tier) ? '' : seats === 0 ? ' · Member plan' : ' · Agent plan';

const stripeLabel = (m: Member) =>
  !m.hasStripe && m.tier && m.tier !== 'FREE' ? ' · no Stripe' : '';

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

  const recount = async (id: string) => {
    setBusy(id);
    try {
      await getJson(`/api/admin/organisations/${id}/resync`, { method: 'POST' });
      await Promise.all([load(), loadDetail(id)]);
    } catch (e) { setError(e instanceof Error ? e.message : 'Recount failed'); } finally { setBusy(null); }
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
            <span className="text-white/50 text-xs">{o.artistTotal} artists</span>
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
                        <td className="pl-3">{m.tier || '—'}{planLabel(m.tier, m.seats)}{stripeLabel(m)}</td>
                        <td className="text-white/40">{m.matchedBy || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="mt-3 flex items-center gap-3">
                <button type="button" disabled={busy === o.id} onClick={() => recount(o.id)} className="px-3 py-1.5 rounded text-xs uppercase tracking-wider border border-white/15 text-white/70 hover:text-white disabled:opacity-50">
                  {busy === o.id ? 'Recounting…' : 'Recount artists'}
                </button>
                <span className="text-white/35 text-xs">Recounts the agency&rsquo;s artist total. Nobody&rsquo;s price depends on it — every agent pays the same flat Agent plan.</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
