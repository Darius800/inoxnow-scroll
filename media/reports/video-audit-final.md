# INOXNOW — Auditoría final de las seis animaciones

Fecha: 15 de octubre de 2026  
Créditos consumidos: **0**  
Aprobación humana: **pendiente**

## Método y alcance

- Se reprodujo cada MP4 completo a velocidad normal en Chromium. Cada clip entregó 124 fotogramas de vídeo, sin fotogramas descartados.
- Se recorrió cada clip en sentido inverso mediante nueve seeks descendentes, desde 4,90 s hasta 0,05 s.
- Se extrajeron nueve fotogramas representativos por escena —54 en total— y se revisaron visualmente en hojas de contacto.
- Se recorrió la secuencia completa mediante scroll hacia delante y hacia atrás en el prototipo.
- La interfaz interactiva de Computer Use no tenía navegador disponible. Por tanto, las observaciones visuales detalladas proceden de los fotogramas extraídos y de capturas reales del navegador automatizado; no se presenta una “aprobación humana” del movimiento continuo.

## Propiedades técnicas

Los seis clips comparten: 2560 × 1440, 24 fps, 5,167 s, MP4 y pista de audio presente. La reproducción completa observó 124 fotogramas por clip, cero descartados y seeking inverso correcto. Los originales no se han modificado.

| Escena | Tamaño | Clasificación | Observación visual |
|---|---:|---|---|
| 01 · Almacén | 5,61 MiB | **APTO PARA REVISIÓN FINAL** | Acercamiento continuo; almacén, rótulo, estanterías y carretilla conservan forma. La carretilla y los operarios presentan actividad contenida, sin colisiones visibles. |
| 02 · Showroom | 9,77 MiB | **APTO PARA REVISIÓN FINAL** | Acercamiento más marcado que un track lateral. Mobiliario y arquitectura estables; personas cambian de postura sin atravesar mesas. |
| 03 · Expedición corregida | 3,95 MiB | **APTO CON LIMITACIONES** | La carretilla avanza de forma reconocible y el camión queda estacionado. Carga y chasis se mantienen; persiste deriva menor del texto pequeño del vehículo. |
| 04 · Cocina vacía | 6,98 MiB | **APTO PARA REVISIÓN FINAL** | La cámara se acerca a los profesionales; paredes, extracción, conducciones y suelo permanecen estables. No aparece equipamiento nuevo. |
| 05 · Instalación | 4,25 MiB | **REQUIERE CORRECCIÓN** | La maqueta es estable y sirve como plano ambiental, pero no muestra el descenso vertical de mesa, fregadero y estantería. La acción principal solicitada no existe. |
| 06 · Cocina operativa | 9,91 MiB | **APTO CON LIMITACIONES** | Actividad de chefs y vapor localizado con mobiliario estable. El zoom es fuerte y elimina gran parte del espacio negativo izquierdo previsto para el CTA. |

## Reversibilidad

Los seis archivos aceptan seeking descendente hasta el inicio y los movimientos de cámara son monotónicos en las muestras. No hay cortes ni saltos de orientación evidentes. La reproducción inversa de gestos humanos seguirá teniendo el aspecto mecánico propio de invertir un vídeo, pero no introduce reconstrucciones nuevas. Las escenas 03 y 06 deben revisarse humanamente a velocidad lenta antes de decidir su aprobación definitiva.

## Hojas de contacto

- `media/keyframes/contact-sheets/scene-01-contact-sheet.png`
- `media/keyframes/contact-sheets/scene-02-contact-sheet.png`
- `media/keyframes/contact-sheets/scene-03-contact-sheet.png`
- `media/keyframes/contact-sheets/scene-04-contact-sheet.png`
- `media/keyframes/contact-sheets/scene-05-contact-sheet.png`
- `media/keyframes/contact-sheets/scene-06-contact-sheet.png`
- Comparativa global: `media/keyframes/contact-sheets/global-comparison.png`

Los resultados técnicos completos están en `media/reports/playback-audit-results.json`.
