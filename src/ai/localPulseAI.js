import { distanceKm, isValidLocation } from '../utils/geo.js'
import { inferPlaceCategories, searchNearbyPlaces } from '../services/placesService.js'

const SUPPORTED_LOCALES = ['es', 'en', 'fr', 'pt', 'de']
const LOCATION_INTENTS = new Set(['nearby_safety', 'incident_lookup', 'hospital', 'weather', 'tourism', 'places'])
const ACTIVE_INCIDENT_STATUSES = new Set(['received', 'validated', 'dispatched', 'en_route', 'on_scene', 'transporting', 'at_hospital'])

const copy = {
  es: {
    emergency: 'Si existe peligro inmediato, lesiones graves, dificultad para respirar, pérdida de conciencia o sangrado importante, llama al 9-1-1 ahora. Aléjate del peligro solo si puedes hacerlo sin exponerte y sigue las indicaciones del servicio de emergencias.',
    support: 'Primero confirma que estás fuera de peligro. Si hay lesiones o riesgo inmediato, llama al 9-1-1. Si estás físicamente a salvo, siéntate en un lugar seguro, respira lentamente y contacta a una persona de confianza. Esta orientación no sustituye atención médica o psicológica.',
    location: 'Necesito tu ubicación para responder con datos cercanos verificados. Activa “Compartir ubicación” en esta pantalla; no guardaré un historial de tus movimientos.',
    noNearby: radius => `No encontré incidentes, zonas de riesgo ni alertas activas dentro de ${radius} km en los datos locales disponibles. Esto no garantiza que la zona esté libre de riesgos.`,
    nearby: (count, radius) => `Encontré ${count} elemento(s) dentro de ${radius} km según los datos locales. Revisa la distancia, el estado y la fuente de cada resultado.`,
    roadsNone: 'No hay cierres registrados en los datos viales locales. Verifica fuentes oficiales antes de viajar.',
    roads: count => `Hay ${count} vía(s) con afectación registrada. Los datos pueden cambiar; verifica la última actualización antes de viajar.`,
    route: 'Puedo explicar riesgos reportados, pero necesito un origen y un destino válidos para calcular una ruta. Usa el planificador de viajes; la puntuación describe exposición a reportes y no garantiza seguridad.',
    tourism: (count, provider) => `Encontré ${count} lugar(es) cercanos mediante ${provider}. Las opciones se ordenan por distancia y no se presentan como una garantía de seguridad.`,
    tourismEmpty: 'No encontré lugares con nombre y coordenadas verificables para esa categoría cerca de tu ubicación. Prueba otra categoría o amplía el área desde el módulo de viajes.',
    weather: 'No dispongo de observaciones meteorológicas verificadas en el modo local. Conecta n8n/Open-Meteo o consulta el módulo de viajes para obtener datos actuales.',
    translation: 'La interfaz ya puede mostrarse en español, inglés, francés, portugués y alemán. La traducción de texto libre requiere conectar el endpoint de traducción de n8n.',
    general: 'Puedo ayudarte con incidentes cercanos, estado vial, rutas, hospitales, turismo, clima y orientación posterior a un accidente. Las decisiones sensibles siempre requieren revisión humana.',
    hospitals: count => `Encontré ${count} centro(s) de atención cercanos en los datos locales. Confirma disponibilidad y, ante una emergencia inmediata, llama al 9-1-1.`,
  },
  en: {
    emergency: 'If there is immediate danger, severe injury, breathing difficulty, loss of consciousness, or major bleeding, call 9-1-1 now. Move away from danger only if it is safe and follow emergency-service instructions.',
    support: 'First make sure you are out of danger. If there are injuries or immediate risk, call 9-1-1. If you are physically safe, sit somewhere secure, breathe slowly, and contact someone you trust. This guidance does not replace medical or psychological care.',
    location: 'I need your location to answer with verified nearby data. Enable “Share location” on this screen; I will not keep a history of your movements.',
    noNearby: radius => `I found no active incidents, risk zones, or alerts within ${radius} km in the available local data. This does not guarantee that the area is risk-free.`,
    nearby: (count, radius) => `I found ${count} item(s) within ${radius} km in the local data. Check the distance, status, and source for each result.`,
    roadsNone: 'No closures are recorded in the local road data. Check official sources before traveling.',
    roads: count => `${count} road(s) have a recorded impact. Conditions may change; check the latest update before traveling.`,
    route: 'I can explain reported risks, but I need a valid origin and destination to calculate a route. Use the travel planner; the score describes exposure to reports and does not guarantee safety.',
    tourism: (count, provider) => `I found ${count} nearby place(s) through ${provider}. Results are ordered by distance and are not presented as a safety guarantee.`,
    tourismEmpty: 'I found no places with a verifiable name and coordinates for that category near your location. Try another category or use the travel module.',
    weather: 'Verified weather observations are unavailable in local mode. Connect n8n/Open-Meteo or use the travel module for current data.',
    translation: 'The interface supports Spanish, English, French, Portuguese, and German. Free-text translation requires the n8n translation endpoint.',
    general: 'I can help with nearby incidents, roads, routes, hospitals, tourism, weather, and post-accident guidance. Sensitive decisions always require human review.',
    hospitals: count => `I found ${count} nearby care center(s) in the local data. Confirm availability and call 9-1-1 for an immediate emergency.`,
  },
  fr: {
    emergency: 'En cas de danger immédiat, blessure grave, difficulté à respirer, perte de connaissance ou saignement important, appelez le 9-1-1. Éloignez-vous du danger uniquement si cela est sûr.',
    support: 'Vérifiez d’abord que vous êtes hors de danger. En cas de blessure ou de risque immédiat, appelez le 9-1-1. Si vous êtes en sécurité, asseyez-vous, respirez lentement et contactez une personne de confiance. Ces conseils ne remplacent pas des soins professionnels.',
    location: 'J’ai besoin de votre localisation pour consulter les données vérifiées à proximité. Activez le partage de localisation; aucun historique de déplacement ne sera conservé.',
    noNearby: radius => `Aucun incident actif, zone de risque ou alerte n’a été trouvé dans un rayon de ${radius} km dans les données locales. Cela ne garantit pas l’absence de risque.`,
    nearby: (count, radius) => `${count} élément(s) ont été trouvés dans un rayon de ${radius} km. Vérifiez la distance, l’état et la source.`,
    roadsNone: 'Aucune fermeture n’est enregistrée dans les données routières locales. Consultez les sources officielles avant de voyager.',
    roads: count => `${count} route(s) présentent une perturbation enregistrée. Vérifiez la dernière mise à jour avant de voyager.`,
    route: 'Un point de départ et une destination valides sont nécessaires. Utilisez le planificateur; le score décrit l’exposition aux signalements et ne garantit pas la sécurité.',
    tourism: (count, provider) => `${count} lieu(x) proche(s) ont été trouvés via ${provider}. Les résultats sont classés par distance et ne constituent pas une garantie de sécurité.`,
    tourismEmpty: 'Aucun lieu avec un nom et des coordonnées vérifiables n’a été trouvé pour cette catégorie à proximité. Essayez une autre catégorie.',
    weather: 'Aucune observation météo vérifiée n’est disponible en mode local. Connectez n8n/Open-Meteo ou utilisez le module de voyage.',
    translation: 'L’interface prend en charge l’espagnol, l’anglais, le français, le portugais et l’allemand. La traduction de texte libre nécessite n8n.',
    general: 'Je peux aider avec les incidents proches, les routes, les hôpitaux, le tourisme, la météo et l’accompagnement après un accident. Toute décision sensible nécessite une validation humaine.',
    hospitals: count => `${count} centre(s) de soins proches ont été trouvés. Confirmez leur disponibilité et appelez le 9-1-1 en cas d’urgence.`,
  },
  pt: {
    emergency: 'Se houver perigo imediato, lesão grave, dificuldade para respirar, perda de consciência ou sangramento importante, ligue 9-1-1 agora. Afaste-se do perigo somente se for seguro.',
    support: 'Primeiro confirme que está fora de perigo. Se houver ferimentos ou risco imediato, ligue 9-1-1. Se estiver fisicamente seguro, sente-se, respire devagar e contate alguém de confiança. Esta orientação não substitui atendimento profissional.',
    location: 'Preciso da sua localização para consultar dados verificados próximos. Ative o compartilhamento de localização; não guardarei um histórico dos seus movimentos.',
    noNearby: radius => `Não encontrei incidentes ativos, zonas de risco ou alertas em ${radius} km nos dados locais. Isso não garante ausência de riscos.`,
    nearby: (count, radius) => `Encontrei ${count} item(ns) em ${radius} km nos dados locais. Verifique distância, estado e fonte.`,
    roadsNone: 'Não há bloqueios registrados nos dados viários locais. Consulte fontes oficiais antes de viajar.',
    roads: count => `Há ${count} via(s) com impacto registrado. Verifique a atualização mais recente antes de viajar.`,
    route: 'Preciso de origem e destino válidos para calcular uma rota. Use o planejador; a pontuação descreve exposição a relatos e não garante segurança.',
    tourism: (count, provider) => `Encontrei ${count} lugar(es) próximo(s) por meio de ${provider}. Os resultados são ordenados por distância e não representam garantia de segurança.`,
    tourismEmpty: 'Não encontrei lugares com nome e coordenadas verificáveis para essa categoria perto da sua localização. Tente outra categoria.',
    weather: 'Não há observações meteorológicas verificadas no modo local. Conecte n8n/Open-Meteo ou use o módulo de viagens.',
    translation: 'A interface oferece espanhol, inglês, francês, português e alemão. A tradução de texto livre requer o endpoint n8n.',
    general: 'Posso ajudar com incidentes próximos, estradas, rotas, hospitais, turismo, clima e orientação pós-acidente. Decisões sensíveis exigem revisão humana.',
    hospitals: count => `Encontrei ${count} centro(s) de atendimento próximos. Confirme a disponibilidade e ligue 9-1-1 em uma emergência.`,
  },
  de: {
    emergency: 'Bei unmittelbarer Gefahr, schweren Verletzungen, Atemnot, Bewusstlosigkeit oder starken Blutungen rufen Sie jetzt 9-1-1 an. Entfernen Sie sich nur aus der Gefahr, wenn dies sicher möglich ist.',
    support: 'Stellen Sie zuerst sicher, dass Sie außer Gefahr sind. Rufen Sie bei Verletzungen oder unmittelbarer Gefahr 9-1-1 an. Wenn Sie körperlich sicher sind, setzen Sie sich, atmen Sie langsam und kontaktieren Sie eine Vertrauensperson. Diese Hinweise ersetzen keine professionelle Hilfe.',
    location: 'Ich benötige Ihren Standort, um verifizierte Daten in der Nähe zu prüfen. Aktivieren Sie die Standortfreigabe; ein Bewegungsverlauf wird nicht gespeichert.',
    noNearby: radius => `In den lokalen Daten wurden im Umkreis von ${radius} km keine aktiven Vorfälle, Risikozonen oder Warnungen gefunden. Dies garantiert keine Risikofreiheit.`,
    nearby: (count, radius) => `In den lokalen Daten wurden ${count} Element(e) im Umkreis von ${radius} km gefunden. Prüfen Sie Entfernung, Status und Quelle.`,
    roadsNone: 'In den lokalen Straßendaten sind keine Sperrungen verzeichnet. Prüfen Sie vor der Fahrt offizielle Quellen.',
    roads: count => `${count} Straße(n) weisen eine registrierte Beeinträchtigung auf. Prüfen Sie vor der Fahrt die letzte Aktualisierung.`,
    route: 'Für eine Routenberechnung sind ein gültiger Start und ein Ziel erforderlich. Der Wert beschreibt nur die Exposition gegenüber Meldungen und garantiert keine Sicherheit.',
    tourism: (count, provider) => `Ich habe ${count} Ort(e) in der Nähe über ${provider} gefunden. Die Ergebnisse sind nach Entfernung sortiert und keine Sicherheitsgarantie.`,
    tourismEmpty: 'Für diese Kategorie wurden in Ihrer Nähe keine Orte mit überprüfbarem Namen und Koordinaten gefunden. Versuchen Sie eine andere Kategorie.',
    weather: 'Im lokalen Modus sind keine verifizierten Wetterbeobachtungen verfügbar. Verbinden Sie n8n/Open-Meteo oder verwenden Sie das Reisemodul.',
    translation: 'Die Oberfläche unterstützt Spanisch, Englisch, Französisch, Portugiesisch und Deutsch. Freitextübersetzung erfordert n8n.',
    general: 'Ich helfe bei Vorfällen in der Nähe, Straßen, Routen, Krankenhäusern, Tourismus, Wetter und Unterstützung nach einem Unfall. Sensible Entscheidungen benötigen eine menschliche Prüfung.',
    hospitals: count => `${count} nahe Versorgungseinrichtung(en) wurden gefunden. Bestätigen Sie die Verfügbarkeit und rufen Sie im Notfall 9-1-1 an.`,
  },
}

const intentPatterns = [
  ['emergency', /\b(911|9-1-1|emergenc|auxilio|help me|socorro|hilfe|au secours|no respira|not breathing|sangr|bleeding|unconscious|inconsciente|bewusstlos|danger immédiat|perigo imediato)\b/i],
  ['post_accident_support', /(nervios|ansiedad|panic|afraid|scared|accident.*nerv|après.*accident|ap[oó]s.*acidente|nach.*unfall)/i],
  ['hospital', /(hospital|cl[ií]nica|clinic|farmacia|pharmacy|h[oô]pital|krankenhaus)/i],
  ['weather', /(clima|tiempo|lluvia|weather|rain|m[eé]t[eé]o|chuva|wetter|regen)/i],
  ['route_planning', /(ruta|route|recorrido|camino|llegar|directions|trajet|itin[eé]raire|rota|strecke)/i],
  ['road_status', /(carretera|calle|v[ií]a|road|tr[aá]fico|traffic|cerrad|blocked|route ferm[eé]e|estrada|verkehr|straße)/i],
  ['tourism', /(turis|visitar|playa|restaurante|caf[eé]|parque|museo|atracci[oó]n|touris|visit|beach|restaurant|mus[eé]e|praia|sehensw)/i],
  ['translation', /(traduc|translate|translation|traduire|tradu[cç][aã]o|[uü]bersetz)/i],
  ['incident_lookup', /(accidente|incidente|choque|collision|incident|unfall)/i],
  ['nearby_safety', /(cerca|alrededor|near me|nearby|around me|proximit[eé]|pr[oó]xim|n[aä]he|gef[aä]hrlich|peligro|danger)/i],
]

function localeOf(value) {
  const locale = String(value || 'es').toLowerCase().split('-')[0]
  return SUPPORTED_LOCALES.includes(locale) ? locale : 'es'
}

export function classifyPulseIntent(message) {
  const clean = String(message || '').replace(/[<>]/g, ' ').slice(0, 1000).trim()
  return intentPatterns.find(([, pattern]) => pattern.test(clean))?.[0] || 'general_pulse'
}

function updatedAtOf(item) {
  return item.updatedAt || item.lastUpdatedAt || item.issuedAt || item.createdAt || null
}

function sourceTypeOf(item, fallback = 'pulse_verified') {
  if (item.sourceType) return item.sourceType
  if (item.source === 'ai_suggestion' || item.source === 'ai_reviewed') return 'ai_suggestion'
  if (item.citizenId || item.authorId) return 'citizen'
  return fallback
}

function withDistance(items, point, radiusKm) {
  return (items || [])
    .filter(item => isValidLocation(item.location || item))
    .map(item => ({ ...item, distanceKm: distanceKm(point, item.location || item) }))
    .filter(item => item.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
}

function cardFrom(item, type) {
  return {
    type,
    id: item.id,
    title: item.title || item.name || item.code || type,
    description: item.description || item.address || item.area || '',
    status: item.status || item.severity || null,
    distanceKm: Number.isFinite(item.distanceKm) ? Number(item.distanceKm.toFixed(2)) : null,
    updatedAt: updatedAtOf(item),
    sourceType: sourceTypeOf(item, type === 'hospital' ? 'official' : 'pulse_verified'),
    location: isValidLocation(item.location || item) ? { lat: (item.location || item).lat, lng: (item.location || item).lng } : null,
  }
}

function result(intent, answer, { cards = [], sources = [], mapActions = [], suggestedQuestions = [], locale = 'es' } = {}) {
  const generatedAt = new Date().toISOString()
  return {
    ok: true,
    intent,
    answer,
    spokenAnswer: answer,
    dataFreshness: generatedAt,
    generatedAt,
    engine: 'local-deterministic',
    locale,
    sources: sources.slice(0, 20),
    cards: cards.slice(0, 12),
    mapActions: mapActions.slice(0, 12),
    suggestedQuestions: suggestedQuestions.slice(0, 8),
  }
}

function sourcesFrom(cards) {
  return cards.map(card => ({ id: card.id, sourceType: card.sourceType, updatedAt: card.updatedAt })).filter(source => source.id)
}

export async function createLocalPulseResponse(payload = {}, db = {}, { signal } = {}) {
  const message = String(payload.message || '').replace(/[<>]/g, ' ').slice(0, 1000).trim()
  if (!message) throw new Error('INVALID_MESSAGE')
  const locale = localeOf(payload.locale)
  const text = copy[locale]
  const intent = classifyPulseIntent(message)
  const location = isValidLocation(payload.location) ? payload.location : null

  if (intent === 'emergency') return result(intent, text.emergency, { locale })
  if (intent === 'post_accident_support') return result(intent, text.support, { locale })
  if (LOCATION_INTENTS.has(intent) && !location) return result(intent, text.location, { locale })

  if (intent === 'nearby_safety' || intent === 'incident_lookup') {
    const radiusKm = /\b5\s*km\b/i.test(message) ? 5 : 10
    const incidents = withDistance((db.incidents || []).filter(item => ACTIVE_INCIDENT_STATUSES.has(item.status) || item.publicVisibility), location, radiusKm).map(item => cardFrom(item, 'incident'))
    const zones = withDistance(db.riskZones, location, radiusKm).map(item => cardFrom(item, 'risk_zone'))
    const alerts = withDistance((db.alerts || []).filter(item => item.active !== false), location, radiusKm).map(item => cardFrom(item, 'alert'))
    const cards = [...incidents, ...zones, ...alerts].sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)).slice(0, 12)
    return result(intent, cards.length ? text.nearby(cards.length, radiusKm) : text.noNearby(radiusKm), {
      cards,
      sources: sourcesFrom(cards),
      mapActions: cards.length ? [{ type: 'show_incidents', ids: incidents.map(item => item.id) }, { type: 'show_risk_zones', ids: zones.map(item => item.id) }] : [],
      locale,
    })
  }

  if (intent === 'hospital') {
    const cards = withDistance(db.hospitals, location, 30).slice(0, 8).map(item => cardFrom(item, 'hospital'))
    return result(intent, text.hospitals(cards.length), { cards, sources: sourcesFrom(cards), mapActions: cards[0] ? [{ type: 'show_place', id: cards[0].id }] : [], locale })
  }

  if (intent === 'road_status') {
    const affected = (db.roadStatus || []).filter(item => item.status && item.status !== 'normal')
    const cards = affected.map(item => cardFrom({ ...item, title: `${item.route || ''} ${item.name || ''}`.trim() }, 'road'))
    return result(intent, cards.length ? text.roads(cards.length) : text.roadsNone, { cards, sources: sourcesFrom(cards), locale })
  }

  if (intent === 'route_planning') {
    const affected = (db.roadStatus || []).filter(item => item.status && item.status !== 'normal').slice(0, 3)
    const cards = affected.map(item => cardFrom({ ...item, title: item.route, description: `${item.name || ''}${item.estimatedDelayMin ? ` · +${item.estimatedDelayMin} min` : ''}` }, 'road'))
    return result(intent, text.route, { cards, sources: sourcesFrom(cards), suggestedQuestions: ['¿Hay alguna carretera cerrada?', 'What is happening near me?'], locale })
  }

  if (intent === 'tourism' || intent === 'places') {
    const placeResult = await searchNearbyPlaces({ location, categories: inferPlaceCategories(message), radiusKm: 15, locale, signal })
    const cards = placeResult.places.map(place => ({
      type: 'place',
      id: place.id,
      name: place.name,
      title: place.name,
      category: place.category,
      address: place.address,
      description: place.address,
      distanceKm: place.distanceKm,
      location: { lat: place.lat, lng: place.lng },
      sourceType: place.sourceType || 'external',
      provider: placeResult.provider,
      updatedAt: placeResult.generatedAt,
    }))
    const answer = cards.length ? text.tourism(cards.length, placeResult.attribution || placeResult.provider) : text.tourismEmpty
    return result(intent, answer, { cards, sources: sourcesFrom(cards), mapActions: cards[0] ? [{ type: 'show_place', id: cards[0].id }] : [], locale })
  }

  if (intent === 'weather') return result(intent, text.weather, { locale })
  if (intent === 'translation') return result(intent, text.translation, { locale })
  return result(intent, text.general, { locale, suggestedQuestions: ['¿Qué pasa cerca de mí?', '¿Hay alguna carretera cerrada?', 'Necesito orientación después de un accidente'] })
}
