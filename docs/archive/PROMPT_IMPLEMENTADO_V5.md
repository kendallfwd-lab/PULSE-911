# PROMPT MAESTRO EXPANDIDO — PULSE 911

## Edición integral: 16 productos conectados y 201 secciones de especificación

Este documento es un prompt completo para un agente de desarrollo. Está redactado en español; conserva nombres técnicos y de productos en inglés. La interfaz debe ofrecer español por defecto e inglés como segundo idioma. Incluye los requisitos originales revisados, nuevos portales, contratos técnicos, flujos de negocio y criterios de verificación.

**Instrucción de uso:** lee el documento completo y construye el producto descrito. No te limites a resumirlo, diseñar una portada o proponer un plan. Las fases son internas y deben producir software ejecutable.

**Alcance:** plataforma de simulación de emergencias. Configurar proveedores reales de infraestructura no la conecta con instituciones de emergencia ni la convierte en un servicio habilitado de atención.

**Guía de lectura:** secciones 1–31, experiencia pública y ciudadana; 32–60, operaciones, unidades y simulación; 61–93, analítica, datos y controles; 94–118, estructura y demostraciones; 119–150, ecosistema ampliado; 151–178, arquitectura y consistencia; 179–201, escenarios, verificación y entrega.

**Regla de interpretación:** las secciones ampliadas precisan el comportamiento general. La sección 152 define los modos de ejecución, la 182 define el seed ampliado y la 197 define el orden de implementación completo. Los ejemplos visuales son orientativos; los permisos, la persistencia, la honestidad de estados y la verificación son requisitos.

---

## Sistema Integrado de Coordinación, Atención y Respuesta a Emergencias

Quiero que construyas desde cero una aplicación web full-stack avanzada llamada:

# PULSE 911

### Sistema Integrado de Coordinación, Atención y Respuesta a Emergencias

PULSE 911 debe ser una plataforma tecnológica completa de simulación de emergencias inspirada conceptualmente en la operación de centros modernos de coordinación de emergencias.

NO quiero una landing page sencilla.

NO quiero un dashboard genérico.

NO quiero un CRUD disfrazado de aplicación de emergencias.

NO quiero una colección de pantallas desconectadas.

Quiero un ecosistema funcional donde ciudadanos, operadores, despachadores, supervisores y unidades de respuesta trabajen sobre los mismos incidentes en tiempo real.

El sistema debe transmitir visualmente:

- autoridad;
- seguridad;
- confianza;
- rapidez;
- institucionalidad;
- precisión;
- coordinación;
- tecnología;
- operación en tiempo real.

Debe sentirse como una plataforma profesional de un centro nacional de coordinación de emergencias.

Sin embargo, debe quedar claramente indicado que es un:

**ENTORNO DE SIMULACIÓN / DEMOSTRACIÓN — NO CONECTADO A SERVICIOS DE EMERGENCIA REALES.**

No copiar nombres, logotipos, escudos, uniformes, marcas visuales ni identidad gráfica de instituciones gubernamentales reales.

Crear una identidad completamente original para PULSE 911.

---

# 1. OBJETIVO GENERAL

Construir una plataforma donde un ciudadano pueda:

1. Crear una cuenta.
2. Crear su ficha personal de emergencia.
3. Guardar información médica importante.
4. Registrar contactos de emergencia.
5. Autorizar el uso de su ubicación durante incidentes.
6. Reportar diferentes tipos de emergencias.
7. Utilizar un botón SOS.
8. Compartir ubicación GPS.
9. Marcar manualmente un punto sobre el mapa.
10. Adjuntar fotografías, video o audio.
11. Describir lo sucedido.
12. Consultar el estado del incidente.
13. Saber cuándo el incidente fue recibido.
14. Saber cuándo fue validado.
15. Saber qué recursos fueron asignados.
16. Visualizar sobre un mapa la unidad enviada.
17. Ver cómo esa unidad se desplaza hacia la emergencia.
18. Consultar ETA estimado.
19. Recibir notificaciones.
20. Consultar su historial.
21. Cancelar un reporte enviado por error mientras sea permitido.
22. Consultar recursos físicos posteriores a un incidente.
23. Consultar recursos de bienestar psicológico.
24. Gestionar su privacidad y datos.

Simultáneamente, los trabajadores de PULSE Command deben poder:

1. recibir reportes;
2. recibir llamadas simuladas o llamadas de prueba autorizadas cuando exista integración;
3. atender la llamada desde la plataforma;
4. llenar un formulario mientras hablan;
5. crear incidentes;
6. localizar al ciudadano;
7. consultar únicamente información autorizada;
8. clasificar la emergencia;
9. establecer prioridad;
10. visualizar recursos cercanos;
11. seleccionar unidades;
12. recibir recomendaciones del sistema;
13. despachar unidades;
14. seguirlas en tiempo real;
15. solicitar recursos adicionales;
16. actualizar la situación;
17. coordinar hospitales;
18. emitir alertas públicas;
19. cerrar incidentes;
20. generar reportes;
21. analizar métricas;
22. auditar todo el proceso.

---

# 2. PRINCIPIO FUNDAMENTAL

Todos los módulos deben estar conectados.

Si el ciudadano crea un incidente, debe aparecer inmediatamente en PULSE Command.

Si un dispatcher asigna una ambulancia, debe aparecer inmediatamente en:

- el incidente;
- el mapa administrativo;
- la aplicación de la unidad;
- la aplicación del ciudadano.

Si la ambulancia cambia de ubicación, el movimiento debe actualizarse.

Si una unidad llega al lugar, el ciudadano y el administrador deben ver el nuevo estado.

Si el incidente se resuelve, Analytics debe actualizar sus métricas.

NO simular esta conexión simplemente cambiando componentes visuales independientes.

Debe existir una fuente de datos compartida.

---

# 3. ARQUITECTURA GENERAL

PULSE 911 debe estar dividido conceptualmente en cuatro grandes productos:

```text
PULSE 911
│
├── PULSE CITIZEN
│   Portal ciudadano
│
├── PULSE COMMAND
│   Centro de coordinación
│
├── PULSE RESPONSE
│   Aplicación de unidades de respuesta
│
└── PULSE INTELLIGENCE
    Analítica, simulación y apoyo a decisiones

```

Todos utilizan:

```text
PULSE CORE
│
├── Authentication
├── PostgreSQL
├── Realtime
├── Storage
├── Notifications
├── Dispatch Engine
├── Routing Engine
├── Incident Engine
├── Audit
└── Decision Support

```

---

# 4. STACK TECNOLÓGICO

Utilizar preferentemente:

## Frontend

- React.
- TypeScript.
- Vite.
- React Router.
- MUI como base de componentes.
- CSS personalizado para identidad propia.
- Framer Motion para animaciones discretas.
- Lucide React para iconografía.
- Zustand para estado global cuando sea apropiado.
- React Hook Form.
- Zod.

No depender únicamente de componentes MUI predeterminados.

Personalizar profundamente el diseño.

## Backend y datos

Utilizar:

- Supabase.
- PostgreSQL.
- Supabase Auth.
- Supabase Realtime.
- Supabase Storage.
- Row Level Security.

Cuando alguna integración necesite lógica privada del servidor, crear backend seguro utilizando:

- Node.js + Express

o

- Serverless/Edge Functions

según resulte más apropiado.

Nunca colocar secretos privados en frontend.

## Mapas

Primario:

- Mapbox GL JS.

Usar:

- geolocalización;
- markers;
- rutas;
- Directions;
- geocoding;
- polígonos;
- capas;
- heatmaps.

Crear una abstracción de proveedor para poder utilizar un fallback cuando no exista `MAPBOX_TOKEN`.

## Comunicaciones

Opcional cuando existan credenciales:

- Twilio Voice JavaScript SDK.

Debe poder recibir y realizar llamadas de prueba desde navegador cuando esté configurado correctamente, con destinatarios autorizados y salida externa deshabilitada por defecto. Nunca efectuar llamadas a números de emergencia desde la demo.

Pero PULSE debe incluir obligatoriamente un:

# CALL SIMULATOR

para que el sistema completo pueda demostrarse sin Twilio.

## Analítica

Utilizar:

- Apache ECharts

o

- Recharts.

## Testing

- Vitest.
- React Testing Library.
- Playwright.

## DevOps

Preparar:

- `.env.example`;
- Docker;
- configuración de producción;
- scripts de seed;
- README;
- GitHub Actions cuando sea razonable.

---

# 5. MODOS DE FUNCIONAMIENTO

Implementa tres modos explícitos, detallados en la sección 152:

- **demo-local:** funciona sin credenciales, utiliza datos ficticios locales y sincroniza pestañas del mismo origen.
- **demo-shared:** utiliza un backend compartido para demostrar varios usuarios, permisos y persistencia de servidor.
- **integrated-sandbox:** utiliza infraestructura y proveedores configurados, manteniendo el carácter de prueba de la plataforma.

Todos deben permitir la demostración completa de creación de reportes, llamadas simuladas, despacho, movimiento de unidades, ETA, cambios de estado, notificaciones y analítica, mediante los adaptadores disponibles.

Mostrar siempre la naturaleza de simulación de PULSE. Identificar además la fuente de mapas, rutas, telemetría y comunicaciones cuando corresponda. Una caída de un proveedor no debe cambiar silenciosamente a información ficticia.

El modo local no comparte datos con otros equipos y no es un entorno seguro para datos personales reales. El modo compartido debe demostrar autorización en servidor. Ningún modo representa conexión oficial con servicios de emergencia.

---

# 6. IDENTIDAD VISUAL

NO utilizar:

- cyberpunk;
- gaming;
- exceso de neón;
- glow excesivo;
- glassmorphism exagerado;
- colores chillones;
- dashboards genéricos estilo plantilla;
- gradientes exagerados.

PULSE debe parecer una herramienta operacional institucional.

## Paleta sugerida

```css
--institutional-950: #081A2B;
--institutional-900: #102A43;
--institutional-800: #173F5F;
--institutional-700: #1F4E79;

--surface-50: #F5F7F9;
--surface-100: #EDF1F4;
--surface-200: #DDE4EA;
--surface-700: #455A64;
--surface-900: #263238;

--emergency: #C62828;
--emergency-dark: #981B1B;

--warning: #E49B0F;
--warning-soft: #FFF4D6;

--success: #2E7D32;
--info: #1976D2;

--white: #FFFFFF;

```

Rojo significa emergencia.

No utilizar rojo como decoración general.

Verde significa operacional/disponible.

Ámbar significa advertencia.

Azul significa sistema/institución.

---

# 7. TIPOGRAFÍA

Utilizar una tipografía profesional y legible.

Preferencias:

- Inter;
- Source Sans 3;
- IBM Plex Sans.

Jerarquía clara.

El sistema debe funcionar bien en situaciones de estrés.

No utilizar fuentes decorativas para información operacional.

---

# 8. LOGOTIPO

Crear un logotipo original para PULSE 911.

Concepto:

- señal de pulso;
- protección;
- coordinación;
- ubicación;
- emergencia.

Puede integrar geométricamente:

```text
PULSE + pin + shield

```

No copiar:

- estrella médica institucional oficial;
- Cruz Roja;
- policía;
- bomberos;
- 911 gubernamental;
- escudos públicos.

Crear SVG original.

---

# 9. IMÁGENES

La aplicación debe tener imágenes de calidad.

Utilizar únicamente imágenes con licencia apropiada o recursos gratuitos permitidos.

Preferentemente:

- Unsplash;
- Pexels;
- imágenes generadas;
- SVG propios.

Necesitamos imágenes sobre:

- operadores trabajando;
- ambulancias genéricas;
- vehículos de bomberos genéricos;
- rescate;
- atención prehospitalaria;
- centros operativos;
- prevención;
- recuperación después de emergencias;
- apoyo psicológico.

NO utilizar:

- imágenes gráficas;
- sangre;
- cadáveres;
- lesiones explícitas;
- fotografías que pretendan representar instituciones reales de PULSE.

Nunca dejar enlaces de imágenes rotos.

Implementar fallback visual.

---

# 10. MICROINTERACCIONES Y ANIMACIÓN

Utilizar Framer Motion de forma moderada.

Animaciones:

- entrada suave de paneles;
- transición entre estados;
- pulsación discreta de incidentes críticos;
- movimiento de markers;
- expansión de fichas;
- skeleton loaders;
- toast;
- transición de mapas;
- counters;
- apertura de drawer;
- asignación visual de unidades.

NO convertir el sistema en una experiencia cinematográfica.

Debe mantenerse serio.

Respetar:

`prefers-reduced-motion`.

---

# 11. RESPONSIVE

Pulse Citizen:

mobile-first.

Pulse Command:

desktop-first.

Pulse Response:

tablet/mobile-first.

PULSE Command debe estar optimizado especialmente para:

- 1440x900;
- 1920x1080.

No romperse en tamaños menores.

---

# 12. ACCESIBILIDAD

Cumplir buenas prácticas WCAG.

Incluir:

- navegación por teclado;
- labels;
- aria;
- contraste;
- focus states;
- texto escalable;
- reducción de animaciones;
- lectores de pantalla;
- botones grandes;
- estados no comunicados exclusivamente mediante color.

Crear configuración:

```text
Accesibilidad

[ ] Alto contraste
[ ] Texto grande
[ ] Reducir animaciones
[ ] Alertas visuales
[ ] Alertas sonoras

```

---

# 13. INTERNACIONALIZACIÓN

Preparar arquitectura para i18n.

Inicialmente:

- español;
- inglés.

Español debe ser idioma predeterminado.

---

# 14. LANDING PAGE

Crear `/`.

Debe parecer la presentación pública de una plataforma institucional.

Header:

```text
PULSE 911

Inicio
Cómo funciona
Preparación
Recursos
Acceso ciudadano

[INICIAR SESIÓN]

```

Hero:

```text
PULSE 911

Coordinación inteligente cuando
cada segundo importa.

Plataforma integrada para reporte,
atención, despacho y seguimiento
de emergencias.

[ SOLICITAR ASISTENCIA ]

[ CONOCER EL SISTEMA ]

```

Incluir indicador:

```text
ENTORNO DE DEMOSTRACIÓN
NO CONECTADO A SERVICIOS 911 REALES

```

Agregar bloques:

- funcionamiento;
- tipos de emergencias;
- mapa visual;
- preparación;
- recursos;
- seguridad de datos;
- FAQ;
- footer institucional.

NO hacer una landing excesivamente comercial.

---

# 15. AUTENTICACIÓN

Rutas:

```text
/login
/register
/forgot-password
/reset-password

```

Roles:

```text
citizen
call_taker
dispatcher
field_coordinator
supervisor
analyst
resource_manager
system_admin
responder

```

Crear ProtectedRoute.

Crear RoleGuard.

No confiar únicamente en frontend.

Los permisos deben estar protegidos también en backend/RLS.

---

# 16. PULSE CITIZEN

Ruta principal:

```text
/app

```

Navegación:

```text
Inicio
Reportar
Mapa
Mis incidentes
Alertas
Recursos
Perfil

```

Mobile navigation inferior:

```text
Inicio
Mapa
SOS
Reportes
Perfil

```

---

# 17. HOME DEL CIUDADANO

Mostrar:

```text
Buenos días, {nombre}

Estado
SIN EMERGENCIAS ACTIVAS

```

Botón principal:

# REPORTAR EMERGENCIA

Botón secundario:

# SOS

Mostrar:

- mapa pequeño;
- alertas activas cercanas;
- contactos de emergencia;
- acceso a ficha personal;
- recursos de prevención.

---

# 18. BOTÓN SOS

Debe ser grande.

No activarlo con un click accidental.

Utilizar:

**mantener presionado 3 segundos**, con una alternativa accesible de activación y confirmación para teclado y tecnologías de asistencia, tal como se especifica en la sección 128.

Animación circular de progreso.

Después:

```text
¿QUÉ TIPO DE AYUDA NECESITAS?

```

Opciones:

- Médica.
- Accidente.
- Incendio.
- Seguridad.
- Rescate.
- Inundación.
- Otro.

Preguntar:

```text
¿Puedes hablar?

```

Opciones:

```text
SÍ
NO
NO ES SEGURO HABLAR

```

Modo sin voz:

utilizar preguntas simples con botones grandes.

---

# 19. TIPOS DE EMERGENCIA

Crear catálogo configurable.

Inicialmente:

```text
medical
traffic_accident
fire
flood
landslide
missing_person
security
violence
electrical_hazard
gas_leak
hazmat
maritime
road_hazard
tree_or_pole
animal_rescue
weather
other

```

Cada tipo debe tener:

- icono;
- código;
- nombre;
- color;
- formulario específico;
- posibles recursos;
- prioridad base.

---

# 20. FORMULARIO DINÁMICO

El formulario debe cambiar según emergencia.

Nunca mostrar 40 preguntas irrelevantes al usuario.

## Accidente vehicular

Preguntar:

- cantidad de vehículos;
- cantidad aproximada de personas;
- heridos;
- atrapados;
- humo;
- fuego;
- combustible;
- carretera bloqueada;
- transporte pesado;
- fotografía.

## Incendio

Preguntar:

- estructura;
- vivienda;
- vehículo;
- vegetación;
- industria;
- personas dentro;
- humo;
- propagación;
- gas;
- materiales peligrosos.

## Médica

Preguntar únicamente información básica orientada al reporte:

- consciente;
- respira;
- edad aproximada;
- sangrado;
- puede hablar;
- descripción.

NO diagnosticar.

## Inundación

- altura aproximada;
- viviendas afectadas;
- personas atrapadas;
- vehículos;
- carretera;
- corriente fuerte.

Y así sucesivamente.

---

# 21. UBICACIÓN

El formulario debe permitir:

### Obtener mi ubicación

Solicitar permiso de geolocalización.

Mostrar precisión.

También:

### Seleccionar en mapa.

Y:

### Escribir dirección.

Guardar:

```text
latitude
longitude
accuracy
address
location_source
timestamp

```

No rastrear continuamente usuarios fuera de un incidente autorizado. Mostrar antigüedad y precisión de la ubicación; una ubicación guardada no equivale a la posición actual.

---

# 22. MULTIMEDIA

Permitir:

- imágenes;
- videos;
- nota de voz.

Vista previa antes de enviar.

Validar:

- extensión;
- tamaño;
- cantidad;
- MIME.

Utilizar Storage.

Nunca confiar solo en validación frontend.

---

# 23. CREACIÓN DEL INCIDENTE

Después de enviar:

generar identificador:

```text
P-2026-000482

```

Mostrar pantalla:

```text
REPORTE RECIBIDO

Incidente
P-2026-000482

Estado
RECIBIDO

Estamos procesando la información.

```

Timeline:

```text
✓ Reporte recibido
○ Validación
○ Recursos asignados
○ En ruta
○ En sitio
○ Resuelto

```

---

# 24. PERFIL DEL CIUDADANO

Ruta:

```text
/app/profile

```

Secciones:

## Identificación

- nombre completo;
- documento;
- fecha nacimiento;
- sexo opcional si resulta necesario;
- teléfono;
- email;
- provincia;
- cantón;
- distrito;
- dirección;
- idioma.

## Ficha médica de emergencia

- tipo de sangre;
- alergias;
- medicamentos relevantes;
- condiciones importantes;
- discapacidad;
- movilidad reducida;
- requerimientos especiales;
- notas.

Agregar:

```text
Última actualización

```

## Contactos de emergencia

Permitir múltiples contactos.

Campos:

- nombre;
- parentesco;
- teléfono;
- email;
- prioridad.

## Preferencias

Consentimiento granular:

```text
[ ] Compartir ubicación durante incidentes.
[ ] Compartir ficha médica con personal autorizado.
[ ] Avisar automáticamente a contacto principal.
[ ] Permitir seguimiento de unidad asignada.

```

---

# 25. PRIVACIDAD MÉDICA

Esto es obligatorio.

Información médica NO puede mostrarse a todos los administradores.

Ejemplo:

Citizen:

solo sus propios datos.

Call Taker:

únicamente datos necesarios si existe incidente.

Dispatcher:

no necesita visualizar todo el historial médico.

Responder médico:

datos autorizados relevantes al incidente.

Analyst:

información anonimizada/agregada.

System Admin:

NO debe implicar acceso automático al contenido médico.

Registrar cada acceso sensible en:

```text
audit_logs

```

---

# 26. RECURSOS FÍSICOS

Crear:

```text
/app/resources/physical

```

Categorías:

- recuperación después de accidentes;
- lesiones;
- prevención;
- incendios;
- inundaciones;
- movilidad;
- preparación familiar;
- primeros pasos después de una emergencia;
- directorio de servicios;
- refugios;
- hospitales.

La información debe ser educativa.

No sustituir valoración profesional.

---

# 27. RECURSOS PSICOLÓGICOS

Crear:

```text
/app/resources/wellbeing

```

Nombre público:

# Bienestar después de una emergencia

Categorías:

- ansiedad post-incidente;
- estrés;
- duelo;
- trauma;
- ataques de pánico;
- apoyo familiar;
- niños después de emergencias;
- violencia;
- cuándo buscar ayuda profesional.

No crear un supuesto “psicólogo AI”.

La IA puede:

- buscar recursos;
- explicar navegación;
- recomendar categorías.

Nunca diagnosticar.

---

# 28. ALERTAS

Ruta:

```text
/app/alerts

```

Mostrar alertas públicas activas.

Campos:

```text
type
severity
title
description
area
issued_at
expires_at
instructions

```

Mapa del área afectada.

---

# 29. MIS INCIDENTES

Ruta:

```text
/app/incidents

```

Filtros:

- activos;
- resueltos;
- cancelados.

Cards:

```text
P-2026-000482

Accidente vehicular
P1

14:42
En ruta

Unidad asignada
AMB-014

```

---

# 30. DETALLE DE INCIDENTE CIUDADANO

Ruta:

```text
/app/incidents/:id

```

Mostrar:

- código;
- categoría;
- descripción;
- prioridad pública;
- ubicación;
- evidencias enviadas;
- timeline;
- unidades asignadas;
- ETA;
- mapa;
- mensajes/notificaciones.

No mostrar:

- ubicación de unidades no relacionadas;
- nombres privados de operadores;
- tácticas;
- información de otros ciudadanos.

---

# 31. MAPA DEL CIUDADANO

Mostrar:

- su ubicación;
- incidente activo;
- unidad asignada;
- ruta;
- ETA;
- zonas de alerta cercanas.

No mostrar toda la flota nacional.

---

# 32. PULSE COMMAND

Rutas:

```text
/command
/command/calls
/command/incidents
/command/incidents/:id
/command/dispatch
/command/map
/command/units
/command/facilities
/command/alerts
/command/major-events
/command/analytics
/command/audit
/command/personnel
/command/settings

```

No llamarlo “Admin Dashboard”.

Nombre:

# PULSE COMMAND

### Centro de Operaciones

---

# 33. INTERFAZ DE COMMAND

Desktop-first.

Layout:

```text
HEADER
│
├── Sidebar
│
├── Main workspace
│
└── Operational side panel

```

Header:

```text
PULSE 911
CENTRO DE OPERACIONES

● SISTEMA OPERATIVO

14:42:53

Operador
OP-0142

```

---

# 34. DASHBOARD OPERACIONAL

Mostrar:

- llamadas esperando;
- llamadas activas;
- incidentes activos;
- P1;
- P2;
- unidades disponibles;
- unidades ocupadas;
- tiempo medio de despacho;
- tiempo medio de respuesta;
- incidentes resueltos hoy.

Mapa central.

Panel de incidentes activos.

Panel de disponibilidad.

Panel de actividad reciente.

Todo debe actualizarse.

---

# 35. CENTRO DE LLAMADAS

Ruta:

```text
/command/calls

```

Crear interfaz tipo softphone.

Estados:

```text
incoming
ringing
active
hold
transferred
ended

```

Incoming:

```text
LLAMADA ENTRANTE

+506 XXXX XXXX

[CONTESTAR]
[RECHAZAR]

```

Activa:

```text
LLAMADA ACTIVA

00:03:21

[MUTE]
[HOLD]
[TRANSFERIR]
[FINALIZAR]

```

---

# 36. CALL SIMULATOR

Obligatorio.

Crear botón de desarrollo/demo:

```text
SIMULAR LLAMADA

```

Configuración:

```text
Caller
Scenario
Location
Severity

```

Escenarios:

- accidente;
- incendio;
- emergencia médica;
- inundación;
- persona desaparecida;
- seguridad.

Al iniciar debe comportarse como llamada entrante.

---

# 37. FORMULARIO DURANTE LLAMADA

Mientras el operador habla:

mostrar formulario lado a lado.

Secciones:

```text
INFORMANTE
UBICACIÓN
CLASIFICACIÓN
PERSONAS AFECTADAS
RIESGOS
DESCRIPCIÓN
RECURSOS

```

Debe poder crear un incidente sin terminar la llamada.

---

# 38. TRANSCRIPCIÓN

Si existe servicio configurado:

mostrar transcripción en vivo.

Si no:

simular mediante guion del escenario.

Panel:

```text
TRANSCRIPCIÓN

Ciudadano:
Hay dos carros chocados.

Ciudadano:
Una persona está atrapada.

Ciudadano:
Está saliendo humo.

```

---

# 39. APOYO A DECISIONES

NO llamarlo simplemente “Chatbot AI”.

Nombre:

# PULSE Decision Support

Funciones:

- identificar categoría probable;
- detectar riesgos mencionados;
- resumir llamada;
- identificar información faltante;
- recomendar preguntas;
- sugerir prioridad;
- sugerir recursos;
- detectar reportes posiblemente duplicados.

Ejemplo:

```text
ANÁLISIS

Clasificación probable:
Accidente vehicular

Severidad sugerida:
P1

Factores:
• persona atrapada
• humo
• múltiples afectados

Información faltante:
• ¿Existe fuego?
• ¿Cuántas personas están heridas?

Recursos sugeridos:
• ambulancia
• rescate/bomberos
• policía

```

Siempre mostrar:

**Sugerencia automatizada. Requiere validación humana.**

---

# 40. MOTOR DE PRIORIDAD

Estados:

```text
P1 CRÍTICA
P2 ALTA
P3 MODERADA
P4 BAJA

```

Crear una sugerencia de severidad versionada considerando gravedad reportada, afectados, atrapados, riesgos secundarios y categoría. Mantener separado el orden operacional de atención, que puede considerar tiempo transcurrido y disponibilidad de recursos. La escasez de recursos no reduce la gravedad del incidente. Todas estas reglas son de simulación y requieren validación humana.

La decisión final debe poder ser modificada por personal autorizado.

Guardar quién cambió prioridad.

---

# 41. INCIDENT FUSION

Detectar incidentes posiblemente duplicados por:

- proximidad;
- horario;
- categoría;
- similitud textual.

Mostrar:

```text
POSIBLE INCIDENTE DUPLICADO

P-482
P-487
P-490

Distancia máxima: 120 m
Ventana temporal: 4 min

[FUSIONAR]
[SEPARAR]

```

Nunca fusionar automáticamente incidentes críticos sin revisión.

---

# 42. DESPACHO

Ruta:

```text
/command/dispatch

```

Mostrar incidente + recursos.

Ejemplo:

```text
INCIDENTE
P-2026-000482

P1 CRÍTICA

Accidente vehicular
3 afectados

```

Lista:

```text
AMB-014
2.8 km
ETA 04:18
Disponible

AMB-008
4.3 km
ETA 07:02
Disponible

```

---

# 43. BEST RESPONSE UNIT

NO seleccionar únicamente por distancia.

Calcular:

```text
ETA
distancia
disponibilidad
tipo
capacidad
equipamiento
tripulación
incidente
tráfico/ruta
hospital
carga actual

```

Mostrar:

```text
RECOMENDACIÓN OPERACIONAL

AMB-014

ETA
04:18

Capacidad
Soporte avanzado

Estado
DISPONIBLE

Motivo
Mejor combinación entre tiempo
y capacidad requerida.

```

---

# 44. TIPOS DE RECURSOS

Crear:

```text
ambulance_basic
ambulance_advanced

fire_engine
fire_tanker
fire_rescue

police_patrol
police_motorcycle

traffic_unit

tow_truck_light
tow_truck_heavy

rescue_unit
water_rescue

hazmat_unit

utility_unit

```

Cada unidad debe tener icono propio.

---

# 45. PULSE UNITS

Ruta:

```text
/command/units

```

Cards o tabla:

```text
AMB-014

Ambulancia avanzada

Estado
DISPONIBLE

Base
Puntarenas

Tripulación
3

Combustible
82%

Última actualización
14:42:08

```

Estados:

```text
available
assigned
en_route
on_scene
transporting
returning
out_of_service
maintenance

```

---

# 46. PULSE RESPONSE

Ruta:

```text
/response

```

Interfaz para una unidad.

Debe poder iniciar sesión como responder.

Pantalla:

```text
PULSE RESPONSE

AMB-014

● DISPONIBLE

```

Cuando recibe caso:

```text
NUEVO DESPACHO

P-2026-000482

P1 CRÍTICA

Accidente vehicular
2.8 km

[ACEPTAR]
[RECHAZAR CON MOTIVO]

```

---

# 47. CICLO DE LA UNIDAD

Después de aceptar:

```text
ASIGNADA
↓
EN RUTA
↓
EN SITIO
↓
TRANSPORTANDO
↓
FINALIZADA
↓
REGRESANDO
↓
DISPONIBLE

```

Cada estado:

- timestamp;
- usuario;
- ubicación.

---

# 48. MOVIMIENTO DE VEHÍCULOS

Esto es extremadamente importante.

Cuando una unidad es despachada:

1. obtener ruta;
2. dibujar ruta;
3. animar marker;
4. actualizar ubicación;
5. actualizar ETA;
6. emitir eventos realtime.

En Demo Mode:

crear interpolación de coordenadas a lo largo de la ruta.

Velocidad simulada configurable.

El vehículo debe moverse sobre el mapa a partir de telemetría o del motor de simulación identificado. La reserva de una unidad no inicia automáticamente una misión: primero deben confirmarse la aceptación y el estado en ruta. La animación no sustituye esos eventos.

No teletransportarlo.

---

# 49. ICONOS DE VEHÍCULOS

Crear SVG personalizados para:

- ambulancia;
- bomberos;
- policía;
- moto;
- grúa;
- rescate.

Orientarlos según heading cuando sea posible.

---

# 50. MAPA OPERACIONAL

Ruta:

```text
/command/map

```

Debe ser uno de los componentes visuales principales.

Capas:

```text
Incidentes
Ambulancias
Bomberos
Policía
Motos
Grúas
Rescate
Hospitales
Estaciones
Bloqueos
Alertas
Zonas de riesgo
Heatmap

```

Filtros:

```text
P1
P2
P3
P4

```

---

# 51. MARKER DEL INCIDENTE

Click abre:

```text
P-2026-000482

P1

Accidente vehicular

14:42

3 afectados

2 unidades asignadas

[ABRIR]

```

---

# 52. HOSPITALES

Ruta:

```text
/command/facilities

```

Crear establecimientos demo.

Campos:

```text
name
location
emergency_capacity
beds_available
critical_capacity
trauma_available
status

```

Mostrar:

```text
Hospital Regional

Emergencias
OPERATIVO

Capacidad
72%

Crítico
4 / 8

Trauma
DISPONIBLE

```

---

# 53. DESTINO HOSPITALARIO

Cuando una ambulancia transporta:

calcular:

- ETA;
- capacidad;
- especialidad;
- estado.

No asumir que el hospital más cercano siempre es mejor.

---

# 54. ALERTAS PÚBLICAS

PULSE Command permite crear alerta.

Campos:

- título;
- tipo;
- severidad;
- mensaje;
- instrucciones;
- inicio;
- expiración;
- zona.

Permitir dibujar:

- círculo;
- polígono.

Los destinatarios se calculan desde ubicaciones recientes consentidas o suscripciones a zonas. La interfaz distingue publicación, envío técnico y lectura; no garantiza recepción de todos los usuarios. Consulta la sección 179.

---

# 55. PERSONAS DESAPARECIDAS

Crear módulo de incidente especial.

Campos:

- fotografía;
- nombre;
- edad;
- descripción;
- ropa;
- última ubicación;
- última hora;
- observaciones;
- necesidades médicas relevantes autorizadas.

Mapa de:

- última ubicación;
- reportes asociados;
- búsqueda.

---

# 56. EVENTOS MAYORES

Ruta:

```text
/command/major-events

```

Crear:

# MASS EMERGENCY MODE

Casos:

- terremoto;
- inundación;
- incendio extenso;
- accidente masivo;
- tormenta.

Mostrar:

```text
EVENTO MAYOR

Incidentes: 83
P1: 17
P2: 31

Ambulancias disponibles: 8
Bomberos disponibles: 5

Hospital load: 86%

```

---

# 57. SIMULATION ENGINE

Ruta:

```text
/command/simulation

```

Permitir crear escenarios.

Ejemplo:

```text
ESCENARIO

Accidente vehicular

Ubicación
Puntarenas

Severidad
P1

Víctimas
3

Recursos iniciales
Automático

```

Botón:

# INICIAR SIMULACIÓN

Generar:

- incidente;
- llamada opcional;
- ubicación;
- recomendación;
- unidades;
- movimiento;
- timeline.

---

# 58. SIMULACIÓN DE DESASTRE

Escenarios:

```text
Terremoto
Inundación
Tormenta
Incendio urbano
Incendio forestal
Accidente múltiple

```

Generar múltiples incidentes geográficamente.

---

# 59. TIMELINE

Todo incidente debe registrar:

```text
created
received
validated
priority_changed
unit_assigned
dispatch_sent
dispatch_accepted
en_route
on_scene
transporting
hospital_arrival
resolved
closed

```

Mostrar visualmente.

---

# 60. INCIDENT REPLAY

Permitir:

```text
REPRODUCIR INCIDENTE

```

El mapa reproduce:

- creación;
- despacho;
- movimientos;
- llegada;
- cierre.

Añadir timeline sincronizado.

Ideal para auditoría y entrenamiento.

---

# 61. REPORTES

Al cerrar un incidente:

```text
GENERAR INFORME

```

PDF debe incluir:

- código;
- categoría;
- ubicación;
- fecha;
- prioridad;
- timeline;
- unidades;
- tiempos;
- recursos;
- observaciones;
- responsables;
- métricas.

No incluir información médica sensible innecesaria.

---

# 62. ANALYTICS

Ruta:

```text
/command/analytics

```

Dashboard profesional.

KPIs:

```text
Incidentes hoy
Activos
P1
Resueltos
Tiempo medio de recepción
Tiempo medio de despacho
Tiempo medio de llegada
Disponibilidad de unidades

```

---

# 63. GRÁFICOS

Implementar:

- incidentes por hora;
- día;
- semana;
- categoría;
- prioridad;
- provincia/cantón demo;
- tiempo respuesta;
- recurso;
- porcentaje resuelto;
- incidentes activos vs cerrados;
- capacidad hospitalaria;
- disponibilidad flota.

---

# 64. HEATMAP

Mostrar concentración geográfica de incidentes.

Filtros:

```text
Hoy
7 días
30 días
Categoría
Prioridad

```

---

# 65. PULSE PREDICT — DEMO

Crear módulo experimental que utilice datos históricos simulados.

Mostrar:

```text
PRÓXIMAS 6 HORAS

Demanda esperada
ALTA

Categoría predominante
Accidentes

Zona de mayor riesgo
Sector demo

Ambulancias requeridas
7

```

Debe señalar:

**Estimación experimental basada en datos históricos simulados.**

No predecir individuos.

---

# 66. REPOSICIONAMIENTO DE RECURSOS

Sistema puede sugerir:

```text
Mover AMB-08

Desde:
Base Central

Hacia:
Zona Norte

Mejora estimada:
-2m 18s

```

Requiere aprobación.

---

# 67. TURNOS

Crear sistema:

```text
operator_shifts

```

Mostrar:

- inicio;
- fin;
- rol;
- estado.

Login operativo puede mostrar:

```text
OP-0142

Laura Rodríguez

Operadora de recepción

Turno
14:00 - 22:00

● EN SERVICIO

```

---

# 68. PERSONAL

Route:

```text
/command/personnel

```

Super admin gestiona:

- personal;
- roles;
- turnos;
- estaciones;
- permisos.

No almacenar contraseñas manualmente.

Auth gestiona credenciales.

---

# 69. AUDITORÍA

Tabla:

```text
audit_logs

```

Guardar:

```text
actor_id
action
entity_type
entity_id
timestamp
metadata
ip_optional

```

Ejemplos:

```text
INCIDENT_VIEWED
MEDICAL_PROFILE_ACCESSED
PRIORITY_CHANGED
UNIT_ASSIGNED
INCIDENT_CLOSED
ROLE_CHANGED

```

Crear UI para supervisores autorizados.

---

# 70. NOTIFICACIONES

Sistema interno de notifications.

Tipos:

- incidente recibido;
- prioridad actualizada;
- unidad asignada;
- unidad en ruta;
- unidad cerca;
- incidente resuelto;
- alerta pública;
- mensaje operacional.

Toast + notification center.

---

# 71. CONTACTO DE EMERGENCIA

Cuando ciudadano autorice:

después de incidente relevante:

```text
Se ha generado un incidente asociado a
{nombre}.

Código:
P-2026-000482

```

En Demo Mode simular envío.

No enviar datos médicos.

---

# 72. CHAT OPERACIONAL

Para eventos importantes:

crear canal entre:

- call taker;
- dispatcher;
- supervisor;
- coordinator.

Mensajes vinculados al incidente.

No utilizar chat global sin estructura.

---

# 73. WAR ROOM

Eventos mayores pueden abrir:

```text
/command/major-events/:id

```

Mostrar:

- mapa;
- incidentes;
- unidades;
- hospitales;
- timeline;
- alertas;
- archivos;
- chat;
- decisiones.

---

# 74. ENTRENAMIENTO

Ruta:

```text
/command/training

```

Simular llamadas.

Evaluar:

```text
ubicación obtenida
tipo identificado
prioridad
preguntas
recursos
tiempo despacho

```

Resultado:

```text
PUNTUACIÓN
92 / 100

```

Claramente indicado como simulación.

---

# 75. ANTISPAM

Detectar posibles reportes repetidos mediante:

- dispositivo;
- frecuencia;
- ubicación;
- contenido;
- hashes de archivos.

Generar:

```text
REQUIERE VALIDACIÓN

```

Nunca descartar automáticamente una emergencia únicamente por algoritmo.

---

# 76. PWA Y CONECTIVIDAD

Configurar Pulse Citizen como PWA si resulta razonable.

Mostrar estado:

```text
ONLINE
CONEXIÓN LIMITADA
OFFLINE

```

Si usuario pierde conexión durante un formulario:

preservar borrador.

No prometer envío de emergencia offline si realmente no se puede transmitir.

---

# 77. DATOS DEMO

Crear seed realista. El conjunto siguiente ilustra las entidades originales; el seed final ampliado se define en la sección 182 y debe mantener una sola fuente coherente.

Ejemplo:

```text
15 ciudadanos
8 operadores
4 dispatchers
2 supervisores
12 ambulancias
8 vehículos de bomberos
14 patrullas
5 motos
6 grúas
4 rescates
5 hospitales
8 estaciones
30 incidentes históricos
10 alertas

```

No utilizar datos reales de personas.

---

# 78. BASE DE DATOS

Crear como mínimo:

```text
profiles
medical_profiles
emergency_contacts
privacy_preferences

roles
user_roles
operator_shifts

incident_types
incidents
incident_reporters
incident_locations
incident_updates
incident_media
incident_notes
incident_timeline

calls
call_transcripts

response_units
unit_types
unit_crews
unit_locations
unit_status_history

dispatches
dispatch_recommendations

facilities
facility_capacity

public_alerts
alert_zones

notifications

recovery_resources

ai_assessments
duplicate_candidates

major_events

audit_logs

```

---

# 79. CAMPOS IMPORTANTES DE INCIDENTS

Ejemplo conceptual:

```ts
id
public_code
type_id
status
priority
priority_score
title
description
people_affected
reported_at
validated_at
resolved_at
created_by
source
latitude
longitude
address
is_major_event
major_event_id

```

Source:

```text
citizen_app
sos
web
call
operator
sensor_demo

```

---

# 80. STATUS DE INCIDENTE

Utilizar enum:

```text
received
under_review
validated
awaiting_dispatch
dispatched
units_en_route
on_scene
controlled
resolved
closed
cancelled
rejected

```

---

# 81. SEGURIDAD

Obligatorio:

- Supabase RLS.
- Validación Zod.
- Validación server-side.
- Rate limiting.
- sanitización.
- permisos.
- rutas protegidas.
- no secretos frontend.
- signed URLs para multimedia privada.
- auditoría.
- scopes por rol.

No utilizar:

```text
service_role_key

```

en frontend.

---

# 82. ROW LEVEL SECURITY

Políticas conceptuales:

Citizen:

```text
SELECT own profile
UPDATE own profile
SELECT own incidents
CREATE own report

```

Responder:

acceso solo a incidentes asignados.

Call Taker:

acceso operacional definido.

Dispatcher:

incidentes y unidades.

Analyst:

datos agregados o anonimizados.

Supervisor:

operación amplia.

Crear políticas reales, no solamente comentarios.

---

# 83. MEDICAL ACCESS

Crear función de autorización.

Ejemplo conceptual:

```text
can_access_medical_profile(user_id, incident_id)

```

Verificar:

- incidente activo;
- consentimiento;
- rol;
- asignación.

Registrar acceso.

---

# 84. DECISION SUPPORT — SEGURIDAD

Toda sugerencia automatizada debe guardar:

```text
model/version
input_summary
output
confidence
created_at
accepted_by
accepted_at

```

Nunca ejecutar despacho automáticamente desde IA.

Requiere operador.

---

# 85. FALLBACK DE IA

Si no existe API de IA:

crear motor determinístico basado en reglas.

Ejemplo:

```text
trapped_person = true
+
smoke = true
+
affected_people >= 2

```

→ recomendar P1 y rescate.

El Demo Mode debe seguir funcionando.

---

# 86. ESTADOS DE CARGA

Implementar:

- skeletons;
- empty states;
- errors;
- retries;
- offline state;
- loading map;
- loading route.

No mostrar pantallas blancas.

---

# 87. ERROR BOUNDARY

Agregar ErrorBoundary global y boundaries importantes.

Mostrar mensaje profesional.

---

# 88. EMPTY STATES

Ejemplo:

```text
No hay incidentes activos.

La central se encuentra operando normalmente.

```

No dejar tablas vacías sin explicación.

---

# 89. BÚSQUEDA GLOBAL COMMAND

Command Palette:

```text
Ctrl + K

```

Buscar:

- incidente;
- unidad;
- persona;
- hospital;
- alerta.

---

# 90. ATAJOS

Para operadores:

```text
N → nueva llamada demo
I → incidentes
M → mapa
D → despacho

```

Nunca interferir con formularios.

---

# 91. SONIDOS

Sonidos operativos discretos:

- llamada entrante;
- incidente P1;
- nuevo despacho;
- alerta.

Crear configuración:

```text
Sonidos operativos
ON/OFF

```

No utilizar alarmas molestas continuas.

---

# 92. DETALLES QUE HACEN QUE PAREZCA REAL

Incluir:

- reloj en tiempo real;
- código de operador;
- turno;
- conexión;
- última sincronización;
- versión del sistema;
- incident codes;
- unit codes;
- timestamps;
- ETA;
- coordenadas;
- precisión GPS;
- historial;
- badges operacionales;
- tooltips;
- keyboard shortcuts;
- status bar.

---

# 93. NO HACER

NO:

- usar Lorem Ipsum;
- colocar botones que no hagan nada;
- agregar links muertos;
- dejar formularios decorativos;
- usar datos aleatorios diferentes en cada pantalla sin consistencia;
- tener múltiples fuentes de verdad;
- hacer un dashboard estático;
- utilizar `alert()` del navegador para UX;
- crear tablas enormes sin responsive;
- utilizar emojis como iconografía operacional principal;
- copiar logotipos oficiales;
- fingir conexión con servicios reales;
- afirmar que se realizó una llamada 911 verdadera.

---

# 94. ESTRUCTURA DE CARPETAS

Crear estructura escalable.

Ejemplo:

```text
pulse-911/
│
├── src/
│   ├── app/
│   │   ├── router/
│   │   ├── providers/
│   │   └── guards/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── forms/
│   │   ├── maps/
│   │   ├── incidents/
│   │   ├── units/
│   │   ├── charts/
│   │   └── feedback/
│   │
│   ├── layouts/
│   │   ├── PublicLayout/
│   │   ├── CitizenLayout/
│   │   ├── CommandLayout/
│   │   └── ResponseLayout/
│   │
│   ├── pages/
│   │   ├── public/
│   │   ├── auth/
│   │   ├── citizen/
│   │   ├── command/
│   │   ├── response/
│   │   └── errors/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── profiles/
│   │   ├── incidents/
│   │   ├── calls/
│   │   ├── dispatch/
│   │   ├── units/
│   │   ├── maps/
│   │   ├── facilities/
│   │   ├── alerts/
│   │   ├── analytics/
│   │   ├── simulation/
│   │   ├── decision-support/
│   │   └── resources/
│   │
│   ├── services/
│   │   ├── supabase/
│   │   ├── map/
│   │   ├── routing/
│   │   ├── voice/
│   │   ├── notifications/
│   │   └── ai/
│   │
│   ├── hooks/
│   ├── stores/
│   ├── types/
│   ├── utils/
│   ├── constants/
│   └── styles/
│
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── functions/
│
├── server/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── sounds/
│
├── tests/
├── docs/
├── .env.example
├── docker-compose.yml
└── README.md

```

Ajusta esta arquitectura si encuentras una opción técnicamente superior, manteniendo separación clara por dominios.

---

# 95. ENV

Crear `.env.example`.

Ejemplo:

```env
VITE_APP_MODE=demo-local

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

VITE_MAPBOX_TOKEN=

TWILIO_ACCOUNT_SID=
TWILIO_API_KEY=
TWILIO_API_SECRET=
TWILIO_TWIML_APP_SID=

AI_API_KEY=

VITE_ENABLE_REALTIME=true
VITE_ENABLE_VOICE=false
VITE_ENABLE_AI=false

```

No subir secretos.

---

# 96. README

Crear README profesional.

Debe explicar:

- qué es PULSE;
- advertencia de simulación;
- stack;
- instalación;
- variables;
- Demo Mode;
- Supabase;
- Mapbox;
- Twilio;
- ejecución;
- build;
- tests;
- estructura;
- usuarios demo;
- arquitectura;
- seguridad;
- screenshots si existen.

---

# 97. USUARIOS DEMO

Crear credenciales de desarrollo documentadas.

Ejemplo:

```text
Citizen
citizen@pulse.demo

Call Taker
operator@pulse.demo

Dispatcher
dispatcher@pulse.demo

Supervisor
supervisor@pulse.demo

Responder
ambulance@pulse.demo

```

No utilizar estas credenciales en producción.

---

# 98. DEMO PRINCIPAL OBLIGATORIA

Debe ser posible ejecutar esta presentación:

### Paso 1

Entrar como ciudadano.

### Paso 2

Abrir perfil.

Mostrar:

- sangre;
- alergias;
- contactos;
- preferencias.

### Paso 3

Presionar:

**REPORTAR EMERGENCIA**

### Paso 4

Seleccionar:

**Accidente vehicular.**

### Paso 5

Obtener ubicación.

### Paso 6

Enviar.

### Paso 7

Abrir PULSE Command en otra ventana.

El incidente debe aparecer automáticamente.

### Paso 8

Abrirlo.

### Paso 9

Operador valida.

### Paso 10

Decision Support recomienda:

- ambulancia;
- bomberos;
- policía.

### Paso 11

Dispatcher abre recursos.

### Paso 12

Selecciona ambulancia.

### Paso 13

Presiona:

**ASIGNAR Y DESPACHAR.**

### Paso 14

Abrir PULSE Response.

La ambulancia recibe el despacho.

### Paso 15

Aceptar.

### Paso 16

El marker comienza a moverse por el mapa.

### Paso 17

Ciudadano ve:

```text
UNIDAD EN RUTA

AMB-014

ETA
04:18

```

### Paso 18

La unidad llega.

### Paso 19

Cambiar:

**EN SITIO.**

### Paso 20

Resolver incidente.

### Paso 21

Analytics aumenta el número de incidentes resueltos.

### Paso 22

Citizen ve:

```text
INCIDENTE RESUELTO

```

### Paso 23

Aparece:

**Recursos posteriores al incidente.**

Si esta demostración no funciona de extremo a extremo, PULSE todavía no está terminado.

---

# 99. SEGUNDA DEMO — LLAMADA

Crear:

**SIMULAR LLAMADA**

Operador contesta.

Escenario:

```text
Incendio estructural.

```

Mostrar:

- cronómetro;
- transcripción;
- ubicación;
- formulario;
- Decision Support.

Crear incidente durante la llamada.

Despachar bomberos.

Mostrar camión desplazándose.

---

# 100. TERCERA DEMO — GRÚA

Crear accidente sin heridos.

Dispatcher determina:

```text
Carretera bloqueada.

```

Asignar:

```text
Policía de tránsito
+
Grúa

```

Mostrar ambos vehículos.

Esto demuestra que PULSE no es únicamente un sistema de ambulancias.

---

# 101. CUARTA DEMO — ALERTA

Supervisor crea:

```text
ALERTA POR INUNDACIÓN

```

Dibuja un polígono.

Citizen dentro de la zona recibe:

```text
ALERTA PULSE

Riesgo de inundación en su zona.

```

---

# 102. QUINTA DEMO — EVENTO MAYOR

Ejecutar:

```text
SIMULACIÓN
TERREMOTO

```

Generar múltiples incidentes.

Mostrar actualización del Centro de Operaciones.

---

# 103. CRITERIOS DE ACEPTACIÓN

No considerar terminada una funcionalidad porque “se vea”.

Cada funcionalidad debe cumplir:

### Botón

Realiza acción.

### Formulario

Valida y guarda.

### Incidente

Persiste.

### Mapa

Utiliza datos.

### Vehículo

Tiene ubicación.

### Despacho

Crea relación real.

### Estado

Se sincroniza.

### Analytics

Deriva datos.

### Role Guard

Bloquea acceso.

### Multimedia

Se almacena.

### Notificación

Se genera desde un evento real.

### Timeline

Se alimenta automáticamente.

---

# 104. PERFORMANCE

Aplicar:

- lazy loading;
- route splitting;
- memoización solo cuando aporte;
- optimización de markers;
- clustering;
- virtualización si existen listas grandes;
- imágenes optimizadas;
- bundle splitting.

Evitar renders constantes del mapa.

---

# 105. CALIDAD DE CÓDIGO

TypeScript estricto.

No usar `any` como solución rápida.

No ignorar errores TS.

No dejar warnings importantes.

No dejar console logs innecesarios.

Crear:

- tipos;
- interfaces;
- schemas;
- enums;
- constants.

---

# 106. DOCUMENTACIÓN INTERNA

Crear en `/docs`:

```text
ARCHITECTURE.md
DATABASE.md
ROLES.md
DEMO.md
SECURITY.md

```

---

# 107. INFORMACIÓN MÉDICA

PULSE no sustituye atención médica.

No ofrecer diagnósticos.

No recomendar medicamentos.

No presentar IA como médico.

El perfil sirve únicamente para compartir datos previamente proporcionados por el usuario con personal autorizado dentro de la simulación.

---

# 108. BIENESTAR PSICOLÓGICO

No diagnosticar trastornos.

No crear terapia automatizada.

Proporcionar información educativa y recursos verificados.

---

# 109. MENSAJE DE DEMOSTRACIÓN

Debe existir de manera visible pero elegante:

```text
PULSE 911 ES UNA PLATAFORMA DE SIMULACIÓN
Y DEMOSTRACIÓN TECNOLÓGICA.

NO ESTÁ CONECTADA A SERVICIOS
REALES DE EMERGENCIA.

```

No permitir que el diseño pueda confundirse deliberadamente con un portal gubernamental verdadero.

---

# 110. DIRECCIÓN VISUAL DE PULSE CITIZEN

Citizen:

- fondos claros;
- azul institucional;
- botones grandes;
- navegación simple;
- fotografía moderada;
- alta accesibilidad;
- mucho espacio;
- instrucciones claras.

Debe transmitir:

**“Estoy seguro utilizando esta herramienta.”**

---

# 111. DIRECCIÓN VISUAL DE PULSE COMMAND

Command:

- azul muy oscuro;
- paneles densos;
- mapa amplio;
- datos compactos;
- status badges;
- tablas profesionales;
- filtros;
- timers;
- indicadores.

Debe transmitir:

**“Este es un centro de operaciones.”**

---

# 112. DIRECCIÓN VISUAL DE PULSE RESPONSE

Response:

- botones grandes;
- información crítica;
- mínimo texto innecesario;
- mapa;
- navegación;
- estado;
- ETA.

Debe funcionar desde tablet.

---

# 113. EJEMPLO DE COMMAND

La consola debe organizar información por prioridad de trabajo:

| Región | Contenido | Comportamiento |
| --- | --- | --- |
| Encabezado | Identidad, central, operador, turno, reloj y conexión | Permanece visible |
| Navegación | Llamadas, incidentes, despacho, flota e instalaciones | Se adapta al rol |
| Área principal | Mapa operativo con casos y unidades | Se sincroniza con selección |
| Panel contextual | Incidente seleccionado, riesgos y siguiente acción | Redimensionable o drawer |
| Bandeja operacional | Cola, disponibilidad y actividad reciente | Filtrable y actualizada |
| Apoyo a decisiones | Recomendaciones y datos faltantes | Revisión humana |

Usa la composición y tamaños detallados en la sección 125. Mantén el mapa como espacio principal de coordinación, sin convertirlo en un fondo decorativo. Cada panel debe corresponder a datos autorizados y acciones implementadas.

---

# 114. EXPERIENCIA COMPLETA

El usuario debe sentir:

```text
Pedí ayuda.
↓
Mi solicitud fue recibida.
↓
Alguien la está atendiendo.
↓
Una unidad fue seleccionada.
↓
Puedo verla venir.
↓
Llegó.
↓
Mi emergencia fue atendida.
↓
Tengo información posterior.

```

El operador debe sentir:

```text
Recibí información.
↓
La validé.
↓
Clasifiqué la emergencia.
↓
Seleccioné recursos.
↓
Los despaché.
↓
Estoy monitoreando la situación.
↓
La emergencia fue resuelta.

```

---

# 115. PRIORIDAD FINAL

Si tienes que elegir entre:

**más pantallas**

y

**mejor integración**

elige integración.

Si tienes que elegir entre:

**más animaciones**

y

**mejor funcionalidad**

elige funcionalidad.

Si tienes que elegir entre:

**más IA**

y

**mejor sistema operacional**

elige el sistema operacional.

Si tienes que elegir entre:

**50 funcionalidades falsas**

y

**20 funcionalidades completas**

elige las 20 completas.

---

# 116. ORDEN DE IMPLEMENTACIÓN

Estas fases describen el núcleo original. El orden completo del ecosistema se detalla en la sección 197. Construye en fases internas:

```text
PHASE 1
Foundation
Auth
Roles
Layouts
Database

PHASE 2
Citizen
Profile
Reports
SOS

PHASE 3
Command
Incidents
Calls
Operators

PHASE 4
Maps
Units
Dispatch

PHASE 5
Realtime
Response

PHASE 6
Notifications
Alerts
Hospitals

PHASE 7
Decision Support
Simulation

PHASE 8
Analytics
Reports
Replay

PHASE 9
Accessibility
Security
Testing
Optimization

PHASE 10
Final polish

```

No detener el trabajo después de cada fase esperando confirmación.

Continúa hasta construir la aplicación completa.

---

# 117. RESULTADO FINAL ESPERADO

Quiero poder abrir PULSE 911 y sentir que estoy utilizando una plataforma tecnológica profesional de coordinación de emergencias.

No quiero pensar:

> “Esto es una tarea de React.”

Quiero pensar:

> “Esto parece un sistema real.”

Debe demostrar:

- React;
- TypeScript;
- arquitectura;
- UX/UI;
- bases de datos;
- seguridad;
- autenticación;
- roles;
- mapas;
- geolocalización;
- tiempo real;
- algoritmos;
- routing;
- comunicaciones;
- archivos;
- formularios;
- analítica;
- simulación;
- IA;
- testing;
- responsive;
- accesibilidad;
- DevOps.

PULSE 911 debe ser visualmente impresionante, pero su principal fortaleza debe ser que:

# TODO ESTÉ CONECTADO Y FUNCIONE.

---

# 118. AMPLIACIÓN OBLIGATORIA DEL PRODUCTO

La base anterior se amplía con los productos y contratos siguientes. Implementa los módulos adicionales sobre los mismos incidentes, usuarios, unidades, instalaciones y eventos. Mantén una única fuente autoritativa para cada dato. Las nuevas pantallas deben aportar funciones reales a su rol y sus cambios deben reflejarse en los productos relacionados.

Lee especialmente las reglas de concurrencia, idempotencia, revocación, capacidad, conectividad y cálculo de métricas antes de programar las operaciones correspondientes. Cuando un ejemplo simplificado del núcleo omita una precondición, aplícala conforme a la sección detallada. La entrega final debe cubrir también los recorridos de Care, Shelter, Fleet, Logistics, Enterprise, Community y Academy.

---

# AMPLIACIÓN DEL ECOSISTEMA Y ESPECIFICACIÓN DE IMPLEMENTACIÓN

Las siguientes secciones forman parte obligatoria del mismo producto. Profundizan la especificación anterior y agregan aplicaciones conectadas. Los adaptadores externos funcionan cuando se configuran y sus equivalentes de simulación deben permitir demostrar el flujo completo sin servicios de pago. Una integración preparada no equivale a una integración verificada.

# 119. CONTRATO DE EJECUCIÓN Y ALCANCE

Actúa como arquitecto de software, desarrollador full-stack, diseñador de producto y responsable de verificación. Construye una aplicación ejecutable con persistencia, permisos y flujos verificables. Toma decisiones técnicas razonables dentro del alcance y documenta sus consecuencias. Inspecciona primero el repositorio, su gestor de paquetes, versiones, rutas y convenciones.

Crea una matriz `REQUIREMENTS.md` con identificadores estables: requisito, módulo, ruta, entidades, permisos, implementación y evidencia de prueba. Los estados permitidos son pendiente, en desarrollo, implementado, verificado y bloqueado por integración externa. No marques algo como verificado únicamente porque compila.

Implementa por recorridos completos: una acción ciudadana debe producir una consecuencia operacional y una respuesta visible. Mantén esa cadena funcionando mientras incorporas nuevos módulos. Si el trabajo requiere varias sesiones, guarda un checkpoint con lo terminado, las decisiones tomadas, los comandos comprobados y la siguiente tarea concreta. Nunca reduzcas silenciosamente el alcance ni describas una maqueta como sistema terminado.

# 120. ECOSISTEMA DE WEBS, APPS Y SISTEMAS

Implementa los siguientes espacios sobre PULSE CORE. Son experiencias diferenciadas dentro de una plataforma; no requieren dieciséis repositorios, proveedores de autenticación o bases de datos independientes.

| Producto | Ruta principal | Usuario | Función conectada |
| --- | --- | --- | --- |
| PULSE Public | `/` | Visitante | Presentación, prevención, información pública |
| PULSE Citizen | `/app` | Ciudadano | Perfil, SOS, reportes y seguimiento |
| PULSE Command | `/command` | Central | Recepción, clasificación y despacho |
| PULSE Response | `/response` | Tripulación | Aceptación, desplazamiento y atención simulada |
| PULSE Care | `/care` | Coordinación hospitalaria | Capacidad, solicitudes de recepción y entregas |
| PULSE Shelter | `/shelter` | Administrador de refugio | Disponibilidad, ingresos y recursos |
| PULSE Fleet | `/fleet` | Encargado de flota | Disponibilidad, mantenimiento y equipamiento |
| PULSE Logistics | `/logistics` | Logística | Inventario, pedidos y movimientos |
| PULSE Enterprise | `/enterprise` | Empresa o campus | Planes, brigadas y evacuaciones simuladas |
| PULSE Community | `/community` | Voluntariado autorizado | Disponibilidad y tareas supervisadas |
| PULSE Academy | `/academy` | Participante e instructor | Formación, escenarios y evaluación |
| PULSE Intelligence | `/intelligence` | Analista | Métricas, comparación y escenarios |
| PULSE Connect | `/connect` | Administrador de integraciones | Adaptadores, eventos y pruebas |
| PULSE Trust | `/trust` | Usuario y personal autorizado | Privacidad, accesos y solicitudes |
| PULSE Status | `/status` | Visitante | Salud técnica pública agregada |
| PULSE Wallboard | `/wallboard` | Supervisor | Vista de sala de operaciones |

El lanzador de aplicaciones muestra solo productos autorizados. Cada producto conserva encabezado, contexto de organización, identidad del usuario y búsqueda apropiada. Un cambio de aplicación no elimina el incidente que se estaba atendiendo; permite regresar mediante enlaces contextuales.

# 121. MAPA DE RUTAS DETALLADO

Además de las rutas originales, incorpora las siguientes rutas con páginas funcionales y acceso protegido cuando corresponda:

| Área | Rutas |
| --- | --- |
| Pública | `/how-it-works`, `/preparedness`, `/resources`, `/resources/:slug`, `/accessibility`, `/privacy`, `/help`, `/demo` |
| Citizen | `/app/household`, `/app/saved-places`, `/app/check-ins`, `/app/documents`, `/app/notifications`, `/app/settings` |
| Care | `/care/incoming`, `/care/transfers/:id`, `/care/capacity`, `/care/handoffs`, `/care/settings` |
| Shelter | `/shelter/capacity`, `/shelter/admissions`, `/shelter/households`, `/shelter/needs`, `/shelter/checklists` |
| Fleet | `/fleet/units`, `/fleet/units/:id`, `/fleet/maintenance`, `/fleet/inspections`, `/fleet/crews` |
| Logistics | `/logistics/inventory`, `/logistics/requests`, `/logistics/transfers`, `/logistics/warehouses` |
| Enterprise | `/enterprise/sites`, `/enterprise/sites/:id`, `/enterprise/plans`, `/enterprise/drills`, `/enterprise/muster` |
| Community | `/community/profile`, `/community/availability`, `/community/tasks`, `/community/tasks/:id` |
| Academy | `/academy/courses`, `/academy/scenarios`, `/academy/sessions/:id`, `/academy/results` |
| Intelligence | `/intelligence/operations`, `/intelligence/coverage`, `/intelligence/scenarios`, `/intelligence/reports` |
| Connect | `/connect/providers`, `/connect/webhooks`, `/connect/deliveries`, `/connect/sandbox` |
| Trust | `/trust/consents`, `/trust/access-history`, `/trust/data-requests`, `/trust/sessions` |

Las rutas antiguas equivalentes deben seguir funcionando mediante redirecciones documentadas que preserven parámetros relevantes. Implementa páginas 403 y 404 diferentes. Una ruta no autorizada nunca debe descargar primero sus datos privados para después ocultarlos.

# 122. ORGANIZACIONES, AGENCIAS Y JURISDICCIONES

Modela organizaciones ficticias, centros de coordinación, estaciones, agencias y zonas de responsabilidad. Una organización puede tener varias estaciones y cada usuario varias membresías autorizadas. El rol se asigna dentro de un contexto concreto, no como una propiedad global que permita ver todo.

Guarda `organization_id`, `agency_id` cuando aplique, `jurisdiction_id` y `created_by`. El servidor deriva y valida el contexto a partir de la sesión y las membresías; no acepta un identificador de organización arbitrario enviado por el navegador.

Una emergencia próxima a un límite territorial puede requerir apoyo de otra organización. Crea solicitudes de ayuda mutua con motivo, recursos, vigencia, aceptación y permisos limitados al incidente. La aceptación concede acceso explícito al caso compartido; no concede acceso al resto de ciudadanos, hospitales o flota. Prueba que cambiar un ID de organización en una petición no permite saltarse esta separación.

# 123. EXPERIENCIAS POR ROL Y MATRIZ DE PERMISOS

Amplía los roles con `hospital_coordinator`, `shelter_manager`, `fleet_manager`, `logistics_coordinator`, `enterprise_coordinator`, `volunteer`, `instructor`, `privacy_officer` e `integration_admin`.

| Actor | Puede modificar | Puede consultar | Restricción principal |
| --- | --- | --- | --- |
| Ciudadano | Su perfil y reportes permitidos | Sus casos y alertas públicas | Sin acceso a incidentes ajenos |
| Recepcionista | Llamada, ubicación y validación | Casos de su central | Sin administrar roles |
| Dispatcher | Asignaciones y coordinación | Capacidad operacional | Sin ficha médica completa |
| Responder | Estados de su misión | Casos asignados | Sin explorar toda la población |
| Coordinador hospitalario | Capacidad y recepción | Traslados dirigidos a su centro | Sin historial clínico global |
| Refugio | Ingresos y necesidades locales | Su instalación | Sin publicar residentes |
| Flota | Mantenimiento y disponibilidad técnica | Vehículos propios | Sin acceder a información médica |
| Empresa | Planes y simulacros propios | Casos compartidos de su sede | Sin datos de otras empresas |
| Analista | Consultas y reportes agregados | Conjuntos autorizados | Sin identificadores personales |
| Administrador técnico | Configuración y membresías permitidas | Estado técnico | Sin acceso clínico implícito |

Implementa permisos de acción como `incident.validate`, `dispatch.assign`, `facility.capacity.update` y `report.export`. Los menús reflejan permisos, pero la autoridad real se aplica en servidor y base de datos. Registra cambios de rol y revocaciones.

# 124. DISEÑO VISUAL COMO SISTEMA

Mantén el azul institucional del documento original y desarrolla tokens completos: color, espacio, tipografía, borde, elevación, radios, densidad, duración y foco. Define temas claros y oscuros semánticos. Un estado debe conservar su significado en ambos temas.

Usa una escala de espaciado de 4, 8, 12, 16, 24, 32, 48 y 64 px. Define radios de 8 px para controles, 12 px para paneles y 16 px para tarjetas públicas. Reserva sombras suaves para elevación real; los paneles densos deben separarse también mediante bordes.

Tipografía sugerida: Inter para interfaz y una variante monoespaciada legible para códigos, coordenadas y cronómetros. Usa cifras tabulares en contadores. Texto operativo base de 14–16 px, sin convertir etiquetas esenciales en microtexto. La densidad compacta es una preferencia de Command, no el diseño predeterminado de Citizen.

Entrega un catálogo interno `/design-system` disponible en desarrollo con componentes, estados, contrastes, variantes y ejemplos. Evita que cada página invente sus propios badges, diálogos o campos.

# 125. COMPOSICIÓN DE PANTALLAS CLAVE

En Command a 1440 px, usa encabezado de unos 64 px, navegación lateral de 224 px plegable, un área central flexible y un panel contextual de 360 px redimensionable. El mapa debe conservar un área útil amplia. Evita cuatro columnas cuando cada una se vuelve ilegible. En tablet, transforma paneles secundarios en pestañas o drawers.

En Citizen utiliza una columna de lectura, tarjetas claras, navegación inferior de 64–72 px y espacio adicional para la zona segura del dispositivo. El SOS nunca debe quedar debajo del teclado virtual o de una notificación. En Response prioriza incidente actual, siguiente acción, mapa y conectividad; las acciones secundarias se agrupan.

En Care usa bandeja de llegadas y tablero de capacidad. En Shelter, ocupación, admisiones y necesidades. En Fleet, disponibilidad y órdenes de mantenimiento. Cada pantalla debe responder una pregunta concreta del rol; no reutilices el mismo dashboard cambiando solamente su título.

# 126. DIRECCIÓN DE ARTE, FOTOGRAFÍA Y ACTIVOS

Construye una identidad original reconocible: símbolo geométrico de pulso y ubicación, líneas topográficas discretas, mapas sobrios y pictogramas coherentes. Entrega logo horizontal, isotipo, versión monocromática, favicon e iconos de instalación. Define márgenes de protección y tamaños mínimos.

Prepara al menos doce activos útiles: portada de sala de coordinación, vista de atención ciudadana, flota genérica, entrenamiento, recuperación, preparación familiar y seis ilustraciones de categorías. Usa imágenes solo en zonas donde mejoren la comprensión; el mapa operativo no debe competir con una fotografía de fondo.

Incluye un manifiesto con archivo, origen, autor cuando corresponda, licencia, uso y texto alternativo. No inventes autorizaciones ni atribuciones. Si no hay una fuente comprobable, crea SVG propios o imágenes generadas disponibles. Optimiza tamaños, ofrece `srcset`, evita depender de hotlinks y agrega fallback local. Ninguna imagen debe presentarse como evidencia de un incidente real.

# 127. MOVIMIENTO, SONIDO Y ESTADOS DE INTERFAZ

Define animaciones de 120–180 ms para controles y de 180–240 ms para paneles. La animación de rutas debe depender de coordenadas y tiempo, no de una transición CSS entre posiciones arbitrarias. Los skeletons conservan el tamaño del contenido para evitar saltos.

Un nuevo incidente puede destacar una vez en la bandeja y mantener después un badge. No hagas parpadear toda la pantalla. Los sonidos requieren activación del usuario y cuentan con volumen, prueba y silencio. Evita reproducir veinte sonidos al reconectar veinte eventos históricos.

Cada componente conectado debe representar carga inicial, vacío válido, permiso insuficiente, error recuperable, datos antiguos y operación pendiente. Una notificación temporal no sustituye la confirmación persistente de una acción crítica. El usuario debe poder distinguir “guardando”, “guardado”, “pendiente de envío” y “falló el envío”.

# 128. ACCESIBILIDAD Y USO BAJO ESTRÉS

Adopta WCAG 2.2 AA como objetivo de diseño y evaluación; no afirmes certificación sin una auditoría adecuada. Verifica contraste, foco, jerarquía de encabezados, navegación por teclado, zoom, nombres accesibles y mensajes de validación. Incluye alternativa textual para mapas y gráficos.

El SOS debe ofrecer una alternativa al gesto sostenido para teclado, lectores de pantalla y personas con dificultades motoras: activar un botón y confirmar mediante un diálogo accesible. El progreso de la pulsación debe cancelarse al abandonar el control. No bloquees la única vía de reporte detrás de una interacción compleja.

Los controles de campo deben ser grandes y separados. Permite texto ampliado sin truncar la acción principal. Anuncia cambios de estado con regiones accesibles moderadas; no leas cada coordenada GPS. Los errores deben explicar el campo y cómo corregirlo. No exijas distinguir rojo y verde para comprender disponibilidad.

# 129. ONBOARDING Y AUTENTICACIÓN SIN FRICCIÓN

Ofrece recorridos distintos para ciudadano, trabajador invitado y explorador de la demo. El registro ciudadano solicita inicialmente lo mínimo; completar alergias o contactos es una acción posterior. Una emergencia simulada puede reportarse mediante sesión de invitado limitada, con identificador opaco y protección contra abuso. Esta sesión no puede consultar historiales ni reclamar identidades verificadas.

El personal operativo entra mediante invitación y asignación de rol. Agrega recuperación de contraseña, expiración de sesión, cierre de sesiones y opción de MFA para roles privilegiados cuando el proveedor lo permita. Distingue correo pendiente de verificación de cuenta bloqueada.

En demo incluye selector de rol con aviso explícito de acceso de entrenamiento. Guarda la identidad demo por pestaña para que abrir Citizen, Command y Response simultáneamente no cambie el usuario de todas las ventanas. En modo integrado usa perfiles de navegador o sesiones aisladas documentadas para la demostración multiusuario; no fuerces un mecanismo inseguro para aparentar tres cuentas.

# 130. HOGAR, DEPENDIENTES Y LUGARES GUARDADOS

Permite crear un grupo familiar con invitaciones aceptadas y permisos específicos. Ser contacto de emergencia no convierte automáticamente a alguien en administrador del perfil médico. Los dependientes requieren una relación de representación registrada; todos los datos del seed son ficticios.

Cada ciudadano puede guardar casa, trabajo y otros lugares con nombre, coordenadas, referencia de acceso y necesidades de movilidad. La dirección guardada no equivale a ubicación actual: pregunta cuál corresponde al incidente. Guarda también la fecha de actualización.

Durante un reporte permite seleccionar “me ocurre a mí”, “a alguien de mi hogar” o “estoy reportando como testigo”. Ajusta la visibilidad de datos según ese contexto. Una persona que reporta como testigo no obtiene acceso al perfil del afectado. Las instrucciones de acceso a una vivienda solo son visibles para personal asignado mientras exista autorización.

# 131. FICHA DE EMERGENCIA Y QR TEMPORAL

La ficha contiene información declarada por el usuario y debe indicarlo. Incluye última actualización y campos vacíos explícitos. “No informado” y “sin alergias conocidas” deben ser estados diferentes. No inferir condiciones médicas a partir de edad, sexo, ubicación o consumo de servicios.

Permite generar un QR de acceso temporal para una demo o un incidente. El QR lleva un token opaco, nunca datos clínicos, números de identificación ni una URL pública permanente. El servidor comprueba alcance, vencimiento y revocación antes de devolver una vista mínima. Ofrece vista previa de los campos que se compartirán y un botón para revocar.

El historial de accesos muestra quién accedió según identidad institucional permitida, cuándo, motivo y caso relacionado. Implementa la lectura sensible mediante un servicio que autorice y registre el acceso; una consulta directa que evite el registro debe estar bloqueada. La ficha no funciona como expediente clínico certificado.

# 132. REPORTE GUIADO Y COMUNICACIÓN SILENCIOSA

Organiza el reporte en ubicación, situación, riesgos, adjuntos y confirmación. Permite enviar información mínima suficiente y agregar detalles después. La ficha médica completa nunca debe ser requisito para reportar. Conserva respuestas al regresar entre pasos.

En modo silencioso usa preguntas breves, respuestas grandes y confirmaciones visuales. No actives micrófono, altavoz, cámara ni reproducción de audio sin una acción explícita. Ofrece “no puedo responder ahora” y muestra al operador que la comunicación es limitada, sin inventar el motivo.

Muestra un resumen previo con ubicación, tipo, personas afectadas y archivos. Tras enviar, el identificador del incidente proviene de una confirmación del servidor. Si la solicitud queda sin respuesta, presenta “confirmando recepción” y consulta por la clave de idempotencia antes de permitir un duplicado. No afirmes “ayuda enviada” hasta que exista un despacho confirmado dentro de la simulación.

# 133. CANCELACIÓN, CORRECCIÓN Y REPORTES DUPLICADOS

Define cuándo el ciudadano puede retirar un reporte y cuándo debe solicitar una cancelación a la central. Una vez asignados recursos, cancelar no debe borrarlos silenciosamente. El operador recibe la solicitud, verifica el estado y registra una decisión.

Permite corregir dirección y descripción con historial. Un cambio de ubicación durante un desplazamiento notifica al dispatcher y requiere revisar la ruta. Conserva la ubicación original y el motivo de corrección.

Al fusionar reportes, conserva cada informante, adjunto, código y consentimiento. Crea una relación entre reportes y un incidente maestro; no combines automáticamente perfiles médicos. Cada ciudadano ve una proyección limitada del caso compartido. Implementa una separación posterior auditada cuando la fusión fue incorrecta. Diferencia duplicación de transporte causada por reintentos de dos reportes independientes sobre el mismo hecho.

# 134. MENSAJERÍA DEL INCIDENTE Y CONTACTOS

Separa conversación ciudadano-central, chat operacional y notas privadas. Modela destinatarios, visibilidad, autor y estado de entrega. Una nota interna nunca puede aparecer en la conversación ciudadana por reutilizar el mismo componente sin filtrar.

Los mensajes admiten texto, respuestas rápidas y adjuntos permitidos. Agrega indicadores de enviado, entregado cuando exista confirmación técnica y leído solo cuando haya un evento explícito. No simules esos estados con temporizadores en el modo integrado.

Los avisos a contactos requieren preferencia válida, destinatario autorizado y un contenido mínimo. La demo deposita mensajes en una bandeja de salida simulada; no envía SMS ni correos reales. Un contacto puede recibir un enlace temporal limitado si se habilita. Nunca compartas automáticamente coordenadas continuas, ficha médica completa o datos de otros afectados.

# 135. CHECK-IN DE BIENESTAR Y REUNIFICACIÓN

Después de un evento mayor, permite enviar a personas autorizadas una solicitud de check-in: “estoy bien”, “necesito asistencia” o “prefiero responder después”. La falta de respuesta se muestra como desconocida; no se interpreta automáticamente como lesión o desaparición.

Las respuestas pertenecen a un evento y tienen vigencia. Si alguien solicita asistencia, ofrece convertir esa respuesta en un reporte con su ubicación confirmada. No generes diez incidentes por diez reintentos de la misma respuesta.

Para reunificación familiar, implementa solicitudes privadas de búsqueda y contacto mediado por coordinadores. No publiques una lista abierta de refugiados, menores o personas vulnerables. La coincidencia de nombre solo genera un candidato para revisión. Una resolución requiere confirmación y un motivo, manteniendo el historial de quién pudo consultar cada dato.

# 136. RECURSOS DE PREVENCIÓN Y RECUPERACIÓN

Convierte la biblioteca en un módulo editorial: categorías, etiquetas, idioma, versión, autor, fuente, fecha de revisión y estado borrador/publicado/retirado. Ofrece búsqueda, filtros, favoritos y lectura accesible. Los artículos deben tener un objetivo concreto y una estructura breve.

Incluye preparación del hogar, documentos importantes, comunicación familiar, accesibilidad durante evacuaciones y orientación posterior a un incidente. Los contenidos de salud y bienestar requieren fuentes verificadas y revisión apropiada antes de presentarse como información operativa. No inventes procedimientos de atención, dosis, diagnósticos ni números de ayuda.

Los directorios distinguen instalaciones ficticias de datos externos verificados. Una tarjeta debe indicar procedencia, última actualización y tipo de servicio. Si un servicio real no está confirmado, no lo presentes como disponible. La recomendación de un recurso debe depender de la categoría del caso y de preferencias permitidas, sin diagnosticar al usuario.

# 137. PULSE CARE: PORTAL HOSPITALARIO

Crea una experiencia para coordinadores de instalaciones ficticias. La portada muestra traslados esperados, solicitudes sin responder, capacidad reportada y antigüedad de la última actualización. Cada hospital solo administra su propia información.

La bandeja de llegadas incluye código del traslado, unidad, ETA, nivel operacional de necesidad, requisitos de recepción autorizados y estado. Los campos sensibles se consultan mediante permisos de caso. El personal hospitalario puede aceptar, proponer alternativa o rechazar una solicitud con motivo, dejando al dispatcher decidir el siguiente paso.

Actualiza Command y Response al cambiar la aceptación. Un hospital seleccionado en un formulario todavía no es un destino confirmado. Registra quién aceptó y a qué hora. El diseño debe dejar clara la diferencia entre capacidad reportada, reserva temporal y disponibilidad confirmada. No conectes esta demo a sistemas clínicos reales por defecto.

# 138. CAPACIDAD, TRASLADOS Y ENTREGA HOSPITALARIA

Modela capacidad por recurso: plazas de recepción, áreas operativas y servicios demo relevantes. Guarda total, ocupación, reserva, disponibilidad calculada, fuente y fecha. No permitas negativos ni ocupaciones superiores al total sin una excepción explícita de sobrecapacidad.

Una reserva tiene vencimiento y relación con un traslado. Aceptar una reserva debe ser transaccional para impedir que dos operadores ocupen la última plaza simultáneamente. Liberarla o cambiar de destino actualiza todas las vistas.

El traslado tiene estados solicitado, aceptado, en transporte, llegada reportada, entrega confirmada, cancelado y desviado. La llegada de una ambulancia no equivale a la entrega del paciente. Solicita confirmación del personal autorizado, registra discrepancias y conserva evidencia operacional mínima. El cierre del traslado libera los recursos correspondientes según reglas; no libera mágicamente una cama que sigue ocupada.

# 139. PULSE SHELTER: REFUGIOS Y ALBERGUES

Cada refugio administra identificación, ubicación, responsable, accesibilidad, capacidad total, zonas utilizables, suministros y horario. La vista pública muestra disponibilidad agregada y antigüedad del dato, nunca residentes.

Implementa admisión, salida, traslado entre refugios y unidades familiares con datos mínimos. Una familia puede tener un código de registro y necesidades logísticas autorizadas. Evita recopilar diagnósticos cuando basta indicar un requerimiento de accesibilidad.

Al abrir un refugio durante una inundación, Command puede recomendarlo y Logistics recibe solicitudes de agua, mantas o kits ficticios. La ocupación cambia a partir de movimientos de admisión, no de un número editado en tarjetas desconectadas. Registra correcciones con motivo y evita admitir dos veces el mismo registro por repetir un clic.

# 140. PULSE FLEET: CICLO DE VIDA DE LA FLOTA

Amplía el catálogo de unidades con propietario, estación, tipo, capacidad, características, matrícula ficticia, combustible o carga, odómetro, equipamiento requerido, próxima inspección y restricciones operativas. La ficha incluye historial de misiones y mantenimiento.

Separa disponibilidad técnica de estado de misión. Una unidad puede estar sin asignación y aun así no ser despachable por mantenimiento, tripulación incompleta o equipo obligatorio ausente. El motor de despacho debe excluirla con un motivo visible.

Permite registrar órdenes de mantenimiento, inspecciones, defectos, reparación y retorno al servicio. Si aparece un defecto crítico mientras la unidad está asignada, informa a Command y abre un flujo de sustitución; no abandones el incidente silenciosamente. Las horas de uso y movimientos de inventario deben actualizarse desde eventos persistidos.

# 141. INSPECCIONES, TRIPULACIONES Y TURNOS

Crea checklists versionados por tipo de vehículo: comunicaciones, combustible, equipo requerido y estado general. La demo evalúa disponibilidad operacional; no pretende certificar equipos médicos ni vehículos reales. Cada respuesta guarda persona, fecha y observaciones.

La tripulación tiene membresía, rol operativo, turno y credenciales de capacitación ficticias. Una credencial vencida genera una restricción según reglas del escenario. Los turnos no pueden solaparse sin una excepción documentada. Evita asignar a la misma persona a dos unidades activas incompatibles.

Al cambiar de turno, ofrece relevo con casos abiertos, notas pendientes, unidades sin actualización y acciones por confirmar. El nuevo operador acepta el relevo. No pierdas la propiedad de un caso porque alguien cierre sesión. Los recordatorios de turno deben distinguir información administrativa de urgencia operacional.

# 142. PULSE LOGISTICS: INVENTARIO Y ABASTECIMIENTO

Implementa almacenes, artículos, unidades de medida, lotes opcionales, existencias, reservas y movimientos. Utiliza datos ficticios de agua, mantas, conos, baterías, equipos de comunicación y kits de preparación. No agregues dos unidades de medida distintas como si fueran equivalentes.

El flujo es solicitud, aprobación, reserva, preparación, envío, recepción y cierre. Cada movimiento identifica origen, destino, cantidad, responsable y referencia. El stock disponible se calcula desde stock físico menos reservas; las reservas vencidas se liberan mediante un proceso controlado.

Una entrega a un refugio actualiza su inventario al confirmar recepción, no al crear el pedido. Maneja recepciones parciales, discrepancias y cancelaciones. Evita cantidades negativas y sobreasignación mediante transacciones. Ofrece historial por artículo y exportación filtrada. No incorpores pagos reales ni compras automáticas; el objetivo es coordinación logística dentro de la simulación.

# 143. PULSE ENTERPRISE: EMPRESAS, CAMPUS Y ZONAS FRANCAS

Agrega un portal para organizaciones ficticias con una o varias sedes: oficinas, centros educativos, plantas y parques empresariales. Cada sede registra edificios, plantas, accesos, puntos de encuentro, brigadas, recursos y contactos autorizados.

Permite cargar planos ficticios o propios, asignar zonas y preparar planes de evacuación versionados. Los planos detallados, accesos sensibles y datos de personal son privados. Un usuario público no debe poder navegar por ellos desde el mapa.

Una empresa puede reportar un incidente a Command y compartir solo los datos relevantes de esa sede. El dispatcher recibe ubicación, tipo de riesgo, punto de acceso y enlace al plano autorizado. Al cerrar el caso, la empresa puede registrar acciones correctivas y programar un simulacro. Mantén la relación con el incidente original para analizar aprendizajes sin duplicar bases de datos.

# 144. EVACUACIÓN, BRIGADAS Y PUNTOS DE ENCUENTRO

Construye simulacros con participantes ficticios, edificio, hora de inicio, objetivos, observadores y puntos de encuentro. Los responsables registran presencia mediante lista o QR temporal. Una persona no registrada se muestra como “sin confirmar”; no como desaparecida automáticamente.

El coordinador ve conteos por zona, personas pendientes de confirmación y necesidades de asistencia declaradas. Debe poder corregir un check-in con motivo. Registrar una segunda lectura del QR no aumenta el conteo.

Permite capturar observaciones: salida bloqueada, señalización confusa o demora simulada. Después del ejercicio, genera acciones con responsable y vencimiento. Los resultados pertenecen a la organización y no se comparten públicamente. No generes instrucciones de rescate táctico o acceso a zonas peligrosas; el módulo registra y coordina un ejercicio supervisado.

# 145. PULSE COMMUNITY: VOLUNTARIADO SUPERVISADO

El perfil de voluntario contiene habilidades declaradas, formación ficticia, disponibilidad, zona preferida y necesidades de accesibilidad. La aprobación de su participación pertenece a un coordinador. No conviertas el registro público en permiso para responder a cualquier emergencia.

Ofrece tareas de apoyo apropiadas al escenario: clasificación de suministros, apoyo administrativo, orientación dentro de un refugio o preparación de materiales. Cada tarea indica responsable, ubicación, horario, capacidad, requisitos y forma de confirmar asistencia.

El voluntario acepta, inicia y completa una tarea; el coordinador verifica el resultado. No le muestres información clínica ni ubicaciones privadas de ciudadanos. Las tareas no deben dirigir personas sin capacitación hacia incendios, violencia, materiales peligrosos o rescates. Un cambio de riesgo suspende la tarea y genera aviso. La demo evalúa coordinación y disponibilidad, no habilitación profesional.

# 146. PULSE ACADEMY: FORMACIÓN Y ESCENARIOS

Implementa cursos breves, lecciones, prácticas y sesiones de simulación. Los contenidos se vinculan a roles: recepción, despacho, flota, refugios y logística. Las evaluaciones técnicas se basan en criterios explícitos, no en una nota inventada al terminar.

Un instructor crea una sesión, selecciona escenario, asigna participantes e introduce eventos durante el ejercicio. Puede observar decisiones, pausar el reloj simulado, añadir una llamada o declarar una unidad averiada. Los participantes solo ven la información que su rol conoce en ese momento.

Al finalizar, muestra objetivos cumplidos, datos faltantes, decisiones revisables y comparación con la rúbrica del escenario. La puntuación es educativa y no certifica competencia clínica, policial o de rescate. Permite repetir el ejercicio con el mismo seed para comparar resultados de manera reproducible.

# 147. INCIDENT COMMAND, TAREAS Y AYUDA MUTUA

Para eventos mayores define responsables de coordinación, áreas de trabajo, objetivos, tareas, recursos comprometidos y bitácora de decisiones. Cada tarea tiene estado, prioridad operacional, responsable, plazo y dependencias opcionales. No cierres un evento mientras existan tareas críticas pendientes sin una excepción registrada.

Una solicitud de ayuda mutua especifica recurso requerido, cantidad, destino, vigencia y organización receptora. El proveedor acepta o propone alternativa. Solo después se crea una asignación compatible con disponibilidad y permisos.

Usa una sala de coordinación con mapa, lista de decisiones, chat vinculado, archivos y próximos hitos. Los mensajes no sustituyen órdenes estructuradas: si alguien escribe “asignar unidad”, la asignación solo existe después de confirmar la acción correspondiente. El historial permite conocer qué información estaba disponible cuando se tomó una decisión.

# 148. PULSE WALLBOARD Y MODO PRESENTACIÓN

Diseña una vista para pantallas grandes con mapa, incidentes por prioridad, disponibilidad de recursos, capacidad agregada y avisos operacionales. Debe ser legible a distancia y tener una variante con datos personales ocultos.

El wallboard usa permisos propios de lectura. Un enlace compartido no puede convertirse en acceso administrativo. Permite cambiar de organización o evento solo cuando el usuario esté autorizado. No incluyas fotografías de ciudadanos, transcripciones o detalles médicos.

El modo presentación guía una demo paso a paso sin manipular contadores artificialmente. Ofrece una lista de hitos y enlaces a las ventanas necesarias. Si un paso todavía no ocurrió, debe indicarlo. Incluye un botón para salir del recorrido y conservar el estado, y otro para reiniciar exclusivamente el escenario demo con una confirmación clara.

# 149. PULSE TRUST: PRIVACIDAD VISIBLE

Crea un centro donde el ciudadano pueda consultar consentimientos, accesos a información sensible, sesiones activas y solicitudes de datos. Cada consentimiento tiene finalidad, alcance, versión del texto, fecha, vigencia y revocación.

Separar ubicación durante incidente, ficha médica, avisos a contactos y permisos de comunicaciones. El consentimiento no debe ser una casilla genérica que habilite todo. La revocación impide usos futuros dentro de su alcance; el sistema explica qué registros operacionales permanecen según la política configurada.

Implementa solicitudes de exportación y eliminación mediante un flujo con verificación de identidad y revisión de retención. Una exportación usa un enlace con vencimiento. No prometas cumplimiento legal por tener estas pantallas; documenta que una eventual operación real requiere validación jurídica y organizacional específica. En el producto de demo, muestra las políticas de simulación de forma clara y breve.

# 150. PULSE STATUS Y SOPORTE

La página pública de estado muestra salud agregada de acceso, reportes, mapas y notificaciones del entorno. Utiliza verificaciones técnicas reales del despliegue cuando estén implementadas y etiquetas de simulación para fallos provocados por escenarios.

No publiques topología interna, secretos, identificadores de ciudadanos ni errores completos. El panel privado puede mostrar latencia, tasa de fallos, colas y dependencias con más detalle. Distingue degradación del proveedor de mapas de caída total del sistema.

Agrega ayuda contextual, búsqueda de artículos y tickets de soporte vinculados a una categoría técnica. Un ticket nunca debe convertirse en la vía principal para reportar una emergencia. Al reportar un error, permite enviar identificador de diagnóstico y pasos, excluyendo automáticamente datos médicos y tokens. El historial de soporte y sus adjuntos siguen permisos propios.

# 151. ARQUITECTURA: MONOLITO MODULAR Y CONTRATOS

Empieza con un monolito modular: una aplicación React organizada por productos y dominios, un backend compartido y una base PostgreSQL. Extrae servicios solo cuando exista una necesidad medida. No agregues microservicios, varios gestores de estado y múltiples bases de datos únicamente para aparentar complejidad.

Separa presentación, casos de uso, reglas de dominio y adaptadores. Los componentes no deben ejecutar SQL, decidir permisos o calcular transiciones críticas por su cuenta. Implementa servicios como `CreateIncident`, `ValidateIncident`, `AssignUnit`, `AcceptDispatch`, `UpdateMissionStatus`, `RequestTransfer` y `CloseIncident`.

Comparte tipos y esquemas de validación sin acoplar el dominio a React. Selecciona una estrategia principal de datos de servidor; TanStack Query es una opción razonable. Reserva Zustand para preferencias y estado transitorio de interfaz. No mantengas una segunda colección editable de incidentes dentro de cada página. Cachear una proyección no convierte al navegador en autoridad.

# 152. MODOS DE EJECUCIÓN Y LÍMITES HONESTOS

Define los modos explícitamente:

| Modo | Persistencia | Sincronización | Integraciones |
| --- | --- | --- | --- |
| `demo-local` | IndexedDB y activos locales ficticios | Pestañas del mismo origen mediante BroadcastChannel | Simuladores determinísticos |
| `demo-shared` | Backend local y PostgreSQL, preferentemente Supabase local | Usuarios y dispositivos conectados al mismo backend | Simuladores; proveedores opcionales de prueba |
| `integrated-sandbox` | Supabase configurado | Tiempo real autenticado | Proveedores configurados en entorno de prueba |

Los tres son entornos de demostración. Usar una base de datos o un mapa externo no conecta PULSE con instituciones de emergencia.

`demo-local` debe arrancar sin credenciales y permitir la demo de varias pestañas. Documenta que no sincroniza otros equipos ni garantiza aislamiento de seguridad dentro de un mismo navegador. No admite datos personales reales. `demo-shared` permite demostrar autorización de servidor y concurrencia con identidades distintas. Una caída de un proveedor en modo integrado no debe cambiar silenciosamente a datos ficticios; muestra degradación y conserva el contexto.

# 153. ADAPTADORES CON PARIDAD FUNCIONAL

Define contratos para `AuthProvider`, `IncidentRepository`, `DispatchService`, `RealtimeProvider`, `MapProvider`, `RoutingProvider`, `VoiceProvider`, `StorageProvider`, `NotificationProvider`, `DecisionSupportProvider` y `Clock`.

Cada adaptador expone capacidades concretas: rutas por carretera, geocodificación, eventos privados, carga de archivos, llamadas o simulación. La interfaz consulta esas capacidades para habilitar controles y explicar restricciones. Evita comprobar claves de entorno en veinte componentes distintos.

Implementa pruebas de contrato que ejecuten los mismos casos esenciales sobre demo y backend: crear incidente, consultar por actor, cambiar versión, asignar unidad y recuperar eventos. Los resultados pueden tener diferente transporte, pero conservan semántica y validación. Una API ausente produce un estado explícito de no disponible; no una función vacía que devuelve éxito. Las simulaciones retornan metadatos `simulated: true` y una fuente identificable.

# 154. MODELO DE DATOS AMPLIADO

Agrega entidades con claves primarias, relaciones, restricciones y RLS según corresponda:

| Dominio | Entidades adicionales |
| --- | --- |
| Organización | `organizations`, `agencies`, `stations`, `jurisdictions`, `organization_memberships`, `permissions`, `role_permissions` |
| Hogar y privacidad | `households`, `household_members`, `saved_places`, `consent_records`, `medical_access_events`, `temporary_access_tokens`, `data_requests` |
| Operación | `incident_assignments`, `incident_status_transitions`, `unit_reservations`, `mission_status_history`, `mutual_aid_requests`, `operational_tasks` |
| Hospital | `transfer_requests`, `facility_reservations`, `hospital_handoffs`, `capacity_snapshots` |
| Refugio | `shelters`, `shelter_admissions`, `shelter_stays`, `shelter_needs`, `reunification_requests` |
| Flota | `vehicle_inspections`, `inspection_templates`, `maintenance_orders`, `equipment_assignments`, `crew_memberships` |
| Logística | `warehouses`, `inventory_items`, `stock_movements`, `stock_reservations`, `supply_requests`, `supply_deliveries` |
| Empresa | `enterprise_sites`, `site_buildings`, `site_plans`, `muster_points`, `drill_sessions`, `muster_records`, `corrective_actions` |
| Comunidad | `volunteer_profiles`, `volunteer_approvals`, `volunteer_availability`, `volunteer_tasks`, `task_participations` |
| Formación | `courses`, `lessons`, `training_scenarios`, `scenario_runs`, `training_events`, `training_results` |
| Integración | `integration_configs`, `webhook_subscriptions`, `webhook_deliveries`, `provider_health`, `external_events` |
| Fiabilidad | `domain_events`, `outbox_events`, `idempotency_keys`, `background_jobs`, `report_exports` |
| Contenido y soporte | `resource_articles`, `article_versions`, `support_tickets`, `support_messages` |

No crees tablas redundantes si una entidad existente cubre el concepto. Documenta qué tablas contienen datos sensibles, qué campos son públicos y cuál es la política de retención. Cada entidad nueva debe usarse en un flujo, no existir únicamente para aumentar el esquema.

# 155. INTEGRIDAD, GEOGRAFÍA Y TIEMPO

Utiliza UUID para claves internas y códigos legibles generados atómicamente por el servidor para incidentes. Los códigos no son secretos ni autorizan acceso. Agrega `created_at`, `updated_at`, `version`, `organization_id` donde aplique y origen del dato.

Guarda fechas persistentes en UTC con `timestamptz`; presenta la demo costarricense en `America/Costa_Rica`. No fijes manualmente un desplazamiento horario universal. Mantén separado el reloj del escenario del reloj real. Registra `occurred_at` y `received_at` para eventos externos o de conectividad intermitente.

Valida rangos de coordenadas, precisión no negativa y fechas razonables. Usa PostGIS para proximidad y geocercas cuando esté disponible; documenta índices espaciales y unidades. GeoJSON usa coordenadas en orden longitud, latitud. Mantén ese contrato consistente con SDKs que esperan otra estructura. Una dirección escrita puede permanecer sin coordenadas confirmadas; no la conviertas arbitrariamente en el centro de una ciudad.

# 156. MÁQUINAS DE ESTADO CON AUTORIDAD EN SERVIDOR

Implementa transiciones explícitas y verifica actor, estado anterior, versión y precondiciones. No permitas que cualquier cliente escriba directamente un string en `status`.

| Entidad | Recorrido principal | Condiciones relevantes |
| --- | --- | --- |
| Incidente | recibido → revisión → validado → espera de despacho → despachado → atención → resuelto → cerrado | Validación, recursos y cierre autorizados |
| Despacho | propuesto → reservado → enviado → aceptado → en curso → completado | Reserva vigente y unidad elegible |
| Misión | asignada → en ruta → en sitio → transporte opcional → finalizada | Confirmaciones registradas |
| Unidad | disponible → comprometida → operativa → retorno → disponible | Estado de misión y disponibilidad técnica |
| Traslado | solicitado → aceptado → transporte → llegada → entrega | Aceptación del destino y confirmación de entrega |
| Alerta | borrador → revisión → publicada → expirada o retirada | Autoridad editorial y vigencia |

Rechazo, cancelación, desvío y reapertura requieren rutas explícitas con motivo. Documenta si una transición necesita confirmación adicional. La prioridad del incidente y su estado son campos diferentes. Si varias unidades atienden un caso, conserva estados individuales y deriva la fase general con reglas documentadas; la llegada de una unidad no implica que todas llegaron.

# 157. CONCURRENCIA Y ASIGNACIONES ATÓMICAS

La asignación de una unidad debe verificar disponibilidad, bloquear o actualizar condicionalmente el recurso, crear reserva y despacho, registrar historial y publicar el evento después del commit. Todo cambio persistente relacionado pertenece a una transacción.

Implementa una restricción que impida dos compromisos activos incompatibles para la misma unidad. Si dos dispatchers compiten por ella, uno obtiene la asignación y el otro un conflicto recuperable con datos actualizados. No se resuelve con deshabilitar un botón en una sola pestaña.

Usa control de versión para evitar sobrescribir cambios recientes. Una petición con versión antigua devuelve conflicto y permite recargar o comparar. Las reservas vencen mediante reloj de servidor y un job idempotente. Aceptar un despacho ya cancelado o vencido debe fallar con una explicación. Aplica principios equivalentes a plazas hospitalarias, stock y cupos de refugio.

# 158. IDEMPOTENCIA Y CONFIRMACIÓN DE COMANDOS

Las operaciones susceptibles a reintentos reciben `Idempotency-Key`: crear incidente, despachar, aceptar, enviar alerta, registrar ingreso y confirmar entrega. Guarda clave, actor, organización, operación, hash de payload y resultado durante una ventana documentada.

Repetir la misma clave y contenido devuelve el resultado original. Reutilizar la clave con contenido distinto produce conflicto. El servidor no crea una segunda ambulancia asignada porque el navegador repitió la petición tras un timeout.

Distingue una operación pendiente de una operación rechazada. Si el cliente pierde respuesta después de un commit, consulta el resultado por su clave o identificador. En acciones críticas muestra éxito únicamente tras confirmación autoritativa. Puedes actualizar optimistamente un favorito o una preferencia visual; el envío de recursos necesita confirmación persistente.

# 159. EVENTOS Y OUTBOX TRANSACCIONAL

Define un sobre común para eventos:

```ts
type DomainEvent<T> = {
  id: string;
  type: string;
  schemaVersion: number;
  organizationId: string;
  aggregateType: string;
  aggregateId: string;
  aggregateVersion: number;
  occurredAt: string;
  recordedAt: string;
  actorId: string | null;
  correlationId: string;
  causationId: string | null;
  simulated: boolean;
  payload: T;
};
```

Emite eventos como `incident.created`, `incident.validated`, `dispatch.assigned`, `dispatch.accepted`, `unit.location.updated`, `mission.arrived`, `transfer.accepted`, `incident.resolved`, `alert.published`, `shelter.admission.created` y `inventory.delivery.received`.

Guarda el cambio y la intención de publicar en la misma transacción mediante outbox. El publicador puede reintentar; los consumidores deduplican por ID. Diseña para entrega al menos una vez y consumidores idempotentes, sin prometer exactamente una vez de extremo a extremo. No incluyas fichas médicas completas en eventos generales. Guarda referencias y permite recuperar vistas autorizadas.

# 160. REALTIME, RECONEXIÓN Y PRIVACIDAD DE CANALES

Organiza canales por organización, incidente autorizado, unidad y usuario. Implementa suscripciones privadas y políticas específicas. La autorización de las tablas y la autorización de Broadcast/Presence deben configurarse según el mecanismo usado; una no reemplaza automáticamente a la otra. La documentación oficial de [autorización de Supabase Realtime](https://supabase.com/docs/guides/realtime/authorization) describe esta separación.

Al reconectar, recupera un snapshot autorizado y cambios posteriores a un cursor. Deduplica eventos, ignora versiones antiguas y detecta huecos de secuencia. Una animación fluida no demuestra que todos los eventos llegaron. Muestra última sincronización y un estado de datos antiguos cuando corresponda.

No confíes en revocar un canal únicamente desde la interfaz. Al cambiar permisos, invalida sesiones o suscripciones conforme al proveedor y comprueba que ya no se entregan datos nuevos. Para contenido sensible, distribuye notificaciones mínimas y exige una nueva consulta autorizada. Prueba fuga de datos por canales, cachés y exports, además de consultas HTTP.

# 161. API Y ERRORES PREDECIBLES

Expón contratos documentados, preferentemente OpenAPI, para operaciones de servidor. Ejemplos orientativos:

```text
POST /api/v1/incidents
GET /api/v1/incidents/:id
POST /api/v1/incidents/:id/validate
POST /api/v1/incidents/:id/dispatches
POST /api/v1/dispatches/:id/accept
POST /api/v1/missions/:id/transitions
POST /api/v1/units/:id/location-batches
POST /api/v1/transfers
POST /api/v1/transfers/:id/accept
POST /api/v1/alerts/:id/publish
POST /api/v1/reports
GET /api/v1/jobs/:id
```

Las consultas usan paginación, filtros y ordenamiento validados. Limita rangos temporales y tamaños de página. Los errores devuelven código estable, mensaje seguro, campos inválidos y `requestId`. Diferencia no autenticado, no autorizado, conflicto, validación, límite temporal y dependencia no disponible. No devuelvas stack traces ni SQL al usuario.

Valida respuestas de proveedores además de entradas del ciudadano. Una coordenada malformada o un ETA ausente debe tratarse explícitamente, no propagarse como `NaN` al mapa.

# 162. MOTOR DE DESPACHO EXPLICABLE

Primero aplica restricciones duras: tipo compatible, disponibilidad técnica, tripulación válida, recursos requeridos, jurisdicción o ayuda mutua aceptada y localización suficientemente reciente. Después ordena candidatas con un score versionado.

Usa factores normalizados de ETA, cobertura que se pierde al mover la unidad, adecuación de capacidad y carga operacional. Define pesos de demostración configurables y muestra el desglose. No uses una suma de kilómetros y minutos sin normalización. Si faltan datos de ruta, indica menor calidad de estimación y la fuente alternativa.

La interfaz presenta mejores candidatas y motivos de exclusión. El dispatcher puede elegir otra unidad elegible con un motivo. No permitas saltar una restricción técnica crítica con un clic genérico. Los cambios de prioridad se basan en gravedad reportada y revisión humana; la escasez de vehículos no convierte una emergencia grave en leve. Mantén separado el orden operacional de atención del nivel de severidad.

# 163. MAPAS, GEOCODIFICACIÓN Y RUTAS SIN CREDENCIALES

Separa motor de renderizado, fuente cartográfica, geocodificación y cálculo de rutas. MapLibre GL JS puede renderizar mapas, pero debes aportar estilos y fuentes adecuados; consulta su [documentación oficial](https://maplibre.org/maplibre-gl-js/docs/). No presentes instalar una biblioteca como obtener automáticamente mapas y rutas ilimitados.

Para la demo sin claves, incluye un pequeño territorio ficticio con calles, instalaciones, zonas y rutas GeoJSON locales. Debe permitir crear incidentes, calcular un recorrido sobre una red demo y mover vehículos. Identifica claramente “cartografía de demostración”. Fuera del área cubierta, ofrece seleccionar un punto dentro del escenario o usar un proveedor configurado.

Mapbox se integra mediante un adaptador con token público restringido según su uso. Respeta atribución, licencia, cuotas y restricciones de almacenamiento. No dependas de endpoints públicos de prueba como infraestructura de producción. Si falta una ruta real, nunca dibujes una línea recta sobre el mar y la llames navegación por carretera.

# 164. TELEMETRÍA, MOVIMIENTO Y ETA

Cada muestra de ubicación contiene unidad, coordenadas, precisión, rumbo, velocidad si existe, hora de captura, hora de recepción, secuencia y origen. Rechaza puntos imposibles o inválidos y marca los sospechosos para revisión. Una muestra retrasada no debe hacer retroceder el vehículo en la vista actual.

En simulación avanza sobre la polilínea por distancia acumulada y tiempo del escenario. Un único motor autoritativo calcula progreso. En `demo-local` usa elección de líder o un mecanismo equivalente para que abrir tres pestañas no triplique la velocidad. El relevo del líder debe conservar progreso.

Interpola únicamente para suavizar entre muestras conocidas. No sigas inventando avance indefinidamente si se pierde telemetría. Muestra última posición y antigüedad. Calcula ETA a partir de distancia restante y modelo de velocidad del escenario, o del proveedor configurado. Expresa incertidumbre con “aproximadamente” o un rango; la precisión visual no puede superar la calidad del dato.

# 165. BLOQUEOS, RECÁLCULO Y COBERTURA TERRITORIAL

Un bloqueo tiene geometría, tipo, vigencia, fuente, estado de verificación y responsable. En la red demo, los segmentos afectados se excluyen o penalizan según reglas del escenario. Recalcula rutas cuando una ruta activa queda afectada y notifica al dispatcher.

No uses una capa meteorológica visual como prueba de que una carretera está transitable. La recomendación de ruta debe declarar qué restricciones considera. Si el proveedor externo no admite un bloqueo particular, muestra esa limitación y permite una alternativa revisada; no finjas que se envió al motor.

El análisis de cobertura estima sectores alcanzables bajo velocidades y disponibilidad del escenario. Presenta supuestos, fecha y recursos considerados. Una recomendación de reposicionamiento es una propuesta revisable que no cambia por sí sola el destino de una unidad. Diferencia cobertura histórica, actual y escenario hipotético.

# 166. PWA, OFFLINE Y COLAS DE SINCRONIZACIÓN

La PWA puede conservar estructura, recursos educativos y borradores adecuados al modo. Implementa cache versionada y evita guardar indiscriminadamente respuestas privadas en el service worker. En dispositivos compartidos, cerrar sesión limpia datos sensibles de caché y memoria dentro de los límites de la plataforma.

Una solicitud creada sin conexión se muestra como “guardada en este dispositivo; todavía no recibida”. El usuario puede revisar, reintentar o descartar. Al volver la conexión, utiliza idempotencia, conserva la hora original y presenta cambios de contexto relevantes. Los comandos operacionales offline incompatibles con el estado actual deben generar conflicto, no aplicarse a ciegas.

La sincronización en segundo plano es una mejora opcional: tiene disponibilidad limitada y requiere contexto seguro según [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API). Implementa recuperación al abrir la app y botón manual de reintento. No prometas rastreo GPS continuo con la pantalla bloqueada ni funcionamiento equivalente a una app nativa; detecta capacidades reales y muestra sus límites.

# 167. PULSE CONNECT: CENTRO DE INTEGRACIONES

Cada integración muestra proveedor, capacidades, modo simulado/configurado/verificado/degradado, última prueba, latencia y permisos requeridos. Las claves secretas se configuran en servidor; el panel solo muestra metadatos enmascarados y acciones autorizadas.

| Capacidad | Adaptador propuesto | Alternativa demo |
| --- | --- | --- |
| Identidad, SQL, archivos y eventos | Supabase | Repositorios locales o Supabase local |
| Cartografía y rutas | Mapbox; motor MapLibre para fuentes compatibles | Red y capas GeoJSON locales |
| Telefonía de prueba | Twilio Voice | Llamadas con guion y estados |
| Correo transaccional | Proveedor SMTP o API intercambiable | Bandeja de salida simulada |
| SMS | Adaptador del proveedor configurado | Registro de entrega simulada |
| Push | Web Push donde esté soportado | Centro interno de notificaciones |
| Asistencia de lenguaje | Adaptador servidor de LLM | Reglas y resúmenes de plantilla |
| Meteorología | Adaptador configurable de fuente verificada | Eventos climáticos ficticios |
| Hospitales | Intercambio de prueba con contrato explícito | Portal Care del escenario |
| Sensores | Endpoint autenticado o puente MQTT opcional | Generador de telemetría |
| Observabilidad | Logs y métricas estructuradas | Panel local de diagnóstico |

No implementes varias alternativas comerciales completas para la misma capacidad sin necesidad. Entrega un adaptador funcional y una interfaz que permita reemplazarlo. Para conectores adicionales, documenta el contrato y su estado exacto.

# 168. LLAMADAS, AUDIO Y TRANSCRIPCIÓN

El simulador debe reproducir una secuencia de llamada entrante, respuesta, conversación, espera, transferencia y finalización. Cada cambio genera eventos relacionados con un caso. La transcripción del guion se etiqueta como simulada y aparece al ritmo del escenario.

Cuando exista Twilio, genera tokens de acceso de corta duración desde servidor y valida la identidad autorizada. El SDK de navegador requiere componentes adicionales de backend y configuración, tal como describe el [inicio rápido oficial de Twilio Voice](https://www.twilio.com/docs/voice/sdks/javascript/get-started). No expongas credenciales privadas.

Mantén llamadas externas deshabilitadas por defecto. Las pruebas usan destinatarios de prueba autorizados y nunca números de emergencia. La interfaz debe diferenciar llamada simulada, llamada de prueba y proveedor no configurado. La grabación necesita un control explícito y una política aplicable. Si no hay transcripción disponible, permite notas manuales; no inventes palabras que el interlocutor no dijo.

# 169. WEBHOOKS, SENSORES E INTEROPERABILIDAD

Permite registrar webhooks para eventos permitidos con URL validada, secreto de firma, alcance y estado. Firma entregas, incluye timestamp, evita replays, registra intentos y aplica reintentos exponenciales con límite. Protege endpoints de prueba contra SSRF: no permitas que una URL arbitraria consulte redes internas o metadatos de infraestructura.

La bandeja de fallos muestra código seguro, número de intentos y próximo reintento. Reenviar un evento conserva su identidad para que el receptor pueda deduplicar. Nunca envíes secretos o fichas médicas en payloads por defecto.

Los sensores demo producen temperatura, humo, nivel de agua o estado eléctrico ficticios. Un umbral genera una señal que debe ser revisada antes de convertirse en incidente confirmado. La fuente indica simulador, dispositivo configurado o importación. Los adaptadores hospitalarios o de alertas pueden preparar contratos para estándares pertinentes, pero no deben afirmar conformidad ni compatibilidad con sistemas reales sin validación y pruebas específicas.

# 170. IA COMO APOYO CONTROLADO

Implementa tareas acotadas: resumen de llamada, extracción de ubicación mencionada como candidato, clasificación sugerida, preguntas faltantes, búsqueda de recursos aprobados y redacción de borradores de informes. Cada resultado tiene fuente, versión del método, fecha y estado de revisión.

La IA no despacha, cambia permisos, publica alertas, cierra casos ni modifica una ficha médica. Esas acciones se ejecutan mediante servicios autorizados y confirmación humana. Trata descripciones, transcripciones y archivos como datos no confiables; sus instrucciones no pueden cambiar reglas del sistema.

Reduce datos enviados a proveedores y registra la finalidad. No inventes porcentajes de confianza calibrada: si el motor solo devuelve una estimación heurística, etiquétala como tal. Cuando falten fuentes, debe declarar que no puede verificar. En modo sin API usa reglas versionadas y muestra el razonamiento operacional del escenario. Una recomendación rechazada se conserva para auditoría y evaluación, sin alterar el caso automáticamente.

# 171. MOTOR DE ESCENARIOS REPRODUCIBLE

Cada escenario define ID, versión, seed, territorio, actores, recursos iniciales, duración, eventos programados, condiciones de éxito y rúbrica. El reloj simulado permite pausa, reanudación y velocidades de reproducción. Las fechas de auditoría técnica permanecen separadas del tiempo ficticio.

Incluye escenarios de accidente vehicular, incendio estructural, inundación, evento marítimo, bloqueo vial con grúa, evacuación empresarial, refugio saturado y avería de una unidad durante traslado. Introduce fallos controlados: pérdida de GPS, retraso de respuesta hospitalaria, rechazo de despacho y desconexión temporal.

El mismo seed debe generar la misma situación inicial y secuencia de eventos programados. Las decisiones de los participantes crean diferencias legítimas. Guarda el run y sus eventos para replay. Reiniciar un escenario elimina o archiva únicamente sus datos demo identificados; nunca ejecuta un borrado global de producción.

# 172. REPLAY, INVESTIGACIÓN Y TRAZABILIDAD

El replay reconstruye posiciones y estados desde eventos y snapshots históricos. No reproduce los datos actuales sobre un reloj antiguo. Incluye reproducción, pausa, velocidad, salto a evento y lista sincronizada de decisiones.

Usa el tiempo de ocurrencia y permite ver cuándo fue recibido un dato retrasado. El observador puede distinguir lo que sucedió de lo que la central sabía en ese instante. Si falta telemetría, muestra un intervalo sin datos en lugar de rellenarlo como hecho real.

Las correcciones históricas se agregan como eventos, sin reescribir silenciosamente el pasado. El export de replay respeta la misma proyección de permisos que el caso. La vista de auditoría no debe publicar trayectorias de unidades ajenas o información que el usuario ya no está autorizado a consultar.

# 173. MÉTRICAS CON DEFINICIONES EXPLÍCITAS

Implementa un diccionario de métricas compartido por dashboard, gráficos y PDF:

| Métrica | Definición |
| --- | --- |
| Tiempo de validación | `validated_at - received_at` |
| Tiempo hasta despacho | Primer despacho confirmado menos recepción |
| Tiempo de aceptación | Aceptación menos envío del despacho |
| Tiempo de viaje | Llegada confirmada menos salida de la unidad |
| Tiempo hasta primera respuesta | Primera llegada válida menos recepción |
| Duración operacional | Resolución menos recepción |
| Disponibilidad | Unidades despachables / unidades activas de la población seleccionada |
| Cumplimiento del objetivo demo | Casos elegibles dentro del umbral / casos elegibles con medición |
| Ocupación de refugio | Personas con estancia activa / capacidad habilitada |

Muestra promedio, mediana y percentil 90 cuando haya muestra suficiente. Los casos sin llegada no tienen tiempo de respuesta cero: se reportan aparte. Define tratamiento de cancelados, reabiertos y duplicados fusionados. Incluye tamaño de muestra, zona horaria, filtros y fecha de cálculo. No sumes incidentes y despachos como si fueran la misma unidad estadística.

# 174. INTELLIGENCE, PREDICCIÓN Y ESCENARIOS HIPOTÉTICOS

Implementa consultas por periodo, categoría, jurisdicción, recurso y estado. Los gráficos deben permitir abrir el conjunto autorizado que explica una cifra. El mapa agregado utiliza celdas o zonas y evita revelar ubicaciones individuales de casos sensibles.

Para PULSE Predict utiliza inicialmente un baseline explicable sobre datos simulados: promedios por franja, comparación con periodos anteriores y reglas del escenario. Muestra horizonte, cantidad de datos, error de validación cuando exista y limitaciones. No presentes una cifra aleatoria como un modelo entrenado.

El modo “qué pasaría si” permite cambiar unidades disponibles, demanda, bloqueos y capacidad de instalaciones. Mantén resultados separados de la operación activa y rotulados como escenario. Comparar dos escenarios no debe modificar disponibilidad real ni despachar recursos. Evita clasificar personas o barrios como criminales; el módulo estima carga operacional agregada de emergencias simuladas.

# 175. EXPORTACIÓN PDF, CSV Y PAQUETES DE REPORTE

Genera informes a partir de una instantánea consistente con filtros y permisos. El PDF incluye marca PULSE, aviso de simulación, código, periodo, método, datos operacionales, timeline, recursos, métricas y fecha de generación. Añade encabezados repetidos en tablas, paginación y estilos de impresión legibles.

El solicitante elige plantilla ciudadana, operacional o agregada; el servidor decide qué campos puede contener. No permitas exportar información escondida visualmente pero presente en el payload. Los CSV deben protegerse contra interpretación de fórmulas de hoja de cálculo en campos introducidos por usuarios.

Exportaciones grandes se procesan como jobs con progreso y enlace temporal. Cancelar un job no debe borrar un incidente. Registra quién generó y descargó informes sensibles. Incluye gráficos y mapa solo si el método de render y su licencia lo permiten; ofrece un resumen de ubicación alternativo. Valida que el archivo abre y que sus cifras coinciden con la vista filtrada.

# 176. SEGURIDAD APLICADA Y RETENCIÓN

Protege sesiones, cookies cuando se utilicen, CSRF según arquitectura, CORS, cabeceras y política de contenido. Aplica validación en servidor, escape de salida y políticas de archivos. Diferencia claves públicas configurables de secretos con privilegios. Nunca incluyas `service_role` en el bundle, logs o respuestas.

RLS debe cubrir lectura y escritura con condiciones de pertenencia y acción. Las funciones privilegiadas verifican actor, fijan un contexto seguro y exponen permisos mínimos. Un rol de administrador de aplicación no equivale al propietario de la base de datos. Documenta esa frontera sin afirmar inaccesibilidad absoluta frente a infraestructura privilegiada.

Define retención por categoría: ubicaciones detalladas, archivos, transcripciones, logs y estadísticas agregadas. Los plazos son configuraciones de demo, no afirmaciones legales. Implementa eliminación programada y revocación de enlaces. Los logs de auditoría son append-only para roles de aplicación; no los describas como inalterables frente a cualquier administrador. No incluyas datos clínicos completos en metadata de auditoría.

# 177. ARCHIVOS PRIVADOS Y CONTENIDO NO CONFIABLE

Limita cantidad, tamaño y formatos tanto en cliente como servidor. Inspecciona contenido y firma de archivo cuando corresponda, no solo extensión. Usa nombres internos aleatorios, buckets privados y URLs firmadas de corta duración. Sirve formatos no seguros como descarga en lugar de ejecutarlos dentro de la página.

Las cargas pasan por estados pendiente, procesando, disponible y rechazado. Si no hay un servicio de análisis de malware configurado, no muestres “archivo escaneado”. Documenta la capacidad real. Elimina metadatos de ubicación de imágenes cuando no sean necesarios y conserva orientación correctamente.

Un archivo se relaciona con su incidente y organización; conocer su ruta no autoriza descargarlo. Revocar acceso al caso afecta nuevas URLs. Considera que una URL ya emitida puede seguir válida hasta su vencimiento y minimiza ese periodo. La demo usa archivos sintéticos o activos autorizados, nunca expedientes o identificaciones reales.

# 178. CONFIGURACIÓN OPERACIONAL Y GOBIERNO

Implementa configuración versionada para categorías, preguntas, capacidades de unidades, pesos de ranking, plantillas de alerta, criterios de cierre y checklists. Cada cambio tiene autor, motivo, fecha y estado borrador/activo/retirado.

Los incidentes guardan la versión de reglas utilizada. Cambiar una categoría no reinterpreta silenciosamente todos los casos históricos. Permite previsualizar cambios sobre escenarios demo antes de activarlos. Las configuraciones con impacto operacional requieren permisos específicos y una confirmación contextual.

No uses un editor libre de JavaScript o SQL en la interfaz para definir reglas. Emplea un esquema validado con operadores permitidos y límites de complejidad. El panel muestra diferencias entre versiones y opción de volver a una versión anterior mediante un nuevo cambio registrado. Las configuraciones secretas pertenecen al entorno de servidor y no al catálogo exportable.

# 179. ALERTAS GEOGRÁFICAS Y COMUNICACIÓN PÚBLICA

Una alerta se redacta, revisa, publica, actualiza, expira o retira. Los cambios conservan versión y motivo. La publicación necesita un rol autorizado y una previsualización que muestre título, severidad, polígono, vigencia e instrucciones.

Calcula destinatarios con ubicación reciente y consentida, lugares guardados elegidos para alertas o suscripciones a zonas. No actives rastreo permanente de ciudadanos para encontrar quién está dentro. Si la posición es antigua, no afirmes que el usuario se encuentra allí en ese momento.

Los canales internos y externos tienen estados separados. Publicar una alerta en la plataforma no significa que todos recibieron push o SMS. Registra envíos, fallos y confirmaciones disponibles, sin equiparar recepción técnica a lectura humana. Las actualizaciones reemplazan el contenido vigente y conservan historial. En modo demo, los avisos se limitan a usuarios y bandejas ficticias. Todo boletín exportado incluye la marca de simulación.

# 180. CASOS SENSIBLES, MENORES Y BÚSQUEDA DE PERSONAS

Los casos de violencia, desaparición y situaciones con personas vulnerables necesitan una proyección de datos especialmente limitada. No publiques automáticamente foto, nombre, ubicación exacta o descripción médica porque el formulario los recibió.

Crea un flujo separado para preparar un boletín de búsqueda de demostración, con revisión humana, campos permitidos, vigencia y retiro. Los reportes de avistamiento se entregan a coordinadores autorizados; no aparecen como puntos abiertos para que cualquier usuario acuda al lugar. La plataforma no debe facilitar que un tercero rastree a una persona.

Cuando un caso se resuelve, revoca nuevos accesos al boletín y marca las copias propias como retiradas. No prometas retirar archivos que terceros ya descargaron. La coincidencia de fotografía o nombre no confirma identidad. No implementes reconocimiento facial ni inferencias de criminalidad. El objetivo es registrar información y coordinar una simulación con revisión y permisos adecuados.

# 181. BÚSQUEDA GLOBAL, TABLAS Y PRODUCTIVIDAD

La búsqueda de Command admite código de incidente, unidad, instalación y entidad autorizada. Aplica filtros de permisos en servidor antes de obtener resultados, fragmentos y conteos. Un usuario no autorizado tampoco debe descubrir que existe una persona mediante autocompletado.

Las tablas incluyen columnas configurables, filtros persistentes, ordenamiento, paginación y vistas guardadas por usuario. Los filtros relevantes se reflejan en la URL para compartir una vista dentro del alcance autorizado. Un enlace compartido no concede permisos adicionales.

Incluye atajos documentados y configurables. No actives comandos de despacho con una tecla accidental dentro de un formulario. La selección masiva muestra cantidad y alcance antes de ejecutar una acción. Para actualizaciones concurrentes, conserva la posición de lectura y muestra nuevos registros con un aviso; evita que una fila se mueva debajo del cursor justo antes de hacer clic.

# 182. DATOS DEMO COHERENTES Y REPRODUCIBLES

Amplía el seed original a un conjunto normal de demostración con 40 ciudadanos ficticios, 12 hogares, 8 operadores, 4 dispatchers, 2 supervisores, coordinadores por instalación y usuarios para cada producto. Conserva una flota consistente: 12 ambulancias, 8 vehículos de bomberos, 14 patrullas, 5 motos, 6 grúas y 4 unidades de rescate.

Agrega 5 hospitales ficticios, 8 estaciones, 4 refugios, 3 sedes empresariales, 2 almacenes, 20 voluntarios, 60 artículos logísticos, 6 cursos, 8 escenarios, 120 incidentes históricos y 8 activos. Incluye alertas vigentes y expiradas, mantenimientos, reservas y entregas. Todos los números deben derivarse del seed, no de constantes distintas en cada tarjeta.

Ofrece además un seed mínimo para pruebas y otro de carga. Los correos demo usan dominios reservados como `example.test`; los teléfonos no se envían a proveedores. Las fechas se generan respecto del reloj del escenario para que el dashboard no quede vacío con el paso de los meses. Guarda IDs estables y relaciones válidas. El comando de seed debe negarse a cargar cuentas demo en un entorno no permitido.

# 183. ESCENARIO PRINCIPAL DE PRESENTACIÓN COMPLETA

Prepara un recorrido reproducible llamado “Accidente en corredor costero”, con personas e instalaciones ficticias y duración aproximada de ocho a doce minutos según la velocidad del simulador.

1. Citizen abre su ficha, revisa alergias declaradas y autoriza acceso limitado durante el incidente.
2. Reporta un accidente en una calle del territorio demo, agrega una imagen sintética y envía.
3. Command recibe el mismo código sin recargar y muestra fecha, fuente y ubicación.
4. El operador revisa riesgos, completa datos y valida la prioridad propuesta.
5. El dispatcher compara ambulancia, bomberos y apoyo vial con razones de elegibilidad.
6. Asigna recursos; otro dispatcher que intenta tomar la misma ambulancia recibe un conflicto.
7. Response acepta el despacho y comienza una misión confirmada.
8. El mapa de Command y la proyección de Citizen muestran el movimiento y ETA del mismo recurso.
9. Se introduce un bloqueo demo y la central revisa una ruta alternativa.
10. La unidad confirma llegada; se solicita recepción a un hospital ficticio.
11. Care acepta la solicitud y reserva capacidad compatible.
12. Response registra transporte y llegada; Care confirma la entrega.
13. La central resuelve y cierra con observaciones, conservando el historial.
14. Citizen recibe el estado final y recursos educativos apropiados.
15. Intelligence actualiza métricas derivadas; el PDF coincide con el caso.
16. El supervisor abre replay y revisa el conflicto, el bloqueo y la decisión de destino.

Cada paso debe tener evidencia persistente. Si falla una integración opcional, el escenario usa su simulador declarado y continúa sin ocultar la diferencia.

# 184. ESCENARIOS ADICIONALES OBLIGATORIOS

| Escenario | Productos implicados | Resultado verificable |
| --- | --- | --- |
| Incendio con llamada | Command, Response, Fleet | Guion, creación del caso y camión en movimiento |
| Accidente sin heridos | Citizen, Command, Response | Apoyo vial y grúa con misiones distintas |
| Inundación y evacuación | Command, Citizen, Shelter, Logistics | Alerta, refugio abierto y entrega de suministros |
| Simulacro empresarial | Enterprise, Academy, Command | Check-in sin duplicados y acciones correctivas |
| Avería de ambulancia | Fleet, Command, Response, Care | Sustitución de recurso y aviso al destino |
| Hospital sin capacidad | Care, Command, Response | Rechazo motivado y destino alternativo aceptado |
| Pérdida de conexión | Citizen, Command | Borrador pendiente, reintento y un solo incidente |
| Terremoto demo | Command, Intelligence, Shelter, Community | Múltiples casos, tareas y recursos limitados |
| Fusión incorrecta | Citizen, Command, Trust | Separación auditada sin mezclar fichas privadas |
| Fin de turno | Command, Fleet | Relevo aceptado y continuidad de casos |

Documenta los datos iniciales y los pasos de cada escenario. Los resultados son condiciones del dominio: no basta con que exista una pestaña que tenga el nombre del escenario.

# 185. PLAN DE PRUEBAS UNITARIAS Y DE CONTRATO

Prueba funciones donde un error altera el comportamiento: transiciones, ranking, elegibilidad, idempotencia, cálculo de métricas, rutas de la red demo, reservas, stock y permisos. Evita llenar la suite con tests que solo comparan textos fijos o replican la implementación.

Incluye casos límite: prioridad desconocida, coordenadas inválidas, ubicación antigua, ruta sin conexión, unidad fuera de servicio, capacidad cero, reserva vencida, evento repetido, versiones fuera de orden, incidente sin llegada y traslado cancelado.

Las pruebas de contrato comprueban equivalencia de comportamiento entre adaptadores. Usa reloj controlado y fixtures reproducibles. Un test no debe depender de que un proveedor externo gratuito responda. Para integraciones reales, separa una suite optativa con credenciales de prueba y documenta cuándo se ejecutó. El informe final distingue pruebas ejecutadas, fallidas, omitidas y no disponibles.

# 186. PRUEBAS END-TO-END MULTIUSUARIO

Utiliza Playwright con contextos independientes para ciudadano, dispatcher, responder y coordinador hospitalario en el backend compartido. En demo local utiliza pestañas del mismo origen con identidades demo por pestaña, tal como se documentó.

Comprueba que crear un incidente se refleja en otra sesión, que una asignación se confirma una sola vez, que la unidad puede aceptar, que el mapa avanza y que la resolución cambia los indicadores. No valides únicamente que apareció un toast; consulta la vista receptora y el estado persistido.

Incluye carreras controladas entre dos dispatchers, pérdida de conexión tras commit, reconexión con eventos omitidos y cambio de rol durante una sesión. Verifica que ningún usuario puede acceder a incidentes o archivos ajenos manipulando URLs. Una prueba de autorización debe llegar al backend o a las políticas de base de datos, no solo al guard de React.

# 187. VERIFICACIÓN VISUAL Y RESPONSIVE

Revisa Citizen y Response a 360, 390, 768 y 1024 px de ancho; Command, Care y Fleet a 1280, 1440 y 1920 px. Define comportamiento de degradación para Command en móvil: consulta y acciones esenciales, sin fingir que una consola de tres paneles cabe completa.

Captura pantallas de estado vacío, datos cargados, error, diálogo, mapa, formulario con teclado y texto ampliado. Verifica que no haya scroll horizontal accidental, controles ocultos, overlays que bloqueen SOS ni tablas con texto imposible de leer.

Comprueba tema claro y oscuro, movimiento reducido, navegación por teclado y alternativas textuales de mapa. Las capturas sirven como evidencia de layout, no como sustituto de pruebas funcionales. Corrige problemas concretos antes de añadir animaciones adicionales. No declares “responsive verificado” si solo se abrió la landing en escritorio.

# 188. OBJETIVOS DE RENDIMIENTO Y MEDICIÓN

Establece objetivos de ingeniería medibles para el entorno documentado: cambio de estado confirmado visible en otra sesión en menos de dos segundos en condiciones normales; controles locales con respuesta perceptible rápida; mapas que sigan siendo utilizables con cientos de elementos mediante clustering y capas apropiadas.

Define un escenario de carga, por ejemplo 500 incidentes activos simulados, 100 unidades y 20 sesiones operativas, junto con máquina, red y duración de prueba. Estos valores son objetivos de ensayo, no una garantía de capacidad de producción. Reporta resultados obtenidos y cuellos de botella.

Carga mapas, gráficos y PDF bajo demanda. Evita recalcular rutas en cada render y redibujar el mapa entero con cada coordenada. Agrupa telemetría, limita frecuencia de escrituras y mide consultas. Añade índices basados en patrones reales de acceso. Optimiza el componente que se haya identificado como costoso; no agregues memoización universal sin evidencia.

# 189. OBSERVABILIDAD Y DIAGNÓSTICO

Implementa logs estructurados con `requestId`, `correlationId`, operación, duración, resultado y fuente. Propaga la correlación desde creación de incidente a despacho, notificación y export. Esto debe permitir investigar un fallo sin buscar información médica en logs.

Mide tasas de error, latencia de comandos, retraso de outbox, jobs pendientes, reconexiones, telemetría antigua y fallos de proveedores. No confundas número de WebSockets abiertos con disponibilidad operacional del sistema.

El panel de diagnóstico permite ver una operación fallida con un mensaje seguro y enlace al caso autorizado. Agrega health checks de proceso y readiness de dependencias. Una dependencia opcional caída debe degradar su capacidad concreta. El frontend muestra acciones de recuperación y un identificador de soporte, no un stack trace. La instrumentación debe funcionar también en demo para que los fallos del escenario sean explicables.

# 190. BACKUPS, RESTAURACIÓN Y CAMBIOS DE ESQUEMA

Incluye scripts o procedimientos de backup para el backend seleccionado y restauración en un entorno aislado. Documenta qué incluye cada copia: SQL, archivos, configuraciones y metadatos. Una copia de la base de datos no necesariamente contiene los archivos de Storage.

Agrega un ejercicio de restauración con seed o datos ficticios: crear incidentes, respaldar, restaurar y verificar relaciones, recuentos y archivos. No declares recuperación probada sin ejecutar este recorrido.

Las migraciones tienen nombres, orden y propósito claro. Evita cambios destructivos sin estrategia de transición. Si cambia el formato de un evento o una configuración, mantén compatibilidad o migración explícita. Los objetivos de recuperación se documentan como metas de despliegue y deben validarse en el entorno elegido, sin inventar garantías de alta disponibilidad.

# 191. DESARROLLO LOCAL Y VARIABLES DE ENTORNO

Entrega `.env.example` con explicación de cada variable y ubicación de uso. Separa variables públicas de Vite y secretos de servidor. Configuración conceptual:

```env
VITE_APP_MODE=demo-local
VITE_API_BASE_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_MAP_PROVIDER=local
VITE_MAPBOX_TOKEN=
VITE_ENABLE_VOICE=false
VITE_ENABLE_AI=false

APP_ENV=development
APP_TIMEZONE=America/Costa_Rica
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
VOICE_PROVIDER=simulator
TWILIO_ACCOUNT_SID=
TWILIO_API_KEY=
TWILIO_API_SECRET=
TWILIO_TWIML_APP_SID=
AI_PROVIDER=rules
AI_API_KEY=
OUTBOUND_MESSAGING_ENABLED=false
DEMO_SEED_ENABLED=true
```

Valida configuración al iniciar. En `demo-local`, variables externas vacías son válidas. En modo compartido, una variable obligatoria ausente debe generar un error claro y no arrancar con permisos abiertos. Los nombres finales se adaptan a las versiones del proveedor y se documentan. Nunca incluyas valores reales de secretos en README, capturas o fixtures.

# 192. SCRIPTS, DOCKER Y ENTREGA EJECUTABLE

Define scripts reales y comprobables, ajustados al proyecto:

```text
npm install
npm run dev
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
npm run preview
npm run db:migrate
npm run db:seed
npm run demo:reset
```

No documentes un comando que no exista. `demo:reset` debe verificar modo, identificar datos del escenario y solicitar una confirmación contextual para borrar esos datos. `npm run dev` debe arrancar el modo local sin exigir claves externas.

Entrega Dockerfile reproducible con etapa de build, usuario de ejecución apropiado y health check cuando aplique. Si usas Supabase local, documenta claramente su CLI y los contenedores que necesita; no entregues un Compose de PostgreSQL vacío afirmando que incluye Auth, Realtime y Storage. Para otro backend, explica cómo se implementan esas capacidades. Evita montar secretos dentro de imágenes y preserva volúmenes cuando se reinicien servicios.

# 193. CI, ENTORNOS Y DESPLIEGUE

Configura integración continua con instalación basada en lockfile, chequeo de tipos, lint, tests relevantes y build. Ejecuta pruebas e2e sobre el modo demo o backend de prueba preparado. No expongas secretos en pull requests de origen no confiable.

Separa desarrollo, prueba y despliegue integrado. Las cuentas y datos demo no deben habilitarse accidentalmente en entornos no permitidos. Implementa un indicador de entorno derivado de configuración efectiva, no de una etiqueta editable sin restricciones.

Documenta hosting del frontend, backend, jobs, WebSockets, Storage y variables. Comprueba que el proveedor elegido soporta el patrón de ejecución; no asumas que una función de corta duración puede mantener un simulador autoritativo indefinidamente. Preparar el código no autoriza a llamar destinatarios externos, publicar alertas reales ni ampliar la audiencia de un despliegue. Entrega el estado exacto de lo desplegado y de lo que solo quedó preparado.

# 194. ESTRUCTURA DE CÓDIGO AMPLIADA

Mantén la estructura original y expándela con separación por dominio. Una estructura recomendada es:

```text
src/app                  router, providers y guards
src/products             layouts y navegación por producto
src/features             casos de uso y componentes de cada dominio
src/domain               tipos, políticas y máquinas de estado
src/data                 repositorios y contratos
src/integrations         mapas, voz, IA, notificaciones y storage
src/simulation           reloj, escenarios, eventos y rutas demo
src/design-system        tokens y componentes compartidos
src/i18n                 traducciones y formatos
server/application       comandos y consultas autorizadas
server/infrastructure    proveedores, jobs y persistencia
server/api               transporte y validación
supabase/migrations      esquema, funciones e índices
supabase/tests           pruebas de políticas y restricciones
public/demo              activos ficticios y red cartográfica
tests/contracts          paridad de adaptadores
tests/e2e                recorridos multiusuario
docs                     arquitectura, operación y evidencia
```

No dupliques lógica de negocio entre `server` y `supabase/functions`. Elige dónde vive cada comando y documenta la decisión. Si no necesitas una carpeta, no la crees vacía para simular arquitectura. Evita archivos gigantes que contengan todos los portales, tablas y componentes.

# 195. DOCUMENTACIÓN Y GUÍA PARA QUIEN PRESENTA

Además de los archivos originales, entrega `REQUIREMENTS.md`, `STATE_MACHINES.md`, `API.md`, `EVENTS.md`, `METRICS.md`, `INTEGRATIONS.md`, `RUNBOOK.md`, `TEST_REPORT.md`, `ASSET_LICENSES.md` y `KNOWN_LIMITATIONS.md`.

La guía de demo explica cómo abrir las ventanas, qué cuentas usar, cómo iniciar el escenario, qué acciones ejecutar, qué indicadores deben cambiar y cómo recuperar el estado si una pestaña se cierra. Incluye una versión breve para presentar y otra para revisar técnicamente.

El README debe indicar qué funciona sin credenciales, qué requiere backend compartido y qué adaptadores necesitan configuración. Incluye capturas obtenidas de la aplicación real cuando estén disponibles. Documenta decisiones con una explicación breve: problema, opción elegida y consecuencia. No llenes documentación con promesas genéricas de escalabilidad o seguridad.

# 196. MATRIZ FINAL DE ACEPTACIÓN POR PRODUCTO

| Producto | Prueba mínima de aceptación |
| --- | --- |
| Public | Navegación, recursos y acceso a demo funcionan sin links rotos |
| Citizen | Crear reporte, persistir y seguir el mismo caso desde otra sesión |
| Command | Validar y despachar con control de disponibilidad y permisos |
| Response | Aceptar, moverse, confirmar estados y conservar historial |
| Care | Aceptar traslado, reservar capacidad y confirmar entrega |
| Shelter | Admitir y trasladar registros sin duplicar ocupación |
| Fleet | Mantenimiento crítico impide asignación y activa sustitución |
| Logistics | Pedido, reserva y recepción cambian inventario correctamente |
| Enterprise | Simulacro registra participantes y genera acciones correctivas |
| Community | Tarea aprobada se asigna y verifica con acceso limitado |
| Academy | Seed reproducible y evaluación basada en eventos del ejercicio |
| Intelligence | Métricas y export coinciden con datos y filtros |
| Connect | Prueba de proveedor informa capacidad, resultado y modo real |
| Trust | Revocar permiso impide nuevas lecturas dentro de su alcance |
| Status | Muestra salud medida o simulada con fuente identificable |
| Wallboard | Refleja operación con permisos de lectura y privacidad |

No declares el ecosistema completo mientras alguno de sus productos sea una pantalla decorativa. Si una parte queda bloqueada, identifícala con precisión y entrega el recorrido demo que sí se pudo verificar.

# 197. ORDEN DE IMPLEMENTACIÓN AMPLIADO

1. Inspección, decisiones, matriz de requisitos y sistema visual.
2. Dominio, contratos, persistencia, autenticación y separación de permisos.
3. Recorrido Citizen → Command → Response con incidente mínimo persistente.
4. Despacho transaccional, red demo, movimiento y sincronización.
5. Formularios, perfiles, consentimientos, mensajes y multimedia.
6. Llamadas simuladas, asistencia por reglas y detección de duplicados.
7. Care, traslados y capacidad; después Fleet e inspecciones.
8. Alertas, Shelter y Logistics conectados a un evento mayor.
9. Enterprise, Community y Academy mediante escenarios compartidos.
10. Intelligence, métricas, PDF y replay.
11. Connect, adaptadores externos y observabilidad.
12. Pruebas negativas, concurrencia, offline, responsive y accesibilidad.
13. Correcciones, documentación, empaquetado y reporte final de verificación.

Estas son fases internas de ejecución, no entregas ficticias. Mantén una versión arrancable durante el proceso y ejecuta comprobaciones cuando resuelvan un riesgo concreto. No pospongas toda la seguridad y toda la integración al último día. Continúa con trabajo autorizado sin pedir confirmación por cada decisión rutinaria.

# 198. CONDICIONES QUE IMPIDEN DARLO POR TERMINADO

El proyecto no está terminado si hay botones sin acción, rutas anunciadas sin implementación, errores de TypeScript ignorados, pantallas blancas, datos demo que cambian aleatoriamente al navegar o indicadores que no derivan de la base de datos.

Tampoco está terminado si dos dispatchers pueden comprometer la misma unidad, un ciudadano ve casos ajenos, el administrador técnico accede a fichas médicas por defecto, el mapa sigue moviendo vehículos sin fuente identificada o se afirma recepción antes de que exista confirmación.

Una integración no está verificada si solo existe una variable de entorno o un archivo de servicio. Una PWA no está comprobada porque tenga un manifest. Un reporte no está correcto porque se descargue: debe abrirse, respetar permisos y coincidir con los datos. El informe final debe separar alcance implementado, evidencia disponible y limitaciones externas, sin esconderlas detrás de la palabra “completo”.

# 199. REFERENCIAS TÉCNICAS Y VERIFICACIÓN DE DEPENDENCIAS

Antes de implementar, comprueba versiones estables compatibles y documentación oficial. Reutiliza el lockfile de un proyecto existente cuando sea apropiado; no actualices todas sus dependencias sin necesidad. Las fuentes siguientes sirven para validar capacidades específicas, no como autorización para copiar aplicaciones completas:

| Referencia consultada | Punto que fundamenta |
| --- | --- |
| [Supabase Realtime Authorization](https://supabase.com/docs/guides/realtime/authorization) | Autorización de Broadcast/Presence, canales privados y relación con RLS |
| [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) | Motor de renderizado, fuentes, estilos y capas |
| [Twilio Voice JavaScript quickstart](https://www.twilio.com/docs/voice/sdks/javascript/get-started) | Componentes necesarios para telefonía desde navegador |
| [MDN Background Synchronization API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API) | Disponibilidad limitada y contexto seguro de sincronización diferida |

No hardcodees precios, cuotas, compatibilidades o políticas comerciales sin verificarlos al desarrollar. Las integraciones sugeridas son decisiones de arquitectura de este prompt; deben probarse en el entorno final. Registra versión y fecha de las dependencias utilizadas y distingue documentación consultada de pruebas ejecutadas.

# 200. ENTREGA FINAL Y DEMOSTRACIÓN DE CALIDAD

Entrega el repositorio completo y ejecutable, con lockfile, scripts, migraciones, seed, activos, `.env.example`, documentación y pruebas relevantes. Si se solicita ZIP, empaqueta código fuente y recursos necesarios, excluyendo secretos, `node_modules`, cachés y datos personales. Valida que el paquete se pueda extraer y arrancar siguiendo el README.

Incluye una tabla final con producto, flujo implementado, modo probado, evidencia y limitaciones. Reporta comandos ejecutados y sus resultados reales. No afirmes que una prueba pasó si no se pudo ejecutar por falta de navegador, servicio o credenciales.

La demostración final debe mostrar al menos Citizen, Command, Response y Care sobre el mismo incidente, además de un evento mayor que conecte alertas, refugios y logística. La identidad visual debe ser consistente, la navegación clara y los cambios persistentes. El resultado esperado es un ecosistema de simulación con profundidad operacional y una implementación revisable, capaz de mostrar por qué cada módulo existe y cómo contribuye a la coordinación.

**Principio de entrega: cada acción importante produce un cambio autorizado, persistido, observable y verificable en las aplicaciones que corresponden.**

---

# 201. INSTRUCCIÓN FINAL PARA CODEX

Analiza primero toda esta especificación.

Después inspecciona cualquier proyecto existente antes de modificarlo.

Si el proyecto está vacío, crea la arquitectura apropiada desde cero.

No elimines funcionalidades existentes útiles sin necesidad.

No introduzcas dependencias simplemente por decoración.

Selecciona versiones estables y compatibles de las librerías.

Cuando una integración externa requiera API key:

1. crea la integración;
2. utiliza variables de entorno;
3. crea fallback de demostración;
4. documenta configuración.

No dejes funciones incompletas marcadas como terminadas.

No sustituyas funcionalidad por screenshots.

No hagas botones falsos.

No generes datos médicos reales.

No utilices información personal real.

No copies identidades institucionales.

Crea datos ficticios coherentes para el Demo Mode.

Construye una experiencia suficientemente completa para que pueda demostrarse desde varias ventanas con identidades aisladas y persistencia compartida según el modo:

```text
VENTANA 1
PULSE CITIZEN

VENTANA 2
PULSE COMMAND

VENTANA 3
PULSE RESPONSE

```

y que las tres reaccionen al mismo incidente.

Antes de considerar terminado el proyecto:

```text
npm install
npm run build
npm run test

```

Corrige errores de TypeScript.

Corrige imports.

Corrige rutas.

Corrige warnings relevantes.

Verifica que no exista pantalla blanca.

Verifica responsive.

Verifica que Demo Mode funcione sin servicios de pago.

Verifica la demostración completa:

```text
CIUDADANO
→ INCIDENTE
→ OPERADOR
→ DESPACHO
→ UNIDAD
→ MOVIMIENTO
→ LLEGADA
→ RESOLUCIÓN
→ ANALYTICS

```

Finalmente entrega:

1. código completo;
2. estructura ordenada;
3. migraciones de base de datos;
4. seed;
5. `.env.example`;
6. README profesional;
7. instrucciones de instalación;
8. usuarios demo;
9. documentación de arquitectura;
10. documentación de seguridad;
11. documentación de Demo Mode;
12. aplicación lista para ejecutar;
13. portales ampliados con sus recorridos funcionales;
14. contratos de API, eventos y máquinas de estado;
15. escenarios reproducibles y reporte de pruebas ejecutadas;
16. inventario de integraciones verificadas y límites conocidos;
17. documentación de licencias de activos y de los modos de ejecución.

# PULSE 911

### Sistema Integrado de Coordinación, Atención y Respuesta a Emergencias

**Emergency Response Simulation Platform**

**Coordinar. Responder. Proteger.**

**ENTORNO DE DEMOSTRACIÓN — NO CONECTADO A SERVICIOS DE EMERGENCIA REALES.**

---

# ANEXO TÉCNICO — PRECISIONES PARA IMPLEMENTAR EL PROMPT EN CÓDIGO

Este anexo complementa las 201 secciones anteriores. El texto original permanece íntegro, con sus nombres, productos, funcionalidades, estilo, tecnologías y alcance. Las precisiones siguientes convierten requisitos existentes en contratos, reglas de implementación y pruebas. No agregan nuevos productos ni sustituyen decisiones del documento base.

Los tipos y fragmentos son contratos de referencia para desarrollar la aplicación; no constituyen una aplicación ejecutada o verificada. Los valores marcados como parámetros de demostración son valores iniciales configurables, no protocolos clínicos ni garantías de servicio. Si un proyecto existente ya resuelve correctamente una decisión técnica permitida por el documento, conserva su implementación y documenta la equivalencia.

## A01. Cómo convertir cada requisito en una tarea de programación

Por cada función existente, registra una fila con `requirementId`, secciones de origen, ruta, actor, datos de entrada, precondiciones, comando o consulta, cambios persistentes, evento, proyección receptora y prueba de aceptación. Usa identificadores estables como `INC-CREATE-001` o `DSP-ASSIGN-001`.

La unidad de trabajo debe ser una conducta observable. Por ejemplo: “crear incidente” incluye formulario, validación, persistencia, autorización, confirmación y recepción en Command. Crear solo `IncidentForm.tsx` no completa ese requisito.

Para cada tarea aplica esta secuencia: definir contrato → escribir reglas de dominio → implementar persistencia → exponer operación autorizada → conectar interfaz → actualizar proyecciones → verificar el recorrido. No es necesario automatizar pruebas de detalles decorativos reversibles; sí deben probarse permisos, transiciones y consistencia.

Antes de programar una pantalla, identifica qué consulta la alimenta y qué comando corresponde a cada botón. Si un botón no tiene una operación o navegación definida, completa su especificación antes de mostrarlo como funcional.

## A02. Convenciones de contratos y representación

Usa `snake_case` para columnas SQL, `camelCase` para objetos TypeScript y JSON y los códigos de enum originales para estados. Realiza la conversión en un mapper de infraestructura. No almacenes etiquetas traducidas como estados de base de datos.

| Concepto | Contrato |
| --- | --- |
| Identificador interno | UUID; se valida en la frontera de entrada |
| Código público | String legible generado por servidor; nunca autoriza acceso |
| Fecha | ISO 8601 en UTC para intercambio; `timestamptz` en SQL |
| Duración | Segundos numéricos; formato humano solo en presentación |
| Distancia | Metros; conversión a kilómetros solo en presentación |
| Coordenadas DTO | `{ latitude, longitude }` |
| Coordenadas GeoJSON | `[longitude, latitude]` |
| Dato desconocido | `null`, no cero, cadena vacía o un valor inventado |
| Booleano no respondido | `true`, `false` o `null` cuando corresponda |
| Versión | Entero positivo que incrementa cada mutación del agregado |
| Colección vacía | `[]`; no `null` para listas devueltas correctamente |

No uses una misma variable para hora real y hora del escenario. Para operaciones demo dependientes del tiempo, inyecta `Clock`; para sesión, expiración técnica e idempotencia utiliza reloj de servidor. Un cliente puede proponer hora de captura de telemetría, pero no la hora autoritativa de recepción.

## A03. Tipos del núcleo operacional

Conserva los códigos originales y utiliza tipos cerrados equivalentes a estos:

```ts
type UUID = string;
type ISODateTime = string;
type Priority = 'P1' | 'P2' | 'P3' | 'P4';
type AppMode = 'demo-local' | 'demo-shared' | 'integrated-sandbox';

type IncidentStatus =
  | 'received' | 'under_review' | 'validated' | 'awaiting_dispatch'
  | 'dispatched' | 'units_en_route' | 'on_scene' | 'controlled'
  | 'resolved' | 'closed' | 'cancelled' | 'rejected';

type IncidentSource =
  | 'citizen_app' | 'sos' | 'web' | 'call' | 'operator' | 'sensor_demo';

type LocationSource = 'gps' | 'map_pin' | 'address' | 'saved_place';

interface IncidentLocationInput {
  latitude: number | null;
  longitude: number | null;
  accuracyMeters: number | null;
  address: string | null;
  reference: string | null;
  source: LocationSource;
  capturedAt: ISODateTime | null;
}

type AnswerValue = string | number | boolean | null | string[];

interface CreateIncidentInput {
  clientRequestId: UUID;
  typeCode: string;
  title: string;
  description: string;
  peopleAffected: number | null;
  source: IncidentSource;
  location: IncidentLocationInput;
  answers: Record<string, AnswerValue>;
  questionnaireVersion: string;
  communicationMode: 'voice_available' | 'cannot_speak' | 'unsafe_to_speak';
  reportingFor: 'self' | 'household_member' | 'witness';
  representedPersonId: UUID | null;
  attachmentIds: UUID[];
}

interface IncidentRecord {
  id: UUID;
  organizationId: UUID;
  publicCode: string;
  typeId: UUID;
  status: IncidentStatus;
  priority: Priority | null;
  suggestedPriority: Priority | null;
  title: string;
  description: string;
  peopleAffected: number | null;
  source: IncidentSource;
  currentLocationId: UUID;
  createdBy: UUID;
  receivedAt: ISODateTime;
  validatedAt: ISODateTime | null;
  resolvedAt: ISODateTime | null;
  closedAt: ISODateTime | null;
  majorEventId: UUID | null;
  version: number;
}
```

`UUID = string` mejora legibilidad, pero no valida un UUID por sí solo. Los esquemas de entrada deben hacerlo. `IncidentRecord` es un modelo interno: no se envía íntegro a todos los roles. El servidor establece actor, organización responsable, código, estado, versión y timestamps. La prioridad sugerida nunca reemplaza automáticamente la validada.

## A04. Validaciones concretas de creación de incidentes

Aplica estos límites iniciales de demostración tanto en cliente como servidor; centralízalos en configuración tipada:

| Campo | Validación | Error de campo |
| --- | --- | --- |
| `typeCode` | Debe existir y estar activo | “Selecciona un tipo disponible.” |
| `title` | 3–120 caracteres tras quitar espacios exteriores | “El título debe tener entre 3 y 120 caracteres.” |
| `description` | Hasta 4.000 caracteres; puede estar vacía si el reporte guiado aporta lo mínimo | “La descripción supera el máximo permitido.” |
| `peopleAffected` | Entero no negativo o `null` | “Indica una cantidad válida o selecciona desconocido.” |
| Latitud | Entre −90 y 90 o `null` | “La latitud no es válida.” |
| Longitud | Entre −180 y 180 o `null` | “La longitud no es válida.” |
| Precisión | Número no negativo o `null` | “La precisión no es válida.” |
| Dirección | Hasta 500 caracteres | “La dirección es demasiado larga.” |
| Referencia | Hasta 1.000 caracteres | “La referencia es demasiado larga.” |
| `attachmentIds` | Sin duplicados; pertenecen a la sesión y a una carga permitida | “No se puede adjuntar uno de los archivos.” |
| Persona representada | Relación autorizada o ausencia de identificación personal | “No tienes permiso para usar ese perfil.” |

Las coordenadas se informan juntas o ambas quedan nulas. Cuando la fuente es GPS o pin de mapa, exige ambas. Si solo existe dirección escrita, permite recepción con ubicación pendiente de confirmar; el despacho requerirá un punto confirmado. No inventes coordenadas para superar la validación.

Permite un reporte mínimo con categoría, ubicación o referencia suficiente para revisión, modo de comunicación y las respuestas disponibles. Campos desconocidos no bloquean indebidamente la recepción. Si el formulario no pide un dato, no lo exijas ocultamente al enviar.

## A05. Formularios dinámicos sin lógica duplicada

Representa cada pregunta mediante `key`, `labelKey`, `inputType`, `requiredWhen`, `visibleWhen`, `options`, `min`, `max` y `helpKey`. Las condiciones se expresan con operadores permitidos sobre respuestas, no con JavaScript ejecutable recibido desde la base.

Ejemplo de contrato de pregunta:

```ts
interface ReportQuestion {
  key: string;
  labelKey: string;
  inputType: 'tri_state' | 'integer' | 'text' | 'select' | 'multiselect';
  requiredWhen: 'always' | 'never' | { field: string; equals: AnswerValue };
  visibleWhen: 'always' | { field: string; equals: AnswerValue };
  options?: Array<{ value: string; labelKey: string }>;
  min?: number;
  max?: number;
}
```

Para accidente vehicular define claves estables: `vehicleCount`, `injuredPeople`, `trappedPeople`, `smoke`, `fire`, `fuelLeak`, `roadBlocked` y `heavyVehicle`. Los campos de sí/no admiten desconocido. El servidor valida las respuestas contra la versión exacta del cuestionario guardada en el reporte.

Si una respuesta deja de ser relevante al cambiar de categoría, retírala del payload activo y conserva el borrador local solamente si sirve para volver atrás. No permitas que una respuesta invisible antigua cambie la recomendación del nuevo tipo de emergencia. Versionar el cuestionario no altera reportes históricos.

## A06. Esquema SQL del núcleo: campos y restricciones

El esquema físico puede normalizar detalles, pero debe conservar estas relaciones y restricciones. UUID implica PK o FK según la columna. Los campos comunes de auditoría no deben sustituir la bitácora de cambios.

| Tabla | Campos específicos mínimos | Restricciones |
| --- | --- | --- |
| `incidents` | `id`, `organization_id`, `public_code`, `type_id`, `status`, `priority`, `suggested_priority`, `title`, `description`, `people_affected`, `source`, `current_location_id`, timestamps, `version` | Código único dentro del ámbito documentado; versión positiva; tipo existente |
| `incident_reporters` | `incident_id`, `reporter_id`, `reporting_for`, `represented_person_id`, `created_at` | Relación autorizada; no convertir informante en dueño del perfil afectado |
| `incident_locations` | `id`, `incident_id`, coordenadas, precisión, dirección, fuente, `captured_at`, `created_by`, `created_at` | Coordenadas completas o ambas nulas; conservar revisiones |
| `incident_timeline` | `id`, `incident_id`, `event_id`, `event_type`, `occurred_at`, `actor_id`, `visibility`, `summary` | Evento único por proyección; lectura por audiencia |
| `response_units` | `id`, `organization_id`, `station_id`, `code`, `unit_type_id`, `status`, `technical_status`, `version` | Código único por organización; estados válidos |
| `dispatches` | `id`, `incident_id`, `unit_id`, `status`, `assigned_by`, `sent_at`, `accepted_at`, `ended_at`, `version` | Integridad de organización o ayuda mutua; unidad existente |
| `unit_reservations` | `id`, `unit_id`, `dispatch_id`, `status`, `expires_at` | Una reserva o compromiso activo incompatible por unidad |
| `unit_locations` | `id`, `unit_id`, `source_session_id`, `sequence`, coordenadas, precisión, `captured_at`, `received_at` | Único por unidad, sesión de origen y secuencia |
| `incident_assignments` | `id`, `incident_id`, `user_id`, `assignment_role`, `valid_from`, `valid_until` | Intervalo válido y pertenencia autorizada |
| `calls` | `id`, `organization_id`, `incident_id`, `status`, `provider`, `provider_call_id`, timestamps | ID externo único por proveedor cuando exista |

Utiliza FK compuestas o validación transaccional equivalente para impedir relaciones entre organizaciones no autorizadas. Agrega índices para cola por organización/estado/prioridad/recepción; misiones activas por unidad; timeline por caso/fecha; ubicaciones por unidad/fecha. Define índices espaciales solo donde se ejecuten consultas espaciales.

No uses `ON DELETE CASCADE` indiscriminadamente en auditoría, historial y casos cerrados. Para cada FK decide restricción, conservación o eliminación conforme a retención. Evita un círculo de inserción entre incidente y ubicación actual: inserta el incidente y ubicación dentro de la misma transacción usando una referencia inicialmente nullable o una restricción diferible documentada.

## A07. Separación de vistas según actor

Implementa DTO diferentes para las consultas siguientes:

| DTO | Contiene | Excluye |
| --- | --- | --- |
| `CitizenIncidentView` | Código, estado público, ubicación del caso, sus archivos, timeline público, unidades relacionadas autorizadas y ETA | Notas internas, otros informantes, tácticas, flota no relacionada |
| `CommandIncidentView` | Datos operacionales, riesgos reportados, llamadas, asignaciones y recomendaciones | Ficha médica completa por defecto |
| `ResponderMissionView` | Misión asignada, ubicación, riesgos, estado y datos autorizados de atención | Búsqueda global de ciudadanos |
| `CareTransferView` | Solicitud dirigida a su instalación, ETA y necesidades de recepción autorizadas | Traslados ajenos y expediente clínico global |
| `AnalystAggregateView` | Conteos, duraciones, segmentos y calidad de medición | Identificadores y ubicaciones individuales sensibles |

Construye estas proyecciones en el servidor o en consultas protegidas equivalentes. No descargues una entidad completa y borres campos en React. El frontend puede ocultar controles adicionales, pero eso no protege datos que ya recibió.

Al revocar un permiso, las consultas posteriores deben negarse. Invalida cachés y suscripciones de ese actor y evita incluir contenido sensible en eventos que puedan seguir circulando. El historial de accesos sensibles identifica finalidad y caso sin copiar el contenido leído.

## A08. Contrato uniforme de API

Usa el prefijo `/api/v1` definido en el documento y una respuesta equivalente a esta:

```ts
interface ApiSuccess<T> {
  data: T;
  meta: {
    requestId: UUID;
    serverTime: ISODateTime;
    mode: AppMode;
  };
}

interface ApiFailure {
  error: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string[]>;
    retryable: boolean;
  };
  meta: { requestId: UUID; serverTime: ISODateTime };
}
```

Responde 201 al crear, 200 al consultar o confirmar un comando finalizado y 202 cuando se creó un job cuya terminación es posterior. Usa 401 para sesión ausente, 403 para acción no permitida dentro de un contexto visible, 404 para recursos inexistentes o no revelables, 409 para conflicto de versión/disponibilidad, 422 para validación y 503 para una dependencia requerida no disponible.

Para listas, utiliza `limit` inicial 25 y máximo 100 como parámetro demo, cursor opaco y orden estable, por ejemplo fecha e ID. Los filtros permitidos se validan mediante allowlist. Una búsqueda no debe exponer IDs ocultos mediante sus conteos.

## A09. Operaciones HTTP del recorrido principal

| Operación | Entrada específica | Resultado y efectos |
| --- | --- | --- |
| `POST /incidents` | `CreateIncidentInput` y `Idempotency-Key` | 201; incidente recibido, ubicación, informante y evento |
| `GET /incidents/:id` | ID y sesión | 200 con proyección por actor |
| `POST /incidents/:id/validate` | `expectedVersion`, `priority`, `reason`, datos revisados | Nueva versión, validación y evento |
| `POST /incidents/:id/dispatches` | `unitId`, `expectedIncidentVersion`, `expectedUnitVersion`, `recommendationId` opcional, `reason` | Despacho y reserva atómicos; conflicto si no elegible |
| `POST /dispatches/:id/accept` | `expectedVersion` | Confirmación o conflicto por vencimiento/cancelación |
| `POST /missions/:id/transitions` | `targetStatus`, `expectedVersion`, `reason`, ubicación opcional | Cambio de misión y efectos derivados permitidos |
| `POST /units/:id/location-batches` | Sesión de origen y muestras ordenadas | Aceptados, duplicados y rechazados; sin doble inserción |
| `POST /transfers` | `missionId`, `facilityId`, necesidades autorizadas, versión | Solicitud de recepción vinculada |
| `POST /transfers/:id/accept` | `expectedVersion`, recurso de capacidad y cantidad | Reserva confirmada o conflicto |
| `POST /incidents/:id/resolve` | `expectedVersion`, `outcome`, `reason` | Resolución cuando cumple precondiciones |
| `POST /incidents/:id/close` | `expectedVersion`, `closureSummary` | Cierre y evento; no genera por sí solo hechos faltantes |
| `POST /reports` | Plantilla, caso o filtros y formato | Job autorizado de exportación |

Las rutas de resolver y cerrar concretan las acciones ya solicitadas. No introducen nuevos procesos. Los nombres finales deben constar en OpenAPI y en los clientes tipados. Mantén alineados los esquemas de entrada y la implementación; no documentes endpoints ficticios.

## A10. Creación de incidente: secuencia implementable

1. Leer sesión o identidad de invitado demo y validar entrada.
2. Resolver la organización receptora desde jurisdicción o configuración autorizada; no aceptar un `organizationId` arbitrario del ciudadano.
3. Comprobar propiedad de adjuntos y autorización de perfil representado.
4. Reclamar clave de idempotencia dentro del ámbito actor/operación.
5. Abrir transacción, generar ID y código, guardar incidente, informante, ubicación y respuestas versionadas.
6. Guardar evento de creación y outbox en la misma transacción; registrar resultado idempotente.
7. Confirmar transacción y devolver código, ID, estado, versión y timestamp de recepción.
8. Publicar la actualización para usuarios autorizados y crear notificaciones mediante consumidor idempotente.
9. Citizen navega al detalle con la respuesta confirmada; Command actualiza su cola desde el mismo dato.

Si falla antes del commit, no existe un incidente parcialmente creado. Si se pierde la respuesta después del commit, reintentar con la misma clave devuelve el incidente creado. La ausencia de coordenadas confirmadas mantiene la validación de ubicación pendiente, sin impedir conservar el reporte mínimo recibido.

## A11. Transiciones exactas del incidente

Conserva los estados de la sección 80. Usa una tabla de transiciones permitidas equivalente a la siguiente:

| Origen | Destino | Actor o disparador | Condición |
| --- | --- | --- | --- |
| `received` | `under_review` | Recepcionista autorizado | Caso visible y versión actual |
| `under_review` | `validated` | Recepcionista/supervisor con permiso | Categoría y prioridad revisadas; ubicación con estado explícito |
| `validated` | `awaiting_dispatch` | Operación de coordinación | Se requieren recursos y hay ubicación confirmada |
| `awaiting_dispatch` | `dispatched` | Asignación confirmada | Existe al menos un despacho enviado activo |
| `dispatched` | `units_en_route` | Evento de misión | Al menos una unidad confirmó salida |
| `dispatched` o `units_en_route` | `on_scene` | Evento de misión | Existe llegada confirmada válida |
| `on_scene` | `controlled` | Coordinador autorizado | Registra situación controlada en el escenario |
| `on_scene` o `controlled` | `resolved` | Coordinador/supervisor | No quedan tareas críticas sin resolver o excepción autorizada |
| `validated` o `awaiting_dispatch` | `resolved` | Supervisor | Resolución sin despliegue con motivo explícito |
| `resolved` | `closed` | Permiso de cierre | Resumen y disposición final de recursos registrados |
| `received` o `under_review` | `rejected` | Recepcionista/supervisor | Motivo explícito; nunca rechazo automático por score |

La cancelación es un comando diferente: antes de recursos comprometidos puede aceptarse dentro del permiso ciudadano; después necesita revisión operacional y liberación controlada. La reapertura de un caso `resolved` o `closed` requiere supervisor, motivo y evento; vuelve a revisión conservando el historial y sus ciclos.

No rebajes automáticamente `on_scene` porque otra unidad siga en ruta. Los estados individuales se muestran en su lista. Si todos los despachos previos a llegada son rechazados o cancelados, devuelve el caso a espera de despacho mediante evento explícito de coordinación. Una llegada automática inferida por distancia es sugerencia; la confirmación de llegada sigue el flujo original.

## A12. Asignación concurrente y ciclo de despacho

El comando `AssignUnit` debe ejecutar autorización, comprobación de versiones y elegibilidad dentro de la misma transacción que crea la asignación. Establece un orden fijo de bloqueos: incidente y después unidades ordenadas por ID cuando haya varias. Esto reduce bloqueos cruzados.

Utiliza estados técnicos del despacho equivalentes a `proposed`, `reserved`, `sent`, `accepted`, `in_progress`, `completed`, `rejected`, `cancelled`, `expired`. Son la codificación del recorrido descrito en la sección 156, no sustituyen el estado de la unidad.

Una reserva demo puede durar inicialmente 60 segundos del reloj autoritativo que corresponda al escenario; guarda `expiresAt` y configura el valor. Mientras la unidad está comprometida existe una restricción persistente que impide otra asignación incompatible. Al aceptar, cambia el compromiso sin abrir una ventana en que parezca disponible.

Antes de confirmar una asignación, vuelve a comprobar mantenimiento, tripulación, capacidades, geolocalización y jurisdicción. Las recomendaciones pueden estar desactualizadas. Si falla, devuelve `UNIT_UNAVAILABLE`, `UNIT_NOT_ELIGIBLE` o `VERSION_CONFLICT`, según corresponda, y no deja reserva parcial. Rechazo o expiración notifica al dispatcher y libera únicamente el compromiso de ese despacho.

## A13. Idempotencia y outbox: comportamiento preciso

La clave idempotente se identifica mediante organización, actor, nombre de comando y clave enviada. Calcula un hash de una serialización canónica de la entrada validada. Conserva estado `processing`, `succeeded` o `failed`, resultado y expiración técnica. Como valor inicial demo, conserva resultados de comandos 24 horas; documenta que reintentos posteriores siguen sujetos a restricciones naturales y no a deduplicación indefinida.

La reclamación de la clave debe ser atómica. Si dos peticiones llegan juntas, una procesa y la otra recibe el resultado ya disponible o un estado recuperable `COMMAND_IN_PROGRESS`; nunca ejecutan ambos comandos. Un error de validación previo no debe bloquear una corrección legítima con una clave nueva.

Outbox contiene `eventId`, `payload` mínimo, `createdAt`, `attempts`, `availableAt`, `lockedUntil`, `publishedAt` y un error seguro. El worker reclama trabajos mediante una lease recuperable. Tras un fallo, aumenta intentos y programa reintento. Un proceso que muere no deja el evento bloqueado para siempre.

La entrega repetida es válida. Cada consumidor registra el ID procesado de forma atómica con su efecto: notificación, proyección o export. Para una notificación por usuario, establece unicidad por destinatario, evento y tipo. No deduzcas consistencia de un `setTimeout` en el navegador.

## A14. Contratos de repositorios y separación de autoridad

Define interfaces con la semántica siguiente; adapta nombres a la estructura existente sin duplicar operaciones:

```ts
interface IncidentReadRepository {
  getCitizenView(id: UUID): Promise<CitizenIncidentView>;
  getCommandView(id: UUID): Promise<CommandIncidentView>;
  list(query: IncidentListQuery): Promise<IncidentPage>;
}

interface IncidentCommands {
  create(input: CreateIncidentInput, idempotencyKey: string): Promise<IncidentReceipt>;
  validate(input: ValidateIncidentInput): Promise<IncidentReceipt>;
  resolve(input: ResolveIncidentInput): Promise<IncidentReceipt>;
  close(input: CloseIncidentInput): Promise<IncidentReceipt>;
}

interface DispatchCommands {
  assign(input: AssignUnitInput, idempotencyKey: string): Promise<DispatchReceipt>;
  accept(input: AcceptDispatchInput, idempotencyKey: string): Promise<DispatchReceipt>;
  reject(input: RejectDispatchInput): Promise<DispatchReceipt>;
}
```

Los DTO referenciados se implementan a partir de A07–A12; el fragmento no debe copiarse dejando tipos inexistentes. En el cliente, las implementaciones llaman al backend. La sesión se deriva del token o cookie validada, no de un `actorId` enviado libremente.

En `demo-local`, los adaptadores ejecutan reglas equivalentes sobre IndexedDB y una cola de comandos serializada o transacciones locales. La identidad por pestaña es una conveniencia de simulación. Las pruebas de seguridad real se ejecutan contra `demo-shared` o el sandbox integrado, donde el servidor y RLS son autoridad.

## A15. Eventos, suscripciones y actualización de vistas

Reutiliza el sobre `DomainEvent<T>` de la sección 159. Establece un registro tipado de payloads mínimos:

| Evento | Payload mínimo | Consumidores autorizados |
| --- | --- | --- |
| `incident.created` | ID del caso, código, versión | Cola Command y proyección Citizen |
| `incident.validated` | ID, versión, prioridad validada | Command y vista ciudadana permitida |
| `dispatch.assigned` | Despacho, incidente, unidad y versión | Command, Response y seguimiento autorizado |
| `dispatch.accepted` | Despacho, timestamp y versión | Command y proyecciones del caso |
| `unit.location.updated` | Unidad, secuencia, hora y referencia de muestra | Mapas con permiso de seguimiento |
| `mission.arrived` | Misión, incidente, hora y versión | Caso, unidad y timeline |
| `transfer.accepted` | Traslado, instalación, reserva y versión | Care, Command y Response asignado |
| `incident.resolved` | Incidente, hora y versión | Citizen, Command y métricas |
| `alert.published` | Alerta, versión y vigencia | Servicio de destinatarios y feed público |
| `inventory.delivery.received` | Entrega y versión | Logistics y destino autorizado |

No publiques el mismo payload sensible a todos los consumidores. El router de eventos selecciona audiencia y proyección; un canal privado no concede por sí solo acceso a todos los casos de la organización.

La secuencia de recuperación debe ser consistente: obtener un snapshot asociado a un watermark de eventos y suscribirse o recuperar todos los eventos posteriores, sin dejar una ventana entre ambas operaciones. Si el proveedor requiere suscribirse primero, bufferiza eventos mientras recuperas el snapshot y aplica después versiones posteriores. Detecta huecos y recarga el agregado. No uses únicamente timestamps de cliente como cursor.

## A16. Mapa, ruta y simulación del desplazamiento

Usa un contrato de ruta como referencia:

```ts
interface RouteResult {
  routeId: UUID;
  provider: string;
  simulated: boolean;
  geometry: { type: 'LineString'; coordinates: [number, number][] };
  distanceMeters: number;
  durationSeconds: number | null;
  calculatedAt: ISODateTime;
  constraintsApplied: string[];
  warnings: string[];
}
```

La geometría necesita al menos dos puntos y no admite números no finitos. Para la red local, representa nodos, aristas, longitud en metros, velocidad demo, dirección permitida y bloqueos. Implementa un algoritmo de camino mínimo, por ejemplo Dijkstra, sobre costes de tiempo no negativos. Si no existe camino, devuelve `ROUTE_UNAVAILABLE`; no inventes un segmento atravesando obstáculos.

Precalcula longitudes acumuladas. En cada tick autoritativo, calcula avance desde tiempo transcurrido y velocidad del escenario, ubica el segmento correspondiente e interpola la posición. Actualiza heading desde la dirección del segmento no degenerado. Al terminar la ruta, detén avance y solicita o registra la confirmación de llegada conforme a las reglas del escenario.

Separa la frecuencia de simulación de la frecuencia de renderizado. Como valores demo iniciales usa muestra de ubicación cada 2 segundos y animación visual con el mecanismo de frames del navegador. Si el tick se retrasa, calcula por tiempo transcurrido; no sumes “un paso” por cada callback y alteres la velocidad por carga del equipo.

## A17. Telemetría antigua, recálculo y ETA

Cada lote identifica `unitId`, `sourceSessionId` y `samples`. Cada muestra lleva `sequence`, `latitude`, `longitude`, `accuracyMeters`, `headingDegrees`, `speedMetersPerSecond`, `capturedAt`. `receivedAt` lo establece el servidor. Valida tamaños de lote y orden; permite rechazos parciales con detalle por muestra, sin perder las válidas.

Define inicialmente `staleAfterSeconds = 15` y `lostAfterSeconds = 60` como parámetros demo. Una unidad sin muestras recientes conserva su última posición con aviso. La UI no sigue desplazándola como si fueran datos conocidos. Un timestamp viejo no reemplaza la muestra actual, aunque pueda archivarse para replay.

El ETA debe incluir `estimatedArrivalAt`, `durationRemainingSeconds`, `source`, `calculatedAt` y `quality`, usando `null` cuando no existe estimación. En simulación puede derivarse de distancia restante y velocidad; con proveedor se conserva su procedencia. Cambiar destino o bloqueo invalida la ruta y recalcula desde la posición actual confirmada. Una operación de recálculo fallida conserva el aviso y la última ruta conocida identificada como antigua.

En demo local, la elección del líder del simulador debe usar una lease con vencimiento y mecanismo de exclusión; el nuevo líder continúa desde el checkpoint persistido. Una segunda pestaña puede visualizar y enviar comandos, pero no crea otro reloj que duplique el movimiento.

## A18. Sesión, permisos y ficha médica

El contexto de autorización del servidor contiene usuario autenticado, membresías vigentes, organización seleccionada validada y permisos. El frontend puede recibir un resumen para menús, pero no puede otorgarse nuevos roles modificándolo.

Para leer ficha médica exige: identidad válida, relación con el sujeto, incidente autorizado cuando aplica, rol o permiso apropiado, asignación vigente y consentimiento con finalidad compatible. El usuario puede leer su propia ficha mediante la vía autorizada correspondiente, sin necesitar un incidente activo.

Registra un acceso permitido antes de devolver contenido sensible y guarda también intentos denegados con metadata mínima cuando corresponda. Si no se puede escribir el registro obligatorio, falla la lectura operacional con error seguro. El servidor no debe permitir que una consulta directa evite el registro.

Para QR temporal, genera un token aleatorio de alta entropía y guarda su hash, sujeto, campos permitidos, finalidad, expiración y revocación. La URL no contiene diagnóstico, documento ni datos clínicos. Un token revocado o vencido devuelve una pantalla neutra. Valida el alcance en cada lectura; no conviertas el QR en una sesión administrativa.

## A19. Carga de archivos y mensajes

Configura límites demo iniciales: hasta 5 adjuntos por reporte, imágenes JPEG/PNG/WebP hasta 10 MiB cada una, un video MP4/WebM hasta 30 MiB y audio de formatos admitidos hasta 10 MiB. Detecta soporte de grabación por navegador antes de mostrar esa opción; no garantices un códec universal. Los límites se centralizan y el servidor los aplica.

La carga devuelve un `attachmentId` vinculado a su creador y sesión. Al enviar el incidente, reclama los adjuntos autorizados en la transacción o mediante un flujo recuperable documentado. Si falla el incidente, conserva temporalmente la carga para reintento y elimina huérfanos con un job. Si falla un adjunto, el reporte mínimo puede enviarse sin él y completarse después con la autorización correspondiente.

Los mensajes tienen `id`, `incidentId`, `conversationId`, `senderId`, `audience`, `body`, `attachmentIds`, `createdAt` y recibos separados. `audience` distingue ciudadano-central, coordinación y nota privada. El servicio de consulta filtra por pertenencia a conversación. No se transforma una nota privada en mensaje público cambiando una propiedad de UI.

## A20. Contratos del portal hospitalario existente

| Entidad | Campos adicionales específicos |
| --- | --- |
| Capacidad | `facilityId`, `resourceCode`, `total`, `occupied`, `reserved`, `reportedAt`, `reportedBy`, `version` |
| Solicitud de traslado | `id`, `incidentId`, `missionId`, `facilityId`, `status`, `requestedResources`, `etaAt`, `requestedAt`, `version` |
| Reserva | `id`, `transferId`, `resourceCode`, `quantity`, `status`, `expiresAt` |
| Entrega | `id`, `transferId`, `receivedBy`, `arrivedAt`, `confirmedAt`, `notes`, `version` |

La disponibilidad resulta de total menos ocupación y reservas activas, con excepciones explícitas de sobrecapacidad. Al aceptar traslado, bloquea capacidad pertinente, verifica disponibilidad y crea reserva en la misma transacción. Dos aceptaciones que compiten por la última plaza no pueden confirmarse ambas.

Al confirmar entrega, consume la reserva y ajusta ocupación conforme al tipo de recurso. Finalizar el incidente no disminuye automáticamente esa ocupación. Cancelación, cambio de destino y expiración liberan la reserva correspondiente una sola vez. El coordinador solo acepta solicitudes dirigidas a su instalación y con permisos vigentes.

Prueba observable: Care acepta → Command y Response ven destino confirmado → se confirma entrega → la reserva desaparece de pendientes y la ocupación cambia correctamente, sin crear ni perder capacidad.

## A21. Contratos de refugios y logística existentes

| Entidad | Campos específicos |
| --- | --- |
| Refugio | `id`, `organizationId`, `facilityId`, `enabledCapacity`, `operatingStatus`, `updatedAt`, `version` |
| Estancia | `id`, `shelterId`, `registrationId`, `householdCode`, `admittedAt`, `departedAt`, `status` |
| Necesidad | `id`, `shelterId`, `itemId`, `quantity`, `priority`, `status`, `requestedBy` |
| Artículo | `id`, `code`, `name`, `unitOfMeasure`, `lotTracked`, `active` |
| Movimiento | `id`, `itemId`, `warehouseId`, `quantity`, `direction`, `reason`, `referenceId`, `createdAt` |
| Reserva de stock | `id`, `requestId`, `itemId`, `warehouseId`, `quantity`, `status`, `expiresAt` |
| Entrega | `id`, `requestId`, `originId`, `destinationId`, `status`, `sentAt`, `receivedAt`, `version` |

Cada persona registrada admite una estancia activa compatible, identificada por un registro interno, no por coincidencia de nombre. Un ingreso duplicado devuelve la estancia existente o conflicto. El traslado entre refugios conserva vínculo entre salida e ingreso y registra situaciones pendientes sin contar dos estancias simultáneas como ocupación confirmada.

Para inventario, utiliza cantidad decimal de precisión definida según unidad; no dependas de sumas de coma flotante para saldos. Una recepción parcial genera movimientos por lo recibido y deja el resto pendiente. Cancelar libera reservas pendientes, no borra movimientos ya ejecutados. El stock se reconstruye desde movimientos y las proyecciones se comparan contra ese libro de movimientos.

## A22. Contratos de flota, personal y relevo

La condición técnica de una unidad admite `operational`, `restricted`, `maintenance` u `out_of_service`, junto a los estados de misión originales. `available` no implica por sí mismo elegibilidad; exige también condición técnica, equipamiento y tripulación compatibles.

Una inspección contiene unidad, versión de checklist, respuestas, defectos, autor y fecha. Cada defecto tiene severidad demo y disposición. Una orden de mantenimiento contiene unidad, estado, motivo, responsable, inicio y retorno autorizado. Cerrar una orden no ignora otra restricción todavía activa.

La membresía de tripulación tiene persona, unidad, función e intervalo de vigencia. El turno tiene inicio, fin y estado. Impide compromisos incompatibles mediante comprobación transaccional de intervalos; no basta comparar solo la hora de inicio.

El relevo contiene turno saliente, entrante, casos abiertos, acciones pendientes, notas y aceptación. Hasta aceptar, los casos conservan responsable explícito. Si el operador sale antes, un supervisor autorizado puede reasignar con evento y motivo. El sistema no da casos por resueltos al cerrar sesión.

## A23. Contratos de Enterprise, Community y Academy

| Producto | Entrada de su operación principal | Persistencia | Condición de terminación |
| --- | --- | --- | --- |
| Enterprise | Sede, plan versionado, participantes y puntos de encuentro | `drill_sessions`, `muster_records`, observaciones y acciones | Sesión cerrada con conteos y pendientes explícitos |
| Community | Tarea, responsable, horario, cupo y requisitos | `volunteer_tasks`, `task_participations` | Resultado verificado por coordinador |
| Academy | Escenario, versión, seed, participantes y rúbrica | `scenario_runs`, `training_events`, `training_results` | Evaluación derivada de eventos y objetivos |

En un check-in guarda `sessionId`, `participantId`, `musterPointId`, `confirmedAt`, `confirmedBy` y método. La combinación sesión/participante es única para la presencia actual; las correcciones van al historial. Escanear el mismo QR dos veces no suma dos asistentes.

La asignación de voluntariado verifica aprobación vigente, capacidad y requisitos de la tarea. Completar la tarea propone un resultado; verificarlo pertenece al coordinador. No extiende permisos a los incidentes o perfiles de ciudadanos.

En Academy, cada criterio identifica evento esperado, condición, peso y evidencia. Calcula puntuación como suma de puntos obtenidos sobre puntos posibles de los criterios aplicables. Los criterios no evaluables se muestran separados, con motivo; no cuentan como éxito automático. Reproducir un escenario no modifica la sesión anterior.

## A24. Contratos de alertas, confianza e integraciones

Una alerta contiene `id`, `organizationId`, `type`, `severity`, `title`, `description`, `instructions`, `geometry`, `startsAt`, `expiresAt`, `status`, `version`, `reviewedBy` y `publishedBy`. Valida geometría, orden de fechas y permisos antes de publicar. Un círculo se convierte en geometría de la geocerca conforme al motor elegido, guardando parámetros originales cuando convenga.

Una entrega de aviso se identifica por alerta, versión, destinatario y canal. Publicación no implica entrega. El modo demo registra `simulated` y nunca contacta un número real por efecto del seed. Reintentar una entrega no genera otra alerta.

Un consentimiento contiene sujeto, finalidad, campos o alcance, versión del texto, `grantedAt`, `expiresAt`, `revokedAt` y actor autorizado. Una solicitud de datos tiene tipo, estado, verificación de identidad, resolución y export temporal cuando aplique. Un cambio de consentimiento debe invalidar proyecciones dependientes.

Un proveedor configurado expone capacidades y `testResult`, `testedAt`, `latencyMs`, `lastErrorCode`. Sin ejecutar prueba no pasa a verificado. Guarda secretos en servidor y enmascara respuestas. Un webhook registra suscripción, evento, intento y firma; el reenvío conserva ID de evento y cambia el ID del intento.

## A25. Contrato del simulador de llamadas y apoyo a decisiones

Una llamada demo contiene escenario, guion versionado, estado, operador asignado, marcas de tiempo y `incidentId` opcional. Cada segmento del guion tiene `offsetSeconds`, `speaker` y `text`. La transcripción visible se deriva del tiempo del escenario desde la activación, sin revelar segmentos futuros.

Contestar cambia la llamada a activa y registra `answeredAt`; mantener en espera conserva estado previo para reanudar; transferir registra origen, destino y aceptación. La finalización detiene el cronómetro activo y no cierra automáticamente el incidente relacionado. El formulario puede crear ese incidente mientras la llamada sigue abierta.

El resultado de apoyo a decisiones contiene `assessmentId`, `incidentId`, `inputVersion`, `method`, `methodVersion`, `suggestedCategory`, `suggestedPriority`, `riskFactors`, `missingFields`, `suggestedResources`, `createdAt` y revisión humana. Si cambia el caso, la evaluación anterior se marca desactualizada respecto de su versión.

En reglas demo, usa condiciones sobre respuestas estructuradas. La coincidencia de una palabra en texto puede sugerir revisión, pero no confirma un hecho. Los pesos y umbrales pertenecen a configuración de simulación. El botón “aceptar sugerencia” llama al comando autorizado con versión actual; el modelo o motor de reglas nunca escribe directamente en el incidente.

## A26. Métricas, filtros y ejemplos comprobables

Conserva las fórmulas de la sección 173 y concreta el conjunto de datos de cada consulta. Para métricas de incidentes, selecciona por fecha de recepción dentro de `[from, to)`, organización y filtros autorizados. Para actividad horaria de resoluciones, agrupa por fecha de resolución y etiquétala como actividad, no como el mismo conjunto de recepción.

Los incidentes cancelados o rechazados se cuentan en sus categorías y se excluyen de tiempos de llegada. Reportes fusionados aportan informantes, pero el incidente maestro cuenta una sola vez. Una reapertura inicia un ciclo adicional; el informe por incidente usa el primer ciclo para primera respuesta y documenta duración hasta resolución final. Un informe por ciclos cuenta ciclos y lo indica.

Fixture mínimo de métricas:

| Caso | Recepción | Primer despacho | Primera llegada | Resultado esperado |
| --- | --- | --- | --- | --- |
| A | 10:00:00 | 10:01:00 | 10:05:00 | Despacho 60 s; primera respuesta 300 s |
| B | 10:10:00 | 10:12:00 | 10:17:00 | Despacho 120 s; primera respuesta 420 s |
| C | 10:20:00 | Sin despacho | Sin llegada | No aporta cero a promedios |

Para esa muestra: tiempo medio hasta despacho = 90 s; tiempo medio hasta primera respuesta = 360 s; dos casos medidos y uno sin medición. La mediana de las llegadas es 360 s. Define un tamaño mínimo configurable antes de mostrar percentil 90; con muestra insuficiente muestra “muestra insuficiente”, no un cero.

Las cifras del PDF y dashboard deben salir del mismo servicio de consulta o snapshot equivalente. La interfaz formatea segundos después del cálculo; no promedies textos como `05:30`.

## A27. Contratos de pantallas y componentes React

Conserva la identidad y composición del documento. Estos contratos detallan responsabilidades, no rediseñan pantallas:

| Componente | Recibe | Emite o ejecuta | No debe hacer |
| --- | --- | --- | --- |
| `IncidentReportForm` | Catálogo, versión y borrador | Entrada validada y guardado de borrador | Asignar prioridad oficial |
| `SOSControl` | Duración, estado y preferencias accesibles | Solicitud de confirmación y activación | Crear múltiples reportes por pulsación |
| `IncidentTimeline` | Eventos autorizados y zona horaria | Selección de evento | Fabricar hitos no registrados |
| `OperationalMap` | Capas autorizadas, selección y rutas | Selección de caso/unidad o pin | Decidir permisos o estados |
| `DispatchCandidates` | Candidatas, exclusiones y versiones | Selección y solicitud de asignación | Marcar una unidad disponible localmente |
| `MissionActions` | Estado y acciones permitidas | Comando confirmado por usuario | Saltar transiciones no válidas |
| `CapacityBoard` | Capacidad, reservas y antigüedad | Actualización autorizada | Inventar disponibilidad |
| `NotificationCenter` | Notificaciones y lectura | Confirmación de lectura | Inferir entrega externa |
| `MetricCard` | Valor, unidad, muestra y estado | Navegación al filtro asociado | Calcular KPI desde otro conjunto |
| `PrivacyControls` | Consentimientos versionados | Cambio de alcance o revocación | Otorgar acceso fuera del sujeto |

Los componentes reutilizables reciben callbacks o servicios de aplicación, no una instancia de base de datos con privilegios. Los layouts administran navegación y contexto. Los formularios mantienen datos sin enviar separados de los registros confirmados.

Usa la librería de formularios y validación prevista. Un error del servidor con `fieldErrors` se conecta al campo correspondiente. Un conflicto general conserva el borrador y ofrece revisar datos actualizados; no elimina lo escrito.

## A28. Estado de datos, caché y rutas

Define una clave de consulta que incluya producto o proyección, identidad/ámbito de permisos, organización, ID y filtros relevantes. Una caché de Citizen no debe reutilizar una respuesta de Command para el mismo `incidentId`.

Tras una mutación confirmada, actualiza la entidad desde la respuesta del servidor o invalida la consulta. Al recibir evento posterior, compara versiones antes de aplicar. El estado del mapa puede conservar zoom y selección mientras se renueva la información; no recrees su instancia con cada render.

Al cambiar de cuenta u organización, cancela peticiones previas, limpia datos privados y vuelve a suscribir canales autorizados. Una respuesta lenta de la cuenta anterior no puede poblar la vista de la nueva.

Cada ruta privada verifica sesión y permiso antes de cargar la consulta. Una ruta profunda abierta directamente debe funcionar tras autenticación, conservando un destino interno validado. La página de error distingue falta de acceso y recurso inexistente sin revelar información privada. Usa los paths del documento original; los nombres de archivos pueden adaptarse a la convención del proyecto.

## A29. Estados de interfaz y operación pendiente

Modela el estado de una operación de usuario como `idle`, `validating`, `submitting`, `confirming`, `succeeded` o `failed`. `confirming` significa que la petición pudo llegar pero falta respuesta; debe consultar el resultado o reintentar de forma idempotente.

Deshabilita el botón de envío durante una operación activa y conserva la protección de servidor. Los mensajes de éxito describen el hecho confirmado: “reporte recibido”, “despacho enviado” o “reserva aceptada”. Nunca uses una única frase “listo” para estados distintos.

Para datos remotos distingue primera carga, dato disponible, recarga en segundo plano, vacío legítimo, error sin dato y dato antiguo con error de actualización. Una recarga no debe vaciar temporalmente un mapa ya disponible. Mostrar datos antiguos requiere fecha visible y acciones adecuadas.

Los dialogs deben tener foco inicial, cierre y retorno de foco; las acciones irreversibles dentro del escenario explican su efecto. Mantén las dimensiones, colores, tipografía y transiciones del documento base. Las etiquetas adicionales solo comunican estado real, no agregan pasos arbitrarios a los recorridos.

## A30. Offline y recuperación del trabajo existente

Un borrador local contiene `draftId`, identidad demo o sujeto autorizado, versión de cuestionario, respuestas, referencias de archivos, `updatedAt` y estado de envío. No almacena automáticamente una ficha médica completa para hacer funcionar el formulario offline.

Cuando no existe conexión, guarda el borrador y muestra que no ha sido recibido. Al reconectar, revisa si ya tiene `clientRequestId` enviado: consulta o reintenta con la misma clave para evitar duplicados. Si todavía no se envió, permite revisar información y confirmar conforme al flujo previsto.

Un estado operacional offline lleva versión original. Al intentar sincronizar contra otra versión, genera conflicto y permite revisión. No uses “última escritura gana” para despacho, llegada, capacidad o consentimiento. Para preferencias visuales de bajo impacto puede adoptarse otra política documentada.

El service worker conserva la estructura y recursos permitidos. Al actualizar la aplicación, migra o mantiene compatibilidad con borradores existentes. No fuerces una recarga destructiva durante un formulario activo. Documenta que recuperar un borrador no significa transmitir una emergencia sin red.

## A31. Consultas de los productos restantes

Los productos predominantemente de consulta también necesitan contratos verificables:

| Área existente | Consulta o registro | Restricción y comprobación |
| --- | --- | --- |
| Public y recursos | Artículos publicados por idioma, categoría, versión y fecha de revisión | Nunca mostrar borradores en el índice público |
| Wellbeing | Recursos educativos publicados y filtros autorizados | Recomendación por categoría, sin diagnóstico |
| Hogares | Miembros, invitaciones aceptadas y permisos | Contacto de emergencia no implica acceso médico |
| Check-in | Evento, destinatario, respuesta y timestamp | Sin respuesta se representa como desconocido |
| Reunificación | Solicitud, candidato revisado, coordinador y resolución | No publicar listas privadas |
| Status | Resultados de health checks con hora y fuente | Datos técnicos agregados, sin secretos |
| Wallboard | Snapshot operacional autorizado y fecha | Conteos consistentes con Command; datos privados ocultos |
| Soporte | Ticket, autor, categoría, mensajes y adjuntos | Solo participantes y personal autorizado |
| Replay | Run o incidente, snapshot y rango de eventos | Reconstrucción histórica y permisos actuales |

Una consulta paginada debe devolver total solo cuando sea correcto y esté autorizado. Si el valor es estimado, etiquétalo. Los datos de infraestructura y los datos de simulación mantienen fuentes diferentes: una caída simulada en Academy no debe anunciarse como avería real del despliegue público.

## A32. Archivos de implementación y responsabilidad

Esta matriz ubica contratos existentes dentro de la estructura propuesta. No exige renombrar archivos equivalentes de un repositorio ya organizado:

| Ubicación sugerida | Contenido verificable |
| --- | --- |
| `src/domain/incidents/types.ts` | Estados, tipos de entrada y modelos internos |
| `src/domain/incidents/transitions.ts` | Tabla de transiciones y precondiciones puras |
| `src/domain/dispatch/eligibility.ts` | Restricciones de candidatas |
| `src/domain/dispatch/ranking.ts` | Score demo y explicación versionada |
| `src/data/contracts/` | Interfaces de repositorios y proveedores |
| `src/data/demo/` | IndexedDB, comandos locales y proyecciones |
| `src/integrations/` | Adaptadores de mapas, voz, almacenamiento y eventos |
| `src/features/incidents/` | Formulario, detalle y consultas de incidentes |
| `src/features/dispatch/` | Candidatas, asignación y errores de conflicto |
| `src/simulation/clock.ts` | Reloj inyectable del escenario |
| `src/simulation/engine.ts` | Tick autoritativo, checkpoints y eventos |
| `server/application/` | Autorización y coordinación de comandos transaccionales |
| `server/api/` | Rutas HTTP, esquemas y mapeo de errores |
| `supabase/migrations/` | Tablas, índices, restricciones y políticas |
| `tests/contracts/` | Mismo comportamiento sobre adaptadores |
| `tests/e2e/` | Flujos multiusuario y aislamiento |

Para el resto de productos aplica el mismo patrón por dominio, sin duplicar autenticación, notificaciones o reglas de acceso. Los fragmentos de este anexo se convierten en archivos tipados completos; no se dejan imports o interfaces sin definir. Conserva una sola implementación autoritativa de cada regla crítica y reutilízala donde corresponda.

## A33. Migraciones, configuración y arranque

Organiza migraciones por dependencia: organizaciones y membresías; identidades y consentimientos; catálogos; incidentes y ubicaciones; unidades y despacho; eventos/outbox; instalaciones y traslados; refugios/logística; empresa/comunidad/formación; políticas, índices y verificaciones finales. Las FK y funciones deben existir antes de referenciarlas.

El seed utiliza esas migraciones y crea los registros de la sección 182 con IDs estables o un generador determinístico. Cambiar el seed no modifica silenciosamente registros reales. Los comandos de reinicio validan modo y escenario. El esquema y el seed deben poder aplicarse en una instalación limpia.

El bootstrap detecta el modo explícito y construye el conjunto correspondiente de adaptadores. En `demo-local`, la ausencia de claves externas es esperada. En `demo-shared`, una dependencia requerida ausente devuelve diagnóstico de inicio; no desactiva RLS para “hacerlo funcionar”. En `integrated-sandbox`, los proveedores opcionales no configurados conservan su simulador declarado o su estado no disponible según la capacidad prevista.

Mantén las variables del documento base. Si el ejemplo conceptual usa `MAPBOX_TOKEN` y el frontend utiliza `VITE_MAPBOX_TOKEN`, resuelve la equivalencia en la configuración documentada sin exponer secretos ni crear dos fuentes contradictorias. El nombre público no implica que todas las claves de proveedor sean públicas.

## A34. Pruebas de aceptación con resultados exactos

| ID | Preparación y acción | Resultado que debe comprobarse |
| --- | --- | --- |
| `INC-01` | Enviar reporte válido desde Citizen | Un incidente, un informante y evento de creación; código igual en Command |
| `INC-02` | Repetir solicitud con misma clave y cuerpo | Mismo ID; ningún incidente ni evento extra |
| `INC-03` | Reutilizar clave con otro cuerpo | Conflicto; no modifica el resultado anterior |
| `INC-04` | Reportar dirección sin coordenadas | Recepción válida con ubicación pendiente; despacho bloqueado hasta confirmarla |
| `AUTH-01` | Ciudadano A consulta ID de B | Sin datos del caso ni archivos |
| `AUTH-02` | Administrador técnico intenta leer ficha clínica sin permiso | Denegado; no se devuelve contenido |
| `DSP-01` | Dos dispatchers asignan simultáneamente la misma unidad | Un éxito; un conflicto; un compromiso activo |
| `DSP-02` | Aceptar reserva vencida | Conflicto; unidad no entra en ruta |
| `DSP-03` | Unidad cambia a mantenimiento antes de confirmar asignación | Transacción rechazada sin reserva parcial |
| `MAP-01` | Abrir tres pestañas del mismo escenario | Una sola progresión de tiempo y movimiento |
| `MAP-02` | Interrumpir muestras más allá del umbral | Posición antigua marcada; no avance inventado |
| `SYNC-01` | Cortar conexión y producir eventos antes de reconectar | Estado final correcto, sin huecos ni notificaciones duplicadas |
| `CARE-01` | Dos traslados intentan reservar una plaza | Solo uno confirmado; capacidad no negativa |
| `CARE-02` | Confirmar entrega dos veces | Un ajuste de ocupación; una reserva consumida |
| `SHELTER-01` | Repetir admisión de un registro | Una estancia activa y un aumento de ocupación |
| `LOG-01` | Recibir parcialmente 4 unidades de 10 enviadas | Recepción 4; pendiente 6; inventario aumentado en 4 |
| `ENT-01` | Escanear dos veces participante del simulacro | Un participante confirmado |
| `COMM-01` | Voluntario no aprobado intenta aceptar tarea restringida | Denegado; cupo sin cambio |
| `ACA-01` | Reproducir seed y eventos programados | Igual situación inicial; evaluación respaldada por eventos |
| `MET-01` | Ejecutar fixture A/B/C de A26 | Promedios 90 s y 360 s; muestra 2; sin medición 1 |
| `PRIV-01` | Revocar token de ficha y volver a consultar | Nueva lectura denegada |
| `CALL-01` | Crear incidente durante llamada activa | Caso persistido; llamada continúa vinculada |
| `ALERT-01` | Publicar alerta demo | Feed y entregas simuladas; ningún envío externo real |
| `PDF-01` | Exportar mismo conjunto del dashboard | Cifras y filtros coinciden; archivo abre; sin campos no autorizados |

Estas pruebas especifican resultados futuros; no afirman que la aplicación ya esté construida. En el desarrollo, registra modo, fecha y evidencia de cada ejecución. No sustituyas pruebas de servidor por capturas de controles ocultos.

## A35. Criterio de finalización de esta especificación

El desarrollador debe poder identificar, para cada función del prompt original, qué archivo o dominio implementa la regla, qué datos recibe, qué valida, qué escribe, qué evento produce, quién puede verlo y cómo probarlo. Si falta una decisión de bajo nivel, complétala dentro del alcance existente y documenta el valor elegido.

No cambies nombre, identidad, paleta, navegación prevista, productos ni funcionalidades para acomodar una implementación incompleta. Tampoco agregues módulos nuevos por iniciativa propia al interpretar este anexo. La finalidad es hacer programable lo que ya está solicitado.

Antes de entregar código, revisa las 201 secciones originales junto con este anexo, completa los contratos referenciados y verifica los recorridos. Entrega evidencia de lo realmente ejecutado. El diseño visual y la funcionalidad siguen siendo los del documento original; el anexo aporta precisión para construirlos.

