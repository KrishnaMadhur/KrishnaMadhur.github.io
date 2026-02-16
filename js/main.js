/* ============================================
   Krishna Madhur Akella — Portfolio JS
   Smooth scroll, fade-in, nav highlighting
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- Scroll fade-in (Intersection Observer) ---------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeEls.forEach(el => observer.observe(el));

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function highlightNav() {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* ---------- Smooth scroll for nav links ---------- */
  navAnchors.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------- PDF Preview Modal ---------- */
  const pdfModal = document.getElementById('pdf-modal');
  const pdfViewer = document.getElementById('pdf-viewer');
  const pdfClose = document.querySelector('.pdf-modal-close');
  const pdfOverlay = document.querySelector('.pdf-modal-overlay');

  function openPdfModal(src) {
    // #toolbar=0 hides the browser PDF toolbar (download, print buttons)
    pdfViewer.src = src + '#toolbar=0&navpanes=0';
    pdfModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closePdfModal() {
    pdfModal.style.display = 'none';
    pdfViewer.src = '';
    document.body.style.overflow = '';
  }

  // Attach to project title links
  document.querySelectorAll('.project-title-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const report = link.getAttribute('data-report');
      if (report) openPdfModal(report);
    });
  });

  if (pdfClose) pdfClose.addEventListener('click', closePdfModal);
  if (pdfOverlay) pdfOverlay.addEventListener('click', closePdfModal);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pdfModal.style.display === 'flex') {
      closePdfModal();
    }
  });

});
