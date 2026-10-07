import { beforeEach, describe, expect, it, vi } from 'vitest'
import { buildOverpassQuery, EXPLORE_CATEGORY_FILTERS, normalizeOverpassElement, searchExplorePlaces } from './placesService'

describe('explore places service', () => {
  const center = { lat: 9.615, lng: -84.63 }

  beforeEach(() => localStorage.clear())

  it('maps every Explore category to a bounded Overpass query', () => {
    const expected = {
      parks: 'leisure', beaches: 'natural', restaurants: 'amenity', cafes: 'amenity',
      museums: 'tourism', hospitals: 'amenity', pharmacies: 'amenity', gas: 'amenity',
    }
    for (const category of Object.keys(EXPLORE_CATEGORY_FILTERS)) {
      const query = buildOverpassQuery({ category, center, radiusKm: 10 })
      expect(query).toContain(`\"${expected[category]}\"`)
      expect(query).toContain(`around:10000,${center.lat},${center.lng}`)
      expect(query).toContain('out tags center 45')
    }
  })

  it('normalizes real OSM fields without inventing missing information', () => {
    const place = normalizeOverpassElement({
      type: 'node', id: 44, lat: 9.62, lon: -84.63,
      tags: { name: 'Soda Central', amenity: 'restaurant', cuisine: 'local', 'addr:city': 'Jacó', 'addr:street': 'Avenida Pastor', phone: '2222-2222' },
    }, { category: 'restaurants', center, province: 'Puntarenas' })

    expect(place).toMatchObject({ name: 'Soda Central', category: 'restaurants', city: 'Jacó', province: 'Puntarenas', cuisine: 'local', phone: '2222-2222', source: 'OpenStreetMap' })
    expect(place.distanceKm).toBeTypeOf('number')
    expect(place.openingHours).toBe('')
    expect(place).not.toHaveProperty('rating')
  })

  it('returns a normalized empty result and exposes provider failures', async () => {
    const emptyFetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ elements: [] }) })
    await expect(searchExplorePlaces({ center, category: 'museums', fetchImpl: emptyFetch })).resolves.toMatchObject({ places: [], provider: 'openstreetmap' })

    const failedFetch = vi.fn().mockResolvedValue({ ok: false, status: 503 })
    await expect(searchExplorePlaces({ center: { lat: 9.7, lng: -84.1 }, category: 'museums', fetchImpl: failedFetch })).rejects.toThrow('OVERPASS_503')
    expect(failedFetch).toHaveBeenCalledTimes(2)
  })

  it('rejects provider elements that do not match the requested category', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ elements: [
        { type: 'node', id: 1, lat: 9.62, lon: -84.63, tags: { name: 'Farmacia incorrecta', amenity: 'pharmacy' } },
        { type: 'node', id: 2, lat: 9.63, lon: -84.64, tags: { name: 'Gasolinera correcta', amenity: 'fuel' } },
      ] }),
    })

    const result = await searchExplorePlaces({ center, category: 'gas', fetchImpl })
    expect(result.places.map(place => place.name)).toEqual(['Gasolinera correcta'])
    expect(result.places[0].category).toBe('gas')
  })
})
