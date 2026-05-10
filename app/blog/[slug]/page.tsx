import { notFound } from "next/navigation";
import Link from "next/link";
import { posts } from "@/lib/posts";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} | Blog | Eddington.Tech`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author ?? "Hunter Eddington"],
      section: post.category,
      tags: [post.category],
      images: post.image ? [{ url: post.image, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    },
    alternates: {
      canonical: `https://eddington.tech/blog/${post.slug}`,
    },
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <Link
        href="/blog"
        className="text-sm text-zinc-500 hover:text-brand-400 transition-colors mb-8 inline-block"
      >
        ← Blog
      </Link>

      <header className="mt-6 mb-10">
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mb-4">
          <span className="rounded-full border border-brand-500/20 bg-brand-500/10 px-2 py-0.5 text-brand-400">
            {post.category}
          </span>
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime} read</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
          {post.title}
        </h1>
      </header>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: {
              "@type": "Person",
              name: post.author ?? "Hunter Eddington",
              url: "https://eddington.tech/about",
            },
            publisher: {
              "@type": "Organization",
              name: "Eddington.Tech",
              url: "https://eddington.tech",
            },
            image: post.image ?? "https://eddington.tech/og-image.png",
            keywords: post.category,
            articleSection: post.category,
            url: `https://eddington.tech/blog/${post.slug}`,
          }),
        }}
      />

      <div className="prose prose-invert prose-zinc prose-sm sm:prose-base max-w-none">
        {post.content.split("\n\n").map((paragraph, i) => (
          <p key={i} className="text-zinc-400 leading-relaxed mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}