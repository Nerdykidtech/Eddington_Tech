"use client";

import Link from "next/link";
import { useState } from "react";
import { CommandPalette } from "@/components/CommandPalette";

const NAV = [
  { href: "/#about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/tools", label: "Tools" },
  { href: "/snippets", label: "Snippets" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-surface-900/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-white"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 font-mono text-xs font-bold text-white">
            E
          </span>
          <span>
            Eddington<span className="text-brand-400">.Tech</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 text-sm text-zinc-400 md:flex">
          <Link href="/#autheris" className="flex items-center gap-2 text-white transition-colors hover:text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-volt-400 animate-live" aria-hidden />
            Autheris
          </Link>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-white">
              {item.label}
            </Link>
          ))}
          <CommandPalette />
          <a
            href="https://github.com/nerdykidtech"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-surface-900 transition-colors hover:bg-brand-100"
          >
            GitHub
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="rounded-md p-2 text-zinc-400 transition-colors hover:text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
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
        <div className="border-t border-white/5 bg-surface-900/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4 text-base">
            <Link
              href="/#autheris"
              className="flex items-center gap-2 py-2 font-medium text-white"
              onClick={() => setOpen(false)}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-volt-400" aria-hidden />
              Autheris
            </Link>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-2 text-zinc-400 transition-colors hover:text-white"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://github.com/nerdykidtech"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-fit rounded-full bg-white px-4 py-2 text-xs font-semibold text-surface-900"
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
