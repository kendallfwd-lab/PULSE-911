import { N8N_ENDPOINTS, requestN8N } from './n8nClient'
import { withCache } from './cacheService'

function normalizeForecast(data) {
  const current = data.current || {}
  const daily = data.daily || {}
  const dates = Array.isArray(daily.time) ? daily.time : []
  return {
    provider: 'open-meteo',
    temperature: current.temperature_2m ?? null,
    apparentTemperature: current.apparent_temperature ?? null,
    humidity: current.relative_humidity_2m ?? null,
    precipitation: current.precipitation ?? null,
    rain: current.rain ?? null,
    wind: current.wind_speed_10m ?? null,
    weatherCode: current.weather_code ?? null,
    isDay: current.is_day ?? null,
    sourceUpdatedAt: current.time ?? null,
    generatedAt: new Date().toISOString(),
    forecast: dates.map((date, index) => ({
      date,
      weatherCode: daily.weather_code?.[index] ?? null,
      maxTemperature: daily.temperature_2m_max?.[index] ?? null,
      minTemperature: daily.temperature_2m_min?.[index] ?? null,
      precipitationProbability: daily.precipitation_probability_max?.[index] ?? null,
      precipitation: daily.precipitation_sum?.[index] ?? null,
      maxWind: daily.wind_speed_10m_max?.[index] ?? null,
      sunrise: daily.sunrise?.[index] ?? null,
      sunset: daily.sunset?.[index] ?? null,
    })),
  }
}

async function requestOpenMeteoForecast(location) {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort('timeout'), 9000)
  const query = new URLSearchParams({
    latitude: String(location.lat),
    longitude: String(location.lng),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,rain,wind_speed_10m,weather_code,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,sunrise,sunset',
    timezone: 'America/Costa_Rica',
    forecast_days: '7',
  })
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${query}`, { signal: controller.signal })
    if (!response.ok) throw new Error('OPEN_METEO_UNAVAILABLE')
    return normalizeForecast(await response.json())
  } finally {
    window.clearTimeout(timer)
  }
}

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

export async function getWeatherForecast(location, locale = 'es', refreshToken = 0) {
  return withCache('weather-forecast-v1', { lat: Number(location.lat.toFixed(3)), lng: Number(location.lng.toFixed(3)), locale, refreshToken }, async () => {
    try { return await requestOpenMeteoForecast(location) }
    catch {
      try {
        const current = await requestN8N(N8N_ENDPOINTS.weather, { location, locale })
        return { ...current, forecast: [], provider: current.provider || 'n8n' }
      } catch { return { provider: 'unavailable', unavailable: true, forecast: [] } }
    }
  }, 15 * 60 * 1000)
}
