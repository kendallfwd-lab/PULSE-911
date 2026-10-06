export const COSTA_RICA_CENTER = { lat: 9.7489, lng: -83.7534 }
export const COSTA_RICA_OVERVIEW_ZOOM = 8

const risk = (id, name, province, lat, lng, description, severity = 'high') => ({
  id: `demo-risk-${id}`,
  name,
  title: name,
  area: province,
  category: 'road_hazard',
  severity,
  reports: 0,
  radiusM: severity === 'critical' ? 9000 : 6500,
  description,
  location: { lat, lng, label: `${name}, ${province}` },
  isSimulated: true,
  sourceType: 'simulated_demo'
})

const incident = (id, title, province, lat, lng, priority = 'P2', category = 'traffic_accident') => ({
  id: `demo-incident-${id}`,
  code: `SIM-CR-${String(id).padStart(3, '0')}`,
  title,
  category,
  priority,
  status: 'received',
  publicVisibility: true,
  verificationStatus: 'simulated',
  description: 'Escenario ficticio para demostrar la cobertura nacional del mapa. No representa una emergencia real.',
  assignedUnits: [],
  location: { lat, lng, label: `${province} · ubicación aproximada simulada` },
  isSimulated: true,
  sourceType: 'simulated_demo'
})

// Escenarios deliberadamente ficticios. Se mantienen fuera de la base de reportes
// para que nunca se confundan con una emergencia o una fuente oficial.
export const NATIONAL_DEMO_RISK_ZONES = [
  risk(1, 'Curvas de La Cruz', 'Guanacaste', 11.0702, -85.6313, 'Tramo montañoso simulado con visibilidad reducida.'),
  risk(2, 'Cruce de Liberia', 'Guanacaste', 10.6346, -85.4404, 'Punto demostrativo de tránsito pesado.'),
  risk(3, 'Acceso a Nicoya', 'Guanacaste', 10.1480, -85.4520, 'Zona ficticia de precaución vial.'),
  risk(4, 'Interamericana de Cañas', 'Guanacaste', 10.4307, -85.0983, 'Escenario simulado de velocidad y viento lateral.'),
  risk(5, 'Península de Santa Elena', 'Puntarenas', 10.9100, -85.7600, 'Referencia ficticia para cobertura remota.'),
  risk(6, 'Entrada a Puntarenas', 'Puntarenas', 9.9951, -84.7452, 'Punto simulado de congestión y maniobras de giro.', 'critical'),
  risk(7, 'Costanera de Jacó', 'Puntarenas', 9.6150, -84.6280, 'Zona demostrativa de lluvia intensa y peatones.'),
  risk(8, 'Tramo de Quepos', 'Puntarenas', 9.4319, -84.1620, 'Escenario ficticio cercano a zona turística.'),
  risk(9, 'Paso de Palmar Norte', 'Puntarenas', 8.9580, -83.4680, 'Punto simulado de cruce y tránsito pesado.'),
  risk(10, 'Acceso a Paso Canoas', 'Puntarenas', 8.5345, -82.8380, 'Referencia ficticia de circulación fronteriza.'),
  risk(11, 'Ruta de San Ramón', 'Alajuela', 10.0880, -84.4690, 'Tramo simulado de neblina y curvas.'),
  risk(12, 'Corredor de San Carlos', 'Alajuela', 10.3238, -84.4300, 'Zona ficticia con tránsito de carga.'),
  risk(13, 'Cruce del Aeropuerto', 'Alajuela', 10.0004, -84.2040, 'Punto demostrativo de alta circulación.', 'critical'),
  risk(14, 'Anillo de Heredia', 'Heredia', 10.0024, -84.1165, 'Escenario simulado de congestión urbana.'),
  risk(15, 'Paso de la Ruta 32', 'Heredia', 10.1090, -84.0490, 'Zona ficticia de lluvia y baja visibilidad.', 'critical'),
  risk(16, 'Circunvalación Sur', 'San José', 9.9130, -84.0800, 'Punto simulado de tráfico y cambios de carril.'),
  risk(17, 'Cerro de la Muerte', 'San José', 9.5588, -83.7562, 'Escenario ficticio de neblina y descenso pronunciado.', 'critical'),
  risk(18, 'Salida de Cartago', 'Cartago', 9.8590, -83.9060, 'Zona demostrativa de incorporaciones viales.'),
  risk(19, 'Acceso a Guápiles', 'Limón', 10.2120, -83.7860, 'Punto ficticio de lluvia y tránsito pesado.'),
  risk(20, 'Corredor de Limón', 'Limón', 9.9970, -83.0400, 'Escenario simulado de circulación portuaria.', 'critical'),
  risk(21, 'Ruta a Bribrí', 'Limón', 9.6280, -82.8460, 'Referencia ficticia de carretera rural.'),
  risk(22, 'Zona de Sixaola', 'Limón', 9.5010, -82.6200, 'Punto simulado de posibles anegamientos.')
]

export const NATIONAL_DEMO_INCIDENTS = [
  incident(1, 'Colisión simulada cerca de La Cruz', 'Guanacaste', 11.0260, -85.6240, 'P2'),
  incident(2, 'Accidente ficticio en Liberia', 'Guanacaste', 10.6200, -85.4320, 'P1'),
  incident(3, 'Choque simulado en Santa Cruz', 'Guanacaste', 10.2600, -85.5860, 'P2'),
  incident(4, 'Incidente vial de demostración en Cañas', 'Guanacaste', 10.4260, -85.1060, 'P3'),
  incident(5, 'Colisión ficticia en Puntarenas', 'Puntarenas', 9.9770, -84.7620, 'P1'),
  incident(6, 'Accidente simulado en Jacó', 'Puntarenas', 9.6230, -84.6210, 'P2'),
  incident(7, 'Incidente de demostración en Quepos', 'Puntarenas', 9.4430, -84.1350, 'P2'),
  incident(8, 'Choque ficticio en Río Claro', 'Puntarenas', 8.6790, -83.0700, 'P1'),
  incident(9, 'Accidente simulado en San Ramón', 'Alajuela', 10.0930, -84.4750, 'P2'),
  incident(10, 'Colisión ficticia en Ciudad Quesada', 'Alajuela', 10.3270, -84.4270, 'P2'),
  incident(11, 'Incidente simulado en Alajuela', 'Alajuela', 10.0120, -84.2150, 'P1'),
  incident(12, 'Choque de demostración en Heredia', 'Heredia', 10.0070, -84.1240, 'P2'),
  incident(13, 'Accidente ficticio en Escazú', 'San José', 9.9220, -84.1390, 'P2'),
  incident(14, 'Colisión simulada en Curridabat', 'San José', 9.9100, -84.0300, 'P1'),
  incident(15, 'Incidente vial ficticio en Pérez Zeledón', 'San José', 9.3740, -83.7040, 'P2'),
  incident(16, 'Accidente simulado en Cartago', 'Cartago', 9.8640, -83.9190, 'P1'),
  incident(17, 'Choque ficticio en Turrialba', 'Cartago', 9.9050, -83.6840, 'P2'),
  incident(18, 'Colisión simulada en Guápiles', 'Limón', 10.2160, -83.7840, 'P2'),
  incident(19, 'Accidente ficticio en Puerto Limón', 'Limón', 9.9930, -83.0340, 'P1'),
  incident(20, 'Incidente de demostración en Bribrí', 'Limón', 9.6240, -82.8590, 'P3')
]

export const NATIONAL_DEMO_POINTS = [
  ...NATIONAL_DEMO_RISK_ZONES,
  ...NATIONAL_DEMO_INCIDENTS
]
