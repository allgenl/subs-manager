import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import pool from './db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'CHANGE_ME_IN_ENV'
);
const COOKIE_NAME = 'subs-session';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
}

export async function createSession(userId: string, email: string, displayName: string | null) {
  const token = await new SignJWT({ sub: userId, email, name: displayName })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: false, // Readable by client JS to avoid fetch for user data
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  });

  return token;
}

export async function getSessionUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.sub as string,
      email: payload.email as string,
      displayName: (payload.name as string) || null,
    };
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function registerUser(email: string, password: string, displayName?: string) {
  const existing = await pool.query('SELECT id FROM public.users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw new Error('Пользователь с таким email уже существует');
  }

  const result = await pool.query(
    `INSERT INTO public.users (email, password_hash, display_name)
     VALUES ($1, crypt($2, gen_salt('bf')), $3)
     RETURNING id, email, display_name`,
    [email, password, displayName || null]
  );

  return result.rows[0];
}

export async function authenticateUser(email: string, password: string) {
  const result = await pool.query(
    `SELECT id, email, display_name FROM public.users
     WHERE email = $1 AND password_hash = crypt($2, password_hash)`,
    [email, password]
  );

  if (result.rows.length === 0) {
    throw new Error('Неверный email или пароль');
  }

  return result.rows[0];
}
