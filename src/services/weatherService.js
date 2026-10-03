import { N8N_ENDPOINTS, requestN8N } from './n8nClient'
import { withCache } from './cacheService'

export async function getWeather(location, locale = 'es') {
  return withCache('weather', { location, locale }, async () => {
    try { return await requestN8N(N8N_ENDPOINTS.weather, { location, locale }) }
    catch {
      try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current=temperature_2m,precipitation,rain,wind_speed_10m,weather_code&hourly=visibility&forecast_days=1`)
        const data = await response.json()
        return { provider: 'open-meteo', temperature: data.current?.temperature_2m, precipitation: data.current?.precipitation, rain: data.current?.rain, wind: data.current?.wind_speed_10m, visibility: data.hourly?.visibility?.[0], warning: (data.current?.precipitation || 0) > 4 ? 'Precaución: lluvia intensa en parte del recorrido.' : null }
      } catch { return { provider: 'local', unavailable: true } }
    }
  }, 15 * 60 * 1000)
}
