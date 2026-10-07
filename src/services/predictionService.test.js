import { beforeEach, describe, expect, it, vi } from 'vitest'
import { buildOperationalPrediction, enhancePredictionWithAI } from './predictionService'

const requestN8NMock = vi.hoisted(() => vi.fn())

vi.mock('./n8nClient', () => ({
  N8N_ENDPOINTS: { prediction: '/webhook/pulse/admin/prediction' },
  requestN8N: requestN8NMock,
}))

const day = 86_400_000
const now = Date.parse('2026-10-06T12:00:00-06:00')
const incident = (daysAgo, category = 'traffic_accident', priority = 'P2') => ({
  id: `${category}-${daysAgo}`, category, priority, createdAt: new Date(now - daysAgo * day).toISOString(),
})

const baseDb = {
  incidents: [incident(1), incident(2), incident(3, 'security'), incident(8), incident(10)],
  units: [{ id: 'u1', status: 'available' }, { id: 'u2', status: 'busy' }],
  riskZones: [{ id: 'r1', area: 'Zona Norte', reports: 9 }],
  roadStatus: [{ id: 'v1', route: 'Ruta 27', status: 'slow', estimatedDelayMin: 18, incidentCount: 2 }],
}

describe('prediction service', () => {
  beforeEach(() => {
    requestN8NMock.mockReset()
  })

  it('builds an explainable weekly range from current and previous observations', () => {
    const result = buildOperationalPrediction(baseDb, { now, horizonDays: 7 })
    expect(result.currentCount).toBe(3)
    expect(result.previousCount).toBe(2)
    expect(result.trendPercent).toBe(50)
    expect(result.range.min).toBeLessThanOrEqual(result.expected)
    expect(result.range.max).toBeGreaterThanOrEqual(result.expected)
    expect(result.topCategory).toBe('traffic_accident')
    expect(result.domains.mobility.text).toContain('Ruta 27')
    expect(result.limitations[0]).toMatch(/no afirma/i)
  })

  it('keeps numeric prediction disabled when there is no historical evidence', () => {
    const result = buildOperationalPrediction({ incidents: [], units: [], riskZones: [], roadStatus: [] }, { now })
    expect(result.expected).toBe(0)
    expect(result.range).toEqual({ min: 0, max: 0 })
    expect(result.confidenceLabel).toBe('baja')
    expect(result.dataNote).toMatch(/no hay incidentes/i)
  })

  it('limits monthly weather claims to the seven-day forecast provided', () => {
    const weather = {
      provider: 'open-meteo',
      forecast: Array.from({ length: 7 }, (_, index) => ({
        date: `2026-10-${String(index + 7).padStart(2, '0')}`,
        precipitationProbability: index < 2 ? 80 : 20, precipitation: index < 2 ? 9 : 0,
        maxWind: 22, minTemperature: 20, maxTemperature: 29,
      })),
    }
    const result = buildOperationalPrediction(baseDb, { now, horizonDays: 30, weather })
    expect(result.weather.daysAvailable).toBe(7)
    expect(result.weather.rainyDays).toBe(2)
    expect(result.weather.text).toMatch(/solo los próximos 7 días/i)
    expect(result.limitations.join(' ')).toMatch(/no constituye una predicción meteorológica mensual/i)
  })

  it('keeps the explainable local prediction when remote AI is disabled', async () => {
    const local = buildOperationalPrediction(baseDb, { now })

    await expect(enhancePredictionWithAI(local, { remote: false })).resolves.toBe(local)
    expect(requestN8NMock).not.toHaveBeenCalled()
  })

  it('uses only the safe narrative fields returned by n8n', async () => {
    const local = buildOperationalPrediction(baseDb, { now })
    requestN8NMock.mockResolvedValue({
      summary: 'La demanda podría aumentar; valida la evidencia antes de actuar.',
      recommendations: ['Revisar disponibilidad de unidades.', 'Confirmar el clima con una fuente oficial.'],
      expected: 9999,
    })

    const result = await enhancePredictionWithAI(local, { remote: true })

    expect(requestN8NMock).toHaveBeenCalledWith(
      '/webhook/pulse/admin/prediction',
      expect.objectContaining({ horizonDays: 7, metrics: expect.objectContaining({ expected: local.expected }) }),
      expect.objectContaining({ timeoutMs: 16000 }),
    )
    expect(result.provider).toBe('n8n')
    expect(result.summary).toMatch(/podría aumentar/)
    expect(result.recommendations).toHaveLength(2)
    expect(result.expected).toBe(local.expected)
  })

  it('falls back to the local prediction when n8n fails', async () => {
    const local = buildOperationalPrediction(baseDb, { now })
    requestN8NMock.mockRejectedValue(new Error('n8n unavailable'))

    await expect(enhancePredictionWithAI(local, { remote: true })).resolves.toBe(local)
  })
})
