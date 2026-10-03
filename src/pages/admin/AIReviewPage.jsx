import { Check, Edit3, MapPin, ShieldAlert, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import GeoMap from '../../components/GeoMap'
import { InlineNotice } from '../../components/Common'
import { usePulse } from '../../context/PulseContext'
import { formatDateTime } from '../../utils/dateTime'

export default function AIReviewPage() {
  const { db, updateAiSuggestion, addRiskZone, addAlert, addIncident } = usePulse()
  const [selectedId, setSelectedId] = useState(db.aiSuggestions?.[0]?.id || null)
  const [editing, setEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState('')
  const [notice, setNotice] = useState(null)
  const selected = db.aiSuggestions.find(item => item.id === selectedId)
  const choose = item => { setSelectedId(item.id); setDraftTitle(item.title); setEditing(false) }
  const saveEdit = () => { if (!selected || !draftTitle.trim()) return; updateAiSuggestion(selected.id, { title: draftTitle.trim() }); setEditing(false); setNotice({ tone: 'success', text: 'Borrador actualizado.' }) }
  const approve = () => {
    if (!selected) return
    if (selected.type === 'risk_zone') addRiskZone({ name: selected.title, title: selected.title, description: selected.description, location: selected.location, severity: selected.confidence >= 80 ? 'high' : 'medium', radiusM: 450, reports: selected.sourceIds?.length || 1, source: 'ai_reviewed' })
    else if (selected.type === 'alert') addAlert({ title: selected.title, description: selected.description, location: selected.location, severity: 'warning', instructions: 'Verifique las condiciones y siga indicaciones oficiales.', source: 'ai_reviewed' })
    else if (selected.type === 'incident') addIncident({ category: selected.category || 'road_hazard', title: selected.title, description: selected.description, location: selected.location, priority: 'P2', publicVisibility: false, details: { source: 'ai_reviewed' } })
    updateAiSuggestion(selected.id, { reviewStatus: 'approved' }); setNotice({ tone: 'success', text: 'Sugerencia aprobada y convertida usando la lógica existente de PULSE.' })
  }
  const reject = () => { if (!selected) return; updateAiSuggestion(selected.id, { reviewStatus: 'rejected' }); setNotice({ tone: 'warning', text: 'Sugerencia rechazada. No se publicó información oficial.' }) }
  return <div className="admin-page ai-review-page"><header className="admin-ai-header"><div><span><Sparkles size={15}/>REVISIÓN HUMANA OBLIGATORIA</span><h2>Bandeja de revisión IA</h2><p>Examina motivo, fuentes y datos utilizados antes de ejecutar una acción.</p></div><strong>{db.aiSuggestions.filter(item => item.reviewStatus === 'pending').length} pendientes</strong></header>{notice && <InlineNotice tone={notice.tone}>{notice.text}</InlineNotice>}<div className="ai-review-layout"><aside className="ai-review-list">{db.aiSuggestions.map(item => <button type="button" key={item.id} className={selectedId === item.id ? 'active' : ''} onClick={() => choose(item)}><Sparkles size={16}/><span><strong>{item.title}</strong><small>{item.type.replaceAll('_', ' ')} · {item.confidence}%</small></span><b className={`review-${item.reviewStatus}`}>{item.reviewStatus}</b></button>)}</aside><main>{selected ? <><section className="admin-panel ai-review-detail"><div className="panel-title"><ShieldAlert/><h3>{selected.title}</h3><span>{selected.confidence}% confianza</span></div>{editing ? <div className="ai-edit-row"><input aria-label="Título editado" value={draftTitle} onChange={event => setDraftTitle(event.target.value)}/><button className="btn primary small" onClick={saveEdit}>Guardar</button></div> : null}<p>{selected.description}</p><dl><div><dt>Motivo</dt><dd>{selected.reason}</dd></div><div><dt>Fuentes</dt><dd>{selected.sourceIds?.join(', ') || 'Sin identificadores'}</dd></div><div><dt>Ubicación</dt><dd>{selected.location?.label}</dd></div><div><dt>Creada</dt><dd>{formatDateTime(selected.createdAt)}</dd></div><div><dt>Datos utilizados</dt><dd>Reportes cercanos, ventana temporal y ubicación general.</dd></div></dl><div className="ai-review-actions"><button className="btn primary" onClick={approve} disabled={selected.reviewStatus !== 'pending'}><Check size={16}/>Aprobar</button><button className="btn ghost" onClick={() => { setEditing(true); setDraftTitle(selected.title) }}><Edit3 size={16}/>Editar</button><button className="btn ghost danger" onClick={reject} disabled={selected.reviewStatus !== 'pending'}><X size={16}/>Rechazar</button></div></section><section className="admin-panel ai-review-map"><div className="panel-title"><MapPin/><h3>Ver en mapa</h3></div><GeoMap compact aiSuggestions={[selected]} selectedId={selected.id} initialCenter={selected.location} initialZoom={15}/></section></> : <section className="feature-empty"><Sparkles/><h2>Selecciona una sugerencia</h2></section>}</main></div></div>
}
