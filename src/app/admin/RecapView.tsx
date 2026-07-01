'use client';

import { useMemo, useState } from 'react';
import type { Application } from './page';
import { ZONES } from '@/lib/geo';

const ROLES = ['ARTIST', 'AGENT', 'PROMOTER', 'VENUE'] as const;

const selectCls =
  'bg-white/5 border border-white/10 text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-infrared/50';

function parseGenres(g?: string): string[] {
  if (!g) return [];
  const s = g.trim();
  if (s.startsWith('[')) {
    try {
      const arr = JSON.parse(s);
      if (Array.isArray(arr)) return arr.map((x) => String(x).trim()).filter(Boolean);
    } catch {
      /* fall through */
    }
  }
  return s.split(',').map((x) => x.trim()).filter(Boolean);
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 md:w-36 shrink-0 text-white/70 text-sm truncate" title={label}>{label}</div>
      <div className="flex-1 h-2 rounded bg-white/5 overflow-hidden">
        <div className="h-full bg-infrared/70 rounded" style={{ width: `${pct}%` }} />
      </div>
      <div className="w-10 shrink-0 text-right text-white/50 text-sm tabular-nums">{value}</div>
    </div>
  );
}

function Ranking({ title, data, limit = 10 }: { title: string; data: [string, number][]; limit?: number }) {
  const [expanded, setExpanded] = useState(false);
  const max = data.length ? data[0][1] : 0;
  const shown = expanded ? data : data.slice(0, limit);
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-5">
      <div className="text-white/60 text-xs uppercase tracking-wider mb-4">
        {title} <span className="text-white/30">({data.length})</span>
      </div>
      <div className="space-y-2">
        {shown.length === 0 ? (
          <div className="text-white/30 text-sm">No data</div>
        ) : (
          shown.map(([k, v]) => <Bar key={k} label={k} value={v} max={max} />)
        )}
      </div>
      {data.length > limit && (
        <button onClick={() => setExpanded(!expanded)} className="mt-3 text-infrared text-xs hover:underline">
          {expanded ? 'Show less' : `Show all ${data.length}`}
        </button>
      )}
    </div>
  );
}

export function RecapView({ applications }: { applications: Application[] }) {
  const [role, setRole] = useState('all');
  const [zone, setZone] = useState('all');
  const [country, setCountry] = useState('all');
  const [status, setStatus] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const countryOptions = useMemo(
    () => Array.from(new Set(applications.map((a) => a.country).filter(Boolean) as string[])).sort(),
    [applications],
  );
  const statusOptions = useMemo(
    () => Array.from(new Set(applications.map((a) => (a.status || '').toUpperCase()).filter(Boolean))).sort(),
    [applications],
  );

  const filtered = useMemo(
    () =>
      applications.filter((a) => {
        if (role !== 'all' && (a.role || '').toUpperCase() !== role) return false;
        if (zone !== 'all' && a.zone !== zone) return false;
        if (country !== 'all' && a.country !== country) return false;
        if (status !== 'all' && (a.status || '').toUpperCase() !== status) return false;
        if (from && (a.created_at || '') < from) return false;
        if (to && (a.created_at || '') > `${to}T23:59:59.999Z`) return false;
        return true;
      }),
    [applications, role, zone, country, status, from, to],
  );

  const total = filtered.length;

  // All tallies derive from `filtered`, so compute them together in one memo keyed
  // on [filtered] — avoids re-scanning/re-sorting (and re-parsing genres) on every
  // unrelated render (e.g. toggling a "Show all" or typing in a date input).
  const { byRole, byCountry, byCity, byGenre, byZone, byStatus, byMonth } = useMemo(() => {
    const tally = (getKey: (a: Application) => string | string[] | undefined): [string, number][] => {
      const m = new Map<string, number>();
      for (const a of filtered) {
        const k = getKey(a);
        if (!k) continue;
        for (const key of Array.isArray(k) ? k : [k]) if (key) m.set(key, (m.get(key) || 0) + 1);
      }
      return [...m.entries()].sort((x, y) => y[1] - x[1]);
    };
    const months = new Map<string, number>();
    for (const a of filtered) {
      const d = (a.created_at || '').slice(0, 7); // YYYY-MM
      if (d) months.set(d, (months.get(d) || 0) + 1);
    }
    // Contiguous month axis: fill zero months between the first and last so the
    // trend doesn't render a gap (e.g. May, July with no June) as adjacent bars.
    const present = [...months.keys()].sort();
    const byMonth: [string, number][] = [];
    if (present.length) {
      let [y, m] = present[0].split('-').map(Number);
      const last = present[present.length - 1];
      for (let guard = 0; guard < 600; guard++) {
        const key = `${y}-${String(m).padStart(2, '0')}`;
        byMonth.push([key, months.get(key) || 0]);
        if (key === last) break;
        if (++m > 12) { m = 1; y++; }
      }
    }
    return {
      byRole: tally((a) => (a.role || '').toUpperCase()),
      byCountry: tally((a) => a.country),
      byCity: tally((a) => a.city),
      byGenre: tally((a) => parseGenres(a.genres)),
      byZone: tally((a) => a.zone),
      byStatus: tally((a) => (a.status || '').toUpperCase()),
      byMonth,
    };
  }, [filtered]);

  const roleCount = Object.fromEntries(byRole) as Record<string, number>;
  const monthMax = byMonth.reduce((mx, [, v]) => Math.max(mx, v), 0);

  const reset = () => {
    setRole('all');
    setZone('all');
    setCountry('all');
    setStatus('all');
    setFrom('');
    setTo('');
  };

  const exportCsv = () => {
    const cols: (keyof Application)[] = ['created_at', 'first_name', 'last_name', 'email', 'role', 'zone', 'country', 'city', 'genres', 'status'];
    const esc = (v: unknown) => {
      const s = v == null ? '' : String(v);
      return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [cols.join(','), ...filtered.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tora-waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex flex-wrap items-end gap-3 bg-white/5 border border-white/10 rounded-lg p-4">
        <select value={role} onChange={(e) => setRole(e.target.value)} className={selectCls}>
          <option value="all" className="bg-[#0a0a0a]">All roles</option>
          {ROLES.map((r) => <option key={r} value={r} className="bg-[#0a0a0a]">{r}</option>)}
        </select>
        <select value={zone} onChange={(e) => setZone(e.target.value)} className={selectCls}>
          <option value="all" className="bg-[#0a0a0a]">All zones</option>
          {ZONES.map((z) => <option key={z} value={z} className="bg-[#0a0a0a]">{z}</option>)}
        </select>
        <select value={country} onChange={(e) => setCountry(e.target.value)} className={selectCls}>
          <option value="all" className="bg-[#0a0a0a]">All countries</option>
          {countryOptions.map((c) => <option key={c} value={c} className="bg-[#0a0a0a]">{c}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
          <option value="all" className="bg-[#0a0a0a]">All statuses</option>
          {statusOptions.map((s) => <option key={s} value={s} className="bg-[#0a0a0a]">{s}</option>)}
        </select>
        <label className="flex flex-col text-white/40 text-[10px] uppercase tracking-wider">
          From
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={selectCls} />
        </label>
        <label className="flex flex-col text-white/40 text-[10px] uppercase tracking-wider">
          To
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={selectCls} />
        </label>
        <button onClick={reset} className="px-3 py-2 text-white/50 hover:text-white text-xs uppercase tracking-wider">Reset</button>
        <button onClick={exportCsv} className="ml-auto px-4 py-2 rounded bg-infrared/15 border border-infrared/40 text-infrared text-xs uppercase tracking-wider hover:bg-infrared/25 transition-colors">
          Export CSV ({total})
        </button>
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-white/60 text-xs uppercase mb-1">Total</div>
          <div className="text-white text-2xl font-bold">{total}</div>
        </div>
        {ROLES.map((r) => {
          const v = roleCount[r] ?? 0;
          const pct = total > 0 ? Math.round((v / total) * 100) : 0;
          return (
            <div key={r} className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-white/60 text-xs uppercase mb-1">{r}</div>
              <div className="text-white text-2xl font-bold">{v}</div>
              <div className="text-infrared/70 text-xs">{pct}%</div>
            </div>
          );
        })}
      </div>

      {/* Rankings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Ranking title="By country" data={byCountry} />
        <Ranking title="By city" data={byCity} />
        <Ranking title="By genre" data={byGenre} />
        <div className="space-y-4">
          <Ranking title="By zone" data={byZone} limit={5} />
          <Ranking title="By status" data={byStatus} limit={8} />
        </div>
      </div>

      {/* Trend over time */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-5">
        <div className="text-white/60 text-xs uppercase tracking-wider mb-4">Applications over time (monthly)</div>
        {byMonth.length === 0 ? (
          <div className="text-white/30 text-sm">No data</div>
        ) : (
          <div className="flex items-end gap-2 h-40">
            {byMonth.map(([month, v]) => (
              <div key={month} className="flex-1 flex flex-col items-center justify-end gap-2 min-w-0">
                <div className="text-white/50 text-xs tabular-nums">{v}</div>
                <div
                  className="w-full bg-infrared/60 rounded-t"
                  style={{ height: `${monthMax > 0 ? Math.max(4, (v / monthMax) * 100) : 0}%` }}
                />
                <div className="text-white/30 text-[10px] truncate w-full text-center" title={month}>{month}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
