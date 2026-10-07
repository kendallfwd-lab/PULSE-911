import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Ambulance, BrainCircuit, CalendarRange, CheckCircle2, CloudRain, Database, Gauge, RefreshCw, Route, ShieldAlert, Sparkles, TrendingDown, TrendingUp, TriangleAlert } from 'lucide-react'
import { useAI } from '../../ai/AIContext'
import { AIStatusIndicator } from '../../components/ai/AIStatusIndicator'
import { Badge, InlineNotice } from '../../components/Common'
import { DEMO_MAP_CENTER } from '../../config/demoGeography'
import { usePulse } from '../../context/PulseContext'
import { buildOperationalPrediction, enhancePredictionWithAI } from '../../services/predictionService'
import { getWeatherForecast } from '../../services/weatherService'

const DOMAIN_ICONS = { security: ShieldAlert, weather: CloudRain, mobility: Route, capacity: Ambulance }
const CONFIDENCE_TONES = { alta: 'green', media: 'amber', baja: 'gray' }

function operationalCenter(incidents) {
  const points = incidents
    .map(item => item.location)
    .filter(location => Number.isFinite(Number(location?.lat)) && Number.isFinite(Number(location?.lng)))
  if (!points.length) return DEMO_MAP_CENTER
  return {
    lat: points.reduce((total, point) => total + Number(point.lat), 0) / points.length,
    lng: points.reduce((total, point) => total + Number(point.lng), 0) / points.length,
  }
}

function PredictionChart({ values }) {
  const maximum = Math.max(1, ...values.map(item => item.value))
  return <div className="prediction-chart" role="img" aria-label="Tendencia semanal observada y valor previsto">
    {values.map(item => <div className={item.predicted ? 'predicted' : ''} key={item.label}>
      <strong>{item.value}</strong>
      <span><i style={{ height: `${Math.max(5, (item.value / maximum) * 100)}%` }}/></span>
      <small>{item.label}</small>
    </div>)}
  </div>
}

function MetricCard({ icon: Icon, label, value, hint, tone = 'blue' }) {
  return <article className={`prediction-metric prediction-metric-${tone}`}>
    <i><Icon size={20}/></i><div><span>{label}</span><strong>{value}</strong><small>{hint}</small></div>
  </article>
}

export default function AIPredictionPage() {
  const { db } = usePulse()
  const { status } = useAI()
  const [horizonDays, setHorizonDays] = useState(7)
  const [prediction, setPrediction] = useState(() => buildOperationalPrediction(db, { horizonDays: 7 }))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const requestRef = useRef(0)
  const dbRef = useRef(db)
  dbRef.current = db
  const center = useMemo(() => operationalCenter(db.incidents || []), [db.incidents])
  const dataRevision = useMemo(() => [
    db.incidents?.length || 0, db.incidents?.at(-1)?.createdAt || '', db.units?.length || 0,
    db.riskZones?.length || 0, db.roadStatus?.map(road => `${road.id}:${road.status}`).join('|') || '',
  ].join(':'), [db.incidents, db.units, db.riskZones, db.roadStatus])

  const refresh = useCallback(async ({ force = false } = {}) => {
    const requestId = ++requestRef.current
    setLoading(true)
    setError('')
    try {
      const weather = await getWeatherForecast(center, 'es', force ? Date.now() : 0)
      const local = buildOperationalPrediction(dbRef.current, { horizonDays, weather })
      const result = await enhancePredictionWithAI(local, { remote: status === 'online' })
      if (requestId === requestRef.current) setPrediction(result)
    } catch {
      if (requestId === requestRef.current) {
        setPrediction(buildOperationalPrediction(dbRef.current, { horizonDays }))
        setError('No se pudo actualizar el clima. La predicción local continúa disponible con confianza reducida.')
      }
    } finally {
      if (requestId === requestRef.current) setLoading(false)
    }
  }, [center, horizonDays, status])

  useEffect(() => {
    refresh()
    return () => { requestRef.current += 1 }
  }, [refresh, dataRevision])

  const trendUp = prediction.trendPercent > 0
  const TrendIcon = trendUp ? TrendingUp : TrendingDown
  const sourceLabel = prediction.provider === 'n8n' ? 'Narrativa IA mediante n8n' : 'Motor predictivo local explicable'

  return <div className="admin-page ai-prediction-page">
    <header className="prediction-hero">
      <div>
        <span><BrainCircuit size={16}/>INTELIGENCIA PROSPECTIVA</span>
        <h2>Predicción con IA</h2>
        <p>Anticipa posibles cambios en incidentes, clima, seguridad, movilidad y capacidad operativa usando las señales disponibles en PULSE.</p>
      </div>
      <AIStatusIndicator/>
    </header>

    <section className="prediction-controls" aria-label="Controles de predicción">
      <div className="prediction-horizon" role="group" aria-label="Horizonte de predicción">
        <button type="button" className={horizonDays === 7 ? 'active' : ''} aria-pressed={horizonDays === 7} onClick={() => setHorizonDays(7)}>Próxima semana</button>
        <button type="button" className={horizonDays === 30 ? 'active' : ''} aria-pressed={horizonDays === 30} onClick={() => setHorizonDays(30)}>Próximo mes</button>
      </div>
      <div className="prediction-source"><Database size={15}/><span>{sourceLabel}</span></div>
      <button className="btn primary" type="button" onClick={() => refresh({ force: true })} disabled={loading}><RefreshCw className={loading ? 'spin' : ''} size={16}/>{loading ? 'Actualizando…' : 'Actualizar predicción'}</button>
    </section>

    {error && <InlineNotice tone="warning">{error}</InlineNotice>}

    <section className="prediction-metrics" aria-label="Resumen de la predicción">
      <MetricCard icon={CalendarRange} label={`Incidentes · ${horizonDays} días`} value={`${prediction.range.min}–${prediction.range.max}`} hint={`Valor central: ${prediction.expected}`} tone="blue"/>
      <MetricCard icon={TrendIcon} label="Cambio esperado" value={`${prediction.trendPercent > 0 ? '+' : ''}${prediction.trendPercent}%`} hint={`Frente al periodo anterior`} tone={trendUp ? 'red' : 'green'}/>
      <MetricCard icon={Gauge} label="Confianza del modelo" value={`${prediction.confidence}%`} hint={`Nivel ${prediction.confidenceLabel}`} tone="purple"/>
      <MetricCard icon={CloudRain} label="Señal de lluvia" value={prediction.weather.available ? `${prediction.weather.rainyDays} días` : 'Sin datos'} hint={prediction.weather.available ? `Máximo ${Math.round(prediction.weather.maxRainProbability)}%` : 'Consultar fuente oficial'} tone="amber"/>
      <MetricCard icon={Ambulance} label="Presión operativa" value={prediction.pressure} hint={`${prediction.availableUnits}/${prediction.totalUnits} unidades disponibles`} tone="navy"/>
    </section>

    <section className="prediction-overview">
      <div className="prediction-summary">
        <div className="prediction-section-title"><Sparkles/><div><span>LECTURA PROSPECTIVA</span><h3>Qué podría pasar</h3></div><Badge tone={CONFIDENCE_TONES[prediction.confidenceLabel]}>Confianza {prediction.confidenceLabel}</Badge></div>
        <p>{prediction.summary}</p>
        <div className="prediction-data-note"><Database size={15}/><span>{prediction.dataNote}</span></div>
      </div>
      <div className="prediction-domain-grid">
        {Object.entries(prediction.domains).map(([key, domain]) => {
          const Icon = DOMAIN_ICONS[key]
          return <article key={key}>
            <header><i><Icon size={19}/></i><div><h3>{domain.title}</h3><span>Confianza {domain.confidence}</span></div></header>
            <p>{domain.text}</p>
          </article>
        })}
      </div>
    </section>

    <section className="prediction-analysis-grid">
      <article className="prediction-panel">
        <header><div><span>TENDENCIA</span><h3>Actividad observada y proyección</h3></div><Badge tone="blue">{prediction.sampleSize} registros</Badge></header>
        <PredictionChart values={prediction.series}/>
        <small>La barra punteada representa una estimación, no un evento confirmado.</small>
      </article>
      <article className="prediction-panel">
        <header><div><span>ESCENARIOS</span><h3>Rango para preparar recursos</h3></div></header>
        <div className="prediction-scenarios">
          {prediction.scenarios.map(scenario => <div className={scenario.key} key={scenario.key}>
            <span>{scenario.label}</span><strong>{scenario.value}</strong><small>{scenario.detail}</small>
          </div>)}
        </div>
      </article>
    </section>

    <section className="prediction-action-grid">
      <article className="prediction-panel">
        <header><div><span>PREPARACIÓN</span><h3>Acciones recomendadas para revisión</h3></div></header>
        <ul>{prediction.recommendations.map(item => <li key={item}><CheckCircle2 size={17}/><span>{item}</span></li>)}</ul>
      </article>
      <article className="prediction-panel prediction-evidence">
        <header><div><span>EVIDENCIA</span><h3>Señales utilizadas</h3></div></header>
        <dl>
          <div><dt>Histórico PULSE</dt><dd>{prediction.sampleSize} incidentes</dd></div>
          <div><dt>Clima</dt><dd>{prediction.weather.available ? `${prediction.weather.daysAvailable} días · Open‑Meteo` : 'No disponible'}</dd></div>
          <div><dt>Vías afectadas</dt><dd>{prediction.affectedRoads.length}</dd></div>
          <div><dt>Zona recurrente</dt><dd>{prediction.topRiskZone?.area || 'Sin señal suficiente'}</dd></div>
        </dl>
      </article>
    </section>

    <aside className="prediction-disclaimer">
      <TriangleAlert size={21}/><div><strong>Predicción experimental, no una alerta oficial</strong><p>{prediction.limitations.join(' ')} Ninguna recomendación ejecuta acciones automáticamente y toda decisión requiere revisión humana.</p></div>
    </aside>
  </div>
}
