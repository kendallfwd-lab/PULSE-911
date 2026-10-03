import { useTranslation } from 'react-i18next'
export function AssistantSuggestions({ questions, onSelect }) {
  const {t}=useTranslation()
  return <div className="pulse-ai-suggestions" aria-label={t('assistant.quick')}>{questions.map(question => <button type="button" key={question} onClick={() => onSelect(question)}>{question}</button>)}</div>
}
