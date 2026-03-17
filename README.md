# Eddington.Tech

Personal site for **Hunter Eddington** — System Engineer, IAM Engineer, and iOS developer. Built with Next.js and Tailwind CSS.

## What’s included

- **Home page**: Hero, About (System / IAM Engineer), and a showcase of iOS apps with links to dedicated subpages.
- **App subpages**: Each app has its own route (e.g. `/autheris` → **Autheris.Eddington.Tech** style page). Add more in `app/<app-id>/page.tsx` and in `lib/apps.ts`.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Add a new app

1. **Register the app** in `lib/apps.ts`:

   ```ts
   {
     id: "myapp",
     name: "My App",
     tagline: "Short tagline",
     description: "Longer description.",
     href: "/myapp",
     subdomain: "myapp",  // for myapp.eddington.tech
     icon: "📱",
     appStoreUrl: "https://apps.apple.com/...",  // optional
   }
   ```

2. **Create the subpage**: add `app/myapp/page.tsx` (copy structure from `app/autheris/page.tsx` and swap in your app’s data from `lib/apps.ts`).

## Deploy

- **Vercel**: Connect this repo; paths like `/autheris` work as-is.
- **Subdomains** (e.g. `autheris.eddington.tech`): In your host (Vercel/Cloudflare/etc.), add a rewrite so `autheris.eddington.tech` serves the same app with path `/autheris`, or use middleware to map host to path.

## Tech stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Fonts: Outfit, JetBrains Mono
