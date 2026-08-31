import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-xs tracking-[0.24em] text-lime uppercase">404</p>
      <h1 className="display mt-3 text-5xl">This ticket walked off.</h1>
      <p className="mt-3 text-muted">That page isn’t on the floor.</p>
      <Link href="/" className="mt-8 inline-block text-lime">
        Return to QueueZero
      </Link>
    </div>
  );
}
