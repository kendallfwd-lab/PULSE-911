import { useEffect, useId, useRef, useState } from 'react'
import { Check, Eye, Moon, Sun, Type, Volume2, VolumeX } from 'lucide-react'
import { COLOR_VISION_OPTIONS, useColorVision } from '../../context/ColorVisionContext'
import { TEXT_SIZE_OPTIONS, useTextSize } from '../../context/TextSizeContext'
import { useTheme } from '../../context/ThemeContext'
import { LanguageSelector } from './LanguageSelector'
import { AccessibilityMenu } from './AccessibilityMenu'
import { useTranslation } from 'react-i18next'
import { playUISound, useUISound } from '../../context/UISoundContext'
import './AccessibilityControls.css'

const SOUND_COPY = {
  es: { title: 'Sonido de botones', subtitle: 'Elige un tono suave para la interfaz', off: 'Sin sonido', offDescription: 'Desactiva los sonidos de clic', soft: 'Suave', softDescription: 'Clic corto y discreto', glass: 'Cristal', glassDescription: 'Tono claro y ligero', pulse: 'Pulso', pulseDescription: 'Tono cálido y breve' },
  en: { title: 'Button sound', subtitle: 'Choose a soft interface tone', off: 'No sound', offDescription: 'Disable click sounds', soft: 'Soft', softDescription: 'Short and discreet click', glass: 'Glass', glassDescription: 'Light and clear tone', pulse: 'Pulse', pulseDescription: 'Brief warm tone' },
  fr: { title: 'Son des boutons', subtitle: 'Choisissez un son doux', off: 'Sans son', offDescription: 'Désactive les sons de clic', soft: 'Doux', softDescription: 'Clic court et discret', glass: 'Cristal', glassDescription: 'Son clair et léger', pulse: 'Pulsation', pulseDescription: 'Son bref et chaleureux' },
  pt: { title: 'Som dos botões', subtitle: 'Escolha um tom suave', off: 'Sem som', offDescription: 'Desativa os sons de clique', soft: 'Suave', softDescription: 'Clique curto e discreto', glass: 'Cristal', glassDescription: 'Tom claro e leve', pulse: 'Pulso', pulseDescription: 'Tom breve e acolhedor' },
  de: { title: 'Tastenton', subtitle: 'Wählen Sie einen sanften Ton', off: 'Ohne Ton', offDescription: 'Klicktöne deaktivieren', soft: 'Sanft', softDescription: 'Kurzer dezenter Klick', glass: 'Glas', glassDescription: 'Heller leichter Ton', pulse: 'Puls', pulseDescription: 'Kurzer warmer Ton' }
}

function MenuOption({ active, description, label, onClick, optionRef, swatches, soundPreview = false }) {
  return (
    <button
      ref={optionRef}
      type="button"
      role="menuitemradio"
      aria-checked={active}
      className={`a11y-menu-option${active ? ' active' : ''}`}
      data-ui-sound-ignore={soundPreview ? '' : undefined}
      onClick={onClick}
    >
      <span className="a11y-option-check" aria-hidden="true">{active ? <Check size={15} /> : null}</span>
      <span className="a11y-option-copy">
        <strong>{label}</strong>
        {description ? <small>{description}</small> : null}
      </span>
      {swatches ? <span className={`a11y-mode-swatch ${swatches}`} aria-hidden="true"><i/><i/><i/></span> : null}
    </button>
  )
}

export function AccessibilityControls({ compact = false }) {
  const {t,i18n}=useTranslation()
  const { textSize, setTextSize, textSizeOption } = useTextSize()
  const { colorVisionMode, setColorVisionMode } = useColorVision()
  const { isDark, toggleTheme } = useTheme()
  const { sound, setSound, options: soundOptions } = useUISound()
  const soundCopy = SOUND_COPY[i18n.language.split('-')[0]] || SOUND_COPY.es
  const [openMenu, setOpenMenu] = useState(null)
  const rootRef = useRef(null)
  const textTriggerRef = useRef(null)
  const languageTriggerRef = useRef(null)
  const advancedTriggerRef = useRef(null)
  const visionTriggerRef = useRef(null)
  const soundTriggerRef = useRef(null)
  const activeOptionRef = useRef(null)
  const textMenuId = `${useId()}-text-menu`
  const visionMenuId = `${useId()}-vision-menu`
  const soundMenuId = `${useId()}-sound-menu`

  useEffect(() => {
    if (!openMenu) return undefined

    const focusTimer = window.requestAnimationFrame(() => activeOptionRef.current?.focus())
    const closeOnPointerDown = event => {
      if (!rootRef.current?.contains(event.target)) setOpenMenu(null)
    }
    const closeOnEscape = event => {
      if (event.key !== 'Escape') return
      const trigger = openMenu === 'text'
        ? textTriggerRef.current
        : openMenu === 'language'
          ? languageTriggerRef.current
          : openMenu === 'advanced'
            ? advancedTriggerRef.current
            : openMenu === 'vision'
              ? visionTriggerRef.current
              : soundTriggerRef.current
      setOpenMenu(null)
      trigger?.focus()
    }

    document.addEventListener('pointerdown', closeOnPointerDown)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      window.cancelAnimationFrame(focusTimer)
      document.removeEventListener('pointerdown', closeOnPointerDown)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [openMenu])

  const toggleMenu = menu => setOpenMenu(current => current === menu ? null : menu)

  const selectOption = (menu, value) => {
    if (menu === 'text') setTextSize(value)
    else if (menu === 'vision') setColorVisionMode(value)
    else {
      setSound(value)
      playUISound(value)
    }
    setOpenMenu(null)
    window.requestAnimationFrame(() => {
      const trigger = menu === 'text' ? textTriggerRef.current : menu === 'vision' ? visionTriggerRef.current : soundTriggerRef.current
      trigger?.focus()
    })
  }

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

  return (
    <div
      ref={rootRef}
      className={`accessibility-controls${compact ? ' accessibility-controls-compact' : ''}`}
      aria-label={t('accessibility.controls')}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpenMenu(null)
      }}
    >
      <div className="a11y-control-anchor">
        <button
          ref={textTriggerRef}
          type="button"
          className={`a11y-control-button${openMenu === 'text' ? ' active' : ''}`}
          aria-label={`${t('accessibility.textSize')}: ${t(`accessibility.${textSize}`)}, ${textSizeOption.percent}`}
          aria-haspopup="menu"
          aria-expanded={openMenu === 'text'}
          aria-controls={textMenuId}
          data-tooltip={`${t('accessibility.textSize')}: ${t(`accessibility.${textSize}`)}`}
          onClick={() => toggleMenu('text')}
        >
          <Type size={17} aria-hidden="true" />
          <span className="a11y-button-aa" aria-hidden="true">Aa</span>
          <small>{textSizeOption.percent}</small>
        </button>

        {openMenu === 'text' ? (
          <div id={textMenuId} className="a11y-menu a11y-text-menu" role="menu" aria-label={t('accessibility.textSize')} onKeyDown={handleMenuKeys}>
            <div className="a11y-menu-heading"><strong>{t('accessibility.textSize')}</strong><span>{t('accessibility.textApplies')}</span></div>
            {TEXT_SIZE_OPTIONS.map(option => (
              <MenuOption
                key={option.value}
                active={textSize === option.value}
                label={`${t(`accessibility.${option.value}`)} · ${option.percent}`}
                description={option.value === 'normal' ? t('accessibility.defaultText') : t('accessibility.enlargedText')}
                optionRef={textSize === option.value ? activeOptionRef : null}
                onClick={() => selectOption('text', option.value)}
              />
            ))}
          </div>
        ) : null}
      </div>

      <LanguageSelector
        open={openMenu === 'language'}
        onToggle={() => toggleMenu('language')}
        onClose={() => setOpenMenu(null)}
        triggerRef={languageTriggerRef}
      />
      <AccessibilityMenu
        open={openMenu === 'advanced'}
        onToggle={() => toggleMenu('advanced')}
        onClose={() => setOpenMenu(null)}
        triggerRef={advancedTriggerRef}
      />

      <div className="a11y-control-anchor">
        <button
          ref={soundTriggerRef}
          type="button"
          className={`a11y-control-button${openMenu === 'sound' ? ' active' : ''}${sound !== 'off' ? ' mode-enabled' : ''}`}
          aria-label={`${soundCopy.title}: ${soundCopy[sound]}`}
          aria-haspopup="menu"
          aria-expanded={openMenu === 'sound'}
          aria-controls={soundMenuId}
          data-tooltip={`${soundCopy.title}: ${soundCopy[sound]}`}
          onClick={() => toggleMenu('sound')}
        >
          {sound === 'off' ? <VolumeX size={22} aria-hidden="true" /> : <Volume2 size={22} aria-hidden="true" />}
        </button>

        {openMenu === 'sound' ? (
          <div id={soundMenuId} className="a11y-menu a11y-sound-menu" role="menu" aria-label={soundCopy.title} onKeyDown={handleMenuKeys}>
            <div className="a11y-menu-heading"><strong>{soundCopy.title}</strong><span>{soundCopy.subtitle}</span></div>
            {soundOptions.map(option => (
              <MenuOption
                key={option.value}
                active={sound === option.value}
                label={soundCopy[option.value]}
                description={soundCopy[`${option.value}Description`]}
                optionRef={sound === option.value ? activeOptionRef : null}
                soundPreview
                onClick={() => selectOption('sound', option.value)}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="a11y-control-anchor a11y-vision-anchor">
        <button
          ref={visionTriggerRef}
          type="button"
          className={`a11y-control-button a11y-vision-button${openMenu === 'vision' ? ' active' : ''}${colorVisionMode !== 'standard' ? ' mode-enabled' : ''}`}
          aria-label={`${t('accessibility.visualMode')}: ${t(`accessibility.${colorVisionMode==='high-contrast'?'highContrast':colorVisionMode}`)}`}
          aria-haspopup="menu"
          aria-expanded={openMenu === 'vision'}
          aria-controls={visionMenuId}
          data-tooltip={`${t('accessibility.visualMode')}: ${t(`accessibility.${colorVisionMode==='high-contrast'?'highContrast':colorVisionMode}`)}`}
          onClick={() => toggleMenu('vision')}
        >
          <Eye size={21} aria-hidden="true" />
          <span className="a11y-mode-indicator" aria-hidden="true" />
        </button>

        {openMenu === 'vision' ? (
          <div id={visionMenuId} className="a11y-menu a11y-vision-menu" role="menu" aria-label={t('accessibility.visualMode')} onKeyDown={handleMenuKeys}>
            <div className="a11y-menu-heading"><strong>{t('accessibility.visualMode')}</strong><span>{t('accessibility.contrastColors')}</span></div>
            {COLOR_VISION_OPTIONS.map(option => (
              <MenuOption
                key={option.value}
                active={colorVisionMode === option.value}
                label={t(`accessibility.${option.value==='high-contrast'?'highContrast':option.value}`)}
                description={t(`accessibility.${option.value==='high-contrast'?'highContrast':option.value}Description`)}
                optionRef={colorVisionMode === option.value ? activeOptionRef : null}
                swatches={`swatch-${option.value}`}
                onClick={() => selectOption('vision', option.value)}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="a11y-control-anchor a11y-theme-anchor">
        <button
          type="button"
          className="a11y-control-button a11y-theme-button"
          aria-label={isDark ? t('accessibility.lightMode') : t('accessibility.darkMode')}
          aria-pressed={isDark}
          data-tooltip={isDark ? t('accessibility.lightMode') : t('accessibility.darkMode')}
          onClick={() => {
            setOpenMenu(null)
            toggleTheme()
          }}
        >
          <span className="a11y-theme-icon" aria-hidden="true">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </span>
        </button>
      </div>
    </div>
  )
}
