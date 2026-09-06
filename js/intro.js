document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const introView = document.querySelector('.intro-view');
  const dock = document.querySelector('.morph-nav-cards');
  const PARALLAX_TOTAL = 74;
  const parallaxPath = n => `assets/video/frames/f_${String(n).padStart(3, '0')}.jpg`;
  const parallaxFrames = [];
  let parallaxReady = false;
  let parallaxPreload;

  // La secuencia sigue preparándose fuera de la carga inicial, pero se dibuja
  // únicamente cuando todos los fotogramas estén disponibles. Esto evita el
  // parpadeo que provocan los cambios entre imágenes descargadas a destiempo.
  function preloadParallaxFrames() {
    if (parallaxPreload) return parallaxPreload;
    const loadFrame = index => new Promise(resolve => {
      const image = new Image();
      image.decoding = 'async';
      image.onload = async () => {
        // `onload` confirma la descarga; `decode` confirma que el navegador
        // puede pintarlo sin mostrar un fotograma vacío entre cambios.
        try { if (image.decode) await image.decode(); } catch (_) { /* el caché ya puede dibujarlo */ }
        parallaxFrames[index] = image;
        resolve();
      };
      image.onerror = () => resolve();
      image.src = parallaxPath(index);
    });
    // Se limita la concurrencia: descargar 74 archivos a la vez retrasa el
    // primer render y puede producir los destellos que estamos corrigiendo.
    parallaxPreload = new Promise(resolve => {
      let next = 1, completed = 0;
      const workers = Math.min(6, PARALLAX_TOTAL);
      const take = () => {
        const index = next++;
        if (index > PARALLAX_TOTAL) return;
        loadFrame(index).finally(() => {
          completed += 1;
          if (completed === PARALLAX_TOTAL) resolve(); else take();
        });
      };
      Array.from({ length: workers }, take);
    }).then(() => { parallaxReady = Boolean(parallaxFrames[1]); });
    return parallaxPreload;
  }

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
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let stage = 1, started = false;

    function play() {
      if (started || stage !== 1) return;
      started = true;
      preloadParallaxFrames();
      const v = window.innerWidth <= 768
        ? document.querySelector('.mobile-video')
        : document.querySelector('.desktop-video');
      frame.classList.add('video-playing');
      if (!v) return finish();

      // El archivo correcto se descarga solo después de la intención del visitante.
      // Así móvil no descarga el vídeo de escritorio y viceversa.
      // El texto "De la idea al sistema" / "Bienvenidos" se desvanece con el progreso del video
      v.addEventListener('timeupdate', () => {
        if (!v.duration) return;
        const p = v.currentTime / v.duration;
        if (stage1Content) stage1Content.style.opacity = String(Math.max(0, 1 - p * 1.25));
      });

      v.onended = finish;
      const beginPlayback = () => v.play().catch(finish);
      if (!v.getAttribute('src') && v.dataset.src) {
        v.setAttribute('src', v.dataset.src);
        v.addEventListener('canplay', beginPlayback, { once: true });
        v.addEventListener('error', finish, { once: true });
        v.load();
      } else beginPlayback();
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

    if (reducedMotion) finish();
  }

  function initParallax() {
    const wrap = document.querySelector('.hero-scroll-wrap');
    const sticky = document.querySelector('.hero-sticky');
    const frameImg = document.querySelector('.parallax-frame');
    const bgStill = document.querySelector('.hero-bg-still');
    const nameOverlay = document.querySelector('.hero-name-overlay');
    const heroContent = document.querySelector('.hero-final-content');
    const menu = document.querySelector('.morph-menu-container');
    const scrim = document.querySelector('.hero-scrim');
    if (!wrap || !frameImg || !sticky) return;
    sticky.classList.add('is-parallax-preparing');

    const clamp01 = v => Math.min(Math.max(v, 0), 1);
    let lastFrame = -1;
    let displayReady = false;

    function updatePortraitComposition(frameProgress) {
      // La secuencia original es horizontal: Sebastián parte del centro y
      // termina al lado derecho. En móvil/tablet vertical, el encuadre lo
      // acompaña para que no quede reducido a un hombro al final del scroll.
      const portrait = window.matchMedia('(orientation: portrait)').matches;
      const subjectPosition = portrait ? 50 + frameProgress * 26 : 50;
      frameImg.style.objectPosition = `${subjectPosition}% center`;
      if (bgStill) bgStill.style.backgroundPosition = `${portrait ? 76 : 50}% center`;
    }

    function update() {
      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - window.innerHeight;
      const progress = total > 0 ? clamp01(-rect.top / total) : 0;

      // Durante la preparación se muestra únicamente el fotograma estable de
      // respaldo. Ninguna imagen de la secuencia llega al lienzo todavía.
      if (!displayReady) {
        frameImg.style.opacity = '0';
        if (bgStill) bgStill.style.opacity = '1';
        return;
      }

      // Zona A [0,0.5]: scrub solo con la secuencia completa en memoria.
      // Mientras termina de descargar, se conserva una composición estática
      // en vez de alternar imágenes y producir un efecto estroboscópico.
      const frameP = clamp01(progress / 0.5);
      updatePortraitComposition(frameP);
      const idx = Math.min(PARALLAX_TOTAL, Math.max(1, Math.round(frameP * (PARALLAX_TOTAL - 1)) + 1));
      if (parallaxReady && idx !== lastFrame && parallaxFrames[idx]?.complete) {
        frameImg.src = parallaxFrames[idx].src;
        lastFrame = idx;
      }

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

    preloadParallaxFrames().then(async () => {
      const firstFrame = parallaxFrames[1];
      if (!firstFrame) return;
      // Se instala y decodifica el primer frame fuera de vista antes de
      // revelarlo. De este modo nunca hay un salto negro al iniciar.
      frameImg.src = firstFrame.src;
      try { if (frameImg.decode) await frameImg.decode(); } catch (_) { /* imagen disponible en caché */ }
      lastFrame = 1;
      displayReady = true;
      sticky.classList.remove('is-parallax-preparing');
      sticky.classList.add('is-parallax-revealing');
      update();
      window.setTimeout(() => sticky.classList.remove('is-parallax-revealing'), 420);
    });
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(() => { update(); ticking = false; }); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
});
