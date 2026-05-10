import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Eddington.Tech",
  description:
    "Privacy policy for Eddington.Tech and linked products, including Autheris.",
  alternates: {
    canonical: "https://eddington.tech/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Eddington.Tech",
    description:
      "Privacy policy for Eddington.Tech and linked products, including Autheris.",
    url: "https://eddington.tech/privacy",
    siteName: "Eddington.Tech",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Eddington.Tech",
    description:
      "Privacy policy for Eddington.Tech and linked products, including Autheris.",
    images: [
      {
        url: "https://eddington.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "Eddington.Tech Privacy Policy",
      },
    ],
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-brand-400 transition-colors"
      >
        ← Eddington.Tech
      </Link>

      <header className="mt-8">
        <h1 className="font-display text-3xl font-bold text-zinc-100 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-zinc-500">
          Last updated: March 16, 2025
        </p>
      </header>

      <div className="mt-12 space-y-10 text-zinc-400">
        <section>
          <h2 className="font-display text-lg font-semibold text-zinc-100">
            1. Scope
          </h2>
          <p className="mt-2">
            This policy applies to Eddington.Tech (this website), its subpages
            (e.g. Autheris.Eddington.Tech), and any iOS or other applications
            linked from this site that are operated by Hunter Eddington
            (“I,” “we,” “Eddington.Tech”). By using the site or linked apps, you
            agree to this policy.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-zinc-100">
            2. Information we collect
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong className="text-zinc-300">Website.</strong> The website
              is static and does not require an account. We do not knowingly
              collect personal data from visitors unless you voluntarily
              provide it (e.g. via a contact form or email). Our hosting
              provider may log standard technical data (IP address, browser,
              timestamps) for security and operation; we do not use this to
              identify you personally unless required by law.
            </li>
            <li>
              <strong className="text-zinc-300">Apps (e.g. Autheris).</strong>{" "}
              Our apps are designed to keep sensitive data on your device. We
              do not collect account credentials or authentication secrets.
              Any data an app sends (e.g. crash reports or anonymous usage
              metrics) will be described in the app or its documentation.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-zinc-100">
            3. How we use information
          </h2>
          <p className="mt-2">
            We use information only to operate and improve the site and apps,
            to respond to legitimate inquiries, and where required by law. We
            do not sell or rent your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-zinc-100">
            4. Cookies and similar technologies
          </h2>
          <p className="mt-2">
            This site may use minimal, essential cookies or similar technologies
            for security and basic operation. If we add analytics or
            non-essential cookies in the future, we will update this section
            and, where required, obtain consent.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-zinc-100">
            5. Third parties
          </h2>
          <p className="mt-2">
            The site may be hosted and served by third-party providers (e.g.
            Vercel or similar). Those providers process traffic data according
            to their own privacy policies. Links to other websites or app
            stores are not under our control; we encourage you to read their
            privacy practices.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-zinc-100">
            6. Data retention and security
          </h2>
          <p className="mt-2">
            We retain data only as long as needed for the purposes above or as
            required by law. We take reasonable steps to protect data in our
            control; no system is completely secure, and we cannot guarantee
            absolute security.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-zinc-100">
            7. Your rights
          </h2>
          <p className="mt-2">
            Depending on where you live, you may have rights to access, correct,
            delete, or restrict processing of your personal data, or to object
            or withdraw consent. To exercise these rights or ask questions
            about your data, contact us using the details below.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-zinc-100">
            8. Children
          </h2>
          <p className="mt-2">
            Our site and apps are not directed at children under 13 (or the
            applicable age in your jurisdiction). We do not knowingly collect
            personal data from children. If you believe we have received such
            data, please contact us so we can delete it.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-zinc-100">
            9. Changes
          </h2>
          <p className="mt-2">
            We may update this policy from time to time. The “Last updated”
            date at the top will change when we do. Continued use of the site
            or apps after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-zinc-100">
            10. Contact
          </h2>
          <p className="mt-2">
            For privacy-related questions or requests, contact Hunter Eddington
            via the main site{" "}
            <Link href="/" className="text-brand-400 hover:text-brand-300">
              Eddington.Tech
            </Link>
            .
          </p>
        </section>
      </div>

      <div className="mt-16 pt-8 border-t border-surface-700">
        <Link
          href="/"
          className="text-brand-400 hover:text-brand-300 transition-colors"
        >
          ← Back to Eddington.Tech
        </Link>
      </div>
    </div>
  );
}
