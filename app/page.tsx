import Link from "next/link";
import { AppCard } from "@/components/AppCard";
import { HeroSection } from "@/components/HeroSection";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { apps } from "@/lib/apps";
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
      <HeroSection />

      {/* About */}
      <section id="about" className="scroll-mt-20 px-6 py-20 sm:py-32">
        <div className="mx-auto max-w-3xl">
          <RevealOnScroll>
            <div className="mb-8 sm:mb-10">
              <p className="text-xs font-mono uppercase tracking-widest text-brand-500 mb-3">Background</p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
                Who I am
              </h2>
            </div>
            <div className="space-y-5 text-zinc-400 leading-relaxed text-sm sm:text-base">
              <p>
                I'm a <span className="text-zinc-200 font-medium">System Engineer</span> and{" "}
                <span className="text-zinc-200 font-medium">IAM (Identity & Access Management) Engineer</span>.
                My work centers on designing and hardening infrastructure, identity
                systems, and access controls so that the right people and systems
                get the right access — and nothing more.
              </p>
              <p>
                On the backend, I spend most of my time in Entra ID, Okta, AWS IAM,
                and custom IdP integrations — writing policies, auditing access, and
                building zero trust frameworks that actually hold up under pressure.
                I automate everything with Terraform, Python, and PowerShell because
                manual processes don't scale and they breed drift.
              </p>
              <p>
                On iOS, I build tools like{" "}
                <Link href="/autheris" className="text-brand-400 hover:text-brand-300 transition-colors">
                  Autheris
                </Link>{" "}
                — a secure 2FA token manager that lives entirely on-device. The goal
                is to take the same security principles I apply to cloud infrastructure
                and make them practical in the palm of your hand. This site is where I
                showcase those projects and point to their dedicated pages. When I'm not
                building, I write about IAM hardening, authentication patterns, and
                threat intelligence on the{" "}
                <Link href="/blog" className="text-brand-400 hover:text-brand-300 transition-colors">
                  blog
                </Link>
                .
              </p>
            </div>

            {/* Skill pills */}
            <div className="mt-8 sm:mt-10 flex flex-wrap gap-2">
              {["Identity & Access Management", "OAuth 2.0 / OIDC", "Zero Trust Architecture", "iOS Development", "Swift / SwiftUI", "Keychain & Secure Enclave", "System Hardening", "Terraform / Infrastructure as Code"].map((skill) => (
                <span key={skill} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400 backdrop-blur-sm">
                  {skill}
                </span>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Apps */}
      <section id="apps" className="scroll-mt-20 border-t border-white/5 bg-surface-800/30 px-6 py-20 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <RevealOnScroll>
            <div className="mb-8 sm:mb-10">
              <p className="text-xs font-mono uppercase tracking-widest text-brand-500 mb-3">Portfolio</p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
                iOS apps
              </h2>
              <p className="mt-2 text-zinc-400 text-sm sm:text-base">
                Side projects and experiments. Each has its own page —{" "}
                <Link href="/autheris" className="text-brand-400 hover:text-brand-300 transition-colors">
                  start with Autheris
                </Link>
                .
              </p>
            </div>
            <div className="mt-8 sm:mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {apps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Recent Blog Posts - SEO Internal Linking Section */}
      <section className="scroll-mt-20 border-t border-white/5 px-6 py-20 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <RevealOnScroll>
            <div className="mb-8 sm:mb-10">
              <p className="text-xs font-mono uppercase tracking-widest text-brand-500 mb-3">Latest</p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
                Recent posts
              </h2>
              <p className="mt-2 text-zinc-400 text-sm sm:text-base">
                Security research, technical deep-dives, and threat intelligence.{" "}
                <Link href="/blog" className="text-brand-400 hover:text-brand-300 transition-colors">
                  View all posts →
                </Link>
              </p>
            </div>
          </RevealOnScroll>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post, index) => (
              <RevealOnScroll key={post.slug} delay={Math.min(index + 1, 5)}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block h-full rounded-lg border border-white/10 bg-white/5 p-5 transition-all hover:border-brand-500/30 hover:bg-white/[0.07]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-brand-500">{post.category}</span>
                    <span className="text-xs text-zinc-600">·</span>
                    <span className="text-xs text-zinc-500">{post.readTime}</span>
                  </div>
                  <h3 className="text-base font-semibold text-zinc-200 group-hover:text-brand-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </time>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}