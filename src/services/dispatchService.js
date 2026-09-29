import { compatibleUnits } from '../utils/dispatch'
export function recommendResources(incident, units) {
  return compatibleUnits(incident, units).slice(0, 6)
}
export function etaLabel(unit) {
  const progress = unit?.mission?.progress || 0
  const base = Number(unit?.mission?.etaMin || unit?.eta || 5)
  return unit?.status === 'en_route' ? `${Math.max(0, Math.ceil((1 - progress) * base))} min` : unit?.status === 'on_scene' ? 'En sitio' : `${base} min`
}
