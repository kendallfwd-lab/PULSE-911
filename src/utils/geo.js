const EARTH_RADIUS_KM = 6371

export function distanceKm(a, b) {
  if (![a?.lat, a?.lng, b?.lat, b?.lng].every(Number.isFinite)) return Infinity
  const toRad = value => value * Math.PI / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

export function itemsWithinRadius(items, center, radiusKm, getLocation = item => item.location || item) {
  return (items || []).map(item => ({ ...item, distanceKm: distanceKm(center, getLocation(item)) })).filter(item => item.distanceKm <= radiusKm)
}

export function sortByDistance(items, center, getLocation = item => item.location || item) {
  return [...(items || [])].map(item => ({ ...item, distanceKm: distanceKm(center, getLocation(item)) })).sort((a, b) => a.distanceKm - b.distanceKm)
}

export function isValidLocation(location) {
  return Number.isFinite(location?.lat) && Number.isFinite(location?.lng) && Math.abs(location.lat) <= 90 && Math.abs(location.lng) <= 180
}
