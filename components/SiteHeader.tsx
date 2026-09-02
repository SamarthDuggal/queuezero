"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Logo } from "./Logo";

export function SiteHeader() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setEmail(user?.email ?? null);
    }

    void getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      return;
    }

    // Force browser navigation to Login / Sign Up page
    window.location.href = "/auth";
  }

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Logo />

        <nav className="flex items-center gap-2 text-sm">
          {email ? (
            <>
              <span className="hidden text-cream/60 sm:inline">
                {email}
              </span>

              <button
                onClick={() => void logout()}
                className="rounded-full border border-[var(--line)] px-4 py-2 text-cream/80 transition hover:bg-cream/5 hover:text-cream"
              >
                Log out
              </button>

              <Link
                href="/#open"
                className="rounded-full bg-lime px-4 py-2 font-medium text-ink transition hover:brightness-95"
              >
                Open a desk
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/join"
                className="rounded-full px-4 py-2 text-cream/80 transition hover:bg-cream/5 hover:text-cream"
              >
                Join a line
              </Link>

              <Link
                href="/auth"
                className="rounded-full border border-[var(--line)] px-4 py-2 text-cream/80 transition hover:bg-cream/5 hover:text-cream"
              >
                Log in
              </Link>

              <Link
                href="/#open"
                className="rounded-full bg-lime px-4 py-2 font-medium text-ink transition hover:brightness-95"
              >
                Open a desk
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
