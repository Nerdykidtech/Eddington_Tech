import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-surface-700 bg-surface-800/50">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link
            href="/"
            className="font-display text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Eddington.Tech
          </Link>
          <p className="text-xs text-zinc-500">
            System Engineer · IAM Engineer · iOS Developer
          </p>
        </div>
      </div>
    </footer>
  );
}
