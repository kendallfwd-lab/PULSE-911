# Guion de prueba — PULSE 911 V4

## 1. Arranque

```powershell
npm install
npm audit
npm run build
npm run dev
```

Vite está configurado para `http://127.0.0.1:5175`.

## 2. Ciudadano

Ingresar con:

- `citizen@pulse.demo`
- `Pulse911!`

Crear un reporte de accidente vehicular:

1. Seleccionar `Accidente vehicular`.
2. Llenar detalles.
3. Hacer clic sobre el mapa para elegir la ubicación.
4. Adjuntar una foto si se desea.
5. Marcar publicación comunitaria opcional.
6. Enviar.

## 3. Command

Ingresar en otra pestaña con:

- `admin@pulse.demo`
- `Pulse911!`

En `Centro de mando` debe aparecer el caso nuevo en la cola y en el mapa.

## 4. Despacho

1. Seleccionar el incidente.
2. Revisar unidades recomendadas.
3. Pulsar `Despachar`.
4. Observar la ruta y el marcador del vehículo en movimiento.
5. Cambiar velocidad a `8x` para acelerar la demostración.
6. Confirmar que al llegar el estado cambia a `on_scene`.

## 5. Zona de riesgo

1. Abrir `Zonas de riesgo`.
2. Pulsar `Registrar zona en mapa`.
3. Hacer clic sobre una calle o intersección.
4. Completar nombre, tipo, severidad, radio y descripción.
5. Guardar.
6. Seleccionar la zona y activar `Mover punto`.
7. Arrastrar el marcador a otra ubicación.

## 6. Alerta geográfica

1. Abrir `Alertas públicas`.
2. Pulsar `Nueva alerta en mapa`.
3. Seleccionar ubicación.
4. Ajustar radio.
5. Publicar.
6. Seleccionar la alerta, moverla y guardar cambios.
7. Regresar a Citizen y verificar que aparece en Alertas / Mapa.

## Nota

PULSE 911 V4 es un proyecto académico de simulación. No realiza llamadas, mensajes ni despachos a servicios de emergencia reales.
