import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const databasePath = fileURLToPath(new URL('../db.json', import.meta.url))
const maximumBodySize = 64 * 1024
const profileFields = [
  'fullName', 'document', 'birthDate', 'phone', 'province', 'canton', 'district',
  'address', 'bloodType', 'allergies', 'medications', 'conditions', 'mobility', 'notes',
]
let databaseQueue = Promise.resolve()

function sendJson(response, status, data) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(data))
}

async function readJson(request) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > maximumBodySize) throw Object.assign(new Error('Solicitud demasiado grande.'), { status: 413 })
    chunks.push(chunk)
  }
  try {
    const body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error()
    return body
  } catch {
    throw Object.assign(new Error('El cuerpo de la solicitud no es válido.'), { status: 400 })
  }
}

function publicUser(user) {
  const { password, passwordSalt, passwordHash, ...safeUser } = user
  return safeUser
}

function passwordMatches(user, password) {
  if (user.passwordSalt && user.passwordHash) {
    const expected = Buffer.from(user.passwordHash, 'hex')
    const actual = scryptSync(password, user.passwordSalt, expected.length)
    return expected.length === actual.length && timingSafeEqual(expected, actual)
  }
  return user.password === password
}

function addAuditEntry(database, label, userId) {
  database.auditLogs = [
    ...(database.auditLogs || []),
    { id: `audit-${randomUUID()}`, type: 'audit', label, at: new Date().toISOString(), userId },
  ].slice(-300)
}

function transact(update) {
  const operation = databaseQueue.then(async () => {
    const database = JSON.parse(await readFile(databasePath, 'utf8'))
    const result = await update(database)
    if (result.persist) await writeFile(databasePath, `${JSON.stringify(database, null, 2)}\n`, 'utf8')
    return result
  })
  databaseQueue = operation.catch(() => {})
  return operation
}

function defaultProfile(fullName) {
  return {
    fullName,
    document: '',
    birthDate: '',
    phone: '',
    province: '',
    canton: '',
    district: '',
    address: '',
    bloodType: '',
    allergies: '',
    medications: '',
    conditions: '',
    mobility: '',
    notes: 'Datos ficticios para demostración.',
    consents: { location: true, medical: false, notifyContact: true, unitTracking: true },
    contacts: [],
  }
}

function mergeProfile(previous, incoming) {
  const profile = { ...(previous || {}) }
  for (const field of profileFields) {
    if (typeof incoming[field] === 'string') profile[field] = incoming[field].trim().slice(0, 2000)
  }
  if (incoming.consents && typeof incoming.consents === 'object') {
    profile.consents = { ...(profile.consents || {}) }
    for (const [key, value] of Object.entries(incoming.consents)) {
      if (['location', 'medical', 'notifyContact', 'unitTracking'].includes(key) && typeof value === 'boolean') {
        profile.consents[key] = value
      }
    }
  }
  if (Array.isArray(incoming.contacts)) {
    profile.contacts = incoming.contacts.slice(0, 10).map(contact => ({
      id: String(contact.id || `contact-${randomUUID()}`).slice(0, 100),
      name: String(contact.name || '').trim().slice(0, 120),
      relation: String(contact.relation || '').trim().slice(0, 80),
      phone: String(contact.phone || '').trim().slice(0, 80),
      email: String(contact.email || '').trim().slice(0, 254),
      priority: Math.max(1, Math.min(10, Number(contact.priority) || 1)),
    }))
  }
  return profile
}

export function demoDatabasePlugin() {
  return {
    name: 'pulse-demo-json-database',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url || '/', 'http://localhost').pathname
        const isRegister = request.method === 'POST' && pathname === '/api/register'
        const isLogin = request.method === 'POST' && pathname === '/api/login'
        const isSync = request.method === 'POST' && pathname === '/api/users/sync'
        const profileMatch = request.method === 'PUT' && pathname.match(/^\/api\/users\/([^/]+)\/profile$/)
        if (!isRegister && !isLogin && !isSync && !profileMatch) return next()

        try {
          const body = await readJson(request)
          const result = await transact(database => {
            database.users ||= []

            if (isRegister) {
              const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : ''
              const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
              const password = typeof body.password === 'string' ? body.password : ''
              if (!fullName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6) {
                return { status: 400, body: { message: 'Revisa el nombre, correo y contraseña.' } }
              }
              if (database.users.some(user => user.email?.toLowerCase() === email)) {
                return { status: 409, body: { message: 'Ya existe una cuenta con ese correo.' } }
              }
              const passwordSalt = randomBytes(16).toString('hex')
              const passwordHash = scryptSync(password, passwordSalt, 64).toString('hex')
              const user = {
                id: `usr-${randomUUID()}`,
                email,
                passwordSalt,
                passwordHash,
                role: 'citizen',
                profileComplete: false,
                profile: defaultProfile(fullName),
              }
              database.users.unshift(user)
              addAuditEntry(database, 'Nueva cuenta ciudadana creada', user.id)
              return { status: 201, body: { user: publicUser(user) }, persist: true }
            }

            if (isLogin) {
              const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
              const password = typeof body.password === 'string' ? body.password : ''
              const user = database.users.find(candidate => candidate.email?.toLowerCase() === email)
              if (!user || !passwordMatches(user, password)) {
                return { status: 401, body: { message: 'Correo o contraseña incorrectos.' } }
              }
              return { status: 200, body: { user: publicUser(user) } }
            }

            if (isSync) {
              const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
              const password = typeof body.password === 'string' ? body.password : ''
              const fullName = typeof body.profile?.fullName === 'string' ? body.profile.fullName.trim() : ''
              if (!email || password.length < 6) {
                return { status: 400, body: { message: 'No se pudieron validar los datos de la cuenta.' } }
              }
              let user = database.users.find(candidate => candidate.email?.toLowerCase() === email)
              if (user) {
                if (!passwordMatches(user, password)) {
                  return { status: 401, body: { message: 'Correo o contraseña incorrectos.' } }
                }
                const profile = mergeProfile(user.profile, body.profile || {})
                const profileComplete = Boolean(user.profileComplete || body.profileComplete)
                const changed = JSON.stringify(profile) !== JSON.stringify(user.profile) || profileComplete !== Boolean(user.profileComplete)
                if (changed) {
                  user.profile = profile
                  user.profileComplete = profileComplete
                  addAuditEntry(database, 'Cuenta local sincronizada con db.json', user.id)
                }
                return { status: 200, body: { user: publicUser(user) }, persist: changed }
              }
              if (body.role !== 'citizen' || !fullName) {
                return { status: 403, body: { message: 'Solo se pueden importar cuentas ciudadanas locales.' } }
              }
              const passwordSalt = randomBytes(16).toString('hex')
              const passwordHash = scryptSync(password, passwordSalt, 64).toString('hex')
              user = {
                id: typeof body.id === 'string' && /^usr-[a-zA-Z0-9-]+$/.test(body.id) ? body.id : `usr-${randomUUID()}`,
                email,
                passwordSalt,
                passwordHash,
                role: 'citizen',
                profileComplete: Boolean(body.profileComplete),
                profile: mergeProfile(defaultProfile(fullName), body.profile || {}),
              }
              database.users.unshift(user)
              addAuditEntry(database, 'Cuenta local sincronizada con db.json', user.id)
              return { status: 200, body: { user: publicUser(user) }, persist: true }
            }

            const userId = decodeURIComponent(profileMatch[1])
            const user = database.users.find(candidate => candidate.id === userId)
            if (!user) return { status: 404, body: { message: 'No se encontró la cuenta local.' } }
            if (!body.profile || typeof body.profile !== 'object' || Array.isArray(body.profile)) {
              return { status: 400, body: { message: 'La ficha enviada no es válida.' } }
            }
            user.profile = mergeProfile(user.profile, body.profile)
            user.profileComplete = true
            addAuditEntry(database, 'Perfil ciudadano actualizado', user.id)
            return { status: 200, body: { user: publicUser(user) }, persist: true }
          })
          sendJson(response, result.status, result.body)
        } catch (error) {
          sendJson(response, error.status || 500, {
            message: error.status ? error.message : 'No se pudo guardar en db.json.',
          })
        }
      })
    },
  }
}