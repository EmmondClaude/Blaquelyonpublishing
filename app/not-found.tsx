import Link from "next/link";

export default function NotFound() {
  return (
    <section className="ej-container flex min-h-[60vh] flex-col items-center justify-center py-32 text-center">
      <p className="ej-label">404</p>
      <h1 className="mt-6 font-display text-5xl font-light text-ej-bone sm:text-7xl">
        Off the record.
      </h1>
      <p className="mt-6 max-w-md leading-relaxed text-ej-smoke">
        That page isn&apos;t in the catalog. Head back to the front, or start a
        publishing inquiry.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-5">
        <Link href="/" className="ej-cta">
          Back to home
        </Link>
        <Link href="/publishing" className="ej-link self-center">
          Publishing →
        </Link>
      </div>
    </section>
  );
}
