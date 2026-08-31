import { CreateQueueForm } from "@/components/CreateQueueForm";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="grid-fade pointer-events-none absolute inset-0" />
      <section className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
        <div>
          <p className="inline-flex rounded-full border border-[var(--line)] px-3 py-1 text-xs tracking-[0.2em] text-lime uppercase">
            Virtual queue · Local MVP
          </p>
          <h1 className="display mt-6 max-w-xl text-5xl leading-[1.05] sm:text-7xl">
            The line that isn’t a line.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-cream/75">
            QueueZero gives a shop, clinic, or cafe a live waiting list. Guests
            take a ticket on their phone. Staff call the next number. The room
            stays calm.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#open"
              className="rounded-full bg-lime px-5 py-3 font-semibold text-ink"
            >
              Open a desk
            </a>
            <Link
              href="/join/DEMO"
              className="rounded-full border border-[var(--line)] px-5 py-3"
            >
              Try DEMO as a guest
            </Link>
          </div>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-muted">Host</dt>
              <dd className="mt-1 font-medium">Call, skip, complete</dd>
            </div>
            <div>
              <dt className="text-muted">Guest</dt>
              <dd className="mt-1 font-medium">Place + wait estimate</dd>
            </div>
            <div>
              <dt className="text-muted">Board</dt>
              <dd className="mt-1 font-medium">Now serving display</dd>
            </div>
          </dl>
        </div>
        <CreateQueueForm />
      </section>
    </div>
  );
}
