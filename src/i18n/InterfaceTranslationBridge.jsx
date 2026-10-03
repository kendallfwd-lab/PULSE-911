import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { legacySourceToKey } from './legacyUiCatalog'

const textState = new WeakMap()
const attributeState = new WeakMap()
const translatableAttributes = ['aria-label', 'title', 'placeholder', 'alt']
const dynamicTemplates = {
  es: { step:(a,b)=>`Paso ${a} de ${b}`, available:n=>`${n} unidades disponibles`, results:n=>`${n} ${n === '1' ? 'resultado' : 'resultados'}`, courses:n=>`${n} ${n === '1' ? 'curso' : 'cursos'}`, years:n=>`${n} años`, pending:n=>`${n} pendientes`, events:n=>`${n} eventos registrados`, centers:n=>`${n} centros reales de la zona`, medical:n=>`${n} unidades con base médica`, beds:n=>`${n} cupos simulados`, visible:n=>`${n} unidad(es) visibles`, reports:n=>`${n} reportes asociados`, files:n=>`${n} archivo(s)`, assigned:n=>`${n} asignada(s)`, locationStep:n=>`${n} Ubicación`, newItems:n=>`${n} nuevas`, from:'Desde', simulatedLocation:'Ubicación simulada para la demostración' },
  en: { step:(a,b)=>`Step ${a} of ${b}`, available:n=>`${n} available units`, results:n=>`${n} ${n === '1' ? 'result' : 'results'}`, courses:n=>`${n} ${n === '1' ? 'course' : 'courses'}`, years:n=>`${n} years old`, pending:n=>`${n} pending`, events:n=>`${n} recorded events`, centers:n=>`${n} real local centers`, medical:n=>`${n} medically based units`, beds:n=>`${n} simulated beds`, visible:n=>`${n} visible unit(s)`, reports:n=>`${n} associated reports`, files:n=>`${n} file(s)`, assigned:n=>`${n} assigned`, locationStep:n=>`${n} Location`, newItems:n=>`${n} new`, from:'From', simulatedLocation:'Simulated location for the demonstration' },
  fr: { step:(a,b)=>`Étape ${a} sur ${b}`, available:n=>`${n} unités disponibles`, results:n=>`${n} résultat${n === '1' ? '' : 's'}`, courses:n=>`${n} cours`, years:n=>`${n} ans`, pending:n=>`${n} en attente`, events:n=>`${n} événements enregistrés`, centers:n=>`${n} centres réels de la zone`, medical:n=>`${n} unités basées en centre médical`, beds:n=>`${n} places simulées`, visible:n=>`${n} unité(s) visible(s)`, reports:n=>`${n} signalements associés`, files:n=>`${n} fichier(s)`, assigned:n=>`${n} assignée(s)`, locationStep:n=>`${n} Localisation`, newItems:n=>`${n} nouvelles`, from:'Depuis', simulatedLocation:'Localisation simulée pour la démonstration' },
  pt: { step:(a,b)=>`Etapa ${a} de ${b}`, available:n=>`${n} unidades disponíveis`, results:n=>`${n} ${n === '1' ? 'resultado' : 'resultados'}`, courses:n=>`${n} ${n === '1' ? 'curso' : 'cursos'}`, years:n=>`${n} anos`, pending:n=>`${n} pendentes`, events:n=>`${n} eventos registrados`, centers:n=>`${n} centros reais da região`, medical:n=>`${n} unidades com base médica`, beds:n=>`${n} vagas simuladas`, visible:n=>`${n} unidade(s) visível(is)`, reports:n=>`${n} relatos associados`, files:n=>`${n} arquivo(s)`, assigned:n=>`${n} atribuída(s)`, locationStep:n=>`${n} Localização`, newItems:n=>`${n} novas`, from:'Desde', simulatedLocation:'Localização simulada para a demonstração' },
  de: { step:(a,b)=>`Schritt ${a} von ${b}`, available:n=>`${n} verfügbare Einheiten`, results:n=>`${n} ${n === '1' ? 'Ergebnis' : 'Ergebnisse'}`, courses:n=>`${n} ${n === '1' ? 'Kurs' : 'Kurse'}`, years:n=>`${n} Jahre`, pending:n=>`${n} ausstehend`, events:n=>`${n} erfasste Ereignisse`, centers:n=>`${n} reale Einrichtungen der Region`, medical:n=>`${n} medizinisch stationierte Einheiten`, beds:n=>`${n} simulierte Plätze`, visible:n=>`${n} sichtbare Einheit(en)`, reports:n=>`${n} zugehörige Meldungen`, files:n=>`${n} Datei(en)`, assigned:n=>`${n} zugewiesen`, locationStep:n=>`${n} Standort`, newItems:n=>`${n} neu`, from:'Von', simulatedLocation:'Simulierter Standort für die Demonstration' },
}

const capabilityTokens = {
  es: { medical:'atención médica', traffic_accident:'accidente vial', fire:'incendios', rescue:'rescate', security:'seguridad', road_hazard:'riesgo vial', flood:'inundaciones', missing_person:'persona desaparecida' },
  en: { medical:'medical care', traffic_accident:'traffic accident', fire:'fire', rescue:'rescue', security:'security', road_hazard:'road hazard', flood:'flood', missing_person:'missing person' },
  fr: { medical:'soins médicaux', traffic_accident:'accident de la route', fire:'incendie', rescue:'sauvetage', security:'sécurité', road_hazard:'risque routier', flood:'inondation', missing_person:'personne disparue' },
  pt: { medical:'atendimento médico', traffic_accident:'acidente viário', fire:'incêndio', rescue:'resgate', security:'segurança', road_hazard:'risco viário', flood:'inundação', missing_person:'pessoa desaparecida' },
  de: { medical:'medizinische Versorgung', traffic_accident:'Verkehrsunfall', fire:'Brand', rescue:'Rettung', security:'Sicherheit', road_hazard:'Straßengefahr', flood:'Überschwemmung', missing_person:'vermisste Person' },
}

function translateDynamic(source, language) {
  const templates = dynamicTemplates[language] || dynamicTemplates.es
  const tokens = capabilityTokens[language] || capabilityTokens.es
  let match = source.match(/^Paso (\d+) de (\d+)$/); if (match) return templates.step(match[1], match[2])
  match = source.match(/^(\d+) años$/); if (match) return templates.years(match[1])
  match = source.match(/^(\d+) Ubicación$/); if (match) return templates.locationStep(match[1])
  match = source.match(/^(\d+) nuevas$/); if (match) return templates.newItems(match[1])
  match = source.match(/^(.*) · Ubicación simulada para la demostración$/); if (match) return `${match[1]} · ${templates.simulatedLocation}`
  match = source.match(/^Desde ([^·]+)$/); if (match) return `${templates.from} ${match[1]}`
  match = source.match(/^(.* · )desde (.+)$/); if (match) return `${match[1]}${templates.from.toLocaleLowerCase(language)} ${match[2]}`
  match = source.match(/^Hacia (.+)$/); if (match) return `${language === 'en' ? 'Toward' : language === 'fr' ? 'Vers' : language === 'pt' ? 'Em direção a' : language === 'de' ? 'Richtung' : 'Hacia'} ${match[1]}`
  match = source.match(/^Riesgo (\d+)\/100$/); if (match) return `${language === 'en' ? 'Risk' : language === 'fr' ? 'Risque' : language === 'pt' ? 'Risco' : language === 'de' ? 'Risiko' : 'Riesgo'} ${match[1]}/100`
  match = source.match(/^Capacitación terminada: (\d+)\/(\d+)$/); if (match) return `${language === 'en' ? 'Training completed' : language === 'fr' ? 'Formation terminée' : language === 'pt' ? 'Treinamento concluído' : language === 'de' ? 'Schulung abgeschlossen' : 'Capacitación terminada'}: ${match[1]}/${match[2]}`
  match = source.match(/^Imagen representativa del curso (.+)$/); if (match) return `${language === 'en' ? 'Representative image for the course' : language === 'fr' ? 'Image représentative du cours' : language === 'pt' ? 'Imagem representativa do curso' : language === 'de' ? 'Repräsentatives Bild für den Kurs' : 'Imagen representativa del curso'} ${match[1]}`
  match = source.match(/^Imagen representativa de (.+)$/); if (match) return `${language === 'en' ? 'Representative image of' : language === 'fr' ? 'Image représentative de' : language === 'pt' ? 'Imagem representativa de' : language === 'de' ? 'Repräsentatives Bild von' : 'Imagen representativa de'} ${match[1]}`
  match = source.match(/^Imagen de (.+)$/); if (match) return `${language === 'en' ? 'Image of' : language === 'fr' ? 'Image de' : language === 'pt' ? 'Imagem de' : language === 'de' ? 'Bild von' : 'Imagen de'} ${match[1]}`
  match = source.match(/^Propósito de (.+)$/); if (match) return `${language === 'en' ? 'Purpose of' : language === 'fr' ? 'Objectif de' : language === 'pt' ? 'Objetivo de' : language === 'de' ? 'Zweck von' : 'Propósito de'} ${match[1]}`
  match = source.match(/^Atención de (.+)$/); if (match) return `${language === 'en' ? 'Response for' : language === 'fr' ? 'Intervention pour' : language === 'pt' ? 'Atendimento de' : language === 'de' ? 'Einsatz für' : 'Atención de'} ${match[1]}`
  match = source.match(/^Precisión aproximada (.+)$/); if (match) return `${language === 'en' ? 'Approximate accuracy' : language === 'fr' ? 'Précision approximative' : language === 'pt' ? 'Precisão aproximada' : language === 'de' ? 'Ungefähre Genauigkeit' : 'Precisión aproximada'} ${match[1]}`
  if (/^(?:medical|traffic_accident|fire|rescue|security|road_hazard|flood|missing_person)(?:, (?:medical|traffic_accident|fire|rescue|security|road_hazard|flood|missing_person))*$/.test(source)) {
    return source.split(', ').map(token => tokens[token] || token).join(', ')
  }
  const patterns = [
    [/^(\d+\/\d+) unidades disponibles$/, 'available'], [/^(\d+) resultado\(s\)$/, 'results'], [/^(\d+) curso\(s\)$/, 'courses'],
    [/^(\d+) pendientes$/, 'pending'], [/^(\d+) eventos registrados$/, 'events'], [/^(\d+) centros reales de la zona$/, 'centers'],
    [/^(\d+) unidades con base médica$/, 'medical'], [/^(\d+) cupos simulados$/, 'beds'], [/^(\d+) unidad\(es\) visibles$/, 'visible'],
    [/^(\d+) reportes asociados$/, 'reports'], [/^(\d+) archivo\(s\)$/, 'files'], [/^(\d+) asignada\(s\)$/, 'assigned'],
  ]
  for (const [pattern, key] of patterns) { match = source.match(pattern); if (match) return templates[key](match[1]) }
  match = source.match(/^(\d+) (lecciones \+ evaluación)$/); if (match) return `${match[1]} ${legacyResourcesForDynamic(language,'lessonsAssessment')}`
  match = source.match(/^(\d+)% completado$/); if (match) return `${match[1]}% ${legacyResourcesForDynamic(language,'completed')}`
  return source
}

const dynamicWords = {
  lessonsAssessment:{es:'lecciones + evaluación',en:'lessons + assessment',fr:'leçons + évaluation',pt:'lições + avaliação',de:'Lektionen + Bewertung'},
  completed:{es:'completado',en:'completed',fr:'terminé',pt:'concluído',de:'abgeschlossen'},
}
function legacyResourcesForDynamic(language, key) { return dynamicWords[key]?.[language] || dynamicWords[key].es }

function splitWhitespace(value) {
  const match = String(value).match(/^(\s*)([\s\S]*?)(\s*)$/)
  return { before: match?.[1] || '', text: match?.[2] || '', after: match?.[3] || '' }
}

export function InterfaceTranslationBridge() {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const translateValue = source => {
      const key = legacySourceToKey.get(source)
      if (key) return t(`legacy.${key}`)
      const language = i18n.resolvedLanguage?.split('-')[0] || 'es'
      const dynamic = translateDynamic(source, language)
      if (dynamic !== source) return dynamic
      const separator = source.includes(' · ') ? ' · ' : source.includes(' | ') ? ' | ' : null
      if (separator) {
        const parts = source.split(separator)
        const translated = parts.map(part => {
          const partKey = legacySourceToKey.get(part)
          return partKey ? t(`legacy.${partKey}`) : translateDynamic(part, language)
        })
        if (translated.some((part, index) => part !== parts[index])) return translated.join(separator)
      }
      return source
    }
    const translateText = node => {
      const current = node.nodeValue || ''
      const previous = textState.get(node)
      const parts = splitWhitespace(current)
      if (!parts.text || !node.parentElement || node.parentElement.closest('[data-no-interface-translation]')) return
      const source = previous && current === previous.output ? previous.source : parts.text
      const output = `${parts.before}${translateValue(source)}${parts.after}`
      textState.set(node, { source, output })
      if (current !== output) node.nodeValue = output
    }
    const translateElement = element => {
      if (!(element instanceof Element) || element.closest('[data-no-interface-translation]')) return
      const stored = attributeState.get(element) || {}
      for (const attribute of translatableAttributes) {
        if (!element.hasAttribute(attribute)) continue
        const current = element.getAttribute(attribute) || ''
        const previous = stored[attribute]
        const source = previous && current === previous.output ? previous.source : current
        const output = translateValue(source)
        stored[attribute] = { source, output }
        if (current !== output) element.setAttribute(attribute, output)
      }
      attributeState.set(element, stored)
    }
    const process = root => {
      if (root.nodeType === Node.TEXT_NODE) { translateText(root); return }
      if (!(root instanceof Element) && root !== document.body) return
      if (root instanceof Element) translateElement(root)
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT)
      let node = walker.nextNode()
      while (node) { node.nodeType === Node.TEXT_NODE ? translateText(node) : translateElement(node); node = walker.nextNode() }
    }
    process(document.body)
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') translateText(mutation.target)
        else if (mutation.type === 'attributes') translateElement(mutation.target)
        else mutation.addedNodes.forEach(process)
      }
    })
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: translatableAttributes })
    return () => observer.disconnect()
  }, [i18n.resolvedLanguage, t])

  return null
}
