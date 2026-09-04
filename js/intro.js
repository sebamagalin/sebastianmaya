document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const introView = document.querySelector('.intro-view');
  const dock = document.querySelector('.morph-nav-cards');

  if (introView) initIntro();

  // Si viene de "SEBASTIAN." en otra página, saltar el intro e ir directo al inicio real
  if (introView && new URLSearchParams(location.search).get('home') === '1') {
    const frame = document.querySelector('.intro-frame');
    const wrap = document.querySelector('.hero-scroll-wrap');
    if (frame) frame.classList.add('video-ended');
    body.classList.add('intro-complete');
    if (typeof initParallax === 'function') initParallax();
    requestAnimationFrame(() => {
      if (wrap) window.scrollTo(0, wrap.offsetHeight - window.innerHeight);
    });
  }

  if (dock && window.innerWidth > 768) {
    dock.addEventListener('mousemove', (e) => {
      dock.querySelectorAll('.nav-card-item').forEach(item => {
        const r = item.getBoundingClientRect();
        const d = Math.abs(e.clientX - (r.left + r.width / 2));
        const max = 90;
        item.style.transform = d < max
          ? `translateY(-${((max - d) / max) * 6}px) scale(${1 + ((max - d) / max) * 0.15})`
          : 'translateY(0) scale(1)';
      });
    });
    dock.addEventListener('mouseleave', () => {
      dock.querySelectorAll('.nav-card-item').forEach(i => i.style.transform = 'translateY(0) scale(1)');
    });
  }

  function initIntro() {
    const frame = document.querySelector('.intro-frame');
    const stage1Content = document.querySelector('.stage1-content');
    let stage = 1, started = false;

    function play() {
      if (started || stage !== 1) return;
      started = true;
      const v = window.innerWidth <= 768
        ? document.querySelector('.mobile-video')
        : document.querySelector('.desktop-video');
      frame.classList.add('video-playing');
      if (!v) return finish();

      // El texto "De la idea al sistema" / "Bienvenidos" se desvanece con el progreso del video
      v.addEventListener('timeupdate', () => {
        if (!v.duration) return;
        const p = v.currentTime / v.duration;
        if (stage1Content) stage1Content.style.opacity = String(Math.max(0, 1 - p * 1.25));
      });

      v.play().catch(finish);
      v.onended = finish;
    }

    function finish() {
      if (stage === 2) return;
      stage = 2;
      frame.classList.add('video-ended');
      body.classList.add('intro-complete');
      initParallax();
    }

    frame.addEventListener('click', play);
    window.addEventListener('wheel', e => { if (stage === 1 && Math.abs(e.deltaY) > 5) play(); }, { passive: true });
    window.addEventListener('touchmove', () => { if (stage === 1) play(); }, { passive: true });
  }

  function initParallax() {
    const wrap = document.querySelector('.hero-scroll-wrap');
    const frameImg = document.querySelector('.parallax-frame');
    const bgStill = document.querySelector('.hero-bg-still');
    const nameOverlay = document.querySelector('.hero-name-overlay');
    const heroContent = document.querySelector('.hero-final-content');
    const menu = document.querySelector('.morph-menu-container');
    const scrim = document.querySelector('.hero-scrim');
    if (!wrap || !frameImg) return;

    const TOTAL = 74;
    const path = n => `assets/video/frames/f_${String(n).padStart(3, '0')}.jpg`;
    for (let i = 1; i <= TOTAL; i++) { const im = new Image(); im.src = path(i); }

    const clamp01 = v => Math.min(Math.max(v, 0), 1);
    let lastFrame = -1;

    function update() {
      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - window.innerHeight;
      const progress = total > 0 ? clamp01(-rect.top / total) : 0;

      // Zona A [0,0.5]: scrub de frames (sin lag, son imágenes precargadas)
      const frameP = clamp01(progress / 0.5);
      const idx = Math.min(TOTAL, Math.max(1, Math.round(frameP * (TOTAL - 1)) + 1));
      if (idx !== lastFrame) { frameImg.src = path(idx); lastFrame = idx; }

      // Zona B [0.45,0.66]: cross-fade al frame final congelado
      const crossP = clamp01((progress - 0.45) / 0.21);
      frameImg.style.opacity = String(1 - crossP);
      if (bgStill) bgStill.style.opacity = String(crossP);

      // Nombre se desvanece
      if (nameOverlay) {
        nameOverlay.style.opacity = String(1 - clamp01(progress / 0.4));
        nameOverlay.style.transform = `translateY(${-progress * 50}px)`;
      }

      // Zona C [0.6,1]: contenido del hero
      const heroP = clamp01((progress - 0.6) / 0.4);
      if (scrim) scrim.style.opacity = String(heroP * 0.85);
      if (heroContent) {
        heroContent.style.opacity = String(heroP);
        heroContent.style.transform = `translateY(${(1 - heroP) * 40}px)`;
        heroContent.style.pointerEvents = heroP > 0.4 ? 'auto' : 'none';
      }

      // El menú SOLO aparece al llegar al final real del parallax (inicio de página)
      if (menu) menu.classList.toggle('is-visible', progress >= 0.99);
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(() => { update(); ticking = false; }); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
});
