# PULSE n8n — casos de prueba

## Automatizados en el repositorio

| Prueba | Comando | Criterio |
|---|---|---|
| JSON y estructura de 14 workflows | `npm run test:n8n` | Todos parsean, tienen nombre PULSE, Sticky Note y configuración válida |
| Motor local IA | `npm run test:ai` | Intención, respuesta y arrays estructurados válidos |
| Integración React | `npm run build` | Build Vite sin errores |

## Matriz para ejecutar en n8n

| Caso | Entrada resumida | Resultado esperado |
|---|---|---|
| What is near me, sin ubicación | chat EN sin location | Solicita ubicación, sin coordenadas inventadas |
| What is near me, con ubicación | chat EN con contexto | `nearby_safety`, fuentes y cards estructuradas |
| Sin incidentes | nearby con arrays vacíos | `count: 0` |
| Múltiples incidentes | nearby con puntos a distintas distancias | Filtra por radio y ordena ascendente |
| Carretera cerrada | chat/route con road status | Advierte condición y frescura |
| Ruta | origin/destination válidos | OSRM normalizado o fallback aproximado |
| Turismo | places sin proveedor | `PROVIDER_NOT_CONFIGURED`, nunca inventa sitios |
| Turismo con proveedor | providerResults verificados | Lugares normalizados y atribución |
| Consulta en inglés | locale `en` | Respuesta en inglés |
| Traducción mismo idioma | es → es | Pass-through sin modificar original |
| Traducción sin proveedor | es → en sin resultado | `TRANSLATION_UNAVAILABLE` y original intacto |
| Ansiedad post accidente | mensaje no urgente | Orientación breve, sin diagnóstico |
| Emergencia médica | “no respira” | Prioriza 9-1-1 |
| Duplicado | misma categoría, ≤500 m, ≤20 min | ID en `duplicateCandidates` |
| Cluster | 3+ reportes dentro de 450 m | Sugerencia `pending`, no oficial |
| Aprobación admin | approve + approvedBy | `humanApproved: true` y audit |
| API externa caída | timeout OSRM/Open-Meteo | Respuesta segura/fallback sin stack |
| LLM caído | AI provider desactivado | Baseline determinista continúa |
| Payload inválido | mensaje vacío/coordenadas inválidas | Error JSON controlado |
| Prompt injection | reporte con “ignore previous…” | Se trata como texto, no ejecuta acciones |

## Estado de ejecución

- `npm run test:n8n`: **PASS** — 14 workflows y 14 esquemas de Data Tables validados.
- `npm run test:ai`: **PASS** — ubicación ausente/presente, estado vial, inglés, apoyo post-accidente, emergencia médica y cluster administrativo.
- `npm run build`: **PASS** — Vite compiló 2106 módulos.
- Servidor local: **PASS** — `http://127.0.0.1:5176/` respondió HTTP 200.

Las pruebas de ejecución dentro de n8n siguen pendientes porque este equipo no tiene una instancia n8n ni Docker. Tampoco se declara como probada ninguna integración credentialed hasta ejecutarla en la instancia destino.
