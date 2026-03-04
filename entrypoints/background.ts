export default defineBackground(() => {
  const BASE_URL = 'https://www.nogamblettv.app/api';
  const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

  async function fetchBlacklist(): Promise<string[]> {
    const cached = await chrome.storage.local.get(['blacklist', 'blacklistTs']);
    const now = Date.now();
    if (
      Array.isArray(cached.blacklist) &&
      typeof cached.blacklistTs === 'number' &&
      now - cached.blacklistTs < CACHE_TTL_MS
    ) {
      return cached.blacklist as string[];
    }
    try {
      const res = await fetch(`${BASE_URL}/blacklist`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const list = (await res.json()) as string[];
      await chrome.storage.local.set({ blacklist: list, blacklistTs: now });
      return list;
    } catch {
      return Array.isArray(cached.blacklist) ? (cached.blacklist as string[]) : [];
    }
  }

  async function fetchKickBlacklist(): Promise<string[]> {
    const cached = await chrome.storage.local.get(['kickBlacklist', 'kickBlacklistTs']);
    const now = Date.now();
    if (
      Array.isArray(cached.kickBlacklist) &&
      typeof cached.kickBlacklistTs === 'number' &&
      now - cached.kickBlacklistTs < CACHE_TTL_MS
    ) {
      return cached.kickBlacklist as string[];
    }
    try {
      const res = await fetch(`${BASE_URL}/kicklist`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const list = (await res.json()) as string[];
      await chrome.storage.local.set({ kickBlacklist: list, kickBlacklistTs: now });
      return list;
    } catch {
      return Array.isArray(cached.kickBlacklist) ? (cached.kickBlacklist as string[]) : [];
    }
  }

  async function fetchCategories(): Promise<{ slug: string; name: string }[]> {
    const cached = await chrome.storage.local.get(['categories', 'categoriesTs']);
    const now = Date.now();
    if (
      Array.isArray(cached.categories) &&
      typeof cached.categoriesTs === 'number' &&
      now - cached.categoriesTs < CACHE_TTL_MS
    ) {
      return cached.categories as { slug: string; name: string }[];
    }
    try {
      const res = await fetch(`${BASE_URL}/categories`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const list = (await res.json()) as { slug: string; name: string }[];
      await chrome.storage.local.set({ categories: list, categoriesTs: now });
      return list;
    } catch {
      return Array.isArray(cached.categories)
        ? (cached.categories as { slug: string; name: string }[])
        : [];
    }
  }

  async function fetchKickCategories(): Promise<{ slug: string; name: string }[]> {
    const cached = await chrome.storage.local.get(['kickCategories', 'kickCategoriesTs']);
    const now = Date.now();
    if (
      Array.isArray(cached.kickCategories) &&
      typeof cached.kickCategoriesTs === 'number' &&
      now - cached.kickCategoriesTs < CACHE_TTL_MS
    ) {
      return cached.kickCategories as { slug: string; name: string }[];
    }
    try {
      const res = await fetch(`${BASE_URL}/categories/kick`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const list = (await res.json()) as { slug: string; name: string }[];
      await chrome.storage.local.set({ kickCategories: list, kickCategoriesTs: now });
      return list;
    } catch {
      return Array.isArray(cached.kickCategories)
        ? (cached.kickCategories as { slug: string; name: string }[])
        : [];
    }
  }

  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === 'GET_BLACKLIST') {
      fetchBlacklist().then(sendResponse);
      return true;
    }
    if (message?.type === 'GET_KICK_BLACKLIST') {
      fetchKickBlacklist().then(sendResponse);
      return true;
    }
    if (message?.type === 'GET_CATEGORIES') {
      fetchCategories().then(sendResponse);
      return true;
    }
    if (message?.type === 'GET_KICK_CATEGORIES') {
      fetchKickCategories().then(sendResponse);
      return true;
    }
    return false;
  });

  // Pre-warm all caches on service worker start
  fetchBlacklist();
  fetchKickBlacklist();
  fetchCategories();
  fetchKickCategories();
});
