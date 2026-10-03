import { useEffect, useId, useRef } from 'react'
import { Check, Globe2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '../../i18n'

export function LanguageSelector({ open, onToggle, onClose, triggerRef }) {
  const { i18n, t } = useTranslation()
  const activeOptionRef = useRef(null)
  const menuId = `${useId()}-language-menu`
  const current = i18n.resolvedLanguage?.split('-')[0] || 'es'

  useEffect(() => {
    if (!open) return undefined
    const focusTimer = window.requestAnimationFrame(() => activeOptionRef.current?.focus())
    return () => window.cancelAnimationFrame(focusTimer)
  }, [open])

  const handleMenuKeys = event => {
    const options = [...event.currentTarget.querySelectorAll('[role="menuitemradio"]')]
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

  return <div className="a11y-control-anchor">
    <button ref={triggerRef} type="button" className={`a11y-control-button${open ? ' active' : ''}`} aria-label={`${t('language.label')}: ${current.toUpperCase()}`} aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} data-tooltip={`${t('language.label')}: ${current.toUpperCase()}`} onClick={onToggle}><Globe2 size={17}/><small>{current.toUpperCase()}</small></button>
    {open && <div id={menuId} className="a11y-menu a11y-language-menu" role="menu" aria-label={t('language.label')} onKeyDown={handleMenuKeys}>
      <div className="a11y-menu-heading"><strong>{t('language.label')}</strong><span>{t('accessibility.languagesComplete')}</span></div>
      {SUPPORTED_LANGUAGES.map(language => <button ref={current === language.code ? activeOptionRef : null} key={language.code} type="button" role="menuitemradio" aria-checked={current === language.code} className={`a11y-menu-option${current === language.code ? ' active' : ''}`} onClick={() => { i18n.changeLanguage(language.code); onClose(); triggerRef.current?.focus() }}>
        <span className="a11y-option-check">{current === language.code ? <Check size={15}/> : null}</span><span className="a11y-option-copy"><strong>{language.label}</strong></span><span>{language.code.toUpperCase()}</span>
      </button>)}
    </div>}
  </div>
}
