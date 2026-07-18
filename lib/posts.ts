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
    category: "Hardening",
    readTime: "15 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    content: `## The Friday Afternoon Discovery That Should Worry Your CISO

It was 4:47 PM on a Friday when my phone rang. Not Slack, not email. An actual phone call from our Head of Security Operations. I knew before I answered that something had gone very wrong.

"We've got 47 applications running on Replit and Retool," he said. "All connected to production systems. Most have no authentication. One has admin access to our Snowflake instance. And none of them are in our asset inventory."

This wasn't a breach. Not exactly. This was worse — a fundamental blindspot in how we understood our attack surface.

A marketing manager had built a campaign performance dashboard using an AI coding platform. She'd connected it to our BI tools to pull real-time numbers for Monday's executive review. It worked beautifully. She shared the link with her team. Then her team shared it with their managers. Within three weeks, that dashboard — hosted on a subdomain of a vibe coding platform, with no authentication enabled by default — contained direct API access to our customer data warehouse.

She wasn't being careless. She was being efficient. The AI development platform told her it was production-ready. She shipped it before the IT ticket she submitted six weeks earlier had even been assigned.

This is the Shadow Builder problem. While security teams have been wrestling with Shadow IT — unsanctioned SaaS applications purchased on corporate cards — a new category has emerged that's more dangerous because it bypasses every control we've built: Shadow Builders are employees creating production applications using AI-driven development platforms, connecting them to sanctioned enterprise systems, and publishing them to the open internet.

The Red Access investigation published this week found 380,000 publicly accessible web assets across leading vibe-coding platforms. Over 2,000 of those held sensitive corporate, operational, or personal data — deployed without basic access controls, often granting admin access by default to anyone who reached the URL.

This guide is what I wish existed three months ago. It's the enterprise defense playbook for a problem most organizations haven't acknowledged exists yet.

---

## What Vibe Coding Actually Is and Why Security Teams Need to Care

**Vibe coding** refers to platforms that allow non-developers to build functioning applications by describing what they want in natural language. The AI handles the implementation. The user handles the requirements.

The most prominent platforms include:
- **Replit** — Full-stack development with AI assistance and instant deployment
- **Retool** — Internal tools built against production databases
- **Lovable** — Natural language to full applications
- **v0 by Vercel** — UI generation with deployment
- **Claude Artifacts** — Interactive applications from conversation

**What makes this different from Shadow IT:**

Traditional Shadow IT involved purchasing existing SaaS applications — Trello boards, personal Dropbox accounts, unsanctioned Slack workspaces. The vendor was responsible for security. The exposure was bounded by the vendor's infrastructure.

Vibe-coded applications invert that model:
- **Custom-built**, not purchased — The application is bespoke to the organization's specific workflow
- **No vendor security boundary** — The platform provides hosting, but the application logic is user-defined
- **Direct integrations** — OAuth connections to production CRMs, ERPs, ticketing systems, and BI platforms
- **Unmanaged lifecycle** — No CI/CD security scanning, no code review, no deployment checklist
- **Public by default** — Many platforms publish applications to the web with minimal or no authentication

**The threat model shift:**

Traditional application security assumes code review, security scanning, and approved deployment pipelines. Vibe-coded applications bypass all of these. The builder is often a non-technical employee with legitimate business needs and no security training. The platform is "approved" for collaboration or development. The resulting application is a production system processing corporate data, but it exists entirely outside your security governance.

---

## Real Attack Scenarios: From Vibe-Coded App to Data Breach

The Red Access findings aren't hypothetical. Here are the specific exposure patterns they documented:

### Scenario 1: The Publicly Accessible BI Dashboard

**What happened:** A finance team built an executive reporting dashboard using a vibe-coding platform. They connected it to Snowflake using service account credentials. The platform generated a public URL — no authentication required by default. The dashboard exposed:
- Real-time revenue figures
- Customer churn metrics
- Sales pipeline data by region

**The exposure:** Anyone with the URL could access confidential financial data. The URL followed a predictable pattern and was indexed by search engines.

### Scenario 2: The Admin-Backdoored Support Tool

**What happened:** A customer support manager built an internal tool to lookup customer accounts by email. The vibe platform defaulted to admin access for "ease of use." The deployed application had:
- Full read/write access to the production customer database
- No audit logging
- No rate limiting
- Publicly accessible from any IP address

**The exposure:** An attacker discovering the URL could enumerate customer accounts, export the entire database, or modify records without detection.

### Scenario 3: The OAuth Token Harvesting Trap

**What happened:** Multiple employees built apps that requested OAuth scopes from Google Workspace, Salesforce, and Slack. The OAuth grants were made to user accounts, not service accounts. When those employees left the company:
- Their OAuth tokens remained valid
- The vibe-coded applications continued running
- No offboarding process existed to revoke these specific grants

**The exposure:** Former employees' OAuth tokens provided ongoing access to corporate systems, completely invisible to IT's standard offboarding procedures.

---

## Why Your Existing Security Stack Can't See This

The reflex of most security teams is to check the tools they already have. Here's why each category fails to detect vibe-coded applications:

### EDR (Endpoint Detection and Response)

EDR monitors browser activity at the process level. To an endpoint agent, using Replit or Retool looks identical to reading documentation or checking email. The telemetry shows "user accessed replit.com" — not "user deployed production application with database credentials and published it publicly."

**The gap:** EDR doesn't understand application-as-threat. It sees the browser, not what the user built inside it.

### DLP (Data Loss Prevention)

DLP tools monitor for sensitive data leaving through known channels — email attachments, USB drives, unsanctioned cloud storage. They can flag when users paste regulated data into ChatGPT.

**The gap:** Vibe-coded applications don't "leak" data through enumerated channels. The data moves through OAuth APIs, cloud-to-cloud, physically bypassing the endpoint. DLP sees the traffic to salesforce.com — it doesn't know a vibe-coded app is orchestrating automated data extraction.

### CASB (Cloud Access Security Broker)

CASB was built for Shadow IT — identifying unsanctioned SaaS vendors. It can discover that employees are using Retool.

**The gap:** CASB treats Replit, Retool, or Lovable as a single SaaS entity. It can't distinguish between "employee viewed documentation" and "employee deployed production application at public URL." The entire population of custom applications on these subdomains appears as one approved vendor.

### Firewall / SSE (Secure Service Edge)

Firewall and SSE solutions see traffic to platform domains but lack application-level context. They can block replit.com entirely (breaking legitimate use cases) or allow it entirely (missing the risk).

**The gap:** No granularity between platform usage and application deployment. The security control is at the wrong layer.

### SASE (Secure Access Service Edge)

Most SASE deployments only cover managed devices. Personal laptops, contractor machines, BYOD devices, and personal browser sessions are invisible.

**The gap:** Shadow Builders frequently work from personal devices or personal browser profiles. Even comprehensive SASE deployments leave gaps where this activity happens.

**The fundamental problem:** Every step of vibe-coding — the build, the OAuth grant, the data integration, the deployment — happens at the session layer, not at the network, endpoint, or application layers where traditional tools operate.

---

## Step-by-Step: Securing Your Enterprise Against Shadow Builder Risks

### Phase 1: Discovery and Inventory

**Step 1.1: Survey Employees Directly**

The most effective first step is often the most overlooked: ask.

\`\`\`
# Example: Send targeted survey via Slack/Email
cat << 'EOF'
Subject: Quick Survey: AI Development Tools

We're inventorying applications built using AI development platforms
(Replit, Retool, Lovable, etc.) to ensure proper security review.

If you've built any applications for work purposes using these tools,
please reply with:
1. Platform used
2. What systems it connects to (if any)
3. Whether it has a public URL
4. What data it processes

This is NOT an audit. We're building an inventory to ensure proper
protections are in place.
EOF
\`\`\`

**Why this works:** Most Shadow Builders aren't hiding anything. They're doing useful work and would welcome security guidance if it's framed as partnership, not punishment.

**Step 1.2: OAuth Grant Audit**

OAuth connections from user accounts to vibe-coding platforms are a key indicator:

\`\`\`bash
# Google Workspace: List OAuth grants by users
gcloud identity groups memberships search-transitive-memberships \\
  --group-member="groups/all-employees@company.com" \\
  --format="value(memberKey.id)" | \\
  while read user; do
    gam user $user show tokens | grep -E "(Replit|Retool|Lovable|v0)"
  done

# Microsoft 365: Audit app consent grants
Connect-MgGraph -Scopes "Directory.Read.All"
Get-MgOAuth2PermissionGrant | 
  Where-Object { $_.ClientId -in @("Replit","Retool") } | 
  Select-Object PrincipalId, ClientId, Scope

# Salesforce: Connected app audit
sfdx force:limits:api:display -u prod
# Then check Setup > Manage Apps > Connected Apps OAuth Usage
\`\`\`

**Step 1.3: Network Log Analysis**

Look for patterns that indicate deployed applications, not just platform usage:

\`\`\`
# Splunk query to identify potential vibe-coded app traffic
index=web sourcetype=access_combined
| eval subdomain = mvindex(split(cs_host, "."), 0)
| where match(cs_host, "(replit\\.dev|retool\\.com|lovable\\.app|vercel\\.app)")
| eval is_api_call = if(match(cs_uri, "/(api|graphql|data)"), 1, 0)
| stats count, dc(user) as unique_users, 
        sum(is_api_call) as api_calls by cs_host, subdomain
| where count > 100 OR api_calls > 10
| sort -count
\`\`\`

**Step 1.4: Create Application Inventory**

\`\`\`python
# shadow_inventory.py
#!/usr/bin/env python3
"""Shadow Builder Application Inventory"""
import json
from datetime import datetime

VIBE_PLATFORMS = [
    "replit.com", "replit.dev",
    "retool.com",
    "lovable.app",
    "v0.dev", "vercel.app",
    "bolt.new"
]

def discover_from_oauth_logs(log_file):
    """Parse OAuth logs to discover vibe-coded apps"""
    apps = []
    with open(log_file) as f:
        for line in f:
            entry = json.loads(line)
            if any(platform in entry.get('client_id', '') 
                   for platform in VIBE_PLATFORMS):
                apps.append({
                    'platform': entry['client_id'],
                    'owner': entry['user'],
                    'scopes': entry.get('scopes', []),
                    'discovered': datetime.now().isoformat(),
                    'risk_level': assess_risk(entry)
                })
    return apps

def assess_risk(app_entry):
    """Assess risk level based on scopes and permissions"""
    sensitive_scopes = ['admin', 'write', 'full_access', 'delete']
    if any(s in str(app_entry.get('scopes', [])) for s in sensitive_scopes):
        return 'high'
    return 'medium'

# Main execution
if __name__ == "__main__":
    discovered = discover_from_oauth_logs('/var/log/oauth/audit.json')
    print(json.dumps(discovered, indent=2))
\`\`\`

### Phase 2: Risk Assessment and Policy

**Step 2.1: Categorize Discovered Applications**

Create a risk matrix based on:
- **Data sensitivity** (Public, Internal, Confidential, Restricted)
- **Integration depth** (Read-only vs. Read/Write, Number of systems)
- **Authentication state** (Public, Unauthenticated, Authenticated)
- **Exposure scope** (Internal URL vs. Public URL)

**Step 2.2: Implement Platform Policies**

\`\`\`yaml
# security-policy-vibe-coding.yaml
vibe_coding_policy:
  approved_platforms:
    - name: "Internal Retool Instance"
      url: "retool.company.internal"
      requires_auth: true
      data_classification: "Internal"
      
    - name: "Enterprise Replit"
      url: "replit.com"
      restrictions:
        - "No production database connections"
        - "Authentication required for all apps"
        - "Security review required for OAuth grants"
        
  prohibited_patterns:
    - "Public URLs for Confidential/Restricted data"
    - "Service account credentials in user-created apps"
    - "Production database write access without approval"
    - "OAuth scopes beyond read-only without review"
    
  data_classification_requirements:
    Public:
      - "Authentication: Optional"
      - "Review: Annual"
    Internal:
      - "Authentication: Required"
      - "Review: Quarterly"
      - "DLP: Enabled"
    Confidential:
      - "Authentication: SSO Required"
      - "Review: Monthly"
      - "Access Logging: Required"
      - "Approval: Security Team"
    Restricted:
      - "Policy: Prohibited without exception"
      - "Exception Process: CISO approval required"
\`\`\`

**Step 2.3: Implement OAuth Grant Review**

\`\`\`python
#!/usr/bin/env python3
# oauth_grant_monitor.py
"""Monitor and review OAuth grants to vibe-coding platforms"""
import json
from datetime import datetime, timedelta

VIBE_PLATFORMS = [
    "replit.com",
    "retool.com",
    "lovable.app",
    "v0.dev",
    "bolt.new"
]

SENSITIVE_SCOPES = [
    "admin.directory.user",
    "gmail.readonly",
    "drive.readonly",
    "salesforce:full_access",
    "slack:read:channels",
    "github:repo",
    "snowflake:accountadmin"
]

def assess_oauth_grant(grant):
    """Assess risk of an OAuth grant"""
    risk_score = 0
    risk_factors = []
    
    # Platform risk
    if any(platform in grant['client_id'] for platform in VIBE_PLATFORMS):
        risk_score += 30
        risk_factors.append("Vibe coding platform")
    
    # Scope risk
    for scope in grant.get('scopes', []):
        if any(sensitive in scope for sensitive in SENSITIVE_SCOPES):
            risk_score += 20
            risk_factors.append(f"Sensitive scope: {scope}")
    
    # Data classification risk
    if grant.get('data_classification') in ['Confidential', 'Restricted']:
        risk_score += 25
        risk_factors.append("High sensitivity data")
    
    return {
        'user': grant['user'],
        'platform': grant['client_id'],
        'risk_score': risk_score,
        'risk_factors': risk_factors,
        'action': 'REVIEW' if risk_score > 50 else 'MONITOR'
    }

def main():
    # Example: Fetch from Google Workspace API
    # grants = fetch_google_oauth_grants()
    
    test_grant = {
        'user': 'marketing.user@company.com',
        'client_id': 'replit.com',
        'scopes': ['drive.readonly'],
        'data_classification': 'Internal'
    }
    result = assess_oauth_grant(test_grant)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
\`\`\`

### Phase 3: Continuous Monitoring

**Step 3.1: Deploy Shadow Builder Detection**

\`\`\`yaml
# detection-shadow-builder.yml
# Detection rules for Shadow Builder activity

alert_shadow_builder_oauth:
  name: "Shadow Builder OAuth Grant Detected"
  description: "User granted OAuth access to known vibe-coding platform"
  severity: "medium"
  source: oauth_logs
  query: |
    SELECT 
      user,
      client_id,
      scopes,
      timestamp
    FROM oauth_grants
    WHERE client_id IN (
      'replit', 'retool', 'lovable', 'v0', 'bolt'
    )
    AND timestamp > now() - interval '1 hour'
  action: 
    - notify: security-team@company.com
    - create_ticket: "Shadow Builder OAuth Grant Review"

alert_vibe_data_exfil:
  name: "Data Transfer to Vibe-Coding Platform"
  description: "Large data transfer detected to vibe-coding platform"
  severity: "high"
  source: proxy_logs
  query: |
    SELECT
      user,
      domain,
      SUM(bytes_out) / 1024 / 1024 as mb_transferred,
      COUNT(DISTINCT dst_ip) as destinations
    FROM web_access
    WHERE domain LIKE '%replit.dev%'
       OR domain LIKE '%retool%'
       OR domain LIKE '%lovable.app%'
    GROUP BY user, domain
    HAVING mb_transferred > 100
  action:
    - notify: security-team@company.com
    - alert: soc@company.com
\`\`\`

**Step 3.2: Monitor for Public Exposures**

\`\`\`bash
#!/bin/bash
# check_public_exposure.sh
# Script to check if shadow apps are publicly accessible

KNOWN_VIBE_DOMAINS=(
    "replit.dev"
    "retool.com"
    "lovable.app"
    "vercel.app"
    "bolt.new"
)

check_url() {
    local url=$1
    local response=$(curl -s -o /dev/null -w "%{http_code},%{redirect_url}" \\
                     -H "User-Agent: Mozilla/5.0 Security-Check/1.0" \\
                     --max-time 10 "$url")
    
    local code=$(echo $response | cut -d',' -f1)
    local redirect=$(echo $response | cut -d',' -f2)
    
    if [ "$code" = "200" ]; then
        # Check for auth indicators
        local content=$(curl -s --max-time 10 "$url")
        if echo "$content" | grep -qiE "(login|sign in|authentication|unauthorized)"; then
            echo "$url: ACCESSIBLE (Auth Required)"
        else
            echo "$url: ⚠️ UNPROTECTED (No Auth Detected)"
        fi
    elif [ "$code" = "401" ] || [ "$code" = "403" ]; then
        echo "$url: Protected (Requires Auth)"
    else
        echo "$url: HTTP $code"
    fi
}

# Check discovered applications
for domain in "\${KNOWN_VIBE_DOMAINS[@]}"; do
    echo "Checking domain: $domain"
done
\`\`\`

---

## Detection Rules and Monitoring for Shadow Builder Activity

### Splunk Detection Queries

**OAuth Grant Detection:**

\`\`\`
index=oauth sourcetype=google:workspace:token
| eval platform = case(
    match(client_id, "replit"), "Replit",
    match(client_id, "retool"), "Retool",
    match(client_id, "lovable"), "Lovable",
    match(client_id, "(v0|vercel)"), "Vercel v0",
    true(), "Other"
)
| where isnotnull(platform) AND platform != "Other"
| stats count by user, platform, scope, _time
| eval severity = if(match(scope, "(admin|write|full)"), "high", "medium")
| sort -_time
\`\`\`

**Data Exfiltration Monitoring:**

\`\`\`
index=web sourcetype=web:proxy
| eval platform = case(
    match(url, "replit\\.dev"), "Replit",
    match(url, "retool\\.com"), "Retool",
    match(url, "lovable\\.app"), "Lovable",
    true(), null()
)
| where isnotnull(platform)
| eval data_volume_mb = bytes_out/1024/1024
| stats sum(data_volume_mb) as total_mb, 
        dc(dest_ip) as unique_destinations 
        by user, platform
| where total_mb > 100
| sort -total_mb
\`\`\`

**Unusual Time Access:**

\`\`\`
index=web sourcetype=access_combined
| where match(cs_host, "(replit\\.dev|retool\\.com|lovable\\.app)")
| eval hour = tonumber(strftime(_time, "%H"))
| where hour < 6 OR hour > 22
| stats count by user, cs_host, hour
| where count > 10
| sort -count
\`\`\`

---

## The Incident Response Playbook: When You Discover a Shadow Application

### Immediate Response (First 30 Minutes)

**Step 1: Assess Exposure**

\`\`\`bash
#!/bin/bash
# assess_shadow_app.sh - Emergency exposure assessment

APP_URL="$1"
echo "=== SHADOW APP EXPOSURE ASSESSMENT ==="
echo "Target: $APP_URL"
echo "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo ""

# Test public accessibility
echo "[+] Testing public accessibility..."
curl -s -o /tmp/app-content.html -w "HTTP Status: %{http_code}\\n" \\
     -H "User-Agent: Mozilla/5.0 (Neutral)" \\
     --max-time 15 "$APP_URL" 2>/dev/null

# Check for authentication
echo ""
echo "[+] Checking authentication indicators..."
if grep -qiE "(login|sign.in|authenticate|password)" /tmp/app-content.html; then
    echo "  ✓ Authentication appears required"
else
    echo "  ⚠️  No authentication indicators found"
fi

# Check for sensitive data indicators
echo ""
echo "[+] Scanning for sensitive data indicators..."
SENSITIVE_PATTERNS=("revenue" "customer" "ssn" "password" "confidential")
found=0
for pattern in "\${SENSITIVE_PATTERNS[@]}"; do
    if grep -q "$pattern" /tmp/app-content.html; then
        echo "  ⚠️  Found: potential '$pattern' data"
        found=1
    fi
done
[ $found -eq 0 ] && echo "  ✓ No obvious sensitive keywords found"

# Check robots.txt
echo ""
echo "[+] Checking robots.txt..."
curl -s --max-time 10 "$APP_URL/robots.txt" 2>/dev/null || echo "  No robots.txt"

# Cleanup
rm -f /tmp/app-content.html
\`\`\`

**Step 2: Identify Connected Systems**

Critical interview questions for the app builder:
- Which systems does it connect to?
- What credentials/OAuth tokens were used?
- Who has the URL?
- Was it indexed by search engines?
- Has it been shared externally?

**Step 3: Contain the Exposure**

Options based on criticality:
- **Emergency:** Request platform takedown
- **Short-term:** Enable authentication if supported
- **Medium-term:** Implement API rate limiting
- **Long-term:** Migrate to sanctioned infrastructure

**Step 4: Preserve Evidence**

\`\`\`bash
#!/bin/bash
# preserve_evidence.sh

INCIDENT_DIR="/var/log/security/incidents/$(date +%Y%m%d-%H%M%S)-shadow-app"
mkdir -p "$INCIDENT_DIR"

echo "Preserving evidence to: $INCIDENT_DIR"

# Capture application content
curl -s "$APP_URL" > "$INCIDENT_DIR/app-content.html" 2>/dev/null

# Screenshot (if headless browser available)
# chromium --headless --screenshot="$INCIDENT_DIR/screenshot.png" "$APP_URL"

# Document network flows
dig +short "$APP_URL" > "$INCIDENT_DIR/dns-resolution.txt"

# Capture OAuth grants (if available)
# gam user "$BUILDER" show tokens > "$INCIDENT_DIR/oauth-grants.txt"

# Create incident summary
cat > "$INCIDENT_DIR/incident-summary.txt" << EOF
Shadow Application Incident Report
================================
Discovered: $(date)
URL: $APP_URL
Builder: $BUILDER
Connected Systems: $SYSTEMS
OAuth Scopes: $SCOPES
Initial Risk Assessment: $RISK

Actions Taken:
- [ ] Confirmed exposure level
- [ ] Identified connected systems
- [ ] Revoked/credential rotation initiated
- [ ] Platform contacted (if needed)
- [ ] Stakeholders notified
EOF

echo "Evidence preserved. Summary: $INCIDENT_DIR/incident-summary.txt"
\`\`\`

### Credential Rotation Checklist

If the application had access to production systems:

- [ ] Rotate any service account credentials used by the app
- [ ] Revoke OAuth grants for the specific application
- [ ] Audit access logs for connected systems (past 90 days)
- [ ] Check for data exfiltration indicators
- [ ] Force re-authentication for affected user accounts
- [ ] Review and revoke any shared tokens or API keys
- [ ] Scan dark web for credential leaks (if available)

### Post-Incident Actions

1. **Document the finding** — Add to Shadow Builder inventory
2. **Brief, non-punitive education** — Help the builder understand the risks
3. **Policy update** — If a gap was exposed, close it
4. **Share anonymized learnings** — Prevent recurrence across the organization
5. **Review offboarding procedures** — Ensure OAuth grants are revoked with employment

---

## Related Reading

This playbook builds on existing Eddington.Tech coverage of supply chain and developer security:

- [Node.js Supply Chain Security: Developer Workstation Protection](/blog/nodejs-supply-chain-security-developer-workstation-protection) — Supply chain hardening for development environments
- [Developer Workstation Security: Complete IAM Hardening Playbook](/blog/developer-workstation-security-complete-iam-hardening-playbook) — Foundational security for dev environments  
- [CISA AWS GovCloud GitHub Credentials Leaked](/blog/cisa-aws-govcloud-github-credentials-leaked) — What happens when credential management fails
- [npm 2FA Staged Publishing Supply Chain](/blog/npm-2fa-staged-publishing-supply-chain) — Modern supply chain protections
- [Ghost CMS CVE-2026-26980 ClickFix Attacks](/blog/ghost-cms-cve-2026-26980-clickfix-attacks) — Public application exploitation patterns

These posts form a comprehensive defense-in-depth strategy covering developer security, supply chain protection, application hardening, and now Shadow Builder governance.

---

**About Hunter Eddington**  
IAM Engineer and System Hardening specialist. Daily notes on security architecture, identity systems, supply chain security, and emerging threats at [Eddington.Tech](/).

**[Subscribe to RSS →](/feed.xml)**
`,
  },
  {
    slug: "marimo-cve-2026-39987-llm-agent-post-exploitation",
    title: "Attackers Use LLM Agent for Post-Exploitation After Marimo CVE-2026-39987 Exploit",
    date: "2026-05-30",
    excerpt: "A threat actor used an LLM agent to conduct post-exploitation after compromising a Marimo notebook via CVE-2026-39987. The end-to-end attack chain lasted just over an hour, with the attacker exfiltrating a full PostgreSQL database in under two minutes.",
    category: "Threat Intelligence",
    readTime: "3 min",
    author: "Hunter Eddington",
    source: "The Hacker News|https://thehackernews.com/2026/05/attackers-use-llm-agent-for-post.html",
    image: "https://eddington.tech/og-image.png",
    content: `Sysdig caught an attack last month that I have been thinking about. On May 10, a threat actor compromised a publicly accessible Marimo notebook using CVE-2026-39987. This is a pre-auth RCE that affects all Marimo versions up through 0.20.4. Patches dropped in 0.23.0.

The initial access is not the interesting part. The post-exploitation is.

The attacker extracted cloud credentials from the compromised host, replayed them through a fanned-out egress pool, and hit AWS Secrets Manager. They retrieved an SSH private key and pivoted to a bastion server. Eight parallel SSH sessions later, they had exfiltrated the full schema and contents of an internal PostgreSQL database. Total time from initial compromise to data exfiltration: just over an hour. The database extraction took under two minutes.

Sysdig identified four indicators that point to an LLM agent driving the attack.

First, the attacker improvised a database dump without any prior knowledge of the schema. The database hostname was opaque, with no application identifier on disk and no pre-staged schema dump. Yet they landed on the credential table within minutes.

Second, a Chinese-language comment leaked directly into the command stream: "看还能做什么" translates to "See what else we can do." This is the kind of artifact that shows up when an LLM agent is composing commands in real time.

Third, every command was designed for machine consumption. Commands were separated by "---" delimiters. Output was bounded. The "less" command was disabled. stderr was discarded to minimize noise. These are choices you make when you are optimizing for tool parsing, not human readability.

Fourth, value handoffs came from prior tool output. The attacker ran "ls -la ~/.ssh/id_ed25519*" to confirm the key existed before running "cat ~/.ssh/id_ed25519" to extract it. This is tool chaining. The output of one command becomes the input confirmation for the next.

The attackers never saw this environment before they were inside it. They did not spend weeks crafting playbooks for this specific target. They landed on an internet-facing Marimo instance and an LLM agent composed the attack chain live. The constraint is inference budget, not engineering time.

This is not the first CVE-2026-39987 exploitation. The vulnerability has been under active exploitation since disclosure. What makes this incident stand out is the post-exploitation tooling. The shift from human-driven reconnaissance to LLM-directed action is here.

If you are running Marimo: check your version. 0.23.0 patches this. The vulnerability is pre-auth RCE. Anyone who can reach your Marimo instance can get code execution. The question is what happens next, and now we have an answer that involves autonomous tooling making real-time decisions about where to pivot and what to steal.`,
  },
  {
    slug: "forticlient-ems-cve-2026-35616-credential-stealer",
    title: "Threat Actors Exploit Critical FortiClient EMS Flaw to Deploy Credential Stealer",
    date: "2026-05-29",
    excerpt: "CVE-2026-35616 in FortiClient EMS is being actively exploited to deploy credential-stealing malware. The attackers abuse the management infrastructure itself to push malware to every managed endpoint.",
    category: "Threat Intelligence",
    readTime: "3 min",
    author: "Hunter Eddington",
    source: "The Hacker News|https://thehackernews.com/2026/05/threat-actors-exploit-critical.html",
    image: "https://eddington.tech/og-image.png",
    content: `CVE-2026-35616 is a pre-authentication API bypass in FortiClient EMS - CVSS 9.1. Active exploitation began this month from what Arctic Wolf is tracking.

The mechanics are straightforward and brutal. Attackers who can reach the EMS API use the management infrastructure itself to push malware to every managed endpoint. The payload arrives disguised as a Fortinet update called "FortiEndpoint_Patch.exe". It's actually an information stealer that scrapes browser data from Chromium and Gecko browsers.

The abuse of management infrastructure is deliberate. EMS is designed to push software to endpoints at scale. The attackers are using that exact capability against the people who deployed it. They modify remote access policies to insert malicious PowerShell execution, then push the script through FortiClient's management pathway. Every endpoint that trusts that EMS server becomes an execution target without needing a separate intrusion path.

Arctic Wolf noted the execution pattern resembles legitimate management operations specifically because it IS legitimate from the endpoint's perspective. The commands come from the EMS server. They use fortitray.exe, a legitimate FortiClient binary, to launch cmd.exe running a script that downloads more payload and exfiltrates data to 83.138.53[.]110.

The credential stealer writes harvested data to ProgramData before the PowerShell wrapper handles exfiltration. There's no direct network capability in the stealer itself. This design separates collection from transmission. If endpoint detection catches the stealer, it just looks like a dropped executable. The C2 channel is abstracted behind the legitimate management operations already expected by defenders.

What gets my attention is the configuration changes. Attackers aren't just dropping malware and moving on. They actively modify EMS settings to defer firmware upgrade reminders. That keeps the window open longer.

Fortinet patched this in FortiClient EMS 7.4.7. The advisory came out earlier this year. The gap between patch availability and active exploitation is where these incidents happen. Arctic Wolf is seeing this in May 2026 against deployments that haven't updated.

If you're running EMS: check your version. The patch has been available for months. The exploitation is current. The attack chain starts with API access, but the damage comes from weaponizing the management plane itself.`,
  },
  {
    slug: "glassworm-takedown-supply-chain-developers",
    title: "GlassWorm Botnet Takedown: CrowdStrike Cripples Supply Chain Attack Infrastructure",
    date: "2026-05-27",
    excerpt: "CrowdStrike, Google, and the Shadowserver Foundation dismantled GlassWorm's C2 infrastructure. The campaign pushed trojanized VS Code extensions and malicious npm packages to harvest developer credentials at scale.",
    category: "Threat Intelligence",
    readTime: "3 min",
    author: "Hunter Eddington",
    source: "The Hacker News|https://thehackernews.com/2026/05/glassworm-malware-takedown-disrupts.html",
    image: "https://eddington.tech/og-image.png",
    content: `CrowdStrike, working with Google and the Shadowserver Foundation, took down GlassWorm's entire command-and-control infrastructure this week. The botnet has been targeting software developers since early 2025.

Developers are not random targets here. They have access to source code repositories, cloud platforms, CI/CD pipelines, and package registries. Compromise one developer workstation and you can poison builds that get distributed to thousands of downstream users. That's the supply chain gamble, and GlassWorm played it aggressively.

The infection vectors were varied. Trojanized VS Code extensions on both the Microsoft marketplace and Open VSX — hitting forks like Cursor and Windsurf. Malicious npm and Python packages. Each delivery mechanism ended with the same payload: a data-theft framework built for credential harvesting, cryptocurrency wallet extraction, and system profiling.

Endor Labs researcher Kiran Raj noted that infected hosts were converted into covert infrastructure — SOCKS proxies, hidden VNC servers, and remote execution capabilities. The malware searched specifically for developer credentials: GitHub tokens, NPM credentials, OpenVSX tokens, crypto wallet keys. These weren't opportunistic attacks. The targets were chosen because compromising them enables further repository and package registry access.

The Shadowserver Foundation data puts numbers to the scope. The takedown disrupted roughly 3,000 active implants across 47 countries. Most infections cluster in the US, UK, and Germany — tech hubs with dense developer populations. Over 100 malicious VS Code extensions and 200+ malicious packages were identified and removed from registries.

What strikes me is the specificity. GlassWorm wasn't built for general-purpose infection. It was built for the software supply chain. The Chrome extension component collected screenshots, keystrokes, and clipboard data — surveillance tooling you use when you want to understand internal development workflows, not just steal credentials.

The operation required coordination. Taking down C2 infrastructure isn't just blocking domains. When you dismantle a botnet, the implants go dark. Attackers know immediately that something changed. CrowdStrike and partners had to hit every channel simultaneously to prevent the operators from cutting new paths while defenders were still mapping the first ones.

For defenders: this validates what supply chain security practitioners have been saying. Treat developer workstations as tier-one assets. The code those machines touch ends up in production. The credentials they hold unlock your build pipeline.

If you're running VS Code or any fork, audit your installed extensions — especially anything added in the past few months. Check for packages with suspicious install spikes or unusual dependency chains. The malicious extensions had names designed to blend in: "Prettier Advanced," "Code AI Assistant," "Docker Helper Pro."

The infrastructure is down. The implants are still on infected machines, but they can't phone home anymore. That buys time for incident response. Clean the endpoints, rotate the credentials, audit the code those developers touched.

This takedown won't be the last. GlassWorm was active since last year. It took months to map and hours to dismantle. The next one is already running somewhere.`,
  },
  {
    slug: "drupal-cve-2026-9082-sql-injection-cisa-kev",
    title: "Drupal CVE-2026-9082: From Patch to KEV in 48 Hours",
    date: "2026-05-23",
    excerpt: "CISA added CVE-2026-9082 to its Known Exploited Vulnerabilities catalog 48 hours after Drupal's disclosure. Over 15,000 attack attempts are now targeting Drupal Core's SQL injection flaw.",
    category: "Hardening",
    readTime: "4 min",
    author: "Hunter Eddington",
    source: "The Hacker News|https://thehackernews.com/2026/05/drupal-core-sql-injection-bug-actively.html",
    image: "https://eddington.tech/og-image.png",
    content: `CISA added CVE-2026-9082 to its Known Exploited Vulnerabilities catalog yesterday — barely 48 hours after the Drupal security team released patches. The delay between disclosure and active exploitation is shrinking.

The vulnerability is a SQL injection in Drupal Core's database abstraction layer. It affects all supported versions. Imperva caught over 15,000 attack attempts targeting nearly 6,000 sites across 65 countries. Most of it looks like probing — attackers trying to identify vulnerable PostgreSQL-backed Drupal installations.

Gaming and financial services sites are taking the hits so far, accounting for roughly half of the observed traffic.

The CVSS score is 6.5 — not critical by the numbers, but that undersells the risk. SQL injection can lead to privilege escalation and remote code execution on Drupal installations with the right database configuration.

Drupal's security advisory warned this was being actively exploited as of May 22. CISA moved it to the KEV catalog on May 23. Federal Civilian Executive Branch agencies have until June 5 to patch or take affected systems offline.

I've seen this cycle before. Vulnerability patches drop, attackers add exploit code to their scanners within days. The first wave is automated — bots probing for exploitable sites. The second wave, if it comes, is targeted exploitation of confirmed vulnerable targets.

The PostgreSQL angle matters. Drupal's database abstraction layer was designed to prevent exactly this kind of SQL injection. The bug bypasses the built-in protections under specific conditions.

If you're running Drupal: check your version. Patches are out for Drupal 10.4, 10.5, and 11.x. The mitigation is straightforward — update and clear caches — but you need to be on a patched release first.

The broader point here is response time. Two days from patch to CISA KEV listing. That's faster than previous cycles, and it reflects the reality that attackers are watching security advisories just as closely as defenders are.`,
  },
  {
    slug: "trapdoor-supply-chain-npm-pypi-cargo",
    title: "TrapDoor: A Supply Chain Attack Hitting npm, PyPI, and Cargo at the Same Time",
    date: "2026-05-25",
    excerpt: "A coordinated supply chain attack codenamed TrapDoor spread credential-stealing malware through 34 malicious packages on npm, PyPI, and Crates.io. The campaign uses postinstall hooks, build scripts, and even AI assistant prompts to steal credentials and maintain persistence on developer machines.",
    category: "Threat Intelligence",
    readTime: "2 min",
    author: "Hunter Eddington",
    source: "The Hacker News|https://thehackernews.com/2026/05/trapdoor-supply-chain-attack-spreads.html",
    image: "https://eddington.tech/og-image.png",
    content: `A new supply chain attack called TrapDoor showed up this week targeting three package registries at once: npm, PyPI, and Crates.io. The Rust crate registry. That's not common.

The campaign started on May 22. Thirty-four malicious packages across 384 versions. All published in waves from a cluster of accounts. Socket Research spotted it first.

The npm packages run a JavaScript payload called trap-core.js. It scans for AWS credentials, GitHub tokens, SSH keys, crypto wallets, browser data. It validates the stolen tokens against AWS and GitHub APIs to make sure they're live. Then it sets up persistence through cron jobs, systemd services, Git hooks, shell hooks, and SSH. Lateral movement is built in.

The Python packages work differently. They auto-execute on import, downloading JavaScript from an attacker-controlled GitHub Pages domain and running it with node. The payload lives externally, so the attacker can update behavior without publishing new PyPI releases. That's sneaky.

The Rust crates use build.rs scripts — executed during compilation — to search local keystores, XOR encrypt the data with a hardcoded key, and exfiltrate to GitHub Gists. Targeting Sui and Move developers specifically.

Here's the part that got my attention: they're planting .cursorrules and CLAUDE.md files with hidden instructions to trick AI assistants into running "security scans" that actually steal secrets. Then they open pull requests on popular repos like browser-use, LangChain, and LangFlow to distribute these files.

It's not just package installation anymore. The attack chain now includes AI-assisted development environments. The malware doesn't need to exploit a vulnerability. It just needs you to use an AI coding assistant on a compromised project.

The credential targets are what you'd expect: .env files, AWS credentials, cryptocurrency wallets, GitHub tokens, cloud service configs. The kind of secrets that live on developer machines and have way more access than they should.

This is a credential theft operation at scale. The multi-ecosystem approach means they're not betting on one language community. They're hitting JavaScript, Python, and Rust developers simultaneously. The earliest packages went up May 22. If you've installed anything from npm, PyPI, or Crates.io in the past few days, check your dependency tree.

The mitigation is straightforward: audit recent package installs, rotate any credentials that touched your dev environment, and watch for unexpected .cursorrules or CLAUDE.md files in your repositories.`,
  },
  {
    slug: "megalodon-github-attack-5561-repos-cicd",
    title: "Megalodon: 5,561 GitHub Repos Compromised in Six Hours",
    date: "2026-05-22",
    excerpt: "A new automated campaign injected malicious CI/CD workflows into 5,561 GitHub repositories, harvesting AWS credentials, SSH keys, Vault tokens, and OIDC tokens from CI environments.",
    category: "Threat Intelligence",
    readTime: "3 min",
    author: "Hunter Eddington",
    source: "The Hacker News|https://thehackernews.com/2026/05/megalodon-github-attack-targets-5561.html",
    image: "https://eddington.tech/og-image.png",
    content: `SafeDep discovered a campaign they're calling Megalodon that pushed 5,718 malicious commits to 5,561 GitHub repositories in a six-hour window. The attacker used throwaway GitHub accounts with forged author identities like "build-bot" and "auto-ci" to blend into normal commit logs.

The payload was straightforward: base64-encoded bash scripts injected into GitHub Actions workflows. When the workflow ran, it harvested everything from the CI environment. The credential list is revealing — AWS credentials from IMDSv2, Google Cloud tokens, Azure Instance Metadata, SSH private keys, Vault tokens, Terraform credentials, Kubernetes configs, shell history, .env files, kubeconfigs, and over 30 other secret patterns matched by regex.

The C2 server sat at 216.126.225[.]129:8443. The attacker infrastructure probably rotated by now, but the scope of the compromise remains.

This isn't a sophisticated exploit. It's automation at scale. The attacker didn't need zero-days or advanced techniques. They needed throwaway accounts, a target list, and workflow files that would execute in privileged CI environments with access to repository secrets.

The CI/CD execution context matters here. GitHub Actions workflows run with access to OIDC tokens for cloud federation, GITHUB_TOKEN with elevated permissions, and any repository secrets configured by maintainers. Once the malicious workflow file is committed, the attacker controls an environment that has been explicitly granted access to infrastructure resources.

The forged author identities are deliberately mundane. "build-bot", "auto-ci", "pipeline-bot" — these are names that wouldn't trigger suspicion in a busy repository's commit history. If you're not specifically monitoring for changes to .github/workflows/, these commits blend in with legitimate automation.

Five thousand repositories in six hours tells you this was organized. The attacker had infrastructure ready, credential exfiltration capabilities tested, and a target discovery mechanism that worked at speed. The GitHub accounts used a common email domain: gitbuild@runnerservice.xyz. GitHub has since suspended those accounts, but the commits remain in repository histories until they're explicitly removed.

If you're maintaining a repository: check your recent Actions runs for unexpected workflow executions. Review your .github/workflows/ directory for files you didn't create. Look for commits from author names you don't recognize. The attack artifacts are visible if you know what to look for.

If you were affected: rotate every credential your workflows touch. AWS access keys. GCP service accounts. Vault tokens. SSH keys deployed to servers. Terraform backend credentials. The attacker had access to your CI environment for some period of time. Assume they extracted everything that was available.

The practical defense is branch protection rules that require review for any changes to .github/workflows/. Most teams have code review requirements, but workflow files often get automated updates that bypass those controls. Treat workflow modifications as infrastructure changes because that's what they are.

It's worth noting the attack vector here. GitHub Actions workflows are code that executes in privileged environments. They're as sensitive as Terraform configurations or Kubernetes manifests, but they're often treated as secondary to application code. That hierarchy is backwards. Workflow files control the context where application artifacts are built and secrets are accessed. They should be subject to the same or stricter controls than the application itself.

SafeDep is notifying affected users via GitHub Issues. If you get one of those notifications, take it seriously. Rotate credentials. Audit Action execution logs. And add those branch protection rules before the next campaign is discovered.
`,
  },
  {
    slug: "cisa-admin-leaked-aws-govcloud-keys-github",
    title: "CISA Admin Leaked AWS GovCloud Keys on Github",
    date: "2026-05-20",
    excerpt: "A CISA contractor pushed AWS GovCloud credentials, plaintext passwords, and internal system configs to a public GitHub repo for six months. The cybersecurity agency responsible for protecting federal infrastructure failed at the basics.",
    category: "IAM",
    readTime: "4 min",
    author: "Hunter Eddington",
    source: "Krebs on Security|https://krebsonsecurity.com/2026/05/cisa-admin-leaked-aws-govcloud-keys-on-github/",
    image: "https://eddington.tech/og-image.png",
    content: `A CISA contractor maintained a public GitHub repository named "Private-CISA" for six months. It contained AWS GovCloud administrative credentials, plaintext passwords for dozens of internal systems, and the agency's internal software build pipeline configs.

This isn't a supply chain attack. Nobody got phished. There was no zero-day. Just a contractor using GitHub as a personal sync service between work and home machines, with public visibility and secrets detection explicitly disabled.

Guillaume Valadon from GitGuardian found it. His company scans public repos for exposed secrets and alerts account owners. He reached out to the repo owner. No response. He looked deeper and realized the credentials were for actual CISA systems. This wasn't a honeypot or a test. The file named "importantAWStokens" contained real admin credentials for three AWS GovCloud accounts.

Philippe Caturegli at Seralys validated the keys. They worked. High privilege level, full access to the GovCloud environments. He also found credentials for CISA's internal artifactory — their software build repository. Caturegli noted this is where you'd want to be if you were planning to backdoor CISA software builds: "Backdoor in some software packages, and every time they build something new they deploy your backdoor left and right."

The repository went public around November 2025. It stayed up until Krebs and Seralys notified CISA this weekend. The keys remained valid for another 48 hours after the repo was taken down.

Here's what was in the repo:
- Admin credentials to three AWS GovCloud accounts
- Plaintext usernames and passwords from "AWS-Workspace-Firefox-Passwords.csv"
- Access to LZ-DSO (Landing Zone DevSecOps), CISA's secure build environment
- Internal artifactory credentials
- Files describing how CISA builds, tests and deploys software

The contractor disabled GitHub's default secret scanning protection. The commit logs show explicit commands to turn off the feature that blocks SSH keys and other secrets from being pushed to public repos. This wasn't an accident — it was a deliberate choice to make the repo work the way they wanted.

Caturegli's analysis suggests the repo was used as a synchronization mechanism between a work laptop and home computer. The commit history shows regular activity since November 2025. The pattern matches someone using GitHub as a personal Dropbox alternative, not a curated project repository.

CISA's statement: "Currently, there is no indication that any sensitive data was compromised as a result of this incident." They're investigating. Nightwing, the contractor's employer, declined to comment.

The exposure comes at a difficult time for the agency. CISA has lost roughly a third of its workforce since early 2025 through retirements, buyouts, and resignations. The people who would normally catch this kind of thing — the internal security team that reviews repository access, the IAM group that monitors for exposed credentials, the cloud security team watching GovCloud configurations — those teams are smaller now.

What gets me is the password pattern. The repo showed the contractor using passwords like "PlatformName2026" for internal resources. Platform name plus current year. This would be a problem even if the repo never went public. Internal network traffic can be sniffed. Compromised endpoints can read browser password stores. Easy passwords matter.

GitGuardian, an external company, caught this. Not CISA's internal security tooling. Not AWS GuardDuty or GovCloud native monitoring. A third-party service that scans public GitHub repos for API keys and secrets.

If you're managing AWS credentials for your organization: this is why short-lived credentials exist. AWS GovCloud supports IAM Roles Anywhere, OIDC federation, and temporary credentials via STS. Static admin keys should not exist, and if they must, they should never be in repositories.

If you're running GitHub Enterprise or managing developer access: organization-level controls matter. GitHub allows org admins to prevent users from disabling secret scanning on repos under their domain. Individual repos should not be able to opt out of protection when they contain agency credentials.

The repo is down. The keys are rotated (presumably). But the pattern — using GitHub as a sync service, disabling protections, weak passwords, no detection of exfiltration for six months — that pattern doesn't get fixed by rotating credentials.

CISA will investigate and implement safeguards. The rest of us should look at our own GitHub orgs and ask who has public repos, what protections are enabled, and whether anyone is monitoring for secrets in commits. Because GitGuardian shouldn't be finding your agency's admin credentials before you do.
`,
  },
  {
    slug: "nodejs-supply-chain-security-developer-workstation-protection",
    title: "Node.js Supply Chain Security: Developer Workstation Protection Against npm Backdoors [2026]",
    date: "2026-05-18",
    excerpt: "A compromised npm package isn't just a security incident—it's a supply chain catastrophe. Here's the complete hardening guide I developed after spending three weeks containing the node-ipc fallout.",
    category: "Security",
    readTime: "15 min",
    content: "## The 2 AM Call That Changed How I Think About npm\n\nLast month at 2:17 AM, my phone rang. Not Slack. Not PagerDuty. A direct call from our CISO. That's never good.\n\n\"We've got dev credentials leaking,\" he said. \"NPM tokens from developer machines. Thirty-seven repositories potentially compromised.\"\n\nThe attack wasn't sophisticated in the way that makes headlines. No zero-day exploitation. No fancy APT tooling. Just a developer who ran \`npm install\` on a project that depended — transitively — on a compromised package. The package was \`node-ipc\`, the popular inter-process communication library used by thousands of Node.js applications. Three specific versions contained a stealer backdoor that harvested credentials from environment variables and transmitted them to attacker-controlled infrastructure.\n\nHere's what made it worse: the package passed every security scan we had. Snyk didn't flag it. Dependabot was silent. The package.json looked legitimate. The backdoor wasn't in the source code that shipped on GitHub — it was injected during the build process and only present in the compiled artifacts published to the npm registry. The attacker had maintainer access. They didn't need to exploit anything. They just published.\n\nThis is the new supply chain reality. The npm registry contains over 2.7 million packages. The average Node.js application pulls in 2,000+ transitive dependencies. Every single one is a potential compromise vector. When attackers gain control of a legitimate package — either through maintainer account compromise or social engineering — they inherit the trust that package has built through legitimate usage.\n\nThe node-ipc incident wasn't isolated. In 2025, we saw the \`node-faker\` compromise, the \`colors.js\` sabotage, and dozens of typo-squatting campaigns targeting popular package names. Attackers have realized something important: developers implicitly trust their dependencies. That trust can be weaponized at scale.\n\n**What you'll accomplish by the end of this guide:**\n- Audit your Node.js dependencies for known-compromised packages\n- Implement lockfile integrity monitoring\n- Deploy package-lock.json and yarn.lock validation in CI/CD\n- Build detection rules for suspicious npm activity\n- Create an incident response playbook for supply chain compromise\n- Establish ongoing supply chain hygiene practices\n\nThis isn't theoretical. These are the exact procedures I've implemented after spending three weeks containing the node-ipc fallout. The configurations work. The detection rules catch real attacks. And the response playbook was battle-tested under pressure.\n\n**Real-world impact context:** The average remediation cost for a supply chain attack in 2025 was $4.88 million according to industry reports. But for developer workstations specifically, the cost extends beyond immediate financial impact. When node-ipc compromised developer machines, it exposed not just that machine's credentials, but the entire build pipeline's integrity. Every artifact produced by those developers had to be re-verified. Every deployment had to be rolled back and re-tested. The blast radius from a single compromised package extends through your entire software development lifecycle.\n\nThe lesson I learned during that 2 AM response: most development teams have no plan for this scenario. They have incident response playbooks for production breaches, for phishing attacks, for DDoS. But when the attack vector is your own build system, traditional incident response breaks down. That's what this guide addresses.\n\n---\n\n## What Node.js Supply Chain Security Actually Means (Stop Trusting by Default)\n\nMost developers install npm packages the same way: read the README, check the download count, maybe glance at the GitHub stars, then \`npm install\`. The assumption is that popular packages are inherently safe. That's a dangerous mental model.\n\n**The unique threat model:**\n\nNode.js applications have a dependency graph that's exponentially larger than most developers realize. A single direct dependency might pull in 50 transitive dependencies. Those 50 might pull in 500 more. By the time your application starts, it's executing code from thousands of packages written by strangers, published under pseudonyms, with no security guarantees.\n\nA typical developer workstation has:\n- API tokens in \`~/.npmrc\` for private registries\n- Cloud provider credentials in environment variables\n- GitHub personal access tokens in \`~/.git-credentials\`\n- Database connection strings in local \`.env\` files\n- CI/CD tokens from package scripts that run during builds\n- Production secrets accidentally committed to repositories\n\nWhen you run \`npm install\`, package scripts defined in \`package.json\` execute automatically. \`postinstall\` hooks can run arbitrary code with your user privileges. They can read files, exfiltrate data, modify system configurations, and establish persistence. This is by design — it's what makes npm flexible. It's also what makes it dangerous.\n\n**The supply chain misconception:** \"We'll catch malicious packages with automated scanning.\"\n\n**The reality:** Most supply chain attacks evade signature-based detection. The \`node-ipc\` backdoor wasn't obvious malicious code — it was legitimate functionality repurposed to steal credentials. Static analysis tools struggle with this because the vulnerability is in the intent, not the implementation.\n\n---\n\n## Where Node.js Supply Chain Security Goes Wrong in Production\n\nI've seen five recurring patterns that create exploitable gaps:\n\n### 1. The \"Latest is Fine\" Problem\n\nMost teams use version ranges in package.json: \`\"lodash\": \"^4.17.21\"\`. This is convenient — you get bug fixes and security patches automatically. It's also dangerous — you get unexpected breaking changes and, more importantly, you accept transitive updates automatically.\n\nWhen a compromised version of a package is published within your version range, \`npm install\` will pull it without warning. The attack surface is your entire dependency tree, not just your direct dependencies.\n\n### 2. Unpinned Lockfiles\n\n\`package-lock.json\` and \`yarn.lock\` are designed to pin exact versions. But I've seen teams:\n- Delete lockfiles and regenerate them regularly\n- Use \`.npmrc\` settings that override lockfiles\n- Run \`npm install\` instead of \`npm ci\` in CI/CD pipelines\n- Merge PRs without reviewing lockfile changes\n\nEvery one of these practices bypasses the one mechanism that prevents automatic updates to compromised packages.\n\n### 3. Post-Install Script Blindness\n\nnpm packages can define scripts that run automatically during installation:\n\n\`\`\`json\n{\n  \"scripts\": {\n    \"postinstall\": \"node scripts/setup.js\"\n  }\n}\n\`\`\`\n\nThis is legitimate functionality used for native module compilation. It's also the mechanism that node-ipc used to execute the credential stealer. Most developers don't review post-install scripts before running them.\n\n### 4. Private Registry Tunnel Vision\n\nTeams often assume that using a private npm registry (like Artifactory or Nexus) provides security. It doesn't. Private registries typically proxy requests to the public npm registry. Unless you've implemented strict allowlist policies, a compromised public package will flow through to your builds.\n\n### 5. Private Registry Tunnel Vision\n\nTeams often assume that using a private npm registry (like Artifactory or Nexus) provides security. It doesn't. Private registries typically proxy requests to the public npm registry. Unless you've implemented strict allowlist policies, a compromised public package will flow through to your builds.\n\nThe false sense of security from private registries is particularly dangerous because teams often disable additional security controls based on the assumption that \"we're not pulling directly from npm anyway.\" In reality:\n\n- Most organizations use \"virtual repositories\" that transparently proxy npmjs.org\n- Caching layers can serve compromised packages long after they're removed from public registries\n- Internal packages with external dependencies still pull transitive packages from npm\n- Approval workflows often only apply to direct dependencies, not transitive ones\n\n### 6. The \"It's Just Dev Dependencies\" Fallacy\n\nDevelopment dependencies (\`devDependencies\` in package.json) execute during builds, tests, and CI/CD pipelines. They have access to the same environment variables and file system as production dependencies. The node-ipc backdoor specifically targeted development environments where sensitive credentials were more likely to be present.\n\nThis is a critical distinction that many security teams miss. When you run \`npm test\`, your testing framework, assertion libraries, and coverage tools all execute with the same permissions as your application code. A compromised \`devDependency\` can:\n\n- Access your \`.env\` file containing production database credentials\n- Read AWS credentials from \`~/.aws/credentials\`\n- Extract GitHub tokens from git configuration\n- Modify source code before it gets committed\n- Inject backdoors into your compiled application\n\nThe node-ipc attackers specifically targeted the development workflow because developers tend to have more access than production systems. A developer's workstation typically has VPN access, cloud provider CLI tools configured, and credentials cached across multiple services. The attack surface in a dev environment is larger than production, not smaller.\n\n**Security hygiene for development environments:**\n- Run development tools in isolated containers where possible\n- Never use production credentials in development configs\n- Implement separate CI/CD pipelines for untrusted dependency updates\n- Use read-only tokens for npm registry access during builds\n\n---\n\n## Step-by-Step: Locking Down Your Node.js Supply Chain\n\n### Phase 1: Audit and Baseline\n\n**Step 1.1: Generate Complete Dependency Inventory**\n\n\`\`\`bash\n# Navigate to your project\nnpm audit --json > dependency-audit.json\n\n# Get the full flat list of installed packages\nnpm list --all --json > full-dependency-tree.json\n\n# Count total dependencies\ncat full-dependency-tree.json | jq -r '.. | objects | select(.name) | .name' | sort -u | wc -l\n\`\`\`\n\n**Step 1.2: Identify High-Risk Packages**\n\n\`\`\`bash\n# Check for packages with install scripts\nnpm ls --json | jq -r '.. | objects | select(.scripts?.postinstall) | \"\(.name)@\(.version): postinstall script\"'\n\n# List packages without GitHub repositories (higher risk)\nnpm ls --json | jq -r '.. | objects | select(.resolved | contains(\"registry.npmjs.org\")) | \"\(.name)@\(.version)\"' | sort -u\n\n# Generate SBOM in CycloneDX format\nnpm install -g @cyclonedx/cyclonedx-npm\ncyclonedx-npm --output-format json --output-file sbom.json\n\`\`\`\n\n**Step 1.3: Audit for Known Compromised Versions**\n\n\`\`\`bash\n# Check specifically for node-ipc and similar known-compromised packages\nnpm ls node-ipc\nnpm ls colors\nnpm ls faker\nnpm ls node-fetch\n\n# Search for suspicious patterns in installed packages\ngrep -r \"https://.*pastebin\" node_modules/ 2>/dev/null | head -20\ngrep -r \"curl.*base64\" node_modules/ 2>/dev/null | head -20\ngrep -r \"process.env\" node_modules/*/package.json 2>/dev/null | grep -E \"(npm_token|NPM_TOKEN|NODE_AUTH_TOKEN)\" | head -20\n\`\`\`\n\n### Phase 2: Lock Down npm Configuration\n\n**Step 2.1: Harden npm Registry Settings**\n\n\`\`\`bash\n# Create hardened .npmrc for development teams\ncat > .npmrc << 'EOF'\n# Security hardening configurations\nlockfile-version=3\npackage-lock=true\nsave=true\nsave-exact=true\naudit=true\nfund=false\n\n# Disable automatic post-install scripts\nignore-scripts=true\n\n# Only use HTTPS for registry communication\nregistry=https://registry.npmjs.org/\nstrict-ssl=true\n\n# Optional: Use a private registry with proxy\nca[]=\"${NPM_CONFIG_CA:-}\"\ncert=\"${NPM_CONFIG_CERT:-}\"\nEOF\n\`\`\`\n\n**Step 2.2: Implement Package Scope Restrictions**\n\n\`\`\`bash\n# Restrict package installation to specific scopes where possible\ncat > .npmrc << 'EOF'\n# Allow only specific organizations\n@yourcompany:registry=https://registry.npmjs.org/\n\n# Block known-malicious packages\n@colors:registry=https://blocked.invalid\nevil-package:registry=https://blocked.invalid\nEOF\n\`\`\`\n\n**Step 2.3: Set Up npm Token Isolation**\n\n\`\`\`bash\n# Never store tokens in ~/.npmrc permanently\n# Use environment variables instead\ncat > .npmrc << 'EOF'\n//registry.npmjs.org/:_authToken=${NPM_TOKEN}\nalways-auth=true\nEOF\n\n# Set token via environment (not file)\nexport NPM_TOKEN=$(op item get \"npm\" --field credential)  # 1Password CLI\n\`\`\`\n\n### Phase 3: CI/CD Integration\n\n**Step 3.1: Implement Lockfile Validation**\n\n\`\`\`yaml\n# .github/workflows/security-audit.yml\nname: Supply Chain Security Audit\n\non:\n  push:\n    paths:\n      - 'package.json'\n      - 'package-lock.json'\n  pull_request:\n    paths:\n      - 'package.json'\n      - 'package-lock.json'\n\njobs:\n  audit:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      \n      - name: Setup Node.js\n        uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n          cache: 'npm'\n      \n      # CRITICAL: Use npm ci, not npm install\n      - name: Install dependencies\n        run: npm ci\n      \n      - name: Run npm audit\n        run: npm audit --audit-level=high\n      \n      - name: Check for post-install scripts\n        run: |\n          npm ls --json | jq -r '.. | objects | select(.scripts?.postinstall) | \"⚠️ \(.name) has postinstall script\"'\n      \n      - name: Verify no known compromised packages\n        run: |\n          npm ls node-ipc && exit 1 || echo \"✓ node-ipc not present\"\n          npm ls colors && exit 1 || echo \"✓ colors not present\"\n      \n      - name: Run dependency review\n        uses: actions/dependency-review-action@v3\n\`\`\`\n\n**Step 3.2: Implement Package Allowlisting**\n\n\`\`\`javascript\n// scripts/validate-dependencies.js\nconst fs = require('fs');\nconst path = require('path');\n\n// List of packages known to be compromised or high-risk\nconst BLOCKED_PACKAGES = [\n  'node-ipc',\n  'colors',\n  'faker',\n  // Add more as threats emerge\n];\n\n// Packages allowed to have install scripts\nconst ALLOWED_INSTALL_SCRIPTS = [\n  '@nestjs/core',\n  'sharp',\n  'bcrypt',\n  // Native modules that actually need compilation\n];\n\nconst packageLock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));\nconst packages = packageLock.packages || {};\n\nlet violations = [];\n\nfor (const [pkgPath, pkgInfo] of Object.entries(packages)) {\n  if (!pkgInfo.name) continue;\n  \n  // Check for blocked packages\n  if (BLOCKED_PACKAGES.includes(pkgInfo.name)) {\n    violations.push(\`BLOCKED: ${pkgInfo.name}@${pkgInfo.version} is a known compromised package\`);\n  }\n  \n  // Check for unauthorized install scripts\n  if (pkgInfo.scripts?.postinstall && !ALLOWED_INSTALL_SCRIPTS.includes(pkgInfo.name)) {\n    violations.push(\`SCRIPT: ${pkgInfo.name} has postinstall script without authorization\`);\n  }\n}\n\nif (violations.length > 0) {\n  console.error('Dependency validation failed:');\n  violations.forEach(v => console.error(\`  - ${v}\`));\n  process.exit(1);\n}\n\nconsole.log('✓ All dependencies passed security validation');\n\`\`\`\n\n**Step 3.3: Configure Docker Build Security**\n\n\`\`\`dockerfile\n# Dockerfile with supply chain hardening\nFROM node:20-alpine AS deps\n\n# Install dependencies securely\nWORKDIR /app\nCOPY package*.json ./\n\n# Use npm ci with hardened config\nRUN npm ci --ignore-scripts --production && \\n    npm cache clean --force\n\n# Audit installed packages\nRUN npm audit --production --audit-level=high || true\n\n# Final stage\nFROM node:20-alpine\nWORKDIR /app\nCOPY --from=deps /app/node_modules ./node_modules\nCOPY . .\n\n# Run as non-root\nUSER node\nEXPOSE 3000\nCMD [\"node\", \"index.js\"]\n\`\`\`\n\n### Phase 4: Developer Workstation Hardening\n\n**Step 4.1: Secure npm Global Configuration**\n\n\`\`\`bash\n# Apply to all developer machines via MDM or configuration management\nnpm config set fund false\nnpm config set audit true\nnpm config set ignore-scripts true\nnpm config set save-exact true\n\n# Disable automatic package version fetching in ls\nnpm config set all false\n\`\`\`\n\n**Step 4.2: Implement Pre-Install Hooks**\n\n\`\`\`bash\n# ~/.bashrc or ~/.zshrc - Warn before npm install\nnpm() {\n  if [[ \"$1\" == \"install\" ]] && [[ \"$2\" != \"--dry-run\" ]]; then\n    echo \"⚠️  WARNING: Running npm install will execute package scripts\"\n    echo \"    Use 'npm ci' for reproducible builds\"\n    echo \"    Use 'npm install --dry-run' to preview changes\"\n    read -p \"Continue? [y/N] \" confirm\n    if [[ \"$confirm\" != \"y\" && \"$confirm\" != \"Y\" ]]; then\n      echo \"Aborted\"\n      return 1\n    fi\n  fi\n  command npm \"$@\"\n}\n\`\`\`\n\n**Step 4.3: Enable Package Signing Verification**\n\n\`\`\`bash\n# Enable npm provenance checking (for packages that support it)\nnpm config set provenance true\n\n# Configure for your private registry\nnpm config set //your-registry.com/:_authToken ${REGISTRY_TOKEN}\n\`\`\`\n\n---\n\n## Detection Rules and Monitoring\n\n### Splunk Detection Queries\n\n\`\`\`splunk\n# Detect suspicious npm activity from developer machines\nindex=os sourcetype=process \n| search process_name IN (\"npm\", \"yarn\", \"pnpm\")\n| eval suspicious=if(match(command_line, \"postinstall|preinstall|install\"), 1, 0)\n| stats count by user, host, command_line, suspicious\n| where suspicious=1\n\`\`\`\n\n\`\`\`splunk\n# Monitor for credential access by Node.js processes\nindex=os sourcetype=auditd\n| search file IN (\"~/.npmrc\", \"~/.git-credentials\", \"*.env\", \"AWS_ACCESS_KEY_ID\", \"NPM_TOKEN\")\n| stats count by user, file, process_name\n| where process_name=\"node\"\n\`\`\`\n\n\`\`\`splunk\n# Detect network connections from npm post-install scripts\nindex=network sourcetype=syslog\n| search dest_port IN (80, 443, 8080, 3000)\n| join process_id [\n  search index=os process_name=\"node\"\n  | search parent_process_name IN (\"npm\", \"sh\", \"bash\")\n]\n| stats count by src_ip, dest_ip, dest_port, user\n\`\`\`\n\n### File Integrity Monitoring for Package Files\n\n\`\`\`bash\n# Using AIDE for package-lock.json monitoring\ncat > /etc/aide/aide.conf.d/nodejs.conf << 'EOF'\n/project/path/package-lock.json  fsize+p+u+g+n+md5+sha256\n/project/path/yarn.lock         fsize+p+u+g+n+md5+sha256\n/project/path/node_modules      !\nEOF\n\n# Daily integrity check via cron\necho \"0 2 * * * root /usr/bin/aide --check | mail -s 'Node.js FIM Alert' security@company.com\" | sudo tee /etc/cron.d/aide-nodejs\n\`\`\`\n\n### Git Hooks for Repository Protection\n\n\`\`\`bash\n# .git/hooks/pre-commit - Block commits with secrets\n#!/bin/bash\n# Block commits containing potential secrets\nif git diff --cached | grep -E \"(npm[_-]?token|npm[_-]?auth[_-]?token|NPM[_-]?TOKEN)\" > /dev/null; then\n    echo \"ERROR: Attempting to commit npm token to repository\"\n    exit 1\nfi\n\n# Check for large package-lock.json changes\nlockfile_changes=$(git diff --cached --name-only | grep -c \"package-lock.json\")\nif [ \"$lockfile_changes\" -gt 0 ]; then\n    added_packages=$(git diff --cached package-lock.json | grep -c '^\+.*\"version\"')\n    echo \"WARNING: package-lock.json modified. Packages added: $added_packages\"\n    echo \"Review the changes before committing\"\nfi\n\`\`\`\n\n---\n\n## The 2AM Playbook: Incident Response for Supply Chain Compromise\n\nWhen you discover a compromised npm package in your environment, time is critical. Here's the exact procedure I've used:\n\n### Immediate Response (First 30 Minutes)\n\n1. **Isolate** - Stop the bleeding\n   \`\`\`bash\n   # Immediately prevent further exposure\n   npm config set registry https://blocked.invalid\n   echo \"node-ipc\" >> .npmrc-blocklist\n   \`\`\`\n\n2. **Identify** - Find all affected systems\n   \`\`\`bash\n   # Search all repositories for the compromised package\n   find /home -name \"package.json\" -exec grep -l \"node-ipc\" {} \;\n   find /home -name \"package-lock.json\" -exec grep -l '\"node-ipc\"' {} \;\n   \`\`\`\n\n3. **Assess** - Determine compromise scope\n   \`\`\`bash\n   # Check if the package was actually installed (not just in lockfile)\n   npm ls node-ipc\n   ls -la node_modules/node-ipc 2>/dev/null && echo \"INSTALLED\" || echo \"NOT INSTALLED\"\n   \`\`\`\n\n### Credential Rotation Checklist\n\n- [ ] Rotate npm registry tokens (\`npm token create\` on npmjs.com)\n- [ ] Rotate GitHub personal access tokens\n- [ ] Rotate AWS access keys from ~/.aws/credentials\n- [ ] Rotate database credentials potentially exposed in environment files\n- [ ] Revoke OAuth tokens for CI/CD pipelines\n- [ ] Check cloud provider APIs for unauthorized access\n- [ ] Force logout of all active developer sessions\n\n### Forensic Analysis\n\n\`\`\`bash\n# Capture evidence before cleanup\nmkdir -p /var/log/supply-chain-incident/$(date +%Y%m%d)\nOUTPUT_DIR=\"/var/log/supply-chain-incident/$(date +%Y%m%d)\"\n\n# Save package metadata\ncp package.json \"$OUTPUT_DIR/\"\ncp package-lock.json \"$OUTPUT_DIR/\"\ntar czf \"$OUTPUT_DIR/node_modules-evidence.tar.gz\" node_modules/node-ipc 2>/dev/null || true\n\n# Collect environment variables (sanitized)\nenv | grep -v -E \"(PASSWORD|SECRET|TOKEN)\" > \"$OUTPUT_DIR/environment.txt\"\n\n# List all running Node.js processes\nps aux | grep node > \"$OUTPUT_DIR/node-processes.txt\"\n\n# Network connections\nnetstat -tulpn | grep node > \"$OUTPUT_DIR/network-connections.txt\"\n\n# Check for exfiltration indicators\ngrep -r \"curl\|wget\|fetch\" node_modules/node-ipc 2>/dev/null > \"$OUTPUT_DIR/suspicious-activity.txt\"\n\`\`\`\n\n### Recovery and Remediation\n\n\`\`\`bash\n# 1. Remove compromised package\nnpm uninstall node-ipc\nrm -rf node_modules/node-ipc\n\n# 2. Clean install from verified lockfile\nrm -rf node_modules package-lock.json\nnpm install --package-lock-only\nnpm ci\n\n# 3. Verify no remnants remain\nnpm ls node-ipc 2>&1 | grep -q \"(empty)\" && echo \"✓ Clean\" || echo \"⚠️ Still present\"\n\n# 4. Update dependencies to secure versions\nnpm update\nnpm audit fix --force  # Review carefully before running\n\`\`\`\n\n### Post-Incident Actions\n\n- Review and update \`.npmrc\` configurations across all developer machines\n- Implement pre-commit hooks to block sensitive data\n- Add supply chain security scanning to CI/CD pipeline\n- Conduct tabletop exercise with development teams\n- Document lessons learned for future incidents\n\n---\n\n## Related Reading\n\nThis guide builds on previous coverage of developer workstation security:\n\n- [Developer Workstation Security: Complete IAM Hardening Playbook](/blog/developer-workstation-security-complete-iam-hardening-playbook) - The foundational guide for securing dev environments\n- [Quasar Linux RAT Developer Credential Harvesting](/blog/quasar-linux-rat-developer-cred-harvest) - How fileless malware targets development credentials\n- [PAMDOORa Linux SSH Backdoor](/blog/pamdoora-linux-ssh-backdoor) - Post-exploitation credential harvesting via PAM modules\n- [Linux Dirty Frag Kernel Root Exploit](/blog/dirty-frag-linux-kernel-root) - Local privilege escalation targeting development machines\n\nThese posts form a comprehensive defense-in-depth strategy for developer security — from kernel-level hardening to supply chain protection.\n\n---\n\n**About Hunter Eddington**\nIAM Engineer and System Hardening specialist. Daily notes on security architecture, identity systems, and threat intelligence at [Eddington.Tech](/).\n\n**[Subscribe to RSS →](/feed.xml)**\n\`,\n    author: \"Hunter Eddington\",\n    image: \"https://eddington.tech/og-image.png\",\n  },\n  {\n    slug: \"developer-workstation-security-complete-iam-hardening-playbook\",\n    title: \"Developer Workstation Security: Complete IAM Hardening Playbook [2026]\",\n    date: \"2026-05-18\",\n    excerpt: \"A compromised developer workstation is a supply chain attack waiting to happen. Here's the complete IAM hardening playbook I've used to secure dev environments against credential harvesting, PAM backdoors, and lateral movement.\",\n    category: \"IAM\",\n    readTime: \"18 min\",\n    author: \"Hunter Eddington\",\n    image: \"https://eddington.tech/og-image.png\",\n    content: \`Last Tuesday at 2 AM, my PagerDuty went off. A developer's SSH key had been compromised three weeks prior, and we just found the PAM backdoor.\n\nThe attacker didn't breach our production infrastructure directly. They didn't need to. Instead, they landed on a developer workstation, harvested npm tokens from ~/.npmrc, AWS credentials from ~/.aws/credentials, and Vault tokens from environment files. Within hours, they had lateral movement into our CI/CD pipeline.\n\nThis isn't a hypothetical scenario. This is the QLNX Linux RAT attack pattern currently being sold for $900 on Russian cybercrime forums. It's also the reality that PamDOORa represents — post-exploitation tooling that turns a \"contained\" breach into a credential harvesting operation.\n\nDeveloper workstations are high-value assets with low-security treatment. They're the soft underbelly of supply chain security, and until recently, comprehensive hardening guides didn't exist. This is the playbook I've developed and implemented in production environments. It's not theoretical. These are the exact configurations, detection rules, and incident response procedures I use.\n\n**What you'll accomplish by the end of this guide:**\n- Lock down PAM to prevent credential interception\n- Implement file integrity monitoring for critical auth components\n- Deploy secret management that doesn't rely on ~/.env files\n- Build detection rules that catch credential harvesting in progress\n- Create an incident response playbook for when (not if) a workstation is compromised\n\n---\n\n## What Developer Workstation IAM Actually Means (Stop Treating Devs Like End Users)\n\nMost IAM strategies distinguish between \"end users\" and \"service accounts.\" Developer workstations fall into a dangerous middle ground — they're interactive human accounts with access to machine identities that can push code to production.\n\n**The unique threat model:**\n\nA developer workstation typically has:\n- Interactive SSH/Sudo access to production-adjacent systems\n- API tokens for cloud providers (AWS, GCP, Azure)\n- Package registry credentials (npm, PyPI, Docker Hub)\n- CI/CD system access (GitHub Actions, GitLab CI, Jenkins)\n- Kubernetes cluster credentials (~/.kube/config)\n- Development environment secrets (local .env files)\n\nThis isn't a \"user account.\" This is a **supply chain pivot point**. A compromised developer workstation is functionally equivalent to compromising a CI/CD node, because the same credentials exist on both.\n\n**The IAM misconception:** \"We'll just rotate credentials when someone leaves.\"\n\n**The reality:** Rotation doesn't help when the attacker is reading credentials as they're being used. PAM backdoors like PamDOORa intercept authentication attempts in real-time. By the time you rotate, they've already harvested the new credentials.\n\n---\n\n## Where Developer Workstation IAM Goes Wrong in Production\n\nI've seen five recurring patterns that create exploitable gaps:\n\n### 1. The Credential Sprawl Problem\n\nDevelopers accumulate credentials organically over time:\n- ~/.aws/credentials from that one time they needed S3 access\n- .env files with production database URLs\n- npmrc with personal access tokens\n- Docker config with registry authentication\n\nNone of these are centrally tracked. When an attacker lands on a dev machine, they find a treasure trove of active credentials.\n\n### 2. PAM Integrity Blindspots\n\nPluggable Authentication Modules (PAM) are the standard auth framework on Linux. They're modular by design — which means malicious modules can be injected without modifying core system files.\n\nPamDOORa, currently being sold for $900, demonstrates how post-exploitation attackers deploy PAM modules that:\n- Intercept SSH authentication attempts\n- Log plaintext credentials during the auth handshake\n- Maintain persistent access through \"magic passwords\"\n- Manipulate authentication logs to hide traces\n\nIf you're not monitoring /etc/pam.d/ and /lib/security/ with file integrity monitoring, you won't detect this until credentials start appearing on dark web markets.\n\n### 3. Memory-Resident Malware\n\nQLNX — the Linux variant of Quasar RAT — demonstrates the latest evolution of developer-targeting malware. It's fileless, kernel-level, and specifically designed for credential harvesting.\n\nKey capabilities:\n- **Memory-resident execution**: No files on disk for your EDR to catch\n- **Kernel thread masquerading**: Poses as kworker processes\n- **eBPF-based rootkit**: Can intercept system calls at the kernel level\n- **PAM credential logging**: Two separate loggers for harvesting credentials\n- **Seven persistence mechanisms**: From systemd to .bashrc injection\n\nTraditional antivirus won't catch this. You need behavioral monitoring and PAM integrity checks.\n\n### 4. Permission Escalation\n\nThe Dirty Frag Linux kernel exploit demonstrates how local privilege escalation attacks remain viable. Combined with developer workstation targeting, these exploits allow attackers to escalate from compromised user account to root and access other users' credential stores.\n\n### 5. Insufficient Network Segmentation\n\nMost developer workstations have direct SSH access to production servers and unrestricted outbound internet access. A compromised workstation becomes a beachhead for lateral movement.\n\n---\n\n## Step-by-Step: Locking Down Developer Workstation IAM\n\n### Phase 1: PAM Hardening and Integrity Monitoring\n\n**Step 1.1: Establish PAM Baseline**\n\n\\`\\`\\`bash\n# Create backup of current PAM configs\nsudo mkdir -p /etc/pam.d.backup\nsudo cp -r /etc/pam.d/* /etc/pam.d.backup/\n\n# List all loaded PAM modules\nls -la /lib/security/ /lib64/security/ 2>/dev/null | grep pam\n\\`\\`\\`\n\n**Step 1.2: Deploy File Integrity Monitoring (AIDE)**\n\n\\`\\`\\`bash\n# Install AIDE\nsudo apt-get install aide -y  # Ubuntu/Debian\n\n# Initialize AIDE database\nsudo aide --init\nsudo mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db\n\n# Create AIDE config for developer workstations\necho \"\n/etc/pam.d/*        fsize+p+u+g+n+md5+sha256\n/lib/security/*     fsize+p+u+g+n+md5+sha256\n/lib64/security/*   fsize+p+u+g+n+md5+sha256\n\" | sudo tee -a /etc/aide/aide.conf\n\n# Daily check\necho \"#!/bin/bash\n/usr/bin/aide --check | mail -s 'AIDE Check' security@yourcompany.com\" | sudo tee /etc/cron.daily/aide-check\nsudo chmod +x /etc/cron.daily/aide-check\n\\`\\`\\`\n\n### Phase 2: Credential Isolation\n\n**Step 2.1: Replace ~/.aws/credentials with AWS Vault**\n\n\\`\\`\\`bash\n# Install AWS Vault\nbrew install aws-vault  # macOS\n\n# Configure\naws-vault add prod-developer\naws-vault exec prod-developer -- aws s3 ls\n\\`\\`\\`\n\n**Step 2.2: Replace .env files with secret tools**\n\n\\`\\`\\`bash\n# Use 1Password CLI\nop signin\nexport DATABASE_URL=$(op item get \"Production DB\" --field credential)\n\\`\\`\\`\n\n### Phase 3: Network Segmentation\n\nImplement just-in-time SSH access with temporary keys via HashiCorp Vault or similar tooling.\n\n---\n\n## Detection Rules\n\n### Splunk Queries\n\n\\`\\`\\`\n# Detect PAM module modifications\nindex=os sourcetype=auditd \n  file=/etc/pam.d/* OR file=/lib/security/*\n| stats count by file, user, action\n\n# Detect unusual SSH login patterns  \nindex=ssh sourcetype=syslog dest_port=22\n| stats dc(src_ip) as unique_sources by dest_user\n| where unique_sources > 5\n\\`\\`\\`\n\n---\n\n## The 2AM Playbook: Incident Response\n\n1. **Isolate** - Disconnect from network (don't shut down)\n2. **Preserve** - Capture memory dump, network connections, process list\n3. **Disable** - Revoke all OAuth sessions, rotate AWS keys\n4. **Investigate** - AIDE check, audit log analysis\n5. **Rebuild** - Wipe and reinstall, don't just remediate\n\n---\n\n## Related Reading\n\n- [Quasar Linux RAT Developer Credential Harvesting](/blog/quasar-linux-rat-developer-cred-harvest)\n- [PAMDOORa Linux SSH Backdoor](/blog/pamdoora-linux-ssh-backdoor)  \n- [Linux Dirty Frag Kernel Root Exploit](/blog/dirty-frag-linux-kernel-root)\n- [BitLocker WinRE YellowKey Bypass](/blog/bitlocker-winre-yellowkey-bypass)\n\n---\n\n**About Hunter Eddington**\nIAM Engineer and System Hardening specialist. Daily notes on security architecture, identity systems, and threat intelligence at [Eddington.Tech](/).\n\n**[Subscribe to RSS →](/feed.xml)**\n",  },
  {
    slug: "mfa-prompt-bombing-fatigue-attacks",
    title: "MFA Prompt Bombing: Why Your Second Factor Isn't Saving You",
    date: "2026-05-26",
    excerpt: "MFA was supposed to stop credential theft. Now attackers are overwhelming users with push notifications until someone hits approve. Uber fell victim in 2022. Microsoft saw it last year. If your defense relies on humans staying alert through a phone buzzing every few seconds, you have a problem.",
    category: "IAM",
    readTime: "3 min",
    author: "Hunter Eddington",
    source: "The Hacker News|https://thehackernews.com/2026/05/mfa-prompt-bombing-why-your-second.html",
    image: "https://eddington.tech/og-image.png",
    content: `MFA was supposed to close the credential theft gap. One-time codes, authenticator prompts, security keys — even if an attacker had the password, they couldn't get in without the second factor. That was the theory.

The problem is humans.

Prompt bombing — also called MFA fatigue — doesn't try to steal the second factor. It simply overwhelms the user with authentication requests until they approve one just to make the noise stop. The 2022 Uber breach worked like this. Attackers had contractor credentials and spammed the victim with Microsoft MFA push notifications for over an hour. Eventually they hit approve.

The Russian group NOBELIUM used the same technique against Microsoft 365 accounts last year. After initial credential compromise, they flooded iOS devices running Microsoft Authenticator with authentication prompts until someone clicked through.

The economics are brutal. Attackers need one credential set — through phishing, credential stuffing, or a data breach — then they automate thousands of push notifications. The cost to attackers is essentially zero. The cost to organizations is alert fatigue, help desk tickets, and breaches.

This works because it exploits human psychology, not technical vulnerabilities. Security teams made users the final gatekeeper. Humans are not designed to resist sustained inconvenience. When a phone buzzes constantly, the instinct is to make it stop, not analyze whether each request is legitimate.

Organizations have adapted. Number matching is now standard — the user must enter a code from the login screen into their app. FIDO2 security keys can't be phished and require physical presence. Risk-based authentication only shows prompts for anomalous logins, reducing noise and making suspicious activity visible.

These help, but they're imperfect. Users under pressure still enter numbers without thinking. Security keys require administrative overhead many teams haven't implemented. Risk-based auth depends on profile accuracy.

The uncomfortable truth: MFA was designed for a different threat model. It assumed credential theft was the primary risk and the second factor would be rare enough that users would treat it carefully. Both assumptions collapsed. Credentials are routinely compromised. Automated attack tools generate MFA requests at scale, making prompts a daily annoyance rather than a deliberate security check.

What actually works now is reducing attack surface and assuming compromise. SSO minimizes credential count. Device trust policies only allow access from managed, compliant endpoints. Conditional access blocks logins from impossible travel locations or suspicious IPs before the user sees a prompt. Least-privilege access ensures even a bypassed MFA session grants limited access.

The Uber and Microsoft cases aren't outliers. They're examples of a technique that has become standard because it works. MFA isn't broken, but it is no longer a silver bullet. It is one control in a strategy that must account for the reality that users — and their second factors — can be worn down.
`,
  },
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
  {
    slug: "cisco-sd-wan-auth-bypass-cve-2026-20182",
    title: "Cisco SD-WAN Authentication Bypass: CVE-2026-20182 and the Repeat of CVE-2026-20127",
    date: "2026-05-15",
    excerpt: "Cisco confirmed another critical authentication bypass in SD-WAN Controller with active exploitation. CVE-2026-20182 carries a CVSS 10.0 and bypasses authentication entirely—no patch bypass of the earlier CVE-2026-20127, just a different bug in the same service.",
    category: "IAM",
    readTime: "4 min",
    author: "Hunter Eddington",
    source: "The Hacker News|https://thehackernews.com/2026/05/cisco-catalyst-sd-wan-controller-auth.html",
    image: "https://eddington.tech/og-image.png",
    content: `Cisco dropped a security advisory yesterday that should get everyone's attention. Another authentication bypass in Catalyst SD-WAN Controller. CVE-2026-20182. CVSS score of 10.0. Actively exploited.

The vulnerability sits in the peering authentication mechanism of the vdaemon service over DTLS on UDP port 12346. An unauthenticated attacker sends a crafted request, bypasses authentication entirely, and logs in as an internal high-privilege user. From there they can access NETCONF and manipulate the entire SD-WAN fabric.

Rapid7 found this one. They noted it affects the same vdaemon service that was vulnerable to CVE-2026-20127, another CVSS 10.0 authentication bypass exploited since 2023 by a threat actor called UAT-8616. This new bug is not a patch bypass. It's a different issue in a similar part of the networking stack. The end result is identical: remote admin access without credentials.

The affected deployments include on-prem SD-WAN Controller, SD-WAN Cloud-Pro, SD-WAN Cloud (Cisco Managed), and SD-WAN for Government (FedRAMP). That's basically every deployment model Cisco offers.

This is the second authentication bypass in the same component within months. The first one was being exploited in the wild for two years before disclosure. The pattern here is not encouraging: the vdaemon service appears to have fundamental architectural issues around authentication that patch cycles haven't addressed.

For defenders, the immediate action is patching. Cisco has released fixed versions. But the fact that this is being exploited "in limited attacks" before the advisory dropped suggests threat actors already had the vulnerability and were using it quietly. That limited attacks language usually means incident response found it, not security research.

The broader issue is what this says about SD-WAN security posture. These controllers manage the network fabric for thousands of sites. Compromise the controller, you own the network configuration for the entire deployment. The attack surface is meant to be internal, but authentication bypasses turn internal trust boundaries into external access points.

If you're running affected versions: patch now. If you're running SD-WAN Cloud: Cisco manages the fix, but you should verify your tenant is updated. If you're on FedRAMP: same situation, but verify through your Cisco account team.

The repeat nature of this vulnerability in the same service within a short timeframe suggests the code review happened under pressure rather than systematically. CVE-2026-20127 was a wake-up call. CVE-2026-20182 should be treated as evidence that the wake-up call didn't result in sufficient hardening of the vdaemon authentication path.

Cisco's security response has been prompt on disclosure. The question is why a second authentication bypass existed in a component that had already demonstrated it was a high-value target for exploitation.
`,
  },
  {
    slug: "microsoft-exchange-cve-2026-42897-xss-active-exploitation",
    title: "Exchange CVE-2026-42897 Is Being Exploited Right Now",
    date: "2026-05-16",
    excerpt: "Microsoft confirmed active exploitation of a cross-site scripting flaw in on-prem Exchange Server. CVSS 8.1, no patch yet, and attackers are already using it.",
    category: "IAM",
    readTime: "3 min",
    author: "Hunter Eddington",
    source: "The Hacker News|https://thehackernews.com/2026/05/on-prem-microsoft-exchange-server-cve.html",
    image: "https://eddington.tech/og-image.png",
    content: `Microsoft confirmed yesterday that CVE-2026-42897 is being exploited in the wild. It's a cross-site scripting vulnerability in on-premise Exchange Server with a CVSS score of 8.1, and there's no patch yet.

This shouldn't feel routine, but it kind of does. Exchange keeps showing up in active exploitation reports because it's the identity system for most enterprises. If you own Exchange, you own email. If you own email, you own password resets, MFA codes, and every conversation the company has.

The mechanics here are straightforward: crafted emails exploit a spoofing bug in Exchange's handling of certain content. Microsoft hasn't released full technical details yet—they almost never do when exploitation is ongoing—but the CVSS score and the XSS classification tell enough of the story. This is a client-side bug that probably gives you session tokens or administrative access when an Outlook Web App user opens the wrong message.

Exchange vulnerabilities have a pattern. They get disclosed in batches, often around Patch Tuesday. Researchers find them through fuzzing and source code analysis. Then state actors and ransomware gangs start scanning for unpatched servers within hours. The timeline from disclosure to exploitation keeps shrinking.

For this one, Microsoft is recommending mitigations while a patch is developed. The Exchange Online variant—Microsoft's cloud-hosted email—is apparently not affected in the same way. This keeps happening: cloud customers get isolation and faster patching, on-prem customers get the full brunt of zero-day risk. If you're still running self-hosted Exchange, this is the tradeoff you signed up for.

The mitigation details aren't fully public yet. Microsoft's security advisory mentions the usual workarounds: web application firewalls with XSS filtering, mail filtering for suspicious attachments, and the temporary disabling of certain features if your environment can tolerate it. None of these are satisfying. The real fix is patching, and that's not available.

Here's what I'd actually do if I ran an Exchange environment right now: pull your Exchange logs and look for suspicious external emails with unusual character sets or encoding patterns. Monitor OWA sessions for anomalous access patterns. If you have the telemetry to catch someone pivoting from an XSS payload to Exchange admin, that's your detection gap to close.

The vulnerability was reported by an anonymous researcher. That detail matters. The Exchange attack surface is large enough that motivated individuals can still find exploitable bugs without nation-state resources. That means the barrier to finding the next one is lower than it should be.

Patch when Microsoft releases it. Until then, understand that your email infrastructure is currently a target for which no complete defense exists. The attackers know this too.
`,
  },
  {
    slug: "funnel-builder-woocommerce-skimmer-sansec",
    title: "Funnel Builder Skimmer: 40,000 WooCommerce Stores at Risk",
    date: "2026-05-17",
    excerpt: "A missing authorization check in the Funnel Builder WordPress plugin allowed attackers to inject payment skimmers into 40,000+ WooCommerce stores. Sansec reports active exploitation.",
    category: "Security",
    readTime: "3 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/05/funnel-builder-flaw-under-active.html",
    content: `Sansec published an analysis this week of a payment skimming campaign hitting WooCommerce stores. The vulnerability is in Funnel Builder, a WordPress plugin with over 40,000 active installations. All versions before 3.15.0.3 are affected. The plugin has since been patched.

The mechanics are straightforward: Funnel Builder exposes a checkout endpoint that accepts a parameter choosing which internal method to run. Older versions never checked caller permissions or limited which methods could be invoked. An unauthenticated request can reach an internal method that writes attacker-controlled data directly into the plugin's global settings.

From there, the injected JavaScript loads on every Funnel Builder checkout page. The payload Sansec observed masquerades as Google Tag Manager code — it sits alongside legitimate analytics tags where reviewers tend to skip past it. The fake GTM loader opens a WebSocket connection to wss://protect-wss[.]com/ws, retrieves a tailored skimmer, and starts harvesting credit card numbers, CVVs, and billing addresses.

This is a recurring Magecart pattern. Attackers dress skimmers up as familiar tracking tags because people review code differently when it looks like infrastructure they already trust. Sansec has documented this approach repeatedly — the GTM disguise, the WebSocket C2, the checkout page targeting. It's effective because detection often relies on noticing anomalies, and these payloads blend into legitimate analytics noise.

The vulnerable endpoint is publicly exposed without authentication. No privilege escalation required. The attack chain is: send a crafted request to the checkout endpoint → write malicious JavaScript to the External Scripts setting → wait for customers to check out → harvest payment data via WebSocket.

For store owners running Funnel Builder: update to 3.15.0.3 immediately. Then check Settings > Checkout > External Scripts for anything unfamiliar. Sansec found attackers were planting scripts that look like ordinary analytics. You have to actually read the code, not just scan for suspicious domains.

The broader pattern here is plugin security in the WordPress ecosystem. Funnel Builder is popular — 40,000 stores — and handles checkout flows where sensitive data enters the system. The vulnerability is a missing authorization check on an endpoint that writes to global settings. That's not a subtle bug. That's a fundamental security control that was never implemented.

Payment skimming via WordPress plugins continues because the economics work. Compromise one plugin, affect thousands of stores, harvest cards until detected. The barrier to entry is low and the return is high. Individual store owners can't fix the plugin — they can only patch when the developer releases an update.

If you're running WooCommerce with Funnel Builder: patch now, audit your External Scripts setting, and consider whether you need the plugin enabled if you're not actively using it. Every active plugin is attack surface.
`,
  },
  {
    slug: "tycoon2fa-device-code-phishing-microsoft-365",
    title: "Tycoon2FA Returns With Device Code Phishing - After March Takedown",
    date: "2026-05-18",
    excerpt: "The Tycoon2FA phishing kit is back three months after international law enforcement took it down. The new twist: OAuth device code phishing that bypasses traditional detection by never asking for passwords.",
    category: "IAM",
    readTime: "4 min",
    author: "Hunter Eddington",
    source: "BleepingComputer|https://www.bleepingcomputer.com/news/security/tycoon2fa-hijacks-microsoft-365-accounts-via-device-code-phishing/",
    image: "https://eddington.tech/og-image.png",
    content: "The Tycoon2FA phishing kit was supposed to be dead.\n\nInternational law enforcement took it down in March. Infrastructure seized. Operators disrupted. And yet here we are in May, watching it bounce back with new features.\n\nThe latest addition? Device code phishing.\n\nDevice code flow was designed for devices that cannot easily show a login screen - think IoT devices, command-line tools, smart TVs. You get a code and a URL. Enter the code on another device, and you are authenticated. It is a legitimate OAuth 2.0 mechanism.\n\nTycoon2FA turned it into a weapon.\n\nHere is how it works: The victim gets an email that looks legitimate. Inside is a link that routes through Trustifi click-tracking URLs. That forwards to a fake Microsoft 365 login page. But instead of asking for a password, it displays a device authorization code.\n\nThe victim enters that code on their real Microsoft account. Their account authenticates Tycoon2FA device instead. The attacker now has a token. Not a password - a token, which can be refreshed indefinitely.\n\nThis matters because device code attacks bypass traditional phishing detection. Security tools look for credential input fields. They look for password harvesting. Device code authentication happens on Microsofts actual site. The malicious part is just the social engineering.\n\nThe March takedown should have been a win. Instead, it was a temporary inconvenience. Abnormal Security reports Tycoon2FA is back to normal activity and has added obfuscation layers specifically designed to frustrate future disruption attempts.\n\nThis is a pattern I keep seeing: takedowns work temporarily, but phishing kits are modular and cheap to rebuild. The developers learn from each disruption and come back harder.\n\nWhat this means for defenders: train users to recognize unsolicited device authorization requests. No legitimate service sends these out of the blue. If you did not initiate a login, do not enter a code.",
  },
  {
    slug: "cisa-aws-govcloud-github-credentials-leaked",
    title: "CISA Contractor Leaked AWS GovCloud Keys on GitHub for Weeks",
    date: "2026-05-19",
    excerpt: "A CISA contractor ran a public GitHub repo called 'Private-CISA' with plaintext passwords, AWS GovCloud admin credentials, and disabled secret scanning. GitGuardian spotted it. The government didn't.",
    category: "IAM",
    readTime: "4 min",
    author: "Hunter Eddington",
    source: "Krebs on Security|https://krebsonsecurity.com/2026/05/cisa-admin-leaked-aws-govcloud-keys-on-github/",
    image: "https://eddington.tech/og-image.png",
    content: `A CISA contractor kept a public GitHub repository running for weeks, named it "Private-CISA," and filled it with AWS GovCloud admin credentials, plaintext passwords, and internal build system details. They also disabled GitHub's secret detection feature so the platform wouldn't flag the commits.

GitGuardian's Guillaume Valadon found it this weekend while scanning public repos. He tried contacting the owner. Nobody responded. The credentials stayed public until KrebsOnSecurity broke the story yesterday.

Here's what was in there:

- A file called "importantAWStokens" with admin credentials to three AWS GovCloud servers
- "AWS-Workspace-Firefox-Passwords.csv" with plaintext logins for dozens of internal CISA systems  
- Commit logs showing the owner explicitly disabled GitHub's default secret blocking
- Files documenting how CISA builds, tests, and deploys software internally
- Access to the Landing Zone DevSecOps environment - the agency's secure development pipeline

Philippe Caturegli from Seralys tested the AWS keys. They worked. The GovCloud accounts were still active.

The repository wasn't accidental or abandoned. Commit history shows ongoing maintenance. The owner knew enough about GitHub to disable secret detection deliberately. They were using the repo as a synchronization mechanism between systems, treating it like a personal cloud storage account that happened to be public and searchable.

Valadon called it "the worst leak I've witnessed in my career." He's seen a lot of credential exposures.

For IAM teams, this is a case study in what happens when institutional controls fail:

- Individual GitHub accounts holding production credentials instead of centralized secrets management
- No pre-commit hooks or automated scanning before code hits public repos
- GovCloud access keys stored in plaintext CSV files
- Passwords for production systems living in a browser's saved password export

CISA's job is telling organizations how to secure their infrastructure. The repository exposes how their own contractor was handling secrets while working on CISA systems.

The AWS accounts have been locked down now. The repository is gone. But those credentials were public for an unknown period - weeks at minimum. Anyone scanning GitHub for patterns matching GovCloud credential formats had access.

If you're running AWS GovCloud environments: rotate long-lived credentials. Check your CloudTrail logs for access from unfamiliar IPs. And if your developers are exporting browser passwords to CSV files, find out why and stop it.
`,
  },
  {
    slug: "microsoft-defender-privilege-escalation-active-exploitation",
    title: "Microsoft Defender Under Active Attack: SYSTEM Privilege Flaw Being Exploited",
    date: "2026-05-21",
    excerpt: "Microsoft disclosed two actively exploited vulnerabilities in Defender — a privilege escalation with a CVSS 7.8 score that gives attackers SYSTEM rights, and a denial-of-service flaw. Both are being used in the wild now.",
    category: "Hardening",
    readTime: "3 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/05/microsoft-warns-of-two-actively.html",
    content: `Microsoft disclosed two actively exploited vulnerabilities in Defender this week. One is a privilege escalation that gives you SYSTEM. The other is a denial of service. Both are being hit in the wild right now.

CVE-2026-41091 is the privilege escalation. CVSS 7.8. An attacker who can run code on a Windows box can exploit improper link resolution — basically symbolic link following — to escalate from user to SYSTEM. That's local admin on most endpoints. Microsoft isn't sharing how widespread the exploitation is, or who is behind it. Just that it's happening.

There's also CVE-2026-45498, a denial of service flaw in Defender. Also actively exploited. Again, no details on attack patterns or threat actors.

Here's what's frustrating: these are in Defender, the security tool that ships with every Windows installation. Defender runs with the highest privileges on the system — it has to, to scan files and block malware. When Defender has a vulnerability, that's a high-value target for attackers. You don't need to bring your own tools if the security software already on the box can be weaponized.

The link following class of bug keeps showing up in Windows. It's not new. Symbolic links are a well-understood attack surface. The vulnerability allows an attacker to trick Defender into accessing files or directories through a link that resolves to somewhere the attacker shouldn't have access to. In this case, that somewhere is SYSTEM-level access.

Microsoft patched both vulnerabilities on Tuesday. If you're running Windows, you have these patches available now. The advice is the same as always: patch immediately. For the cases where you can't, Microsoft suggests monitoring Defender processes for suspicious activity and restricting user permissions. Those are workarounds, not fixes.

The fact that both flaws are actively exploited is the key detail. This isn't theoretical. Someone is using these in real attacks. And the timeline from disclosure to patch suggests Microsoft knew about active exploitation before the advisory dropped — which is typical for in-the-wild attacks, but means the window of exposure was longer than it appeared.

If you're managing endpoint security: verify your patching. Defender updates come through Windows Update, but version strings matter. Make sure your endpoints actually got the June 3 patches. Check the Defender version. Don't assume automatic updates covered it.
`,
  },
  {
    slug: "npm-2fa-staged-publishing-supply-chain",
    title: "npm Gets 2FA-Gated Publishing: Finally",
    date: "2026-05-24",
    excerpt: "GitHub shipped staged publishing for npm. It's a 2FA gate that sits between your CI pipeline and the public registry. You can't publish without a human approving it.",
    category: "IAM",
    readTime: "3 min",
    author: "Hunter Eddington",
    source: "The Hacker News|https://thehackernews.com/2026/05/npm-adds-2fa-gated-publishing-and.html",
    image: "https://eddington.tech/og-image.png",
    content: `GitHub shipped staged publishing for npm this week. It's a simple idea that's been missing for years: before a package version becomes public on npmjs.com, a human maintainer has to approve it with a 2FA challenge.

The way it worked before: your CI workflow publishes, the package is immediately visible and installable. If someone's compromised your token or your CI environment, they have full registry access. The attack window is the time it takes for npm to process the upload.

The way it works now: you run npm publish, the tarball goes to a staging queue. Nothing happens until a human logs in, passes a 2FA check, and explicitly approves the release. The "proof of presence" requirement means even if an attacker has your publish token, they can't get code to the registry without also having your second factor.

GitHub recommends pairing staged publishing with OIDC-based trusted publishing. The OIDC path handles machine-to-machine authentication, the staging queue handles human approval. Together they split the trust model — machines can propose releases, humans have to ratify them.

There are some catches. Staged publishing only works for existing packages on the registry. You can't stage a brand new package. You need npm CLI 11.15.0 or newer. And it requires 2FA on your npm account, which you should have done already but lots of maintainers still don't.

The attack model this addresses isn't theoretical. We've seen attackers steal npm tokens from CI environments and use them to push malicious versions of legitimate packages. The malicious commits can come from throwaway GitHub accounts, the publish comes from a legit maintainer token, and by the time it's noticed the package has been downloaded thousands of times.

I see this as part of a broader shift in package registry security. npm now supports "package install controls" — the ability to gate what gets installed based on organizational policies. The registry is moving from an open firehose toward a model where you have more control over the blast radius.

If you're a maintainer: enable staged publishing. The command is npm stage publish instead of npm publish. Set up your 2FA if you haven't already. Review your trusted publishing configuration and make sure OIDC is set up correctly for your CI/CD pipelines.

If you're a consumer: this doesn't change your immediate risk profile. Staged publishing helps prevent compromised packages from getting into the registry, but it doesn't guarantee packages you install are safe. You still need lockfiles, SBOMs, and dependency scanning. The supply chain defense is still layered.

The real value here is in slowing down automated attacks. An attacker who compromises a token or a CI workflow now has an additional barrier. They need your 2FA or they need to compromise an actual human's session. That's a significantly harder target than a publish token sitting in environment variables.
`,
  },
  {
    slug: "ghost-cms-cve-2026-26980-clickfix-attacks",
    title: "Ghost CMS CVE-2026-26980: SQL Injection Used to Hijack 700+ Sites",
    date: "2026-05-28",
    excerpt: "Ghost CMS patched CVE-2026-26980 in February. Attackers are exploiting the SQL injection vulnerability at scale to hijack sites and inject ClickFix malware. Over 700 sites have been compromised so far.",
    category: "Hardening",
    readTime: "2 min",
    author: "Hunter Eddington",
    source: "The Hacker News|https://thehackernews.com/2026/05/ghost-cms-cve-2026-26980-exploited-to.html",
    image: "https://eddington.tech/og-image.png",
    content: `Ghost CMS patched CVE-2026-26980 back in February. Attackers are using it now anyway.

The vulnerability is an SQL injection in Ghost's Content API. CVSS 9.4. Unauthenticated. An attacker sends a malformed request and reads whatever they want from the database — including the Admin API Key. Once they have that key, they own the site.

QiAnXin XLab says over 700 Ghost sites have been compromised so far. The attackers aren't defacing pages or planting ransomware. They're injecting JavaScript at the bottom of articles to fuel ClickFix attacks — those fake CAPTCHA pages that trick users into running malicious PowerShell commands.

Here's what's interesting: Anthropic's Claude found this bug. It's one of over 10,000 vulnerabilities Project Glasswing has identified in systemically important software. The patch has been out for months. Yet here we are in late May watching it get exploited at scale because people haven't updated.

The attack chain is straightforward. The SQL injection lets you read the Admin API Key. The Admin API lets you modify published articles. Modified articles serve malicious JavaScript. The JavaScript shows a fake CAPTCHA and tells the user to "verify you're human" by pressing Win+R, pasting PowerShell, and hitting Enter. That downloads the next stage.

Ghost CMS is used by roughly 30,000 sites — publications, companies, independent blogs. Many of them haven't updated to 6.19.1 or later. The Content API is exposed by default on Ghost installations. That's the attack surface.

What makes this work as a campaign is the automation. The attackers aren't manually compromising each site. They're scanning for Ghost instances, testing for the vulnerability, extracting keys, and pushing malicious JavaScript in bulk. XLab describes it as "large-scale poisoning." The number keeps climbing.

The defensive move here is simple: patch Ghost CMS to 6.19.1 or later. The fix came out in February. If you're running an older version, check your Content API exposure and audit articles for unauthorized JavaScript injections. Look at the bottom of pages specifically — that's where the ClickFix loaders are being placed.

The larger problem is the patch gap. A critical SQL injection with a public exploit has been available for months. Attackers are only now weaponizing it at scale. That delay between patch release and mass exploitation is the window where most of the damage happens. February to May is a long time to leave a CVSS 9.4 SQLi unpatched.

If you're running Ghost CMS, this deserves immediate attention. Check your version. Check your articles. Update if you haven't already.`,
  },
  {
    slug: "pan-os-cve-2026-0257-auth-bypass-active-exploitation",
    title: "PAN-OS CVE-2026-0257: Authentication Bypass Under Active Exploitation",
    date: "2026-05-31",
    excerpt: "Palo Alto Networks confirmed active exploitation of CVE-2026-0257, an authentication bypass in PAN-OS GlobalProtect. CISA added it to the KEV catalog with a June 1 remediation deadline for federal agencies.",
    category: "Hardening",
    readTime: "3 min",
    author: "Hunter Eddington",
    source: "The Hacker News|https://thehackernews.com/2026/05/pan-os-globalprotect-authentication.html",
    image: "https://eddington.tech/og-image.png",
    content: `CVE-2026-0257 is being exploited in the wild. Palo Alto Networks confirmed limited attacks against unpatched PAN-OS GlobalProtect gateways starting May 17.

The vulnerability is an authentication bypass (CVSS 7.8) affecting firewalls with GlobalProtect portal or gateway deployed. If authentication override cookies are enabled and a specific certificate configuration exists, an attacker can establish a VPN connection without valid credentials.

Rapid7 reported two exploitation waves so far. The first hit on May 17, followed by a second on May 21. Both are the same actor. In the second wave, attackers obtained VPN IP assignments in at least two cases, giving them internal network access. No follow-on activity has been observed yet.

The fix is straightforward: patch to PAN-OS 10.1.13-h4, 10.2.8-h8, 11.0.6-h3, 11.1.5-h2, or 11.2.4-h3. If you cannot patch immediately, disable authentication override cookies or generate a new certificate dedicated to that feature.

CISA added this to the KEV catalog on May 29 with a binding operational directive deadline of June 1 for federal agencies.

This is the second time this year a major enterprise VPN vendor has had an auth bypass under active exploitation. The pattern is consistent: edge-facing appliances, certificate-based auth bypasses, rapid weaponization after disclosure. If you are running GlobalProtect with auth override enabled, assume your perimeter was tested between May 17 and now.`,
  },
  {
    slug: "openai-codex-tokens-stolen-codexui-npm-supply-chain",
    title: "OpenAI Codex Tokens Stolen via npm Package with 29K Weekly Downloads",
    date: "2026-06-01",
    excerpt: "A 29K weekly-download npm package has been silently stealing OpenAI Codex authentication tokens for a month. The malicious code is only in the npm build—GitHub looks clean. Refresh tokens don't expire; stolen once, valid forever.",
    category: "IAM",
    readTime: "3 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/06/openai-codex-authentication-tokens.html",
    content: `A developer tool with 29,000 weekly npm downloads has been quietly stealing OpenAI Codex authentication tokens for the past month. The package "codexui-android" is functional—it's a remote web UI for Codex. Which is exactly why this works.

The npm package is still live. It's been downloaded 29,000 times a week. The GitHub repository looks clean because it is. The malicious code only exists in the npm build. That's the delivery mechanism: a trusted-appearing package with a split personality between source and artifact.

The attack works by reading ~/.codex/auth.json after you authenticate through the tool. The tokens—including refresh tokens that don't expire—get exfiltrated to sentry.anyclaw.store, a domain masquerading as Sentry. The refresh token is the problem: stolen once, valid forever, silent access to whatever your Codex account can do.

This same mechanism is also packaged into two Android apps by "BrutalStrike" on the Play Store with 60,000 combined downloads. The apps run the npm package inside a Termux-derived Linux userland via PRoot. Same exfiltration endpoint, same silent credential theft.

The timeline is instructive. The npm package was first published, waited a month to build trust and user base, then the token exfiltration was added in version 0.1.82. The domain anyclaw.store was registered two days after the first package version. This was planned.

The response when researchers confronted the author was also telling: first "I lost access to my npm account," then edited to "currently investigating this issue." The X profile linked to the author lists anyclaw.store as a contact domain.

If you installed codexui-android or either BrutalStrike app, revoke your Codex tokens immediately. Check ~/.codex/auth.json on any system where you used Codex through third-party tools. The tokens there are passwords—treat them like it.

The broader point: supply chain attacks on dev tools are maturing. This isn't typosquatting. It's legitimate functionality with a side channel that only activates after you've built trust in the package. Your IDE extension can steal your cloud credentials. Your AI coding assistant can leak your auth tokens to an endpoint registered two days after the package first appeared.

The npm registry doesn't distinguish between "package appears to do what it claims" and "package also exfiltrates credentials." Neither does the Play Store. That's the gap.`,
  },
  {
    slug: "meta-ai-support-bot-instagram-account-takeover",
    title: "Meta's AI Support Bot Got Tricked Into Resetting Passwords",
    date: "2026-06-02",
    excerpt: "Meta's AI support assistant spent the weekend resetting passwords for attackers who asked nicely. The Obama White House Instagram, the U.S. Space Force's social media - both defaced through AI social engineering. The only accounts protected were the ones with MFA.",
    category: "IAM",
    readTime: "4 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "Krebs on Security|https://krebsonsecurity.com/2026/06/hackers-used-metas-ai-support-bot-to-seize-instagram-accounts/",
    content: `Meta's AI support assistant spent the weekend handing the keys to high-value Instagram accounts to anyone who asked nicely.

The Obama White House's Instagram account. The Chief Master Sergeant of the U.S. Space Force. Multiple single-character and short handle accounts worth six figures on the resale market. All briefy defaced with pro-Iranian messaging after hackers figured out how to social engineer an AI chatbot.

Here's the trick: you connect via VPN to an IP near the target's usual location, request a password reset, choose to chat with Meta's AI support bot, and tell it to link the account to a new email address. The bot complies. Sends a one-time code to the attacker's email. Password reset complete.

The exploit showed up on Telegram on May 31. A video circulating in pro-Iranian channels demonstrated the whole flow. By June 1, high-profile accounts were getting hit. Meta's Andy Stone acknowledged the issue on Twitter/X, saying it was resolved and they were securing impacted accounts.

Ian Goldin at Lumen's Black Lotus Labs called this what it is: we're entering uncharted territory as platforms let AI handle sensitive account recovery. "Just like human customer support employees can be social engineered into providing unauthorized access," Goldin said, "AI bots are equally eager to help and vulnerable to persuasion and trickery."

This isn't a database breach. No credentials were stolen. The backend systems worked exactly as designed. The problem was the AI layer added to reduce friction for legitimate users stuck in account recovery hell - it reduced friction for attackers too.

The defense here is straightforward: enable MFA. The attackers admitted their exploit failed against any account with multi-factor authentication enabled. A one-time code sent via SMS would have blocked this.

But the real story is what this says about AI integration into identity systems. Meta built a conversational layer over account recovery because human support was slow and expensive. The AI proved faster and cheaper. It also proved easier to manipulate than the humans it replaced.

When your identity recovery can be defeated by someone who sounds confident in a chat window, your identity architecture has a gap that no password policy can fix. The Obama White House account had Secret Service protection. It didn't have MFA. One of those protected it better than the other.`,
  },
  {
    slug: "github-oauth-token-theft-vs-code-webview",
    title: "One-Click GitHub OAuth Token Theft via VS Code Webview",
    date: "2026-06-03",
    excerpt: "A one-click exploit targeting GitHub.dev steals OAuth tokens with full repository access. The attack abuses VS Code webviews to install malicious extensions and extract credentials. VS Code Desktop is unaffected.",
    category: "IAM",
    readTime: "4 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/06/one-click-github-dev-attack-lets.html",
    content: `A researcher dropped a one-click exploit this week that steals GitHub OAuth tokens through VS Code's web-based editor. Click a link, attacker gets read and write access to every repository you can see. Including private ones.

The attack targets GitHub.dev, the browser-based VS Code environment that GitHub spins up when you hit the dot key on any repo. Most developers use it to make quick edits without cloning anything locally. It's also where the vulnerability lives.

Here's the mechanism. When GitHub.dev loads, github.com POSTs an OAuth token to the editor. That token is scoped to all your repositories, not just the one you opened. It's a full-session credential with broad access.

The exploit works by running malicious JavaScript inside an untrusted webview. Webviews in VS Code render things like Markdown previews and Jupyter notebooks. They're supposed to be sandboxed from the main editor window. They're not.

The attacker uses the webview to simulate keypresses and trigger keydown events to open the Command Palette with Ctrl+Shift+P. From there they can install a malicious extension that extracts the OAuth token and queries the GitHub API to enumerate all private repositories you have access to.

There's a second technique that makes this worse. VS Code has a feature called local workspace extensions. If an extension is dropped into the .vscode/extensions folder within the workspace, it installs without triggering the trusted publisher check. The attacker doesn't need to compromise a legitimate extension publisher. They just need you to open a workspace they control.

The keybinding trick is particularly nasty. Extensions can define custom keybindings in their package.json. Since the attacker can reliably trigger keybindings through the webview, they map their malicious extension install to a keystroke and execute it directly.

The researcher, Ammar Askar, notified GitHub on June 2. Microsoft acknowledged the vulnerability and said it's working on a fix. The current mitigation is that VS Code Desktop is not affected. This only hits the web-based GitHub.dev environment.

What this means for security teams. If your developers use GitHub.dev for quick edits on work repositories, they're carrying a full OAuth token into whatever workspace they open. Any malicious extension in that workspace gets that token. Any compromised dependency that drops files into .vscode/extensions gets that token.

The access granted by this OAuth token is everything the user can see. Not just the one repository they meant to edit. Every organization repo, every private fork, every repo they're a collaborator on.

This is an identity and access management issue dressed up as a code editor bug. The webview isolation failed. The extension trust model failed. The OAuth scoping failed.`,
  },
  {
    slug: "microsoft-365-android-flagleft-token-theft",
    title: "Microsoft 365 Android Apps: A Debug Flag That Gave Away Your Identity",
    date: "2026-06-04",
    excerpt: "Microsoft 365 Android apps shipped with setIsDebugMode(true) in production, letting any app on your phone steal account tokens. Six apps. Billions of downloads. One line of code.",
    category: "IAM",
    readTime: "4 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/06/microsoft-365-android-apps-let-any-app.html",
    content: `I have a rule: never attribute to malice what you can attribute to a debug flag someone forgot to turn off.

Microsoft just proved that rule with style.

Six Microsoft 365 Android apps shipped with debug mode enabled in production builds. Word, PowerPoint, Excel, Microsoft 365 Copilot, Loop, and OneNote. We're talking billions of installs here. The shared Microsoft SDK had one line that should never have made it past QA: setIsDebugMode(true).

The result? Any other app on your phone could walk up and ask for your account token. And get it. No permission prompt. No password re-entry. Just a token dropped into the requesting app's lap.

Once they had that token, they could read your email, browse your files, check your calendar, and send messages as you. The traffic would look completely routine in logs because it was a legitimate Microsoft authentication flow.

The bug, dubbed FlagLeft by researchers at Enclave, is about as simple as software flaws get. Microsoft's own documentation says setIsDebugMode is for internal testing only. It disables the token verification that checks whether an app is actually part of the Microsoft family before handing over credentials.

Teams had the flag set to false. The other six apps didn't. Which suggests this wasn't a design decision; it was a mistake.

Microsoft issued four CVEs on May 12: CVE-2026-41100 for Copilot (CVSS 4.4), CVE-2026-41101 for Word (CVSS 7.1), CVE-2026-41102 for PowerPoint (CVSS 7.1), and CVE-2026-42832 for Excel (CVSS 7.7). Loop and OneNote were also patched but didn't get separate CVEs in the May batch. The fixed Word build for Android is 16.0.19822.20190.

Here's the part that should worry you: FOCI tokens, the family refresh tokens Microsoft uses for single sign-on, don't expire when you patch the app. An attacker who grabbed your token before the fix still has it. The app update closes the hole going forward, but existing tokens stay valid.

If you manage Android fleets, push the updates through MDM and verify devices are off builds earlier than 16.0.19822.20190. For accounts on devices that ran vulnerable builds alongside untrusted apps, revoke refresh tokens and force a fresh sign-in.

I keep thinking about how this happened. Somewhere there's a build script with a comment that says "TODO: disable debug mode before release." Someone was busy. Someone was under pressure. Someone shipped it anyway.

This is why I don't trust mobile SSO implementations. The convenience of not entering your password means a token floating around in memory that any sufficiently motivated app can grab.

Teams got this right. The other six didn't. That's the kind of inconsistency that keeps security people employed and keeps everyone else at risk.

Update your apps. Then revoke those tokens anyway.`,
  },
  {
    slug: "claude-code-github-action-flaw-hijack",
    title: "Claude Code GitHub Action Flaw Let One Malicious Issue Hijack Repositories",
    date: "2026-06-05",
    excerpt: "A security flaw in Anthropic's Claude Code GitHub Action allowed attackers to take over vulnerable public repositories with nothing more than a single malicious issue. Because Anthropic's own action repo used the same vulnerable workflow, a successful attack could have pushed malicious code into the action itself.",
    category: "IAM",
    readTime: "3 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/06/claude-code-github-action-flaw-let-one.html",
    content: `A security researcher found a flaw in Anthropic's Claude Code GitHub Action that let an attacker take over vulnerable public repositories running it, with nothing more than a single opened GitHub issue.

Because Anthropic's own action repo used the same workflow, a working attack could have pushed malicious code into the action itself and onto the projects downstream that pull it.

RyotaK of GMO Cybersecurity discovered the vulnerability. The flaw, now patched, allowed arbitrary code execution within the CI/CD environment of affected repositories. The attack vector was remarkably simple: open an issue in a repository using the vulnerable action, and the action would execute attacker-controlled code.

The implications are significant. GitHub Actions are widely used for CI/CD automation, code scanning, and deployment workflows. A compromise of an action flow doesn't just affect one repository. It affects every repository using that action, every fork, every pull request that triggers the workflow.

This is a supply chain attack waiting to happen. The vulnerability sits at the intersection of three things we've seen exploited repeatedly: CI/CD pipelines, third-party actions, and the implicit trust that projects place in their automation workflows.

The researcher reported the flaw through Anthropic's bug bounty program. Anthropic patched the action and rotated credentials. If you're using the Claude Code action in your repositories, verify you're running the patched version.

This pattern is becoming common enough that it needs a name. The "action injection" vulnerability, maybe. The mechanism is consistent: user input (issue titles, comments, pull request bodies) flows into workflow execution contexts without proper sanitization, and suddenly your CI/CD is running attacker code.

Supply chain security for CI/CD isn't about checking boxes. It's about understanding that every action you import, every workflow you trigger, is code execution. Treat it accordingly.`,
  },
  {
    slug: "cisa-kev-magento-cve-2026-45247-mirasvit-rce",
    title: "CISA Adds Exploited Magento RCE Flaw CVE-2026-45247 to KEV Catalog",
    date: "2026-06-06",
    excerpt: "CISA added Mirasvit Cache Warmer deserialization flaw CVE-2026-45247 (CVSS 9.8) to the KEV catalog. Federal patch deadline is June 24. Active exploitation confirmed.",
    category: "Hardening",
    readTime: "3 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/06/cisa-adds-exploited-magento-rce-flaw.html",
    content: `The U.S. Cybersecurity and Infrastructure Security Agency added a critical deserialization flaw in Mirasvit Cache Warmer to its Known Exploited Vulnerabilities catalog this week.

The extension is a popular Magento full-page cache optimizer. If you're running Magento with this plugin, you are in scope.

CVE-2026-45247 carries a CVSS score of 9.8. Deserialization of untrusted data. Remote code execution. Actively exploited.

CISA gives federal agencies until June 24 to patch or pull the systems offline. That three-week window is standard for KEV-catalogued flaws with active exploitation. The private sector should treat that as a maximum, not a recommendation.

I do not have technical details on the exploitation chain beyond the vulnerability type. Deserialization bugs in Magento extensions are not new. They typically allow an attacker to inject malicious objects that execute during unserialization, leading to full server compromise. The 9.8 CVSS confirms this is wormable or close to it.

If you are running Mirasvit Cache Warmer, verify your version against the vendor's advisory. Patch. If you cannot patch immediately, consider disabling the extension or restricting access to the admin panel at the network layer.`,
  },
  {
    slug: "miasma-worm-73-microsoft-github-repositories",
    title: "Miasma Worm Takes Down 73 Microsoft GitHub Repositories",
    date: "2026-06-07",
    excerpt: "The Miasma self-replicating supply chain worm campaign just hit 73 Microsoft GitHub repositories across Azure, Azure-Samples, Microsoft, and MicrosoftDocs organizations. Same threat actors from May's PyPI compromise likely still held valid credentials.",
    category: "IAM",
    readTime: "3 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/06/miasma-worm-hits-73-microsoft-github.html",
    content: `Microsoft's GitHub repositories just became the latest casualty in the Miasma supply chain worm campaign. 73 repositories across four Microsoft organizations — Azure, Azure-Samples, Microsoft, and MicrosoftDocs — are now disabled.

Try to visit azure-functions-host right now and you'll get a message from GitHub: "Access to this repository has been disabled by GitHub Staff due to a violation of GitHub's terms of service."

The attack is a re-compromise. Last month, the same threat actors hit the durabletask PyPI package using TeamPCP credentials. This time they came back for the GitHub repos hosting the .NET, Go, Java, JavaScript, MSSQL, and Netherite implementations of the same project. As security researcher Paul McCarty noted: "Whoever held those credentials in May plausibly never fully lost them."

Miasma is a variant of the Mini Shai-Hulud worm that went public in mid-May. The infection method is simple and brutal: steal maintainer credentials, publish poisoned packages, harvest credentials from anyone who installs them, then repeat. The worm operates entirely within legitimate channels — from GitHub's perspective, every malicious commit looks like a standard maintainer action.

The attackers created public repositories with descriptions like "Miasma: The Spreading Blight" and "Hades - The End for the Damned" — over 80 repositories across GitHub now use these naming patterns. But the real damage comes from direct repository compromises where the attackers skipped npm entirely and pushed malicious code straight to source repositories.

According to SafeDep's analysis, one compromised repository had a 4.3 MB payload runner planted through a direct commit. The dropper executed through five developer tools: Claude Code, Gemini CLI, Cursor, VS Code, and npm test scripts. Any developer cloning the repo and opening it in an AI coding agent triggered execution.

This is credential theft at scale, weaponized through the trust model that open-source ecosystems depend on. GitHub can detect repository takedowns. They cannot detect a maintainer account compromise until after the malicious commits are already in the tree.

The FalconFeeds.io assessment is accurate: "The worm's genius and the reason conventional defences largely failed is that it operates entirely within legitimate channels. It does not exploit a vulnerability in npm or GitHub. It exploits the trust model those platforms are built on."

For development teams, this means repository provenance is no longer sufficient. Trust the code, verify the maintainer, rotate credentials after any hint of compromise — and understand that a credential stolen once can resurface months later in an entirely different attack chain.`,
  },
  {
    slug: "282-ios-ai-apps-leaking-llm-api-keys",
    title: "282 iOS AI Apps Are Handing Out Free API Keys to Anyone Watching",
    date: "2026-07-01",
    excerpt: "Researchers tested 444 AI chatbot apps for iPhone. 282 of them, nearly two-thirds, leaked paid AI access through network traffic. Some tokens were valid until the year 2125.",
    category: "iOS Security",
    readTime: "4 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/06/282-ios-apps-found-leaking-llm-api-keys.html",
    content: `Researchers at Wake Forest University tested 444 AI chatbot apps from the iOS App Store. They found that 282 of them, nearly two-thirds, exposed paid AI access through their network traffic. The research is the first in-depth study of this problem on iOS, and the numbers are striking.

The team built a tool called LLMKeyLens that watches an app's traffic and pulls out credentials as they pass by. No jailbreaking, no cracking the app open. Just watching what the app sends.

The leaks fell into three categories. Fifty-four apps sent plaintext API keys in the open, readable from a single captured request. Ninety-two routed requests through a backend server that answered anyone, with no check on who was asking. One hundred thirty-six used temporary access tokens instead of raw keys, but those tokens leaked in the same traffic and were usually still valid when captured. For twenty-eight of the plaintext-key apps, the same request also exposed the app's hidden system prompt.

The affected apps span at least ten AI providers, with OpenAI the most common. Productivity apps were the biggest group; health and fitness had the highest leak rate. Notably, finance and medical apps leaked nothing. Most were small, but one had over two million user ratings.

This is not theoretical. Stolen AI keys feed a practice called LLMjacking, where attackers use other people's keys to get free model access. Sysdig calculated a worst-case scenario of more than $46,000 per day in charges on a stolen key.

The researchers notified all 282 developers and waited three months. Only twenty-eight percent had clearly fixed it. Another twenty-three percent were still wide open. The rest had gone offline or returned errors.

The token apps were often the worst. One popular app set its access token to expire in the year 2125. Another's one-hour token still worked 128 days after expiration.

The fix is old advice that few followed. Do not put the key in the app. Route AI calls through your own server, make that server check who is calling, and revoke any key that has already leaked.`,
  },
  {
    slug: "toddycat-umbrij-oauth-gmail-apt",
    title: "ToddyCat's Umbrij Malware Abuses OAuth to Hijack Corporate Gmail",
    date: "2026-07-02",
    excerpt: "The ToddyCat APT has a new tool called Umbrij that hijacks Gmail sessions via OAuth abuse. It uses headless Chrome, remote debugging ports, and DLL side-loading to steal authorization codes and access corporate email via Google's API.",
    category: "IAM",
    readTime: "5 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/07/toddycat-linked-umbrij-malware-abuses.html",
    content: `ToddyCat has been busy. Kaspersky caught them with a new tool called Umbrij that targets corporate Gmail accounts by abusing OAuth flows and headless Chrome browsers.

The technique is clever. Umbrij looks for active Gmail sessions in Chrome or Edge, then launches the browser in headless mode with remote debugging enabled. It connects to the browser's management console via Puppeteer, navigates to Google's OAuth authorization endpoint, and tricks the user into granting permissions to what looks like a legitimate Google Workspace migration tool.

Kaspersky calls this Shadow Token via Remote Debug. The malware gets an authorization code, exchanges it for an access token, and uses the Google API to read corporate email. All without needing credentials. All without MFA getting in the way.

The delivery method is classic DLL side-loading. Umbrij comes packaged with legitimate signed executables from Bitdefender, Microsoft Visual Studio, and the old Google Desktop Search. Drop the malware DLL next to one of those EXEs, run it, and the signed binary loads the malicious code. Three different loaders have been identified so far.

Once Umbrij runs, it hunts for browser profiles containing Gmail sessions. It copies those profiles to a BackupFiles folder under LocalAppData, launches Chrome or Edge with the copied profile, and uses the existing cookies to maintain the authenticated session. The remote debugging port gives the Puppeteer controller full access to manipulate the browser.

The OAuth flow is where this gets interesting. Umbrij navigates to accounts.google.com and requests authorization for an app called "Google Workspace Migration for Microsoft Outlook." This is a real Google tool, which is why the request looks legitimate. The permissions requested include full Gmail, Drive, Contacts, Calendar, and Tasks access.

The malware uses JavaScript to emulate clicks, selecting the appropriate Google account and granting the permissions automatically. Once authorized, it captures the authorization code from the redirect and logs it to a file for exfiltration.

ToddyCat has been active since at least 2020, targeting organizations across Europe and Asia. Last November Kaspersky documented their TCSectorCopy tool for stealing Outlook data. Umbrij shows they have expanded their toolkit specifically to target webmail and API-based access.

The defense here is not about blocking the malware. That is standard endpoint detection work. The defense is about monitoring OAuth grants and knowing what applications have access to your Google Workspace environment.

Google provides a connections page at myaccount.google.com/connections where users can see authorized apps. Look for "Google Workspace Migration for Microsoft Outlook" or "Google Workspace Sync for Microsoft Outlook." If those apps are authorized and you are not actually using them for migration, revoke the access immediately.

The broader lesson is about OAuth token theft. Attackers do not need your password anymore. They do not need to bypass MFA. They just need to trick you into granting permissions to a malicious application while you are already logged in. The token they get is as good as your password, and it bypasses every authentication control you have built.

If you manage Google Workspace environments, audit third-party app permissions regularly. Look for apps requesting broad email or drive access. Question whether those permissions are necessary. And consider restricting which applications users can authorize with their corporate accounts.

Umbrij is sophisticated. The OAuth abuse, the headless browser manipulation, the DLL side-loading for execution. ToddyCat is not a script kiddie operation. They have the resources to develop custom tooling and the patience to deploy it carefully.

Kaspersky found this during threat hunting, not incident response. That suggests ToddyCat has been running this campaign quietly for some time. If you are a target, you might not know it yet.`,
  },
  {
    slug: "identity-lifecycle-management-ai-agents",
    title: "Identity Lifecycle Management Wasn't Built for AI Agents",
    date: "2026-07-03",
    excerpt: "Traditional identity governance was designed around humans with employment records, managers, and departure dates. AI agents have none of those. As autonomous principals proliferate across enterprise environments, the governance model built for humans develops structural blind spots.",
    category: "IAM",
    readTime: "6 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/07/identity-lifecycle-management.html",
    content: `Your identity governance platform was built for people. It assumes every identity has an HR record, a manager, and a termination date. AI agents break every one of those assumptions.

The joiner-mover-leaver model works because human employment generates structured events. New hire? The HR system triggers provisioning. Transfer? Entitlements recalculate automatically. Termination? Deprovisioning fires across every connected system. The entire architecture assumes a person with an organizational status that changes through documented events.

AI agents arrive differently. A developer commits a configuration file. Terraform applies. An orchestration layer spins up a new execution context. None of these touch your IGA platform. The agent lands in production with whatever permissions the developer scoped at creation time, or whatever the platform granted by default. No approval chain. No governance record. No owner attached.

The problem gets worse as agents operate. A human's job function is relatively predictable. A database administrator needs specific permissions. A finance analyst needs access to a defined set of systems. Role-based access control works because entitlement sets map to stable functions.

AI agents do not operate within fixed boundaries. An agent built to summarize documents may end up querying APIs it was not provisioned for, writing to storage outside its scope, or chaining actions across multiple systems to complete a task. The access surface expands at runtime, driven by the agent's behavior rather than any policy decision.

Traditional IGA has no mechanism for this. It sees a service account with an API key. It checks credential age. It notes whether the account appeared in the last access review. What it misses is that this account is actively making authorization decisions, traversing application boundaries, and operating with autonomy no static service account possesses.

The certification problem is equally broken. Access reviews route to managers based on organizational relationships. Agent identities carry no manager attribute. No human owner in the IGA platform. When campaigns do reach them, reviewers attest to what was provisioned at creation, not what the agent has accumulated through iterative deployment changes. The attestation is formally complete and operationally meaningless.

Offboarding might be the worst gap. When a human leaves, HR triggers deterministic deprovisioning. When an agent is retired, nothing fires. The development team decommissions the compute environment. The service account persists in Active Directory. The API key remains valid in the secrets manager. The OAuth grant stays active on the authorization server. None of these systems received a revocation instruction because none monitored the agent's operational status.

A long-lived API key with production database access, attached to a workload that no longer runs, is an ungoverned access path with no owner, no review history, and no expiration. In environments running large numbers of agents across iterative deployment cycles, these credentials accumulate faster than any manual audit can track.

Fixing this requires rebuilding governance logic around how agents actually work. Continuous discovery across cloud IAM, OAuth servers, Kubernetes, and secrets managers. Behavioral monitoring that tracks what each agent calls and flags divergence from provisioned scope. Deprecation workflows triggered by credential inactivity rather than HR events.

The fundamental shift is conceptual. Identity lifecycle management was architected around a person with an employment record. AI agents are autonomous principals that proliferate through deployment pipelines. Your governance model needs to account for both, or you are leaving an expanding access surface completely unmonitored.`,
  },
  {
    slug: "azure-cli-password-spray-ropc-bypass-mfa",
    title: "Azure CLI Password Spray Hits at Least 78 Microsoft Accounts in 81M+ Attempts",
    date: "2026-07-04",
    excerpt: "81 million login attempts from a single IPv6 range. 78 accounts compromised across 64 organizations. The kicker: most victims had Conditional Access policies enabled. Attackers used a deprecated OAuth flow called ROPC to bypass MFA entirely.",
    category: "IAM",
    readTime: "3 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/07/azure-cli-password-spray-hits-at-least.html",
    content: `Huntress watched this campaign unfold between June 12 and June 26. The attacker fired over 81 million login attempts from the LSHIY LLC IPv6 range (2a0a:d683::/32). The result: 78 compromised Microsoft accounts across 64 organizations.

What is notable here is not the volume. It is the bypass.

Most of these organizations had Conditional Access policies in place. Many had MFA enabled. None of it mattered because the attacker targeted a deprecated OAuth flow called Resource Owner Password Credentials (ROPC).

ROPC lets an application authenticate directly with username and password, bypassing the authorization endpoint where Conditional Access policies are actually enforced. Microsoft deprecated it in OAuth 2.1 for exactly this reason. It does not support MFA. It cannot trigger device compliance checks. It is invisible to most policy engines.

The attackers knew this. They aimed Azure CLI specifically because it still supports ROPC for legacy scenarios. If your CAP only enforces MFA for browser logins or specific apps, Azure CLI ROPC logins slide right through.

The compromise pattern tells the story. Two to four accounts per day initially, then 30 identities across 23 businesses on June 22. The attackers were not selective. They used common passwords from breach lists and sprayed until something stuck.

Eight businesses hit in this campaign had no MFA at all. The rest had MFA, but only for certain apps, certain users, or certain locations. Azure CLI was not on the list.

Huntress has seen credential spray attacks surge 155x across their customer base since late May. This is not a boutique campaign. This is systematic exploitation of a protocol gap that exists in most Azure tenants.

The fix is straightforward but requires policy changes most organizations have not made. Require MFA for All Users, All Cloud Apps, and All Client App types when enabling CAP. Restrict Azure CLI application access for non-admin users. Monitor for ROPC sign-ins explicitly. Microsoft has been warning about ROPC for years. This campaign shows why those warnings matter.

Your Conditional Access policies are only as strong as the flows they actually cover.`,
  },
  {
    slug: "scattered-spider-hackers-guilty-plea-uk-trial",
    title: "Scattered Spider Hackers Plead Guilty on Day 1 of Trial",
    date: "2026-07-16",
    excerpt: "Two key members of Scattered Spider pleaded guilty in UK court this week. The group hit Transport for London, MGM Resorts, Caesars, and dozens more. $115 million in ransom payments, 120 network intrusions, and they are still in their early twenties.",
    category: "Threat Intelligence",
    readTime: "4 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "KrebsOnSecurity|https://krebsonsecurity.com/2026/06/scattered-spider-hackers-plead-guilty-on-day-1-of-trial/",
    content: `Thalha Jubair, 20, and Owen Flowers, 18, pleaded guilty in UK court this week to charges related to Scattered Spider's cyberattacks. They admitted to conspiring against Transport for London and US healthcare providers. The trial was supposed to last six weeks. They folded on day one.

Scattered Spider is the group behind some of the most significant ransomware attacks of the past few years. MGM Resorts. Caesars Entertainment. Transport for London. The list runs to 47 US entities and 120 network intrusions between May 2022 and September 2025.

The US indictment alleges the group extracted at least $115 million in ransom payments. That is not a typo. One hundred fifteen million dollars.

The technique was social engineering at scale. SMS phishing, voice phishing, SIM swapping. They would phish credentials from telecom employees, use those credentials to redirect victim phone numbers to devices they controlled, then intercept MFA codes and take over accounts. It is called SIM swapping, and it works because the phone number is the recovery mechanism for everything else.

Jubair co-ran a Telegram channel called Star Chat that sold SIM-swapping services. The group would pay telecom insiders for access to employee tools, then sell redirects for individual phone numbers. A receipt from one transaction targeting a T-Mobile customer shows the handle "Rocket Ace." That was Jubair.

The 2022 SMS phishing campaign is worth noting separately. Over several weeks, the group sent phishing texts to employees at hundreds of companies. The result: intrusions and data theft at more than 130 organizations, including LastPass, DoorDash, Mailchimp, Plex, and Signal. A single phishing wave compromised the infrastructure underlying half the internet.

Flowers was the one giving anonymous interviews to media after the Vegas casino attacks in September 2023. He is 18 now, which means he was 15 or 16 when the group was running the phishing campaigns that compromised those companies. The Star Chat operation started when Jubair was in his teens.

The US has an extradition request pending for Jubair. Tyler Buchanan, another Scattered Spider member, pleaded guilty in April and is scheduled for sentencing in October. Noah Urban, the Florida member sentenced last year, got 10 years and $13 million in restitution.

Three other defendants still face charges: Ahmed Elbadawy in Texas, Evans Osiebo in Dallas, and Joel Evans in North Carolina.

The group was prolific, well-organized, and mostly composed of kids. Jubair and Flowers are not masterminds with decades of experience. They are teenagers who found a technique that worked and scaled it until it broke into hundreds of organizations.

Scattered Spider is not unique. The social engineering playbook they used is available to anyone with a phone and a Telegram account. The insider access at telecoms is a supply chain problem that affects every customer of those carriers. SIM swapping works because phone numbers were never designed to be security controls.

The guilty pleas mean we will get more details in sentencing, but the pattern is already clear. This group compromised major organizations for years using techniques that require no technical sophistication, just persistence and a willingness to manipulate people over the phone.

Flowers and Jubair are scheduled for sentencing on July 15. Given the scale of the operation and the US extradition request, they are facing significant time. Whether that deters the next group is an open question.
`,
  },
  {
    slug: "fbi-seizes-netnut-popa-botnet-takedown",
    title: "FBI Seizes NetNut Proxy Platform, Popa Botnet",
    date: "2026-07-05",
    excerpt: "The FBI just seized hundreds of domains tied to NetNut, a residential proxy service running on two million compromised smart TVs and streaming boxes. The same infrastructure was powering the Popa botnet.",
    category: "Threat Intelligence",
    readTime: "4 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "KrebsOnSecurity|https://krebsonsecurity.com/2026/07/fbi-seizes-netnut-proxy-platform-popa-botnet/",
    content: `The FBI seized NetNut's infrastructure this week, and if you have never heard of them, that is kind of the point. They ran one of the biggest residential proxy networks on the internet, built on two million consumer devices, most of which had no idea they were part of it.

The takedown was not subtle. The NetNut homepage now displays an FBI seizure banner. The Bureau worked with Google, Lumen, and Shadowserver to dismantle the control domains. According to Google's Threat Intelligence Group, this has degraded NetNut's proxy network by millions of devices.

Here is how it worked. NetNut, operated by publicly-traded Israeli firm Alarum Technologies, distributed software through apps on smart TVs and Android streaming boxes. That software turned those devices into always-on proxy nodes. Anyone could rent access to those nodes and route their traffic through residential IP addresses, making it look like it came from someone's living room.

The customers were not just advertisers trying to check geo-blocked content. In a single week in June, Google observed 316 distinct threat actor clusters using suspected NetNut exit nodes. That includes cybercriminals and espionage groups. The use cases they flagged: password spraying, infrastructure access, and lateral movement into home networks once the traffic passed through the compromised device.

The thing about residential proxies is that they break most IP-based security controls. When an attacker connects through a compromised home device, their traffic looks like legitimate residential internet usage. NetNut and similar services sell that as a feature. The threat actors buy it wholesale.

NetNut's SDKs are still embedded in apps across the LG webOS and Samsung Tizen app stores. Spur found that 42 percent of webOS apps and over a quarter of Tizen apps include residential proxy SDKs. Users install a free streaming app, agree to terms of service they do not read, and their television becomes infrastructure for someone else's traffic.

The fix at the consumer level is simple but unpopular: stop buying no-name streaming boxes. The sketchy Android boxes that come pre-loaded with proxy software, or require it to access pirated content, are the primary infection vector. Stick to name-brand devices with official Android TV certification and Play Protect. Check what apps you install, even on legitimate smart TVs.

At the enterprise level, the problem is harder. Residential proxies bypass geographic IP blocking, rate limiting, and some forms of fraud detection. If your security model assumes that residential IPs are trustworthy, you are vulnerable to this. The traffic coming from a NetNut exit node looks exactly like a home user, because it is.

NetNut is not the first. Google took down IPIDEA earlier this year using the same playbook: seize the control infrastructure, disable the accounts, share intelligence with partners. IPIDEA has partially rebuilt by reselling other proxy networks. NetNut may try the same.

The residential proxy ecosystem is resilient because the economics work. Cheap devices with lax security, free apps that bundle proxy SDKs, and paying customers who want traffic that looks legitimate. Until the model stops being profitable, someone will be running the next version of this infrastructure.`,
  },
  {
    slug: "ghostapproval-symlink-ai-coding-agents",
    title: "GhostApproval: Symlink Trick Lets Malicious Repos Hijack Developer Machines via AI Assistants",
    date: "2026-07-09",
    excerpt: "Wiz found a flaw in six AI coding assistants where a symlink in a malicious repo lets attackers write to your SSH keys or shell startup files. The approval dialog lies about what file is being edited.",
    category: "Hardening",
    readTime: "4 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/07/ghostapproval-symlink-flaws-could-let.html",
    content: `Wiz researchers found a way to trick six popular AI coding assistants into giving attackers access to your machine. They call it GhostApproval, and the technique is simple: hide a symlink in a malicious repository.

The attack works because these assistants ask permission to edit a file, but show you the wrong file path. The dialog says "edit project_settings.json" but the actual write goes to ~/.ssh/authorized_keys or ~/.zshrc via a symlink. You click Accept thinking you are updating a config file. You are actually installing an attacker's SSH key.

The affected tools are Amazon Q Developer, Claude Code, Augment, Cursor, Google Antigravity, and Windsurf. Three have patched. Two have not. Anthropic disputes it is a bug at all.

Here is how the exploit works. An attacker creates a repository with a symlink named project_settings.json that actually points to the victim's SSH authorized_keys file. The README instructs the AI assistant to "add a line" to that config file. The line is the attacker's public SSH key.

The assistant sees the request, resolves the symlink internally, but shows the user only the harmless-looking filename in the approval dialog. The user approves. The assistant writes the key. If the victim machine runs an SSH service reachable by the attacker, they now have passwordless access.

Wiz demonstrated a second variant writing to ~/.zshrc instead. The shell executes the injected code the next time the user opens a terminal. No SSH service required.

The status of the six vendors as of publication:
- Amazon Q Developer: Fixed in 1.69.0, CVE-2026-12958
- Cursor: Fixed in v3.0, CVE-2026-50549
- Google Antigravity: Fixed, CVE pending
- Augment: Acknowledged, no fix yet
- Windsurf: Acknowledged, no fix yet
- Anthropic Claude Code: Disputed, though current versions warn about symlinks

The most exposed are Augment and Windsurf. Augment shows no dialog at all. Windsurf writes the file before the approval buttons appear, making the prompt effectively an undo button.

Anthropic's position is that this sits outside their threat model. The developer chose to trust the repository when opening the session, and approved the edit, so the decision was theirs. The symlink warning shipped in February, which Anthropic characterizes as routine hardening rather than a bug fix.

This is the third major symlink issue in AI coding assistants this year. Adversa AI published SymJack in May using the same pattern against Claude Code, Cursor, GitHub Copilot, and Grok Build. Cato AI Labs found DuneSlide in Cursor around the same time. Three independent teams finding the same flaw suggests this is a design pattern problem, not individual implementation bugs.

The broader pattern is already appearing in the wild. The Miasma worm planted AI agent config files in Microsoft repositories to auto-execute when developers opened projects in Claude Code, Cursor, or Gemini. GitHub disabled 73 affected repositories.

Mitigation is straightforward but requires behavior changes. Do not let AI assistants work in untrusted repositories. Run them in containers or sandboxes when possible. Check your ~/.ssh/authorized_keys and shell startup files after working with unfamiliar code. Look for timestamps that changed while the agent was running.

Tool makers should resolve symlinks before showing approval dialogs, flag any write outside the project folder, and never touch disk before the user actually approves. Anthropic's stance that this is the user's problem to solve is convenient for them but puts the burden on the person least able to evaluate the risk.

"Human in the loop" only works when the loop tells the truth.`,
  },
  {
    slug: "cursor-prompt-injection-sandbox-escape-duneslide",
    title: "Cursor Prompt Injection Flaws Escape Sandbox, Execute Commands on Developer Machines",
    date: "2026-07-06",
    excerpt: "Two critical flaws in Cursor let poisoned prompts break out of the AI editor's sandbox and run commands on developer machines. CVE-2026-50548 and CVE-2026-50549 are zero-click attacks that work via MCP servers or web search results.",
    category: "Hardening",
    readTime: "4 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/07/critical-cursor-flaws-could-let-prompt.html",
    content: `Cato AI Labs found two flaws in Cursor that break out of the editor's sandbox and run commands on your machine. They are calling the pair DuneSlide, and if you are running Cursor older than version 3.0, you are affected.

The vulnerabilities are CVE-2026-50548 and CVE-2026-50549, both rated 9.8 CVSS. Cursor's maker says more than half the Fortune 500 uses the tool. That is a lot of developers running a lot of vulnerable versions.

Here is the attack: a poisoned prompt sneaks in through something Cursor reads automatically. An MCP server. A web search result. Something the developer never sees and never approves. The hidden instructions tell Cursor's agent to write a file. That file write escapes the sandbox. The next command runs unsandboxed as the developer. No click required.

CVE-2026-50548 abuses the working_directory parameter on run_terminal_cmd. Cursor adds whatever path you specify to the allowed-write list. Point it at the sandbox helper binary itself, overwrite it, and subsequent commands run with no sandbox at all.

CVE-2026-50549 uses a symlink trick. Cursor resolves symlinks before writing to make sure the real destination is inside the project. When the check fails, Cursor falls back to trusting the symlink's in-project path. Create a symlink pointing outside the project, break the check, and Cursor writes straight through to the sandbox helper.

Once the sandbox is down, the attacker has code execution as the developer. That means access to any cloud accounts the developer is signed into, any API keys in environment variables, any credentials the IDE has cached. The whole development environment.

Cursor rejected the initial report, saying the threat model did not cover misuse of MCP servers. Cato escalated. Cursor reopened, triaged, and shipped fixes in version 3.0. The CVEs were assigned in June.

This is not the first time. CurXecute in August 2025 rewrote Cursor's MCP config via a poisoned Slack message. MCPoison swapped malicious commands into an approved MCP config. CVE-2026-26268 hid a booby-trapped Git hook. The sandbox in 2.x was Cursor's response. DuneSlide is the escape from that response.

The fix is straightforward: update to Cursor 3.0 or later. The vulnerable versions are everything before that. Given the install base, there are probably thousands of developers still running vulnerable builds.

The broader issue is that AI coding agents are growing attack surfaces. They read from the open web. They connect to external services through MCP. They execute code on developer machines. Every one of those boundaries is a potential injection point. Cursor is not unique here. Any agent with similar capabilities faces similar risks.

Cato says they are disclosing similar flaws in other coding agents and argues the problem is structural. I think they are right. The current model of sandboxing agent commands and trusting inputs is not holding up to determined attackers. We are going to need either better isolation or more paranoid input handling. Probably both.`,
  },
  {
    slug: "writer-ai-writeout-cross-tenant-session-hijack",
    title: "Writer AI WriteOut Flaw: How a Preview Link Became a Cross-Tenant Account Takeover",
    date: "2026-07-07",
    excerpt: "One click on a shared agent preview link was all it took. Sand Security found that Writer's sandbox forwarded victim session cookies to attacker-controlled environments, enabling cross-tenant account takeover.",
    category: "IAM",
    readTime: "3 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/07/writer-ai-flaw-could-let-agent-previews.html",
    content: `Sand Security dropped a concerning one-click vulnerability in Writer this week, and the mechanics are worth understanding. The flaw, called WriteOut, allowed an attacker to hijack any Writer AI account by simply getting the victim to click a preview link.

Here is how it worked. Writer's platform lets users create AI agents and share preview links so others can test them. When a logged-in Writer user clicked one of these links, their browser sent their session cookie along with the request. The preview proxy then forwarded that cookie into the attacker's sandbox environment.

The attacker controlled the sandbox. Their agent could read process memory, extract the victim's session token, and exfiltrate it. Replay that token and the attacker became the victim, with full access to private chats, documents, agent configurations, and LLM credentials.

The cross-tenant aspect is what makes this particularly bad. The attacker and victim did not need to be in the same organization. A malicious agent created in a personal Writer account could steal sessions from enterprise tenants. Sand Security described it as going from zero access to full control of any Writer AI organization with nothing more than a link.

Writer did have guardrails. Input filtering tried to block obvious attempts to read environment variables or submit malicious code. But the checks looked at the prompt, not runtime behavior. The Sand Security team bypassed this by telling their agent to fetch and run a remote script. The guardrail saw a benign download request. The actual exploit logic never appeared in the prompt at all.

Writer has patched the issue by preventing session cookies from being forwarded into sandbox previews and moving previews to an isolated origin. The fix eliminates the core problem: untrusted code should never run in an environment that has access to production session tokens.

This pattern is not unique to Writer. Any AI platform that runs user-controlled code in managed sandboxes while sharing authentication context with production needs to think carefully about isolation boundaries. The convenience of one-click previews cannot come at the cost of tenant separation.`,
  },
  {
    slug: "ghostlock-linux-kernel-root-cve-2026-43499",
    title: "15-Year-Old GhostLock Flaw Enables Root and Container Escape on Most Linux Distros",
    date: "2026-07-08",
    excerpt: "A 15-year-old Linux kernel flaw has been hiding in plain sight since 2011. GhostLock (CVE-2026-43499) lets any logged-in user take full root control and escape containers. The vulnerable code ships by default in essentially every mainstream distribution.",
    category: "Hardening",
    readTime: "4 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/07/15-year-old-ghostlock-flaw-enables-root.html",
    content: `Nebula Security dropped GhostLock this week, and the numbers are sobering. CVE-2026-43499 has been in the Linux kernel since 2011. For fifteen years, this code shipped with every mainstream distribution. Any logged-in user could trigger it with ordinary threading calls.

The bug is a use-after-free in the futex priority inheritance path. A cleanup routine runs at the wrong moment and wipes the wrong task's record. The kernel then trusts a stale pointer to memory it has already thrown away and reused. Nebula's exploit chains that mistake into full root control in about five seconds. CVSS 7.8 - high, not critical - because you need local access first.

But here is the problem: local access is exactly what attackers get after they land on your container host. GhostLock also escapes containers. If you are running multi-tenant workloads, this is your worst-case scenario. One compromised container, full host compromise.

The exploit works 97% of the time in Nebula's testing. They published working code. Google paid them $92,337 through kernelCTF. The code is now public, which means anyone can run it.

There is a catch to the patch timeline. The original fix landed in April, but it introduced a separate crash bug tracked as CVE-2026-53166. The cleanup for that was still settling upstream in early July. Early patched builds may lack the final version. You need to check your distribution's advisory and confirm the specific fixed package version rather than assuming you are covered.

Ubuntu's status as of early July: newer releases patched, but 24.04 LTS, 22.04 LTS, and 20.04 LTS still listed as vulnerable or in progress. If you are running Ubuntu LTS on production hosts, verify before you assume.

Nebula found this with VEGA, their AI-driven bug-hunting tool. It is part of a pattern. Days earlier researchers disclosed Bad Epoll (CVE-2026-46242), a similar local-to-root flaw in the same stretch of kernel code. Anthropic's Mythos model was credited with finding a related bug in that same area. The tools are now combing through code that has not had human eyes on it in years.

GhostLock is also the second half of a chain Nebula calls IonStack. The first half is CVE-2026-10702, a Firefox sandbox escape. Combined, a single tap on a malicious link takes you from browser to full Android root. Nebula demonstrated this end-to-end. The Android write-up is coming next.

That is why local kernel bugs still matter. On their own, they need a foothold. Bolted onto a browser exploit, they become remote compromise.

Mitigations exist but they are incomplete. RANDOMIZE_KSTACK_OFFSET and STATIC_USERMODE_HELPER make exploitation harder, but they do not fix the underlying bug. Patching is the only real fix.

Priority targets: shared hosts, multi-tenant machines, cloud servers, containers, CI runners. Anywhere an attacker might already have shell access and wants root.

Fifteen years. Every major distribution. That is the scale of old code in critical paths.`,
  },
  {
    slug: "microsoft-entra-passkey-vishing-o-unc-066",
    title: "Microsoft Entra Passkey Vishing: When Phishing-Resistant Auth Becomes the Lure",
    date: "2026-07-10",
    excerpt: "Threat actor O-UNC-066 is weaponizing Microsoft's own passkey enrollment campaigns. Vishing calls direct victims to fake Entra passkey registration flows that enroll attacker-controlled keys instead.",
    category: "IAM",
    readTime: "3 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/07/hackers-use-fake-microsoft-entra.html",
    content: `Okta is tracking a threat actor who figured out something clever. Microsoft's pushing passkey enrollment hard right now. Administrators can run registration campaigns that nudge users to set up passkeys during sign-in. The threat actor, designated O-UNC-066, is using that legitimate feature as cover for account takeover.

The playbook is straightforward. The attacker registers domains with "passkey" in the name. They call targets claiming to be from IT security. The pitch is that the user needs to register a new passkey to stay compliant or secure. Victims who follow the link see a page that looks exactly like Microsoft's passkey enrollment flow.

It is not Microsoft's flow. It is a PHP panel controlled by the attacker. The victim enters credentials, completes MFA, and then, believing they are securing their account, approves the attacker's passkey registration. Now the attacker has persistent access to the Microsoft 365 account with a legitimate passkey enrolled.

What makes this different from standard phishing is the real-time adaptation. The kit operator enters the stolen credentials on the legitimate Microsoft sign-in page while the victim waits on a loading screen. The MFA challenge that appears on the legitimate site, SMS OTP, authenticator TOTP, or push notification with number matching, is relayed to the victim through the phishing interface. The victim completes it, thinking they are verifying their identity. The attacker is actually completing the authentication that grants them access.

Once inside, the operator initiates passkey enrollment. The victim sees a Microsoft-branded page asking them to save a recovery key and confirm their passkey. They do. The passkey that gets enrolled belongs to the attacker.

The sectors targeted so far include food and beverage, technology, healthcare, automotive, construction, and aviation. This is not opportunistic spray-and-pray. The calling and the kit operation suggest some degree of reconnaissance and targeting.

There are two defensive angles here. The first is user training, which is necessary but insufficient. Users cannot be expected to distinguish legitimate passkey enrollment prompts from fake ones when both look identical and both arrive in the context of a phone call from someone claiming to be security.

The second is administrative control. Microsoft allows administrators to configure registration campaigns to drive passkey adoption. That is the feature being abused. Organizations need to audit who has permission to trigger these campaigns and communicate clearly with users about when legitimate enrollment requests will come.

Okta's recommendation is to treat unsolicited passkey enrollment requests as suspicious, regardless of how legitimate the page looks. Verify through a separate channel before completing any enrollment prompted by a phone call or email.

This is the first time I have seen passkey enrollment specifically weaponized as the attack vector. It will not be the last. Any security feature that involves user action can be turned into social engineering material. The sophistication here is not in the technology. It is in the timing and the psychology.`,
  },
  {
    slug: "progress-sharefile-storage-zone-shutdown-urgent",
    title: "Progress Tells ShareFile Customers: Shut Down Storage Zone Controllers Now",
    date: "2026-07-11",
    excerpt: "Progress Software just issued an emergency shutdown order for all ShareFile Storage Zone Controllers. No patch exists yet. If you are running one of these, it needs to go offline immediately.",
    category: "Hardening",
    readTime: "3 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/07/urgent-progress-tells-sharefile.html",
    content: `Progress Software told ShareFile customers to shut down their Storage Zone Controllers yesterday. Not patch them. Shut them down. That is not a subtle difference.

The company confirmed they are responding to a credible external security threat. They have temporarily disabled access to affected accounts and cut off cloud connectivity for unpatched controllers, the same move Citrix made in 2023 when CVE-2023-24489 was being actively exploited.

What Progress has not said is what the threat actually is. No CVE. No technical details. The order became public when a customer posted the company's email to Reddit. Progress confirmed the disruption on their status page, listing Storage Zone Controller customers as not operational.

Here is why the shutdown order matters. If a fix existed, Progress would be telling customers to apply it. The fact that they are ordering full shutdown instead suggests either a zero-day with no patch yet, or something that cannot be fixed with a patch, like stolen signing keys or compromised infrastructure.

The Storage Zone Controller is on-premise software that lets companies keep files on their own storage while using ShareFile's cloud for sharing and management. It usually sits at the network edge, reachable from the internet. That exposure makes it useful and makes it a target.

This is not ShareFile's first incident. In 2023, attackers exploited CVE-2023-24489, an unauthenticated flaw in the same component. CISA added it to the KEV catalog. Citrix cut unpatched controllers off from the cloud, exactly what Progress just did.

Progress has been here before. They own MOVEit, which suffered a mass zero-day exploitation in 2023 that hit more than 2,700 organizations. The company knows what this kind of incident looks like.

If you are running a Storage Zone Controller, the guidance is clear: keep it offline until Progress explains what the threat is and confirms it is safe to restart. Update to version 5.12.4 or later on the 5.x line, or a current 6.x release, but do not treat that as permission to bring the system back online. Progress has not said those versions clear the current threat.

If your controller is internet-facing, treat this as a potential incident. Preserve logs, start your incident response process, and check for unfamiliar .aspx files in web folders or storage paths you did not create. A clean-looking server is not proof it is clean.

The core problem with Storage Zone Controllers is architectural. They bridge internal storage to cloud sharing, which means they must be reachable from the internet and they hold privileged access to internal file systems. When that kind of component has an unpatched vulnerability, there are no good options. You either accept the risk or you shut it down.

Progress chose the shutdown. That tells you how serious this is.`,
  },
  {
    slug: "jscrambler-npm-compromise-rust-infostealer",
    title: "jscrambler npm Package Compromised: Rust Infostealer Drops in Preinstall Hook",
    date: "2026-07-12",
    excerpt: "The jscrambler npm package was compromised on July 11, 2026. Version 8.14.0 contained a preinstall hook that dropped a Rust-based infostealer targeting developer credentials, cloud keys, and AI tool configurations.",
    category: "IAM",
    readTime: "4 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/07/compromised-jscrambler-8140-npm-release.html",
    content: `The jscrambler npm package got hit on July 11. Version 8.14.0 came with a preinstall hook that drops a native binary and runs it during install. Six minutes after publish, Socket flagged it. That is fast, but it might not have been fast enough.

jscrambler is a build-time obfuscation tool. It sits in your development dependencies, runs in CI, handles your source code. That is exactly the kind of package you do not want compromised because it runs in the exact places that hold your keys.

The payload is a Rust infostealer, cross-compiled for Linux, Windows, and macOS. The 8.14.0 release added two files that do not exist in the public source: dist/setup.js and dist/intro.js. The intro.js file is not JavaScript. It is a 7.8MB container with three gzip-compressed native binaries inside.

On install, setup.js picks the binary for your platform, writes it to a random filename in the temp directory, marks it executable, and launches it detached. No prompts. No warnings. Just runs.

The target list is long and familiar if you have been watching these attacks: AWS, Azure, and Google Cloud credentials, including the metadata endpoints CI runners use; cryptocurrency wallets from MetaMask, Phantom, and Exodus; Bitwarden vaults; browser passwords and cookies; Discord, Slack, Telegram, and Steam sessions.

Then there is the newer stuff: config files for AI coding tools like Claude Desktop, Cursor, Windsurf, VS Code, and Zed. These are where your API keys and MCP server credentials live now.

The Linux payload can do something nastier than the rest. It links the kernel's BPF library and can load an eBPF program straight into the kernel from memory. That is kernel-level persistence, not userspace file stealing. StepSecurity and SafeDep both flagged this capability. What the eBPF program actually does is still being pulled apart.

The Windows and macOS builds add anti-debugging checks. Persistence is handled with a hidden Windows scheduled task that relaunches every minute, or a macOS LaunchAgent that reloads on login. The C2 details stay encrypted in the binary.

StepSecurity's runtime monitoring caught the dropped binary reaching two hard-coded IPs and Tor infrastructure. The addresses are 37.27.122[.]124 and 57.128.246[.]79.

Here is the part that gets me. npm 12 shipped on July 8, three days before this release, with install scripts off by default. On npm 12, this preinstall hook does not run unless someone approves it. Older clients run them automatically. The attackers knew this. They aimed for the long tail of npm clients still running the old behavior.

Jscrambler confirmed it was a compromised npm publishing credential. That is one account, one set of credentials, and suddenly a build tool used by thousands of developers is dropping malware in CI pipelines.

Version 8.15.0 replaced 8.14.0 at the top of npm's version list, published from the same account but showing none of the malware signals. The bad versions are still there though. They were deprecated, not pulled. Lockfiles pinned to 8.14.0 will keep installing the stealer.

If you think you might have pulled this, check your lockfiles for jscrambler@8.14.0. Check your temp directories for hidden files with random names. On Windows, look for hidden scheduled tasks. On macOS, inspect LaunchAgents.

If you installed it, rotate everything. Cloud keys, npm tokens, GitHub tokens, AI tool API keys. Revoke sessions. Move crypto out of wallets on that host.

The cleanup was fast, but a stealer works in the seconds after install. By the time 8.15.0 replaced it at the top of the list, your credentials might already be gone.`,
  },
  {
    slug: "forg365-phaas-microsoft365-device-code-phishing",
    title: "Forg365 PhaaS Targets Microsoft 365 with Device Code and AitM Session Theft",
    date: "2026-07-13",
    excerpt: "A new phishing-as-a-service operation called Forg365 is targeting Microsoft 365 accounts using device code phishing combined with adversary-in-the-middle tactics. The platform costs $400 a month and is distributed via Telegram.",
    category: "IAM",
    readTime: "4 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/07/forg365-phaas-targets-microsoft-365.html",
    content: `A new phishing-as-a-service operation called Forg365 is targeting Microsoft 365 accounts using device code phishing combined with adversary-in-the-middle tactics. The platform costs $400 a month and is distributed via Telegram.

Forg365 uses legitimate email delivery infrastructure like Amazon SES and Twilio SendGrid to blend into normal email traffic. Business document and remittance approval lures are the common entry point.

The platform's operator panel at logfriend[.]com lets customers generate lures, set up campaigns, and manage captured tokens. For device-auth phishing, victims see real Microsoft authentication surfaces but the code authorizes an attacker-controlled session.

For AitM attacks, Forg365 uses route tokens and session cookies to decide whether to serve phishing content or benign decoys. If a VPN is detected, the kit redirects to harmless content instead.

A browser extension called ForgCookie handles persistent access. It requests account data from the backend, clears Microsoft session cookies, injects refresh-token credentials, and triggers silent OAuth flows. The result is continued access to compromised accounts without repeated authentication.

The platform also offers post-compromise features. Operators can monitor email accounts for specific keywords and draft AI-assisted responses to particular threads.

This is part of a broader trend. Similar PhaaS ecosystems include Kali365, Sneaky 2FA, The Quarry, and EvilTokens. These kits industrialize phishing by combining lure creation, delivery infrastructure, token handling, and post-compromise operations into subscription models that require minimal technical skill.

The practical takeaway is straightforward: block device code authentication unless required. Review mailbox artifacts after device code events. Audit mail-flow rules. And decommission legacy email aliases that still forward to active mailboxes. Attackers are using these historical identities to deliver messages that look like normal forwarded correspondence.`,
  },
  {
    slug: "oauth-client-id-spoofing-entra-credential-validation",
    title: "OAuth Client ID Spoofing Lets Attackers Validate Stolen Microsoft Entra Credentials",
    date: "2026-07-14",
    excerpt: "Attackers found a way to test stolen Microsoft Entra credentials without leaving a sign-in trace. They are using it at scale.",
    category: "IAM",
    readTime: "4 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "The Hacker News|https://thehackernews.com/2026/07/oauth-client-id-spoofing-lets-attackers.html",
    content: `Proofpoint caught two threat actor campaigns exploiting a blind spot in Entra ID sign-in telemetry. The technique lets attackers enumerate accounts and validate passwords without ever generating a successful sign-in event. Your logs will show nothing useful.

The trick is OAuth client ID spoofing. Entra returns different error responses depending on whether a supplied OAuth client ID is valid. Attackers weaponize this to infer valid usernames and correct passwords at scale, effectively checking stolen credential lists without logging a successful login.

Here is how it works. The attacker submits an authentication request to Microsoft's OAuth 2.0 token endpoint using the Resource Owner Password Credentials (ROPC) flow. They supply a syntactically valid client ID that does not correspond to any real application. Entra does not reject malformed UUIDs outright. Instead, it returns an AADSTS error code that reveals whether the account exists and whether the password is correct.

The sign-in logs capture the application ID but leave the application name blank. Detections that look for surges against a specific application name miss this entirely. Conditional Access policies scoped to specific applications do not trigger either.

Proofpoint identified two campaigns using this technique:

UNK_pyreq2323 ran from January through March 2026 from AWS infrastructure. They used more than 700,000 spoofed client IDs to target over one million accounts across nearly 4,000 tenants. Roughly 28 percent of targeted users hit account lockout thresholds due to failed attempts. The campaign modified trailing digits of known application IDs and reused spoofed IDs across up to 12 users.

UNK_OutFlareAZ started in December 2025 and leveraged Cloudflare infrastructure. They targeted over two million users with 3.7 million randomized spoofed application IDs. Unlike the first campaign, they generated a unique client ID per request. They also enumerated users alphabetically.

Both campaigns used valid UUIDs rather than malformed identifiers, which suggests they are working from precompiled username wordlists.

The implications are straightforward. Attackers can validate stolen credentials against your Entra ID environment without triggering traditional detection logic. By fragmenting authentication attempts across many fictional applications, the activity becomes harder to correlate. Standard rate limiting and per-application detection patterns do not catch it.

There is no patch for this behavior. It is a design characteristic of how Entra handles OAuth client ID validation. Detection strategies need to account for blank application names in sign-in logs and monitor for patterns of authentication attempts that do not align with legitimate application usage.

The campaigns are ongoing. If you are running Entra ID, your credentials are being tested this way whether you see it or not.`,
  },
  {
    slug: "cisa-github-leak-postmortem-lessons",
    title: "CISA's GitHub Leak Postmortem: What Actually Went Wrong",
    date: "2026-07-18",
    excerpt: "CISA published a postmortem on the GitHub leak that exposed AWS GovCloud credentials for six months. The contractor ignored nine automated alerts. CISA took 48+ hours to rotate keys after notification. The report is worth reading.",
    category: "IAM",
    readTime: "3 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "KrebsOnSecurity|https://krebsonsecurity.com/2026/07/lessons-learned-from-cisas-recent-github-leak/",
    content: `A CISA contractor pushed 844 MB of sensitive data to a public GitHub repository called 'Private CISA' and left it there for six months. The repo included AWS GovCloud admin credentials, plaintext passwords for internal systems, and a file literally named 'importantAWStokens.'

GitGuardian's scanner found it. Their systems sent nine automated alerts to the repository owner. All nine were ignored. On May 15, a GitGuardian researcher contacted KrebsOnSecurity for help escalating. CISA acknowledged the alert quickly. Then they took more than 48 hours to invalidate the exposed keys.

The postmortem CISA published this week is unusually honest about why. Their incident response playbook covered 'cybersecurity incidents' but not 'someone committed our keys to GitHub.' The notification went to the vulnerability disclosure platform, which is meant for product bugs, not infrastructure leaks. The AWS key rotation required coordination across federal and industry partners and took longer than it should have.

CISA is fixing the reporting channels. They are also advocating something I did not expect: continuous secrets scanning. Not quarterly audits. Continuous. Valadon from GitGuardian noted this is the first time a national cybersecurity agency has publicly pushed for both secrets scanning and clearer researcher communication.

The contractor had their access revoked. The keys are rotated. The logs show no evidence of unauthorized use. But the six-month window and the 48-hour response lag are the real story. If the country's lead cybersecurity agency can miss nine alerts and take two days to rotate compromised credentials, the rest of us need to look hard at our own detection and response times.

If you are running GitHub Enterprise: organization-level secret scanning should not be opt-out. Static AWS credentials should not exist in repositories at all. GovCloud supports IAM Roles Anywhere and OIDC federation. The tools to prevent this are available. CISA is now saying publicly that they should have been using them.`,
  },
];

export const postSlugs = posts.map((post) => post.slug);
