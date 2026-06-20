import type { Metadata } from "next";
import { PageHeader, Section } from "@/components/ui/Section";
import { PublishingForm } from "@/components/publishing/PublishingForm";
import { brand } from "@/lib/content";

export const metadata: Metadata = {
  title: "Publishing",
  description:
    "Get in contact for publishing from Emmond J Smith — sync, co-writes, catalog, and artist deals.",
};

/**
 * /publishing — the conversion page. The whole site funnels here. The form is a
 * client island; everything around it is a Server Component, and the contact path
 * (the email fallback) is reachable with zero motion and zero JS.
 */
export default function PublishingPage() {
  return (
    <>
      <PageHeader
        kicker="Publishing"
        title={
          <>
            Get in contact
            <br />
            <span className="italic text-ej-gold-bright">for publishing.</span>
          </>
        }
        lead="Sync and licensing, co-writes and toplines, catalog acquisition, artist and producer deals. Tell the house what you're working on."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          {/* Context column */}
          <div className="space-y-10">
            <div className="max-w-prose space-y-5 text-lg leading-relaxed text-ej-cream">
              <p>
                Every inquiry is read personally. Be specific about the project
                and the role you have in mind — the more context, the faster the
                reply.
              </p>
              <p className="text-ej-smoke">
                Prefer email? Reach the house directly at{" "}
                <a
                  href={`mailto:${brand.inquiryInbox}`}
                  className="text-ej-gold transition-colors hover:text-ej-gold-bright"
                >
                  {brand.inquiryInbox}
                </a>
                .
              </p>
            </div>

            <div className="ej-card p-7">
              <p className="ej-label">What the house takes on</p>
              <ul className="mt-5 space-y-3 text-ej-cream">
                {[
                  "Sync & licensing for film, TV, and brand",
                  "Co-writes and toplines for R&B and adjacent rooms",
                  "Catalog acquisition and administration",
                  "Artist & producer publishing deals",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1 w-1 flex-none rounded-full bg-ej-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* The form island */}
          <div>
            <PublishingForm />
          </div>
        </div>
      </Section>
    </>
  );
}
