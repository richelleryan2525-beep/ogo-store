import { connectDB } from './db';
import Product, { IProduct } from './models/Product';
import { serialize } from './utils';
import { ProductDTO } from './types';

export interface ShopFilters {
  cat?: string;
  q?: string;
  metal?: string[];
  stone?: string[];
  occ?: string[];
  priceMin?: number;
  priceMax?: number;
  sort?: 'featured' | 'low' | 'high' | 'name';
}

export async function getProducts(filters: ShopFilters = {}): Promise<ProductDTO[]> {
  await connectDB();
  const query: Record<string, unknown> = { active: true };
  if (filters.cat && filters.cat !== 'All') query.category = filters.cat;
  if (filters.metal?.length) query.metal = { $in: filters.metal };
  if (filters.stone?.length) query.stone = { $in: filters.stone };
  if (filters.occ?.length) query.occasions = { $in: filters.occ };
  if (filters.priceMin != null || filters.priceMax != null) {
    query.price = {};
    if (filters.priceMin != null) (query.price as Record<string, number>).$gte = filters.priceMin;
    if (filters.priceMax != null) (query.price as Record<string, number>).$lte = filters.priceMax;
  }
  if (filters.q) query.$text = { $search: filters.q };

  let sort: Record<string, 1 | -1> = { createdAt: -1 };
  if (filters.sort === 'low') sort = { price: 1 };
  else if (filters.sort === 'high') sort = { price: -1 };
  else if (filters.sort === 'name') sort = { name: 1 };

  const products = await Product.find(query).sort(sort).lean();
  return serialize(products) as unknown as ProductDTO[];
}

export async function getFeaturedProducts(limit = 4): Promise<ProductDTO[]> {
  await connectDB();
  let products = (await Product.find({ active: true, featured: true }).limit(limit).lean()) as IProduct[];
  if (products.length < limit) {
    const more = (await Product.find({ active: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()) as IProduct[];
    const ids = new Set(products.map((p) => String(p._id)));
    for (const p of more) {
      if (products.length >= limit) break;
      if (!ids.has(String(p._id))) products.push(p);
    }
  }
  return serialize(products) as unknown as ProductDTO[];
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
  await connectDB();
  const product = await Product.findOne({ slug, active: true }).lean();
  return product ? (serialize(product) as unknown as ProductDTO) : null;
}

export async function getRelatedProducts(product: ProductDTO, limit = 4): Promise<ProductDTO[]> {
  await connectDB();
  const products = await Product.find({ active: true, _id: { $ne: product._id } })
    .or([{ category: product.category }, { metal: product.metal }])
    .limit(limit)
    .lean();
  return serialize(products) as unknown as ProductDTO[];
}
