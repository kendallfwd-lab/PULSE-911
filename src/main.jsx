import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PulseProvider } from './context/PulseContext'
import { LiveLocationProvider } from './context/LiveLocationContext'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <PulseProvider>
          <LiveLocationProvider>
            <App />
          </LiveLocationProvider>
        </PulseProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
)
