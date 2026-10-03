import { AlertTriangle, CheckCircle2, Clock3, MapPin, Radio, ShieldCheck, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { relativeTime } from '../../utils/dateTime'

export function VerificationBadge({ status = 'unverified' }) {
  const { t } = useTranslation()
  const Icon = status === 'verified' || status === 'official' || status === 'community_confirmed' ? CheckCircle2 : status === 'ai_suggested' ? Sparkles : status === 'rejected' ? AlertTriangle : Clock3
  return <span className={`verification-badge verification-${status}`} title={t(`incident.${status}`)}><Icon size={13}/>{t(`incident.${status}`, { defaultValue: status.replaceAll('_', ' ') })}</span>
}

export function TrafficImpactBadge({ impact = 'none' }) {
  const { t } = useTranslation()
  const Icon = impact === 'none' || impact === 'low' ? CheckCircle2 : AlertTriangle
  return <span className={`traffic-impact-badge traffic-impact-${impact}`}><Icon size={13}/>{t(`traffic.${impact}`, { defaultValue: impact })}</span>
}

export function BreakingTicker({ incidents = [], roads = [] }) {
  const { t, i18n } = useTranslation()
  const incident = incidents.find(item => !['resolved', 'cancelled'].includes(item.status))
  const road = roads.find(item => item.status !== 'normal')
  if (!incident && !road) return null
  const message = incident ? `${incident.title} · ${incident.location?.label || ''}` : `${road.route} · ${t(`traffic.${road.status}`)}`
  const time = incident?.lastUpdatedAt || incident?.updatedAt || incident?.createdAt || road?.lastUpdatedAt
  return <section className="pulse-breaking-ticker" aria-label={t('home.breaking')}><span><Radio size={15}/>{t('home.breaking')}</span><p>{message}</p><small>{relativeTime(time, i18n.language)}</small></section>
}

export function TrafficSummary({ incidents = [], roads = [], riskZones = [] }) {
  const { t } = useTranslation()
  const active = incidents.filter(item => !['resolved', 'cancelled'].includes(item.status)).length
  const affected = roads.filter(item => item.status !== 'normal').length
  return <section className="traffic-summary" aria-labelledby="pulse-now-heading"><div><span>{t('home.now')}</span><h1 id="pulse-now-heading">{t('home.headline')}</h1></div><dl><div><dt>{t('home.activeIncidents')}</dt><dd>{active}</dd></div><div><dt>{t('home.affectedRoads')}</dt><dd>{affected}</dd></div><div><dt>{t('home.precautionZones')}</dt><dd>{riskZones.length}</dd></div></dl></section>
}

export function NearbySummary({ incidents = [], hospitals = [] }) {
  const { t } = useTranslation()
  return <a className="nearby-summary-card" href="/app/nearby"><MapPin size={20}/><span><strong>{t('nav.nearby')}</strong><small>{t('home.reportsNearby',{incidents:incidents.length,hospitals:hospitals.length})}</small></span><ShieldCheck size={18}/></a>
}
