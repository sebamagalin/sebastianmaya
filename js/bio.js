// ── BIO RPG DASHBOARD & STATS CONTROL ──

document.addEventListener('DOMContentLoaded', () => {
  const stage = document.getElementById('bioStage');

  // En vertical, estas cuatro piezas se comportan como una sola columna entre
  // los accesos laterales y el dock. Así el espacio se reparte de forma
  // consistente en vez de depender de cuatro coordenadas independientes.
  if (stage && window.matchMedia('(max-width: 900px)').matches) {
    const infoFlow = document.createElement('div');
    infoFlow.className = 'bio-mobile-info-flow';
    const orderedInfo = [
      stage.querySelector('.bio-stats'),
      stage.querySelector('.bio-lore'),
      stage.querySelector('.bio-metrics'),
      stage.querySelector('.bio-tagline')
    ].filter(Boolean);
    if (orderedInfo.length) {
      stage.querySelector('.bio-scrim')?.after(infoFlow);
      orderedInfo.forEach(item => infoFlow.append(item));
    }
  }

  // 1. Animación de barras de stats (arranca al cargar, sin depender de scroll)
  const barFills = document.querySelectorAll('.stat-bar-fill');
  setTimeout(() => {
    barFills.forEach(fill => { fill.style.width = fill.getAttribute('data-level'); });
  }, 300);

  // 2. Contador rápido en los números naranja (0 -> valor final)
  document.querySelectorAll('.metric-num').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 900;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const value = Math.floor(progress * target);
      el.textContent = `${prefix}${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = `${prefix}${target}${suffix}`;
    };
    requestAnimationFrame(tick);
  });

  // 3. Lupa neón: revela la 2da imagen sobre la 1ra siguiendo el cursor/dedo
  const lens = document.getElementById('bioLens');
  if (stage && lens) {
    const revealImgs = stage.querySelectorAll('.bio-bg-img.reveal');

    const moveLens = (clientX, clientY) => {
      const rect = stage.getBoundingClientRect();
      const R = lens.offsetWidth / 2;
      let x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      let y = Math.max(0, Math.min(rect.height, clientY - rect.top));
      lens.style.left = `${x}px`;
      lens.style.top = `${y}px`;
      revealImgs.forEach(img => { img.style.clipPath = `circle(${R}px at ${x}px ${y}px)`; });
    };

    const resetReveal = () => {
      revealImgs.forEach(img => { img.style.clipPath = 'circle(0px at 50% 50%)'; });
    };

    stage.addEventListener('mousemove', (e) => {
      stage.classList.add('is-active');
      moveLens(e.clientX, e.clientY);
    });
    stage.addEventListener('mouseleave', () => {
      stage.classList.remove('is-active');
      resetReveal();
    });
    stage.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      if (t) { stage.classList.add('is-active'); moveLens(t.clientX, t.clientY); }
    }, { passive: true });
    stage.addEventListener('touchend', () => {
      stage.classList.remove('is-active');
      resetReveal();
    });
  }

  // 4. Menús desplegables: el botón se "estira" y el panel sale pegado debajo de él
  const menuBtns = document.querySelectorAll('.bio-menu-btn');
  const eduDescBox = document.getElementById('edu-desc-box');

  const closeAllPanels = () => {
    document.querySelectorAll('.bio-panel.open').forEach(p => p.classList.remove('open'));
    menuBtns.forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.edu-card.open, .tool-chip.open').forEach(c => c.classList.remove('open'));
    if (eduDescBox) { eduDescBox.classList.remove('open'); eduDescBox.textContent = ''; }
  };

  menuBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetPanel = document.getElementById('panel-' + btn.getAttribute('data-panel'));
      const wasOpen = targetPanel && targetPanel.classList.contains('open');
      closeAllPanels();

      if (targetPanel && !wasOpen && stage) {
        // Posicionar el panel justo debajo del botón que lo abrió
        const stageRect = stage.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        const topPx = btnRect.bottom - stageRect.top + 4;
        targetPanel.style.top = `${topPx}px`;

        // Nunca debe pasar el dock: topar la altura maxima a donde empieza
        const dock = document.querySelector('.morph-menu-container');
        if (dock) {
          const dockTop = dock.getBoundingClientRect().top;
          const available = dockTop - btnRect.bottom - 20;
          targetPanel.style.maxHeight = `${Math.max(80, available)}px`;
        }

        targetPanel.classList.add('open');
        btn.classList.add('active');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.bio-menu-btn') && !e.target.closest('.bio-panel')) closeAllPanels();
  });

  // 5a. Formación: en móvil la explicación queda bajo la tarjeta elegida,
  // desplazando las demás como una lista natural. En escritorio se conserva
  // el panel compacto para no romper la composición horizontal.
  document.querySelectorAll('.edu-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasOpen = card.classList.contains('open');
      document.querySelectorAll('.edu-card.open').forEach(c => c.classList.remove('open'));
      if (!wasOpen && eduDescBox) {
        card.classList.add('open');
        eduDescBox.textContent = card.getAttribute('data-desc') || '';
        if (window.matchMedia('(max-width: 900px)').matches) {
          card.insertAdjacentElement('afterend', eduDescBox);
        }
        eduDescBox.classList.add('open');
      } else if (eduDescBox) {
        eduDescBox.classList.remove('open');
        eduDescBox.textContent = '';
      }
    });
  });

  // 5b. Tarjetas de Habilidades: leyenda corta al hacer clic (sin cambios)
  document.querySelectorAll('.tool-chip').forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = card.parentElement;
      const wasOpen = card.classList.contains('open');
      parent.querySelectorAll('.open').forEach(c => c.classList.remove('open'));
      if (!wasOpen) card.classList.add('open');
    });
  });
});
