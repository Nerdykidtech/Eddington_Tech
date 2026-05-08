import Link from "next/link";
import { AppCard } from "@/components/AppCard";
import { apps } from "@/lib/apps";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5 bg-surface-900 px-6 py-24 sm:py-40">
        {/* Animated grid background */}
        <div className="absolute inset-0 grid-bg opacity-30" />
        {/* Gradient orbs */}
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-brand-500/10 blur-[100px]" />
        <div className="absolute -bottom-40 -right-20 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[80px]" />
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="particle particle-1" />
          <div className="particle particle-2" />
          <div className="particle particle-3" />
          <div className="particle particle-4" />
          <div className="particle particle-5" />
          <div className="particle particle-6" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          {/* Glowing badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-medium text-brand-400">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse-glow" />
            Systems · Identity · iOS
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            System Engineer &{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent">
                IAM Engineer
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-60" />
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto px-2">
            I design and harden infrastructure, identity systems, and access controls.
            And I build iOS apps that put security in your pocket.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">
            <a
              href="#about"
              className="group relative rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-500 hover:shadow-[0_0_30px_-5px_rgba(14,165,233,0.4)]"
            >
              About me
            </a>
            <a
              href="#apps"
              className="rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
            >
              My apps
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-20 px-6 py-20 sm:py-32">
        <div className="mx-auto max-w-3xl">
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
              Beyond infrastructure and IAM, I build iOS apps — like{" "}
              <Link href="/autheris" className="text-brand-400 hover:text-brand-300 transition-colors">
                Autheris
              </Link>{" "}
              — to explore authentication and security in the palm of your hand.
              This site is where I showcase those projects and point to their
              dedicated pages.
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
        </div>
      </section>

      {/* Apps */}
      <section id="apps" className="scroll-mt-20 border-t border-white/5 bg-surface-800/30 px-6 py-20 sm:py-32">
        <div className="mx-auto max-w-5xl">
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
        </div>
      </section>
    </>
  );
}