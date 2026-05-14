"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Post } from "@/lib/posts";

interface BlogPostListProps {
  posts: Post[];
  postsPerPage?: number;
}

export function BlogPostList({ posts, postsPerPage = 6 }: BlogPostListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(postsPerPage);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category));
    return Array.from(cats).sort();
  }, [posts]);

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === null || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  // Posts to display (with pagination)
  const displayedPosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + postsPerPage);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
    setVisibleCount(postsPerPage);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setVisibleCount(postsPerPage);
  };

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(postsPerPage);
            }}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 pl-11 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-brand-500/50 focus:outline-none focus:ring-1 focus:ring-brand-500/30 transition-all"
          />
          <svg
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === category
                  ? "border-brand-500/40 bg-brand-500/20 text-brand-300"
                  : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/10 hover:text-zinc-300"
              }`}
            >
              {category}
              {selectedCategory === category && (
                <span className="ml-1.5 text-brand-400">×</span>
              )}
            </button>
          ))}
          {(searchQuery || selectedCategory) && (
            <button
              onClick={clearFilters}
              className="rounded-full border border-zinc-700 bg-transparent px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="text-xs text-zinc-500">
          {filteredPosts.length === posts.length
            ? `${posts.length} posts`
            : `Showing ${filteredPosts.length} of ${posts.length} posts`}
        </p>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-white/5 p-12 text-center">
          <p className="text-zinc-400">No posts found matching your search.</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
          >
            Clear filters →
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {displayedPosts.map((post) => (
            <article
              key={post.slug}
              className="rounded-xl border border-white/5 bg-white/5 p-6 hover:border-brand-500/30 transition-all"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mb-3">
                <span className="rounded-full border border-brand-500/20 bg-brand-500/10 px-2 py-0.5 text-brand-400">
                  {post.category}
                </span>
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime} read</span>
              </div>
              <Link href={`/blog/${post.slug}`} className="group">
                <h2 className="font-display text-xl font-semibold text-zinc-100 group-hover:text-brand-400 transition-colors">
                  {post.title}
                </h2>
              </Link>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-block text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-10 text-center">
          <button
            onClick={handleLoadMore}
            className="rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-brand-500/30 hover:bg-white/10 hover:text-white"
          >
            Load more ({filteredPosts.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}