import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const PUBLIC_PATHS = ['/landing', '/login', '/register', '/callback'];

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // Check if user is authenticated for protected routes
  const { pathname } = request.nextUrl;

  // Skip public paths and static files
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sw\\.js|manifest\\.json|icons/|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
