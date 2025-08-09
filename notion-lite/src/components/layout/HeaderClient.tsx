"use client";

import Link from "next/link";
import SignOutButton from "@/components/auth/SignOutButton";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export default function HeaderClient({ userEmail: initialEmail }: { userEmail?: string | null }) {
  const [email, setEmail] = useState<string | null>(initialEmail ?? null);

  useEffect(() => {
    if (email != null) return;
    const supabase = getSupabaseBrowser();
    supabase.auth
      .getUser()
      .then(({ data }: { data: { user: { email?: string } | null } }) => setEmail(data.user?.email ?? null));
  }, [email]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl flex items-center gap-4 px-4 py-3 text-sm">
        <Link href="/" className="font-semibold tracking-tight">Notion Lite</Link>
        <div className="hidden md:flex flex-1">
          <input
            placeholder="Search (coming soon)"
            className="w-full rounded border bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
          />
        </div>
        <div className="ml-auto">
          {email ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-gray-600">{email}</span>
              <SignOutButton />
            </div>
          ) : (
            <Link href="/sign-in" className="underline">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
}
