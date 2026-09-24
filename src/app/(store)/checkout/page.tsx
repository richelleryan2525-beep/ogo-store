'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
  DELIVERY_ZONES,
  FREE_LAGOS_OVER,
  NG_STATES,
  fmtNaira,
  isValidNgPhone,
  zoneOf
} from '@/lib/utils';

type Method = 'delivery' | 'pickup';

export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState<Method>('delivery');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [agree, setAgree] = useState(false);
  const [code, setCode] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [codeMsg, setCodeMsg] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const discount = appliedCode === 'WELCOME10' ? Math.round(subtotal * 0.1) : 0;
  const deliveryPreview = useMemo(() => {
    if (method === 'pickup') return { fee: 0, eta: 'Pickup by appointment' };
    if (!state) return { fee: null as number | null, eta: '' };
    const zone = zoneOf(state);
    const z = DELIVERY_ZONES[zone];
    const fee = zone === 'Lagos' && subtotal - discount >= FREE_LAGOS_OVER ? 0 : z.fee;
    return { fee, eta: z.eta };
  }, [method, state, subtotal, discount]);
  const total = subtotal - discount + (deliveryPreview.fee || 0);

  function applyCode() {
    const v = code.trim().toUpperCase();
    if (v === 'WELCOME10') {
      setAppliedCode(v);
      setCodeMsg('Code WELCOME10 applied.');
    } else {
      setAppliedCode('');
      setCodeMsg(v ? "That code isn't valid." : 'Enter a code first.');
    }
  }

  function validate() {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = 'Enter your full name.';
    if (!isValidNgPhone(phone)) e.phone = 'Enter a valid phone number, e.g. 0803 123 4567.';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email or leave it empty.';
    if (method === 'delivery') {
      if (!state) e.state = 'Select your state.';
      if (!city.trim()) e.city = 'Enter your city or area.';
      if (address.trim().length < 6) e.address = 'Enter your full delivery address.';
    }
    if (!agree) e.agree = 'Please agree to continue.';
    setErrors(e);
    return e;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setSubmitError('');
    const e = validate();
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: lines.map((l) => ({ productId: l.productId, qty: l.qty, size: l.size, engravingText: l.engravingText })),
          customer: { name, phone, email: email || undefined },
          deliveryMethod: method,
          deliveryState: method === 'delivery' ? state : undefined,
          deliveryCity: method === 'delivery' ? city : undefined,
          deliveryAddress: method === 'delivery' ? address : undefined,
          notes: notes || undefined,
          discountCode: appliedCode || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }
      clear();
      router.push(`/track/${data.trackingToken}?new=1`);
    } catch {
      setSubmitError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-serif text-2xl">Your bag is empty</h1>
        <p className="mt-2 text-muted">Add a piece before you check out.</p>
        <Link href="/shop" className="mt-5 inline-block rounded-xl bg-ink px-5 py-3 font-semibold text-bg">
          Browse jewelry
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-6 md:px-6">
      <h1 className="mb-2 font-serif text-3xl font-medium">Checkout</h1>
      <p className="mb-6 text-ink-2">
        Your order is saved to our system the moment you submit, and you'll get a tracking link right away.
      </p>

      <form onSubmit={submit} noValidate>
        <fieldset className="mb-6">
          <legend className="mb-3 font-serif text-xl font-medium">Your details</legend>
          <Field label="Full name" error={errors.name}>
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputCls(!!errors.name)} />
          </Field>
          <Field label="Phone number" error={errors.phone} hint="For example 0803 123 4567">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" className={inputCls(!!errors.phone)} />
          </Field>
          <Field label="Email (optional)" error={errors.email}>
            <input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" className={inputCls(!!errors.email)} />
          </Field>
        </fieldset>

        <fieldset className="mb-6">
          <legend className="mb-3 font-serif text-xl font-medium">Delivery</legend>
          <div className="mb-4 grid grid-cols-2 gap-2.5">
            <label className={radioCls(method === 'delivery')}>
              <input type="radio" name="method" className="sr-only" checked={method === 'delivery'} onChange={() => setMethod('delivery')} />
              <b className="block">Delivery</b>
              <span className="text-sm text-muted">Anywhere in Nigeria</span>
            </label>
            <label className={radioCls(method === 'pickup')}>
              <input type="radio" name="method" className="sr-only" checked={method === 'pickup'} onChange={() => setMethod('pickup')} />
              <b className="block">Pickup</b>
              <span className="text-sm text-muted">Lagos, by appointment</span>
            </label>
          </div>

          {method === 'delivery' && (
            <>
              <Field label="State" error={errors.state}>
                <select value={state} onChange={(e) => setState(e.target.value)} className={inputCls(!!errors.state)}>
                  <option value="">Select your state</option>
                  {NG_STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="City or area" error={errors.city}>
                <input value={city} onChange={(e) => setCity(e.target.value)} autoComplete="address-level2" className={inputCls(!!errors.city)} />
              </Field>
              <Field label="Delivery address" error={errors.address} hint="House number, street and landmark">
                <input value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" className={inputCls(!!errors.address)} />
              </Field>
            </>
          )}
          <Field label="Delivery notes (optional)">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={inputCls(false)} />
          </Field>
        </fieldset>

        <section className="mb-6 rounded-xl border border-line bg-surface p-4">
          <h2 className="mb-2.5 font-serif text-lg font-medium">Order summary</h2>
          {lines.map((l) => (
            <div key={l.key} className="mb-1.5 flex justify-between text-sm">
              <span>
                {l.name}
                {l.size ? ` (${l.size})` : ''} × {l.qty}
              </span>
              <span>{fmtNaira(l.unitPrice * l.qty)}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between"><span>Subtotal</span><span>{fmtNaira(subtotal)}</span></div>
          {discount > 0 && (
            <div className="flex justify-between text-ok"><span>Discount ({appliedCode})</span><span>−{fmtNaira(discount)}</span></div>
          )}
          <div className="flex justify-between">
            <span>Delivery {deliveryPreview.eta ? <small className="text-muted">({deliveryPreview.eta})</small> : null}</span>
            <span>{deliveryPreview.fee === null ? 'Choose state' : deliveryPreview.fee === 0 ? 'Free' : fmtNaira(deliveryPreview.fee)}</span>
          </div>
          <div className="mt-2.5 flex justify-between border-t border-line pt-2.5 text-lg font-bold">
            <span>Total</span><span>{fmtNaira(total)}</span>
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Discount code"
              className="min-h-[46px] flex-1 rounded-lg border border-line bg-bg px-3 text-sm"
            />
            <button type="button" onClick={applyCode} className="min-h-[46px] rounded-lg border border-line px-4 text-sm font-semibold">
              Apply
            </button>
          </div>
          {codeMsg && <p className={`mt-1.5 text-sm ${appliedCode ? 'text-ok' : 'text-danger'}`}>{codeMsg}</p>}
        </section>

        <label className="mb-2 flex items-start gap-3 text-sm">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-5 w-5 flex-none accent-ink" />
          <span>
            I agree to the{' '}
            <Link href="/page/terms" className="font-semibold underline">Terms of Sale</Link> and{' '}
            <Link href="/page/privacy" className="font-semibold underline">Privacy Policy</Link>.
          </span>
        </label>
        {errors.agree && <p className="mb-3 text-sm font-medium text-danger">{errors.agree}</p>}

        {submitError && (
          <div className="mb-4 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm font-medium text-danger">{submitError}</div>
        )}

        <button disabled={loading} className="flex min-h-[52px] w-full items-center justify-center rounded-xl bg-ink text-base font-semibold text-bg disabled:opacity-60">
          {loading ? 'Placing your order…' : 'Place order'}
        </button>
        <p className="mt-3 text-center text-sm text-muted">
          No card details are collected here. We'll confirm our official bank details with you after your order is placed.
        </p>
      </form>
    </div>
  );
}

function inputCls(err: boolean) {
  return `min-h-[50px] w-full rounded-xl border px-3.5 text-base bg-surface ${err ? 'border-danger' : 'border-line'}`;
}
function radioCls(active: boolean) {
  return `rounded-xl border p-3.5 cursor-pointer ${active ? 'border-ink shadow-[inset_0_0_0_1px_var(--ink)]' : 'border-line bg-surface'}`;
}

function Field({
  label,
  error,
  hint,
  children
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3.5">
      <label className="mb-1.5 block text-sm font-semibold">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p className="mt-1 text-sm font-medium text-danger">{error}</p>}
    </div>
  );
}
