"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { joinQueue } from "@/lib/api";

export function JoinForm({ presetCode = "" }: { presetCode?: string }) {
  const router = useRouter();
  const [code, setCode] = useState(presetCode);
  const [guestName, setGuestName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { ticket } = await joinQueue(code.trim().toUpperCase(), guestName);
      router.push(`/ticket/${code.trim().toUpperCase()}/${ticket.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join.");
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-md rounded-[28px] border border-[var(--line)] bg-moss/80 p-6"
    >
      <p className="text-xs font-semibold tracking-[0.22em] text-lime uppercase">
        Guest
      </p>
      <h1 className="display mt-2 text-4xl">Take a ticket</h1>
      <p className="mt-2 text-sm text-muted">
        Enter the desk code posted at the venue. We’ll hold your place.
      </p>

      <label className="mt-6 block text-sm">
        Desk code
        <input
          required
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="DEMO"
          className="mt-1.5 w-full rounded-2xl border border-[var(--line)] bg-ink/60 px-4 py-3 font-mono tracking-[0.3em] outline-none ring-lime/40 focus:ring-2"
        />
      </label>

      <label className="mt-4 block text-sm">
        Your name
        <input
          required
          minLength={2}
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Alex M."
          className="mt-1.5 w-full rounded-2xl border border-[var(--line)] bg-ink/60 px-4 py-3 outline-none ring-lime/40 focus:ring-2"
        />
      </label>

      {error ? <p className="mt-4 text-sm text-amber">{error}</p> : null}

      <button
        disabled={busy}
        className="mt-6 w-full rounded-full bg-lime py-3.5 font-semibold text-ink disabled:opacity-60"
      >
        {busy ? "Joining…" : "Join the line"}
      </button>
    </form>
  );
}
