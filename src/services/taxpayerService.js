const TAXPAYER_API_URL = 'https://api.hacienda.go.cr/fe/ae'
const REQUEST_TIMEOUT_MS = 8000

function taxpayerError(code, message) {
  return Object.assign(new Error(message), { code })
}

export const normalizeIdentification = value => String(value || '').replace(/\D/g, '').slice(0, 12)

export const isValidIdentification = value => /^\d{9,12}$/.test(normalizeIdentification(value))

export async function lookupTaxpayer(value, externalSignal) {
  const identification = normalizeIdentification(value)
  if (!isValidIdentification(identification)) {
    throw taxpayerError('INVALID_IDENTIFICATION', 'La cédula debe contener entre 9 y 12 dígitos.')
  }

  const controller = new AbortController()
  let timedOut = false
  const abortRequest = () => controller.abort()
  const timeoutId = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, REQUEST_TIMEOUT_MS)

  externalSignal?.addEventListener('abort', abortRequest, { once: true })

  try {
    const response = await fetch(
      `${TAXPAYER_API_URL}?identificacion=${encodeURIComponent(identification)}`,
      { headers: { Accept: 'application/json' }, signal: controller.signal },
    )

    if (response.status === 404) {
      throw taxpayerError('NOT_FOUND', 'La cédula no aparece en el registro público de Hacienda.')
    }
    if (response.status === 429) {
      throw taxpayerError('RATE_LIMIT', 'Hacienda recibió demasiadas consultas. Intenta de nuevo más tarde.')
    }
    if (!response.ok) {
      throw taxpayerError('SERVICE_ERROR', 'Hacienda no pudo procesar la consulta en este momento.')
    }

    const data = await response.json()
    if (!data || typeof data.nombre !== 'string' || !data.nombre.trim()) {
      throw taxpayerError('INVALID_RESPONSE', 'Hacienda devolvió una respuesta sin nombre.')
    }

    return {
      identification,
      name: data.nombre.trim(),
      identificationType: typeof data.tipoIdentificacion === 'string' ? data.tipoIdentificacion : '',
    }
  } catch (error) {
    if (error.name === 'AbortError' && timedOut) {
      throw taxpayerError('TIMEOUT', 'La consulta a Hacienda tardó demasiado. Intenta nuevamente.')
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
    externalSignal?.removeEventListener('abort', abortRequest)
  }
}
