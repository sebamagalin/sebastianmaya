# Auditoría inicial — 5 de septiembre de 2026

## Alcance

Revisión inicial de rendimiento, interacción y adaptación responsive antes de intervenir el diseño.

## Hallazgos confirmados

1. **Automatizaciones en móvil y tablet**
   - El lienzo del rostro depende de WebGL y no dispone de una alternativa visual cuando WebGL no inicia.
   - El código excluye los eventos táctiles de forma explícita, por lo que la dispersión no responde al dedo.
   - La animación debe detenerse fuera de pantalla y reducir su carga en dispositivos de baja potencia.

2. **Portada**
   - Carga dos vídeos de introducción y una secuencia de 74 fotogramas para el parallax.
   - La visibilidad del menú y del contenido depende de que la animación llegue a su estado final.
   - El personaje necesita una composición alternativa en pantallas estrechas para no perderse al hacer scroll.

3. **Peso de recursos**
   - La carpeta de recursos tiene aproximadamente 163 MB.
   - Varias imágenes superan los 2 MB; los proyectos reúnen aproximadamente 76 MB.
   - Deben cargarse imágenes de proyectos y recursos audiovisuales solo cuando se necesiten.

4. **Sistema visual responsive**
   - Falta una auditoría común de escalas tipográficas, alturas de sección, márgenes seguros y desbordamientos.
   - La prioridad es evitar que textos, navegación y animaciones compitan entre sí en móvil.

## Orden de trabajo acordado

1. Fase 1: rendimiento y estabilidad.
2. Fase 2: sistema visual y responsive.
3. Fase 3: nueva portada, vídeo y parallax.
4. Fase 4: automatizaciones y rostro de partículas.
5. Fase 5: revisión de las demás secciones.
6. Fase 6: pruebas finales y publicación.

## Criterio de entrega por fase

- Prueba en escritorio, tablet y móvil.
- Sin errores de consola relevantes.
- Sin desplazamiento horizontal no intencional.
- Confirmación visual antes de subir cambios a GitHub.

## Avance de Fase 2

- Se unificaron los márgenes laterales mediante una variable común responsive.
- Se ajustó la escala móvil de etiqueta, títulos y texto descriptivo para priorizar legibilidad.
- Se incorporaron áreas seguras superior e inferior para que el dock no oculte contenido en móviles con bordes redondeados o barra del sistema.
- Se comprobó que Branding, Web, Redes, Bio y Automatizaciones no presenten desplazamiento horizontal a 390 px de ancho.
- Se añadió un modo de movimiento reducido que evita dejar contenido invisible y elimina transiciones no esenciales.

## Avance de Fase 4

- El rostro dispone ahora de una imagen de respaldo visible de inmediato. Si WebGL no está disponible, se reduce el movimiento o se pierde el contexto gráfico, la sección conserva el rostro en lugar de quedar negra.
- La interacción de dispersión ahora escucha `pointerdown` y `pointermove`, por lo que funciona con cursor y con un dedo; se excluye el área del chat para no interferir con su uso.
- La cantidad de partículas se adapta a la capacidad estimada del equipo y la animación se pausa al salir de pantalla o al cambiar de pestaña.
- Los redimensionamientos se agrupan para evitar reconstruir el retrato varias veces durante un giro de pantalla o un cambio de tamaño.

## Avance de Fase 3 — pendiente resuelto

- La secuencia del parallax espera la decodificación real de sus fotogramas y limita las descargas simultáneas. El primer fotograma se instala fuera de vista antes de mostrarse, evitando el salto negro o estroboscópico al iniciar.
- La portada mantiene un fondo estable durante esa preparación y solo revela la secuencia cuando está lista.
