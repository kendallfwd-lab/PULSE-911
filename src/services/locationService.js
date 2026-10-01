const LOCATION_API_URL = 'https://ubicaciones.paginasweb.cr'

function normalizeLocations(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('La API devolvió un formato de ubicaciones inválido.')
  }

  return Object.entries(data).map(([id, name]) => ({ id, name: String(name) }))
}

async function getLocations(path, signal) {
  const response = await fetch(`${LOCATION_API_URL}${path}`, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new Error(`No se pudieron consultar las ubicaciones (${response.status}).`)
  }

  return normalizeLocations(await response.json())
}

export const getProvinces = signal => getLocations('/provincias.json', signal)

export const getCantons = (provinceId, signal) =>
  getLocations(`/provincia/${encodeURIComponent(provinceId)}/cantones.json`, signal)

export const getDistricts = (provinceId, cantonId, signal) =>
  getLocations(
    `/provincia/${encodeURIComponent(provinceId)}/canton/${encodeURIComponent(cantonId)}/distritos.json`,
    signal,
  )
