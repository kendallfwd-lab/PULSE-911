import { LoaderCircle, MapPin, Search } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { searchCostaRicaLocations } from '../../services/explore/geocodingService'

export function LocationAutocomplete({ id, label, query, onQueryChange, selected, onSelect, placeholder, locale = 'es', className = '' }) {
  const generatedId = useId()
  const inputId = id || `${generatedId}-input`
  const listId = `${inputId}-suggestions`
  const rootRef = useRef(null)
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const value = query.trim()
    if (value.length < 2 || (selected && value === selected.name)) {
      setSuggestions([])
      setLoading(false)
      return undefined
    }
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        const next = await searchCostaRicaLocations(value, { locale, signal: controller.signal })
        setSuggestions(next)
        setOpen(true)
      } catch (requestError) {
        if (!controller.signal.aborted && requestError.name !== 'AbortError') {
          setSuggestions([])
          setError(locale.startsWith('en') ? 'Locations are unavailable right now.' : 'No pudimos consultar ubicaciones en este momento.')
          setOpen(true)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 400)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [locale, query, selected])

  const choose = place => {
    onSelect(place)
    onQueryChange(place.name)
    setOpen(false)
    setSuggestions([])
  }

  return <label className={`explore-location-field ${className}`} ref={rootRef} htmlFor={inputId} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
  }}>
    <span>{label}</span>
    <div className="explore-autocomplete-control">
      <Search size={16} aria-hidden="true"/>
      <input
        id={inputId}
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        onFocus={() => { if (suggestions.length || error) setOpen(true) }}
        onChange={event => { onQueryChange(event.target.value); onSelect(null); setOpen(true) }}
        onKeyDown={event => { if (event.key === 'Escape') setOpen(false) }}
      />
      {loading && <LoaderCircle className="explore-search-spinner" size={16} aria-label={locale.startsWith('en')?'Searching':'Buscando'}/>}
    </div>
    {open && <div id={listId} className="explore-autocomplete-menu" role="listbox">
      {suggestions.map(place => <button key={place.id} type="button" role="option" aria-selected={selected?.id === place.id} onMouseDown={event => event.preventDefault()} onClick={() => choose(place)}>
        <MapPin size={15}/><span><strong>{place.name}</strong><small>{[place.city, place.province, place.country].filter((value, index, list) => value && list.indexOf(value) === index).join(', ')}</small></span>
      </button>)}
      {!loading && error && <p role="status">{error}</p>}
      {!loading && !error && query.trim().length >= 2 && suggestions.length === 0 && <p>{locale.startsWith('en')?'No Costa Rica destinations found.':'No encontramos destinos en Costa Rica.'}</p>}
      <small className="explore-autocomplete-source">Photon · OpenStreetMap</small>
    </div>}
  </label>
}
