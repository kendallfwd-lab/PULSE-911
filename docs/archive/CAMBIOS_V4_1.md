# PULSE 911 Command Center V4.1 — Desktop Visibility Pass

## Objetivo
Corregir los problemas de visibilidad observados en escritorio/laptop: barras pegajosas mal posicionadas, tarjetas demasiado grandes, columnas que desbordan, exceso de scroll interno y uso insuficiente del ancho disponible.

## Cambios principales
- Citizen y Command ahora usan prácticamente todo el ancho disponible del viewport; se eliminó el límite visual estrecho de 1440 px en la aplicación autenticada.
- Topbar Citizen y Command quedan pegadas correctamente a `top: 0` cuando se hace scroll; el banner de simulación permanece en el flujo normal para evitar huecos y superposición.
- Sidebar Citizen y Command son más estrechas y densas.
- Right rail Citizen se compactó para que mapa, ficha médica y respuesta cercana sean visibles en pantallas de poca altura.
- Se agregó una variante específica para laptops de 1366×768 y 1440×900.
- PULSE Command usa columnas fluidas; la cola, mapa y panel de incidente ya no requieren anchos mínimos que desborden el viewport.
- El mapa de Command y el mapa de Despacho usan alturas calculadas con `100vh` para aprovechar la pantalla sin generar páginas gigantes.
- El panel de unidades de Despacho queda visible al lado del mapa en desktop y usa scroll interno solo cuando realmente hace falta.
- Cursos cambiaron de tarjeta horizontal con imagen fija de 210 px a tarjeta vertical compacta, evitando columnas de texto extremadamente angostas.
- Recursos y guías usan imágenes y tipografías más compactas.
- Formularios de zonas de riesgo y alertas geográficas son más densos y permanecen visibles junto al mapa.
- Controles, leyendas, marcadores y botones del mapa redujeron su huella visual sin perder legibilidad.
- En pantallas intermedias (1101–1250 px) se conserva el right rail Citizen en versión compacta; solo colapsa por debajo de ese rango.
- En tablet/móvil se mantiene la transición a una sola columna.

## Resoluciones objetivo
- 1366×768
- 1440×900
- 1600×900
- 1920×1080 o superior

## Recomendación del navegador
Usar zoom del navegador en 100%. La interfaz ya no depende de reducir el zoom para caber en pantalla.
