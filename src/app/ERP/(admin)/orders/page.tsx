'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { erpFetch } from '@/lib/erpFetch';
import { fmtNaira, ORDER_STATUSES, STATUS_LABELS } from '@/lib/utils';
import StatusBadge from '@/components/erp/StatusBadge';
import { OrderDTO } from '@/lib/types';

function OrdersContent() {
  const sp = useSearchParams();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [q, setQ] = useState(sp.get('q') || '');
  const [loading, setLoading] = useState(true);
  const status = sp.get('status') || 'All';

  function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== 'All') params.set('status', status);
    if (q) params.set('q', q);
    erpFetch(`/api/erp/orders?${params.toString()}`)
      .then((d) => setOrders(d.orders))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function setStatus(s: string) {
    const next = new URLSearchParams(sp.toString());
    if (s === 'All') next.delete('status');
    else next.set('status', s);
    router.push(`/ERP/orders?${next.toString()}`);
  }

  return (
    <div>
      <h1 className="mb-5 font-serif text-2xl font-medium">Orders</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        {['All', ...ORDER_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            aria-pressed={status === s}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold ${
              status === s ? 'border-ink bg-ink text-bg' : 'border-line bg-surface'
            }`}
          >
            {s === 'All' ? 'All' : STATUS_LABELS[s as keyof typeof STATUS_LABELS]}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          load();
        }}
        className="mb-4 flex gap-2"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search order number, name or phone…"
          className="min-h-[44px] flex-1 rounded-lg border border-line bg-surface px-3.5 text-sm md:max-w-xs"
        />
        <button className="min-h-[44px] rounded-lg border border-line px-4 text-sm font-semibold">Search</button>
      </form>

      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : (
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
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-line last:border-0 hover:bg-surface-2">
                  <td className="p-3">
                    <Link href={`/ERP/orders/${o._id}`} className="font-semibold underline">{o.orderNumber}</Link>
                  </td>
                  <td className="p-3">{o.customer.name}<br /><span className="text-xs text-muted">{o.customer.phone}</span></td>
                  <td className="p-3">{fmtNaira(o.total)}</td>
                  <td className="p-3"><StatusBadge status={o.status} /></td>
                  <td className="p-3">{o.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}</td>
                  <td className="p-3 text-muted">{new Date(o.createdAt).toLocaleDateString('en-NG')}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-muted">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading orders…</p>}>
      <OrdersContent />
    </Suspense>
  );
}
