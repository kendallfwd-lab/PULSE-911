import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, BellRing, MapPin, Navigation, Siren, Trash2 } from 'lucide-react'
import GeoMap from '../../components/GeoMap'
import { usePulse } from '../../context/PulseContext'
import { useLiveLocation } from '../../context/LiveLocationContext'
import { AccessibleMapList } from '../../components/AccessibleMapList'
import { useTranslation } from 'react-i18next'
import {
  COSTA_RICA_CENTER,
  COSTA_RICA_OVERVIEW_ZOOM,
  NATIONAL_DEMO_INCIDENTS,
  NATIONAL_DEMO_RISK_ZONES
} from '../../data/costaRicaDemoMap'

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
  const {t,i18n}=useTranslation()
  const english=i18n.language.startsWith('en')
  const {db}=usePulse()
  const {location,status:locationStatus,error:locationError,start:startLocation,stop:stopLocation,isActive:locationActive}=useLiveLocation()
  const [pointType,setPointType]=useState(null)
  const [userPoints,setUserPoints]=useState(readStoredPoints)
  const [notice,setNotice]=useState(()=>t('map.instruction'))
  const [selectedPoint,setSelectedPoint]=useState(null)

  useEffect(()=>{
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify(userPoints)) } catch {}
  },[userPoints])

  const publicIncidents=useMemo(()=>db.incidents.filter(i=>i.publicVisibility&&!['resolved','cancelled'].includes(i.status)),[db.incidents])
  const activeAlerts=useMemo(()=>db.alerts.filter(a=>a.active!==false),[db.alerts])
  const placedIncidents=useMemo(()=>userPoints.filter(p=>p.type==='accident').map(p=>({
    id:p.id,
    code:t('map.citizenPoint'),
    title:t('map.markedAccident'),
    category:'traffic_accident',
    priority:'P1',
    status:'received',
    publicVisibility:true,
    assignedUnits:[],
    location:p.location
  })),[t,userPoints])
  const placedRisks=useMemo(()=>userPoints.filter(p=>p.type==='danger').map(p=>({
    id:p.id,
    title:t('map.danger'),
    area:t('map.citizenMarked'),
    category:'road_hazard',
    severity:'medium',
    reports:1,
    radiusM:130,
    location:p.location
  })),[t,userPoints])
  const mapIncidents=useMemo(()=>[...publicIncidents,...NATIONAL_DEMO_INCIDENTS,...placedIncidents],[publicIncidents,placedIncidents])
  const mapRiskZones=useMemo(()=>[...(db.riskZones||[]),...NATIONAL_DEMO_RISK_ZONES,...placedRisks],[db.riskZones,placedRisks])
  const simulatedCount=NATIONAL_DEMO_INCIDENTS.length+NATIONAL_DEMO_RISK_ZONES.length

  const chooseType=type=>{
    setPointType(type)
    setNotice(type==='accident'?t('map.instructionAccident'):t('map.instructionDanger'))
  }
  const placePoint=location=>{
    if(!pointType){setNotice(t('map.firstSelect'));return}
    const point={id:`citizen-${pointType}-${Date.now()}`,type:pointType,location:{...location,label:t('map.placedLabel')}}
    setUserPoints(points=>[...points,point])
    setNotice(pointType==='accident'?t('map.placedAccident'):t('map.placedDanger'))
    setPointType(null)
  }
  const clearPoints=()=>{
    setUserPoints([])
    setPointType(null)
    setNotice(t('map.cleared'))
  }

  return <div className="unified-map-page">
    <header className="unified-map-heading">
      <div><h1>{t('map.title')}</h1><p>{t('map.subtitle')}</p></div>
      <div className="unified-map-counts"><span><i className="red"/>{mapIncidents.length} {t('map.accidents')}</span><span><i className="red"/>{mapRiskZones.length} {t('map.dangerPlaces')}</span><span><i className="blue"/>{activeAlerts.length} {t('map.officialAlerts')}</span><span className="demo-count">{simulatedCount} {english?'simulated points':'puntos simulados'}</span></div>
    </header>

    <div className="unified-map-workspace">
      <aside className="map-point-tools" aria-label={t('map.tools')}>
        <div className={`live-location-panel ${locationActive?'active':''}`}>
          <div><Navigation size={19}/><span><strong>{t('map.liveLocation')}</strong><small>{locationStatus==='requesting'?t('common.requestingLocation'):locationActive&&location?`± ${Math.round(location.accuracy||0)} m`:t('map.permissionOnly')}</small></span></div>
          <button type="button" onClick={locationActive?stopLocation:startLocation}>{locationActive?t('common.stopLocation'):t('common.activateLocation')}</button>
          {locationError&&<p role="alert">{locationError}</p>}
        </div>
        <div className="map-point-tools-title"><MapPin size={20}/><div><strong>{t('map.placePoint')}</strong><span>{t('map.selectType')}</span></div></div>
        <div className="national-demo-note" role="note"><strong>{english?'National demo':'Demostración nacional'}</strong><span>{english?'Red points are fictional scenarios, not real emergencies.':'Los puntos rojos son escenarios ficticios, no emergencias reales.'}</span></div>
        <button type="button" className={`point-type-button accident ${pointType==='accident'?'active':''}`} aria-pressed={pointType==='accident'} onClick={()=>chooseType('accident')}><Siren size={22}/><span><strong>{t('map.accident')}</strong><small>{t('map.pointRed')}</small></span></button>
        <button type="button" className={`point-type-button danger ${pointType==='danger'?'active':''}`} aria-pressed={pointType==='danger'} onClick={()=>chooseType('danger')}><AlertTriangle size={22}/><span><strong>{t('map.danger')}</strong><small>{t('map.pointYellow')}</small></span></button>
        <div className={`map-placement-notice ${pointType?'active':''}`} role="status">{notice}</div>
        <div className="official-alert-note"><BellRing size={17}/><span><strong>{t('map.officialChannels')}</strong><small>{t('map.officialDetail')}</small></span></div>
        {userPoints.length>0&&<button type="button" className="clear-map-points" onClick={clearPoints}><Trash2 size={15}/>{t('map.clear')} ({userPoints.length})</button>}
      </aside>

      <section className={`unified-citizen-map ${pointType?'placing-point':''}`} aria-label={t('map.interactive')}>
        <div className="national-demo-badge" role="status"><strong>{english?'NATIONAL SIMULATION':'SIMULACIÓN NACIONAL'}</strong><span>{simulatedCount} {english?'fictional points':'puntos ficticios'}</span></div>
        {pointType&&<div className={`map-placement-banner ${pointType}`}><span>{pointType==='accident'?t('map.accident'):t('map.danger')}</span> {t('map.clickAnywhere')}</div>}
        <GeoMap
          incidents={mapIncidents}
          units={db.units}
          alerts={activeAlerts}
          riskZones={mapRiskZones}
          hospitals={db.hospitals||[]}
          historicalIncidents={db.historicalIncidents||[]}
          aiSuggestions={db.aiSuggestions||[]}
          userLocation={location}
          selectedId={selectedPoint?.id}
          focusLocations={selectedPoint?.location?[selectedPoint.location]:(location?[location]:[])}
          focusKey={selectedPoint?.id || (location?'live-location-ready':'')}
          onSelectIncident={setSelectedPoint}
          onSelectRiskZone={setSelectedPoint}
          onSelectAlert={setSelectedPoint}
          onSelectHospital={setSelectedPoint}
          onSelectAiSuggestion={setSelectedPoint}
          onMapClick={placePoint}
          initialCenter={COSTA_RICA_CENTER}
          initialZoom={COSTA_RICA_OVERVIEW_ZOOM}
        />
      </section>
    </div>
    <AccessibleMapList incidents={mapIncidents} alerts={activeAlerts} riskZones={mapRiskZones} hospitals={db.hospitals||[]} aiSuggestions={db.aiSuggestions||[]} referenceLocation={location} onSelect={setSelectedPoint}/>
  </div>
}
