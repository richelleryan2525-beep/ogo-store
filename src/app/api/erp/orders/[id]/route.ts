import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import { ORDER_STATUSES } from '@/lib/utils';
import { requireAdmin } from '@/lib/requireAdmin';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const order = await Order.findById(params.id).lean();
  if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const admin = await requireAdmin();
  const body = await req.json();
  const order = await Order.findById(params.id);
  if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });

  const updates: Record<string, unknown> = {};

  if (body.status && body.status !== order.status) {
    if (!ORDER_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }
    // Cancelling a previously active order returns stock to inventory.
    if (body.status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        await Product.updateOne({ _id: item.productId }, { $inc: { stock: item.qty } });
      }
    }
    updates.status = body.status;
    order.statusHistory.push({
      status: body.status,
      note: body.note || `Marked ${body.status} by ${admin?.name || 'admin'}.`,
      at: new Date()
    });
    updates.statusHistory = order.statusHistory;
  }

  if (body.paymentStatus && ['unpaid', 'paid'].includes(body.paymentStatus)) {
    updates.paymentStatus = body.paymentStatus;
  }
  if (typeof body.carrier === 'string') updates.carrier = body.carrier;
  if (typeof body.waybillNumber === 'string') updates.waybillNumber = body.waybillNumber;

  const updated = await Order.findByIdAndUpdate(params.id, updates, { new: true });
  return NextResponse.json({ order: updated });
}
