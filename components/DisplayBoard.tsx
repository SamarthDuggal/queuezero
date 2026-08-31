"use client";

import { useCallback } from "react";
import { fetchQueue } from "@/lib/api";
import { ticketLabel } from "@/lib/types";
import { usePoll } from "@/lib/use-poll";

export function DisplayBoard({ code }: { code: string }) {
  const loader = useCallback(async () => {
    const { queue } = await fetchQueue(code);
    return queue;
  }, [code]);

  const { data: queue, error } = usePoll(loader, 1500);

  if (!queue && !error) {
    return <p className="text-muted">Warming the board…</p>;
  }

  if (error || !queue) {
    return <p className="text-amber">{error || "Board not found."}</p>;
  }

  const upNext = queue.waiting.slice(0, 4);

  return (
    <div className="min-h-[70vh] rounded-[36px] border border-[var(--line)] bg-moss/50 p-8 sm:p-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm tracking-[0.28em] text-lime uppercase">
            Now serving
          </p>
          <h1 className="display mt-2 text-4xl sm:text-5xl">{queue.venue}</h1>
        </div>
        <p className="font-mono text-sm tracking-[0.4em] text-muted">
          {queue.code}
        </p>
      </div>

      <p className="display mt-10 text-[18vw] leading-none sm:text-[9rem]">
        {queue.nowServing ? ticketLabel(queue.nowServing.number) : "—"}
      </p>
      <p className="mt-4 text-2xl text-cream/80">
        {queue.nowServing?.guestName ?? "Waiting for the first ticket"}
      </p>

      <div className="mt-12">
        <p className="text-xs tracking-[0.24em] text-muted uppercase">Up next</p>
        <ol className="mt-4 grid gap-3 sm:grid-cols-4">
          {upNext.length === 0 ? (
            <li className="text-muted">Line is empty.</li>
          ) : (
            upNext.map((ticket) => (
              <li
                key={ticket.id}
                className="rounded-3xl border border-[var(--line)] bg-ink/40 px-4 py-4"
              >
                <p className="display text-3xl">{ticketLabel(ticket.number)}</p>
                <p className="mt-1 truncate text-sm text-muted">
                  {ticket.guestName}
                </p>
              </li>
            ))
          )}
        </ol>
      </div>
    </div>
  );
}
