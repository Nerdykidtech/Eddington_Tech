import { ToolCard } from "@/components/ToolCard";
import { tools } from "@/lib/tools";

export const metadata = {
  title: "Tools | Eddington.Tech",
  description:
    "Privacy-first tools I actually use and recommend for teams who care about data sovereignty, open-source, and staying off the big-tech radar.",
  alternates: {
    canonical: "https://eddington.tech/tools",
  },
  openGraph: {
    title: "Privacy-first Tools | Eddington.Tech",
    description:
      "Tools I actually use and recommend for teams who care about data sovereignty, open-source, and staying off the big-tech radar.",
    url: "https://eddington.tech/tools",
    siteName: "Eddington.Tech",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy-first Tools | Eddington.Tech",
    description:
      "Tools I actually use and recommend for teams who care about data sovereignty, open-source, and staying off the big-tech radar.",
    images: [
      {
        url: "https://eddington.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "Eddington.Tech Tools",
      },
    ],
  },
};

export default function ToolsPage() {
  return (
    <div className="px-6 py-20 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 sm:mb-12">
          <p className="text-xs font-mono uppercase tracking-widest text-brand-500 mb-3">Recommended</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white">
            Privacy-first tools
          </h1>
          <p className="mt-3 text-zinc-400 text-base sm:text-lg max-w-2xl">
            Tools I actually use and recommend for teams who care about data sovereignty, open-source, and staying off the big-tech radar.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );
}