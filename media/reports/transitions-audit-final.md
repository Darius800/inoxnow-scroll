# INOXNOW — Auditoría final de transiciones 2.5D

## Resultado

Las cinco transiciones son **candidatas para revisión final**. Mantienen los dos dioramas como objetos independientes, son deterministas y completamente reversibles porque cada estado se calcula sólo desde un progreso normalizado 0–1.

## Comprobaciones

| Tramo | Posición y escala | Costuras y color | Resultado |
|---|---|---|---|
| 01 → 02 | Almacén sale hacia la izquierda; showroom entra desde la derecha. Ambos coexisten. | Extremos exactos; sin panel rectangular interno. | Candidato |
| 02 → 03 | Showroom reduce escala y expedición entra lateralmente. | Diferencia crema corregida por interpolación del color de borde. | Candidato |
| 03 → 04 | Exterior logístico y cocina vacía se mantienen separados. | El cambio arquitectónico se explica espacialmente, no por morphing. | Candidato |
| 04 → 05 | La cocina vacía no se transforma en la instalación: aparece una segunda isla. | La divergencia de arquitectura queda visible pero físicamente comprensible. | Candidato con advertencia narrativa |
| 05 → 06 | Instalación sale y cocina operativa entra como diorama distinto. | Sin reconstrucción ni fundido; diferencia de geometría conservada. | Candidato con advertencia narrativa |

## Correcciones locales aplicadas

Se conservó el compositor original. La variante `media/bridges/spatial-transition-2_5d-audited.js`:

- interpola el color de fondo medido en los fotogramas de salida y entrada;
- conserva fotogramas exactos en progreso 0 y 1;
- mantiene la extracción por fondo conectado al borde;
- evita morphing: sólo aplica traslación, escala y sombra;
- se integra con una guarda de generación en el prototipo para impedir que una transición lenta y antigua pinte encima tras un scroll rápido.

La hoja `media/keyframes/contact-sheets/transitions-global.png` compara 0 %, 25 %, 50 %, 75 % y 100 % de los cinco tramos. No se observaron fondos crema rectangulares internos. Puede persistir un halo suave de recorte en pantallas de alto contraste; debe revisarse de nuevo sobre el fondo final de la landing.

Previsualización manual: `media/bridges/transition-preview-audited.html`.
