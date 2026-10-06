import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Ambulance, ArrowRight, Bookmark, CheckCircle2, Clock3, Heart, HeartHandshake, MapPin, MessageCircle, Navigation, Newspaper, Share2, ShieldCheck, Siren, Volume2 } from 'lucide-react'
import { usePulse } from '../../context/PulseContext'
import { Badge, StatusBadge } from '../../components/Common'
import GeoMap from '../../components/GeoMap'
import { incidentImage } from '../../utils/incidentMedia'
import { compatibleUnits } from '../../utils/dispatch'
import { BreakingTicker, TrafficImpactBadge, TrafficSummary, VerificationBadge } from '../../components/traffic/TrafficComponents'
import { CitizenConfirmation } from '../../components/traffic/CitizenConfirmation'
import { speak } from '../../accessibility/speechService'
import { useTranslation } from 'react-i18next'

const statusCopy = {
  received:'Reporte recibido',
  triaged:'Evaluación operativa',
  dispatched:'Unidades en camino',
  on_scene:'Personal en sitio',
  transporting:'Traslado en curso',
  resolved:'Incidente resuelto'
}
const statusCopyEn = { received:'Report received', triaged:'Operational assessment', dispatched:'Units on the way', on_scene:'Personnel on scene', transporting:'Transport in progress', resolved:'Incident resolved' }

const simulatedAddresses = [
  'Av. Central y Calle 8, El Roble',
  'Ruta 23, entrada a Barranca',
  'Paseo de los Turistas, sector oeste',
  'Costanera Sur, frente al parque industrial',
  'Calle 14 y Avenida de los Insurgentes'
]

function simulatedDetails(incident,english){
  const seed=String(incident.id||incident.code||'pulse').split('').reduce((sum,char)=>sum+char.charCodeAt(0),0)
  const original=incident.location?.label||''
  const address=!original||/dispositivo|seleccionado|navegador|mapa/i.test(original)?simulatedAddresses[seed%simulatedAddresses.length]:original
  const details=(english?{
    traffic_accident:['Vehicle collision','3 people','Partial traffic flow'],
    medical:['Priority medical care','1 patient','Clear access'],
    fire:['Structure fire','2 people evacuated','Smoke visible'],
    flood:['Road flooding','No injuries','Restricted passage'],
    security:['Security incident','Assessment in progress','Area secured']
  }:{
    traffic_accident:['Colisión entre vehículos','3 personas','Tránsito parcial'],
    medical:['Atención médica prioritaria','1 paciente','Acceso despejado'],
    fire:['Incendio estructural','2 personas evacuadas','Humo visible'],
    flood:['Anegamiento vial','Sin lesionados','Paso restringido'],
    security:['Incidente de seguridad','Evaluación en curso','Zona asegurada']
  })[incident.category]||(english?['Citizen emergency','Initial assessment','Coordinated response']:['Emergencia ciudadana','Evaluación inicial','Respuesta coordinada'])
  return {address,event:details[0],people:details[1],condition:details[2]}
}

function responseEta(incident,units,english){
  if(incident.status==='resolved') return english?'Resolved':'Resuelto'
  const assignedIds=[...new Set([...(incident.assignedUnits||[]),incident.assignedUnit].filter(Boolean))]
  const assigned=assignedIds.map(id=>units.find(unit=>unit.id===id)).filter(Boolean)
  if(incident.status==='on_scene'||assigned.some(unit=>unit.status==='on_scene'||unit.status==='at_hospital')) return english?'On scene':'En sitio'
  if(incident.status==='transporting'||assigned.some(unit=>unit.status==='transporting')) return english?'In transport':'En traslado'
  if(incident.eta!=null&&Number.isFinite(Number(incident.eta))){
    const minutes=Math.max(0,Math.ceil(Number(incident.eta)))
    return minutes===0?(english?'On scene':'En sitio'):`~${minutes} min`
  }
  const assignedEtas=assigned
    .filter(unit=>['en_route','dispatched'].includes(unit.status))
    .map(unit=>unit.mission?.etaMin??unit.eta)
    .map(Number)
    .filter(Number.isFinite)
  const available=compatibleUnits(incident,units)
  const estimate=assignedEtas.length
    ? Math.min(...assignedEtas)
    : available.length
      ? Math.min(...available.map(unit=>unit.eta))
      : ({P1:4,P2:7,P3:10,P4:12}[incident.priority]||8)
  return `~${Math.max(1,Math.ceil(estimate))} min`
}

export default function CitizenHome(){
  const {db,currentUser}=usePulse(); const [saved,setSaved]=useState([]); const [useful,setUseful]=useState([]); const [safe,setSafe]=useState(false); const [copied,setCopied]=useState(false)
  const mine=db.incidents.filter(i=>i.citizenId===currentUser.id); const active=mine.find(i=>!['resolved','cancelled'].includes(i.status))
  const feed=useMemo(()=>db.incidents.filter(i=>i.publicVisibility || i.citizenId===currentUser.id).slice(0,8),[db.incidents,currentUser.id])
  const publications=useMemo(()=>(db.publications||[])
    .filter(publication=>['verified','published'].includes(publication.status)||publication.authorId===currentUser.id||publication.citizenId===currentUser.id)
    .sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0))
    .slice(0,6),[db.publications,currentUser.id])
  const toggleSave=id=>setSaved(value=>value.includes(id)?value.filter(item=>item!==id):[...value,id])
  const toggleUseful=id=>setUseful(value=>value.includes(id)?value.filter(item=>item!==id):[...value,id])
  const copyCode=async code=>{try{await navigator.clipboard?.writeText(code);setCopied(true);setTimeout(()=>setCopied(false),1400)}catch{setCopied(false)}}

  return <div className="operations-publication-feed">
    <TrafficSummary incidents={db.incidents} roads={db.roadStatus || []} riskZones={db.riskZones || []}/>
    <BreakingTicker incidents={db.incidents} roads={db.roadStatus || []}/>
    <CitizenPublicationStrip publications={publications}/>
    {active&&<IncidentPublication incident={active} units={db.units} primary isMine saved={saved.includes(active.id)} safe={safe} copied={copied} onSave={()=>toggleSave(active.id)} onSafe={()=>setSafe(value=>!value)} onShare={()=>copyCode(active.code)}/>}

    {feed.filter(incident=>incident.id!==active?.id).map(incident=><IncidentPublication key={incident.id} incident={incident} units={db.units} isMine={incident.citizenId===currentUser.id} saved={saved.includes(incident.id)} useful={useful.includes(incident.id)} onSave={()=>toggleSave(incident.id)} onUseful={()=>toggleUseful(incident.id)}/>)}

    <SupportPublication/>
  </div>
}

function CitizenPublicationStrip({publications}){
  const {i18n}=useTranslation(); const english=i18n.language.startsWith('en')
  return <section className="citizen-publication-strip" aria-labelledby="citizen-publications-title">
    <div className="citizen-publication-strip-head"><div><Newspaper size={20}/><span><strong id="citizen-publications-title">{english?'Citizen publications':'Publicaciones ciudadanas'}</strong><small>{english?'Verified reports and your submissions':'Reportes verificados y tus publicaciones'}</small></span></div><Link to="/app/community">{english?'View all':'Ver todas'}<ArrowRight size={16}/></Link></div>
    {publications.length?<div className="citizen-publication-cards">{publications.map(publication=><article key={publication.id} className="citizen-publication-card">
      {publication.image?<img src={publication.image} alt=""/>:<div className="citizen-publication-placeholder"><Newspaper size={26}/></div>}
      <div><span className={`citizen-publication-status ${publication.status}`}>{publication.status==='verified'||publication.status==='published'?(english?'Verified':'Verificada'):(english?'Under review':'En revisión')}</span><time>{new Date(publication.createdAt).toLocaleDateString(i18n.language,{day:'2-digit',month:'short'})}</time><h3 className="citizen-publication-title">{publication.title}</h3><p><MapPin size={13}/>{publication.location?.label|| (english?'Location pending':'Ubicación pendiente')}</p></div>
    </article>)}</div>:<div className="citizen-publication-empty"><Newspaper size={24}/><span><strong>{english?'No visible publications yet':'Aún no hay publicaciones visibles'}</strong><small>{english?'Your new reports will appear here.':'Tus nuevos reportes aparecerán aquí.'}</small></span><Link to="/app/report">{english?'Create report':'Crear reporte'}</Link></div>}
  </section>
}

function IncidentPublication({incident,units,primary=false,isMine=false,saved=false,useful=false,safe=false,copied=false,onSave,onUseful,onSafe,onShare}){
  const {t,i18n}=useTranslation(); const english=i18n.language.startsWith('en')
  const assignedIds=[...new Set([...(incident.assignedUnits||[]),incident.assignedUnit].filter(Boolean))]
  const assignedUnits=assignedIds.map(id=>units.find(unit=>unit.id===id)||{id,type:english?'Assigned unit':'Unidad asignada',status:'dispatched'}).slice(0,4)
  const detailUrl=isMine?`/app/incidents/${incident.id}`:'/app/map'
  const created=new Date(incident.createdAt).toLocaleString(i18n.language,{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})
  const eta=responseEta(incident,units,english)
  const simulated=simulatedDetails(incident,english)
  const timeline=[
    ['red',english?'Incident reported':'Incidente reportado',created],
    ['blue',assignedIds.length?(english?'Units assigned':'Unidades asignadas'):(english?'Report under validation':'Reporte en validación'),assignedIds.length?`${assignedIds.length} ${english?'coordinated resource(s)':'recurso(s) coordinados'}`:(english?'Initial verification':'Verificación inicial')],
    ['blue',(english?statusCopyEn:statusCopy)[incident.status]||(english?'Coordinated response':'Atención coordinada'),incident.description],
    ['gray',english?'Active tracking':'Seguimiento activo',`${english?'Priority':'Prioridad'} ${incident.priority} · ${incident.code}`]
  ]

  return <article className={`incident-publication ${primary?'primary':''}`}>
    <div className="incident-publication-main">
      <Link className="publication-hero-media" to={detailUrl}><img src={incidentImage(incident)} alt={`${english?'Response for':'Atención de'} ${incident.title}`}/><span><Ambulance size={14}/>{assignedIds[0]||incident.code}</span></Link>
      <section className="publication-summary">
        <div className="publication-badges"><Badge tone={incident.priority==='P1'?'red':'amber'}>{incident.priority==='P1'?(english?'HIGH PRIORITY':'PRIORIDAD ALTA'):`${english?'PRIORITY':'PRIORIDAD'} ${incident.priority}`}</Badge><StatusBadge status={incident.status}/><VerificationBadge status={incident.verificationStatus || (isMine ? 'reviewing' : 'unverified')}/>{incident.trafficImpact && <TrafficImpactBadge impact={incident.trafficImpact}/>}</div>
        <h2>{incident.title}</h2>
        <div className="publication-address"><MapPin size={21}/><div><strong>{simulated.address}</strong><span>{incident.code} · {english?'Simulated location for this demonstration':'Ubicación simulada para la demostración'}</span></div></div>
        <p className="publication-facts">{simulated.event} | {simulated.people} | {simulated.condition}</p>
        <div className="publication-eta"><Clock3 size={28}/><div><span>{english?'Estimated response time':'Tiempo estimado de respuesta'}</span><strong>{eta}</strong></div></div>
        <div className="publication-actions">
          {primary?<><button className={safe?'active':''} onClick={onSafe}><ShieldCheck size={17}/>{safe?(english?'Safe status':'Estado seguro'):(english?'I am safe':'Estoy a salvo')}</button><Link to={detailUrl}><MessageCircle size={17}/>{english?'Tracking':'Seguimiento'}</Link><button className={copied?'active':''} onClick={onShare}><Share2 size={17}/>{copied?(english?'Code copied':'Código copiado'):(english?'Share':'Compartir')}</button></>:<><button className={useful?'active':''} onClick={onUseful}><Heart size={17} fill={useful?'currentColor':'none'}/>{useful?(english?'Useful information':'Información útil'):(english?'Useful':'Me sirve')}</button><Link to={detailUrl}><Navigation size={17}/>{english?'View report':'Ver reporte'}</Link>{!isMine&&<Link to="/app/report"><Siren size={17}/>{english?'Contribute':'Aportar'}</Link>}</>}
          <button className={saved?'active save':''} onClick={onSave}><Bookmark size={17} fill={saved?'currentColor':'none'}/>{saved?(english?'Saved':'Guardado'):(english?'Save':'Guardar')}</button><button type="button" onClick={()=>speak(`${incident.title}. ${incident.description}. ${simulated.address}`,i18n.language)}><Volume2 size={17}/>{english?'Listen to report':'Escuchar reporte'}</button>
        </div>
        {!isMine&&<CitizenConfirmation id={incident.id} confirmationCount={incident.confirmationCount}/>}
      </section>
    </div>

    <div className="publication-detail-grid">
      <div className="publication-followup"><section className="publication-detail-card timeline-card"><h3><Clock3 size={18}/>{english?'Incident progress':'Evolución del incidente'}</h3><div className="publication-timeline">{timeline.map(([tone,title,description])=><div key={title} className={tone}><i/><span><strong>{title}</strong><small>{description}</small></span></div>)}</div></section>
      <section className="publication-detail-card units-card"><h3><Ambulance size={18}/>{english?'Assigned units':'Unidades asignadas'}</h3>{assignedUnits.length?<div className="publication-units">{assignedUnits.map(unit=><div key={unit.id}><span><i><Ambulance size={14}/></i><strong>{unit.id}</strong><small>{unit.type}</small></span><b className={unit.status}>{unit.status==='on_scene'?(english?'On scene':'En sitio'):unit.status==='available'?(english?'Available':'Disponible'):(english?'En route':'En ruta')}</b></div>)}</div>:<div className="publication-empty-unit"><Ambulance size={24}/><strong>{english?'Assignment in progress':'Asignación en proceso'}</strong><span>{english?'The command center is coordinating resources.':'El centro de mando está coordinando recursos.'}</span></div>}</section></div>
      <section className="publication-detail-card location-card"><h3><MapPin size={18}/>{english?'Incident location':'Ubicación del incidente'}</h3><div className="publication-live-map"><GeoMap compact incidents={[{...incident,location:{...incident.location,label:simulated.address}}]} selectedId={incident.id} initialCenter={incident.location} initialZoom={15}/><Link to="/app/map"><strong>{simulated.address}</strong><span>{t('actions.viewMap')}</span></Link></div></section>
    </div>
  </article>
}

function SupportPublication(){
  const {i18n}=useTranslation(); const english=i18n.language.startsWith('en')
  return <article className="incident-publication support-publication">
    <div className="incident-publication-main"><Link className="publication-hero-media" to="/app/resources"><img src="/assets/presentation/wellbeing-preview.jpg" alt={english?'Wellbeing and recovery resources':'Recursos de bienestar y recuperación'}/><span><HeartHandshake size={14}/>{english?'SUPPORT NETWORK':'RED DE APOYO'}</span></Link><section className="publication-summary"><div className="publication-badges"><Badge tone="green">{english?'SUPPORT AND RECOVERY':'APOYO Y RECUPERACIÓN'}</Badge><Badge tone="blue">{english?'AVAILABLE 24/7':'DISPONIBLE 24/7'}</Badge></div><h2>{english?'How you feel after an emergency matters too':'Después de una emergencia también importa cómo te sientes'}</h2><div className="publication-address"><CheckCircle2 size={21}/><div><strong>{english?'Recovery and preparedness guides':'Guías de recuperación y preparación'}</strong><span>{english?'General educational guidance':'Contenido educativo de orientación general'}</span></div></div><p>{english?'Find first steps, support networks, and family preparedness resources.':'Encuentra primeros pasos, redes de apoyo y recursos de preparación familiar.'}</p><div className="publication-actions"><Link className="primary-action" to="/app/resources"><HeartHandshake size={17}/>{english?'Explore resources':'Explorar recursos'}</Link><Link to="/app/resources"><Bookmark size={17}/>{english?'Save guide':'Guardar guía'}</Link></div></section></div>
    <div className="support-detail-strip"><span><ShieldCheck/>{english?'Family preparedness':'Preparación familiar'}</span><span><HeartHandshake/>{english?'Post-event wellbeing':'Bienestar posterior'}</span><span><MessageCircle/>{english?'Support networks':'Redes de apoyo'}</span></div>
  </article>
}
