function preferredVoice(locale) {
  const voices = window.speechSynthesis?.getVoices?.() || []
  const priorities = locale?.startsWith('es') ? ['es-CR', 'es', 'en-US', 'en'] : ['en-US', 'en', locale, 'es-CR', 'es']
  return priorities.map(code => voices.find(voice => voice.lang?.toLowerCase().startsWith(code.toLowerCase()))).find(Boolean)
}

export function speak(text, locale = document.documentElement.lang || 'es') {
  if (!('speechSynthesis' in window) || !text?.trim()) return false
  stop()
  const utterance = new SpeechSynthesisUtterance(text.slice(0, 12000))
  utterance.lang = locale === 'es' ? 'es-CR' : locale === 'en' ? 'en-US' : locale
  const voice = preferredVoice(utterance.lang)
  if (voice) utterance.voice = voice
  utterance.rate = 0.96
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
