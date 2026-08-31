"use client";

import Link from "next/link";
import { useCallback } from "react";
import { fetchTicket } from "@/lib/api";
import { positionInLine, ticketLabel } from "@/lib/types";
import { usePoll } from "@/lib/use-poll";

export function GuestTicket({
  code,
  ticketId,
}: {
  code: string;
  ticketId: string;
}) {
  const loader = useCallback(async () => {
    return fetchTicket(code, ticketId);
  }, [code, ticketId]);

  const { data, error } = usePoll(loader, 1500);

  if (!data && !error) {
    return <p className="text-muted">Loading your ticket…</p>;
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-md rounded-[28px] border border-[var(--line)] bg-moss p-8">
        <h1 className="display text-3xl">Ticket missing</h1>
        <p className="mt-2 text-muted">{error}</p>
        <Link href="/join" className="mt-6 inline-block text-lime">
          Join again
        </Link>
      </div>
    );
  }

  const { queue, ticket } = data;
  const place = positionInLine(queue, ticket.id);
  const wait =
    place === null ? 0 : Math.max(0, (place - 1) * queue.avgMinutes);

  const headline =
    ticket.status === "serving"
      ? "You’re up"
      : ticket.status === "done"
        ? "All set"
        : ticket.status === "skipped"
          ? "Missed call"
          : "You’re in line";

  return (
    <article className="mx-auto w-full max-w-md overflow-hidden rounded-[32px] bg-paper text-ink shadow-[0_40px_80px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between px-6 pt-6">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase">{queue.venue}</p>
          <p className="text-sm text-ink/60">{queue.name}</p>
        </div>
        <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-lime">
          {queue.code}
        </span>
      </div>

      <div className="px-6 py-8 text-center">
        <p className="display text-2xl">{headline}</p>
        <p className="display mt-3 text-7xl leading-none">
          {ticketLabel(ticket.number)}
        </p>
        <p className="mt-3 text-lg">{ticket.guestName}</p>
      </div>

      <div className="ticket-perforation h-4 bg-paper" />

      <div className="grid grid-cols-2 gap-px bg-ink/10">
        <div className="bg-paper px-6 py-5">
          <p className="text-xs uppercase tracking-widest text-ink/50">Place</p>
          <p className="display mt-1 text-3xl">
            {ticket.status === "waiting" ? place ?? "—" : "—"}
          </p>
        </div>
        <div className="bg-paper px-6 py-5">
          <p className="text-xs uppercase tracking-widest text-ink/50">Wait</p>
          <p className="display mt-1 text-3xl">
            {ticket.status === "waiting" ? `${wait}m` : "0m"}
          </p>
        </div>
      </div>

      <p className="bg-paper px-6 pb-6 text-sm text-ink/60">
        Keep this page open. It updates when the desk calls you.
      </p>
    </article>
  );
}
