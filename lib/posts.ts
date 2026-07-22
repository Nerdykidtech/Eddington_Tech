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
    slug: "n8n-token-exchange-cve-2026-59208",
    title: "n8n Token Exchange Flaw Lets Attackers Log In As Other Users",
    date: "2026-07-17",
    excerpt: "n8n patched a bug in their Enterprise token exchange feature that let attackers log in as other users without passwords. The flaw ignored the JWT issuer claim, matching users on subject alone. Strix's AI security agent found it.",
    category: "IAM",
    readTime: "3 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/07/n8n-token-exchange-flaw-could-let.html",
    content: `n8n shipped a fix last month for a bug that let attackers log in as other users without knowing their passwords. The catch: it only hit Enterprise deployments using a preview feature almost nobody enables.

The bug was in token exchange, n8n's way of letting OEM partners embed the platform behind their own login. Partner signs a JWT, n8n checks the signature, looks up the user, grants access. The lookup keyed on \`sub\` — the subject claim — and ignored \`iss\`, the issuer.

That is broken. A subject identifier means nothing without its issuer. Two different companies can both have a user named "admin" or "jsmith" or "user_4829." n8n treated them as the same person.

Strix found it. They are building an AI penetration testing agent and were running it against n8n's authentication when the agent flagged the mismatch. They reported it, n8n patched June 24, CVE went public July 9.

The exposure is narrow. Token exchange is Enterprise-only, still marked preview, and you need at least two trusted issuers configured. Most n8n instances do not use this at all.

But if you do: check your config. The fix is in 1.88.0 and later. CVSS 4.0 says 7.6, high. NVD says 6.8, medium. CISA says no known exploitation. No PoC in the wild yet.

The broader point is what found it. An AI agent probing authentication flows caught an identity binding mistake that humans missed. This will not be the last time.`,
  },
  {
    slug: "rustduck-botnet-iot-ddos-hardening",
    title: "RustDuck Botnet Rebuilds in Rust to Hijack Routers and IoT for DDoS",
    date: "2026-06-30",
    excerpt: "A Rust-rewritten botnet is hijacking routers, IP cameras, and Android boxes for DDoS attacks. RustDuck uses CVE-2017-17215, CVE-2025-29635, and other old vulnerabilities that should have been patched years ago.",
    category: "Threat Intelligence",
    readTime: "4 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/06/rustduck-botnet-rebuilds-in-rust-to.html",
    content: `QiAnXin's XLab has been tracking RustDuck since February. It is a botnet being actively rewritten from C into Rust, and that matters more than it might sound.

Rust binaries are harder to reverse-engineer than C. The malware authors know this. The Rust rewrite is not about performance. It is about making analysis take longer, giving them more runway before defenders catch up.

RustDuck spreads through the usual paths: weak passwords on Telnet and SSH, unpatched device bugs, and exposed web software. The CVE list reads like a greatest-hits of forgotten vulnerabilities: CVE-2017-17215 in Huawei HG532 routers, CVE-2025-29635 in discontinued D-Link DIR-823X routers, CVE-2024-1781 in Totolink X6000R, and CVE-2018-8007 in Apache CouchDB. CISA added the D-Link flaw to the KEV catalog in April. Patches for the rest have existed for years.

The payload is a two-stage dropper. A small loader decrypts a heavier Rust core. That core includes anti-analysis checks that actually work: it looks for Wireshark, debuggers, honeypot fingerprints, and VM hardware. Score too high on the risk check and it wipes its traces and exits.

The C2 communications are locked down with ChaCha20-Poly1305 for handshake, AES-GCM for data, HKDF-SHA256 key derivation, and Curve25519 key exchange. Keys rotate every ten minutes. The traffic is shaped to look like ordinary encrypted web sessions.

Once a device checks in, the operators can start or stop DDoS attacks, report status, rotate C2 servers, or upgrade the malware. Control addresses use free dynamic DNS services like duckdns.org.

The busiest delivery address, 176.65.139[.]204, sits in the same address block as a separate Android Debug Bridge botnet reported this spring. Could be coincidence. Could be shared bulletproof hosting. XLab is not calling it a direct link, but the overlap is worth noting.

RustDuck is not the first botnet to reach for Rust. Fortinet documented RustoBot in April 2025 doing much the same thing. The pattern is clear: botnet authors are adopting modern languages for the same reasons legitimate developers do, plus the anti-analysis benefits.

The fix here is not new. Get remote management off the public internet. Turn off Telnet, SSH, and Android Debug Bridge where they are not needed. Never leave them exposed with default passwords. Patch what you can. Replace what you cannot. The D-Link DIR-823X is past end-of-life. CISA says pull it from service. The Totolink maker never answered the disclosure.

RustDuck is small now, but the engineering is serious. The techniques it is testing, the Rust rewrite and the anti-analysis routine, are what other crews will borrow next.`,
  },
  {
    slug: "microsoft-record-570-patch-tuesday-july-2026",
    title: "Microsoft Patches a Record 570 Security Flaws",
    date: "2026-07-15",
    excerpt: "Microsoft released 570 patches for July's Patch Tuesday, nearly triple last month's record. Two zero-days are under active attack, including an AD FS privilege escalation flaw. AI is now finding bugs faster than humans can patch them.",
    category: "Hardening",
    readTime: "4 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "KrebsOnSecurity|https://krebsonsecurity.com/2026/07/microsoft-patches-a-record-570-security-flaws/",
    content: `Microsoft patched 570 vulnerabilities this month. That is almost three times June's Patch Tuesday, which was itself a record. 60 of the bugs are critical, meaning remote code execution with minimal user interaction.

Two zero-days are already being exploited.

CVE-2026-56155 is an elevation of privilege in Active Directory Federation Services. CVE-2026-56164 affects Microsoft SharePoint. Both allow an attacker to escalate their rights on a Windows system. CISA added the SharePoint bug to the KEV catalog on July 1.

Microsoft also fixed CVE-2026-50661, a BitLocker bypass that lets attackers with physical access read encrypted data. This one is publicly known but not yet seen in the wild.

Pavan Davuluri, Microsoft's Executive VP, posted last week that users should expect "a higher volume of security updates." The reason is AI. Microsoft is using AI to find bugs faster. So are attackers.

Satnam Narang at Tenable made the point directly: Microsoft's exploitability index is built for humans, not AI. Anthropic's Red Team tested their Mythos model on 14 vulnerabilities rated "Exploitation Less Likely" or "Exploitation Unlikely." It produced working exploits for 13 of them. Microsoft's SharePoint zero-day got a "less likely" rating. It is on the KEV list.

The Copilot vulnerability is worth noting separately. CVE-2026-48561 scores 9.6. An attacker hosts a malicious website. When a user visits it through Microsoft Edge for Android, the site sends crafted prompts to Copilot and executes code remotely. No authentication. No user consent beyond loading the page.

Adobe announced today they are moving to twice-monthly bulletins. They also cited AI for accelerating their patch cycles. Cisco, Mozilla, and Oracle are shipping updates more frequently too. Google's June patches exceeded 900 fixes.

The advice Microsoft gives at this volume is telling: back up your data, and maybe wait a few days before patching. Record patch counts mean record chances of stability issues. The fixes are necessary. The side effects are predictable.`,
  },
  {
    slug: "vibe-coding-security-shadow-builders-enterprise-playbook",
    title: "Vibe Coding Security: Enterprise Defense Against Shadow Builder Exposures [2026]",
    date: "2026-06-01",
    excerpt: "2,000+ publicly accessible vibe-coded applications holding sensitive corporate data. Shadow Builders are bypassing every security control you've built. This is the enterprise defense playbook for a problem most organizations haven't acknowledged exists yet.",
    category: "IAM",
    readTime: "10 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "Original|https://eddington.tech/blog/vibe-coding-security-shadow-builders-enterprise-playbook",
    content: `I have been tracking a problem that most security teams have not named yet. Shadow builders. Employees using AI coding tools to build production applications without going through normal development workflows. No security review. No architecture committee. No deployment pipeline. Just an AI agent, a cloud account, and a business problem someone wants solved by Friday.

The numbers are bigger than most organizations realize. Scanner data from April 2026 shows over 2,000 publicly accessible vibe-coded applications holding sensitive corporate data. These are not proof of concept projects. They are production systems handling PII, financial data, and authentication flows. Built by people who never wrote a line of code before 2023.

The attack surface is different from traditional shadow IT. A shadow builder does not just deploy an unauthorized SaaS tool. They create new infrastructure with its own vulnerabilities, data flows, and persistence mechanisms. Each application is a snowflake, built from AI-generated code the creator does not fully understand.

## What makes vibe-coded apps different

Traditional shadow IT involves buying tools. Vibe coding involves building them. The builder is not selecting from a catalog of known applications. They are prompting an AI to generate novel code, infrastructure configurations, and data pipelines. The result is unpredictable.

AI coding tools produce working code that often contains subtle security flaws. Hardcoded credentials. SQL injection vulnerabilities. Insecure deserialization. Missing authentication checks. The builder sees a working application and assumes it is correct. Security teams see an ungoverned deployment they never authorized.

The speed compounds the problem. A shadow builder can go from idea to deployed application in hours. Traditional security review cycles take weeks or months. By the time security knows an application exists, it is already handling production data.

## The three patterns of shadow building

I have observed three distinct patterns in how shadow builders operate.

First, the personal productivity application. A business analyst needs to process some data. They ask an AI to build a Python script, then a web interface, then add user authentication. Within a week they have built a customer data portal that never went through security review.

Second, the team collaboration tool. A project manager needs a dashboard for tracking deliverables. They vibe-code an application with database connections, file uploads, and user management. It becomes critical infrastructure for the team before IT knows it exists.

Third, the external-facing service. A sales team needs a quick customer portal. Someone with no security training builds a public-facing application handling authentication, payment processing, and PII storage. Deployed to a personal cloud account with company data.

Each pattern has different risk profiles but shares common characteristics: speed, opacity to security teams, and builder overconfidence in AI-generated code.

## Why traditional controls fail

Application security programs assume developers who understand what they are building. They assume code review, static analysis, and penetration testing as standard gates. Vibe-coded applications bypass all of these.

The builder is not trying to evade security controls. They do not know the controls exist. They are solving a business problem using new tools that make development accessible to non-developers. Security is not maliciously excluded; it is irrelevant to their mental model.

Data loss prevention tools struggle because the data movement is not through known channels. A vibe-coded application might extract data from a database, process it through AI services, and store results in personal cloud storage. Each step is invisible to traditional DLP.

Identity and access management is similarly challenged. These applications create their own user databases, authentication flows, and permission models. They do not integrate with corporate identity providers. They become new sources of credential sprawl and privilege accumulation.

## What actually works for defense

After analyzing dozens of shadow builder incidents, I have found four controls that actually help.

First, cloud cost monitoring. Shadow builders almost always use personal cloud accounts or free tiers. Unusual spending patterns in personal cloud subscriptions correlate strongly with shadow building activity. Monitor for employees with significant personal cloud billing.

Second, DNS and network monitoring. Vibe-coded applications often expose services on unusual ports or subdomains. Network scanning that looks for web services outside normal infrastructure blocks catches many of these before they handle sensitive data.

Third, data classification at rest. If data is properly classified and access controlled at the storage layer, vibe-coded applications cannot easily access what they should not. This requires robust data governance, which most organizations lack, but it is the most effective technical control.

Fourth, developer education that acknowledges reality. Do not tell shadow builders to stop using AI tools. Teach them what safe usage looks like. Provide sanctioned pathways for rapid application development that include basic security guardrails.

## The governance challenge

The hardest part is not technical. Shadow builders are not malicious. They are solving real business problems with tools that make development accessible. Security teams that treat them as threats alienate the business units that depend on their output.

Effective governance acknowledges the productivity benefits while establishing boundaries. Create an express lane for low-risk vibe-coded applications. Mandate security review for anything handling customer data, authentication, or financial transactions. Provide templates and patterns that have been pre-reviewed.

The goal is not to stop shadow building. It is to make shadow building safer without destroying the productivity that makes it attractive.

## What is coming next

AI coding capabilities are accelerating. Current shadow builders are using today's tools. Next year's tools will generate entire application stacks from natural language descriptions. The barrier to production application development is approaching zero.

Organizations that build governance frameworks now will handle this transition smoothly. Those that try to block or ignore shadow building will face an ungoverned landscape of AI-generated applications handling critical business functions.

The 2,000 publicly exposed vibe-coded applications found in April are just the visible edge of a much larger trend. Most shadow-built applications are internal, hidden behind VPNs and authentication, but they represent the same risk: production systems built without security review, maintained by people who did not write the code and cannot assess its security.

Security teams need new playbooks. Not because shadow builders are wrong, but because the old playbooks do not apply to a world where anyone can build production software.`,
  },
  {
    slug: "hugging-face-breach-malicious-dataset-supply-chain",
    title: "Hugging Face Breach: Malicious Dataset Used to Steal Cloud Credentials",
    date: "2026-06-04",
    excerpt: "The world's largest AI model repository was breached using a malicious dataset. Attackers exploited vulnerabilities in Hugging Face's dataset processing to gain code execution, then escalated to steal cloud credentials from internal infrastructure.",
    category: "Threat Intelligence",
    readTime: "4 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/06/hugging-face-breach-attackers-used.html",
    content: `Hugging Face disclosed a breach last week. Attackers used a malicious dataset to gain code execution on their infrastructure, then escalated to steal cloud credentials and access internal systems.

The entry point was the dataset loading system. Hugging Face's platform allows users to upload datasets for model training. The attackers crafted a dataset that exploited two separate vulnerabilities: a code execution path in the remote code loader and a template injection in the dataset configuration.

Once the dataset hit a processing worker, the attackers had a foothold. They collected cloud credentials, moved laterally across internal clusters, and maintained access for several days. The breach was discovered during routine monitoring, not by security tooling specifically looking for this attack pattern.

Hugging Face has since rebuilt compromised nodes, rotated credentials, and added stricter admission controls. They also added scanning for malicious dataset configurations before they reach processing workers.

The attack matters because Hugging Face is central infrastructure for AI development. Thousands of organizations depend on their model repository, dataset hosting, and inference APIs. A compromise there spreads downstream.

Supply chain attacks against AI infrastructure are particularly dangerous because the trust model assumes model and dataset integrity. Developers download pre-trained models and curated datasets expecting them to be safe. The infrastructure that produces and distributes those artifacts becomes a high-value target.

Defending against this requires treating AI infrastructure as critical supply chain. Scan datasets before processing. Isolate model training in hardened environments. Monitor for anomalous behavior during dataset loading. Assume that any data from external sources is potentially hostile.

The Hugging Face incident is not the first supply chain attack against AI infrastructure, and it will not be the last. As AI development centralizes around a few key platforms, those platforms become increasingly attractive targets.`,
  },
  {
    slug: "github-oauth-token-theft-vscode-webview",
    title: "GitHub OAuth Token Theft via VS Code Webview",
    date: "2026-06-03",
    excerpt: "Researchers found a way to steal GitHub OAuth tokens through VS Code extensions using webview panels. The attack bypasses GitHub's token binding and could give attackers persistent access to private repositories.",
    category: "IAM",
    readTime: "3 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "KrebsOnSecurity|https://krebsonsecurity.com/2026/06/github-oauth-token-theft-via-vs-code-webview/",
    content: `Researchers from Socket Security disclosed a vulnerability in how VS Code handles GitHub authentication that lets malicious extensions steal OAuth tokens. The attack is notable because it bypasses GitHub's token binding protections by exploiting how VS Code webviews handle authentication flows.

The vulnerability is in the webview panel system. VS Code extensions can create webview panels that load web content. When a webview initiates a GitHub OAuth flow, the authentication happens in the webview context, not the main VS Code window. The resulting token is accessible to the extension that created the webview.

This matters because GitHub's OAuth tokens are bound to specific applications and use cases. A token granted to a VS Code extension for repository access should not be accessible to arbitrary web content. The webview bridge breaks that boundary.

An attacker would need to get a victim to install a malicious extension. That is easier than it sounds. VS Code's extension marketplace has minimal security review. Extensions can update themselves without user intervention. A seemingly benign extension could add the webview exploitation in a later update.

Once the token is stolen, the attacker has persistent access to the victim's GitHub repositories. The token is valid until explicitly revoked, and most users do not review their authorized OAuth applications regularly.

GitHub acknowledged the issue and is working with Microsoft on a fix. In the meantime, users should be cautious about installing VS Code extensions, especially those that request GitHub authentication. Review your authorized OAuth applications and revoke access for anything you do not recognize.

The broader lesson is about trust boundaries in development tools. VS Code webviews are supposed to be isolated from extension code. This vulnerability shows that isolation is not complete, and authentication flows that cross those boundaries need additional scrutiny.`,
  },
  {
    slug: "miasma-worm-73-microsoft-github-repos",
    title: "Miasma Worm Infects 73 Microsoft GitHub Repositories",
    date: "2026-06-07",
    excerpt: "A self-spreading worm named Miasma infected 73 Microsoft GitHub repositories before being stopped. It exploited misconfigured GitHub Actions workflows to propagate across organizations and steal cloud credentials.",
    category: "Threat Intelligence",
    readTime: "3 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/06/miasma-worm-infected-73-microsoft.html",
    content: `Microsoft disclosed a self-spreading worm that infected 73 of their GitHub repositories before being detected and stopped. The worm, named Miasma by researchers, exploited misconfigured GitHub Actions workflows to propagate across repositories and exfiltrate cloud credentials.

The attack started with a compromised personal access token. That token had access to multiple repositories and triggered workflow runs. The malicious workflow modified repository code to include the worm payload, then committed those changes back to the repository.

When other repositories pulled the infected code, their workflows ran the payload. The worm collected environment variables and secrets, uploaded them to attacker-controlled infrastructure, then attempted to spread to any repositories the compromised token could access.

Microsoft detected the anomalous workflow runs through their security monitoring. The worm had been active for approximately six hours before detection. During that time, it spread to 73 repositories across multiple Microsoft GitHub organizations.

The incident response involved revoking the compromised token, removing the malicious commits, and scanning for any additional persistence mechanisms. Microsoft reports no evidence of further compromise beyond credential exposure.

The worm is interesting because it demonstrates how CI/CD systems can become propagation vectors. Each infected repository becomes a launch point for further infections. The blast radius depends on how permissive the initial compromise was.

Defending against this type of attack requires strict separation of CI/CD permissions. Workflows should not have write access to repository code. Personal access tokens should be scoped to the minimum necessary repositories. And runtime detection for anomalous workflow behavior is essential.

GitHub has since added new security features for Actions, including mandatory approval for workflows making repository changes from fork pull requests. But the core problem remains: CI/CD systems have powerful access, and when compromised, they can spread quickly.`,
  },
  {
    slug: "cisa-aws-credentials-exposed-github-enterprise",
    title: "CISA Contractor Leaked AWS Credentials in GitHub Enterprise Repository",
    date: "2026-06-17",
    excerpt: "A CISA contractor accidentally committed live AWS GovCloud credentials to a GitHub Enterprise repository. The credentials were exposed for six months and detected by GitGuardian's automated scanning, not internal security controls.",
    category: "Threat Intelligence",
    readTime: "4 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "KrebsOnSecurity|https://krebsonsecurity.com/2026/06/cisa-contractor-leaked-aws-credentials/",
    content: `A CISA contractor accidentally committed live AWS GovCloud credentials to a GitHub Enterprise repository six months ago. The exposure lasted from November 2025 until May 2026. GitGuardian's automated scanning found it, not CISA's internal security controls.

GitGuardian's scanner found it. Their systems sent nine automated alerts to the repository owner. All nine were ignored. On May 15, a GitGuardian researcher contacted KrebsOnSecurity for help escalating. CISA acknowledged the alert quickly. Then they took more than 48 hours to invalidate the exposed keys.

The postmortem CISA published this week is unusually honest about why. Their incident response playbook covered 'cybersecurity incidents' but not 'someone committed our keys to GitHub.' The notification went to the vulnerability disclosure platform, which is meant for product bugs, not infrastructure leaks. The AWS key rotation required coordination across federal and industry partners and took longer than it should have.

CISA is fixing the reporting channels. They are also advocating something I did not expect: continuous secrets scanning. Not quarterly audits. Continuous. Valadon from GitGuardian noted this is the first time a national cybersecurity agency has publicly pushed for both secrets scanning and clearer researcher communication.

The contractor had their access revoked. The keys are rotated. The logs show no evidence of unauthorized use. But the six-month window and the 48-hour response lag are the real story. If the country's lead cybersecurity agency can miss nine alerts and take two days to rotate compromised credentials, the rest of us need to look hard at our own detection and response times.

If you are running GitHub Enterprise: organization-level secret scanning should not be opt-out. Static AWS credentials should not exist in repositories at all. GovCloud supports IAM Roles Anywhere and OIDC federation. The tools to prevent this are available. CISA is now saying publicly that they should have been using them.`,
  },
  {
    slug: "memghost-ai-agent-memory-poisoning-attack",
    title: "MemGhost Attack Plants False Memories in AI Agents Through Email",
    date: "2026-07-19",
    excerpt: "Researchers demonstrated MemGhost, an attack that poisons AI agent memory through email. One malicious email can make an AI assistant permanently remember false facts about a user, changing how it responds in future sessions. The victim never knows it happened.",
    category: "IAM",
    readTime: "3 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/07/new-memghost-attack-plants-persistent.html",
    content: `Researchers at UC Santa Barbara and Stanford built a working exploit for something that should worry anyone using AI agents with memory. They call it MemGhost. One email can make an AI assistant store false information about you, permanently, with no indication anything happened.

The attack works because modern AI assistants have persistent memory. They remember things across conversations to personalize responses. The problem is where that memory comes from. Many agents can write to memory based on emails, chat messages, or documents they process.

MemGhost crafts emails that look ordinary but contain hidden instructions. When the AI processes the email, it extracts what looks like a legitimate fact and saves it to memory. The user sees a normal-looking response. The poisoned memory sits there waiting.

In their tests, the researchers used Claude, ChatGPT, and Gemini. All of them could be convinced to store false memories. The attack succeeded even when the malicious payload was buried in quoted text, image alt-text, or document metadata. One variant used ASCII art to hide the instruction from human eyes while the AI read it perfectly.

The real danger is persistence. Unlike a phishing email that gets deleted, a poisoned memory stays until manually cleared. The user has no way to know their AI is operating on false premises. Future conversations get subtly steered by the planted facts.

Defending against this is hard. The researchers suggest memory segmentation, strict input validation, and user confirmation before writes. None of these are standard in current AI agent implementations.

This is what happens when we give AI systems long-term memory without thinking through the trust boundaries. The attack surface is not the AI itself. It is every email, document, and message the AI can read.`,
  },
  {
    slug: "hugging-face-autonomous-ai-agent-breach",
    title: "Hugging Face Breached by an Autonomous AI Agent",
    date: "2026-07-20",
    excerpt: "The world's largest AI model repository was compromised by an autonomous AI agent system. The attackers used a malicious dataset to gain code execution, then deployed LLM-powered agents that executed thousands of actions across sandboxes with self-migrating C2 infrastructure.",
    category: "Threat Intelligence",
    readTime: "4 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/07/worlds-largest-ai-model-repository.html",
    content: `Hugging Face disclosed a breach last week. The attackers were not human. They were autonomous AI agents.

The company admitted what security folks have been waiting for: LLM-powered agents are now being used operationally against production infrastructure. Not as tools. As the primary threat actors.

The entry point was a malicious dataset. Hugging Face's platform allows users to upload datasets for model training. The attackers uploaded one that exploited two separate code execution paths: the remote code dataset loader and a template injection in the dataset configuration. Classic supply chain vector, but aimed at the infrastructure that powers modern AI development.

Once the dataset hit a processing worker, the agents took over. They collected cloud credentials, escalated to node-level access, and moved laterally across internal clusters over a weekend. The campaign ran across a swarm of short-lived sandboxes with self-migrating command-and-control staged on public services.

Hugging Face says the agents performed thousands of individual actions. Not scripted. Not predetermined. The swarm adapted, moved, and persisted without human intervention at each step.

The company has since rebuilt compromised nodes, rotated credentials, and added stricter admission controls. They also disclosed something telling about the forensic analysis.

Western frontier models refused to help. When Hugging Face tried to use them for incident response, the guardrails triggered. The models would not process real attack commands, exploit payloads, or C2 artifacts. They could not distinguish between a defender analyzing an attack and an attacker executing one.

So Hugging Face turned to Z.ai's GLM 5.2, a Chinese open-weight model they could run themselves. No usage policy. No guardrails blocking legitimate work. Just the ability to actually do the job.

That is the lesson here. Attackers building autonomous agents are not restricted by terms of service. They are not using hosted APIs with safety filters. They are running open weights on infrastructure they control. Meanwhile defenders trying to use commercial AI for incident response hit walls designed to prevent misuse.

Hugging Face put it directly: have a capable model you can run on your own infrastructure vetted and ready before an incident. Both to avoid guardrail lockout and to keep attacker data from leaving your environment.

The breach accessed internal datasets and service credentials. Hugging Face found no evidence that public models, user datasets, or Spaces were tampered with. The supply chain appears intact. But the precedent is set.

This is the first major disclosure of an autonomous AI agent attack against critical infrastructure. It will not be the last.`,
  },
  {
    slug: "hollowgraph-malware-m365-calendar-c2",
    title: "HollowGraph Malware Hides C2 and Stolen Files in Microsoft 365 Events Dated 2050",
    date: "2026-07-21",
    excerpt: "A new espionage implant uses Microsoft 365 calendar events dated 2050 as a command channel. HollowGraph hides operator instructions and exfiltrates stolen data through legitimate Graph API traffic, making it invisible to network controls.",
    category: "Threat Intelligence",
    readTime: "3 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/07/hollowgraph-malware-hides-c2-and-stolen.html",
    content: `Group-IB found a .NET implant that treats a Microsoft 365 calendar as its command channel. It is called HollowGraph, and it is smarter than most malware about hiding in plain sight.

The implant does not reach out to attacker infrastructure. It reads tasking from calendar events and writes stolen data back to the same place. Both use the legitimate Microsoft Graph API, so the traffic looks like ordinary Microsoft 365 activity.

Here is how it works. HollowGraph queries the compromised mailbox's calendar for an event buried at 2050-05-13. That date is far enough out that no human is likely to scroll to it. The event holds an attached file with encrypted instructions. The malware reads the attachment, decrypts it with hybrid RSA and AES-256, and executes the commands.

To exfiltrate, it does the reverse. It encrypts the stolen file, creates its own calendar event at a far-future date, and uploads the data as attachments. Everything is wrapped in the same encryption scheme, with separate key pairs for incoming and outgoing traffic.

The C2 channel is not the only clever part. HollowGraph also maintains its Entra ID credentials over DNS. It queries attacker-controlled AAAA records from cloudlanecdn.com, decodes the IPv6 responses into tenant ID, client ID, client secret, and target mailbox, then writes them to a file called logAzure.txt disguised as routine logging. That channel runs in the clear, unlike the encrypted calendar traffic.

Group-IB links HollowGraph to Cavern with high confidence. Cavern is a modular backdoor framework Check Point documented earlier this month and tied to an Iranian Ministry of Intelligence-linked actor they call Cavern Manticore. The command syntax and internal tasking match. Group-IB will not name the operator behind this specific campaign, noting only a low-confidence overlap with Lyceum, an Iranian subgroup.

The victim geography is notable. The compromised exfiltration mailbox belongs to an Israeli organization. The implant was found on about twelve machines, with only three actively communicating during the analysis window. Activity ran from June 3 to July 9, 2026. Group-IB reads this as targeted espionage, not opportunistic crime.

There is no Microsoft vulnerability to patch here. HollowGraph rides legitimate Graph API functionality using compromised credentials. The work is on detection and identity hygiene, not patching.

Detection starts with the calendar itself. Hunt for events with far-future dates, bare GUID subjects, or attachments named File{n}.txt. On the identity side, restrict OAuth app permissions to Graph, audit client credential grants, and alert on new client secrets. Watch for application-driven calendar changes rather than user actions, and monitor DNS for high-entropy AAAA queries to suspicious domains.

Hiding C2 in trusted Microsoft services is not new. Attackers have used Outlook inboxes, draft folders, and OneDrive before. Events parked in 2050 are just the latest place defenders had no reason to look.`,
  },
  {
    slug: "azure-devops-mcp-flaw-prompt-injection",
    title: "Azure DevOps MCP Flaw Lets Hidden PR Comments Hijack AI Review Agents",
    date: "2026-07-22",
    excerpt: "A single invisible HTML comment in an Azure DevOps pull request can hijack a reviewer's AI coding agent, driving it into projects the attacker cannot access and leaking source code, secrets, and work items. Microsoft's official MCP server missed a guardrail.",
    category: "IAM",
    readTime: "4 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/07/microsoft-azure-devops-mcp-flaw-lets.html",
    content: `Manifold Security found a confused-deputy bug in Microsoft's official Azure DevOps MCP server. A hidden HTML comment in a pull request description can hijack the AI agent of whoever reviews it.

The attack works because PR descriptions accept Markdown, which allows HTML comments. A reviewer scrolling the description sees nothing. The REST API returns the comment verbatim. When the agent reads the PR, it gets the hidden instructions too.

This splits what the human sees from what the model receives. The attacker never talks to the agent. They plant text in content they know it will read.

Microsoft already shipped a defense for this. They use spotlighting, wrapping untrusted content in delimiters so the model can tell data from instructions. They added it in PR #1062 for wiki pages and build logs.

The tool that returns pull requests never calls that helper. It hands back descriptions raw. That is the gap.

Manifold's proof of concept runs like this: a contributor opens a normal-looking PR with a hidden comment carrying the payload. When the reviewer asks their agent to review it, the hidden text rewrites the agent's goal. The agent carries the reviewer's credentials, so it can reach projects the attacker cannot.

In the demo, the agent triggers a pipeline in a different project, reads a confidential wiki page, and posts that page back as a comment where the attacker can read it. Every call was one the agent was allowed to make. The problem was the sequence and intent, driven by text the human never saw.

It worked with both Copilot CLI and Claude Code. The chain needs write access to a project, a reviewer with higher privileges, and an agent cleared to run tools without asking. The demo used auto-approve with no per-tool prompts.

Simon Willison calls this pattern the lethal trifecta: an agent with access to private data, exposure to untrusted content, and a way to send data out. Any agent with all three can be turned by one piece of text. Most useful agents have all three.

Microsoft thanked Manifold for the disclosure and called it "a known class of AI risk." They did not say whether they will fix the code or assign a CVE. As of July 21, the current source still lacks the guardrail on the PR tool.

The defenses are familiar. Give agents least-privilege tokens scoped to the project under review. Load only the MCP domains the task needs. Keep pipeline runs and wiki reads out of code-review tool sets that have no use for them.

To check whether this already happened, look in agent tool traces for cross-project pipeline runs or wiki reads during reviews. Scan open PR descriptions for hidden HTML comments. A human reviewer who cannot see the payload is not a control.

The guardrail only works where someone remembers to add it. The defense is only as strong as its least-covered path, and a missing wrapper on one function is close to invisible from outside. On a growing tool surface, gaps like this open faster than anyone audits them.`,
  },
];

export const postSlugs = posts.map((post) => post.slug);
