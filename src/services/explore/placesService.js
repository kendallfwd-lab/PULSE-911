import { distanceKm, isValidLocation } from '../../utils/geo'
import { withCache } from '../cacheService'

export const EXPLORE_CATEGORY_FILTERS = Object.freeze({
  parks: [['leisure', 'park'], ['boundary', 'national_park'], ['leisure', 'nature_reserve']],
  beaches: [['natural', 'beach']],
  restaurants: [['amenity', 'restaurant']],
  cafes: [['amenity', 'cafe']],
  museums: [['tourism', 'museum']],
  hospitals: [['amenity', 'hospital']],
  pharmacies: [['amenity', 'pharmacy']],
  gas: [['amenity', 'fuel']],
})

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
]

export function buildOverpassQuery({ category, center, radiusKm }) {
  if (!EXPLORE_CATEGORY_FILTERS[category]) throw new Error('INVALID_EXPLORE_CATEGORY')
  if (!isValidLocation(center)) throw new Error('INVALID_LOCATION')
  const radiusM = Math.round(Math.min(50, Math.max(1, Number(radiusKm) || 10)) * 1000)
  const filters = EXPLORE_CATEGORY_FILTERS[category]
    .flatMap(([key, value]) => ['node', 'way', 'relation'].map(type => `${type}["${key}"="${value}"](around:${radiusM},${center.lat},${center.lng});`))
    .join('\n')
  return `[out:json][timeout:18];\n(\n${filters}\n);\nout tags center 45;`
}

function firstTag(tags, ...keys) {
  return keys.map(key => tags[key]).find(Boolean) || ''
}

function composeAddress(tags) {
  const street = [firstTag(tags, 'addr:street'), firstTag(tags, 'addr:housenumber')].filter(Boolean).join(' ')
  return [street, firstTag(tags, 'addr:suburb', 'addr:district'), firstTag(tags, 'addr:city', 'addr:town', 'addr:village')].filter(Boolean).join(', ')
}

export function normalizeOverpassElement(element, { category, center, province = '' }) {
  const tags = element?.tags || {}
  const lat = Number(element.lat ?? element.center?.lat)
  const lng = Number(element.lon ?? element.center?.lon)
  const name = String(firstTag(tags, 'name:es', 'name', 'official_name', 'brand', 'operator')).trim().slice(0, 180)
  if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) return null
  const city = firstTag(tags, 'addr:city', 'addr:town', 'addr:village', 'addr:municipality', 'addr:district')
  const resolvedProvince = firstTag(tags, 'addr:province', 'addr:state') || province
  const address = composeAddress(tags)
  return {
    id: `osm-${element.type}-${element.id}`,
    name,
    category,
    lat,
    lng,
    location: { lat, lng, label: [name, city, resolvedProvince].filter(Boolean).join(', ') },
    address,
    city,
    province: resolvedProvince,
    phone: firstTag(tags, 'contact:phone', 'phone'),
    website: firstTag(tags, 'contact:website', 'website', 'url'),
    openingHours: firstTag(tags, 'opening_hours'),
    cuisine: firstTag(tags, 'cuisine'),
    operator: firstTag(tags, 'operator', 'brand'),
    distanceKm: isValidLocation(center) ? Number(distanceKm(center, { lat, lng }).toFixed(2)) : null,
    source: 'OpenStreetMap',
    sourceType: 'external',
  }
}

function matchesExploreCategory(element, category) {
  const tags = element?.tags || {}
  return EXPLORE_CATEGORY_FILTERS[category].some(([key, value]) => tags[key] === value)
}

async function requestOverpass(query, { signal, fetchImpl }) {
  let lastError
  for (const endpoint of OVERPASS_ENDPOINTS) {
    const requestController = new AbortController()
    const handleAbort = () => requestController.abort()
    const timeout = setTimeout(() => requestController.abort(), 15000)
    signal?.addEventListener('abort', handleAbort, { once: true })
    try {
      const response = await fetchImpl(`${endpoint}?data=${encodeURIComponent(query)}`, {
        method: 'GET',
        signal: requestController.signal,
        headers: { Accept: 'application/json' },
        // GET avoids public Overpass instances rejecting URL-encoded POSTs in some browser/proxy combinations.
        // The bounded category queries remain comfortably below common URL-size limits.
      })
      if (!response.ok) throw new Error(`OVERPASS_${response.status}`)
      return response.json()
    } catch (error) {
      if (signal?.aborted) throw error
      lastError = error
    } finally {
      clearTimeout(timeout)
      signal?.removeEventListener('abort', handleAbort)
    }
  }
  throw lastError || new Error('OVERPASS_UNAVAILABLE')
}

export async function searchExplorePlaces({ center, category, radiusKm = 10, province = '', signal, fetchImpl = globalThis.fetch } = {}) {
  if (!isValidLocation(center)) throw new Error('INVALID_LOCATION')
  const query = buildOverpassQuery({ category, center, radiusKm })
  const cachePayload = { category, lat: Number(center.lat.toFixed(3)), lng: Number(center.lng.toFixed(3)), radiusKm, province }
  return withCache('explore-places-v2', cachePayload, async () => {
    const data = await requestOverpass(query, { signal, fetchImpl })
    const seen = new Set()
    const places = (data.elements || []).filter(element => matchesExploreCategory(element, category)).map(element => normalizeOverpassElement(element, { category, center, province })).filter(place => {
      if (!place) return false
      const key = `${place.name.toLowerCase()}-${place.lat.toFixed(4)}-${place.lng.toFixed(4)}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }).sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)).slice(0, 40)
    return { places, provider: 'openstreetmap', attribution: '© OpenStreetMap contributors', generatedAt: new Date().toISOString() }
  }, 30 * 60 * 1000)
}
