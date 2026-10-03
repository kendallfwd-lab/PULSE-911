import { COSTA_RICA_PLACES } from '../config/costaRicaPlaces.js'
import { distanceKm, isValidLocation } from '../utils/geo.js'
import { withCache } from './cacheService.js'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const ALLOWED_CATEGORIES = new Set(['attractions', 'parks', 'beaches', 'restaurants', 'cafes', 'museums', 'hospitals', 'pharmacies', 'gas'])
const DEFAULT_CATEGORIES = ['attractions', 'parks', 'beaches', 'museums']
const n8nTypes = { attractions: 'tourist_attraction', parks: 'park', beaches: 'beach', restaurants: 'restaurant', cafes: 'cafe', museums: 'museum', hospitals: 'hospital', pharmacies: 'pharmacy', gas: 'gas_station' }
const searchTerms = { attractions: 'tourist attraction', parks: 'park', beaches: 'beach', restaurants: 'restaurant', cafes: 'cafe', museums: 'museum', hospitals: 'hospital', pharmacies: 'pharmacy', gas: 'fuel station' }

function normalizedCategories(categories) {
  const safe = (Array.isArray(categories) ? categories : []).filter(category => ALLOWED_CATEGORIES.has(category))
  return safe.length ? [...new Set(safe)].slice(0, 4) : DEFAULT_CATEGORIES
}

function normalizeNominatimPlace(place, location, category) {
  const lat = Number(place.lat)
  const lng = Number(place.lon)
  const name = String(place.name || place.display_name?.split(',')[0] || '').trim().slice(0, 180)
  if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return {
    id: `osm-${place.osm_type || 'place'}-${place.osm_id || place.place_id}`,
    name,
    category,
    address: String(place.display_name || '').slice(0, 300),
    lat,
    lng,
    rating: null,
    userRatingCount: null,
    openNow: null,
    photoRef: null,
    distanceKm: Number(distanceKm(location, { lat, lng }).toFixed(2)),
    source: 'openstreetmap',
    sourceType: 'external',
  }
}

async function fetchNominatimPlaces({ location, categories, radiusKm, locale, signal, fetchImpl }) {
  const controller = new AbortController()
  const abort = () => controller.abort(signal?.reason)
  signal?.addEventListener('abort', abort, { once: true })
  const timer = globalThis.setTimeout(() => controller.abort('timeout'), 7000)
  try {
    const category = categories[0]
    const latDelta = radiusKm / 111
    const lngDelta = radiusKm / (111 * Math.max(0.25, Math.cos(location.lat * Math.PI / 180)))
    const params = new URLSearchParams({
      format: 'jsonv2',
      q: searchTerms[category] || 'tourist attraction',
      viewbox: `${location.lng - lngDelta},${location.lat + latDelta},${location.lng + lngDelta},${location.lat - latDelta}`,
      bounded: '1',
      limit: '12',
      addressdetails: '1',
      namedetails: '0',
      'accept-language': locale,
    })
    const response = await fetchImpl(`${NOMINATIM_URL}?${params}`, {
      headers: { Accept: 'application/json', 'Accept-Language': locale, 'User-Agent': 'PULSE-911-Demo/1.0' },
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(`NOMINATIM_${response.status}`)
    const data = await response.json()
    return (Array.isArray(data) ? data : [])
      .map(place => normalizeNominatimPlace(place, location, category))
      .filter(place => place && place.distanceKm <= radiusKm * 1.15)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 12)
  } finally {
    globalThis.clearTimeout(timer)
    signal?.removeEventListener('abort', abort)
  }
}

function referencePlaces(location, categories, radiusKm) {
  return COSTA_RICA_PLACES
    .filter(place => categories.includes(place.category))
    .map(place => ({ ...place, distanceKm: Number(distanceKm(location, place).toFixed(2)), sourceType: 'pulse_verified' }))
    .filter(place => place.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 8)
}

async function fetchN8NPlaces({ location, categories, radiusKm, locale, signal }) {
  if (typeof window === 'undefined') return []
  const { AI_ENABLED, N8N_ENDPOINTS, requestN8N } = await import('./n8nClient.js')
  if (!AI_ENABLED) return []
  const response = await requestN8N(N8N_ENDPOINTS.places, {
    latitude: location.lat,
    longitude: location.lng,
    radius: Math.round(radiusKm * 1000),
    includedTypes: categories.map(category => n8nTypes[category]).filter(Boolean),
    languageCode: locale,
  }, { signal, timeoutMs: 10000 })
  return Array.isArray(response.places) ? response.places.map(place => ({ ...place, distanceKm: Number(distanceKm(location, place).toFixed(2)), sourceType: 'external' })) : []
}

export async function searchNearbyPlaces({ location, categories, radiusKm = 15, locale = 'es', signal, fetchImpl = globalThis.fetch } = {}) {
  if (!isValidLocation(location)) throw new Error('INVALID_LOCATION')
  const safeCategories = normalizedCategories(categories)
  const safeRadiusKm = Math.min(25, Math.max(1, Number(radiusKm) || 15))
  const cachePayload = { lat: Number(location.lat.toFixed(3)), lng: Number(location.lng.toFixed(3)), categories: safeCategories.join(','), radiusKm: safeRadiusKm, locale }

  return withCache('places', cachePayload, async () => {
    try {
      const places = await fetchN8NPlaces({ location, categories: safeCategories, radiusKm: safeRadiusKm, locale, signal })
      if (places.length) return { places, provider: 'google_places', attribution: 'Google Places', generatedAt: new Date().toISOString() }
    } catch (error) {
      if (signal?.aborted) throw error
    }
    try {
      if (typeof fetchImpl !== 'function') throw new Error('FETCH_UNAVAILABLE')
      const places = await fetchNominatimPlaces({ location, categories: safeCategories, radiusKm: safeRadiusKm, locale, signal, fetchImpl })
      if (places.length) return { places, provider: 'openstreetmap', attribution: '© OpenStreetMap contributors', generatedAt: new Date().toISOString() }
    } catch (error) {
      if (signal?.aborted) throw error
    }
    const places = referencePlaces(location, safeCategories, safeRadiusKm)
    return { places, provider: 'pulse_reference', attribution: 'PULSE · referencias locales', generatedAt: new Date().toISOString() }
  }, 30 * 60 * 1000)
}

export function inferPlaceCategories(message) {
  const text = String(message || '').toLowerCase()
  if (/playa|beach|plage|praia|strand/.test(text)) return ['beaches']
  if (/restaurante|restaurant/.test(text)) return ['restaurants']
  if (/caf[eé]|coffee/.test(text)) return ['cafes']
  if (/parque|park/.test(text)) return ['parks']
  if (/museo|museum|musée/.test(text)) return ['museums']
  if (/hospital|hôpital|krankenhaus/.test(text)) return ['hospitals']
  if (/farmacia|pharmacy|pharmacie|apotheke/.test(text)) return ['pharmacies']
  if (/gasolin|fuel|station-service|tankstelle/.test(text)) return ['gas']
  return DEFAULT_CATEGORIES
}
