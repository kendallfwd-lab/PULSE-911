# PULSE 911 — Command Center V4

Proyecto académico de simulación. **No está conectado a servicios 911 reales.**

## Qué cambia en V4

- Mapa geográfico real e interactivo basado en teselas de OpenStreetMap, sin API key.
- Zoom, desplazamiento, capas y marcadores interactivos.
- PULSE Command con cola operacional, ficha seleccionada y recursos recomendados.
- Despacho funcional de ambulancias, bomberos, patrullas, rescate y grúas.
- Movimiento simulado de unidades sobre rutas con progreso, ETA y llegada automática.
- Velocidad de simulación 1x / 2x / 4x / 8x y pausa/reanudación.
- Incidentes ampliados con información operacional, evidencia, ubicación y timeline.
- Zonas de riesgo creadas con clic sobre el mapa, radio, severidad y movimiento por arrastre.
- Alertas geográficas creadas y editadas sobre el mapa con radio de cobertura.
- Mapa ciudadano actualizado para mostrar incidentes públicos, unidades, alertas y zonas.
- El formulario ciudadano permite seleccionar la ubicación directamente sobre el mapa.
- Persistencia local mediante `localStorage` y datos semilla JSON.

## Ejecución

```powershell
npm install
npm audit
npm run build
npm run dev -- --port 5175
```

Si el puerto está ocupado, usa 5176 o 5177.

## Cuentas demo

Ciudadano:
- `citizen@pulse.demo`
- `Pulse911!`

Command:
- `admin@pulse.demo`
- `Pulse911!`

## Demostración recomendada

1. Entrar como ciudadano.
2. Crear un accidente vehicular y elegir el punto en el mapa.
3. Adjuntar una fotografía opcional.
4. Entrar a Command.
5. Abrir el incidente y revisar la ficha completa.
6. Despachar una unidad recomendada.
7. Volver al Centro de mando y observar el vehículo desplazándose por la ruta.
8. Cambiar la velocidad de simulación.
9. Crear o mover una zona de riesgo en el mapa.
10. Crear una alerta geográfica y ajustar su radio.
11. Volver a Citizen y comprobar la sincronización de estado y mapa.

## Cartografía

El mapa usa teselas de OpenStreetMap y muestra atribución visible. Para una entrega posterior puede sustituirse el proveedor cartográfico por Google Maps, Mapbox o MapLibre sin cambiar el modelo de datos principal.


## V4.1 — ajuste desktop responsive
Esta entrega incluye un pase de densidad y visibilidad para escritorio. La aplicación autenticada utiliza todo el ancho disponible y tiene presets CSS específicos para laptops 1366×768 y 1440×900, además de 1600×900 y 1920×1080. Se recomienda usar el navegador al 100% de zoom. Consulta `CAMBIOS_V4_1.md` y `PRUEBA_VISUAL_V4_1.md`.

## V4.2 — Inicio / Presentación

La V4.2 corrige la escala y posición del navbar de la página pública. El navbar ahora se adhiere al borde superior al hacer scroll, el hero se adapta mejor a pantallas de laptop y las secciones públicas aprovechan más ancho con menos altura innecesaria. Consultar `CAMBIOS_V4_2.md` y `PRUEBA_VISUAL_V4_2.md`.
