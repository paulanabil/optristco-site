// ============================================================
//  OPTRIST CO — APPLE-INSPIRED JAVASCRIPT
//  Handles: Navbar, Mobile Menu, Stats Counters, Live Chat Widget,
//           Inquiry Modal, Catalog Interaction
// ============================================================

(function () {
  'use strict';

  /* ── 1. NAVBAR SCROLL EFFECT ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.06)';
        navbar.style.background = 'rgba(255, 255, 255, 0.94)';
      } else {
        navbar.style.boxShadow = 'none';
        navbar.style.background = 'rgba(255, 255, 255, 0.82)';
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ── 2. MOBILE MENU ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeBtn = document.querySelector('.mobile-nav .close-btn');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.add('open');
    });
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        mobileNav.classList.remove('open');
      });
    }
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }

  /* ── 3. NUMBER COUNTER ANIMATION ── */
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const startTime = performance.now();
        const startVal = target > 100 ? target - Math.round(target * 0.35) : 0;

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const ease = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.round(startVal + (target - startVal) * ease);
          el.innerHTML = currentVal.toLocaleString() + '<em>' + suffix + '</em>';

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.innerHTML = target.toLocaleString() + '<em>' + suffix + '</em>';
          }
        }
        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.3 });

    counters.forEach(c => counterObserver.observe(c));
  }

  /* ── 4. FLOATING LIVE CHAT WIDGET ── */
  const chatLauncher = document.getElementById('chat-launcher');
  const chatPopup = document.getElementById('chat-popup');
  const chatCloseBtn = document.getElementById('chat-close');
  const chatForm = document.getElementById('chat-inquiry-form');

  if (chatLauncher && chatPopup) {
    chatLauncher.addEventListener('click', (e) => {
      e.stopPropagation();
      chatPopup.classList.toggle('open');
    });

    if (chatCloseBtn) {
      chatCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        chatPopup.classList.remove('open');
      });
    }

    // Close chat if clicked outside
    document.addEventListener('click', (e) => {
      if (chatPopup.classList.contains('open') && !chatPopup.contains(e.target) && e.target !== chatLauncher) {
        chatPopup.classList.remove('open');
      }
    });

    if (chatForm) {
      chatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = (this.querySelector('[name=chat_name]')?.value || '').trim();
        const contact = (this.querySelector('[name=chat_contact]')?.value || '').trim();
        const engine = (this.querySelector('[name=chat_engine]')?.value || '').trim();
        const message = (this.querySelector('[name=chat_message]')?.value || '').trim();

        const subject = encodeURIComponent(`Inquiry from ${name} — ${engine || 'Deutz Engine Parts'}`);
        const body = encodeURIComponent(
          `Customer Name: ${name}\n` +
          `Contact (Email/Phone): ${contact}\n` +
          `Engine Model: ${engine}\n\n` +
          `Inquiry Message:\n${message}\n\n` +
          `--\nSent via Optrist Co Website Chat`
        );

        // Feedback to user
        const statusBox = document.getElementById('chat-status');
        if (statusBox) {
          statusBox.style.display = 'block';
          statusBox.innerHTML = '<span style="color:#059669;font-weight:600;">Opening your email client to send to optristco@icloud.com...</span>';
        }

        setTimeout(() => {
          window.location.href = `mailto:optristco@icloud.com?cc=sales@optristco.com&subject=${subject}&body=${body}`;
        }, 300);
      });
    }
  }

  /* ── 5. CONTACT FORM (PAGE) ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = (this.querySelector('[name=name]')?.value || '').trim();
      const email = (this.querySelector('[name=email]')?.value || '').trim();
      const phone = (this.querySelector('[name=phone]')?.value || '').trim();
      const engine = (this.querySelector('[name=engine]')?.value || '').trim();
      const message = (this.querySelector('[name=message]')?.value || '').trim();

      const subject = encodeURIComponent(`Parts Request from ${name} [${engine || 'Deutz'}]`);
      const body = encodeURIComponent(
        `Full Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n` +
        `Deutz Engine Model / Part: ${engine}\n\n` +
        `Inquiry Details:\n${message}\n\n` +
        `--\nSubmitted via Optrist Co Contact Page`
      );

      window.location.href = `mailto:optristco@icloud.com?cc=sales@optristco.com&subject=${subject}&body=${body}`;
    });
  }

  /* ── 6. INSTANT PART INQUIRY BUTTONS ── */
  document.querySelectorAll('.btn-inquire-part').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const partName = this.dataset.part || 'Deutz Engine Part';
      const partCode = this.dataset.code || '';
      
      // Open chat and prefill
      if (chatPopup && chatForm) {
        chatPopup.classList.add('open');
        const msgField = chatForm.querySelector('[name=chat_message]');
        const engineField = chatForm.querySelector('[name=chat_engine]');
        if (msgField) {
          msgField.value = `Hello Optrist Co, I would like to inquire about availability and pricing for: ${partName} (${partCode}).`;
        }
        if (engineField && !engineField.value) {
          engineField.value = 'Deutz 912 / BF6M';
        }
        msgField?.focus();
      } else {
        const subject = encodeURIComponent(`Inquiry for ${partName} ${partCode}`);
        const body = encodeURIComponent(`Hello Optrist Co,\n\nI would like to inquire about price and availability for ${partName} (${partCode}).\n\nPlease send me a quote.`);
        window.location.href = `mailto:optristco@icloud.com?subject=${subject}&body=${body}`;
      }
    });
  });

})();
