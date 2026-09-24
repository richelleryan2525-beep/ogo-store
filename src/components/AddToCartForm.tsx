'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductDTO } from '@/lib/types';
import { fmtNaira, STORE_NAME, STORE_WHATSAPP } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { WaIcon } from './Icons';

export default function AddToCartForm({ product }: { product: ProductDTO }) {
  const { addLine, openCart } = useCart();
  const router = useRouter();
  const [size, setSize] = useState<string | null>(null);
  const [engraving, setEngraving] = useState('');
  const [qty, setQty] = useState(1);
  const [sizeErr, setSizeErr] = useState(false);
  const [engErr, setEngErr] = useState(false);
  const [stockMsg, setStockMsg] = useState('');

  const soldOut = product.stock === 0;
  const hasOptions = product.sizeOptions.length > 0;
  const eng = product.engraving;

  const unitPrice = useMemo(() => {
    let p = product.price;
    if (size && product.sizePriceAdjust[size]) p += product.sizePriceAdjust[size];
    if (engraving.trim() && eng?.enabled) p += eng.extraPrice || 0;
    return p;
  }, [product, size, engraving, eng]);

  function validate() {
    let ok = true;
    if (hasOptions && !size) {
      setSizeErr(true);
      ok = false;
    }
    if (eng?.enabled && eng.required && !engraving.trim()) {
      setEngErr(true);
      ok = false;
    }
    return ok;
  }

  function handleAdd(buyNow: boolean) {
    if (!validate()) return;
    const res = addLine({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.images?.[0] || '',
      unitPrice,
      qty,
      size: size || undefined,
      engravingText: engraving.trim() || undefined,
      stock: product.stock
    });
    if (!res.ok) {
      setStockMsg(res.reason || 'Could not add to bag.');
      return;
    }
    if (buyNow) router.push('/checkout');
    else openCart();
  }

  const msg = encodeURIComponent(`Hello ${STORE_NAME}! Is the ${product.name} coming back in stock?`);

  return (
    <div>
      <p className="mb-2 font-serif text-2xl font-medium" aria-live="polite">
        {fmtNaira(unitPrice)}
      </p>
      {soldOut ? (
        <p className="mb-3 text-sm font-semibold text-danger">Sold out</p>
      ) : product.stock <= 3 ? (
        <p className="mb-3 text-sm font-semibold text-danger">Only {product.stock} left</p>
      ) : (
        <p className="mb-3 text-sm font-semibold text-ok">In stock</p>
      )}

      {hasOptions && (
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between font-semibold">
            <span>{product.sizeOptionLabel || 'Size'}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizeOptions.map((v) => {
              const adj = product.sizePriceAdjust[v];
              return (
                <button
                  key={v}
                  type="button"
                  aria-pressed={size === v}
                  onClick={() => {
                    setSize(v);
                    setSizeErr(false);
                  }}
                  className={`min-h-[42px] rounded-full border px-4 text-sm font-semibold ${
                    size === v ? 'border-ink bg-ink text-bg' : 'border-line bg-surface'
                  }`}
                >
                  {v}
                  {adj ? <small className="ml-1 font-medium opacity-70">{adj > 0 ? `+${fmtNaira(adj)}` : `−${fmtNaira(Math.abs(adj))}`}</small> : null}
                </button>
              );
            })}
          </div>
          {sizeErr && <p className="mt-1.5 text-sm font-medium text-danger">Choose a {(product.sizeOptionLabel || 'size').toLowerCase()} to continue.</p>}
        </div>
      )}

      {eng?.enabled && (
        <div className="mb-4">
          <label htmlFor="eng" className="mb-2 block font-semibold">
            {eng.label || 'Engraving text'}
            {!eng.required && ' (optional)'}
          </label>
          <input
            id="eng"
            value={engraving}
            maxLength={eng.maxLength || 12}
            onChange={(e) => {
              setEngraving(e.target.value);
              setEngErr(false);
            }}
            placeholder={eng.required ? 'Required' : 'Optional'}
            className="min-h-[50px] w-full rounded-xl border border-line bg-surface px-3.5 text-base"
          />
          <p className="mt-1.5 text-sm text-muted">
            {eng.extraPrice ? `Engraving adds ${fmtNaira(eng.extraPrice)}. ` : ''}Engraved pieces are final sale.
          </p>
          {engErr && <p className="mt-1 text-sm font-medium text-danger">Enter the text to engrave.</p>}
        </div>
      )}

      {!soldOut && (
        <div className="mb-4 inline-flex items-center rounded-xl border border-line">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center text-xl" aria-label="Decrease quantity">
            −
          </button>
          <span className="w-8 text-center font-bold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(5, product.stock, q + 1))}
            className="grid h-11 w-11 place-items-center text-xl"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      )}

      {stockMsg && <p className="mb-3 text-sm font-medium text-danger">{stockMsg}</p>}

      <div className="grid gap-2.5">
        {soldOut ? (
          <a
            href={`https://wa.me/${STORE_WHATSAPP}?text=${msg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-wa font-semibold text-white"
          >
            <WaIcon size={20} /> Ask about restock
          </a>
        ) : (
          <>
            <button onClick={() => handleAdd(false)} className="min-h-[50px] rounded-xl bg-ink font-semibold text-bg">
              Add to bag
            </button>
            <button onClick={() => handleAdd(true)} className="min-h-[50px] rounded-xl bg-accent font-semibold text-[#1b1300]">
              Buy now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
