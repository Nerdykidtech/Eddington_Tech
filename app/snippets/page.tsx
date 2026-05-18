"use client";

import { useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-powershell";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";
import "prismjs/components/prism-typescript";
import "prismjs/themes/prism-tomorrow.css";
import { snippets } from "@/lib/snippets";
import { Snippet } from "@/lib/snippets";

const categories = [
  { value: "all", label: "All", color: "text-zinc-400" },
  { value: "iam", label: "IAM", color: "border-orange-500/50 bg-orange-500/10 text-orange-400" },
  { value: "security", label: "Security", color: "border-red-500/50 bg-red-500/10 text-red-400" },
  { value: "infrastructure", label: "Infrastructure", color: "border-blue-500/50 bg-blue-500/10 text-blue-400" },
  { value: "productivity", label: "Productivity", color: "border-green-500/50 bg-green-500/10 text-green-400" },
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
  const [search, setSearch] = useState("");
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = snippets.filter(
    (s) => category === "all" || s.category === category
  ).filter(
    (s) => language === "all" || s.language === language
  ).filter(
    (s) => search === "" || 
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const toggle = (id: string) => {
    const next = new Set(openIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
      setTimeout(() => Prism.highlightAll(), 0);
    }
    setOpenIds(next);
  };

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadScript = (snippet: Snippet) => {
    const ext = snippet.language === "powershell" ? "ps1" : 
                snippet.language === "python" ? "py" : 
                snippet.language === "bash" ? "sh" : "ts";
    const blob = new Blob([snippet.code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${snippet.id}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLanguagePrism = (lang: string) => {
    switch (lang) {
      case "powershell": return "powershell";
      case "bash": return "bash";
      case "python": return "python";
      case "typescript": return "typescript";
      default: return "text";
    }
  };

  const getHighlightedCode = (code: string, lang: string) => {
    const language = getLanguagePrism(lang);
    return Prism.highlight(code, Prism.languages[language] || Prism.languages.text, language);
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

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search scripts by title, description, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-600 backdrop-blur-sm focus:border-brand-500/50 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition-all"
            />
            <svg 
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Category</span>
              <div className="flex gap-1.5">
                {categories.map((cat) => {
                  const active = category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                        active
                          ? cat.color
                          : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-300"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
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
                      <div className="rounded-lg border border-white/10 bg-zinc-900/80 overflow-hidden">
                        <div className="flex items-center justify-between border-b border-white/5 px-4 py-2 bg-zinc-900">
                          <span className="text-xs font-mono text-zinc-500">{snippet.language}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); downloadScript(snippet); }}
                              className="text-xs text-zinc-500 hover:text-brand-400 transition-colors flex items-center gap-1"
                              title="Download script"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download
                            </button>
                            <span className="text-zinc-700">|</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleCopy(snippet.id, snippet.code); }}
                              className={`text-xs transition-colors flex items-center gap-1 ${copiedId === snippet.id ? "text-emerald-400" : "text-zinc-500 hover:text-brand-400"}`}
                            >
                              {copiedId === snippet.id ? (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        <pre className="p-4 text-sm overflow-x-auto">
                          <code 
                            className={`language-${getLanguagePrism(snippet.language)}`}
                            dangerouslySetInnerHTML={{ 
                              __html: getHighlightedCode(snippet.code, snippet.language)
                            }}
                          />
                        </pre>
                      </div>
                    </div>

                    {/* Output */}
                    {snippet.output && (
                      <div className="px-5 pb-4">
                        <div className="rounded-lg border border-white/10 bg-zinc-900/80 overflow-hidden">
                          <div className="flex items-center border-b border-white/5 px-4 py-2 bg-zinc-900">
                            <span className="text-xs font-mono text-zinc-500">output</span>
                          </div>
                          <pre className="p-4 text-sm font-mono text-emerald-400/80 overflow-x-auto">
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
