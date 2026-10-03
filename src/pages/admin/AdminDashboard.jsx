import { useMemo, useState } from 'react'
import { AlertTriangle, Ambulance, CheckCircle2, Clock3, Gauge, Pause, Play, Radar, Siren, TimerReset } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePulse } from '../../context/PulseContext'
import GeoMap from '../../components/GeoMap'
import { InlineNotice, StatCard, StatusBadge } from '../../components/Common'
import { compatibleUnits } from '../../utils/dispatch'
import { formatTime } from '../../utils/dateTime'

export default function AdminDashboard(){
  const {db,dispatchUnit,simulationSpeed,setSimulationSpeed,simulationPaused,setSimulationPaused}=usePulse()
  const active=db.incidents.filter(i=>!['resolved','cancelled'].includes(i.status))
  const p1=active.filter(i=>i.priority==='P1').length
  const avail=db.units.filter(u=>u.status==='available').length
  const [selectedId,setSelectedId]=useState(active[0]?.id||null)
  const [actionNotice,setActionNotice]=useState(null)
  const selected=active.find(i=>i.id===selectedId)||active[0]
  const recommended=useMemo(()=>compatibleUnits(selected,db.units).slice(0,4),[selected,db.units])
  const logs=(db.activityLogs||[]).slice().sort((a,b)=>new Date(b.at)-new Date(a.at)).slice(0,8)
  const assignedIds=[...new Set([...(selected?.assignedUnits||[]),selected?.assignedUnit].filter(Boolean))]
  const assigned=db.units.filter(u=>assignedIds.includes(u.id))
  const focusLocations=selected?[selected.location,...assigned.map(u=>u.location).filter(Boolean)]:[]
  const baseName=unit=>db.hospitals.find(h=>h.id===unit.baseHospitalId)?.shortName||'base operativa'
  const doDispatch=u=>{const result=dispatchUnit(selected.id,u.id);setActionNotice(result.ok?{tone:'success',text:`${u.id} despachada hacia ${selected.code}.`}:{tone:'error',text:result.message})}

  return <div className="admin-page command-dashboard-v4">
    <div className="admin-stats"><StatCard label="Incidentes activos" value={active.length} icon={Siren}/><StatCard label="Prioridad P1" value={p1} icon={AlertTriangle} tone="red"/><StatCard label="Unidades disponibles" value={`${avail}/${db.units.length}`} icon={Ambulance} tone="green"/><StatCard label="Simulación" value={`${simulationSpeed}x`} icon={TimerReset} tone="amber"/></div>

    <div className="command-status-strip"><span><i/>Centro de mando operativo</span><span><Radar size={15}/>Mapa geográfico interactivo</span><span><Clock3 size={15}/>{active.length} casos monitoreados</span><div className="simulation-controls"><button type="button" onClick={()=>setSimulationPaused(!simulationPaused)}>{simulationPaused?<Play size={14}/>:<Pause size={14}/>} {simulationPaused?'Reanudar':'Pausar'}</button><select value={simulationSpeed} onChange={e=>setSimulationSpeed(Number(e.target.value))}>{[1,2,4,8].map(x=><option value={x} key={x}>{x}x</option>)}</select></div></div>

    {actionNotice&&<InlineNotice tone={actionNotice.tone}>{actionNotice.text}</InlineNotice>}
    <div className="command-cockpit-v4">
      <aside className="incident-queue-v4 admin-panel"><div className="panel-title"><Radar/><h3>Incidentes en curso</h3><span>{active.length}</span></div><div className="queue-scroll">{active.map(i=><button type="button" key={i.id} className={`queue-item-v4 ${selected?.id===i.id?'active':''}`} onClick={()=>setSelectedId(i.id)}><b className={`priority-chip ${i.priority.toLowerCase()}`}>{i.priority}</b><div><strong>{i.code}</strong><span>{i.title}</span><small>{i.location.label}</small></div><StatusBadge status={i.status}/></button>)}</div></aside>

      <section className="command-map-v4 admin-panel"><div className="command-map-head"><div><span>MAPA OPERATIVO EN VIVO</span><strong>Incidentes, unidades móviles, rutas, zonas de riesgo y alertas geográficas</strong></div><span className="live-tag"><i/>Telemetría simulada</span></div><GeoMap incidents={active} units={db.units} alerts={db.alerts} riskZones={db.riskZones||[]} hospitals={db.hospitals||[]} historicalIncidents={db.historicalIncidents||[]} selectedId={selected?.id} onSelectIncident={i=>setSelectedId(i.id)} focusLocations={focusLocations} focusKey={`incident-${selected?.id||'none'}`} initialCenter={selected?.location} initialZoom={14}/></section>

      <aside className="incident-command-panel admin-panel">{selected?<><div className="incident-panel-head"><div><span>{selected.code}</span><h2>{selected.title}</h2><p>{selected.location.label}</p></div><b className={`priority-chip ${selected.priority.toLowerCase()}`}>{selected.priority}</b></div><div className="incident-panel-status"><StatusBadge status={selected.status}/><span>Riesgo {selected.riskScore||'—'}/100</span></div><div className="risk-reason-strip">{(selected.riskReasons||[]).slice(0,3).map(reason=><span key={reason}>+ {reason}</span>)}</div><p className="incident-summary">{selected.description}</p><div className="incident-mini-data"><div><span>Heridos</span><strong>{selected.details?.injured??'—'}</strong></div><div><span>Atrapados</span><strong>{selected.details?.trapped??'—'}</strong></div><div><span>Vía</span><strong>{selected.details?.roadBlocked??'—'}</strong></div><div><span>Unidades</span><strong>{assignedIds.length}</strong></div></div><div className="dispatch-side-block"><div className="dispatch-side-heading"><div><span>DESPACHO RÁPIDO</span><h4>Recursos para este incidente</h4></div><b>{assigned.length} asignada(s)</b></div>{assigned.length>0&&<div className="assigned-units-mini">{assigned.map(u=><div key={u.id}><Ambulance size={15}/><div><strong>{u.id}</strong><span>{u.type} · {u.status.replaceAll('_',' ')}</span></div><span>{u.status==='en_route'?`${Math.max(0,Math.ceil((1-(u.mission?.progress||0))*(u.mission?.etaMin||u.eta)))} min`:'En sitio'}</span></div>)}</div>}{recommended.length>0?<div className="recommend-mini"><h4>{assigned.length?'Agregar otra unidad':'Unidades recomendadas'}</h4>{recommended.slice(0,3).map((u,idx)=><div key={u.id}><div><strong>{u.id}{idx===0?<em> recomendada</em>:null}</strong><span>{u.distanceKm} km · {u.eta} min · desde {baseName(u)}</span></div><button className="btn primary small" onClick={()=>doDispatch(u)}>Despachar</button></div>)}</div>:<div className="dispatch-empty"><Ambulance size={18}/><span>No hay otra unidad compatible y disponible en este momento.</span></div>}</div><Link className="btn ghost full" to={`/command/incidents/${selected.id}`}>Abrir ficha operativa</Link></>:<div className="empty-admin">Sin incidente seleccionado</div>}</aside>
    </div>

    <div className="command-shortcuts"><Link className="shortcut-card" to="/command/scenarios"><Siren/><div><strong>Cargar escenario</strong><span>Preparar una demostración completa</span></div></Link><Link className="shortcut-card" to="/command/units"><Ambulance/><div><strong>Ver recursos</strong><span>Estado de todas las unidades</span></div></Link><Link className="shortcut-card" to="/command/analytics"><Gauge/><div><strong>Inteligencia territorial</strong><span>Analizar respuesta y recurrencia</span></div></Link></div><div className="admin-bottom-grid"><section className="admin-panel"><div className="panel-title"><Ambulance/><h3>Estado de recursos</h3></div><div className="unit-table v4">{db.units.map(u=><div key={u.id}><strong>{u.id}</strong><span>{u.type}</span><span>{u.assignedIncident||baseName(u)}</span><span className={`unit-status ${u.status}`}>{u.status.replace('_',' ')}</span></div>)}</div></section><section className="admin-panel"><div className="panel-title"><Gauge/><h3>Actividad operacional</h3></div><div className="activity-list">{logs.map(x=><div key={x.id}><CheckCircle2/><div><strong>{x.label}</strong><span>{formatTime(x.at)}</span></div></div>)}</div></section></div>
  </div>
}
