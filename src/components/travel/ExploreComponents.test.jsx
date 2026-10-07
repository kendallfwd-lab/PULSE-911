import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LocationAutocomplete } from './LocationAutocomplete'
import { PlaceResultCard } from './PlaceResultCard'

const searchLocationsMock = vi.hoisted(() => vi.fn())
vi.mock('../../services/explore/geocodingService', () => ({ searchCostaRicaLocations: searchLocationsMock }))

describe('Explore Costa Rica components', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    searchLocationsMock.mockReset()
  })
  afterEach(() => vi.useRealTimers())

  it('debounces destination autocomplete and selects a Costa Rica result', async () => {
    const onQueryChange = vi.fn()
    const onSelect = vi.fn()
    searchLocationsMock.mockResolvedValue([{ id: 'jaco', name: 'Jacó', city: 'Garabito', province: 'Puntarenas', country: 'Costa Rica', lat: 9.61, lng: -84.63 }])
    const view = render(<LocationAutocomplete label="Destino" query="" onQueryChange={onQueryChange} selected={null} onSelect={onSelect} placeholder="Busca"/>)
    view.rerender(<LocationAutocomplete label="Destino" query="jac" onQueryChange={onQueryChange} selected={null} onSelect={onSelect} placeholder="Busca"/>)

    expect(searchLocationsMock).not.toHaveBeenCalled()
    await act(async () => { await vi.advanceTimersByTimeAsync(401); await Promise.resolve() })
    expect(searchLocationsMock).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('option', { name: /Jacó/i }))
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ name: 'Jacó', province: 'Puntarenas' }))
  })

  it('renders only available place data and exposes map and route actions', () => {
    const onView = vi.fn(); const onDirections = vi.fn()
    render(<PlaceResultCard place={{ id: '1', name: 'Museo de Arte', category: 'museums', city: 'San José', province: 'San José', distanceKm: 1.4 }} label="Museo" onView={onView} onDirections={onDirections}/>)
    expect(screen.getByRole('heading', { name: 'Museo de Arte' })).toBeInTheDocument()
    expect(screen.getByText(/1[,.]4 km/)).toBeInTheDocument()
    expect(screen.queryByText(/rating/i)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /ver ubicación/i }))
    fireEvent.click(screen.getByRole('button', { name: /cómo llegar/i }))
    expect(onView).toHaveBeenCalledOnce()
    expect(onDirections).toHaveBeenCalledOnce()
  })
})
