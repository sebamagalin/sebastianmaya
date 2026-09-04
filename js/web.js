// ── WEB CLIENT CASES & FULLSCREEN ZOOM EFFECTS ──

document.addEventListener('DOMContentLoaded', () => {
  const webCards = document.querySelectorAll('.web-card');
  const zoomOverlay = document.getElementById('web-zoom-overlay');
  const zoomImg = zoomOverlay ? zoomOverlay.querySelector('.web-zoom-img') : null;

  webCards.forEach(card => {
    // Tarjetas en construcción o "Próximo Proyecto" no tienen sitio al cual ir
    if (card.classList.contains('web-card--construction') || card.classList.contains('web-card--soon')) {
      return;
    }

    card.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetUrl = card.getAttribute('data-url');
      const heroImg = card.querySelector('.web-actual-hero');
      if (!targetUrl || !heroImg) return;
      const previewImgSrc = heroImg.src;

      if (zoomOverlay && zoomImg) {
        // 1. Set the image in the zoom overlay
        zoomImg.src = previewImgSrc;
        
        // 2. Active zoom overlay
        zoomOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // 3. Trigger URL redirection after zoom is halfway/done
        setTimeout(() => {
          window.open(targetUrl, '_blank');
        }, 600);

        // 4. Reset zoom state slowly so when they switch back, it's clear
        setTimeout(() => {
          zoomOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }, 1500);
      } else {
        // Fallback if overlay element is missing
        window.open(targetUrl, '_blank');
      }
    });
  });

  // 5. Proactive reset on window focus to ensure smooth tab return UX
  window.addEventListener('focus', () => {
    if (zoomOverlay && zoomOverlay.classList.contains('active')) {
      zoomOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});
