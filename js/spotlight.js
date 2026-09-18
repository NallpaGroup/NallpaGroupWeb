const HEADING_SELECTOR = [
  'h1',
  'h2',
  'h3'
].join(',');

const BUTTON_SELECTOR = [
  '.btn',
  '.btn-icon',
  '.input-wrap button',
  '.language-toggle'
].join(',');

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function updateTextSpotlightPosition(element, event) {
  const rect = element.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const x = clamp(event.clientX - rect.left, 0, rect.width);
  const y = clamp(event.clientY - rect.top, 0, rect.height);
  const xPercent = (x / rect.width) * 100;

  element.style.setProperty('--spotlight-x', `${x}px`);
  element.style.setProperty('--spotlight-y', `${y}px`);
  // Move the metallic gradient opposite the pointer for a subtle reflective sheen.
  element.style.setProperty('--spotlight-bg-x', `${100 - xPercent}%`);
}

function enhanceHeading(element) {
  if (element.dataset.silverSpotlight === 'ready') return;

  const base = document.createElement('span');
  base.className = 'silver-spotlight-base';
  while (element.firstChild) base.append(element.firstChild);

  const overlay = document.createElement('span');
  overlay.className = 'silver-spotlight-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = base.innerHTML;

  element.classList.add('silver-spotlight-text');
  element.dataset.silverSpotlight = 'ready';
  element.append(base, overlay);

  element.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'touch') return;
    updateTextSpotlightPosition(element, event);
    element.classList.add('is-spotlight-active');
  });

  element.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    updateTextSpotlightPosition(element, event);
  });

  element.addEventListener('pointerleave', () => {
    element.classList.remove('is-spotlight-active');
  });
}

function updateButtonSpotlightPosition(element, event) {
  const rect = element.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const x = clamp(event.clientX - rect.left, 0, rect.width);
  const y = clamp(event.clientY - rect.top, 0, rect.height);

  element.style.setProperty('--button-spotlight-x', `${x}px`);
  element.style.setProperty('--button-spotlight-y', `${y}px`);
}

function enhanceButton(element) {
  if (element.dataset.silverButtonSpotlight === 'ready') return;

  element.classList.add('silver-spotlight-button');
  element.dataset.silverButtonSpotlight = 'ready';

  element.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'touch') return;
    updateButtonSpotlightPosition(element, event);
    element.classList.add('is-spotlight-active');
  });

  element.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    updateButtonSpotlightPosition(element, event);
  });

  element.addEventListener('pointerleave', () => {
    element.classList.remove('is-spotlight-active');
  });
}

function initGlobalCursorGlow() {
  const glow = document.createElement('div');
  glow.className = 'silver-cursor-glow';
  glow.setAttribute('aria-hidden', 'true');
  document.body.append(glow);

  let frame = 0;
  let nextX = window.innerWidth / 2;
  let nextY = window.innerHeight / 2;

  const paint = () => {
    frame = 0;
    document.documentElement.style.setProperty('--silver-cursor-x', `${nextX}px`);
    document.documentElement.style.setProperty('--silver-cursor-y', `${nextY}px`);
  };

  document.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    nextX = event.clientX;
    nextY = event.clientY;
    document.documentElement.classList.add('has-silver-cursor');
    if (!frame) frame = requestAnimationFrame(paint);
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', () => {
    document.documentElement.classList.remove('has-silver-cursor');
  });
}

export function initSpotlightText() {
  const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!supportsFinePointer || reducedMotion) return;

  initGlobalCursorGlow();
  document.querySelectorAll(HEADING_SELECTOR).forEach(enhanceHeading);
  document.querySelectorAll(BUTTON_SELECTOR).forEach(enhanceButton);
}
