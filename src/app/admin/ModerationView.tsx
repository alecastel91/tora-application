'use client';

import { useState } from 'react';
import { ROLE_COLORS } from '@/lib/roleColors';

/**
 * The single moderation queue: every report of a profile, a message or a post
 * (App Review guideline 1.2). Closing a report records the decision; a post
 * can additionally be hidden or removed in the same action.
 */
type Brief = { id: string; name: string; role: string } | null;
export type Report = {
  id: string;
  targetType: 'PROFILE' | 'MESSAGE' | 'POST';
  targetId: string;
  reason: string;
  note: string | null;
  status: 'OPEN' | 'REVIEWED' | 'ACTIONED' | 'DISMISSED';
  createdAt: string;
  reporter: Brief;
  target: (Brief & { text?: string | null; status?: string; from?: Brief; author?: Brief }) | null;
};
type Action = 'dismiss' | 'review' | 'action';

export async function fetchReports(endpoint: string): Promise<Report[]> {
  const res = await fetch(endpoint, { credentials: 'include', cache: 'no-store' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data.reports;
}

const STATUS_COLOR: Record<string, string> = {
  OPEN: '#FF3366', REVIEWED: '#FFB800', ACTIONED: '#00C875', DISMISSED: '#6b6b7b',
};

export function ModerationView({ endpoint, reports, onChange }: {
  endpoint: string;
  reports: Report[];
  onChange: (next: Report[]) => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const run = async (report: Report, action: Action, postAction?: 'hide' | 'remove') => {
    setBusy(report.id);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: report.id, action, resolution: notes[report.id] || undefined, postAction }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      const status = action === 'dismiss' ? 'DISMISSED' : action === 'review' ? 'REVIEWED' : 'ACTIONED';
      onChange(reports.map((r) => (r.id === report.id ? { ...r, status } : r)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setBusy(null);
    }
  };

  if (reports.length === 0) {
    return <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>No reports. Nothing to review.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {reports.map((r) => {
        const who = r.target?.from || r.target?.author || r.target;
        return (
          <div key={r.id} style={{
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 14,
            background: r.status === 'OPEN' ? 'rgba(255,51,102,0.04)' : 'rgba(255,255,255,0.02)',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
              <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: STATUS_COLOR[r.status] }}>
                {r.status}
              </span>
              <strong style={{ fontSize: 14 }}>{r.targetType.toLowerCase()}</strong>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>· {r.reason}</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginLeft: 'auto' }}>
                {new Date(r.createdAt).toLocaleString()}
              </span>
            </div>

            <p style={{ margin: '0 0 6px', fontSize: 13 }}>
              <span style={{ color: 'rgba(255,255,255,0.45)' }}>Reported by </span>
              {r.reporter
                ? <span style={{ color: ROLE_COLORS[r.reporter.role] || '#fff' }}>{r.reporter.name}</span>
                : <span style={{ color: 'rgba(255,255,255,0.45)' }}>a member</span>}
              <span style={{ color: 'rgba(255,255,255,0.45)' }}> · about </span>
              {who
                ? <span style={{ color: ROLE_COLORS[who.role] || '#fff' }}>{who.name}</span>
                : <span style={{ color: 'rgba(255,255,255,0.45)' }}>a deleted item</span>}
            </p>

            {r.target?.text && (
              <p style={{ margin: '0 0 8px', fontSize: 13, color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' }}>
                “{r.target.text.slice(0, 280)}”
              </p>
            )}
            {r.note && (
              <p style={{ margin: '0 0 8px', fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>Note: </span>{r.note}
              </p>
            )}

            {r.status === 'OPEN' && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 10 }}>
                <input
                  value={notes[r.id] || ''}
                  onChange={(e) => setNotes((n) => ({ ...n, [r.id]: e.target.value }))}
                  placeholder="What did you do? (kept with the report)"
                  style={{
                    flex: '1 1 220px', minWidth: 0, padding: '7px 10px', borderRadius: 8, fontSize: 13,
                    border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.04)', color: '#fff',
                  }}
                />
                {r.targetType === 'POST' && (
                  <>
                    <button disabled={busy === r.id} onClick={() => run(r, 'action', 'hide')} style={btn}>Hide post</button>
                    <button disabled={busy === r.id} onClick={() => run(r, 'action', 'remove')} style={btn}>Remove post</button>
                  </>
                )}
                <button disabled={busy === r.id} onClick={() => run(r, 'action')} style={btn}>Mark actioned</button>
                <button disabled={busy === r.id} onClick={() => run(r, 'dismiss')} style={{ ...btn, color: 'rgba(255,255,255,0.6)' }}>Dismiss</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const btn: React.CSSProperties = {
  padding: '7px 12px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
  border: '1px solid rgba(255,255,255,0.18)', background: 'transparent', color: '#fff',
};
