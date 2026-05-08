"use client";

import { useState } from "react";
import { snippets } from "@/lib/snippets";

const categories = [
  { value: "all", label: "All" },
  { value: "iam", label: "IAM" },
  { value: "security", label: "Security" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "productivity", label: "Productivity" },
];

const languages = [
  { value: "all", label: "All languages" },
  { value: "powershell", label: "PowerShell" },
  { value: "bash", label: "Bash" },
  { value: "python", label: "Python" },
  { value: "typescript", label: "TypeScript" },
];

export default function SnippetsPage() {
  const [category, setCategory] = useState("all");
  const [language, setLanguage] = useState("all");
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const filtered = snippets.filter(
    (s) => category === "all" || s.category === category
  ).filter(
    (s) => language === "all" || s.language === language
  );

  const toggle = (id: string) => {
    const next = new Set(openIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpenIds(next);
  };

  return (
    <div className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <p className="text-xs font-mono uppercase tracking-widest text-brand-500 mb-3">
            Code
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white">
            IAM & Security Scripts
          </h1>
          <p className="mt-3 text-zinc-400 max-w-2xl">
            PowerShell, Bash, Python — real scripts I use for IAM, infrastructure, and security tasks.
            Copy what you need, adapt as required.
          </p>
        </header>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Category</span>
            <div className="flex gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                    category === cat.value
                      ? "border-brand-500/50 bg-brand-500/10 text-brand-400"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-300"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Language</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-400 backdrop-blur-sm hover:border-white/20 transition-all cursor-pointer appearance-none pr-8"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%239ca3af' viewBox='0 0 16 16'%3E%3Cpath d='M4 6l4 4 4-4H4z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs text-zinc-600 self-center">
            {filtered.length} snippet{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Snippet list */}
        <div className="space-y-3">
          {filtered.map((snippet) => {
            const isOpen = openIds.has(snippet.id);
            return (
              <div
                key={snippet.id}
                className="rounded-xl border border-white/5 bg-white/5 overflow-hidden"
              >
                {/* Collapsed header / toggle */}
                <button
                  onClick={() => toggle(snippet.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
                    <span className="font-display text-base font-medium text-zinc-100 truncate">
                      {snippet.title}
                    </span>
                    <div className="flex flex-wrap gap-1.5 shrink-0">
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-mono ${
                        snippet.category === "iam" ? "border-orange-500/20 bg-orange-500/10 text-orange-400" :
                        snippet.category === "security" ? "border-red-500/20 bg-red-500/10 text-red-400" :
                        snippet.category === "infrastructure" ? "border-blue-500/20 bg-blue-500/10 text-blue-400" :
                        "border-green-500/20 bg-green-500/10 text-green-400"
                      }`}>
                        {snippet.language}
                      </span>
                      {snippet.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-zinc-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="shrink-0 text-zinc-500">
                    {isOpen ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </span>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="border-t border-white/5">
                    <p className="px-5 py-3 text-sm text-zinc-400 border-b border-white/5">
                      {snippet.description}
                    </p>

                    {/* Code block */}
                    <div className="px-5 py-4">
                      <div className="rounded-lg border border-black/20 bg-black/40 overflow-hidden">
                        <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
                          <span className="text-xs font-mono text-zinc-500">{snippet.language}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(snippet.code); }}
                            className="text-xs text-zinc-500 hover:text-brand-400 transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                        <pre className="p-4 text-sm font-mono text-zinc-300 overflow-x-auto whitespace-pre">
                          {snippet.code}
                        </pre>
                      </div>
                    </div>

                    {/* Output */}
                    {snippet.output && (
                      <div className="px-5 pb-4">
                        <div className="rounded-lg border border-black/20 bg-black/40 overflow-hidden">
                          <div className="flex items-center border-b border-white/5 px-4 py-2">
                            <span className="text-xs font-mono text-zinc-500">output</span>
                          </div>
                          <pre className="p-4 text-sm font-mono text-emerald-400/80 overflow-x-auto whitespace-pre">
                            {snippet.output}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-xl border border-white/5 bg-white/5 p-12 text-center">
            <p className="text-zinc-500">No snippets match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}