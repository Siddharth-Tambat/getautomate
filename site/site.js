// Progressive enhancement only: the page works without it. No analytics, no network calls.
(() => {
  const strip = document.querySelector('.strip');
  const arrows = document.querySelector('.arrows');
  if (strip && arrows) {
    arrows.hidden = false;
    arrows.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-dir]');
      if (btn) strip.scrollBy({ left: Number(btn.dataset.dir) * 496, behavior: 'smooth' });
    });
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    if (!motion.matches) {
      const originals = [...strip.children];
      const cloneSet = () => originals.map((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.inert = true;
        clone.querySelectorAll('img').forEach((img) => { img.alt = ''; });
        return clone;
      });
      strip.prepend(...cloneSet());
      strip.append(...cloneSet());
      strip.classList.add('is-looping');
      let span = 0, position = 0, previous = 0, hovered = false, focused = false, paused = false, visible = false, touching = false, holdUntil = 0;
      // Touch works like hover: still while a finger is on the strip or it is still gliding, then drifting again.
      const holding = () => touching || performance.now() < holdUntil;
      const pause = document.createElement('button');
      pause.type = 'button';
      const label = () => { pause.textContent = paused ? 'Resume' : 'Pause'; pause.setAttribute('aria-label', paused ? 'Resume screenshot scrolling' : 'Pause screenshot scrolling'); };
      label();
      pause.addEventListener('click', () => { paused = !paused; label(); });
      arrows.prepend(pause);
      const measure = () => {
        span = originals[0].offsetLeft - strip.firstElementChild.offsetLeft;
        position = span;
        strip.scrollLeft = position;
      };
      measure();
      new ResizeObserver(measure).observe(strip);
      strip.addEventListener('pointerenter', () => { hovered = true; });
      strip.addEventListener('pointerleave', () => { hovered = false; });
      strip.parentElement.addEventListener('focusin', () => { focused = true; });
      strip.parentElement.addEventListener('focusout', (e) => { focused = strip.parentElement.contains(e.relatedTarget); });
      strip.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') touching = true; });
      const release = () => { if (touching) { touching = false; holdUntil = performance.now() + 2500; } };
      ['pointerup', 'pointercancel', 'touchend', 'touchcancel'].forEach((type) => strip.addEventListener(type, release, { passive: true }));
      strip.addEventListener('scroll', () => {
        if (holding()) holdUntil = Math.max(holdUntil, performance.now() + 2500);
        if (paused || hovered || focused || holding()) position = strip.scrollLeft;
      }, { passive: true });
      new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(strip);
      const frame = (time) => {
        const elapsed = previous ? Math.min(time - previous, 50) : 0;
        previous = time;
        if (visible && !document.hidden && !motion.matches && !paused && !hovered && !focused && !holding() && span) {
          // Decreasing scrollLeft makes screenshots drift gently to the right.
          position -= elapsed * .018;
          while (position < span * .5) position += span;
          while (position >= span * 1.5) position -= span;
          strip.scrollLeft = position;
        }
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }
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
