import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <span className="relative grid h-9 w-9 place-items-center rounded-2xl bg-lime text-ink shadow-[0_0_0_1px_rgba(214,242,106,0.3)]">
        <span className="display text-lg leading-none font-semibold">Q</span>
        <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-amber" />
      </span>
      {compact ? null : (
        <span className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-[0.18em] uppercase">
            QueueZero
          </span>
          <span className="mt-1 text-[11px] text-muted group-hover:text-cream/80">
            Zero wait theater
          </span>
        </span>
      )}
    </Link>
  );
}
