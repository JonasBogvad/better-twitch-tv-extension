import type { LocaleData } from './i18n';

let overlayInjected = false;

export function removeOverlay(): void {
  document.getElementById('gb-overlay')?.remove();
  overlayInjected = false;
}

export function muteStream(): void {
  document.querySelectorAll<HTMLVideoElement>('video').forEach((v) => { v.muted = true; });
}

export function unmuteStream(): void {
  document.querySelectorAll<HTMLVideoElement>('video').forEach((v) => { v.muted = false; });
}

export function injectOverlay(username: string, tx: LocaleData, isCategory = false): void {
  if (overlayInjected) return;
  overlayInjected = true;

  const overlay = document.createElement('div');
  overlay.id = 'gb-overlay';

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

  const icon = document.createElement('div');
  icon.textContent = '⚠️';
  icon.style.fontSize = '64px';
  icon.style.marginBottom = '24px';

  const headline = document.createElement('h1');
  headline.textContent = tx.overlayHeadline;
  Object.assign(headline.style, {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 16px 0',
    color: '#FFCA28',
  });

  const desc = document.createElement('p');
  const descTemplate = isCategory ? tx.overlayDescCategory : tx.overlayDescChannel;
  desc.textContent = descTemplate.replace('{username}', username);
  Object.assign(desc.style, {
    fontSize: '16px',
    maxWidth: '480px',
    lineHeight: '1.6',
    margin: '0 0 32px 0',
    color: '#ADADB8',
  });

  if (!document.getElementById('gb-styles')) {
    const style = document.createElement('style');
    style.id = 'gb-styles';
    style.textContent = `
      @keyframes gb-pop {
        0%   { transform: scale(0.5); opacity: 0; }
        70%  { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(1);   opacity: 1; }
      }
      @keyframes gb-fade-up {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes gb-glow {
        0%, 100% { box-shadow: 0 0 12px rgba(255, 202, 40, 0.15); }
        50%       { box-shadow: 0 0 28px rgba(255, 202, 40, 0.35); }
      }
    `;
    document.head.appendChild(style);
  }

  const nudge = document.createElement('div');
  Object.assign(nudge.style, {
    maxWidth: '500px',
    margin: '0 0 40px 0',
    padding: '24px 28px',
    background: 'rgba(255, 202, 40, 0.06)',
    border: '1px solid rgba(255, 202, 40, 0.25)',
    borderRadius: '12px',
    textAlign: 'center',
    animation: 'gb-fade-up 0.5s ease 0.3s both, gb-glow 3s ease-in-out 0.8s infinite',
  });

  const nudgeBulb = document.createElement('div');
  nudgeBulb.textContent = '💡';
  Object.assign(nudgeBulb.style, {
    fontSize: '40px',
    marginBottom: '12px',
    display: 'block',
    animation: 'gb-pop 0.5s ease 0.6s both',
  });

  const nudgeHeadline = document.createElement('p');
  nudgeHeadline.textContent = tx.nudgeHeadline;
  Object.assign(nudgeHeadline.style, {
    fontSize: '20px',
    fontWeight: '700',
    color: '#FFCA28',
    margin: '0 0 10px 0',
    letterSpacing: '0.3px',
  });

  const nudgeQuote = document.createElement('p');
  nudgeQuote.textContent = tx.quotes[Math.floor(Math.random() * tx.quotes.length)] ?? '';
  Object.assign(nudgeQuote.style, {
    fontSize: '18px',
    lineHeight: '1.7',
    color: '#EFEFF1',
    margin: '0',
    fontWeight: '500',
  });

  nudge.appendChild(nudgeBulb);
  nudge.appendChild(nudgeHeadline);
  nudge.appendChild(nudgeQuote);

  const buttonRow = document.createElement('div');
  Object.assign(buttonRow.style, { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' });

  const backBtn = document.createElement('button');
  backBtn.textContent = tx.backBtn;
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

  const proceedBtn = document.createElement('button');
  proceedBtn.textContent = tx.proceedBtn;
  Object.assign(proceedBtn.style, {
    padding: '12px 28px',
    background: 'transparent',
    color: '#ADADB8',
    border: '1px solid #3A3A4A',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  });
  proceedBtn.addEventListener('click', () => {
    removeOverlay();
    unmuteStream();
  });

  buttonRow.appendChild(backBtn);
  buttonRow.appendChild(proceedBtn);

  const branding = document.createElement('p');
  branding.textContent = 'NoGamble';
  Object.assign(branding.style, {
    position: 'absolute',
    bottom: '20px',
    fontSize: '11px',
    color: '#6B6B7A',
    margin: '0',
  });

  overlay.appendChild(icon);
  overlay.appendChild(headline);
  overlay.appendChild(desc);
  overlay.appendChild(nudge);
  overlay.appendChild(buttonRow);
  overlay.appendChild(branding);

  document.body.appendChild(overlay);
  muteStream();
}
