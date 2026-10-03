# PULSE n8n — entorno y credenciales

## Variables n8n

```env
PULSE_DEMO_MODE=true
PULSE_ALLOWED_ORIGINS=http://127.0.0.1:5176,http://localhost:5176
PULSE_PUBLIC_RATE_LIMIT_PER_MINUTE=30
PULSE_ADMIN_RATE_LIMIT_PER_MINUTE=10
AI_PROVIDER=disabled
AI_MODEL=
TRAFFIC_PROVIDER=pulse
PULSE_SESSION_TTL_MINUTES=60
PULSE_RISK_CLUSTER_RADIUS_M=450
PULSE_RISK_CLUSTER_THRESHOLD=3
PULSE_RISK_SCAN_HOURS=1
```

Estas variables viven en n8n/servidor. No deben llevar prefijo `VITE_`.

## Credenciales n8n opcionales

| Nombre recomendado | Uso | Obligatoria |
|---|---|---|
| `PULSE AI Provider` | Explicaciones conversacionales sobre datos calculados | No |
| `PULSE Google Routes` | Rutas con tráfico; OSRM es fallback | No |
| `PULSE Google Places` | Lugares y turismo verificados | No |
| `PULSE Google Translation` | Traducción de texto libre | No |
| `PULSE TomTom Traffic` | Eventos y flujo externo | No |
| `PULSE Admin JWT` | Protección de endpoints administrativos | Sí antes de producción |

No escriba valores reales en los JSON exportados, logs o documentación.

## CORS y autenticación

- Desarrollo: permita explícitamente `http://127.0.0.1:5176` y/o el puerto usado por Vite.
- Producción: configure solo el dominio publicado; no use `*`.
- Aplique rate limiting por IP/sesión en el proxy o n8n.
- Los endpoints `/pulse/admin/*` requieren JWT/Header Auth real. Mientras no exista, manténgalos en red privada y modo demo.
- Verifique la firma de cualquier webhook entrante de terceros.

## TTL recomendados

- Weather: 10–15 minutos.
- Places: 15–60 minutos.
- Routes: 5–10 minutos.
- Translation: 7–30 días por hash.
- Incidentes activos: sin caché prolongada.
- Sesiones IA: 60 minutos y sin historial detallado de ubicaciones.

## Producción pendiente

Antes de `PULSE_DEMO_MODE=false`: autenticación real, base persistente, políticas de privacidad/retención, acuerdos de fuentes oficiales, rate limiting distribuido, monitoreo, pruebas de carga, revisión legal y proceso operativo humano.
