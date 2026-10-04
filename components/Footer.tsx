import Link from "next/link";
import { autherisLinks } from "@/lib/autheris";

const COLUMNS = [
  {
    title: "Site",
    links: [
      { href: "/#about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/tools", label: "Tools" },
      { href: "/snippets", label: "Snippets" },
      { href: "/resume", label: "Résumé" },
    ],
  },
  {
    title: "Autheris",
    links: [
      { href: "/autheris", label: "Overview" },
      { href: autherisLinks.appStore, label: "App Store", external: true },
      { href: autherisLinks.site, label: "autheris.app", external: true },
      { href: autherisLinks.source, label: "Source code", external: true },
      { href: "/privacy", label: "Privacy" },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { href: "https://github.com/nerdykidtech", label: "GitHub", external: true },
      { href: "https://www.linkedin.com/in/huntereddington", label: "LinkedIn", external: true },
      { href: "/feed.xml", label: "RSS" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-surface-900">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl font-bold tracking-tight text-white">
              Eddington<span className="text-brand-400">.Tech</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500">
              System Engineer · IAM Engineer · Apple developer. Building secure things, then writing about them.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">{col.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {"external" in l && l.external ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-zinc-400 transition-colors hover:text-white">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="text-zinc-400 transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col gap-2 border-t border-white/5 pt-6 text-xs text-zinc-600 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Hunter Eddington</p>
          <p className="font-mono">Built with Next.js · Hosted on Vercel</p>
        </div>
      </div>
      <p
        className="pointer-events-none select-none text-center font-display text-[18vw] font-bold leading-[0.8] tracking-[-0.05em] text-white/[0.03]"
        aria-hidden
      >
        EDDINGTON
      </p>
    </footer>
  );
}
