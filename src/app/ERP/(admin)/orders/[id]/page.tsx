'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { erpFetch } from '@/lib/erpFetch';
import { fmtNaira, ORDER_STATUSES, STATUS_LABELS, trackingUrl } from '@/lib/utils';
import StatusBadge from '@/components/erp/StatusBadge';
import { OrderDTO } from '@/lib/types';

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);
  const [carrier, setCarrier] = useState('');
  const [waybill, setWaybill] = useState('');
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState('');

  function load() {
    erpFetch(`/api/erp/orders/${id}`)
      .then((d) => {
        setOrder(d.order);
        setCarrier(d.order.carrier || '');
        setWaybill(d.order.waybillNumber || '');
      })
      .catch((e) => setErr(e.message));
  }

  useEffect(load, [id]);

  async function patch(body: Record<string, unknown>) {
    setSaving(true);
    setMsg('');
    try {
      const d = await erpFetch(`/api/erp/orders/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
      setOrder(d.order);
      setMsg('Saved.');
      setNote('');
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (err) return <p className="text-danger">{err}</p>;
  if (!order) return <p className="text-muted">Loading order…</p>;

  return (
    <div className="max-w-3xl">
      <Link href="/ERP/orders" className="mb-3 inline-block text-sm text-muted hover:underline">← Back to orders</Link>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-serif text-2xl font-medium">{order.orderNumber}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className="mb-5 grid gap-4 rounded-xl border border-line bg-surface p-4 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase text-muted">Customer</p>
          <p className="font-semibold">{order.customer.name}</p>
          <p className="text-sm">{order.customer.phone}</p>
          {order.customer.email && <p className="text-sm">{order.customer.email}</p>}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-muted">Delivery</p>
          {order.deliveryMethod === 'pickup' ? (
            <p className="text-sm">Pickup in Lagos</p>
          ) : (
            <p className="text-sm">{order.deliveryAddress}, {order.deliveryCity}, {order.deliveryState}</p>
          )}
          {order.notes && <p className="mt-1 text-sm text-muted">Note: {order.notes}</p>}
        </div>
      </div>

      <div className="mb-5 rounded-xl border border-line bg-surface p-4">
        <p className="mb-2.5 text-xs font-semibold uppercase text-muted">Items</p>
        {order.items.map((it, i) => (
          <div key={i} className="mb-1.5 flex justify-between text-sm">
            <span>
              {it.name}{it.size ? ` (${it.size})` : ''} × {it.qty}
              {it.engravingText ? ` — "${it.engravingText}"` : ''}
            </span>
            <span>{fmtNaira(it.unitPrice * it.qty)}</span>
          </div>
        ))}
        <div className="mt-2 flex justify-between text-sm"><span>Subtotal</span><span>{fmtNaira(order.subtotal)}</span></div>
        {order.discount > 0 && <div className="flex justify-between text-sm text-ok"><span>Discount</span><span>−{fmtNaira(order.discount)}</span></div>}
        <div className="flex justify-between text-sm"><span>Delivery</span><span>{order.deliveryFee === 0 ? 'Free' : fmtNaira(order.deliveryFee)}</span></div>
        <div className="mt-2 flex justify-between border-t border-line pt-2 text-base font-bold"><span>Total</span><span>{fmtNaira(order.total)}</span></div>
      </div>

      <div className="mb-5 rounded-xl border border-line bg-surface p-4">
        <p className="mb-3 text-xs font-semibold uppercase text-muted">Update order</p>

        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Status</label>
            <select
              value={order.status}
              onChange={(e) => patch({ status: e.target.value, note })}
              className="min-h-[46px] w-full rounded-lg border border-line bg-bg px-3 text-sm"
              disabled={saving}
            >
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Payment status</label>
            <select
              value={order.paymentStatus}
              onChange={(e) => patch({ paymentStatus: e.target.value })}
              className="min-h-[46px] w-full rounded-lg border border-line bg-bg px-3 text-sm"
              disabled={saving}
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="mb-1.5 block text-sm font-semibold">Note for this status change (optional)</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Payment confirmed via GTBank transfer"
            className="min-h-[44px] w-full rounded-lg border border-line bg-bg px-3 text-sm"
          />
        </div>

        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Carrier</label>
            <input value={carrier} onChange={(e) => setCarrier(e.target.value)} className="min-h-[44px] w-full rounded-lg border border-line bg-bg px-3 text-sm" placeholder="GIG Logistics, DHL…" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Waybill number</label>
            <input value={waybill} onChange={(e) => setWaybill(e.target.value)} className="min-h-[44px] w-full rounded-lg border border-line bg-bg px-3 text-sm" />
          </div>
        </div>
        <button
          disabled={saving}
          onClick={() => patch({ carrier, waybillNumber: waybill })}
          className="min-h-[44px] rounded-lg bg-ink px-5 text-sm font-semibold text-bg disabled:opacity-60"
        >
          Save carrier and waybill
        </button>
        {msg && <p className="mt-2 text-sm font-semibold text-ok">{msg}</p>}
      </div>

      <div className="mb-5 rounded-xl border border-line bg-surface p-4">
        <p className="mb-2.5 text-xs font-semibold uppercase text-muted">Status history</p>
        <ol className="grid gap-2 text-sm">
          {order.statusHistory.slice().reverse().map((h, i) => (
            <li key={i} className="border-b border-line pb-2 last:border-0">
              <b>{STATUS_LABELS[h.status as keyof typeof STATUS_LABELS] || h.status}</b>
              <span className="ml-2 text-muted">{new Date(h.at).toLocaleString('en-NG')}</span>
              {h.note && <p className="text-muted">{h.note}</p>}
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-xl border border-line bg-surface-2 p-4 text-sm">
        <p className="mb-1 font-semibold">Customer tracking link</p>
        <a href={trackingUrl(order.trackingToken)} target="_blank" rel="noopener noreferrer" className="break-all text-gold underline">
          {trackingUrl(order.trackingToken)}
        </a>
      </div>
    </div>
  );
}
