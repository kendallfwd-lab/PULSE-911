# Automatización PULSE 911 V5

## Inicio rápido en Windows

Desde PowerShell, dentro de la carpeta raíz:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\INICIAR_PULSE_V5.ps1
```

El script instala dependencias si faltan, ejecuta el build y arranca Vite en:

`http://127.0.0.1:5175`

## Verificación

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\VERIFICAR_PULSE_V5.ps1
```

## Cuentas demo

- Citizen: `citizen@pulse.demo` / `Pulse911!`
- Command: `admin@pulse.demo` / `Pulse911!`

## Flujo principal recomendado

1. Citizen → Reportar emergencia.
2. Seleccionar accidente vehicular.
3. Completar datos y marcar ubicación.
4. Enviar reporte.
5. Command → Incidentes.
6. Abrir el incidente.
7. Revisar Risk Score y posibles duplicados.
8. Despachar AMB-014.
9. Ir a Centro de mando y observar el movimiento.
10. Cuando llegue a sitio, abrir el expediente → Recursos.
11. Seleccionar hospital e iniciar traslado.
12. Observar la segunda ruta.
13. Cerrar incidente.
14. Citizen → Mis incidentes → comprobar timeline y recursos post-emergencia.
15. Command → Alertas / Zonas de riesgo.
16. Command → Publicaciones y convertir un reporte comunitario.
17. Command → Analítica y Auditoría.
18. Command → Escenarios para cargar un caso nuevo.

Todo es simulado y local. No se envían solicitudes a instituciones reales.
