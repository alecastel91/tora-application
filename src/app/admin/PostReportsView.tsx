'use client';

import { useState } from 'react';
import { ROLE_COLORS } from '@/lib/roleColors';

/**
 * Reported News posts with moderation actions. The page owns the list (it
 * also feeds the tab badge) and passes the proxy endpoint; every action's
 * outcome is known up front, so the list is patched locally instead of
 * refetched.
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
type Action = 'hide' | 'remove' | 'dismiss';

/** Fetch the reported posts through an admin proxy endpoint. */
export async function fetchReportedPosts(endpoint: string): Promise<ReportedPost[]> {
  const res = await fetch(endpoint, { credentials: 'include', cache: 'no-store' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data.posts;
}

const applyAction = (posts: ReportedPost[], id: string, action: Action) =>
  action === 'hide'
    ? posts.map((p) => (p.id === id ? { ...p, status: 'HIDDEN' as const } : p))
    : posts.filter((p) => p.id !== id);

export function PostReportsView({ endpoint, posts, onChange }: {
  endpoint: string;
  posts: ReportedPost[] | null;
  onChange: (posts: ReportedPost[]) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const act = async (postId: string, action: Action) => {
    if (action === 'remove' && !window.confirm('Remove this post permanently?')) return;
    setBusy(postId);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, action }),
      });
      if (!res.ok) throw new Error((await res.json()).error || `HTTP ${res.status}`);
      onChange(applyAction(posts || [], postId, action));
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

  return (
    <div>
      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
      {!posts && <p className="text-white/40">Loading…</p>}
      {posts && posts.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-white/40">No reported posts.</div>
      )}
      {posts && posts.map((p) => (
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
