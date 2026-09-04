// ── BRANDING POPUPS & CASE STUDIES DATA ──

const studyCasesData = {
  "purple-life": {
    title: "Purple Life",
    niche: "Wellness & Personal Growth System",
    desc: "Desarrollo estratégico de identidad de marca, packaging y diseño editorial para Purple Life. Creamos un lenguaje visual holístico, inspirador y minimalista orientado al bienestar y la autorrealización personal.",
    client: "Purple Life Co.",
    year: "2025",
    role: "Director de Arte / Diseñador",
    behanceUrl: "https://www.behance.net/sebamagalin",
    banner: "assets/images/01-purple-life-cover.jpg"
  },
  "uff-bakno": {
    title: "Uff B'Kano",
    niche: "Street Flavor & Food Branding",
    desc: "Conceptualización visual audaz e industrial para la marca de comida callejera premium Uff B'Kano. Diseñamos el packaging, uniformes, cartelería de menús y la identidad gráfica urbana representativa de su sabor único.",
    client: "Uff B'Kano",
    year: "2026",
    role: "Diseñador de Identidad",
    behanceUrl: "https://www.behance.net/sebamagalin",
    banner: "assets/images/02-bakno-cover.jpg"
  },
  "casa-montero": {
    title: "Casa Montero",
    niche: "Paraíso Orgánico & Jams",
    desc: "Branding sofisticado y diseño de etiquetas rústicas premium para Casa Montero. Traducimos la tradición artesanal y los ingredientes orgánicos del campo colombiano en una experiencia visual gourmet inolvidable.",
    client: "Casa Montero",
    year: "2025",
    role: "Lead Brand Designer",
    behanceUrl: "https://www.behance.net/sebamagalin",
    banner: "assets/images/03-casa-montero-cover.jpeg"
  },
  "oti-futbol": {
    title: "OTI Fútbol Base",
    niche: "Academia Deportiva · Branding",
    desc: "Rebranding completo y diseño de experiencia para OTI Academia. Estructuramos un lenguaje visual enérgico, dinámico y moderno que impulsó su posicionamiento y aumentó las admisiones de forma orgánica.",
    client: "OTI Academia",
    year: "2024",
    role: "Brand Strategist Senior",
    behanceUrl: "https://www.behance.net/gallery/233432979/OTI-Futbol-Base",
    banner: "assets/images/04-oti-futbol-base-cover.png"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const bentoCards = document.querySelectorAll('.brand-card[data-project]');
  const dialog = document.getElementById('study-case-dialog');
  
  if (!dialog) return;

  const modalImg = dialog.querySelector('.modal-header-img');
  const modalTitle = dialog.querySelector('.modal-title');
  const modalNiche = dialog.querySelector('.modal-niche');
  const modalDesc = dialog.querySelector('.modal-desc');
  const modalClient = dialog.querySelector('.modal-client-val');
  const modalYear = dialog.querySelector('.modal-year-val');
  const modalRole = dialog.querySelector('.modal-role-val');
  const modalLink = dialog.querySelector('.modal-behance-link');
  const closeBtn = dialog.querySelector('.modal-close-btn');

  bentoCards.forEach(card => {
    card.addEventListener('click', async (e) => {
      e.preventDefault();
      const projectId = card.getAttribute('data-project');

      // 1) Intentar el Case Study Viewer nuevo (JSON-driven)
      if (window.tryOpenCaseStudy) {
        const opened = await window.tryOpenCaseStudy(projectId);
        if (opened) return;
      }

      // 2) Fallback: sistema viejo (proyectos sin project.json todavía)
      const projectData = studyCasesData[projectId];

      if (projectData) {
        // Populate modal data
        modalImg.src = projectData.banner || card.querySelector('.brand-world-img').src;
        modalImg.alt = projectData.title;
        modalTitle.textContent = projectData.title;
        modalNiche.textContent = projectData.niche;
        modalDesc.textContent = projectData.desc;
        modalClient.textContent = projectData.client;
        modalYear.textContent = projectData.year;
        modalRole.textContent = projectData.role;
        modalLink.href = projectData.behanceUrl;

        // Show native dialog modal
        dialog.showModal();
        document.body.style.overflow = 'hidden'; // Lock background scroll
      }
    });
  });

  // Close actions
  function closeModal() {
    dialog.close();
    document.body.style.overflow = ''; // Restore scroll
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close on clicking backdrop
  dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
    if (!isInDialog) {
      closeModal();
    }
  });

  // Close on Escape key
  dialog.addEventListener('cancel', () => {
    document.body.style.overflow = '';
  });
});
