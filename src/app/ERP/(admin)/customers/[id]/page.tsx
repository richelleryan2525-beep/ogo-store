'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { erpFetch } from '@/lib/erpFetch';
import { fmtNaira } from '@/lib/utils';
import StatusBadge from '@/components/erp/StatusBadge';
import { CustomerDTO, OrderDTO } from '@/lib/types';

export default function AdminCustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerDTO | null>(null);
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    erpFetch(`/api/erp/customers/${id}`)
      .then((d) => {
        setCustomer(d.customer);
        setOrders(d.orders);
        setName(d.customer.name);
        setEmail(d.customer.email || '');
        setNotes(d.customer.notes || '');
      })
      .catch((e) => setErr(e.message));
  }, [id]);

  async function save() {
    setSaving(true);
    setMsg('');
    try {
      const d = await erpFetch(`/api/erp/customers/${id}`, { method: 'PUT', body: JSON.stringify({ name, email, notes }) });
      setCustomer(d.customer);
      setMsg('Saved.');
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!confirm(`Delete customer "${customer?.name}"? Their past orders will remain, but they'll be removed from the customer list.`)) return;
    await erpFetch(`/api/erp/customers/${id}`, { method: 'DELETE' });
    router.push('/ERP/customers');
  }

  if (err) return <p className="text-danger">{err}</p>;
  if (!customer) return <p className="text-muted">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <Link href="/ERP/customers" className="mb-3 inline-block text-sm text-muted hover:underline">← Back to customers</Link>
      <h1 className="mb-5 font-serif text-2xl font-medium">{customer.name}</h1>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-sm text-muted">Total orders</p>
          <p className="font-serif text-xl font-medium">{customer.totalOrders}</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-sm text-muted">Total spent</p>
          <p className="font-serif text-xl font-medium">{fmtNaira(customer.totalSpent)}</p>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-line bg-surface p-4">
        <p className="mb-3 text-xs font-semibold uppercase text-muted">Contact details</p>
        <div className="mb-3">
          <label className="mb-1.5 block text-sm font-semibold">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="min-h-[44px] w-full rounded-lg border border-line bg-bg px-3 text-sm" />
        </div>
        <div className="mb-3">
          <label className="mb-1.5 block text-sm font-semibold">Phone</label>
          <input value={customer.phone} disabled className="min-h-[44px] w-full rounded-lg border border-line bg-surface-3 px-3 text-sm text-muted" />
        </div>
        <div className="mb-3">
          <label className="mb-1.5 block text-sm font-semibold">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="min-h-[44px] w-full rounded-lg border border-line bg-bg px-3 text-sm" />
        </div>
        <div className="mb-3">
          <label className="mb-1.5 block text-sm font-semibold">Internal notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm" />
        </div>
        {customer.addresses.length > 0 && (
          <div className="mb-3">
            <p className="mb-1 text-sm font-semibold">Known addresses</p>
            <ul className="list-disc pl-5 text-sm text-muted">
              {customer.addresses.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </div>
        )}
        <div className="flex gap-3">
          <button disabled={saving} onClick={save} className="min-h-[44px] rounded-lg bg-ink px-5 text-sm font-semibold text-bg disabled:opacity-60">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <button onClick={remove} className="min-h-[44px] rounded-lg border border-danger/40 px-5 text-sm font-semibold text-danger">
            Delete customer
          </button>
        </div>
        {msg && <p className="mt-2 text-sm font-semibold text-ok">{msg}</p>}
      </div>

      <h2 className="mb-3 font-serif text-xl font-medium">Order history</h2>
      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="p-3">Order</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b border-line last:border-0 hover:bg-surface-2">
                <td className="p-3"><Link href={`/ERP/orders/${o._id}`} className="font-semibold underline">{o.orderNumber}</Link></td>
                <td className="p-3">{fmtNaira(o.total)}</td>
                <td className="p-3"><StatusBadge status={o.status} /></td>
                <td className="p-3 text-muted">{new Date(o.createdAt).toLocaleDateString('en-NG')}</td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted">No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
