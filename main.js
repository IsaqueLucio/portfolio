/* ============================================================
   ISAQUE Portfolio — main.js
   Scroll animations, nav, stack bars
   ============================================================ */

// ──────────────────────────────────────────
// NAV: scroll state
// ──────────────────────────────────────────
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ──────────────────────────────────────────
// SCROLL REVEAL — IntersectionObserver
// ──────────────────────────────────────────
(function initReveal() {
  const elements = [
    // Sections
    ...document.querySelectorAll('.section__heading'),
    ...document.querySelectorAll('.about-grid__text'),
    ...document.querySelectorAll('.about-grid__stats'),
    ...document.querySelectorAll('.about-photo'),
    ...document.querySelectorAll('.timeline__item'),
    ...document.querySelectorAll('.stack-category'),
    ...document.querySelectorAll('.project-card'),
    ...document.querySelectorAll('.code-block'),
    ...document.querySelectorAll('.cert-card'),
    ...document.querySelectorAll('.contact-grid > *'),
    ...document.querySelectorAll('.contact-photo'),
    ...document.querySelectorAll('.cta-content'),
  ];

  elements.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger delay for grid children
    const delay = Math.min(i % 4, 3);
    if (delay > 0) el.classList.add(`reveal-d${delay}`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  elements.forEach(el => observer.observe(el));
})();

// ──────────────────────────────────────────
// STACK BARS — animate on enter
// ──────────────────────────────────────────
(function initStackBars() {
  const bars = document.querySelectorAll('.stack-item__bar span');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  bars.forEach(bar => observer.observe(bar));
})();

// ──────────────────────────────────────────
// SMOOTH SCROLL for anchor links
// ──────────────────────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = 64;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ──────────────────────────────────────────
// HERO PARALLAX — scroll-driven with fallback
// ──────────────────────────────────────────
(function initHeroParallax() {
  const heroImg = document.querySelector('.hero__bg-img');
  if (!heroImg) return;

  // Use native scroll-driven if supported, otherwise JS fallback
  const supportsScrollDriven = CSS.supports(
    '(animation-timeline: view()) and (animation-range: entry)'
  );

  if (supportsScrollDriven) {
    // Native CSS scroll-driven animation (set via JS to keep HTML clean)
    heroImg.style.cssText += `
      animation: hero-parallax linear both;
      animation-timeline: view();
      animation-range: entry 0% exit 100%;
    `;
    // Inject keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes hero-parallax {
        from { transform: scale(1.05) translateY(0px); }
        to   { transform: scale(1.05) translateY(80px); }
      }
      @media (prefers-reduced-motion: reduce) {
        .hero__bg-img { animation: none; }
      }
    `;
    document.head.appendChild(style);
  } else {
    // IntersectionObserver + scroll fallback
    heroImg.style.transform = 'scale(1.05)';
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroHeight = document.querySelector('.hero').offsetHeight;
          if (scrollY < heroHeight) {
            const progress = scrollY / heroHeight;
            heroImg.style.transform = `scale(1.05) translateY(${progress * 80}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Respect reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) window.removeEventListener('scroll', onScroll);
    mq.addEventListener('change', () => {
      if (mq.matches) {
        window.removeEventListener('scroll', onScroll);
        heroImg.style.transform = 'none';
      } else {
        window.addEventListener('scroll', onScroll, { passive: true });
      }
    });
  }
})();

// ──────────────────────────────────────────
// STAT CARDS — count-up animation
// ──────────────────────────────────────────
(function initCountUp() {
  const statNums = document.querySelectorAll('.stat-card__num');
  if (!statNums.length) return;

  const animateCount = (el, target, suffix) => {
    const duration = 1200;
    const start = performance.now();
    const startVal = 0;

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(startVal + (target - startVal) * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.textContent;
      const match = text.match(/^(\d+)(.*)$/);
      if (!match) return;
      const target = parseInt(match[1], 10);
      const suffix = match[2] || '';
      animateCount(el, target, suffix);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
})();
