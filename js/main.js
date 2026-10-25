/* Shared navigation, gallery, and homepage interactions. */
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const views = [...document.querySelectorAll('.view')];
  const tabs = [...document.querySelectorAll('.nav-tab')];
  const navTabs = document.querySelector('.nav-tabs');
  const hamburger = document.querySelector('.nav-hamburger');
  if (navTabs) navTabs.id = 'primary-links';
  hamburger?.setAttribute('aria-controls', 'primary-links');
  hamburger?.setAttribute('aria-expanded', 'false');

  function closeMenu() {
    hamburger?.classList.remove('open');
    navTabs?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    if (navTabs) navTabs.inert = window.matchMedia('(max-width: 768px)').matches;
  }
  function syncMenu() {
    closeMenu();
    if (navTabs && !window.matchMedia('(max-width: 768px)').matches) navTabs.inert = false;
  }
  syncMenu();
  window.matchMedia('(max-width: 768px)').addEventListener('change', syncMenu);
  hamburger?.addEventListener('click', () => {
    const open = hamburger.getAttribute('aria-expanded') !== 'true';
    hamburger.classList.toggle('open', open);
    navTabs?.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    if (navTabs) navTabs.inert = !open;
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.navbar')) closeMenu();
  });

  function switchView(requested, {push = false, focus = false} = {}) {
    if (!views.length) return;
    const id = views.some(view => view.id === requested) ? requested : 'home';
    views.forEach(view => {
      const active = view.id === id;
      view.classList.toggle('active', active);
      view.setAttribute('aria-hidden', String(!active));
      if (active) view.querySelectorAll('.float-up').forEach(el => el.classList.add('visible'));
    });
    tabs.forEach(tab => {
      const active = tab.dataset.view === id;
      tab.classList.toggle('active', active);
      if (active) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
    });
    body.dataset.view = id;
    if (push && window.location.hash !== `#${id}`) history.pushState(null, '', `#${id}`);
    window.scrollTo({top: 0, behavior: 'instant'});
    closeMenu();
    if (focus) {
      const heading = document.querySelector(`#${id} h1`);
      heading?.setAttribute('tabindex', '-1');
      heading?.focus({preventScroll: true});
    }
  }
  tabs.forEach(tab => {
    if (tab.dataset.view) tab.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      switchView(tab.dataset.view, {push: true, focus: true});
    });
    else tab.addEventListener('click', closeMenu);
  });
  document.querySelectorAll('[data-view-link]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    switchView(link.dataset.viewLink, {push: true, focus: true});
  }));
  if (views.length) {
    switchView(window.location.hash.slice(1));
    window.addEventListener('popstate', () => switchView(window.location.hash.slice(1)));
    window.addEventListener('hashchange', () => switchView(window.location.hash.slice(1)));
  }
  document.querySelectorAll('.project-detail .nav-tab.active').forEach(tab => tab.setAttribute('aria-current', 'page'));

  document.querySelectorAll('.project-row').forEach(card => {
    card.addEventListener('mousemove', event => {
      if (reducedMotion.matches || !finePointer.matches) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(1000px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
    });
    card.addEventListener('mouseleave', () => card.style.removeProperty('transform'));
  });
  let cursorFrame;
  document.addEventListener('mousemove', event => {
    if (reducedMotion.matches || !finePointer.matches) return;
    cancelAnimationFrame(cursorFrame);
    cursorFrame = requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
    });
  });
  document.addEventListener('mouseleave', () => {
    document.documentElement.style.setProperty('--mouse-x', '-9999px');
    document.documentElement.style.setProperty('--mouse-y', '-9999px');
  });

  const greeting = document.querySelector('.home-greeting');
  const bio = document.getElementById('bio-third');
  const status = document.getElementById('status-text');
  const professionalBio = bio?.innerHTML;
  const professionalStatus = status?.innerHTML;
  greeting?.addEventListener('click', () => {
    const casual = body.classList.toggle('theme-casual');
    greeting.setAttribute('aria-pressed', String(casual));
    if (bio) bio.innerHTML = casual ? bio.dataset.bioCasual : professionalBio;
    if (status) status.innerHTML = casual ? 'Currently: waiting for lights out at the next <strong>F1 Grand Prix</strong>.' : professionalStatus;
    document.getElementById('status-led')?.classList.toggle('casual-red', casual);
    const note = document.querySelector('.off-duty-note');
    if (note) note.hidden = !casual;
    document.querySelectorAll('[data-sw-pro], [data-sw-casual]').forEach(item => {
      item.style.display = item.hasAttribute(casual ? 'data-sw-casual' : 'data-sw-pro') ? '' : 'none';
    });
  });

  const gallery = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const lightboxClose = lightbox?.querySelector('button');
  let previousFocus;
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    body.style.overflow = '';
    lightboxImg?.removeAttribute('src');
    previousFocus?.focus();
  }
  if (gallery) fetch('assets/gallery/photos.json')
    .then(response => { if (!response.ok) throw new Error('Gallery unavailable'); return response.json(); })
    .then(photos => {
      if (!photos.length) throw new Error('Empty gallery');
      photos.forEach(photo => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'gallery-item';
        item.setAttribute('aria-label', `View photograph: ${photo.caption || 'Untitled'}`);
        const img = document.createElement('img');
        img.src = `assets/gallery/${photo.file}`;
        img.alt = photo.caption || '';
        img.loading = 'lazy';
        img.decoding = 'async';
        const caption = document.createElement('span');
        caption.className = 'gallery-item-caption';
        caption.textContent = photo.caption || '';
        item.append(img, caption);
        item.addEventListener('click', () => {
          if (!lightbox || !lightboxImg) return;
          previousFocus = item;
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add('open');
          body.style.overflow = 'hidden';
          lightboxClose?.focus();
        });
        gallery.append(item);
      });
    }).catch(() => {
      const empty = document.getElementById('gallery-empty');
      if (empty) {empty.textContent = 'Photographs are temporarily unavailable. Please try again later.'; empty.style.display = 'block';}
    });
  lightbox?.addEventListener('click', event => {
    if (event.target === lightbox || event.target === lightboxClose) closeLightbox();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (lightbox?.classList.contains('open')) closeLightbox();
      if (hamburger?.getAttribute('aria-expanded') === 'true') {closeMenu(); hamburger.focus();}
    }
    if (event.key === 'Tab' && lightbox?.classList.contains('open')) {event.preventDefault(); lightboxClose?.focus();}
  });

  /* Krishna grounding pulse: original cyan → champagne canvas wave. */
  const logo = document.getElementById('nav-logo');
  logo?.addEventListener('click', event => {
    if (!views.length) return;
    event.preventDefault();
    const rect = logo.getBoundingClientRect();
    switchView('home', {push: true, focus: true});
    if (reducedMotion.matches) return;
    const ground = logo.querySelector('.logo-ground');
    ground?.classList.add('spark');
    ground?.addEventListener('animationend', () => ground.classList.remove('spark'), {once:true});
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    Object.assign(canvas.style, {position:'fixed', inset:'0', width:'100vw', height:'100vh', pointerEvents:'none', zIndex:'99999'});
    document.documentElement.append(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) {canvas.remove(); return;}
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const max = Math.hypot(canvas.width, canvas.height);
    const duration = 3000;
    let start;
    function draw(time) {
      if (!start) start = time;
      const progress = Math.min((time - start) / duration, 1);
      const radius = Math.max((1 - (1 - progress) ** 2.5) * max, 1);
      const alpha = (1 - progress) ** 1.5;
      const color = `${Math.round(212*progress)},${Math.round(229-54*progress)},${Math.round(255-200*progress)}`;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gradient = ctx.createRadialGradient(x,y,0,x,y,radius);
      gradient.addColorStop(0,'rgba(0,229,255,0)');
      gradient.addColorStop(.45,'rgba(0,229,255,0)');
      gradient.addColorStop(.92,`rgba(${color},${alpha*.12})`);
      gradient.addColorStop(1,`rgba(${color},0)`);
      ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fillStyle=gradient;ctx.fill();
      ctx.strokeStyle=`rgba(${color},${alpha*.75})`;ctx.lineWidth=2-progress*1.2;ctx.stroke();
      if (progress < 1) requestAnimationFrame(draw); else canvas.remove();
    }
    requestAnimationFrame(draw);
  });
});
