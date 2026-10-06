import { describe, expect, it } from 'vitest'
import { NATIONAL_DEMO_INCIDENTS, NATIONAL_DEMO_POINTS, NATIONAL_DEMO_RISK_ZONES } from './costaRicaDemoMap'

describe('national Costa Rica map demo data', () => {
  it('covers every province with clearly simulated points', () => {
    const provinceLabels = NATIONAL_DEMO_POINTS.map(point => point.location.label)
    for (const province of ['Guanacaste', 'Puntarenas', 'Alajuela', 'Heredia', 'San José', 'Cartago', 'Limón']) {
      expect(provinceLabels.some(label => label.includes(province))).toBe(true)
    }
    expect(NATIONAL_DEMO_INCIDENTS.length).toBeGreaterThanOrEqual(18)
    expect(NATIONAL_DEMO_RISK_ZONES.length).toBeGreaterThanOrEqual(20)
  })

  it('keeps all fictional coordinates inside the Costa Rica map bounds', () => {
    const ids = new Set()
    for (const point of NATIONAL_DEMO_POINTS) {
      expect(point.isSimulated).toBe(true)
      expect(point.sourceType).toBe('simulated_demo')
      expect(point.location.lat).toBeGreaterThanOrEqual(8.0)
      expect(point.location.lat).toBeLessThanOrEqual(11.3)
      expect(point.location.lng).toBeGreaterThanOrEqual(-86.1)
      expect(point.location.lng).toBeLessThanOrEqual(-82.4)
      expect(ids.has(point.id)).toBe(false)
      ids.add(point.id)
    }
  })
})
