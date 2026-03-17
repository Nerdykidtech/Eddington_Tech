import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-surface-700 bg-surface-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-zinc-100 hover:text-white transition-colors"
        >
          Eddington<span className="text-brand-400">.Tech</span>
        </Link>
        <nav className="flex items-center gap-8 text-sm text-zinc-400">
          <Link href="/#about" className="hover:text-zinc-100 transition-colors">
            About
          </Link>
          <Link href="/#apps" className="hover:text-zinc-100 transition-colors">
            Apps
          </Link>
          <Link href="/privacy" className="hover:text-zinc-100 transition-colors">
            Privacy
          </Link>
        </nav>
      </div>
    </header>
  );
}
