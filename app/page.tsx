import Link from "next/link";
import { Hero } from "@/components/Hero";
import { AutherisLaunch } from "@/components/AutherisLaunch";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { posts } from "@/lib/posts";

// Get 3 most recent posts
const recentPosts = [...posts]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 3);

export const metadata = {
  title: "Eddington.Tech — Hunter Eddington",
  description:
    "System Engineer & IAM Engineer. I design and harden infrastructure, identity systems, and access controls — and build iOS apps that put security in your pocket.",
  alternates: {
    canonical: "https://eddington.tech",
  },
  openGraph: {
    title: "Eddington.Tech — Hunter Eddington",
    description:
      "System Engineer & IAM Engineer. I design and harden infrastructure, identity systems, and access controls — and build iOS apps that put security in your pocket.",
    url: "https://eddington.tech",
    siteName: "Eddington.Tech",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://eddington.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "Eddington.Tech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eddington.Tech — Hunter Eddington",
    description:
      "System Engineer & IAM Engineer. I design and harden infrastructure, identity systems, and access controls — and build iOS apps that put security in your pocket.",
    images: [
      {
        url: "https://eddington.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "Eddington.Tech",
      },
    ],
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <AutherisLaunch />

      {/* About */}
      <section id="about" className="scroll-mt-20 border-t border-white/5 px-6 py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.4fr]">
          <RevealOnScroll>
            <p className="font-mono text-xs uppercase tracking-widest text-brand-400">Background</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              The right access for the right people.{" "}
              <span className="font-serif font-normal italic text-zinc-400">Nothing more.</span>
            </h2>
            <a
              href="/resume"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-zinc-200 transition-colors hover:border-white/40"
            >
              View résumé →
            </a>
          </RevealOnScroll>
          <RevealOnScroll delay={1}>
            <div className="space-y-5 text-sm leading-relaxed text-zinc-400 sm:text-base">
              <p>
                I&apos;m a <span className="text-zinc-100">System Engineer</span> and{" "}
                <span className="text-zinc-100">IAM Engineer</span>. My work centers on designing and
                hardening infrastructure, identity systems, and access controls so that the right people
                and systems get the right access, and nothing more.
              </p>
              <p>
                Most days I&apos;m in Entra ID, Okta, AWS IAM and custom IdP integrations: writing
                policies, auditing access, and building zero trust frameworks that hold up under
                pressure. I automate with Terraform, Python and PowerShell because manual processes
                don&apos;t scale and they breed drift.
              </p>
              <p>
                On Apple platforms I build tools like{" "}
                <Link href="/autheris" className="text-white underline decoration-brand-500 underline-offset-4">
                  Autheris
                </Link>
                , and I write about IAM hardening, authentication patterns and threat intelligence on the{" "}
                <Link href="/blog" className="text-white underline decoration-brand-500 underline-offset-4">
                  blog
                </Link>
                .
              </p>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2">
              {["Identity & Access Management", "OAuth 2.0 / OIDC", "Zero Trust", "Swift / SwiftUI", "Keychain & Secure Enclave", "System Hardening", "Terraform"].map((skill) => (
                <li key={skill} className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                  {skill}
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </section>

      {/* Recent writing */}
      <section className="border-t border-white/5 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <RevealOnScroll>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-brand-400">Latest writing</p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Security research &amp; threat intel
                </h2>
              </div>
              <Link href="/blog" className="text-sm text-zinc-400 transition-colors hover:text-white">
                All posts →
              </Link>
            </div>
          </RevealOnScroll>
          <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {recentPosts.map((post, index) => (
              <li key={post.slug}>
                <RevealOnScroll delay={Math.min(index + 1, 5)}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group grid gap-2 py-6 sm:grid-cols-[140px_1fr_auto] sm:items-baseline sm:gap-8"
                  >
                    <time dateTime={post.date} className="font-mono text-xs text-zinc-500">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-zinc-100 transition-colors group-hover:text-brand-300 sm:text-xl">
                        {post.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-sm text-zinc-500">{post.excerpt}</p>
                    </div>
                    <span className="font-mono text-xs text-brand-400">
                      {post.category} · {post.readTime}
                    </span>
                  </Link>
                </RevealOnScroll>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
