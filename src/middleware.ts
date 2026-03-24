import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next (static files, images)
     * - favicon, sw.js, manifest, icons, robots, sitemap
     * - API docs, static assets
     */
    '/((?!_next|favicon\\.ico|favicon\\.svg|sw\\.js|manifest\\.json|icons|robots\\.txt|sitemap\\.xml|api-docs\\.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff2?)$).*)',
  ],
};
