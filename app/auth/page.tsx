"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUp() {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Account created successfully! You can now log in.");
    }

    setLoading(false);
  }

  async function login() {
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-5">
      <div className="w-full rounded-[28px] border border-[var(--line)] bg-moss/80 p-8">
        <p className="text-xs font-semibold tracking-[0.22em] text-lime uppercase">
          QueueZero
        </p>

        <h1 className="display mt-3 text-4xl">
          Welcome
        </h1>

        <p className="mt-2 text-sm text-muted">
          Create an account or log in to manage your queues.
        </p>

        <label className="mt-6 block text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-2xl border border-[var(--line)] bg-ink/60 px-4 py-3 outline-none ring-lime/40 placeholder:text-muted/70 focus:ring-2"
          />
        </label>

        <label className="mt-4 block text-sm">
          Password
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            className="mt-1.5 w-full rounded-2xl border border-[var(--line)] bg-ink/60 px-4 py-3 outline-none ring-lime/40 placeholder:text-muted/70 focus:ring-2"
          />
        </label>

        {message ? (
          <p className="mt-4 text-sm text-lime">
            {message}
          </p>
        ) : null}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={signUp}
            disabled={loading || !email || password.length < 6}
            className="rounded-full border border-[var(--line)] py-3 font-semibold disabled:opacity-50"
          >
            {loading ? "Please wait…" : "Sign up"}
          </button>

          <button
            type="button"
            onClick={login}
            disabled={loading || !email || password.length < 6}
            className="rounded-full bg-lime py-3 font-semibold text-ink disabled:opacity-50"
          >
            {loading ? "Please wait…" : "Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}