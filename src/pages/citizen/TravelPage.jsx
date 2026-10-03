import { Building2, Coffee, Fuel, Hospital, MapPin, MapPinned, Pill, Trees, Utensils } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RoutePlanner } from '../../components/travel/RoutePlanner'
import { useLiveLocation } from '../../context/LiveLocationContext'
import { searchNearbyPlaces } from '../../services/placesService'

const categories = [[Trees, 'parks'], [MapPinned, 'beaches'], [Utensils, 'restaurants'], [Coffee, 'cafes'], [Building2, 'museums'], [Hospital, 'hospitals'], [Pill, 'pharmacies'], [Fuel, 'gas']]

export default function TravelPage() {
  const { t, i18n } = useTranslation()
  const { location, start } = useLiveLocation()
  const [visitor, setVisitor] = useState(() => localStorage.getItem('pulse911-visitor-mode') === 'true')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [places, setPlaces] = useState([])
  const [provider, setProvider] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const abortRef = useRef(null)

  useEffect(() => { localStorage.setItem('pulse911-visitor-mode', String(visitor)) }, [visitor])
  useEffect(() => () => abortRef.current?.abort(), [])

  const searchCategory = async category => {
    setSelectedCategory(category)
    setError('')
    if (!location) {
      setPlaces([])
      setError(t('nearby.permission'))
      start()
      return
    }
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)
    setProvider(null)
    try {
      const result = await searchNearbyPlaces({ location, categories: [category], locale: i18n.language.split('-')[0], signal: controller.signal })
      setPlaces(result.places)
      setProvider(result.attribution)
      if (!result.places.length) setError(t('nearby.empty'))
    } catch (requestError) {
      if (!controller.signal.aborted && requestError.name !== 'AbortError') setError(t('nearby.empty'))
    } finally {
      if (!controller.signal.aborted && abortRef.current === controller) setLoading(false)
    }
  }

  return <div className="feature-page travel-page">
    <header className="feature-page-header">
      <div><span className="feature-kicker"><MapPinned size={15}/>{t('travel.kicker')}</span><h1>{t('travel.title')}</h1><p>{t('travel.subtitle')}</p></div>
      <label className="visitor-mode"><input type="checkbox" checked={visitor} onChange={event => setVisitor(event.target.checked)}/><span>{t('travel.visitor')}</span></label>
    </header>
    <RoutePlanner/>
    <section className="travel-categories">
      <div><span>{t('travel.explore')}</span><h2>{t('travel.places')}</h2><p>{t('travel.providerNotice')}</p></div>
      {categories.map(([Icon, key]) => <button type="button" key={key} className={selectedCategory === key ? 'active' : ''} aria-pressed={selectedCategory === key} onClick={() => searchCategory(key)} disabled={loading}><Icon size={20}/><span>{t(`travel.${key}`)}</span><small>{t('travel.searchNearby')}</small></button>)}
    </section>
    {(loading || error || places.length > 0) && <section className="travel-place-results" aria-live="polite">
      <header><div><span>{t('travel.explore')}</span><h2>{selectedCategory ? t(`travel.${selectedCategory}`) : t('travel.places')}</h2></div>{provider && <small>{provider}</small>}</header>
      {loading && <p>{t('layout.searching')}</p>}
      {error && <p role="status">{error}</p>}
      {!loading && places.length > 0 && <div>{places.map(place => <article key={place.id}><MapPin size={19}/><span><strong>{place.name}</strong><small>{place.address || provider || t('travel.places')}</small><em>{t('nearby.distance', { distance: new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 1 }).format(place.distanceKm) })}</em></span></article>)}</div>}
    </section>}
  </div>
}
