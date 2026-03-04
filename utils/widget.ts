import type { LocaleData, RegistryData } from './i18n';

const WIDGET_ID = 'gb-rofus';
const COOLDOWN_MS = 5 * 60 * 1000;

let _positionInterval: ReturnType<typeof setInterval> | null = null;
let _fullscreenHandler: (() => void) | null = null;

export function removeWidget(): void {
  document.getElementById(WIDGET_ID)?.remove();
  if (_positionInterval !== null) {
    clearInterval(_positionInterval);
    _positionInterval = null;
  }
}

export function injectWidget(
  reg: RegistryData,
  tx: LocaleData,
  getPosition: () => { top: string; left: string },
  onAfterCooldown?: () => void,
): void {
  if (document.getElementById(WIDGET_ID)) return;

  if (!document.getElementById('gb-rofus-styles')) {
    const s = document.createElement('style');
    s.id = 'gb-rofus-styles';
    s.textContent = `
      @keyframes gb-toggle-slide {
        0%, 8%   { left: 2px;  animation-timing-function: ease-in; }
        21%      { left: 34px; animation-timing-function: ease-out; }
        25%      { left: 27px; animation-timing-function: ease-in-out; }
        29%, 82% { left: 30px; }
        93%, 100% { left: 2px; }
      }
      @keyframes gb-toggle-track {
        0%, 8%    { background: #2E3D6B; }
        29%, 82%  { background: #5B72B8; }
        93%, 100% { background: #2E3D6B; }
      }
      @keyframes gb-toggle-glow {
        0%, 27%   { box-shadow: none; }
        31%       { box-shadow: 0 0 0 4px rgba(255,255,255,0.28); }
        40%, 80%  { box-shadow: 0 0 0 2px rgba(255,255,255,0.10); }
        90%, 100% { box-shadow: none; }
      }
      @keyframes gb-icon-play {
        0%, 18%   { opacity: 1; }
        25%, 92%  { opacity: 0; }
        97%, 100% { opacity: 1; }
      }
      @keyframes gb-icon-pause {
        0%, 18%   { opacity: 0; }
        25%, 92%  { opacity: 1; }
        97%, 100% { opacity: 0; }
      }
    `;
    document.head.appendChild(s);
  }

  const initPos = getPosition();

  const widget = document.createElement('a');
  widget.id = WIDGET_ID;
  widget.href = reg.url;
  widget.target = '_blank';
  widget.rel = 'noopener noreferrer';
  Object.assign(widget.style, {
    position: 'fixed',
    top: initPos.top,
    left: initPos.left,
    zIndex: '9998',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '12px 14px',
    background: '#0F1829',
    borderRadius: '10px',
    textDecoration: 'none',
    fontFamily: "'Roobert', Inter, 'Helvetica Neue', Arial, sans-serif",
    cursor: 'pointer',
    minWidth: '175px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.06)',
    transition: 'border-color 0.15s',
  });

  // ── Top row: registry name + toggle ───────────────────────────────────────
  const topRow = document.createElement('div');
  Object.assign(topRow.style, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  });

  const title = document.createElement('span');
  title.textContent = reg.name;
  Object.assign(title.style, {
    color: '#FFFFFF',
    fontSize: '22px',
    fontWeight: '600',
    letterSpacing: '1.5px',
  });

  const track = document.createElement('div');
  Object.assign(track.style, {
    width: '60px',
    height: '32px',
    borderRadius: '16px',
    background: '#2E3D6B',
    position: 'relative',
    flexShrink: '0',
    animation: 'gb-toggle-track 10s ease-in-out infinite',
  });

  const thumb = document.createElement('div');
  Object.assign(thumb.style, {
    position: 'absolute',
    left: '2px',
    top: '2px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    color: '#4A5C8F',
    fontWeight: '900',
    animation: 'gb-toggle-slide 10s ease-in-out infinite, gb-toggle-glow 10s ease-in-out infinite',
  });

  function makeSvg(pathData: string): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', '#0F1829');
    Object.assign(svg.style, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '20px',
      height: '20px',
    });
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', '#0F1829');
    svg.appendChild(path);
    return svg;
  }

  const playIcon = makeSvg('M8 5v14l11-7z');
  playIcon.style.animation = 'gb-icon-play 10s ease-in-out infinite';

  const pauseIcon = makeSvg('M6 19h4V5H6v14zm8-14v14h4V5h-4z');
  pauseIcon.style.opacity = '0';
  pauseIcon.style.animation = 'gb-icon-pause 10s ease-in-out infinite';

  thumb.appendChild(playIcon);
  thumb.appendChild(pauseIcon);
  track.appendChild(thumb);
  topRow.appendChild(title);
  topRow.appendChild(track);

  const question = document.createElement('span');
  question.textContent = tx.widgetQuestion;
  Object.assign(question.style, {
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: '500',
  });

  widget.appendChild(topRow);
  widget.appendChild(question);

  // ── Dismiss button ─────────────────────────────────────────────────────────
  const dismissBtn = document.createElement('button');
  dismissBtn.textContent = '×';
  Object.assign(dismissBtn.style, {
    position: 'absolute',
    top: '-9px',
    right: '-9px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#2E3D6B',
    border: 'none',
    color: '#FFFFFF',
    fontSize: '14px',
    lineHeight: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    padding: '0',
    opacity: '0',
    transition: 'opacity 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });
  dismissBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeWidget();
    if (onAfterCooldown) {
      setTimeout(onAfterCooldown, COOLDOWN_MS);
    }
  });
  widget.appendChild(dismissBtn);

  widget.addEventListener('mouseenter', () => {
    widget.style.borderColor = 'rgba(255,255,255,0.18)';
    dismissBtn.style.opacity = '1';
  });
  widget.addEventListener('mouseleave', () => {
    widget.style.borderColor = 'rgba(255,255,255,0.06)';
    dismissBtn.style.opacity = '0';
  });

  document.body.appendChild(widget);

  // ── Position polling ───────────────────────────────────────────────────────
  if (_positionInterval !== null) {
    clearInterval(_positionInterval);
  }
  _positionInterval = setInterval(() => {
    const w = document.getElementById(WIDGET_ID);
    if (!w) {
      clearInterval(_positionInterval!);
      _positionInterval = null;
      return;
    }
    // Fullscreen re-parenting handler manages position while in fullscreen
    if (document.fullscreenElement) return;
    const pos = getPosition();
    w.style.top = pos.top;
    w.style.left = pos.left;
  }, 300);

  // ── Fullscreen re-parenting ────────────────────────────────────────────────
  if (_fullscreenHandler) {
    document.removeEventListener('fullscreenchange', _fullscreenHandler);
  }
  _fullscreenHandler = () => {
    const w = document.getElementById(WIDGET_ID);
    if (!w) return;
    if (document.fullscreenElement) {
      document.fullscreenElement.appendChild(w);
      w.style.top = '46px';
      w.style.left = '16px';
      w.style.right = 'auto';
    } else {
      document.body.appendChild(w);
      const pos = getPosition();
      w.style.top = pos.top;
      w.style.left = pos.left;
      w.style.right = 'auto';
    }
  };
  document.addEventListener('fullscreenchange', _fullscreenHandler);
}
