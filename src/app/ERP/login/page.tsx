'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { STORE_NAME } from '@/lib/utils';

export const dynamic = 'force-dynamic';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await fetch('/api/erp/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || 'Could not sign in.');
        setLoading(false);
        return;
      }
      router.push(sp.get('next') || '/ERP');
      router.refresh();
    } catch {
      setErr('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <p className="mb-1 text-center font-serif text-2xl font-semibold tracking-wide">{STORE_NAME}</p>
      <h1 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-muted">ERP Admin Portal</h1>
      <form onSubmit={submit} className="rounded-2xl border border-line bg-surface p-6" noValidate>
        <div className="mb-3.5">
          <label className="mb-1.5 block text-sm font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder='Enter your email'
            className="min-h-[48px] w-full text-xs sm:text-sm rounded-xl border border-line bg-bg px-3.5"
          />
        </div>
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-semibold">Password</label>
          <input
            type="password"
            placeholder='Enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="min-h-[48px] w-full rounded-xl text-xs sm:text-sm border border-line bg-bg px-3.5"
          />
        </div>
        {err && <div className="mb-4 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm font-medium text-danger">{err}</div>}
        <button disabled={loading} className="min-h-[48px] w-full rounded-xl bg-ink font-semibold text-bg disabled:opacity-60">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="mt-4 text-center text-xs text-muted">Run <code>npm run seed</code> to create your first admin account.</p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
