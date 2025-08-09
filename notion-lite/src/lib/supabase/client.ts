import { createBrowserClient } from '@supabase/ssr';

// Factory for client-side Supabase with auth cookie handling via @supabase/ssr
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowser() {
  if (!browserClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return browserClient;
}

export const supabaseBrowser = getSupabaseBrowser();
export default supabaseBrowser;
