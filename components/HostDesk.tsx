"use client";

import Link from "next/link";
import { useCallback, useState, type ReactNode } from "react";
import { callNext, fetchQueue, pauseQueue, updateTicket } from "@/lib/api";
import { ticketLabel } from "@/lib/types";
import { usePoll } from "@/lib/use-poll";

export function HostDesk({ code }: { code: string }) {
  const loader = useCallback(async () => {
    const { queue } = await fetchQueue(code);
    return queue;
  }, [code]);

  const { data: queue, error, setData } = usePoll(loader);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState("");

  async function run(fn: () => Promise<{ queue: typeof queue }>) {
    setBusy(true);
    try {
      const { queue: next } = await fn();
      if (next) setData(next);
    } finally {
      setBusy(false);
    }
  }

  async function copy(label: string, path: string) {
    const url = `${window.location.origin}${path}`;
    await navigator.clipboard.writeText(url);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1600);
  }

  if (!queue && !error) {
    return <p className="text-muted">Opening desk…</p>;
  }

  if (error || !queue) {
    return (
      <div className="rounded-3xl border border-[var(--line)] bg-moss p-8">
        <h1 className="display text-3xl">Desk not found</h1>
        <p className="mt-2 text-muted">{error || "Unknown code."}</p>
        <Link href="/" className="mt-6 inline-block text-lime">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.22em] text-lime uppercase">
            Host desk · {queue.code}
          </p>
          <h1 className="display mt-2 text-4xl sm:text-5xl">{queue.venue}</h1>
          <p className="mt-1 text-muted">{queue.name}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => void copy("join", `/join/${queue.code}`)}
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm"
          >
            {copied === "join" ? "Copied join link" : "Copy guest link"}
          </button>
          <Link
            href={`/board/${queue.code}`}
            className="rounded-full border border-[var(--line)] px-4 py-2 text-sm"
          >
            Open board
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Now serving" value={queue.nowServing ? ticketLabel(queue.nowServing.number) : "—"} />
        <Stat label="Waiting" value={String(queue.waiting.length)} />
        <Stat label="Est. wait" value={`${queue.estimatedWaitMinutes}m`} />
        <Stat label="Served" value={String(queue.servedToday)} />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          disabled={busy || queue.waiting.length === 0}
          onClick={() => void run(() => callNext(code))}
          className="rounded-full bg-lime px-6 py-3 font-semibold text-ink disabled:opacity-50"
        >
          Call next
        </button>
        <button
          disabled={busy}
          onClick={() => void run(() => pauseQueue(code, !queue.paused))}
          className="rounded-full border border-[var(--line)] px-6 py-3"
        >
          {queue.paused ? "Resume line" : "Pause new joins"}
        </button>
        {queue.paused ? (
          <span className="self-center text-sm text-amber">Joins are paused.</span>
        ) : null}
      </div>

      <section className="rounded-[28px] border border-[var(--line)] bg-moss/70">
        <div className="border-b border-[var(--line)] px-5 py-4">
          <h2 className="font-medium">Now serving</h2>
        </div>
        {queue.nowServing ? (
          <TicketRow
            name={queue.nowServing.guestName}
            number={queue.nowServing.number}
            status="At the desk"
            actions={
              <>
                <button
                  disabled={busy}
                  onClick={() =>
                    void run(() =>
                      updateTicket(code, queue.nowServing!.id, "complete"),
                    )
                  }
                  className="rounded-full bg-cream px-3 py-1.5 text-sm text-ink"
                >
                  Complete
                </button>
                <button
                  disabled={busy}
                  onClick={() =>
                    void run(() =>
                      updateTicket(code, queue.nowServing!.id, "skip"),
                    )
                  }
                  className="rounded-full border border-[var(--line)] px-3 py-1.5 text-sm"
                >
                  No-show
                </button>
              </>
            }
          />
        ) : (
          <p className="px-5 py-8 text-sm text-muted">Nobody at the desk yet.</p>
        )}
      </section>

      <section className="rounded-[28px] border border-[var(--line)] bg-moss/70">
        <div className="border-b border-[var(--line)] px-5 py-4">
          <h2 className="font-medium">Waiting ({queue.waiting.length})</h2>
        </div>
        {queue.waiting.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted">The line is clear.</p>
        ) : (
          <div>
            {queue.waiting.map((ticket, index) => (
              <TicketRow
                key={ticket.id}
                name={ticket.guestName}
                number={ticket.number}
                status={`#${index + 1} in line`}
                actions={
                  <button
                    disabled={busy}
                    onClick={() =>
                      void run(() => updateTicket(code, ticket.id, "skip"))
                    }
                    className="rounded-full border border-[var(--line)] px-3 py-1.5 text-sm"
                  >
                    Skip
                  </button>
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-[var(--line)] bg-moss/60 p-4">
      <p className="text-xs tracking-[0.18em] text-muted uppercase">{label}</p>
      <p className="display mt-2 text-3xl">{value}</p>
    </div>
  );
}

function TicketRow({
  name,
  number,
  status,
  actions,
}: {
  name: string;
  number: number;
  status: string;
  actions: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] px-5 py-4 last:border-b-0">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted">
          {ticketLabel(number)} · {status}
        </p>
      </div>
      <div className="flex gap-2">{actions}</div>
    </div>
  );
}
