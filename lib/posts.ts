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
    slug: "nexus-idscan-license-breach-153m",
    title: "153 Million Driver License Scans for Sale: How the Nexus Breach Exposed the Identity Verification Supply Chain",
    date: "2026-09-02",
    excerpt: "A dark web service called Nexus is selling scans of 153 million US and Canadian driver licenses, traced to a breach at idscan.net. Here is how the attack worked, what it exposes about the identity verification vendor ecosystem, and how defenders can hunt for evidence of compromise in their own systems.",
    category: "IAM",
    readTime: "7 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "KrebsOnSecurity|https://krebsonsecurity.com/2026/09/fbi-probes-service-selling-153m-drivers-licenses/",
    content: `A dark web identity theft service launched this week is selling digital scans of more than 153 million US and Canadian driver licenses, along with 10 million ID cards, 3 million travel documents, and at least 579,000 medical cards. The FBI opened an official inquiry on September 2, 2026. The trail leads to a Louisiana-based identity verification company called idscan.net.

This is not a credit card breach. It is not a retail data breach. It is a breach of the physical identity verification infrastructure that thousands of American businesses use to check who is sitting in front of them. That makes it different in kind from the breaches the security industry has learned to categorize, contain, and communicate about. Driver license data is permanent in a way that financial data is not. You cannot cancel a license and get a new one the way you cancel a card and get a new number.

## How the Breach Works

idscan.net provides identity verification services that scan driver licenses using both infrared and ultraviolet light. Their technology performs more than 21 million verifications per month at over 20,000 locations across the United States and internationally. Their customer list includes Hertz, Target, FedEx, Motorola Solutions, the financial services firm Jack Henry, and Caesars Entertainment. They have an exclusive agreement to verify IDs at Planet13 marijuana dispensaries across multiple states.

The KrebsOnSecurity reporting traced the breach data to rental car transactions at Hertz. When Krebs' mother handed her license to a Hertz representative, the timestamp on the resulting stolen record was within seconds of Krebs' own license scan from the same transaction. Multiple federal employees who helped with the investigation confirmed they had scanned licenses at Hertz on dates matching their exposed records. Krebs' own record tied to a June 2025 flight where he did not actually show his license at the airport TSA checkpoint, ruling out airports as the common point.

idscan.net's documentation states their systems capture infrared and ultraviolet scans of identity documents. That is not a standard optical camera scan. Infrared scanning reads document security features invisible to the human eye. UV scanning reveals fluorescent inks and holograms used in modern IDs. These are high-fidelity document captures, not simple photos. The stolen data reportedly includes front and back scans, IR versions, UV versions, and metadata including timestamps.

The Nexus service adds roughly 400,000 new records per day, suggesting an active, ongoing exfiltration rather than a one-time dump. The attackers have maintained access to idscan.net's data pipeline for over a year, according to Nexus's own posts on the Russian cybercrime forum Exploit.

## The Vendor Concentration Problem

idscan.net sits in the middle of a vendor chain that connects physical retail, car rental, hospitality, financial services, and government-adjacent facilities. One breach at a single vendor exposes records from all of its downstream customers simultaneously.

Consider what a driver license scan contains that a credit card number does not:

- Full legal name
- Home address
- Date of birth
- Driver license number (linked to the DMV in the issuing state)
- Photo
- Physical document security features (IR/UV data)
- Signature

This data enables identity theft at scale. With a license scan, an attacker can:
- Open lines of credit in someone else's name
- Pass knowledge-based authentication at financial institutions
- Create synthetic identities by merging real and fabricated data
- Impersonate the person at physical entry points
- Establish accounts at services that require identity verification

The license number is particularly valuable because it persists across address changes, card renewals, and most life events. It is a lifetime identifier in a way that a Social Security Number, despite being sensitive, is not typically printed on a license.

## Detection: Hunting for Evidence of License Data Exfiltration

Organizations using idscan.net or similar ID verification vendors should assume their scanned data may have been exposed. The following detection logic helps determine whether exfiltration occurred.

### SIGMA Rule: High-Volume License API Queries

This rule detects anomalous query volumes against ID verification APIs, which could indicate unauthorized access to the data pipeline.

```yaml
title: Anomalous ID Verification API Volume
id: 9001
status: experimental
description: Detects spikes in ID verification API calls that exceed baseline by more than 5x
logsource:
  product: api-gateway
  service: id-verification
detection:
  selection:
    endpoint|contains: '/verify/id'
    response_size: '>10000'
  timeframe:
    volume_spike:
      count: '>5000'
      timeframe: 1h
  condition: volume_spike
fields:
  - src_ip
  - user_agent
  - response_size
  - timestamp
level: high
tags:
  - attack.exfiltration
  - attack.t1074
```

### SIGMA Rule: Bulk Data Export from ID Verification System

```yaml
title: Bulk License Record Export
id: 9002
status: experimental
description: Detects export or bulk download activity on ID verification databases
logsource:
  product: database
  service: id_verification
detection:
  selection:
    query_type: 'SELECT'
    rows_returned: '>1000'
    destination: 'external_ip'
  timeframe:
    count: '>10'
    timeframe: 5m
  condition: timeframe
fields:
  - source_ip
  - destination_ip
  - query_pattern
  - rows_returned
level: critical
tags:
  - attack.exfiltration
  - attack.t1041
```

### Threat Hunting: Network-Level Indicators

Look for the following at the network layer. These indicators reflect patterns observed in the Nexus service operations:

```bash
# Hunt for outbound connections to known dark web infrastructure
# Check DNS query logs for domains associated with Nexus
# Note: domains rotate frequently; focus on query volume anomalies

# Look for TLS connections to known dark web hosting IPs
# on port 443 with certificate patterns matching bulletproof hosting
suricata rule:
  alert tls any any -> $any any (msg:"TLS to known dark web id verification shop"; \\
    tls.cert_subject; content:"C=US"; content!"O=Legitimate"; \\
    classtype:attempted-info-leak; sid:9003; rev:1;)

# Monitor for large outbound data transfers from ID verification servers
zeek notice for large HTTP POST bodies to external destinations
```

### YARA Rule: Detecting Stolen License Data Storage Patterns

```yaml
rule nexus_license_storage_pattern
{
    meta:
        description = "Detects files storing scraped license data with timestamp patterns"
        author = "Eddington Tech"
        date = "2026-09-02"
        reference = "KrebsOnSecurity Nexus Breach"
    strings:
        $dl_header = "DRIVER LICENSE"
        $scan_type_1 = "INFRARED_SCAN"
        $scan_type_2 = "UV_SCAN"
        $timestamp_pattern = /20[0-9]{2}[0-9]{2}[0-9]{2}_[0-9]{6}/
        $hex_sig_1 = { 89 50 4E 47 } // PNG signature
        $hex_sig_2 = { FF D8 FF E0 } // JPEG signature
    condition:
        3 of them
}
```

## Incident Response Playbook

### For Organizations Using idscan.net

If your organization processes customer IDs through idscan.net or a similar vendor:

**Hours 0-24: Initial Assessment**

1. Contact your idscan.net account team and request a formal breach notification. Do not assume they will notify you proactively.
2. Identify all internal systems that receive, store, or transmit ID scan data from this vendor. Map the full data flow.
3. Determine retention periods: how long does your organization store ID scans? Are they encrypted at rest? Who has access?
4. Check access logs for your ID verification integration for the past 12 months. Look for unusual query patterns, after-hours access, or access from unexpected IP ranges.
5. Review whether your organization stores raw IR/UV scans or only verification result flags (pass/fail). Storing raw scans dramatically increases your exposure surface.

**Days 2-7: Containment and Notification**

1. If evidence of unauthorized access exists: assume all stored ID scans for all customers processed through this vendor are exposed.
2. Determine legal notification obligations by state. Most states require notification within 30-60 days of discovery. The relevant trigger is when your organization "discovered" the breach, not when the vendor discovered it.
3. For financial services customers: consider placing fraud alerts with major credit bureaus (Equifax, Experian, TransUnion). This does not prevent credit checks but makes them more visible.
4. For healthcare-adjacent organizations: if medical cards were among the exposed data types, HIPAA notification requirements may apply.

**Days 8-30: Long-Term Risk Management**

1. Conduct a vendor risk review. Request evidence of idscan.net's security controls, including their encryption architecture, access logging, and network segmentation.
2. Evaluate whether your organization's use case actually requires storing the full ID scan, or whether a verification result (yes/no/fraud score) would suffice.
3. Update your vendor due diligence process to include supply chain mapping. If a vendor processes data for 20,000 locations, one breach exposes all 20,000 simultaneously.
4. Review your own data retention policy for identity documents. Delete scans that are no longer needed for the original purpose.

### For Hertz and idscan.net Customers

If your organization uses idscan.net or processes IDs at Hertz locations:

1. Assume the full license scan of every customer who transacted at your location is exposed.
2. Notify affected customers per your state breach notification statute.
3. Coordinate with idscan.net on the technical root cause. Ask specifically: was the exfiltration an insider threat, an external intrusion, or a compromised integration endpoint?
4. Request idscan.net's incident response report when available.
5. If you collected SSNs or other PII alongside license data, prioritize those records in your breach response.

## The Supply Chain Reality

The identity verification industry operates with limited transparency. ID scanning terminals at car rental counters, dispensaries, hotels, and retail locations process millions of scans per day. The vendors who build these systems sit between the physical world and digital identity infrastructure, and their security posture varies enormously.

idscan.net's "trust" page lists customers including Caesars Entertainment, Jack Henry, Target, and FedEx. These organizations trust idscan.net to handle the physical-to-digital identity boundary. When that vendor is breached, the exposure is not a row in a spreadsheet. It is a systematic compromise of the verification infrastructure itself.

The timestamps on Krebs' stolen records, matching his rental car transaction within seconds, confirm the exfiltration is tied to specific scanning events. The data is not coming from a centralized database that was dumped all at once. It is a live pipeline capturing each scan as it happens.

The FBI investigation will reveal the technical mechanism. Possible vectors include:
- Compromised API credentials for idscan.net's customer portal
- A malicious insider with database access
- An exploitation of idscan.net's scanning hardware or software
- A supply chain compromise at a sub-processor

Until the investigation concludes, organizations using ID verification vendors should audit their own data flows. Ask specifically: do we need to store this data, or can we store only the result?

## IOCs and Threat Intel

| Indicator | Type | Description |
|-----------|------|-------------|
| idscan.net | Victim Domain | Identity verification company confirmed as breach source |
| Planet13 | Dispensary Chain | Entity identified as idscan.net customer with confirmed breach involvement |
| Nexus | Threat Actor Service | Dark web identity theft service selling stolen license scans |
| 153M+ | Record Count | Driver licenses exposed in this breach |
| 400K/day | Exfil Rate | Approximate daily growth in exposed records |
| Hertz | Location | Rental car company identified as breach touchpoint |
| 21M/month | Processing Volume | idscan.net monthly verification volume |
| Exploit forum | C2 Advertising | Russian cybercrime forum where Nexus advertised |

## Conclusion

The Nexus breach is not a new category of incident. It is a familiar pattern applied to an underprotected category of data. Identity verification vendors process some of the most sensitive physical documents in existence, and they do it at enormous scale with limited external security scrutiny.

What makes this breach different is the permanence of the exposed data. A driver license scan with IR/UV security feature data can be used to impersonate someone at physical and digital identity checkpoints for years. There is no patch for that.

The immediate action is for organizations using idscan.net or similar vendors to assume breach and act accordingly. The longer-term action is to stop treating ID verification vendors as low-risk processing infrastructure and start treating them as high-value identity data stores requiring appropriate access controls, retention limits, and continuous monitoring.

The FBI inquiry may reveal how the exfiltration occurred. Until then, the best defensive move is to audit what you are handing over to these vendors, how long you keep it, and who can reach it.

## Related Reading

- [n8n Token Exchange Flaw Lets Attackers Log In As Other Users](/blog/n8n-token-exchange-cve-2026-59208) — on JWT issuer claim ignoring and its consequences for identity systems
- [RustDuck Botnet Rebuilds in Rust to Hijack Routers and IoT for DDoS](/blog/rustduck-botnet-iot-ddos-hardening) — on how modern botnets use free dynamic DNS services to obscure C2
- [Microsoft Patches a Record 570 Security Flaws](/blog/microsoft-record-570-patch-tuesday-july-2026) — on AI-driven bug discovery outpacing human patch cycles
- [Malicious LiteLLM Releases: How TeamTPC Used Fake LLM Packages](/blog/malicious-litellm-releases-teampcp) — on how attackers exploit developer trust in AI tooling supply chains
];

export const postSlugs = posts.map((post) => post.slug);
  {
    slug: "nexus-idscan-license-breach-153m",
    title: "153 Million Driver License Scans for Sale: How the Nexus Breach Exposed the Identity Verification Supply Chain",
    date: "2026-09-02",
    excerpt: "A dark web service called Nexus is selling scans of 153 million US and Canadian driver licenses, traced to a breach at idscan.net. Here is how the attack worked, what it exposes about the identity verification vendor ecosystem, and how defenders can hunt for evidence of compromise in their own systems.",
    category: "IAM",
    readTime: "7 min",
    author: "Hunter Eddington",
    image: "https://eddington.tech/og-image.png",
    source: "KrebsOnSecurity|https://krebsonsecurity.com/2026/09/fbi-probes-service-selling-153m-drivers-licenses/",
    content: `A dark web identity theft service launched this week is selling digital scans of more than 153 million US and Canadian driver licenses, along with 10 million ID cards, 3 million travel documents, and at least 579,000 medical cards. The FBI opened an official inquiry on September 2, 2026. The trail leads to a Louisiana-based identity verification company called idscan.net.

This is not a credit card breach. It is not a retail data breach. It is a breach of the physical identity verification infrastructure that thousands of American businesses use to check who is sitting in front of them. That makes it different in kind from the breaches the security industry has learned to categorize, contain, and communicate about. Driver license data is permanent in a way that financial data is not. You cannot cancel a license and get a new one the way you cancel a card and get a new number.

## How the Breach Works

idscan.net provides identity verification services that scan driver licenses using both infrared and ultraviolet light. Their technology performs more than 21 million verifications per month at over 20,000 locations across the United States and internationally. Their customer list includes Hertz, Target, FedEx, Motorola Solutions, the financial services firm Jack Henry, and Caesars Entertainment. They have an exclusive agreement to verify IDs at Planet13 marijuana dispensaries across multiple states.

The KrebsOnSecurity reporting traced the breach data to rental car transactions at Hertz. When Krebs' mother handed her license to a Hertz representative, the timestamp on the resulting stolen record was within seconds of Krebs' own license scan from the same transaction. Multiple federal employees who helped with the investigation confirmed they had scanned licenses at Hertz on dates matching their exposed records. Krebs' own record tied to a June 2025 flight where he did not actually show his license at the airport TSA checkpoint, ruling out airports as the common point.

idscan.net's documentation states their systems capture infrared and ultraviolet scans of identity documents. That is not a standard optical camera scan. Infrared scanning reads document security features invisible to the human eye. UV scanning reveals fluorescent inks and holograms used in modern IDs. These are high-fidelity document captures, not simple photos. The stolen data reportedly includes front and back scans, IR versions, UV versions, and metadata including timestamps.

The Nexus service adds roughly 400,000 new records per day, suggesting an active, ongoing exfiltration rather than a one-time dump. The attackers have maintained access to idscan.net's data pipeline for over a year, according to Nexus's own posts on the Russian cybercrime forum Exploit.

## The Vendor Concentration Problem

idscan.net sits in the middle of a vendor chain that connects physical retail, car rental, hospitality, financial services, and government-adjacent facilities. One breach at a single vendor exposes records from all of its downstream customers simultaneously.

Consider what a driver license scan contains that a credit card number does not:

- Full legal name
- Home address
- Date of birth
- Driver license number (linked to the DMV in the issuing state)
- Photo
- Physical document security features (IR/UV data)
- Signature

This data enables identity theft at scale. With a license scan, an attacker can:
- Open lines of credit in someone else's name
- Pass knowledge-based authentication at financial institutions
- Create synthetic identities by merging real and fabricated data
- Impersonate the person at physical entry points
- Establish accounts at services that require identity verification

The license number is particularly valuable because it persists across address changes, card renewals, and most life events. It is a lifetime identifier in a way that a Social Security Number, despite being sensitive, is not typically printed on a license.

## Detection: Hunting for Evidence of License Data Exfiltration

Organizations using idscan.net or similar ID verification vendors should assume their scanned data may have been exposed. The following detection logic helps determine whether exfiltration occurred.

### SIGMA Rule: High-Volume License API Queries

This rule detects anomalous query volumes against ID verification APIs, which could indicate unauthorized access to the data pipeline.

```yaml
title: Anomalous ID Verification API Volume
id: 9001
status: experimental
description: Detects spikes in ID verification API calls that exceed baseline by more than 5x
logsource:
  product: api-gateway
  service: id-verification
detection:
  selection:
    endpoint|contains: '/verify/id'
    response_size: '>10000'
  timeframe:
    volume_spike:
      count: '>5000'
      timeframe: 1h
  condition: volume_spike
fields:
  - src_ip
  - user_agent
  - response_size
  - timestamp
level: high
tags:
  - attack.exfiltration
  - attack.t1074
```

### SIGMA Rule: Bulk Data Export from ID Verification System

```yaml
title: Bulk License Record Export
id: 9002
status: experimental
description: Detects export or bulk download activity on ID verification databases
logsource:
  product: database
  service: id_verification
detection:
  selection:
    query_type: 'SELECT'
    rows_returned: '>1000'
    destination: 'external_ip'
  timeframe:
    count: '>10'
    timeframe: 5m
  condition: timeframe
fields:
  - source_ip
  - destination_ip
  - query_pattern
  - rows_returned
level: critical
tags:
  - attack.exfiltration
  - attack.t1041
```

### Threat Hunting: Network-Level Indicators

Look for the following at the network layer. These indicators reflect patterns observed in the Nexus service operations:

```bash
# Hunt for outbound connections to known dark web infrastructure
# Check DNS query logs for domains associated with Nexus
# Note: domains rotate frequently; focus on query volume anomalies

# Look for TLS connections to known dark web hosting IPs
# on port 443 with certificate patterns matching bulletproof hosting
suricata rule:
  alert tls any any -> $any any (msg:"TLS to known dark web id verification shop"; \\
    tls.cert_subject; content:"C=US"; content!"O=Legitimate"; \\
    classtype:attempted-info-leak; sid:9003; rev:1;)

# Monitor for large outbound data transfers from ID verification servers
zeek notice for large HTTP POST bodies to external destinations
```

### YARA Rule: Detecting Stolen License Data Storage Patterns

```yaml
rule nexus_license_storage_pattern
{
    meta:
        description = "Detects files storing scraped license data with timestamp patterns"
        author = "Eddington Tech"
        date = "2026-09-02"
        reference = "KrebsOnSecurity Nexus Breach"
    strings:
        $dl_header = "DRIVER LICENSE"
        $scan_type_1 = "INFRARED_SCAN"
        $scan_type_2 = "UV_SCAN"
        $timestamp_pattern = /20[0-9]{2}[0-9]{2}[0-9]{2}_[0-9]{6}/
        $hex_sig_1 = { 89 50 4E 47 } // PNG signature
        $hex_sig_2 = { FF D8 FF E0 } // JPEG signature
    condition:
        3 of them
}
```

## Incident Response Playbook

### For Organizations Using idscan.net

If your organization processes customer IDs through idscan.net or a similar vendor:

**Hours 0-24: Initial Assessment**

1. Contact your idscan.net account team and request a formal breach notification. Do not assume they will notify you proactively.
2. Identify all internal systems that receive, store, or transmit ID scan data from this vendor. Map the full data flow.
3. Determine retention periods: how long does your organization store ID scans? Are they encrypted at rest? Who has access?
4. Check access logs for your ID verification integration for the past 12 months. Look for unusual query patterns, after-hours access, or access from unexpected IP ranges.
5. Review whether your organization stores raw IR/UV scans or only verification result flags (pass/fail). Storing raw scans dramatically increases your exposure surface.

**Days 2-7: Containment and Notification**

1. If evidence of unauthorized access exists: assume all stored ID scans for all customers processed through this vendor are exposed.
2. Determine legal notification obligations by state. Most states require notification within 30-60 days of discovery. The relevant trigger is when your organization "discovered" the breach, not when the vendor discovered it.
3. For financial services customers: consider placing fraud alerts with major credit bureaus (Equifax, Experian, TransUnion). This does not prevent credit checks but makes them more visible.
4. For healthcare-adjacent organizations: if medical cards were among the exposed data types, HIPAA notification requirements may apply.

**Days 8-30: Long-Term Risk Management**

1. Conduct a vendor risk review. Request evidence of idscan.net's security controls, including their encryption architecture, access logging, and network segmentation.
2. Evaluate whether your organization's use case actually requires storing the full ID scan, or whether a verification result (yes/no/fraud score) would suffice.
3. Update your vendor due diligence process to include supply chain mapping. If a vendor processes data for 20,000 locations, one breach exposes all 20,000 simultaneously.
4. Review your own data retention policy for identity documents. Delete scans that are no longer needed for the original purpose.

### For Hertz and idscan.net Customers

If your organization uses idscan.net or processes IDs at Hertz locations:

1. Assume the full license scan of every customer who transacted at your location is exposed.
2. Notify affected customers per your state breach notification statute.
3. Coordinate with idscan.net on the technical root cause. Ask specifically: was the exfiltration an insider threat, an external intrusion, or a compromised integration endpoint?
4. Request idscan.net's incident response report when available.
5. If you collected SSNs or other PII alongside license data, prioritize those records in your breach response.

## The Supply Chain Reality

The identity verification industry operates with limited transparency. ID scanning terminals at car rental counters, dispensaries, hotels, and retail locations process millions of scans per day. The vendors who build these systems sit between the physical world and digital identity infrastructure, and their security posture varies enormously.

idscan.net's "trust" page lists customers including Caesars Entertainment, Jack Henry, Target, and FedEx. These organizations trust idscan.net to handle the physical-to-digital identity boundary. When that vendor is breached, the exposure is not a row in a spreadsheet. It is a systematic compromise of the verification infrastructure itself.

The timestamps on Krebs' stolen records, matching his rental car transaction within seconds, confirm the exfiltration is tied to specific scanning events. The data is not coming from a centralized database that was dumped all at once. It is a live pipeline capturing each scan as it happens.

The FBI investigation will reveal the technical mechanism. Possible vectors include:
- Compromised API credentials for idscan.net's customer portal
- A malicious insider with database access
- An exploitation of idscan.net's scanning hardware or software
- A supply chain compromise at a sub-processor

Until the investigation concludes, organizations using ID verification vendors should audit their own data flows. Ask specifically: do we need to store this data, or can we store only the result?

## IOCs and Threat Intel

| Indicator | Type | Description |
|-----------|------|-------------|
| idscan.net | Victim Domain | Identity verification company confirmed as breach source |
| Planet13 | Dispensary Chain | Entity identified as idscan.net customer with confirmed breach involvement |
| Nexus | Threat Actor Service | Dark web identity theft service selling stolen license scans |
| 153M+ | Record Count | Driver licenses exposed in this breach |
| 400K/day | Exfil Rate | Approximate daily growth in exposed records |
| Hertz | Location | Rental car company identified as breach touchpoint |
| 21M/month | Processing Volume | idscan.net monthly verification volume |
| Exploit forum | C2 Advertising | Russian cybercrime forum where Nexus advertised |

## Conclusion

The Nexus breach is not a new category of incident. It is a familiar pattern applied to an underprotected category of data. Identity verification vendors process some of the most sensitive physical documents in existence, and they do it at enormous scale with limited external security scrutiny.

What makes this breach different is the permanence of the exposed data. A driver license scan with IR/UV security feature data can be used to impersonate someone at physical and digital identity checkpoints for years. There is no patch for that.

The immediate action is for organizations using idscan.net or similar vendors to assume breach and act accordingly. The longer-term action is to stop treating ID verification vendors as low-risk processing infrastructure and start treating them as high-value identity data stores requiring appropriate access controls, retention limits, and continuous monitoring.

The FBI inquiry may reveal how the exfiltration occurred. Until then, the best defensive move is to audit what you are handing over to these vendors, how long you keep it, and who can reach it.

## Related Reading

- [n8n Token Exchange Flaw Lets Attackers Log In As Other Users](/blog/n8n-token-exchange-cve-2026-59208) — on JWT issuer claim ignoring and its consequences for identity systems
- [RustDuck Botnet Rebuilds in Rust to Hijack Routers and IoT for DDoS](/blog/rustduck-botnet-iot-ddos-hardening) — on how modern botnets use free dynamic DNS services to obscure C2
- [Microsoft Patches a Record 570 Security Flaws](/blog/microsoft-record-570-patch-tuesday-july-2026) — on AI-driven bug discovery outpacing human patch cycles
- [Malicious LiteLLM Releases: How TeamTPC Used Fake LLM Packages](/blog/malicious-litellm-releases-teampcp) — on how attackers exploit developer trust in AI tooling supply chains
