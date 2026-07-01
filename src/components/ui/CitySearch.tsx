'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { COUNTRIES } from '@/lib/geo';

type Suggestion = { city: string; country: string; zone: string };

type Props = {
  city: string;
  country: string;
  /** Called with the resolved (city, country, zone). Empty strings while incomplete. */
  onSelect: (city: string, country: string, zone: string) => void;
};

const inputCls =
  'w-full px-4 py-5 bg-white/5 border border-white/10 text-white text-center text-sm md:text-base font-tech rounded focus:outline-none focus:border-infrared/50 transition-colors';

export function CitySearch({ city, country, onSelect }: Props) {
  const { t } = useLanguage();
  const [query, setQuery] = useState(city && country ? `${city}, ${country}` : city || '');
  const [results, setResults] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manual, setManual] = useState(false);
  const [manualCity, setManualCity] = useState('');
  const [manualCountry, setManualCountry] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  function runSearch(v: string) {
    setQuery(v);
    onSelect('', '', ''); // typing invalidates any prior pick — keep NEXT gated until re-selected
    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort(); // cancel any in-flight request so stale results can't land
    const term = v.trim();
    if (term.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    setOpen(true);
    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch(`/api/cities?q=${encodeURIComponent(term)}`, { signal: controller.signal });
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!(e instanceof DOMException && e.name === 'AbortError')) setResults([]);
      } finally {
        if (abortRef.current === controller) setLoading(false);
      }
    }, 220);
  }

  function pick(s: Suggestion) {
    onSelect(s.city, s.country, s.zone);
    setQuery(`${s.city}, ${s.country}`);
    setResults([]);
    setOpen(false);
  }

  function updateManual(nextCity: string, nextCountry: string) {
    setManualCity(nextCity);
    setManualCountry(nextCountry);
    const entry = COUNTRIES.find((c) => c.name === nextCountry);
    if (nextCity.trim() && entry) onSelect(nextCity.trim(), entry.name, entry.zone);
    else onSelect('', '', '');
  }

  if (manual) {
    return (
      <div className="w-full space-y-6">
        <input
          type="text"
          value={manualCity}
          onChange={(e) => updateManual(e.target.value, manualCountry)}
          placeholder={t('select_city')}
          maxLength={60}
          autoComplete="off"
          className={inputCls}
        />
        <select
          value={manualCountry}
          onChange={(e) => updateManual(manualCity, e.target.value)}
          className={inputCls}
        >
          <option value="" disabled>
            {t('select_country')}
          </option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.name} className="bg-[#0a0a0a] text-white">
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            setManual(false);
            updateManual('', '');
          }}
          className="text-xs text-white/40 hover:text-infrared transition-colors font-tech"
        >
          ← {t('back')}
        </button>
      </div>
    );
  }

  return (
    <div ref={boxRef} className="w-full relative">
      <input
        type="text"
        value={query}
        onChange={(e) => runSearch(e.target.value)}
        onFocus={() => {
          if (results.length) setOpen(true);
        }}
        placeholder={t('select_city')}
        autoComplete="off"
        className={inputCls}
      />
      {open && (
        <div className="absolute z-30 mt-1 w-full rounded border border-white/10 bg-[#0a0a0a] max-h-64 overflow-y-auto text-left shadow-xl">
          {loading && <div className="px-4 py-3 text-sm text-white/40 font-tech">…</div>}
          {!loading && results.length === 0 && query.trim().length >= 2 && (
            <div className="px-4 py-3 text-sm text-white/40 font-tech">{t('city_not_found')}</div>
          )}
          {!loading &&
            results.map((s, i) => (
              <button
                key={`${s.city}-${s.country}-${i}`}
                type="button"
                onClick={() => pick(s)}
                className="block w-full text-left px-4 py-3 text-sm hover:bg-white/5 font-tech transition-colors"
              >
                <span className="text-white">{s.city}</span>
                <span className="text-white/40">, {s.country}</span>
              </button>
            ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => {
          setManual(true);
          setOpen(false);
          onSelect('', '', '');
        }}
        className="mt-3 text-xs text-white/40 hover:text-infrared transition-colors font-tech"
      >
        {t('city_not_found')}
      </button>
    </div>
  );
}
