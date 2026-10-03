import { Siren } from 'lucide-react'
import { useTranslation } from 'react-i18next'
export function AssistantEmergencyNotice() { const { t }=useTranslation(); return <div className="pulse-ai-emergency-notice" role="note"><Siren/><p>{t('assistant.disclaimer')}</p></div> }
