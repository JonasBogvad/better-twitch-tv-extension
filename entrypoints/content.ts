export default defineContentScript({
  matches: ['https://www.twitch.tv/*'],
  runAt: 'document_idle',
  main() {
    // ─── Hardcoded blacklist (Phase 1 prototype) ───────────────────────────────
    // Lowercase Twitch usernames. Replace with remote fetch in Phase 2.
    const BLACKLISTED_USERNAMES: string[] = [
      'trainwreckstv',
      'roshtein',
      'nickslive',
      'itssliker',
      'classybeef',
      'xposed',
      'adinross',
      // Add more here while testing
    ];

    const BLACKLIST = new Set(BLACKLISTED_USERNAMES.map((n) => n.toLowerCase()));

    // ─── Utilities ─────────────────────────────────────────────────────────────

    /** Extract Twitch channel username from an href like "/channelname" or "/channelname/clips" */
    function extractChannel(href: string): string | null {
      const match = href.match(/^\/([a-zA-Z0-9_]{3,25})(\/|$)/);
      return match ? match[1].toLowerCase() : null;
    }

    /** Walk up the DOM to find the best container element to hide for a given link.
     *  Prefers: <article>, <li>, or walks up a fixed number of levels. */
    function findHideTarget(link: HTMLAnchorElement): HTMLElement {
      let el: HTMLElement | null = link;
      let steps = 0;

      while (el && steps < 7) {
        const tag = el.tagName.toLowerCase();
        // Prefer semantic card/list containers
        if (tag === 'article' || tag === 'li') return el;
        // Stop walking before we eat major layout containers
        if (tag === 'main' || tag === 'nav' || tag === 'aside' || tag === 'body' || tag === 'html') break;
        el = el.parentElement;
        steps++;
      }

      // Fallback: 3 levels up from the link (covers sidebar rows)
      let fallback: HTMLElement = link;
      for (let i = 0; i < 3 && fallback.parentElement; i++) {
        fallback = fallback.parentElement as HTMLElement;
      }
      return fallback;
    }

    /** Mark an element as hidden by this extension (idempotent). */
    function hideElement(el: HTMLElement): void {
      if (el.dataset.gambleblock === 'hidden') return;
      el.dataset.gambleblock = 'hidden';
      el.style.setProperty('display', 'none', 'important');
    }

    // ─── Channel page overlay ──────────────────────────────────────────────────

    let overlayInjected = false;

    function getChannelFromUrl(): string | null {
      return extractChannel(window.location.pathname);
    }

    function removeOverlay(): void {
      const existing = document.getElementById('gambleblock-overlay');
      if (existing) {
        existing.remove();
        overlayInjected = false;
      }
    }

    function injectOverlay(username: string): void {
      if (overlayInjected) return;
      overlayInjected = true;

      const overlay = document.createElement('div');
      overlay.id = 'gambleblock-overlay';

      Object.assign(overlay.style, {
        position: 'fixed',
        inset: '0',
        zIndex: '999999',
        background: 'rgba(10, 10, 20, 0.97)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Roobert', Inter, 'Helvetica Neue', Arial, sans-serif",
        color: '#EFEFF1',
        textAlign: 'center',
        padding: '40px',
        boxSizing: 'border-box',
      });

      // Warning icon
      const icon = document.createElement('div');
      icon.textContent = '⚠️';
      icon.style.fontSize = '64px';
      icon.style.marginBottom = '24px';

      // Headline
      const headline = document.createElement('h1');
      headline.textContent = 'Gambling Content Warning';
      Object.assign(headline.style, {
        fontSize: '28px',
        fontWeight: '700',
        margin: '0 0 16px 0',
        color: '#FFCA28',
      });

      // Description
      const desc = document.createElement('p');
      desc.textContent = `${username} has been flagged for promoting gambling on stream. Viewing this content may expose you to gambling promotion.`;
      Object.assign(desc.style, {
        fontSize: '16px',
        maxWidth: '480px',
        lineHeight: '1.6',
        margin: '0 0 32px 0',
        color: '#ADADB8',
      });

      // Nudge fact
      const nudge = document.createElement('p');
      nudge.textContent = '💡 Did you know? Investing 800 kr/month for 10 years at 7% avg return = ~138,000 kr.';
      Object.assign(nudge.style, {
        fontSize: '14px',
        maxWidth: '480px',
        lineHeight: '1.6',
        margin: '0 0 40px 0',
        padding: '16px 20px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        color: '#ADADB8',
      });

      // Button row
      const buttonRow = document.createElement('div');
      buttonRow.style.display = 'flex';
      buttonRow.style.gap = '12px';
      buttonRow.style.flexWrap = 'wrap';
      buttonRow.style.justifyContent = 'center';

      // Go back button
      const backBtn = document.createElement('button');
      backBtn.textContent = '← Go Back';
      Object.assign(backBtn.style, {
        padding: '12px 28px',
        background: '#9147FF',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
      });
      backBtn.addEventListener('click', () => history.back());

      // Proceed anyway button (removes overlay for this session)
      const proceedBtn = document.createElement('button');
      proceedBtn.textContent = 'Proceed Anyway';
      Object.assign(proceedBtn.style, {
        padding: '12px 28px',
        background: 'transparent',
        color: '#ADADB8',
        border: '1px solid #3D3D3F',
        borderRadius: '6px',
        fontSize: '15px',
        cursor: 'pointer',
      });
      proceedBtn.addEventListener('click', () => {
        overlay.remove();
        overlayInjected = false;
      });

      buttonRow.appendChild(backBtn);
      buttonRow.appendChild(proceedBtn);

      overlay.appendChild(icon);
      overlay.appendChild(headline);
      overlay.appendChild(desc);
      overlay.appendChild(nudge);
      overlay.appendChild(buttonRow);

      document.body.appendChild(overlay);
    }

    function checkChannelPage(): void {
      const channel = getChannelFromUrl();
      if (channel && BLACKLIST.has(channel)) {
        // Wait for body to be ready
        const tryInject = () => {
          if (document.body) {
            injectOverlay(channel);
          } else {
            requestAnimationFrame(tryInject);
          }
        };
        tryInject();
      } else {
        removeOverlay();
      }
    }

    // ─── Streamer card / sidebar hiding ────────────────────────────────────────

    /** Cache of already-processed links to avoid repeated DOM walks. */
    const processedLinks = new WeakSet<HTMLAnchorElement>();

    function scanAndHide(): void {
      const links = document.querySelectorAll<HTMLAnchorElement>('a[href]');

      for (const link of links) {
        if (processedLinks.has(link)) continue;
        processedLinks.add(link);

        const channel = extractChannel(link.getAttribute('href') ?? '');
        if (!channel || !BLACKLIST.has(channel)) continue;

        const target = findHideTarget(link);
        hideElement(target);
      }
    }

    // ─── SPA navigation detection ──────────────────────────────────────────────

    let lastUrl = window.location.href;

    function onNavigate(): void {
      const newUrl = window.location.href;
      if (newUrl === lastUrl) return;
      lastUrl = newUrl;

      // Re-check overlay since we're on a new "page"
      overlayInjected = false;
      checkChannelPage();

      // Re-scan after a short delay for the new page's DOM to render
      setTimeout(scanAndHide, 500);
      setTimeout(scanAndHide, 1500);
    }

    // Patch pushState / replaceState for SPA detection
    const originalPushState = history.pushState.bind(history);
    const originalReplaceState = history.replaceState.bind(history);

    history.pushState = (...args) => {
      originalPushState(...args);
      onNavigate();
    };
    history.replaceState = (...args) => {
      originalReplaceState(...args);
      onNavigate();
    };

    window.addEventListener('popstate', onNavigate);

    // ─── MutationObserver ──────────────────────────────────────────────────────

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const observer = new MutationObserver(() => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(scanAndHide, 150);
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    // ─── Initial run ───────────────────────────────────────────────────────────

    checkChannelPage();
    scanAndHide();

    // Extra scan passes as Twitch loads lazily
    setTimeout(scanAndHide, 1000);
    setTimeout(scanAndHide, 3000);
  },
});
