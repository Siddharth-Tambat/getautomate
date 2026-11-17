// Progressive enhancement only: the page works without it. No analytics, no network calls.
(() => {
  const strip = document.querySelector('.strip');
  const arrows = document.querySelector('.arrows');
  if (strip && arrows) {
    arrows.hidden = false;
    arrows.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (btn) strip.scrollBy({ left: Number(btn.dataset.dir) * 496, behavior: 'smooth' });
    });
  }
})();
