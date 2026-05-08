export interface ToolItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  icon?: string;
  category: "identity" | "security" | "infrastructure" | "productivity";
}

export const tools: ToolItem[] = [
  {
    id: "authentik",
    name: "authentik",
    tagline: "Open-source identity provider",
    description:
      "SSO and identity provider with OIDC, SAML, and OAuth support. Self-hosted, fully customizable, and built for teams that need control without the enterprise price tag.",
    url: "https://goauthentik.io",
    icon: "🔐",
    category: "identity",
  },
  {
    id: "bitwarden",
    name: "Bitwarden",
    tagline: "Open-source password manager",
    description:
      "End-to-end encrypted password vault with passkeys, TOTP, sharing, and vault health reports. Self-hostable or use their cloud. Zero knowledge architecture.",
    url: "https://bitwarden.com",
    icon: "🔒",
    category: "security",
  },
  {
    id: "tailscale",
    name: "Tailscale",
    tagline: "Zero-trust VPN mesh",
    description:
      "WireGuard-based mesh VPN that makes your devices talk to each other securely without punching holes in firewalls. Auth through your existing identity provider.",
    url: "https://tailscale.com",
    icon: "🌊",
    category: "infrastructure",
  },
  {
    id: "crowdsec",
    name: "CrowdSec",
    tagline: "Open-source threat intelligence",
    description:
      "Behavior-based intrusion detection that shares threat data across its community. Blocks brute force, scrapers, and exploit attempts with auto-remediation.",
    url: "https://crowdsec.net",
    icon: "🛡️",
    category: "security",
  },
  {
    id: "vault",
    name: "HashiCorp Vault",
    tagline: "Secrets management",
    description:
      "Centralized secrets, encryption as a service, and PKI automation. Dynamic credentials, lease management, and audit logs out of the box.",
    url: "https://www.vaultproject.io",
    icon: "🗄️",
    category: "infrastructure",
  },
  {
    id: "n8n",
    name: "n8n",
    tagline: "Workflow automation",
    description:
      "Open-source workflow automation with 400+ integrations. Self-host it, own your data, and chain together any service without writing glue code.",
    url: "https://n8n.io",
    icon: "⚙️",
    category: "productivity",
  },
];