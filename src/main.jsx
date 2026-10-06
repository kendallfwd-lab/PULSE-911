import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PulseProvider } from './context/PulseContext'
import { LiveLocationProvider } from './context/LiveLocationContext'
import { ThemeProvider } from './context/ThemeContext'
import { TextSizeProvider } from './context/TextSizeContext'
import { ColorVisionProvider } from './context/ColorVisionContext'
import { AccessibilityProvider } from './accessibility/AccessibilityProvider'
import { AIProvider } from './ai/AIContext'
import { UISoundProvider } from './context/UISoundContext'
import { InterfaceTranslationBridge } from './i18n/InterfaceTranslationBridge'
import './i18n'
import './styles.css'
import './theme.css'
import './accessibility.css'
import './features.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <UISoundProvider>
        <ColorVisionProvider>
          <TextSizeProvider>
            <AccessibilityProvider>
            <BrowserRouter>
              <ErrorBoundary>
                <PulseProvider>
                  <LiveLocationProvider>
                    <AIProvider>
                      <InterfaceTranslationBridge />
                      <App />
                    </AIProvider>
                  </LiveLocationProvider>
                </PulseProvider>
              </ErrorBoundary>
            </BrowserRouter>
            </AccessibilityProvider>
          </TextSizeProvider>
        </ColorVisionProvider>
      </UISoundProvider>
    </ThemeProvider>
  </React.StrictMode>
)
