// ─── Twitch reserved paths (not channel names) ────────────────────────────
export const RESERVED_PATHS = new Set([
  'directory', 'search', 'settings', 'subscriptions', 'wallet',
  'inventory', 'drops', 'following', 'videos', 'clips',
  'collections', 'schedule', 'squad',
]);

/**
 * Extract channel username from an href like "/channelname".
 * @param reservedPaths - paths to treat as non-channel (defaults to Twitch RESERVED_PATHS)
 */
export function extractChannel(
  href: string,
  reservedPaths: Set<string> = RESERVED_PATHS,
): string | null {
  const match = href.match(/^\/([a-zA-Z0-9_]{3,25})(\/|$)/);
  if (!match || !match[1]) return null;
  const name = match[1].toLowerCase();
  if (reservedPaths.has(name)) return null;
  return name;
}

/** Mark an element as hidden by this extension (idempotent). */
export function hideElement(el: HTMLElement): void {
  if (el.dataset.gbHidden) return;
  el.dataset.gbHidden = '1';
  el.style.setProperty('display', 'none', 'important');
}
