import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const q = searchParams.get('q')?.trim();
  const filter: Record<string, unknown> = {};
  if (status && status !== 'All') filter.status = status;
  if (q) {
    filter.$or = [
      { orderNumber: { $regex: q, $options: 'i' } },
      { 'customer.name': { $regex: q, $options: 'i' } },
      { 'customer.phone': { $regex: q, $options: 'i' } }
    ];
  }
  const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(300).lean();
  return NextResponse.json({ orders });
}
