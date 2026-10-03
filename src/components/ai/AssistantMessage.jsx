import { Bot, UserRound, Volume2 } from 'lucide-react'
import { speak } from '../../accessibility/speechService'
import { useTranslation } from 'react-i18next'

export function AssistantMessage({ message, locale = 'es' }) {
  const { t } = useTranslation()
  const isAssistant = message.role === 'assistant'
  return <article className={`pulse-ai-message ${isAssistant ? 'assistant' : 'user'}`}><i>{isAssistant ? <Bot size={18}/> : <UserRound size={18}/>}</i><div><span>{isAssistant ? 'PULSE IA' : locale.startsWith('en') ? 'You' : 'Tú'}</span><p>{message.text}</p>{isAssistant && <button type="button" onClick={() => speak(message.spokenAnswer || message.text, locale)}><Volume2 size={14}/>{t('assistant.listening')}</button>}</div></article>
}
