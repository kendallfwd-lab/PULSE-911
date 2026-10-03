import { HeartHandshake, MessageCircle, Phone, ShieldCheck, Siren, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BreathingGuide } from '../../components/travel/BreathingGuide'

export default function WellbeingPage() {
  const { t } = useTranslation()
  return <div className="feature-page wellbeing-page"><header className="feature-page-header"><div><span className="feature-kicker"><HeartHandshake size={15}/>{t('wellbeing.kicker')}</span><h1>{t('wellbeing.title')}</h1><p>{t('wellbeing.subtitle')}</p></div><Link className="btn primary" to="/app/assistant"><MessageCircle size={16}/>{t('wellbeing.talk')}</Link></header>
    <div className="wellbeing-emergency-notice" role="note"><Siren/><div><strong>{t('wellbeing.notice')}</strong><p>{t('wellbeing.emergency')}</p></div></div>
    <section className="wellbeing-steps"><article><ShieldCheck/><span>01</span><h2>{t('wellbeing.safe')}</h2><p>{t('wellbeing.safeText')}</p></article><article><Siren/><span>02</span><h2>{t('wellbeing.steps')}</h2><p>{t('wellbeing.stepsText')}</p></article><article><Phone/><span>03</span><h2>{t('wellbeing.contact')}</h2><p>{t('wellbeing.contactText')}</p></article><article><UsersRound/><span>04</span><h2>{t('wellbeing.emotional')}</h2><p>{t('wellbeing.emotionalText')}</p></article></section>
    <BreathingGuide/>
  </div>
}
