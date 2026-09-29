# PULSE 911 — Cambios de Command Center V4

## Centro de mando

- Se reemplazó el mapa basado en una imagen por un mapa geográfico interactivo con teselas de OpenStreetMap.
- El mapa admite desplazamiento, zoom, capas, selección de incidentes y visualización de rutas.
- El operador puede ver incidentes, unidades, alertas, zonas de riesgo, hospitales y eventos históricos.
- Se añadió selector de velocidad de simulación 1x / 2x / 4x / 8x y pausa/reanudación.

## Despacho

- Las unidades se recomiendan por compatibilidad, distancia geográfica y ETA.
- Al pulsar Despachar, la unidad queda vinculada al incidente y pasa a `en_route`.
- Se crea una ruta y el marcador se desplaza automáticamente por el mapa.
- Si el servicio público de rutas OSRM está disponible, la ruta intenta ajustarse a calles reales; si falla, se usa una ruta local de respaldo.
- La llegada cambia automáticamente la unidad a `on_scene` y actualiza la línea de tiempo.
- Una unidad ocupada deja de aparecer como disponible para otros incidentes.

## Incidentes

- Los casos tienen información simulada ampliada: heridos, atrapados, bloqueo vial, combustible, humo, estructura, condiciones, riesgo y referencia geográfica.
- Se añadieron más incidentes de demostración y 48 eventos históricos para análisis territorial.
- Los casos muestran evidencia, reportante, ficha médica autorizada, recursos asignados y timeline operacional.

## Zonas de riesgo

- Se eliminaron los inputs X/Y del flujo de usuario.
- El operador crea una zona haciendo clic en el mapa.
- Cada zona usa latitud/longitud, severidad, categoría, radio, descripción y número de reportes.
- Las zonas existentes se pueden seleccionar, editar, mover mediante arrastre y eliminar.
- Los eventos históricos cercanos se muestran como contexto analítico.

## Alertas geográficas

- Las alertas se crean seleccionando el punto directamente en el mapa.
- Se puede modificar radio, tipo, severidad, instrucciones y ubicación.
- Los marcadores se pueden mover y eliminar.
- Citizen consume las mismas alertas desde el estado local compartido.

## Citizen

- El mapa ciudadano usa la misma cartografía interactiva.
- El usuario puede elegir la ubicación del reporte haciendo clic en el mapa.
- El seguimiento del incidente muestra la unidad asignada sobre el mapa.
- Las publicaciones, cursos, recursos y evidencia fotográfica de V3 se conservan.

## Persistencia

Toda la operación sigue siendo una simulación sin backend. Los cambios se guardan en `localStorage` y se sincronizan entre pestañas con `BroadcastChannel`.
