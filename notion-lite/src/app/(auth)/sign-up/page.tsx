"use client";

import { useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message || 'Sign up failed.');
        return;
      }
      setMessage('Check your email to confirm your account.');
    } catch (err: any) {
      console.error('Sign-up error', err);
      setError(err?.message ?? 'Unexpected error during sign up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Sign up</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded border px-3 py-2"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded border px-3 py-2"
          required
        />
        <button
          type="submit"
          className="w-full rounded bg-black text-white py-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
        <p className="text-sm">
          Already have an account? <Link href="/sign-in" className="underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
