# PULSE 911 — paquete n8n

Este directorio contiene una implementación importable y modular para conectar el frontend React de PULSE 911 con n8n. El frontend sigue funcionando sin n8n mediante un motor local determinista; cuando n8n está disponible, React usa los webhooks y conserva el fallback local si fallan.

## Estado de esta entrega

- 14 workflows JSON importables en `n8n/workflows/`.
- 14 esquemas de Data Tables en `n8n/data-tables.schema.json`.
- Contratos HTTP, variables, credenciales, prompts y casos de prueba documentados.
- Ninguna clave secreta está incluida.
- El equipo de desarrollo no tiene n8n ni Docker instalados. Por eso los JSON se validan estructuralmente, pero la creación física de Data Tables, credenciales, activación y pruebas de ejecución dentro de una instancia n8n deben hacerse en la instancia de destino.

## Orden de importación

1. `14-pulse-error-handler.json`
2. `12-pulse-data-sync.json`
3. `03-pulse-nearby-safety-tool.json`
4. `04-pulse-route-intelligence-tool.json`
5. `05-pulse-places-tourism-tool.json`
6. `06-pulse-weather-tool.json`
7. `07-pulse-translation-tool.json`
8. `08-pulse-post-accident-support.json`
9. `09-pulse-admin-report-analyzer.json`
10. `10-pulse-risk-zone-detector.json`
11. `11-pulse-ai-review-queue.json`
12. `13-pulse-scheduled-traffic-monitor.json`
13. `02-pulse-citizen-ai-orchestrator.json`
14. `01-pulse-api-health.json`

Después de importar:

1. Cree las Data Tables descritas en `data-tables.schema.json`.
2. Reemplace el almacenamiento estático de demostración del workflow Data Sync por nodos Data Table en la instancia que los soporte.
3. Configure las credenciales opcionales descritas en `PULSE_N8N_ENVIRONMENT.md`.
4. Asigne `PULSE — Error Handler` como error workflow de los demás.
5. Proteja los endpoints `/pulse/admin/*` antes de activarlos fuera de demostración.
6. Defina el origen permitido de CORS en n8n o en el proxy inverso.
7. Active primero las herramientas, luego los endpoints públicos y finalmente los workflows programados.

## Arquitectura activa

El baseline no delega distancias, prioridad, clustering ni puntuaciones al modelo. Esas operaciones están en nodos Code deterministas. La generación con LLM queda opcional y solo debe explicar resultados ya calculados. Las sugerencias administrativas siempre salen con `requireHumanApproval: true` y `reviewStatus: pending`.

`PULSE — Data Sync` usa workflow static data únicamente para que el paquete pueda importarse sin IDs de Data Tables preexistentes. Esto es válido para una demostración de una sola instancia, pero no para alta disponibilidad ni persistencia de producción.

## Conexión del frontend

Copie `.env.example` a `.env.local` y configure:

```env
VITE_PULSE_AI_ENABLED=true
VITE_PULSE_DATA_MODE=n8n
VITE_N8N_BASE_URL=https://SU-N8N
```

Reinicie Vite. `src/services/n8nClient.js` centraliza las rutas y aplica timeouts. Nunca agregue claves de Google, TomTom o del proveedor IA a variables `VITE_*`.

## Límites conocidos

- No hay autenticación real en el frontend de demostración; los endpoints administrativos no deben publicarse hasta añadir JWT/Header Auth en n8n.
- Places y traducción requieren insertar/configurar el nodo del proveedor con credenciales de n8n. Sin proveedor responden de forma segura y el frontend conserva datos originales.
- El monitor de tráfico queda listo para recibir un proveedor, pero no consulta TomTom/Google sin credenciales.
- El workflow Data Sync debe migrarse de static data a Data Tables o una base persistente antes de producción.
- No se activan despachos reales, notificaciones oficiales ni servicios de emergencia.

## Verificación local

```bash
npm run test:n8n
npm run test:ai
npm run build
```

La guía de casos completos está en `PULSE_N8N_TEST_CASES.md`.
