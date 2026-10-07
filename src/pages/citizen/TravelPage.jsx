import { Building2, CloudRain, Coffee, Fuel, Hospital, MapPin, MapPinned, Pill, RefreshCw, SearchX, Trees, Utensils, Wind } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import GeoMap from '../../components/GeoMap'
import { PlaceDetails } from '../../components/travel/PlaceDetails'
import { PlaceResultCard } from '../../components/travel/PlaceResultCard'
import { RoutePlanner } from '../../components/travel/RoutePlanner'
import { useLiveLocation } from '../../context/LiveLocationContext'
import { COSTA_RICA_DESTINATION_SEEDS, getProvince } from '../../data/costaRicaProvinces'
import { searchExplorePlaces } from '../../services/explore/placesService'
import { getWeather } from '../../services/weatherService'

const categories = [[Trees, 'parks'], [MapPinned, 'beaches'], [Utensils, 'restaurants'], [Coffee, 'cafes'], [Building2, 'museums'], [Hospital, 'hospitals'], [Pill, 'pharmacies'], [Fuel, 'gas']]
const DEFAULT_DESTINATION = COSTA_RICA_DESTINATION_SEEDS.find(place => place.name === 'Jacó')

export default function TravelPage() {
  const { t, i18n } = useTranslation()
  const english = i18n.language.startsWith('en')
  const { location, start: startLocation } = useLiveLocation()
  const [visitor, setVisitor] = useState(() => localStorage.getItem('pulse911-visitor-mode') === 'true')
  const [exploreContext, setExploreContext] = useState({ origin: location, destination: DEFAULT_DESTINATION, province: getProvince('all'), provinceId: 'all' })
  const [requestedDestination, setRequestedDestination] = useState(null)
  const [destinationWeather, setDestinationWeather] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [places, setPlaces] = useState([])
  const [provider, setProvider] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [radiusKm, setRadiusKm] = useState(10)
  const [sort, setSort] = useState('distance')
  const [displayLimit, setDisplayLimit] = useState(12)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const abortRef = useRef(null)

  useEffect(() => { localStorage.setItem('pulse911-visitor-mode', String(visitor)) }, [visitor])
  useEffect(() => () => abortRef.current?.abort(), [])

  useEffect(() => {
    let active = true
    setDestinationWeather(null)
    if (!exploreContext.destination) return undefined
    getWeather(exploreContext.destination, i18n.language).then(weather => {
      if (active && !weather?.unavailable) setDestinationWeather(weather)
    }).catch(() => {})
    return () => { active = false }
  }, [exploreContext.destination, i18n.language])

  const updateExploreContext = useCallback(context => setExploreContext(context), [])
  const searchCenter = exploreContext.destination || exploreContext.origin || exploreContext.province?.center
  const searchLabel = exploreContext.destination?.name || (exploreContext.origin ? (english?'your location':'tu ubicación') : exploreContext.province?.name)

  const searchCategory = useCallback(async (category, requestedRadius = radiusKm) => {
    if (!searchCenter) {
      setError(english ? 'Choose a destination, province, or current location first.' : 'Primero elige un destino, provincia o ubicación actual.')
      return
    }
    setSelectedCategory(category)
    setSelectedPlace(null)
    setDisplayLimit(12)
    setError('')
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)
    try {
      const result = await searchExplorePlaces({
        center: searchCenter,
        category,
        radiusKm: requestedRadius,
        province: exploreContext.provinceId === 'all' ? (exploreContext.destination?.province || '') : exploreContext.province.name,
        signal: controller.signal,
      })
      if (controller.signal.aborted) return
      setPlaces(result.places)
      setProvider(result.attribution)
    } catch (requestError) {
      if (!controller.signal.aborted && requestError.name !== 'AbortError') {
        setPlaces([])
        setProvider('')
        setError(english ? 'We could not retrieve places right now.' : 'No pudimos consultar los lugares en este momento.')
      }
    } finally {
      if (!controller.signal.aborted && abortRef.current === controller) setLoading(false)
    }
  }, [english, exploreContext.destination?.province, exploreContext.province, exploreContext.provinceId, radiusKm, searchCenter])

  const sortedPlaces = useMemo(() => [...places].sort((a, b) => sort === 'name'
    ? a.name.localeCompare(b.name, i18n.language)
    : (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)), [i18n.language, places, sort])
  const visiblePlaces = sortedPlaces.slice(0, displayLimit)

  const viewPlace = place => {
    setSelectedPlace(place)
    window.requestAnimationFrame(() => document.getElementById('explore-results-map')?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
  }

  const directionsTo = place => {
    setRequestedDestination(place)
    window.requestAnimationFrame(() => document.getElementById('explore-route-planner')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const changeRadius = event => {
    const next = Number(event.target.value)
    setRadiusKm(next)
    if (selectedCategory) void searchCategory(selectedCategory, next)
  }

  return <div className="feature-page travel-page">
    <header className="feature-page-header">
      <div><span className="feature-kicker"><MapPinned size={15}/>{t('travel.kicker')}</span><h1>{t('travel.title')}</h1><p>{t('travel.subtitle')}</p></div>
      <div className="explore-header-tools">
        {exploreContext.destination && destinationWeather && <div className="explore-destination-weather" aria-label={english?'Current destination weather':'Clima actual del destino'}><strong>{exploreContext.destination.name}</strong><span>{Number.isFinite(destinationWeather.temperature)?`${Math.round(destinationWeather.temperature)} °C`:'—'}{Number.isFinite(destinationWeather.precipitation)&&<><CloudRain size={14}/>{destinationWeather.precipitation} mm</>}{Number.isFinite(destinationWeather.wind)&&<><Wind size={14}/>{Math.round(destinationWeather.wind)} km/h</>}</span><small>Open‑Meteo</small></div>}
        <label className="visitor-mode"><input type="checkbox" checked={visitor} onChange={event => setVisitor(event.target.checked)}/><span>{t('travel.visitor')}</span></label>
      </div>
    </header>

    <RoutePlanner onContextChange={updateExploreContext} requestedDestination={requestedDestination} onRequestedDestinationHandled={() => setRequestedDestination(null)}/>

    <section className="travel-categories">
      <div><span>{t('travel.explore')}</span><h2>{t('travel.places')}</h2><p>{english?'Real places from OpenStreetMap, limited to the selected destination and radius. Routes use OSRM and weather uses Open‑Meteo.':'Lugares reales de OpenStreetMap, limitados al destino y radio seleccionados. Las rutas usan OSRM y el clima Open‑Meteo.'}</p></div>
      {categories.map(([Icon, key]) => <button type="button" key={key} className={selectedCategory === key ? 'active' : ''} aria-pressed={selectedCategory === key} aria-busy={loading && selectedCategory === key} onClick={() => void searchCategory(key)} disabled={loading && selectedCategory === key}><Icon size={20}/><span>{t(`travel.${key}`)}</span><small>{searchLabel ? `${t('travel.searchNearby')} ${searchLabel}` : t('travel.searchNearby')}</small></button>)}
    </section>

    {(selectedCategory || loading || error) && <section className="explore-results" aria-live="polite" aria-busy={loading}>
      <header className="explore-results-heading">
        <div><span>{t('travel.explore')}</span><h2>{t(`travel.${selectedCategory}`)} {english?'near':'cerca de'} {searchLabel}</h2><p>{loading ? (english?'Retrieving real places…':'Consultando lugares reales…') : `${places.length} ${english?'places found':'lugares encontrados'}`}</p></div>
        <div className="explore-result-filters">
          <label>{english?'Radius':'Radio'}<select value={radiusKm} onChange={changeRadius}><option value="5">5 km</option><option value="10">10 km</option><option value="25">25 km</option><option value="50">50 km</option></select></label>
          <label>{english?'Sort':'Ordenar'}<select value={sort} onChange={event => setSort(event.target.value)}><option value="distance">{english?'Nearest':'Más cercanos'}</option><option value="name">{english?'Name A–Z':'Nombre A–Z'}</option></select></label>
        </div>
      </header>

      {loading && <div className="explore-loading" aria-label={english?'Loading places':'Cargando lugares'}>{Array.from({ length: 6 }, (_, index) => <div key={index}><i/><span/><small/></div>)}</div>}

      {!loading && error && <div className="explore-state error"><SearchX size={28}/><strong>{error}</strong><span>{english?'The rest of PULSE remains available.':'El resto de PULSE continúa disponible.'}</span><button type="button" className="btn primary" onClick={() => void searchCategory(selectedCategory)}><RefreshCw size={15}/>{english?'Try again':'Reintentar'}</button></div>}

      {!loading && !error && selectedCategory && places.length === 0 && <div className="explore-state"><SearchX size={28}/><strong>{english?`We did not find ${t(`travel.${selectedCategory}`).toLowerCase()} in this area.`:`No encontramos ${t(`travel.${selectedCategory}`).toLowerCase()} en esta zona.`}</strong><span>{english?'Change destination or expand the search radius.':'Cambia el destino o amplía el área de búsqueda.'}</span>{radiusKm < 50 && <button type="button" className="btn primary" onClick={() => { const next = radiusKm === 5 ? 10 : radiusKm === 10 ? 25 : 50; setRadiusKm(next); void searchCategory(selectedCategory, next) }}>{english?'Expand area':'Ampliar área'}</button>}</div>}

      {!loading && !error && visiblePlaces.length > 0 && <div className="explore-results-layout">
        <div className="explore-place-list">
          {visiblePlaces.map(place => <PlaceResultCard key={place.id} place={place} label={t(`travel.${place.category}`)} locale={i18n.language} selected={selectedPlace?.id === place.id} onView={viewPlace} onDirections={directionsTo}/>) }
          {displayLimit < Math.min(20, sortedPlaces.length) && <button type="button" className="btn ghost explore-show-more" onClick={() => setDisplayLimit(limit => Math.min(20, limit + 8))}>{english?'Show more':'Mostrar más'}</button>}
        </div>
        <div className="explore-map-column" id="explore-results-map">
          <div className="explore-map-head"><span><MapPin size={15}/>{english?'Places on map':'Lugares en el mapa'}</span><small>{provider}</small></div>
          <GeoMap compact compactControls places={visiblePlaces} selectedId={selectedPlace?.id} onSelectPlace={setSelectedPlace} initialCenter={selectedPlace || searchCenter} initialZoom={12} focusLocations={selectedPlace?[selectedPlace]:visiblePlaces} focusKey={selectedPlace?.id || `${selectedCategory}-${radiusKm}-${visiblePlaces.length}`} userLocation={location} onRequestUserLocation={startLocation}/>
          <PlaceDetails place={selectedPlace} categoryLabel={selectedPlace ? t(`travel.${selectedPlace.category}`) : ''} locale={i18n.language} onClose={() => setSelectedPlace(null)} onDirections={directionsTo}/>
        </div>
      </div>}
    </section>}
  </div>
}
