import { fireEvent, render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import GeoMap from './GeoMap'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ i18n: { language: 'es' } }) }))

beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    disconnect() {}
  }
})

describe('GeoMap compact controls', () => {
  it('shows the Explore controls and requests the user location', () => {
    const requestLocation = vi.fn()
    render(<GeoMap compact compactControls onRequestUserLocation={requestLocation}/>)

    expect(screen.getByRole('button', { name: 'Acercar mapa' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Alejar mapa' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Centrar elementos importantes' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ampliar mapa' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mapa' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Operativo' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Capas' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Activar mi ubicación' }))
    expect(requestLocation).toHaveBeenCalledOnce()
  })
})
