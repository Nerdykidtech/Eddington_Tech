import Link from "next/link";
import type { AppItem } from "@/lib/apps";

interface AppCardProps {
  app: AppItem;
}

export function AppCard({ app }: AppCardProps) {
  return (
    <Link
      href={app.href}
      className="group block rounded-xl border border-surface-600 bg-surface-800/50 p-6 transition-all hover:border-brand-500/50 hover:bg-surface-700/50"
    >
      <div className="mb-3 text-2xl">{app.icon ?? "📱"}</div>
      <h3 className="font-display text-lg font-semibold text-zinc-100 group-hover:text-brand-300 transition-colors">
        {app.name}
      </h3>
      <p className="mt-1 text-sm text-zinc-400">{app.tagline}</p>
      <p className="mt-3 text-sm text-zinc-500 line-clamp-2">{app.description}</p>
      <span className="mt-4 inline-block text-sm font-medium text-brand-400 group-hover:text-brand-300 transition-colors">
        Learn more →
      </span>
    </Link>
  );
}
