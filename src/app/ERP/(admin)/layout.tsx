import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/requireAdmin';
import AdminShell from '@/components/erp/AdminShell';

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  // Belt-and-braces: middleware already redirects unauthenticated requests,
  // but this keeps the layout safe if ever rendered without it.
  if (!admin) redirect('/ERP/login');

  return <AdminShell admin={admin}>{children}</AdminShell>;
}
