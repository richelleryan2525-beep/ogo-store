'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { erpFetch } from '@/lib/erpFetch';
import { CATEGORIES, METALS, OCCASIONS, STONES } from '@/lib/utils';
import { ProductDTO } from '@/lib/types';
import ImageManager from './ImageManager';

type FormState = {
  name: string;
  slug: string;
  category: string;
  metal: string;
  stone: string;
  occasions: string[];
  price: string;
  description: string;
  details: string;
  images: string[];
  stock: string;
  badge: string;
  featured: boolean;
  active: boolean;
  sizeOptionLabel: string;
  sizeOptionsCsv: string;
  sizePriceAdjust: Record<string, string>;
  engEnabled: boolean;
  engLabel: string;
  engMax: string;
  engExtraPrice: string;
  engRequired: boolean;
};

function toForm(p?: ProductDTO): FormState {
  return {
    name: p?.name || '',
    slug: p?.slug || '',
    category: p?.category || CATEGORIES[0],
    metal: p?.metal || METALS[0],
    stone: p?.stone || 'None',
    occasions: p?.occasions || [],
    price: p ? String(p.price) : '',
    description: p?.description || '',
    details: (p?.details || []).join('\n'),
    images: p?.images || [],
    stock: p ? String(p.stock) : '0',
    badge: p?.badge || '',
    featured: p?.featured || false,
    active: p?.active ?? true,
    sizeOptionLabel: p?.sizeOptionLabel || '',
    sizeOptionsCsv: (p?.sizeOptions || []).join(', '),
    sizePriceAdjust: Object.fromEntries(Object.entries(p?.sizePriceAdjust || {}).map(([k, v]) => [k, String(v)])),
    engEnabled: p?.engraving?.enabled || false,
    engLabel: p?.engraving?.label || 'Text to engrave',
    engMax: p?.engraving ? String(p.engraving.maxLength ?? 12) : '12',
    engExtraPrice: p?.engraving ? String(p.engraving.extraPrice ?? 0) : '0',
    engRequired: p?.engraving?.required || false
  };
}

export default function ProductForm({ product }: { product?: ProductDTO }) {
  const router = useRouter();
  const [f, setF] = useState<FormState>(() => toForm(product));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const sizeOptions = useMemo(
    () => f.sizeOptionsCsv.split(',').map((s) => s.trim()).filter(Boolean),
    [f.sizeOptionsCsv]
  );

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setF((prev) => ({ ...prev, [key]: value }));
  }

  function toggleOcc(o: string) {
    setF((prev) => ({
      ...prev,
      occasions: prev.occasions.includes(o) ? prev.occasions.filter((x) => x !== o) : [...prev.occasions, o]
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    if (!f.name.trim() || !f.price) {
      setErr('Name and price are required.');
      return;
    }
    setSaving(true);
    const payload = {
      name: f.name.trim(),
      slug: f.slug.trim() || undefined,
      category: f.category,
      metal: f.metal,
      stone: f.stone,
      occasions: f.occasions,
      price: Number(f.price),
      description: f.description.trim(),
      details: f.details.split('\n').map((s) => s.trim()).filter(Boolean),
      images: f.images,
      stock: Number(f.stock) || 0,
      badge: f.badge.trim() || undefined,
      featured: f.featured,
      active: f.active,
      sizeOptionLabel: sizeOptions.length ? f.sizeOptionLabel.trim() || 'Size' : undefined,
      sizeOptions,
      sizePriceAdjust: Object.fromEntries(
        sizeOptions.map((s) => [s, Number(f.sizePriceAdjust[s] || 0)]).filter(([, v]) => v !== 0)
      ),
      engraving: {
        enabled: f.engEnabled,
        label: f.engLabel.trim() || 'Text to engrave',
        maxLength: Number(f.engMax) || 12,
        extraPrice: Number(f.engExtraPrice) || 0,
        required: f.engRequired
      }
    };
    try {
      if (product) {
        await erpFetch(`/api/erp/products/${product._id}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await erpFetch('/api/erp/products', { method: 'POST', body: JSON.stringify(payload) });
      }
      router.push('/ERP/products');
      router.refresh();
    } catch (e2) {
      setErr((e2 as Error).message);
      setSaving(false);
    }
  }

  const inputCls = 'min-h-[46px] w-full rounded-lg border border-line bg-bg px-3.5 text-sm';
  const label = 'mb-1.5 block text-sm font-semibold';

  return (
    <form onSubmit={submit} className="grid max-w-3xl gap-5">
      {err && <div className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm font-medium text-danger">{err}</div>}

      <div className="grid gap-4 rounded-xl border border-line bg-surface p-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className={label}>Name</label>
          <input value={f.name} onChange={(e) => set('name', e.target.value)} className={inputCls} required />
        </div>
        <div>
          <label className={label}>Slug (optional — auto-generated if blank)</label>
          <input value={f.slug} onChange={(e) => set('slug', e.target.value)} className={inputCls} placeholder="e.g. adaeze-pave-ring" />
        </div>
        <div>
          <label className={label}>Price (₦)</label>
          <input type="number" min={0} value={f.price} onChange={(e) => set('price', e.target.value)} className={inputCls} required />
        </div>
        <div>
          <label className={label}>Category</label>
          <select value={f.category} onChange={(e) => set('category', e.target.value)} className={inputCls}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Metal</label>
          <select value={f.metal} onChange={(e) => set('metal', e.target.value)} className={inputCls}>
            {METALS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Gemstone</label>
          <select value={f.stone} onChange={(e) => set('stone', e.target.value)} className={inputCls}>
            {STONES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Stock</label>
          <input type="number" min={0} value={f.stock} onChange={(e) => set('stock', e.target.value)} className={inputCls} />
        </div>
        <div className="md:col-span-2">
          <label className={label}>Occasions</label>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((o) => (
              <button
                type="button"
                key={o}
                onClick={() => toggleOcc(o)}
                aria-pressed={f.occasions.includes(o)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold ${
                  f.occasions.includes(o) ? 'border-ink bg-ink text-bg' : 'border-line bg-bg'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={label}>Badge (optional)</label>
          <input value={f.badge} onChange={(e) => set('badge', e.target.value)} placeholder="e.g. Bestseller, New" className={inputCls} />
        </div>
        <div className="flex items-end gap-5">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={f.featured} onChange={(e) => set('featured', e.target.checked)} className="h-5 w-5 accent-ink" />
            Featured on homepage
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={f.active} onChange={(e) => set('active', e.target.checked)} className="h-5 w-5 accent-ink" />
            Active (visible in shop)
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface p-4">
        <label className={label}>Description</label>
        <textarea value={f.description} onChange={(e) => set('description', e.target.value)} rows={3} className={inputCls} />
        <label className={`${label} mt-4`}>Details (one per line — shown as bullet points)</label>
        <textarea value={f.details} onChange={(e) => set('details', e.target.value)} rows={4} className={inputCls} />
      </div>

      <div className="rounded-xl border border-line bg-surface p-4">
        <label className={label}>Photos (first one is the main photo)</label>
        <ImageManager images={f.images} onChange={(images) => set('images', images)} />
      </div>

      <div className="rounded-xl border border-line bg-surface p-4">
        <p className="mb-3 font-serif text-lg font-medium">Size options</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={label}>Size label (e.g. "Ring size", "Chain length")</label>
            <input value={f.sizeOptionLabel} onChange={(e) => set('sizeOptionLabel', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={label}>Sizes, comma separated (leave blank if none)</label>
            <input value={f.sizeOptionsCsv} onChange={(e) => set('sizeOptionsCsv', e.target.value)} className={inputCls} placeholder="5, 6, 7, 8" />
          </div>
        </div>
        {sizeOptions.length > 0 && (
          <div className="mt-3">
            <p className="mb-2 text-sm font-semibold">Price adjustment per size (₦, can be negative)</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {sizeOptions.map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm">
                  <span className="w-16 flex-none font-medium">{s}</span>
                  <input
                    type="number"
                    value={f.sizePriceAdjust[s] || ''}
                    onChange={(e) => setF((prev) => ({ ...prev, sizePriceAdjust: { ...prev.sizePriceAdjust, [s]: e.target.value } }))}
                    className="min-h-[40px] w-full rounded-lg border border-line bg-bg px-2 text-sm"
                    placeholder="0"
                  />
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-line bg-surface p-4">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={f.engEnabled} onChange={(e) => set('engEnabled', e.target.checked)} className="h-5 w-5 accent-ink" />
          Allow engraving on this product
        </label>
        {f.engEnabled && (
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <label className={label}>Prompt label</label>
              <input value={f.engLabel} onChange={(e) => set('engLabel', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={label}>Max characters</label>
              <input type="number" value={f.engMax} onChange={(e) => set('engMax', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={label}>Extra price (₦)</label>
              <input type="number" value={f.engExtraPrice} onChange={(e) => set('engExtraPrice', e.target.value)} className={inputCls} />
            </div>
            <label className="flex items-end gap-2 text-sm font-semibold">
              <input type="checkbox" checked={f.engRequired} onChange={(e) => set('engRequired', e.target.checked)} className="h-5 w-5 accent-ink" />
              Required at checkout
            </label>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button disabled={saving} className="min-h-[48px] rounded-xl bg-ink px-6 font-semibold text-bg disabled:opacity-60">
          {saving ? 'Saving…' : product ? 'Save changes' : 'Create product'}
        </button>
        <button type="button" onClick={() => router.push('/ERP/products')} className="min-h-[48px] rounded-xl border border-line px-6 font-semibold">
          Cancel
        </button>
      </div>
    </form>
  );
}
