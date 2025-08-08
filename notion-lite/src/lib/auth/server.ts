import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export async function getSession() {
  const supabase = createServerComponentClient({ cookies });
  return supabase.auth.getSession();
}

export async function getUser() {
  const supabase = createServerComponentClient({ cookies });
  return supabase.auth.getUser();
}
