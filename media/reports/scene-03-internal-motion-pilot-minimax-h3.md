# INOXNOW — Control de calidad del piloto de movimiento interno · Escena 03

Fecha de ejecución: 14 de octubre de 2026  
Estado: **candidato técnico; pendiente de revisión humana y no aprobado como clip definitivo**

## 1. Alcance ejecutado

Se realizó una sola generación de prueba para la escena 03 — Expedición. No hubo reintentos, no se generaron otros vídeos y no se modificó la landing.

- Modelo: MiniMax H3
- Fotograma inicial: `media/source-images/scene-03-expedition.webp`
- Fotograma final: no utilizado
- Duración solicitada: 5 segundos
- Resolución solicitada: 2K
- Relación de aspecto: 16:9
- Coste verificado antes de generar: 10 créditos
- Saldo anterior: 260 créditos
- Coste real: 10 créditos
- Saldo posterior: 250 créditos

La integración confirmó que MiniMax H3 admite `start_image`, `end_image`, `duration`, `aspect_ratio` y `resolution`. Para este piloto se utilizó únicamente una imagen inicial. La integración no expuso un campo independiente para *negative prompt* ni un control para desactivar el audio; por ello no se inventaron ni enviaron parámetros no admitidos.

## 2. Prompt utilizado

> Single continuous shot of a premium stylized isometric 3D miniature logistics diorama. Preserve the exact warehouse architecture, loading bay, floating island boundary, stainless steel equipment, delivery truck, forklift, workers, vegetation, warm soft lighting, pastel cream background and INOXNOW visual identity from the supplied starting image. Animate only restrained physically plausible activity: the miniature forklift slowly drives a short distance along the clear loading-area floor while carrying its pallet securely; its wheels rotate naturally and the driver remains seated. The delivery truck stays parked and geometrically unchanged. Nearby workers make only subtle hand and head movements while inspecting the shipment. Use a very slow smooth stabilized lateral camera track with an almost imperceptible gentle approach, maintaining the same elevated three-quarter isometric orientation. Keep all architecture, shelving, equipment, vehicles, people count, scale, logos and island edges stable. No scene change, no new objects, no object transformation, no camera orbit, no frontal view, no abrupt motion, no cuts, no fades, no morphing, no flicker, no warped furniture, no duplicate workers, no disappearing cargo, no sliding vehicles, no lighting change.

El prompt reduce deliberadamente la complejidad: la carretilla es el único movimiento principal, el camión debía permanecer estacionado y los operarios se limitaron a microgestos.

## 3. Archivo original y propiedades

- Vídeo: `media/generated-clips/scene-03-internal-motion-pilot-minimax-h3-2k-original.mp4`
- Tamaño: 5.404.104 bytes
- Contenedor: MP4
- Vídeo: H.264/AVC (`avc1`)
- Resolución: 2560 × 1440
- Duración: 5,00 s
- Velocidad: 24 fps
- Bitrate de vídeo aproximado: 8.502 kb/s
- Audio: AAC (`mp4a`), aproximadamente 133 kb/s
- Bitrate total aproximado: 8.635 kb/s
- SHA-256: `644E346E633DBA6608C6162CAE48C67AADF6744F9D2604F8FB5E1396092A9EFF`

El original conserva su pista de audio. Para la versión web se podrá crear más adelante una copia sin audio con FFmpeg, si ya está disponible, por ejemplo: `ffmpeg -i entrada.mp4 -c:v copy -an salida-sin-audio.mp4`. No se instaló FFmpeg ni se alteró el original durante esta fase.

## 4. Fotogramas de control

Se extrajeron once muestras para revisar el desarrollo completo:

- `scene-03-motion-pilot-start.png`
- `scene-03-motion-pilot-0-50s.png`
- `scene-03-motion-pilot-1-00s.png`
- `scene-03-motion-pilot-1-50s.png`
- `scene-03-motion-pilot-2-00s.png`
- `scene-03-motion-pilot-middle.png`
- `scene-03-motion-pilot-3-00s.png`
- `scene-03-motion-pilot-3-50s.png`
- `scene-03-motion-pilot-4-00s.png`
- `scene-03-motion-pilot-4-50s.png`
- `scene-03-motion-pilot-end.png`

Todos están en `media/keyframes/` y conservan 2560 × 1440 píxeles.

## 5. Evaluación visual

### Aspectos que funcionan

- La arquitectura del almacén permanece estable durante las once muestras.
- La fachada, cubierta, muelle, estanterías, pallets, vegetación y límites de la isla no sufren reconstrucciones evidentes.
- Se mantiene el ángulo elevado de tres cuartos y no aparece un giro hacia una vista frontal.
- El camión permanece estacionado y conserva una geometría consistente.
- La marca principal de la fachada se mantiene legible y estable.
- No se observan cortes, fundidos, cambios bruscos de iluminación ni aparición de trabajadores adicionales.
- El espacio negativo crema de la izquierda se conserva.
- El movimiento de cámara parece lento y continuo en las muestras, adecuado para scrubbing reversible.

### Problemas detectados

- La carga manipulada por el trabajador situado en el camión/muelle cambia semánticamente: parte como un elemento inoxidable o carga envuelta y termina pareciéndose a una caja de cartón. Es una reconstrucción de objeto no solicitada.
- El desplazamiento de la carretilla parece demasiado pequeño en los fotogramas muestreados. Las ruedas mantienen buena forma, pero las imágenes fijas no permiten confirmar una rotación natural perceptible.
- La acción visual dominante termina siendo la manipulación/reconstrucción de la carga por el operario, no el avance controlado de la carretilla.
- Al reproducir hacia atrás, el cambio de carga puede percibirse como aparición o transformación de un objeto, aunque la arquitectura siga siendo estable.

## 6. Criterios de aceptación

| Criterio | Resultado | Observación |
|---|---|---|
| Arquitectura estable | Cumple | Sin reconstrucción relevante del edificio o isla. |
| Perspectiva isométrica coherente | Cumple | No hay órbita ni paso a frontal. |
| Movimiento de cámara suave | Cumple visualmente | Debe confirmarse en reproducción completa. |
| Camión estable | Cumple | Permanece estacionado y reconocible. |
| Carretilla avanza de forma clara | Parcial | Desplazamiento muy sutil en las muestras. |
| Ruedas con movimiento natural | No verificable | Requiere revisión del vídeo en tiempo real y lento. |
| Mobiliario y equipos estables | Cumple | No se aprecia deformación importante. |
| Carga sin transformación | No cumple | El objeto cambia hacia una caja de cartón. |
| Sin cortes ni fundidos | Cumple | No se detectan en el muestreo. |
| Reversible mediante scroll | Parcial | Cámara y arquitectura sí; la carga introduce una incoherencia al invertir. |

## 7. Veredicto

El piloto demuestra que MiniMax H3 puede aportar movimiento ambiental manteniendo muy estable el diorama, la cámara y la arquitectura cuando se limita el número de acciones. Es una mejora importante respecto a las transiciones directas entre edificios diferentes.

No debe aprobarse todavía como clip definitivo de la escena 03. El cambio semántico de la carga incumple la estabilidad de objetos y el movimiento de la carretilla puede resultar insuficiente. Se conserva como prueba útil y no se realiza regeneración automática.

## 8. Recomendación

Primero debe revisarse el MP4 completo, a velocidad normal, lenta y en sentido inverso. Si la carretilla se percibe bien y la transformación de la carga pasa inadvertida al tamaño real de la landing, el clip podría aceptarse con una reserva documentada. Si se rechaza, la siguiente prueba debería congelar explícitamente al trabajador del camión y su carga, mantener el camión inmóvil y concentrar toda la acción principal en un recorrido corto y claramente visible de la carretilla. Una nueva prueba equivalente costaría previsiblemente 10 créditos, pero su coste tendría que reconfirmarse y requeriría autorización expresa.

La estrategia global recomendada sigue siendo híbrida: clips H3 para actividad interna de cada diorama y conectores espaciales locales 2.5D para trasladarse entre islas sin reconstruir edificios. El plan completo está en `media/reports/production-plan-scroll-world-minimax-h3.md`.
