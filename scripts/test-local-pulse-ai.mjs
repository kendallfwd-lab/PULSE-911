import fs from 'node:fs'
import { createLocalPulseResponse } from '../src/ai/localPulseAI.js'
import { detectLocalRiskClusters } from '../src/services/adminAIService.js'
import { searchNearbyPlaces } from '../src/services/placesService.js'
import { buildMobilityInsights } from '../src/ai/mobilityInsights.js'

const db = JSON.parse(fs.readFileSync(new URL('../db.json', import.meta.url), 'utf8'))
const location = { lat: 9.976, lng: -84.748 }

const cases = [
  { name: 'nearby without location', payload: { message: '¿Qué pasa cerca de mí?', locale: 'es' }, intent: 'nearby_safety', cards: false },
  { name: 'nearby with location', payload: { message: '¿Qué pasa cerca de mí?', locale: 'es', location }, intent: 'nearby_safety', cards: true },
  { name: 'road status', payload: { message: '¿Hay alguna carretera cerrada?', locale: 'es' }, intent: 'road_status', cards: true },
  { name: 'English query', payload: { message: 'What is near me?', locale: 'en', location }, intent: 'nearby_safety', cards: true },
  { name: 'post accident support', payload: { message: 'Tuve un accidente y estoy muy nervioso', locale: 'es' }, intent: 'post_accident_support', cards: false },
  { name: 'medical emergency', payload: { message: 'No respira, ayuda 911', locale: 'es' }, intent: 'emergency', cards: false },
]

for (const test of cases) {
  const response = await createLocalPulseResponse(test.payload, db)
  if (!response.ok || response.intent !== test.intent || typeof response.answer !== 'string') throw new Error(`${test.name}: invalid response`)
  if (test.cards && response.cards.length === 0) throw new Error(`${test.name}: expected cards`)
  if (!Array.isArray(response.sources) || !Array.isArray(response.mapActions)) throw new Error(`${test.name}: invalid structured arrays`)
  console.log(`PASS ${test.name}`)
}

const clusters = detectLocalRiskClusters(db, Date.parse('2026-10-02T12:00:00-06:00'))
if (!Array.isArray(clusters) || clusters.some(item => item.reviewStatus !== 'pending' || item.requireHumanApproval !== true)) {
  throw new Error('admin clusters: suggestions must remain pending for human review')
}
console.log(`PASS admin clusters (${clusters.length} suggestion(s))`)

const placeFallback = await searchNearbyPlaces({
  location,
  categories: ['attractions', 'beaches'],
  fetchImpl: async () => { throw new Error('SIMULATED_PROVIDER_OUTAGE') },
})
if (!placeFallback.places.length || placeFallback.provider !== 'pulse_reference') {
  throw new Error('places fallback: expected verified local references')
}
console.log(`PASS places fallback (${placeFallback.places.length} place(s))`)

const mobility = buildMobilityInsights({
  roads: db.roadStatus,
  weather: { precipitation: 2, wind: 18, forecast: [{ date: '2026-10-05', precipitationProbability: 70, precipitation: 5, maxWind: 24 }, { date: '2026-10-06', precipitationProbability: 20, precipitation: 1, maxWind: 12 }] },
})
if (
  !mobility.hardest
  || mobility.routes.length !== db.roadStatus.length
  || mobility.routes[0].score < mobility.routes.at(-1).score
  || !mobility.wettestDay
  || !mobility.bestDay
  || mobility.totalRain !== 6
  || mobility.rainyDays !== 1
  || mobility.totalIncidents !== 3
  || mobility.next72Hours.length !== 2
  || !mobility.actions.length
  || mobility.mobilityScore < 0
  || mobility.mobilityScore > 100
) {
  throw new Error('mobility insights: expected ranked routes, forecast statistics, and suggested actions')
}
console.log(`PASS mobility insights (${mobility.hardest.route} ${mobility.hardest.score}/100)`)
