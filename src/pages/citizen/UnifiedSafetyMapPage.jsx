import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, BellRing, MapPin, Siren, Trash2 } from 'lucide-react'
import GeoMap from '../../components/GeoMap'
import { usePulse } from '../../context/PulseContext'

const STORAGE_KEY = 'pulse911-citizen-map-points'

function readStoredPoints(){
  try {
    const value=JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(value) ? value.slice(-50) : []
  } catch {
    return []
  }
}

export default function UnifiedSafetyMapPage(){
  const {db}=usePulse()
  const [pointType,setPointType]=useState(null)
  const [userPoints,setUserPoints]=useState(readStoredPoints)
  const [notice,setNotice]=useState('Elige un tipo de punto y después haz clic en el mapa.')

  useEffect(()=>{
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify(userPoints)) } catch {}
  },[userPoints])

  const publicIncidents=useMemo(()=>db.incidents.filter(i=>i.publicVisibility&&!['resolved','cancelled'].includes(i.status)),[db.incidents])
  const activeAlerts=useMemo(()=>db.alerts.filter(a=>a.active!==false),[db.alerts])
  const placedIncidents=useMemo(()=>userPoints.filter(p=>p.type==='accident').map(p=>({
    id:p.id,
    code:'PUNTO CIUDADANO',
    title:'Accidente señalado',
    category:'traffic_accident',
    priority:'P1',
    status:'received',
    publicVisibility:true,
    assignedUnits:[],
    location:p.location
  })),[userPoints])
  const placedRisks=useMemo(()=>userPoints.filter(p=>p.type==='danger').map(p=>({
    id:p.id,
    title:'Lugar peligroso',
    area:'Punto señalado por la ciudadanía',
    category:'road_hazard',
    severity:'medium',
    reports:1,
    radiusM:130,
    location:p.location
  })),[userPoints])

  const chooseType=type=>{
    setPointType(type)
    setNotice(type==='accident'?'Haz clic en el lugar del accidente.':'Haz clic en el lugar peligroso.')
  }
  const placePoint=location=>{
    if(!pointType){setNotice('Primero selecciona Accidente o Lugar peligroso.');return}
    const point={id:`citizen-${pointType}-${Date.now()}`,type:pointType,location:{...location,label:'Punto colocado en el mapa'}}
    setUserPoints(points=>[...points,point])
    setNotice(pointType==='accident'?'Accidente marcado en rojo.':'Lugar peligroso marcado en amarillo.')
    setPointType(null)
  }
  const clearPoints=()=>{
    setUserPoints([])
    setPointType(null)
    setNotice('Los puntos colocados por ti fueron eliminados.')
  }

  return <div className="unified-map-page">
    <header className="unified-map-heading">
      <div><h1>Mapa situacional</h1><p>Consulta alertas oficiales o señala un punto directamente sobre el mapa.</p></div>
      <div className="unified-map-counts"><span><i className="red"/>{publicIncidents.length} accidentes</span><span><i className="yellow"/>{(db.riskZones||[]).length} lugares peligrosos</span><span><i className="blue"/>{activeAlerts.length} alertas oficiales</span></div>
    </header>

    <div className="unified-map-workspace">
      <aside className="map-point-tools" aria-label="Herramientas para colocar puntos">
        <div className="map-point-tools-title"><MapPin size={20}/><div><strong>Colocar un punto</strong><span>Selecciona el tipo</span></div></div>
        <button type="button" className={`point-type-button accident ${pointType==='accident'?'active':''}`} aria-pressed={pointType==='accident'} onClick={()=>chooseType('accident')}><Siren size={22}/><span><strong>Accidente</strong><small>Punto rojo</small></span></button>
        <button type="button" className={`point-type-button danger ${pointType==='danger'?'active':''}`} aria-pressed={pointType==='danger'} onClick={()=>chooseType('danger')}><AlertTriangle size={22}/><span><strong>Lugar peligroso</strong><small>Punto amarillo</small></span></button>
        <div className={`map-placement-notice ${pointType?'active':''}`} role="status">{notice}</div>
        <div className="official-alert-note"><BellRing size={17}/><span><strong>Canales oficiales incluidos</strong><small>Las alertas activas aparecen en este mismo mapa.</small></span></div>
        {userPoints.length>0&&<button type="button" className="clear-map-points" onClick={clearPoints}><Trash2 size={15}/>Limpiar mis puntos ({userPoints.length})</button>}
      </aside>

      <section className={`unified-citizen-map ${pointType?'placing-point':''}`} aria-label="Mapa situacional interactivo">
        {pointType&&<div className={`map-placement-banner ${pointType}`}><span>{pointType==='accident'?'Accidente':'Lugar peligroso'}</span> Haz clic en cualquier parte del mapa</div>}
        <GeoMap
          incidents={[...publicIncidents,...placedIncidents]}
          units={db.units}
          alerts={activeAlerts}
          riskZones={[...(db.riskZones||[]),...placedRisks]}
          hospitals={db.hospitals||[]}
          historicalIncidents={db.historicalIncidents||[]}
          onMapClick={placePoint}
          initialZoom={14}
        />
      </section>
    </div>
  </div>
}
