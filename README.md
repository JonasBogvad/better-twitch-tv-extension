<div align="center">

**Browser extension that hides gambling-promoting streamers from your Twitch experience.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Edge / Chrome](https://img.shields.io/badge/Edge%20%2F%20Chrome-MV3-0078D7?logo=microsoftedge&logoColor=white)](https://microsoftedge.microsoft.com/addons/)

</div>

---

## What it does

- **Hides** blacklisted streamers from the sidebar, browse, homepage, and all recommendations — no empty space left behind
- **Hides** gambling category tiles (Slots, Casino, Roulette, etc.) from the Twitch directory
- **Overlays** a Danish warning when navigating directly to a blacklisted channel or gambling category page
- **ROFUS widget** appears on any stream currently live in a blocked gambling category — links to the Danish self-exclusion register
- **Mutes** the stream while the warning overlay is shown, unmutes if the user chooses to proceed
- Responsive to sidebar collapse, theatre mode, and fullscreen

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [WXT](https://wxt.dev) v0.19 |
| Language | TypeScript (strict) |
| Target | Edge / Chrome (Manifest V3) |
| Backend (Phase 2) | Next.js on Vercel |
| Database (Phase 2) | Neon PostgreSQL via Prisma |

---

## Roadmap

| Phase | Status | Description |
|---|---|---|
| 1 – Prototype | ✅ Done | Hardcoded blacklist, hide + overlay + ROFUS widget |
| 2 – Remote blacklist | Planned | Vercel API + background service worker + admin panel |
| 3 – Community | Planned | Flag queue, Wall of Shame, nudge messages |

---

## License

MIT — see [LICENSE](LICENSE) for details.
