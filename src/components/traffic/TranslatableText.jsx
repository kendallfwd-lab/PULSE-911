import { Languages } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { translationService } from '../../services/translationService'

export function TranslatableText({ text, sourceLabel }) {
  const { t, i18n } = useTranslation()
  const [translated, setTranslated] = useState('')
  const [loading, setLoading] = useState(false)
  const translate = async () => { setLoading(true); setTranslated(await translationService.translate(text, i18n.language)); setLoading(false) }
  return <div className="translatable-text"><p>{translated || text}</p><small>{translated ? `${t('legacy.translationLabel')} · ${i18n.language.toUpperCase()}` : `${sourceLabel || t('legacy.originalText')} · ${t('legacy.spanishLanguage')}`}</small>{!translated && !i18n.language.startsWith('es') && <button type="button" disabled={loading} onClick={translate}><Languages size={14}/>{loading ? t('legacy.translating') : t('legacy.translateAction')}</button>}</div>
}
