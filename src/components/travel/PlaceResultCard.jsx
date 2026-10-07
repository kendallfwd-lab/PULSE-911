import { Clock3, MapPin, Navigation, Phone, Route } from 'lucide-react'

function formatDistance(distance, locale) {
  if (!Number.isFinite(distance)) return ''
  if (distance < 1) return `${Math.round(distance * 1000)} m`
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(distance)} km`
}

export function PlaceResultCard({ place, label, locale = 'es', selected = false, onView, onDirections }) {
  const english = locale.startsWith('en')
  return <article className={`explore-place-card${selected ? ' selected' : ''}`}>
    <div className="explore-place-card-icon"><MapPin size={18}/></div>
    <div className="explore-place-card-copy">
      <span className="explore-place-category">{label}</span>
      <h3>{place.name}</h3>
      {(place.city || place.province) && <p>{[place.city, place.province].filter(Boolean).join(', ')}</p>}
      {place.address && <small>{place.address}</small>}
      <div className="explore-place-meta">
        {Number.isFinite(place.distanceKm) && <span><Navigation size={13}/>{formatDistance(place.distanceKm, locale)}</span>}
        {place.openingHours && <span><Clock3 size={13}/>{place.openingHours}</span>}
        {place.phone && <span><Phone size={13}/>{place.phone}</span>}
      </div>
    </div>
    <div className="explore-place-actions">
      <button type="button" className="btn ghost" onClick={() => onView(place)}><MapPin size={15}/>{english?'View location':'Ver ubicación'}</button>
      <button type="button" className="btn primary" onClick={() => onDirections(place)}><Route size={15}/>{english?'Directions':'Cómo llegar'}</button>
    </div>
  </article>
}
