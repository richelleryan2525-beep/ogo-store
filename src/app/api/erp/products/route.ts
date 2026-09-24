import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import { slugify } from '@/lib/utils';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim();
  const category = searchParams.get('category');
  const filter: Record<string, unknown> = {};
  if (category && category !== 'All') filter.category = category;
  if (q) filter.$text = { $search: q };
  const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  if (!body.name || !body.price) {
    return NextResponse.json({ error: 'Name and price are required.' }, { status: 400 });
  }
  let slug = slugify(body.slug || body.name);
  const exists = await Product.findOne({ slug });
  if (exists) slug = `${slug}-${Date.now().toString(36)}`;

  const product = await Product.create({ ...body, slug });
  return NextResponse.json({ product }, { status: 201 });
}
