# INOXNOW · Implementación de la landing Scroll World

Fecha: 15 de octubre de 2026

## Resultado

La landing Astro integra las seis escenas en el orden aprobado y las intercala con cinco transiciones Canvas 2.5D. El progreso de scroll controla directamente el tiempo de cada vídeo y el progreso normalizado de cada puente, tanto hacia delante como hacia atrás.

El controlador conserva las invariantes del prototipo auditado: renderizado por `requestAnimationFrame`, seeking coalescido, carga por Blob URL, guarda de generación para transiciones asíncronas, navegación por progreso, fallback estático, movimiento reducido y limpieza de listeners, peticiones y URLs de objeto.

## Integración

- Primera escena precargada y siguiente escena preparada en segundo plano.
- Sólo la escena activa recibe operaciones de seeking.
- Los vídeos alejados se descargan de memoria y sus Blob URL se revocan.
- Los puentes cargan sus dos fotogramas auditados bajo demanda y liberan sus Canvas auxiliares al cambiar de tramo.
- La escena 05 usa el plano ambiental existente sin simular descenso de mobiliario.
- La escena 06 desplaza el foco visual hacia la derecha y entrega el relato a un cierre comercial independiente.
- En movimiento reducido no se crean elementos de vídeo: se muestra una secuencia normal de posters y contenido.

## Audiovisual

Se utilizan las seis animaciones maestras aprobadas para revisión técnica, incluida la expedición corregida, y los diez fotogramas de borde auditados para los cinco puentes. Los posters WebP existentes sirven de carga inicial y fallback.

FFmpeg y FFprobe 9.0.2 se instalaron con el paquete verificado `Gyan.FFmpeg` de WinGet en ámbito de usuario. Se compararon tres encodes de la escena 01 y se eligió H.264 CRF 23 a 1920 × 1080, sin audio, `yuv420p`, GOP 8 y `faststart`: fue la variante más ligera y obtuvo el mejor SSIM de la comparación (0,9894). Se generaron los seis derivados servidos por la landing. Ningún original se modificó.

## Pruebas

- `astro build`: correcto.
- `scripts/verify-build.mjs`: correcto. Comprueba seis escenas, cinco puentes, un solo H1, metadatos, contacto, presencia de recursos y el manifiesto de derivados.
- `scripts/verify-web-media.ps1`: correcto. Comprueba códec, resolución, ausencia de audio, keyframes y `faststart` de los seis MP4.
- Chrome 155 y Edge: 11 de 11 segmentos hacia delante y atrás, extremos con scroll rápido, navegación a escena 06, menú móvil, validación del formulario y modo de movimiento reducido.
- Los vídeos cargados usan Blob URL, exponen 5,167 segundos seekable y no generan errores de consola.
- Seeking medido en navegador: Chrome 53,4–86,2 ms; Edge 54,3–83,4 ms.
- Capturas revisadas en escritorio 1600 × 900 y móvil 390 × 844.

## Publicación pendiente

Antes de producción deben definirse `PUBLIC_SITE_URL`, datos de contacto reales, transporte del formulario, aviso legal y privacidad. También falta la revisión humana definitiva de movimiento y costuras, y una prueba real en Safari. El saldo conocido de Higgsfield continúa en 190 créditos.
