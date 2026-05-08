import Link from "next/link";
import { posts } from "@/lib/posts";

export const metadata = {
  title: "Blog | Eddington.Tech",
  description:
    "Daily posts on IAM, system hardening, zero trust, and iOS security — written by Hunter Eddington.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <header className="mb-12">
        <p className="text-xs font-mono uppercase tracking-widest text-brand-500 mb-3">Blog</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
          Daily notes
        </h1>
        <p className="mt-3 text-zinc-400 max-w-lg">
          IAM, system hardening, zero trust, and iOS security. New post every day.
        </p>
      </header>

      <div className="space-y-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="rounded-xl border border-white/5 bg-white/5 p-6 hover:border-brand-500/30 transition-all"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mb-3">
              <span className="rounded-full border border-brand-500/20 bg-brand-500/10 px-2 py-0.5 text-brand-400">
                {post.category}
              </span>
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime} read</span>
            </div>
            <Link href={`/blog/${post.slug}`} className="group">
              <h2 className="font-display text-xl font-semibold text-zinc-100 group-hover:text-brand-400 transition-colors">
                {post.title}
              </h2>
            </Link>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{post.excerpt}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-4 inline-block text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
            >
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}