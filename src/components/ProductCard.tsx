'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ProductDTO } from '@/lib/types';
import { fmtNaira } from '@/lib/utils';
import WishlistButton from './WishlistButton';

function minPrice(p: ProductDTO) {
  const adj = Object.values(p.sizePriceAdjust || {});
  const min = adj.length ? Math.min(0, ...adj) : 0;
  return p.price + min;
}

export default function ProductCard({ product, priority = false }: { product: ProductDTO; priority?: boolean }) {
  const hasRange = Object.keys(product.sizePriceAdjust || {}).length > 0;
  const img = product.images?.[0];
  const soldOut = product.stock === 0;

  return (
    <article className="group relative">
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden rounded-2xl bg-surface-3">
        {img && (
          <motion.div className="h-full w-full" whileHover={{ scale: 1.05 }} transition={{ duration: 0.45 }}>
            <Image
              src={img}
              alt={product.name}
              fill
              priority={priority}
              sizes="(min-width: 1000px) 25vw, (min-width: 700px) 33vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        )}
        {soldOut ? (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-bg">Sold out</span>
        ) : product.badge ? (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-bg px-2.5 py-1 text-xs font-bold text-ink">{product.badge}</span>
        ) : null}
      </Link>
      <WishlistButton id={product._id} name={product.name} />
      <div className="pt-2.5">
        <p className="text-xs text-muted">{product.metal}</p>
        <h3 className="mb-1 mt-0.5 line-clamp-2 text-[15px] font-semibold leading-snug">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="text-[15px] font-bold">
          {hasRange && <span className="text-xs font-medium text-muted">From </span>}
          {fmtNaira(minPrice(product))}
        </p>
      </div>
    </article>
  );
}
