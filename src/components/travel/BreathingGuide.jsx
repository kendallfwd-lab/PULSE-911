import { Pause, Play, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const phases = [{ label: 'Inhalar', seconds: 4 }, { label: 'Mantener', seconds: 4 }, { label: 'Exhalar', seconds: 6 }]

export function BreathingGuide() {
  const { i18n }=useTranslation(); const english=i18n.language.startsWith('en')
  const [running, setRunning] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [remaining, setRemaining] = useState(phases[0].seconds)
  useEffect(() => {
    if (!running) return undefined
    const timer = window.setInterval(() => setRemaining(value => {
      if (value > 1) return value - 1
      setPhaseIndex(index => { const next = (index + 1) % phases.length; window.setTimeout(() => setRemaining(phases[next].seconds), 0); return next })
      return 1
    }), 1000)
    return () => window.clearInterval(timer)
  }, [running])
  const reset = () => { setRunning(false); setPhaseIndex(0); setRemaining(phases[0].seconds) }
  const phaseLabel=english?['Inhale','Hold','Exhale'][phaseIndex]:phases[phaseIndex].label
  return <section className="breathing-guide"><div className={`breathing-orb phase-${phaseIndex}`} aria-hidden="true"><span/></div><div><span>{english?'Optional exercise':'Ejercicio opcional'}</span><h2>{phaseLabel}</h2><strong aria-live="polite">{remaining} s</strong><p>{english?'Breathe at a comfortable pace. Stop if you feel unwell; this guide is not medical treatment.':'Respira a un ritmo cómodo. Detente si sientes malestar; esta guía no es tratamiento médico.'}</p><div><button type="button" className="btn primary" onClick={() => setRunning(value => !value)}>{running ? <Pause size={16}/> : <Play size={16}/>} {running ? (english?'Pause':'Pausar') : (english?'Start':'Comenzar')}</button><button type="button" className="btn ghost" onClick={reset}><RotateCcw size={16}/>{english?'Reset':'Reiniciar'}</button></div></div></section>
}
