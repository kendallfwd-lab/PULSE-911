export const TRAFFIC_PROVIDERS = ['pulse', 'google', 'tomtom']

export function getPulseTraffic(db) {
  return [...(db.trafficEvents || []), ...(db.roadStatus || []).filter(road => road.status !== 'normal').map(road => ({ ...road, type: 'road_status' }))]
}

export async function getTraffic({ provider = 'pulse', db }) {
  if (provider !== 'pulse') return { provider, available: false, events: getPulseTraffic(db) }
  return { provider: 'pulse', available: true, events: getPulseTraffic(db) }
}
