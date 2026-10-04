import Link from "next/link";
import { TotpCard } from "./TotpCard";
import { latestVersion } from "@/lib/autheris";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 dot-grid pointer-events-none" aria-hidden />
      <div
        className="absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-brand-600/25 blur-[140px] pointer-events-none"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 pb-20 pt-16 sm:pt-24 lg:grid-cols-[1.25fr_1fr] lg:pb-28">
        <div>
          <Link
            href="#autheris"
            className="group inline-flex items-center gap-2.5 rounded-full border border-volt-400/30 bg-volt-400/10 py-1 pl-2 pr-3.5 text-xs font-medium text-volt-300 transition-colors hover:border-volt-400/60"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-volt-400 animate-live" />
            Autheris {latestVersion} is live on the App Store
            <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
          </Link>

          <h1 className="mt-8 font-display text-5xl font-bold leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
            I secure who
            <br />
            gets in.
            <span className="mt-2 block font-serif text-[1.05em] font-normal italic tracking-normal text-brand-400">
              Then I ship the app for it.
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            I&apos;m <span className="text-zinc-100">Hunter Eddington</span>, a System &amp; IAM Engineer.
            By day I harden identity platforms and access controls. On the side I build
            iOS apps that bring the same rigor to your pocket.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="#autheris"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-surface-900 transition-all hover:bg-brand-100"
            >
              See the Autheris launch
            </Link>
            <Link
              href="/blog"
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-white/40"
            >
              Read the blog
            </Link>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-6">
            {[
              ["Identity", "Entra · Okta · AWS IAM"],
              ["Systems", "Terraform · PowerShell"],
              ["Apple", "Swift · SwiftUI"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{k}</dt>
                <dd className="mt-1.5 text-xs text-zinc-300 sm:text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute inset-x-10 bottom-0 top-10 -z-10 rounded-full bg-brand-500/20 blur-3xl" aria-hidden />
          <TotpCard />
        </div>
      </div>
    </section>
  );
}
