/* ============================================
   Krishna Madhur Akella — Personal Website JS
   Tab navigation, mood zone transitions,
   3D tilt cards, float-up, tag filtering,
   lightbox, PDF preview
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Tab Navigation + Mood Zones ---------- */
  const tabs = document.querySelectorAll('.nav-tab');
  const views = document.querySelectorAll('.view');
  const body = document.body;

  function triggerFloatUps(view) {
    const items = view.querySelectorAll('.float-up');
    items.forEach(el => el.classList.remove('visible'));
    // Stagger: add visible class after a tiny delay
    setTimeout(() => {
      items.forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 80);
      });
    }, 100);
  }

  function switchView(viewId) {
    // Hide all views
    views.forEach(v => v.classList.remove('active'));

    // Deactivate all tabs
    tabs.forEach(t => t.classList.remove('active'));

    // Show selected view
    const target = document.getElementById(viewId);
    if (target) {
      target.classList.add('active');
      triggerFloatUps(target);
    }

    // Activate the clicked tab
    const activeTab = document.querySelector(`.nav-tab[data-view="${viewId}"]`);
    if (activeTab) activeTab.classList.add('active');

    // Switch mood zone background
    body.setAttribute('data-view', viewId);

    // Scroll to top
    window.scrollTo(0, 0);

    // Update URL hash
    history.pushState(null, '', `#${viewId}`);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const viewId = tab.getAttribute('data-view');
      if (viewId) switchView(viewId);

      // Close mobile menu
      const hamburger = document.querySelector('.nav-hamburger');
      const navTabs = document.querySelector('.nav-tabs');
      if (hamburger) {
        hamburger.classList.remove('open');
        navTabs.classList.remove('open');
      }
    });
  });

  // Handle initial hash or default to home
  const initialView = window.location.hash.replace('#', '') || 'home';
  switchView(initialView);

  // Handle browser back/forward
  window.addEventListener('popstate', () => {
    const viewId = window.location.hash.replace('#', '') || 'home';
    switchView(viewId);
  });

  /* ---------- Mobile nav toggle ---------- */
  const hamburger = document.querySelector('.nav-hamburger');
  const navTabs = document.querySelector('.nav-tabs');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navTabs.classList.toggle('open');
    });
  }

  /* ---------- Selected Work → Projects tab ---------- */
  document.querySelectorAll('.selected-work-item').forEach(item => {
    item.addEventListener('click', () => {
      switchView('projects');
    });
  });

  /* ---------- 3D Tilt on Project Cards ---------- */
  document.querySelectorAll('.project-row').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    });
  });

  /* ---------- (Tag filters removed — Journal uses vertical scroll) ---------- */

  /* ---------- PDF Preview Modal ---------- */
  const pdfModal = document.getElementById('pdf-modal');
  const pdfViewer = document.getElementById('pdf-viewer');
  const pdfClose = document.querySelector('.pdf-modal-close');
  const pdfOverlay = document.querySelector('.pdf-modal-overlay');

  function openPdfModal(src) {
    pdfViewer.src = src + '#toolbar=0&navpanes=0';
    pdfModal.style.display = 'flex';
    body.style.overflow = 'hidden';
  }

  function closePdfModal() {
    pdfModal.style.display = 'none';
    pdfViewer.src = '';
    body.style.overflow = '';
  }

  document.querySelectorAll('[data-report]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const report = link.getAttribute('data-report');
      if (report) openPdfModal(report);
    });
  });

  if (pdfClose) pdfClose.addEventListener('click', closePdfModal);
  if (pdfOverlay) pdfOverlay.addEventListener('click', closePdfModal);

  /* ---------- Lightbox (Photography) ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;

  if (lightbox) {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').src;
        lightboxImg.src = imgSrc;
        lightbox.classList.add('open');
        body.style.overflow = 'hidden';
      });
    });

    lightbox.addEventListener('click', () => {
      lightbox.classList.remove('open');
      body.style.overflow = '';
      lightboxImg.src = '';
    });
  }

  /* ---------- Escape key closes modals ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (pdfModal && pdfModal.style.display === 'flex') closePdfModal();
      if (lightbox && lightbox.classList.contains('open')) {
        lightbox.classList.remove('open');
        body.style.overflow = '';
      }
    }
  });

  /* ---------- Projects Flashlight Effect ---------- */
  const projectsView = document.getElementById('projects');
  if (projectsView) {
    document.addEventListener('mousemove', (e) => {
      if (body.getAttribute('data-view') === 'projects') {
        document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
        document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
      }
    });

    // Reset glow position when leaving projects
    document.addEventListener('mouseleave', () => {
      document.documentElement.style.setProperty('--mouse-x', '-9999px');
      document.documentElement.style.setProperty('--mouse-y', '-9999px');
    });
  }

  /* ---------- Logo "Grounding Pulse" ---------- */
  const navLogo = document.getElementById('nav-logo');
  const navbar = document.querySelector('.navbar');

  if (navLogo) {
    navLogo.addEventListener('click', (e) => {
      e.preventDefault();

      // Spark on the ground symbol
      const ground = navLogo.querySelector('.logo-ground');
      if (ground) {
        ground.classList.remove('spark');
        // Force reflow to restart animation
        void ground.offsetWidth;
        ground.classList.add('spark');
        ground.addEventListener('animationend', () => {
          ground.classList.remove('spark');
        }, { once: true });
      }

      // Ripple on the navbar
      if (navbar) {
        navbar.classList.remove('ripple');
        void navbar.offsetWidth;
        navbar.classList.add('ripple');
        navbar.addEventListener('animationend', () => {
          navbar.classList.remove('ripple');
        }, { once: true });
      }

      // Navigate home + scroll to top
      switchView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
