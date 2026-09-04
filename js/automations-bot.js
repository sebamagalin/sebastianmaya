// Asistente integrado + retrato de partículas WebGL, solo para Automatizaciones.
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('automation-particles');
  const section = document.querySelector('.automation-hero-section');
  const chat = document.getElementById('automation-chat');
  const openChat = document.getElementById('open-dialogflow');
  const form = document.getElementById('automation-chat-form');
  const input = document.getElementById('automation-chat-input');
  const messages = document.getElementById('automation-chat-messages');
  if (!canvas || !section) return;

  const escapeHTML = (value) => value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const messageHTML = (text) => escapeHTML(text).replace(/(https:\/\/wa\.me\/\d+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">Escribir por WhatsApp ↗</a>');
  function appendMessage(text, role = 'bot') {
    const node = document.createElement('article');
    node.className = `automation-message automation-message--${role}`;
    if (role === 'bot') node.innerHTML = messageHTML(text); else node.textContent = text;
    messages.append(node); messages.scrollTop = messages.scrollHeight;
  }
  function reply(question) {
    const normalized = typeof normalizarTexto === 'function' ? normalizarTexto(question) : question.toLowerCase();
    if (/padre|madre|pap[aá]|mama|familia|orientacion sexual|sexualidad|pareja|novia|novio|estado civil|religion|direccion|vive|edad/.test(normalized)) {
      return 'Esa información no es relevante para evaluar su trabajo ni está incluida en el portafolio. Para una consulta personal o profesional puntual, puedes escribirle directamente por WhatsApp: https://wa.me/573053818154';
    }
    if (/hola|buenas|saludos/.test(normalized)) return '¡Hola! Puedo contarte sobre los servicios de Sebastián, sus proyectos, automatizaciones, herramientas y trayectoria. ¿Por dónde quieres empezar?';
    if (/que me puedes decir|hablame de sebastian|cuentame de sebastian|quien es sebastian|perfil de sebastian|que hace sebastian|a que se dedica/.test(normalized)) return 'Sebastián Maya es diseñador de marcas, desarrollador UI/UX y estratega digital en Cali. Combina diseño gráfico, marketing, automatización e inteligencia artificial para crear sistemas y experiencias que ayudan a las marcas a crecer.';
    const result = typeof buscarRespuesta === 'function' ? buscarRespuesta(question) : null;
    if (result?.respuesta) return `Claro. ${result.respuesta}`;
    return 'No tengo un dato confiable sobre eso y prefiero no inventarlo. Puedo ayudarte con sus servicios, automatizaciones, proyectos, experiencia o herramientas. Para una consulta puntual, escríbele por WhatsApp: https://wa.me/573053818154';
  }
  function ask(question) { const clean = question.trim(); if (!clean) return; appendMessage(clean, 'user'); window.setTimeout(() => appendMessage(reply(clean)), 240); }
  openChat?.addEventListener('click', () => { chat?.classList.add('is-open'); window.setTimeout(() => input?.focus(), 180); });
  form?.addEventListener('submit', (event) => { event.preventDefault(); ask(input.value); input.value = ''; });
  chat?.querySelectorAll('.automation-chat-suggestions button').forEach((button) => button.addEventListener('click', () => ask(button.textContent)));

  // GPU: dibuja decenas de miles de micro-puntos en una sola llamada, en vez
  // de crear una operación de Canvas por partícula en cada fotograma.
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false }) || canvas.getContext('experimental-webgl', { alpha: false, antialias: false });
  if (!gl) return;
  const vs = `attribute vec2 s,t;attribute vec3 c;attribute float z,r;uniform vec2 R,P,W;uniform float A,T,D,Q;varying vec3 C;varying float O;void main(){float e=1.-pow(1.-clamp(A,0.,1.),4.);vec2 p=mix(s,t,e);float b=sin(T*(.55+r*.18)+r*22.);p+=vec2(b*(.22+r*.5),cos(T*.43+r*13.)*.18);vec2 d=p-P;float l=length(d);float f=Q*pow(max(0.,1.-l/230.),2.5);vec2 n=d/max(l,.001);vec2 swirl=vec2(-n.y,n.x)*sin(l*.052-T*3.2+r*28.);vec2 flow=normalize(W+vec2(.001))*min(length(W),42.);p+=(n*(74.+r*34.)+swirl*(34.+r*28.)+flow*(.75+r*.35))*f;vec2 k=p/R*2.-1.;gl_Position=vec4(k.x,-k.y,0.,1.);gl_PointSize=max(1.,z*D*(.92+b*.12));C=c;O=.44+r*.45;}`;
  const fs = `precision mediump float;varying vec3 C;varying float O;void main(){float a=smoothstep(.5,.05,length(gl_PointCoord-vec2(.5)))*O;gl_FragColor=vec4(C,a);}`;
  const shader = (type, source) => { const value = gl.createShader(type); gl.shaderSource(value, source); gl.compileShader(value); if (!gl.getShaderParameter(value, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(value)); return value; };
  let program;
  try { program = gl.createProgram(); gl.attachShader(program, shader(gl.VERTEX_SHADER, vs)); gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(program); if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program)); } catch (error) { console.warn('WebGL no disponible para el retrato.', error); return; }
  const at = { s: gl.getAttribLocation(program, 's'), t: gl.getAttribLocation(program, 't'), c: gl.getAttribLocation(program, 'c'), z: gl.getAttribLocation(program, 'z'), r: gl.getAttribLocation(program, 'r') };
  const un = { R: gl.getUniformLocation(program, 'R'), P: gl.getUniformLocation(program, 'P'), W: gl.getUniformLocation(program, 'W'), A: gl.getUniformLocation(program, 'A'), T: gl.getUniformLocation(program, 'T'), D: gl.getUniformLocation(program, 'D'), Q: gl.getUniformLocation(program, 'Q') };
  const buffers = {}; const reference = new Image(); const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, strength: 0, active: false };
  let width = 1, height = 1, ratio = 1, count = 0, startedAt = 0, frame = 0, active = false;
  function upload(key, data, components) { if (buffers[key]) gl.deleteBuffer(buffers[key]); buffers[key] = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffers[key]); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); gl.enableVertexAttribArray(at[key]); gl.vertexAttribPointer(at[key], components, gl.FLOAT, false, 0, 0); }
  function buildPoints() {
    const mobile = window.matchMedia('(max-width:768px)').matches;
    const lowPower = (navigator.hardwareConcurrency || 8) < 6;
    const density = mobile ? (lowPower ? 34000 : 56000) : (lowPower ? 90000 : 155000);
    const sw = mobile ? 520 : 820, sh = Math.round(sw * reference.naturalHeight / reference.naturalWidth);
    const source = document.createElement('canvas'); source.width = sw; source.height = sh;
    const ctx = source.getContext('2d', { willReadFrequently: true }); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, sw, sh); ctx.drawImage(reference, 0, 0, sw, sh);
    const pixels = ctx.getImageData(0, 0, sw, sh).data, all = [], detail = [];
    for (let y = 1; y < sh - 1; y += 2) for (let x = 1; x < sw - 1; x += 2) {
      const i = (y * sw + x) * 4, red = pixels[i], green = pixels[i + 1], blue = pixels[i + 2], brightness = red * .56 + green * .32 + blue * .12;
      if (brightness < 14 || red < green * 1.08 || red < blue * 1.28) continue;
      const h = i + 4, v = i + sw * 4, edge = Math.abs(brightness - (pixels[h] * .56 + pixels[h + 1] * .32 + pixels[h + 2] * .12)) + Math.abs(brightness - (pixels[v] * .56 + pixels[v + 1] * .32 + pixels[v + 2] * .12));
      const point = { x, y, red, green, blue, brightness, edge }; all.push(point); if (edge > 28 || brightness > 102) detail.push(point);
    }
    // Repetir muestras muy cercanas permite mantener densidad micro sin
    // inventar geometría ajena al retrato original.
    count = all.length ? density : 0;
    const starts = new Float32Array(count * 2), targets = new Float32Array(count * 2), colors = new Float32Array(count * 3), sizes = new Float32Array(count), seeds = new Float32Array(count);
    const scale = Math.min(width / reference.naturalWidth, height / reference.naturalHeight), faceWidth = reference.naturalWidth * scale, faceHeight = reference.naturalHeight * scale, left = (width - faceWidth) / 2, top = (height - faceHeight) / 2;
    for (let i = 0; i < count; i += 1) {
      const pool = i < count * .66 && detail.length ? detail : all, p = pool[Math.floor(Math.random() * pool.length)], a = Math.random() * Math.PI * 2, d = Math.max(width, height) * (.7 + Math.random() * .95), b = p.brightness / 255;
      starts[i * 2] = width / 2 + Math.cos(a) * d; starts[i * 2 + 1] = height / 2 + Math.sin(a) * d;
      targets[i * 2] = left + p.x / sw * faceWidth; targets[i * 2 + 1] = top + p.y / sh * faceHeight;
      colors[i * 3] = Math.min(1, p.red / 255 * 1.15); colors[i * 3 + 1] = p.green / 255; colors[i * 3 + 2] = p.blue / 255 * .65;
      sizes[i] = .42 + Math.pow(b, 1.7) * 1.9 + Math.random() * .65; seeds[i] = Math.random();
    }
    upload('s', starts, 2); upload('t', targets, 2); upload('c', colors, 3); upload('z', sizes, 1); upload('r', seeds, 1);
  }
  function resize() { const bounds = section.getBoundingClientRect(); width = Math.max(1, Math.round(bounds.width)); height = Math.max(1, Math.round(bounds.height)); ratio = Math.min(window.devicePixelRatio || 1, 2); canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio); canvas.style.width = `${width}px`; canvas.style.height = `${height}px`; gl.viewport(0, 0, canvas.width, canvas.height); buildPoints(); startedAt = performance.now(); }
  function render(time) { if (!active) return; pointer.strength *= pointer.active ? .975 : .925; pointer.vx *= .90; pointer.vy *= .90; if (pointer.strength < .006) pointer.strength = 0; gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT); gl.useProgram(program); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.uniform2f(un.R, width, height); gl.uniform2f(un.P, pointer.x, pointer.y); gl.uniform2f(un.W, pointer.vx, pointer.vy); gl.uniform1f(un.Q, pointer.strength); gl.uniform1f(un.A, Math.min(1, (time - startedAt) / 1180)); gl.uniform1f(un.T, time / 1000); gl.uniform1f(un.D, ratio); Object.entries(buffers).forEach(([key, buffer]) => { gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.enableVertexAttribArray(at[key]); gl.vertexAttribPointer(at[key], key === 'c' ? 3 : key === 's' || key === 't' ? 2 : 1, gl.FLOAT, false, 0, 0); }); gl.drawArrays(gl.POINTS, 0, count); frame = requestAnimationFrame(render); }
  function start() { if (active || !count) return; active = true; startedAt = performance.now(); frame = requestAnimationFrame(render); }
  new IntersectionObserver(([entry]) => { if (entry.isIntersecting) start(); else { active = false; cancelAnimationFrame(frame); } }, { threshold: .12 }).observe(section);
  reference.onload = resize; reference.src = 'assets/images/automation-face-reference.jpeg';
  window.addEventListener('resize', () => { if (reference.complete) resize(); });
  section.addEventListener('pointermove', (event) => { if (event.pointerType === 'touch') return; const bounds = section.getBoundingClientRect(), x = event.clientX - bounds.left, y = event.clientY - bounds.top; if (pointer.active) { pointer.vx = pointer.vx * .64 + (x - pointer.x) * .36; pointer.vy = pointer.vy * .64 + (y - pointer.y) * .36; } pointer.x = x; pointer.y = y; pointer.strength = 1; pointer.active = true; });
  section.addEventListener('pointerleave', () => { pointer.active = false; });
});
