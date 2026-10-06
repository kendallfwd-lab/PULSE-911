import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import MobilityInsightsPage from './MobilityInsightsPage'

const getWeatherForecastMock = vi.hoisted(() => vi.fn())
const startLocationMock = vi.hoisted(() => vi.fn())

vi.mock('../../services/weatherService', () => ({
  getWeatherForecast: getWeatherForecastMock,
}))

vi.mock('../../context/LiveLocationContext', () => ({
  useLiveLocation: () => ({
    location: null,
    status: 'idle',
    error: '',
    start: startLocationMock,
  }),
}))

vi.mock('../../context/PulseContext', () => ({
  usePulse: () => ({
    db: {
      roadStatus: [
        {
          id: 'road-27',
          route: 'Ruta 27',
          name: 'San José - Caldera',
          status: 'slow',
          trafficImpact: 'medium',
          incidentCount: 2,
          estimatedDelayMin: 18,
          direction: 'Hacia Caldera',
          alternativeRoute: 'Ruta 3 por Atenas',
        },
        {
          id: 'road-1',
          route: 'Interamericana Norte',
          name: 'Ruta Nacional 1',
          status: 'normal',
          trafficImpact: 'none',
          incidentCount: 0,
          estimatedDelayMin: 0,
          direction: 'Ambos sentidos',
        },
      ],
    },
  }),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ i18n: { language: 'es' } }),
}))

const weatherFixture = {
  provider: 'open-meteo',
  temperature: 27,
  apparentTemperature: 30,
  wind: 16,
  weatherCode: 61,
  generatedAt: '2026-10-06T12:00:00-06:00',
  forecast: [
    { date: '2026-10-06', weatherCode: 95, maxTemperature: 30, minTemperature: 23, precipitationProbability: 90, precipitation: 10, maxWind: 32 },
    { date: '2026-10-07', weatherCode: 61, maxTemperature: 29, minTemperature: 22, precipitationProbability: 70, precipitation: 20, maxWind: 24 },
    { date: '2026-10-08', weatherCode: 2, maxTemperature: 31, minTemperature: 23, precipitationProbability: 20, precipitation: 12, maxWind: 18 },
  ],
}

describe('MobilityInsightsPage', () => {
  beforeEach(() => {
    getWeatherForecastMock.mockReset()
    getWeatherForecastMock.mockResolvedValue(weatherFixture)
  })

  it('muestra las estadísticas y recomendaciones calculadas con clima y rutas', async () => {
    render(<MobilityInsightsPage />)

    expect(screen.getByRole('heading', { name: 'Clima y movilidad con contexto' })).toBeInTheDocument()
    expect(await screen.findByText('42 mm')).toBeInTheDocument()
    expect(screen.getByText('3 de 3')).toBeInTheDocument()
    expect(screen.getByText('18 min')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Índice de movilidad segura' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Próximas 72 horas' })).toBeInTheDocument()
    expect(screen.getByText('Prepara una alternativa a Ruta 27')).toBeInTheDocument()
    expect(getWeatherForecastMock).toHaveBeenCalledOnce()
  })
})
