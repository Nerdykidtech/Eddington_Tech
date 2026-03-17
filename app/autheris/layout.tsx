import Link from "next/link";

export default function AutherisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-900">
      <header className="sticky top-0 z-50 border-b border-surface-700 bg-surface-900/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link
            href="/autheris"
            className="font-display text-lg font-semibold tracking-tight text-zinc-100"
          >
            Autheris<span className="text-brand-400">.Eddington.Tech</span>
          </Link>
          <Link
            href="/#apps"
            className="text-sm text-zinc-500 hover:text-zinc-100 transition-colors"
          >
            ← Eddington.Tech
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
