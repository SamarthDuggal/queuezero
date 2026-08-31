"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createQueue } from "@/lib/api";

export function CreateQueueForm() {
  const router = useRouter();
  const [name, setName] = useState("Walk-in service");
  const [venue, setVenue] = useState("");
  const [avgMinutes, setAvgMinutes] = useState(8);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { queue } = await createQueue({ name, venue, avgMinutes });
      router.push(`/host/${queue.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open a desk.");
      setBusy(false);
    }
  }

  return (
    <form
      id="open"
      onSubmit={onSubmit}
      className="rounded-[28px] border border-[var(--line)] bg-moss/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)]"
    >
      <p className="text-xs font-semibold tracking-[0.22em] text-lime uppercase">
        Host desk
      </p>
      <h2 className="display mt-2 text-3xl">Open a live line</h2>
      <p className="mt-2 text-sm text-muted">
        You’ll get a short code. Guests join from their phone. You call the next
        ticket when a chair is free.
      </p>

      <label className="mt-6 block text-sm">
        Venue
        <input
          required
          minLength={2}
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          placeholder="Northside Cuts"
          className="mt-1.5 w-full rounded-2xl border border-[var(--line)] bg-ink/60 px-4 py-3 outline-none ring-lime/40 placeholder:text-muted/70 focus:ring-2"
        />
      </label>

      <label className="mt-4 block text-sm">
        Line name
        <input
          required
          minLength={2}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1.5 w-full rounded-2xl border border-[var(--line)] bg-ink/60 px-4 py-3 outline-none ring-lime/40 focus:ring-2"
        />
      </label>

      <label className="mt-4 block text-sm">
        Average minutes per guest
        <input
          type="number"
          min={1}
          max={120}
          value={avgMinutes}
          onChange={(e) => setAvgMinutes(Number(e.target.value))}
          className="mt-1.5 w-full rounded-2xl border border-[var(--line)] bg-ink/60 px-4 py-3 outline-none ring-lime/40 focus:ring-2"
        />
      </label>

      {error ? <p className="mt-4 text-sm text-amber">{error}</p> : null}

      <button
        disabled={busy}
        className="mt-6 w-full rounded-full bg-lime py-3.5 font-semibold text-ink disabled:opacity-60"
      >
        {busy ? "Opening…" : "Open desk"}
      </button>
    </form>
  );
}
