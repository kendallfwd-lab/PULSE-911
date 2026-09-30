import { useRef, useState } from 'react'
import { AlertTriangle, Camera, Car, CheckCircle2, CircleHelp, Flame, MapPin, Plus, ShieldAlert, UploadCloud, Waves, X, XCircle } from 'lucide-react'
import { usePulse } from '../../context/PulseContext'
import GeoMap from '../../components/GeoMap'
import { Badge } from '../../components/Common'
import { DEMO_MAP_CENTER } from '../../config/demoGeography'

const categories = [
  ['road_hazard','Riesgo vial',AlertTriangle],
  ['traffic_accident','Accidente',Car],
  ['flood','Inundación',Waves],
  ['fire','Incendio',Flame],
  ['other','Otro',CircleHelp]
]
const severities = [['low','Baja'],['medium','Media'],['high','Alta']]
const initialForm = () => ({title:'',category:'road_hazard',severity:'medium',description:'',location:{label:'Sector demo',...DEMO_MAP_CENTER},image:''})

export function CommunityPage(){
  const {db,addPublication}=usePulse()
  const [form,setForm]=useState(initialForm)
  const [open,setOpen]=useState(false)
  const [mediaError,setMediaError]=useState('')
  const fileRef=useRef(null)

  const close=()=>{setOpen(false);setMediaError('')}
  const submit=e=>{e.preventDefault();addPublication(form);close();setForm(initialForm())}
  const chooseImage=file=>{
    setMediaError('')
    if(!file) return
    if(!file.type.startsWith('image/')){setMediaError('Selecciona una imagen válida.');return}
    if(file.size>8*1024*1024){setMediaError('La imagen debe pesar menos de 8 MB.');return}
    const reader=new FileReader()
    reader.onload=()=>setForm(value=>({...value,image:String(reader.result||'')}))
    reader.readAsDataURL(file)
  }
  const draftRisk=form.category!=='traffic_accident'?[{id:'community-draft',...form,title:form.title||'Nuevo punto',area:form.location.label,reports:1,radiusM:150}]:[]
  const draftIncident=form.category==='traffic_accident'?[{id:'community-draft',title:form.title||'Accidente',code:'BORRADOR',category:'traffic_accident',priority:form.severity==='high'?'P1':'P2',status:'received',location:form.location,assignedUnits:[]}]:[]

  return <div className="page-stack">
    <div className="page-heading"><div><span className="eyebrow">REPORTES CIUDADANOS</span><h1>Reportes ciudadanos</h1><p>Comparte información sobre lugares peligrosos, accidentes u obstáculos. El centro de mando revisa cada reporte antes de convertirlo en una alerta operativa.</p></div><button className="btn primary" onClick={()=>setOpen(true)}><Plus size={16}/>Nuevo reporte</button></div>
    <div className="community-layout"><section className="panel"><div className="panel-title"><MapPin/><h2>Mapa de reportes</h2></div><GeoMap riskZones={db.riskZones||[]} incidents={db.incidents.filter(i=>i.publicVisibility)} alerts={db.alerts} initialCenter={form.location} initialZoom={14}/></section><aside className="community-list">{(db.publications||[]).map(p=><article className="community-card" key={p.id}>{p.image&&<img className="community-card-media" src={p.image} alt="Evidencia del reporte"/>}<div className="community-card-head"><Badge tone={p.status==='verified'||p.status==='published'?'green':p.status==='rejected'?'red':'amber'}>{p.status}</Badge><span>{new Date(p.createdAt).toLocaleDateString('es-CR')}</span></div><h3>{p.title}</h3><p>{p.description}</p><span><MapPin size={13}/>{p.location?.label}</span></article>)}{!(db.publications||[]).length&&<div className="empty"><ShieldAlert/><h3>Aún no hay reportes ciudadanos</h3></div>}</aside></div>

    {open&&<div className="course-modal-backdrop community-backdrop" onClick={close}>
      <form className="community-modal community-composer" role="dialog" aria-modal="true" aria-labelledby="community-composer-title" onClick={e=>e.stopPropagation()} onSubmit={submit}>
        <header className="community-composer-head"><div><span>NUEVO REPORTE CIUDADANO</span><h2 id="community-composer-title">Comparte una situación</h2><p>Describe lo esencial, agrega evidencia si la tienes y marca el punto exacto.</p></div><button type="button" className="course-modal-close" aria-label="Cerrar" onClick={close}><X/></button></header>

        <div className="community-composer-grid">
          <section className="community-editor-panel">
            <div className="composer-section-title"><span>01</span><div><strong>¿Qué está ocurriendo?</strong><small>Información visible en la publicación</small></div></div>
            <label className="community-field"><span>Título <small>{form.title.length}/70</small></span><input required maxLength="70" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Ej. Hueco peligroso frente a la escuela"/></label>
            <label className="community-field"><span>Descripción <small>{form.description.length}/300</small></span><textarea required rows="4" maxLength="300" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Cuenta qué observaste y por qué representa un riesgo..."/></label>

            <fieldset className="community-choice-group"><legend>Categoría</legend><div className="community-category-grid">{categories.map(([value,label,Icon])=><button key={value} type="button" className={form.category===value?'active':''} aria-pressed={form.category===value} onClick={()=>setForm({...form,category:value})}><Icon size={18}/><span>{label}</span></button>)}</div></fieldset>
            <fieldset className="community-choice-group"><legend>Nivel de riesgo</legend><div className="community-severity-row">{severities.map(([value,label])=><button key={value} type="button" className={`${value} ${form.severity===value?'active':''}`} aria-pressed={form.severity===value} onClick={()=>setForm({...form,severity:value})}><i/>{label}</button>)}</div></fieldset>

            <div className="community-evidence-block"><div><strong>Evidencia visual</strong><span>Opcional · JPG, PNG o WEBP · máximo 8 MB</span></div>{form.image?<div className="community-image-preview"><img src={form.image} alt="Vista previa de la evidencia"/><button type="button" aria-label="Quitar imagen" onClick={()=>setForm({...form,image:''})}><XCircle size={18}/></button></div>:<button type="button" className="community-upload" onClick={()=>fileRef.current?.click()}><UploadCloud size={21}/><span><strong>Agregar una fotografía</strong><small>Solo si puedes hacerlo de forma segura</small></span></button>}<input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={e=>chooseImage(e.target.files?.[0])}/>{mediaError&&<p className="form-error">{mediaError}</p>}</div>
          </section>

          <section className="community-location-panel">
            <div className="composer-section-title"><span>02</span><div><strong>Ubicación del reporte</strong><small>Haz clic sobre el mapa para mover el punto</small></div></div>
            <label className="community-field location-label"><span>Referencia del lugar</span><div><MapPin size={16}/><input required value={form.location.label} onChange={e=>setForm({...form,location:{...form.location,label:e.target.value}})} placeholder="Barrio, calle o referencia"/></div></label>
            <div className="community-map-picker"><GeoMap compact incidents={draftIncident} riskZones={draftRisk} selectedId="community-draft" initialCenter={form.location} initialZoom={15} onMapClick={location=>setForm({...form,location:{...location,label:'Punto seleccionado en el mapa'}})}/><div className="community-map-hint"><MapPin size={14}/>Toca cualquier lugar para fijar la ubicación</div></div>
            <div className="community-location-confirm"><CheckCircle2 size={18}/><div><strong>Ubicación seleccionada</strong><span>{form.location.label}</span><small>{form.location.lat.toFixed(5)}, {form.location.lng.toFixed(5)}</small></div></div>
          </section>
        </div>

        <footer className="community-composer-actions"><div><ShieldAlert size={17}/><span><strong>Se publicará como pendiente</strong><small>PULSE Command revisará la información antes de validarla.</small></span></div><div><button type="button" className="btn ghost" onClick={close}>Cancelar</button><button className="btn primary"><Camera size={16}/>Publicar para revisión</button></div></footer>
      </form>
    </div>}
  </div>
}
