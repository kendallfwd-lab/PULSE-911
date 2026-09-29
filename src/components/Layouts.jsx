import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Activity, Ambulance as AmbulanceIcon, BarChart3, Bell, BellRing, BookOpen, Bookmark, Building2 as HospitalIcon, CircleUserRound, ClipboardList, FileText as FileAuditIcon, Gauge, HeartPulse, Home, LogOut, MapPinned, Menu, PanelLeftClose, PanelLeftOpen, Play as PlayIcon, Radio, Radar, Search, Settings, Shield, ShieldAlert, ShieldCheck, Siren, SlidersHorizontal, UsersRound } from 'lucide-react'
import { Brand } from './Brand'
import { SimulationBanner } from './Common'
import { usePulse } from '../context/PulseContext'

const citizenLinks = [
  ['/app', Home, 'Feed en vivo'], ['/app/map', MapPinned, 'Mapa situacional'], ['/app/alerts', ShieldCheck, 'Canales oficiales'],
  ['/app/community', UsersRound, 'Red comunitaria'], ['/app/resources', BookOpen, 'Cursos y apoyo'], ['/app/incidents', Bookmark, 'Mis incidentes'], ['/app/notifications', Bell, 'Notificaciones'], ['/app/profile', Settings, 'Ajustes y protocolos']
]
const adminLinks = [
  ['/command', Gauge, 'Centro de mando'], ['/command/incidents', ClipboardList, 'Incidentes'], ['/command/dispatch', Radio, 'Despacho'], ['/command/units', AmbulanceIcon, 'Unidades'], ['/command/hospitals', HospitalIcon, 'Hospitales'], ['/command/risk-zones', ShieldAlert, 'Zonas de riesgo'], ['/command/alerts', BellRing, 'Alertas públicas'], ['/command/publications', UsersRound, 'Publicaciones'], ['/command/analytics', BarChart3, 'Analítica'], ['/command/audit', FileAuditIcon, 'Auditoría'], ['/command/scenarios', PlayIcon, 'Escenarios']
]

function Initials({ name = 'PULSE' }) {
  const value = name.split(' ').filter(Boolean).slice(0,2).map(x => x[0]).join('').toUpperCase()
  return <span>{value || 'P'}</span>
}

function CitizenRightRail(){
  const {db,currentUser}=usePulse(); const profile=currentUser?.profile || {}; const active=db.incidents.find(i=>i.citizenId===currentUser?.id&&!['resolved','cancelled'].includes(i.status));
  return <aside className="civic-right-rail">
    <section className="rail-card map-preview-card">
      <div className="rail-title"><div><Radar size={15}/><span>Mapa situacional</span></div><NavLink to="/app/map">Abrir</NavLink></div>
      <NavLink to="/app/map" className="mini-situational-map"><img src="/assets/stitch/situational-hybrid.webp" alt="Mapa situacional de demostración"/><span className="mini-map-beacon"/><div><strong>{active ? active.code : 'Sector demo'}</strong><span>{active ? active.location.label : 'Sin incidente personal activo'}</span></div></NavLink>
    </section>
    <section className="rail-card medical-summary">
      <div className="rail-title"><div><HeartPulse size={15}/><span>Ficha médica & contactos</span></div><i className="online-dot"/></div>
      <dl><div><dt>Tipo de sangre</dt><dd>{profile.bloodType || 'No indicado'}</dd></div><div><dt>Alergias</dt><dd>{profile.allergies || 'No declaradas'}</dd></div><div><dt>Contacto</dt><dd>{profile.contacts?.[0]?.name || 'No indicado'}</dd></div><div><dt>Privacidad</dt><dd>{profile.consents?.medical ? 'Ficha autorizada' : 'Ficha restringida'}</dd></div></dl>
      <NavLink className="rail-link" to="/app/profile">Revisar ficha completa</NavLink>
    </section>
    <section className="rail-card nearby-card">
      <div className="rail-title"><div><Activity size={15}/><span>Respuesta demo cercana</span></div><small>En vivo</small></div>
      {db.units.slice(0,3).map(u=><div className="nearby-row" key={u.id}><div><strong>{u.id}</strong><span>{u.type}</span></div><b>{u.eta} min</b></div>)}
    </section>
    <section className="rail-card protocol-card"><div className="rail-title"><div><Shield size={15}/><span>Protocolos rápidos</span></div></div><NavLink to="/app/resources"><span>RCP guía rápida</span><b>›</b></NavLink><NavLink to="/app/resources"><span>Primeros auxilios</span><b>›</b></NavLink></section>
    <section className="rail-card support-card"><div className="rail-title"><div><UsersRound size={15}/><span>Apoyo y recuperación</span></div></div><p>Recursos educativos posteriores a una emergencia y orientación general de bienestar.</p><NavLink className="support-btn" to="/app/resources">Explorar recursos</NavLink></section>
  </aside>
}

export function CitizenLayout() {
  const { currentUser, logout, db } = usePulse(); const navigate=useNavigate(); const [search,setSearch]=useState(''); const [menu,setMenu]=useState(false)
  const unread=db.alerts.filter(a=>a.active).length; const unreadNotifications=(db.notifications||[]).filter(n=>!n.read).length
  const submit=(e)=>{e.preventDefault();navigate(`/app/incidents${search.trim()?`?q=${encodeURIComponent(search.trim())}`:''}`)}
  return <div className="citizen-shell civic-shell">
    <SimulationBanner />
    <header className="civic-topbar">
      <div className="civic-topbar-inner">
        <NavLink to="/app" className="civic-wordmark"><i/><strong>PULSE 911</strong><span>CANAL METROPOLITANO ACTIVO</span></NavLink>
        <form className="civic-search" role="search" onSubmit={submit}><Search size={16}/><input aria-label="Buscar incidentes, códigos o ubicaciones" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar incidentes, códigos o ubicaciones..."/></form>
        <div className="civic-top-actions"><NavLink className="broadcast-btn" to="/app/report"><Radio size={15}/>Reportar</NavLink><NavLink className="top-icon-btn" to="/app/alerts" title="Alertas" aria-label={`Alertas${unread ? `: ${unread} activas` : ''}`}><ShieldAlert size={18}/>{unread>0&&<i/>}</NavLink><NavLink className="top-icon-btn" to="/app/notifications" title="Notificaciones" aria-label={`Notificaciones${unreadNotifications ? `: ${unreadNotifications} nuevas` : ''}`}><Bell size={18}/>{unreadNotifications>0&&<i/>}</NavLink><NavLink className="top-icon-btn" to="/app/profile" title="Ajustes" aria-label="Ajustes del perfil"><SlidersHorizontal size={18}/></NavLink><button className="profile-mini" type="button" aria-expanded={menu} aria-haspopup="menu" aria-controls="profile-menu" onClick={()=>setMenu(v=>!v)}><div className="avatar-mini"><Initials name={currentUser?.profile?.fullName}/></div><span>{currentUser?.profile?.fullName?.split(' ')[0] || 'Citizen'}</span></button>{menu&&<div className="profile-popover" id="profile-menu" role="menu"><NavLink role="menuitem" to="/app/profile"><CircleUserRound size={15}/>Mi perfil</NavLink><button role="menuitem" onClick={()=>{logout();navigate('/')}}><LogOut size={15}/>Cerrar sesión</button></div>}</div>
      </div>
    </header>
    <div className="civic-cockpit">
      <aside className="civic-left-rail"><div>
        <div className="desk-badge"><div><Radar size={19}/><i/></div><span><strong>PULSE 911 DESK</strong><small>Sector demo · En red</small></span></div>
        <nav>{citizenLinks.map(([to,Icon,label])=><NavLink key={to} end={to==='/app'} to={to}><Icon size={19}/><span>{label}</span>{label==='Canales oficiales'&&unread>0?<b>{unread}</b>:null}</NavLink>)}</nav>
        <NavLink className="sos-side-btn" to="/app/report?sos=1"><span><Siren size={19}/></span><div><strong>ACTIVAR SOS</strong><small>Mantener 3 segundos</small></div><Radio size={17}/></NavLink>
      </div><div className="left-rail-footer"><div className="verified-user"><div className="avatar-mini large"><Initials name={currentUser?.profile?.fullName}/></div><span><strong>{currentUser?.profile?.fullName}</strong><small>Ciudadano verificado demo</small></span><i/></div><button onClick={()=>{logout();navigate('/')}}><LogOut size={14}/>Salir</button></div></aside>
      <main className="civic-main"><Outlet/></main>
      <CitizenRightRail/>
    </div>
    <nav className="mobile-bottom civic-mobile-bottom">{[['/app',Home,'Inicio'],['/app/map',MapPinned,'Mapa'],['/app/report',Siren,'SOS'],['/app/incidents',ClipboardList,'Reportes'],['/app/profile',CircleUserRound,'Perfil']].map(([to,Icon,label]) => <NavLink key={to} end={to==='/app'} to={to}><Icon size={20}/><span>{label}</span></NavLink>)}</nav>
  </div>
}

export function AdminLayout() {
  const { currentUser, logout, db } = usePulse(); const navigate=useNavigate(); const loc=useLocation(); const [open,setOpen]=useState(false)
  const [collapsed,setCollapsed]=useState(()=>{try{return localStorage.getItem('pulse911-command-sidebar')==='collapsed'}catch{return false}})
  const toggleCollapsed=()=>setCollapsed(value=>{const next=!value;try{localStorage.setItem('pulse911-command-sidebar',next?'collapsed':'expanded')}catch{}return next})
  const title = adminLinks.find(([to]) => loc.pathname===to || (to!=='/command' && loc.pathname.startsWith(`${to}/`)))?.[2] || 'Centro de operaciones'
  const active=db.incidents.filter(i=>!['resolved','cancelled'].includes(i.status)).length
  const p1=db.incidents.filter(i=>i.priority==='P1'&&!['resolved','cancelled'].includes(i.status)).length
  const available=db.units.filter(u=>u.status==='available').length
  return <div className={`admin-shell command-shell-v2 ${collapsed?'sidebar-collapsed':''}`}>
    {open&&<button type="button" aria-label="Cerrar menú" className="command-sidebar-scrim" onClick={()=>setOpen(false)}/>}
    <aside className={`command-sidebar-v2 ${open?'open':''} ${collapsed?'collapsed':''}`}><div><NavLink to="/command" className="command-brand" onClick={()=>setOpen(false)}><span><Siren size={20}/><i/></span><div><strong>PULSE 911</strong><small>Command · Demo local</small></div></NavLink><NavLink className="command-sos" to="/command/incidents" onClick={()=>setOpen(false)}><Siren size={18}/><div><strong>{active} CASOS ACTIVOS</strong><small>{p1} prioridad P1 · {available} recursos libres</small></div></NavLink><nav><span className="command-nav-label">Operación</span>{adminLinks.slice(0,5).map(([to,Icon,label]) => <NavLink key={to} end={to==='/command'} to={to} onClick={()=>setOpen(false)} title={collapsed?label:undefined}><Icon size={18}/><span>{label}</span>{label==='Incidentes'&&active?<b>{active}</b>:null}</NavLink>)}<span className="command-nav-label">Inteligencia y control</span>{adminLinks.slice(5).map(([to,Icon,label]) => <NavLink key={to} to={to} onClick={()=>setOpen(false)} title={collapsed?label:undefined}><Icon size={18}/><span>{label}</span></NavLink>)}</nav></div><div><div className="command-sidebar-health"><i/><div><strong>Sistema local estable</strong><span>{available}/{db.units.length} unidades disponibles</span></div></div><div className="command-user-card"><div className="avatar-mini large"><Initials name={currentUser?.profile?.fullName}/></div><div><strong>{currentUser?.profile?.fullName}</strong><small>{currentUser?.profile?.operatorCode || 'OP-DEMO'}</small></div><button aria-label="Cerrar sesión" title="Cerrar sesión" onClick={()=>{logout();navigate('/')}}><LogOut size={15}/></button></div></div></aside>
    <section className="admin-workspace command-workspace-v2"><SimulationBanner/><header className="command-topbar-v2"><button className="command-menu-btn" aria-label="Abrir menú" onClick={()=>setOpen(v=>!v)}><Menu size={19}/></button><button className="command-collapse-btn" aria-label={collapsed?'Expandir barra lateral':'Contraer barra lateral'} title={collapsed?'Expandir navegación':'Contraer navegación'} onClick={toggleCollapsed}>{collapsed?<PanelLeftOpen size={18}/>:<PanelLeftClose size={18}/>}</button><div className="command-title-block"><small>PULSE COMMAND / OPERACIÓN SIMULADA</small><h1>{title}</h1></div><div className="command-top-actions"><span><i/>Vigilancia activa</span><span><Bell size={15}/>{db.notifications?.filter(n=>!n.read).length||0} nuevas</span><span><UsersRound size={15}/>{currentUser?.profile?.fullName}</span></div></header><main className="admin-main command-main-v2"><Outlet/></main></section>
  </div>
}
