export const EMERGENCY_FLEET_VERSION = 1

// Flota ficticia para la demostración. Las ubicaciones son puntos simulados
// dentro del área operativa y no representan la posición de unidades reales.
export const ADDITIONAL_EMERGENCY_UNITS = Object.freeze([
  {
    id: 'TRN-105', type: 'Policía de Tránsito', serviceKey: 'traffic', status: 'available',
    capabilities: ['traffic_accident', 'road_hazard', 'security'], distanceKm: 2.1, eta: 4, crew: 2,
    location: { lat: 9.9908, lng: -84.7298 }, base: { lat: 9.9908, lng: -84.7298 }, assignedIncident: null,
  },
  {
    id: 'OIJ-017', type: 'OIJ · Investigación', serviceKey: 'investigation', status: 'available',
    capabilities: ['security', 'missing_person', 'traffic_accident'], distanceKm: 3.4, eta: 6, crew: 3,
    location: { lat: 9.9859, lng: -84.7384 }, base: { lat: 9.9859, lng: -84.7384 }, assignedIncident: null,
  },
  {
    id: 'OIJ-K9-06', type: 'OIJ · Unidad canina', serviceKey: 'investigation', status: 'available',
    capabilities: ['security', 'missing_person', 'rescue'], distanceKm: 4.2, eta: 7, crew: 2,
    location: { lat: 9.9962, lng: -84.7412 }, base: { lat: 9.9962, lng: -84.7412 }, assignedIncident: null,
  },
  {
    id: 'MOTO-011', type: 'Policía motorizada', serviceKey: 'police', status: 'available',
    capabilities: ['security', 'traffic_accident', 'road_hazard'], distanceKm: 1.6, eta: 3, crew: 1,
    location: { lat: 9.9945, lng: -84.7315 }, base: { lat: 9.9945, lng: -84.7315 }, assignedIncident: null,
  },
  {
    id: 'ESC-002', type: 'Escalera de Bomberos', serviceKey: 'fire', status: 'available',
    capabilities: ['fire', 'rescue'], distanceKm: 4.6, eta: 8, crew: 4,
    location: { lat: 9.9827, lng: -84.7268 }, base: { lat: 9.9827, lng: -84.7268 }, assignedIncident: null,
  },
  {
    id: 'AMB-030', type: 'Ambulancia UCI', serviceKey: 'medical', status: 'available',
    capabilities: ['medical', 'traffic_accident'], distanceKm: 3.1, eta: 5, crew: 3,
    location: { lat: 9.988534, lng: -84.719061 }, base: { lat: 9.988534, lng: -84.719061 }, assignedIncident: null,
  },
  {
    id: 'RES-AQ-15', type: 'Rescate acuático', serviceKey: 'rescue', status: 'available',
    capabilities: ['rescue', 'flood', 'missing_person'], distanceKm: 5.4, eta: 9, crew: 4,
    location: { lat: 9.9788, lng: -84.7482 }, base: { lat: 9.9788, lng: -84.7482 }, assignedIncident: null,
  },
])

export function inferUnitService(unit = {}) {
  if (unit.serviceKey) return unit.serviceKey
  const value = `${unit.id || ''} ${unit.type || ''}`.toLowerCase()
  if (value.includes('oij') || value.includes('investig')) return 'investigation'
  if (value.includes('tránsito') || value.includes('transito')) return 'traffic'
  if (value.includes('bombero') || value.includes('fire') || value.includes('escalera')) return 'fire'
  if (value.includes('grúa') || value.includes('grua') || value.includes('tow')) return 'tow'
  if (value.includes('patrulla') || value.includes('polic') || value.includes('moto')) return 'police'
  if (value.includes('acuático') || value.includes('acuatico') || value.includes('rescate')) return 'rescue'
  if (value.includes('respuesta médica') || value.includes('respuesta medica') || value.includes('ems')) return 'medical-response'
  return 'medical'
}

export function migrateEmergencyFleet(database) {
  if (Number(database?.emergencyFleetVersion || 0) >= EMERGENCY_FLEET_VERSION) return database

  const units = (database.units || []).map(unit => ({ ...unit, serviceKey: inferUnitService(unit) }))
  const existingIds = new Set(units.map(unit => unit.id))

  ADDITIONAL_EMERGENCY_UNITS.forEach(unit => {
    if (!existingIds.has(unit.id)) units.push({ ...unit, location: { ...unit.location }, base: { ...unit.base } })
  })

  return { ...database, emergencyFleetVersion: EMERGENCY_FLEET_VERSION, units }
}
