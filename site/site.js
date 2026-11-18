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
  // Launch offer: lifetime ₹799 until 31 Dec 2026, 23:59 IST. After that the page shows ₹999 on its own.
  const offerEnd = Date.parse('2026-12-31T23:59:59+05:30');
  const count = document.querySelector('[data-count]');
  if (count) {
    const cells = ['days', 'hrs', 'min', 'sec'].map((u) => {
      const cell = document.createElement('span');
      cell.className = 'unit';
      cell.innerHTML = '<b>00</b><small>' + u + '</small>';
      count.appendChild(cell);
      return cell.firstChild;
    });
    const tick = () => {
      const left = offerEnd - Date.now();
      if (left <= 0) {
        document.body.classList.add('offer-over');
        document.querySelectorAll('[data-full]').forEach((el) => { el.hidden = false; });
        clearInterval(timer);
        return;
      }
      const s = Math.floor(left / 1000);
      [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60]
        .forEach((n, i) => { cells[i].textContent = String(n).padStart(2, '0'); });
      count.hidden = false;
    };
    const timer = setInterval(tick, 1000);
    tick();
  }
  // Fade blocks in as they scroll into view. Skipped when the visitor prefers reduced motion.
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const seen = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); seen.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.band, .section, .get, .contact, .doc > h2, .card, .price-card').forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('reveal'); seen.observe(el); }
    });
  }
})();
