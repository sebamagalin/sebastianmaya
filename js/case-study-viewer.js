// ── CASE STUDY VIEWER — genérico, dirigido 100% por JSON ──
// Para agregar un proyecto nuevo: crear /assets/projects/[id]/project.json + sus imágenes.
// No requiere tocar este archivo ni el HTML.

(function () {
  const BASE = 'assets/projects/';
  const dialog = document.getElementById('case-study-viewer');
  const scrollEl = document.getElementById('viewer-scroll');
  const closeBtn = dialog ? dialog.querySelector('.viewer-close-btn') : null;

  // Calcula, en CSS Grid, cuántas sub-columnas usar y cuánto debe
  // "spanear" cada caja de color para que la fila incompleta final
  // reparta el 100% del ancho exacto (sin gaps de redondeo).
  // Ej: 6 colores -> 3+3 al span 1 de 3 (como Purple Life).
  //     5 colores -> 3 arriba a span 2 de 6, 2 abajo a span 3 de 6.
  //     3 colores -> 3 a span 1 de 3 (una sola fila completa).
  function paletteGrid(count, cols = 3) {
    const remainder = count % cols;
    const sub = remainder === 0 ? cols : cols * remainder;
    const fullRows = Math.floor(count / cols);
    const fullSpan = sub / cols;
    const lastSpan = remainder === 0 ? fullSpan : sub / remainder;
    const spans = [];
    for (let i = 0; i < count; i++) {
      spans.push(i < fullRows * cols ? fullSpan : lastSpan);
    }
    return { sub, spans };
  }

  // Texto blanco o negro según qué tan clara/oscura sea la caja.
  function readableTextColor(hex) {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 155 ? '#111111' : '#FFFFFF';
  }

  // Intenta abrir un proyecto por su carpeta. Devuelve true si existe project.json (y lo abre),
  // false si no existe (para que el caller use el sistema viejo como fallback).
  window.tryOpenCaseStudy = async function (projectId) {
    if (!dialog || !scrollEl) return false;
    try {
      const res = await fetch(`${BASE}${projectId}/project.json`, { cache: 'no-store' });
      if (!res.ok) return false;
      const data = await res.json();
      scrollEl.innerHTML = buildViewer(data, `${BASE}${projectId}/`);
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      scrollEl.scrollTop = 0;
      return true;
    } catch (err) {
      return false;
    }
  };

  function closeViewer() {
    dialog.close();
    document.body.style.overflow = '';
  }
  if (closeBtn) closeBtn.addEventListener('click', closeViewer);
  if (dialog) dialog.addEventListener('click', (e) => { if (e.target === dialog) closeViewer(); });

  // ── COMPONENTES ──
  function img(path, folder, alt = '') {
    return `<img src="${folder}${path}" alt="${alt}" loading="lazy">`;
  }

  function hero(data, folder) {
    return `
      <div class="viewer-hero">
        ${img(data.hero.image, folder, data.title)}
      </div>
      <div class="viewer-project-info">
        <h1 class="viewer-title">${data.title}</h1>
        <span class="viewer-niche">${data.niche}</span>
        <p class="viewer-desc">${data.hero.description}</p>
        <div class="viewer-metadata">
          ${Object.entries(data.meta).map(([k, v]) => `
            <div class="viewer-meta-item">
              <h5>${k}</h5>
              <p>${v}</p>
            </div>`).join('')}
        </div>
      </div>
      <div class="viewer-divider"></div>`;
  }

  function textBlock(section) {
    return `
      <div class="viewer-text-block">
        <h4>${section.title}</h4>
        ${section.text.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('')}
      </div>`;
  }

  function section(sec, folder) {
    if (sec.type === 'text-image') {
      const imgSide = sec.layout === 'image-right' ? 'right' : 'left';
      return `<div class="viewer-section viewer-section--split viewer-section--img-${imgSide}">
        ${textBlock(sec)}
        <div class="viewer-image-block">${img(sec.image, folder, sec.title)}</div>
      </div>`;
    }
    if (sec.type === 'text-gallery') {
      const imgSide = sec.layout === 'image-right' ? 'right' : 'left';
      const galleryClass = sec.gallery.length === 5 ? 'viewer-gallery viewer-gallery--3-2' : 'viewer-gallery';
      return `<div class="viewer-section viewer-section--split viewer-section--img-${imgSide}">
        ${textBlock(sec)}
        <div class="${galleryClass}">
          ${sec.gallery.map(g => `<div class="viewer-gallery-item">${img(g, folder)}</div>`).join('')}
        </div>
      </div>`;
    }
    if (sec.type === 'image-full') {
      return `<div class="viewer-section viewer-section--split viewer-section--img-right">
        ${textBlock(sec)}
        <div class="viewer-image-block">${img(sec.image, folder, sec.title)}</div>
      </div>`;
    }
    if (sec.type === 'identity') {
      // Dinámico: cada proyecto puede traer logos múltiples, uno solo, o ninguno.
      const hasLogos = Array.isArray(sec.logos) && sec.logos.length > 0;
      const gridClass = `viewer-identity-grid${hasLogos ? '' : ' viewer-identity-grid--no-logos'}`;
      const grid = paletteGrid(sec.palette.colors.length);
      const mainColor = sec.palette.mainColor || '#2A0845';
      const textColor = readableTextColor(mainColor);
      return `<div class="viewer-section viewer-identity">
        <h3 class="viewer-section-title viewer-section-title--center">${sec.title}</h3>
        <p class="viewer-section-text">${sec.text}</p>
        <div class="${gridClass}">
          <div class="viewer-identity-photo">
            ${img(sec.topImage, folder, sec.title)}
            ${sec.overlayLogo ? `<div class="viewer-identity-overlay-logo">${img(sec.overlayLogo, folder, 'Logo')}</div>` : ''}
          </div>
          ${hasLogos ? `<div class="viewer-logo-system">
            ${sec.logos.map(l => `
              <div class="viewer-logo-item">
                ${img(l.image, folder, l.label)}
              </div>`).join('')}
          </div>` : ''}
          <div class="viewer-palette-info" style="background:${mainColor}; color:${textColor};">
            <h5>Paleta de Color</h5>
            <p>${sec.palette.description}</p>
          </div>
          <div class="viewer-palette-swatches" style="grid-template-columns: repeat(${grid.sub}, 1fr);">
            ${sec.palette.colors.map((c, i) => `
              <div class="viewer-swatch" style="background:${c.hex}; grid-column: span ${grid.spans[i]};">
                <span>${c.hex}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>`;
    }
    return '';
  }

  function cta(data) {
    return `
      <div class="viewer-divider"></div>
      <div class="viewer-cta">
        <a href="${data.cta.primaryUrl}" target="_blank" class="viewer-btn viewer-btn--primary">${data.cta.primaryLabel}</a>
        <span class="viewer-cta-name">SEBASTIAN MAYA.</span>
        <a href="${data.cta.secondaryUrl}" target="_blank" class="viewer-btn viewer-btn--secondary">${data.cta.secondaryLabel}</a>
      </div>`;
  }

  function buildViewer(data, folder) {
    return `
      ${hero(data, folder)}
      <div class="viewer-sections">
        ${data.sections.map(s => section(s, folder)).join('')}
      </div>
      ${cta(data)}`;
  }
})();
