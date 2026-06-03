'use strict';

// ── Nav scroll ────────────────────────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Cinematic hero reveal ─────────────────────────────────────────────────────
// Foto bleibt gepinnt. Beim Scrollen: Pfeil blendet aus, Overlay blendet ein,
// Name fährt aus dem Bild nach oben. Reversibel beim Zurückscrollen.
const heroSticky = document.getElementById('heroSticky');
if (heroSticky) {
  let ticking = false;
  const updateHero = () => {
    // Trigger bei ~35 % Viewport-Höhe – früh genug für einen fließenden Effekt
    heroSticky.classList.toggle('revealed', window.scrollY > window.innerHeight * 0.35);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(updateHero); ticking = true; }
  }, { passive: true });
  updateHero();
}

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
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Gallery tabs & filter ─────────────────────────────────────────────────────
document.querySelectorAll('.gallery-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    document.querySelectorAll('#galleryTrack .gallery-item').forEach(item => {
      item.style.display = filter === 'all' || item.dataset.category === filter ? 'block' : 'none';
    });
  });
});

// ── Drag-to-scroll for any .gallery-track-wrap ────────────────────────────────
function makeDraggable(wrap) {
  let isDown = false, startX = 0, scrollLeft = 0;

  wrap.addEventListener('mousedown', e => {
    isDown = true;
    wrap.classList.add('grabbing');
    startX = e.pageX - wrap.offsetLeft;
    scrollLeft = wrap.scrollLeft;
  });
  wrap.addEventListener('mouseleave', () => { isDown = false; wrap.classList.remove('grabbing'); });
  wrap.addEventListener('mouseup', () => { isDown = false; wrap.classList.remove('grabbing'); });
  wrap.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    wrap.scrollLeft = scrollLeft - (e.pageX - wrap.offsetLeft - startX) * 1.2;
  });
}

document.querySelectorAll('.gallery-track-wrap').forEach(makeDraggable);

// ── Lightbox ──────────────────────────────────────────────────────────────────
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCap = document.getElementById('lightboxCaption');

let lbImages = [];
let lbIndex  = 0;

function gatherImages(scope) {
  lbImages = [];
  document.querySelectorAll(scope).forEach(item => {
    if (item.style.display === 'none') return;
    const img = item.querySelector('img');
    const cap = item.querySelector('.gallery-item-overlay span');
    if (img) lbImages.push({ src: img.src, alt: img.alt, caption: cap ? cap.textContent : '' });
  });
}

function openLightbox(items, idx) {
  lbImages = items;
  lbIndex = idx;
  showLbImage();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showLbImage() {
  if (!lbImages.length) return;
  const d = lbImages[lbIndex];
  lightboxImg.src = d.src;
  lightboxImg.alt = d.alt;
  lightboxCap.textContent = d.caption;
}

// Gallery lightbox
document.querySelectorAll('#galleryTrack .gallery-item').forEach((item) => {
  item.addEventListener('click', () => {
    const visible = Array.from(document.querySelectorAll('#galleryTrack .gallery-item'))
      .filter(el => el.style.display !== 'none');
    const images = visible.map(el => {
      const img = el.querySelector('img');
      const cap = el.querySelector('.gallery-item-overlay span');
      return { src: img.src, alt: img.alt, caption: cap ? cap.textContent : '' };
    });
    openLightbox(images, visible.indexOf(item));
  });
});

// Oskar lightbox
document.querySelectorAll('.oskar-item').forEach((item, i, all) => {
  item.addEventListener('click', () => {
    const images = Array.from(all).map(el => {
      const img = el.querySelector('img');
      const cap = el.querySelector('.gallery-item-overlay span');
      return { src: img.src, alt: img.alt, caption: cap ? cap.textContent : '' };
    });
    openLightbox(images, i);
  });
});

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.getElementById('lightboxPrev').addEventListener('click', () => {
  lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
  showLbImage();
});
document.getElementById('lightboxNext').addEventListener('click', () => {
  lbIndex = (lbIndex + 1) % lbImages.length;
  showLbImage();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')  { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; showLbImage(); }
  if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % lbImages.length; showLbImage(); }
});

let lbTouchX = 0;
lightbox.addEventListener('touchstart', e => { lbTouchX = e.changedTouches[0].screenX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const diff = lbTouchX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) {
    lbIndex = diff > 0
      ? (lbIndex + 1) % lbImages.length
      : (lbIndex - 1 + lbImages.length) % lbImages.length;
    showLbImage();
  }
});

// ── YouTube Facade ────────────────────────────────────────────────────────────
const facade = document.getElementById('videoFacade');
if (facade) {
  const load = () => {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/Q7wlRB4WaYM?autoplay=1&rel=0&modestbranding=1';
    iframe.allow = 'autoplay; fullscreen; picture-in-picture';
    iframe.allowFullscreen = true;
    facade.innerHTML = '';
    facade.appendChild(iframe);
    facade.style.cursor = 'default';
  };
  facade.addEventListener('click', load);
  facade.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') load(); });
}

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

// ── Smooth anchor scroll ──────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - 64, behavior: 'smooth' });
  });
});
