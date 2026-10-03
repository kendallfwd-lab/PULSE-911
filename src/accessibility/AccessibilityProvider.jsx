import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { stop } from './speechService'

const STORAGE_KEY = 'pulse911-accessibility-v2'
const defaults = { reducedMotion: false, highlightFocus: false, readingMode: false }
const AccessibilityContext = createContext(null)

function initialPreferences() {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) } } catch { return defaults }
}

export function AccessibilityProvider({ children }) {
  const [preferences, setPreferences] = useState(initialPreferences)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.reduceMotion = preferences.reducedMotion ? 'true' : 'false'
    root.dataset.highlightFocus = preferences.highlightFocus ? 'true' : 'false'
    root.dataset.readingMode = preferences.readingMode ? 'true' : 'false'
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)) } catch {}
  }, [preferences])

  const value = useMemo(() => ({
    preferences,
    toggle: key => setPreferences(current => ({ ...current, [key]: !current[key] })),
    reset: () => { stop(); setPreferences(defaults) },
  }), [preferences])

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) throw new Error('useAccessibility debe utilizarse dentro de AccessibilityProvider.')
  return context
}
