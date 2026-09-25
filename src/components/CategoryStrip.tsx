import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/lib/utils';

// A distinct jewel-tone per category so the row reads as colorful even
// before real photos are added — matches how the reference sites use a
// different accent color per tile. Edit these freely to taste.
const TILE_COLORS: Record<string, string> = {
  Rings: '#8a4a3a', // terracotta
  Necklaces: '#1f5f6b', // deep teal
  Earrings: '#6b4423', // walnut brown
  Bracelets: '#7a5c8f' // plum
};

// Optional real photo per category, set via env (e.g. NEXT_PUBLIC_CAT_RINGS_IMAGE).
const TILE_IMAGES: Record<string, string> = {
  Rings: process.env.NEXT_PUBLIC_CAT_RINGS_IMAGE || '',
  Necklaces: process.env.NEXT_PUBLIC_CAT_NECKLACES_IMAGE || '',
  Earrings: process.env.NEXT_PUBLIC_CAT_EARRINGS_IMAGE || '',
  Bracelets: process.env.NEXT_PUBLIC_CAT_BRACELETS_IMAGE || ''
};

export default function CategoryStrip() {
  return (
    <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 py-2 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0">
      {CATEGORIES.map((c) => {
        const img = TILE_IMAGES[c];
        return (
          <Link
            key={c}
            href={`/shop?cat=${encodeURIComponent(c)}`}
            className="group relative block aspect-[3/4] min-w-[150px] flex-none overflow-hidden rounded-2xl md:min-w-0"
            style={{ backgroundColor: TILE_COLORS[c] }}
          >
            {img && (
              <Image
                src={img}
                alt=""
                fill
                sizes="(min-width: 768px) 25vw, 45vw"
                className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
            <span className="absolute bottom-3 left-3 text-sm font-extrabold uppercase tracking-wide text-white">
              {c}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
