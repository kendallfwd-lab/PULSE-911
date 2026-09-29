# PULSE 911 — QA Final V6

## Validaciones completadas en esta entrega

- Sintaxis JS/JSX revisada con el parser de TypeScript disponible en el entorno.
- `package.json` y `db.json` parsean correctamente.
- Integridad referencial y geográfica de datos demo revisada.
- Imports locales y referencias estáticas de assets revisados.
- Sin `alert()` / `confirm()` nativos, `debugger`, enlaces `#` vacíos ni assets públicos huérfanos conocidos.
- Pruebas directas de utilidades críticas: cálculo de riesgo, distancia geográfica y compatibilidad de unidades.
- Compatibilidad con `assignedUnit` y `assignedUnits` revisada en los flujos principales.
- Flujos de cierre, despacho, traslado, geolocalización, alertas y zonas de riesgo reforzados.

## Verificación de build

En el entorno usado para preparar esta entrega no fue posible descargar dependencias porque `registry.npmjs.org` no resolvió por DNS (`EAI_AGAIN`). Por esa razón **no se marca el build Vite como ejecutado aquí**.

Para validarlo en un equipo con acceso a npm:

```powershell
npm install
npm run build
```

O:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\VERIFICAR_PULSE_FINAL.ps1
```

Si el build termina sin errores, iniciar la demo con:

```powershell
npm run dev
```

Dirección configurada: `http://127.0.0.1:5175`.
