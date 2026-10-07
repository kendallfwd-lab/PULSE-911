import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getRoutes } from './routeService'

const requestN8NMock = vi.hoisted(() => vi.fn())
vi.mock('./n8nClient', () => ({ N8N_ENDPOINTS: { route: '/route' }, requestN8N: requestN8NMock }))

describe('route service', () => {
  beforeEach(() => {
    localStorage.clear()
    requestN8NMock.mockReset()
    requestN8NMock.mockRejectedValue(new Error('N8N_NOT_CONFIGURED'))
  })

  it('normalizes an OSRM route when n8n is unavailable', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ routes: [{ distance: 12500, duration: 1500, geometry: { coordinates: [[-84.09, 9.93], [-84.63, 9.61]] } }] }) })
    vi.stubGlobal('fetch', fetchMock)
    const [route] = await getRoutes({ origin: { lat: 9.93, lng: -84.09 }, destination: { lat: 9.61, lng: -84.63 } })
    expect(route).toMatchObject({ provider: 'osrm', distanceKm: 12.5, durationMin: 25 })
    expect(route.geometry).toEqual([{ lat: 9.93, lng: -84.09 }, { lat: 9.61, lng: -84.63 }])
    vi.unstubAllGlobals()
  })
})
