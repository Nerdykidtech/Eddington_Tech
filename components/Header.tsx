import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-surface-900/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-white hover:text-brand-300 transition-colors"
        >
          Eddington<span className="text-brand-400">.Tech</span>
        </Link>
        <nav className="flex items-center gap-8 text-sm text-zinc-400">
          <Link href="/#about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link href="/#apps" className="hover:text-white transition-colors">
            Apps
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <a
            href="https://github.com/huntereddington"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}