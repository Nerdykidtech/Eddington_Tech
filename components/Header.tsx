'use client';

import Link from "next/link";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-surface-900/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-white hover:text-brand-300 transition-colors"
          onClick={() => setOpen(false)}
        >
          Eddington<span className="text-brand-400">.Tech</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-8 text-sm text-zinc-400">
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

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-md text-zinc-400 hover:text-white transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-white/5 bg-surface-900/95 backdrop-blur-xl">
          <nav className="mx-auto max-w-5xl px-6 py-4 flex flex-col gap-4 text-sm text-zinc-400">
            <Link
              href="/#about"
              className="hover:text-white transition-colors"
              onClick={() => setOpen(false)}
            >
              About
            </Link>
            <Link
              href="/#apps"
              className="hover:text-white transition-colors"
              onClick={() => setOpen(false)}
            >
              Apps
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
              onClick={() => setOpen(false)}
            >
              Privacy
            </Link>
            <a
              href="https://github.com/huntereddington"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 w-fit"
              onClick={() => setOpen(false)}
            >
              GitHub
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}