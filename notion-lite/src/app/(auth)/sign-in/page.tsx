"use client";

import { useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const search = useSearchParams();
  const redirect = search.get('redirect') || '/';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message || 'Sign in failed. Check your credentials or configuration.');
        return;
      }
      window.location.href = redirect;
    } catch (err: any) {
      console.error('Sign-in error', err);
      setError(err?.message ?? 'Unexpected error during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
          required
        />
        <button
          type="submit"
          className="w-full rounded-md bg-black text-white py-2 text-sm hover:bg-black/90 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="text-sm">
          No account? <Link href="/sign-up" className="underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
