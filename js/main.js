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

  /* ---------- Tag Filtering (Writing) ---------- */
  const tagBtns = document.querySelectorAll('.tag-btn');
  const writingCards = document.querySelectorAll('.writing-card');

  tagBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.getAttribute('data-tag');

      // Activate button
      tagBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      writingCards.forEach(card => {
        if (tag === 'all' || card.getAttribute('data-tag') === tag) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

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

});
