const STORAGE_KEY = 'pulse911-accessibility-v2'

const FEMALE_NAME_HINTS = [
  'aria', 'catalina', 'conchita', 'dalia', 'elvira', 'elsa', 'female', 'helena',
  'isabella', 'jenny', 'laura', 'lucia', 'maría', 'maria', 'mónica', 'monica',
  'paloma', 'paulina', 'sabina', 'sara', 'sofia', 'sofía', 'susan', 'woman', 'zira',
]

const ACCENT_NAMES = {
  'es-AR': 'Argentina', 'es-BO': 'Bolivia', 'es-CL': 'Chile', 'es-CO': 'Colombia',
  'es-CR': 'Costa Rica', 'es-CU': 'Cuba', 'es-DO': 'República Dominicana',
  'es-EC': 'Ecuador', 'es-ES': 'España', 'es-GT': 'Guatemala', 'es-HN': 'Honduras',
  'es-MX': 'México', 'es-NI': 'Nicaragua', 'es-PA': 'Panamá', 'es-PE': 'Perú',
  'es-PR': 'Puerto Rico', 'es-PY': 'Paraguay', 'es-SV': 'El Salvador',
  'es-US': 'Estados Unidos', 'es-UY': 'Uruguay', 'es-VE': 'Venezuela',
  'en-AU': 'Australia', 'en-GB': 'Reino Unido', 'en-IN': 'India', 'en-US': 'Estados Unidos',
  'fr-CA': 'Canadá', 'fr-FR': 'Francia', 'pt-BR': 'Brasil', 'pt-PT': 'Portugal',
  'de-DE': 'Alemania',
}

function normalizedLanguage(language = '') {
  const [base = '', region = ''] = language.replace('_', '-').split('-')
  return region ? `${base.toLowerCase()}-${region.toUpperCase()}` : base.toLowerCase()
}

function storedVoiceURI() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY))?.voiceURI || '' } catch { return '' }
}

export function isLikelyFemaleVoice(voice) {
  const name = String(voice?.name || '').toLocaleLowerCase()
  return FEMALE_NAME_HINTS.some(hint => name.includes(hint))
}

export function accentName(language) {
  const normalized = normalizedLanguage(language)
  if (ACCENT_NAMES[normalized]) return ACCENT_NAMES[normalized]
  if (!normalized) return 'Acento no indicado'
  try {
    const [, region] = normalized.split('-')
    if (region && typeof Intl.DisplayNames === 'function') return new Intl.DisplayNames(['es'], { type: 'region' }).of(region)
  } catch {}
  return normalized.toUpperCase()
}

export function getAvailableVoices(locale = document.documentElement.lang || 'es') {
  const voices = window.speechSynthesis?.getVoices?.() || []
  const base = normalizedLanguage(locale).split('-')[0] || 'es'
  const matching = voices.filter(voice => normalizedLanguage(voice.lang).startsWith(base))
  return [...matching].sort((a, b) => {
    const femaleDifference = Number(isLikelyFemaleVoice(b)) - Number(isLikelyFemaleVoice(a))
    if (femaleDifference) return femaleDifference
    const costaRicaDifference = Number(normalizedLanguage(b.lang) === 'es-CR') - Number(normalizedLanguage(a.lang) === 'es-CR')
    if (costaRicaDifference) return costaRicaDifference
    return `${accentName(a.lang)} ${a.name}`.localeCompare(`${accentName(b.lang)} ${b.name}`, 'es')
  })
}

export function voiceLabel(voice) {
  const profile = isLikelyFemaleVoice(voice) ? 'Voz femenina' : 'Voz disponible'
  return `${voice.name} · ${accentName(voice.lang)} · ${profile}`
}

function preferredVoice(locale, voiceURI = storedVoiceURI()) {
  const voices = window.speechSynthesis?.getVoices?.() || []
  const selected = voiceURI && voices.find(voice => voice.voiceURI === voiceURI)
  if (selected) return selected
  const priorities = locale?.startsWith('es') ? ['es-CR', 'es', 'en-US', 'en'] : [locale, 'en-US', 'en', 'es-CR', 'es']
  for (const code of priorities) {
    const candidates = voices.filter(voice => normalizedLanguage(voice.lang).startsWith(normalizedLanguage(code)))
    const female = candidates.find(isLikelyFemaleVoice)
    if (female) return female
    if (candidates[0]) return candidates[0]
  }
  return undefined
}

export function speak(text, locale = document.documentElement.lang || 'es', options = {}) {
  if (!('speechSynthesis' in window) || !text?.trim()) return false
  stop()
  const utterance = new SpeechSynthesisUtterance(text.slice(0, 12000))
  utterance.lang = locale === 'es' ? 'es-CR' : locale === 'en' ? 'en-US' : locale
  const voice = preferredVoice(utterance.lang, options.voiceURI)
  if (voice) {
    utterance.voice = voice
    utterance.lang = voice.lang
  }
  utterance.rate = options.rate || 0.96
  window.speechSynthesis.speak(utterance)
  return true
}

export function pause() { window.speechSynthesis?.pause() }
export function resume() { window.speechSynthesis?.resume() }
export function stop() { window.speechSynthesis?.cancel() }

export function pageSummary() {
  const root = document.querySelector('main') || document.body
  return [...root.querySelectorAll('h1,h2,h3,p,li,[role="status"]')]
    .filter(element => !element.closest('[aria-hidden="true"]'))
    .map(element => element.textContent.trim())
    .filter(Boolean)
    .slice(0, 80)
    .join('. ')
}
