# PULSE n8n — contrato HTTP

Base URL de ejemplo: `https://n8n.example.com/webhook`. Todas las respuestas son JSON. Los errores públicos usan `{ "ok": false, "error": { "code": "...", "message": "..." } }` sin stack traces.

## Endpoints

| Método | Ruta | Uso |
|---|---|---|
| GET | `/pulse/status` | Estado y capacidades |
| POST | `/pulse/chat` | Asistente ciudadano |
| POST | `/pulse/nearby` | Filtro geográfico Haversine |
| POST | `/pulse/route` | Rutas normalizadas y exposición |
| POST | `/pulse/places` | Lugares verificados normalizados |
| POST | `/pulse/weather` | Clima Open-Meteo normalizado |
| POST | `/pulse/translate` | Traducción y preservación del original |
| POST | `/pulse/support` | Orientación post-accidente |
| POST | `/pulse/admin/analyze-report` | Clasificación y prioridad sugerida |
| POST | `/pulse/admin/analyze-risk` | Detección de clusters pendientes |
| POST | `/pulse/admin/approve-suggestion` | Decisión humana y payload de conversión |
| POST | `/pulse/sync` | Bootstrap, pull y push idempotente |

## Chat

Solicitud máxima: 1000 caracteres útiles y 1200 recibidos.

```json
{
  "message": "¿Qué pasa cerca de mí?",
  "sessionId": "session-demo",
  "locale": "es",
  "mode": "citizen",
  "location": { "lat": 9.976, "lng": -84.748, "accuracy": 20 },
  "context": {
    "nearbyIncidentIds": ["inc-482"],
    "nearbyRiskZoneIds": ["risk-1"],
    "activeAlertIds": ["alert-1"],
    "nearbyIncidents": [],
    "nearbyRiskZones": [],
    "activeAlerts": []
  }
}
```

Respuesta:

```json
{
  "ok": true,
  "intent": "nearby_safety",
  "answer": "...",
  "spokenAnswer": "...",
  "dataFreshness": "2026-10-02T12:00:00.000Z",
  "engine": "n8n-deterministic",
  "sources": [],
  "cards": [],
  "mapActions": [],
  "suggestedQuestions": []
}
```

Tipos de `cards`: `incident`, `risk_zone`, `alert`, `route`, `place`, `hospital`, `weather`, `road`, `support`. Acciones de mapa permitidas: `focus`, `highlight`, `draw_route`, `show_incidents`, `show_risk_zones`, `show_place`.

## Nearby

La solicitud acepta `lat`, `lng`, `radiusKm` y arrays estructurados `incidents`, `riskZones`, `alerts`, `externalEvents`. El workflow calcula las distancias; nunca acepta kilómetros generados por un LLM.

## Route

```json
{
  "origin": { "lat": 9.976, "lng": -84.748 },
  "destination": { "lat": 9.933, "lng": -84.08 },
  "locale": "es",
  "incidents": [],
  "riskZones": [],
  "alerts": []
}
```

`riskScore` es determinista: P1 +35, P2 +20, P3 +10, zona alta +20, zona media +10 y alerta +20 cuando está a 1 km o menos de una muestra de la ruta. Niveles: 0–19 `low`, 20–49 `moderate`, 50+ `high`. Es exposición a reportes, no una garantía de seguridad.

## Admin analyzer

La salida incluye `classification`, `prioritySuggestion`, `rulePriority`, `finalPriority`, `trafficImpact`, `duplicateCandidates`, `summary`, `recommendedAction`, `confidence`, `warnings` y `requireHumanApproval`.

## Data Sync

Acciones admitidas:

- `bootstrap`: `{ "action": "bootstrap", "data": { "incidents": [] } }`
- `pull`: `{ "action": "pull", "since": "...", "collections": ["incidents", "alerts"] }`
- `push`: `{ "action": "push", "collection": "aiSuggestions", "record": { "id": "..." } }`
- `push_report`: `{ "action": "push_report", "report": { "id": "..." } }`
- `push_confirmation`: `{ "action": "push_confirmation", "confirmation": { "id": "..." } }`

Colecciones permitidas: `incidents`, `riskZones`, `alerts`, `publications`, `historicalIncidents`, `aiSuggestions`, `roadStatus`, `confirmations`, `externalEvents`, `audit`.
