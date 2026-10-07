import { N8N_ENDPOINTS, requestN8N } from './n8nClient'

const DAY_MS = 86_400_000
const CLOSED_ROAD_STATES = new Set(['closed', 'partial_block', 'slow', 'precaution'])
const CATEGORY_LABELS = Object.freeze({
  traffic_accident: 'accidentes de tránsito', medical: 'emergencias médicas', fire: 'incendios',
  flood: 'inundaciones', security: 'seguridad', road_hazard: 'riesgos viales', other: 'otros incidentes',
})

const asList = value => Array.isArray(value) ? value : []
const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const round = value => Math.round(finite(value))
const validTime = value => {
  const time = new Date(value).getTime()
  return Number.isFinite(time) ? time : null
}

function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = item?.[key] || 'other'
    counts[value] = (counts[value] || 0) + 1
    return counts
  }, {})
}

function highestEntry(counts) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || ['other', 0]
}

function summarizeWeather(weather, horizonDays) {
  const days = asList(weather?.forecast).slice(0, Math.min(horizonDays, 7))
  if (!days.length) return {
    available: false, provider: weather?.provider || 'unavailable', daysAvailable: 0, rainyDays: 0,
    maxRainProbability: null, maxRainMm: null, maxWind: null, minTemperature: null, maxTemperature: null,
    text: 'No fue posible obtener un pronóstico meteorológico actualizado. Verifica el IMN antes de tomar decisiones operativas.',
  }
  const probabilities = days.map(day => finite(day.precipitationProbability, 0))
  const rain = days.map(day => finite(day.precipitation, 0))
  const winds = days.map(day => finite(day.maxWind, 0))
  const minimums = days.map(day => finite(day.minTemperature, NaN)).filter(Number.isFinite)
  const maximums = days.map(day => finite(day.maxTemperature, NaN)).filter(Number.isFinite)
  const rainyDays = days.filter((day, index) => probabilities[index] >= 50 || rain[index] >= 5).length
  const maxRainProbability = Math.max(...probabilities)
  const maxRainMm = Math.max(...rain)
  const maxWind = Math.max(...winds)
  const monthlyNotice = horizonDays > 7 ? ' La señal meteorológica cubre solo los próximos 7 días; no se presenta como pronóstico mensual.' : ''
  return {
    available: true, provider: weather?.provider || 'open-meteo', daysAvailable: days.length, rainyDays,
    maxRainProbability, maxRainMm: Number(maxRainMm.toFixed(1)), maxWind: Number(maxWind.toFixed(1)),
    minTemperature: minimums.length ? Math.min(...minimums) : null,
    maxTemperature: maximums.length ? Math.max(...maximums) : null,
    text: rainyDays
      ? `Se observan ${rainyDays} día(s) con señal de lluvia y una probabilidad máxima de ${round(maxRainProbability)}%. Conviene reforzar vigilancia vial y por anegamientos.${monthlyNotice}`
      : `No se observan señales fuertes de lluvia en los ${days.length} días disponibles; mantén verificación diaria con fuentes oficiales.${monthlyNotice}`,
  }
}

function buildWeeklySeries(events, anchorTime, projection) {
  const values = [3, 2, 1, 0].map(offset => {
    const end = anchorTime - offset * 7 * DAY_MS
    const start = end - 7 * DAY_MS
    return events.filter(event => event.time > start && event.time <= end).length
  })
  return [
    ...values.map((value, index) => ({ label: `Sem. -${3 - index}`, value, predicted: false })),
    { label: 'Predicción', value: round(projection), predicted: true },
  ]
}

function buildRecommendations({ weather, affectedRoads, pressure, topCategoryLabel, securityCount }) {
  const items = []
  if (weather.available && weather.rainyDays) items.push('Revisar drenajes, zonas inundables y corredores con baja visibilidad antes de los días con lluvia señalados.')
  if (affectedRoads.length) items.push(`Mantener seguimiento de ${affectedRoads[0].route || affectedRoads[0].name || 'la vía con mayor afectación'} y validar desvíos antes de emitir avisos.`)
  if (pressure === 'alta') items.push('Preparar una reserva operativa y revisar disponibilidad de unidades antes del periodo de mayor demanda estimada.')
  if (securityCount) items.push('Contrastar los reportes de seguridad con la ubicación y la hora antes de definir patrullaje preventivo.')
  items.push(`Monitorear ${topCategoryLabel} como señal principal y recalcular la predicción cuando entren nuevos reportes.`)
  return [...new Set(items)].slice(0, 4)
}

export function buildOperationalPrediction(db = {}, { horizonDays = 7, weather = null, now = Date.now() } = {}) {
  const horizon = horizonDays === 30 ? 30 : 7
  const events = asList(db.incidents)
    .map(incident => ({ incident, time: validTime(incident.createdAt) }))
    .filter(item => item.time !== null)
    .sort((a, b) => a.time - b.time)
  const latestTime = events.at(-1)?.time || finite(now, Date.now())
  const staleDays = events.length ? Math.max(0, Math.floor((finite(now, Date.now()) - latestTime) / DAY_MS)) : null
  const currentStart = latestTime - horizon * DAY_MS
  const previousStart = currentStart - horizon * DAY_MS
  const current = events.filter(item => item.time > currentStart && item.time <= latestTime)
  const previous = events.filter(item => item.time > previousStart && item.time <= currentStart)
  const currentCount = current.length
  const previousCount = previous.length
  const trendPercent = previousCount ? round(((currentCount - previousCount) / previousCount) * 100) : 0
  const dailyRate = currentCount / horizon
  const rawProjection = events.length ? Math.max(0, dailyRate * horizon * (1 + clamp(trendPercent, -40, 60) / 200)) : 0
  const expected = round(rawProjection)
  const uncertainty = events.length ? Math.max(2, Math.ceil(expected * (events.length < 15 ? .45 : .28))) : 0
  const range = { min: Math.max(0, expected - uncertainty), max: expected + uncertainty }
  const [topCategory, topCategoryCount] = highestEntry(countBy(current.map(item => item.incident), 'category'))
  const topCategoryLabel = CATEGORY_LABELS[topCategory] || CATEGORY_LABELS.other
  const securityCount = current.filter(item => item.incident.category === 'security').length
  const highPriorityCount = current.filter(item => ['P0', 'P1'].includes(item.incident.priority)).length
  const risks = asList(db.riskZones).sort((a, b) => finite(b.reports) - finite(a.reports))
  const affectedRoads = asList(db.roadStatus)
    .filter(road => CLOSED_ROAD_STATES.has(road.status) || finite(road.incidentCount) > 0)
    .sort((a, b) => finite(b.estimatedDelayMin) - finite(a.estimatedDelayMin))
  const units = asList(db.units)
  const availableUnits = units.filter(unit => unit.status === 'available').length
  const weatherSummary = summarizeWeather(weather, horizon)
  const pressureRatio = availableUnits ? expected / availableUnits : expected ? Infinity : 0
  const pressure = pressureRatio > 2.2 ? 'alta' : pressureRatio > 1 ? 'moderada' : 'baja'
  const sampleConfidence = events.length ? 34 + Math.min(34, Math.round(events.length * 1.7)) : 18
  const confidence = clamp(sampleConfidence + (weatherSummary.available ? 8 : 0) - (staleDays > 14 ? 12 : staleDays > 7 ? 6 : 0), 18, 82)
  const confidenceLabel = confidence >= 68 ? 'alta' : confidence >= 48 ? 'media' : 'baja'
  const scenarios = [
    { key: 'favorable', label: 'Escenario favorable', value: range.min, detail: 'Menor demanda dentro del rango estimado.' },
    { key: 'expected', label: 'Escenario esperado', value: expected, detail: 'Proyección central según la tendencia observada.' },
    { key: 'demanding', label: 'Escenario exigente', value: range.max, detail: 'Límite superior para preparar capacidad.' },
  ]
  const recommendations = buildRecommendations({ weather: weatherSummary, affectedRoads, pressure, topCategoryLabel, securityCount })
  const dataNote = !events.length
    ? 'No hay incidentes con fecha válida; la predicción numérica permanece desactivada.'
    : staleDays > 7
      ? `El último reporte utilizable tiene ${staleDays} días. La confianza se reduce hasta recibir información reciente.`
      : `Se usaron ${events.length} incidentes históricos y ${currentCount} del último periodo observado.`
  return {
    generatedAt: new Date(finite(now, Date.now())).toISOString(), horizonDays: horizon, provider: 'local-explainable',
    expected, range, trendPercent, currentCount, previousCount, sampleSize: events.length, staleDays,
    confidence, confidenceLabel, topCategory, topCategoryLabel, topCategoryCount, highPriorityCount,
    weather: weatherSummary, availableUnits, totalUnits: units.length, pressure,
    affectedRoads: affectedRoads.slice(0, 3), topRiskZone: risks[0] || null,
    series: buildWeeklySeries(events, latestTime, horizon === 30 ? expected / 4.3 : expected), scenarios,
    summary: events.length
      ? `Para los próximos ${horizon} días se estiman entre ${range.min} y ${range.max} incidentes, con ${topCategoryLabel} como señal principal. La presión operativa prevista es ${pressure}.`
      : 'Aún no hay evidencia histórica suficiente para calcular una predicción de incidentes.',
    domains: {
      security: {
        title: 'Seguridad y emergencias', confidence: confidenceLabel,
        text: securityCount
          ? `Se observaron ${securityCount} reporte(s) de seguridad en el periodo base. Esta señal requiere validación geográfica antes de planificar acciones.`
          : 'No se observa un aumento específico de seguridad en el periodo base; conviene mantener vigilancia y validación de nuevos reportes.',
      },
      weather: { title: 'Clima y entorno', confidence: weatherSummary.available ? 'media' : 'baja', text: weatherSummary.text },
      mobility: {
        title: 'Movilidad', confidence: affectedRoads.length ? 'media' : 'baja',
        text: affectedRoads.length
          ? `${affectedRoads.length} vía(s) presentan afectación registrada. ${affectedRoads[0].route || affectedRoads[0].name || 'La principal vía afectada'} concentra la mayor demora conocida.`
          : 'No hay vías afectadas en los datos actuales. La ausencia de reportes no garantiza tránsito normal.',
      },
      capacity: {
        title: 'Capacidad operativa', confidence: units.length ? 'media' : 'baja',
        text: units.length
          ? `${availableUnits} de ${units.length} unidades figuran disponibles. La presión esperada es ${pressure}.`
          : 'No hay inventario de unidades disponible para estimar capacidad operativa.',
      },
    },
    recommendations, dataNote,
    limitations: [
      'La estimación identifica patrones; no afirma que un evento ocurrirá.',
      'Los reportes de PULSE son locales o simulados y pueden estar incompletos.',
      horizon > 7 ? 'El clima mostrado cubre como máximo 7 días y no constituye una predicción meteorológica mensual.' : 'El clima debe confirmarse con el IMN y fuentes oficiales.',
    ],
  }
}

function safeText(value, max = 600) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export async function enhancePredictionWithAI(prediction, { remote = false, signal } = {}) {
  if (!remote) return prediction
  const payload = {
    horizonDays: prediction.horizonDays,
    metrics: {
      expected: prediction.expected, range: prediction.range, trendPercent: prediction.trendPercent,
      sampleSize: prediction.sampleSize, confidence: prediction.confidence, topCategory: prediction.topCategory,
      availableUnits: prediction.availableUnits, totalUnits: prediction.totalUnits, pressure: prediction.pressure,
      affectedRoads: prediction.affectedRoads.map(road => ({ route: road.route, status: road.status, estimatedDelayMin: road.estimatedDelayMin })),
      weather: prediction.weather,
    },
    instruction: 'Explica la proyección en español como una posibilidad, no como certeza. No inventes cifras ni acciones oficiales.',
  }
  try {
    const response = await requestN8N(N8N_ENDPOINTS.prediction, payload, { signal, timeoutMs: 16000 })
    const summary = safeText(response?.summary || response?.answer)
    const suggestions = asList(response?.recommendations).map(item => safeText(item, 220)).filter(Boolean).slice(0, 4)
    return {
      ...prediction,
      provider: summary || suggestions.length ? 'n8n' : prediction.provider,
      summary: summary || prediction.summary,
      recommendations: suggestions.length ? suggestions : prediction.recommendations,
    }
  } catch {
    return prediction
  }
}
