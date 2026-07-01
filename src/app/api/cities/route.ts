import { NextResponse } from 'next/server';
import cities from 'all-the-cities';
import { COUNTRY_BY_ISO2 } from '@/lib/geo';

// Uses the full ~135k-city dataset in memory, so it needs the Node runtime.
export const runtime = 'nodejs';

// Precompute a lowercased search index once per (cold) process. Skip cities whose
// country code we can't map to a zone so every result is usable by the form.
const INDEX = cities
  .filter((c) => COUNTRY_BY_ISO2[c.country])
  .map((c) => ({ name: c.name, lower: c.name.toLowerCase(), cc: c.country, pop: c.population }));

const LIMIT = 8;

export function GET(request: Request) {
  const q = (new URL(request.url).searchParams.get('q') || '').trim().toLowerCase();
  if (q.length < 2) return NextResponse.json([]);

  const starts: typeof INDEX = [];
  const contains: typeof INDEX = [];
  for (const c of INDEX) {
    if (c.lower.startsWith(q)) starts.push(c);
    else if (c.lower.includes(q)) contains.push(c);
  }
  // Prefix matches first, each ranked by population (so "par" -> Paris FR before Parma).
  starts.sort((a, b) => b.pop - a.pop);
  contains.sort((a, b) => b.pop - a.pop);

  const out = starts.concat(contains).slice(0, LIMIT).map((c) => {
    const meta = COUNTRY_BY_ISO2[c.cc];
    return { city: c.name, country: meta.name, zone: meta.zone };
  });
  return NextResponse.json(out);
}
