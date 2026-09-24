import { SignJWT, jwtVerify } from 'jose';

export const ADMIN_COOKIE = 'ogo_admin_session';

export interface AdminTokenPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

function secretKey() {
  const s = process.env.ADMIN_JWT_SECRET;
  if (!s) throw new Error('ADMIN_JWT_SECRET is not set. Copy .env.example to .env and set it.');
  return new TextEncoder().encode(s);
}

export async function signAdminToken(payload: AdminTokenPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey());
}

export async function verifyAdminToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload as unknown as AdminTokenPayload;
  } catch {
    return null;
  }
}
