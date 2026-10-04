import Link from "next/link";
import { apps } from "@/lib/apps";
import { AppStoreButton } from "@/components/AutherisLaunch";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import {
  autherisLinks,
  features,
  latestVersion,
  launchStats,
  milestones,
  platforms,
} from "@/lib/autheris";

const autheris = apps.find((a) => a.id === "autheris")!;

export const metadata = {
  title: `Autheris | Eddington.Tech`,
  description: autheris.description,
  alternates: {
    canonical: "https://eddington.tech/autheris",
  },
  openGraph: {
    title: "Autheris — Two-factor codes that never leave your device",
    description: autheris.tagline,
    url: "https://eddington.tech/autheris",
    siteName: "Eddington.Tech",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://eddington.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "Autheris — Two-factor codes that never leave your device",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Autheris — Two-factor codes that never leave your device",
    description: autheris.tagline,
    images: [
      {
        url: "https://eddington.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "Autheris — Two-factor codes that never leave your device",
      },
    ],
  },
};

export default function AutherisPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Autheris",
            operatingSystem: "iOS, iPadOS, macOS, watchOS",
            applicationCategory: "UtilityApplication",
            description: autheris.description,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden launch-field">
        <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-end gap-10 px-6 pt-16 sm:pt-24 lg:grid-cols-[1.2fr_1fr]">
          <div className="pb-16 sm:pb-24">
            <div className="flex items-center gap-3">
              <img
                src="/autheris-icon.png"
                alt="Autheris app icon"
                width={64}
                height={64}
                className="h-16 w-16 rounded-2xl bg-white p-1.5 shadow-lg"
              />
              <span className="flex items-center gap-2 rounded-full bg-black/25 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-volt-400 animate-live" />
                v{latestVersion} on the App Store
              </span>
            </div>
            <h1 className="mt-8 font-display text-5xl font-bold leading-[0.95] tracking-[-0.03em] text-white sm:text-7xl">
              {autheris.name}
            </h1>
            <p className="mt-3 font-serif text-3xl italic text-brand-100 sm:text-4xl">{autheris.tagline}.</p>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-brand-50/85 sm:text-lg">{autheris.description}</p>
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
            </div>
            <ul className="mt-8 flex flex-wrap gap-2">
              {platforms.map((p) => (
                <li key={p} className="rounded-full border border-white/25 px-3 py-1 text-xs text-white/90">
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative hidden h-full min-h-[460px] lg:block" aria-hidden>
            <img
              src="/autheris-screenshots/slice-1.png"
              alt=""
              width={923}
              height={2000}
              className="absolute bottom-0 left-1/2 w-[62%] -translate-x-1/2 translate-y-[22%] rounded-t-[36px] shadow-2xl ring-1 ring-white/20"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-white/5">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4">
          {launchStats.map((s, i) => (
            <div key={s.label} className={`flex flex-col-reverse px-6 py-8 ${i > 0 ? "lg:border-l" : ""} ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t lg:border-t-0" : ""} border-white/5`}>
              <dt className="mt-1 text-sm text-zinc-500">{s.label}</dt>
              <dd className="font-display text-3xl font-bold text-white sm:text-4xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Features */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <RevealOnScroll>
            <p className="font-mono text-xs uppercase tracking-widest text-brand-400">Features</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Everything an authenticator should do. <span className="font-serif font-normal italic text-zinc-400">Nothing it shouldn&apos;t.</span>
            </h2>
          </RevealOnScroll>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <RevealOnScroll key={f.title} delay={Math.min(i + 1, 5)}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <p className="font-mono text-[10px] text-zinc-600">0{i + 1}</p>
                  <h3 className="mt-3 font-display text-lg font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.description}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* App Store–style screenshot gallery */}
      <section className="border-t border-white/5 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-brand-400">Screenshots</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Autheris on iPhone
          </h2>
        </div>
        <div className="mt-10 flex overflow-x-auto snap-x snap-mandatory scroll-smooth px-6 pb-6 pt-2 lg:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div
              key={i}
              className="snap-start flex-shrink-0 w-[240px] sm:w-[270px] overflow-hidden bg-surface-800 first:rounded-l-[2rem] last:rounded-r-[2rem]"
            >
              <img
                src={`/autheris-screenshots/slice-${i}.png`}
                alt={`Autheris screenshot ${i}`}
                width={270}
                height={585}
                loading="lazy"
                className="h-auto w-full"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Release timeline */}
      <section className="border-t border-white/5 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-brand-400">Changelog highlights</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Shipped, then shipped again.
              </h2>
            </div>
            <a href={autherisLinks.releaseNotes} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-400 hover:text-white">
              Full release notes ↗
            </a>
          </div>
          <ol className="mt-10 border-l border-white/10">
            {[...milestones].reverse().map((m) => (
              <li key={m.version} className="relative pb-8 pl-8 last:pb-0">
                <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-500 ring-4 ring-surface-900" />
                <p className="font-mono text-xs text-brand-400">v{m.version}</p>
                <p className="mt-1 font-display text-lg font-semibold text-white">{m.title}</p>
                <p className="mt-1 text-sm text-zinc-500">{m.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 px-6 py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white">
              Keep your second factor <span className="font-serif font-normal italic text-brand-300">under your own control.</span>
            </h2>
            <p className="mt-3 text-sm text-zinc-500">
              Free and open source. Questions?{" "}
              <a href={autherisLinks.support} className="text-zinc-300 underline underline-offset-4">
                autheris@eddington.tech
              </a>{" "}
              ·{" "}
              <Link href="/privacy" className="text-zinc-300 underline underline-offset-4">
                Privacy policy
              </Link>
            </p>
          </div>
          <AppStoreButton />
        </div>
      </section>
    </>
  );
}
