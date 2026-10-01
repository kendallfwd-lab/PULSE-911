# PULSE 911 — Command Center · Versión Final

Aplicación web académica de respuesta a emergencias construida con React + Vite. Funciona como una simulación local: no se conecta con servicios 911 reales ni requiere backend.

## Qué incluye

- Portal ciudadano con feed, reporte guiado, SOS, mapa situacional, incidentes, alertas, recursos, comunidad, notificaciones y perfil.
- PULSE Command con centro de mando, gestión de incidentes, despacho geográfico, unidades, hospitales, zonas de riesgo, alertas públicas, publicaciones, analítica, auditoría y escenarios.
- `db.json` como fuente de datos inicial. Los cambios operativos de la demo persisten en `localStorage`; las cuentas ciudadanas y sus fichas personales se guardan en `db.json` mediante una API local de Vite.
- Las contraseñas de cuentas nuevas se almacenan con hash scrypt y sal aleatoria, nunca en texto plano.
- Mapa interactivo con OpenStreetMap cuando hay Internet y fondo de respaldo local cuando no hay tiles disponibles.
- Movimiento simulado de unidades, rutas, ETA, traslado hospitalario, retorno a base y control de velocidad de simulación.
- Diseño final optimizado para escritorio/laptop con sidebar colapsable y mapa ampliable a pantalla completa.

## Cuentas de demostración

**Ciudadano**
- Correo: `citizen@pulse.demo`
- Contraseña: `Pulse911!`

**Command / Administrador**
- Correo: `admin@pulse.demo`
- Contraseña: `Pulse911!`

También existe el rol interno `dispatcher`, compatible con PULSE Command.

## Ejecutar en Windows

La opción más simple es abrir PowerShell dentro de la carpeta y ejecutar:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\INICIAR_PULSE_FINAL.ps1
```

O manualmente:

```powershell
npm install
npm run dev
```

Vite abrirá la aplicación en `http://127.0.0.1:5175`.

El registro y el guardado de fichas requieren el servidor de desarrollo (`npm run dev` o el script de inicio). `npm run preview` sirve una compilación estática y no incluye la API de escritura.

## Verificar antes de presentar

```powershell
npm install
npm run build
```

También puedes ejecutar:

```powershell
.\scripts\VERIFICAR_PULSE_FINAL.ps1
```

## Notas

- Node.js requerido: `>=20.19.0`.
- Los datos son ficticios y académicos.
- Si no hay acceso a Internet, los tiles de OpenStreetMap pueden no cargar; la app conserva un fondo cartográfico local para que el flujo siga siendo visible.
- Para volver al estado inicial desde la interfaz: Perfil → Restablecer datos demo → confirmar.
