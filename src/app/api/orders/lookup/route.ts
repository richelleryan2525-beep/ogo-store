import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';
import { normalizePhone, trackingUrl } from '@/lib/utils';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, phone } = await req.json();
    if (!orderNumber || !phone) {
      return NextResponse.json({ error: 'Enter your order number and phone number.' }, { status: 400 });
    }
    await connectDB();
    const order = await Order.findOne({
      orderNumber: String(orderNumber).trim().toUpperCase(),
      'customer.phone': normalizePhone(String(phone))
    }).lean();
    if (!order) {
      return NextResponse.json(
        { error: "We couldn't find an order with that number and phone. Check both and try again." },
        { status: 404 }
      );
    }
    return NextResponse.json({ trackingUrl: trackingUrl(order.trackingToken) });
  } catch (err) {
    console.error('Order lookup failed:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
