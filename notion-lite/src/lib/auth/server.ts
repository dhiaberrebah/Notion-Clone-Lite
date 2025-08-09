import { createSupabaseRSCClient } from '@/lib/supabase/server';

export async function getSession() {
  const supabase = await createSupabaseRSCClient();
  return supabase.auth.getSession();
}

export async function getUser() {
  const supabase = await createSupabaseRSCClient();
  return supabase.auth.getUser();
}
