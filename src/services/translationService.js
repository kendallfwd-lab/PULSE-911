import { N8N_ENDPOINTS, requestN8N } from './n8nClient'
import { withCache } from './cacheService'

export const translationService = {
  async translate(text, targetLanguage, sourceLanguage = 'auto') {
    if (!text?.trim()) return text
    try {
      const result = await withCache('translation', { text, targetLanguage, sourceLanguage }, () => requestN8N(N8N_ENDPOINTS.translate, { text: text.slice(0, 4000), targetLanguage, sourceLanguage }), 7 * 24 * 60 * 60 * 1000)
      return result.translation || result.text || text
    } catch { return text }
  },
}
