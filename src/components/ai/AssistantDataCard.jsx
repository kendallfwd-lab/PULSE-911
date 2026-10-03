import { AlertTriangle, Building2, Clock3, MapPin, ShieldAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const labelKeys = {
  incident: 'nearby.incident',
  risk_zone: 'nearby.risk',
  alert: 'nearby.alert',
  road: 'roads.title',
  hospital: 'nearby.hospital',
  weather: 'travel.weather',
}

export function AssistantDataCard({ card }) {
  const { t, i18n } = useTranslation()
  const Icon = card.type === 'hospital' ? Building2 : card.type === 'risk_zone' ? ShieldAlert : card.type === 'road' ? Clock3 : card.type === 'alert' ? AlertTriangle : MapPin
  const distance = Number.isFinite(card.distanceKm)
    ? new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 1 }).format(card.distanceKm)
    : null

  return <article className="pulse-ai-result-card">
    <Icon aria-hidden="true"/>
    <div>
      <span>{labelKeys[card.type] ? t(labelKeys[card.type]) : card.type?.replaceAll('_', ' ') || 'PULSE'}</span>
      <strong>{card.title || card.name}</strong>
      {card.description && <p>{card.description}</p>}
      <small>{[distance && `${distance} km`, card.status, card.sourceType].filter(Boolean).join(' · ')}</small>
    </div>
  </article>
}
