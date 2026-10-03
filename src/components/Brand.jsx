import { Activity, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function Brand({ compact = false, light = false }) {
  const {t}=useTranslation()
  return (
    <div className={`brand ${light ? 'brand-light' : ''}`}>
      <div className="brand-mark"><ShieldCheck size={22} /><Activity size={16} /></div>
      {!compact && <div><strong>PULSE 911</strong><span>{t('brand.subtitle')}</span></div>}
    </div>
  )
}
