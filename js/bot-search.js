// ── BUSCADOR DEL CHATBOT (coincidencia por palabras clave, sin backend) ──

function normalizarTexto(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita tildes
    .replace(/[^a-z0-9ñ\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Palabras muy comunes que no aportan al match (se ignoran en el conteo)
const STOPWORDS = new Set([
  'el','la','los','las','un','una','unos','unas','de','del','al','y','o','en',
  'que','como','cual','cuales','cuando','donde','quien','quienes','es','son',
  'para','por','con','sin','a','tu','su','me','te','se','le','lo','mi',
  'cuanto','cuantos','cuanta','cuantas','hay','tiene','tienes','sobre','este','esta',
  'puedes','podrias','dime','sabes'
]);

function tokenizar(str) {
  return normalizarTexto(str).split(' ').filter(w => w && !STOPWORDS.has(w));
}

/**
 * Busca la mejor coincidencia en BOT_KNOWLEDGE para el texto del usuario.
 * Devuelve { respuesta, score } o null si no hay nada suficientemente bueno.
 */
function buscarRespuesta(pregunta) {
  const tokensPregunta = tokenizar(pregunta);
  if (tokensPregunta.length === 0) return null;

  let mejor = null;
  let mejorScore = 0;

  BOT_KNOWLEDGE.forEach(entry => {
    let score = 0;
    entry.keywords.forEach(kw => {
      const tokensKw = tokenizar(kw);
      // Coincidencia de frase completa (keyword de varias palabras dentro del texto)
      if (tokensKw.length > 1 && normalizarTexto(pregunta).includes(normalizarTexto(kw))) {
        score += tokensKw.length * 2;
      }
      // Coincidencia palabra por palabra
      tokensKw.forEach(tk => {
        if (tokensPregunta.includes(tk)) score += 1;
      });
    });
    if (score > mejorScore) {
      mejorScore = score;
      mejor = entry;
    }
  });

  // Umbral mínimo para evitar respuestas forzadas con match débil
  if (mejor && mejorScore >= 1) {
    return { respuesta: mejor.respuesta, score: mejorScore };
  }
  return null;
}

const RESPUESTA_FALLBACK = "No tengo esa información en la página. Puedes preguntarme sobre los servicios (branding, web, redes, automatizaciones), los casos de estudio, las herramientas que usa o su trayectoria. Para algo puntual, escríbele directo →";
const FALLBACK_WHATSAPP = "https://wa.me/573053818154";
