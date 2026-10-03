import { AlertTriangle, CheckCircle2, CircleX } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePulse } from '../../context/PulseContext'

export function CitizenConfirmation({ id, entityType = 'incident', confirmationCount = 0 }) {
  const { t } = useTranslation()
  const { confirmSituation } = usePulse()
  const [notice, setNotice] = useState('')
  const submit = response => {
    const result = confirmSituation(entityType, id, response)
    setNotice(result.ok ? t('home.confirmedThanks') : result.message)
  }
  return <section className="citizen-confirmation"><strong>{t('incident.confirmQuestion')}</strong><div><button type="button" onClick={() => submit('continues')}><CheckCircle2 size={15}/>{t('incident.continues')}</button><button type="button" onClick={() => submit('cleared')}><CircleX size={15}/>{t('incident.cleared')}</button><button type="button" onClick={() => submit('incorrect')}><AlertTriangle size={15}/>{t('incident.incorrect')}</button></div>{confirmationCount > 0 && <small>{t('incident.confirmedBy', { count: confirmationCount })}</small>}{notice && <p role="status">{notice}</p>}</section>
}
