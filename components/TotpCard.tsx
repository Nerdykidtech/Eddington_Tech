"use client";

import { useEffect, useState } from "react";

// A decorative, Autheris-style token list. The codes are not real OTPs:
// they are derived from the current 30s window so they roll over like one.
const ACCOUNTS = [
  { issuer: "Entra ID", user: "hunter@corp", color: "#2f86ff" },
  { issuer: "GitHub", user: "nerdykidtech", color: "#e4e4e7" },
  { issuer: "AWS", user: "root-break-glass", color: "#ff9900" },
  { issuer: "Okta", user: "admin", color: "#59a8ff" },
];

const PERIOD = 30;

function pseudoCode(seed: number, step: number) {
  let x = (step * 2654435761 + seed * 40503) >>> 0;
  x ^= x << 13;
  x >>>= 0;
  x ^= x >>> 17;
  x ^= x << 5;
  x >>>= 0;
  return String(x % 1_000_000).padStart(6, "0");
}

export function TotpCard() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const seconds = now === null ? PERIOD : now / 1000;
  const step = Math.floor(seconds / PERIOD);
  const remaining = now === null ? PERIOD : PERIOD - Math.floor(seconds % PERIOD);
  const r = 11;
  const circumference = 2 * Math.PI * r;
  const urgent = remaining <= 5;

  return (
    <div className="relative w-full max-w-sm rounded-[28px] border border-white/10 bg-surface-800/80 p-3 shadow-[0_30px_80px_-20px_rgba(26,102,245,0.45)] backdrop-blur-xl">
      <div className="flex items-center justify-between px-3 pb-3 pt-2">
        <span className="font-display text-lg font-semibold text-white">Autheris</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">on-device</span>
      </div>
      <ul className="space-y-2">
        {ACCOUNTS.map((a, i) => {
          const code = now === null ? "······" : pseudoCode(i + 1, step);
          return (
            <li
              key={a.issuer}
              className="flex items-center gap-3 rounded-2xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/5"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-surface-900"
                style={{ background: a.color }}
                aria-hidden
              >
                {a.issuer[0]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-100">{a.issuer}</p>
                <p className="truncate text-xs text-zinc-500">{a.user}</p>
              </div>
              <span className="font-mono text-lg tracking-[0.12em] text-white tabular-nums">
                {code.slice(0, 3)} {code.slice(3)}
              </span>
              <svg width="28" height="28" viewBox="0 0 28 28" className="-rotate-90 shrink-0" aria-hidden>
                <circle cx="14" cy="14" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
                <circle
                  cx="14"
                  cy="14"
                  r={r}
                  fill="none"
                  stroke={urgent ? "#c6ff3d" : "#2f86ff"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - remaining / PERIOD)}
                  className="transition-[stroke-dashoffset] duration-1000 ease-linear"
                />
              </svg>
            </li>
          );
        })}
      </ul>
      <p className="px-3 pb-1 pt-3 text-center font-mono text-[10px] uppercase tracking-widest text-zinc-600">
        Demo codes · refresh in {remaining}s
      </p>
    </div>
  );
}
