'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { erpFetch } from '@/lib/erpFetch';
import { fmtNaira } from '@/lib/utils';
import { CustomerDTO } from '@/lib/types';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerDTO[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  function load(query = '') {
    setLoading(true);
    erpFetch(`/api/erp/customers${query ? `?q=${encodeURIComponent(query)}` : ''}`)
      .then((d) => setCustomers(d.customers))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1 className="mb-5 font-serif text-2xl font-medium">Customers</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          load(q);
        }}
        className="mb-4 flex gap-2"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, phone or email…"
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
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Orders</th>
                <th className="p-3">Total spent</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id} className="border-b border-line last:border-0 hover:bg-surface-2">
                  <td className="p-3">
                    <Link href={`/ERP/customers/${c._id}`} className="font-semibold underline">{c.name}</Link>
                  </td>
                  <td className="p-3">{c.phone}</td>
                  <td className="p-3">{c.totalOrders}</td>
                  <td className="p-3">{fmtNaira(c.totalSpent)}</td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr><td colSpan={4} className="p-6 text-center text-muted">No customers yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
