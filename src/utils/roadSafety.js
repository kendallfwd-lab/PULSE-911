import { distanceKm } from './geo'

const SEVERITY_WEIGHT = { critical: 32, high: 24, medium: 14, low: 7 }
const STATUS_WEIGHT = { closed: 35, partial_block: 22, slow: 12, precaution: 8, normal: 0 }

export function matchNearbyIncidents(point, incidents = [], radiusKm = 1.5) {
  return incidents.filter(item => distanceKm(point, item.location) <= radiusKm)
}

export function calculateLocalRisk({ point, incidents = [], riskZones = [], trafficEvents = [] }) {
  const nearbyIncidents = matchNearbyIncidents(point, incidents)
  const nearbyZones = riskZones.filter(zone => distanceKm(point, zone.location || zone) <= ((zone.radiusM || 500) / 1000))
  const nearbyTraffic = trafficEvents.filter(event => distanceKm(point, event.location || event) <= 2)
  const incidentScore = nearbyIncidents.reduce((sum, item) => sum + (SEVERITY_WEIGHT[item.severity] || (item.priority === 'P1' ? 28 : 12)), 0)
  const zoneScore = nearbyZones.reduce((sum, zone) => sum + Math.round((zone.riskScore || 45) / 5), 0)
  const trafficScore = nearbyTraffic.reduce((sum, event) => sum + (STATUS_WEIGHT[event.status] || 6), 0)
  const score = Math.min(100, incidentScore + zoneScore + trafficScore)
  return { score, level: riskLevelFromScore(score), nearbyIncidents, nearbyZones, nearbyTraffic }
}

export function scoreRouteRisk(points = [], data = {}) {
  if (!points.length) return { score: 0, level: 'low', samples: [] }
  const step = Math.max(1, Math.floor(points.length / 18))
  const samples = points.filter((_, index) => index % step === 0 || index === points.length - 1).map(point => calculateLocalRisk({ point, ...data }))
  const score = Math.round(samples.reduce((sum, sample) => sum + sample.score, 0) / samples.length)
  return { score, level: riskLevelFromScore(score), samples }
}

export function riskLevelFromScore(score) {
  if (score >= 65) return 'high'
  if (score >= 30) return 'moderate'
  return 'low'
}
