'use client';

import { useState } from 'react';
import { ROLE_COLORS } from '@/lib/roleColors';

/**
 * The single moderation queue: every report of a profile, a message or a post
 * (App Review guideline 1.2). A reported post lands here too, so this is the
 * only place reports are worked through — there is no separate post queue.
 *
 * The page owns the list because it also feeds the tab's open-count dot; after
 * an action the list is refetched rather than patched, so the recorded status,
 * resolution note and review time are the server's, not a guess.
 */
type Brief = { id: string; name: string; role: string } | null;
type Target = (NonNullable<Brief> & { text?: string | null; status?: string; from?: Brief; author?: Brief }) | null;

export type Report = {
  id: string;
  targetType: 'PROFILE' | 'MESSAGE' | 'POST';
  targetId: string;
  reason: string;
  note: string | null;
  status: 'OPEN' | 'REVIEWED' | 'ACTIONED' | 'DISMISSED';
  resolution: string | null;
  createdAt: string;
  reviewedAt: string | null;
  reporter: Brief;
  target: Target;
};

type Action = 'dismiss' | 'review' | 'action';

/** Fetch the moderation queue through an admin proxy endpoint. */
export async function fetchReports(endpoint: string): Promise<Report[]> {
  const res = await fetch(endpoint, { credentials: 'include', cache: 'no-store' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data.reports;
}

const STATUS_STYLE: Record<Report['status'], string> = {
  OPEN: 'bg-infrared/25 text-red-200',
  REVIEWED: 'bg-yellow-500/20 text-yellow-200',
  ACTIONED: 'bg-green-500/20 text-green-200',
  DISMISSED: 'bg-white/10 text-white/50',
};

export function ModerationView({ endpoint, reports, onChange, loadError }: {
  endpoint: string;
  reports: Report[] | null;
  onChange: (next: Report[]) => void;
  /** Set when the queue itself failed to load, so the view does not sit on "Loading…". */
  loadError?: string | null;
}) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [showAll, setShowAll] = useState(false);

  const act = async (report: Report, action: Action, postAction?: 'hide' | 'remove') => {
    if (postAction === 'remove' && !window.confirm('Remove this post permanently?')) return;
    setBusy(report.id);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: report.id, action, resolution: notes[report.id] || undefined, postAction }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `HTTP ${res.status}`);
      // Refetch: the server owns the resulting status, note and review time.
      onChange(await fetchReports(endpoint));
      setNotes((n) => ({ ...n, [report.id]: '' }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setBusy(null);
    }
  };

  const who = (p: NonNullable<Brief>) => (
    <span className="text-white/80">
      {p.name} <span className="text-[10px] uppercase" style={{ color: ROLE_COLORS[p.role] || 'rgba(255,255,255,0.5)' }}>{p.role}</span>
    </span>
  );

  const open = (reports || []).filter((r) => r.status === 'OPEN');
  const shown = showAll ? reports || [] : open;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {([false, true] as const).map((all) => (
          <button
            key={String(all)}
            onClick={() => setShowAll(all)}
            className={`rounded px-4 py-2 text-xs uppercase tracking-wider transition-colors ${
              showAll === all ? 'border border-white/20 bg-white/10 text-white' : 'border border-white/10 text-white/50 hover:text-white'
            }`}
            style={{ fontFamily: 'var(--font-rajdhani), sans-serif' }}
          >
            {all ? `All (${reports?.length ?? 0})` : `Open (${open.length})`}
          </button>
        ))}
      </div>

      {(error || loadError) && <p className="mb-3 text-sm text-red-400">{error || `Could not load the queue: ${loadError}`}</p>}
      {!reports && !loadError && <p className="text-white/40">Loading…</p>}
      {reports && shown.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/40">
          {reports.length === 0 ? 'No reports. Nothing to review.' : 'No open reports. Everything here has been closed.'}
        </div>
      )}

      {shown.map((r) => {
        const subject = r.target?.from || r.target?.author || r.target;
        return (
          <div key={r.id} className={`mb-2 rounded-xl border border-white/10 p-3.5 text-sm ${r.status === 'OPEN' ? 'bg-infrared/[0.04]' : 'bg-white/[0.02]'}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${STATUS_STYLE[r.status]}`}>
                {r.status.toLowerCase()}
              </span>
              <span className="text-white/90">{r.targetType.toLowerCase()}</span>
              <span className="text-white/55">· {r.reason}</span>
              {r.target?.status === 'HIDDEN' && <span className="text-[11px] uppercase text-yellow-300/80">post hidden</span>}
              <span className="ml-auto text-[12px] text-white/35">{new Date(r.createdAt).toLocaleString()}</span>
            </div>

            <p className="mt-2 text-[13px]">
              <span className="text-white/45">Reported by </span>
              {r.reporter ? who(r.reporter) : <span className="text-white/45">a member</span>}
              <span className="text-white/45"> · about </span>
              {subject ? who(subject) : <span className="text-white/45">a deleted item</span>}
            </p>

            {r.target?.text && <p className="my-2 whitespace-pre-wrap italic text-white/80">“{r.target.text.slice(0, 280)}”</p>}
            {r.note && <p className="my-2 text-[13px] text-white/75"><span className="text-white/45">Reporter&apos;s note: </span>{r.note}</p>}
            {r.resolution && <p className="my-2 text-[13px] text-white/75"><span className="text-white/45">Outcome: </span>{r.resolution}</p>}
            {r.status !== 'OPEN' && r.reviewedAt && (
              <p className="text-[12px] text-white/35">Closed {new Date(r.reviewedAt).toLocaleString()}</p>
            )}

            {r.status === 'OPEN' && (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <input
                  value={notes[r.id] || ''}
                  onChange={(e) => setNotes((n) => ({ ...n, [r.id]: e.target.value }))}
                  placeholder="What did you do? (kept with the report)"
                  className="min-w-0 flex-[1_1_220px] rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[13px] text-white placeholder-white/30 outline-none focus:border-white/30"
                />
                <div className="flex flex-wrap gap-3 text-[12px] text-white/50">
                  {r.targetType === 'POST' && r.target?.status !== 'HIDDEN' && (
                    <button className="underline" disabled={busy === r.id} onClick={() => act(r, 'action', 'hide')}>hide post</button>
                  )}
                  {r.targetType === 'POST' && (
                    <button className="text-red-400/80 underline" disabled={busy === r.id} onClick={() => act(r, 'action', 'remove')}>remove post</button>
                  )}
                  <button className="underline" disabled={busy === r.id} onClick={() => act(r, 'action')}>mark actioned</button>
                  <button className="underline" disabled={busy === r.id} onClick={() => act(r, 'review')}>mark reviewed</button>
                  <button className="underline" disabled={busy === r.id} onClick={() => act(r, 'dismiss')}>dismiss</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
