import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Activity, Ambulance as AmbulanceIcon, BarChart3, Bell, BellRing, BookOpen, Bookmark, Bot, BrainCircuit, Building2 as HospitalIcon, CircleUserRound, ClipboardList, Compass, FileText as FileAuditIcon, Gauge, HeartHandshake, HeartPulse, Home, LogOut, MapPinned, Menu, Navigation, PanelLeftClose, PanelLeftOpen, Play as PlayIcon, Radio, Radar, Route as RouteIcon, Search, Settings, Shield, ShieldAlert, ShieldCheck, Siren, Sparkles, UserPlus, UsersRound, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AccessibilityControls } from './accessibility/AccessibilityControls'
import { usePulse } from '../context/PulseContext'
import { useLiveLocation } from '../context/LiveLocationContext'

const citizenLinks = [
  ['/app', Home, 'nav.home'], ['/app/map', MapPinned, 'nav.map'], ['/app/roads', RouteIcon, 'nav.roads'], ['/app/insights', BrainCircuit, 'nav.insights'], ['/app/nearby', Navigation, 'nav.nearby'],
  ['/app/assistant', Bot, 'nav.assistant'], ['/app/travel', Compass, 'nav.travel'], ['/app/wellbeing', HeartHandshake, 'nav.wellbeing'],
  ['/app/community', UsersRound, 'nav.community'], ['/app/resources', BookOpen, 'nav.resources'], ['/app/incidents', Bookmark, 'nav.incidents'], ['/app/profile', Settings, 'nav.profile']
]
const adminLinks = [
  ['/command', Gauge, 'Centro de mando'], ['/command/incidents', ClipboardList, 'Incidentes'], ['/command/dispatch', Radio, 'Despacho'], ['/command/units', AmbulanceIcon, 'Unidades'], ['/command/hospitals', HospitalIcon, 'Hospitales'], ['/command/risk-zones', ShieldAlert, 'Zonas de riesgo'], ['/command/alerts', BellRing, 'Alertas públicas'], ['/command/publications', UsersRound, 'Publicaciones'], ['/command/analytics', BarChart3, 'Analítica'], ['/command/users', UserPlus, 'Usuarios'], ['/command/audit', FileAuditIcon, 'Auditoría'], ['/command/scenarios', PlayIcon, 'Escenarios'], ['/command/ai', Bot, 'Centro IA'], ['/command/ai-review', Sparkles, 'Revisión IA'], ['/command/traffic', RouteIcon, 'Monitoreo vial']
]

function Initials({ name = 'PULSE' }) {
  const value = name.split(' ').filter(Boolean).slice(0,2).map(x => x[0]).join('').toUpperCase()
  return <span>{value || 'P'}</span>
}

function CitizenRightRail(){
  const {t,i18n}=useTranslation(); const english=i18n.language.startsWith('en')
  const {db,currentUser}=usePulse(); const profile=currentUser?.profile || {}; const active=db.incidents.find(i=>i.citizenId===currentUser?.id&&!['resolved','cancelled'].includes(i.status));
  return <aside className="civic-right-rail">
    <section className="rail-card map-preview-card">
      <div className="rail-title"><div><Radar size={15}/><span>{t('nav.map')}</span></div><NavLink to="/app/map">{t('actions.viewMap')}</NavLink></div>
      <NavLink to="/app/map" className="mini-situational-map"><img src="/assets/stitch/situational-hybrid.webp" alt={t('map.interactive')}/><span className="mini-map-beacon"/><div><strong>{active ? active.code : (english?'Demo sector':'Sector demo')}</strong><span>{active ? active.location.label : (english?'No active personal incident':'Sin incidente personal activo')}</span></div></NavLink>
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
  const { t } = useTranslation()
  const { currentUser, logout } = usePulse(); const navigate=useNavigate(); const [search,setSearch]=useState(''); const [menu,setMenu]=useState(false); const [reportMenu,setReportMenu]=useState(false)
  const {status:locationStatus,start:startLocation,stop:stopLocation,isActive:locationActive}=useLiveLocation()
  useEffect(()=>{if(!reportMenu)return undefined;const close=event=>{if(event.key==='Escape')setReportMenu(false)};document.addEventListener('keydown',close);return()=>document.removeEventListener('keydown',close)},[reportMenu])
  const submit=(e)=>{e.preventDefault();navigate(`/app/incidents${search.trim()?`?q=${encodeURIComponent(search.trim())}`:''}`)}
  return <div className="citizen-shell civic-shell">
    <header className="civic-topbar">
      <div className="civic-topbar-inner">
        <NavLink to="/app" className="civic-wordmark"><i/><strong>PULSE 911</strong><span>{t('layout.activeChannel')}</span></NavLink>
        <div className="civic-navbar-theme"><AccessibilityControls compact/></div>
        <form className="civic-search" role="search" onSubmit={submit}><Search size={16}/><input aria-label={t('layout.search')} value={search} onChange={e=>setSearch(e.target.value)} placeholder={t('layout.search')}/></form>
        <div className="civic-top-actions"><NavLink className="pulse-ai-nav-button" to="/app/assistant"><Sparkles size={15}/><span>{t('nav.assistant')}</span></NavLink><button className={`live-location-toggle ${locationActive?'active':''}`} type="button" onClick={locationActive?stopLocation:startLocation} aria-pressed={locationActive} title={locationActive?t('layout.stopLive'):t('layout.startLive')}><Navigation size={15}/><span>{locationStatus==='requesting'?t('layout.searching'):locationActive?t('layout.locationActive'):t('layout.myLocation')}</span></button><button className="broadcast-btn" type="button" aria-haspopup="dialog" onClick={()=>setReportMenu(true)}><Radio size={15}/>{t('actions.report')}</button><button className="profile-mini" type="button" aria-expanded={menu} aria-haspopup="menu" aria-controls="profile-menu" onClick={()=>setMenu(v=>!v)}><div className="avatar-mini"><Initials name={currentUser?.profile?.fullName}/></div><span>{currentUser?.profile?.fullName?.split(' ')[0] || 'Citizen'}</span></button>{menu&&<div className="profile-popover" id="profile-menu" role="menu"><NavLink role="menuitem" to="/app/profile"><CircleUserRound size={15}/>{t('layout.myProfile')}</NavLink><button role="menuitem" onClick={()=>{logout();navigate('/')}}><LogOut size={15}/>{t('layout.logout')}</button></div>}</div>
      </div>
    </header>
    <div className="civic-cockpit">
      <aside className="civic-left-rail"><div>
        <div className="desk-badge"><div><Radar size={19}/><i/></div><span><strong>PULSE 911 DESK</strong><small>{t('layout.demoSector')}</small></span></div>
        <nav>{citizenLinks.map(([to,Icon,label])=><NavLink key={to} end={to==='/app'} to={to}><Icon size={19}/><span>{t(label)}</span></NavLink>)}</nav>
      </div><div className="left-rail-footer"><div className="verified-user"><div className="avatar-mini large"><Initials name={currentUser?.profile?.fullName}/></div><span><strong>{currentUser?.profile?.fullName}</strong><small>{t('layout.verifiedCitizen')}</small></span><i/></div><button onClick={()=>{logout();navigate('/')}}><LogOut size={14}/>{t('layout.logout')}</button></div></aside>
      <main className="civic-main"><Outlet/></main>
    </div>
    <nav className="mobile-bottom civic-mobile-bottom">{[['/app',Home,t('nav.home')],['/app/map',MapPinned,t('nav.map')],['/app/insights',BrainCircuit,t('nav.insights')],['/app/report',Siren,'SOS'],['/app/incidents',ClipboardList,t('layout.reports')],['/app/profile',CircleUserRound,t('nav.profile')]].map(([to,Icon,label]) => <NavLink key={to} end={to==='/app'} to={to}><Icon size={20}/><span>{label}</span></NavLink>)}</nav>
    {reportMenu&&<div className="report-choice-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setReportMenu(false)}}><section className="report-choice-dialog" role="dialog" aria-modal="true" aria-labelledby="report-choice-title"><button className="report-choice-close" type="button" aria-label={t('layout.close')} onClick={()=>setReportMenu(false)}><X size={18}/></button><span>{t('layout.reportLabel')}</span><h2 id="report-choice-title">{t('layout.reportQuestion')}</h2><p>{t('layout.reportHelp')}</p><div><NavLink className="report-choice emergency" to="/app/report" onClick={()=>setReportMenu(false)}><Siren/><span><strong>{t('layout.emergency')}</strong><small>{t('layout.emergencyHelp')}</small></span></NavLink><NavLink className="report-choice road" to="/app/community?compose=road" onClick={()=>setReportMenu(false)}><RouteIcon/><span><strong>{t('layout.roadSituation')}</strong><small>{t('layout.roadHelp')}</small></span></NavLink></div><small>{t('layout.reportDisclaimer')}</small></section></div>}
  </div>
}

export function AdminLayout() {
  const { currentUser, logout, db } = usePulse(); const navigate=useNavigate(); const loc=useLocation(); const [open,setOpen]=useState(false)
  const [collapsed,setCollapsed]=useState(false)
  const toggleCollapsed=()=>setCollapsed(value=>{const next=!value;try{localStorage.setItem('pulse911-command-sidebar',next?'collapsed':'expanded')}catch{}return next})
  const title = adminLinks.find(([to]) => loc.pathname===to || (to!=='/command' && loc.pathname.startsWith(`${to}/`)))?.[2] || 'Centro de operaciones'
  const active=db.incidents.filter(i=>!['resolved','cancelled'].includes(i.status)).length
  const available=db.units.filter(u=>u.status==='available').length
  return <div className={`admin-shell command-shell-v2 ${collapsed?'sidebar-collapsed':''}`}>
    {open&&<button type="button" aria-label="Cerrar menú" className="command-sidebar-scrim" onClick={()=>setOpen(false)}/>}
    <aside className={`command-sidebar-v2 ${open?'open':''} ${collapsed?'collapsed':''}`}><div><nav><span className="command-nav-label">Operación</span>{adminLinks.slice(0,5).map(([to,Icon,label]) => <NavLink key={to} end={to==='/command'} to={to} onClick={()=>setOpen(false)} title={collapsed?label:undefined}><Icon size={18}/><span>{label}</span>{label==='Incidentes'&&active?<b>{active}</b>:null}</NavLink>)}<span className="command-nav-label">Inteligencia y control</span>{adminLinks.slice(5).map(([to,Icon,label]) => <NavLink key={to} to={to} onClick={()=>setOpen(false)} title={collapsed?label:undefined}><Icon size={18}/><span>{label}</span></NavLink>)}</nav></div><div><div className="command-sidebar-health"><i/><div><strong>Sistema local estable</strong><span>{available}/{db.units.length} unidades disponibles</span></div></div><div className="command-user-card"><div className="avatar-mini large"><Initials name={currentUser?.profile?.fullName}/></div><div><strong>{currentUser?.profile?.fullName}</strong><small>{currentUser?.profile?.operatorCode || 'OP-DEMO'}</small></div><button aria-label="Cerrar sesión" title="Cerrar sesión" onClick={()=>{logout();navigate('/')}}><LogOut size={15}/></button></div></div></aside>
    <section className="admin-workspace command-workspace-v2">
      <header className="command-topbar-v2">
        <button className="command-menu-btn" aria-label="Abrir menú" onClick={()=>setOpen(v=>!v)}><Menu size={19}/></button>
        <button className="command-collapse-btn" aria-label={collapsed?'Expandir barra lateral':'Contraer barra lateral'} title={collapsed?'Expandir navegación':'Contraer navegación'} onClick={toggleCollapsed}>{collapsed?<PanelLeftOpen size={18}/>:<PanelLeftClose size={18}/>}</button>
        <div className="command-title-block"><small>PULSE COMMAND / OPERACIÓN SIMULADA</small><h1>{title}</h1></div>
        <div className="command-top-actions"><span><i/>Vigilancia activa</span><span><Bell size={15}/>{db.notifications?.filter(n=>!n.read).length||0} nuevas</span><span><UsersRound size={15}/>{currentUser?.profile?.fullName}</span><AccessibilityControls compact/></div>
        <div className="command-mobile-theme"><AccessibilityControls compact/></div>
      </header>
      <main className="admin-main command-main-v2"><Outlet/></main>
    </section>
  </div>
}
