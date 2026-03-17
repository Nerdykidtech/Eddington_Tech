import Link from "next/link";
import { apps } from "@/lib/apps";

const autheris = apps.find((a) => a.id === "autheris")!;

export const metadata = {
  title: `Autheris | Eddington.Tech`,
  description: autheris.description,
  openGraph: {
    title: "Autheris — Secure 2FA Token Manager",
    description: autheris.tagline,
  },
};

const features = [
  {
    title: "Quick QR scanning",
    description:
      "Add tokens instantly by scanning QR codes from any authenticator app or export.",
    icon: "qrcode",
  },
  {
    title: "Device-locked security",
    description:
      "Your tokens are encrypted and never leave your device. No account, no cloud sync.",
    icon: "lock",
  },
  {
    title: "Live countdowns",
    description:
      "Real-time OTP updates with clear visual timers so you know when the next code is ready.",
    icon: "timer",
  },
];

const highlights = [
  "100% local storage",
  "End-to-end encryption",
  "No account required",
  "Blur when backgrounded",
  "Hide codes in app switcher",
];

export default function AutherisPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-surface-700 bg-gradient-to-b from-surface-800/60 to-surface-900 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 flex justify-center" aria-hidden>
            <img
              src="/autheris-icon.png"
              alt=""
              width={120}
              height={120}
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover"
            />
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
            {autheris.name}
          </h1>
          <p className="mt-4 text-xl text-brand-400">{autheris.tagline}</p>
          <p className="mt-6 text-zinc-400 max-w-xl mx-auto">
            {autheris.description}
          </p>
          <div className="mt-10">
            {autheris.appStoreUrl ? (
              <a
                href={autheris.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-medium text-white hover:bg-brand-500 transition-colors"
              >
                Download on the App Store
              </a>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-xl border border-surface-600 bg-surface-800/80 px-6 py-3 text-sm font-medium text-zinc-400">
                Coming soon to the App Store
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl font-semibold text-zinc-100 text-center">
            Everything you need
          </h2>
          <p className="mt-2 text-center text-zinc-500 max-w-xl mx-auto">
            Add tokens, copy codes, and keep your 2FA private — all on device.
          </p>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-surface-600 bg-surface-800/40 p-6"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/15 text-brand-400">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    {f.icon === "qrcode" && (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </>
                    )}
                    {f.icon === "lock" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    )}
                    {f.icon === "timer" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                </div>
                <h3 className="font-display font-semibold text-zinc-100">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy highlights */}
      <section className="border-t border-surface-700 px-6 py-16 sm:py-24 bg-surface-800/30">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-zinc-100 text-center">
            Privacy by design
          </h2>
          <p className="mt-2 text-center text-zinc-500">
            Your codes stay on your device. Optional privacy controls keep them hidden when you need to.
          </p>
          <ul className="mt-10 flex flex-wrap justify-center gap-3">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-full border border-surface-600 bg-surface-800/60 px-4 py-2 text-sm text-zinc-400"
              >
                <span className="text-brand-400" aria-hidden>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* App Store–style screenshot gallery */}
      <section className="border-t border-surface-700 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-2xl font-semibold text-zinc-100 text-center">
            Screenshots
          </h2>
          <p className="mt-2 text-center text-zinc-500">
            See Autheris in action — scroll for more.
          </p>
        </div>
        <div className="mt-10 overflow-hidden">
          <div
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-6 pb-6 pt-2"
            style={{ scrollbarGutter: "stable" }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div
                key={i}
                className="snap-center flex-shrink-0 w-[280px] sm:w-[300px] rounded-[2rem] overflow-hidden bg-surface-800 shadow-xl ring-1 ring-surface-600"
              >
                <img
                  src={`/autheris-screenshots/slice-${i}.png`}
                  alt={`Autheris screenshot ${i}`}
                  width={300}
                  height={600}
                  className="h-[520px] w-full object-cover object-top"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + Footer */}
      <section className="border-t border-surface-700 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-zinc-400">
            Built by Hunter Eddington. Part of{" "}
            <Link
              href="/"
              className="text-brand-400 hover:text-brand-300 transition-colors"
            >
              Eddington.Tech
            </Link>
            .{" "}
            <Link
              href="/privacy"
              className="text-brand-400 hover:text-brand-300 transition-colors"
            >
              Privacy policy
            </Link>
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Support:{" "}
            <a
              href="mailto:autheris@eddington.tech"
              className="text-brand-400 hover:text-brand-300 transition-colors"
            >
              autheris@eddington.tech
            </a>
          </p>
          <Link
            href="/#apps"
            className="mt-6 inline-block text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Back to all apps
          </Link>
        </div>
      </section>
    </>
  );
}
