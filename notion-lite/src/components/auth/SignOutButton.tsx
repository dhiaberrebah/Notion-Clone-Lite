"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const onSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={onSignOut}
      className="text-sm rounded border px-3 py-1 hover:bg-gray-50"
      disabled={loading}
    >
      {loading ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
