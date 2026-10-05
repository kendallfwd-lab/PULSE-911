import { N8N_ENDPOINTS, requestN8N } from './n8nClient'

export async function getAssistantPublicContext({ message, location, locale, signal }) {
  try {
    const response = await requestN8N(N8N_ENDPOINTS.context, {
      message: String(message || '').slice(0, 500),
      location: location ? { lat: location.lat, lng: location.lng } : null,
      locale,
    }, { signal, timeoutMs: 16000 })
    return response?.ok ? response : null
  } catch (error) {
    if (signal?.aborted) throw error
    return null
  }
}

export function publicContextRecords(context) {
  if (!context) return []
  const weather = context.weather ? [{
    id: `weather-${context.weather.observedAt || context.generatedAt}`,
    title: 'Clima actual',
    description: [
      Number.isFinite(context.weather.temperatureC) ? `${context.weather.temperatureC} °C` : null,
      Number.isFinite(context.weather.precipitationMm) ? `precipitación ${context.weather.precipitationMm} mm` : null,
      Number.isFinite(context.weather.windKmh) ? `viento ${context.weather.windKmh} km/h` : null,
      Number.isFinite(context.weather.visibilityM) ? `visibilidad ${context.weather.visibilityM} m` : null,
    ].filter(Boolean).join(' · '),
    location: context.location,
    sourceType: 'open_meteo',
    updatedAt: context.weather.observedAt || context.generatedAt,
  }] : []

  const news = (context.news || []).map(item => ({
    id: item.id,
    title: item.title,
    description: `Noticia reciente de ${item.domain || 'fuente externa'}${item.publishedAt ? ` · ${item.publishedAt}` : ''}`,
    sourceType: item.provider === 'google-news-rss' ? 'google_news' : 'gdelt_news',
    updatedAt: item.publishedAt || context.generatedAt,
  }))

  const imnAlerts = (context.imnAlerts || []).slice(0, 2).map(item => ({
    id: item.id,
    title: item.title,
    description: `Aviso oficial del IMN${item.description ? ` · ${String(item.description).slice(0, 420)}` : ''}`,
    sourceType: 'imn_alert',
    updatedAt: item.publishedAt || context.generatedAt,
  }))

  const places = (context.places || []).map(item => ({
    id: item.id,
    title: item.name,
    description: `Lugar documentado en Wikipedia${Number.isFinite(item.distanceM) ? ` · ${Math.round(item.distanceM)} m del punto consultado` : ''}`,
    location: { lat: item.lat, lng: item.lng },
    sourceType: 'wikipedia_place',
    updatedAt: context.generatedAt,
  }))

  return [...imnAlerts, ...weather, ...news, ...places]
}
