import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import seed from '../../db.json'
import { INCIDENT_MEDIA } from '../utils/incidentMedia'
import { clearSession, clearStored, loadSession, loadStored, saveSession, saveStored, STORAGE_KEY, SESSION_KEY } from '../services/storageService'
import { makeNotification } from '../services/notificationService'
import { calculateRiskScore, findDuplicateCandidates, mergeIncidents, distanceKm } from '../utils/incidentEngine'
import { DEMO_MAP_CENTER, migrateDemoGeography } from '../config/demoGeography'
import { DATA_MODE, pulseDataGateway } from '../services/pulseDataGateway'

const PulseContext = createContext(null)
const nowIso = () => new Date().toISOString()
const clone = value => JSON.parse(JSON.stringify(value))
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('pulse911-demo-v6') : null

function routeBetween(start, end) {
  const steps = 24
  const out = []
  const dx = end.lng - start.lng
  const dy = end.lat - start.lat
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const bend = Math.sin(t * Math.PI) * 0.0015
    out.push({ lat: start.lat + dy * t + bend, lng: start.lng + dx * t - bend * 0.6 })
  }
  return out
}
function routePosition(route, progress) {
  if (!route?.length) return null
  if (progress <= 0) return route[0]
  if (progress >= 1) return route[route.length - 1]
  const scaled = progress * (route.length - 1)
  const index = Math.floor(scaled)
  const frac = scaled - index
  const a = route[index], b = route[index + 1] || a
  return { lat: a.lat + (b.lat - a.lat) * frac, lng: a.lng + (b.lng - a.lng) * frac }
}
function missionTiming(start, end, minDurationMs = 18000) {
  const etaMin = Math.max(2, Math.ceil(distanceKm(start, end) / 0.55))
  return { etaMin, durationMs: Math.max(minDurationMs, etaMin * 12000) }
}
function requestRoadRoute(start, end) {
  if (typeof fetch !== 'function') return Promise.resolve(null)
  const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
  return fetch(url)
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(data => {
      const coordinates = data?.routes?.[0]?.geometry?.coordinates
      return Array.isArray(coordinates) && coordinates.length >= 2
        ? coordinates.map(([lng, lat]) => ({ lat, lng }))
        : null
    })
    .catch(() => null)
}
function activity(type, label, meta = {}) { return { id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, type, label, at: nowIso(), ...meta } }
function normalizeDb(raw) {
  const base = migrateDemoGeography(clone(raw))
  return {
    ...base,
    incidents: base.incidents || [], units: base.units || [], alerts: base.alerts || [], riskZones: base.riskZones || [],
    hospitals: base.hospitals || [], historicalIncidents: base.historicalIncidents || [], activityLogs: base.activityLogs || [],
    resources: base.resources || [], courses: base.courses || [], users: base.users || [], publications: base.publications || [],
    notifications: base.notifications || [], courseProgress: base.courseProgress || {}, scenarios: base.scenarios || [],
    auditLogs: base.auditLogs || [], roadStatus: base.roadStatus?.length ? base.roadStatus : (seed.roadStatus || []),
    aiSuggestions: base.aiSuggestions?.length ? base.aiSuggestions : (seed.aiSuggestions || []),
    trafficEvents: base.trafficEvents?.length ? base.trafficEvents : (seed.trafficEvents || []), translations: base.translations || {}, aiConversations: base.aiConversations || [],
    routeQueries: base.routeQueries || [], externalSources: base.externalSources?.length ? base.externalSources : (seed.externalSources || []),
  }
}

export function PulseProvider({ children }) {
  const [db, setDb] = useState(() => normalizeDb(loadStored(seed)))
  const [sessionId, setSessionId] = useState(loadSession)
  const [simulationSpeed, setSimulationSpeed] = useState(4)
  const [simulationPaused, setSimulationPaused] = useState(false)
  const [lastSyncAt, setLastSyncAt] = useState(null)
  const speedRef = useRef(simulationSpeed), pausedRef = useRef(simulationPaused), lastMovementPersistRef = useRef(0)
  speedRef.current = simulationSpeed; pausedRef.current = simulationPaused

  const commit = updater => {
    setDb(prev => {
      const next = normalizeDb(typeof updater === 'function' ? updater(prev) : updater)
      saveStored(next)
      channel?.postMessage({ type: 'db', payload: next })
      return next
    })
  }
  const appendAudit = (state, label, meta = {}) => ({ ...state, auditLogs: [...(state.auditLogs || []), activity('audit', label, meta)].slice(-300) })
  const pushNotification = (state, notification) => ({ ...state, notifications: [notification, ...(state.notifications || [])].slice(0, 100) })

  useEffect(() => {
    const onStorage = e => {
      if (e.key === STORAGE_KEY && e.newValue) try { setDb(normalizeDb(JSON.parse(e.newValue))) } catch {}
      if (e.key === SESSION_KEY) setSessionId(e.newValue)
    }
    const onChannel = e => { if (e.data?.type === 'db') setDb(normalizeDb(e.data.payload)) }
    window.addEventListener('storage', onStorage); channel?.addEventListener('message', onChannel)
    return () => { window.removeEventListener('storage', onStorage); channel?.removeEventListener('message', onChannel) }
  }, [])

  const syncNow = async () => {
    if (DATA_MODE !== 'n8n') { setLastSyncAt(nowIso()); return { ok: true, local: true } }
    try {
      const response = await pulseDataGateway.pull({ since: lastSyncAt })
      const remote = response?.data || response
      if (remote && typeof remote === 'object') {
        const allowed = ['incidents', 'alerts', 'riskZones', 'publications', 'roadStatus', 'aiSuggestions', 'trafficEvents', 'externalSources']
        commit(prev => allowed.reduce((next, key) => Array.isArray(remote[key]) ? { ...next, [key]: remote[key] } : next, prev))
      }
      const syncedAt = nowIso(); setLastSyncAt(syncedAt); return { ok: true, syncedAt }
    } catch (error) { return { ok: false, message: error.message } }
  }

  useEffect(() => {
    if (DATA_MODE !== 'n8n') return undefined
    let timer
    const schedule = () => { window.clearInterval(timer); if (!document.hidden) timer = window.setInterval(syncNow, 30000) }
    const visibility = () => { schedule(); if (!document.hidden) syncNow() }
    document.addEventListener('visibilitychange', visibility)
    syncNow(); schedule()
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', visibility) }
  // The remote mode is fixed at build time; lastSyncAt is intentionally read when each poll runs.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      if (pausedRef.current) return
      const tick = Date.now()
      setDb(prev => {
        let changed = false
        const arrivals = []
        const units = prev.units.map(unit => {
          if (!unit.mission?.route?.length || !['en_route', 'transporting', 'returning'].includes(unit.status)) return unit
          const m = unit.mission
          const last = m.lastTick || tick
          const delta = Math.max(0, tick - last)
          const progress = Math.min(1, (m.progress || 0) + (delta * speedRef.current) / (m.durationMs || 60000))
          const location = routePosition(m.route, progress) || unit.location
          changed = true
          if (progress >= 1) arrivals.push({ unit, mission: m })
          return progress >= 1
            ? { ...unit, location, status: m.mode === 'to_hospital' ? 'at_hospital' : m.mode === 'returning' ? 'available' : 'on_scene', assignedIncident: m.mode === 'returning' ? null : unit.assignedIncident, mission: m.mode === 'returning' ? null : { ...m, progress: 1, lastTick: tick, arrivedAt: nowIso() } }
            : { ...unit, location, mission: { ...m, progress, lastTick: tick } }
        })
        if (!changed) return prev
        let incidents = prev.incidents
        let next = { ...prev, units }
        arrivals.forEach(({ unit, mission }) => {
          if (mission.mode === 'to_hospital') {
            incidents = incidents.map(i => i.id !== mission.incidentId ? i : ({ ...i, status: 'at_hospital', hospitalStatus: 'patient_received', timeline: [...(i.timeline || []), { id: `tl-${Date.now()}-${unit.id}`, status: 'at_hospital', label: `${unit.id} llegó al hospital ${i.hospitalDestination?.name || 'seleccionado'}`, at: nowIso() }] }))
            next = pushNotification(next, makeNotification('transport', 'Llegada al hospital', `${unit.id} llegó al hospital asignado. El operador puede cerrar el caso y liberar el recurso.`, { incidentId: mission.incidentId }))
          } else if (mission.mode === 'returning') {
            const baseHospital = prev.hospitals.find(hospital => hospital.id === unit.baseHospitalId)
            next = pushNotification(next, makeNotification('unit', 'Unidad disponible', `${unit.id} regresó a ${baseHospital?.shortName || baseHospital?.name || 'su base'} y está disponible.`))
          } else {
            incidents = incidents.map(i => i.id !== mission.incidentId ? i : ({ ...i, status: 'on_scene', eta: 0, timeline: [...(i.timeline || []), { id: `tl-${Date.now()}-${unit.id}`, status: 'on_scene', label: `${unit.id} llegó al lugar del incidente`, at: nowIso() }] }))
            next = pushNotification(next, makeNotification('arrival', 'Unidad en sitio', `${unit.id} llegó al incidente.`, { incidentId: mission.incidentId, unitId: unit.id }))
          }
        })
        next = { ...next, incidents, activityLogs: [...(next.activityLogs || []), ...arrivals.map(({ unit, mission }) => activity('movement', `${unit.id} completó ${mission.mode || 'respuesta'}`, { incidentId: mission.incidentId, unitId: unit.id }))].slice(-180) }
        if (arrivals.length) next = appendAudit(next, `${arrivals.length} movimiento(s) completado(s)`)
        if (arrivals.length || tick - lastMovementPersistRef.current >= 4000) {
          saveStored(next)
          channel?.postMessage({ type: 'db', payload: next })
          lastMovementPersistRef.current = tick
        }
        return next
      })
    }, 800)
    return () => clearInterval(timer)
  }, [])

  const currentUser = db.users.find(u => u.id === sessionId) || null
  const login = async (email, password) => {
    const normalizedEmail=email.trim().toLowerCase()
    const localUser=db.users.find(user=>user.email.toLowerCase()===normalizedEmail&&user.password===password)
    if(localUser){
      try{
        const response=await fetch('/api/users/sync',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:localUser.id,email:localUser.email,password:localUser.password,role:localUser.role,profile:localUser.profile,profileComplete:localUser.profileComplete})})
        const result=await response.json()
        if(!response.ok)return {ok:false,message:result.message||'No se pudo sincronizar la cuenta con db.json.'}
        const user={...result.user,password:localUser.password}
        commit(prev=>({...prev,users:[user,...prev.users.filter(existing=>existing.id!==user.id&&existing.email.toLowerCase()!==user.email.toLowerCase())]}))
        saveSession(user.id);setSessionId(user.id);return {ok:true,user}
      }catch{
        return {ok:false,message:'No se pudo sincronizar la cuenta con db.json. Verifica que el servidor local esté activo.'}
      }
    }
    try{
      const response=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:normalizedEmail,password})})
      const result=await response.json()
      if(!response.ok)return {ok:false,message:result.message||'Correo o contraseña incorrectos.'}
      const user=result.user
      commit(prev=>({...prev,users:[user,...prev.users.filter(existing=>existing.id!==user.id&&existing.email.toLowerCase()!==user.email.toLowerCase())]}))
      saveSession(user.id);setSessionId(user.id);return {ok:true,user}
    }catch{
      return {ok:false,message:'No se pudo conectar con la base local de cuentas.'}
    }
  }
  const logout = () => { clearSession(); setSessionId(null) }
  const register = async ({ fullName, email, password }) => {
    const normalizedEmail=email.trim().toLowerCase()
    if(db.users.some(user=>user.email.toLowerCase()===normalizedEmail))return {ok:false,message:'Ya existe una cuenta con ese correo.'}
    try{
      const response=await fetch('/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fullName,email:normalizedEmail,password})})
      const result=await response.json()
      if(!response.ok)return {ok:false,message:result.message||'No se pudo crear la cuenta.'}
      const user=result.user
      commit(prev=>appendAudit({...prev,users:[user,...prev.users.filter(existing=>existing.email.toLowerCase()!==user.email.toLowerCase())]},'Nueva cuenta ciudadana creada',{userId:user.id}))
      saveSession(user.id);setSessionId(user.id);return {ok:true,user}
    }catch{
      return {ok:false,message:'No se pudo guardar la cuenta en db.json. Verifica que el servidor local esté activo.'}
    }
  }
  const createUserByAdmin = async ({ fullName, email, password, role }) => {
    if(currentUser?.role!=='admin')return {ok:false,message:'Solo una cuenta administradora puede crear usuarios.'}
    const normalizedEmail=email.trim().toLowerCase()
    if(db.users.some(user=>user.email.toLowerCase()===normalizedEmail))return {ok:false,message:'Ya existe una cuenta con ese correo.'}
    try{
      const response=await fetch('/api/admin/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({actorId:currentUser.id,fullName,email:normalizedEmail,password,role})})
      const result=await response.json()
      if(!response.ok)return {ok:false,message:result.message||'No se pudo crear el usuario.'}
      const user=result.user
      commit(prev=>appendAudit({...prev,users:[user,...prev.users.filter(existing=>existing.email.toLowerCase()!==user.email.toLowerCase())]},'Usuario creado desde administración',{userId:user.id,role:user.role,createdBy:currentUser.id}))
      return {ok:true,user}
    }catch{
      return {ok:false,message:'No se pudo guardar el usuario en db.json. Verifica que el servidor local esté activo.'}
    }
  }
  const updateProfile = async profile => {
    if(!currentUser)return {ok:false,message:'No hay una sesión ciudadana activa.'}
    try{
      const response=await fetch(`/api/users/${encodeURIComponent(currentUser.id)}/profile`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({profile})})
      const result=await response.json()
      if(!response.ok)return {ok:false,message:result.message||'No se pudo guardar la ficha.'}
      const user=result.user
      commit(prev=>appendAudit({...prev,users:prev.users.map(existing=>existing.id===user.id?user:existing)},'Perfil ciudadano actualizado',{userId:user.id}))
      return {ok:true,user}
    }catch{
      return {ok:false,message:'No se pudo guardar la ficha en db.json. Verifica que el servidor local esté activo.'}
    }
  }

  const addIncident = payload => {
    if (!currentUser) return null
    const number = 500 + db.incidents.length + 1
    const base = { id: `inc-${Date.now()}`, code: `P-2026-${String(number).padStart(6, '0')}`, citizenId: payload.citizenId || (currentUser.role==='citizen' ? currentUser.id : null), category: payload.category, subcategory: payload.subcategory || '', title: payload.title, description: payload.description, priority: payload.priority || 'P2', status: 'received', createdAt: nowIso(), updatedAt: nowIso(), location: payload.location, details: payload.details || {}, canTalk: payload.canTalk, publicVisibility: Boolean(payload.publicVisibility), assignedUnit: null, assignedUnits: [], eta: null, image: payload.imageData || INCIDENT_MEDIA[payload.category] || INCIDENT_MEDIA.other, photos: payload.imageData ? [payload.imageData] : [], riskScore: 0, riskReasons: [], duplicateCount: 1, duplicateCandidates: [], timeline: [{ id: `tl-${Date.now()}`, status: 'received', label: 'Reporte recibido por PULSE Command', at: nowIso() }], communications: [], notes: '' }
    const calc = calculateRiskScore(base, db.riskZones)
    base.riskScore = calc.score; base.riskReasons = calc.reasons; base.priority = calc.priority
    const candidates = findDuplicateCandidates(base, db.incidents)
    base.duplicateCandidates = candidates.map(i => i.id)
    if (candidates.length) base.timeline.push({ id: `tl-dup-${Date.now()}`, status: 'received', label: `Sistema detectó ${candidates.length} posible(s) reporte(s) duplicado(s)`, at: nowIso() })
    const notification = makeNotification('incident', 'Nuevo reporte recibido', `${base.code} · ${base.title}`, { incidentId: base.id })
    commit(prev => appendAudit(pushNotification({ ...prev, incidents: [base, ...prev.incidents], activityLogs: [...(prev.activityLogs || []), activity('incident', `Nuevo reporte ${base.code}`, { incidentId: base.id })].slice(-180) }, notification), 'Reporte ciudadano creado', { incidentId: base.id }))
    return base
  }

  const updateIncident = (id, patch, timelineLabel) => commit(prev => {
    const incidents = prev.incidents.map(incident => incident.id !== id ? incident : { ...incident, ...patch, updatedAt: nowIso(), timeline: timelineLabel ? [...(incident.timeline || []), { id: `tl-${Date.now()}`, status: patch.status || incident.status, label: timelineLabel, at: nowIso() }] : (incident.timeline || []) })
    return appendAudit({ ...prev, incidents, activityLogs: timelineLabel ? [...(prev.activityLogs || []), activity('incident', timelineLabel, { incidentId: id })].slice(-180) : (prev.activityLogs || []) }, timelineLabel || 'Incidente actualizado', { incidentId: id })
  })

  const dispatchUnit = (incidentId, unitId) => {
    let result = { ok: false, message: 'No se pudo despachar.' }
    commit(prev => {
      const incident = prev.incidents.find(i => i.id === incidentId), unit = prev.units.find(u => u.id === unitId)
      if (!incident || !unit) { result = { ok: false, message: 'Incidente o unidad no encontrada.' }; return prev }
      if (unit.status !== 'available') { result = { ok: false, message: `${unit.id} no está disponible.` }; return prev }
      const start = unit.location || unit.base, end = incident.location
      if (start?.lat == null || start?.lng == null || end?.lat == null || end?.lng == null) { result = { ok: false, message: 'La unidad o el incidente no tiene coordenadas.' }; return prev }
      const { etaMin, durationMs } = missionTiming(start, end)
      const route = routeBetween(start, end)
      const baseHospital = prev.hospitals.find(hospital => hospital.id === unit.baseHospitalId)
      const baseName = baseHospital?.shortName || baseHospital?.name || 'su base operativa'
      const mission = { incidentId, mode: 'to_scene', route, progress: 0, lastTick: Date.now(), durationMs, etaMin, startedAt: nowIso() }
      const units = prev.units.map(u => u.id === unitId ? { ...u, status: 'en_route', assignedIncident: incidentId, mission } : u)
      const incidents = prev.incidents.map(i => i.id !== incidentId ? i : ({ ...i, status: 'en_route', assignedUnits: [...new Set([...(i.assignedUnits || []), unitId])], assignedUnit: i.assignedUnit || unitId, eta: Math.min(...[...(i.assignedUnits || []), unitId].map(uid => uid === unitId ? etaMin : (prev.units.find(x => x.id === uid)?.eta || 99))), timeline: [...(i.timeline || []), { id: `tl-${Date.now()}-${unitId}`, status: 'en_route', label: `${unitId} salió de ${baseName} y está en ruta`, at: nowIso() }] }))
      const notification = makeNotification('dispatch', 'Unidad despachada', `${unitId} salió de ${baseName} hacia ${incident.code}.`, { incidentId, unitId, citizenId: incident.citizenId })
      result = { ok: true, start, end }
      return appendAudit(pushNotification({ ...prev, units, incidents, activityLogs: [...(prev.activityLogs || []), activity('dispatch', `${unitId} despachada a ${incident.code}`, { incidentId, unitId })].slice(-180) }, notification), 'Despacho ejecutado', { incidentId, unitId })
    })
    if (result.ok) {
      const { start, end } = result
      requestRoadRoute(start, end).then(routed => {
        if (!routed) return
        commit(prev => ({ ...prev, units: prev.units.map(u => u.id === unitId && u.status === 'en_route' && u.mission?.incidentId === incidentId ? { ...u, mission: { ...u.mission, route: routed } } : u) }))
      })
    }
    return result
  }

  const startTransport = (incidentId, unitId, hospitalId) => {
    let result = { ok: false, message: 'No se pudo iniciar el traslado.' }
    commit(prev => {
      const incident = prev.incidents.find(i => i.id === incidentId), unit = prev.units.find(u => u.id === unitId), hospital = prev.hospitals.find(h => h.id === hospitalId)
      if (!incident || !unit || !hospital) { result.message = 'Faltan datos del incidente, unidad u hospital.'; return prev }
      if (unit.status !== 'on_scene') { result.message = 'La unidad debe estar en sitio antes del traslado.'; return prev }
      if (hospital.status === 'full') { result.message = 'El hospital seleccionado está lleno.'; return prev }
      if (hospital.receivesTransfers === false) { result.message = 'Este centro funciona como base local, no como destino hospitalario de traslado.'; return prev }
      const start = unit.location, end = hospital.location
      const { etaMin, durationMs } = missionTiming(start, end, 16000)
      const route = routeBetween(start, end)
      const mission = { incidentId, mode: 'to_hospital', route, progress: 0, lastTick: Date.now(), durationMs, etaMin, startedAt: nowIso(), hospitalId }
      const units = prev.units.map(u => u.id === unitId ? { ...u, status: 'transporting', mission } : u)
      const incidents = prev.incidents.map(i => i.id !== incidentId ? i : ({ ...i, status: 'transporting', hospitalDestination: hospital, timeline: [...(i.timeline || []), { id: `tl-${Date.now()}`, status: 'transporting', label: `${unitId} inició traslado hacia ${hospital.name}`, at: nowIso() }] }))
      result = { ok: true, start, end }
      return appendAudit(pushNotification({ ...prev, units, incidents }, makeNotification('transport', 'Traslado iniciado', `${unitId} se dirige a ${hospital.name}.`, { incidentId, unitId })), 'Traslado hospitalario iniciado', { incidentId, unitId, hospitalId })
    })
    if (result.ok) {
      requestRoadRoute(result.start, result.end).then(routed => {
        if (!routed) return
        commit(prev => ({ ...prev, units: prev.units.map(u => u.id === unitId && u.status === 'transporting' && u.mission?.incidentId === incidentId ? { ...u, mission: { ...u.mission, route: routed } } : u) }))
      })
    }
    return result
  }

  const returnUnit = unitId => {
    let result = { ok: false }
    commit(prev => {
      const unit = prev.units.find(u => u.id === unitId)
      if (!unit) return prev
      const start = unit.location || unit.base, end = unit.base || unit.location
      const { etaMin, durationMs } = missionTiming(start, end, 14000)
      const route = routeBetween(start, end)
      const baseHospital = prev.hospitals.find(hospital => hospital.id === unit.baseHospitalId)
      const baseName = baseHospital?.shortName || baseHospital?.name || 'base operativa'
      result = { ok: true, start, end }
      return appendAudit({ ...prev, units: prev.units.map(u => u.id === unitId ? { ...u, status: 'returning', mission: { incidentId: u.assignedIncident, mode: 'returning', route, progress: 0, lastTick: Date.now(), durationMs, etaMin, destinationName: baseName } } : u) }, `Unidad ${unitId} regresando a ${baseName}`, { unitId })
    })
    if (result.ok) {
      requestRoadRoute(result.start, result.end).then(routed => {
        if (!routed) return
        commit(prev => ({ ...prev, units: prev.units.map(u => u.id === unitId && u.status === 'returning' ? { ...u, mission: { ...u.mission, route: routed } } : u) }))
      })
    }
    return result
  }

  const closeIncident = (id, resolution = {}) => {
    const returningRoutes = []
    commit(prev => {
      const incident = prev.incidents.find(i => i.id === id)
      if (!incident) return prev
      const incidents = prev.incidents.map(i => i.id === id ? { ...i, status: 'resolved', resolution, closedAt: nowIso(), updatedAt: nowIso(), timeline: [...(i.timeline || []), { id: `tl-${Date.now()}`, status: 'resolved', label: 'Incidente cerrado por operador', at: nowIso() }] } : i)
      let next = { ...prev, incidents }
      next = pushNotification(next, makeNotification('resolution', 'Incidente resuelto', `${incident.code} fue marcado como resuelto.`, { incidentId: id, citizenId: incident.citizenId }))
      next = appendAudit(next, `Incidente ${incident.code} cerrado`, { incidentId: id })
      const unitIds = [...new Set([...(incident.assignedUnits || []), incident.assignedUnit].filter(Boolean))]
      next.units = next.units.map(u => {
        if (!unitIds.includes(u.id) || !['en_route', 'on_scene', 'transporting', 'at_hospital'].includes(u.status)) return u
        const start = u.location, end = u.base || u.location
        const { etaMin, durationMs } = missionTiming(start, end, 14000)
        returningRoutes.push({ unitId: u.id, start, end })
        return { ...u, status: 'returning', mission: { incidentId: id, mode: 'returning', route: routeBetween(start, end), progress: 0, lastTick: Date.now(), durationMs, etaMin } }
      })
      return next
    })
    returningRoutes.forEach(({ unitId, start, end }) => {
      requestRoadRoute(start, end).then(routed => {
        if (!routed) return
        commit(prev => ({ ...prev, units: prev.units.map(u => u.id === unitId && u.status === 'returning' && u.mission?.incidentId === id ? { ...u, mission: { ...u.mission, route: routed } } : u) }))
      })
    })
  }

  const addAlert = alert => {
    const next = { id: `alert-${Date.now()}`, ...alert, issuedAt: nowIso(), active: true, status: 'active', radiusM: Number(alert.radiusM || 350), location: alert.location || { ...DEMO_MAP_CENTER } }
    commit(prev => appendAudit(pushNotification({ ...prev, alerts: [next, ...prev.alerts], activityLogs: [...(prev.activityLogs || []), activity('alert', `Alerta publicada: ${next.title}`, { alertId: next.id })].slice(-180) }, makeNotification('alert', 'Nueva alerta geográfica', next.title, { alertId: next.id })), 'Alerta geográfica publicada', { alertId: next.id }))
    return next
  }
  const updateAlert = (id, patch) => commit(prev => appendAudit({ ...prev, alerts: prev.alerts.map(a => a.id === id ? { ...a, ...patch } : a), activityLogs: [...(prev.activityLogs || []), activity('alert', 'Alerta geográfica actualizada', { alertId: id })].slice(-180) }, 'Alerta geográfica actualizada', { alertId: id }))
  const deleteAlert = id => commit(prev => appendAudit({ ...prev, alerts: prev.alerts.filter(a => a.id !== id) }, 'Alerta geográfica eliminada', { alertId: id }))
  const createAlertFromIncident = incidentId => {
    const incident = db.incidents.find(i => i.id === incidentId)
    if (!incident) return null
    return addAlert({ title: `Precaución: ${incident.title}`, type: incident.category, severity: incident.priority === 'P1' ? 'warning' : 'info', description: `Aviso operativo asociado al incidente ${incident.code}.`, area: incident.location.label, instructions: 'Reduzca la velocidad y siga las indicaciones oficiales de la zona.', radiusM: 450, location: incident.location, sourceIncidentId: incident.id })
  }

  const addRiskZone = zone => {
    const next = { id: `risk-${Date.now()}`, title: zone.title, area: zone.area, severity: zone.severity || 'medium', category: zone.category || 'road_hazard', reports: Number(zone.reports || 1), radiusM: Number(zone.radiusM || 180), location: zone.location || { ...DEMO_MAP_CENTER }, description: zone.description || '', image: zone.image || INCIDENT_MEDIA[zone.category] || INCIDENT_MEDIA.road_hazard, createdAt: nowIso() }
    commit(prev => appendAudit({ ...prev, riskZones: [next, ...(prev.riskZones || [])], activityLogs: [...(prev.activityLogs || []), activity('risk', `Zona de riesgo registrada: ${next.title}`, { riskId: next.id })].slice(-180) }, 'Zona de riesgo registrada', { riskId: next.id }))
    return next
  }
  const updateRiskZone = (id, patch) => commit(prev => appendAudit({ ...prev, riskZones: (prev.riskZones || []).map(z => z.id === id ? { ...z, ...patch, updatedAt: nowIso() } : z) }, 'Zona de riesgo actualizada', { riskId: id }))
  const deleteRiskZone = id => commit(prev => appendAudit({ ...prev, riskZones: (prev.riskZones || []).filter(z => z.id !== id) }, 'Zona de riesgo eliminada', { riskId: id }))

  const addPublication = payload => {
    if (!currentUser) return null
    const publication = { id: `pub-${Date.now()}`, authorId: currentUser.id, status: 'pending', createdAt: nowIso(), ...payload }
    commit(prev => appendAudit({ ...prev, publications: [publication, ...(prev.publications || [])] }, 'Nuevo reporte ciudadano', { publicationId: publication.id }))
    return publication
  }
  const updatePublication = (id, patch) => commit(prev => appendAudit({ ...prev, publications: (prev.publications || []).map(p => p.id === id ? { ...p, ...patch, updatedAt: nowIso() } : p) }, 'Publicación comunitaria actualizada', { publicationId: id }))

  const confirmSituation = (entityType, id, response) => {
    const allowed = ['continues', 'cleared', 'incorrect']
    if (!allowed.includes(response)) return { ok: false, message: 'Respuesta inválida.' }
    const userKey = currentUser?.id || 'guest'
    const storageKey = `pulse911-confirmation:${userKey}:${entityType}:${id}`
    try { if (sessionStorage.getItem(storageKey)) return { ok: false, message: 'Ya registraste una confirmación en esta sesión.' } } catch {}
    const collection = entityType === 'publication' ? 'publications' : 'incidents'
    const field = response === 'continues' ? 'confirmationCount' : response === 'cleared' ? 'clearedCount' : 'incorrectCount'
    let found = false
    commit(prev => ({ ...prev, [collection]: (prev[collection] || []).map(item => {
      if (item.id !== id) return item
      found = true
      return { ...item, [field]: Number(item[field] || 0) + 1, lastVerifiedAt: nowIso(), verificationStatus: response === 'continues' && Number(item.confirmationCount || 0) >= 2 ? 'community_confirmed' : (item.verificationStatus || 'reviewing') }
    }) }))
    if (!found) return { ok: false, message: 'Registro no encontrado.' }
    try { sessionStorage.setItem(storageKey, response) } catch {}
    return { ok: true }
  }

  const updateAiSuggestion = (id, patch) => commit(prev => appendAudit({ ...prev, aiSuggestions: (prev.aiSuggestions || []).map(item => item.id === id ? { ...item, ...patch, reviewedAt: nowIso(), reviewedBy: currentUser?.id } : item) }, 'Sugerencia IA revisada', { suggestionId: id, reviewStatus: patch.reviewStatus }))
  const addAiSuggestion = suggestion => {
    if (!suggestion?.id || !suggestion?.type || !suggestion?.location) return null
    const next = { ...suggestion, reviewStatus: 'pending', requireHumanApproval: true, createdAt: suggestion.createdAt || nowIso() }
    commit(prev => {
      const signature = (next.sourceIds || []).slice().sort().join('|')
      const exists = (prev.aiSuggestions || []).some(item => item.id === next.id || (signature && (item.sourceIds || []).slice().sort().join('|') === signature))
      if (exists) return prev
      return appendAudit({ ...prev, aiSuggestions: [next, ...(prev.aiSuggestions || [])] }, 'Nueva sugerencia IA pendiente', { suggestionId: next.id, humanApproved: false })
    })
    return next
  }
  const convertPublication = (id, target) => {
    const pub = db.publications.find(p => p.id === id)
    if (!pub) return null
    if (target === 'risk') return addRiskZone({ title: pub.title, area: pub.location?.label || 'Sector demo', severity: pub.severity || 'medium', category: pub.category || 'road_hazard', reports: 1, radiusM: 180, location: pub.location, description: pub.description })
    if (target === 'alert') return addAlert({ title: pub.title, type: pub.category || 'road_hazard', severity: 'warning', description: pub.description, area: pub.location?.label || 'Sector demo', instructions: 'Siga las indicaciones oficiales y evite acercarse al peligro.', radiusM: 350, location: pub.location, sourcePublicationId: pub.id })
    if (target === 'incident') return addIncident({ category: pub.category || 'other', title: pub.title, description: pub.description, priority: 'P2', location: pub.location, details: pub.details || {}, publicVisibility: true, citizenId: pub.authorId || null })
    return null
  }
  const mergeReports = (primaryId, duplicateId) => commit(prev => {
    const primary = prev.incidents.find(i => i.id === primaryId), duplicate = prev.incidents.find(i => i.id === duplicateId)
    if (!primary || !duplicate) return prev
    const merged = mergeIncidents(primary, duplicate)
    return appendAudit({ ...prev, incidents: prev.incidents.filter(i => i.id !== duplicateId).map(i => i.id === primaryId ? merged : i) }, `Reportes ${primary.code} y ${duplicate.code} fusionados`, { incidentId: primaryId, duplicateId })
  })

  const markNotificationRead = id => commit(prev => ({ ...prev, notifications: (prev.notifications || []).map(n => n.id === id ? { ...n, read: true } : n) }))
  const markAllNotificationsRead = () => commit(prev => ({ ...prev, notifications: (prev.notifications || []).map(n => ({ ...n, read: true })) }))

  const setCourseProgress = (courseId, progress) => commit(prev => ({ ...prev, courseProgress: { ...(prev.courseProgress || {}), [currentUser?.id || 'demo']: { ...(prev.courseProgress?.[currentUser?.id || 'demo'] || {}), [courseId]: Math.max(0, Math.min(100, progress)) } } }))

  const loadScenario = scenarioId => {
    const scenario = db.scenarios.find(s => s.id === scenarioId)
    if (!scenario) return false
    const center = { lat: DEMO_MAP_CENTER.lat + Math.random() * 0.004, lng: DEMO_MAP_CENTER.lng + Math.random() * 0.004 }
    const templates = {
      traffic_accident: { category: 'traffic_accident', title: 'Accidente vehicular múltiple', description: 'Colisión entre varios vehículos con persona atrapada y vía parcialmente bloqueada.', priority: 'P1', details: { vehicles: 3, people: 5, injured: 'Sí', injuredCount: 3, trapped: 'Sí', fire: 'No', smoke: 'No', roadBlocked: 'Parcial', fuelLeak: 'Sí' } },
      fire: { category: 'fire', title: 'Incendio estructural', description: 'Incendio en estructura de dos pisos con humo visible y posible evacuación.', priority: 'P1', details: { structure: 'Edificio de dos pisos', peopleInside: 'Sí', smoke: 'Sí', propagation: 'Sí', gas: 'No' } },
      medical: { category: 'medical', title: 'Emergencia médica crítica', description: 'Persona inconsciente con necesidad de respuesta médica inmediata.', priority: 'P1', details: { conscious: 'No', breathing: 'No', age: 58, bleeding: 'No', canSpeak: 'No' } },
      flood: { category: 'flood', title: 'Inundación urbana', description: 'Acumulación de agua en una vía con vehículos afectados y corriente fuerte.', priority: 'P2', details: { waterHeight: '35 cm', homes: 4, trapped: 'Sí', strongCurrent: 'Sí' } },
      mass: { category: 'other', title: 'Incidente con múltiples reportes', description: 'Múltiples ciudadanos reportaron un evento que requiere coordinación multirecurso.', priority: 'P1', details: { people: 8, injured: 'Sí', roadBlocked: 'Sí' } }
    }
    const t = templates[scenario.type] || templates.traffic_accident
    const id = `inc-${Date.now()}`
    const base = { id, code: `P-2026-${String(500 + db.incidents.length + 1).padStart(6, '0')}`, citizenId: 'usr-citizen-demo', ...t, status: 'received', createdAt: nowIso(), updatedAt: nowIso(), location: { ...center, label: 'Ubicación del escenario · sector demo', reference: 'Escenario académico cargado' }, assignedUnit: null, assignedUnits: [], eta: null, image: INCIDENT_MEDIA[t.category] || INCIDENT_MEDIA.other, photos: [], duplicateCount: 1, communications: [{ id: `msg-${Date.now()}`, sender: 'Sistema', text: 'Escenario cargado y listo para coordinación.', at: nowIso() }], timeline: [{ id: `tl-${Date.now()}`, status: 'received', label: `Escenario cargado: ${scenario.name}`, at: nowIso() }] }
    const calc = calculateRiskScore(base, db.riskZones)
    base.riskScore = calc.score; base.riskReasons = calc.reasons; base.priority = calc.priority
    commit(prev => appendAudit(pushNotification({ ...prev, incidents: [base, ...prev.incidents], activityLogs: [...(prev.activityLogs || []), activity('scenario', `Escenario cargado: ${scenario.name}`, { incidentId: base.id })].slice(-180) }, makeNotification('scenario', 'Escenario listo', `${scenario.name} creó ${base.code}.`, { incidentId: base.id })), `Escenario de demostración cargado: ${scenario.name}`, { scenarioId, incidentId: base.id }))
    return true
  }

  const changeSimulationPaused = next => {
    const value = Boolean(next); pausedRef.current = value; setSimulationPaused(value)
    if (!value) commit(prev => ({ ...prev, units: prev.units.map(u => ['en_route','transporting','returning'].includes(u.status) && u.mission ? { ...u, mission: { ...u.mission, lastTick: Date.now() } } : u) }))
  }
  const resetDemo = () => { const next = normalizeDb(seed); clearStored(); saveStored(next); setDb(next); setSessionId(null) }

  const value = useMemo(() => ({
    db, currentUser, login, logout, register, createUserByAdmin, updateProfile, addIncident, updateIncident, dispatchUnit, startTransport, returnUnit, closeIncident,
    addAlert, updateAlert, deleteAlert, createAlertFromIncident, addRiskZone, updateRiskZone, deleteRiskZone, addPublication, updatePublication, convertPublication,
    mergeReports, markNotificationRead, markAllNotificationsRead, setCourseProgress, loadScenario, resetDemo, confirmSituation, updateAiSuggestion,
    simulationSpeed, setSimulationSpeed, simulationPaused, setSimulationPaused: changeSimulationPaused,
    dataMode: DATA_MODE, lastSyncAt, syncNow, addAiSuggestion
  }), [db, currentUser, simulationSpeed, simulationPaused])
  return <PulseContext.Provider value={value}>{children}</PulseContext.Provider>
}
export const usePulse = () => useContext(PulseContext)
