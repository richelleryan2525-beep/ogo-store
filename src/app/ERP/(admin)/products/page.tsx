'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { erpFetch } from '@/lib/erpFetch';
import { fmtNaira } from '@/lib/utils';
import { ProductDTO } from '@/lib/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  function load(query = '') {
    setLoading(true);
    erpFetch(`/api/erp/products${query ? `?q=${encodeURIComponent(query)}` : ''}`)
      .then((d) => setProducts(d.products))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await erpFetch(`/api/erp/products/${id}`, { method: 'DELETE' });
      setProducts((p) => p.filter((x) => x._id !== id));
    } catch (e) {
      alert((e as Error).message);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl font-medium">Products</h1>
        <Link href="/ERP/products/new" className="rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-bg">
          + Add product
        </Link>
      </div>

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
          placeholder="Search products…"
          className="min-h-[44px] flex-1 rounded-lg border border-line bg-surface px-3.5 text-sm md:max-w-xs"
        />
        <button className="min-h-[44px] rounded-lg border border-line px-4 text-sm font-semibold">Search</button>
      </form>

      {err && <p className="text-danger">{err}</p>}
      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-line last:border-0 hover:bg-surface-2">
                  <td className="p-3 font-semibold">{p.name}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{fmtNaira(p.price)}</td>
                  <td className="p-3">{p.stock <= 3 ? <span className="text-danger">{p.stock}</span> : p.stock}</td>
                  <td className="p-3">{p.active ? 'Active' : 'Hidden'}</td>
                  <td className="whitespace-nowrap p-3">
                    <Link href={`/ERP/products/${p._id}`} className="mr-3 font-semibold underline">
                      Edit
                    </Link>
                    <button onClick={() => remove(p._id, p.name)} className="font-semibold text-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-muted">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
