import { AlertTriangle, Clock3, RefreshCw, Route, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import GeoMap from '../../components/GeoMap'
import { AccessibleMapList } from '../../components/AccessibleMapList'
import { TrafficImpactBadge } from '../../components/traffic/TrafficComponents'
import { usePulse } from '../../context/PulseContext'
import { formatDateTime, formatTime } from '../../utils/dateTime'

export default function TrafficMonitorPage() {
  const { db } = usePulse()
  const [updatedAt, setUpdatedAt] = useState(new Date())
  const [selected, setSelected] = useState(null)
  const affected = useMemo(() => db.roadStatus.filter(item => item.status !== 'normal'), [db.roadStatus])
  return <div className="admin-page traffic-monitor-page"><header className="admin-ai-header"><div><span><Route size={15}/>MONITOREO VIAL</span><h2>Movilidad y condiciones conocidas</h2><p>Integra datos PULSE; los proveedores externos son una mejora opcional y no bloquean esta vista.</p></div><button className="btn ghost" type="button" onClick={() => setUpdatedAt(new Date())}><RefreshCw size={15}/>Actualizar ahora</button></header><div className="traffic-monitor-stats"><article><Route/><span>Vías afectadas<strong>{affected.length}</strong></span></article><article><AlertTriangle/><span>Eventos locales<strong>{db.trafficEvents.length}</strong></span></article><article><Sparkles/><span>Sugerencias pendientes<strong>{db.aiSuggestions.filter(item => item.reviewStatus === 'pending').length}</strong></span></article><article><Clock3/><span>Actualizado<strong>{formatTime(updatedAt)}</strong></span></article></div><div className="traffic-monitor-layout"><section className="admin-panel traffic-monitor-map"><GeoMap incidents={db.incidents.filter(item => item.publicVisibility)} alerts={db.alerts} riskZones={db.riskZones} aiSuggestions={db.aiSuggestions} selectedId={selected?.id} onSelectIncident={setSelected} onSelectRiskZone={setSelected} onSelectAlert={setSelected} onSelectAiSuggestion={setSelected}/></section><aside className="admin-panel"><div className="panel-title"><Route/><h3>Estado por ruta</h3></div><div className="traffic-monitor-roads">{db.roadStatus.map(road => <button type="button" key={road.id} onClick={() => setSelected(road)}><span><strong>{road.route}</strong><small>{road.name} · {road.direction}</small></span><span><b>{road.status.replaceAll('_', ' ')}</b><small>{formatDateTime(road.lastUpdatedAt)}</small></span><TrafficImpactBadge impact={road.trafficImpact}/></button>)}</div></aside></div><AccessibleMapList incidents={db.incidents.filter(item => item.publicVisibility)} alerts={db.alerts} riskZones={db.riskZones} aiSuggestions={db.aiSuggestions} onSelect={setSelected}/></div>
}
