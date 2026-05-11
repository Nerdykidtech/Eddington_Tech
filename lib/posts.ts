export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  readTime: string;
  content: string; // markdown-like body
  author?: string;
  source?: string;
  image?: string;
}

// Placeholder — replace with real posts as you write them daily
export const posts: Post[] = [
  {
    slug: "quasar-linux-rat-developer-cred-harvest",
    title: "Quasar Linux RAT: The Developer Machine Nightmare You Should Actually Worry About",
    date: "2026-05-09",
    excerpt: "Trend Micro's QLNX is a fileless, kernel-level Linux implant that harvests credentials from dev machines — npm tokens, AWS keys, Vault tokens, GitHub CLI — and uses PAM hooks to log every SSH session.",
    category: "Security",
    readTime: "4 min",
    content: `Quasar Linux RAT is the kind of malware that should make any DevOps engineer stop and read carefully.

Trend Micro published an analysis this week of a new Linux implant they're calling QLNX — Quasar Linux RAT. It's not a script kiddie project. It's built for stealth, built for credential harvesting, and it's targeting the exact machines where your most sensitive secrets live.

The credential list alone tells you what they're after: .npmrc for npm tokens, .pypirc for PyPI credentials, .git-credentials, .aws/credentials, .kube/config, .docker/config.json, .vault-token, Terraform credentials, GitHub CLI tokens, and .env files. If you have it on your dev machine, QLNX wants it.

The attack chain does its job well. QLNX arrives and immediately goes memory-resident — no files on disk means nothing for your file integrity monitor to catch. It poses as a kernel thread (kworker, ksoftirqd) so your process accounting looks normal. It hides behind an LD_PRELOAD userland rootkit and can also load a kernel-level eBPF component that makes ps, ls, and netstat all lie about what's running. It wipes system logs after execution. And it sets up shop using seven different persistence mechanisms — systemd, crontab, .bashrc shell injection — so that killing one method doesn't evict it.

For credential harvesting specifically, it uses two PAM-based loggers. One intercepts plaintext credentials during authentication events. The other injects into every dynamically linked process to grab service names, usernames, and auth tokens as they fly past. SSH sessions get logged in their entirety.

Once it has your credentials, the attacker can push malicious packages to NPM or PyPI, pivot through your CI/CD pipeline, or access your cloud infrastructure directly. The blast radius from one compromised developer machine is enormous.

This is the supply chain attack pattern I've been watching get more refined over the past year. It's not about exploiting a zero-day in your infrastructure — it's about owning the developer, then using their access to quietly poison the pipe. QLNX is the most capable Linux implementation of this I've seen in a while.

The detection gap here is real. Fileless execution, kernel-level rootkit capabilities, and PAM hooks mean that traditional endpoint detection is going to miss this unless you specifically understand what QLNX's artifacts look like. Memory scanning, PAM module integrity monitoring, and eBPF-based detection are the exceptions.

If you're running Linux in a DevOps environment: treat developer workstations as high-value assets. Limit what those machines can access. Assume that if QLNX gets on one of them, your PyPI and npm publishing credentials, your cloud keys, your GitHub access — all of it — is compromised. The response isn't just "remove the malware." It's rotate everything the developer had access to, then figure out how it got in.

This one is worth tracking. QLNX is new and the delivery mechanism is still unclear. When that picture fills in, the full risk profile will become more apparent.

---

`,
    author: "Hunter Eddington",
    source: "The Hacker News — Quasar Linux RAT Steals Developer Credentials for Software Supply Chain Compromise|https://thehackernews.com/2026/05/quasar-linux-rat-steals-developer.html",
    image: "https://eddington.tech/og-image.png",
  },
  {
    slug: "dirty-frag-linux-kernel-root",
    title: "Dirty Frag: Nine Years of Silence, One Command to Root",
    date: "2026-05-09",
    excerpt: "A new Linux kernel zero-day makes local privilege escalation look trivial — and patches don't exist yet.",
    category: "Security",
    readTime: "4 min",
    content: `Linux kernel vulnerabilities that give root with a single command don't come along every week. When they do, they tend to get called something dramatic. Dirty Frag earns the name.

Hyunwoo Kim published a working PoC this week for a Linux kernel zero-day that elevates a local user to root on every major distribution — Ubuntu, RHEL, CentOS Stream, AlmaLinux, openSUSE Tumbleweed, Fedora. The attack works by chaining two page-cache write vulnerabilities in the kernel's xfrm-ESP and RxRPC subsystems. The underlying bugs have been sitting in algif_aead since roughly 2017. Nobody caught them.

What's different about Dirty Frag compared to Dirty Pipe and Copy Fail (the two most recent Linux root exploits in this class): it's deterministic. No timing windows, no race conditions. Run the command, it works. The exploit doesn't kernel panic on failure, which means it leaves basically no trace. Most alerting logic never sees it.

The mitigations are available, but they're not free. The suggested fix is removing the esp4, esp6, and rxrpc kernel modules:

sh -c "printf 'install esp4 /bin/false\\ninstall esp6 /bin/false\\ninstall rxrpc /bin/false\\n' > /etc/modprobe.d/dirtyfrag.conf; rmmod esp4 esp6 rxrpc 2>/dev/null; true"

That breaks IPsec VPNs and AFS distributed network file systems. For a lot of production Linux environments, that's not acceptable. So the choice becomes: run vulnerable, or break something your business depends on. There's no third option until patches arrive.

CISA added Copy Fail to the Known Exploited Vulnerabilities catalog last week and gave federal agencies until May 15 to patch. Copy Fail is still being actively exploited. And now Dirty Frag is sitting out there with a public PoC and no patch. The timing here is not great.

The broader pattern is what gets me. The Dirty Pipe family of exploits keeps showing up because the kernel's page-cache handling is a shared attack surface that multiple subsystems interact with in ways that are hard to reason about and harder to audit. algif_aead is a crypto interface that nobody thinks about until someone demonstrates it can be used to overwrite /etc/passwd. Nine years is a long time for that to go unnoticed.

If you're running Linux in production: assume this is being weaponized in the next few days. The PoC is public. The success rate is near 100%. And the detection gap is real — most file integrity monitoring tools aren't watching /proc/[pid]/mem or the page-cache write paths that make this work.

Patch when vendors ship. Until then, understand your exposure.

---

`,
    author: "Hunter Eddington",
    source: "BleepingComputer — New Linux 'Dirty Frag' zero-day with PoC exploit gives root privileges|https://www.bleepingcomputer.com/news/security/new-linux-dirty-frag-zero-day-with-poc-exploit-gives-root-privileges/",
    image: "https://eddington.tech/og-image.png",
  },
  {
    slug: "pamdoora-linux-ssh-backdoor",
    title: "PamDOORa Is What Post-Breach IAM Looks Like When You Don't Catch It",
    date: "2026-05-08",
    excerpt: "A new PAM-based Linux backdoor shows how attackers maintain SSH access long after you've 'contained' the initial breach.",
    category: "IAM",
    readTime: "4 min",
    content: `Here's what keeps me up at night in IAM: the moment you think you've contained a breach. That's usually when the real access is already set up and you just don't know it yet.

PamDOORa is a new Linux backdoor discovered by Flare.io researchers, currently being sold on the Rehub Russian cybercrime forum for $900. It's a PAM-based post-exploitation toolkit — meaning it gets deployed AFTER an attacker already has root on a system. Its job is to harvest credentials from every user authenticating through the compromised host, and provide a magic password for persistent SSH access whenever the attacker wants it.

PAM is the Pluggable Authentication Module — the standard auth framework on Linux and Unix systems. Admins like it because you can swap authentication methods without rewriting apps. But here's the catch that doesn't get enough attention: PAM modules run with root privileges, and they don't hash passwords — they transmit plaintext during the auth handshake. Drop a malicious module into that stack and you own every credential that touches the system.

PamDOORa does exactly that. It intercepts SSH authentication attempts, logs the results, and has anti-forensic capabilities to manipulate authentication logs and erase traces. The researchers described it as "operator-grade tooling" — modular, with anti-debugging features and network-aware triggers. That's not a script some kid threw together. That's a product with a support team.

This is a post-breach problem, not a zero-day. The initial infection chain still requires an attacker to get root through some other means. But that's exactly what makes PAM backdoors dangerous in an enterprise environment. They don't replace your foothold — they amplify it. You patch your SSH config, rotate your keys, enforce fail2ban. And then someone with root drops PamDOORa into the PAM stack, and now every authentication on that host feeds credentials back to the attacker. Rotation doesn't help if the attacker is reading credentials as they fly through the auth stack. Once a PAM backdoor is in place, your "remediated" server is still compromised. You rebuild, not rotate.

The practical thing: PAM module integrity is an afterthought at most shops. File integrity monitoring on /etc/pam.d/ and /lib/security/ should be standard practice, not optional. If you're not tracking what PAM modules are loaded, you're missing a real part of your authentication surface.

PamDOORa isn't confirmed in the wild yet. But it's for sale for $900, down from $1,600 in March — which tells you the market is there and the sellers are motivated. Assume it's being deployed somewhere right now.

---

`,
    author: "Hunter Eddington",
    source: "The Hacker News — New Linux PamDOORa Backdoor Uses PAM Modules to Steal SSH Credentials|https://thehackernews.com/2026/05/new-linux-pamdoora-backdoor-uses-pam.html",
    image: "https://eddington.tech/og-image.png",
  },
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
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
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

`,
    author: "Hunter Eddington",
    source: "Krebs on Security — Canvas Breach Disrupts Schools & Colleges Nationwide|https://krebsonsecurity.com/2026/05/canvas-breach-disrupts-schools-colleges-nationwide/",
    image: "https://eddington.tech/og-image.png",
  },
  {
    slug: "cpanel-three-vulnerabilities-patch-now",
    title: "cPanel Dropped Three Security Updates Today — Here's the One That Actually Matters",
    date: "2026-05-09",
    excerpt: "A privilege escalation via insufficient input validation in cPanel's feature file loader is being downplayed in the CVE description. It's not as boring as it sounds.",
    category: "Security",
    readTime: "4 min",
    content: `cPanel dropped three security updates today. The CVE descriptions are mild enough that most people will skim past them. That would be a mistake.

Three vulnerabilities in cPanel and Web Host Manager (WHM): CVE-2026-29201 (CVSS 4.3), a code execution flaw, and a denial-of-service. On the surface, this looks like a routine patch batch. Look closer at CVE-2026-29201 and the story changes.

The vulnerability is in the "feature::LOADFEATUREFILE" adminbin call — insufficient input validation on the feature filename parameter. Here's why that matters: cPanel's admin binary runs with elevated privileges. A malformed filename in this call can be weaponized for local privilege escalation. In practice, that means anyone with a cPanel account on a shared server — even a low-privilege one — could potentially escalate to root and access every site and database on that machine.

That CVSS score of 4.3 is misleading. CVSS scores measure exploit complexity and impact in a vacuum. They don't measure what happens when your control panel runs on millions of shared hosting servers, each hosting hundreds of customer domains. One compromised cPanel instance doesn't just expose one website. It exposes everyone on that box.

The other two vulnerabilities are a code execution flaw and a DoS affecting the file manager. The DoS matters if you're running a hosted service where uptime is part of your offering — a crash taking down the control panel means your customers can't manage their sites.

What I'm watching is the patch cadence problem. cPanel doesn't update the way an OS package manager does. Most cPanel installations go months without running /usr/local/cpanel/scripts/upcp. The update is available now, but the lag between patch release and patch deployment is where attacks happen. Adversaries automate scanning for unpatched cPanel instances the same day patches drop.

If you're running cPanel or WHM: update today. Not this week. Today. The dashboard will flag the available update, or you can run the updater manually. It's not dramatic. It's just one of those patches that can't wait.

This is the kind of vulnerability that looks boring until you realize how many servers it affects and how fast an unpatched instance becomes someone else's pivot point.

---

`,
    author: "Hunter Eddington",
    source: "The Hacker News — cPanel, WHM Release Fixes for Three New Vulnerabilities — Patch Now|https://thehackernews.com/2026/05/cpanel-whm-patch-3-new-vulnerabilities.html",
    image: "https://eddington.tech/og-image.png",
  },
  {
    slug: "russia-gru-router-dns-hijack-microsoft-tokens",
    title: "Russia's GRU Hacked 18,000 SOHO Routers to Steal Microsoft OAuth Tokens",
    date: "2026-05-10",
    excerpt: "Russian state hackers compromised 18,000 SOHO routers to hijack Microsoft OAuth tokens via DNS, bypassing MFA entirely. Here's what happened and what you should actually do about it.",
    category: "Threat Intelligence",
    readTime: "4 min",
    content: `If you run a SOHO network and haven't touched your router's firmware in a while, read this.

Russia's Forest Blizzard group — also known as APT28 and Fancy Bear, operating out of GRU — compromised over 18,000 internet routers in December 2025. They used the same approach security researchers have been screaming about for years: DNS hijacking on outdated hardware.

The mechanics are not complicated. The attackers found routers with known, unpatched vulnerabilities — mostly older Mikrotik and TP-Link devices. They modified the router's DNS settings to point to servers they controlled. From there, every user on that network got routed through their DNS infrastructure when attempting OAuth flows with Microsoft services. The attackers intercepted the authentication tokens as they passed through — tokens that were already validated by MFA.

No malware on endpoints. No phishing emails. Just router reconfiguration at scale.

This is adversary-in-the-middle (AiTM) via DNS, and it works because most SOHO router firmware doesn't validate signed DNS responses properly, and because OAuth token theft bypasses the credential and the second factor entirely. If you're using Outlook on the web and your router is compromised, they get in without touching your password or your authenticator app.

Black Lotus Labs documented the campaign. Microsoft's blog post confirms over 200 organizations and roughly 5,000 consumer devices were affected. The NCSC published an advisory in August 2025 documenting Forest Blizzard's shift from targeted malware on routers to mass DNS hijacking — a pivot that happened within 24 hours of public exposure. That's operational discipline worth noting.

The FCC's response in March 2026 was to stop certifying consumer-grade routers made outside the US. Whether that actually helps is another question. It doesn't touch the hardware already deployed, and "conditional approval" from DoD or DHS is not something your average small business is going to get. Better than nothing, not enough by itself.

The real question is what you do about this. If you run SOHO hardware: check your router's DNS settings now. Look for any resolvers pointing to IPs you don't recognize. Mikrotik has a writeup on their site. If you're an organization with remote workers running home routers: your VPN posture matters here. If traffic is split-tunneled and DNS leaks, this attack works regardless of whether you're on the corporate VPN. Full tunnel or DNS filtering at the endpoint level are the options that actually address this.

For IAM teams: the OAuth token theft vector is the part that should get attention. If you're using conditional access policies that rely on device compliance, this attack works because the attacker is on the same network as the device — they sit in the middle of the authentication flow and capture tokens that have already passed MFA. Your device compliance check says the machine is clean. But the session token is being stolen at the network layer while the machine is on a compromised router.

The detection gap is real. Most MDM and endpoint detection tools aren't looking at DNS configuration as an anomaly signal. You need to be.

I'll probably regret writing this on a Friday afternoon, but here it is. If you're using Microsoft 365 and a SOHO router, check your DNS settings today. It's the one thing you can actually do right now.

---

`,
    author: "Hunter Eddington",
    source: "Krebs on Security — Russia's Forest Blizzard Hacked 18,000 SOHO Routers for Microsoft OAuth Theft|https://krebsonsecurity.com/2026/05/russia-gru-hacked-18-000-soho-routers/",
    image: "https://eddington.tech/og-image.png",
  },
  {
    slug: "pcpjack-credential-stealer-cloud-worm",
    title: "PCPJack: Credential-Stealing Worm Exploits 5 CVEs to Spread Across Cloud Infrastructure",
    date: "2026-05-10",
    excerpt: "SentinelOne researchers have unpacked PCPJack, a credential theft framework that targets Docker, Kubernetes, Redis, MongoDB and RayML environments. It exploits five CVEs, spreads like a worm, kicks TeamPCP to the curb, and uses Telegram for C2.",
    category: "Threat Intelligence",
    readTime: "5 min",
    content: `Security researchers at SentinelOne have detailed a new credential theft campaign they're calling PCPJack. It's a modular worm that goes after exposed cloud services — Docker, Kubernetes, Redis, MongoDB, RayML — and spreads by exploiting known vulnerabilities.

The attack chain starts with a bootstrap shell script. That script preps the environment, downloads next-stage Python tooling, terminates any TeamPCP processes already running on the box, and then settles in for the long haul. It even installs Python if it's not there already.

Five CVEs fuel the spread: CVE-2025-55182, CVE-2025-29927, CVE-2026-1357, CVE-2025-9501, and CVE-2025-48703. All are known flaws in the target platforms. If you're patched, you won't get owned this way. That's the tl;dr.

What's interesting is the relationship to TeamPCP, a threat actor that made noise late last year using similar TTPs — exploiting React2Shell and misconfigs in cloud services. PCPJack actively removes TeamPCP artifacts from compromised hosts. When it reports home, it even includes a "PCP replaced" field in its C2 traffic, essentially saying "yep, we handled the squatters." SentinelOne's Alex Delamotte noted this implies the actor was specifically focused on clearing out competitors rather than just opportunistic cloud exploitation.

The credential haul is broad: cloud services, container environments, developer tools, productivity apps, financial platforms. The C2 channel is Telegram — simple, disposable, and unlikely to get flagged by your average perimeter security stack.

One thing that stands out: PCPJack doesn't deploy cryptocurrency miners. TeamPCP did. Either the operator has a different monetization plan, or they're planning to sell the stolen credentials instead of turning cycles into cash. That part isn't clear yet.

The propagation logic pulls target lists from Common Crawl's parquet archives — so it's automating reconnaissance on a massive dataset to find exposed services. The check.sh script handles OS detection and picks the right Sliver binary, then queries IMDS endpoints, Kubernetes service accounts, and Docker instances for credentials tied to Anthropic, Digital Ocean, Discord, Google API, Grafana Cloud, HashiCorp Vault, and others.

Bottom line: if your cloud services are internet-facing and unpatched, you're in someone's crosshairs. The fact that one actor is actively kicking another off compromised hosts tells you there's real money in this. Not script kiddie stuff — organized, deliberate credential harvesting at scale.

Patch the five CVEs. Lock down IMDS access. Monitor for unexpected Python spawning and outbound Telegram traffic. That's the stack.

---

`,
    author: "Hunter Eddington",
    source: "The Hacker News — PCPJack Credential Stealer Exploits 5 CVEs to Spread Worm-Like Across Cloud Systems|https://thehackernews.com/2026/05/pcpjack-credential-stealer-exploits-5.html",
    image: "https://eddington.tech/og-image.png",
  }
];