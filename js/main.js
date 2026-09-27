// ============================================================
//  OPTRIST CO — OFFICIAL SCRIPTS
//  Deutz Diesel Engine Spare Parts Specialist
//  WhatsApp Support: +201223161181 | Email: optristco@icloud.com
// ============================================================

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '201223161181';
  const PRIMARY_EMAIL = 'optristco@icloud.com';

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
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileNav.classList.add('open');
    });
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileNav.classList.remove('open');
      });
    }
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
      }
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

  /* ── 4. INSTANT PART INQUIRY BUTTONS (Direct to WhatsApp +201223161181) ── */
  document.querySelectorAll('.btn-inquire-part').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const partName = this.dataset.part || 'Deutz Engine Part';
      const partCode = this.dataset.code ? ` [Code: ${this.dataset.code}]` : '';
      const docLang = document.documentElement.lang || 'en';

      let msg = '';
      if (docLang === 'ar') {
        msg = `مرحباً شركة أوبتريست، أود الاستفسار عن توفر وسعر قطعة الغيار: ${partName}${partCode} لمحرك دويتس.`;
      } else if (docLang === 'de') {
        msg = `Hallo Optrist Co, ich möchte Preis und Verfügbarkeit anfragen für: ${partName}${partCode} (Deutz Dieselmotor).`;
      } else {
        msg = `Hello Optrist Co, I would like to inquire about price and availability for: ${partName}${partCode} (Deutz Engine).`;
      }

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  });

  /* ── 5. CONTACT FORM (PAGE) WITH INSTANT VISUAL FEEDBACK & DUAL ACTION ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = (this.querySelector('[name=name]')?.value || '').trim();
      const email = (this.querySelector('[name=email]')?.value || '').trim();
      const phone = (this.querySelector('[name=phone]')?.value || '').trim();
      const engine = (this.querySelector('[name=engine]')?.value || '').trim();
      const message = (this.querySelector('[name=message]')?.value || '').trim();

      const docLang = document.documentElement.lang || 'en';

      // WhatsApp text
      let waText = '';
      let subject = '';
      let body = '';
      let titleHtml = '';
      let textHtml = '';
      let waBtnLabel = '';
      let mailBtnLabel = '';

      if (docLang === 'ar') {
        subject = `طلب استفسار قطع غيار من ${name} [دويتس ${engine || ''}]`;
        body = `الاسم / الشركة: ${name}\n` +
               `البريد الإلكتروني: ${email}\n` +
               `رقم الهاتف / واتساب: ${phone}\n` +
               `طراز محرك دويتس: ${engine}\n\n` +
               `تفاصيل القطع المطلوبة:\n${message}\n\n` +
               `---\nتم الإرسال عبر نموذج الاتصال بموقع شركة أوبتريست`;

        waText = `*طلب استفسار قطع غيار — شركة أوبتريست*\n\n` +
                 `👤 *الاسم / الشركة:* ${name}\n` +
                 `✉️ *البريد:* ${email}\n` +
                 `📞 *الهاتف:* ${phone}\n` +
                 `⚙️ *طراز محرك دويتس:* ${engine}\n\n` +
                 `📝 *القطع المطلوبة:*\n${message}`;

        titleHtml = '✅ تم استلام بيانات طلبكم بنجاح!';
        textHtml = 'جاري توجيهك لبريدك الإلكتروني، أو يمكنك الإرسال الفوري والمباشر لفريق المبيعات عبر واتساب:';
        waBtnLabel = '💬 إرسال فوراً عبر واتساب (201223161181+)';
        mailBtnLabel = '✉️ فتح تطبيق البريد (optristco@icloud.com)';
      } else if (docLang === 'de') {
        subject = `Ersatzteilanfrage von ${name} [Deutz ${engine || ''}]`;
        body = `Name / Firma: ${name}\n` +
               `E-Mail: ${email}\n` +
               `Telefon / WhatsApp: ${phone}\n` +
               `Deutz Motormodell: ${engine}\n\n` +
               `Anfrage Details:\n${message}\n\n` +
               `---\nGesendet über das Optrist Co Kontaktformular`;

        waText = `*Ersatzteilanfrage — Optrist Co*\n\n` +
                 `👤 *Name / Firma:* ${name}\n` +
                 `✉️ *E-Mail:* ${email}\n` +
                 `📞 *Telefon:* ${phone}\n` +
                 `⚙️ *Deutz Modell:* ${engine}\n\n` +
                 `📝 *Anfrage:*\n${message}`;

        titleHtml = '✅ Anfrage erfolgreich übermittelt!';
        textHtml = 'Ihr E-Mail-Programm wird aufgerufen. Alternativ können Sie Ihre Anfrage direkt per WhatsApp an unser Team senden:';
        waBtnLabel = '💬 Direkt per WhatsApp senden (+201223161181)';
        mailBtnLabel = '✉️ E-Mail-Programm öffnen (optristco@icloud.com)';
      } else {
        subject = `Parts Inquiry from ${name} [Deutz ${engine || ''}]`;
        body = `Name / Company: ${name}\n` +
               `Email: ${email}\n` +
               `Phone / WhatsApp: ${phone}\n` +
               `Deutz Engine Model: ${engine}\n\n` +
               `Required Parts & Notes:\n${message}\n\n` +
               `---\nSubmitted via Optrist Co Official Contact Form`;

        waText = `*Parts Inquiry — Optrist Co*\n\n` +
                 `👤 *Name / Company:* ${name}\n` +
                 `✉️ *Email:* ${email}\n` +
                 `📞 *Phone:* ${phone}\n` +
                 `⚙️ *Deutz Model:* ${engine}\n\n` +
                 `📝 *Inquiry:*\n${message}`;

        titleHtml = '✅ Inquiry Prepared Successfully!';
        textHtml = 'We are opening your email application. You can also send this inquiry directly to our sales desk via WhatsApp:';
        waBtnLabel = '💬 Send via WhatsApp (+201223161181)';
        mailBtnLabel = '✉️ Open Email App (optristco@icloud.com)';
      }

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;
      const mailtoUrl = `mailto:${PRIMARY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Create or update on-screen feedback box
      let feedbackBox = document.getElementById('contact-feedback');
      if (!feedbackBox) {
        feedbackBox = document.createElement('div');
        feedbackBox.id = 'contact-feedback';
        feedbackBox.className = 'contact-feedback-box';
        contactForm.parentNode.insertBefore(feedbackBox, contactForm.nextSibling);
      }

      feedbackBox.innerHTML = `
        <h4>${titleHtml}</h4>
        <p>${textHtml}</p>
        <div class="btn-actions">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="background:#25D366;border-color:#25D366;color:#ffffff;font-weight:600;">
            ${waBtnLabel}
          </a>
          <a href="${mailtoUrl}" class="btn btn-secondary" style="border:1px solid #059669;color:#059669;background:#ffffff;font-weight:600;">
            ${mailBtnLabel}
          </a>
        </div>
      `;

      feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Automatically trigger mail client
      setTimeout(() => {
        try {
          window.location.href = mailtoUrl;
        } catch (err) {
          console.warn('Mailto dispatch:', err);
        }
      }, 500);
    });
  }

  /* ── 6. BACKWARD COMPATIBLE POPUP HANDLING (if elements exist) ── */
  const chatLauncher = document.getElementById('chat-launcher');
  const chatPopup = document.getElementById('chat-popup');
  const chatCloseBtn = document.getElementById('chat-close');
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
  }

})();
