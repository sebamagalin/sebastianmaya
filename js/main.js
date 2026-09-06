// ── MAIN ORCHESTRATOR & LAZY REVEAL ANIMATIONS ──

document.addEventListener('DOMContentLoaded', () => {
  // 1. Reveal elements on scroll (Lazy animation triggers)
  const revealElements = document.querySelectorAll('.client-row, .web-card, .flow-node, .glass-panel, .section-header');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // No dejamos contenido invisible si el navegador no soporta el observador
  // o el visitante pidió reducir movimiento.
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('reveal-on-scroll', 'in-view'));
    return;
  }

  const revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px', // trigger slightly before entering viewport
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Once visible, stop observing to prevent repeated transitions
        observer.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  // Apply base CSS reveal classes and start observing
  revealElements.forEach(el => {
    el.classList.add('reveal-on-scroll');
    revealObserver.observe(el);
  });
});

// Inject global keyframes and classes for scroll reveals
const style = document.createElement('style');
style.textContent = `
  .reveal-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .reveal-on-scroll.in-view {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);
