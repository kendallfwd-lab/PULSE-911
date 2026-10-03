import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { N8N_ENDPOINTS, AI_ENABLED, getAIStatus, requestN8N } from '../services/n8nClient'
import { usePulse } from '../context/PulseContext'
import { createLocalPulseResponse } from './localPulseAI'

const AIContext = createContext(null)

function validResponse(data) {
  if (!data || data.ok !== true || typeof data.answer !== 'string') throw new Error('INVALID_AI_RESPONSE')
  return { ...data, answer: data.answer.slice(0, 8000), cards: Array.isArray(data.cards) ? data.cards.slice(0, 12) : [], mapActions: Array.isArray(data.mapActions) ? data.mapActions.slice(0, 12) : [], suggestedQuestions: Array.isArray(data.suggestedQuestions) ? data.suggestedQuestions.slice(0, 8) : [] }
}

export function AIProvider({ children }) {
  const { db } = usePulse()
  const [status, setStatus] = useState(AI_ENABLED ? 'degraded' : 'local')
  const [checkedAt, setCheckedAt] = useState(null)
  const refreshStatus = useCallback(async () => {
    const result = await getAIStatus()
    const next = AI_ENABLED && result.state === 'online' ? 'online' : 'local'
    setStatus(next)
    setCheckedAt(result.checkedAt)
    return { ...result, state: next }
  }, [])
  useEffect(() => { refreshStatus() }, [refreshStatus])
  const ask = useCallback(async (payload, signal) => {
    if (AI_ENABLED) {
      try {
        return validResponse(await requestN8N(N8N_ENDPOINTS.chat, payload, { signal, timeoutMs: 18000 }))
      } catch (error) {
        if (signal?.aborted) throw error
        setStatus('local')
      }
    }
    return validResponse(await createLocalPulseResponse(payload, db, { signal }))
  }, [db])
  const value = useMemo(() => ({ status, checkedAt, refreshStatus, ask, enabled: AI_ENABLED }), [status, checkedAt, refreshStatus, ask])
  return <AIContext.Provider value={value}>{children}</AIContext.Provider>
}

export function useAI() {
  const context = useContext(AIContext)
  if (!context) throw new Error('useAI debe utilizarse dentro de AIProvider.')
  return context
}
