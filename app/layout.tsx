import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { BackToTop } from "@/components/BackToTop";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eddington.tech"),
  title: "Eddington.Tech | System Engineer & IAM Engineer",
  description:
    "Personal site of Hunter Eddington — System Engineer, IAM Engineer, and iOS developer. Showcase of apps and projects.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/autheris-icon.png",
  },
  openGraph: {
    title: "Eddington.Tech | System Engineer & IAM Engineer",
    description:
      "Personal site of Hunter Eddington — System Engineer, IAM Engineer, and iOS developer.",
    url: "https://eddington.tech",
    siteName: "Eddington.Tech",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Eddington.Tech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@huntereddington",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} font-sans`}
    >
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Hunter Eddington",
              url: "https://eddington.tech",
              sameAs: [
                "https://www.linkedin.com/in/huntereddington",
                "https://github.com/nerdykidtech",
              ],
              jobTitle: "System Engineer & IAM Engineer",
              description:
                "Identity & Access Management, iOS Security, System Hardening",
            }),
          }}
        />
        <ScrollProgress />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
