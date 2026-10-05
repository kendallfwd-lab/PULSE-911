import { useState } from 'react'
import { AlertTriangle, Ambulance, BarChart3, BellRing, CheckCircle2, ChevronLeft, ChevronRight, LineChart as LineChartIcon, MapPin, PieChart, Radio, Send, ShieldAlert, TimerReset, Trash2 } from 'lucide-react'
import { usePulse } from '../../context/PulseContext'
import GeoMap from '../../components/GeoMap'
import { Badge, InlineNotice, StatCard } from '../../components/Common'
import { incidentImage } from '../../utils/incidentMedia'
import { compatibleUnits, requiredCapabilities } from '../../utils/dispatch'

export function DispatchPage(){
  const {db,dispatchUnit}=usePulse(); const pending=db.incidents.filter(i=>!['resolved','cancelled'].includes(i.status)); const [selected,setSelected]=useState(pending[0]?.id||''); const [notice,setNotice]=useState(null); const inc=db.incidents.find(i=>i.id===selected); const units=compatibleUnits(inc,db.units); const needs=inc?requiredCapabilities(inc.category):[]
  const assignedIds=[...new Set([...(inc?.assignedUnits||[]),inc?.assignedUnit].filter(Boolean))]; const assigned=db.units.filter(u=>assignedIds.includes(u.id)); const doDispatch=u=>{const result=dispatchUnit(inc.id,u.id);setNotice(result.ok?{tone:'success',text:`${u.id} fue despachada hacia ${inc.code}.`}:{tone:'error',text:result.message})}
  const baseName=unit=>db.hospitals.find(h=>h.id===unit.baseHospitalId)?.shortName||'Base operativa'
  return <div className="admin-page dispatch-page-v4"><div className="admin-toolbar admin-toolbar-compact"><select aria-label="Seleccionar incidente para despacho" value={selected} onChange={e=>setSelected(e.target.value)}><option value="">Seleccionar incidente</option>{pending.map(i=><option value={i.id} key={i.id}>{i.priority} · {i.code} · {i.title}</option>)}</select></div>{notice&&<InlineNotice tone={notice.tone}>{notice.text}</InlineNotice>}{inc?<><div className="dispatch-map-workspace"><section className="admin-panel dispatch-map-live"><GeoMap incidents={[inc]} units={db.units} riskZones={db.riskZones||[]} hospitals={db.hospitals||[]} selectedId={inc.id} initialCenter={inc.location} initialZoom={14}/></section><section className="admin-panel dispatch-side-v4"><div className="dispatch-case-media"><img src={incidentImage(inc)} alt={`Imagen del incidente ${inc.title}`}/><div><Badge tone={inc.priority==='P1'?'red':'amber'}>{inc.priority}</Badge><strong>{inc.title}</strong><span>{inc.location.label}</span><p>{inc.description}</p></div></div><div className="dispatch-need"><span>Capacidades buscadas:</span>{needs.map(n=><b key={n}>{n}</b>)}</div>{assigned.length>0&&<div className="assigned-list-v4"><h4>Unidades ya asignadas</h4>{assigned.map(u=><div key={u.id}><div><strong>{u.id}</strong><span>{u.type} · {u.status.replace('_',' ')}</span></div><b>{u.status==='en_route'?`${Math.max(1,Math.ceil((1-(u.mission?.progress||0))*(u.mission?.etaMin||u.eta)))} min`:'En sitio'}</b></div>)}</div>}<div className="recommend-list">{units.map((u,index)=><div key={u.id} className={index===0?'recommended-unit':''}><div><strong>{u.id} {index===0?<em>RECOMENDADA</em>:null}</strong><span>{u.distanceKm} km · ETA {u.eta} min</span><small>Desde {baseName(u)} · {u.compatibility.join(', ')}</small></div><button className="btn primary small" onClick={()=>doDispatch(u)}>Despachar</button></div>)}</div>{!units.length&&<p>No hay recursos compatibles disponibles.</p>}</section></div></>:<div className="empty-admin"><CheckCircle2/>Selecciona un incidente para abrir el despacho.</div>}</div>
}

export function PublicAlertsAdmin(){
  const {db,addAlert,updateAlert,deleteAlert}=usePulse()
  const empty={title:'',type:'road_hazard',severity:'warning',description:'',area:'',instructions:'',radiusM:400,location:null}
  const [form,setForm]=useState(empty),[selectedId,setSelectedId]=useState(null),[placing,setPlacing]=useState(false),[moving,setMoving]=useState(false),[notice,setNotice]=useState(null)
  const pick=a=>{setSelectedId(a.id);setForm({...a});setPlacing(false);setMoving(false);setNotice(null)}
  const save=e=>{e.preventDefault();if(!form.location){setNotice({tone:'error',text:'Selecciona primero una ubicación en el mapa.'});return} if(selectedId){updateAlert(selectedId,form);setNotice({tone:'success',text:'Alerta geográfica actualizada.'})}else{const a=addAlert(form);setSelectedId(a.id);setNotice({tone:'success',text:'Alerta publicada dentro de la simulación.'})} setMoving(false)}
  const fresh=()=>{setSelectedId(null);setForm(empty);setPlacing(true);setMoving(false);setNotice({tone:'info',text:'Haz clic en el mapa para ubicar la nueva alerta.'})}
  const mapClick=ll=>{if(placing||!form.location){setForm(v=>({...v,location:ll}));setPlacing(false);setNotice({tone:'success',text:'Ubicación fijada. Completa el contenido y publica la alerta.'})}}
  const mapAlerts=form.location&&!selectedId?[...db.alerts,{id:'alert-draft',...form,active:true}]:db.alerts
  return <div className="admin-page alerts-geo-v4"><div className="admin-toolbar admin-toolbar-compact"><button className="btn primary" onClick={fresh}><MapPin size={16}/>Nueva alerta en mapa</button></div>{notice&&<InlineNotice tone={notice.tone}>{notice.text}</InlineNotice>}<div className="geo-editor-workspace"><section className="admin-panel geo-editor-map"><div className="map-edit-banner">{placing?'Haz clic sobre el mapa para ubicar la nueva alerta':moving?'Arrastra el marcador seleccionado a su nueva ubicación':'Selecciona una alerta para editarla o crea una nueva'}</div><GeoMap alerts={mapAlerts} riskZones={db.riskZones||[]} incidents={db.incidents.filter(i=>!['resolved','cancelled'].includes(i.status))} selectedId={selectedId||'alert-draft'} onSelectAlert={a=>a.id!=='alert-draft'&&pick(a)} onMapClick={mapClick} draggableAlertId={moving?selectedId:null} onMoveAlert={(id,ll)=>{updateAlert(id,{location:ll});setForm(v=>({...v,location:ll}))}}/></section><form className="admin-panel alert-form geo-form-v4" onSubmit={save}><div className="panel-title"><BellRing/><h3>{selectedId?'Editar alerta':'Nueva alerta'}</h3></div><label>Título<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><div className="form-grid"><label>Tipo<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="road_hazard">Riesgo vial</option><option value="traffic_accident">Accidente</option><option value="weather">Clima</option><option value="fire">Incendio</option><option value="flood">Inundación</option><option value="security">Seguridad</option></select></label><label>Severidad<select value={form.severity} onChange={e=>setForm({...form,severity:e.target.value})}><option value="info">Información</option><option value="warning">Advertencia</option></select></label></div><label>Descripción<textarea required value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><label>Zona / referencia<input required value={form.area} onChange={e=>setForm({...form,area:e.target.value})}/></label><label>Radio de cobertura ({form.radiusM||400} m)<input type="range" min="100" max="1500" step="50" value={form.radiusM||400} onChange={e=>setForm({...form,radiusM:Number(e.target.value)})}/></label><label>Instrucciones<textarea required value={form.instructions} onChange={e=>setForm({...form,instructions:e.target.value})}/></label><div className="geo-coordinates"><span>Ubicación</span><strong>{form.location?`${form.location.lat.toFixed(5)}, ${form.location.lng.toFixed(5)}`:'Pendiente de seleccionar en mapa'}</strong></div><div className="geo-form-actions"><button className="btn primary"><Send size={17}/>{selectedId?'Guardar cambios':'Publicar alerta'}</button>{selectedId&&<button type="button" className="btn ghost" onClick={()=>setMoving(v=>!v)}>{moving?'Finalizar movimiento':'Mover en mapa'}</button>}{selectedId&&<button type="button" className="btn ghost danger" onClick={()=>{deleteAlert(selectedId);fresh();setNotice({tone:'success',text:'Alerta eliminada del escenario.'})}}><Trash2 size={15}/>Eliminar</button>}</div></form></div><section className="admin-panel"><div className="published-alerts">{db.alerts.filter(a=>a.active).map(a=><button type="button" key={a.id} onClick={()=>pick(a)}><AlertTriangle/><div><strong>{a.title}</strong><span>{a.area} · radio {a.radiusM||350} m</span></div><Badge tone={a.severity==='warning'?'amber':'blue'}>{a.severity}</Badge></button>)}</div></section></div>
}

function HorizontalBars({ items }) {
  const maximum = Math.max(1, ...items.map(item => item.value))
  return <div className="simple-chart">{items.map(item => <div className="chart-row" key={item.name}><span>{item.name}</span><div className="bar-track"><i style={{ width: `${Math.max(item.value ? 5 : 0, (item.value / maximum) * 100)}%` }}/></div><strong>{item.value}</strong></div>)}</div>
}

function ColumnChart({ items, highlight }) {
  const maximum = Math.max(1, ...items.map(item => item.value))
  return <div className="column-chart">{items.map(item => <div className={`column-item ${highlight === item.name ? 'highlight' : ''}`} key={item.name}><strong>{item.value}</strong><div><i style={{ height: `${Math.max(item.value ? 8 : 0, (item.value / maximum) * 100)}%` }}/></div><span>{item.name}</span></div>)}</div>
}

function TrendChart({ items }) {
  const width = 760, height = 230, padX = 38, padY = 26
  const maximum = Math.max(1, ...items.map(item => item.value))
  const points = items.map((item, index) => ({ ...item, x: padX + index * ((width - padX * 2) / Math.max(1, items.length - 1)), y: height - padY - (item.value / maximum) * (height - padY * 2) }))
  const path = points.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ')
  const area = `${path} L ${points.at(-1)?.x || padX} ${height - padY} L ${padX} ${height - padY} Z`
  return <div className="trend-chart"><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Gráfica de tendencia"><defs><linearGradient id="analyticsArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2586d7" stopOpacity=".38"/><stop offset="1" stopColor="#2586d7" stopOpacity=".03"/></linearGradient></defs><path className="trend-area" d={area}/><path className="trend-line" d={path}/>{points.map(point => <g key={point.name}><circle cx={point.x} cy={point.y} r="5"/><text className="trend-value" x={point.x} y={point.y - 12}>{point.value}</text><text className="trend-label" x={point.x} y={height - 7}>{point.name}</text></g>)}</svg></div>
}

function DonutChart({ items }) {
  const palette = ['#1976d2', '#ef5350', '#e49b0f', '#2e7d32', '#7e57c2', '#26a69a', '#78909c']
  const total = Math.max(1, items.reduce((sum, item) => sum + item.value, 0))
  let cursor = 0
  const stops = items.map((item, index) => { const start = cursor; cursor += item.value / total * 100; return `${palette[index % palette.length]} ${start}% ${cursor}%` }).join(', ')
  return <div className="donut-layout"><div className="donut" style={{ background: `conic-gradient(${stops || '#dce5eb 0 100%'})` }}><div><strong>{items.reduce((sum, item) => sum + item.value, 0)}</strong><span>Total</span></div></div><div className="donut-legend">{items.map((item, index) => <div key={item.name}><i style={{ background: palette[index % palette.length] }}/><span>{item.name}</span><strong>{item.value}</strong></div>)}</div></div>
}

export function AnalyticsPage(){
  const {db}=usePulse()
  const [period,setPeriod]=useState('30')
  const [slide,setSlide]=useState(0)
  const cutoff=Date.now()-Number(period)*86400000
  const incidents=db.incidents.filter(i=>new Date(i.createdAt).getTime()>=cutoff)
  const active=incidents.filter(i=>!['resolved','cancelled'].includes(i.status)).length
  const resolved=incidents.filter(i=>i.status==='resolved'||i.status==='at_hospital').length
  const avgResponse=incidents.length?Math.round(incidents.reduce((sum,i)=>{const d=(i.timeline||[]).find(t=>['en_route','on_scene'].includes(t.status));return sum+(d?Math.max(2,(new Date(d.at)-new Date(i.createdAt))/60000):7)},0)/incidents.length):0
  const categories=['traffic_accident','medical','fire','road_hazard','flood','security','other']
  const labels={traffic_accident:'Accidentes',medical:'Médicas',fire:'Incendios',road_hazard:'Riesgo vial',flood:'Inundación',security:'Seguridad',other:'Otros'}
  const categoryData=categories.map(cat=>({name:labels[cat],value:incidents.filter(i=>i.category===cat).length}))
  const hotspots=(db.riskZones||[]).map(z=>({name:z.title||z.name||'Zona registrada',value:z.reports||0})).sort((a,b)=>b.value-a.value).slice(0,5)
  const available=db.units.filter(u=>u.status==='available').length
  const confirmations=incidents.reduce((sum,item)=>sum+Number(item.confirmationCount||0),0)
  const rejected=(db.publications||[]).filter(item=>item.status==='rejected').length
  const approvedAI=(db.aiSuggestions||[]).filter(item=>item.reviewStatus==='approved').length
  const rejectedAI=(db.aiSuggestions||[]).filter(item=>item.reviewStatus==='rejected').length
  const byProvince=['San José','Alajuela','Cartago','Heredia','Guanacaste','Puntarenas','Limón'].map(name=>({name,value:incidents.filter(item=>item.location?.province===name||item.location?.label?.includes(name)).length}))
  const byRoute=(db.roadStatus||[]).map(road=>({name:road.route,value:road.incidentCount||0})).slice(0,7)
  const byHour=[['00–05',0,5],['06–11',6,11],['12–17',12,17],['18–23',18,23]].map(([name,start,end])=>({name,value:incidents.filter(item=>{const hour=new Date(item.createdAt).getHours();return hour>=start&&hour<=end}).length}))
  const byStatus=[['Activos',active],['Resueltos',resolved],['Cancelados',incidents.filter(item=>item.status==='cancelled').length]].map(([name,value])=>({name,value}))
  const byPriority=['P1','P2','P3'].map(name=>({name,value:incidents.filter(item=>item.priority===name).length}))
  const monthlyFatalities=[['Ene',22],['Feb',18],['Mar',25],['Abr',21],['May',27],['Jun',24],['Jul',29],['Ago',31],['Sep',26],['Oct',34],['Nov',28],['Dic',32]].map(([name,value])=>({name,value}))
  const highestFatalityMonth=monthlyFatalities.reduce((highest,item)=>item.value>highest.value?item:highest,monthlyFatalities[0])
  const slides=[
    {title:'Incidentes por categoría',subtitle:'Comparación horizontal de los tipos de emergencia',icon:BarChart3,content:<HorizontalBars items={categoryData}/>},
    {title:'Incidentes por provincia',subtitle:'Vista en columnas de la distribución territorial',icon:BarChart3,content:<ColumnChart items={byProvince}/>},
    {title:'Incidentes por horario',subtitle:'Tendencia de reportes según bloque horario',icon:LineChartIcon,content:<TrendChart items={byHour}/>},
    {title:'Incidentes por ruta',subtitle:'Participación de eventos en las rutas monitoreadas',icon:PieChart,content:<DonutChart items={byRoute}/>},
    {title:'Puntos de mayor recurrencia',subtitle:'Zonas con mayor concentración histórica de reportes',icon:ShieldAlert,content:<div className="hotspot-list analytics-hotspots">{hotspots.map((item,index)=><div key={item.name}><b>{String(index+1).padStart(2,'0')}</b><div><strong>{item.name}</strong><span>Concentración de reportes</span></div><em>{item.value}</em></div>)}{!hotspots.length&&<p>No hay zonas registradas.</p>}</div>},
    {title:'Fallecimientos por mes',subtitle:`Escenario demostrativo anual · mayor valor: ${highestFatalityMonth.name} (${highestFatalityMonth.value})`,icon:LineChartIcon,demo:true,content:<ColumnChart items={monthlyFatalities} highlight={highestFatalityMonth.name}/>},
    {title:'Estado de los incidentes',subtitle:'Proporción entre casos activos, resueltos y cancelados',icon:PieChart,content:<DonutChart items={byStatus}/>},
    {title:'Prioridad operativa',subtitle:'Distribución de los incidentes por nivel de respuesta',icon:BarChart3,content:<HorizontalBars items={byPriority}/>},
  ]
  const move=direction=>setSlide(current=>(current+direction+slides.length)%slides.length)
  const current=slides[slide]
  const CurrentIcon=current.icon
  return <div className="admin-page analytics-v5">
    <div className="admin-toolbar admin-toolbar-compact analytics-toolbar"><div><strong>Panel visual</strong><span>{slides.length} vistas disponibles</span></div><select aria-label="Seleccionar período de análisis" value={period} onChange={e=>setPeriod(e.target.value)}><option value="7">Últimos 7 días</option><option value="30">Últimos 30 días</option><option value="90">Últimos 90 días</option></select></div>
    <div className="admin-stats"><StatCard label="Incidentes del período" value={incidents.length} icon={Radio}/><StatCard label="Activos" value={active} icon={AlertTriangle} tone="red"/><StatCard label="Resueltos / hospital" value={resolved} icon={CheckCircle2} tone="green"/><StatCard label="Respuesta promedio" value={`${avgResponse} min`} icon={TimerReset} tone="amber"/><StatCard label="Unidades disponibles" value={available} icon={Ambulance} tone="blue"/></div>
    <section className="admin-panel analytics-carousel" aria-roledescription="carrusel" aria-label="Gráficas operativas" onKeyDown={event=>{if(event.key==='ArrowLeft')move(-1);if(event.key==='ArrowRight')move(1)}} tabIndex="0">
      <header className="analytics-carousel-head"><div className="analytics-slide-title"><span><CurrentIcon/></span><div><small>GRÁFICA {slide+1} DE {slides.length}</small><h3>{current.title}</h3><p>{current.subtitle}</p></div></div><div className="analytics-carousel-actions"><button type="button" onClick={()=>move(-1)} aria-label="Gráfica anterior"><ChevronLeft/></button><button type="button" onClick={()=>move(1)} aria-label="Gráfica siguiente"><ChevronRight/></button></div></header>
      <div className="analytics-slide" aria-live="polite">{current.demo&&<span className="demo-data-chip">DATOS SIMULADOS, NO OFICIALES</span>}{current.content}</div>
      <footer className="analytics-carousel-footer"><button type="button" onClick={()=>move(-1)}><ChevronLeft size={16}/>Anterior</button><div className="analytics-dots">{slides.map((item,index)=><button type="button" className={index===slide?'active':''} key={item.title} onClick={()=>setSlide(index)} aria-label={`Mostrar ${item.title}`} aria-current={index===slide?'true':undefined}/>)}</div><button type="button" onClick={()=>move(1)}>Siguiente<ChevronRight size={16}/></button></footer>
    </section>
    <section className="admin-panel"><div className="panel-title"><TimerReset/><h3>Indicadores de respuesta y confianza</h3></div><div className="kpi-grid"><div><span>Tiempo medio de respuesta</span><strong>{avgResponse} min</strong><small>Estimación basada en el timeline</small></div><div><span>Confirmaciones ciudadanas</span><strong>{confirmations}</strong><small>Respuestas recientes registradas</small></div><div><span>Reportes rechazados</span><strong>{rejected}</strong><small>Publicaciones moderadas</small></div><div><span>Sugerencias IA</span><strong>{approvedAI}/{rejectedAI}</strong><small>Aprobadas / rechazadas</small></div></div></section>
    <div className="analytics-note"><AlertTriangle/><p>Los datos de esta demostración, incluida la mortalidad mensual, son ficticios y no representan estadísticas oficiales de Costa Rica.</p></div>
  </div>
}
