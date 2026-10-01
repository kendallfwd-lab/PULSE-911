import { useEffect, useRef, useState } from 'react'
import {
  isValidIdentification,
  lookupTaxpayer,
  normalizeIdentification,
} from '../services/taxpayerService'
import './TaxpayerLookupField.css'

const lookupErrorMessages = {
  INVALID_IDENTIFICATION: 'Ingresa una cédula válida de 9 a 12 dígitos.',
  NOT_FOUND: 'La cédula no aparece en Hacienda. Puedes escribir el nombre manualmente.',
  RATE_LIMIT: 'Hacienda recibió demasiadas consultas. Intenta de nuevo más tarde.',
  TIMEOUT: 'La consulta tardó demasiado. Revisa tu conexión e intenta nuevamente.',
  INVALID_RESPONSE: 'Hacienda no devolvió un nombre para esta cédula.',
  SERVICE_ERROR: 'No fue posible consultar Hacienda en este momento.',
}

export function TaxpayerLookupField({ value, onChange, onNameFound }) {
  const requestRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => () => requestRef.current?.abort(), [])

  const changeIdentification = event => {
    const identification = normalizeIdentification(event.target.value)
    requestRef.current?.abort()
    setLoading(false)
    setMessage(null)
    onChange(identification)
  }

  const search = async () => {
    const controller = new AbortController()
    requestRef.current?.abort()
    requestRef.current = controller
    setLoading(true)
    setMessage(null)

    try {
      const taxpayer = await lookupTaxpayer(value, controller.signal)
      if (requestRef.current !== controller) return
      onNameFound(taxpayer.name)
      setMessage({ type: 'success', text: `Nombre cargado desde Hacienda: ${taxpayer.name}` })
    } catch (error) {
      if (error.name === 'AbortError' || requestRef.current !== controller) return
      setMessage({
        type: 'error',
        text: lookupErrorMessages[error.code] || 'No se pudo consultar Hacienda. Puedes completar el nombre manualmente.',
      })
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null
        setLoading(false)
      }
    }
  }

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (isValidIdentification(value) && !loading) search()
    }
  }

  return (
    <div className="taxpayer-lookup span-2">
      <label htmlFor="profile-identification">
        Cédula de identidad
        <div className="taxpayer-lookup-row">
          <input
            id="profile-identification"
            required
            inputMode="numeric"
            autoComplete="off"
            minLength="9"
            maxLength="12"
            pattern="[0-9]{9,12}"
            value={value || ''}
            onChange={changeIdentification}
            onKeyDown={handleKeyDown}
            aria-describedby="identification-help identification-message"
            placeholder="9 a 12 dígitos, sin guiones"
          />
          <button
            type="button"
            onClick={search}
            disabled={!isValidIdentification(value) || loading}
          >
            {loading ? 'Consultando…' : 'Buscar datos'}
          </button>
        </div>
      </label>
      <small id="identification-help" className="taxpayer-lookup-help">
        Digita de 9 a 12 números, sin guiones. La consulta se realiza en el registro público de Hacienda.
      </small>
      {message && (
        <span
          id="identification-message"
          className={`taxpayer-lookup-message ${message.type}`}
          role={message.type === 'error' ? 'alert' : 'status'}
        >
          {message.text}
        </span>
      )}
    </div>
  )
}
