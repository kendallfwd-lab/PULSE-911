import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Bot, BrainCircuit, CalendarDays, CheckCircle2, Clock3, Cloud, CloudFog, CloudLightning, CloudRain, CloudSun, Droplets, ExternalLink, Gauge, LocateFixed, MapPin, Navigation, RefreshCw, Route, ShieldCheck, Sun, ThermometerSun, TrendingUp, Umbrella, Wind } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { buildMobilityInsights } from '../../ai/mobilityInsights'
import { COSTA_RICA_PLACES } from '../../config/costaRicaPlaces'
import { DEMO_MAP_CENTER } from '../../config/demoGeography'
import { useLiveLocation } from '../../context/LiveLocationContext'
import { usePulse } from '../../context/PulseContext'
import { getWeatherForecast } from '../../services/weatherService'
import './MobilityInsightsPage.css'

const weatherDescriptions = {
  0: 'Despejado', 1: 'Mayormente despejado', 2: 'Parcialmente nublado', 3: 'Nublado',
  45: 'Niebla', 48: 'Niebla con escarcha', 51: 'Llovizna ligera', 53: 'Llovizna', 55: 'Llovizna intensa',
  61: 'Lluvia ligera', 63: 'Lluvia moderada', 65: 'Lluvia intensa', 80: 'Aguaceros ligeros',
  81: 'Aguaceros', 82: 'Aguaceros fuertes', 95: 'Tormenta', 96: 'Tormenta con granizo', 99: 'Tormenta fuerte',
}

function weatherMeta(code) {
  if (code === 0) return { Icon: Sun, label: weatherDescriptions[code] }
  if ([1, 2].includes(code)) return { Icon: CloudSun, label: weatherDescriptions[code] }
  if (code === 3) return { Icon: Cloud, label: weatherDescriptions[code] }
  if ([45, 48].includes(code)) return { Icon: CloudFog, label: weatherDescriptions[code] }
  if (Number(code) >= 95) return { Icon: CloudLightning, label: weatherDescriptions[code] || 'Tormenta' }
  if (Number(code) >= 51) return { Icon: CloudRain, label: weatherDescriptions[code] || 'Lluvia' }
  return { Icon: CloudSun, label: 'Condiciones variables' }
}

function formatForecastDay(date, locale) {
  return new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`)).replace('.', '')
}

function formatUpdated(value, locale) {
  if (!value) return 'Sin hora disponible'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? value : new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(parsed)
}

export default function MobilityInsightsPage() {
  const { db } = usePulse()
  const { i18n } = useTranslation()
  const { location, status: locationStatus, error: locationError, start: startLocation } = useLiveLocation()
  const [placeId, setPlaceId] = useState(COSTA_RICA_PLACES[0]?.id || '')
  const [usingLiveLocation, setUsingLiveLocation] = useState(false)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [requestError, setRequestError] = useState('')
  const [refreshToken, setRefreshToken] = useState(0)
  const place = COSTA_RICA_PLACES.find(item => item.id === placeId) || COSTA_RICA_PLACES[0]
  const queryLocation = usingLiveLocation && location ? location : place || DEMO_MAP_CENTER
  const locationLabel = usingLiveLocation && location ? 'Mi ubicación actual' : place?.name || 'Puntarenas'

  useEffect(() => {
    let active = true
    setLoading(true)
    setRequestError('')
    getWeatherForecast(queryLocation, i18n.language, refreshToken).then(result => {
      if (!active) return
      setWeather(result)
      if (result.unavailable) setRequestError('El pronóstico no está disponible temporalmente. Las estadísticas viales locales siguen visibles.')
    }).catch(() => {
      if (active) setRequestError('No fue posible actualizar el pronóstico. Inténtalo nuevamente.')
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [queryLocation.lat, queryLocation.lng, i18n.language, refreshToken])

  const insights = useMemo(() => buildMobilityInsights({ roads: db.roadStatus || [], weather }), [db.roadStatus, weather])
  const currentMeta = weatherMeta(weather?.weatherCode)
  const CurrentWeatherIcon = currentMeta.Icon
  const today = weather?.forecast?.[0]
  const maxRain = Math.max(1, ...(weather?.forecast || []).map(day => Number(day.precipitationProbability || 0)))

  const activateLocation = () => {
    setUsingLiveLocation(true)
    startLocation()
  }

  return <div className="feature-page mobility-insights-page">
    <header className="mobility-insights-hero">
      <div className="mobility-hero-copy">
        <span><BrainCircuit size={16}/>ESTADÍSTICAS Y PRONÓSTICO IA</span>
        <h1>Clima y movilidad con contexto</h1>
        <p>PULSE IA combina el pronóstico meteorológico con los estados viales conocidos para ayudarte a identificar rutas que requieren mayor precaución.</p>
        <div className="mobility-location-controls">
          <label><MapPin size={16}/><select aria-label="Seleccionar ubicación del pronóstico" value={placeId} onChange={event => { setPlaceId(event.target.value); setUsingLiveLocation(false) }}>{COSTA_RICA_PLACES.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <button type="button" className={usingLiveLocation ? 'active' : ''} onClick={activateLocation}><LocateFixed size={16}/>{locationStatus === 'requesting' ? 'Buscando…' : 'Usar mi ubicación'}</button>
          <button type="button" aria-label="Actualizar pronóstico" onClick={() => setRefreshToken(Date.now())} disabled={loading}><RefreshCw className={loading ? 'spin' : ''} size={16}/>Actualizar</button>
        </div>
        {usingLiveLocation && locationError && <p className="mobility-location-error" role="alert">{locationError} Se mantiene el pronóstico de {place?.name}.</p>}
      </div>
      <div className="current-weather-card" aria-live="polite">
        <div className="current-weather-top"><span><Navigation size={15}/>{locationLabel}</span><small>{weather?.provider === 'open-meteo' ? 'Open-Meteo · en vivo' : 'Fuente temporal'}</small></div>
        {loading && !weather ? <div className="weather-loading"><RefreshCw className="spin"/><span>Consultando el pronóstico…</span></div> : <><div className="current-weather-main"><CurrentWeatherIcon/><strong>{weather?.temperature != null ? `${Math.round(weather.temperature)}°` : '—'}</strong><div><b>{currentMeta.label}</b><span>Sensación {weather?.apparentTemperature != null ? `${Math.round(weather.apparentTemperature)} °C` : 'no disponible'}</span></div></div><div className="current-weather-details"><span><Droplets/>Lluvia <strong>{today?.precipitationProbability ?? '—'}%</strong></span><span><Wind/>Viento <strong>{weather?.wind != null ? `${Math.round(weather.wind)} km/h` : '—'}</strong></span><span><ThermometerSun/>Máx. <strong>{today?.maxTemperature != null ? `${Math.round(today.maxTemperature)} °C` : '—'}</strong></span></div></>}
      </div>
    </header>

    {requestError && <div className="mobility-data-alert" role="alert"><AlertTriangle/><span>{requestError}</span></div>}

    <section className="mobility-stat-grid" aria-label="Resumen estadístico">
      <article><i><ThermometerSun/></i><span>Temperatura actual<strong>{weather?.temperature != null ? `${Math.round(weather.temperature)} °C` : '—'}</strong><small>{locationLabel}</small></span></article>
      <article><i><CloudRain/></i><span>Mayor probabilidad de lluvia<strong>{insights.wettestDay?.precipitationProbability != null ? `${insights.wettestDay.precipitationProbability}%` : '—'}</strong><small>{insights.wettestDay ? formatForecastDay(insights.wettestDay.date, i18n.language) : 'Sin pronóstico'}</small></span></article>
      <article><i><Route/></i><span>Rutas con afectación<strong>{insights.affected}</strong><small>Datos locales PULSE</small></span></article>
      <article className="complex-route-stat"><i><AlertTriangle/></i><span>Ruta más complicada<strong>{insights.hardest?.route || '—'}</strong><small>{insights.hardest ? `${insights.hardest.score}/100 · complejidad ${insights.hardest.level}` : 'Sin datos'}</small></span></article>
    </section>

    <section className="ai-mobility-summary">
      <div className="ai-summary-icon"><Bot/></div>
      <div><span>ANÁLISIS PREVENTIVO DE PULSE IA</span><h2>{insights.headline}</h2><p>{insights.recommendation}</p><div className="ai-summary-tags"><b>Impacto climático {insights.weatherLevel}</b>{insights.bestDay && <b>Menor lluvia estimada: {formatForecastDay(insights.bestDay.date, i18n.language)} ({insights.bestDay.precipitationProbability ?? 0}%)</b>}</div></div>
      <ShieldCheck className="ai-summary-shield"/>
    </section>

    <section className="ai-statistics-panel" aria-labelledby="ai-statistics-title">
      <header className="ai-statistics-header">
        <div><span><TrendingUp/>ESTADÍSTICAS GENERADAS POR PULSE IA</span><h2 id="ai-statistics-title">Panorama para tomar mejores decisiones</h2><p>Lectura combinada del pronóstico de siete días y las rutas monitoreadas.</p></div>
        <b><CalendarDays/>{insights.forecastAnalysis.length} días analizados <i/>{insights.routes.length} rutas</b>
      </header>

      <div className="ai-statistics-main">
        <article className={`mobility-score-card tone-${insights.outlook.tone}`}>
          <div className="mobility-score-ring" style={{ '--mobility-score': `${insights.mobilityScore * 3.6}deg` }}><span><strong>{insights.mobilityScore}</strong><small>/100</small></span></div>
          <div><span>PAISAJE GENERAL</span><h3>Índice de movilidad segura</h3><b>{insights.outlook.label}</b><p>Resume el impacto del clima y la complejidad promedio de las rutas. No sustituye una alerta oficial.</p></div>
        </article>

        <div className="ai-detailed-stat-grid">
          <article><i><Umbrella/></i><span>Lluvia acumulada estimada<strong>{insights.totalRain} mm</strong><small>Próximos {insights.forecastAnalysis.length} días</small></span></article>
          <article><i><CloudRain/></i><span>Días con lluvia relevante<strong>{insights.rainyDays} de {insights.forecastAnalysis.length}</strong><small>Promedio diario: {insights.averageRainProbability}%</small></span></article>
          <article><i><Wind/></i><span>Viento máximo estimado<strong>{insights.strongestWindDay?.maxWind != null ? `${Math.round(insights.strongestWindDay.maxWind)} km/h` : '—'}</strong><small>{insights.strongestWindDay ? formatForecastDay(insights.strongestWindDay.date, i18n.language) : 'Sin datos'}</small></span></article>
          <article><i><Clock3/></i><span>Demora vial acumulada<strong>{insights.totalDelay} min</strong><small>En rutas monitoreadas</small></span></article>
          <article><i><AlertTriangle/></i><span>Incidentes asociados<strong>{insights.totalIncidents}</strong><small>{insights.criticalDays} días climáticos críticos</small></span></article>
          <article><i><Gauge/></i><span>Riesgo vial promedio<strong>{insights.averageRouteRisk}/100</strong><small>{insights.routeDistribution.high} alta · {insights.routeDistribution.moderate} moderada · {insights.routeDistribution.low} baja</small></span></article>
        </div>
      </div>

      <div className="ai-decision-grid">
        <section className="seventy-two-hour-panel">
          <header><div><span><CalendarDays/>VENTANA PREVENTIVA</span><h3>Próximas 72 horas</h3></div><small>Riesgo meteorológico estimado</small></header>
          <div>{insights.next72Hours.map(day => { const meta = weatherMeta(day.weatherCode); const Icon = meta.Icon; return <article key={day.date}><Icon/><div><b>{formatForecastDay(day.date, i18n.language)} · {meta.label}</b><p>{day.message}</p><span><i style={{ width: `${day.riskScore}%` }}/></span></div><strong>{day.riskScore}<small>/100</small></strong></article> })}{!insights.next72Hours.length && <p className="forecast-empty">No hay información suficiente para calcular esta ventana.</p>}</div>
        </section>

        <section className="smart-actions-panel">
          <header><div><span><BrainCircuit/>ACCIONES SUGERIDAS</span><h3>Qué puede hacer el usuario</h3></div><small>Según los datos disponibles</small></header>
          <div>{insights.actions.map((action, index) => <article key={`${action.tone}-${index}`}><i>{index + 1}</i><div><b>{action.title}</b><p>{action.detail}</p></div><CheckCircle2/></article>)}</div>
        </section>
      </div>
    </section>

    <div className="mobility-insights-layout">
      <section className="forecast-panel">
        <header><div><span><CloudSun/>PRÓXIMOS 7 DÍAS</span><h2>Pronóstico del tiempo</h2></div><small>Actualizado {formatUpdated(weather?.sourceUpdatedAt || weather?.generatedAt, i18n.language)}</small></header>
        <div className="forecast-days">{(weather?.forecast || []).map(day => { const meta = weatherMeta(day.weatherCode); const Icon = meta.Icon; return <article key={day.date}><strong>{formatForecastDay(day.date, i18n.language)}</strong><Icon/><span>{meta.label}</span><b>{day.maxTemperature != null ? Math.round(day.maxTemperature) : '—'}° <small>{day.minTemperature != null ? Math.round(day.minTemperature) : '—'}°</small></b><div className="forecast-rain"><i style={{ height: `${Math.max(4, Number(day.precipitationProbability || 0) / maxRain * 100)}%` }}/></div><em><Droplets/>{day.precipitationProbability ?? 0}%</em></article> })}{!loading && !weather?.forecast?.length && <p className="forecast-empty">No hay datos diarios disponibles en este momento.</p>}</div>
      </section>

      <section className="route-complexity-panel">
        <header><div><span><Route/>LECTURA IA DE MOVILIDAD</span><h2>Complejidad por ruta</h2></div><small>Clima + demoras + incidentes</small></header>
        <div className="route-complexity-list">{insights.routes.map((road, index) => <article className={index === 0 ? 'most-complex' : ''} key={road.id}><div className="route-rank"><span>{index + 1}</span><i style={{ '--score': `${road.score * 3.6}deg` }}><b>{road.score}</b></i></div><div className="route-complexity-copy"><span>{index === 0 ? 'MAYOR PRECAUCIÓN' : `COMPLEJIDAD ${road.level.toUpperCase()}`}</span><h3>{road.route}</h3><p>{road.name} · {road.direction}</p><div>{road.factors.length ? road.factors.map(factor => <b key={factor}>{factor}</b>) : <b>sin afectaciones relevantes registradas</b>}</div></div>{road.alternativeRoute && <aside><Navigation/><span>Alternativa sugerida<small>{road.alternativeRoute}</small></span></aside>}</article>)}</div>
      </section>
    </div>

    <footer className="mobility-insights-disclaimer"><AlertTriangle/><p><strong>Orientación informativa:</strong> el pronóstico proviene de Open-Meteo y puede cambiar. Los estados viales de esta demostración son datos PULSE simulados. Consulta los avisos oficiales del <a href="https://www.imn.ac.cr/" target="_blank" rel="noreferrer">Instituto Meteorológico Nacional <ExternalLink/></a> y autoridades viales antes de viajar.</p></footer>
  </div>
}
