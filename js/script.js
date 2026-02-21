/* =====================
   HOTEL WEBSITE SCRIPTS
   ===================== */

// ---- CONFIG ----
const CONFIG = {
  whatsappNumber: '919876543210', // Replace with actual number
  hotelName: 'The Grand Lotus',
};

// ---- NAVBAR ----
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ---- HAMBURGER ----
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileClose = document.querySelector('.mobile-close');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileClose?.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
}

// ---- HERO BG KEN BURNS ----
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  setTimeout(() => heroBg.classList.add('loaded'), 100);
}

// ---- SCROLL REVEAL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- ACTIVE NAV ----
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// ---- WHATSAPP HELPERS ----
function buildWhatsAppLink(message) {
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// ---- GALLERY LIGHTBOX ----
let galleryImages = [];
let currentLightboxIndex = 0;

function initLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');

  if (!lightbox || !items.length) return;

  galleryImages = Array.from(items).map(item => ({
    src: item.querySelector('img')?.src,
    alt: item.querySelector('img')?.alt || '',
    label: item.querySelector('.gallery-overlay-label')?.textContent || '',
  }));

  function openLightbox(index) {
    currentLightboxIndex = index;
    const img = galleryImages[index];
    if (lightboxImg) { lightboxImg.src = img.src; lightboxImg.alt = img.alt; }
    if (lightboxCaption) lightboxCaption.textContent = `${img.label} — ${index + 1} / ${galleryImages.length}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    currentLightboxIndex = (currentLightboxIndex + dir + galleryImages.length) % galleryImages.length;
    openLightbox(currentLightboxIndex);
  }

  items.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
  document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
  document.querySelector('.lightbox-prev')?.addEventListener('click', () => navigate(-1));
  document.querySelector('.lightbox-next')?.addEventListener('click', () => navigate(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}
initLightbox();

// ---- GALLERY FILTER ----
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.display = show ? '' : 'none';
        if (show) {
          item.style.animation = 'fadeIn 0.4s ease forwards';
        }
      });
    });
  });
}
initGalleryFilter();

// ---- CONTACT FORM ----
function initContactForm() {
  const form = document.querySelector('.contact-form form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[required]').forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#e74c3c';
        valid = false;
      }
    });

    const email = form.querySelector('[type="email"]');
    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.style.borderColor = '#e74c3c';
      valid = false;
    }

    if (valid) {
      const successMsg = form.parentElement.querySelector('.form-success');
      if (successMsg) {
        successMsg.style.display = 'block';
        form.reset();
        setTimeout(() => successMsg.style.display = 'none', 5000);
      }
    }
  });
}
initContactForm();

// ---- PARALLAX ----
window.addEventListener('scroll', () => {
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    heroBg.style.transform = `translateY(${window.scrollY * 0.3}px) scale(1)`;
  }
}, { passive: true });

// ---- COUNTER ANIMATION ----
function animateCounters() {
  document.querySelectorAll('.counter').forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      counter.textContent = Math.floor(current) + (counter.dataset.suffix || '');
    }, 16);
  });
}

const countersSection = document.querySelector('.stats-section');
if (countersSection) {
  const counterObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounters();
      counterObserver.disconnect();
    }
  }, { threshold: 0.5 });
  counterObserver.observe(countersSection);
}
