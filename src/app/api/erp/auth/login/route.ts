import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import Admin from '@/lib/models/Admin';
import { ADMIN_COOKIE, signAdminToken } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 });
    }
    await connectDB();
    const admin = await Admin.findOne({ email: String(email).toLowerCase().trim() });
    if (!admin) return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 });

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 });

    const token = await signAdminToken({
      id: String(admin._id),
      email: admin.email,
      name: admin.name,
      role: admin.role
    });

    const res = NextResponse.json({ ok: true, name: admin.name });
    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });
    return res;
  } catch (err) {
    console.error('Admin login failed:', err);
    return NextResponse.json({ error: 'Could not sign in right now. Please try again.' }, { status: 500 });
  }
}
