import { Activity, ShieldCheck } from 'lucide-react'

export function Brand({ compact = false, light = false }) {
  return (
    <div className={`brand ${light ? 'brand-light' : ''}`}>
      <div className="brand-mark"><ShieldCheck size={22} /><Activity size={16} /></div>
      {!compact && <div><strong>PULSE 911</strong><span>Coordinación y respuesta</span></div>}
    </div>
  )
}
