import Link from "next/link";
import { AppCard } from "@/components/AppCard";
import { apps } from "@/lib/apps";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative border-b border-surface-700 bg-gradient-to-b from-surface-800/50 to-surface-900 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
            System Engineer &{" "}
            <span className="text-brand-400">IAM Engineer</span>
          </h1>
          <p className="mt-5 text-lg text-zinc-400">
            I build and secure systems — identity, access, and the apps that run
            on them. Here you’ll find who I am and the iOS apps I’ve shipped.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#about"
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-500 transition-colors"
            >
              About me
            </a>
            <a
              href="#apps"
              className="rounded-lg border border-surface-600 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:border-surface-500 hover:bg-surface-800 transition-colors"
            >
              My apps
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-20 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-zinc-100">
            About
          </h2>
          <div className="mt-6 space-y-4 text-zinc-400">
            <p>
              I’m a <strong className="text-zinc-300">System Engineer</strong> and{" "}
              <strong className="text-zinc-300">IAM (Identity & Access Management) Engineer</strong>.
              My work centers on designing and hardening infrastructure, identity
              systems, and access controls so that the right people and systems
              get the right access — and nothing more.
            </p>
            <p>
              Beyond infrastructure and IAM, I build iOS apps — like Autheris —
              to explore authentication and security in the palm of your hand.
              This site is where I showcase those projects and point to their
              dedicated pages.
            </p>
          </div>
        </div>
      </section>

      {/* Apps */}
      <section id="apps" className="scroll-mt-20 border-t border-surface-700 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl font-semibold text-zinc-100">
            iOS apps
          </h2>
          <p className="mt-2 text-zinc-400">
            Apps I’ve built, each with its own page (e.g.{" "}
            <Link
              href="/autheris"
              className="link-underline text-brand-400"
            >
              Autheris.Eddington.Tech
            </Link>
            ).
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
