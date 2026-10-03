import { useMemo, useState } from 'react'
import { ChevronDown, Clock3, Map, Route, Search, ShieldAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePulse } from '../../context/PulseContext'
import { TrafficImpactBadge } from '../../components/traffic/TrafficComponents'
import { formatDateTime } from '../../utils/dateTime'

const provinces = ['all', 'San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón']

export default function RoadStatusPage() {
  const { t, i18n } = useTranslation()
  const { db } = usePulse()
  const [query, setQuery] = useState('')
  const [province, setProvince] = useState('all')
  const [status, setStatus] = useState('all')
  const [expanded, setExpanded] = useState(null)
  const roads = useMemo(() => (db.roadStatus || []).filter(road => province === 'all' || road.province === province).filter(road => status === 'all' || road.status === status).filter(road => `${road.route} ${road.name}`.toLowerCase().includes(query.toLowerCase())), [db.roadStatus, province, query, status])
  return <div className="feature-page road-status-page"><header className="feature-page-header"><div><span className="feature-kicker"><Route size={15}/>{t('roads.kicker')}</span><h1>{t('roads.title')}</h1><p>{t('roads.subtitle')}</p></div><div className="frequent-update"><i/><span>{t('status.frequentUpdates')}</span></div></header>
    <section className="traffic-filters"><label><Search size={16}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder={t('roads.search')}/></label><select aria-label="Provincia" value={province} onChange={event => setProvince(event.target.value)}>{provinces.map(item => <option key={item} value={item}>{item === 'all' ? t('common.allProvinces') : item}</option>)}</select><select aria-label={t('roads.status')} value={status} onChange={event => setStatus(event.target.value)}><option value="all">{t('common.allStatuses')}</option>{['normal', 'precaution', 'slow', 'partial_block', 'closed'].map(item => <option key={item} value={item}>{t(`traffic.${item}`)}</option>)}</select></section>
    <section className="road-list" aria-live="polite">{roads.map(road => <article key={road.id} className={`road-card road-${road.status}`}><button type="button" className="road-card-summary" aria-expanded={expanded === road.id} onClick={() => setExpanded(value => value === road.id ? null : road.id)}><span className="road-route-icon"><Map size={20}/></span><span><small>{road.route}</small><strong>{road.name}</strong><em>{road.province} · {road.direction}</em></span><span className={`road-status road-status-${road.status}`}><ShieldAlert size={14}/>{t(`traffic.${road.status}`)}</span><span><small>{t('roads.incidents')}</small><strong>{road.incidentCount || 0}</strong></span><span><small>{t('roads.delay')}</small><strong>{road.estimatedDelayMin ? `+${road.estimatedDelayMin} min` : '0 min'}</strong></span><TrafficImpactBadge impact={road.trafficImpact}/><ChevronDown className={expanded === road.id ? 'rotated' : ''}/></button>{expanded === road.id && <div className="road-card-details"><div><Clock3 size={16}/><span><small>{t('roads.updated')}</small><strong>{formatDateTime(road.lastUpdatedAt, i18n.language)}</strong></span></div><div><Route size={16}/><span><small>{t('roads.conditionType')}</small><strong>{road.type?.replaceAll('_', ' ')}</strong></span></div>{road.alternativeRoute && <div><Map size={16}/><span><small>{t('roads.alternative')}</small><strong>{road.alternativeRoute}</strong></span></div>}<p>{t('roads.verify')}</p></div>}</article>)}</section>
  </div>
}
