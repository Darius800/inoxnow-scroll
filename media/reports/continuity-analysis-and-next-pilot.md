# INOXNOW — Análisis de continuidad y plan del siguiente piloto

Fecha del análisis: 2026-10-14 (Europe/Madrid)

## Resumen ejecutivo

El piloto 01 → 02 no representa un viaje físico entre dos lugares. MiniMax H3 mantiene bien el estilo general y alcanza los dos extremos, pero interpola semánticamente el almacén hasta convertirlo en showroom. El fallo se hace perceptible alrededor de 1,3–1,5 s, se vuelve evidente entre 2,0 y 2,5 s y culmina en una reconstrucción arquitectónica alrededor de 3,0 s.

La estrategia recomendada es una transición espacial con un fotograma puente donde ambos dioramas existen simultáneamente. Para validarla con el menor riesgo y coste, el siguiente piloto debe dividir el recorrido en dos clips de 5 s: almacén → vista amplia compartida y vista amplia real obtenida del primer clip → showroom. A la tarifa observada de MiniMax H3 (2 créditos/s), la validación cuesta 20 créditos sin repeticiones. No se ha ejecutado ninguna generación de pago durante este análisis.

## Material inspeccionado

- Vídeo original: `media/generated-clips/pilot-01-to-02-minimax-h3-2k-original.mp4`
- Informe previo: `media/reports/pilot-01-to-02.md`
- Seis imágenes originales en `D:/Proyectos-scrolling/inoxnow/inoxnow-photos/`
- Copias de trabajo de escenas 01 y 02 en `media/source-images/`
- Documentación local de Scroll World:
  - `.agents/skills/scroll-world/SKILL.md`
  - `.agents/skills/scroll-world/references/prompts.md`
  - `.agents/skills/scroll-world/references/pipeline.md`

El vídeo inspeccionado es MP4 H.264, 2560 × 1440, 5 s y 8.662.192 bytes. Las seis fuentes son WebP y no fueron alteradas. El piloto tampoco fue modificado ni sobrescrito.

## Qué exige realmente Scroll World

La arquitectura documentada para escenas independientes (Architecture B) no conecta directamente las imágenes originales. Primero genera una aproximación o *dive* para cada escena y después crea cada conector con los fotogramas realmente renderizados en los límites:

- inicio del conector: último fotograma real del *dive* de la escena actual;
- final del conector: primer fotograma real del *dive* de la escena siguiente;
- para N escenas: N aproximaciones y N−1 conectores.

La coincidencia debe ser de píxel en las uniones. Un fundido breve sólo oculta pequeñas diferencias; no corrige un salto de contenido. El movimiento reversible no requiere vídeos invertidos: el motor vincula el tiempo del vídeo al progreso del scroll y, al subir, recorre el mismo material hacia atrás.

El piloto analizado no siguió esa estrategia: utilizó las dos imágenes originales —dos arquitecturas distintas— como extremos de un único conector de 5 s. La documentación mejora las costuras entre clips, pero por sí sola no garantiza que el interior de un conector entre topologías incompatibles quede libre de morphing.

## Cronología del fallo

Los tiempos son aproximados y proceden de inspección visual de fotogramas a 0,50; 1,00; 1,50; 2,00; 3,00; 3,50; 4,00 y 4,50 s, además de los fotogramas de inicio, medio y final ya existentes.

| Intervalo | Observación |
|---|---|
| 0,00–1,00 s | El almacén se mantiene reconocible. Hay un alejamiento/zoom suave y la orientación todavía se aproxima a la referencia. |
| 1,30–1,50 s | Comienza la deriva: cambian lentamente proporciones de fachada y cubierta; varios objetos empiezan a deslizarse. |
| 1,50–2,00 s | Se estrecha el pórtico frontal, cambian estanterías y distribución, y se desplazan borde de isla y vegetación. |
| 2,00–2,50 s | La vista se vuelve más frontal y la estructura se aplana. El mobiliario deja de conservar posiciones físicas coherentes. |
| ~3,00 s | Fallo principal: fachada, techo, estanterías y productos se reconstruyen como otra envolvente. No existe un espacio recorrido por la cámara. |
| 3,50–4,50 s | El showroom ya domina la imagen y la geometría transitoria se estabiliza progresivamente. |
| 4,96–5,00 s | El encuadre converge con buena fidelidad hacia la imagen final. |

### Elementos que desaparecen o se reconstruyen

- El volumen frontal alto y la fachada rotulada del almacén pierden sus proporciones y terminan sustituidos por la pared abierta del showroom.
- Las estanterías industriales y sus productos cambian de forma y posición; parte del contenido desaparece.
- Mesas, fregaderos y otros equipos se reorganizan sin una trayectoria espacial continua.
- El perímetro rocoso, la vegetación y la sombra de la isla cambian de geometría.
- La escala relativa de personajes, mobiliario y edificio no permanece constante durante la zona central.

### Cámara, perspectiva y espacio negativo

Hay zoom y cierta rotación, pero no un desplazamiento lateral que abandone una maqueta y alcance otra. El sujeto permanece centrado mientras su contenido cambia: predomina la interpolación semántica, no una trayectoria de cámara física. La perspectiva isométrica empieza a desviarse aproximadamente entre 1,5 y 2,0 s y resulta claramente más frontal en la zona central.

El fondo crema y el espacio negativo de la izquierda son los elementos más estables. Aun así, el contorno y la sombra de la isla se desplazan. La fidelidad de los fotogramas extremos es alta; la continuidad temporal entre ellos es baja. La reproducción lenta o inversa hace la reconstrucción todavía más evidente.

Fotogramas de análisis: `media/keyframes/pilot-analysis-0-50s.png` hasta `media/keyframes/pilot-analysis-4-50s.png`.

## Comparación de alternativas

| Criterio | A. Dos aproximaciones + conector IA | B. Imágenes intermedias | C. Transición espacial 2D/2.5D |
|---|---|---|---|
| Continuidad arquitectónica | Media: costuras correctas, pero el conector aún puede transformar una arquitectura en otra | Media-alta si cada paso conserva geometría común | Alta: cada maqueta se mantiene como una capa rígida |
| Calidad visual esperada | Alta si el conector funciona; variable en la parte central | Alta con intermedios bien diseñados | Media-alta local; alta si se combina con clips de aproximación |
| Compatibilidad con Scroll World | Nativa, es Architecture B | Compatible como cadena más larga, con más clips | Requiere un segmento CSS/Canvas o render local; no es el conector de vídeo estándar |
| Reversibilidad | Buena, pero revela el morph al ir hacia atrás | Buena si cada tramo es coherente | Excelente y determinista |
| Créditos adicionales para validar 01→02 | 42 observados/estimados: 8 s + 8 s + 5 s a 2 cr/s | 20–40 o más según número de tramos; imágenes IA aparte si se usan | 0 para el prototipo local; 20 para probar dos tramos H3 con puente compartido |
| Complejidad | Media | Media-alta por dirección artística y control de varios hitos | Media en web; mayor si se exige exportar todo como vídeo |
| Riesgo de morphing | Medio-alto dentro del conector | Medio; baja al aumentar geometría compartida | Nulo en composición local; bajo-medio en una variante animada por IA |
| Rendimiento web | Bueno con vídeo optimizado | Peor si multiplica clips | Muy bueno con dos WebP y transforms; requiere cuidar capas y memoria móvil |
| Reutilización de las seis imágenes | Buena como referencias, no como conectores directos | Buena | Muy alta: las imágenes se usan como planos rígidos |

### Alternativa A — evaluación

Es la metodología documentada y resuelve correctamente las costuras entre archivos. Los fotogramas finales reales eliminan el salto provocado por asumir que el modelo reproduce exactamente una imagen de entrada o salida. Sin embargo, no resuelve la causa principal del piloto: si los extremos del conector siguen representando edificios mutuamente incompatibles, H3 todavía puede reconstruir uno como el otro. Gastar 42 créditos antes de demostrar un espacio compartido sería prematuro.

### Alternativa B — evaluación

Uno o varios hitos espaciales pueden convertir un problema topológico grande en movimientos menores. Un buen orden sería: almacén cercano → vista exterior/alejada → ambas islas visibles → aproximación al showroom. Su eficacia depende de que los hitos compartan objetos persistentes y una cámara calculable. Generar intermedios independientes también puede introducir incoherencias; por eso conviene derivar primero un puente local de las fuentes existentes.

### Alternativa C — evaluación

Es viable localmente y ataca la causa raíz. Las dos maquetas existen a la vez en un mundo ancho; la cámara se aleja, se traslada y se acerca. No hay pixels que tengan que convertirse de almacén en showroom. Para una versión definitiva 2.5D se podrían separar suelo, edificio, vegetación y primer plano, pero las fuentes aplanadas actuales sólo permiten parallax global, no profundidad real interna.

La principal limitación visual del puente derivado es la unión de fondos: las dos imágenes originales tienen tonos crema ligeramente distintos y bordes rectangulares suavizados. Esto es aceptable para validar trayectoria, pero necesitaría una máscara/etalonaje local más preciso o un master compartido para acabado premium.

## Prototipo local gratuito

Se creó `media/prototypes/continuity-spatial-2_5d.html` sin dependencias y sin tocar la landing. Utiliza exclusivamente las escenas 01 y 02 existentes.

Características:

- scroll y control deslizante vinculados a una cámara 2.5D;
- alejamiento del almacén, desplazamiento lateral y aproximación al showroom;
- ambos dioramas coexisten durante el tránsito;
- reproducción reversible sin cambio de arquitectura;
- soporte básico de `prefers-reduced-motion`;
- estados reproducibles con `?p=0`, `?p=0.5` y `?p=1`;
- modo limpio `?p=0.5&clean=1` para obtener un puente sin interfaz.

QA visual: `media/prototypes/qa-start.png`, `qa-mid.png` y `qa-end.png`.

Fotograma puente local limpio: `media/keyframes/spatial-bridge-01-02-local.png` (2560 × 1440). Es una composición derivada, no una imagen generada por IA.

El prototipo demuestra la trayectoria y la invariancia arquitectónica, no una solución final. No contiene animación interna de personajes/equipos ni parallax por capas, y la costura cromática entre fondos sigue visible bajo inspección.

## Recomendación

Usar una estrategia híbrida C+B para el próximo piloto:

1. Mantener ambas maquetas como lugares distintos dentro de un mismo espacio visual.
2. Usar el puente local como destino del primer clip.
3. Extraer el último fotograma realmente producido por ese primer clip.
4. Usar ese fotograma real como inicio del segundo clip, siguiendo la regla de continuidad de Scroll World.
5. Acercarse al showroom, dejando que el almacén salga por el lado izquierdo en vez de transformarlo.

Esta estrategia es mejor que el primer intento porque cada clip conserva un elemento arquitectónico persistente: en el primero el almacén debe seguir existiendo al revelarse el showroom; en el segundo el showroom ya existe desde el inicio y sólo aumenta de escala mientras el almacén abandona el encuadre.

## Procedimiento reproducible para el siguiente piloto H3

### Entradas

- `media/source-images/scene-01-warehouse.webp`
- `media/keyframes/spatial-bridge-01-02-local.png`
- Después del clip A: su último fotograma real, extraído sin recomprimir si la herramienta lo permite
- `media/source-images/scene-02-showroom.webp`

### Clip A — revelar el mundo compartido

- Modelo: MiniMax H3, únicamente si Higgsfield mantiene los mismos parámetros y precio verificados previamente.
- Inicio: escena 01.
- Final: puente local.
- Duración: 5 s.
- Resolución/formato: 2K, 2560 × 1440, 16:9.
- Audio: la integración inspeccionada anteriormente no ofrecía un parámetro para desactivarlo; silenciar/remover localmente en la fase web.

Prompt propuesto:

> One continuous stabilized architectural-visualization camera move in a premium stylized isometric diorama world. Preserve the warehouse as one rigid, unchanged miniature model. Slowly dolly backward and slightly upward to reveal a second, separate showroom island on the right. The warehouse must become smaller only because of camera distance; its façade, roof, shelves, stainless-steel equipment, people, vegetation, logo and island silhouette must not transform, disappear or rearrange. Maintain the fixed high isometric orientation, cream background, warm soft light, pastel palette and realistic soft shadows. End on the supplied wide two-island composition. No cut, dissolve, crossfade, morphing, object substitution, geometry reconstruction, orbit, tilt, roll, camera shake, abrupt acceleration, duplicated objects, text distortion or lighting change.

### Clip B — abandonar almacén y entrar en showroom

- Inicio: último fotograma real del clip A, no el puente original.
- Final: escena 02.
- Duración: 5 s.
- Resolución/formato: 2K, 2560 × 1440, 16:9.

Prompt propuesto:

> Continue the same single stabilized isometric camera move from the supplied wide two-island frame. Glide laterally to the right and gently dolly toward the existing showroom island. The warehouse must move naturally out of frame on the left; it must never transform into the showroom. Keep the showroom as the same rigid miniature model already visible in the starting frame, changing only its apparent scale and position through camera travel. Preserve architecture, furniture, stainless-steel equipment, people, vegetation, cream background, warm soft lighting, pastel palette and fixed high isometric orientation. Arrive on the supplied showroom framing. No cut, dissolve, crossfade, morphing, object substitution, geometry reconstruction, orbit, tilt, roll, camera shake, abrupt zoom, duplicated objects, text distortion or lighting change.

La integración de H3 usada en el piloto anterior no exponía un campo de *negative prompt* separado; por tanto, las restricciones negativas deben continuar dentro del prompt principal. Antes de pagar, hay que volver a verificar que el esquema de Higgsfield no haya cambiado.

### Presupuesto

Con la tarifa observada en el piloto —10 créditos por 5 s a 2K, equivalente a 2 créditos/s—:

| Alcance | Cálculo | Créditos |
|---|---:|---:|
| Clip A | 5 s × 2 cr/s | 10 |
| Clip B | 5 s × 2 cr/s | 10 |
| Validación completa, sin repeticiones | 10 + 10 | **20** |
| Una repetición de un solo tramo | +10 | **30 acumulados** |
| Una repetición de ambos tramos | +20 | **40 acumulados** |
| Variante A documentada, como referencia | (8 + 8 + 5) s × 2 cr/s | **42** |

El coste de 20 créditos es una estimación basada en la tarifa realmente observada, no una cotización nueva. Debe confirmarse en la interfaz/integración inmediatamente antes de generar. No se ha comprobado saldo ni precio mediante una llamada externa en esta fase local.

## Criterios de aceptación del siguiente piloto

- El almacén del clip A conserva fachada, cubierta, estanterías, isla y logotipo hasta quedar pequeño por distancia.
- El showroom aparece como una segunda isla desde fuera del encuadre o por revelado de cámara, no creciendo desde partes del almacén.
- El último fotograma real del clip A y el primero del B son idénticos.
- En el clip B, el showroom visible al inicio conserva su geometría durante la aproximación.
- Orientación isométrica estable, sin giro frontal apreciable.
- Ningún mueble desaparece, se duplica o cambia de categoría en el área focal.
- No hay corte, fundido ni pulso de iluminación que esconda la transición.
- La secuencia sigue siendo convincente a 0,25× y al reproducirse hacia atrás.
- Los extremos mantienen compatibilidad visual con las fuentes.

Rechazar si aparece cualquiera de estos síntomas: reconstrucción de fachadas; intercambio semántico de mobiliario; isla que cambia de contorno; segundo diorama que nace deformando el primero; giro de cámara que rompe la isometría; costura intermedia no idéntica; texto/logotipo inestable; salto visible al invertir el movimiento.

## Riesgos pendientes

- H3 puede seguir interpretando el puente como una orden de añadir o eliminar contenido, aunque la trayectoria propuesta reduce esa ambigüedad.
- El puente local tiene una costura cromática y no equivale a una escena 3D verdaderamente compartida.
- Los rótulos INOXNOW presentes en las imágenes pueden deformarse durante movimiento generado.
- Las fuentes son imágenes aplanadas; no permiten oclusión y parallax profundos sin segmentación manual o nuevos recursos.
- Una transición CSS/Canvas pura requeriría adaptar el motor de Scroll World, que actualmente espera segmentos de vídeo para esta arquitectura.
- Un conector local determinista entre fotogramas reales evita morphing y cuesta cero créditos, pero puede sentirse menos vivo que los *dives* si no se sincronizan velocidad y easing.
- Las escenas 04–06 tienen geometrías más incompatibles; deben auditarse antes de repetir este patrón.
- La presencia de audio en el MP4 original exige eliminar o ignorar la pista en la preparación web.

## Decisión solicitada

Recomiendo validar primero los dos tramos de 5 s con puente espacial y un presupuesto autorizado de **20 créditos**, permitiendo como máximo una repetición selectiva de 10 créditos sólo tras revisión humana. No recomiendo gastar todavía los 42 créditos de la solución de dos aproximaciones y conector: corrige las costuras, pero no demuestra que H3 pueda atravesar dos arquitecturas incompatibles sin morphing.

No se debe iniciar ninguna generación hasta recibir autorización explícita y reconfirmar el precio mostrado por Higgsfield.
