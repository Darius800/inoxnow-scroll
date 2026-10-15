# INOXNOW — Plan de producción audiovisual Scroll World

Fecha: 2026-10-14 (Europe/Madrid)

## Decisión de arquitectura

La opción base recomendada es una cadena híbrida:

1. MiniMax H3 anima la actividad interna de cada uno de los seis dioramas.
2. Los cambios de lugar se realizan mediante conectores espaciales 2.5D deterministas construidos con los fotogramas reales de salida y entrada.
3. El scroll controla tanto el tiempo de los vídeos como la cámara 2.5D; el movimiento es reversible sin generar vídeos inversos.
4. Sólo se usa H3 para un conector cuando el prototipo local del mismo tramo no alcanza la calidad exigida.

Esta arquitectura conserva el mundo vivo dentro de cada escena y evita pedir a un modelo generativo que convierta una arquitectura en otra. También reduce el coste base previsto de 160 a 60 créditos.

## Inventario

### Fuentes

Las seis imágenes son WebP 16:9 de 1200 × 675, con fondo crema, espacio negativo a la izquierda y el diorama situado principalmente a la derecha.

| Escena | Archivo | Contenido | Riesgo principal |
|---|---|---|---|
| 01 | `media/source-images/scene-01-warehouse.webp` | Almacén, estanterías, muelle, carretilla y operarios | Vehículo, texto y mobiliario fino |
| 02 | `media/source-images/scene-02-showroom.webp` | Exposición comercial, recepción, mesas y clientes | Cruces de personas y deformación de muebles |
| 03 | `media/source-images/scene-03-expedition.webp` | Camión, muelle, carretilla, pallets y operarios | Dos vehículos simultáneos y ruedas |
| 04 | `media/source-images/scene-04-empty-kitchen.webp` | Cocina vacía, dos profesionales y pallets | Introducción accidental de mobiliario |
| 05 | `media/source-images/scene-05-installation.webp` | Cocina parcialmente instalada, operarios y cajas | Morphing de objetos y geometría distinta de 04/06 |
| 06 | `media/source-images/scene-06-operational-kitchen.webp` | Cocina completa con personal | Manos, vapor y deformación de equipamiento |

Los originales de `D:/Proyectos-scrolling/inoxnow/inoxnow-photos/` coinciden por hash con las copias de trabajo y no se modificaron.

### Vídeos existentes

- `pilot-01-to-02-minimax-h3-2k-original.mp4`: piloto directo rechazado por morphing semántico.
- `pilot-spatial-clip-a-minimax-h3-2k-original.mp4`: prueba espacial válida como demostración, pendiente de aprobación humana.

El Clip A espacial se conserva. No debe considerarse automáticamente un clip definitivo de la cadena: si antes se genera una animación interna de la escena 01, su último fotograma ya no coincidirá con el inicio del Clip A. La continuidad de producción exige decidir el orden y entregar siempre el fotograma real.

### Puentes locales nuevos

Se creó `media/prototypes/bridge-composer-clean.html`, que reproduce en Canvas el recorte de fondo conectado al borde recomendado por Scroll World. No requiere PIL ni dependencias.

- `media/keyframes/spatial-bridge-01-02-clean-local.png`
- `media/keyframes/spatial-bridge-02-03-clean-local.png`
- `media/keyframes/spatial-bridge-03-04-clean-local.png`
- `media/keyframes/spatial-bridge-04-05-clean-local.png`
- `media/keyframes/spatial-bridge-05-06-clean-local.png`

Todos son PNG 2560 × 1440 sobre un único fondo crema. Eliminan los rectángulos tonales del primer puente. Son derivados locales de las fuentes, no generaciones de IA.

## Reglas extraídas de las skills

- Scroll World exige un traspaso con fotogramas realmente renderizados; las imágenes originales no sustituyen esos límites.
- La continuidad de posición se consigue haciendo que el siguiente segmento empiece con el último fotograma real del anterior.
- Una pequeña transición cruzada sólo puede ocultar ruido de compresión, no un cambio grande de contenido.
- El motor ya resuelve avance y retroceso al vincular scroll y `currentTime`.
- Para MiniMax H3, el esquema actual debe comprobarse antes de cada gasto. En la revisión anterior aceptaba inicio/final, 16:9, duración y sólo resolución `2K`, sin campo negativo separado ni control de audio.
- El diseño de landing debe mantener una única acción principal, textos HTML independientes del vídeo, jerarquía clara y movimiento reducido accesible. La landing no se desarrolla en esta fase.

## Storyboard y gramática de cámara

| Beat | Acción interna prioritaria | Cámara | Salida espacial |
|---|---|---|---|
| 01 Almacén | Carretilla corta y controlada; dos microgestos de operarios | Push-in muy suave, ángulo alto fijo | Pull-back hacia puente 01–02 |
| 02 Showroom | Presentación gestual de una mesa; organización de estantería | Track lateral lento y pequeño acercamiento | Showroom se aleja a la izquierda; expedición aparece a la derecha |
| 03 Expedición | Primera prueba: sólo carretilla; camión estacionario; gestos mínimos | Track lateral corto, sin órbita | Pull-back hacia puente 03–04 |
| 04 Cocina vacía | Conversación y señalamiento de zona de trabajo | Push-in suave hacia los dos profesionales | Cocina vacía queda como isla de planificación |
| 05 Instalación | Supervisión de operarios; montaje conceptual pendiente de capas | Plano abierto con track lateral mínimo | Isla de instalación se separa de la cocina operativa |
| 06 Cocina operativa | Chef remueve; otro prepara; vapor muy sutil | Push-in elegante y cierre abierto para CTA | Finale con cámara asentada |

Cada clip debe terminar con aproximadamente un segundo de movimiento estable y lento. Los conectores locales deben copiar esa velocidad inicial y desacelerar antes de la siguiente escena.

## Acciones por escena y prompts definitivos

Las restricciones negativas se integran dentro del prompt porque MiniMax H3 no ofrecía un campo independiente.

### 01 — Almacén

Acción recomendada: una carretilla avanza una distancia muy corta por el carril libre; un trabajador inspecciona una caja y otro realiza dos o tres pasos. No animar simultáneamente todos los personajes.

> Single continuous shot starting from the supplied INOXNOW warehouse image. Premium stylized isometric 3D miniature warehouse diorama with restrained living-world animation. One small forklift moves forward only a very short distance along the clear loading lane; its rigid chassis, forks and load remain unchanged and its wheels rotate naturally. One nearby worker inspects a package and a second worker takes only a few calm steps. All other people make minimal natural head and hand movements. Perform a very slow stabilized camera approach while keeping the same elevated three-quarter isometric angle. Preserve the exact warehouse, roof, façade, shelving, stainless-steel equipment, island boundary, vegetation, logo, scale, warm lighting and cream background. No semantic morphing, architecture reconstruction, object transformation, extra workers, vehicle substitution, sliding wheels, warped equipment, text distortion, flicker, cut, dissolve, frontal camera angle, orbit or abrupt zoom.

### 02 — Showroom

Acción recomendada: vendedor y cliente como acción principal; un empleado ordena accesorios como secundaria. Evitar una persona caminando entre mesas en la primera versión.

> Single continuous shot starting from the supplied INOXNOW showroom image. A living premium isometric miniature commercial equipment showroom. The sales representative makes one restrained presentation gesture toward the existing stainless-steel preparation table while the customer remains beside it and responds with a small natural head movement. One existing worker carefully adjusts small items on the existing shelving. All furniture stays fixed in its original position. Use a very slow stabilized lateral camera track with a slight approach toward the central display, keeping the elevated three-quarter isometric angle unchanged. Preserve the exact showroom walls, reception desk, tables, sinks, extractor hoods, shelving, island outline, vegetation, pastel cream and lavender palette and warm soft lighting. No semantic morphing, furniture movement, extra people, people crossing tables, kitchen operation, architecture reconstruction, text distortion, flicker, cut, dissolve, camera orbit or frontal view.

### 03 — Expedición

Primera prueba controlada: la carretilla es la única acción grande. El camión permanece estacionario. Los trabajadores sólo realizan microgestos. Esta reducción permite medir ruedas, contacto con el suelo, chasis, arquitectura y movimiento de cámara sin confundir el diagnóstico.

> Single continuous cinematic shot starting exactly from the supplied INOXNOW expedition diorama. Premium stylized isometric miniature logistics world with restrained believable activity. The existing purple forklift, with its driver seated correctly, creeps forward only a very short distance along the clear marked loading lane toward the nearby pallet. Keep its forks low and aligned; preserve the rigid forklift chassis, wheel spacing and scale while the wheels rotate naturally in contact with the floor. The delivery truck remains completely parked and geometrically unchanged. Existing warehouse workers make only subtle hand and head movements while checking the shipment; no worker walks across the vehicle path. Use an extremely slow stabilized lateral camera track, preserving the same elevated three-quarter isometric angle. Keep the warehouse façade, loading bay, truck, pallets, boxes, stainless-steel equipment, vegetation, floating-island boundary, INOXNOW text, cream background and warm daylight fixed and recognizable. No semantic morphing, architecture reconstruction, vehicle transformation, truck movement, sliding vehicle, warped wheels, changing pallet, disappearing boxes, duplicate workers, extra limbs, text distortion, flicker, hard cut, dissolve, camera orbit, frontal camera angle, abrupt zoom or lighting change.

### 04 — Cocina vacía

Acción recomendada: sólo conversación y un gesto de señalamiento; no materializar planos si no están claramente presentes.

> Single continuous shot starting from the supplied empty commercial kitchen image. Two existing miniature professionals calmly discuss the future layout. One person makes a small controlled pointing gesture toward the open preparation area and the other responds with restrained hand and head movement. The room remains empty. Perform a slow stabilized camera approach toward the pair while maintaining the exact elevated three-quarter isometric angle. Preserve the walls, doors, extraction system, floor drains, utility connections, pallets, lighting, vegetation, floating-island boundary and cream background. No new furniture, no equipment appearing, no additional people, no architecture reconstruction, no wall or floor changes, no exaggerated gestures, no semantic morphing, flicker, cut, dissolve, orbit or frontal view.

### 05 — Instalación

No se recomienda generar todavía el descenso simultáneo de mesa, fregadero y estantería. Una imagen plana no permite extraer de forma fiable las superficies ocultas detrás de esos objetos. Para un montaje 2.5D premium se requieren máscaras manuales y un fondo limpio de cada hueco, o derivados aprobados.

Primera variante H3 futura, si se autoriza: mover un único objeto y dejar todos los demás inmóviles.

> Single continuous shot starting from the supplied installation diorama. Premium stylized isometric architectural assembly demonstration. Animate only one existing stainless-steel preparation table: it begins slightly above its final location and descends vertically a short controlled distance as one rigid fully formed object, settling gently without impact. All other equipment, boxes, workers and architecture remain fixed. One existing installer watches and makes a small inspection gesture after placement. Use a nearly locked elevated isometric camera with only a minimal lateral drift. Preserve exact scale, geometry, floor contact, walls, extraction equipment, island outline, vegetation, warm soft light and cream background. No additional equipment, no object transformation, no furniture morphing, no resizing, no collision with people, no falling accident, no architecture reconstruction, no flicker, cut, dissolve, orbit or frontal view.

### 06 — Cocina operativa

Acción recomendada: un chef removiendo como acción principal, preparación y fregadero como movimientos secundarios muy pequeños; vapor casi imperceptible.

> Single continuous shot starting from the supplied fully equipped professional kitchen image. Premium living isometric miniature restaurant kitchen. One existing chef gently stirs the existing pan with a small repeated motion. A second existing professional makes restrained chopping movements at the preparation surface, while the workers at the plates and sink perform only subtle natural actions. A very small amount of soft steam rises directly above one cooking vessel and dissipates quickly. All stainless-steel tables, hoods, sinks, shelving, ovens, walls and island boundaries remain perfectly fixed. Use a slow elegant stabilized approach toward the main chef, keeping the elevated three-quarter isometric angle and leaving visual space on the left for an HTML CTA. Preserve the warm soft lighting, cream background and pastel palette. No large flame, excessive steam, fast human motion, extra people, body distortion, furniture movement, semantic morphing, architecture reconstruction, flicker, cut, dissolve, orbit or frontal view.

## Plan de transiciones

### Método base sin créditos

Para cada par:

1. Usar el último fotograma real del vídeo de la escena saliente como plano inicial.
2. Usar el primer fotograma real del vídeo entrante como plano final.
3. Recortar el fondo conectado a los bordes localmente.
4. Animar ambas capas rígidas: la primera se aleja y sale a la izquierda; la segunda entra desde la derecha y se aproxima.
5. Conservar un fondo crema único y una sombra de contacto común.
6. Mantener los extremos exactos, sin fundido de contenido.

El segmento puede ejecutarse con Canvas/CSS durante el scroll. Para una exportación a vídeo o secuencia habría que añadir una fase local de render, pero no es necesaria para probar la lógica.

### Compatibilidad por tramo

| Transición | Diagnóstico | Estrategia |
|---|---|---|
| 01 → 02 | Edificios distintos, estética compatible | Dos islas separadas; puente limpio 01–02 |
| 02 → 03 | Showroom y expedición no comparten estructura | Pull-back lateral; puente limpio 02–03 |
| 03 → 04 | Mayor salto funcional y arquitectónico | Vuelo más amplio sobre fondo crema; puente 03–04 |
| 04 → 05 | No es la misma cocina | Presentarlas como estaciones independientes de planificación e instalación |
| 05 → 06 | Arquitectura y equipamiento distintos | Segunda estación espacial; no representar una transformación temporal literal |

Las escenas 04–06 forman una narración de proceso, no tres estados geométricamente idénticos de la misma sala. Si se desea una transformación literal, será necesario crear derivados que compartan exactamente paredes, huecos, cubierta, cámara y suelo; esto requiere aprobación previa.

## Viabilidad 2.5D de la escena 05

El descenso de mobiliario sí es técnicamente apropiado para 2.5D, pero no puede obtenerse con calidad premium a partir del WebP aplanado sin trabajo adicional:

- hay oclusiones entre mesas, cajas, personas y suelo;
- al retirar una mesa no existe información del pavimento que queda detrás;
- las sombras están horneadas en la imagen;
- una máscara automática por color no separa acero, paredes y suelo con precisión.

Se recomienda crear, tras aprobación, un derivado base de la cocina sin los tres muebles y tres recortes transparentes de los objetos. Con esas capas, Canvas puede controlar posición vertical, easing, sombra y orden de colocación de forma exacta, reversible y sin créditos de vídeo.

## Presupuesto

Tarifa de referencia observada: 10 créditos por clip de 5 s, 2K. Debe consultarse de nuevo antes de cada fase.

| Plan | Clips H3 nuevos | Coste sin repeticiones | Riesgo |
|---|---:|---:|---|
| Recomendado: 6 escenas vivas + 5 conectores 2.5D | 6 | **60 créditos** | Bajo en transiciones; moderado dentro de escenas |
| Scroll World directo: 6 escenas + 5 conectores H3 | 11 | **110 créditos** | Alto morphing en conectores incompatibles |
| Premium espacial: 6 escenas + 2 mitades H3 por transición | 16 | **160 créditos** | Menor morphing, mayor coste y más costuras |

Con saldo previo conocido de 260 créditos:

- Plan recomendado sin repeticiones: 200 créditos restantes.
- Plan recomendado con 25 % de repeticiones —dos clips adicionales—: 180 restantes.
- Premium espacial sin repeticiones: 100 restantes.
- Premium espacial con cuatro repeticiones: 60 restantes.

El Clip A espacial y el primer piloto ya están pagados y no se vuelven a contar. La prueba de escena 03, si se acepta, cuenta como uno de los seis clips del plan recomendado.

## Prueba autorizada propuesta — escena 03

- Modelo: MiniMax H3.
- Entrada: `media/source-images/scene-03-expedition.webp`.
- Sólo fotograma inicial; no se fuerza un final distinto.
- Duración: 5 s.
- Resolución: 2K, 2560 × 1440.
- Relación: 16:9.
- Acción grande: sólo carretilla, recorrido corto.
- Camión: inmóvil.
- Secundarias: microgestos de trabajadores.
- Cámara: track lateral extremadamente lento.
- Coste máximo autorizado: 10 créditos.
- Sin reintento automático.

Aceptar como candidato sólo si: carretilla conserva chasis, ruedas, conductor y contacto con suelo; el camión no cambia; fachada y pallets permanecen; no hay cambio frontal de cámara; el movimiento funciona hacia atrás y el comienzo respeta la fuente.

Rechazar si: las ruedas patinan o se deforman; el vehículo se convierte en pallet u otro objeto; el camión empieza a moverse; aparecen trabajadores; se reordenan cajas; el edificio cambia; el texto se reconstruye; la cámara orbita o hay corte.

## Orden posterior pendiente de autorización

1. Revisar la prueba de escena 03.
2. Si se aprueba, generar las otras escenas una a una, comenzando por 04 y 02 por su menor riesgo.
3. Extraer fotogramas reales de salida y entrada.
4. Probar un conector 2.5D real entre dos vídeos aprobados.
5. Sólo si ese conector resulta insuficiente, presupuestar una transición H3 concreta.
6. Resolver la escena 05 con capas aprobadas antes de gastar créditos en su montaje.
7. Preparar encodes web sin audio, GOP corto y `faststart` cuando FFmpeg esté disponible o autorizado.
8. Integrar después en Astro con el motor Scroll World, `prefers-reduced-motion` y textos HTML independientes.
