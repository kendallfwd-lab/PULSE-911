const BASE_URL = (import.meta.env.VITE_N8N_BASE_URL || '').replace(/\/$/, '')
export const AI_ENABLED = String(import.meta.env.VITE_PULSE_AI_ENABLED || 'false') === 'true'

export const N8N_ENDPOINTS = Object.freeze({
  chat: '/webhook/pulse/chat', translate: '/webhook/pulse/translate', route: '/webhook/pulse/route',
  places: '/webhook/pulse/places', weather: '/webhook/pulse/weather', analyzeReport: '/webhook/pulse/admin/analyze-report',
  analyzeRisk: '/webhook/pulse/admin/analyze-risk', approveSuggestion: '/webhook/pulse/admin/approve-suggestion', sync: '/webhook/pulse/sync', status: '/webhook/pulse/status',
})

export async function requestN8N(path, payload, { method = 'POST', timeoutMs = 12000, signal } = {}) {
  if (!BASE_URL) throw new Error('N8N_NOT_CONFIGURED')
  const controller = new AbortController()
  const abort = () => controller.abort(signal?.reason)
  signal?.addEventListener('abort', abort, { once: true })
  const timer = window.setTimeout(() => controller.abort('timeout'), timeoutMs)
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method, signal: controller.signal, headers: { Accept: 'application/json', ...(method === 'GET' ? {} : { 'Content-Type': 'application/json' }) },
      ...(method === 'GET' ? {} : { body: JSON.stringify(payload || {}) }),
    })
    const data = await response.json().catch(() => null)
    if (!response.ok || !data) throw new Error(data?.message || `N8N_${response.status}`)
    return data
  } finally {
    window.clearTimeout(timer)
    signal?.removeEventListener('abort', abort)
  }
}

export async function getAIStatus() {
  if (!AI_ENABLED || !BASE_URL) return { state: 'offline', checkedAt: new Date().toISOString() }
  try { await requestN8N(N8N_ENDPOINTS.status, null, { method: 'GET', timeoutMs: 4500 }); return { state: 'online', checkedAt: new Date().toISOString() } }
  catch { return { state: 'degraded', checkedAt: new Date().toISOString() } }
}
