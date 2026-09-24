import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';
import Order from '@/lib/models/Order';
import Customer from '@/lib/models/Customer';
import {
  DELIVERY_ZONES,
  FREE_LAGOS_OVER,
  genOrderNumber,
  genTrackingToken,
  isValidNgPhone,
  normalizePhone,
  trackingUrl,
  zoneOf
} from '@/lib/utils';

export const runtime = 'nodejs';

const ItemSchema = z.object({
  productId: z.string().min(1),
  qty: z.number().int().min(1).max(20),
  size: z.string().optional(),
  engravingText: z.string().max(40).optional()
});

const BodySchema = z.object({
  items: z.array(ItemSchema).min(1, 'Your bag is empty.'),
  customer: z.object({
    name: z.string().trim().min(2, 'Enter your full name.'),
    phone: z.string().trim().min(7, 'Enter a valid phone number.'),
    email: z.string().trim().email().optional().or(z.literal(''))
  }),
  deliveryMethod: z.enum(['delivery', 'pickup']),
  deliveryState: z.string().optional(),
  deliveryCity: z.string().optional(),
  deliveryAddress: z.string().optional(),
  notes: z.string().max(400).optional(),
  discountCode: z.string().optional()
});

// Client-provided discount codes are informational only — the percentage is
// re-applied here from a server-trusted table so totals can't be tampered with.
const DISCOUNT_CODES: Record<string, number> = {
  WELCOME10: 10
};

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || 'Please check your order details.';
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    const body = parsed.data;

    if (!isValidNgPhone(body.customer.phone)) {
      return NextResponse.json({ error: 'Enter a valid phone number, e.g. 0803 123 4567.' }, { status: 400 });
    }
    if (body.deliveryMethod === 'delivery') {
      if (!body.deliveryState || !body.deliveryCity || !body.deliveryAddress || body.deliveryAddress.trim().length < 6) {
        return NextResponse.json({ error: 'Enter your full delivery address and state.' }, { status: 400 });
      }
    }

    await connectDB();

    // Re-price every line from the database. Never trust client-sent prices.
    const productIds = body.items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds }, active: true }).lean();
    const byId = new Map(products.map((p) => [String(p._id), p]));

    const items = [];
    for (const line of body.items) {
      const p = byId.get(line.productId);
      if (!p) return NextResponse.json({ error: 'One of the items in your bag is no longer available.' }, { status: 409 });
      if (line.qty > p.stock) {
        return NextResponse.json({ error: `Only ${p.stock} of "${p.name}" left in stock.` }, { status: 409 });
      }
      if (p.sizeOptions?.length && !line.size) {
        return NextResponse.json({ error: `Choose a ${p.sizeOptionLabel || 'size'} for "${p.name}".` }, { status: 400 });
      }
      if (p.engraving?.enabled && p.engraving.required && !line.engravingText) {
        return NextResponse.json({ error: `Enter the engraving text for "${p.name}".` }, { status: 400 });
      }
      let unitPrice = p.price;
      if (line.size && p.sizePriceAdjust && typeof p.sizePriceAdjust[line.size] === 'number') {
        unitPrice += p.sizePriceAdjust[line.size];
      }
      if (line.engravingText && p.engraving?.enabled) {
        unitPrice += p.engraving.extraPrice || 0;
      }
      items.push({
        productId: String(p._id),
        name: p.name,
        image: p.images?.[0] || '',
        unitPrice,
        qty: line.qty,
        size: line.size,
        engravingText: line.engravingText
      });
    }

    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);

    let discount = 0;
    let discountCode: string | undefined;
    if (body.discountCode) {
      const code = body.discountCode.trim().toUpperCase();
      const pct = DISCOUNT_CODES[code];
      if (pct) {
        discount = Math.round((subtotal * pct) / 100);
        discountCode = code;
      }
    }

    let deliveryFee = 0;
    let deliveryEta: string | undefined;
    if (body.deliveryMethod === 'pickup') {
      deliveryEta = 'Pickup by appointment';
    } else {
      const zone = zoneOf(body.deliveryState!);
      const z = DELIVERY_ZONES[zone];
      deliveryFee = zone === 'Lagos' && subtotal - discount >= FREE_LAGOS_OVER ? 0 : z.fee;
      deliveryEta = z.eta;
    }

    const total = subtotal - discount + deliveryFee;

    // Reserve stock immediately so two buyers can't both claim the last piece.
    for (const item of items) {
      const res = await Product.updateOne(
        { _id: item.productId, stock: { $gte: item.qty } },
        { $inc: { stock: -item.qty } }
      );
      if (res.modifiedCount === 0) {
        return NextResponse.json(
          { error: `"${item.name}" just sold out. Please remove it from your bag.` },
          { status: 409 }
        );
      }
    }

    const order = await Order.create({
      orderNumber: genOrderNumber(),
      trackingToken: genTrackingToken(),
      customer: {
        name: body.customer.name.trim(),
        phone: normalizePhone(body.customer.phone),
        email: body.customer.email || undefined
      },
      items,
      subtotal,
      discount,
      discountCode,
      deliveryMethod: body.deliveryMethod,
      deliveryState: body.deliveryMethod === 'delivery' ? body.deliveryState : undefined,
      deliveryCity: body.deliveryMethod === 'delivery' ? body.deliveryCity?.trim() : undefined,
      deliveryAddress: body.deliveryMethod === 'delivery' ? body.deliveryAddress?.trim() : undefined,
      deliveryFee,
      deliveryEta,
      notes: body.notes?.trim(),
      total,
      status: 'pending',
      paymentStatus: 'unpaid',
      statusHistory: [
        { status: 'pending', note: 'Order received. Awaiting payment confirmation.', at: new Date() }
      ]
    });

    // Upsert the customer record for the ERP customer list.
    await Customer.findOneAndUpdate(
      { phone: normalizePhone(body.customer.phone) },
      {
        $set: { name: body.customer.name.trim(), email: body.customer.email || undefined },
        $addToSet: body.deliveryAddress ? { addresses: body.deliveryAddress.trim() } : {},
        $inc: { totalOrders: 1, totalSpent: total }
      },
      { upsert: true }
    );

    return NextResponse.json(
      {
        orderNumber: order.orderNumber,
        trackingToken: order.trackingToken,
        trackingUrl: trackingUrl(order.trackingToken),
        total
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Order creation failed:', err);
    return NextResponse.json({ error: 'Something went wrong placing your order. Please try again.' }, { status: 500 });
  }
}
