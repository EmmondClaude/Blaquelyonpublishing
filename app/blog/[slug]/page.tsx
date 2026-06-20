import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { blogPosts } from "@/lib/content";

type Params = { params: { slug: string } };

// Static generation for every known post — list + detail both prerender.
export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return { title: "Journal" };
  return { title: post.title, description: post.excerpt };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPostPage({ params }: Params) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <article>
      <header className="ej-container pt-20 sm:pt-28">
        <Link href="/blog" className="ej-link">
          ← Journal
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <span className="font-mono text-[0.7rem] uppercase tracking-label text-ej-gold">
            {post.tag}
          </span>
          <span className="font-mono text-[0.7rem] uppercase tracking-label text-ej-ash">
            {formatDate(post.date)} · {post.readingMinutes} min read
          </span>
        </div>
        <h1 className="mt-6 max-w-3xl font-display text-4xl font-light leading-tight text-ej-bone sm:text-6xl">
          {post.title}
        </h1>
        <hr className="ej-rule mt-12" />
      </header>

      <Section>
        <div className="max-w-prose space-y-6 text-lg leading-relaxed text-ej-cream">
          <p className="font-display text-xl italic text-ej-bone">
            {post.excerpt}
          </p>
          {post.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <hr className="ej-rule my-16" />
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Link href="/blog" className="ej-link">
            ← All entries
          </Link>
          <Link href="/publishing" className="ej-cta">
            Inquire for publishing
          </Link>
        </div>
      </Section>
    </article>
  );
}
