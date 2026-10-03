import { AlertTriangle, BellRing, Building2, MapPin, ShieldAlert, Sparkles } from 'lucide-react'
import { distanceKm } from '../utils/geo'
import { VerificationBadge } from './traffic/TrafficComponents'
import { useTranslation } from 'react-i18next'

export function AccessibleMapList({ incidents = [], alerts = [], riskZones = [], hospitals = [], aiSuggestions = [], referenceLocation = null, onSelect }) {
  const { t, i18n }=useTranslation(); const english=i18n.language.startsWith('en')
  const items = [
    ...incidents.map(item => ({ ...item, mapType: 'Incidente', name: item.title, Icon: AlertTriangle, state: item.status, priority: item.priority })),
    ...alerts.filter(item => item.active !== false).map(item => ({ ...item, mapType: 'Alerta', name: item.title, Icon: BellRing, state: item.status || 'active' })),
    ...riskZones.map(item => ({ ...item, mapType: 'Zona de precaución', name: item.name || item.title, Icon: ShieldAlert, state: item.severity })),
    ...hospitals.map(item => ({ ...item, mapType: 'Hospital', name: item.name, Icon: Building2, state: item.status })),
    ...aiSuggestions.filter(item => item.reviewStatus !== 'rejected').map(item => ({ ...item, mapType: 'Sugerencia IA pendiente', name: item.title, Icon: Sparkles, state: item.reviewStatus, verificationStatus: 'ai_suggested' })),
  ].map(item => ({ ...item, accessibleDistance: referenceLocation ? distanceKm(referenceLocation, item.location || item) : null })).sort((a, b) => (a.accessibleDistance ?? Infinity) - (b.accessibleDistance ?? Infinity))
  return <section className="accessible-map-list" aria-labelledby="accessible-map-title"><header><MapPin/><div><h2 id="accessible-map-title">{t('map.accessibleTitle')}</h2><p>{t('map.accessibleHelp')}</p></div></header><ul>{items.map(item => { const Icon = item.Icon; return <li key={`${item.mapType}-${item.id}`}><button type="button" onClick={() => onSelect?.(item)}><Icon size={17}/><span><strong>{item.name || (english?'Unnamed point':'Punto sin nombre')}</strong><small>{item.mapType} · {item.location?.label || t('common.locationRegistered')}</small></span><span><b>{item.priority || item.state || (english?'Information':'Información')}</b>{Number.isFinite(item.accessibleDistance) && <small>{item.accessibleDistance.toFixed(1)} km</small>}{item.verificationStatus && <VerificationBadge status={item.verificationStatus}/>}</span></button></li>})}{!items.length && <li className="accessible-map-empty">{t('map.empty')}</li>}</ul></section>
}
