'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Reported News posts with moderation actions. Shared by the prod admin
 * dashboard (/api/admin/reports) and the beta cockpit (/api/admin/beta/reports)
 * — pass the proxy endpoint.
 */
type Reporter = { id: string; name: string; role: string };
export type ReportedPost = {
  id: string;
  type: string;
  text: string | null;
  imageUrl: string | null;
  status: 'ACTIVE' | 'HIDDEN';
  reportsCount: number;
  createdAt: string;
  author: Reporter;
  reports: { reason: string | null; createdAt: string; reporter: Reporter }[];
};

const ROLE_COLORS: Record<string, string> = { ARTIST: '#6B5FFF', AGENT: '#00C875', PROMOTER: '#FFB800', VENUE: '#FF5757' };

export function PostReportsView({ endpoint }: { endpoint: string }) {
  const [posts, setPosts] = useState<ReportedPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(endpoint, { credentials: 'include', cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setPosts(data.posts);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load reports');
    }
  }, [endpoint]);

  useEffect(() => { load(); }, [load]);

  const act = async (postId: string, action: 'hide' | 'remove' | 'dismiss') => {
    if (action === 'remove' && !window.confirm('Remove this post permanently?')) return;
    setBusy(postId);
    try {
      const res = await fetch(endpoint, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, action }),
      });
      if (!res.ok) throw new Error((await res.json()).error || `HTTP ${res.status}`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setBusy(null);
    }
  };

  const who = (p: Reporter) => (
    <span className="text-white/80">
      {p.name} <span className="text-[10px] uppercase" style={{ color: ROLE_COLORS[p.role] || 'rgba(255,255,255,0.5)' }}>{p.role}</span>
    </span>
  );

  if (error) return <p className="text-red-400 text-sm">{error}</p>;
  if (!posts) return <p className="text-white/40">Loading…</p>;
  if (posts.length === 0) {
    return <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/40">No reported posts.</div>;
  }

  return (
    <div>
      {posts.map((p) => (
        <div key={p.id} className="mb-2 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              style={{ background: p.status === 'HIDDEN' ? 'rgba(255,80,80,0.3)' : 'rgba(255,184,0,0.22)' }}>
              {p.status === 'HIDDEN' ? 'hidden' : 'visible'} · {p.reportsCount} report{p.reportsCount === 1 ? '' : 's'}
            </span>
            {who(p.author)}
            <span className="text-[12px] text-white/40">{p.type.toLowerCase()}</span>
            <span className="ml-auto text-[12px] text-white/35">{new Date(p.createdAt).toLocaleString()}</span>
          </div>
          {p.text && <p className="my-2 whitespace-pre-wrap text-white/90">{p.text}</p>}
          {p.imageUrl && (
            <a href={p.imageUrl} target="_blank" rel="noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.imageUrl} alt="post" className="mb-2 h-28 rounded-lg border border-white/15 object-cover" />
            </a>
          )}
          <ul className="my-2 list-none p-0 text-[12px] text-white/55">
            {p.reports.map((r, i) => (
              <li key={i}>
                {who(r.reporter)} — {r.reason || <em>no reason</em>} · {new Date(r.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 text-[12px] text-white/50">
            {p.status === 'ACTIVE' && <button className="underline" disabled={busy === p.id} onClick={() => act(p.id, 'hide')}>hide</button>}
            <button className="underline" disabled={busy === p.id} onClick={() => act(p.id, 'dismiss')}>dismiss reports{p.status === 'HIDDEN' ? ' & restore' : ''}</button>
            <button className="underline text-red-400/80" disabled={busy === p.id} onClick={() => act(p.id, 'remove')}>remove post</button>
          </div>
        </div>
      ))}
    </div>
  );
}
