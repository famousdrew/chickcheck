"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <button
      onClick={handleSignOut}
      className="rounded-rustic bg-barn-500/10 text-barn-500 hover:bg-barn-500/20 px-3 py-1.5 text-sm font-medium transition-colors"
    >
      Sign Out
    </button>
  );
}
