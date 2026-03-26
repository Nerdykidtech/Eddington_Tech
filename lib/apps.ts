export interface AppItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
  subdomain?: string; // e.g. "autheris" for autheris.eddington.tech
  icon?: string; // emoji or icon name
  appStoreUrl?: string;
}

export const apps: AppItem[] = [
  {
    id: "autheris",
    name: "Autheris",
    tagline: "Secure 2FA Token Manager",
    description:
      "An iOS app that stores your two-factor authentication codes on device with encryption. Add tokens by scanning QR codes, tap to copy codes, and keep everything private with optional blur and app-switcher hiding.",
    href: "/autheris",
    subdomain: "autheris",
    icon: "🔐",
    appStoreUrl: "https://apps.apple.com/us/app/autheris/id6760686327",
  },
  // Add more apps here as you build them:
  // { id: "otherapp", name: "Other App", ... },
];
