import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// Use in Server Components where cookie mutation is not allowed
export async function createSupabaseRSCClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      // In Server Components, Next 15 forbids modifying cookies.
      // We provide no-ops here to avoid runtime errors. Server Actions/Route Handlers
      // that need to set/remove cookies should instantiate a separate client if needed.
      async set(_name: string, _value: string, _options: any) {
        // no-op in RSC context
      },
      async remove(_name: string, _options: any) {
        // no-op in RSC context
      },
    },
  });
}

// Use inside Server Actions or Route Handlers where cookie mutation is allowed
export async function createSupabaseActionClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      async set(name: string, value: string, options: any) {
        cookieStore.set(name, value, options);
      },
      async remove(name: string, options: any) {
        cookieStore.set(name, '', { ...options, maxAge: 0 });
      },
    },
  });
}

// Backwards compatibility
export const createSupabaseServerClient = createSupabaseRSCClient;
export default createSupabaseRSCClient;
