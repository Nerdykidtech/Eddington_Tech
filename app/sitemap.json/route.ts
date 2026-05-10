import { NextResponse } from "next/server";
import { posts } from "@/lib/posts";

export const dynamic = "force-static";

export function GET() {
  const baseUrl = "https://eddington.tech";

  const staticUrls = [
    { url: baseUrl, lastmod: new Date().toISOString(), changefreq: "weekly", priority: 1 },
    { url: `${baseUrl}/blog`, lastmod: new Date().toISOString(), changefreq: "daily", priority: 0.9 },
    { url: `${baseUrl}/tools`, lastmod: new Date().toISOString(), changefreq: "weekly", priority: 0.7 },
    { url: `${baseUrl}/snippets`, lastmod: new Date().toISOString(), changefreq: "weekly", priority: 0.7 },
    { url: `${baseUrl}/autheris`, lastmod: new Date().toISOString(), changefreq: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastmod: new Date().toISOString(), changefreq: "yearly", priority: 0.5 },
  ];

  const blogUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastmod: new Date(post.date).toISOString(),
    changefreq: "weekly",
    priority: 0.8,
  }));

  return NextResponse.json(
    { staticUrls, blogUrls },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Content-Type": "application/json",
      },
    }
  );
}