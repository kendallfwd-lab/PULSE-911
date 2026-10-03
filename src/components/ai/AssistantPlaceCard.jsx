import { MapPin } from 'lucide-react'
export function AssistantPlaceCard({ card }) { return <article className="pulse-ai-result-card"><MapPin/><div><span>Lugar</span><strong>{card.name || card.title}</strong><p>{card.address || card.description}</p></div></article> }
