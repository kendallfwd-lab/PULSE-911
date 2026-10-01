import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight, CheckCircle2, HeartHandshake, LockKeyhole, ShieldCheck, Siren, UsersRound } from 'lucide-react'
import { Brand } from '../components/Brand'
import { ThemeToggle } from '../components/ThemeToggle'
import './LandingPage.css'

const ease = [0.22, 1, 0.36, 1]

const courses = [
  { image: '/assets/user-content/plan-familiar.webp', icon: ShieldCheck, tag: 'Preparación', title: 'Plan familiar', text: 'Contactos, rutas, puntos de reunión y suministros esenciales.' },
  { image: '/assets/user-content/practica-rcp.webp', icon: Siren, tag: 'Respuesta inicial', title: 'RCP introductoria', text: 'Reconocer una emergencia y activar ayuda con información clara.' },
  { image: '/assets/user-content/apoyo-emocional.webp', icon: HeartHandshake, tag: 'Recuperación', title: 'Apoyo emocional', text: 'Escuchar, acompañar y conectar con redes de apoyo después del evento.' },
]

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

function PhoneScrollScene() {
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
        <img src="/assets/presentation/tracking-preview.jpg" alt="Vista conceptual móvil del seguimiento ciudadano" loading="lazy" decoding="async"/>
        <div className="landing-phone-card"><span><i/>Unidad en ruta</span><strong>Seguimiento activo</strong><small>ETA simulada · 3 minutos</small></div>
      </motion.div>
    </div>
    <Reveal className="landing-phone-copy">
      <h2>La respuesta también cabe en la mano.</h2>
      <p>La escena móvil resume el concepto de seguimiento: estado del caso, ubicación y tiempo estimado sin perder el contexto del portal de escritorio.</p>
      <div className="landing-check-list"><span><CheckCircle2/>Estado y línea de tiempo</span><span><CheckCircle2/>Unidad y ETA simulada</span><span><CheckCircle2/>Avisos importantes</span></div>
      <Link className="landing-text-link" to="/login">Explorar el portal ciudadano<ArrowRight size={16}/></Link>
    </Reveal>
  </section>
}

export default function LandingPage(){
  const heroRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 58])
  const heroImageScale = useTransform(scrollYProgress, [0, 1], [1, 0.965])

  return <div className="pulse-landing-v7">
    <header className="landing-v7-header">
      <Link to="/" className="landing-v7-brand" aria-label="PULSE 911, inicio"><i/><strong>PULSE 911</strong><span>Plataforma cívica de simulación</span></Link>
      <nav aria-label="Navegación de la presentación"><a href="#recorrido">Recorrido</a><a href="#command">Command</a><a href="#preparacion">Preparación</a></nav>
      <div className="landing-v7-actions"><ThemeToggle compact/><Link className="btn ghost" to="/login">Iniciar sesión</Link><Link className="btn emergency" to="/register">Crear cuenta</Link></div>
    </header>

    <main>
      <section ref={heroRef} className="landing-v7-hero">
        <motion.div className="landing-hero-copy" initial={reducedMotion ? false : { opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease }}>
          <h1>Información clara y coordinación cuando <em>cada segundo importa.</em></h1>
          <p>PULSE 911 conecta el reporte ciudadano, el mapa situacional y la coordinación operativa en una experiencia funcional de demostración.</p>
          <div className="landing-hero-actions"><a className="btn emergency" href="#recorrido"><ArrowDown size={17}/>Explorar la presentación</a><Link className="btn secondary" to="/login">Entrar al sistema<ArrowRight size={17}/></Link></div>
          <div className="landing-trust-row"><span><CheckCircle2/>Citizen + Command conectados</span><span><LockKeyhole/>Datos locales y ficticios</span></div>
        </motion.div>
        <motion.div className="landing-hero-stage" initial={reducedMotion ? false : { opacity: 0, scale: 0.94, y: 26 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.95, delay: 0.08, ease }} style={reducedMotion ? undefined : { y: heroImageY, scale: heroImageScale }}>
          <BrowserFrame src="/assets/presentation/public-preview.jpg" alt="Vista de escritorio del portal público PULSE 911" label="pulse911.demo / inicio" className="landing-hero-browser"/>
          <div className="landing-stage-chip landing-chip-live"><i/>Canal demo activo</div>
          <div className="landing-stage-chip landing-chip-network"><UsersRound size={15}/><span><b>2 portales</b> sincronizados</span></div>
        </motion.div>
      </section>

      <section id="recorrido" className="landing-story-section landing-story-light">
        <Reveal className="landing-story-copy">
          <h2>Convertir una situación urgente en información accionable.</h2>
          <p>El flujo guía a la persona por categoría, detalles, ubicación y evidencia. Cada paso reduce ambigüedad antes de enviar el caso al centro de mando.</p>
          <ul><li>Formulario progresivo y comprensible</li><li>Ubicación visible antes de confirmar</li><li>Evidencia opcional con advertencias de seguridad</li></ul>
          <Link className="landing-text-link" to="/register">Probar el reporte demo<ArrowRight size={16}/></Link>
        </Reveal>
        <Reveal className="landing-story-media" delay={0.08}><BrowserFrame src="/assets/presentation/report-preview.jpg" alt="Interfaz de reporte ciudadano de PULSE 911" label="pulse911.demo / reportar"/></Reveal>
      </section>

      <PhoneScrollScene/>

      <section id="command" className="landing-command-scene">
        <Reveal className="landing-command-frame"><BrowserFrame src="/assets/presentation/command-preview.jpg" alt="Centro de mando de PULSE 911 con incidentes, mapa y unidades" label="pulse911.demo / command"/></Reveal>
        <Reveal className="landing-command-copy" delay={0.08}>
          <h2>De la alerta a una decisión operativa trazable.</h2>
          <p>PULSE Command concentra la cola de incidentes, las unidades disponibles, el mapa y el historial del caso para que cada acción conserve contexto.</p>
          <div className="landing-command-stats"><div><b>P1</b><span>Prioridad visible</span></div><div><b>ETA</b><span>Comparación de recursos</span></div><div><b>360°</b><span>Contexto del incidente</span></div></div>
          <Link className="btn emergency" to="/login">Abrir PULSE Command<ArrowRight size={17}/></Link>
        </Reveal>
      </section>

      <section id="preparacion" className="landing-learning-section">
        <Reveal className="landing-section-heading"><h2>La respuesta empieza antes y continúa después.</h2><p>Capacitaciones breves, evaluaciones y recursos visuales acompañan a la comunidad en prevención, respuesta inicial y bienestar.</p></Reveal>
        <div className="landing-learning-grid">{courses.map(({image,icon:Icon,tag,title,text},index)=><Reveal key={title} className="landing-learning-card" delay={index*0.07}><div className="landing-learning-image"><img src={image} alt={`Imagen de ${title}`} loading="lazy" decoding="async"/><span>{tag}</span></div><div><Icon/><h3>{title}</h3><p>{text}</p><span className="landing-card-meta"><CheckCircle2/>Incluye microcapacitación</span></div></Reveal>)}</div>
        <Reveal className="landing-learning-cta"><Link className="btn primary" to="/login">Explorar cursos y recursos<ArrowRight size={17}/></Link></Reveal>
      </section>

      <section id="acceso" className="landing-final-cta">
        <Reveal><h2>Dos perspectivas. Un mismo pulso.</h2><p>Entra como ciudadano o como operador y recorre la simulación completa desde el reporte hasta la coordinación.</p><div><Link className="btn emergency" to="/register">Crear cuenta ciudadana</Link><Link className="btn ghost" to="/login">Entrar con cuenta demo<ArrowRight size={17}/></Link></div><small><LockKeyhole size={14}/>Entorno académico local. No contacta servicios 911 reales.</small></Reveal>
      </section>
    </main>

    <footer className="landing-v7-footer">
      <div className="landing-footer-main">
        <Brand light/>
        <span>Proyecto académico y demostrativo · PULSE 911</span>
        <Link to="/login">Acceder al sistema<ArrowRight size={14}/></Link>
      </div>
      <div className="landing-footer-bottom">
        <span>© 2026 PULSE 911 · Simulación académica</span>
        <div className="landing-footer-legal" aria-label="Información legal">
          <details>
            <summary>Términos y condiciones</summary>
            <div className="landing-footer-legal-card">
              <strong>Términos y condiciones</strong>
              <p>PULSE 911 es una simulación académica. La información, los incidentes y los tiempos mostrados son ficticios y no sustituyen a los servicios oficiales de emergencia.</p>
            </div>
          </details>
          <details>
            <summary>Privacidad</summary>
            <div className="landing-footer-legal-card">
              <strong>Privacidad</strong>
              <p>Esta demostración utiliza datos locales y simulados. Evita ingresar información personal, médica o sensible durante las pruebas.</p>
            </div>
          </details>
        </div>
      </div>
    </footer>
  </div>
}
