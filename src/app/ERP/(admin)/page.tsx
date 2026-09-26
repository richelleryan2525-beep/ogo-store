'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { erpFetch } from '@/lib/erpFetch';
import { fmtNaira } from '@/lib/utils';
import StatCard from '@/components/erp/StatCard';
import StatusBadge from '@/components/erp/StatusBadge';

interface Dashboard {
  productCount: number;
  lowStock: number;
  customerCount: number;
  orderCount: number;
  pendingOrders: number;
  revenuePaid: number;
  recentOrders: { _id: string; orderNumber: string; customerName: string; total: number; status: string; paymentStatus: string; createdAt: string }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [err, setErr] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  function load(showSpinner = false) {
    if (showSpinner) setRefreshing(true);
    erpFetch('/api/erp/dashboard')
      .then(setData)
      .catch((e) => setErr(e.message))
      .finally(() => setRefreshing(false));
  }

  useEffect(() => {
    load();
    // Poll on a timer so new orders/numbers show up automatically, plus
    // refetch immediately whenever the admin returns to this tab.
    const interval = setInterval(() => load(), 15000);
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  if (err) return <p className="text-danger">{err}</p>;
  if (!data) return <p className="text-muted">Loading dashboard…</p>;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-medium">Dashboard</h1>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold hover:bg-surface-2 disabled:opacity-50"
        >
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatCard label="Orders" value={String(data.orderCount)} hint={`${data.pendingOrders} pending`} />
        <StatCard label="Revenue (paid)" value={fmtNaira(data.revenuePaid)} />
        <StatCard label="Products" value={String(data.productCount)} hint={`${data.lowStock} low stock`} />
        <StatCard label="Customers" value={String(data.customerCount)} />
        <Link href="/ERP/orders?status=pending" className="rounded-xl border border-line bg-ink p-4 text-bg">
          <p className="text-sm opacity-80">Needs attention</p>
          <p className="mt-1 font-serif text-2xl font-medium">{data.pendingOrders}</p>
          <p className="mt-1 text-xs opacity-80">pending orders →</p>
        </Link>
      </div>

      <h2 className="mb-3 font-serif text-xl font-medium">Recent orders</h2>
      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.recentOrders.map((o) => (
              <tr key={o._id} className="border-b border-line last:border-0 hover:bg-surface-2">
                <td className="p-3">
                  <Link href={`/ERP/orders/${o._id}`} className="font-semibold underline">
                    {o.orderNumber}
                  </Link>
                </td>
                <td className="p-3">{o.customerName}</td>
                <td className="p-3">{fmtNaira(o.total)}</td>
                <td className="p-3"><StatusBadge status={o.status} /></td>
                <td className="p-3">{o.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}</td>
                <td className="p-3 text-muted">{new Date(o.createdAt).toLocaleDateString('en-NG')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
