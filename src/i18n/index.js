import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import es from './locales/es.json'
import en from './locales/en.json'
import fr from './locales/fr.json'
import pt from './locales/pt.json'
import de from './locales/de.json'
import { legacyResources } from './legacyUiCatalog'

export const SUPPORTED_LANGUAGES = [
  { code: 'es', label: 'Español' }, { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' }, { code: 'pt', label: 'Português' },
  { code: 'de', label: 'Deutsch' },
]

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: { ...es, legacy: legacyResources.es } }, en: { translation: { ...en, legacy: legacyResources.en } },
      fr: { translation: { ...fr, legacy: legacyResources.fr } }, pt: { translation: { ...pt, legacy: legacyResources.pt } },
      de: { translation: { ...de, legacy: legacyResources.de } },
    },
    fallbackLng: 'es',
    supportedLngs: SUPPORTED_LANGUAGES.map(item => item.code),
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'], lookupLocalStorage: 'pulse911-language' },
  })

i18n.on('languageChanged', language => {
  document.documentElement.lang = language.split('-')[0]
})

document.documentElement.lang = i18n.resolvedLanguage || 'es'

export default i18n
