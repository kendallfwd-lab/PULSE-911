import { beforeEach, describe, expect, it, vi } from 'vitest'
import { normalizePhotonFeature, searchCostaRicaLocations } from './geocodingService'

describe('Costa Rica geocoding', () => {
  beforeEach(() => localStorage.clear())

  it('normalizes Photon results and rejects places outside Costa Rica', () => {
    const costaRica = normalizePhotonFeature({ geometry: { coordinates: [-84.6298, 9.6149] }, properties: { name: 'Jacó', city: 'Garabito', state: 'Puntarenas', country: 'Costa Rica', countrycode: 'CR', osm_type: 'N', osm_id: 1 } })
    const foreign = normalizePhotonFeature({ geometry: { coordinates: [-121.9, 37.3] }, properties: { name: 'San José', country: 'United States', countrycode: 'US' } })
    expect(costaRica).toMatchObject({ name: 'Jacó', city: 'Garabito', province: 'Puntarenas', lat: 9.6149, lng: -84.6298 })
    expect(foreign).toBeNull()
  })

  it('limits autocomplete to Costa Rica and eight suggestions', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ features: [{ geometry: { coordinates: [-84.6298, 9.6149] }, properties: { name: 'Jacó', state: 'Puntarenas', countrycode: 'CR', osm_id: 1 } }] }) })
    const results = await searchCostaRicaLocations('jac', { fetchImpl })
    const url = new URL(fetchImpl.mock.calls[0][0])
    expect(url.searchParams.get('countrycode')).toBe('CR')
    expect(url.searchParams.get('limit')).toBe('8')
    expect(url.searchParams.has('lang')).toBe(false)
    expect(results[0].name).toBe('Jacó')
  })
})
