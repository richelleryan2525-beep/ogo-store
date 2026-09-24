'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface CartLine {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  qty: number;
  size?: string;
  engravingText?: string;
  stock: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addLine: (line: Omit<CartLine, 'key'>) => { ok: boolean; reason?: string };
  updateQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'ogo_cart_v1';

function keyOf(productId: string, size?: string, engravingText?: string) {
  return [productId, size || '', engravingText || ''].join('|');
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore corrupted storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage may be unavailable (private mode) */
    }
  }, [lines, hydrated]);

  const addLine = useCallback((line: Omit<CartLine, 'key'>) => {
    const key = keyOf(line.productId, line.size, line.engravingText);
    let ok = true;
    let reason: string | undefined;
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      const currentQtyForProduct = prev
        .filter((l) => l.productId === line.productId)
        .reduce((s, l) => s + l.qty, 0);
      if (currentQtyForProduct + line.qty > line.stock) {
        ok = false;
        reason = `Only ${line.stock} in stock`;
        return prev;
      }
      if (existing) {
        return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + line.qty } : l));
      }
      return [...prev, { ...line, key }];
    });
    return { ok, reason };
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    setLines((prev) => {
      if (qty < 1) return prev.filter((l) => l.key !== key);
      return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, l.stock) } : l));
    });
  }, []);

  const removeLine = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.unitPrice * l.qty, 0), [lines]);

  const value: CartContextValue = {
    lines,
    count,
    subtotal,
    isOpen,
    openCart,
    closeCart,
    addLine,
    updateQty,
    removeLine,
    clear
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
