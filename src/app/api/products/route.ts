import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const ids = searchParams.get('ids');
  if (ids) {
    const list = ids.split(',').filter(Boolean);
    const products = await Product.find({ _id: { $in: list }, active: true }).lean();
    return NextResponse.json({ products });
  }
  const q = searchParams.get('q')?.trim();
  const category = searchParams.get('cat');
  const filter: Record<string, unknown> = { active: true };
  if (category && category !== 'All') filter.category = category;
  if (q) filter.$text = { $search: q };
  const products = await Product.find(filter).limit(60).lean();
  return NextResponse.json({ products });
}
