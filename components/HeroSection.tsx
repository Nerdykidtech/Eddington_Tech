"use client";

import { useCallback, useState } from "react";
import { RevealOnScroll } from "./RevealOnScroll";

interface Burst {
  id: number;
  x: number;
  y: number;
}

interface Particle {
  angle: number;
  distance: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const BURST_PARTICLES: Particle[] = Array.from({ length: 18 }, (_, i) => ({
  angle: (i / 18) * 360 + ((i * 37) % 20) - 10,
  distance: 70 + ((i * 53) % 90),
  size: 2 + ((i * 17) % 3),
  duration: 0.7 + ((i * 23) % 4) / 10,
  delay: ((i * 7) % 5) / 100,
  color: i % 2 === 0 ? "rgba(14, 165, 233, 0.9)" : "rgba(99, 102, 241, 0.9)",
}));

let burstId = 0;

export function HeroSection() {
  const [bursts, setBursts] = useState<Burst[]>([]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    // Ignore clicks on buttons and links
    if (e.target instanceof HTMLElement && e.target.closest("a, button, [role='button']")) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const id = ++burstId;
    setBursts((prev) => [...prev, { id, x, y }]);

    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
    }, 1300);
  }, []);

  return (
    <section
      className="relative overflow-hidden border-b border-white/5 bg-surface-900 px-6 py-24 sm:py-40"
      onClick={handleClick}
    >
      {/* Animated gradient mesh */}
      <div className="absolute inset-0 hero-mesh opacity-70 pointer-events-none" />
      {/* Animated grid background */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="particle particle-1" />
        <div className="particle particle-2" />
        <div className="particle particle-3" />
        <div className="particle particle-4" />
        <div className="particle particle-5" />
        <div className="particle particle-6" />
      </div>

      {/* Click bursts */}
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="absolute pointer-events-none z-20"
          style={{ left: burst.x, top: burst.y }}
        >
          {/* Core flash */}
          <div
            className="absolute hero-burst-core rounded-full bg-brand-400"
            style={{ width: 16, height: 16, boxShadow: "0 0 20px 4px rgba(14,165,233,0.6)", animationDuration: "0.3s" }}
          />
          {/* Expanding ring */}
          <div
            className="absolute hero-burst-ring rounded-full border-2 border-brand-400/70"
            style={{ width: 140, height: 140, animationDuration: "0.7s" }}
          />
          {BURST_PARTICLES.map((p, i) => (
            <span
              key={i}
              className="absolute rounded-full hero-burst-particle"
              style={{
                width: p.size + 2,
                height: p.size + 2,
                background: p.color,
                boxShadow: `0 0 ${p.size * 5}px 2px ${p.color}`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                "--angle": `${p.angle}deg`,
                "--distance": `${p.distance + 30}px`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      ))}

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <RevealOnScroll direction="down">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-medium text-brand-400">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse-glow" />
            Systems · Identity · iOS
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Hunter Eddington
          </h1>
          <p className="mt-3 text-base sm:text-lg text-zinc-400 font-medium">
            System Engineer & IAM Engineer
          </p>
          <p className="mt-6 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto px-2">
            I design and harden infrastructure, identity systems, and access controls.
            And I build iOS apps that put security in your pocket.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">
            <a
              href="#about"
              className="group relative rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-500 hover:shadow-[0_0_30px_-5px_rgba(14,165,233,0.4)]"
            >
              About me
            </a>
            <a
              href="#apps"
              className="rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
            >
              My apps
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
