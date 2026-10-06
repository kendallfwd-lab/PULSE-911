const STATUS_WEIGHT = { closed: 58, partial_block: 42, slow: 28, precaution: 18, normal: 2 }
const IMPACT_WEIGHT = { high: 26, medium: 17, low: 8, none: 0 }

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value))
}

function dayClimateRisk(day = {}) {
  const probability = Number(day.precipitationProbability || 0)
  const precipitation = Number(day.precipitation || 0)
  const wind = Number(day.maxWind || 0)
  const maxTemperature = Number(day.maxTemperature || 0)
  const weatherCode = Number(day.weatherCode || 0)
  const stormWeight = weatherCode >= 95 ? 24 : weatherCode >= 80 ? 10 : 0
  const heatWeight = maxTemperature >= 32 ? (maxTemperature - 31) * 3 : 0
  return clamp(Math.round(
    probability * .42
    + precipitation * 4
    + Math.max(0, wind - 20) * 1.4
    + stormWeight
    + heatWeight
  ))
}

function weatherRisk(weather) {
  const today = weather?.forecast?.[0] || {}
  return dayClimateRisk({
    ...today,
    precipitation: today.precipitation ?? weather?.precipitation,
    maxWind: today.maxWind ?? weather?.wind,
  })
}

function levelFromScore(score) {
  if (score >= 70) return 'alta'
  if (score >= 40) return 'moderada'
  return 'baja'
}

function mobilityOutlook(score) {
  if (score >= 75) return { level: 'favorable', label: 'Favorable con vigilancia', tone: 'good' }
  if (score >= 55) return { level: 'precaucion', label: 'Precaución recomendada', tone: 'medium' }
  return { level: 'complejo', label: 'Condiciones complejas', tone: 'high' }
}

function forecastMessage(day) {
  if (day.riskScore >= 70) return 'Alta exposición climática; confirma avisos y valora reprogramar.'
  if (day.riskScore >= 45) return 'Considera más tiempo de viaje y conduce con precaución.'
  return 'Ventana relativamente favorable; verifica cambios antes de salir.'
}

export function buildMobilityInsights({ roads = [], weather = null }) {
  const climateScore = weatherRisk(weather)
  const routes = roads.map(road => {
    const delay = Number(road.estimatedDelayMin || 0)
    const incidents = Number(road.incidentCount || 0)
    const score = Math.min(100, Math.round(
      (STATUS_WEIGHT[road.status] ?? 12)
      + (IMPACT_WEIGHT[road.trafficImpact] ?? 6)
      + Math.min(18, incidents * 7)
      + Math.min(16, delay * .55)
      + climateScore * .18
    ))
    const factors = []
    if (road.status === 'closed') factors.push('cierre registrado')
    else if (road.status === 'partial_block') factors.push('bloqueo parcial')
    else if (road.status === 'slow') factors.push('tránsito lento')
    else if (road.status === 'precaution') factors.push('condición de precaución')
    if (delay) factors.push(`${delay} min de demora estimada`)
    if (incidents) factors.push(`${incidents} incidente${incidents === 1 ? '' : 's'} asociado${incidents === 1 ? '' : 's'}`)
    if (climateScore >= 35) factors.push('posible impacto del clima')
    return { ...road, score, level: levelFromScore(score), factors }
  }).sort((a, b) => b.score - a.score)

  const forecast = weather?.forecast || []
  const forecastAnalysis = forecast.map(day => {
    const riskScore = dayClimateRisk(day)
    return {
      ...day,
      riskScore,
      travelScore: 100 - riskScore,
      riskLevel: levelFromScore(riskScore),
      message: forecastMessage({ riskScore }),
    }
  })
  const wettestDay = forecastAnalysis.reduce((highest, day) => Number(day.precipitationProbability || 0) > Number(highest?.precipitationProbability || -1) ? day : highest, null)
  const bestDay = forecastAnalysis.reduce((best, day) => day.travelScore > Number(best?.travelScore ?? -1) ? day : best, null)
  const strongestWindDay = forecastAnalysis.reduce((highest, day) => Number(day.maxWind || 0) > Number(highest?.maxWind || -1) ? day : highest, null)
  const hottestDay = forecastAnalysis.reduce((highest, day) => Number(day.maxTemperature || 0) > Number(highest?.maxTemperature || -100) ? day : highest, null)
  const totalRain = forecastAnalysis.reduce((total, day) => total + Number(day.precipitation || 0), 0)
  const averageRainProbability = forecastAnalysis.length
    ? Math.round(forecastAnalysis.reduce((total, day) => total + Number(day.precipitationProbability || 0), 0) / forecastAnalysis.length)
    : 0
  const rainyDays = forecastAnalysis.filter(day => Number(day.precipitationProbability || 0) >= 60 || Number(day.precipitation || 0) >= 3).length
  const criticalDays = forecastAnalysis.filter(day => day.riskScore >= 60).length
  const hardest = routes[0] || null
  const affected = routes.filter(route => route.status !== 'normal').length
  const totalDelay = routes.reduce((total, route) => total + Number(route.estimatedDelayMin || 0), 0)
  const totalIncidents = routes.reduce((total, route) => total + Number(route.incidentCount || 0), 0)
  const averageRouteRisk = routes.length ? Math.round(routes.reduce((total, route) => total + route.score, 0) / routes.length) : 0
  const mobilityScore = clamp(Math.round(100 - climateScore * .42 - averageRouteRisk * .58))
  const outlook = mobilityOutlook(mobilityScore)
  const routeDistribution = {
    high: routes.filter(route => route.level === 'alta').length,
    moderate: routes.filter(route => route.level === 'moderada').length,
    low: routes.filter(route => route.level === 'baja').length,
  }
  const headline = hardest
    ? `${hardest.route} presenta la mayor complejidad estimada (${hardest.score}/100).`
    : 'No hay rutas con información suficiente para comparar.'
  const recommendation = climateScore >= 55
    ? 'La lluvia o el viento pueden aumentar la dificultad. Revisa avisos oficiales y evita salir si las condiciones empeoran.'
    : hardest?.score >= 55
      ? `Considera ${hardest.alternativeRoute || 'una ruta alternativa'} y confirma el estado vial antes de salir.`
      : 'Las condiciones conocidas son manejables, pero pueden cambiar. Confirma el estado vial antes de iniciar el recorrido.'

  const actions = []
  if (hardest?.alternativeRoute) actions.push({
    title: `Prepara una alternativa a ${hardest.route}`,
    detail: `La opción registrada es ${hardest.alternativeRoute}; confirma su estado antes de desviarte.`,
    tone: 'route',
  })
  if (rainyDays >= 3) actions.push({
    title: 'Planifica para una semana lluviosa',
    detail: `${rainyDays} de ${forecastAnalysis.length} días presentan probabilidad alta o acumulado relevante de lluvia.`,
    tone: 'rain',
  })
  if (Number(strongestWindDay?.maxWind || 0) >= 30) actions.push({
    title: 'Atención al viento',
    detail: `La ráfaga diaria máxima estimada alcanza ${Math.round(strongestWindDay.maxWind)} km/h. Reduce velocidad en puentes y zonas abiertas.`,
    tone: 'wind',
  })
  if (totalDelay >= 20) actions.push({
    title: 'Agrega margen al tiempo de viaje',
    detail: `Las rutas monitoreadas acumulan ${totalDelay} minutos de demora estimada.`,
    tone: 'time',
  })
  actions.push({
    title: 'Confirma la información oficial',
    detail: 'Revisa avisos del IMN y de las autoridades viales antes de iniciar el recorrido.',
    tone: 'official',
  })

  return {
    routes,
    hardest,
    affected,
    climateScore,
    weatherLevel: levelFromScore(climateScore),
    wettestDay,
    bestDay,
    strongestWindDay,
    hottestDay,
    forecastAnalysis,
    next72Hours: forecastAnalysis.slice(0, 3),
    totalRain: Math.round(totalRain * 10) / 10,
    averageRainProbability,
    rainyDays,
    criticalDays,
    totalDelay,
    totalIncidents,
    averageRouteRisk,
    mobilityScore,
    outlook,
    routeDistribution,
    actions: actions.slice(0, 4),
    headline,
    recommendation,
  }
}
