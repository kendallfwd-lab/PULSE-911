import { N8N_ENDPOINTS, requestN8N } from './n8nClient'
import { distanceKm, isValidLocation } from '../utils/geo'
import { withCache } from './cacheService'

function directFallback(origin, destination) {
  const distance = distanceKm(origin, destination)
  return { provider: 'local', geometry: [origin, destination], distanceKm: distance, durationMin: Math.max(2, Math.round(distance / 0.55)), warnings: ['Ruta aproximada; confirma las condiciones antes de viajar.'] }
}

async function osrmRoute(origin, destination, signal) {
  const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&alternatives=true`
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error('OSRM_UNAVAILABLE')
  const data = await response.json()
  return (data.routes || []).slice(0, 3).map((route, index) => ({ id: `osrm-${index}`, provider: 'osrm', geometry: route.geometry.coordinates.map(([lng, lat]) => ({ lat, lng })), distanceKm: route.distance / 1000, durationMin: Math.round(route.duration / 60), warnings: [] }))
}

export async function getRoutes({ origin, destination, locale = 'es', signal, allowApproximateFallback = true }) {
  if (!isValidLocation(origin) || !isValidLocation(destination)) throw new Error('INVALID_ROUTE_POINTS')
  const payload = { origin, destination, locale }
  return withCache('routes', payload, async () => {
    try {
      const response = await requestN8N(N8N_ENDPOINTS.route, payload, { signal })
      if (Array.isArray(response.routes) && response.routes.length) return response.routes
    } catch {}
    try { return await osrmRoute(origin, destination, signal) }
    catch (error) {
      if (!allowApproximateFallback) throw error
      return [directFallback(origin, destination)]
    }
  }, 10 * 60 * 1000)
}
