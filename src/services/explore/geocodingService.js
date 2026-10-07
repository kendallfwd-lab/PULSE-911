import { COSTA_RICA_BOUNDS } from '../../data/costaRicaProvinces'
import { withCache } from '../cacheService'

const PHOTON_URL = 'https://photon.komoot.io/api'

function isCostaRica(properties = {}) {
  return String(properties.countrycode || '').toUpperCase() === 'CR' || /costa rica/i.test(properties.country || '')
}

export function normalizePhotonFeature(feature) {
  const [lng, lat] = feature?.geometry?.coordinates || []
  const properties = feature?.properties || {}
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !isCostaRica(properties)) return null
  const name = String(properties.name || properties.city || properties.locality || '').trim()
  if (!name) return null
  const city = properties.city || properties.locality || properties.district || properties.county || ''
  const province = properties.state || ''
  const detail = [...new Set([city && city !== name ? city : '', province, 'Costa Rica'].filter(Boolean))].join(', ')
  return {
    id: `photon-${properties.osm_type || 'place'}-${properties.osm_id || `${lat}-${lng}`}`,
    name,
    displayName: detail ? `${name} · ${detail}` : name,
    city,
    province,
    country: 'Costa Rica',
    lat,
    lng,
    source: 'photon',
  }
}

export async function searchCostaRicaLocations(query, { locale = 'es', signal, fetchImpl = globalThis.fetch } = {}) {
  const normalizedQuery = String(query || '').trim().slice(0, 120)
  if (normalizedQuery.length < 2) return []
  const cachePayload = { query: normalizedQuery.toLocaleLowerCase('es'), locale: locale.split('-')[0] }
  return withCache('explore-geocoding-v1', cachePayload, async () => {
    const params = new URLSearchParams({
      q: normalizedQuery,
      countrycode: 'CR',
      limit: '8',
      bbox: `${COSTA_RICA_BOUNDS.minLng},${COSTA_RICA_BOUNDS.minLat},${COSTA_RICA_BOUNDS.maxLng},${COSTA_RICA_BOUNDS.maxLat}`,
    })
    const response = await fetchImpl(`${PHOTON_URL}?${params}`, { signal, headers: { Accept: 'application/geo+json, application/json' } })
    if (!response.ok) throw new Error(`PHOTON_${response.status}`)
    const data = await response.json()
    const seen = new Set()
    return (data.features || []).map(normalizePhotonFeature).filter(place => {
      if (!place) return false
      const key = `${place.name.toLowerCase()}-${place.lat.toFixed(4)}-${place.lng.toFixed(4)}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }).slice(0, 8)
  }, 24 * 60 * 60 * 1000)
}

export async function geocodeCostaRicaLocation(query, options) {
  const [place] = await searchCostaRicaLocations(query, options)
  if (!place) throw new Error('LOCATION_NOT_FOUND')
  return place
}
