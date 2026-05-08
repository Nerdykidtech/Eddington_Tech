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
  {
    slug: "canvas-breach-275-million-students",
    title: "Canvas Breach: 275 Million Students, One 'Scheduled Maintenance' Lie",
    date: "2026-05-08",
    excerpt: "ShinyHunters hit Instructure's Canvas LMS. Here's the IAM angle that's being missed in most coverage.",
    category: "Security",
    readTime: "4 min",
    content: `The Canvas breach is the kind of story that makes IAM engineers feel vindicated and nauseated at the same time.

Brian Krebs broke it today: ShinyHunters hit Instructure's Canvas platform — the LMS used by roughly 9,000 schools and 275 million students and faculty. They defaced the login page with a ransom demand. Instructure's status page called it "scheduled maintenance." It wasn't.

The data stolen includes names, email addresses, student ID numbers, and apparently billions of private messages between students and teachers. No passwords or financial data — Instructure made sure to get that message out early. Understandable, but it also tells you exactly what they knew wasn't compromised.

What caught my eye wasn't the scale. It was the ransom model. ShinyHunters told each affected school to negotiate separately. That's deliberate: instead of negotiating with Instructure, they went straight to the institutions. Schools with finals this week had real pressure. That's not an accident.

The IAM angle here is simple and most schools still aren't handling it right:

- Student IDs and email addresses get treated as low-sensitivity. They shouldn't be. They're the pivot point for every phishing, social engineering, and account takeover attack targeting a student population with basically no security training.
- 275 million people includes minors. FERPA doesn't disappear because a ransomware group is asking the questions.
- MFA enforcement at institutional level is still inconsistent across K-12 and higher ed. A Canvas breach with 2FA on every account looks very different than one without.

What I keep thinking about: how did ShinyHunters get in the first place? Instructure said they'd patched and contained it. Then on May 7th, the login page was defaced anyway. Either the patch was incomplete, or they re-entered through a different vector. Neither is acceptable.

The Cloudskope CEO called out Instructure for lying about "scheduled maintenance" while schools were being actively extorted. Fair criticism. But from where I'm sitting, the harder question is why a platform with data on 275 million people didn't have controls that would make a breach less catastrophic — or why those controls weren't being audited regularly.

If you're running Canvas at your institution: treat this as a reason to push for MFA enforcement on student accounts, not just faculty. The blast radius of a student email breach isn't zero.

More as it develops.

---

*Source: [Krebs on Security — Canvas Breach Disrupts Schools & Colleges Nationwide](https://krebsonsecurity.com/2026/05/canvas-breach-disrupts-schools-colleges-nationwide/)*`,
  },
];