import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, BellRing, Send, ShieldAlert, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAI } from '../../ai/AIContext'
import { usePulse } from '../../context/PulseContext'
import { useLiveLocation } from '../../context/LiveLocationContext'
import { matchNearbyIncidents } from '../../utils/roadSafety'
import { AssistantMessage } from './AssistantMessage'
import { AssistantSuggestions } from './AssistantSuggestions'
import { AssistantLocationCard } from './AssistantLocationCard'
import { AssistantRouteCard } from './AssistantRouteCard'
import { AssistantPlaceCard } from './AssistantPlaceCard'
import { AssistantDataCard } from './AssistantDataCard'
import { AssistantEmergencyNotice } from './AssistantEmergencyNotice'
import { AIStatusIndicator } from './AIStatusIndicator'
import { getAssistantPublicContext, publicContextRecords } from '../../services/assistantContextService'

function toAIContextCard(item, type) {
  return {
    id: item.id,
    type,
    title: item.title || item.name || item.route || item.code,
    description: item.description || item.area || item.condition || item.address || '',
    status: item.status || item.severity || item.priority,
    updatedAt: item.updatedAt || item.lastUpdatedAt || item.issuedAt || item.createdAt || null,
    sourceType: item.sourceType || (item.citizenId || item.authorId ? 'citizen' : 'pulse_verified'),
    location: item.location && Number.isFinite(item.location.lat) && Number.isFinite(item.location.lng)
      ? { lat: item.location.lat, lng: item.location.lng }
      : null,
  }
}

function uniqueContextRecords(records) {
  const seen = new Set()
  return records.filter(item => {
    const key = item?.id || `${item?.title}-${item?.sourceType}`
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  }).slice(0, 12)
}

function prioritizeContextRecords(message, records) {
  const text = String(message || '').toLowerCase()
  const bySource = source => records.filter(item => item.sourceType === source)
  const weather = bySource('open_meteo')
  const imnAlerts = bySource('imn_alert')
  const news = records.filter(item => ['gdelt_news', 'google_news'].includes(item.sourceType))
  const places = bySource('wikipedia_place')
  const roads = records.filter(item => ['pulse_road', 'pulse_traffic'].includes(item.sourceType))
  const hospitals = bySource('pulse_hospital')
  const community = bySource('pulse_community')
  if (/noticia|actualidad|news|hoy|reciente/.test(text)) return uniqueContextRecords([...imnAlerts, ...news, ...weather, ...roads, ...places])
  if (/clima|tiempo|lluvia|tormenta|viento|weather/.test(text)) return uniqueContextRecords([...imnAlerts, ...weather, ...news, ...roads])
  if (/turis|visitar|playa|parque|museo|restaurante|caf[eé]|lugar/.test(text)) return uniqueContextRecords([...places, ...news, ...hospitals])
  if (/hospital|cl[ií]nica|farmacia/.test(text)) return uniqueContextRecords([...hospitals, ...places, ...roads])
  if (/accidente|carretera|ruta|tr[aá]fico|choque|cierre|mapa/.test(text)) return uniqueContextRecords([...imnAlerts, ...roads, ...community, ...news, ...weather])
  return uniqueContextRecords([...imnAlerts, ...weather, ...roads, ...news.slice(0, 4), ...places.slice(0, 4), ...hospitals])
}

export function PulseAssistant() {
  const { t, i18n } = useTranslation()
  const { db, currentUser } = usePulse()
  const { location, start, stop, isActive } = useLiveLocation()
  const { ask } = useAI()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([{ id: 'welcome', role: 'assistant', text: t('assistant.welcome') }])
  const [loading, setLoading] = useState(false)
  const abortRef = useRef(null)
  const nearby = useMemo(() => location ? matchNearbyIncidents(location, db.incidents, 10) : [], [db.incidents, location])
  const defaultQuestions = useMemo(() => Array.from({ length: 8 }, (_, index) => t(`assistant.q${index + 1}`)), [t, i18n.language])
  const responseQuestions = messages.at(-1)?.suggestedQuestions
  const quickQuestions = responseQuestions?.length ? responseQuestions : defaultQuestions

  useEffect(() => {
    setMessages(current => current.map(message => message.id === 'welcome' ? { ...message, text: t('assistant.welcome') } : message))
  }, [t, i18n.language])

  const submit = async eventOrQuestion => {
    eventOrQuestion?.preventDefault?.()
    const question = typeof eventOrQuestion === 'string' ? eventOrQuestion : input.trim()
    if (!question || loading) return
    setInput('')
    setMessages(current => [...current, { id: `user-${Date.now()}`, role: 'user', text: question }])
    setLoading(true)
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    try {
      const locale = i18n.language.split('-')[0]
      const publicContext = await getAssistantPublicContext({ message: question, location, locale, signal: abortRef.current.signal })
      const activeIncidents = db.incidents.filter(item => !['resolved', 'cancelled'].includes(item.status)).slice(0, 12)
      const pageRecords = [
        ...(db.roadStatus || []).filter(item => item.status !== 'normal').slice(0, 8).map(item => ({ ...toAIContextCard(item, 'road'), sourceType: 'pulse_road' })),
        ...(db.trafficEvents || []).slice(0, 8).map(item => ({ ...toAIContextCard(item, 'traffic'), sourceType: 'pulse_traffic' })),
        ...(db.hospitals || []).slice(0, 8).map(item => ({ ...toAIContextCard(item, 'hospital'), sourceType: 'pulse_hospital' })),
        ...(db.publications || []).filter(item => ['verified', 'published'].includes(item.status)).slice(0, 6).map(item => ({ ...toAIContextCard(item, 'community'), sourceType: 'pulse_community' })),
        ...publicContextRecords(publicContext),
      ]
      const response = await ask({
        message: question.slice(0, 1000),
        sessionId: currentUser?.id || 'anonymous',
        locale,
        mode: 'citizen',
        location: location ? { lat: location.lat, lng: location.lng, accuracy: location.accuracy, timestamp: location.updatedAt } : null,
        context: {
          nearbyIncidentIds: nearby.slice(0, 12).map(item => item.id),
          nearbyRiskZoneIds: (db.riskZones || []).slice(0, 12).map(item => item.id),
          activeAlertIds: db.alerts.filter(item => item.active !== false).slice(0, 12).map(item => item.id),
          nearbyIncidents: (nearby.length ? nearby : activeIncidents).slice(0, 12).map(item => toAIContextCard(item, 'incident')),
          nearbyRiskZones: (db.riskZones || []).slice(0, 12).map(item => toAIContextCard(item, 'risk_zone')),
          activeAlerts: db.alerts.filter(item => item.active !== false).slice(0, 12).map(item => toAIContextCard(item, 'alert')),
          externalEvents: prioritizeContextRecords(question, pageRecords),
          contextGeneratedAt: publicContext?.generatedAt || new Date().toISOString(),
          contextLocationIsDefault: Boolean(publicContext?.usedDefaultLocation),
        },
      }, abortRef.current.signal)
      setMessages(current => [...current, {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: response.answer,
        spokenAnswer: response.spokenAnswer,
        cards: response.cards,
        engine: response.engine,
        suggestedQuestions: Array.isArray(response.suggestedQuestions)
          ? response.suggestedQuestions.filter(question => typeof question === 'string' && question.trim()).slice(0, 8)
          : [],
      }])
    } catch {
      setMessages(current => [...current, { id: `error-${Date.now()}`, role: 'assistant', text: t('assistant.requestError') }])
    } finally {
      setLoading(false)
    }
  }

  const latestCards = messages.at(-1)?.cards || []
  const renderCard = (card, index) => {
    const key = card.id || index
    if (card.type === 'route') return <AssistantRouteCard key={key} card={card}/>
    if (card.type === 'place') return <AssistantPlaceCard key={key} card={card}/>
    return <AssistantDataCard key={key} card={card}/>
  }

  return <div className="pulse-ai-layout">
    <section className="pulse-ai-chat">
      <header>
        <div><span><Sparkles size={15}/>{t('assistant.kicker')}</span><h1>{t('assistant.title')}</h1><p>{t('assistant.subtitle')}</p></div>
        <AIStatusIndicator/>
      </header>
      <AssistantEmergencyNotice/>
      <div className="pulse-ai-messages" aria-live="polite">
        {messages.map(message => <AssistantMessage key={message.id} message={message} locale={i18n.language}/>)}
        {loading && <div className="pulse-ai-loading" role="status"><i/><span>{t('status.degraded')}</span></div>}
      </div>
      <AssistantSuggestions questions={quickQuestions} onSelect={submit}/>
      <form onSubmit={submit}>
        <label><textarea aria-label={t('assistant.placeholder')} rows="1" maxLength="1000" value={input} onChange={event => setInput(event.target.value)} placeholder={t('assistant.placeholder')}/></label>
        <button className="btn primary" type="submit" disabled={!input.trim() || loading}><Send size={17}/>{t('assistant.send')}</button>
      </form>
    </section>
    <aside className="pulse-ai-context">
      <AssistantLocationCard location={location} active={isActive} onToggle={isActive ? stop : start}/>
      <section><h2><AlertTriangle size={17}/>{t('assistant.nearbyIncidents')}</h2><strong>{nearby.length}</strong><p>{t('assistant.within10')}</p></section>
      <section><h2><BellRing size={17}/>{t('assistant.activeAlerts')}</h2><strong>{db.alerts.filter(item => item.active !== false).length}</strong><p>{t('assistant.verifyAlerts')}</p></section>
      <section><h2><ShieldAlert size={17}/>{t('assistant.privacy')}</h2><p>{t('assistant.privacyText')}</p></section>
      {latestCards.map(renderCard)}
    </aside>
  </div>
}
