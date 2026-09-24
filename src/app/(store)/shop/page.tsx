import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getProducts } from '@/lib/storeData';
import ProductGrid from '@/components/ProductGrid';
import ShopToolbar from '@/components/ShopToolbar';
import { PRICE_BANDS } from '@/lib/priceBands';
import { STORE_NAME } from '@/lib/utils';

export const revalidate = 30;

type SP = { [key: string]: string | string[] | undefined };

function arr(v: string | string[] | undefined) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const cat = typeof searchParams.cat === 'string' ? searchParams.cat : undefined;
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const title = q ? `Search: ${q}` : cat && cat !== 'All' ? `${cat} in Lagos, Nigeria` : 'Shop all jewelry';
  return {
    title,
    description: `Shop ${cat && cat !== 'All' ? cat.toLowerCase() : 'jewelry'} from ${STORE_NAME}. Hallmarked gold, diamonds and silver, delivered across Nigeria.`,
    alternates: { canonical: `/shop${cat && cat !== 'All' ? `?cat=${cat}` : ''}` }
  };
}

export default async function ShopPage({ searchParams }: { searchParams: SP }) {
  const cat = typeof searchParams.cat === 'string' ? searchParams.cat : 'All';
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const sort = (typeof searchParams.sort === 'string' ? searchParams.sort : 'featured') as
    | 'featured'
    | 'low'
    | 'high'
    | 'name';
  const priceKey = typeof searchParams.price === 'string' ? searchParams.price : 'any';
  const band = PRICE_BANDS[priceKey] || PRICE_BANDS.any;

  const products = await getProducts({
    cat,
    q,
    metal: arr(searchParams.metal),
    stone: arr(searchParams.stone),
    occ: arr(searchParams.occ),
    priceMin: band[1],
    priceMax: band[2] === Infinity ? undefined : band[2],
    sort
  });

  const title = q ? `Results for "${q}"` : cat === 'All' ? 'All jewelry' : cat;

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 md:px-6">
      <h1 className="mb-4 font-serif text-3xl font-medium md:text-4xl">{title}</h1>
      <Suspense fallback={<div className="mb-4 h-24" />}>
        <ShopToolbar resultCount={products.length} />
      </Suspense>
      {products.length ? (
        <ProductGrid products={products} />
      ) : (
        <div className="grid justify-items-center gap-3 py-16 text-center">
          <h2 className="font-serif text-2xl">No pieces match</h2>
          <p className="max-w-[34ch] text-muted">Try removing a filter or searching a different word.</p>
        </div>
      )}
    </div>
  );
}
