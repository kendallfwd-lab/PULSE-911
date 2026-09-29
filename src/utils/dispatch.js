const RESPONSE_NEEDS = {
  medical: ['medical'],
  traffic_accident: ['medical', 'traffic_accident', 'rescue'],
  fire: ['fire', 'rescue', 'medical'],
  security: ['security', 'medical'],
  flood: ['rescue', 'medical', 'flood'],
  landslide: ['rescue', 'medical'],
  missing_person: ['rescue', 'security'],
  weather: ['rescue'],
  road_hazard: ['road_hazard', 'traffic_accident', 'rescue'],
  other: ['rescue', 'medical']
}
export function requiredCapabilities(category){ return RESPONSE_NEEDS[category] || RESPONSE_NEEDS.other }
function haversine(a,b){
  if(a?.lat == null || a?.lng == null || b?.lat == null || b?.lng == null) return 99
  const R=6371,toRad=d=>d*Math.PI/180,dLat=toRad(b.lat-a.lat),dLng=toRad(b.lng-a.lng)
  const x=Math.sin(dLat/2)**2+Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLng/2)**2
  return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))
}
export function compatibleUnits(incident,units,{includeBusy=false}={}){
  if(!incident) return []
  const needs=requiredCapabilities(incident.category)
  return units.filter(unit=>includeBusy||unit.status==='available').map(unit=>{
    const matches=(unit.capabilities||[]).filter(cap=>needs.includes(cap))
    const distanceKm=haversine(unit.location||unit.base,incident.location)
    const eta=Math.max(1,Math.ceil(distanceKm/0.55))
    const score=matches.length*120-eta*4-distanceKm*2+(unit.status==='available'?20:0)
    return {...unit,distanceKm:Number(distanceKm.toFixed(1)),eta,compatibility:matches,score}
  }).filter(unit=>unit.compatibility.length).sort((a,b)=>b.score-a.score||a.eta-b.eta||a.distanceKm-b.distanceKm)
}
