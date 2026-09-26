import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import Customer from '@/lib/models/Customer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDB();

  const [productCount, lowStock, customerCount, orders] = await Promise.all([
    Product.countDocuments({ active: true }),
    Product.countDocuments({ active: true, stock: { $lte: 3 } }),
    Customer.countDocuments({}),
    Order.find({}).sort({ createdAt: -1 }).limit(500).lean()
  ]);

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const revenuePaid = orders.filter((o) => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0);
  const recentOrders = orders.slice(0, 8).map((o) => ({
    _id: o._id,
    orderNumber: o.orderNumber,
    customerName: o.customer.name,
    total: o.total,
    status: o.status,
    paymentStatus: o.paymentStatus,
    createdAt: o.createdAt
  }));

  const byStatus: Record<string, number> = {};
  for (const o of orders) byStatus[o.status] = (byStatus[o.status] || 0) + 1;

  return NextResponse.json({
    productCount,
    lowStock,
    customerCount,
    orderCount: orders.length,
    pendingOrders,
    revenuePaid,
    byStatus,
    recentOrders
  });
}
