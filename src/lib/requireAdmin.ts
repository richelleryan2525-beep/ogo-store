import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifyAdminToken } from '@/lib/auth';

// Middleware already blocks unauthenticated requests to /api/erp/*, so this
// is a defense-in-depth check inside each handler and gives us the admin's
// identity (e.g. for audit notes on status changes).
export async function requireAdmin() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
