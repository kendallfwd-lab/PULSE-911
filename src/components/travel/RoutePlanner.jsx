import { useState } from 'react'
import { LocateFixed, MapPin, Route as RouteIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePulse } from '../../context/PulseContext'
import { useLiveLocation } from '../../context/LiveLocationContext'
import { ROUTE_DESTINATIONS } from '../../config/costaRicaPlaces'
import { getRoutes } from '../../services/routeService'
import { getWeather } from '../../services/weatherService'
import { scoreRouteRisk } from '../../utils/roadSafety'
import { RouteOptionCard } from './RouteOptionCard'
import { RouteRiskSummary } from './RouteRiskSummary'
import { RouteWeatherSummary } from './RouteWeatherSummary'

const places = ROUTE_DESTINATIONS
export function RoutePlanner() {
  const { t, i18n } = useTranslation()
  const { db } = usePulse()
  const { location, start } = useLiveLocation()
  const [originMode, setOriginMode] = useState('location')
  const [originName, setOriginName] = useState('Puntarenas Centro')
  const [destination, setDestination] = useState('Jacó')
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState(0)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const calculate = async event => {
    event.preventDefault(); setLoading(true); setError('')
    const origin = originMode === 'location' ? location : places[originName]
    const end = places[destination]
    if (!origin) { setError(i18n.language.startsWith('en') ? 'Enable your location or select a manual origin.' : 'Activa tu ubicación o selecciona un origen manual.'); setLoading(false); return }
    if (!end) { setError(i18n.language.startsWith('en') ? 'Select a destination from the available list.' : 'Selecciona un destino de la lista disponible.'); setLoading(false); return }
    try {
      const routes = await getRoutes({ origin, destination: end, locale: i18n.language })
      setOptions(routes.map(route => ({ route, risk: scoreRouteRisk(route.geometry || [], { incidents: db.incidents, riskZones: db.riskZones, trafficEvents: db.trafficEvents }) })))
      setWeather(await getWeather(end, i18n.language)); setSelected(0)
    } catch { setError(i18n.language.startsWith('en') ? 'The route could not be calculated. Try again.' : 'No fue posible calcular el recorrido. Inténtalo nuevamente.') }
    finally { setLoading(false) }
  }
  const current = options[selected]
  return <div className="route-planner"><form onSubmit={calculate}><div className="route-mode"><button type="button" className={originMode === 'location' ? 'active' : ''} onClick={() => { setOriginMode('location'); if (!location) start() }}><LocateFixed size={15}/>{t('travel.useLocation')}</button><button type="button" className={originMode === 'manual' ? 'active' : ''} onClick={() => setOriginMode('manual')}><MapPin size={15}/>{t('travel.manualOrigin')}</button></div>{originMode === 'manual' && <label>{t('travel.origin')}<select value={originName} onChange={event => setOriginName(event.target.value)}>{Object.keys(places).map(place => <option key={place}>{place}</option>)}</select></label>}<label>{t('travel.destination')}<input list="pulse-destinations" value={destination} onChange={event => setDestination(event.target.value)} placeholder={i18n.language.startsWith('en')?'Enter a destination':'Escribe un destino'}/><datalist id="pulse-destinations">{Object.keys(places).map(place => <option key={place} value={place}/>)}</datalist></label><button className="btn primary" type="submit" disabled={loading}><RouteIcon size={16}/>{loading ? t('travel.calculating') : t('travel.plan')}</button>{error && <p role="alert">{error}</p>}</form>{options.length > 0 && <div className="route-results"><aside>{options.map((option, index) => <RouteOptionCard key={option.route.id || index} {...option} selected={index === selected} onSelect={() => setSelected(index)}/>)}</aside><section><p className="route-exposure-label">{t('travel.lowerExposure')}</p><RouteRiskSummary risk={current.risk}/><RouteWeatherSummary weather={weather}/></section></div>}</div>
}
