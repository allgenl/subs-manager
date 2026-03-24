import { jwtVerify } from 'jose';
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/landing', '/login', '/register', '/callback', '/api-docs', '/sitemap', '/api/auth'];
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'CHANGE_ME_IN_ENV'
);
const COOKIE_NAME = 'subs-session';

export async function updateSession(request: NextRequest) {
  const start = Date.now();
  const { pathname } = request.nextUrl;

  // Skip auth for public paths and auth API routes
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isPublicPath) {
    console.log(`[MW] ${pathname} → public (${Date.now() - start}ms)`);
    return NextResponse.next();
  }

  // Check JWT from cookie (instant — no HTTP request)
  const token = request.cookies.get(COOKIE_NAME)?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch {
      // Invalid/expired token
    }
  }

  // Fallback: check Supabase session cookie (for existing Supabase users)
  if (!isAuthenticated) {
    const sbCookie = request.cookies.getAll().find((c) => c.name.startsWith('sb-'));
    if (sbCookie) {
      isAuthenticated = true;
    }
  }

  if (!isAuthenticated) {
    console.log(`[MW] ${pathname} → no auth, redirect /landing (${Date.now() - start}ms)`);
    const url = request.nextUrl.clone();
    url.pathname = '/landing';
    return NextResponse.redirect(url);
  }

  console.log(`[MW] ${pathname} → ok (${Date.now() - start}ms)`);
  return NextResponse.next();
}
