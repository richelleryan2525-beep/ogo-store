'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CATEGORIES, METALS, OCCASIONS, STONES } from '@/lib/utils';
import { PRICE_BANDS } from '@/lib/priceBands';
import { CloseIcon, FilterIcon } from './Icons';

function toggle(list: string[], v: string) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

export default function ShopToolbar({ resultCount }: { resultCount: number }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [open, setOpen] = useState(false);

  const cat = sp.get('cat') || 'All';
  const sort = sp.get('sort') || 'featured';
  const metal = sp.getAll('metal');
  const stone = sp.getAll('stone');
  const occ = sp.getAll('occ');
  const price = sp.get('price') || 'any';

  function push(next: URLSearchParams) {
    router.push(`/shop?${next.toString()}`);
  }

  function setCat(v: string) {
    const next = new URLSearchParams(sp.toString());
    if (v === 'All') next.delete('cat');
    else next.set('cat', v);
    push(next);
  }

  function setSort(v: string) {
    const next = new URLSearchParams(sp.toString());
    next.set('sort', v);
    push(next);
  }

  function setMulti(key: 'metal' | 'stone' | 'occ', v: string) {
    const cur = sp.getAll(key);
    const nextVals = toggle(cur, v);
    const next = new URLSearchParams(sp.toString());
    next.delete(key);
    nextVals.forEach((x) => next.append(key, x));
    push(next);
  }

  function setPrice(v: string) {
    const next = new URLSearchParams(sp.toString());
    if (v === 'any') next.delete('price');
    else next.set('price', v);
    push(next);
  }

  function clearFilters() {
    const next = new URLSearchParams();
    if (cat !== 'All') next.set('cat', cat);
    if (sp.get('q')) next.set('q', sp.get('q')!);
    push(next);
  }

  const activeCount = metal.length + stone.length + occ.length + (price !== 'any' ? 1 : 0);

  return (
    <div>
      <div className="scrollbar-none -mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1">
        {['All', ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            className={`min-h-[42px] whitespace-nowrap rounded-full border px-4 text-sm font-semibold ${
              cat === c ? 'border-ink bg-ink text-bg' : 'border-line bg-surface'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mb-3.5 flex items-center justify-between gap-2.5">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-line bg-surface px-4 text-sm font-semibold"
        >
          <FilterIcon size={18} /> Filters{activeCount ? ` (${activeCount})` : ''}
        </button>
        <label className="flex items-center gap-2 text-sm font-semibold">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="min-h-[44px] rounded-lg border border-line bg-surface px-2 text-sm"
          >
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      <p aria-live="polite" className="mb-3 text-sm text-muted">
        {resultCount} piece{resultCount === 1 ? '' : 's'}
      </p>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-bg"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.28 }}
            >
              <div className="flex h-15 items-center justify-between border-b border-line px-5 py-3.5">
                <h2 className="font-serif text-lg font-semibold">Filters</h2>
                <button onClick={() => setOpen(false)} aria-label="Close filters" className="grid h-10 w-10 place-items-center">
                  <CloseIcon />
                </button>
              </div>
              <div className="px-5 py-4">
                <FilterGroup title="Metal" options={METALS as unknown as string[]} active={metal} onToggle={(v) => setMulti('metal', v)} />
                <FilterGroup title="Gemstone" options={STONES.filter((s) => s !== 'None')} active={stone} onToggle={(v) => setMulti('stone', v)} />
                <FilterGroup title="Occasion" options={OCCASIONS as unknown as string[]} active={occ} onToggle={(v) => setMulti('occ', v)} />
                <div className="mb-5">
                  <h3 className="mb-2.5 text-sm font-semibold">Price</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(PRICE_BANDS).map(([k, v]) => (
                      <button
                        key={k}
                        onClick={() => setPrice(k)}
                        aria-pressed={price === k}
                        className={`min-h-[42px] rounded-full border px-4 text-sm font-semibold ${
                          price === k ? 'border-ink bg-ink text-bg' : 'border-line bg-surface'
                        }`}
                      >
                        {v[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="sticky bottom-0 grid gap-2.5 border-t border-line bg-bg px-5 py-3.5">
                <button onClick={() => setOpen(false)} className="min-h-[50px] rounded-xl bg-ink font-semibold text-bg">
                  Show {resultCount} piece{resultCount === 1 ? '' : 's'}
                </button>
                <button onClick={clearFilters} className="min-h-[46px] rounded-xl border border-line font-semibold">
                  Clear all filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterGroup({
  title,
  options,
  active,
  onToggle
}: {
  title: string;
  options: string[];
  active: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="mb-5">
      <h3 className="mb-2.5 text-sm font-semibold">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onToggle(o)}
            aria-pressed={active.includes(o)}
            className={`min-h-[42px] rounded-full border px-4 text-sm font-semibold ${
              active.includes(o) ? 'border-ink bg-ink text-bg' : 'border-line bg-surface'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
