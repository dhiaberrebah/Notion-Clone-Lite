"use client";

import { signOutAction } from '@/app/actions/auth';

export default function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="text-sm rounded border px-3 py-1 hover:bg-gray-50"
      >
        Sign out
      </button>
    </form>
  );
}
