import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Factory for client-side Supabase with auth cookie handling via helpers
let browserClient: ReturnType<typeof createClientComponentClient> | null = null;

export function getSupabaseBrowser() {
  if (!browserClient) {
    browserClient = createClientComponentClient();
  }
  return browserClient;
}

export const supabaseBrowser = getSupabaseBrowser();
export default supabaseBrowser;
