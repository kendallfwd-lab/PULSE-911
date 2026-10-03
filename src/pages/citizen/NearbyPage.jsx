import { useMemo, useState } from 'react'
import { AlertTriangle, BellRing, Building2, LocateFixed, MapPin, Navigation, ShieldAlert, UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePulse } from '../../context/PulseContext'
import { useLiveLocation } from '../../context/LiveLocationContext'
import { itemsWithinRadius } from '../../utils/geo'
import { VerificationBadge } from '../../components/traffic/TrafficComponents'

const radii = [1, 3, 5, 10, 25]

export default function NearbyPage() {
  const { t } = useTranslation()
  const { db } = usePulse()
  const { location, status, error, start, stop, isActive } = useLiveLocation()
  const [radius, setRadius] = useState(5)
  const items = useMemo(() => {
    if (!location) return []
    const normalized = [
      ...db.incidents.filter(item => !['resolved', 'cancelled'].includes(item.status)).map(item => ({ ...item, kind: 'incident', name: item.title, Icon: AlertTriangle })),
      ...db.alerts.filter(item => item.active !== false).map(item => ({ ...item, kind: 'alert', name: item.title, Icon: BellRing })),
      ...(db.riskZones || []).map(item => ({ ...item, kind: 'risk', name: item.name || item.title, Icon: ShieldAlert })),
      ...(db.publications || []).map(item => ({ ...item, kind: 'community', name: item.title, Icon: UsersRound })),
      ...(db.hospitals || []).map(item => ({ ...item, kind: 'hospital', name: item.name, Icon: Building2 })),
    ]
    return itemsWithinRadius(normalized, location, radius).sort((a, b) => a.distanceKm - b.distanceKm)
  }, [db, location, radius])

  return <div className="feature-page nearby-page"><header className="feature-page-header"><div><span className="feature-kicker"><LocateFixed size={15}/>{t('nearby.kicker')}</span><h1>{t('nearby.title')}</h1><p>{t('nearby.subtitle')}</p></div><button className={`btn ${isActive ? 'ghost' : 'primary'}`} type="button" onClick={isActive ? stop : start}><Navigation size={16}/>{status === 'requesting' ? t('common.requestingLocation') : isActive ? t('common.stopLocation') : t('common.activateLocation')}</button></header>
    {error && <div className="inline-notice inline-notice-warning" role="alert"><AlertTriangle size={16}/>{error}</div>}
    <section className="nearby-radius" aria-label={t('nearby.radius')}><strong>{t('nearby.radius')}</strong>{radii.map(value => <button key={value} type="button" className={radius === value ? 'active' : ''} aria-pressed={radius === value} onClick={() => setRadius(value)}>{value} km</button>)}</section>
    {!location ? <section className="feature-empty"><LocateFixed/><h2>{t('nearby.permission')}</h2><p>{t('nearby.permissionDetail')}</p></section> : <section className="nearby-results" aria-live="polite">{items.length ? items.map(item => { const Icon = item.Icon; return <article key={`${item.kind}-${item.id}`} className="nearby-result"><i><Icon size={19}/></i><div><span>{t(`nearby.${item.kind}`)}</span><h2>{item.name}</h2><p>{item.location?.label || item.address || t('common.locationRegistered')}</p></div><aside><strong>{item.distanceKm.toFixed(1)} km</strong>{item.verificationStatus && <VerificationBadge status={item.verificationStatus}/>}</aside></article> }) : <div className="feature-empty"><MapPin/><h2>{t('nearby.empty')}</h2></div>}</section>}
  </div>
}
