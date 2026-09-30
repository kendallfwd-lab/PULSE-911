import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

const LiveLocationContext = createContext(null)

const errorMessages = {
  1: 'Permiso de ubicación denegado. Puedes habilitarlo desde la configuración del navegador.',
  2: 'El dispositivo no pudo determinar tu ubicación actual.',
  3: 'La solicitud de ubicación tardó demasiado. Inténtalo nuevamente.',
}

export function LiveLocationProvider({ children }) {
  const watchIdRef = useRef(null)
  const [status,setStatus] = useState('idle')
  const [location,setLocation] = useState(null)
  const [error,setError] = useState('')

  const stop = useCallback(()=>{
    if(watchIdRef.current!=null && navigator.geolocation) navigator.geolocation.clearWatch(watchIdRef.current)
    watchIdRef.current=null
    setStatus(current=>current==='unsupported'?'unsupported':'idle')
  },[])

  const start = useCallback(()=>{
    if(!navigator.geolocation){
      setStatus('unsupported')
      setError('Este navegador no permite obtener la ubicación en tiempo real.')
      return
    }
    if(watchIdRef.current!=null) return
    setStatus('requesting')
    setError('')
    watchIdRef.current=navigator.geolocation.watchPosition(position=>{
      const {latitude,longitude,accuracy,altitude,heading,speed}=position.coords
      setLocation({lat:latitude,lng:longitude,accuracy,altitude,heading,speed,updatedAt:position.timestamp})
      setStatus('active')
      setError('')
    },geoError=>{
      if(watchIdRef.current!=null) navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current=null
      setStatus(geoError.code===1?'denied':'error')
      setError(errorMessages[geoError.code]||'No fue posible activar la ubicación en tiempo real.')
    },{enableHighAccuracy:true,maximumAge:3000,timeout:15000})
  },[])

  useEffect(()=>()=>{
    if(watchIdRef.current!=null && navigator.geolocation) navigator.geolocation.clearWatch(watchIdRef.current)
  },[])

  const value=useMemo(()=>({location,status,error,start,stop,isActive:status==='active'||status==='requesting'}),[location,status,error,start,stop])
  return <LiveLocationContext.Provider value={value}>{children}</LiveLocationContext.Provider>
}

export function useLiveLocation(){
  const context=useContext(LiveLocationContext)
  if(!context) throw new Error('useLiveLocation debe utilizarse dentro de LiveLocationProvider')
  return context
}
