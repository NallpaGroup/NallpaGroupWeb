function visibleCount() {
  if (window.matchMedia('(max-width: 767px)').matches) return 1;
  if (window.matchMedia('(max-width: 991px)').matches) return 2;
  return 3;
}

function createCarousel(track, prev, next) {
  if (!track || !prev || !next) return;
  let index = 0;
  const cards = [...track.children];

  const update = () => {
    const count = visibleCount();
    const max = Math.max(0, cards.length - count);
    index = Math.min(index, max);
    const cardWidth = cards[0]?.getBoundingClientRect().width || 0;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || '0');
    track.style.transform = `translate3d(${-index * (cardWidth + gap)}px,0,0)`;
    prev.disabled = index <= 0;
    next.disabled = index >= max;
    prev.setAttribute('aria-disabled', String(prev.disabled));
    next.setAttribute('aria-disabled', String(next.disabled));
  };

  prev.addEventListener('click', () => { index = Math.max(0, index - 1); update(); });
  next.addEventListener('click', () => { index = Math.min(Math.max(0, cards.length - visibleCount()), index + 1); update(); });

  let startX = 0;
  track.addEventListener('pointerdown', (event) => { startX = event.clientX; });
  track.addEventListener('pointerup', (event) => {
    const delta = event.clientX - startX;
    if (Math.abs(delta) < 50) return;
    if (delta < 0) next.click(); else prev.click();
  });

  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(update, 80); });
  update();
}

export function initCarousels() {
  createCarousel(document.querySelector('[data-service-track]'), document.querySelector('[data-service-prev]'), document.querySelector('[data-service-next]'));
  createCarousel(document.querySelector('[data-testimonial-track]'), document.querySelector('[data-testimonial-prev]'), document.querySelector('[data-testimonial-next]'));
}
