import { useEffect } from 'react'
import { ArrowLeft, Home, LockKeyhole, LogIn, SearchX, ShieldX } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Brand } from '../components/Brand'
import { usePulse } from '../context/PulseContext'
import './StatusPages.css'

function StatusPage({ code, title, description, detail, icon: Icon, tone = 'not-found' }) {
  const { currentUser } = usePulse()
  const location = useLocation()
  const navigate = useNavigate()
  const dashboard = currentUser?.role === 'citizen' ? '/app' : currentUser ? '/command' : '/'
  const primaryLabel = currentUser ? 'Ir a mi panel' : code === '403' ? 'Iniciar sesión' : 'Ir al inicio'
  const primaryDestination = currentUser ? dashboard : code === '403' ? '/login' : '/'

  useEffect(() => {
    document.title = `${code} · ${title} — PULSE 911`
  }, [code, title])

  return <main className={`status-page status-page-${tone}`}>
    <header className="status-page-header"><Link to="/" aria-label="Ir al inicio de PULSE 911"><Brand light/></Link><span>Plataforma de demostración</span></header>
    <section className="status-card" role="alert" aria-labelledby={`status-title-${code}`} aria-describedby={`status-description-${code}`}>
      <div className="status-visual" aria-hidden="true">
        <span className="status-code-shadow">{code}</span>
        <span className="status-icon"><Icon/></span>
      </div>
      <div className="status-content">
        <span className="status-eyebrow"><LockKeyhole size={15}/>{code === '403' ? 'ACCESO RESTRINGIDO' : 'RUTA NO DISPONIBLE'}</span>
        <h1 id={`status-title-${code}`}>{code}</h1>
        <h2>{title}</h2>
        <p id={`status-description-${code}`}>{description}</p>
        {detail && <div className="status-notice"><ShieldX size={18}/><span>{detail}</span></div>}
        <div className="status-requested-path"><span>Dirección solicitada</span><code>{location.pathname}</code></div>
        <div className="status-actions">
          <Link className="btn primary" to={primaryDestination} state={code === '403' && !currentUser ? { from: location.pathname } : undefined}>{code === '403' && !currentUser ? <LogIn size={17}/> : <Home size={17}/>} {primaryLabel}</Link>
          <button type="button" className="btn ghost" onClick={() => navigate(-1)}><ArrowLeft size={17}/>Volver atrás</button>
        </div>
      </div>
    </section>
    <footer className="status-page-footer"><span>PULSE 911</span><span>Coordinación y respuesta · Entorno simulado</span></footer>
  </main>
}

export function AccessDeniedPage({ authenticationRequired = false }) {
  return <StatusPage
    code="403"
    title="Acceso denegado"
    description={authenticationRequired ? 'Esta página es privada. Debes iniciar sesión con una cuenta autorizada para continuar.' : 'Tu cuenta está activa, pero no tiene permisos para ingresar a esta sección.'}
    detail={authenticationRequired ? 'La dirección no se abrirá hasta que confirmes tu identidad.' : 'Regresa a tu panel o solicita acceso a una persona administradora.'}
    icon={ShieldX}
    tone="forbidden"
  />
}

export function NotFoundPage() {
  return <StatusPage
    code="404"
    title="Página no encontrada"
    description="La dirección que solicitaste no existe, fue movida o ya no está disponible dentro de PULSE 911."
    detail="Revisa la dirección o utiliza uno de los accesos disponibles para continuar."
    icon={SearchX}
  />
}
