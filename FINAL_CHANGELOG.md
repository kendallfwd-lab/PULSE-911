# PULSE 911 — Final V6

## Experiencia visual
- Rediseño del Command Center con sidebar oscuro profesional, navegación jerárquica y modo colapsado persistente.
- Workspace claro y de mayor legibilidad, tarjetas/paneles consistentes, botones con estados hover/focus/disabled y mejor jerarquía tipográfica.
- Dashboard adaptado para mantener cola, mapa y despacho visibles simultáneamente en pantallas de escritorio comunes.
- Portal ciudadano refinado con menos ruido visual, espacios consistentes y componentes interactivos más claros.

## Mapa
- Zoom aislado dentro del mapa para evitar la sensación de ampliar/mover toda la página.
- Vista ampliada a pantalla completa; `Escape` permite salir.
- Selector de capas compacto en menú desplegable.
- Controles de zoom, centrado, nivel de zoom y modo Mapa/Operativo.
- Fallback visual local cuando un tile remoto falla.

## Funcionalidad y consistencia
- Feedback integrado para despacho, zonas de riesgo, alertas, geolocalización, perfil y acciones del expediente.
- Eliminados `alert()` y `confirm()` nativos del navegador.
- Cierre de incidentes ahora libera correctamente unidades en ruta, en sitio, trasladando o en hospital.
- Compatibilidad con datos antiguos que usan `assignedUnit` y datos nuevos que usan `assignedUnits`.
- Conversión de publicaciones a incidentes conserva correctamente el autor ciudadano cuando existe.
- Validación geográfica corregida para coordenadas válidas con valor 0.
- Lectura robusta de altura de inundación como `35 cm` al calcular riesgo.
- Rol `dispatcher` deja de quedar atrapado fuera de las rutas de Command.
- Movimiento de unidades optimizado: ya no serializa toda la base ni genera auditoría cada 800 ms; persiste por intervalos y audita eventos relevantes.
- El acceso de “Información útil” del portal ciudadano ahora es interactivo en lugar de quedar como control decorativo.

## Limpieza
- `db.json` pasa a ser la única fuente seed del proyecto.
- Eliminados duplicados de datos que no eran consumidos por la aplicación.
- Documentación histórica movida a `docs/archive/` para limpiar la raíz.
- Scripts PowerShell renombrados y actualizados para la versión final.

## Últimos cambios solicitados — 28 de septiembre de 2026

### Portal ciudadano
- Eliminado completamente el bloque “Alertas perimetrales en vivo” de la portada del usuario.
- Retirados el renderizado, la consulta de alertas y todos los estilos exclusivos del carrusel para evitar código muerto.
- La página de alertas y las herramientas administrativas permanecen disponibles; solo se eliminó el bloque de la portada ciudadana.

### Corrección geográfica del mapa
- Creado `src/config/demoGeography.js` como configuración central de la geografía demo.
- Añadida una migración automática (`mapDataVersion: 2`) que desplaza hacia el sector urbano los puntos demo que antes aparecían sobre el mar.
- La migración cubre incidentes, unidades y sus bases/rutas, alertas, zonas de riesgo, hospitales, historial y publicaciones comunitarias.
- Los datos guardados previamente en `localStorage` también se normalizan al cargar la aplicación; no es necesario reiniciar manualmente la demo.
- Corregidas específicamente las posiciones visibles de unidades como `FIRE-009` y `RES-011`.
- El mapa, los nuevos reportes, las nuevas alertas, las nuevas zonas de riesgo y los escenarios simulados comparten ahora un centro geográfico terrestre consistente.
- El historial de incidentes queda oculto inicialmente para reducir saturación visual, pero continúa disponible en el menú “Capas”.

### Archivos modificados en esta sesión
- `src/pages/citizen/CitizenHome.jsx`
- `src/styles.css`
- `src/config/demoGeography.js`
- `src/components/GeoMap.jsx`
- `src/context/PulseContext.jsx`
- `src/pages/citizen/CommunityPage.jsx`
- `src/pages/citizen/ReportEmergency.jsx`

### Verificación
- `npm run build` completado correctamente con Vite.
- 1599 módulos transformados sin errores de compilación.
- Migración geográfica comprobada sobre 79 puntos de la demostración.
