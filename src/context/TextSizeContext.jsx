import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const TEXT_SIZE_STORAGE_KEY = 'pulse911-text-size'
export const TEXT_SIZE_OPTIONS = [
  { value: 'normal', label: 'Normal', percent: '100%' },
  { value: 'large', label: 'Grande', percent: '115%' },
  { value: 'xlarge', label: 'Extra grande', percent: '130%' },
]

const VALID_TEXT_SIZES = new Set(TEXT_SIZE_OPTIONS.map(option => option.value))
const TextSizeContext = createContext(null)

function getInitialTextSize() {
  const documentTextSize = document.documentElement.dataset.textSize
  if (VALID_TEXT_SIZES.has(documentTextSize)) return documentTextSize

  try {
    const storedTextSize = localStorage.getItem(TEXT_SIZE_STORAGE_KEY)
    if (VALID_TEXT_SIZES.has(storedTextSize)) return storedTextSize
  } catch {}

  return 'normal'
}

export function TextSizeProvider({ children }) {
  const [textSize, setTextSize] = useState(getInitialTextSize)

  useEffect(() => {
    document.documentElement.dataset.textSize = textSize
    try { localStorage.setItem(TEXT_SIZE_STORAGE_KEY, textSize) } catch {}
  }, [textSize])

  const value = useMemo(() => ({
    textSize,
    setTextSize: value => {
      if (VALID_TEXT_SIZES.has(value)) setTextSize(value)
    },
    textSizeOption: TEXT_SIZE_OPTIONS.find(option => option.value === textSize),
  }), [textSize])

  return <TextSizeContext.Provider value={value}>{children}</TextSizeContext.Provider>
}

export function useTextSize() {
  const context = useContext(TextSizeContext)
  if (!context) throw new Error('useTextSize debe utilizarse dentro de TextSizeProvider.')
  return context
}
