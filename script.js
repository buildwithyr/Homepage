'use strict';

// ── Navbar scroll effect ──────────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mobile hamburger ──────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

hamburger.addEventListener('click', () => {
  const open = navMobile.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
});

document.querySelectorAll('.nav-mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// ── Scroll reveal ─────────────────────────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealObserver.observe(el));

// ── Gallery tabs & filter ─────────────────────────────────────────────────────
const tabs = document.querySelectorAll('.gallery-tab');
const items = document.querySelectorAll('.gallery-item');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;

    items.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.style.display = match ? 'block' : 'none';
    });
  });
});

// ── Gallery drag-to-scroll ────────────────────────────────────────────────────
const trackWrap = document.querySelector('.gallery-track-wrap');
let isDown = false, startX = 0, scrollLeft = 0;

trackWrap.addEventListener('mousedown', e => {
  isDown = true;
  trackWrap.classList.add('grabbing');
  startX = e.pageX - trackWrap.offsetLeft;
  scrollLeft = trackWrap.scrollLeft;
});
document.addEventListener('mouseup', () => {
  isDown = false;
  trackWrap.classList.remove('grabbing');
});
trackWrap.addEventListener('mousemove', e => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - trackWrap.offsetLeft;
  trackWrap.scrollLeft = scrollLeft - (x - startX) * 1.2;
});

// ── Lightbox ──────────────────────────────────────────────────────────────────
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let lightboxImages = [];
let lightboxIndex = 0;

function buildImageList() {
  lightboxImages = [];
  document.querySelectorAll('.gallery-item:not(.gallery-placeholder)').forEach(item => {
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-item-overlay span');
    if (img && item.style.display !== 'none') {
      lightboxImages.push({ src: img.src, alt: img.alt, caption: caption ? caption.textContent : '' });
    }
  });
}

function openLightbox(index) {
  buildImageList();
  lightboxIndex = index;
  showLightboxImage();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showLightboxImage() {
  if (!lightboxImages.length) return;
  const d = lightboxImages[lightboxIndex];
  lightboxImg.src = d.src;
  lightboxImg.alt = d.alt;
  lightboxCaption.textContent = d.caption;
}

document.querySelectorAll('.gallery-item:not(.gallery-placeholder)').forEach((item, i) => {
  item.addEventListener('click', () => {
    buildImageList();
    const visibleItems = Array.from(document.querySelectorAll('.gallery-item:not(.gallery-placeholder)'))
      .filter(el => el.style.display !== 'none');
    const idx = visibleItems.indexOf(item);
    openLightbox(Math.max(0, idx));
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

lightboxPrev.addEventListener('click', () => {
  lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
  showLightboxImage();
});
lightboxNext.addEventListener('click', () => {
  lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
  showLightboxImage();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') { lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length; showLightboxImage(); }
  if (e.key === 'ArrowRight') { lightboxIndex = (lightboxIndex + 1) % lightboxImages.length; showLightboxImage(); }
});

// Touch swipe for lightbox
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) {
    lightboxIndex = diff > 0
      ? (lightboxIndex + 1) % lightboxImages.length
      : (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    showLightboxImage();
  }
});

// ── FAQ accordion ─────────────────────────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item.open').forEach(el => {
      el.classList.remove('open');
      el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ── Smooth scroll for anchor links ────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});
