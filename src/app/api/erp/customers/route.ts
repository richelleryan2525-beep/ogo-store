import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Customer from '@/lib/models/Customer';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim();
  const filter: Record<string, unknown> = {};
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { phone: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } }
    ];
  }
  const customers = await Customer.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ customers });
}
