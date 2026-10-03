import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, Building2, Crosshair, Flame, Layers3, MapPinned, Maximize2, Minimize2, Navigation, Sparkles, Waves, ZoomIn, ZoomOut } from 'lucide-react'
import { DEMO_MAP_CENTER } from '../config/demoGeography'
import { getUnitVisual } from './UnitTypeIcon'
import { useTranslation } from 'react-i18next'

const TILE = 256
const DEFAULT_CENTER = DEMO_MAP_CENTER

function clampLat(lat){ return Math.max(-85.0511, Math.min(85.0511, lat)) }
function project({lat,lng}, zoom){
  const scale = TILE * 2 ** zoom
  const sin = Math.sin(clampLat(lat) * Math.PI / 180)
  return {
    x: ((lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale
  }
}
function unproject({x,y}, zoom){
  const scale = TILE * 2 ** zoom
  const lng = x / scale * 360 - 180
  const n = Math.PI - 2 * Math.PI * y / scale
  const lat = 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
  return {lat,lng}
}
function locationOf(item){
  if(item?.location?.lat != null) return item.location
  if(item?.lat != null) return item
  return null
}
function categoryIcon(cat=''){
  if(cat==='fire') return Flame
  if(cat==='flood') return Waves
  return AlertTriangle
}
function radiusPx(lat, meters, zoom){
  const mpp = 156543.03392 * Math.cos(lat * Math.PI/180) / (2 ** zoom)
  return Math.max(14, Math.min(220, meters / mpp))
}

export default function GeoMap({
  incidents=[], units=[], alerts=[], riskZones=[], hospitals=[], historicalIncidents=[], aiSuggestions=[],
  selectedId=null,
  onSelectIncident, onSelectUnit, onSelectRiskZone, onSelectAlert, onSelectHospital, onSelectAiSuggestion,
  onMapClick, onMoveRiskZone, onMoveAlert,
  draggableRiskId=null, draggableAlertId=null,
  initialCenter=DEFAULT_CENTER, initialZoom=14,
  compact=false, showControls=true, className='', focusLocations=[], focusKey='', userLocation=null
}){
  const {i18n}=useTranslation(); const english=i18n.language.startsWith('en')
  const wrapRef=useRef(null)
  const dragRef=useRef(null)
  const markerDragRef=useRef(null)
  const [size,setSize]=useState({w:900,h:560})
  const [center,setCenter]=useState(initialCenter)
  const [zoom,setZoom]=useState(initialZoom)
  const [theme,setTheme]=useState('street')
  const [layers,setLayers]=useState({incidents:true,units:true,alerts:true,riskZones:true,routes:true,hospitals:true,history:false,aiSuggestions:true})
  const [layersOpen,setLayersOpen]=useState(false)
  const [expanded,setExpanded]=useState(false)

  useEffect(()=>{
    if(initialCenter?.lat != null && initialCenter?.lng != null) setCenter({lat:initialCenter.lat,lng:initialCenter.lng})
  },[initialCenter?.lat,initialCenter?.lng])

  useEffect(()=>{
    if(!expanded) return
    const previousBodyOverflow=document.body.style.overflow
    const previousRootOverflow=document.documentElement.style.overflow
    const previousRootScrollbarGutter=document.documentElement.style.scrollbarGutter
    document.body.style.overflow='hidden'
    document.documentElement.style.overflow='hidden'
    document.documentElement.style.scrollbarGutter='auto'
    const onKey=(e)=>{ if(e.key==='Escape') setExpanded(false) }
    window.addEventListener('keydown',onKey)
    return ()=>{
      document.body.style.overflow=previousBodyOverflow
      document.documentElement.style.overflow=previousRootOverflow
      document.documentElement.style.scrollbarGutter=previousRootScrollbarGutter
      window.removeEventListener('keydown',onKey)
    }
  },[expanded])

  useEffect(()=>{
    if(!wrapRef.current) return
    const obs=new ResizeObserver(entries=>{
      const r=entries[0]?.contentRect
      if(r) setSize({w:r.width,h:r.height})
    })
    obs.observe(wrapRef.current)
    return ()=>obs.disconnect()
  },[])

  const centerPx=useMemo(()=>project(center,zoom),[center,zoom])
  const tiles=useMemo(()=>{
    const minX=Math.floor((centerPx.x-size.w/2)/TILE)-1
    const maxX=Math.floor((centerPx.x+size.w/2)/TILE)+1
    const minY=Math.floor((centerPx.y-size.h/2)/TILE)-1
    const maxY=Math.floor((centerPx.y+size.h/2)/TILE)+1
    const n=2**zoom, out=[]
    for(let tx=minX;tx<=maxX;tx++) for(let ty=minY;ty<=maxY;ty++){
      if(ty<0||ty>=n) continue
      const wrapped=((tx%n)+n)%n
      out.push({tx,ty,wrapped,left:tx*TILE-(centerPx.x-size.w/2),top:ty*TILE-(centerPx.y-size.h/2)})
    }
    return out
  },[centerPx,size,zoom])

  const toScreen=(loc)=>{
    const p=project(loc,zoom)
    return {x:p.x-centerPx.x+size.w/2,y:p.y-centerPx.y+size.h/2}
  }
  const fromClient=(clientX,clientY)=>{
    const rect=wrapRef.current.getBoundingClientRect()
    const x=clientX-rect.left, y=clientY-rect.top
    return unproject({x:centerPx.x+(x-size.w/2),y:centerPx.y+(y-size.h/2)},zoom)
  }

  const beginMapDrag=(e)=>{
    if(e.button!==0 || markerDragRef.current) return
    dragRef.current={x:e.clientX,y:e.clientY,centerPx,moved:false}
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const moveMap=(e)=>{
    if(!dragRef.current || markerDragRef.current) return
    const dx=e.clientX-dragRef.current.x, dy=e.clientY-dragRef.current.y
    if(Math.abs(dx)+Math.abs(dy)>4) dragRef.current.moved=true
    const p={x:dragRef.current.centerPx.x-dx,y:dragRef.current.centerPx.y-dy}
    setCenter(unproject(p,zoom))
  }
  const endMapDrag=(e)=>{
    const d=dragRef.current
    dragRef.current=null
    if(d && !d.moved && onMapClick){
      onMapClick(fromClient(e.clientX,e.clientY))
    }
  }
  const wheel=(e)=>{
    e.preventDefault()
    e.stopPropagation()
    const rect=wrapRef.current?.getBoundingClientRect()
    if(!rect) return
    const x=e.clientX-rect.left, y=e.clientY-rect.top
    const before=fromClient(e.clientX,e.clientY)
    const direction=e.deltaY<0?1:-1
    setZoom(currentZoom=>{
      const nextZoom=Math.max(11,Math.min(18,currentZoom+direction))
      if(nextZoom===currentZoom) return currentZoom
      const nextPoint=project(before,nextZoom)
      const nextCenterPx={
        x:nextPoint.x-(x-size.w/2),
        y:nextPoint.y-(y-size.h/2)
      }
      setCenter(unproject(nextCenterPx,nextZoom))
      return nextZoom
    })
  }

  const fitLocations=(locations=[])=>{
    const points=locations.filter(p=>p?.lat!=null&&p?.lng!=null)
    if(!points.length) return
    if(points.length===1){
      setCenter(points[0])
      setZoom(current=>Math.max(current,15))
      return
    }
    const minLat=Math.min(...points.map(p=>p.lat)), maxLat=Math.max(...points.map(p=>p.lat))
    const minLng=Math.min(...points.map(p=>p.lng)), maxLng=Math.max(...points.map(p=>p.lng))
    const centerLat=(minLat+maxLat)/2
    const centerLng=(minLng+maxLng)/2
    const latSpan=Math.max(0.002,maxLat-minLat)
    const lngSpan=Math.max(0.002,(maxLng-minLng)*Math.cos(centerLat*Math.PI/180))
    const span=Math.max(latSpan,lngSpan)
    const usableWidth=Math.max(360,size.w-90), usableHeight=Math.max(280,size.h-110)
    const zoomX=Math.log2((360*usableWidth)/(TILE*span*1.35))
    const zoomY=Math.log2((180*usableHeight)/(TILE*span*1.35))
    const nextZoom=Math.max(11,Math.min(18,Math.floor(Math.min(zoomX,zoomY))))
    setCenter({lat:centerLat,lng:centerLng})
    setZoom(nextZoom)
  }

  useEffect(()=>{
    if(focusKey && focusLocations?.length) fitLocations(focusLocations)
    // focusKey is intentionally the trigger: moving vehicles should remain inside the
    // already fitted viewport instead of constantly recentering the map.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[focusKey])

  const beginMarkerDrag=(e,kind,item)=>{
    e.stopPropagation(); e.preventDefault()
    markerDragRef.current={kind,item}
    const move=(ev)=>{
      const ll=fromClient(ev.clientX,ev.clientY)
      markerDragRef.current={...markerDragRef.current,preview:ll}
      const el=document.getElementById(`pulse-drag-wrap-${item.id}`)
      if(el){ const s=toScreen(ll); el.style.left=`${s.x}px`; el.style.top=`${s.y}px` }
    }
    const up=(ev)=>{
      const ll=fromClient(ev.clientX,ev.clientY)
      if(kind==='risk') onMoveRiskZone?.(item.id,ll)
      if(kind==='alert') onMoveAlert?.(item.id,ll)
      markerDragRef.current=null
      window.removeEventListener('pointermove',move)
      window.removeEventListener('pointerup',up)
    }
    window.addEventListener('pointermove',move)
    window.addEventListener('pointerup',up)
  }

  const recenter=()=>{
    const important=incidents.find(i=>i.id===selectedId) || incidents[0]
    if(!important){ setCenter(initialCenter); return }
    const relatedIds=new Set([...(important.assignedUnits||[]),important.assignedUnit].filter(Boolean))
    const relatedUnits=units.filter(u=>relatedIds.has(u.id))
    fitLocations([important.location,...relatedUnits.map(u=>u.location).filter(Boolean)])
  }

  const routeLines=units.filter(u=>u.mission?.route?.length && ['en_route','dispatched','transporting','returning'].includes(u.status)).map(u=>({id:u.id,points:u.mission.route.map(toScreen)}))

  return <div className={`geo-map ${compact?'compact':''} ${theme==='ops'?'ops-theme':''} ${expanded?'expanded':''} ${className}`} ref={wrapRef} onPointerDown={beginMapDrag} onPointerMove={moveMap} onPointerUp={endMapDrag} onWheelCapture={wheel}>
    <img className="geo-offline-bg" src="/assets/stitch/situational-hybrid.webp" alt="" draggable="false"/>
    <div className="geo-tiles">
      {tiles.map(t=><img key={`${zoom}-${t.tx}-${t.ty}`} src={`https://tile.openstreetmap.org/${zoom}/${t.wrapped}/${t.ty}.png`} alt="" draggable="false" onError={e=>{e.currentTarget.style.display='none'}} style={{left:t.left,top:t.top,width:TILE,height:TILE}}/>) }
    </div>
    <div className="geo-tile-shade"/>

    {layers.routes && <svg className="geo-route-layer" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`}>
      {routeLines.map(route=><polyline key={route.id} points={route.points.map(p=>`${p.x},${p.y}`).join(' ')} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>) }
    </svg>}

    {layers.riskZones && riskZones.map(zone=>{
      const loc=locationOf(zone); if(!loc) return null
      const p=toScreen(loc); const r=radiusPx(loc.lat,zone.radiusM||180,zoom)
      return <div id={`pulse-drag-wrap-${zone.id}`} key={zone.id} className={`geo-risk-wrap ${zone.severity||'medium'}`} style={{left:p.x,top:p.y}}>
        <div className="geo-area" style={{width:r*2,height:r*2}}/>
        <button id={`pulse-drag-${zone.id}`} className={`geo-marker risk ${selectedId===zone.id?'selected':''}`} style={{left:0,top:0}} onClick={e=>{e.stopPropagation();if(onSelectRiskZone)onSelectRiskZone(zone);else{setCenter(loc);setZoom(z=>Math.max(z,15))}}} onPointerDown={draggableRiskId===zone.id?(e)=>beginMarkerDrag(e,'risk',zone):(e)=>e.stopPropagation()} type="button" title={`${zone.name || zone.title || (english?'Precaution zone':'Zona de precaución')} · ${zone.severity || (english?'unspecified risk':'riesgo sin nivel')}`} aria-label={`${zone.name || zone.title || (english?'Precaution zone':'Zona de precaución')}, ${english?'level':'nivel'} ${zone.severity || (english?'not defined':'sin definir')}, ${zone.reports || 0} ${english?'reports':'reportes'}`}><AlertTriangle size={15}/><span>{zone.reports||'!'}</span></button>
      </div>
    })}

    {layers.alerts && alerts.filter(a=>a.active!==false).map(alert=>{
      const loc=locationOf(alert); if(!loc) return null
      const p=toScreen(loc); const r=radiusPx(loc.lat,alert.radiusM||350,zoom)
      return <div id={`pulse-drag-wrap-${alert.id}`} key={alert.id} className={`geo-alert-wrap ${alert.severity||'info'}`} style={{left:p.x,top:p.y}}>
        <div className="geo-area" style={{width:r*2,height:r*2}}/>
        <button id={`pulse-drag-${alert.id}`} className={`geo-marker alert ${selectedId===alert.id?'selected':''}`} onClick={e=>{e.stopPropagation();if(onSelectAlert)onSelectAlert(alert);else{setCenter(loc);setZoom(z=>Math.max(z,15))}}} onPointerDown={draggableAlertId===alert.id?(e)=>beginMarkerDrag(e,'alert',alert):(e)=>e.stopPropagation()} type="button" title={`${alert.title || (english?'Alert':'Alerta')} · ${alert.severity || (english?'information':'información')}`} aria-label={`${english?'Alert':'Alerta'} ${alert.title || (english?'without title':'sin título')}, ${alert.severity || (english?'information':'información')}`}><MapPinned size={15}/></button>
      </div>
    })}

    {layers.history && historicalIncidents.map(point=>{
      const p=toScreen(point)
      return <span key={point.id} className={`geo-history-dot ${point.severity||'medium'}`} style={{left:p.x,top:p.y}} title={`${english?'Historical':'Histórico'} ${point.type||(english?'incident':'incidente')} · ${point.date||''}`}/>
    })}

    {layers.hospitals && hospitals.map(hospital=>{
      const loc=locationOf(hospital); if(!loc) return null
      const p=toScreen(loc)
      return <button key={hospital.id} type="button" className={`geo-marker hospital ${selectedId===hospital.id?'selected':''}`} style={{left:p.x,top:p.y}} onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();if(onSelectHospital)onSelectHospital(hospital);setCenter(loc);setZoom(z=>Math.max(z,15))}} title={`${hospital.name} · ${hospital.type||(english?'Medical center':'Centro médico')} · ${english?'simulated capacity':'capacidad simulada'} ${hospital.capacity||0}`} aria-label={`${english?'Center':'Centrar'} ${hospital.name}`}><Building2 size={14}/><span>{hospital.mapCode||'H'}</span></button>
    })}

    {layers.aiSuggestions && aiSuggestions.filter(item=>item.reviewStatus!=='rejected').map(item=>{
      const loc=locationOf(item); if(!loc) return null
      const p=toScreen(loc)
      const label=`${english?'Pending AI suggestion':'Sugerencia IA pendiente'}: ${item.title}. ${english?'Confidence':'Confianza'} ${item.confidence || 0} ${english?'percent':'por ciento'}. ${item.reason || ''}`
      return <button key={item.id} type="button" className={`geo-marker ai-suggestion ${selectedId===item.id?'selected':''}`} style={{left:p.x,top:p.y}} onPointerDown={event=>event.stopPropagation()} onClick={event=>{event.stopPropagation();onSelectAiSuggestion?.(item);setCenter(loc);setZoom(value=>Math.max(value,15))}} title={label} aria-label={label}><Sparkles size={15}/><span>{item.confidence || 0}%</span></button>
    })}

    {layers.incidents && incidents.map(incident=>{
      const loc=locationOf(incident); if(!loc) return null
      const p=toScreen(loc); const Icon=categoryIcon(incident.category)
      const assigned=[...new Set([...(incident.assignedUnits||[]),incident.assignedUnit].filter(Boolean))].length
      return <button key={incident.id} className={`geo-marker incident ${incident.priority?.toLowerCase()||'p2'} ${selectedId===incident.id?'selected':''} status-${incident.status}`} style={{left:p.x,top:p.y}} onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();if(onSelectIncident)onSelectIncident(incident);else{setCenter(loc);setZoom(z=>Math.max(z,15))}}} type="button" title={`${incident.code} · ${incident.title}`} aria-label={`${incident.priority || (english?'Priority not defined':'Prioridad sin definir')}, ${incident.code || (english?'incident':'incidente')}, ${incident.title}, ${english?'status':'estado'} ${incident.status || (english?'no status':'sin estado')}`}><Icon size={16}/>{assigned>0&&<b>{assigned}</b>}</button>
    })}

    {layers.units && units.map(unit=>{
      const loc=locationOf(unit); if(!loc) return null
      const p=toScreen(loc); const {Icon,tone,label}=getUnitVisual(unit)
      return <button key={unit.id} className={`geo-marker unit service-${tone} ${unit.status} ${selectedId===unit.id?'selected':''}`} style={{left:p.x,top:p.y}} onPointerDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();if(onSelectUnit)onSelectUnit(unit);else{setCenter(loc);setZoom(z=>Math.max(z,15))}}} type="button" title={`${unit.id} · ${label} · ${unit.type}`} aria-label={`${label} ${unit.id}, ${unit.type}, ${english?'status':'estado'} ${unit.status}`}><Icon size={15}/><span>{unit.id}</span></button>
    })}

    {userLocation?.lat!=null&&userLocation?.lng!=null&&(()=>{
      const p=toScreen(userLocation)
      const r=radiusPx(userLocation.lat,Math.max(8,Math.min(userLocation.accuracy||20,180)),zoom)
      return <div className="geo-user-location" style={{left:p.x,top:p.y}} title={`${english?'Your location · approximate accuracy':'Tu ubicación · precisión aproximada'} ${Math.round(userLocation.accuracy||0)} m`}>
        <span className="geo-user-accuracy" style={{width:r*2,height:r*2}}/>
        <span className="geo-user-marker"><Navigation size={15}/></span>
        <strong>{english?'You are here':'Estás aquí'}</strong>
      </div>
    })()}

    {showControls&&!compact&&<>
      <div className="geo-map-tools left" onPointerDown={e=>e.stopPropagation()}>
        <button type="button" aria-label={english?'Zoom in map':'Acercar mapa'} title={english?'Zoom in':'Acercar'} onClick={()=>setZoom(z=>Math.min(18,z+1))}><ZoomIn size={17}/></button>
        <button type="button" aria-label={english?'Zoom out map':'Alejar mapa'} title={english?'Zoom out':'Alejar'} onClick={()=>setZoom(z=>Math.max(11,z-1))}><ZoomOut size={17}/></button>
        <button type="button" aria-label={english?'Center important items':'Centrar elementos importantes'} title={english?'Center response':'Centrar respuesta'} onClick={recenter}><Crosshair size={17}/></button>
        {userLocation?.lat!=null&&<button type="button" aria-label={english?'Center my location':'Centrar mi ubicación'} title={english?'Center my location':'Centrar mi ubicación'} onClick={()=>{setCenter({lat:userLocation.lat,lng:userLocation.lng});setZoom(z=>Math.max(z,16))}}><Navigation size={17}/></button>}
        <button type="button" aria-label={expanded?(english?'Exit expanded map':'Salir de mapa ampliado'):(english?'Expand map':'Ampliar mapa')} title={expanded?(english?'Exit expanded view':'Salir de vista ampliada'):(english?'Expand map':'Ampliar mapa')} onClick={()=>setExpanded(v=>!v)}>{expanded?<Minimize2 size={17}/>:<Maximize2 size={17}/>}</button>
        <span className="geo-zoom-indicator">Z{zoom}</span>
      </div>
      <div className="geo-map-topbar" onPointerDown={e=>e.stopPropagation()}>
        <div className="geo-theme-switch"><button className={theme==='street'?'active':''} type="button" aria-pressed={theme==='street'} onClick={()=>setTheme('street')}>{english?'Map':'Mapa'}</button><button className={theme==='ops'?'active':''} type="button" aria-pressed={theme==='ops'} onClick={()=>setTheme('ops')}>{english?'Operations':'Operativo'}</button></div>
        <div className="geo-layer-control">
          <button className={`geo-layer-trigger ${layersOpen?'active':''}`} type="button" aria-expanded={layersOpen} aria-haspopup="menu" onClick={()=>setLayersOpen(v=>!v)}><Layers3 size={15}/>{english?'Layers':'Capas'}</button>
          {layersOpen&&<div className="geo-layer-menu">{Object.entries(english?{incidents:'Active accidents',units:'Units',alerts:'Alerts',riskZones:'Precaution places',routes:'Routes',hospitals:'Hospitals',history:'History',aiSuggestions:'AI suggestions'}:{incidents:'Accidentes activos',units:'Unidades',alerts:'Alertas',riskZones:'Lugares peligrosos',routes:'Rutas',hospitals:'Hospitales',history:'Históricos',aiSuggestions:'Sugerencias IA'}).map(([key,label])=><button key={key} className={layers[key]?'active':''} type="button" aria-pressed={layers[key]} onClick={()=>setLayers(v=>({...v,[key]:!v[key]}))}><span>{label}</span><i/></button>)}</div>}
        </div>
      </div>
    </>}

    {!compact&&<div className="geo-map-legend"><span><i className="incident"/>{english?'Incident':'Incidente'}</span><span><i className="unit"/>{english?'Unit':'Unidad'}</span><span><i className="risk"/>{english?'Caution':'Precaución'}</span><span><i className="alert"/>{english?'Official':'Oficial'}</span><span><i className="ai"/>{english?'AI pending':'IA pendiente'}</span><span><i className="hospital"/>{english?'Hospital':'Hospital'}</span><b>{english?'SIMULATION':'SIMULACIÓN'}</b></div>}
    <div className="geo-attribution">© OpenStreetMap contributors</div>
  </div>
}
