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
    tagline: "Two-factor codes that never leave your device",
    description:
      "A free, open-source 2FA authenticator for iPhone, iPad, Mac and Apple Watch. Codes live in your Keychain with no account and no server, with App Lock, privacy blur and optional end-to-end encrypted iCloud Sync.",
    href: "/autheris",
    subdomain: "autheris",
    icon: "🔐",
    appStoreUrl: "https://apps.apple.com/us/app/autheris/id6760686327",
  },
  // Add more apps here as you build them:
  // { id: "otherapp", name: "Other App", ... },
];
