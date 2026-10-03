import { AlertTriangle, CheckCircle2, Clock3, Info, MapPin, MinusCircle, ShieldCheck, XCircle } from 'lucide-react'
import { AccessibilityControls } from './accessibility/AccessibilityControls'
import { useTranslation } from 'react-i18next'

export const statusLabel = {
  received: 'Recibido', validating: 'Validando', validated: 'Validado', dispatched: 'Despachado', en_route: 'Unidades en ruta', on_scene: 'Unidades en sitio', transporting: 'Trasladando', at_hospital: 'En hospital', returning: 'Regresando a base', resolved: 'Resuelto', cancelled: 'Cancelado'
}

export function SimulationBanner({ dark = false }) {
  return <div className={`simulation-banner ${dark ? 'dark' : ''}`}><div className="simulation-accessibility"><AccessibilityControls compact /></div></div>
}
const statusLabelEn = { received:'Received', validating:'Validating', validated:'Validated', dispatched:'Dispatched', en_route:'Units en route', on_scene:'Units on scene', transporting:'Transporting', at_hospital:'At hospital', returning:'Returning to base', resolved:'Resolved', cancelled:'Cancelled' }

export function PageLoader() {
  const {i18n}=useTranslation()
  return <div className="page-loader" role="status" aria-live="polite"><span/><strong>{i18n.language.startsWith('en')?'Loading PULSE 911…':'Cargando PULSE 911…'}</strong></div>
}


export function InlineNotice({ children, tone = 'info' }) {
  const Icon = tone === 'success' ? CheckCircle2 : tone === 'error' ? XCircle : tone === 'warning' ? AlertTriangle : Info
  return <div className={`inline-notice inline-notice-${tone}`} role={tone === 'error' ? 'alert' : 'status'}><Icon size={16}/><span>{children}</span></div>
}

export function Badge({ children, tone = 'blue' }) {
  const Icon = tone === 'green' ? CheckCircle2 : tone === 'red' ? XCircle : tone === 'amber' ? AlertTriangle : tone === 'gray' ? MinusCircle : Info
  return <span className={`badge badge-${tone}`}><Icon className="badge-symbol" size={12} aria-hidden="true"/><span>{children}</span></span>
}

export function StatusBadge({ status }) {
  const {i18n}=useTranslation()
  const tone = ['resolved'].includes(status) ? 'green' : ['cancelled'].includes(status) ? 'gray' : ['dispatched','en_route','arrived','on_scene','transporting','at_hospital','returning'].includes(status) ? 'amber' : 'blue'
  return <Badge tone={tone}>{(i18n.language.startsWith('en')?statusLabelEn:statusLabel)[status] || status}</Badge>
}

export function StatCard({ label, value, hint = '', icon: Icon = ShieldCheck, tone = 'blue' }) {
  return <div className={`stat-card stat-${tone}`}><div className="stat-icon"><Icon size={19} /></div><div><span>{label}</span><strong>{value}</strong>{hint && <small>{hint}</small>}</div></div>
}

export function EmptyState({ title, text }) {
  return <div className="empty"><ShieldCheck size={32} /><h3>{title}</h3><p>{text}</p></div>
}

export function IncidentMeta({ incident }) {
  const {i18n}=useTranslation()
  return <div className="incident-meta"><span><MapPin size={14}/>{incident.location?.label}</span><span><Clock3 size={14}/>{new Date(incident.createdAt).toLocaleString(i18n.language)}</span></div>
}
