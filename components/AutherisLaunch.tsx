import Link from "next/link";
import { RevealOnScroll } from "./RevealOnScroll";
import {
  autherisLinks,
  features,
  latestVersion,
  launchStats,
  milestones,
  platforms,
} from "@/lib/autheris";

const TICKER = [
  "No account",
  "No server",
  "No tracking",
  "Open source",
  "Free",
  ...platforms,
  "E2E iCloud Sync",
  "Face ID App Lock",
];

export function AppStoreButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={autherisLinks.appStore}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 rounded-2xl bg-black px-5 py-2.5 text-white ring-1 ring-white/20 transition-transform hover:-translate-y-0.5 ${className}`}
    >
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.47.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.27-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.76-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.42-3.65zM14.1 5.86c.63-.77 1.06-1.83.94-2.89-.91.04-2.01.61-2.66 1.37-.58.67-1.09 1.76-.96 2.8 1.02.08 2.05-.52 2.68-1.28z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[10px] uppercase tracking-wider text-zinc-300">Download on the</span>
        <span className="block text-lg font-semibold -mt-0.5">App Store</span>
      </span>
    </a>
  );
}

export function AutherisLaunch() {
  return (
    <section id="autheris" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <RevealOnScroll>
          <div className="relative overflow-hidden rounded-[32px] launch-field ring-1 ring-white/10 sm:rounded-[44px]">
            <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" aria-hidden />

            <div className="relative grid gap-10 px-6 pt-10 sm:px-12 sm:pt-14 lg:grid-cols-[1.1fr_1fr] lg:gap-6">
              <div className="pb-4 lg:pb-14">
                <div className="flex flex-wrap items-center gap-3">
                  <img
                    src="/autheris-icon.png"
                    alt=""
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-2xl bg-white p-1.5 shadow-lg"
                  />
                  <span className="rounded-full bg-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-white backdrop-blur">
                    Launched · v{latestVersion}
                  </span>
                </div>

                <h2 className="mt-8 font-display text-4xl font-bold leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl">
                  Autheris is live.
                  <span className="mt-2 block font-serif text-[1.05em] font-normal italic tracking-normal text-brand-100">
                    Your identity, vaulted.
                  </span>
                </h2>

                <p className="mt-6 max-w-lg text-base leading-relaxed text-brand-50/85 sm:text-lg">
                  A free, open-source two-factor authenticator I designed, built and shipped solo.
                  Codes live in your Keychain, never on a server, and now follow you across
                  iPhone, iPad, Mac and Apple Watch.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <AppStoreButton />
                  <a
                    href={autherisLinks.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl bg-white/15 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/25"
                  >
                    autheris.app ↗
                  </a>
                  <a
                    href={autherisLinks.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-3.5 text-sm font-medium text-brand-100 underline decoration-white/30 underline-offset-4 hover:decoration-white"
                  >
                    Read the source
                  </a>
                </div>
              </div>

              {/* Phones */}
              <div className="relative h-[340px] sm:h-[440px] lg:h-auto" aria-hidden>
                <img
                  src="/autheris-screenshots/slice-1.png"
                  alt=""
                  width={923}
                  height={2000}
                  className="absolute bottom-0 left-1/2 w-[46%] max-w-[240px] -translate-x-[95%] translate-y-[18%] -rotate-6 rounded-[28px] shadow-2xl ring-1 ring-white/20"
                />
                <img
                  src="/autheris-screenshots/slice-4.png"
                  alt=""
                  width={923}
                  height={2000}
                  className="absolute bottom-0 left-1/2 w-[46%] max-w-[240px] -translate-x-[5%] translate-y-[8%] rotate-3 rounded-[28px] shadow-2xl ring-1 ring-white/20"
                />
              </div>
            </div>

            {/* Stats */}
            <dl className="relative grid grid-cols-2 border-t border-white/15 bg-black/20 backdrop-blur-sm lg:grid-cols-4">
              {launchStats.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex flex-col-reverse px-6 py-6 sm:px-10 sm:py-8 ${i % 2 === 1 ? "border-l border-white/15" : ""} ${i >= 2 ? "border-t border-white/15 lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
                >
                  <dt className="mt-1 text-xs text-brand-100/80 sm:text-sm">{s.label}</dt>
                  <dd className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </RevealOnScroll>

        {/* Ticker */}
        <div className="relative mt-10 overflow-hidden border-y border-white/10 py-4" aria-hidden>
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i} className="flex items-center gap-10">
                {t}
                <span className="text-brand-500">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Release timeline */}
        <div className="mt-20">
          <RevealOnScroll>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-brand-400">The road to {latestVersion}</p>
                <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  From one screen to four platforms.
                </h3>
              </div>
              <a
                href={autherisLinks.releaseNotes}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Full release notes ↗
              </a>
            </div>
          </RevealOnScroll>

          <ol className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m, i) => (
              <li key={m.version} className="group relative bg-surface-900 p-6 transition-colors hover:bg-surface-800">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-sm text-brand-400">v{m.version}</span>
                  <span className="font-mono text-[10px] text-zinc-600">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <p className="mt-6 font-display text-xl font-semibold text-white">{m.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{m.detail}</p>
                {m.version === latestVersion && (
                  <span className="absolute right-6 top-14 flex items-center gap-1.5 rounded-full bg-volt-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-volt-300">
                    <span className="h-1 w-1 rounded-full bg-volt-400 animate-live" /> Now
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* Feature grid */}
        <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_2fr]">
          <RevealOnScroll>
            <p className="font-mono text-xs uppercase tracking-widest text-brand-400">Why it exists</p>
            <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Zero-knowledge by architecture, <span className="font-serif font-normal italic text-brand-300">not by promise.</span>
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-zinc-400 sm:text-base">
              I spend my days making sure the second factor can&apos;t be phished, synced away or leaked.
              Autheris is that same thinking packaged for everyone else.
            </p>
            <Link
              href="/autheris"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white underline decoration-brand-500 decoration-2 underline-offset-[6px] hover:decoration-brand-300"
            >
              Explore Autheris →
            </Link>
          </RevealOnScroll>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((f, i) => (
              <RevealOnScroll key={f.title} delay={Math.min(i + 1, 5)}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-brand-500/40">
                  <p className="font-mono text-[10px] text-zinc-600">0{i + 1}</p>
                  <h4 className="mt-3 font-display text-lg font-semibold text-white">{f.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
