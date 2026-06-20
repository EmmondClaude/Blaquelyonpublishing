import Link from "next/link";
import { brand } from "@/lib/content";

const footerNav = [
  { href: "/about", label: "About" },
  { href: "/roster", label: "Roster" },
  { href: "/featured", label: "Featured" },
  { href: "/blog", label: "Journal" },
  { href: "/publishing", label: "Publishing" },
];

export function Footer() {
  return (
    <footer className="mt-32 border-t border-ej-gold-dim/20 bg-ej-noir/40">
      <div className="ej-container py-16">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-prose">
            <p className="font-display text-2xl font-light text-ej-bone">
              {brand.name}
            </p>
            <p className="mt-3 text-sm text-ej-smoke">
              {brand.parent} · {brand.city}
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ej-smoke">
              {brand.tagline}
            </p>
          </div>

          <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
            <nav aria-label="Footer">
              <p className="ej-label mb-4">Pages</p>
              <ul className="space-y-3">
                {footerNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-ej-cream transition-colors hover:text-ej-gold-bright"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="ej-label mb-4">Elsewhere</p>
              <ul className="space-y-3">
                {brand.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      className="text-sm text-ej-cream transition-colors hover:text-ej-gold-bright"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <hr className="ej-rule my-12" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.7rem] uppercase tracking-label text-ej-ash">
            © {new Date().getFullYear()} {brand.parent}
          </p>
          <p className="font-mono text-[0.7rem] uppercase tracking-label text-ej-ash">
            For publishing —{" "}
            <a
              href={`mailto:${brand.inquiryInbox}`}
              className="text-ej-gold transition-colors hover:text-ej-gold-bright"
            >
              {brand.inquiryInbox}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
