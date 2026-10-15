# INOXNOW — Estado final para revisión Scroll World

Fecha: 15 de octubre de 2026

## Resultado

Existe un recorrido local reproducible con seis clips internos y cinco transiciones Canvas. El prototipo avanza y retrocede por scroll, trackpad o teclado; ofrece navegación por escenas, progreso, posters estáticos, fallback de error y modo de movimiento reducido.

Ruta: `media/prototypes/full-scroll-world-audit.html`

## Pruebas superadas

- 37/37 rutas del manifiesto existentes.
- JSON del manifiesto válido.
- 54 fotogramas de auditoría extraídos y siete hojas de contacto generadas.
- Reproducción completa 1×: 124 fotogramas por clip, 0 descartados.
- Seeking inverso: 9/9 posiciones por clip.
- Prototipo: 11/11 segmentos hacia delante y 11/11 hacia atrás.
- Scroll rápido al final y vuelta al inicio sin bloqueo.
- Teclas Inicio y Fin llevan a los segmentos 0 y 10.
- Seis vídeos cargados como Blob URL, todos con rango seekable 0–5,167 s.
- Cero errores de consola en la prueba automatizada.
- Limpieza explícita: listeners retirados, peticiones abortables y Blob URL revocadas en `destroy()`.
- `prefers-reduced-motion`: no se descargan ni asignan los vídeos; se muestran posters.
- Landing Astro: 11/11 segmentos hacia delante y atrás en Chrome 155 y Edge, scroll rápido reversible, menú móvil, contacto y cero errores de consola.
- Seis derivados H.264 1080p silenciosos con `faststart` y 16 keyframes por clip; reducción conjunta de 40,46 MiB a 30,91 MiB.
- Seeking medido en navegador entre 53,4 y 86,2 ms en Chrome y entre 54,3 y 83,4 ms en Edge.

Resultados: `media/reports/scroll-prototype-test-results.json`.

## Pendientes materiales

1. La escena 05 no cumple la acción de descenso de muebles y requiere nuevos recursos preparados; el plano ambiental sólo es temporal.
2. La escena 06 tiene encuadre demasiado cerrado para el CTA lateral.
3. La escena 03 conserva una deriva menor en texto pequeño del camión.
4. Falta revisión humana continua de los seis clips y de las cinco costuras antes de usar `media/approved-clips/`.
5. No existe versión móvil nativa 9:16. La landing usa una composición responsive de la cadena horizontal y posters como degradación; no se generaron recursos nuevos por la restricción expresa del proyecto.

## Créditos y originales

No se llamó a Higgsfield ni a ningún servicio generativo. Créditos consumidos: **0**. Saldo conocido sin cambios: **190**. Ningún original fue sobrescrito y `media/approved-clips/` continúa reservado para aprobación humana.
