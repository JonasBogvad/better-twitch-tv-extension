# TODO — better-twitch-tv-extension

## Phase 1 – Prototype (current)

- [ ] Load extension in Edge and verify it activates on twitch.tv
- [ ] Verify blacklisted streamers disappear from sidebar (followed channels)
- [ ] Verify blacklisted streamers disappear from browse / category pages
- [ ] Verify blacklisted streamers disappear from homepage recommendations
- [ ] Verify warning overlay appears when navigating directly to a blacklisted channel URL
- [ ] Tune `findHideTarget()` depth if wrong container is being hidden
- [ ] Add icons (16px, 48px, 128px) to `public/icons/`

## Phase 2 – Remote blacklist

- [ ] Add `background.ts` service worker that fetches blacklist from `better-twitch-tv-web` API
- [ ] Cache blacklist in `chrome.storage.local` with 15-min TTL
- [ ] Update `content.ts` to request blacklist from background via `chrome.runtime.sendMessage`
- [ ] Add "Flag this streamer" button to channel page overlay
- [ ] Wire flag button to POST `/api/flag` on the web backend

## Phase 3 – Polish

- [ ] Rotating nudge messages on the warning overlay (financial facts, health tips)
- [ ] Prominent unfollow prompt on blocked channel pages
- [ ] YouTube support
