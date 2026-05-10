import type { Metadata } from "next";
import { snippets } from "@/lib/snippets";

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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "IAM & Security Scripts | Eddington.Tech",
            description: "PowerShell, Bash, Python, and TypeScript scripts for IAM, infrastructure, and security tasks.",
            itemListElement: snippets.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: s.title,
              description: s.description,
              url: `https://eddington.tech/snippets#${s.id}`,
            })),
          }),
        }}
      />
      {children}
    </>
  );
}