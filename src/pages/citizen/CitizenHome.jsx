import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Ambulance, Bookmark, CheckCircle2, Clock3, Heart, HeartHandshake, MapPin, MessageCircle, Navigation, Share2, ShieldCheck, Siren } from 'lucide-react'
import { usePulse } from '../../context/PulseContext'
import { Badge, StatusBadge } from '../../components/Common'
import GeoMap from '../../components/GeoMap'
import { incidentImage } from '../../utils/incidentMedia'

const statusCopy = {
  received:'Reporte recibido',
  triaged:'Evaluación operativa',
  dispatched:'Unidades en camino',
  on_scene:'Personal en sitio',
  transporting:'Traslado en curso',
  resolved:'Incidente resuelto'
}

const simulatedAddresses = [
  'Av. Central y Calle 8, El Roble',
  'Ruta 23, entrada a Barranca',
  'Paseo de los Turistas, sector oeste',
  'Costanera Sur, frente al parque industrial',
  'Calle 14 y Avenida de los Insurgentes'
]

function simulatedDetails(incident){
  const seed=String(incident.id||incident.code||'pulse').split('').reduce((sum,char)=>sum+char.charCodeAt(0),0)
  const original=incident.location?.label||''
  const address=!original||/dispositivo|seleccionado|navegador|mapa/i.test(original)?simulatedAddresses[seed%simulatedAddresses.length]:original
  const details={
    traffic_accident:['Colisión entre vehículos','3 personas','Tránsito parcial'],
    medical:['Atención médica prioritaria','1 paciente','Acceso despejado'],
    fire:['Incendio estructural','2 personas evacuadas','Humo visible'],
    flood:['Anegamiento vial','Sin lesionados','Paso restringido'],
    security:['Incidente de seguridad','Evaluación en curso','Zona asegurada']
  }[incident.category]||['Emergencia ciudadana','Evaluación inicial','Respuesta coordinada']
  return {address,event:details[0],people:details[1],condition:details[2]}
}

export default function CitizenHome(){
  const {db,currentUser}=usePulse(); const [saved,setSaved]=useState([]); const [useful,setUseful]=useState([]); const [safe,setSafe]=useState(false); const [copied,setCopied]=useState(false)
  const mine=db.incidents.filter(i=>i.citizenId===currentUser.id); const active=mine.find(i=>!['resolved','cancelled'].includes(i.status))
  const feed=useMemo(()=>db.incidents.filter(i=>i.publicVisibility || i.citizenId===currentUser.id).slice(0,8),[db.incidents,currentUser.id])
  const toggleSave=id=>setSaved(value=>value.includes(id)?value.filter(item=>item!==id):[...value,id])
  const toggleUseful=id=>setUseful(value=>value.includes(id)?value.filter(item=>item!==id):[...value,id])
  const copyCode=async code=>{try{await navigator.clipboard?.writeText(code);setCopied(true);setTimeout(()=>setCopied(false),1400)}catch{setCopied(false)}}

  return <div className="operations-publication-feed">
    {active&&<IncidentPublication incident={active} units={db.units} primary isMine saved={saved.includes(active.id)} safe={safe} copied={copied} onSave={()=>toggleSave(active.id)} onSafe={()=>setSafe(value=>!value)} onShare={()=>copyCode(active.code)}/>}

    {feed.filter(incident=>incident.id!==active?.id).map(incident=><IncidentPublication key={incident.id} incident={incident} units={db.units} isMine={incident.citizenId===currentUser.id} saved={saved.includes(incident.id)} useful={useful.includes(incident.id)} onSave={()=>toggleSave(incident.id)} onUseful={()=>toggleUseful(incident.id)}/>)}

    <SupportPublication/>
  </div>
}

function IncidentPublication({incident,units,primary=false,isMine=false,saved=false,useful=false,safe=false,copied=false,onSave,onUseful,onSafe,onShare}){
  const assignedIds=[...new Set([...(incident.assignedUnits||[]),incident.assignedUnit].filter(Boolean))]
  const assignedUnits=assignedIds.map(id=>units.find(unit=>unit.id===id)||{id,type:'Unidad asignada',status:'dispatched'}).slice(0,4)
  const detailUrl=isMine?`/app/incidents/${incident.id}`:'/app/map'
  const created=new Date(incident.createdAt).toLocaleString('es-CR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})
  const eta=incident.eta?`${incident.eta} min`:'En cálculo'
  const simulated=simulatedDetails(incident)
  const timeline=[
    ['red','Incidente reportado',created],
    ['blue',assignedIds.length?'Unidades asignadas':'Reporte en validación',assignedIds.length?`${assignedIds.length} recurso(s) coordinados`:'Verificación inicial'],
    ['blue',statusCopy[incident.status]||'Atención coordinada',incident.description],
    ['gray','Seguimiento activo',`Prioridad ${incident.priority} · ${incident.code}`]
  ]

  return <article className={`incident-publication ${primary?'primary':''}`}>
    <div className="incident-publication-main">
      <Link className="publication-hero-media" to={detailUrl}><img src={incidentImage(incident)} alt={`Atención de ${incident.title}`}/><span><Ambulance size={14}/>{assignedIds[0]||incident.code}</span></Link>
      <section className="publication-summary">
        <div className="publication-badges"><Badge tone={incident.priority==='P1'?'red':'amber'}>{incident.priority==='P1'?'PRIORIDAD ALTA':`PRIORIDAD ${incident.priority}`}</Badge><StatusBadge status={incident.status}/>{primary&&<Badge tone="blue">EN ATENCIÓN</Badge>}</div>
        <h2>{incident.title}</h2>
        <div className="publication-address"><MapPin size={21}/><div><strong>{simulated.address}</strong><span>{incident.code} · Ubicación simulada para la demostración</span></div></div>
        <div className="publication-simulated-info"><div><span>Evento</span><strong>{simulated.event}</strong></div><div><span>Personas</span><strong>{simulated.people}</strong></div><div><span>Condición</span><strong>{simulated.condition}</strong></div></div>
        <div className="publication-eta"><Clock3 size={28}/><div><span>Tiempo estimado de respuesta</span><strong>{eta}</strong></div></div>
        <div className="publication-actions">
          {primary?<><button className={safe?'active':''} onClick={onSafe}><ShieldCheck size={17}/>{safe?'Estado seguro':'Estoy a salvo'}</button><Link to={detailUrl}><MessageCircle size={17}/>Seguimiento</Link><button className={copied?'active':''} onClick={onShare}><Share2 size={17}/>{copied?'Código copiado':'Compartir'}</button></>:<><button className={useful?'active':''} onClick={onUseful}><Heart size={17} fill={useful?'currentColor':'none'}/>{useful?'Información útil':'Me sirve'}</button><Link to={detailUrl}><Navigation size={17}/>Ver reporte</Link>{!isMine&&<Link to="/app/report"><Siren size={17}/>Aportar</Link>}</>}
          <button className={saved?'active save':''} onClick={onSave}><Bookmark size={17} fill={saved?'currentColor':'none'}/>{saved?'Guardado':'Guardar'}</button>
        </div>
      </section>
    </div>

    <div className="publication-detail-grid">
      <section className="publication-detail-card timeline-card"><h3><Clock3 size={18}/>Evolución del incidente</h3><div className="publication-timeline">{timeline.map(([tone,title,description])=><div key={title} className={tone}><i/><span><strong>{title}</strong><small>{description}</small></span></div>)}</div></section>
      <section className="publication-detail-card units-card"><h3><Ambulance size={18}/>Unidades asignadas</h3>{assignedUnits.length?<div className="publication-units">{assignedUnits.map(unit=><div key={unit.id}><span><i><Ambulance size={14}/></i><strong>{unit.id}</strong><small>{unit.type}</small></span><b className={unit.status}>{unit.status==='on_scene'?'En sitio':unit.status==='available'?'Disponible':'En ruta'}</b></div>)}</div>:<div className="publication-empty-unit"><Ambulance size={24}/><strong>Asignación en proceso</strong><span>El centro de mando está coordinando recursos.</span></div>}</section>
      <section className="publication-detail-card location-card"><h3><MapPin size={18}/>Ubicación del incidente</h3><div className="publication-live-map"><GeoMap compact incidents={[{...incident,location:{...incident.location,label:simulated.address}}]} selectedId={incident.id} initialCenter={incident.location} initialZoom={15}/><Link to="/app/map"><strong>{simulated.address}</strong><span>Abrir mapa situacional</span></Link></div></section>
    </div>
  </article>
}

function SupportPublication(){
  return <article className="incident-publication support-publication">
    <div className="incident-publication-main"><Link className="publication-hero-media" to="/app/resources"><img src="/assets/presentation/wellbeing-preview.jpg" alt="Recursos de bienestar y recuperación"/><span><HeartHandshake size={14}/>RED DE APOYO</span></Link><section className="publication-summary"><div className="publication-badges"><Badge tone="green">APOYO Y RECUPERACIÓN</Badge><Badge tone="blue">DISPONIBLE 24/7</Badge></div><h2>Después de una emergencia también importa cómo te sientes</h2><div className="publication-address"><CheckCircle2 size={21}/><div><strong>Guías de recuperación y preparación</strong><span>Contenido educativo de orientación general</span></div></div><p>Encuentra primeros pasos, redes de apoyo y recursos de preparación familiar.</p><div className="publication-actions"><Link className="primary-action" to="/app/resources"><HeartHandshake size={17}/>Explorar recursos</Link><Link to="/app/resources"><Bookmark size={17}/>Guardar guía</Link></div></section></div>
    <div className="support-detail-strip"><span><ShieldCheck/>Preparación familiar</span><span><HeartHandshake/>Bienestar posterior</span><span><MessageCircle/>Redes de apoyo</span></div>
  </article>
}
