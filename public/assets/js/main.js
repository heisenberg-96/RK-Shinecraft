// RK Shinecraft — frontend logic
// Fetches real content from the backend API and wires up the lead-capture forms.

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initRevealAnimations();
  initNavbarScroll();
  initParallax();
  loadCompanyInfo();
  loadServices();
  initContactForm();
});

/* ----------------------------- UI behaviors ----------------------------- */

function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    menu.classList.toggle('flex');
  });
  menu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      menu.classList.add('hidden');
      menu.classList.remove('flex');
    });
  });
}

function initRevealAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.1 });
  revealElements.forEach((el) => revealObserver.observe(el));
}

function initNavbarScroll() {
  const nav = document.getElementById('top-nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-md', 'h-16');
      nav.classList.remove('h-20');
    } else {
      nav.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-md', 'h-16');
      nav.classList.add('h-20');
    }
  });
}

function initParallax() {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroImage = document.getElementById('hero-image');
    if (heroImage) heroImage.style.transform = `translateY(${scrolled * 0.4}px)`;
  });
}

function animateStat(el, target, suffix) {
  let current = 0;
  const increment = Math.max(target / 50, 1);
  const step = () => {
    current += increment;
    if (current < target) {
      el.innerText = Math.ceil(current) + suffix;
      requestAnimationFrame(() => setTimeout(step, 20));
    } else {
      el.innerText = target + suffix;
    }
  };
  step();
}

/* ------------------------------ Data loading ----------------------------- */

async function loadCompanyInfo() {
  try {
    const res = await fetch('/api/company');
    const { data: company } = await res.json();
    if (!company) return;

    // Why choose us list (About section)
    const whyList = document.getElementById('why-choose-us');
    if (whyList && Array.isArray(company.whyChooseUs)) {
      whyList.innerHTML = company.whyChooseUs.map((item) => `
        <li class="flex items-start gap-3">
          <span class="material-symbols-outlined text-gold-accent text-xl mt-0.5">check_circle</span>
          <span class="font-body-md text-on-surface-variant">${escapeHtml(item)}</span>
        </li>`).join('');
    }

    // Stats counters
    const statsGrid = document.getElementById('stats-grid');
    if (statsGrid && Array.isArray(company.stats)) {
      statsGrid.innerHTML = company.stats.map((s) => `
        <div class="reveal">
          <div class="text-primary font-display-lg text-[80px] leading-none mb-4 font-bold" data-target="${s.value}" data-suffix="${s.suffix || ''}">0</div>
          <p class="font-label-caps text-label-caps uppercase tracking-[0.2em] text-on-surface-variant">${escapeHtml(s.label)}</p>
        </div>`).join('');

      const statElements = statsGrid.querySelectorAll('[data-target]');
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            animateStat(el, parseInt(el.getAttribute('data-target'), 10), el.getAttribute('data-suffix') || '');
            statsObserver.unobserve(el);
          }
        });
      }, { threshold: 0.5 });
      statElements.forEach((el) => statsObserver.observe(el));
      document.querySelectorAll('.reveal').forEach((el) => {
        // re-trigger observer for newly injected reveal nodes
        if (!el.classList.contains('active')) {
          new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) { entry.target.classList.add('active'); obs.unobserve(entry.target); }
            });
          }, { threshold: 0.1 }).observe(el);
        }
      });
    }

    // Contact details (contact section)
    const contactDetails = document.getElementById('contact-details');
    if (contactDetails && company.contact) {
      contactDetails.innerHTML = `
        <div class="flex items-center gap-6">
          <div class="w-12 h-12 rounded-full border-2 border-gold-accent/50 flex items-center justify-center text-gold-accent shadow-sm">
            <span class="material-symbols-outlined">call</span>
          </div>
          <a href="tel:+${company.contact.phoneRaw}" class="font-body-lg text-body-lg text-primary font-bold">${escapeHtml(company.contact.phone)}</a>
        </div>
        <div class="flex items-center gap-6">
          <div class="w-12 h-12 rounded-full border-2 border-gold-accent/50 flex items-center justify-center text-gold-accent shadow-sm">
            <span class="material-symbols-outlined">mail</span>
          </div>
          <a href="mailto:${escapeHtml(company.contact.email)}" class="font-body-lg text-body-lg text-primary font-bold">${escapeHtml(company.contact.email)}</a>
        </div>
        <div class="flex items-center gap-6">
          <div class="w-12 h-12 rounded-full border-2 border-gold-accent/50 flex items-center justify-center text-gold-accent shadow-sm">
            <span class="material-symbols-outlined">location_on</span>
          </div>
          <p class="font-body-md text-on-surface-variant">${escapeHtml(company.contact.address)}</p>
        </div>
        <div class="flex items-center gap-6">
          <div class="w-12 h-12 rounded-full border-2 border-gold-accent/50 flex items-center justify-center text-gold-accent shadow-sm">
            <span class="material-symbols-outlined">schedule</span>
          </div>
          <p class="font-body-md text-on-surface-variant">${escapeHtml(company.contact.hours)}</p>
        </div>`;
    }

    // Footer contact list
    const footerContact = document.getElementById('footer-contact');
    if (footerContact && company.contact) {
      footerContact.innerHTML = `
        <li class="font-bold text-white">${escapeHtml(company.contact.address)}</li>
        <li><a href="tel:+${company.contact.phoneRaw}" class="hover:text-gold-accent">${escapeHtml(company.contact.phone)}</a></li>
        <li><a href="mailto:${escapeHtml(company.contact.email)}" class="hover:text-gold-accent">${escapeHtml(company.contact.email)}</a></li>
        <li class="pt-4 text-gold-accent font-bold">${escapeHtml(company.contact.hours)}</li>`;
    }
  } catch (err) {
    console.error('Failed to load company info:', err);
  }
}

async function loadServices() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;
  try {
    const res = await fetch('/api/services');
    const { data: services } = await res.json();
    if (!Array.isArray(services) || services.length === 0) {
      grid.innerHTML = '<p class="col-span-3 text-center text-on-surface-variant">Services unavailable right now — please call us directly.</p>';
      return;
    }
    grid.innerHTML = services.map((svc) => `
      <div class="bg-white p-10 rounded-xl border-2 border-gold-accent/20 shadow-soft hover:border-gold-accent transition-all duration-500 reveal group">
        <span class="material-symbols-outlined text-4xl text-gold-accent mb-6">${escapeHtml(svc.icon || 'diamond')}</span>
        <h3 class="font-headline-md text-headline-md mb-4 text-primary">${escapeHtml(svc.title)}</h3>
        <p class="font-body-md text-on-surface-variant mb-6">${escapeHtml(svc.description)}</p>
        <a class="font-label-caps text-label-caps uppercase tracking-widest text-primary group-hover:text-gold-accent transition-colors border-b-2 border-transparent hover:border-gold-accent pb-1 cursor-pointer" data-service="${escapeHtml(svc.title)}">Request This Service →</a>
      </div>`).join('');

    // Re-observe newly added reveal nodes
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    grid.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

    // Clicking "Request This Service" scrolls to contact and preselects the service
    grid.querySelectorAll('[data-service]').forEach((link) => {
      link.addEventListener('click', () => {
        const serviceSelect = document.getElementById('cf-service');
        if (serviceSelect) {
          const wanted = link.getAttribute('data-service');
          const match = Array.from(serviceSelect.options).find((o) => wanted.includes(o.value.split(' ')[0]) || o.value === wanted);
          if (match) serviceSelect.value = match.value;
        }
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      });
    });
  } catch (err) {
    console.error('Failed to load services:', err);
    grid.innerHTML = '<p class="col-span-3 text-center text-on-surface-variant">Could not load services. Please call us directly.</p>';
  }
}

/* ------------------------------ Contact form ------------------------------ */

function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('cf-status');
  const submitBtn = document.getElementById('cf-submit');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.classList.remove('show');
    statusEl.classList.remove('text-error', 'text-green-700');

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      serviceType: form.serviceType.value,
      message: form.message.value.trim()
    };

    submitBtn.disabled = true;
    submitBtn.innerText = 'Sending…';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error((data.errors && data.errors.join(' ')) || 'Submission failed.');
      }

      statusEl.textContent = data.message || 'Thank you — we will be in touch shortly.';
      statusEl.classList.add('show', 'text-green-700');
      form.reset();
    } catch (err) {
      statusEl.textContent = err.message || 'Something went wrong. Please call us directly at +91 98315 85950.';
      statusEl.classList.add('show', 'text-error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Submit Inquiry';
    }
  });
}

/* -------------------------------- Helpers -------------------------------- */

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
