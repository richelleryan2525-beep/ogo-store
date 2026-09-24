'use client';

import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { FREE_LAGOS_OVER, fmtNaira } from '@/lib/utils';
import { BagIcon, CloseIcon, TrashIcon } from './Icons';

export default function CartDrawer() {
  const { lines, subtotal, isOpen, closeCart, updateQty, removeLine } = useCart();
  const left = FREE_LAGOS_OVER - subtotal;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your bag"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-bg shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <h2 className="font-serif text-lg font-semibold">Your bag</h2>
              <button aria-label="Close bag" onClick={closeCart} className="grid h-10 w-10 place-items-center">
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-3">
              {lines.length === 0 ? (
                <div className="grid justify-items-center gap-3 py-16 text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-surface-3 text-gold">
                    <BagIcon size={28} />
                  </div>
                  <h3 className="font-serif text-xl">Your bag is empty</h3>
                  <p className="max-w-[26ch] text-sm text-muted">Add a piece you love, then check out for a real order with delivery tracking.</p>
                  <Link href="/shop" onClick={closeCart} className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-bg">
                    Browse jewelry
                  </Link>
                </div>
              ) : (
                lines.map((l) => (
                  <div key={l.key} className="flex gap-3 border-b border-line py-4">
                    <div className="relative h-[76px] w-[76px] flex-none overflow-hidden rounded-lg bg-surface-3">
                      {l.image && <Image src={l.image} alt="" fill sizes="76px" className="object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link href={`/product/${l.slug}`} onClick={closeCart} className="line-clamp-2 font-semibold hover:underline">
                        {l.name}
                      </Link>
                      <p className="text-sm text-muted">
                        {l.size}
                        {l.engravingText ? `${l.size ? ' · ' : ''}Engraving: "${l.engravingText}"` : ''}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-xl border border-line">
                          <button
                            aria-label="Decrease quantity"
                            className="grid h-9 w-9 place-items-center text-lg"
                            onClick={() => updateQty(l.key, l.qty - 1)}
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-semibold">{l.qty}</span>
                          <button
                            aria-label="Increase quantity"
                            className="grid h-9 w-9 place-items-center text-lg"
                            onClick={() => updateQty(l.key, l.qty + 1)}
                          >
                            +
                          </button>
                        </div>
                        <strong>{fmtNaira(l.unitPrice * l.qty)}</strong>
                      </div>
                      <button
                        onClick={() => removeLine(l.key)}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-danger"
                      >
                        <TrashIcon size={14} /> Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-line px-5 py-4">
                <div className="flex justify-between text-base">
                  <span>Subtotal</span>
                  <strong>{fmtNaira(subtotal)}</strong>
                </div>
                {left > 0 ? (
                  <>
                    <p className="mt-1.5 text-xs text-muted">Add {fmtNaira(left)} more for free Lagos delivery.</p>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-3">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, (subtotal / FREE_LAGOS_OVER) * 100)}%` }} />
                    </div>
                  </>
                ) : (
                  <p className="mt-1.5 text-xs font-semibold text-ok">You've unlocked free Lagos delivery.</p>
                )}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="mt-4 flex min-h-[50px] items-center justify-center rounded-xl bg-ink text-base font-semibold text-bg"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
