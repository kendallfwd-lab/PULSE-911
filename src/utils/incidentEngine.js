export const PRIORITY_ORDER = { P1: 4, P2: 3, P3: 2, P4: 1 }

export function calculateRiskScore(incident, riskZones = []) {
  if (!incident) return { score: 0, priority: 'P4', reasons: [] }
  const d = incident.details || {}
  let score = 10
  const reasons = []
  const add = (points, reason, condition) => {
    if (condition) { score += points; reasons.push(reason) }
  }
  add(30, 'Persona atrapada', ['Sí', 'Si', true].includes(d.trapped))
  add(25, 'Múltiples personas heridas', Number(d.injuredCount || d.injured || 0) >= 2 || d.injured === 'Sí' && Number(d.people || 0) >= 3)
  add(20, 'Incendio activo', d.fire === 'Sí' || incident.category === 'fire')
  add(15, 'Vía bloqueada', ['Sí', 'Total', 'Parcial'].includes(d.roadBlocked))
  add(15, 'Material peligroso', d.hazmat === 'Sí' || d.gas === 'Sí' || d.fuelLeak === 'Sí')
  add(10, 'Múltiples vehículos', Number(d.vehicles || 0) >= 2)
  add(10, 'Corriente fuerte / inundación', d.strongCurrent === 'Sí' || incident.category === 'flood' && Number.parseFloat(String(d.waterHeight || 0).replace(',', '.')) > 30)
  add(10, 'Zona de riesgo conocida', riskZones.some(z => z.location && incident.location && distanceKm(z.location, incident.location) <= (z.radiusM || 200) / 1000))
  add(10, 'Múltiples reportes coincidentes', Number(incident.duplicateCount || 0) >= 2)
  if (incident.category === 'medical' && (d.breathing === 'No' || d.conscious === 'No')) { score += 25; reasons.push('Signos de emergencia médica crítica') }
  score = Math.min(100, score)
  const priority = score >= 75 ? 'P1' : score >= 50 ? 'P2' : score >= 25 ? 'P3' : 'P4'
  return { score, priority, reasons: reasons.length ? reasons : ['Sin factores críticos detectados'] }
}

export function distanceKm(a, b) {
  if (a?.lat == null || a?.lng == null || b?.lat == null || b?.lng == null) return 999
  const R = 6371
  const rad = Math.PI / 180
  const dLat = (b.lat - a.lat) * rad
  const dLng = (b.lng - a.lng) * rad
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

export function findDuplicateCandidates(incident, incidents = []) {
  if (!incident?.location) return []
  const created = new Date(incident.createdAt || Date.now()).getTime()
  return incidents.filter(other => {
    if (!other || other.id === incident.id || !other.location) return false
    const ageMinutes = Math.abs(created - new Date(other.createdAt || Date.now()).getTime()) / 60000
    return ageMinutes <= 15 && distanceKm(incident.location, other.location) <= 0.35 && (other.category === incident.category || other.category === 'other' || incident.category === 'other')
  })
}

export function mergeIncidents(primary, duplicate) {
  return {
    ...primary,
    duplicateCount: (primary.duplicateCount || 1) + (duplicate.duplicateCount || 1),
    details: { ...(primary.details || {}), ...(duplicate.details || {}) },
    photos: [...new Set([...(primary.photos || []), ...(duplicate.photos || []), duplicate.image].filter(Boolean))],
    timeline: [...(primary.timeline || []), { id: `tl-merge-${Date.now()}`, status: primary.status, label: `Reporte ${duplicate.code} fusionado con este incidente`, at: new Date().toISOString() }],
    notes: [primary.notes, `Reporte relacionado: ${duplicate.code}`].filter(Boolean).join(' · ')
  }
}
