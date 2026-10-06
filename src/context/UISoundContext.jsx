import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'pulse911-ui-sound'

export const UI_SOUND_OPTIONS = [
  { value: 'off', frequency: 0, endFrequency: 0, duration: 0, volume: 0 },
  { value: 'soft', frequency: 480, endFrequency: 360, duration: 0.055, volume: 0.022, wave: 'sine' },
  { value: 'glass', frequency: 760, endFrequency: 560, duration: 0.075, volume: 0.016, wave: 'sine' },
  { value: 'pulse', frequency: 310, endFrequency: 430, duration: 0.065, volume: 0.018, wave: 'triangle' }
]

const UI_SOUND_VALUES = new Set(UI_SOUND_OPTIONS.map(option => option.value))
const UISoundContext = createContext(null)
let sharedAudioContext = null

export function normalizeUISound(value) {
  return UI_SOUND_VALUES.has(value) ? value : 'soft'
}

export function isSoundTarget(target) {
  if (target?.closest?.('[data-ui-sound-ignore]')) return false
  return Boolean(target?.closest?.('button:not(:disabled), a.btn, nav a, [role="menuitem"], [data-ui-sound]'))
}

function readStoredSound() {
  try {
    return normalizeUISound(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    return 'soft'
  }
}

export function playUISound(sound) {
  const option = UI_SOUND_OPTIONS.find(item => item.value === sound)
  const AudioContextClass = window.AudioContext || window.webkitAudioContext
  if (!option || option.value === 'off' || !AudioContextClass) return

  try {
    sharedAudioContext ||= new AudioContextClass()
    if (sharedAudioContext.state === 'suspended') void sharedAudioContext.resume()

    const now = sharedAudioContext.currentTime
    const oscillator = sharedAudioContext.createOscillator()
    const gain = sharedAudioContext.createGain()
    oscillator.type = option.wave
    oscillator.frequency.setValueAtTime(option.frequency, now)
    oscillator.frequency.exponentialRampToValueAtTime(option.endFrequency, now + option.duration)
    gain.gain.setValueAtTime(option.volume, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + option.duration)
    oscillator.connect(gain)
    gain.connect(sharedAudioContext.destination)
    oscillator.start(now)
    oscillator.stop(now + option.duration)
  } catch {
    // Audio is optional: blocked or unsupported Web Audio must never block navigation.
  }
}

export function UISoundProvider({ children }) {
  const [sound, setSoundState] = useState(readStoredSound)

  const setSound = value => {
    const next = normalizeUISound(value)
    setSoundState(next)
    try { window.localStorage.setItem(STORAGE_KEY, next) } catch {}
  }

  useEffect(() => {
    const onClick = event => {
      if (sound !== 'off' && isSoundTarget(event.target)) playUISound(sound)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [sound])

  const value = useMemo(() => ({ sound, setSound, options: UI_SOUND_OPTIONS }), [sound])
  return <UISoundContext.Provider value={value}>{children}</UISoundContext.Provider>
}

export function useUISound() {
  const value = useContext(UISoundContext)
  if (!value) throw new Error('useUISound must be used inside UISoundProvider')
  return value
}
