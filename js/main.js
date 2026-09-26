// ============================================================
//  OPTRIST CO — main.js
//  Handles: custom cursor, navbar, particles, counters, tilt,
//           scroll fade-in, mobile nav, map tooltips
// ============================================================

(function () {
  'use strict';

  /* ── 1. CUSTOM GEAR CURSOR ── */
  const cursorEl = document.createElement('div');
  cursorEl.id = 'custom-cursor';
  cursorEl.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.14,12.94c.04-.3.06-.61.06-.94s-.02-.64-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61
    l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4,2.81
    c-.04-.24-.24-.41-.48-.41h-3.84c-.24,0-.43.17-.47.41L9.25,5.35
    C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-.22-.08-.47,0-.59.22L2.73,8.87
    c-.12.22-.07.49.12.61l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s.02.64.06.94
    l-2.03,1.58c-.18.14-.23.41-.12.61l1.92,3.32c.12.22.37.29.59.22l2.39-.96
    c.5.38,1.03.7,1.62.94l.36,2.54c.05.24.24.41.48.41h3.84c.24,0,.44-.17.47-.41
    l.36-2.54c.59-.24,1.13-.56,1.62-.94l2.39.96c.22.08.47,0,.59-.22l1.92-3.32
    c.12-.22.07-.49-.12-.61L19.14,12.94z
    M12,15.6c-1.98,0-3.6-1.62-3.6-3.6s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
  </svg>`;
  document.body.appendChild(cursorEl);

  // Only on non-touch devices
  if (!window.matchMedia('(hover:none)').matches) {
    let mx = -100, my = -100, cx = -100, cy = -100;
    let raf = null;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    document.addEventListener('mouseleave', () => { cursorEl.style.opacity = '0'; });
    document.addEventListener('mouseenter',  () => { cursorEl.style.opacity = '1'; });

    function tick() {
      // Lerp for smooth follow
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursorEl.style.transform = `translate(${cx - 11}px, ${cy - 11}px)`;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
  } else {
    // Touch device: hide cursor
    cursorEl.style.display = 'none';
  }

  /* ── 2. NAVBAR SCROLL ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── 3. MOBILE NAV ── */
  const hamburger    = document.querySelector('.hamburger');
  const mobileNav    = document.querySelector('.mobile-nav');
  const mobileClose  = document.querySelector('.mobile-nav .close-btn');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
    if (mobileClose) mobileClose.addEventListener('click', () => mobileNav.classList.remove('open'));
    mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));
  }

  /* ── 4. ACTIVE NAV LINK ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    if (a.getAttribute('href') === currentPage) a.classList.add('active');
    if (currentPage === '' && (a.getAttribute('href') === 'index.html' || a.getAttribute('href') === './')) {
      a.classList.add('active');
    }
  });

  /* ── 5. SCROLL FADE-IN ── */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length > 0 && 'IntersectionObserver' in window) {
    const fadeObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); fadeObs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => fadeObs.observe(el));
  }

  /* ── 6. COUNTER ANIMATION ── */
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const cntObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const plus   = el.dataset.plus === 'true';
        const dur    = 2000; // ms
        const start  = performance.now();
        const from   = target > 100 ? target - Math.round(target * 0.4) : 0;

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / dur, 1);
          const ease = 1 - Math.pow(1 - progress, 4); // ease-out quart
          const val = Math.round(from + (target - from) * ease);
          el.textContent = val.toLocaleString() + (plus ? '+' : '');
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target.toLocaleString() + (plus ? '+' : '');
        }
        requestAnimationFrame(update);
        cntObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cntObs.observe(c));
  }

  /* ── 7. VANILLATILT (3D HOVER EFFECT) ── */
  function initTilt() {
    if (typeof VanillaTilt !== 'undefined') {
      VanillaTilt.init(document.querySelectorAll('.glass-card, .product-card'), {
        max: 8, speed: 500, glare: true, 'max-glare': 0.12, scale: 1.02,
      });
    }
  }

  /* ── 8. TSPARTICLES (HERO PARTICLES) ── */
  function initParticles() {
    const el = document.getElementById('tsparticles');
    if (!el || typeof tsParticles === 'undefined') return;

    // Use the "basic" bundle API
    const loadFn = tsParticles.load || (window.tsParticles && window.tsParticles.load);
    if (!loadFn) return;

    loadFn("tsparticles", {
      fpsLimit: 60,
      interactivity: {
        events: { onHover: { enable: true, mode: "repulse" }, resize: true },
        modes:  { repulse: { distance: 80, duration: 0.4 } }
      },
      particles: {
        color: { value: ["#39c095", "#6ee7c0", "#c8a96e"] },
        links: { color:"#39c095", distance:140, enable:true, opacity:0.15, width:1 },
        move:  { enable:true, speed:0.6, direction:"none", outModes:"bounce" },
        number:{ density:{ enable:true, area:900 }, value:55 },
        opacity:{ value:{ min:0.15, max:0.5 } },
        shape: { type:"circle" },
        size:  { value:{ min:1, max:2.5 } }
      },
      detectRetina: true
    });
  }

  // Wait for CDN scripts to load, then init
  window.addEventListener('load', () => {
    initTilt();
    initParticles();
  });

  /* ── 9. CONTACT FORM PREVENT DEFAULT + MAILTO ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name    = (this.querySelector('[name=name]')?.value || '').trim();
      const email   = (this.querySelector('[name=email]')?.value || '').trim();
      const engine  = (this.querySelector('[name=engine]')?.value || '').trim();
      const message = (this.querySelector('[name=message]')?.value || '').trim();
      const subject = encodeURIComponent(`Inquiry from ${name} — ${engine || 'Deutz Engine Parts'}`);
      const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nEngine Model: ${engine}\n\nMessage:\n${message}`);
      window.location.href = `mailto:optristco@icloud.com?subject=${subject}&body=${body}`;
    });
  }

  /* ── 10. MAP PIN LABELS (accessibility) ── */
  document.querySelectorAll('.map-pin').forEach(pin => {
    pin.setAttribute('role', 'img');
    pin.setAttribute('aria-label', pin.dataset.city || pin.title || '');
  });

})();
