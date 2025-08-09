'use server'

import { createSupabaseActionClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Signs the current user out by clearing Supabase auth cookies on the server
 * and redirects to the sign-in page.
 */
export async function signOutAction() {
  const supabase = await createSupabaseActionClient()
  await supabase.auth.signOut()
  redirect('/sign-in')
}
