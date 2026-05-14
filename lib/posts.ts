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
    slug: "bitlocker-winre-yellowkey-bypass",
    title: "BitLocker's WinRE Backdoor: YellowKey and the FsTx Bypass",
    date: "2026-05-14",
    excerpt: "A researcher going by Chaotic Eclipse published a BitLocker bypass that uses NTFS transactions in the Windows Recovery Environment. It works. Even with TPM+PIN, apparently.",
    category: "Hardening",
    readTime: "4 min",
    content: `The BitLocker bypass dropped this morning, and it's nastier than the headlines suggest.

A researcher calling themselves Chaotic Eclipse — also Nightmare Eclipse on GitHub — published proof-of-concept code for what they're calling YellowKey. It's a BitLocker bypass that works through the Windows Recovery Environment, and it's being described as functioning like a backdoor because the vulnerable component only exists in WinRE.

Here's what it actually does. You put specially crafted files in a \\System Volume Information\\FsTx directory — either on a USB drive or directly on the EFI partition. Reboot into WinRE, hold down CTRL, and instead of the recovery environment you get a command prompt. With the BitLocker volume still unlocked.

Will Dormann from Tharros Labs explained the mechanics: Windows looks for FsTx directories on attached drives when entering recovery, then replays NTFS transaction logs. That process deletes X:\\Windows\\System32\\winpeshl.ini, which is supposed to launch the actual recovery tools. Without it, Windows drops to CMD.EXE. The disk is already decrypted at this point because WinRE needs access to fix boot issues.

Kevin Beaumont confirmed it works. He recommended BitLocker PIN plus BIOS password as mitigation, which slows down an attacker who has physical access.

But here's the part that should get attention: Chaotic Eclipse claims this still works with TPM+PIN enabled. They haven't released that version of the PoC, but their statement is unambiguous: "No, TPM+PIN does not help, the issue is still exploitable regardless."

The PIN prompt happens before WinRE loads. So the PIN doesn't protect against this attack path — you're already past it.

This follows BlueHammer and RedSun, two other Windows zero-days the same researcher disclosed recently. Both saw exploit attempts within days of publication. Chaotic Eclipse is promising a "big surprise" for the next Patch Tuesday, which suggests they have more material and are releasing on a schedule.

The decision to publish these as zero-days rather than through coordinated disclosure appears to be rooted in frustration with Microsoft's handling of previous reports. Not taking sides on that — just noting that this is becoming a pattern, and Microsoft's security response is now being bypassed by researchers who've lost patience.

The real issue here isn't this specific bug. It's that WinRE has a massive trust boundary problem. It's designed to access encrypted volumes for repair purposes. That design decision created an attack surface that BitLocker was never really designed to protect against. When WinRE loads, the disk is accessible. Full stop. Finding ways to hijack that process is just playing within the rules Microsoft established.

If you're relying on BitLocker for physical security: understand what this bypass means. Physical access was already a threat model edge case, but this lowers the bar significantly. An attacker with brief access to a powered-off machine can potentially get a shell with full disk access in minutes, not hours.

The fix is going to involve changing how WinRE handles those FsTx directories, or disabling WinRE entirely (which breaks recovery scenarios). Neither is a great option. Microsoft will patch this specific path, but the architectural issue — trusted recovery environment with full disk access — remains.

Check your BitLocker configuration. TPM+PIN helps against cold boot attacks and some DMA scenarios. It doesn't help here. The PIN unlocks the volume before WinRE even enters the picture, and WinRE is trusted by design.

Chaotic Eclipse isn't done. Patch Tuesday should be interesting.

---
`,
    author: "Hunter Eddington",
    source: "BleepingComputer — Windows BitLocker zero-day gives access to protected drives, PoC released|https://www.bleepingcomputer.com/news/security/windows-bitlocker-zero-day-gives-access-to-protected-drives-poc-released/",
    image: "https://eddington.tech/og-image.png",
  },
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
  },
  {
    slug: "ai-generated-zero-day-exploits",
    title: "Google Confirms: Threat Actors Are Using AI to Write Zero-Day Exploits",
    date: "2026-05-11",
    excerpt: "Google Threat Intelligence Group identified what they believe is the first AI-generated zero-day exploit in the wild. Python code with LLM hallmarks— docstrings, hallucinated CVSS scores, textbook structure— was found targeting an unnamed web admin tool.",
    category: "Threat Intelligence",
    readTime: "3 min",
    content: `Google's Threat Intelligence Group just confirmed something that was probably inevitable: threat actors are now using LLMs to write zero-day exploits.

The discovery came when GTIG analysts dissected an exploit targeting an unnamed open-source web administration tool. The Python code had obvious fingerprints. Educational docstrings everywhere. A hallucinated CVSS score embedded in comments. The tidy, textbook structure of code that has never been reviewed by a human.

Google has high confidence this was AI-generated. The vulnerability itself—a semantic logic bug, not a memory corruption issue—is exactly the kind of flaw LLMs excel at finding. Different from what fuzzing catches.

This is not theoretical. Multiple APT groups are already operational with this approach. Chinese actors—APT27, APT45, UNC2814, UNC5673, UNC6201—are using AI for vulnerability discovery and exploit development. North Korean operators are in the mix too. Russian groups have been observed generating decoy code to hide malware like CANFAIL and LONGSTREAM.

The implications are straightforward and annoying: the barrier to entry for zero-day development just dropped. You do not need deep systems expertise anymore. You need a prompt and a target.

This is not about AI replacing human researchers. Sophisticated operations still require operational discipline, infrastructure, and the patience to weaponize findings without burning them. But the discovery phase—the hard part of finding bugs in complex software—just got cheaper and faster for anyone with API access.

For defenders, this means the same thing it has always meant, just accelerated. Patch quickly. Assume compromise. Monitor for post-exploitation behavior because you will not catch the initial entry with signature-based tools.

The attack surface is still the attack surface. The difference is who can reach it now.

---

`,
    author: "Hunter Eddington",
    source: "BleepingComputer — Google: Hackers used AI to develop zero-day exploit for web admin tool|https://www.bleepingcomputer.com/news/security/google-hackers-used-ai-to-develop-zero-day-exploit-for-web-admin-tool/",
    image: "https://eddington.tech/og-image.png",
  },
  {
    slug: "checkmarx-jenkins-plugin-compromised",
    title: "TeamPCP Hits Checkmarx Jenkins Plugin",
    date: "2026-05-12",
    excerpt: "TeamPCP strikes again. This time they got into the Checkmarx Jenkins AST plugin on the Marketplace, bundling an infostealer into the official release.",
    category: "Threat Intelligence",
    readTime: "3 min",
    content: `TeamPCP is having a busy month.

They hit the KICS scanner a few weeks ago, and now they have the Checkmarx Jenkins Application Security Testing plugin too. The modified version was on the Jenkins Marketplace. Teams pulling updates got an infostealer bundled in.

This is the same pattern we are seeing everywhere. TeamPCP is building a credential harvesting operation. They do not need exploits. They need maintainer access, time, and a CI/CD pipeline that trusts the vendor.

If you pulled the Checkmarx plugin recently, check your version. Anything after December 17, 2025 is suspect. The last clean version is 2.0.13-829.vc72453fa_1c16.

Three things worth doing:
- Pin your Jenkins plugin versions. "Latest" is not a version.
- Build from source when you can. The Marketplace is convenient, not verified.
- Check your build artifacts. Infostealers in CI/CD usually do not hide well. They rely on nobody looking.

This extends the Shai-Hulud campaign. Same actors, same objective, different target. Security vendors are attractive because their tools run with privileges by design. Compromise one, move laterally across the build environment.

The Jenkins issue is patched. Checkmarx shipped a clean version. But if you ran the bad plugin for even a day, rotate your credentials. Assume compromise. Then verify.

---

`,
    author: "Hunter Eddington",
    source: "The Hacker News — TeamPCP Compromises Checkmarx Jenkins AST Plugin|https://thehackernews.com/2026/05/teampcp-compromises-checkmarx-jenkins.html",
    image: "https://eddington.tech/og-image.png",
  },
  {
    slug: "microsoft-patch-tuesday-may-138-vulns",
    title: "Microsoft Patch Tuesday: 138 Flaws, Including DNS and Netlogon RCE",
    date: "2026-05-13",
    excerpt: "Microsoft shipped 138 vulnerabilities this Patch Tuesday, including wormable DNS RCE and a Netlogon flaw that bypasses Entra ID entirely.",
    category: "Hardening",
    readTime: "3 min",
    content: `Microsoft shipped 138 flaws this Patch Tuesday. Thirty of them are Critical. Two stand out.

CVE-2026-41096 is a DNS client heap overflow that gives remote code execution. Send the right malformed DNS response, corrupt memory, execute code. No authentication needed. Microsoft confirmed this is wormable in the right network conditions.

CVE-2026-41103 is a Netlogon spoofing bug that lets an attacker impersonate any Entra ID user. Adam Barnett at Rapid7 pointed out the obvious: this bypasses Entra ID entirely. That's your identity layer going out the window.

The DNS vulnerability bothers me more than it should. DNS clients are everywhere. They run in containers, VMs, laptops, IoT devices. Most networks have internal DNS resolvers forwarding to external ones. If you're pivoting laterally and hit one of these unpatched systems, you don't need credentials anymore. You just need to poison the right response.

Then there's CVE-2026-42898 in Dynamics CRM. Jack Bicer at Action1 walked through why this is worse than the CVSS implies. Low-privilege account, arbitrary code execution over the network, no user interaction. CRM environments connect to identity services, databases, financial systems. Get in through a low-level sales account, walk out with ERP access.

61 privilege escalation bugs in this batch. 32 remote code execution. That's not a quiet month.

Microsoft also confirmed 16 of these were found by MDASH — their multi-model AI scanning system. They're expecting AI-driven discovery to keep increasing the patch volume. The report this morning made it sound like a feature. If you're patching manually, it feels like a threat.

There is one housekeeping item hiding in the changelog. Secure Boot certificates from 2011 expire next month. Devices without the updated trust anchors will fail to boot or drop into degraded security states after June 26. Microsoft announced this last November. The deadline is thirty days away.

Check your DNS settings on any Windows host. Check your Entra ID audit logs for anomalous authentications. And if you haven't rotated to the 2023 Secure Boot certs, do that this week. Not everything on Patch Tuesday is a CVE. Some of it is just as damaging.

---

`,
    author: "Hunter Eddington",
    source: "The Hacker News — Microsoft Patches 138 Vulnerabilities, Including DNS and Netlogon RCE Flaws|https://thehackernews.com/2026/05/microsoft-patches-138-vulnerabilities.html",
    image: "https://eddington.tech/og-image.png",
  },
  {
    slug: "foxconn-nitrogen-ransomware-8tb-data-stolen",
    title: "Foxconn Confirms Cyberattack After Nitrogen Ransomware Gang Claims 8TB of Data Stolen",
    date: "2026-05-13",
    excerpt: "Foxconn confirms North American factories hit by cyberattack. Nitrogen ransomware gang claims 8TB of data stolen — 11 million documents — from the world's largest electronics manufacturer.",
    category: "Threat Intelligence",
    readTime: "4 min",
    author: "Hunter Eddington",
    source: "BleepingComputer|https://www.bleepingcomputer.com/news/security/electronics-giant-foxconn-confirms-cyberattack-on-north-american-factories/",
    image: "https://eddington.tech/og-image.png",
    content: `Foxconn just confirmed what the Nitrogen ransomware gang claimed three days ago: North American factories are down, and 8TB of data — 11 million documents — is in the hands of extortionists.

Foxconn is not a small target. They have over 900,000 employees across 240 campuses in 24 countries. Revenue in 2025 was $260 billion. They manufacture for Apple, Nvidia, Intel, Google, and basically every major electronics company you've heard of.

The attack affected North American operations specifically. Foxconn's statement says they "immediately activated the response mechanism" and are "implementing multiple operational measures to ensure the continuity of factory operations." The wording matters here: they're talking about continuity, not containment.

Nitrogen is a ransomware operation that emerged around late 2023. They don't just encrypt — they steal first, then threaten to leak. The 8TB claim is specific and unusually large. For context, that's roughly the storage capacity of 1,600 DVDs. Most ransomware groups claim hundreds of gigabytes when they want headlines.

The supply chain angle is what makes this bigger than one company. Foxconn's customers include some of the most valuable brands in the world. If the stolen data includes design specifications, manufacturing processes, supplier contracts, or pricing information, the blast radius extends far beyond Foxconn's own infrastructure.

Foxconn is being relatively tight-lipped about the scope, which is typical for a company at this scale in early response. What we know: North American factories were affected. What we don't know yet: which factories, whether the 8TB claim is accurate, what type of data was exfiltrated, and whether any customer IP was compromised.

The fact that Foxconn confirmed at all — rather than going with "technical difficulties" — suggests the operational impact was significant enough that they couldn't plausibly deny it.

This is worth watching. Ransomware groups are increasingly targeting manufacturers because the downtime costs are immediate and severe. A factory that can't ship affects quarterly revenue. That pressure makes companies more likely to pay.

If you work with Foxconn as a supplier or customer: expect communication from them about data exposure. If you don't hear from them in the next week, that's a signal too.

---

`,
  },
  {
    slug: "ollama-memory-leak-cve-2026-7482",
    title: "Ollama's Memory Leak Is a Self-Hosting Problem We Can't Keep Ignoring",
    date: "2026-05-14",
    excerpt: "A critical out-of-bounds read in Ollama before 0.17.1 lets attackers leak process memory including API keys from over 300,000 exposed servers.",
    category: "Hardening",
    readTime: "3 min",
    author: "Hunter Eddington",
    source: "The Hacker News — Ollama Out-of-Bounds Read Vulnerability Allows Remote Process Memory Leak|https://thehackernews.com/2026/05/ollama-out-of-bounds-read-vulnerability.html",
    image: "https://eddington.tech/og-image.png",
    content: `Ollama's Memory Leak Is a Self-Hosting Problem We Can't Keep Ignoring

Cyera found a critical out-of-bounds read in Ollama versions before 0.17.1. Tracked as CVE-2026-7482 with a CVSS score of 9.1, it affects over 300,000 exposed Ollama servers globally.

The attack is simple. Send a maliciously crafted GGUF model file to an Ollama server. The server parses it, triggers the out-of-bounds read, and leaks process memory back to you. That memory can contain API keys, environment variables, chat history -- whatever was in the heap at that moment.

Ollama isn't supposed to be internet-facing. The official documentation says bind to localhost. But people expose it anyway, because that's how we've been trained to deploy services. Docker, cloud VMs, reverse proxies -- the defaults drift toward "accessible" rather than "isolated."

This is why I keep hammering on hardening basics. Ollama is a single-binary Go application that downloads and runs large language models. It has an HTTP API. It runs as the user who started it. The security model assumes you're on a trusted network.

The GGUF file format is what LLMs use to store weights and metadata. Ollama pulls these from Hugging Face, from private registries, from disk. The vulnerability is in how Ollama parses tensor metadata within GGUF files -- insufficient bounds checking on the buffer that holds tensor info.

When the bug triggers, you can leak anywhere from a few KB to the entire process heap depending on the crafted file. Cyera demonstrated recovering API keys from memory. That's not theoretical -- that's the exploit.

300,000 exposed instances is a big number. The actual risk depends on what those instances have access to. A personal Ollama server running on your laptop is different from one deployed in a corporate VPC with access to internal APIs. But the exposure pattern matters. If you're running Ollama on a cloud instance, check your security groups. If 11434 is open to the world, that's a problem.

Ollama patched this in 0.17.1. The changelog just says "security fixes" without details -- typical responsible disclosure. If you're running Ollama, upgrade now. If you're managing infrastructure where developers spin up Ollama containers, audit what's actually running. Don't assume people followed the localhost guidance.

The larger point: self-hosted AI infrastructure is becoming a standard part of dev environments. These tools come with assumptions that don't match how people actually deploy them. "Bind to localhost" is meaningless when the default Docker run command publishes the port.

This vulnerability is exploitable remotely, requires no authentication, and gives you the server's memory. That's as bad as it gets for an information disclosure bug.

Patch it.

---
`,
  },
  {
    slug: "fragnesia-linux-kernel-lpe-cve-2026-46300",
    title: "Fragnesia: The Third Linux Kernel LPE in Two Weeks",
    date: "2026-05-14",
    excerpt: "Linux kernel page cache corruption strikes again with CVE-2026-46300. This XFRM ESP-in-TCP bug joins Copy Fail and Dirty Frag as the third critical LPE to drop this month.",
    category: "Hardening",
    readTime: "4 min",
    author: "Hunter Eddington",
    source: "The Hacker News|https://thehackernews.com/2026/05/new-fragnesia-linux-kernel-lpe-grants.html",
    image: "https://eddington.tech/og-image.png",
    content: `Three Linux root exploits in two weeks. The third one just dropped.

CVE-2026-46300, codenamed Fragnesia, is a local privilege escalation in the Linux kernel's XFRM ESP-in-TCP subsystem. William Bowling from V12 security found it. A PoC was released. It works on Ubuntu, RHEL, SUSE, Debian, AlmaLinux, basically everything.

Here's the technical bit: Fragnesia lets an unprivileged local attacker corrupt the page cache of read-only files. The mechanism leverages a logic bug in how the kernel handles ESP-in-TCP encapsulation. You write specially crafted data through the XFRM subsystem, the kernel misparses the sequence, and you get arbitrary byte writes into the page cache of files that should be immutable.

The Fragnesia PoC targets /usr/bin/su. Corrupt that binary in memory, run it, you have root. No race condition. Reliable exploitation. Third time in two weeks — Copy Fail, then Dirty Frag, now Fragnesia. Same attack surface, different bugs.

The mitigations are the same as Dirty Frag. Disable esp4, esp6, and related xfrm modules:

    printf 'install esp4 /bin/false\\ninstall esp6 /bin/false\\n' > /etc/modprobe.d/fragnesia.conf

That breaks IPsec. Again. If you are running production Linux with IPsec requirements, you are choosing between functional VPNs and local root access for any authenticated user. Red Hat is still assessing whether their Dirty Frag mitigation guidance covers this CVE. CloudLinux says the same mitigation works.

Wiz noted that AppArmor restrictions on unprivileged user namespaces might help, but that requires additional bypasses. Which is security researcher speak for "this makes exploitation harder but probably not impossible."

What I keep thinking about: this is the third page-cache corruption bug in the XFRM subsystem in fourteen days. Copy Fail got CISA attention. Dirty Frag got federal agencies a seven day patch deadline. Fragnesia is out there now with a public PoC and no word on active exploitation yet.

The Linux kernel's XFRM code is clearly undertested. The ESP-in-TCP path in particular has now yielded three high-impact LPEs. When researchers find a bug class that quickly, more are coming. Page cache corruption via networking subsystems is apparently a rich vein.

Microsoft security intelligence put out a statement urging patching immediately or applying the Dirty Frag mitigations. That is notable. Microsoft does not usually comment on Linux CVEs this quickly. The Windows team calling attention to a Linux kernel bug suggests they view the risk as severe and widely applicable.

There is also a threat actor called berz0k advertising a zero-day Linux LPE for $170,000 on cybercrime forums. That exploit claims TOCTOU-based privilege escalation, stable, no crashes. I don't know if it is related to Fragnesia or something else. But the timing is awful. Researchers are finding bugs faster than vendors can ship patches, and criminals are selling exploits for bugs that might not even be public yet.

The lesson here is boring and important: the Linux kernel page cache is a shared surface with complex interactions. Networking code that writes to it has been undertested. The same defensive advice keeps being relevant. Patch fast. If you can't patch, understand your exposure. Monitor for module loading and privilege escalation patterns. Treat local access as a significant risk boundary, not a perimeter security afterthought.

This is going to keep happening until the XFRM subsystem gets a proper audit. Based on the pace so far, probably in the next month.
`,
  },
];