import { LocateFixed } from 'lucide-react'
import { useTranslation } from 'react-i18next'
export function AssistantLocationCard({ location, active, onToggle }) {
  const { t, i18n }=useTranslation(); const english=i18n.language.startsWith('en')
  return <section className="pulse-ai-context-card"><LocateFixed/><div><strong>{english?'Location':'Ubicación'}</strong><span>{location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : english?'Not shared':'No compartida'}</span><small>{location ? `${english?'Approximate accuracy':'Precisión aproximada'} ${Math.round(location.accuracy || 0)} m` : english?'Only shared when submitting a question':'Solo se comparte al enviar una consulta'}</small></div><button type="button" onClick={onToggle}>{active ? t('actions.stop') : t('common.activateLocation')}</button></section>
}
