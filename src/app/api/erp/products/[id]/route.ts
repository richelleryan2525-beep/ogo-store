import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import { slugify } from '@/lib/utils';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const product = await Product.findById(params.id).lean();
  if (!product) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  if (body.slug) body.slug = slugify(body.slug);
  const product = await Product.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
  if (!product) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  return NextResponse.json({ product });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const product = await Product.findByIdAndDelete(params.id);
  if (!product) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
