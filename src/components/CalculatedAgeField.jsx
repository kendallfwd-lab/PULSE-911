import { calculateAge } from '../utils/age'
import './CalculatedAgeField.css'

export function CalculatedAgeField({ birthDate, minimumAge = 18 }) {
  const age = calculateAge(birthDate)
  const hasAge = age !== null
  const isUnderage = hasAge && age < minimumAge

  return (
    <label className="calculated-age-field" htmlFor="profile-calculated-age">
      <span className="calculated-age-label">Edad</span>
      <output
        id="profile-calculated-age"
        htmlFor="profile-birth-date"
        className={`calculated-age-output${hasAge ? '' : ' empty'}${isUnderage ? ' underage' : ''}`}
        aria-live="polite"
        role={isUnderage ? 'alert' : 'status'}
      >
        {isUnderage
          ? `${age} años — Debes tener ${minimumAge} años o más para continuar.`
          : hasAge
            ? `${age} años`
            : 'Se calcula automáticamente'}
      </output>
    </label>
  )
}
