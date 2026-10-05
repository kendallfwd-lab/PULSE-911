import { useMemo, useState } from 'react'
import { Eye, EyeOff, Search, ShieldCheck, UserPlus, UsersRound } from 'lucide-react'
import { Badge, InlineNotice, StatCard } from '../../components/Common'
import { usePulse } from '../../context/PulseContext'

const initialForm = { fullName: '', email: '', password: '', role: 'citizen' }
const roleLabels = { admin: 'Administrador', citizen: 'Ciudadano' }

export default function UserManagementPage() {
  const { db, createUserByAdmin } = usePulse()
  const [form, setForm] = useState(initialForm)
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)

  const users = useMemo(() => {
    const query = search.trim().toLowerCase()
    return [...db.users]
      .filter(user => !query || user.email?.toLowerCase().includes(query) || user.profile?.fullName?.toLowerCase().includes(query))
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  }, [db.users, search])
  const administrators = db.users.filter(user => user.role === 'admin').length
  const citizens = db.users.filter(user => user.role === 'citizen').length

  const submit = async event => {
    event.preventDefault()
    setNotice(null)
    if (form.password.length < 8) {
      setNotice({ tone: 'error', text: 'La contraseña temporal debe tener al menos 8 caracteres.' })
      return
    }
    setSaving(true)
    const result = await createUserByAdmin(form)
    setSaving(false)
    if (!result.ok) {
      setNotice({ tone: 'error', text: result.message })
      return
    }
    setForm(initialForm)
    setShowPassword(false)
    setNotice({ tone: 'success', text: `${result.user.profile?.fullName || result.user.email} fue creado correctamente. Ya puede iniciar sesión.` })
  }

  return <div className="admin-page user-management-page">
    <div className="admin-stats user-stats">
      <StatCard label="Usuarios registrados" value={db.users.length} icon={UsersRound}/>
      <StatCard label="Administradores" value={administrators} icon={ShieldCheck} tone="blue"/>
      <StatCard label="Ciudadanos" value={citizens} icon={UsersRound} tone="green"/>
    </div>

    <div className="user-management-grid">
      <form className="admin-panel user-create-panel" onSubmit={submit}>
        <div className="panel-title"><UserPlus/><div><h3>Crear nuevo usuario</h3><p>Asigna el acceso inicial sin cerrar tu sesión administrativa.</p></div></div>
        {notice && <InlineNotice tone={notice.tone}>{notice.text}</InlineNotice>}
        <label>Nombre completo
          <input required maxLength="120" autoComplete="off" value={form.fullName} onChange={event => setForm({ ...form, fullName: event.target.value })} placeholder="Nombre y apellidos"/>
        </label>
        <label>Correo electrónico
          <input required type="email" autoComplete="off" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} placeholder="usuario@correo.com"/>
        </label>
        <label>Tipo de cuenta
          <select value={form.role} onChange={event => setForm({ ...form, role: event.target.value })}>
            <option value="citizen">Ciudadano</option>
            <option value="admin">Administrador</option>
          </select>
        </label>
        <label>Contraseña temporal
          <span className="user-password-field">
            <input required minLength="8" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} placeholder="Mínimo 8 caracteres"/>
            <button type="button" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{showPassword ? <EyeOff/> : <Eye/>}</button>
          </span>
        </label>
        <p className="user-form-help">Comparte esta contraseña de forma privada. El sistema guarda una versión cifrada y no vuelve a mostrarla.</p>
        <button className="btn primary full" disabled={saving}><UserPlus size={17}/>{saving ? 'Creando usuario…' : 'Crear usuario'}</button>
      </form>

      <section className="admin-panel user-list-panel">
        <div className="user-list-head">
          <div className="panel-title"><UsersRound/><div><h3>Usuarios del sistema</h3><p>{users.length} resultado{users.length === 1 ? '' : 's'}</p></div></div>
          <label className="user-search"><Search/><input aria-label="Buscar usuarios" value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar por nombre o correo"/></label>
        </div>
        <div className="user-table" role="table" aria-label="Usuarios registrados">
          <div className="user-table-row user-table-header" role="row"><span>Usuario</span><span>Rol</span><span>Estado</span><span>Registro</span></div>
          {users.map(user => <div className="user-table-row" role="row" key={user.id}>
            <div><strong>{user.profile?.fullName || 'Sin nombre'}</strong><small>{user.email}</small></div>
            <span><Badge tone={user.role === 'admin' ? 'blue' : 'gray'}>{roleLabels[user.role] || user.role}</Badge></span>
            <span><Badge tone={user.active === false ? 'gray' : 'green'}>{user.active === false ? 'Inactivo' : 'Activo'}</Badge></span>
            <span>{user.createdAt ? new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium' }).format(new Date(user.createdAt)) : 'Cuenta inicial'}</span>
          </div>)}
          {!users.length && <div className="user-empty">No se encontraron usuarios con esa búsqueda.</div>}
        </div>
      </section>
    </div>
  </div>
}
