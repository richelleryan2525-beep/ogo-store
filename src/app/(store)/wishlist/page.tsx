'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { ProductDTO } from '@/lib/types';
import ProductGrid from '@/components/ProductGrid';
import { HeartIcon } from '@/components/Icons';

export default function WishlistPage() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState<ProductDTO[] | null>(null);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      return;
    }
    fetch(`/api/products?ids=${ids.join(',')}`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]));
  }, [ids]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
      <h1 className="mb-4 font-serif text-3xl font-medium">Saved pieces</h1>
      {products === null ? (
        <p className="text-muted">Loading…</p>
      ) : products.length === 0 ? (
        <div className="grid justify-items-center gap-3 py-16 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-surface-3 text-gold">
            <HeartIcon size={28} />
          </div>
          <h2 className="font-serif text-2xl">No saved pieces yet</h2>
          <p className="max-w-[30ch] text-muted">Tap the heart on any piece to keep it here.</p>
          <Link href="/shop" className="rounded-xl bg-ink px-5 py-3 font-semibold text-bg">
            Browse jewelry
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
