import { migrateMedicalNetwork } from './medicalNetwork.js'
import { migrateEmergencyFleet } from './emergencyFleet.js'

export const DEMO_MAP_VERSION = 3

// Centro urbano de la demostración, desplazado hacia el interior de El Roble.
// Mantiene la operación lejos de la línea costera y deja las calles como contexto principal.
export const DEMO_MAP_CENTER = Object.freeze({ lat: 9.9923, lng: -84.7344 })

const LEGACY_DEMO_BOUNDS = Object.freeze({
  minLat: 9.96,
  maxLat: 10.01,
  minLng: -84.77,
  maxLng: -84.71,
})

const INLAND_OFFSET = Object.freeze({ lat: 0.016, lng: 0.014 })

function isLegacyDemoLocation(location) {
  return location?.lat >= LEGACY_DEMO_BOUNDS.minLat
    && location.lat <= LEGACY_DEMO_BOUNDS.maxLat
    && location?.lng >= LEGACY_DEMO_BOUNDS.minLng
    && location.lng <= LEGACY_DEMO_BOUNDS.maxLng
}

function moveInland(location) {
  if (!isLegacyDemoLocation(location)) return location
  return {
    ...location,
    lat: Number((location.lat + INLAND_OFFSET.lat).toFixed(6)),
    lng: Number((location.lng + INLAND_OFFSET.lng).toFixed(6)),
  }
}

function migrateUnit(unit) {
  return {
    ...unit,
    location: moveInland(unit.location),
    base: moveInland(unit.base),
    mission: unit.mission?.route?.length
      ? { ...unit.mission, route: unit.mission.route.map(moveInland) }
      : unit.mission,
  }
}

export function migrateDemoGeography(database) {
  const currentVersion = Number(database?.mapDataVersion || 0)
  const geographicallyMigrated = currentVersion >= 2 ? database : {
    ...database,
    incidents: (database.incidents || []).map(item => ({ ...item, location: moveInland(item.location) })),
    units: (database.units || []).map(migrateUnit),
    alerts: (database.alerts || []).map(item => ({ ...item, location: moveInland(item.location) })),
    riskZones: (database.riskZones || []).map(item => ({ ...item, location: moveInland(item.location) })),
    hospitals: (database.hospitals || []).map(item => ({ ...item, location: moveInland(item.location) })),
    historicalIncidents: (database.historicalIncidents || []).map(moveInland),
    publications: (database.publications || []).map(item => ({ ...item, location: moveInland(item.location) })),
  }

  if (currentVersion >= DEMO_MAP_VERSION) return migrateMedicalNetwork(migrateEmergencyFleet(geographicallyMigrated))

  return migrateMedicalNetwork(migrateEmergencyFleet({ ...geographicallyMigrated, mapDataVersion: DEMO_MAP_VERSION }))
}
