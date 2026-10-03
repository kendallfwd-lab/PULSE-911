import { Route } from 'lucide-react'
export function AssistantRouteCard({ card }) { return <article className="pulse-ai-result-card"><Route/><div><span>Ruta</span><strong>{card.title || card.name || 'Opción de recorrido'}</strong><p>{card.summary || card.description}</p></div></article> }
