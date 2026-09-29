import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Bookmark, Camera, CheckCircle2, Clock3, HeartHandshake, MapPin, MessageCircle, Navigation, Radio, Share2, ShieldCheck, Siren, ThumbsUp } from 'lucide-react'
import { usePulse } from '../../context/PulseContext'
import { Badge, StatusBadge } from '../../components/Common'

import { incidentImage } from '../../utils/incidentMedia'


export default function CitizenHome(){
  const {db,currentUser}=usePulse(); const [saved,setSaved]=useState([]); const [useful,setUseful]=useState([]); const [safe,setSafe]=useState(false); const [copied,setCopied]=useState(false)
  const mine=db.incidents.filter(i=>i.citizenId===currentUser.id); const active=mine.find(i=>!['resolved','cancelled'].includes(i.status))
  const feed=useMemo(()=>db.incidents.filter(i=>i.publicVisibility || i.citizenId===currentUser.id).slice(0,8),[db.incidents,currentUser.id])
  const toggleSave=(id)=>setSaved(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id])
  const toggleUseful=id=>setUseful(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id])
  const copyCode=async code=>{try{await navigator.clipboard?.writeText(code);setCopied(true);setTimeout(()=>setCopied(false),1400)}catch{setCopied(false)}}
  const activeAssigned=[...new Set([...(active?.assignedUnits||[]),active?.assignedUnit].filter(Boolean))]
  return <div className="civic-feed-page">
    <section className="civic-composer">
      <div className="avatar-feed">{currentUser.profile.fullName?.split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase()}</div>
      <Link to="/app/report" className="composer-input">¿Qué emergencia o riesgo necesitas reportar?</Link>
      <div className="composer-actions"><Link to="/app/report"><Camera size={15}/>Cámara</Link><Link to="/app/report"><MapPin size={15}/>GPS exacto</Link><Link to="/app/report"><AlertTriangle size={15}/>Categoría</Link></div>
      <Link className="composer-submit" to="/app/report">Enviar reporte</Link>
    </section>

    {active&&<article className="feed-card primary-incident-card">
      <header className="feed-card-header"><div className="feed-source"><div className="official-avatar"><ShieldCheck size={18}/></div><div><strong>Comando PULSE 911 <CheckCircle2 size={13}/></strong><span>Actualización de tu incidente · {new Date(active.createdAt).toLocaleTimeString('es-CR',{hour:'2-digit',minute:'2-digit'})}</span></div></div><button className={saved.includes(active.id)?'saved':''} onClick={()=>toggleSave(active.id)}><Bookmark size={18}/></button></header>
      <div className="feed-body"><div className="incident-flags"><Badge tone="red">{active.priority} · PRIORIDAD</Badge><StatusBadge status={active.status}/></div><h2>#{active.title.replaceAll(' ','')} — {active.code}</h2><p>{active.description}</p><div className="feed-location"><MapPin size={14}/>{active.location.label}<span>·</span><Clock3 size={14}/>ETA {active.eta?`${active.eta} min`:'pendiente'}</div></div>
      <Link to={`/app/incidents/${active.id}`} className="feed-media"><img src={incidentImage(active)} alt={`Referencia visual para ${active.title}`}/><span>Seguimiento de tu caso</span>{activeAssigned.length>0&&<b>{activeAssigned[0]} {activeAssigned.length>1?`+${activeAssigned.length-1} MÁS`:''}</b>}</Link>
      <div className="feed-actions-row"><button className={safe?'safe':''} onClick={()=>setSafe(v=>!v)}><ShieldCheck size={15}/>{safe?'Estado seguro confirmado':'Me encuentro a salvo'}</button><Link to={`/app/incidents/${active.id}`}><Navigation size={15}/>Ver seguimiento</Link><button className={copied?'safe':''} onClick={()=>copyCode(active.code)}><Share2 size={15}/>{copied?'Código copiado':'Copiar código'}</button></div>
      <div className="feed-confirmations"><span><UsersIcon/>Caso visible para PULSE Command</span><Link to={`/app/incidents/${active.id}`}>Ver línea de tiempo</Link></div>
    </article>}

    {feed.filter(i=>i.id!==active?.id).map((incident,idx)=><article className="feed-card" key={incident.id}>
      <header className="feed-card-header"><div className="feed-source"><div className={`official-avatar ${idx%2?'community':''}`}>{idx%2?<Radio size={17}/>:<ShieldCheck size={18}/>}</div><div><strong>{incident.citizenId===currentUser.id?'Tu reporte':'Red cívica verificada'} {incident.citizenId!==currentUser.id&&<CheckCircle2 size={13}/>}</strong><span>{incident.location.label} · {new Date(incident.createdAt).toLocaleString('es-CR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</span></div></div><button className={saved.includes(incident.id)?'saved':''} onClick={()=>toggleSave(incident.id)}><Bookmark size={18}/></button></header>
      <div className="feed-body"><div className="incident-flags"><Badge tone={incident.priority==='P1'?'red':'amber'}>{incident.priority}</Badge><StatusBadge status={incident.status}/></div><h2>{incident.title}</h2><p>{incident.description}</p></div>
      <Link className="feed-media" to={incident.citizenId===currentUser.id?`/app/incidents/${incident.id}`:'/app/map'}><img src={incidentImage(incident)} alt={`Visual de ${incident.title}`}/><span>{incident.location.label}</span></Link>
      <div className="feed-actions-row"><button className={useful.includes(incident.id)?'safe':''} onClick={()=>toggleUseful(incident.id)}><ThumbsUp size={15}/>{useful.includes(incident.id)?'Marcado como útil':'Información útil'}</button><Link to="/app/map"><MapPin size={15}/>Ver en mapa</Link>{incident.citizenId===currentUser.id?<Link to={`/app/incidents/${incident.id}`}><MessageCircle size={15}/>Seguimiento</Link>:<Link to="/app/report"><Siren size={15}/>Aportar reporte</Link>}</div>
    </article>)}

    <article className="feed-card support-feed-card"><header className="feed-card-header"><div className="feed-source"><div className="official-avatar wellbeing"><HeartHandshake size={18}/></div><div><strong>Red Cívica de Apoyo</strong><span>Recurso educativo · disponible 24/7 dentro de la demo</span></div></div></header><div className="feed-body"><Badge tone="green">APOYO Y RECUPERACIÓN</Badge><h2>Después de una emergencia también importa cómo te sientes</h2><p>Consulta recursos de preparación, recuperación física y bienestar. Esta sección es educativa y no sustituye atención profesional.</p></div><div className="support-media"><img src="/assets/presentation/wellbeing-preview.jpg" alt="Recurso visual de bienestar y recuperación"/><div><strong>Guías de recuperación</strong><span>Primeros pasos, redes de apoyo y preparación familiar.</span><Link to="/app/resources">Explorar recursos →</Link></div></div></article>
  </div>
}

function UsersIcon(){return <Radio size={13}/>}
