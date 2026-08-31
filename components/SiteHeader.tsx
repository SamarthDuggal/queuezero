import Link from "next/link";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Logo />
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/join"
            className="rounded-full px-4 py-2 text-cream/80 transition hover:bg-cream/5 hover:text-cream"
          >
            Join a line
          </Link>
          <Link
            href="/#open"
            className="rounded-full bg-lime px-4 py-2 font-medium text-ink transition hover:brightness-95"
          >
            Open a desk
          </Link>
        </nav>
      </div>
    </header>
  );
}
