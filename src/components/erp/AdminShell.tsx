'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { AdminTokenPayload } from '@/lib/auth';
import { STORE_NAME } from '@/lib/utils';
import { CloseIcon, MenuIcon } from '../Icons';

const NAV = [
  { href: '/ERP', label: 'Dashboard', exact: true },
  { href: '/ERP/products', label: 'Products' },
  { href: '/ERP/orders', label: 'Orders' },
  { href: '/ERP/customers', label: 'Customers' }
];

export default function AdminShell({ admin, children }: { admin: AdminTokenPayload; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch('/api/erp/auth/logout', { method: 'POST' });
    router.push('/ERP/login');
    router.refresh();
  }

  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  const nav = (
    <nav className="flex flex-col gap-1 p-4">
      <p className="mb-2 px-2 font-serif text-lg font-semibold tracking-wide">{STORE_NAME} ERP</p>
      {NAV.map((n) => (
        <Link
          key={n.href}
          href={n.href}
          onClick={() => setOpen(false)}
          className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${
            isActive(n.href, n.exact) ? 'bg-ink text-bg' : 'text-ink-2 hover:bg-surface-3'
          }`}
        >
          {n.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-surface-2 font-sans text-ink">
      <div className="flex">
        <aside className="hidden w-64 flex-none border-r border-line bg-surface md:block">{nav}</aside>

        {open && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-64 bg-surface shadow-2xl">
              <div className="flex justify-end p-2">
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-10 w-10 place-items-center">
                  <CloseIcon />
                </button>
              </div>
              {nav}
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <header className="flex h-16 items-center justify-between border-b border-line bg-surface px-4 md:px-6">
            <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center md:hidden" aria-label="Open menu">
              <MenuIcon />
            </button>
            <span className="hidden text-sm text-muted md:block">Admin control panel</span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">{admin.name}</span>
              <button onClick={logout} className="rounded-lg border border-line px-3 py-2 text-sm font-semibold hover:bg-surface-3">
                Log out
              </button>
            </div>
          </header>
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
