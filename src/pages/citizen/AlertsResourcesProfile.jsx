import { useState } from 'react'
import { AlertTriangle, BookOpen, CheckCircle2, Clock3, ExternalLink, GraduationCap, HeartHandshake, MapPin, MessageCircle, PlayCircle, RotateCcw, Save, ShieldCheck, X } from 'lucide-react'
import { usePulse } from '../../context/PulseContext'
import GeoMap from '../../components/GeoMap'
import { Badge, InlineNotice } from '../../components/Common'
import { TRAINING_CONTENT } from '../../config/trainingContent'
import { localizeTrainingContent } from '../../config/trainingTranslations'
import { useTranslation } from 'react-i18next'

export function AlertsPage(){const {db}=usePulse();const active=db.alerts.filter(a=>a.active);return <div className="page-stack"><div className="page-heading"><div><span className="eyebrow">INFORMACIÓN PÚBLICA</span><h1>Alertas y zonas de riesgo</h1><p>Avisos simulados publicados por PULSE Command y casos públicos anonimizados.</p></div></div><div className="alerts-layout"><GeoMap incidents={db.incidents.filter(i=>i.publicVisibility&&!['resolved','cancelled'].includes(i.status))} alerts={active} riskZones={db.riskZones||[]} initialZoom={14}/><div className="alert-cards">{active.map(a=><article key={a.id} className="alert-card"><div className="alert-card-head"><AlertTriangle/><Badge tone={a.severity==='warning'?'amber':'blue'}>{a.severity}</Badge></div><h3>{a.title}</h3><p>{a.description}</p><span><MapPin size={14}/>{a.area}</span><div className="instructions"><strong>Indicaciones</strong>{a.instructions}</div></article>)}</div></div></div>}

export function SafetyMapPage(){const {db}=usePulse();const publicIncidents=db.incidents.filter(i=>i.publicVisibility&&!['resolved','cancelled'].includes(i.status));const riskZones=db.riskZones||[];const [selectedId,setSelectedId]=useState(publicIncidents[0]?.id||null);const selected=publicIncidents.find(i=>i.id===selectedId)||publicIncidents[0];const assignedIds=[...new Set([...(selected?.assignedUnits||[]),selected?.assignedUnit].filter(Boolean))];const visibleUnits=selected?db.units.filter(u=>assignedIds.includes(u.id)):db.units;const focusLocations=selected?[selected.location,...visibleUnits.map(u=>u.location).filter(Boolean)]:[];return <div className="page-stack tactical-map-page"><div className="page-heading"><div><span className="eyebrow">MAPA SITUACIONAL CÍVICO</span><h1>Incidentes, unidades, alertas y puntos de riesgo</h1><p>Selecciona un incidente para ver su ubicación y las unidades asignadas al mismo tiempo. El zoom actúa sobre el mapa, no sobre la página.</p></div></div><div className="tactical-map-layout"><section className="tactical-map-main"><div className="tactical-map-head"><div><span>SEGUIMIENTO EN MAPA</span><strong>{selected?`${selected.code} · ${selected.title}`:'Selecciona un incidente'}</strong></div><span>{visibleUnits.length} unidad(es) visibles</span></div><GeoMap incidents={publicIncidents} units={visibleUnits} alerts={db.alerts} riskZones={riskZones} hospitals={db.hospitals||[]} historicalIncidents={db.historicalIncidents||[]} selectedId={selected?.id} onSelectIncident={i=>setSelectedId(i.id)} focusLocations={focusLocations} focusKey={`citizen-${selected?.id||'none'}`} initialCenter={selected?.location} initialZoom={14}/></section><aside className="tactical-map-list"><div className="tactical-summary"><strong>{publicIncidents.length}</strong><span>incidentes públicos activos</span></div>{publicIncidents.map(i=><button type="button" className={`tactical-list-item tactical-select ${selected?.id===i.id?'active':''}`} key={i.id} onClick={()=>setSelectedId(i.id)}><b className={`priority-chip ${i.priority.toLowerCase()}`}>{i.priority}</b><div><strong>{i.title}</strong><span>{i.location.label}</span><small>{i.code} · Riesgo {i.riskScore}/100 · {[...new Set([...(i.assignedUnits||[]),i.assignedUnit].filter(Boolean))].length} unidad(es)</small></div></button>)}<div className="tactical-summary danger-summary"><strong>{riskZones.length}</strong><span>zonas de riesgo registradas</span></div>{riskZones.slice(0,3).map(z=><div className="tactical-list-item risk-list-item" key={z.id}><b className={`risk-dot ${z.severity}`}/><div><strong>{z.title}</strong><span>{z.area}</span><small>{z.reports} reportes asociados</small></div></div>)}<div className="tactical-summary secondary"><strong>{db.units.filter(u=>u.status==='available').length}</strong><span>unidades demo disponibles</span></div></aside></div></div>}

function TrainingQuiz({ course, answers, setAnswers, result, onSubmit, onRetry }) {
  const training = course.training
  const complete = training.questions.every((_, index) => answers[index] !== undefined)
  const whatsappText = result ? `Hola, completé la capacitación “${course.title}” en PULSE 911 con ${result.score} de ${result.total} respuestas correctas. Quiero continuar el curso.` : ''

  return <section className="training-block" aria-labelledby="training-title">
    <div className="training-block-head"><GraduationCap/><div><span>MICROCAPACITACIÓN</span><h3 id="training-title">Marca una respuesta por pregunta</h3></div></div>
    <p>{training.intro}</p>
    <form className="training-quiz" onSubmit={onSubmit}>
      {training.questions.map((question, questionIndex) => <fieldset key={question.prompt}>
        <legend><b>{questionIndex+1}</b>{question.prompt}</legend>
        <div className="training-options">{question.options.map((option, optionIndex) => {
          const selected = answers[questionIndex] === optionIndex
          const state = result && optionIndex === question.answer ? 'correct' : result && selected ? 'incorrect' : ''
          return <label className={state} key={option}>
            <input type="radio" name={`question-${course.id}-${questionIndex}`} checked={selected} disabled={Boolean(result)} onChange={()=>setAnswers(previous=>({...previous,[questionIndex]:optionIndex}))}/>
            <span>{option}</span>
          </label>
        })}</div>
        {result&&<p className="training-explanation">{question.explanation}</p>}
      </fieldset>)}
      {!result&&<button className="btn primary full" disabled={!complete}><CheckCircle2 size={17}/>Revisar mis respuestas</button>}
    </form>
    {result&&<div className="training-result" role="status">
      <CheckCircle2/>
      <div><strong>Capacitación terminada: {result.score}/{result.total}</strong><span>{result.score===result.total?'Excelente. Puedes continuar con una formación más completa.':'Revisa las explicaciones y vuelve a intentarlo cuando quieras.'}</span></div>
      <div className="training-result-actions">
        <button className="btn ghost" type="button" onClick={onRetry}><RotateCcw size={16}/>Repetir</button>
        <a className="btn whatsapp" href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`} target="_blank" rel="noreferrer"><MessageCircle size={17}/>Continuar por WhatsApp</a>
      </div>
    </div>}
    <div className="training-sources"><strong>Fuentes oficiales consultadas</strong>{training.sources.map(source=><a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<ExternalLink size={13}/></a>)}</div>
  </section>
}

export function ResourcesPage(){
  const {i18n}=useTranslation()
  const {db,currentUser,setCourseProgress}=usePulse()
  const [filter,setFilter]=useState('all')
  const [selectedCourse,setSelectedCourse]=useState(null)
  const [lesson,setLesson]=useState(0)
  const [answers,setAnswers]=useState({})
  const [quizResult,setQuizResult]=useState(null)
  const items=db.resources.filter(r=>filter==='all'||r.kind===filter)
  const courses=(db.courses||[]).filter(c=>filter==='all'||c.kind===filter)
  const progressMap=db.courseProgress?.[currentUser?.id]||{}

  const openCourse=course=>{
    const training=localizeTrainingContent(TRAINING_CONTENT[course.id],i18n.resolvedLanguage)
    const lessons=training?.lessons||course.lessons||[]
    setSelectedCourse({...course,lessons,training})
    setLesson(Math.min(Math.max(lessons.length-1,0),Math.floor((progressMap[course.id]||0)/25)))
    setAnswers({})
    setQuizResult(null)
  }
  const closeCourse=()=>{setSelectedCourse(null);setAnswers({});setQuizResult(null)}
  const completeLesson=()=>{
    if(!selectedCourse?.lessons.length)return
    const next=Math.min(75,Math.round(((lesson+1)/selectedCourse.lessons.length)*75))
    setCourseProgress(selectedCourse.id,Math.max(progressMap[selectedCourse.id]||0,next))
    if(lesson<selectedCourse.lessons.length-1)setLesson(lesson+1)
  }
  const submitQuiz=event=>{
    event.preventDefault()
    const questions=selectedCourse?.training?.questions||[]
    if(!questions.length||questions.some((_,index)=>answers[index]===undefined))return
    const score=questions.reduce((total,question,index)=>total+(answers[index]===question.answer?1:0),0)
    setQuizResult({score,total:questions.length})
    setCourseProgress(selectedCourse.id,100)
  }
  const retryQuiz=()=>{setAnswers({});setQuizResult(null)}

  return <div className="page-stack resources-page-v3">
    <div className="page-heading"><div><span className="eyebrow">PREVENCIÓN, SEGURIDAD Y RECUPERACIÓN</span><h1>Aprende a actuar antes, durante y después</h1><p>Cursos y recursos educativos para mejorar la preparación comunitaria.</p></div></div>
    <div className="filter-row">{[['all','Todos'],['physical','Recuperación'],['wellbeing','Bienestar'],['prevention','Preparación']].map(([key,label])=><button key={key} className={filter===key?'active':''} onClick={()=>setFilter(key)}>{label}</button>)}</div>
    <section className="learning-section">
      <div className="learning-heading"><div><GraduationCap/><div><span>CURSOS DE SEGURIDAD</span><h2>Formación práctica para la comunidad</h2></div></div><small>{courses.length} {courses.length===1?'curso':'cursos'}</small></div>
      <div className="course-grid">{courses.map(course=>{const progress=progressMap[course.id]||0;return <article key={course.id} className="course-card"><img src={course.image} alt={`Imagen representativa del curso ${course.title}`} loading="lazy" decoding="async"/><div className="course-card-body"><Badge tone={course.kind==='wellbeing'?'green':'blue'}>{course.kind==='wellbeing'?'Bienestar':'Preparación'}</Badge><h3>{course.title}</h3><p>{course.summary}</p><div className="course-meta"><span><Clock3 size={14}/>{course.duration}</span><span><BookOpen size={14}/>{course.lessons.length} lecciones + evaluación</span></div><div className="course-progress"><i style={{width:`${progress}%`}}/><span>{progress}% completado</span></div><button className="btn primary small" onClick={()=>openCourse(course)}><PlayCircle size={15}/>{progress>=100?'Repasar capacitación':'Iniciar capacitación'}</button></div></article>})}</div>
    </section>
    <section className="learning-section">
      <div className="learning-heading"><div><BookOpen/><div><span>GUÍAS Y RECURSOS</span><h2>Consulta rápida por situación</h2></div></div></div>
      <div className="resource-grid">{items.map(resource=><article key={resource.id} className="resource-card"><img src={resource.image} alt={`Imagen representativa de ${resource.title}`} loading="lazy" decoding="async"/><div><Badge tone={resource.kind==='wellbeing'?'green':'blue'}>{resource.tag}</Badge><h3>{resource.title}</h3><p>{resource.summary}</p><div className="resource-meta"><span><Clock3 size={14}/>{resource.duration}</span><span>{resource.level}</span></div><button className="text-link" onClick={()=>openCourse(resource)}>Abrir capacitación →</button></div></article>)}</div>
    </section>
    <div className="wellbeing-note"><HeartHandshake/><div><h3>Recuperación después de una emergencia</h3><p>La aplicación relaciona el cierre de un incidente con recursos educativos de preparación y bienestar.</p></div></div>
    {selectedCourse&&<div className="course-modal-backdrop" role="presentation" onClick={closeCourse}>
      <section className="course-modal course-learning-modal" role="dialog" aria-modal="true" aria-labelledby="course-title" onClick={event=>event.stopPropagation()}>
        <button className="course-modal-close" onClick={closeCourse} aria-label="Cerrar"><X/></button>
        <aside className="course-modal-poster" aria-label={`Propósito de ${selectedCourse.title}`}>
          <div className="course-modal-poster-image">
            <img src={selectedCourse.image} alt={`Imagen de ${selectedCourse.title}`}/>
            <span><GraduationCap size={15}/>CAPACITACIÓN PULSE 911</span>
          </div>
          <div className="course-modal-poster-copy">
            <span className="course-poster-label"><ShieldCheck size={15}/>PROPÓSITO DE ESTA CAPACITACIÓN</span>
            <h3>{selectedCourse.training?.goal||selectedCourse.summary}</h3>
            <p>{selectedCourse.training?.intro||'Información práctica para actuar con mayor claridad y seguridad.'}</p>
            <div className="course-poster-points">
              {(selectedCourse.lessons||[]).slice(0,3).map(item=><span key={item}><CheckCircle2 size={15}/>{item}</span>)}
            </div>
            <div className="course-poster-result"><strong>Resultado esperado</strong><span>{selectedCourse.training?.result||'Comprender los pasos esenciales y saber cuándo solicitar ayuda.'}</span></div>
          </div>
        </aside>
        <div className="course-modal-body"><span className="eyebrow">CAPACITACIÓN EDUCATIVA</span><h2 id="course-title">{selectedCourse.title}</h2><p>{selectedCourse.summary}</p><div className="course-progress large"><i style={{width:`${progressMap[selectedCourse.id]||0}%`}}/><span>{progressMap[selectedCourse.id]||0}% completado</span></div><ol>{selectedCourse.lessons.map((item,index)=><li key={item} className={index<=lesson?'done':''}><b>{index+1}</b><span>{item}</span></li>)}</ol><button className="btn primary full" type="button" onClick={completeLesson}>{lesson>=selectedCourse.lessons.length-1?'Contenido revisado':'Continuar contenido'}</button>{selectedCourse.training&&<TrainingQuiz course={selectedCourse} answers={answers} setAnswers={setAnswers} result={quizResult} onSubmit={submitQuiz} onRetry={retryQuiz}/>}<div className="info-note">Contenido educativo de demostración. En una emergencia real, contacta al servicio local de emergencias. No certifica competencias clínicas ni sustituye atención profesional.</div></div>
      </section>
    </div>}
  </div>
}

export function ProfilePage(){
  const {currentUser,updateProfile,resetDemo}=usePulse()
  const [form,setForm]=useState(currentUser.profile)
  const [saved,setSaved]=useState(false)
  const [resetArmed,setResetArmed]=useState(false)
  const save=e=>{e.preventDefault();updateProfile(form);setSaved(true);setTimeout(()=>setSaved(false),1800)}
  const runReset=()=>{resetDemo();setResetArmed(false)}
  return <div className="page-stack">
    <div className="page-heading"><div><span className="eyebrow">MI CUENTA</span><h1>Perfil y ficha de emergencia</h1><p>Controla la información declarada y los permisos usados durante los incidentes demo.</p></div></div>
    <form className="profile-layout" onSubmit={save}>
      <section className="panel"><h2>Datos personales</h2><div className="form-grid"><label className="span-2">Nombre completo<input value={form.fullName||''} onChange={e=>setForm({...form,fullName:e.target.value})}/></label><label>Documento<input value={form.document||''} onChange={e=>setForm({...form,document:e.target.value})}/></label><label>Teléfono<input value={form.phone||''} onChange={e=>setForm({...form,phone:e.target.value})}/></label><label>Provincia<input value={form.province||''} onChange={e=>setForm({...form,province:e.target.value})}/></label><label>Distrito<input value={form.district||''} onChange={e=>setForm({...form,district:e.target.value})}/></label><label className="span-2">Dirección<input value={form.address||''} onChange={e=>setForm({...form,address:e.target.value})}/></label></div></section>
      <section className="panel"><h2>Ficha médica de emergencia</h2><div className="form-grid"><label>Tipo de sangre<input value={form.bloodType||''} onChange={e=>setForm({...form,bloodType:e.target.value})}/></label><label>Alergias<input value={form.allergies||''} onChange={e=>setForm({...form,allergies:e.target.value})}/></label><label>Medicamentos<input value={form.medications||''} onChange={e=>setForm({...form,medications:e.target.value})}/></label><label>Condiciones importantes<input value={form.conditions||''} onChange={e=>setForm({...form,conditions:e.target.value})}/></label></div></section>
      <section className="panel span-full emergency-plan-card"><div className="panel-title"><ShieldCheck/><h2>Mi plan de emergencia</h2><Badge tone="green">{Math.round([form.emergencyContact,form.meetingPoint,form.evacuationRoute,form.kitReady].filter(Boolean).length/4*100)}% preparado</Badge></div><div className="form-grid"><label>Contacto principal<input value={form.emergencyContact||form.contacts?.[0]?.name||''} onChange={e=>setForm({...form,emergencyContact:e.target.value})}/></label><label>Punto de reunión<input value={form.meetingPoint||''} onChange={e=>setForm({...form,meetingPoint:e.target.value})}/></label><label>Ruta de evacuación<input value={form.evacuationRoute||''} onChange={e=>setForm({...form,evacuationRoute:e.target.value})}/></label><label>Kit preparado<select value={form.kitReady||'no'} onChange={e=>setForm({...form,kitReady:e.target.value})}><option value="no">No</option><option value="partial">Parcial</option><option value="yes">Sí</option></select></label></div></section>
      <section className="panel span-full"><h2>Privacidad y consentimiento</h2><div className="consents">{[['location',MapPin,'Compartir ubicación durante incidentes'],['medical',HeartHandshake,'Compartir ficha médica con personal autorizado'],['notifyContact',ShieldCheck,'Avisar al contacto principal en la demo']].map(([k,Icon,label])=><label key={k}><input type="checkbox" checked={form.consents?.[k]||false} onChange={e=>setForm({...form,consents:{...form.consents,[k]:e.target.checked}})}/><Icon/>{label}</label>)}</div></section>
      {saved&&<div className="span-full"><InlineNotice tone="success">Cambios guardados en esta demostración.</InlineNotice></div>}
      {resetArmed&&<div className="reset-confirm span-full" role="alert"><div><strong>¿Restablecer todos los datos demo?</strong><span>Se perderán incidentes, cambios de perfil, despachos y escenarios creados localmente.</span></div><div><button type="button" className="btn ghost" onClick={()=>setResetArmed(false)}>Cancelar</button><button type="button" className="btn emergency" onClick={runReset}>Sí, restablecer</button></div></div>}
      <div className="profile-actions"><button className="btn primary"><Save size={17}/>{saved?'Guardado':'Guardar cambios'}</button><button type="button" className="btn ghost" onClick={()=>setResetArmed(true)}>Restablecer datos demo</button></div>
    </form>
  </div>
}
