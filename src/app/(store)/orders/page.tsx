'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderLookupPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await fetch('/api/orders/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, phone })
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || 'Order not found.');
        setLoading(false);
        return;
      }
      const url = new URL(data.trackingUrl);
      router.push(url.pathname);
    } catch {
      setErr('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 md:px-6">
      <h1 className="mb-2 font-serif text-3xl font-medium">Track your order</h1>
      <p className="mb-6 text-ink-2">
        If you saved your tracking link, use that instead. Otherwise enter your order number and the phone number
        you ordered with.
      </p>
      <form onSubmit={submit} noValidate>
        <div className="mb-3.5">
          <label className="mb-1.5 block text-sm font-semibold">Order number</label>
          <input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="OGO-260101-AB3D"
            className="min-h-[50px] w-full rounded-xl border border-line bg-surface px-3.5 text-base"
          />
        </div>
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-semibold">Phone number used at checkout</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0803 123 4567"
            className="min-h-[50px] w-full rounded-xl border border-line bg-surface px-3.5 text-base"
          />
        </div>
        {err && <div className="mb-4 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm font-medium text-danger">{err}</div>}
        <button disabled={loading} className="min-h-[50px] w-full rounded-xl bg-ink font-semibold text-bg disabled:opacity-60">
          {loading ? 'Searching…' : 'Find my order'}
        </button>
      </form>
    </div>
  );
}
