'use strict';

// ── Navbar scroll effect ──────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile nav toggle ─────────────────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});

// Close on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ── Hero video fallback ───────────────────────────────────────────────────────
const heroVideo    = document.getElementById('heroVideo');
const heroFallback = document.getElementById('heroFallback');

if (heroVideo) {
  heroVideo.addEventListener('error', () => {
    heroVideo.style.display = 'none';
    heroFallback.style.display = 'block';
  });
  // If video can't be loaded at all (no src)
  if (!heroVideo.querySelector('source[src]') || heroVideo.networkState === 3) {
    heroVideo.style.display = 'none';
    heroFallback.style.display = 'block';
  }
}

// ── Intersection Observer for reveal animations ───────────────────────────────
const revealEls = document.querySelectorAll(
  '.reveal-up, .reveal-left, .reveal-right, .reveal-fade'
);

// Skip hero elements (animated via CSS keyframes instead)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => {
  if (!el.closest('#hero')) observer.observe(el);
});

// ── Lightbox ──────────────────────────────────────────────────────────────────
const lightbox        = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
const lightboxClose   = document.getElementById('lightboxClose');
const lightboxPrev    = document.getElementById('lightboxPrev');
const lightboxNext    = document.getElementById('lightboxNext');
const galleryItems    = Array.from(document.querySelectorAll('.gallery-item'));

let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  renderLightboxItem();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function renderLightboxItem() {
  const item = galleryItems[currentIndex];
  if (!item) return;
  const srcImg = item.querySelector('img');
  const label  = item.querySelector('.gallery-label');
  lightboxContent.innerHTML = '';
  if (srcImg) {
    const img = document.createElement('img');
    img.src = srcImg.src;
    img.alt = srcImg.alt;
    img.style.cssText = 'max-width:90vw;max-height:85vh;border-radius:12px;display:block;object-fit:contain;';
    lightboxContent.appendChild(img);
    if (label) {
      const cap = document.createElement('p');
      cap.textContent = label.textContent;
      cap.style.cssText = 'text-align:center;margin-top:14px;font-size:14px;color:rgba(255,255,255,0.6);';
      lightboxContent.appendChild(cap);
    }
  } else {
    const clone = item.querySelector('.gallery-placeholder').cloneNode(true);
    const overlay = clone.querySelector('.gallery-overlay');
    if (overlay) overlay.style.opacity = '1';
    lightboxContent.appendChild(clone);
  }
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');
  item.setAttribute('aria-label', `Bild ${i + 1} vergrößern`);
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
lightboxPrev.addEventListener('click', (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
  renderLightboxItem();
});
lightboxNext.addEventListener('click', (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % galleryItems.length;
  renderLightboxItem();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') { currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length; renderLightboxItem(); }
  if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % galleryItems.length; renderLightboxItem(); }
});

// ── Video overlay ─────────────────────────────────────────────────────────────
const videoOverlay      = document.getElementById('videoOverlay');
const videoOverlayClose = document.getElementById('videoOverlayClose');

document.querySelectorAll('.video-card').forEach(card => {
  card.addEventListener('click', () => {
    videoOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeVideoOverlay() {
  videoOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

videoOverlayClose.addEventListener('click', closeVideoOverlay);
videoOverlay.addEventListener('click', e => { if (e.target === videoOverlay) closeVideoOverlay(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && videoOverlay.classList.contains('active')) closeVideoOverlay();
});

// ── Legal modals ──────────────────────────────────────────────────────────────
const impressumLink = document.getElementById('impressumLink');
const privacyLink   = document.getElementById('privacyLink');

function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('active'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('active'); document.body.style.overflow = ''; }
}

impressumLink && impressumLink.addEventListener('click', e => { e.preventDefault(); openModal('impressumModal'); });
privacyLink   && privacyLink.addEventListener('click',   e => { e.preventDefault(); openModal('privacyModal');   });

// Also privacy link in DSGVO checkbox label
document.querySelector('.form-dsgvo a') && document.querySelector('.form-dsgvo a').addEventListener('click', e => {
  e.preventDefault(); openModal('privacyModal');
});

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.modal));
});

document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(modal.id); });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(m => closeModal(m.id));
  }
});

// ── Contact form ──────────────────────────────────────────────────────────────
const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');

contactForm && contactForm.addEventListener('submit', e => {
  e.preventDefault();

  const name    = contactForm.querySelector('#name').value.trim();
  const email   = contactForm.querySelector('#email').value.trim();
  const message = contactForm.querySelector('#message').value.trim();
  const dsgvo   = contactForm.querySelector('#dsgvo').checked;

  if (!name || !email || !message) {
    showFormMsg('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showFormMsg('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
    return;
  }

  if (!dsgvo) {
    showFormMsg('Bitte stimmen Sie der Datenschutzerklärung zu.', 'error');
    return;
  }

  // Simulate submission
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = 'Wird gesendet…';
  btn.disabled = true;

  setTimeout(() => {
    contactForm.reset();
    btn.textContent = 'Nachricht senden';
    btn.disabled = false;
    showFormMsg('Vielen Dank! Ihre Nachricht wurde gesendet. Ich melde mich innerhalb von 24 Stunden.', 'show');
  }, 1200);
});

function showFormMsg(msg, cls) {
  formSuccess.textContent = msg;
  formSuccess.className = `form-success ${cls}`;
  setTimeout(() => { formSuccess.className = 'form-success'; }, 6000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Smooth active nav link on scroll ─────────────────────────────────────────
const sections = document.querySelectorAll('section[id], footer[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active-link', a.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

// ── Subtle parallax on hero ───────────────────────────────────────────────────
const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    heroContent.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }
}, { passive: true });
