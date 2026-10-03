import { ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
export function RouteRiskSummary({ risk }) { const {t}=useTranslation(); return <section className={`route-risk-summary risk-${risk.level}`}><ShieldCheck/><div><span>{t('travel.structuredExposure')}</span><h2>{t('travel.risk',{level:t(`travel.${risk.level}`)})}</h2><p>{t('travel.scoreNotice',{score:risk.score})}</p></div></section> }
