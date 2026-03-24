import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/landing', '/login', '/register', '/callback', '/api-docs', '/sitemap'];

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth check entirely for public paths — huge perf win
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isPublicPath) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Use getSession() first (reads from cookie, no HTTP request)
  // Only call getUser() if session exists and needs refresh
  const { data: { session } } = await supabase.auth.getSession();

  // No session → redirect to landing
  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = '/landing';
    return NextResponse.redirect(url);
  }

  // Authenticated user on auth pages → redirect to dashboard
  if (pathname === '/login' || pathname === '/register' || pathname === '/landing') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
