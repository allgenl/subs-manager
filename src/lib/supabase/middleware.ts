import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/landing', '/login', '/register', '/callback', '/api-docs', '/sitemap'];

export async function updateSession(request: NextRequest) {
  const start = Date.now();
  const { pathname } = request.nextUrl;

  // Skip auth check entirely for public paths
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isPublicPath) {
    console.log(`[MW] ${pathname} → public (${Date.now() - start}ms)`);
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

  const sessionStart = Date.now();
  const { data: { session } } = await supabase.auth.getSession();
  const sessionMs = Date.now() - sessionStart;

  // No session → redirect to landing
  if (!session) {
    console.log(`[MW] ${pathname} → no session, redirect /landing (session: ${sessionMs}ms, total: ${Date.now() - start}ms)`);
    const url = request.nextUrl.clone();
    url.pathname = '/landing';
    return NextResponse.redirect(url);
  }

  // Authenticated user on auth pages → redirect to dashboard
  if (pathname === '/login' || pathname === '/register' || pathname === '/landing') {
    console.log(`[MW] ${pathname} → auth redirect / (session: ${sessionMs}ms, total: ${Date.now() - start}ms)`);
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  console.log(`[MW] ${pathname} → ok (session: ${sessionMs}ms, total: ${Date.now() - start}ms)`);
  return supabaseResponse;
}
