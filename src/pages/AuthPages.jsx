import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { Brand } from '../components/Brand'
import { SimulationBanner } from '../components/Common'
import { usePulse } from '../context/PulseContext'
import { useTranslation } from 'react-i18next'

export function LoginPage(){
  const {t}=useTranslation()
  const { login }=usePulse(); const nav=useNavigate(); const loc=useLocation();
  const [form,setForm]=useState({email:'',password:''}); const [error,setError]=useState('')
  const submit=async e=>{e.preventDefault();const r=await login(form.email,form.password);if(!r.ok)return setError(r.message);nav(['admin','dispatcher'].includes(r.user.role)?'/command':(loc.state?.from||'/app'))}
  const fill=(role)=> setForm(role==='admin'?{email:'admin@pulse.demo',password:'Pulse911!'}:{email:'citizen@pulse.demo',password:'Pulse911!'})
  return <div className="auth-page"><SimulationBanner/><div className="auth-wrap"><div className="auth-info"><Brand light/><span className="eyebrow dark">{t('auth.secureDemo')}</span><h1>{t('auth.accessTitle')}</h1><p>{t('auth.accessIntro')}</p><div className="demo-account"><strong>{t('auth.citizen')}</strong><span>citizen@pulse.demo</span><button type="button" onClick={()=>fill('citizen')}>{t('auth.useAccount')}</button></div><div className="demo-account"><strong>Command</strong><span>admin@pulse.demo</span><button type="button" onClick={()=>fill('admin')}>{t('auth.useAccount')}</button></div><small>{t('auth.sharedPassword')} <b>Pulse911!</b></small></div><form className="auth-card" onSubmit={submit}><div className="auth-icon"><ShieldCheck/></div><h2>{t('auth.loginTitle')}</h2><p>{t('auth.loginSubtitle')}</p>{error&&<div className="form-error" role="alert">{error}</div>}<label>{t('auth.email')}<div className="input-icon"><Mail size={17}/><input required type="email" autoComplete="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder={t('auth.emailPlaceholder')}/></div></label><label>{t('auth.password')}<div className="input-icon"><LockKeyhole size={17}/><input required type="password" autoComplete="current-password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••"/></div></label><button className="btn primary full">{t('auth.enter')}</button><div className="auth-footer">{t('auth.noAccount')} <Link to="/register">{t('auth.createCitizen')}</Link></div><Link className="back-link" to="/">{t('auth.backPresentation')}</Link></form></div></div>
}

export function RegisterPage(){
  const {t}=useTranslation()
  const { register }=usePulse(); const nav=useNavigate(); const [error,setError]=useState(''); const [form,setForm]=useState({fullName:'',email:'',password:''})
  const submit=async e=>{e.preventDefault();if(form.password.length<6)return setError(t('auth.minPassword'));const r=await register(form);if(!r.ok)return setError(r.message);nav('/onboarding')}
  return <div className="auth-page"><SimulationBanner/><div className="auth-wrap register-wrap"><div className="auth-info"><Brand light/><span className="eyebrow dark">{t('auth.registerKicker')}</span><h1>{t('auth.createTitle')}</h1><p>{t('auth.createIntro')}</p><ul className="check-list"><li><ShieldCheck/>{t('auth.basicData')}</li><li><ShieldCheck/>{t('auth.medicalFile')}</li><li><ShieldCheck/>{t('auth.contactsPermissions')}</li></ul></div><form className="auth-card" onSubmit={submit}><div className="auth-icon"><UserRound/></div><h2>{t('auth.citizenRegistration')}</h2>{error&&<div className="form-error" role="alert">{error}</div>}<label>{t('auth.fullName')}<input required autoComplete="name" value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})}/></label><label>{t('auth.email')}<input required type="email" autoComplete="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>{t('auth.password')}<input required type="password" autoComplete="new-password" minLength="6" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label><label className="check-row"><input required type="checkbox"/>{t('auth.fictitiousOnly')}</label><button className="btn primary full">{t('auth.createAccount')}</button><div className="auth-footer">{t('auth.hasAccount')} <Link to="/login">{t('auth.loginTitle')}</Link></div></form></div></div>
}
