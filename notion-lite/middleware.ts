import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  // Create a response that we can modify (cookies) before returning
  const res = NextResponse.next();

  // Get the current session (sets/refreshes auth cookies as needed)
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  const isPublicShare = pathname.startsWith('/s/');

  // Avoid touching cookies/supabase on auth routes to silence Next.js cookies warnings
  if (isAuthPage || isPublicShare) {
    return res;
  }

  // Create a Supabase client for middleware using req/res cookie adapters
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', maxAge: 0, ...options });
        },
      },
    }
  );
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && !isAuthPage) {
    // Not authenticated -> force to sign-in
    const url = req.nextUrl.clone();
    url.pathname = '/sign-in';
    // Optional: add redirect query for post-login navigation
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Note: we don't redirect authenticated users away from auth routes here anymore
  // to avoid server-side cookie reads on those routes. Client components will handle UX.

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
