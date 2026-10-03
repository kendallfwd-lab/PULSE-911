import { CloudOff, Database, Radio, RefreshCw, WifiOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAI } from '../../ai/AIContext'

export function AIStatusIndicator() {
  const { t } = useTranslation()
  const { status, refreshStatus } = useAI()
  const Icon = status === 'online' ? Radio : status === 'local' ? Database : status === 'degraded' ? CloudOff : WifiOff
  return <button type="button" className={`pulse-ai-status pulse-ai-status-${status}`} onClick={refreshStatus} title={t('actions.refresh')}><Icon size={14}/><span>{t(`status.${status}`)}</span><RefreshCw size={12}/></button>
}
