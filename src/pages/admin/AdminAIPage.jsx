import { AlertTriangle, Bot, Copy, MapPinned, Radio, RefreshCw, ShieldAlert, Sparkles, Waypoints } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAI } from '../../ai/AIContext'
import { AIStatusIndicator } from '../../components/ai/AIStatusIndicator'
import { Badge } from '../../components/Common'
import { usePulse } from '../../context/PulseContext'
import { analyzeRiskClusters } from '../../services/adminAIService'
import { findDuplicateCandidates } from '../../utils/incidentEngine'
import { formatTime } from '../../utils/dateTime'

export default function AdminAIPage() {
  const { db, addAiSuggestion } = usePulse()
  const { status } = useAI()
  const [analyzing, setAnalyzing] = useState(false)
  const [lastAnalysis, setLastAnalysis] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const pending = db.aiSuggestions.filter(item => item.reviewStatus === 'pending')
  const duplicateGroups = useMemo(
    () => db.incidents
      .map(incident => ({ incident, matches: findDuplicateCandidates(incident, db.incidents.filter(item => item.id !== incident.id)) }))
      .filter(group => group.matches.length),
    [db.incidents],
  )

  const analyze = async () => {
    setAnalyzing(true)
    try {
      const result = await analyzeRiskClusters(db, { remote: status === 'online' })
      result.suggestions.forEach(addAiSuggestion)
      setAnalysisResult(`${result.suggestions.length} sugerencia(s) · ${result.provider === 'n8n' ? 'n8n' : 'motor local'}`)
      setLastAnalysis(new Date())
    } finally {
      setAnalyzing(false)
    }
  }

  const widgets = [
    [Sparkles, 'Sugerencias geográficas', pending.filter(item => item.type === 'risk_zone').length, 'Violeta · revisión humana obligatoria'],
    [Copy, 'Reportes posiblemente duplicados', duplicateGroups.length, 'Coincidencias estructuradas locales'],
    [ShieldAlert, 'Zonas emergentes', pending.filter(item => item.type === 'risk_zone').length, 'No son oficiales hasta aprobarse'],
    [AlertTriangle, 'Borradores de alertas', pending.filter(item => item.type === 'alert').length, 'Pendientes de validación'],
    [MapPinned, 'Borradores de publicaciones', pending.filter(item => item.type === 'publication').length, 'Contenido no publicado'],
    [Radio, 'Automatizaciones', status === 'online' ? 'Activas' : 'Local', status === 'online' ? 'n8n conectado' : 'Fallback local disponible'],
  ]

  return <div className="admin-page admin-ai-page">
    <header className="admin-ai-header">
      <div><span><Bot size={15}/>CENTRO DE APOYO AUTOMATIZADO</span><h2>Centro IA</h2><p>Sugerencias explicables para revisión humana. Ningún resultado se vuelve oficial automáticamente.</p></div>
      <AIStatusIndicator/>
    </header>
    <section className="admin-ai-actions">
      <button className="btn primary" type="button" onClick={analyze} disabled={analyzing}><RefreshCw className={analyzing ? 'spin' : ''} size={16}/>{analyzing ? 'Analizando reportes…' : 'Analizar nuevos reportes'}</button>
      <Link className="btn ghost" to="/command/ai-review">Abrir bandeja de revisión</Link>
      {lastAnalysis && <span>{analysisResult} · {formatTime(lastAnalysis)}</span>}
    </section>
    <section className="admin-ai-grid">
      {widgets.map(([Icon, title, value, hint]) => <article key={title}><i><Icon size={20}/></i><div><span>{title}</span><strong>{value}</strong><small>{hint}</small></div></article>)}
    </section>
    <section className="admin-panel admin-ai-explainer">
      <div className="panel-title"><Waypoints/><h3>Flujo de control</h3><Badge tone="blue">HUMANO EN EL CICLO</Badge></div>
      <ol><li>Los reportes se comparan con datos estructurados cercanos.</li><li>El sistema prepara una sugerencia con confianza, motivo y fuentes.</li><li>Una persona revisa, edita, aprueba o rechaza.</li><li>Solo al aprobar se reutilizan las funciones oficiales de PULSE.</li></ol>
    </section>
  </div>
}
