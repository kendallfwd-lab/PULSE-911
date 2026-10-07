import { Clock3, ExternalLink, Globe2, MapPin, Navigation, Phone, Route, X } from 'lucide-react'

function safeWebsite(value) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : ''
  } catch { return '' }
}

export function PlaceDetails({ place, categoryLabel, locale = 'es', onClose, onDirections }) {
  if (!place) return null
  const english = locale.startsWith('en')
  const website = safeWebsite(place.website)
  return <aside className="explore-place-details" aria-label={english?'Place details':'Detalles del lugar'}>
    <header><div><span>{categoryLabel}</span><h3>{place.name}</h3></div><button type="button" onClick={onClose} aria-label={english?'Close details':'Cerrar detalles'}><X size={18}/></button></header>
    <dl>
      {(place.address || place.city || place.province) && <div><dt><MapPin size={15}/>{english?'Location':'Ubicación'}</dt><dd>{place.address || [place.city, place.province].filter(Boolean).join(', ')}</dd></div>}
      {place.phone && <div><dt><Phone size={15}/>{english?'Phone':'Teléfono'}</dt><dd>{place.phone}</dd></div>}
      {place.openingHours && <div><dt><Clock3 size={15}/>{english?'Hours':'Horario'}</dt><dd>{place.openingHours}</dd></div>}
      {place.operator && <div><dt><Globe2 size={15}/>{english?'Operator / brand':'Operador / marca'}</dt><dd>{place.operator}</dd></div>}
      {place.cuisine && <div><dt><Globe2 size={15}/>{english?'Cuisine':'Cocina'}</dt><dd>{place.cuisine.replaceAll(';', ', ')}</dd></div>}
      <div><dt><Navigation size={15}/>{english?'Coordinates':'Coordenadas'}</dt><dd>{place.lat.toFixed(5)}, {place.lng.toFixed(5)}</dd></div>
    </dl>
    <div className="explore-place-detail-actions">
      <button type="button" className="btn primary" onClick={() => onDirections(place)}><Route size={16}/>{english?'Directions':'Cómo llegar'}</button>
      {website && <a className="btn ghost" href={website} target="_blank" rel="noreferrer"><ExternalLink size={15}/>{english?'Official website':'Abrir sitio web'}</a>}
    </div>
    <small>{english?'Data supplied by OpenStreetMap contributors. Missing fields are not inferred.':'Datos aportados por colaboradores de OpenStreetMap. Los campos ausentes no se infieren.'}</small>
  </aside>
}
