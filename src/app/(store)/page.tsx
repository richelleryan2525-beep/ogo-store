import Link from 'next/link';
import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import CategoryStrip from '@/components/CategoryStrip';
import BrandStatement from '@/components/BrandStatement';
import ShopTheLook from '@/components/ShopTheLook';
import TrustStrip from '@/components/TrustStrip';
import HowItWorks from '@/components/HowItWorks';
import ProductGrid from '@/components/ProductGrid';
import Reveal from '@/components/Reveal';
import { getFeaturedProducts } from '@/lib/storeData';
import { STORE_NAME } from '@/lib/utils';

export const metadata: Metadata = {
  alternates: { canonical: '/' }
};

export const revalidate = 60;

export default async function HomePage() {
  const products = await getFeaturedProducts(8);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name: STORE_NAME,
    areaServed: 'NG',
    priceRange: '₦₦₦'
  };

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Reveal className="mt-6">
        <CategoryStrip />
      </Reveal>
      <Reveal>
        <BrandStatement />
      </Reveal>
      <TrustStrip />

      <Reveal>
        <ShopTheLook />
      </Reveal>

      <section className="py-6">
        <div className="mb-3.5 flex items-end justify-between">
          <h2 className="font-serif text-2xl font-medium">Bestsellers</h2>
          <Link href="/shop" className="text-sm font-semibold text-gold underline underline-offset-4">
            Shop all
          </Link>
        </div>
        <ProductGrid products={products} />
      </section>

      <HowItWorks />

      <Reveal className="mb-10 rounded-2xl border border-line bg-surface-2 p-6 text-center md:p-10">
        <h2 className="font-serif text-2xl font-medium">Have a question before you order?</h2>
        <p className="mx-auto mt-2 max-w-[48ch] text-ink-2">
          Chat with us on WhatsApp for sizing help, custom engraving or a piece you can't find in the shop.
        </p>
      </Reveal>
    </div>
  );
}
