const prefix = 'pulse911-cache:'

export function cacheKey(scope, payload) {
  return `${prefix}${scope}:${JSON.stringify(payload, Object.keys(payload || {}).sort())}`
}

export function getCached(key) {
  try {
    const record = JSON.parse(localStorage.getItem(key))
    if (!record || record.expiresAt < Date.now()) { localStorage.removeItem(key); return null }
    return record.value
  } catch { return null }
}

export function setCached(key, value, ttlMs = 5 * 60 * 1000) {
  try { localStorage.setItem(key, JSON.stringify({ value, expiresAt: Date.now() + ttlMs })) } catch {}
  return value
}

export async function withCache(scope, payload, loader, ttlMs) {
  const key = cacheKey(scope, payload)
  const cached = getCached(key)
  if (cached != null) return cached
  return setCached(key, await loader(), ttlMs)
}
