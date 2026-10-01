import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HeartPulse, MapPin, UserRound, UsersRound } from 'lucide-react'
import { usePulse } from '../context/PulseContext'
import { SimulationBanner } from '../components/Common'
import { Brand } from '../components/Brand'
import { CostaRicaLocationFields } from '../components/CostaRicaLocationFields'
import { TaxpayerLookupField } from '../components/TaxpayerLookupField'
import { CalculatedAgeField } from '../components/CalculatedAgeField'
import { calculateAge, toLocalDateInputValue } from '../utils/age'

export default function OnboardingPage() {
  const { currentUser, updateProfile } = usePulse()
  const nav = useNavigate()
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    ...currentUser?.profile,
    contacts: currentUser?.profile?.contacts?.length
      ? currentUser.profile.contacts
      : [{ id: `ct-${Date.now()}`, name: '', relation: '', phone: '', email: '', priority: 1 }],
  })
  const calculatedAge = calculateAge(form.birthDate)
  const isUnderage = calculatedAge !== null && calculatedAge < 18

  const set = (key, value) => setForm(current => ({ ...current, [key]: value }))
  const setLocation = values => setForm(current => ({ ...current, ...values }))
  const consent = (key, value) => setForm(current => ({
    ...current,
    consents: { ...current.consents, [key]: value },
  }))
  const setContact = (key, value) => setForm(current => ({
    ...current,
    contacts: [{ ...current.contacts[0], [key]: value }],
  }))

  const next = async event => {
    event.preventDefault()
    if (step === 1 && isUnderage) {
      setError('Debes tener al menos 18 años para continuar con el registro.')
      return
    }
    if (step < 3) {
      setError('')
      setStep(step + 1)
      return
    }

    setError('')
    const result = await updateProfile(form)
    if (!result?.ok) {
      setError(result?.message || 'No se pudo guardar la ficha.')
      return
    }
    nav('/app')
  }

  return (
    <div className="onboarding">
      <SimulationBanner />
      <header>
        <Brand />
        <span>Paso {step} de 3</span>
      </header>
      <main>
        <div className="onboard-side">
          <div className="onboard-progress">
            <i className={step >= 1 ? 'done' : ''} />
            <i className={step >= 2 ? 'done' : ''} />
            <i className={step >= 3 ? 'done' : ''} />
          </div>
          <h1>Prepara tu ficha de emergencia</h1>
          <p>Estos datos se usarán únicamente dentro de la simulación para mostrar qué información puede consultar un operador autorizado.</p>
          <img src="/assets/presentation/profile-preview.jpg" alt="Referencia visual de ficha personal" />
        </div>

        <form className="onboard-card" onSubmit={next}>
          {error && <div className="form-error" role="alert">{error}</div>}

          {step === 1 && (
            <>
              <div className="step-title">
                <UserRound />
                <div>
                  <span>IDENTIFICACIÓN</span>
                  <h2>Datos personales</h2>
                </div>
              </div>
              <div className="form-grid">
                <TaxpayerLookupField
                  value={form.document}
                  onChange={value => set('document', value)}
                  onNameFound={value => set('fullName', value)}
                />
                <label className="span-2">
                  Nombre completo
                  <input required value={form.fullName || ''} onChange={event => set('fullName', event.target.value)} />
                </label>
                <label>
                  Fecha de nacimiento
                  <input
                    id="profile-birth-date"
                    type="date"
                    required
                    min="1900-01-01"
                    max={toLocalDateInputValue()}
                    value={form.birthDate || ''}
                    onChange={event => {
                      set('birthDate', event.target.value)
                      setError('')
                    }}
                    aria-describedby="profile-calculated-age"
                  />
                </label>
                <CalculatedAgeField birthDate={form.birthDate} minimumAge={18} />
                <label>
                  Teléfono
                  <input value={form.phone || ''} onChange={event => set('phone', event.target.value)} />
                </label>
                <CostaRicaLocationFields
                  province={form.province}
                  canton={form.canton}
                  district={form.district}
                  onChange={setLocation}
                />
                <label className="span-2">
                  Dirección
                  <input value={form.address || ''} onChange={event => set('address', event.target.value)} />
                </label>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="step-title">
                <HeartPulse />
                <div>
                  <span>FICHA DE EMERGENCIA</span>
                  <h2>Información médica declarada</h2>
                </div>
              </div>
              <div className="info-note">No se realizan diagnósticos. Esta sección solo almacena información declarada por el usuario.</div>
              <div className="form-grid">
                <label>
                  Tipo de sangre
                  <select value={form.bloodType || ''} onChange={event => set('bloodType', event.target.value)}>
                    <option value="">No indicado</option>
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(type => <option key={type}>{type}</option>)}
                  </select>
                </label>
                <label>Alergias<input value={form.allergies || ''} onChange={event => set('allergies', event.target.value)} /></label>
                <label>Medicamentos relevantes<input value={form.medications || ''} onChange={event => set('medications', event.target.value)} /></label>
                <label>Condiciones importantes<input value={form.conditions || ''} onChange={event => set('conditions', event.target.value)} /></label>
                <label className="span-2">Movilidad / requerimientos especiales<textarea value={form.mobility || ''} onChange={event => set('mobility', event.target.value)} /></label>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="step-title">
                <UsersRound />
                <div>
                  <span>CONTACTO Y PRIVACIDAD</span>
                  <h2>Contacto principal y permisos</h2>
                </div>
              </div>
              <div className="form-grid">
                <label>Nombre del contacto<input value={form.contacts[0]?.name || ''} onChange={event => setContact('name', event.target.value)} /></label>
                <label>Parentesco<input value={form.contacts[0]?.relation || ''} onChange={event => setContact('relation', event.target.value)} /></label>
                <label>Teléfono<input value={form.contacts[0]?.phone || ''} onChange={event => setContact('phone', event.target.value)} /></label>
                <label>Email<input value={form.contacts[0]?.email || ''} onChange={event => setContact('email', event.target.value)} /></label>
              </div>
              <div className="consents">
                <label><input type="checkbox" checked={form.consents?.location || false} onChange={event => consent('location', event.target.checked)} /><MapPin />Compartir ubicación durante incidentes.</label>
                <label><input type="checkbox" checked={form.consents?.medical || false} onChange={event => consent('medical', event.target.checked)} /><HeartPulse />Compartir ficha médica con personal autorizado.</label>
                <label><input type="checkbox" checked={form.consents?.notifyContact || false} onChange={event => consent('notifyContact', event.target.checked)} /><UsersRound />Avisar al contacto principal dentro de la simulación.</label>
              </div>
            </>
          )}

          <div className="wizard-actions">
            {step > 1 && <button type="button" className="btn ghost" onClick={() => setStep(step - 1)}>Atrás</button>}
            <button className="btn primary" disabled={step === 1 && isUnderage}>
              {step === 3 ? 'Guardar y entrar' : 'Continuar'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
