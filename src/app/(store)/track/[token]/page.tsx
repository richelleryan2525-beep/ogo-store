'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fmtNaira } from '@/lib/utils';
import StatusTimeline from '@/components/StatusTimeline';
import { CheckIcon, CopyIcon, PackageIcon } from '@/components/Icons';

interface TrackData {
  orderNumber: string;
  status: string;
  paymentStatus: 'unpaid' | 'paid';
  statusHistory: { status: string; note?: string; at: string }[];
  items: { name: string; image?: string; unitPrice: number; qty: number; size?: string; engravingText?: string }[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  deliveryMethod: string;
  deliveryEta?: string;
  deliveryState?: string;
  deliveryCity?: string;
  total: number;
  carrier?: string;
  waybillNumber?: string;
  customerName: string;
  maskedPhone: string;
  createdAt: string;
}

function TrackContent() {
  const params = useParams<{ token: string }>();
  const sp = useSearchParams();
  const isNew = sp.get('new') === '1';
  const [data, setData] = useState<TrackData | null>(null);
  const [err, setErr] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/orders/track/${params.token}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Order not found.');
        if (active) setData(json);
      })
      .catch((e) => active && setErr(e.message));
    return () => {
      active = false;
    };
  }, [params.token]);

  if (err) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-serif text-2xl">We couldn't find that order</h1>
        <p className="mt-2 text-muted">{err}</p>
        <Link href="/orders" className="mt-5 inline-block rounded-xl bg-ink px-5 py-3 font-semibold text-bg">
          Look up your order
        </Link>
      </div>
    );
  }

  if (!data) {
    return <div className="mx-auto max-w-xl px-4 py-16 text-center text-muted">Loading your order…</div>;
  }

  const link = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';

  return (
    <div className="mx-auto max-w-xl px-4 py-6 md:px-6">
      {isNew && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 flex items-center gap-3 rounded-xl border border-ok/30 bg-ok/10 p-4"
        >
          <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-ok text-white">
            <CheckIcon size={18} />
          </span>
          <div>
            <b className="text-ok">Order placed successfully</b>
            <p className="text-sm text-ink-2">Bookmark this page, or copy the link below, to check your order anytime.</p>
          </div>
        </motion.div>
      )}

      <p className="text-sm text-muted">Order</p>
      <h1 className="mb-1 font-serif text-3xl font-medium">{data.orderNumber}</h1>
      <p className="mb-5 text-ink-2">
        Placed {new Date(data.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })} by{' '}
        {data.customerName} ({data.maskedPhone})
      </p>

      <div className="mb-6 rounded-xl border border-line bg-surface p-4">
        <StatusTimeline status={data.status} />
      </div>

      {data.paymentStatus === 'unpaid' && data.status !== 'cancelled' && (
        <div className="mb-6 rounded-xl border-l-4 border-accent bg-surface-2 p-4 text-sm text-ink-2">
          We're waiting to confirm your payment. We'll reach out with our bank details if we haven't already —
          message us if you'd like a reminder.
        </div>
      )}

      {(data.carrier || data.waybillNumber) && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-line bg-surface p-4">
          <PackageIcon size={22} className="flex-none text-gold" />
          <div className="text-sm">
            {data.carrier && <p><b>Carrier:</b> {data.carrier}</p>}
            {data.waybillNumber && <p><b>Waybill:</b> {data.waybillNumber}</p>}
          </div>
        </div>
      )}

      <button
        onClick={() => {
          navigator.clipboard?.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
        }}
        className="mb-6 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl border border-line text-sm font-semibold"
      >
        <CopyIcon size={16} /> {copied ? 'Link copied' : 'Copy tracking link'}
      </button>

      <div className="rounded-xl border border-line bg-surface p-4">
        <h2 className="mb-2.5 font-serif text-lg font-medium">Order summary</h2>
        {data.items.map((it, i) => (
          <div key={i} className="mb-1.5 flex justify-between text-sm">
            <span>
              {it.name}
              {it.size ? ` (${it.size})` : ''} × {it.qty}
              {it.engravingText ? ` — "${it.engravingText}"` : ''}
            </span>
            <span>{fmtNaira(it.unitPrice * it.qty)}</span>
          </div>
        ))}
        <div className="mt-2 flex justify-between"><span>Subtotal</span><span>{fmtNaira(data.subtotal)}</span></div>
        {data.discount > 0 && <div className="flex justify-between text-ok"><span>Discount</span><span>−{fmtNaira(data.discount)}</span></div>}
        <div className="flex justify-between">
          <span>Delivery {data.deliveryEta ? <small className="text-muted">({data.deliveryEta})</small> : null}</span>
          <span>{data.deliveryFee === 0 ? 'Free' : fmtNaira(data.deliveryFee)}</span>
        </div>
        <div className="mt-2.5 flex justify-between border-t border-line pt-2.5 text-lg font-bold">
          <span>Total</span><span>{fmtNaira(data.total)}</span>
        </div>
        {data.deliveryMethod === 'delivery' && (data.deliveryCity || data.deliveryState) && (
          <p className="mt-3 text-sm text-muted">Delivering to {[data.deliveryCity, data.deliveryState].filter(Boolean).join(', ')}</p>
        )}
      </div>

      <Link href="/shop" className="mt-6 flex min-h-[50px] items-center justify-center rounded-xl bg-ink font-semibold text-bg">
        Continue shopping
      </Link>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl px-4 py-16 text-center text-muted">Loading your order…</div>}>
      <TrackContent />
    </Suspense>
  );
}
