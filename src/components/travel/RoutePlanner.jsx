import { useCallback, useEffect, useRef, useState } from 'react'
import { LocateFixed, MapPin, Route as RouteIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePulse } from '../../context/PulseContext'
import { useLiveLocation } from '../../context/LiveLocationContext'
import { COSTA_RICA_DESTINATION_SEEDS, COSTA_RICA_PROVINCES, getProvince } from '../../data/costaRicaProvinces'
import { geocodeCostaRicaLocation } from '../../services/explore/geocodingService'
import { getRoutes } from '../../services/routeService'
import { getWeather } from '../../services/weatherService'
import { scoreRouteRisk } from '../../utils/roadSafety'
import { LocationAutocomplete } from './LocationAutocomplete'
import { RouteOptionCard } from './RouteOptionCard'
import { RouteRiskSummary } from './RouteRiskSummary'
import { RouteWeatherSummary } from './RouteWeatherSummary'

const DEFAULT_DESTINATION = COSTA_RICA_DESTINATION_SEEDS.find(place => place.name === 'Jacó')

export function RoutePlanner({ onContextChange, requestedDestination, onRequestedDestinationHandled }) {
  const { t, i18n } = useTranslation()
  const english = i18n.language.startsWith('en')
  const { db } = usePulse()
  const { location, status: locationStatus, error: locationError, start } = useLiveLocation()
  const abortRef = useRef(null)
  const [provinceId, setProvinceId] = useState('all')
  const [originMode, setOriginMode] = useState('location')
  const [originQuery, setOriginQuery] = useState('')
  const [manualOrigin, setManualOrigin] = useState(null)
  const [destinationQuery, setDestinationQuery] = useState(DEFAULT_DESTINATION.name)
  const [destination, setDestination] = useState(DEFAULT_DESTINATION)
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState(0)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const province = getProvince(provinceId)
  const activeOrigin = originMode === 'location' ? location : manualOrigin

  useEffect(() => {
    onContextChange?.({ origin: activeOrigin, destination, province, provinceId, originMode })
  }, [activeOrigin, destination, onContextChange, originMode, province, provinceId])

  useEffect(() => () => abortRef.current?.abort(), [])

  const calculateRoute = useCallback(async endOverride => {
    setLoading(true)
    setError('')
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    try {
      let origin = originMode === 'location' ? location : manualOrigin
      if (!origin && originMode === 'manual' && originQuery.trim()) {
        origin = await geocodeCostaRicaLocation(originQuery, { locale: i18n.language, signal: controller.signal })
        setManualOrigin(origin)
      }
      if (!origin) {
        if (originMode === 'location') start()
        throw new Error('ORIGIN_REQUIRED')
      }

      let end = endOverride || destination
      if (!end && destinationQuery.trim()) {
        end = await geocodeCostaRicaLocation(destinationQuery, { locale: i18n.language, signal: controller.signal })
        setDestination(end)
        setDestinationQuery(end.name)
      }
      if (!end) throw new Error('DESTINATION_REQUIRED')

      const routes = await getRoutes({ origin, destination: end, locale: i18n.language, signal: controller.signal, allowApproximateFallback: false })
      if (controller.signal.aborted) return
      setOptions(routes.map(route => ({ route, risk: scoreRouteRisk(route.geometry || [], { incidents: db.incidents, riskZones: db.riskZones, trafficEvents: db.trafficEvents }) })))
      setWeather(await getWeather(end, i18n.language))
      setSelected(0)
    } catch (requestError) {
      if (controller.signal.aborted || requestError.name === 'AbortError') return
      if (requestError.message === 'ORIGIN_REQUIRED') setError(english ? 'Use your location or enter an origin address.' : 'Usa tu ubicación o ingresa una dirección de origen.')
      else if (requestError.message === 'DESTINATION_REQUIRED' || requestError.message === 'LOCATION_NOT_FOUND') setError(english ? 'Choose a Costa Rica destination from the suggestions.' : 'Selecciona un destino de Costa Rica en las sugerencias.')
      else setError(english ? 'The route could not be calculated. Try again.' : 'No fue posible calcular el recorrido. Inténtalo nuevamente.')
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [db.incidents, db.riskZones, db.trafficEvents, destination, destinationQuery, english, i18n.language, location, manualOrigin, originMode, originQuery, start])

  useEffect(() => {
    if (!requestedDestination) return
    setDestination(requestedDestination)
    setDestinationQuery(requestedDestination.name)
    setOptions([])
    if (activeOrigin) void calculateRoute(requestedDestination)
    else {
      setError(english ? 'Choose an origin to calculate directions.' : 'Elige un origen para calcular cómo llegar.')
      if (originMode === 'location') start()
    }
    onRequestedDestinationHandled?.()
  }, [activeOrigin, calculateRoute, english, onRequestedDestinationHandled, originMode, requestedDestination, start])

  const submit = event => {
    event.preventDefault()
    void calculateRoute()
  }

  const changeProvince = event => {
    const nextId = event.target.value
    setProvinceId(nextId)
    setOptions([])
    if (nextId !== 'all') {
      const nextProvince = getProvince(nextId)
      setDestination(null)
      setDestinationQuery('')
      setError(english ? `Search a destination in ${nextProvince.name} or explore the province directly.` : `Busca un destino en ${nextProvince.name} o explora la provincia directamente.`)
    }
  }

  const current = options[selected]
  return <div className="route-planner" id="explore-route-planner">
    <form onSubmit={submit}>
      <div className="route-mode">
        <button type="button" className={originMode === 'location' ? 'active' : ''} aria-pressed={originMode === 'location'} onClick={() => { setOriginMode('location'); if (!location) start() }}><LocateFixed size={15}/>{t('travel.useLocation')}</button>
        <button type="button" className={originMode === 'manual' ? 'active' : ''} aria-pressed={originMode === 'manual'} onClick={() => setOriginMode('manual')}><MapPin size={15}/>{t('travel.manualOrigin')}</button>
        {originMode === 'location' && <span className={`explore-origin-state ${locationStatus}`}>{location ? (english?'Origin: current location':'Origen: mi ubicación actual') : locationStatus === 'requesting' ? (english?'Requesting location…':'Solicitando ubicación…') : (english?'Location not active':'Ubicación no activa')}</span>}
      </div>

      {originMode === 'manual' && <LocationAutocomplete className="explore-origin-field" id="explore-origin" label={t('travel.origin')} query={originQuery} onQueryChange={setOriginQuery} selected={manualOrigin} onSelect={setManualOrigin} locale={i18n.language} placeholder={english?'Search an origin address…':'Busca una dirección de origen…'}/>}

      <label className="explore-province-field">{english?'Province':'Provincia'}
        <select value={provinceId} onChange={changeProvince}>{COSTA_RICA_PROVINCES.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      </label>

      <LocationAutocomplete id="explore-destination" label={t('travel.destination')} query={destinationQuery} onQueryChange={setDestinationQuery} selected={destination} onSelect={setDestination} locale={i18n.language} placeholder={english?'Search a province, city or destination…':'Busca una provincia, ciudad o destino…'}/>
      <button className="btn primary" type="submit" disabled={loading}><RouteIcon size={16}/>{loading ? t('travel.calculating') : t('travel.plan')}</button>
      {(error || (originMode === 'location' && locationError)) && <p role="alert">{error || locationError}</p>}
    </form>

    {options.length > 0 && <div className="route-results" aria-live="polite">
      <aside>{options.map((option, index) => <RouteOptionCard key={option.route.id || index} {...option} selected={index === selected} onSelect={() => setSelected(index)}/>)}</aside>
      <section><p className="route-exposure-label">{t('travel.lowerExposure')}</p><RouteRiskSummary risk={current.risk}/><RouteWeatherSummary weather={weather}/></section>
    </div>}
  </div>
}
