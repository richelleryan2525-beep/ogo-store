import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  await connectDB();
  const order = await Order.findOne({ trackingToken: params.token }).lean();
  if (!order) return NextResponse.json({ error: 'We could not find an order with this tracking link.' }, { status: 404 });

  // Sanitized payload: no internal DB ids beyond what's needed, phone masked.
  const phone = order.customer.phone;
  const maskedPhone = phone.length > 4 ? phone.slice(0, -4).replace(/\d/g, '•') + phone.slice(-4) : phone;

  return NextResponse.json({
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    statusHistory: order.statusHistory,
    items: order.items,
    subtotal: order.subtotal,
    discount: order.discount,
    deliveryFee: order.deliveryFee,
    deliveryMethod: order.deliveryMethod,
    deliveryEta: order.deliveryEta,
    deliveryState: order.deliveryState,
    deliveryCity: order.deliveryCity,
    total: order.total,
    carrier: order.carrier,
    waybillNumber: order.waybillNumber,
    customerName: order.customer.name,
    maskedPhone,
    createdAt: order.createdAt
  });
}
