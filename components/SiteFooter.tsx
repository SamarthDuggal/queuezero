export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>QueueZero MVP · In-memory queues for local testing.</p>
        <p>Try the seeded line with code DEMO.</p>
      </div>
    </footer>
  );
}
