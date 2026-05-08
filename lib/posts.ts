export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  readTime: string;
  content: string; // markdown-like body
}

// Placeholder — replace with real posts as you write them daily
export const posts: Post[] = [
  {
    slug: "welcome",
    title: "Welcome to the Eddington.Tech Blog",
    date: "2026-05-08",
    excerpt: "Why I'm starting this blog — covering IAM, system hardening, and iOS security from the perspective of someone who lives in all three.",
    category: "Meta",
    readTime: "2 min",
    content: `This is the first post on what I intend to make a daily habit.

I work across identity & access management, infrastructure hardening, and iOS development. Those three worlds don't intersect publicly very often — IAM people blog about zero trust, infra people blog about Terraform, iOS devs blog about SwiftUI. This blog is where I'll try to bridge those gaps and share what I'm actually thinking about as I work.

New post every day. Short, signal-heavy, no fluff.`,
  },
];