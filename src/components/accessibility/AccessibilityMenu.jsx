import { useEffect, useId, useRef } from 'react'
import { Accessibility, Check, RotateCcw, Square, Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAccessibility } from '../../accessibility/AccessibilityProvider'
import { pageSummary, speak, stop } from '../../accessibility/speechService'

export function AccessibilityMenu({ open, onToggle, onClose, triggerRef }) {
  const { t, i18n } = useTranslation()
  const { preferences, toggle, reset } = useAccessibility()
  const firstOptionRef = useRef(null)
  const menuId = `${useId()}-advanced-a11y`

  useEffect(() => {
    if (!open) return undefined
    const focusTimer = window.requestAnimationFrame(() => firstOptionRef.current?.focus())
    return () => window.cancelAnimationFrame(focusTimer)
  }, [open])

  const handleMenuKeys = event => {
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
      <button ref={firstOptionRef} type="button" role="menuitem" className="a11y-menu-option" onClick={() => speak(pageSummary(), i18n.resolvedLanguage)}><span className="a11y-option-check"><Volume2 size={15}/></span><span className="a11y-option-copy"><strong>{t('accessibility.listen')}</strong></span></button>
      <button type="button" role="menuitem" className="a11y-menu-option" onClick={stop}><span className="a11y-option-check"><Square size={14}/></span><span className="a11y-option-copy"><strong>{t('accessibility.stop')}</strong></span></button>
      {options.map(([key, label]) => <button key={key} type="button" role="menuitemcheckbox" aria-checked={preferences[key]} className={`a11y-menu-option${preferences[key] ? ' active' : ''}`} onClick={() => toggle(key)}><span className="a11y-option-check">{preferences[key] ? <Check size={15}/> : null}</span><span className="a11y-option-copy"><strong>{t(label)}</strong></span></button>)}
      <button type="button" role="menuitem" className="a11y-menu-option" onClick={() => { reset(); onClose(); triggerRef.current?.focus() }}><span className="a11y-option-check"><RotateCcw size={15}/></span><span className="a11y-option-copy"><strong>{t('accessibility.reset')}</strong></span></button>
    </div>}
  </div>
}
