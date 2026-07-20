'use client';

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 print:shadow-none print:p-0">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Hunter Eddington
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-3">
            IAM Engineer II
          </p>
          <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>hunter@eddington.tech</span>
            <span className="hidden sm:inline">|</span>
            <a 
              href="https://linkedin.com/in/hunter-e-578660371" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              linkedin.com/in/hunter-e-578660371
            </a>
            <span className="hidden sm:inline">|</span>
            <a 
              href="https://github.com/Nerdykidtech" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              github.com/Nerdykidtech
            </a>
          </div>
        </header>

        {/* Summary */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-4">
            Summary
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            I build and break things in the identity and security space. Most days I'm somewhere between 
            writing automation scripts, hardening cloud infra, and figuring out why a Roku channel won't 
            launch. Came up through self-teaching and stubbornness—no CS degree, just a lot of late nights 
            and broken builds that eventually worked.
          </p>
        </section>

        {/* Skills */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-4">
            Technical Skills
          </h2>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>
              <strong className="text-gray-900 dark:text-white">Identity & Security:</strong>{' '}
              IAM, identity governance, zero trust architecture, cloud hardening, threat intel, SOC workflows
            </p>
            <p>
              <strong className="text-gray-900 dark:text-white">Languages:</strong>{' '}
              Python, JavaScript/TypeScript, Swift, Kotlin, Java, Bash
            </p>
            <p>
              <strong className="text-gray-900 dark:text-white">Cloud & Infra:</strong>{' '}
              AWS, Azure, Docker, systemd, CI/CD, self-hosted automation
            </p>
            <p>
              <strong className="text-gray-900 dark:text-white">Development:</strong>{' '}
              Next.js, React, SwiftUI, BrightScript (Roku), Android Automotive, Gradle
            </p>
            <p>
              <strong className="text-gray-900 dark:text-white">Tools:</strong>{' '}
              SIEMs, vulnerability scanners, compliance frameworks, incident response platforms
            </p>
          </div>
        </section>

        {/* Experience */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-4">
            Experience
          </h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              IAM Engineer II
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
              Current role — Identity governance, cloud automation, zero trust
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Day-to-day is designing identity workflows at scale, automating zero trust components, 
              and keeping cloud environments from turning into Swiss cheese. Also write internal 
              security docs and threat analysis when something needs explaining.
            </p>
          </div>
        </section>

        {/* Projects */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-4">
            Projects
          </h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nuvio</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
              Streaming channel for Roku + Android Automotive app
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Built the whole thing from scratch. Roku side uses SceneGraph with QR auth; Android 
              Automotive variant handles in-vehicle distribution requirements. Got the Roku launch 
              time under 2.5 seconds after way too much profiling.
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Autheris</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
              iOS 2FA app — open source
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              SwiftUI-based TOTP generator. No cloud, no analytics, no tracking—just local secure 
              storage using the enclave. On the App Store if you need a 2FA app that doesn't phone home.
            </p>
            <a 
              href="https://github.com/Nerdykidtech/Autheris"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              → github.com/Nerdykidtech/Autheris
            </a>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Blog Pipeline</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
              Automated content system
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Python pipeline that watches RSS feeds, pulls interesting security stories, and handles 
              the whole publishing flow to LinkedIn. Runs on cron, self-hosted, uses Firecrawl and Jina 
              for extraction. Has duplicate detection and auto-categorization baked in.
            </p>
            <a 
              href="https://Eddington.Tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              → Eddington.Tech (live site)
            </a>
          </div>
        </section>

        {/* Writing */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-4">
            Writing
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            I publish regular security content—mostly IAM hardening, practical threat analysis, and 
            the occasional deep dive when something interesting breaks (BitLocker bypasses, AI social 
            engineering campaigns, that sort of thing).
          </p>
        </section>

        {/* Education */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-4">
            Education
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Self-taught. Learned by building stuff that broke, fixing it, and repeating. No traditional 
            CS background—just projects, documentation, and figuring things out as I go.
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            Open to contract work, consulting, or full-time roles in security engineering or IAM architecture.
          </p>
          
          <div className="mt-4 flex gap-4 print:hidden">
            <a
              href="/resume.pdf"
              download="Hunter_Eddington_Resume.pdf"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              Download PDF
            </a>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              Print
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
