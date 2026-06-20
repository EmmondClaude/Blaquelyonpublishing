import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section } from "@/components/ui/Section";
import { blogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Industry updates and company movements from the house — the interactive journal.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * /blog — the interactive journal: industry updates + company movements. List view
 * with tags and reading time. CMS-backed (Sanity) or MDX later; the route shape is
 * stable. Sorted newest-first.
 */
export default function BlogPage() {
  const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader
        kicker="Journal"
        title={
          <>
            Industry & house
            <br />
            <span className="italic text-ej-gold-bright">movements.</span>
          </>
        }
        lead="Updates from the room — what's moving in the catalog, the roster, and the wider R&B publishing world."
      />

      <Section>
        <ul className="divide-y divide-ej-gold-dim/20 border-b border-ej-gold-dim/20">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group grid gap-3 py-10 sm:grid-cols-[auto_1fr] sm:gap-10"
              >
                <div className="flex items-center gap-4 sm:flex-col sm:items-start sm:gap-2">
                  <span className="font-mono text-[0.7rem] uppercase tracking-label text-ej-gold">
                    {post.tag}
                  </span>
                  <span className="font-mono text-[0.7rem] uppercase tracking-label text-ej-ash">
                    {formatDate(post.date)}
                  </span>
                </div>
                <div className="max-w-prose">
                  <h2 className="font-display text-2xl font-light text-ej-bone transition-colors group-hover:text-ej-gold-bright sm:text-3xl">
                    {post.title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-ej-smoke">
                    {post.excerpt}
                  </p>
                  <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-label text-ej-ash">
                    {post.readingMinutes} min read →
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
