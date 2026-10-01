const padDatePart = value => String(value).padStart(2, '0')

export function toLocalDateInputValue(date = new Date()) {
  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join('-')
}

export function calculateAge(birthDateValue, today = new Date()) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(birthDateValue || ''))
  if (!match) return null

  const [, yearValue, monthValue, dayValue] = match
  const year = Number(yearValue)
  const month = Number(monthValue)
  const day = Number(dayValue)
  const birthDate = new Date(year, month - 1, day)

  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return null
  }

  const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  if (birthDate > currentDate) return null

  let age = currentDate.getFullYear() - year
  const birthdayHasPassed =
    currentDate.getMonth() > month - 1 ||
    (currentDate.getMonth() === month - 1 && currentDate.getDate() >= day)

  if (!birthdayHasPassed) age -= 1
  return age
}
