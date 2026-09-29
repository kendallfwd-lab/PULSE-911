# PULSE 911 Civic Pulse V5

Implementación del prompt maestro funcional sobre la base V4.2.

## Núcleo implementado

- Motor de Risk Score 0–100 y prioridad P1–P4.
- Razones explicables de priorización.
- Detección de posibles reportes duplicados.
- Fusión de reportes desde Command.
- Flujo Citizen → Incident → Command.
- Despacho de unidades con movimiento progresivo.
- Rutas simuladas y fallback local; OSRM se usa cuando está disponible.
- Ciclo de unidad: disponible → en ruta → en sitio → traslado → hospital → regreso → disponible.
- Hospitales con capacidad simulada.
- Alertas geográficas creadas desde incidentes.
- Zonas de riesgo editables sobre el mapa.
- Publicaciones comunitarias con revisión y conversión a incidente/alerta/riesgo.
- Centro de notificaciones.
- Cursos con progreso persistente.
- Recursos post-emergencia.
- Plan de emergencia personal.
- Analítica calculada desde el estado real de la demo.
- Auditoría de acciones.
- Escenarios de demostración.
- Persistencia mediante JSON inicial + localStorage + BroadcastChannel.
- Sin backend.

## Estructura nueva

- `src/context/PulseContext.jsx` — estado global y ciclo operacional.
- `src/utils/incidentEngine.js` — prioridad y duplicados.
- `src/services/` — persistencia, notificaciones, despacho y simulación.
- `src/data/modules/` — datos JSON modulares.
- `src/pages/admin/OperationsPages.jsx` — recursos, hospitales, publicaciones, auditoría y escenarios.
- `src/pages/citizen/CommunityPage.jsx` — red comunitaria y notificaciones.
- `scripts/` — automatización de inicio y verificación.

## Limitación de validación en este entorno

Se verificó sintaxis JSX/JS de los 28 archivos fuente con el compilador TypeScript del entorno: 0 errores sintácticos.

El `npm install` completo no pudo terminar porque el entorno de ejecución no pudo acceder al registro npm dentro del tiempo disponible. Por ello, el build final y `npm audit` deben ejecutarse en la PC donde se vaya a presentar el proyecto.
