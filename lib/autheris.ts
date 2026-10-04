// Launch facts for Autheris, sourced from autheris.app, its release notes and
// the App Store listing. Keep these in sync when a new version ships.

export const autherisLinks = {
  appStore: "https://apps.apple.com/us/app/autheris/id6760686327",
  site: "https://autheris.app",
  releaseNotes: "https://autheris.app/release-notes",
  source: "https://github.com/nerdykidtech/Autheris",
  support: "mailto:autheris@eddington.tech",
};

export const latestVersion = "3.0";

export const launchStats = [
  { value: "1.0 → 3.0", label: "Shipped since launch" },
  { value: "14", label: "App Store releases" },
  { value: "4", label: "Apple platforms" },
  { value: "0", label: "Servers holding your codes" },
];

export const platforms = ["iPhone", "iPad", "Mac", "Apple Watch"];

// Milestones from the public release notes, oldest first.
export const milestones = [
  { version: "1.0", title: "Launch", detail: "TOTP codes, QR import, backup & restore, privacy blur." },
  { version: "1.3", title: "iCloud Sync", detail: "Optional end-to-end encrypted sync across devices." },
  { version: "2.0", title: "Redesign", detail: "New home screen, App Lock with Face ID, encrypted backups." },
  { version: "2.1", title: "iPad", detail: "Grid layout built for the bigger canvas." },
  { version: "2.2", title: "Mac", detail: "Native macOS app with screen-recording protection." },
  { version: "2.4", title: "Apple Watch", detail: "Read-only codes on your wrist." },
  { version: "2.5", title: "7 languages", detail: "Spanish, French, German, Japanese, Chinese, Portuguese." },
  { version: "3.0", title: "Add to Autheris", detail: "One-tap setup from apps that integrate with it." },
];

export const features = [
  {
    title: "Codes stay in your Keychain",
    description: "No account, no server, no tracking. Secrets are stored on-device and never phone home.",
  },
  {
    title: "Import in minutes",
    description: "Move over from Google Authenticator, Aegis, andOTP or 2FAS, or scan a QR code.",
  },
  {
    title: "Clipboard that cleans up",
    description: "Tap to copy, and the code is cleared from the clipboard after 60 seconds.",
  },
  {
    title: "App Lock",
    description: "Face ID, Touch ID or passcode, plus blur in the app switcher and during screen recording.",
  },
  {
    title: "Optional E2E iCloud Sync",
    description: "Keep iPhone, iPad, Mac and Watch in step without anyone else being able to read it.",
  },
  {
    title: "Open source, ad-free",
    description: "MIT licensed on GitHub. Free on the App Store, with nothing to upsell.",
  },
];
