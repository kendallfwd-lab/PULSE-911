import { useEffect, useId, useRef, useState } from 'react'
import { Accessibility, Check, Play, RotateCcw, Square, Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAccessibility } from '../../accessibility/AccessibilityProvider'
import { getAvailableVoices, pageSummary, speak, stop, voiceLabel } from '../../accessibility/speechService'

export function AccessibilityMenu({ open, onToggle, onClose, triggerRef }) {
  const { t, i18n } = useTranslation()
  const { preferences, toggle, setPreference, reset } = useAccessibility()
  const [voices, setVoices] = useState([])
  const firstOptionRef = useRef(null)
  const menuId = `${useId()}-advanced-a11y`

  useEffect(() => {
    if (!open) return undefined
    const focusTimer = window.requestAnimationFrame(() => firstOptionRef.current?.focus())
    return () => window.cancelAnimationFrame(focusTimer)
  }, [open])

  useEffect(() => {
    const loadVoices = () => setVoices(getAvailableVoices(i18n.resolvedLanguage))
    loadVoices()
    window.speechSynthesis?.addEventListener?.('voiceschanged', loadVoices)
    return () => window.speechSynthesis?.removeEventListener?.('voiceschanged', loadVoices)
  }, [i18n.resolvedLanguage])

  const handleMenuKeys = event => {
    if (event.target.matches('select, option')) return
    const options = [...event.currentTarget.querySelectorAll('[role^="menuitem"]')]
    const currentIndex = options.indexOf(document.activeElement)
    let nextIndex = currentIndex
    if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % options.length
    else if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + options.length) % options.length
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = options.length - 1
    else return
    event.preventDefault()
    options[nextIndex]?.focus()
  }

  const options = [
    ['reducedMotion', 'accessibility.reduceMotion'], ['highlightFocus', 'accessibility.highlightFocus'], ['readingMode', 'accessibility.readingMode'],
  ]
  return <div className="a11y-control-anchor">
    <button ref={triggerRef} type="button" className={`a11y-control-button${open ? ' active' : ''}`} aria-label={t('accessibility.menu')} aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} data-tooltip={t('accessibility.menu')} onClick={onToggle}><Accessibility size={18}/></button>
    {open && <div id={menuId} className="a11y-menu a11y-advanced-menu" role="menu" aria-label={t('accessibility.menu')} onKeyDown={handleMenuKeys}>
      <div className="a11y-menu-heading"><strong>{t('accessibility.menu')}</strong><span>{t('accessibility.advancedSubtitle')}</span></div>
      <button ref={firstOptionRef} type="button" role="menuitem" className="a11y-menu-option" onClick={() => speak(pageSummary(), i18n.resolvedLanguage, { voiceURI: preferences.voiceURI })}><span className="a11y-option-check"><Volume2 size={15}/></span><span className="a11y-option-copy"><strong>{t('accessibility.listen')}</strong></span></button>
      <button type="button" role="menuitem" className="a11y-menu-option" onClick={stop}><span className="a11y-option-check"><Square size={14}/></span><span className="a11y-option-copy"><strong>{t('accessibility.stop')}</strong></span></button>
      <div className="a11y-voice-picker" role="group" aria-labelledby={`${menuId}-voice-label`}>
        <label id={`${menuId}-voice-label`} htmlFor={`${menuId}-voice-select`}><strong>{t('speech.voiceAndAccent')}</strong><small>{t('speech.voiceHelp')}</small></label>
        <div className="a11y-voice-row">
          <select id={`${menuId}-voice-select`} value={preferences.voiceURI || ''} onChange={event => setPreference('voiceURI', event.target.value)}>
            <option value="">{t('speech.automaticVoice')}</option>
            {voices.map(voice => <option key={voice.voiceURI} value={voice.voiceURI}>{voiceLabel(voice)}</option>)}
          </select>
          <button type="button" className="a11y-voice-preview" aria-label={t('speech.preview')} title={t('speech.preview')} onClick={() => speak(t('speech.previewText'), i18n.resolvedLanguage, { voiceURI: preferences.voiceURI })}><Play size={15}/></button>
        </div>
        <small className="a11y-voice-count">{voices.length ? t('speech.voicesFound', { count: voices.length }) : t('speech.noVoices')}</small>
      </div>
      {options.map(([key, label]) => <button key={key} type="button" role="menuitemcheckbox" aria-checked={preferences[key]} className={`a11y-menu-option${preferences[key] ? ' active' : ''}`} onClick={() => toggle(key)}><span className="a11y-option-check">{preferences[key] ? <Check size={15}/> : null}</span><span className="a11y-option-copy"><strong>{t(label)}</strong></span></button>)}
      <button type="button" role="menuitem" className="a11y-menu-option" onClick={() => { reset(); onClose(); triggerRef.current?.focus() }}><span className="a11y-option-check"><RotateCcw size={15}/></span><span className="a11y-option-copy"><strong>{t('accessibility.reset')}</strong></span></button>
    </div>}
  </div>
}
