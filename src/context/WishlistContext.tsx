'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface WishlistContextValue {
  ids: string[];
  isSaved: (id: string) => boolean;
  toggle: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = 'ogo_wishlist_v1';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }, [ids, hydrated]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      ids,
      isSaved: (id: string) => ids.includes(id),
      toggle: (id: string) =>
        setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    }),
    [ids]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
