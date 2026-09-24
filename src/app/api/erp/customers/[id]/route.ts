import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Customer from '@/lib/models/Customer';
import Order from '@/lib/models/Order';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const customer = await Customer.findById(params.id).lean();
  if (!customer) return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
  const orders = await Order.find({ 'customer.phone': customer.phone }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ customer, orders });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();
  const customer = await Customer.findByIdAndUpdate(
    params.id,
    { name: body.name, email: body.email, notes: body.notes },
    { new: true, runValidators: true }
  );
  if (!customer) return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
  return NextResponse.json({ customer });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const customer = await Customer.findByIdAndDelete(params.id);
  if (!customer) return NextResponse.json({ error: 'Customer not found.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
