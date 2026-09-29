import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) console.error('PULSE 911 render error', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return <main className="app-error" role="alert">
      <div>
        <AlertTriangle size={36}/>
        <span>RECUPERACIÓN SEGURA</span>
        <h1>No pudimos mostrar esta pantalla</h1>
        <p>Tus datos de demostración siguen guardados en este navegador. Recarga la aplicación para intentarlo de nuevo.</p>
        <button className="btn primary" type="button" onClick={() => window.location.reload()}><RefreshCw size={17}/>Recargar aplicación</button>
      </div>
    </main>
  }
}
