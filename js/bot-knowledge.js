// ── BASE DE CONOCIMIENTO DEL CHATBOT (Automatizaciones) ──
// Cada entrada = un fragmento de información + palabras clave para el buscador.
// El buscador (aparte, en bot-search.js) compara el texto que escribe el
// usuario contra estas keywords y devuelve la "respuesta" del mejor match.
// NO son botones de preguntas fijas: el usuario escribe libre.

const BOT_KNOWLEDGE = [

  // ── IDENTIDAD / CONTACTO ──
  {
    id: "quien-es",
    keywords: ["quien es", "quien eres", "sebastian", "sebastian maya", "sebamagalin", "de que trata la pagina", "presentate", "sobre ti", "sobre el"],
    respuesta: "Sebastian Maya (@sebamagalin) es diseñador de marcas, desarrollador UI/UX y estratega digital en Cali, Colombia. Combina dirección de arte y experiencia de usuario para generar conversión, posicionamiento y liderazgo digital para las marcas con las que trabaja."
  },
  {
    id: "contacto",
    keywords: ["contacto", "contactar", "whatsapp", "hablar", "cotizar", "cotizacion", "escribir", "numero", "telefono"],
    respuesta: "Puedes contactar a Sebastián directamente por WhatsApp: https://wa.me/573053818154"
  },
  {
    id: "disponibilidad",
    keywords: ["disponible", "busca trabajo", "empleo", "rol estable", "esta buscando", "vacante", "contratacion", "freelance"],
    respuesta: "Actualmente Sebastián está buscando un rol estable en Dirección de Arte o Estrategia Digital, aunque también toma proyectos independientes. Desde junio de 2026 no ha vuelto a tener un trabajo fijo."
  },
  {
    id: "metricas-generales",
    keywords: ["años de experiencia", "cuantos años", "marcas escaladas", "resultados generales", "crecimiento organico general", "metricas"],
    respuesta: "+12 años de experiencia, +20 marcas escaladas y 100% de crecimiento orgánico en las cuentas gestionadas."
  },

  // ── SERVICIOS (4 secciones del menú) ──
  {
    id: "servicio-branding",
    keywords: ["branding", "marca", "identidad de marca", "logo", "logotipo", "manual de marca", "universo de marca"],
    respuesta: "En Branding, Sebastián desarrolla identidad de marca completa: estrategia, logotipo, sistema visual, paleta de color y diseño editorial/packaging. Los casos destacados son Purple Life, Uff Bakno, Casa Montero y OTI Fútbol Base."
  },
  {
    id: "servicio-web",
    keywords: ["pagina web", "sitio web", "desarrollo web", "vibe coding", "ui ux", "diseño web"],
    respuesta: "En Sitios Web, Sebastián desarrolla páginas a medida con vibe coding, con interfaces fluidas e intuitivas. Ejemplos: YALA Candles (yalacandles.com) y Home World (gestión inmobiliaria en Madrid), con Magazín Pacífico en construcción."
  },
  {
    id: "servicio-redes",
    keywords: ["redes sociales", "instagram", "community manager", "gestion de redes", "contenido viral", "growth organico"],
    respuesta: "En Redes, Sebastián administra cuentas de Instagram con crecimiento 100% orgánico (sin pauta). Casos: YALA Candles (+35 ventas orgánicas en el segundo mes), Everynized (24 leads orgánicos), Tati Boutique (~50 prendas vendidas en 2 semanas) y OTI Fútbol Base (140K vistas virales, +900 seguidores en 6 meses)."
  },
  {
    id: "servicio-automatizaciones",
    keywords: ["automatizacion", "automatizaciones", "n8n", "bot", "crm", "webhook", "flujo automatizado", "integraciones"],
    respuesta: "En Automatizaciones, Sebastián construye flujos que combinan atracción orgánica en redes, bots de respuesta automática vía webhooks, sincronización con CRM y mensajes de seguimiento automatizados para cerrar ventas, usando principalmente N8N."
  },

  // ── CASOS DE ESTUDIO (Branding) ──
  {
    id: "caso-purple-life",
    keywords: ["purple life", "wellness", "bienestar"],
    respuesta: "Purple Life (2023): sistema de marca para bienestar y crecimiento personal. Incluyó estrategia de marca, identidad, packaging y diseño editorial, con una paleta de violetas y crema dorado."
  },
  {
    id: "caso-uff-bakno",
    keywords: ["uff bakno", "bakno", "street flavor", "comida callejera"],
    respuesta: "Uff Bakno (2024): identidad de marca inspirada en cultura urbana y sabor callejero. Incluyó estrategia de marca, sistema gráfico, packaging y experiencia de marca."
  },
  {
    id: "caso-casa-montero",
    keywords: ["casa montero", "montero", "artesanal", "organico"],
    respuesta: "Casa Montero (2026): marca de alimentos artesanales inspirada en el campo y la tradición. Incluyó estrategia de marca, identidad, packaging, diseño editorial y sistema de producto."
  },
  {
    id: "caso-oti-futbol",
    keywords: ["oti futbol", "oti", "futbol base", "torneo infantil", "academia deportiva"],
    respuesta: "OTI Fútbol Base (2026): identidad y aplicaciones institucionales para una academia/torneo de fútbol infantil, representando crecimiento, formación y disciplina. También gestionó sus redes: en 6 meses pasó de ~2300 a casi 3200 seguidores, con posts de hasta 140K vistas."
  },

  // ── CLIENTES / RESULTADOS EN REDES ──
  {
    id: "cliente-yala",
    keywords: ["yala", "yala candles", "velas"],
    respuesta: "YALA Candles: marca de velas artesanales en Houston, TX. Construcción de marca premium desde cero, con más de 35 ventas orgánicas en el segundo mes sin usar pauta paga."
  },
  {
    id: "cliente-everynized",
    keywords: ["everynized", "organizacion del hogar"],
    respuesta: "Everynized: organización del hogar en Texas. Con solo 9 posts iniciales se generaron 24 leads orgánicos y 5 contrataciones de servicio completo en el primer mes."
  },
  {
    id: "cliente-tati",
    keywords: ["tati boutique", "tati", "moda femenina", "ropa"],
    respuesta: "Tati Boutique: moda femenina en Colombia. Automatización de catálogo que generó cerca de 50 prendas vendidas en solo dos semanas."
  },

  // ── HERRAMIENTAS / SKILLS ──
  {
    id: "herramientas",
    keywords: ["herramientas", "programas", "software", "que usa", "skills", "habilidades tecnicas", "figma", "photoshop", "illustrator", "premiere", "capcut", "canva", "gemini", "chatgpt", "claude", "meta", "after effects"],
    respuesta: "Herramientas principales: Meta (Ads), Adobe (Photoshop, Illustrator, Premiere, After Effects), Canva, Figma, N8N para automatización, y asistentes de IA como ChatGPT, Gemini y Claude para investigación, contenido y automatización de flujos de trabajo."
  },

  // ── FORMACIÓN ──
  {
    id: "formacion",
    keywords: ["estudios", "formacion", "donde estudio", "educacion", "fadp", "talento tech", "diplomado", "tecnico"],
    respuesta: "Estudió Técnico Profesional en Diseño Gráfico y un diplomado en Fotografía y Retoque Digital en FADP (2017). Después hizo IA Nivel Básico (2025) e IA Nivel Intermedio (2026) en Talento Tech."
  },

  // ── TRAYECTORIA LABORAL COMPLETA (orden cronológico) ──
  {
    id: "primer-trabajo-cajas",
    keywords: ["primer trabajo", "19 años", "cajas plegadizas", "fabrica de cajas", "empaques"],
    respuesta: "Su primer trabajo, a los 19 años, fue en una fábrica de cajas plegadizas (empaques para alimentos y medicamentos), donde aprendió de forma teórico-visual cómo opera la fabricación de cajas y algunos detalles de impresión."
  },
  {
    id: "litografia",
    keywords: ["litografia", "amigo", "cuarto semestre", "impresion gran formato", "volantes"],
    respuesta: "En 4to semestre de la universidad trabajó en la litografía de un amigo, haciendo impresión de gran formato, digital, volantes, tarjetas y camisetas."
  },
  {
    id: "peluqueria",
    keywords: ["peluqueria", "auxiliar de servicios", "fotografia independiente"],
    respuesta: "Durante el diplomado de fotografía (último semestre de la universidad) trabajó como auxiliar de servicios en una peluquería, y de forma independiente hizo trabajos de fotografía con otros compañeros."
  },
  {
    id: "negocio-familiar",
    keywords: ["negocio familiar", "restaurante", "comida frita", "frituras", "negocio de comida", "38 años", "digitalizar el negocio", "cerrado"],
    respuesta: "Su familia tuvo un restaurante de comida frita que estuvo abierto 38 años (hoy cerrado, hace 3 años). Ahí aprendió atención al cliente, compras, manejo de inventarios y gestión general del negocio. Entre 2020 y 2022 trabajó ahí a tiempo completo, ayudando a digitalizar buena parte del negocio (incluyendo la creación de sus redes sociales tras la pandemia)."
  },
  {
    id: "innovando-publicidad",
    keywords: ["innovando publicidad", "material pop", "2018", "2020"],
    respuesta: "En Innovando Publicidad (sep. 2018 – ene. 2020) hizo diseño y material POP, volantes e impresos para marcas nacionales; ahí empezó también a crear contenido para redes sociales."
  },
  {
    id: "marketic",
    keywords: ["marketic", "marketic agency", "agencia digital"],
    respuesta: "En Marketic Agency (mayo 2022 – abril 2023) aprendió a crear contenido para redes de manera profesional a un nivel superior, mejorando su calidad como diseñador y su agilidad con las herramientas."
  },
  {
    id: "motivo-comunicacion",
    keywords: ["motivo comunicacion", "agencia de publicidad", "pauta digital"],
    respuesta: "En Motivo Comunicación (abril – sep. 2023) aprendió cómo se trabaja en una agencia de publicidad a nivel de procesos, y tuvo un primer acercamiento a la pauta digital. También hizo branding y manuales corporativos para marcas de Colombia, Venezuela, Panamá y Costa Rica."
  },
  {
    id: "bodegas-ilusion",
    keywords: ["bodegas ilusion", "piñateria", "administrar pagina web"],
    respuesta: "En Bodegas Ilusión (sep. 2023 – mayo 2024) aprendió a administrar una página web: crear, editar y eliminar contenido de un sitio en producción."
  },
  {
    id: "smartketing",
    keywords: ["smartketing", "smartketing growth", "su agencia", "propia agencia"],
    respuesta: "Smartketing Growth es su propia agencia (Cali, desde 2022), donde ha liderado branding y dirección de arte para +20 marcas en Colombia, España y EE.UU. Mientras trabajaba en otras agencias, en paralelo tomaba proyectos independientes por Smartketing."
  },
  {
    id: "community-manager-torneo",
    keywords: ["community manager", "torneo de futbol infantil", "dos años", "mensajes de padres"],
    respuesta: "Trabajó dos años como community manager de un torneo de fútbol infantil, creando contenido y respondiendo mensajes, incluyendo los de padres frustrados con las metodologías del torneo — experiencia que le dio manejo de atención al cliente bajo presión."
  },
  {
    id: "autodidacta",
    keywords: ["autodidacta", "como aprendio", "formacion en el aula"],
    respuesta: "Se considera más autodidacta que formado en el aula: gran parte de lo que sabe lo aprendió trabajando y, hoy en día, apoyándose en IA para llevar sus ideas a la realidad."
  },
];
