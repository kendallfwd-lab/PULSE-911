export const STORAGE_KEY = 'pulse911-demo-db-v6'
export const SESSION_KEY = 'pulse911-demo-session-v2'
export const LOGOUT_REDIRECT_KEY = 'pulse911-logout-redirect'

// Replace only the original demo assets in previously saved browser data.
// User-supplied incident photos remain untouched.
const incidentImages = {
  'inc-482': '/assets/user-content/rescate-colision.webp',
  'inc-505': '/assets/user-content/calle-inundada.webp',
  'inc-471': '/assets/user-content/arbol-caido.png',
  'inc-611': '/assets/user-content/incendio-comercio.webp',
  'inc-612': '/assets/user-content/asistencia-en-escena.webp',
  'inc-613': '/assets/user-content/colision-motocicleta.webp',
}
const courseImages = {
  'course-2': '/assets/user-content/practica-rcp.webp',
  'course-3': '/assets/user-content/apoyo-emocional.webp',
  'course-4': '/assets/user-content/plan-familiar.webp',
}
const resourceImages = { 'res-1': '/assets/user-content/primeros-auxilios.webp' }

function updateDemoImages(db) {
  if (!db || typeof db !== 'object') return db
  return {
    ...db,
    incidents: db.incidents?.map(incident =>
      incidentImages[incident.id] && (
        incident.image?.startsWith('/assets/generated/incidents/') ||
        incident.image === '/assets/user-content/arbol-caido.webp'
      )
        ? { ...incident, image: incidentImages[incident.id] }
        : incident
    ) ?? db.incidents,
    courses: db.courses?.map(course =>
      courseImages[course.id] && course.image?.startsWith('/assets/generated/courses/')
        ? { ...course, image: courseImages[course.id] }
        : course
    ) ?? db.courses,
    resources: db.resources?.map(resource =>
      resourceImages[resource.id] && resource.image?.startsWith('/assets/generated/courses/')
        ? { ...resource, image: resourceImages[resource.id] }
        : resource
    ) ?? db.resources,
  }
}

export const loadStored = (seed) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return updateDemoImages(raw ? JSON.parse(raw) : structuredClone(seed))
  } catch {
    return updateDemoImages(structuredClone(seed))
  }
}

export const saveStored = db => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)) } catch {}
}

export const loadSession = () => {
  try { return localStorage.getItem(SESSION_KEY) || null } catch { return null }
}

export const saveSession = userId => {
  try { localStorage.setItem(SESSION_KEY, userId) } catch { return false }
  try { sessionStorage.removeItem(LOGOUT_REDIRECT_KEY) } catch {}
  return true
}

export const markLogoutRedirect = () => {
  try { sessionStorage.setItem(LOGOUT_REDIRECT_KEY, String(Date.now())) } catch {}
}

export const hasRecentLogoutRedirect = () => {
  try {
    const markedAt = Number(sessionStorage.getItem(LOGOUT_REDIRECT_KEY))
    return Number.isFinite(markedAt) && Date.now() - markedAt < 5000
  } catch { return false }
}

export const clearSession = () => {
  try { localStorage.removeItem(SESSION_KEY) } catch {}
}

export const clearStored = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(SESSION_KEY)
    // Clean obsolete local demo keys from earlier builds.
    localStorage.removeItem('pulse911-demo-db-v5')
    localStorage.removeItem('pulse911-demo-session-v1')
  } catch {}
}
