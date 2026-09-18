import { t } from './i18n.js';

export function initNavigation() {
  const header = document.querySelector('[data-header]');
  const hero = document.querySelector('.hero');
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let lastFocus = null;
  let scrollFrame = 0;

  const syncHeaderState = () => {
    scrollFrame = 0;
    if (!header || !hero) return;
    const threshold = Math.max(24, hero.offsetHeight - header.offsetHeight - 24);
    header.classList.toggle('is-scrolled', window.scrollY >= threshold);
  };
  const requestHeaderSync = () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(syncHeaderState);
  };
  window.addEventListener('scroll', requestHeaderSync, { passive: true });
  window.addEventListener('resize', requestHeaderSync, { passive: true });
  syncHeaderState();

  const syncMenuLabel = () => {
    if (!toggle) return;
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-label', t(open ? 'nav.closeMenu' : 'nav.openMenu'));
  };

  const closeMenu = () => {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    syncMenuLabel();
    lastFocus?.focus?.();
  };

  const openMenu = () => {
    if (!toggle || !menu) return;
    lastFocus = document.activeElement;
    toggle.setAttribute('aria-expanded', 'true');
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    syncMenuLabel();
    menu.querySelector(focusableSelector)?.focus();
  };

  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    open ? closeMenu() : openMenu();
  });

  menu?.addEventListener('click', (event) => {
    if (event.target.closest('a[href^="#"]')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu?.classList.contains('is-open')) closeMenu();
    if (event.key !== 'Tab' || !menu?.classList.contains('is-open')) return;
    const items = [...menu.querySelectorAll(focusableSelector)];
    if (!items.length) return;
    const first = items[0];
    const last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  window.addEventListener('nallpa:languagechange', syncMenuLabel);
  syncMenuLabel();
}
