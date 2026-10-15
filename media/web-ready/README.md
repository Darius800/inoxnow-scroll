# Versiones web

Los vídeos publicados por la landing se generan desde los seis MP4 maestros con
`pnpm media:encode`. El script crea copias H.264 a 1920 × 1080, sin audio, con
`faststart`, píxel `yuv420p` y GOP fijo de 8 fotogramas. Los originales de
`media/generated-clips/` no se modifican.

Se compararon tres configuraciones sobre la escena 01:

| Variante | Tamaño | SSIM global frente al maestro reescalado |
| --- | ---: | ---: |
| CRF 20, GOP 8, enfoque suave | 8.61 MiB | 0.9852 |
| CRF 22, GOP 12, enfoque suave | 6.23 MiB | 0.9843 |
| CRF 23, GOP 8, sin enfoque artificial | 4.46 MiB | 0.9894 |

Se eligió CRF 23 porque produjo la mayor similitud objetiva, el menor peso y un
intervalo de keyframes adecuado para el scrub. FFmpeg 9.0.2 se instaló mediante
el paquete verificado `Gyan.FFmpeg` de WinGet en ámbito de usuario.

Las transiciones 2.5D no necesitan vídeo: `media/bridges/spatial-transition-2_5d-audited.js` renderiza su progreso en Canvas, interpola el color crema de los extremos y permite invertirlo con scroll sin archivos audiovisuales adicionales.

## Estado de la auditoría final

- FFmpeg y FFprobe: 9.0.2, instalados en ámbito de usuario.
- Encodes: seis derivados web H.264 silenciosos.
- Originales 2K modificados: ninguno.
- El controlador usa Blob URL para garantizar seeking aunque el servidor no ofrezca rangos HTTP fiables.
