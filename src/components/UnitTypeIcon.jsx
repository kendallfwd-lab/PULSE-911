import { Ambulance, Flame, HeartPulse, LifeBuoy, Search, ShieldCheck, Siren, TrafficCone, Truck } from 'lucide-react'
import { inferUnitService } from '../config/emergencyFleet'

const UNIT_VISUALS = {
  medical: { Icon: Ambulance, tone: 'medical', label: 'Ambulancia' },
  'medical-response': { Icon: HeartPulse, tone: 'medical-response', label: 'Respuesta médica' },
  fire: { Icon: Flame, tone: 'fire', label: 'Bomberos' },
  tow: { Icon: Truck, tone: 'tow', label: 'Grúa' },
  police: { Icon: ShieldCheck, tone: 'police', label: 'Policía' },
  traffic: { Icon: TrafficCone, tone: 'traffic', label: 'Policía de Tránsito' },
  investigation: { Icon: Search, tone: 'investigation', label: 'OIJ' },
  rescue: { Icon: LifeBuoy, tone: 'rescue', label: 'Rescate' },
}

const FALLBACK_VISUAL = { Icon: Siren, tone: 'support', label: 'Unidad de emergencia' }

export function getUnitVisual(unit) {
  return UNIT_VISUALS[inferUnitService(unit)] || FALLBACK_VISUAL
}

export function UnitTypeIcon({ unit, size = 20, className = '' }) {
  const { Icon, tone, label } = getUnitVisual(unit)
  return <span className={`unit-type-icon unit-type-${tone} ${className}`.trim()} title={`${label}: ${unit?.id || 'unidad'}`} aria-label={label}><Icon size={size} aria-hidden="true"/></span>
}
