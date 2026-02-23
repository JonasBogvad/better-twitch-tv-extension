# TODO — better-twitch-tv-extension

## Phase 1 – Prototype ✅

- [x] Extension structure (WXT + TypeScript)
- [x] Hardcoded blacklist (`trainwreckstv`, `vader`)
- [x] Hide blacklisted streamers from sidebar
- [x] Hide blacklisted streamers from browse / stream cards
- [x] Warning overlay on blacklisted channel pages (Danish)
- [x] SPA navigation detection (URL polling + popstate)
- [x] Stream muted while overlay is shown, unmuted on proceed
- [x] "Gå tilbage" + "Fortsæt Alligevel" buttons on overlay
- [x] 5 rotating Danish nudge quotes on overlay
- [x] Sidebar widget — blocked count + Wall of Shame link (Danish)
- [x] Sidebar widget responsive to Twitch sidebar collapse
- [x] ROFUS widget on blocked channel pages only (animated toggle)
- [ ] Add icons (16px, 48px, 128px) to `public/icons/`

## Phase 2 – Remote blacklist

- [ ] Add `background.ts` service worker
- [ ] `background.ts` fetches `GET https://<vercel-app>/api/blacklist` and caches in `chrome.storage.local` with 15-min TTL
- [ ] Add Vercel domain to `host_permissions` in `wxt.config.ts`
- [ ] Update `content.ts` to request blacklist from background via `chrome.runtime.sendMessage`
- [ ] Update Wall of Shame URL in sidebar widget from GitHub placeholder to real Vercel URL
- [ ] Add "Flag this streamer" button to channel page overlay → POST `/api/flag`

## Phase 3 – Polish

- [ ] Prominent unfollow prompt on blocked channel pages
- [ ] YouTube support
