# GambleBlock – Twitch Gambling Blocker

A Chromium browser extension that hides gambling-promoting streamers from your Twitch experience.

## What it does

- **Hides** blacklisted streamers from Twitch browse, sidebar, homepage, and recommendations — no empty space, no trace
- **Overlays** a warning when you navigate directly to a blacklisted channel's URL
- **Propagates** updates automatically via a remote blacklist (Phase 2)

## Quick Start (Prototype)

```bash
cd extension
npm install
npm run build
```

Then load the extension in Edge:
1. Go to `edge://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `extension/.output/chrome-mv3/` folder

For live development with hot reload:
```bash
cd extension
npm run dev
```

## Adding streamers to the blacklist

In the prototype, edit `extension/entrypoints/content.ts` and add to the `BLACKLISTED_USERNAMES` array. Phase 2 will make this admin-controlled via a web panel on Vercel.

## Tech Stack

- **Extension:** [WXT](https://wxt.dev) + TypeScript (Chromium MV3)
- **Backend (Phase 2):** Next.js on Vercel
- **Database (Phase 2):** Neon PostgreSQL via Prisma

## Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| 1 – Prototype | 🚧 Now | Hardcoded blacklist, hide + overlay |
| 2 – Remote blacklist | Planned | Vercel API + admin panel |
| 3 – Community | Planned | Flag queue, Wall of Shame, nudge messages |
