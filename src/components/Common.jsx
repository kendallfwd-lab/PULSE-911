import { AlertTriangle, CheckCircle2, Clock3, Info, MapPin, ShieldCheck, XCircle } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export const statusLabel = {
  received: 'Recibido', validating: 'Validando', validated: 'Validado', dispatched: 'Despachado', en_route: 'Unidades en ruta', on_scene: 'Unidades en sitio', transporting: 'Trasladando', at_hospital: 'En hospital', returning: 'Regresando a base', resolved: 'Resuelto', cancelled: 'Cancelado'
}

export function SimulationBanner({ dark = false }) {
  return <div className={`simulation-banner ${dark ? 'dark' : ''}`}><ThemeToggle compact /></div>
}

export function PageLoader() {
  return <div className="page-loader" role="status" aria-live="polite"><span/><strong>Cargando PULSE 911…</strong></div>
}


export function InlineNotice({ children, tone = 'info' }) {
  const Icon = tone === 'success' ? CheckCircle2 : tone === 'error' ? XCircle : tone === 'warning' ? AlertTriangle : Info
  return <div className={`inline-notice inline-notice-${tone}`} role={tone === 'error' ? 'alert' : 'status'}><Icon size={16}/><span>{children}</span></div>
}

export function Badge({ children, tone = 'blue' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

export function StatusBadge({ status }) {
  const tone = ['resolved'].includes(status) ? 'green' : ['cancelled'].includes(status) ? 'gray' : ['dispatched','en_route','arrived','on_scene','transporting','at_hospital','returning'].includes(status) ? 'amber' : 'blue'
  return <Badge tone={tone}>{statusLabel[status] || status}</Badge>
}

export function StatCard({ label, value, hint = '', icon: Icon = ShieldCheck, tone = 'blue' }) {
  return <div className={`stat-card stat-${tone}`}><div className="stat-icon"><Icon size={19} /></div><div><span>{label}</span><strong>{value}</strong>{hint && <small>{hint}</small>}</div></div>
}

export function EmptyState({ title, text }) {
  return <div className="empty"><ShieldCheck size={32} /><h3>{title}</h3><p>{text}</p></div>
}

export function IncidentMeta({ incident }) {
  return <div className="incident-meta"><span><MapPin size={14}/>{incident.location?.label}</span><span><Clock3 size={14}/>{new Date(incident.createdAt).toLocaleString('es-CR')}</span></div>
}
