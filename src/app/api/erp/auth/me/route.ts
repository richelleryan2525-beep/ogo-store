import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/requireAdmin';

export const runtime = 'nodejs';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  return NextResponse.json({ admin });
}
