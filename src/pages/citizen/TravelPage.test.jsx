import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import TravelPage from './TravelPage'

const searchPlacesMock = vi.hoisted(() => vi.fn())
const getWeatherMock = vi.hoisted(() => vi.fn())

vi.mock('../../services/explore/placesService', () => ({ searchExplorePlaces: searchPlacesMock }))
vi.mock('../../services/weatherService', () => ({ getWeather: getWeatherMock }))
vi.mock('../../context/LiveLocationContext', () => ({ useLiveLocation: () => ({ location: null }) }))
vi.mock('../../components/GeoMap', () => ({ default: () => <div data-testid="explore-map"/> }))
vi.mock('../../components/travel/RoutePlanner', () => ({ RoutePlanner: () => <div data-testid="route-planner"/> }))

const translations = {
  'travel.kicker': 'Movilidad y prevención', 'travel.title': 'Explorar Costa Rica', 'travel.subtitle': 'Planifica recorridos',
  'travel.visitor': 'Estoy visitando Costa Rica', 'travel.explore': 'Explorar', 'travel.places': 'Lugares útiles',
  'travel.searchNearby': 'Buscar cerca', 'travel.parks': 'Parques', 'travel.beaches': 'Playas', 'travel.restaurants': 'Restaurantes',
  'travel.cafes': 'Cafeterías', 'travel.museums': 'Museos', 'travel.hospitals': 'Hospitales', 'travel.pharmacies': 'Farmacias', 'travel.gas': 'Gasolineras',
}
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: key => translations[key] || key, i18n: { language: 'es' } }) }))

describe('TravelPage API states', () => {
  beforeEach(() => {
    localStorage.clear()
    searchPlacesMock.mockReset()
    getWeatherMock.mockReset()
    getWeatherMock.mockResolvedValue({ unavailable: true })
  })

  it('shows an actionable empty state when a real query has no matches', async () => {
    searchPlacesMock.mockResolvedValue({ places: [], attribution: '© OpenStreetMap contributors' })
    render(<TravelPage />)
    fireEvent.click(screen.getByRole('button', { name: /Parques/i }))
    expect(await screen.findByText('No encontramos parques en esta zona.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ampliar área' })).toBeInTheDocument()
  })

  it('keeps the page usable and offers retry when the provider fails', async () => {
    searchPlacesMock.mockRejectedValue(new Error('OVERPASS_UNAVAILABLE'))
    render(<TravelPage />)
    fireEvent.click(screen.getByRole('button', { name: /Museos/i }))
    expect(await screen.findByText('No pudimos consultar los lugares en este momento.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument()
    expect(screen.getByTestId('route-planner')).toBeInTheDocument()
  })

  it('switches from pharmacies to gas stations while the previous request is loading', async () => {
    let resolvePharmacies
    searchPlacesMock
      .mockImplementationOnce(() => new Promise(resolve => { resolvePharmacies = resolve }))
      .mockResolvedValueOnce({
        places: [{ id: 'fuel-1', name: 'Estación Central', category: 'gas', lat: 9.93, lng: -84.08, distanceKm: 1.2 }],
        attribution: '© OpenStreetMap contributors',
      })
    render(<TravelPage />)

    fireEvent.click(screen.getByRole('button', { name: /Farmacias/i }))
    const gasButton = screen.getByRole('button', { name: /Gasolineras/i })
    expect(gasButton).not.toBeDisabled()
    fireEvent.click(gasButton)

    await screen.findByText('Estación Central')
    expect(searchPlacesMock.mock.calls[1][0].category).toBe('gas')
    expect(screen.getByRole('heading', { name: /Gasolineras cerca de Jacó/i })).toBeInTheDocument()

    resolvePharmacies({ places: [{ id: 'pharmacy-1', name: 'Farmacia tardía', category: 'pharmacies', lat: 9.9, lng: -84.1 }], attribution: '© OpenStreetMap contributors' })
    await waitFor(() => expect(screen.queryByText('Farmacia tardía')).not.toBeInTheDocument())
  })
})
