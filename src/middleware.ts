import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, verifyAdminToken } from '@/lib/auth';

export const config = {
  matcher: ['/ERP/:path*', '/api/erp/:path*']
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === '/ERP/login';
  const isLoginApi = pathname === '/api/erp/auth/login';

  if (isLoginPage || isLoginApi) return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const payload = token ? await verifyAdminToken(token) : null;

  if (!payload) {
    if (pathname.startsWith('/api/erp')) {
      return NextResponse.json({ error: 'Not authenticated. Please log in again.' }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = '/ERP/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
