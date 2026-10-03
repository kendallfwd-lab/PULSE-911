# PULSE 911: seguridad, movilidad e IA

Esta ampliación conserva los portales Citizen y Command, la autenticación, `PulseContext`, el simulador de unidades y `GeoMap`. Las funciones externas son opcionales: el modo predeterminado sigue usando `db.json` y `localStorage`.

El asistente incluye ahora un motor local determinista. Si n8n no está configurado o deja de responder, PULSE IA sigue clasificando consultas, filtrando datos locales, calculando distancias y priorizando emergencias sin inventar información. El paquete importable de n8n y su documentación se encuentran en `n8n/`.

## Arquitectura

- `src/i18n/`: i18next con detección automática, persistencia y recursos completos para español e inglés. Francés, portugués y alemán tienen la estructura preparada y usan español como respaldo.
- `src/accessibility/`: preferencias avanzadas y síntesis de voz nativa mediante `window.speechSynthesis`.
- `src/ai/AIContext.jsx`: estado y cliente del asistente, separado de las operaciones de `PulseContext`.
- `src/services/`: cliente n8n, caché con TTL, traducción, rutas, clima, tráfico y gateway de datos.
- `src/utils/geo.js`: Haversine, filtrado por radio y orden por distancia.
- `src/utils/roadSafety.js`: cálculo local estructurado de exposición. El LLM no calcula puntuaciones.
- `src/components/ai`, `traffic`, `travel`: componentes reutilizables, sin renderizar HTML procedente de servicios.

## Nuevas rutas

Citizen:

- `/app/roads`: estado de carreteras y filtros.
- `/app/nearby`: puntos por radio, con permiso explícito de ubicación.
- `/app/assistant`: PULSE IA y panel contextual.
- `/app/travel`: rutas, exposición conocida, clima y categorías de lugares.
- `/app/wellbeing`: pasos post-accidente y respiración guiada.

Command:

- `/command/ai`: resumen de automatizaciones y análisis.
- `/command/ai-review`: aprobación, edición y rechazo humano.
- `/command/traffic`: monitoreo vial y sugerencias en mapa.

## Variables de entorno

```env
VITE_PULSE_AI_ENABLED=false
VITE_PULSE_DATA_MODE=local
VITE_N8N_BASE_URL=
```

`VITE_PULSE_DATA_MODE=n8n` activa sincronización cada 30 segundos. El polling se pausa cuando la pestaña está oculta. Ninguna clave secreta debe exponerse en variables `VITE_*`; React solo llama a n8n.

## Endpoints n8n

Las rutas están centralizadas en `src/services/n8nClient.js`:

- `POST /webhook/pulse/chat`
- `POST /webhook/pulse/translate`
- `POST /webhook/pulse/route`
- `POST /webhook/pulse/places`
- `POST /webhook/pulse/weather`
- `POST /webhook/pulse/admin/analyze-report`
- `POST /webhook/pulse/admin/analyze-risk`
- `POST /webhook/pulse/sync`
- `GET /webhook/pulse/status`

## Contrato de chat

Solicitud:

```json
{
  "message": "¿Qué pasa cerca de mí?",
  "sessionId": "usr-demo",
  "locale": "es",
  "mode": "citizen",
  "location": { "lat": 9.9, "lng": -84.1, "accuracy": 20, "timestamp": 0 },
  "context": {
    "nearbyIncidentIds": [],
    "nearbyRiskZoneIds": [],
    "activeAlertIds": []
  }
}
```

Respuesta:

```json
{
  "ok": true,
  "intent": "nearby_safety",
  "answer": "Texto verificado por el flujo configurado.",
  "spokenAnswer": "Texto opcional para lectura.",
  "sources": [],
  "cards": [],
  "mapActions": [],
  "suggestedQuestions": []
}
```

La interfaz limita longitudes, valida la forma mínima y solo renderiza tipos conocidos (`incident`, `risk_zone`, `alert`, `route`, `place`, `hospital`, `weather`, `road`, `support`). No se usa `dangerouslySetInnerHTML`.

## Fallbacks y proveedores

- IA o n8n desconectado: se muestra estado controlado; mapas, reportes, datos locales, recursos y rutas siguen disponibles.
- Rutas: n8n/Google opcional → OSRM → estimación local directa.
- Clima: n8n → Open-Meteo → estado no disponible.
- Tráfico: PULSE siempre disponible; Google/TomTom quedan como proveedores opcionales vía n8n.
- Traducción: bajo demanda, cacheada; ante fallo se conserva el texto original.
- Places: Google Places vía n8n cuando está configurado; OpenStreetMap/Nominatim como fallback público con búsqueda acotada, caché y referencias PULSE si la red falla.

## Privacidad y seguridad

- GPS solo se solicita tras una acción explícita y puede detenerse.
- Al asistente se envían ubicación puntual e identificadores mínimos, nunca toda la base, contraseñas o ficha médica.
- Las sugerencias IA son violetas, se etiquetan como pendientes y requieren revisión humana.
- “Ruta con menor exposición a riesgos reportados” describe una puntuación estructurada; no garantiza seguridad.
- PULSE IA no diagnostica ni reemplaza atención médica, psicológica o de emergencia. Para peligro inmediato en Costa Rica se indica 9-1-1.

## Idiomas y accesibilidad

El selector de idioma comparte el grupo compacto de controles. Las preferencias se guardan en `localStorage`. El menú accesible incluye lectura de página, detención, reducción de movimiento, foco reforzado y modo lectura. El mapa mantiene marcadores de tipo `button` operables por teclado y ofrece una lista textual alternativa.

Los estados combinan texto, iconos y bordes; el color no es el único indicador. Los tamaños de texto, modos de visión y tema oscuro existentes se conservaron.
