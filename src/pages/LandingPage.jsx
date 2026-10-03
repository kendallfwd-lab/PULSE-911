import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowDown, ArrowRight, CheckCircle2, HeartHandshake, LockKeyhole, ShieldCheck, Siren, UsersRound } from 'lucide-react'
import { Brand } from '../components/Brand'
import { AccessibilityControls } from '../components/accessibility/AccessibilityControls'
import './LandingPage.css'

const ease = [0.22, 1, 0.36, 1]

function Reveal({ children, className = '', delay = 0, amount = 0.22 }) {
  const reducedMotion = useReducedMotion()
  return <motion.div
    className={className}
    initial={reducedMotion ? false : { opacity: 0, y: 34 }}
    whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
    viewport={{ once: true, amount }}
    transition={{ duration: 0.72, delay, ease }}
  >{children}</motion.div>
}

function BrowserFrame({ src, alt, label, className = '' }) {
  return <div className={`landing-browser-frame ${className}`}>
    <div className="landing-browser-bar" aria-hidden="true"><span/><span/><span/><b>{label}</b></div>
    <div className="landing-browser-screen"><img src={src} alt={alt} loading="lazy" decoding="async"/></div>
  </div>
}

function PhoneScrollScene({t}) {
  const sceneRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ['start end', 'end start'] })
  const phoneY = useTransform(scrollYProgress, [0, 0.5, 1], [70, 0, -45])
  const phoneRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-5, 1, 4])
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.84, 1.08, 0.92])

  return <section ref={sceneRef} className="landing-phone-scene" aria-labelledby="mobile-scene-title">
    <div className="landing-phone-shell">
      <motion.div className="landing-phone-glow" style={reducedMotion ? undefined : { scale: glowScale }}/>
      <motion.div className="landing-phone" style={reducedMotion ? undefined : { y: phoneY, rotate: phoneRotate }}>
        <div className="landing-phone-speaker"/>
        <div className="landing-phone-status"><span>9:11</span><b>PULSE</b><i/></div>
        <img src="/assets/presentation/tracking-preview.jpg" alt={t('landing.mobileAlt')} loading="lazy" decoding="async"/>
        <div className="landing-phone-card"><span><i/>{t('landing.unitEnRoute')}</span><strong>{t('landing.activeTracking')}</strong><small>{t('landing.simulatedEta')}</small></div>
      </motion.div>
    </div>
    <Reveal className="landing-phone-copy">
      <h2>{t('landing.mobileTitle')}</h2>
      <p>{t('landing.mobileText')}</p>
      <div className="landing-check-list"><span><CheckCircle2/>{t('landing.mobileStatus')}</span><span><CheckCircle2/>{t('landing.mobileUnit')}</span><span><CheckCircle2/>{t('landing.mobileNotices')}</span></div>
      <Link className="landing-text-link" to="/login">{t('landing.exploreCitizen')}<ArrowRight size={16}/></Link>
    </Reveal>
  </section>
}

export default function LandingPage(){
  const {t}=useTranslation()
  const courses = [
    { image: '/assets/user-content/plan-familiar.webp', icon: ShieldCheck, tag: t('landing.course1Tag'), title: t('landing.course1Title'), text: t('landing.course1Text') },
    { image: '/assets/user-content/practica-rcp.webp', icon: Siren, tag: t('landing.course2Tag'), title: t('landing.course2Title'), text: t('landing.course2Text') },
    { image: '/assets/user-content/apoyo-emocional.webp', icon: HeartHandshake, tag: t('landing.course3Tag'), title: t('landing.course3Title'), text: t('landing.course3Text') },
  ]
  const heroRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 58])
  const heroImageScale = useTransform(scrollYProgress, [0, 1], [1, 0.965])

  return <div className="pulse-landing-v7">
    <header className="landing-v7-header">
      <Link to="/" className="landing-v7-brand" aria-label="PULSE 911"><i/><strong>PULSE 911</strong><span>{t('landing.platform')}</span></Link>
      <nav aria-label={t('landing.presentationNav')}><a href="#recorrido">{t('landing.tour')}</a><a href="#command">Command</a><a href="#preparacion">{t('landing.preparedness')}</a></nav>
      <div className="landing-v7-actions"><AccessibilityControls compact/><Link className="btn ghost" to="/login">{t('landing.login')}</Link><Link className="btn emergency" to="/register">{t('landing.createAccount')}</Link></div>
    </header>

    <main>
      <section ref={heroRef} className="landing-v7-hero">
        <motion.div className="landing-hero-copy" initial={reducedMotion ? false : { opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease }}>
          <h1>{t('landing.heroTitle')}</h1>
          <p>{t('landing.heroText')}</p>
          <div className="landing-hero-actions"><a className="btn emergency" href="#recorrido"><ArrowDown size={17}/>{t('landing.explorePresentation')}</a><Link className="btn secondary" to="/login">{t('landing.enterSystem')}<ArrowRight size={17}/></Link></div>
          <div className="landing-trust-row"><span><CheckCircle2/>{t('landing.connected')}</span><span><LockKeyhole/>{t('landing.localData')}</span></div>
        </motion.div>
        <motion.div className="landing-hero-stage" initial={reducedMotion ? false : { opacity: 0, scale: 0.94, y: 26 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.95, delay: 0.08, ease }} style={reducedMotion ? undefined : { y: heroImageY, scale: heroImageScale }}>
          <BrowserFrame src="/assets/presentation/public-preview.jpg" alt={t('landing.publicPreview')} label="pulse911.demo" className="landing-hero-browser"/>
          <div className="landing-stage-chip landing-chip-live"><i/>{t('landing.activeDemo')}</div>
          <div className="landing-stage-chip landing-chip-network"><UsersRound size={15}/><span>{t('landing.syncedPortals')}</span></div>
        </motion.div>
      </section>

      <section id="recorrido" className="landing-story-section landing-story-light">
        <Reveal className="landing-story-copy">
          <h2>{t('landing.urgentTitle')}</h2>
          <p>{t('landing.urgentText')}</p>
          <ul><li>{t('landing.progressiveForm')}</li><li>{t('landing.visibleLocation')}</li><li>{t('landing.optionalEvidence')}</li></ul>
          <Link className="landing-text-link" to="/register">{t('landing.tryReport')}<ArrowRight size={16}/></Link>
        </Reveal>
        <Reveal className="landing-story-media" delay={0.08}><BrowserFrame src="/assets/presentation/report-preview.jpg" alt="Interfaz de reporte ciudadano de PULSE 911" label="pulse911.demo / reportar"/></Reveal>
      </section>

      <PhoneScrollScene t={t}/>

      <section id="command" className="landing-command-scene">
        <Reveal className="landing-command-frame"><BrowserFrame src="/assets/presentation/command-preview.jpg" alt="Centro de mando de PULSE 911 con incidentes, mapa y unidades" label="pulse911.demo / command"/></Reveal>
        <Reveal className="landing-command-copy" delay={0.08}>
          <h2>{t('landing.commandTitle')}</h2>
          <p>{t('landing.commandText')}</p>
          <div className="landing-command-stats"><div><b>P1</b><span>{t('landing.visiblePriority')}</span></div><div><b>ETA</b><span>{t('landing.resourceComparison')}</span></div><div><b>360°</b><span>{t('landing.incidentContext')}</span></div></div>
          <Link className="btn emergency" to="/login">{t('landing.openCommand')}<ArrowRight size={17}/></Link>
        </Reveal>
      </section>

      <section id="preparacion" className="landing-learning-section">
        <Reveal className="landing-section-heading"><h2>{t('landing.learningTitle')}</h2><p>{t('landing.learningText')}</p></Reveal>
        <div className="landing-learning-grid">{courses.map(({image,icon:Icon,tag,title,text},index)=><Reveal key={title} className="landing-learning-card" delay={index*0.07}><div className="landing-learning-image"><img src={image} alt={title} loading="lazy" decoding="async"/><span>{tag}</span></div><div><Icon/><h3>{title}</h3><p>{text}</p><span className="landing-card-meta"><CheckCircle2/>{t('landing.microTraining')}</span></div></Reveal>)}</div>
        <Reveal className="landing-learning-cta"><Link className="btn primary" to="/login">{t('landing.exploreResources')}<ArrowRight size={17}/></Link></Reveal>
      </section>

      <section id="acceso" className="landing-final-cta">
        <Reveal><h2>{t('landing.finalTitle')}</h2><p>{t('landing.finalText')}</p><div><Link className="btn emergency" to="/register">{t('landing.citizenAccount')}</Link><Link className="btn ghost" to="/login">{t('landing.demoAccount')}<ArrowRight size={17}/></Link></div><small><LockKeyhole size={14}/>{t('landing.academicNotice')}</small></Reveal>
      </section>
    </main>

    <footer className="landing-v7-footer">
      <div className="landing-footer-main">
        <Brand light/>
        <span>{t('landing.project')}</span>
        <Link to="/login">{t('landing.access')}<ArrowRight size={14}/></Link>
      </div>
      <div className="landing-footer-bottom">
        <span>© 2026 PULSE 911 · {t('app.demo')}</span>
        <div className="landing-footer-legal" aria-label={t('landing.terms')}>
          <details>
            <summary>{t('landing.terms')}</summary>
            <div className="landing-footer-legal-card">
              <strong>{t('landing.terms')}</strong>
              <p>{t('landing.termsText')}</p>
            </div>
          </details>
          <details>
            <summary>{t('landing.privacy')}</summary>
            <div className="landing-footer-legal-card">
              <strong>{t('landing.privacy')}</strong>
              <p>{t('landing.privacyText')}</p>
            </div>
          </details>
        </div>
      </div>
    </footer>
  </div>
}
