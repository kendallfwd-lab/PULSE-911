import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProtectedRoute } from './Guards'

const pulseState = vi.hoisted(() => ({ currentUser: null }))

vi.mock('../context/PulseContext', () => ({
  usePulse: () => pulseState,
}))

describe('ProtectedRoute', () => {
  beforeEach(() => {
    pulseState.currentUser = null
  })

  it('presenta el error 403 cuando una persona no ha iniciado sesión', () => {
    render(
      <MemoryRouter initialEntries={['/app/insights']}>
        <ProtectedRoute role="citizen"><p>Contenido privado</p></ProtectedRoute>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: '403' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Acceso denegado' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /iniciar sesión/i })).toHaveAttribute('href', '/login')
    expect(screen.queryByText('Contenido privado')).not.toBeInTheDocument()
  })

  it('permite ver el contenido a una cuenta ciudadana autorizada', () => {
    pulseState.currentUser = { id: 'citizen-1', role: 'citizen', profileComplete: true }

    render(
      <MemoryRouter initialEntries={['/app/insights']}>
        <ProtectedRoute role="citizen"><p>Contenido privado</p></ProtectedRoute>
      </MemoryRouter>,
    )

    expect(screen.getByText('Contenido privado')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '403' })).not.toBeInTheDocument()
  })
})
