import { useEffect, useState } from 'react'
import { getCantons, getDistricts, getProvinces } from '../services/locationService'
import './CostaRicaLocationFields.css'

const normalizeName = value =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLocaleLowerCase('es-CR')

const findLocationId = (locations, name) => {
  const normalizedName = normalizeName(name)
  return locations.find(location => normalizeName(location.name) === normalizedName)?.id || ''
}

export function CostaRicaLocationFields({ province, canton, district, onChange }) {
  const [provinces, setProvinces] = useState([])
  const [cantons, setCantons] = useState([])
  const [districts, setDistricts] = useState([])
  const [provinceId, setProvinceId] = useState('')
  const [cantonId, setCantonId] = useState('')
  const [loading, setLoading] = useState({ provinces: true, cantons: false, districts: false })
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    setLoading(current => ({ ...current, provinces: true }))
    setError('')
    getProvinces(controller.signal)
      .then(options => {
        setProvinces(options)
        setProvinceId(findLocationId(options, province))
      })
      .catch(requestError => {
        if (requestError.name !== 'AbortError') {
          setError('No se pudieron cargar las provincias de Costa Rica.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(current => ({ ...current, provinces: false }))
        }
      })

    return () => controller.abort()
  }, [retryKey])

  useEffect(() => {
    if (!provinceId) {
      setCantons([])
      setDistricts([])
      setCantonId('')
      setLoading(current => ({ ...current, cantons: false, districts: false }))
      return undefined
    }

    const controller = new AbortController()

    setLoading(current => ({ ...current, cantons: true }))
    setError('')
    getCantons(provinceId, controller.signal)
      .then(options => {
        setCantons(options)
        setCantonId(findLocationId(options, canton))
      })
      .catch(requestError => {
        if (requestError.name !== 'AbortError') {
          setError('No se pudieron cargar los cantones de la provincia seleccionada.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(current => ({ ...current, cantons: false }))
        }
      })

    return () => controller.abort()
  }, [provinceId, retryKey])

  useEffect(() => {
    if (!provinceId || !cantonId) {
      setDistricts([])
      setLoading(current => ({ ...current, districts: false }))
      return undefined
    }

    const controller = new AbortController()

    setLoading(current => ({ ...current, districts: true }))
    setError('')
    getDistricts(provinceId, cantonId, controller.signal)
      .then(setDistricts)
      .catch(requestError => {
        if (requestError.name !== 'AbortError') {
          setError('No se pudieron cargar los distritos del cantón seleccionado.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(current => ({ ...current, districts: false }))
        }
      })

    return () => controller.abort()
  }, [provinceId, cantonId, retryKey])

  const selectProvince = event => {
    const nextProvinceId = event.target.value
    const nextProvince = provinces.find(option => option.id === nextProvinceId)?.name || ''

    setProvinceId(nextProvinceId)
    setCantonId('')
    setCantons([])
    setDistricts([])
    onChange({ province: nextProvince, canton: '', district: '' })
  }

  const selectCanton = event => {
    const nextCantonId = event.target.value
    const nextCanton = cantons.find(option => option.id === nextCantonId)?.name || ''

    setCantonId(nextCantonId)
    setDistricts([])
    onChange({ canton: nextCanton, district: '' })
  }

  const selectDistrict = event => {
    const nextDistrict = districts.find(option => option.id === event.target.value)?.name || ''
    onChange({ district: nextDistrict })
  }

  return (
    <>
      <label htmlFor="profile-province">
        Provincia
        <select
          id="profile-province"
          value={provinceId}
          onChange={selectProvince}
          disabled={loading.provinces}
        >
          <option value="">
            {loading.provinces ? 'Cargando provincias…' : 'Selecciona una provincia'}
          </option>
          {provinces.map(option => (
            <option key={option.id} value={option.id}>{option.name}</option>
          ))}
        </select>
      </label>
      <label htmlFor="profile-canton">
        Cantón
        <select
          id="profile-canton"
          value={cantonId}
          onChange={selectCanton}
          disabled={!provinceId || loading.cantons}
        >
          <option value="">
            {loading.cantons ? 'Cargando cantones…' : 'Selecciona un cantón'}
          </option>
          {cantons.map(option => (
            <option key={option.id} value={option.id}>{option.name}</option>
          ))}
        </select>
      </label>
      <label htmlFor="profile-district">
        Distrito
        <select
          id="profile-district"
          value={findLocationId(districts, district)}
          onChange={selectDistrict}
          disabled={!cantonId || loading.districts}
        >
          <option value="">
            {loading.districts ? 'Cargando distritos…' : 'Selecciona un distrito'}
          </option>
          {districts.map(option => (
            <option key={option.id} value={option.id}>{option.name}</option>
          ))}
        </select>
      </label>
      {error && (
        <div className="location-fields-error span-2" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setRetryKey(key => key + 1)}>Reintentar</button>
        </div>
      )}
    </>
  )
}
