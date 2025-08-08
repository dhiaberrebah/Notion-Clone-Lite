"use client";

import Link from "next/link";
import SignOutButton from "@/components/auth/SignOutButton";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function HeaderClient({ userEmail: initialEmail }: { userEmail?: string | null }) {
  const [email, setEmail] = useState<string | null>(initialEmail ?? null);

  useEffect(() => {
    if (email != null) return;
    const supabase = createClientComponentClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, [email]);

  return (
    <header className="w-full border-b">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4 text-sm">
        <Link href="/" className="font-medium">Notion Lite</Link>
        <div>
          {email ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-600">{email}</span>
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
