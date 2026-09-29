# Prueba visual PULSE 911 V4.1

## Objetivo
Comprobar que la interfaz cabe correctamente en una computadora sin reducir el zoom del navegador.

## Preparación
1. Zoom del navegador: 100%.
2. Abrir DevTools solo si necesitas probar resoluciones.
3. Iniciar el proyecto con `npm run dev`.

## Resoluciones a validar
- 1366 × 768
- 1440 × 900
- 1600 × 900
- 1920 × 1080

## Citizen
### Cursos y apoyo
- Sidebar izquierda visible completa.
- Dos cursos por fila en desktop.
- Imagen del curso encima del texto, sin columnas de texto estrechas.
- Right rail visible en desktop.
- Ninguna tarjeta debe salir del viewport horizontal.

### Alertas y zonas de riesgo
- Mapa y lista de alertas uno al lado del otro.
- Right rail no debe empujar el contenido fuera de pantalla.
- Header permanece arriba sin dejar un hueco de 26 px al hacer scroll.

### Feed
- Imagen principal no supera aproximadamente 230 px de altura en laptop.
- Botones inferiores caben en una sola fila siempre que exista espacio suficiente.

## Command
### Centro de mando
- Sidebar compacta.
- Cola de incidentes + mapa + ficha operativa visibles en la misma fila en 1366 px o más.
- El mapa debe ocupar la mayor parte del espacio disponible.
- La ficha derecha debe poder desplazarse internamente sin mover el mapa.

### Despacho
- Mapa y unidades recomendadas visibles lado a lado.
- No debe existir scroll horizontal de la página.
- En 768 px de alto el mapa debe caber prácticamente completo en la ventana.

### Zonas de riesgo / Alertas geográficas
- Mapa y formulario visibles lado a lado en desktop.
- El formulario puede desplazarse internamente si su contenido supera la altura disponible.

## Resultado esperado
La interfaz debe ser utilizable con zoom 100%, sin que el usuario tenga que alejar la página para entenderla o acceder a sus controles principales.
