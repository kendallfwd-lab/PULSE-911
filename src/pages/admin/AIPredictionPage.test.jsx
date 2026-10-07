import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AIPredictionPage from './AIPredictionPage'

const getWeatherForecastMock = vi.hoisted(() => vi.fn())
const refreshStatusMock = vi.hoisted(() => vi.fn())

const db = {
  incidents: [
    { id: 'i1', category: 'traffic_accident', priority: 'P1', createdAt: '2026-10-05T10:00:00-06:00', location: { lat: 9.93, lng: -84.08 } },
    { id: 'i2', category: 'security', priority: 'P2', createdAt: '2026-10-02T10:00:00-06:00', location: { lat: 9.94, lng: -84.07 } },
  ],
  units: [{ id: 'u1', status: 'available' }],
  riskZones: [{ id: 'r1', area: 'Zona demo', reports: 4 }],
  roadStatus: [{ id: 'road', route: 'Ruta 27', status: 'slow', estimatedDelayMin: 12, incidentCount: 1 }],
}

vi.mock('../../context/PulseContext', () => ({ usePulse: () => ({ db }) }))
vi.mock('../../ai/AIContext', () => ({ useAI: () => ({ status: 'local', refreshStatus: refreshStatusMock }) }))
vi.mock('../../services/weatherService', () => ({ getWeatherForecast: getWeatherForecastMock }))
vi.mock('../../components/ai/AIStatusIndicator', () => ({ AIStatusIndicator: () => <span>IA local</span> }))
vi.mock('../../components/Common', () => ({
  Badge: ({ children }) => <span>{children}</span>,
  InlineNotice: ({ children }) => <div role="status">{children}</div>,
}))

describe('AI prediction admin page', () => {
  beforeEach(() => {
    getWeatherForecastMock.mockReset()
    getWeatherForecastMock.mockResolvedValue({
      provider: 'open-meteo',
      forecast: [{ date: '2026-10-07', precipitationProbability: 70, precipitation: 8, maxWind: 20, minTemperature: 20, maxTemperature: 29 }],
    })
  })

  it('shows the prediction domains, evidence and safety disclaimer', async () => {
    render(<AIPredictionPage />)
    expect(await screen.findByText('Qué podría pasar')).toBeInTheDocument()
    expect(screen.getByText('Seguridad y emergencias')).toBeInTheDocument()
    expect(screen.getByText('Clima y entorno')).toBeInTheDocument()
    expect(screen.getByText('Movilidad')).toBeInTheDocument()
    expect(screen.getByText('Capacidad operativa')).toBeInTheDocument()
    expect(screen.getByText('Predicción experimental, no una alerta oficial')).toBeInTheDocument()
  })

  it('switches between weekly and monthly horizons', async () => {
    render(<AIPredictionPage />)
    const monthly = screen.getByRole('button', { name: 'Próximo mes' })
    fireEvent.click(monthly)
    expect(monthly).toHaveAttribute('aria-pressed', 'true')
    expect(await screen.findByText('Incidentes · 30 días')).toBeInTheDocument()
    expect(await screen.findByText(/no constituye una predicción meteorológica mensual/i)).toBeInTheDocument()
  })
})
