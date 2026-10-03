import { distanceKm, isValidLocation } from '../utils/geo.js'

const CLUSTER_RADIUS_KM = 0.45
const CLUSTER_MIN_REPORTS = 3
const CLUSTER_WINDOW_MS = 30 * 24 * 60 * 60 * 1000

function reportRecords(db) {
  return [...(db.publications || []), ...(db.incidents || [])]
    .filter(item => item.id && isValidLocation(item.location))
    .map(item => ({
      id: item.id,
      title: item.title,
      category: item.category || 'road_hazard',
      createdAt: item.createdAt,
      location: { lat: item.location.lat, lng: item.location.lng, label: item.location.label },
    }))
}

export function detectLocalRiskClusters(db, now = Date.now()) {
  const reports = reportRecords(db)
  const dated = reports.filter(item => {
    const createdAt = Date.parse(item.createdAt)
    return !Number.isFinite(createdAt) || now - createdAt <= CLUSTER_WINDOW_MS
  })
  const used = new Set()
  const suggestions = []

  for (const seed of dated) {
    if (used.has(seed.id)) continue
    const group = dated.filter(item => !used.has(item.id) && distanceKm(seed.location, item.location) <= CLUSTER_RADIUS_KM)
    if (group.length < CLUSTER_MIN_REPORTS) continue
    group.forEach(item => used.add(item.id))
    const lat = group.reduce((sum, item) => sum + item.location.lat, 0) / group.length
    const lng = group.reduce((sum, item) => sum + item.location.lng, 0) / group.length
    const categories = group.reduce((counts, item) => ({ ...counts, [item.category]: (counts[item.category] || 0) + 1 }), {})
    const category = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || 'road_hazard'
    const sourceIds = group.map(item => item.id).sort()
    suggestions.push({
      id: `ai-local-${now}-${suggestions.length + 1}`,
      type: 'risk_zone',
      title: 'Posible concentración de incidentes',
      description: 'Agrupación calculada con reportes cercanos. Aún no es información oficial.',
      category,
      location: { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)), label: seed.location.label || 'Sector reportado' },
      radiusM: CLUSTER_RADIUS_KM * 1000,
      confidence: Math.min(95, 60 + group.length * 5),
      reason: `${group.length} reportes relacionados dentro de ${CLUSTER_RADIUS_KM * 1000} m`,
      sourceIds,
      createdAt: new Date(now).toISOString(),
      reviewStatus: 'pending',
      requireHumanApproval: true,
      source: 'local_deterministic',
    })
  }
  return suggestions
}

export async function analyzeRiskClusters(db, { remote = false } = {}) {
  const reports = reportRecords(db)
  if (remote) {
    try {
      const { N8N_ENDPOINTS, requestN8N } = await import('./n8nClient.js')
      const response = await requestN8N(N8N_ENDPOINTS.analyzeRisk, { reports, radiusM: 450, windowHours: 720, threshold: 3 }, { timeoutMs: 18000 })
      if (response.ok && Array.isArray(response.suggestions)) return { provider: 'n8n', suggestions: response.suggestions }
    } catch {}
  }
  return { provider: 'local', suggestions: detectLocalRiskClusters(db) }
}
