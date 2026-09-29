# PULSE 911 — Prompt maestro actualizado: Civic Pulse V2

Construye y mantén PULSE 911 como una aplicación web React + Vite de demostración, sin backend real. Conserva todos los flujos funcionales existentes y aplica de forma consistente el sistema visual Civic Pulse inspirado en los diseños Stitch entregados con el proyecto.

## Regla principal
No convertir la aplicación en una maqueta estática. Toda mejora visual debe integrarse con los datos y acciones existentes: registro, inicio de sesión, onboarding, ficha de emergencia, reporte guiado, SOS, mapa, historial, seguimiento, alertas, recursos, PULSE Command, validación, despacho, actualización de estado y analítica.

## Persistencia
- `src/data/db.json` y `db.json` son datos semilla.
- `localStorage` simula persistencia.
- `BroadcastChannel` sincroniza cambios entre pestañas del mismo navegador.
- No usar Supabase, Firebase, Express, JSON Server ni servicios de emergencia reales.

## Identidad Civic Pulse
- Light mode limpio, institucional y cívico.
- Plus Jakarta Sans como tipografía principal.
- Fondo `#F8FAFC`, tarjetas blancas y bordes `#E2E8F0`.
- Coral de emergencia `#FF2E4D`, azul informativo `#0EA5E9`, verde seguro `#10B981`, ámbar preventivo `#F59E0B`.
- El rojo solo debe aparecer en SOS, P1, alertas críticas y estados que requieran atención.
- Tarjetas con borde de bajo contraste, radios entre 8 y 16 px y sombras ambientales discretas.

## PULSE Citizen
Implementar un cockpit responsivo de tres columnas en escritorio:
1. Navegación lateral: Feed en vivo, Mapa situacional, Canales oficiales, Red comunitaria, Mis incidentes, Ajustes y protocolos, más CTA SOS.
2. Feed central: alertas perimetrales, compositor de reporte, incidentes, seguimiento personal y recursos de recuperación.
3. Rail derecho: mapa situacional miniatura, ficha médica/contactos, unidades demo cercanas, protocolos rápidos y apoyo/recuperación.

En móvil, colapsar a una sola columna y usar navegación inferior.

## Mapa situacional
Usar localmente:
- `/assets/stitch/situational-hybrid.webp`
- `/assets/stitch/satellite-city.webp`

Superponer con React:
- incidentes;
- unidades;
- zonas de riesgo;
- selección de incidentes;
- controles de capas;
- cambio entre vista híbrida y satelital.

No presentar esas imágenes como cartografía en tiempo real ni como información de una institución real.

## PULSE Command
Aplicar el mismo lenguaje Civic Pulse en una interfaz operacional light mode:
- sidebar fija;
- estado de vigilancia;
- métricas;
- mapa operativo;
- cola de incidentes;
- recursos disponibles;
- despacho;
- alertas públicas;
- analítica;
- detalle del ciudadano solo cuando el consentimiento lo permite.

## Reglas funcionales
- Un reporte creado en Citizen debe aparecer en Command.
- Un despacho en Command debe reflejar unidad y ETA en Citizen.
- Los cambios de estado deben agregarse a la línea de tiempo.
- Las alertas creadas en Command deben aparecer en Citizen.
- La búsqueda superior de Citizen debe llevar al historial filtrado.
- Los botones visibles deben navegar, cambiar estado o ejecutar una acción real dentro de la demo.

## Seguridad y honestidad de producto
Mostrar siempre que se trata de una simulación. No contactar 911, policía, bomberos, ambulancias, hospitales ni otras instituciones reales. No solicitar datos reales para la demostración.
