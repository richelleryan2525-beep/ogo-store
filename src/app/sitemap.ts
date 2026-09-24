import type { MetadataRoute } from 'next';
import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import { SITE_URL } from '@/lib/utils';
import { POLICY_PAGES } from '@/lib/policyContent';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const products = await Product.find({ active: true }).select('slug updatedAt').lean();
    productEntries = products.map((p) => ({
      url: `${SITE_URL}/product/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8
    }));
  } catch {
    // If the DB isn't reachable at build time, still ship a valid sitemap
    // with the static routes below.
  }

  const staticEntries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: 'daily', priority: 0.9 },
    ...POLICY_PAGES.map((p) => ({
      url: `${SITE_URL}/page/${p.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.4
    }))
  ];

  return [...staticEntries, ...productEntries];
}
