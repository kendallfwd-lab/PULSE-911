import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProtectedRoute } from './Guards'
import { LOGOUT_REDIRECT_KEY } from '../services/storageService'

const pulseState = vi.hoisted(() => ({ currentUser: null }))

vi.mock('../context/PulseContext', () => ({
  usePulse: () => pulseState,
}))

describe('ProtectedRoute', () => {
  beforeEach(() => {
    pulseState.currentUser = null
    sessionStorage.clear()
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

  it('redirige al inicio sin mostrar 403 durante un cierre de sesión', () => {
    sessionStorage.setItem(LOGOUT_REDIRECT_KEY, String(Date.now()))

    render(
      <MemoryRouter initialEntries={['/app']}>
        <Routes>
          <Route path="/" element={<p>Inicio público</p>} />
          <Route path="/app" element={<ProtectedRoute role="citizen"><p>Contenido privado</p></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Inicio público')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '403' })).not.toBeInTheDocument()
  })
})
