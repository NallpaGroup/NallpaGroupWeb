import { initI18n } from './i18n.js';
import { initNavigation } from './navigation.js';
import { initCarousels } from './carousel.js';
import { initAnimations } from './animations.js';
import { initSpotlightText } from './spotlight.js';

const FORM_ENDPOINT = 'api/contact';

function initNewsletterForms() {
  document.querySelectorAll('[data-newsletter-form]').forEach((form) => {
    const input = form.querySelector('input[type="email"]');
    const success = form.querySelector('.form-status.success');
    const error = form.querySelector('.form-status.error');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      success?.classList.remove('is-visible');
      error?.classList.remove('is-visible');
      if (!input?.checkValidity()) {
        error?.classList.add('is-visible');
        input?.focus();
        return;
      }
      // Static GitHub Pages/Jekyll build: no form backend is bundled.
      // Connect your own endpoint later if submissions should be persisted.
      success?.classList.add('is-visible');
      form.reset();
    });
  });
}

initI18n();
initNavigation();
initCarousels();
initAnimations();
initSpotlightText();
initNewsletterForms();

window.__NALLPA_CONFIG__ = { FORM_ENDPOINT };
