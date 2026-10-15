# INOXNOW — Piloto espacial MiniMax H3 · Clip A

Fecha: 2026-10-14 (Europe/Madrid)

## Estado

**Generado y evaluado; candidato a revisión humana, no aprobado automáticamente.**

No se generó el clip B y no se realizó ningún reintento.

## Preflight de cuenta y coste

- Espacio seleccionado: plan Starter.
- Saldo previo confirmado por el CLI: 270 créditos.
- Modelo confirmado en el catálogo: MiniMax H3 (`minimax_h3`).
- El esquema acepta `start_image`, `end_image`, `duration`, `aspect_ratio` y `resolution`.
- Resolución admitida por el esquema: `2K`.
- Relación admitida: `16:9`.
- Duración enviada: 5 s.
- El modelo no expone un campo independiente de *negative prompt*.
- El modelo no expone un parámetro para desactivar el audio.
- Coste calculado antes de crear el trabajo: 10 créditos.
- Coste real deducido: 10 créditos.
- Saldo posterior confirmado: 260 créditos.
- La operación se cargó al espacio Starter seleccionado; no se utilizó una integración de pago por uso independiente.

## Registro de generación

- Modelo: MiniMax H3.
- Resolución: 2560 × 1440.
- Relación de aspecto: 16:9.
- Duración: 5 s.
- Fotogramas por segundo: 24 fps.
- Contenedor: MP4.
- Vídeo: H.264/AVC (`avc1`).
- Audio: AAC (`mp4a`), aproximadamente 133 kbps.
- Bitrate de vídeo informado por Windows: aproximadamente 8.621 kbps.
- Bitrate total informado: aproximadamente 8.755 kbps.
- Tamaño del original: 5.478.849 bytes.
- SHA-256: `C49DE2134978784CB5EDAE6B09FED734D286C48433A5F0C2B9C7B7E2BE762A36`.
- Vídeo original: `media/generated-clips/pilot-spatial-clip-a-minimax-h3-2k-original.mp4`.
- Inicio: imagen original de la escena 01, almacén.
- Final: `media/keyframes/spatial-bridge-01-02-local.png`.

## Prompt utilizado

> Single continuous cinematic camera shot of a premium stylized isometric 3D miniature world. Start with the INOXNOW warehouse diorama, then perform a very slow, smooth stabilized camera dolly-out, progressively revealing a second separate floating island containing the equipment showroom beside the warehouse. Both islands must coexist as physically independent objects in the same scene. Preserve the exact warehouse geometry, miniature scale, stainless steel equipment, architectural details, vegetation, pastel cream palette, warm soft lighting and fixed high isometric viewing angle. Gentle lateral camera translation with subtle parallax, no scene transformation. End by matching the supplied spatial bridge composition as closely as possible. Stable architectural visualization, continuous physical camera movement. Avoid semantic morphing, building transformation, architecture reconstruction, dissolves, crossfades, hard cuts, sudden zoom, camera rotation to frontal view, warped furniture, disappearing shelving, duplicate objects, unstable island boundaries, changing environment, flickering, shaking, distorted people and unexpected structures.

Las restricciones negativas se incorporaron al prompt principal porque el esquema de H3 no admite un parámetro separado.

## Fotogramas de control

- Inicio (~0,05 s): `media/keyframes/pilot-spatial-clip-a-start.png`
- 1,00 s: `media/keyframes/pilot-spatial-clip-a-1-00s.png`
- 1,50 s: `media/keyframes/pilot-spatial-clip-a-1-50s.png`
- 2,00 s: `media/keyframes/pilot-spatial-clip-a-2-00s.png`
- 2,25 s: `media/keyframes/pilot-spatial-clip-a-2-25s.png`
- Centro (~2,50 s): `media/keyframes/pilot-spatial-clip-a-middle.png`
- 2,75 s: `media/keyframes/pilot-spatial-clip-a-2-75s.png`
- 3,00 s: `media/keyframes/pilot-spatial-clip-a-3-00s.png`
- 3,50 s: `media/keyframes/pilot-spatial-clip-a-3-50s.png`
- 4,00 s: `media/keyframes/pilot-spatial-clip-a-4-00s.png`
- 4,50 s: `media/keyframes/pilot-spatial-clip-a-4-50s.png`
- Final (~4,96 s): `media/keyframes/pilot-spatial-clip-a-end.png`

## Evaluación visual

### Resultado principal

El cambio de estrategia resuelve el defecto estructural del primer piloto. El almacén no se transforma en showroom. La cámara se aleja del almacén y el showroom entra desde el borde derecho como otra isla físicamente separada. Ambas maquetas existen simultáneamente desde aproximadamente 2,0–2,25 s y quedan completamente visibles en la segunda mitad.

### Almacén

- Permanece reconocible durante todo el recorrido.
- Se conservan el volumen frontal, cubierta, fachada abierta, estanterías, muelle/camión, isla y distribución general.
- No se observa una reconstrucción arquitectónica importante equivalente a la del primer piloto.
- Hay pequeñas variaciones generativas en detalles finos, personajes, mobiliario y rótulo al reducirse la escala, pero no cambian la identidad del edificio.

### Showroom

- Aparece desde fuera del encuadre derecho, no desde partes del almacén.
- Conserva una identidad independiente y un perímetro de isla separado.
- Su arquitectura general permanece estable mientras entra y reduce su escala con el dolly-out.
- El texto `INOXNOW` se deforma temporalmente cuando el diorama está distante, sobre todo aproximadamente entre 2,25 y 3,50 s; converge de nuevo hacia el fotograma final.

### Cámara y perspectiva

- Movimiento predominante: dolly-out estabilizado con traslación lateral suave.
- La orientación alta/isométrica se conserva; no aparece el giro frontal del piloto anterior.
- Los fotogramas muestreados muestran progresión espacial coherente, sin corte ni fundido.
- No se detecta un salto brusco del segundo diorama: entra progresivamente por el borde derecho.
- La sensación de velocidad debe confirmarse reproduciendo el MP4 completo y hacia atrás; la inspección por fotogramas no sustituye esa revisión humana.

### Coincidencia con el puente

El último fotograma se aproxima de forma muy estrecha a `spatial-bridge-01-02-local.png`. Una comparación RGB muestreada cada 16 píxeles produjo:

- MAE: 2,68 sobre 255.
- RMSE: 7,22 sobre 255.

Esto indica una coincidencia global alta. Las diferencias se concentran en compresión, detalles finos y pequeños cambios generativos.

### Defectos pendientes

- Se distinguen paneles rectangulares y variaciones de tono crema alrededor de cada imagen durante la vista amplia. Proceden de la composición puente local y se vuelven más visibles cuando la cámara se aleja.
- Los rótulos de ambas maquetas pierden estabilidad al hacerse pequeños; el del showroom es el más afectado.
- Hay microvariaciones en personajes y equipamiento fino propias del vídeo generativo.
- El fondo amplio es visualmente plano y revela que el puente deriva de dos imágenes compuestas, no de un escenario 3D único.

## Criterios de aceptación

| Criterio | Evaluación técnica |
|---|---|
| Almacén reconocible durante todo el movimiento | Cumple |
| Showroom como segunda isla independiente | Cumple |
| Ambas islas visibles al final | Cumple |
| Perspectiva isométrica coherente | Cumple |
| Movimiento de cámara suave | Cumple en fotogramas muestreados; pendiente de revisión humana continua/inversa |
| Sin deformaciones arquitectónicas importantes | Cumple |
| Final próximo al puente | Cumple con alta similitud |
| Calidad final sin defectos visibles | No completamente: costuras tonales y texto distante inestable |

## Audio

El MP4 original conserva su pista AAC. Cuando se prepare la versión web y exista FFmpeg en el entorno, puede crearse una copia silenciosa sin recomprimir el vídeo mediante:

```text
ffmpeg -i input.mp4 -map 0:v:0 -c:v copy -an output-silent.mp4
```

No se instaló ni ejecutó FFmpeg durante esta fase.

## Recomendación

Mantener este archivo como **candidato de Clip A**, sin moverlo todavía a `media/approved-clips/`. Antes de autorizar Clip B, revisar el MP4 a velocidad normal, 0,25× y hacia atrás, prestando especial atención a 2,0–3,5 s.

Si el movimiento resulta aceptable, el Clip B debe comenzar con el último fotograma realmente renderizado de este vídeo —no con el puente local original— conforme a la regla de entrega de Scroll World. Las costuras de fondo del puente deberían corregirse antes de una producción definitiva, pero no invalidan la demostración de continuidad espacial.
