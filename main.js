/* ============================================================
   ISAQUE Portfolio — main.js
   Nav, scroll reveal, stack bars, parallax, count-up,
   i18n (PT/EN/ES), theme toggle, cert tooltip focus
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

  const supportsScrollDriven = CSS.supports(
    '(animation-timeline: view()) and (animation-range: entry)'
  );

  if (supportsScrollDriven) {
    heroImg.style.cssText += `
      animation: hero-parallax linear both;
      animation-timeline: view();
      animation-range: entry 0% exit 100%;
    `;
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

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
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

// ──────────────────────────────────────────
// THEME TOGGLE (claro / escuro / sistema)
// ──────────────────────────────────────────
(function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const root   = document.documentElement;

  const sysMq = window.matchMedia('(prefers-color-scheme: light)');

  function applyTheme(theme) {
    const effective = theme === 'system'
      ? (sysMq.matches ? 'light' : 'dark')
      : theme;
    root.setAttribute('data-theme', effective);
    // Update aria-label on toggle button
    if (toggle) {
      const key = effective === 'light' ? 'theme.toggle.light' : 'theme.toggle.dark';
      const lang = localStorage.getItem('lang') || 'pt';
      const strings = window.CONTENT && window.CONTENT[lang];
      toggle.setAttribute('aria-label', strings ? strings[key] : 'Toggle theme');
    }
  }

  // React to OS-level changes when in 'system' mode
  sysMq.addEventListener('change', () => {
    const saved = localStorage.getItem('theme') || 'dark';
    if (saved === 'system') applyTheme('system');
  });

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      applyTheme(next);
    });
  }

  // Apply on load (the <head> inline script already set the attr, but we need aria-label)
  const saved = localStorage.getItem('theme') || 'dark';
  applyTheme(saved);
})();

// ──────────────────────────────────────────
// I18N — idioma PT / EN / ES
// ──────────────────────────────────────────
(function initI18n() {
  // Expects window.CONTENT from i18n.js
  if (!window.CONTENT) return;

  const CONTENT = window.CONTENT;
  const root = document.documentElement;

  function setLang(lang) {
    if (!CONTENT[lang]) return;
    const strings = CONTENT[lang];

    // Update html[lang]
    root.setAttribute('lang', lang === 'pt' ? 'pt-BR' : lang);

    // data-i18n: replace textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (strings[key] !== undefined) el.textContent = strings[key];
    });

    // data-i18n-html: replace innerHTML (for <strong> etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (strings[key] !== undefined) el.innerHTML = strings[key];
    });

    // data-i18n-nl: replace text with line break on \n
    document.querySelectorAll('[data-i18n-nl]').forEach(el => {
      const key = el.getAttribute('data-i18n-nl');
      if (strings[key] !== undefined) {
        el.innerHTML = strings[key].replace(/\n/g, '<br>');
      }
    });

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && strings['meta.description']) {
      metaDesc.setAttribute('content', strings['meta.description']);
    }

    // Update lang switcher buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('lang-btn--active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    // Update theme toggle aria-label
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      const theme = document.documentElement.getAttribute('data-theme') || 'dark';
      const key = theme === 'light' ? 'theme.toggle.light' : 'theme.toggle.dark';
      toggle.setAttribute('aria-label', strings[key] || 'Toggle theme');
    }

    localStorage.setItem('lang', lang);
  }

  // Wire up lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      setLang(lang);
    });
  });

  // Apply saved or browser default lang
  const saved = localStorage.getItem('lang');
  const browserLang = navigator.language.split('-')[0]; // 'pt', 'en', 'es'
  const initialLang = saved || (['pt','en','es'].includes(browserLang) ? browserLang : 'pt');
  setLang(initialLang);
})();

// ──────────────────────────────────────────
// CERT TOOLTIP — focus trap for keyboard nav
// ──────────────────────────────────────────
(function initCertTooltips() {
  // Tooltips show via CSS :focus-within. We just need to ensure
  // the tooltip itself doesn't steal focus when visible.
  // The tooltip has pointer-events:auto when visible, so clicking
  // it is fine. Keyboard users Tab into the cert-card (tabindex="0")
  // and the :focus-within rule shows the tooltip automatically.
  // No extra JS needed — CSS handles it.
  // But we do add Escape key support to blur the card:
  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') card.blur();
    });
  });
})();
