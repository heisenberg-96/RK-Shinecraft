// RK Shinecraft — frontend logic

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

/* ------------------------------ Static data ------------------------------ */

const COMPANY = {
  whyChooseUs: [
    'Experienced team with proven expertise',
    'Latest machines and eco-friendly chemicals',
    'Affordable packages with guaranteed results',
    'Trusted by residential societies, corporates, and luxury hotels'
  ],
  stats: [
    { label: 'Years of Excellence', value: 8, suffix: '+' },
    { label: 'Projects Completed', value: 500, suffix: '+' },
    { label: 'Satisfaction Rate', value: 100, suffix: '%' }
  ],
  contact: {
    phone: '+91 98315 85950',
    phoneRaw: '919831585950',
    email: 'rkshinecraft@gmail.com',
    address: 'C1-34/g3, Shantiniketan Apartment, Block A, Sontoshpur Govt. Colony, Mollargate, Kolkata – 700142',
    hours: 'Monday – Saturday, 8:00 AM – 6:00 PM'
  }
};

const SERVICES = [
  {
    id: 'marble-polishing',
    icon: 'diamond',
    title: 'Marble Floor Polishing & Crystallization',
    description: 'Restoring high-gloss clarity through precise grit-progression diamond honing and crystallization for a mirror-like finish.'
  },
  {
    id: 'stone-restoration',
    icon: 'handyman',
    title: 'Deep Cleaning & Restoration',
    description: 'Deep cleaning and restoration of stone surfaces — repairing cracks, chips, and etching with premium, color-matched techniques.'
  },
  {
    id: 'stone-polishing',
    icon: 'grain',
    title: 'Granite, Mosaic & Kota Stone Polishing',
    description: "Specialised polishing for granite, mosaic, and Kota stone surfaces, tailored to each material’s natural composition."
  },
  {
    id: 'amc',
    icon: 'verified_user',
    title: 'Annual Maintenance Contracts (AMC)',
    description: 'Scheduled upkeep programs that keep your stone surfaces consistently pristine year-round, with priority scheduling.'
  },
  {
    id: 'custom-solutions',
    icon: 'apartment',
    title: 'Custom Solutions for Homes, Hotels & Offices',
    description: 'Tailored programs for residential societies, corporates, and luxury hospitality spaces of any scale.'
  },
  {
    id: 'one-time-polish',
    icon: 'auto_awesome',
    title: 'One-Time Polishing Service',
    description: 'A single, thorough polishing visit for homeowners and businesses who want an immediate, lasting transformation.'
  }
];

/* ------------------------------ Data loading ----------------------------- */

function loadCompanyInfo() {
  const company = COMPANY;

  const whyList = document.getElementById('why-choose-us');
  if (whyList && Array.isArray(company.whyChooseUs)) {
    whyList.innerHTML = company.whyChooseUs.map((item) => `
      <li class="flex items-start gap-3">
        <span class="material-symbols-outlined text-gold-accent text-xl mt-0.5">check_circle</span>
        <span class="font-body-md text-on-surface-variant">${escapeHtml(item)}</span>
      </li>`).join('');
  }

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
      if (!el.classList.contains('active')) {
        new IntersectionObserver((entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) { entry.target.classList.add('active'); obs.unobserve(entry.target); }
          });
        }, { threshold: 0.1 }).observe(el);
      }
    });
  }

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

  const footerContact = document.getElementById('footer-contact');
  if (footerContact && company.contact) {
    footerContact.innerHTML = `
      <li class="font-bold text-white">${escapeHtml(company.contact.address)}</li>
      <li><a href="tel:+${company.contact.phoneRaw}" class="hover:text-gold-accent">${escapeHtml(company.contact.phone)}</a></li>
      <li><a href="mailto:${escapeHtml(company.contact.email)}" class="hover:text-gold-accent">${escapeHtml(company.contact.email)}</a></li>
      <li class="pt-4 text-gold-accent font-bold">${escapeHtml(company.contact.hours)}</li>`;
  }
}

function loadServices() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;

  grid.innerHTML = SERVICES.map((svc) => `
    <div class="bg-white p-10 rounded-xl border-2 border-gold-accent/20 shadow-soft hover:border-gold-accent transition-all duration-500 reveal group">
      <span class="material-symbols-outlined text-4xl text-gold-accent mb-6">${escapeHtml(svc.icon || 'diamond')}</span>
      <h3 class="font-headline-md text-headline-md mb-4 text-primary">${escapeHtml(svc.title)}</h3>
      <p class="font-body-md text-on-surface-variant mb-6">${escapeHtml(svc.description)}</p>
      <a class="font-label-caps text-label-caps uppercase tracking-widest text-primary group-hover:text-gold-accent transition-colors border-b-2 border-transparent hover:border-gold-accent pb-1 cursor-pointer" data-service="${escapeHtml(svc.title)}">Request This Service →</a>
    </div>`).join('');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('active'); });
  }, { threshold: 0.1 });
  grid.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

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
}

/* ------------------------------ Contact form ------------------------------ */

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name        = form.name.value.trim();
    const email       = form.email.value.trim();
    const phone       = form.phone.value.trim();
    const serviceType = form.serviceType.value;
    const message     = form.message.value.trim();

    const subject = encodeURIComponent(`Inquiry: ${serviceType}`);
    const body    = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${serviceType}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:rkshinecraft@gmail.com?subject=${subject}&body=${body}`;
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
