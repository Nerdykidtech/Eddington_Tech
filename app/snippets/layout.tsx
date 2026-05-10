import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Snippets | Eddington.Tech",
  description:
    "PowerShell, Bash, Python, and TypeScript scripts for IAM, infrastructure, and security tasks. Copy what you need, adapt as required.",
  alternates: {
    canonical: "https://eddington.tech/snippets",
  },
  openGraph: {
    title: "IAM & Security Scripts | Eddington.Tech",
    description:
      "PowerShell, Bash, Python, and TypeScript scripts for IAM, infrastructure, and security tasks.",
    url: "https://eddington.tech/snippets",
    siteName: "Eddington.Tech",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IAM & Security Scripts | Eddington.Tech",
    description:
      "PowerShell, Bash, Python, and TypeScript scripts for IAM, infrastructure, and security tasks.",
    images: [
      {
        url: "https://eddington.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "Eddington.Tech Snippets",
      },
    ],
  },
};

export default function SnippetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}