/* ============================================================
   main.js — CV. Mandira Heritage Group
   ============================================================ */

(function () {
  'use strict';

  /* ---------- SPLASH SCREEN ---------- */
  const splash      = document.getElementById('splash');
  const splashEnter = document.getElementById('splashEnter');
  const splashSkip  = document.getElementById('splashSkip');

  function hideSplash() {
    if (!splash) return;
    splash.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (splash) {
    document.body.style.overflow = 'hidden';
    splashEnter && splashEnter.addEventListener('click', hideSplash);
    splashSkip  && splashSkip.addEventListener('click', hideSplash);
    // Auto-hide after 6 seconds so visitors are never stuck on the splash
    setTimeout(hideSplash, 6000);
  }

  /* ---------- NAVIGATION ---------- */
  const nav       = document.getElementById('nav');
  const burger    = document.getElementById('burger');
  const navLinks  = document.getElementById('navLinks');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections   = document.querySelectorAll('section[id], div[id]');

  function closeMobileMenu() {
    if (!burger || !navLinks) return;
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      // Move focus into the menu for keyboard users when it opens
      if (open) {
        const firstLink = navLinks.querySelector('a');
        firstLink && firstLink.focus();
      }
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close menu on Escape and return focus to the burger button
    navLinks.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
        burger.focus();
      }
    });
  }

  /* ---------- ACTIVE LINK HIGHLIGHT + STICKY NAV + HERO PARALLAX ---------- */
  // All three effects only need to know the current scroll position, so they
  // share a single scroll listener throttled with requestAnimationFrame
  // instead of three separate listeners firing on every scroll event.
  const heroBg = document.querySelector('.hbg');
  let ticking = false;

  function onScrollFrame() {
    const scrollY = window.scrollY;

    if (nav) {
      nav.classList.toggle('scrolled', scrollY > 40);
    }

    if (heroBg) {
      heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.25}px)`;
    }

    let current = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScrollFrame);
      ticking = true;
    }
  }, { passive: true });

  /* ---------- HERO LOAD ANIMATION ---------- */
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    setTimeout(() => heroSection.classList.add('loaded'), 100);
  }

  /* ---------- SCROLL REVEAL ---------- */
  const revEls = document.querySelectorAll('.rev');

  if ('IntersectionObserver' in window) {
    const revObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revEls.forEach(el => revObserver.observe(el));
  } else {
    // Fallback for browsers without IntersectionObserver: show everything
    revEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- COUNTER ANIMATION (STATS BAR) ---------- */
  const statNums = document.querySelectorAll('.stat-n[data-target]');
  const COUNTER_DURATION = 1800; // ms

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    let startTime = null;

    function tick(timestamp) {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / COUNTER_DURATION, 1);
      const current = Math.floor(progress * target);
      el.textContent = current.toLocaleString('id-ID');

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString('id-ID');
      }
    }

    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window && statNums.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => statObserver.observe(el));
  }

  /* ---------- SERVICE TABS ---------- */
  const svcTabs  = document.querySelectorAll('.svc-tab');
  const svcPanes = document.querySelectorAll('.svc-pane');

  svcTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      svcTabs.forEach(t => t.classList.remove('on'));
      svcPanes.forEach(p => p.classList.remove('on'));

      tab.classList.add('on');
      const pane = document.getElementById('p-' + target);
      if (pane) {
        pane.classList.add('on');
        // Re-trigger reveal animation for newly shown cards
        pane.querySelectorAll('.rev').forEach(el => {
          el.classList.remove('visible');
          setTimeout(() => el.classList.add('visible'), 50);
        });
      }
    });
  });

  /* ---------- PORTFOLIO FILTER ---------- */
  const filterBtns = document.querySelectorAll('.pf');
  const portCards  = document.querySelectorAll('.pcard');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('on'));
      btn.classList.add('on');

      portCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });

  /* ---------- SMOOTH SCROLL (fallback for older browsers) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
