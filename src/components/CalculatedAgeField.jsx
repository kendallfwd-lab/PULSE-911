import { calculateAge } from '../utils/age'
import './CalculatedAgeField.css'

export function CalculatedAgeField({ birthDate }) {
  const age = calculateAge(birthDate)
  const hasAge = age !== null

  return (
    <label className="calculated-age-field" htmlFor="profile-calculated-age">
      <span className="calculated-age-label">Edad</span>
      <output
        id="profile-calculated-age"
        htmlFor="profile-birth-date"
        className={`calculated-age-output${hasAge ? '' : ' empty'}`}
        aria-live="polite"
      >
        {hasAge ? `${age} años` : 'Se calcula automáticamente'}
      </output>
    </label>
  )
}
