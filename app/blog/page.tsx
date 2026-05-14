import Link from "next/link";
import { BlogPostList } from "@/app/blog/blog-post-list";
import { posts } from "@/lib/posts";

export const metadata = {
  title: "Blog | Eddington.Tech",
  description:
    "Daily posts on IAM, system hardening, zero trust, and iOS security — written by Hunter Eddington.",
  alternates: {
    canonical: "https://eddington.tech/blog",
  },
  openGraph: {
    title: "Blog | Eddington.Tech",
    description:
      "Daily posts on IAM, system hardening, zero trust, and iOS security — written by Hunter Eddington.",
    url: "https://eddington.tech/blog",
    siteName: "Eddington.Tech",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Eddington.Tech",
    description:
      "Daily posts on IAM, system hardening, zero trust, and iOS security — written by Hunter Eddington.",
    images: [
      {
        url: "https://eddington.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "Eddington.Tech Blog",
      },
    ],
  },
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Blog | Eddington.Tech",
            description:
              "Daily posts on IAM, system hardening, zero trust, and iOS security — written by Hunter Eddington.",
            url: "https://eddington.tech/blog",
            publisher: {
              "@type": "Person",
              name: "Hunter Eddington",
              url: "https://eddington.tech",
            },
          }),
        }}
      />
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

        <BlogPostList posts={posts} />
      </div>
    </>
  );
}