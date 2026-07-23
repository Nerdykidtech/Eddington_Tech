"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { posts } from "@/lib/posts";
import { tools } from "@/lib/tools";
import { snippets } from "@/lib/snippets";
import { apps } from "@/lib/apps";

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  type: "page" | "post" | "tool" | "snippet" | "app";
  icon?: string;
};

const staticPages: SearchResult[] = [
  { id: "home", title: "Home", subtitle: "Landing page", href: "/", type: "page" },
  { id: "blog", title: "Blog", subtitle: "All posts", href: "/blog", type: "page" },
  { id: "tools", title: "Tools", subtitle: "Recommended tools", href: "/tools", type: "page" },
  { id: "snippets", title: "Snippets", subtitle: "IAM & security scripts", href: "/snippets", type: "page" },
  { id: "resume", title: "Resume", subtitle: "Professional experience", href: "/resume", type: "page" },
  { id: "privacy", title: "Privacy", subtitle: "Privacy policy", href: "/privacy", type: "page" },
  { id: "github", title: "GitHub", subtitle: "github.com/nerdykidtech", href: "https://github.com/nerdykidtech", type: "page" },
  { id: "linkedin", title: "LinkedIn", subtitle: "linkedin.com/in/huntereddington", href: "https://www.linkedin.com/in/huntereddington", type: "page" },
];

const typeLabels: Record<SearchResult["type"], string> = {
  page: "Page",
  post: "Post",
  tool: "Tool",
  snippet: "Snippet",
  app: "App",
};

const typeIcons: Record<SearchResult["type"], string> = {
  page: "⚡",
  post: "📝",
  tool: "🛠️",
  snippet: "⌨️",
  app: "📱",
};

function useSearchItems() {
  return useMemo(() => {
    const postItems: SearchResult[] = posts.map((post) => ({
      id: `post-${post.slug}`,
      title: post.title,
      subtitle: `${post.category} · ${post.readTime}`,
      href: `/blog/${post.slug}`,
      type: "post",
    }));

    const toolItems: SearchResult[] = tools.map((tool) => ({
      id: `tool-${tool.id}`,
      title: tool.name,
      subtitle: `${tool.category} · ${tool.tagline}`,
      href: tool.url,
      type: "tool",
    }));

    const snippetItems: SearchResult[] = snippets.map((snippet) => ({
      id: `snippet-${snippet.id}`,
      title: snippet.title,
      subtitle: `${snippet.category} · ${snippet.language}`,
      href: `/snippets`,
      type: "snippet",
    }));

    const appItems: SearchResult[] = apps.map((app) => ({
      id: `app-${app.id}`,
      title: app.name,
      subtitle: app.tagline,
      href: app.href,
      type: "app",
    }));

    return [...staticPages, ...postItems, ...toolItems, ...snippetItems, ...appItems];
  }, []);
}

function normalize(str: string) {
  return str.toLowerCase().trim();
}

function scoreResult(item: SearchResult, query: string) {
  const q = normalize(query);
  const title = normalize(item.title);
  const subtitle = normalize(item.subtitle);

  if (title === q) return 1;
  if (title.startsWith(q)) return 0.9;
  if (title.includes(q)) return 0.7;
  if (subtitle.includes(q)) return 0.5;
  return 0;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const allItems = useSearchItems();

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return allItems;

    const scored = allItems
      .map((item) => ({ item, score: scoreResult(item, q) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);

    return scored;
  }, [allItems, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (e.key === "k" && isCmdOrCtrl && !e.altKey) {
        e.preventDefault();
        open();
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        close();
      }
    },
    [isOpen, open, close]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const selectedEl = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex]);

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected) {
        if (selected.href.startsWith("http")) {
          window.open(selected.href, "_blank", "noopener,noreferrer");
        } else {
          router.push(selected.href);
        }
        close();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  const onItemClick = (href: string) => {
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      router.push(href);
    }
    close();
  };

  if (!isOpen) {
    return (
      <button
        onClick={open}
        className="hidden sm:flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-400 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:text-zinc-300"
        aria-label="Open command palette"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search
        <kbd className="ml-1 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">⌘K</kbd>
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-[15vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-surface-900/95 shadow-2xl shadow-black/50">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
          <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search posts, tools, snippets, pages..."
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            aria-label="Search"
            aria-autocomplete="list"
            aria-controls="command-palette-results"
            aria-activedescendant={`result-${selectedIndex}`}
          />
          <kbd className="hidden rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-zinc-500 sm:inline-block">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          id="command-palette-results"
          className="max-h-[60vh] overflow-y-auto p-2"
          role="listbox"
        >
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-zinc-500">
              No results found for “{query}”
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={item.id}
                    data-index={index}
                    id={`result-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => onItemClick(item.href)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                      isSelected
                        ? "bg-brand-500/15 border border-brand-500/20"
                        : "border border-transparent hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="text-lg" aria-hidden="true">
                      {item.icon ?? typeIcons[item.type]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${
                          item.type === "post" ? "text-brand-400" :
                          item.type === "tool" ? "text-emerald-400" :
                          item.type === "snippet" ? "text-orange-400" :
                          item.type === "app" ? "text-purple-400" :
                          "text-zinc-400"
                        }`}>
                          {typeLabels[item.type]}
                        </span>
                        <span className="text-sm font-medium text-zinc-100 truncate">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 truncate">{item.subtitle}</p>
                    </div>
                    {item.href.startsWith("http") && (
                      <svg className="h-3.5 w-3.5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/5 px-4 py-2 text-[10px] text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">↑↓ to navigate</span>
            <span className="hidden sm:inline">↵ to select</span>
            <span className="sm:hidden">Use arrows + enter</span>
          </div>
          <span>{results.length} result{results.length !== 1 ? "s" : ""}</span>
        </div>
      </div>
    </div>
  );
}
