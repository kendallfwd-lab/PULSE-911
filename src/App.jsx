import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'

function ResetScrollOnNavigation(){
  const {pathname}=useLocation()

  useEffect(()=>{
    window.scrollTo(0,0)
    document.querySelector('.admin-main, .civic-main')?.scrollTo(0,0)
  },[pathname])

  return null
}

export default function App(){
  return <>
    <ResetScrollOnNavigation />
    <a className="skip-link" href="#route-content">Saltar al contenido principal</a>
    <div id="route-content" tabIndex="-1">
      <AppRoutes />
    </div>
  </>
}
