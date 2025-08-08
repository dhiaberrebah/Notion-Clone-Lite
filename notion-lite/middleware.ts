import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  // Create a response that we can modify (cookies) before returning
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Get the current session (sets/refreshes auth cookies as needed)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');

  if (!session && !isAuthPage) {
    // Not authenticated -> force to sign-in
    const url = req.nextUrl.clone();
    url.pathname = '/sign-in';
    // Optional: add redirect query for post-login navigation
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (session && isAuthPage) {
    // Already authenticated -> send to home (or dashboard)
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Continue to requested route
  return res;
}

// Exclude Next.js internals, static files, and public auth routes grouping
export const config = {
  matcher: [
    // All paths except:
    // - _next (Next.js internals)
    // - files with an extension (static assets)
    // - api routes
    // - favicon/robots/sitemap
    // - (auth) group routes are still /sign-in and /sign-up, so matcher will hit them
    '/((?!_next|.*\\..*|api|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
