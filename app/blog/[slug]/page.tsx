import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { posts } from "@/lib/posts";

interface PageProps {
  params: { slug: string };
}

function getRandomPosts(currentSlug: string, count: number = 3) {
  const otherPosts = posts.filter((p) => p.slug !== currentSlug);
  const shuffled = [...otherPosts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
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

  const relatedPosts = getRandomPosts(post.slug, 3);

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

      <div className="prose prose-invert prose-zinc prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-h2:text-2xl prose-h2:text-white prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-xl prose-h3:text-white/90 prose-h3:mt-8 prose-h3:mb-4 prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:mb-6 prose-strong:text-white prose-strong:font-semibold prose-code:text-brand-400 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-zinc-900 prose-pre:border-zinc-800 prose-pre:p-4 prose-pre:rounded-lg prose-pre:text-sm prose-blockquote:border-l-4 prose-blockquote:border-brand-500/50 prose-blockquote:bg-zinc-900/50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:my-8 prose-ul:text-zinc-400 prose-ul:my-6 prose-ol:text-zinc-400 prose-ol:my-6 prose-li:mb-2">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      <footer className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span>Written by</span>
          <span className="text-brand-400 font-medium">{post.author ?? "Hunter Eddington"}</span>
        </div>
        {post.source && (
          <div className="text-sm text-zinc-500">
            <span>Source: </span>
            {typeof post.source === 'string' && post.source.includes('|') ? (
              <>
                {post.source.split('|')[0]}
                <a
                  href={post.source.split('|')[1]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-400 hover:text-brand-300 ml-1"
                >
                  →
                </a>
              </>
            ) : (
              <span>{post.source}</span>
            )}
          </div>
        )}
      </footer>

      {relatedPosts.length > 0 && (
        <aside className="mt-12 border-t border-white/10 pt-8">
          <h2 className="text-lg font-display font-semibold text-white mb-4">
            More from the blog
          </h2>
          <div className="space-y-4">
            {relatedPosts.map((relatedPost) => (
              <article key={relatedPost.slug}>
                <Link
                  href={`/blog/${relatedPost.slug}`}
                  className="block group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs text-brand-400 font-medium mt-0.5 min-w-[100px] text-right shrink-0">
                      {relatedPost.category}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-zinc-300 group-hover:text-brand-400 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-1">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}