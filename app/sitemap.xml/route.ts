import { NextResponse } from "next/server";
import { posts } from "@/lib/posts";

export const dynamic = "force-static";

export async function GET() {
  const baseUrl = "https://eddington.tech";
  
  // Sort posts by date, newest first
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const staticPages = [
    { url: baseUrl, changefreq: "weekly", priority: "1.0", lastmod: null },
    { url: `${baseUrl}/blog`, changefreq: "daily", priority: "0.9", lastmod: null },
    { url: `${baseUrl}/tools`, changefreq: "weekly", priority: "0.7", lastmod: null },
    { url: `${baseUrl}/snippets`, changefreq: "weekly", priority: "0.7", lastmod: null },
    { url: `${baseUrl}/autheris`, changefreq: "monthly", priority: "0.6", lastmod: null },
    { url: `${baseUrl}/privacy`, changefreq: "yearly", priority: "0.5", lastmod: null },
  ];

  // Generate blog posts with proper dates and priorities
  const blogPosts = sortedPosts.map((post, index) => {
    // Newer posts get higher priority
    const priority = index < 5 ? "0.9" : index < 10 ? "0.8" : "0.7";
    
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastmod: post.date,
      changefreq: "weekly",
      priority,
    };
  });

  const allPages = [...staticPages, ...blogPosts];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod || new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  return new NextResponse(sitemapXml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
