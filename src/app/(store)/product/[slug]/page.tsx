import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/storeData';
import { fmtNaira, STORE_NAME } from '@/lib/utils';
import Gallery from '@/components/Gallery';
import AddToCartForm from '@/components/AddToCartForm';
import ProductGrid from '@/components/ProductGrid';
import { TruckIcon, VerifiedIcon, BankIcon } from '@/components/Icons';

export const revalidate = 30;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  const desc = `${product.description.slice(0, 140)} ${product.metal}. Real order tracking, delivery across Nigeria.`;
  return {
    title: `${product.name} — ${fmtNaira(product.price)}`,
    description: desc,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description: desc,
      images: product.images?.[0] ? [product.images[0]] : []
    }
  };
}

function careText(metal: string) {
  const base = 'Put jewelry on after perfume and lotion, and take it off before swimming, bathing or exercise.';
  if (metal.includes('Gold') && !metal.includes('Plated')) return `Wipe gently with a soft cloth after wear. ${base}`;
  if (metal.includes('Silver')) return `Silver darkens with air and skin oils; polish regularly and store airtight. ${base}`;
  if (metal.includes('Plated')) return `Gold plating wears faster with friction and moisture, so keep it dry. ${base}`;
  return `Rinse with clean water and dry after wear. ${base}`;
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    category: product.category,
    material: product.metal,
    image: product.images,
    brand: { '@type': 'Brand', name: STORE_NAME },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'NGN',
      price: String(product.price),
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition'
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 md:px-6">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted">
        <Link href="/">Home</Link> / <Link href={`/shop?cat=${product.category}`}>{product.category}</Link> / {product.name}
      </nav>

      <div className="grid gap-6 md:grid-cols-2 md:gap-11 lg:items-start">
        <Gallery images={product.images} name={product.name} />

        <div>
          <p className="text-sm text-muted">
            {product.category} in {product.metal}
            {product.stone !== 'None' ? ` with ${product.stone.toLowerCase()}` : ''}
          </p>
          <h1 className="mb-1 mt-1 font-serif text-3xl font-medium md:text-4xl">{product.name}</h1>
          <p className="mb-4 text-ink-2">{product.description}</p>

          <AddToCartForm product={product} />

          <ul className="my-5 grid gap-2.5 text-sm text-ink-2">
            <li className="flex gap-2.5">
              <TruckIcon size={20} className="flex-none text-gold" />
              <span>Delivery across Nigeria, tracked from confirmation to your door.</span>
            </li>
            <li className="flex gap-2.5">
              <VerifiedIcon size={20} className="flex-none text-gold" />
              <span>
                {product.metal.includes('Gold') && !product.metal.includes('Plated')
                  ? 'Hallmarked 18k gold with certificate of authenticity.'
                  : 'Quality checked before dispatch.'}
              </span>
            </li>
            <li className="flex gap-2.5">
              <BankIcon size={20} className="flex-none text-gold" />
              <span>Pay by bank transfer once your order is confirmed.</span>
            </li>
          </ul>

          <details open className="border-t border-line py-1">
            <summary className="flex min-h-[50px] cursor-pointer list-none items-center justify-between font-semibold">
              Materials and details
            </summary>
            <ul className="list-disc pb-3.5 pl-5 text-ink-2">
              {product.details.map((d) => (
                <li key={d} className="mb-1">{d}</li>
              ))}
            </ul>
          </details>
          <details className="border-t border-line py-1">
            <summary className="flex min-h-[50px] cursor-pointer list-none items-center justify-between font-semibold">Care</summary>
            <p className="pb-3.5 text-ink-2">{careText(product.metal)}</p>
          </details>
          <details className="border-b border-t border-line py-1">
            <summary className="flex min-h-[50px] cursor-pointer list-none items-center justify-between font-semibold">
              Delivery and returns
            </summary>
            <p className="pb-3.5 text-ink-2">
              Delivery estimates and fees are shown at checkout. Unworn pieces can be returned within 7 days. Engraved
              and custom pieces are final sale unless faulty.{' '}
              <Link href="/page/returns" className="font-semibold underline">
                Read the full policy
              </Link>
              .
            </p>
          </details>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3.5 font-serif text-2xl font-medium">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
