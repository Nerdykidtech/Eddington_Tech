import type { ToolItem } from "@/lib/tools";

interface ToolCardProps {
  tool: ToolItem;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-surface-600 bg-surface-800/50 p-5 transition-all hover:border-brand-500/50 hover:bg-surface-700/50"
    >
      <div className="mb-2 text-2xl">{tool.icon ?? "🔧"}</div>
      <h3 className="font-display text-base font-semibold text-zinc-100 group-hover:text-brand-300 transition-colors">
        {tool.name}
      </h3>
      <p className="mt-0.5 text-sm text-brand-400">{tool.tagline}</p>
      <p className="mt-2 text-sm text-zinc-500 line-clamp-2">{tool.description}</p>
      <span className="mt-3 inline-block text-xs font-medium text-zinc-500 group-hover:text-brand-400 transition-colors">
        {tool.url.replace("https://", "")} →
      </span>
    </a>
  );
}