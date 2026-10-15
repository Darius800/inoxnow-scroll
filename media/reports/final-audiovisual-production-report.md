# INOXNOW — Informe final de producción audiovisual

Fecha: 14 de octubre de 2026  
Modelo: MiniMax H3  
Configuración: 2560 × 1440, 16:9, 5 segundos por clip  
Estado global: **seis clips generados, cinco transiciones 2.5D preparadas, aprobación humana pendiente**

## 1. Control económico

- Saldo confirmado antes de esta fase: 250 créditos.
- Coste consultado antes de cada generación: 10 créditos.
- Generaciones realizadas: 6.
- Reintentos: 0.
- Créditos consumidos en esta fase: 60.
- Saldo final confirmado: 190 créditos.
- Límite autorizado: 90 créditos.
- Margen no utilizado: 30 créditos.

Todos los trabajos se cargaron al espacio de suscripción seleccionado. No se empleó facturación API independiente, no se compraron créditos y no se cambió de modelo.

## 2. Resultado por escena

### Escena 01 — Almacén

Archivo: `media/generated-clips/scene-01-internal-motion-minimax-h3-2k-original.mp4`

La arquitectura, el rótulo principal, el camión, las estanterías y el equipamiento permanecen estables. La cámara hace un acercamiento isométrico limpio. La carretilla conserva su forma, aunque el recorrido es contenido y debe juzgarse en el vídeo completo.

Estado: **validada técnicamente; pendiente de aprobación visual humana**.

### Escena 02 — Showroom

Archivo: `media/generated-clips/scene-02-internal-motion-minimax-h3-2k-original.mp4`

El mobiliario inoxidable, las campanas, el mostrador, el rótulo y la isla se conservan. Los personajes cambian de postura sin atravesar las mesas. El acercamiento es más notable que el track lateral pedido, pero mantiene la perspectiva.

Estado: **validada técnicamente; pendiente de aprobación visual humana**.

### Escena 03 — Expedición corregida

Archivo: `media/generated-clips/scene-03-internal-motion-corrected-minimax-h3-2k-original.mp4`

El camión y la carga del muelle permanecen estables. La carretilla realiza un desplazamiento corto y reconocible sin deformar el chasis ni el pallet. Se elimina el cambio de carga observado en el piloto anterior. Persiste una ligera deriva del texto pequeño del vehículo, no una reconstrucción estructural.

Estado: **validada técnicamente; pendiente de aprobación visual humana**.

### Escena 04 — Cocina vacía

Archivo: `media/generated-clips/scene-04-internal-motion-minimax-h3-2k-original.mp4`

La sala permanece vacía. No aparecen mesas ni equipamiento. Extracción, paredes, conducciones, drenajes y pallets se mantienen. Los profesionales centrales consultan el plano y el operario existente del panel se conserva.

Estado: **validada técnicamente; pendiente de aprobación visual humana**.

### Escena 05 — Instalación

Archivo: `media/generated-clips/scene-05-installation-motion-minimax-h3-2k-original.mp4`

La arquitectura, los muebles y los operarios son estables. No se aprecia morphing importante ni penetración del suelo. Sin embargo, el descenso vertical de una mesa no queda claramente demostrado en los fotogramas extraídos. El modelo favoreció actividad ambiental y una ligera retirada de cámara.

Estado: **generada y estable, pero la acción principal no está validada**. Puede utilizarse como plano ambiental de instalación si la revisión humana lo acepta. No se realizó un reintento.

### Escena 06 — Cocina operativa

Archivo: `media/generated-clips/scene-06-internal-motion-minimax-h3-2k-original.mp4`

Mesas, hornos, estanterías, fregaderos y campanas permanecen estables. Los chefs muestran actividad y el vapor está localizado. El acercamiento es mayor de lo solicitado y reduce el espacio crema de la izquierda destinado al CTA.

Estado: **validada en movimiento y geometría, con advertencia de composición; pendiente de aprobación visual humana**.

## 3. Transiciones espaciales

Se prepararon cinco transiciones locales sin créditos:

- 01 → 02
- 02 → 03
- 03 → 04
- 04 → 05
- 05 → 06

El módulo `media/bridges/spatial-transition-2_5d.js` usa los fotogramas reales de salida y entrada de cada clip. Recorta únicamente el fondo conectado al borde, coloca ambos dioramas como islas independientes y convierte el progreso 0–1 en un desplazamiento espacial reversible. No transforma un edificio en otro.

La demostración `media/bridges/transition-preview.html` permite escoger un tramo y mover manualmente un control de progreso hacia delante o atrás. Se verificó en navegador el punto medio 01 → 02: ambas islas coexisten, no aparecen paneles crema rectangulares internos y no hay reconstrucción generativa.

Los PNG de `media/bridges/bridge-XX-YY-preview.png` son composiciones de referencia. El módulo definitivo usa los fotogramas extraídos de los vídeos, conforme a la regla de continuidad de Scroll World.

Estado: **preparadas localmente; pendientes de revisar durante la futura integración de scroll**.

## 4. Reversibilidad y continuidad

- Los clips internos conservan una cámara monotónica y estable en los fotogramas revisados.
- Las transiciones Canvas son matemáticamente reversibles porque su estado depende sólo del progreso normalizado.
- Los extremos del módulo usan los fotogramas reales de los clips adyacentes.
- No se han declarado aprobados los vídeos sólo por generarse.
- La reproducción humana completa a velocidad normal, lenta y hacia atrás sigue siendo obligatoria antes de mover archivos a `media/approved-clips/`.

## 5. Recursos web

FFmpeg y FFprobe no están disponibles y no se instalaron. Por tanto:

- Los originales conservan su pista de audio.
- `media/web-ready/` contiene las instrucciones de codificación, pero no falsos archivos “optimizados”.
- Cuando FFmpeg esté disponible deben crearse copias silenciosas H.264 con GOP corto y `faststart`, conservando siempre los MP4 originales.
- Las seis imágenes fuente funcionan como posters y respaldo estático, incluido `prefers-reduced-motion`.

## 6. Archivos de control

- Manifiesto: `media/reports/production-manifest.json`
- Plan y prompts: `media/reports/production-plan-scroll-world-minimax-h3.md`
- Control del piloto anterior: `media/reports/scene-03-internal-motion-pilot-minimax-h3.md`
- Transiciones: `media/bridges/`
- Fotogramas: `media/keyframes/`
- Originales generados: `media/generated-clips/`

## 7. Pendientes antes de desarrollar la landing

1. Revisar los seis MP4 completos a 1×, 0,25× y hacia atrás.
2. Decidir si la escena 05 funciona como actividad de instalación o si el descenso físico de muebles es imprescindible. Un resultado preciso exigiría fondo limpio y capas aprobadas; no conviene otro intento idéntico.
3. Decidir si la escena 06 admite el CTA superpuesto sobre la imagen o necesita un encuadre final menos cerrado.
4. Marcar manualmente los clips aceptados y copiarlos a `media/approved-clips/`.
5. Preparar los encodes silenciosos y optimizados cuando FFmpeg esté disponible.
6. Probar las cinco costuras dentro del motor Scroll World y ajustar únicamente duración espacial y velocidad, sin regenerar edificios.

No hace falta una generación importante adicional para comenzar una integración técnica de prueba. Para cerrar la producción como definitiva sí hace falta la decisión humana sobre las escenas 05 y 06.
