'use strict';

// ── Nav scroll ────────────────────────────────────────────────────────────────
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

// ── Fun Ending ────────────────────────────────────────────────────────────────
(function () {
  const btnJa      = document.getElementById('btnJa');
  const btnNein    = document.getElementById('btnNein');
  const modal      = document.getElementById('coffeeModal');
  const modalClose = document.getElementById('coffeeModalClose');
  if (!btnJa) return; // section not present → bail out

  // Modal
  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  btnJa.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Nein button – dodge on hover / touch
  let tx = 0, ty = 0;

  function dodge(px, py) {
    const r  = btnNein.getBoundingClientRect();
    const bx = r.left + r.width  / 2;
    const by = r.top  + r.height / 2;
    const dx = bx - px, dy = by - py;
    const d  = Math.hypot(dx, dy) || 1;
    // Move 230px away from the pointer
    let nx = bx + (dx / d) * 230;
    let ny = by + (dy / d) * 230;
    // Clamp within viewport (keep clear of nav bar at top)
    const m = 20, navH = 72;
    nx = Math.max(r.width  / 2 + m,         Math.min(window.innerWidth  - r.width  / 2 - m, nx));
    ny = Math.max(r.height / 2 + m + navH,  Math.min(window.innerHeight - r.height / 2 - m, ny));
    tx += nx - bx;
    ty += ny - by;
    btnNein.style.transform = `translate(${tx}px,${ty}px)`;
  }

  btnNein.addEventListener('mouseenter', e => dodge(e.clientX, e.clientY));
  btnNein.addEventListener('touchstart', e => {
    e.preventDefault(); // prevents synthesised click so the button can't be tapped
    dodge(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });
}());
