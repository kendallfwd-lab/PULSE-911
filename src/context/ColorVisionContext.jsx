import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const COLOR_VISION_STORAGE_KEY = 'pulse911-color-vision'

export const COLOR_VISION_OPTIONS = [
  { value: 'standard', label: 'Estándar', description: 'Colores originales' },
  { value: 'protanopia', label: 'Protanopia', description: 'Distingue estados sin depender del rojo' },
  { value: 'deuteranopia', label: 'Deuteranopia', description: 'Separa estados con azul, ámbar y magenta' },
  { value: 'tritanopia', label: 'Tritanopia', description: 'Evita depender de azul y amarillo' },
  { value: 'high-contrast', label: 'Alto contraste', description: 'Contraste reforzado para lectura' },
]

const VALID_COLOR_VISION_MODES = new Set(COLOR_VISION_OPTIONS.map(option => option.value))
const ColorVisionContext = createContext(null)

function getInitialColorVisionMode() {
  const documentMode = document.documentElement.dataset.colorVision
  if (VALID_COLOR_VISION_MODES.has(documentMode)) return documentMode

  try {
    const storedMode = localStorage.getItem(COLOR_VISION_STORAGE_KEY)
    if (VALID_COLOR_VISION_MODES.has(storedMode)) return storedMode
  } catch {}

  return 'standard'
}

export function ColorVisionProvider({ children }) {
  const [colorVisionMode, setColorVisionMode] = useState(getInitialColorVisionMode)

  useEffect(() => {
    document.documentElement.dataset.colorVision = colorVisionMode
    try { localStorage.setItem(COLOR_VISION_STORAGE_KEY, colorVisionMode) } catch {}
  }, [colorVisionMode])

  const value = useMemo(() => ({
    colorVisionMode,
    setColorVisionMode: value => {
      if (VALID_COLOR_VISION_MODES.has(value)) setColorVisionMode(value)
    },
    colorVisionOption: COLOR_VISION_OPTIONS.find(option => option.value === colorVisionMode),
  }), [colorVisionMode])

  return <ColorVisionContext.Provider value={value}>{children}</ColorVisionContext.Provider>
}

export function useColorVision() {
  const context = useContext(ColorVisionContext)
  if (!context) throw new Error('useColorVision debe utilizarse dentro de ColorVisionProvider.')
  return context
}
