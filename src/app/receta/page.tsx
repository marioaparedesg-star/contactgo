'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import { analyzePrescription } from '@/lib/prescription'
import { createClient } from '@/lib/supabase'
import { useCartStore } from '@/lib/cart-store'
import { Eye, Search, RotateCcw, ShoppingCart, ChevronRight, CheckCircle, AlertTriangle, Info, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const SPH_VALS = [-20,-19.5,-19,-18.5,-18,-17.5,-17,-16.5,-16,-15.5,-15,-14.5,-14,-13.5,-13,-12.5,
  -12,-11.5,-11,-10.5,-10,-9.5,-9,-8.5,-8,-7.5,-7,-6.5,-6,-5.75,-5.5,-5.25,-5,
  -4.75,-4.5,-4.25,-4,-3.75,-3.5,-3.25,-3,-2.75,-2.5,-2.25,-2,-1.75,-1.5,-1.25,
  -1,-0.75,-0.5,-0.25,0,0.25,0.5,0.75,1,1.25,1.5,1.75,2,2.25,2.5,2.75,3,3.25,
  3.5,3.75,4,4.25,4.5,4.75,5,5.5,6,6.5,7,7.5,8]
const CYL_VALS = [0,-0.75,-1.25,-1.75,-2.25,-2.75,-3.25,-3.75,-4.25,-4.75,-5.25,-5.75]
const AXIS_VALS = Array.from({length:18},(_,i)=>(i+1)*10)
const ADD_OPTS = [
  {label:'Seleccionar',val:''},
  {label:'LOW (+1.00)',val:'1.00'},{label:'LOW (+1.25)',val:'1.25'},
  {label:'MID (+1.50)',val:'1.50'},{label:'MID (+1.75)',val:'1.75'},
  {label:'HIGH (+2.00)',val:'2.00'},{label:'HIGH (+2.50)',val:'2.50'},{label:'HIGH (+3.00)',val:'3.00'},
]

const TIPO_CFG = {
  esferico:   {label:'Lente Esférico',  emoji:'👁️', tag:'Miopía / Hipermetropía', color:{bg:'bg-blue-50',border:'border-blue-200',text:'text-blue-800',badge:'bg-blue-100 text-blue-700',btn:'bg-blue-600 hover:bg-blue-700'}},
  torico:     {label:'Lente Tórico',    emoji:'🎯', tag:'Astigmatismo',            color:{bg:'bg-purple-50',border:'border-purple-200',text:'text-purple-800',badge:'bg-purple-100 text-purple-700',btn:'bg-purple-600 hover:bg-purple-700'}},
  multifocal: {label:'Lente Multifocal',emoji:'🔭', tag:'Presbicia',               color:{bg:'bg-amber-50',border:'border-amber-200',text:'text-amber-800',badge:'bg-amber-100 text-amber-700',btn:'bg-amber-600 hover:bg-amber-700'}},
}

export default function RecetaPage() {
  const [od_sph,set_od_sph]=useState('')
  const [od_cyl,set_od_cyl]=useState('')
  const [od_ax,set_od_ax]=useState('')
  const [oi_sph,set_oi_sph]=useState('')
  const [oi_cyl,set_oi_cyl]=useState('')
  const [oi_ax,set_oi_ax]=useState('')
  const [add,set_add]=useState('')
  const [igual,set_igual]=useState(false)
  const [result,setResult]=useState<any>(null)
  const [products,setProducts]=useState<any[]>([])
  const [loading,setLoading]=useState(false)
  const [done,setDone]=useState(false)
  const [showConsent,setShowConsent]=useState(false)
  const addItem=useCartStore(s=>s.addItem)

  const fmtSph=(v:string)=>v===''?'':parseFloat(v)>0?`+${parseFloat(v).toFixed(2)}`:parseFloat(v).toFixed(2)

  const copyOD=()=>{set_oi_sph(od_sph);set_oi_cyl(od_cyl);set_oi_ax(od_ax)}

  const resetear=()=>{
    set_od_sph('');set_od_cyl('');set_od_ax('');set_oi_sph('');set_oi_cyl('');set_oi_ax('');set_add('');set_igual(false)
    setResult(null);setProducts([]);setDone(false)
  }

  const calcular=async()=>{
    if(!od_sph&&!oi_sph)return
    setLoading(true);setDone(false)
    const rx={od_sph:od_sph?parseFloat(od_sph):null,od_cyl:od_cyl?parseFloat(od_cyl):null,oi_sph:oi_sph?parseFloat(oi_sph):null,oi_cyl:oi_cyl?parseFloat(oi_cyl):null,add_power:add?parseFloat(add):null}
    const analysis=analyzePrescription(rx)
    setResult(analysis)
    const sb=createClient()
    const sph=rx.od_sph??rx.oi_sph??0
    let q=sb.from('products').select('*').eq('activo',true).gt('stock',0).eq('tipo',analysis.recomendacion)
    if(sph!==0)q=q.contains('sph_disponibles',[Number(sph.toFixed(2))])
    const {data}=await q.limit(6)
    if(!data||data.length===0){const {data:fb}=await sb.from('products').select('*').eq('activo',true).eq('tipo',analysis.recomendacion).limit(6);setProducts(fb??[])}
    else setProducts(data)
    setLoading(false);setDone(true)
    setTimeout(()=>document.getElementById('res')?.scrollIntoView({behavior:'smooth',block:'start'}),100)
  }

  const canCalc=od_sph!==''||oi_sph!==''
  const cfg=result?TIPO_CFG[result.recomendacion as keyof typeof TIPO_CFG]:null

  const Select=({val,onChange,opts,placeholder='Seleccionar',disabled=false}:{val:string,onChange:(v:string)=>void,opts:{label:string,val:string}[],placeholder?:string,disabled?:boolean})=>(
    <select value={val} onChange={e=>onChange(e.target.value)} disabled={disabled}
      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 bg-white disabled:opacity-50 disabled:cursor-not-allowed">
      <option value="">{placeholder}</option>
      {opts.filter(o=>o.val!=='').map(o=><option key={o.val} value={o.val}>{o.label}</option>)}
    </select>
  )

  const sphOpts=SPH_VALS.map(v=>({label:v>0?`+${v.toFixed(2)}`:v.toFixed(2),val:v.toFixed(2)}))
  const cylOpts=CYL_VALS.map(v=>({label:v===0?'Sin cilindro':v.toFixed(2),val:v.toFixed(2)}))
  const axOpts=AXIS_VALS.map(v=>({label:`${v}°`,val:String(v)}))

  return (
    <>
      <Navbar />
      <main className="pb-24 min-h-screen bg-gray-50">

        {/* HERO */}
        <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-teal-600 px-4 py-10 md:py-14">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Eye className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="font-display text-2xl md:text-4xl font-black mb-3">Calculadora de lentes de contacto</h1>
            <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto">Ingresa tu receta y te recomendamos los lentes exactos disponibles en República Dominicana.</p>
            <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
              {['Gratis','Sin registro','Resultado inmediato'].map(b=>(
                <div key={b} className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-full text-xs font-semibold">
                  <CheckCircle className="w-3.5 h-3.5"/> {b}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CALCULADORA */}
        <section className="max-w-3xl mx-auto px-4 -mt-4 relative z-10">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900 text-base">Calculadora de adaptación ContactGo</h2>
                <p className="text-xs text-gray-500 mt-0.5">Ingrese su receta de anteojos. Los campos con <span className="text-red-500">*</span> son obligatorios.</p>
              </div>
              <button onClick={resetear} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-all">
                <RotateCcw className="w-3.5 h-3.5"/> Reiniciar
              </button>
            </div>

            <div className="p-6 space-y-7">

              {/* OJO DERECHO */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center"><span className="text-white text-xs font-black">OD</span></div>
                  <h3 className="font-bold text-gray-900">Ojo Derecho</h3>
                  <span className="text-xs text-gray-400">(Right Eye)</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Esfera (SPH) <span className="text-red-500">*</span></label>
                    <Select val={od_sph} onChange={v=>{set_od_sph(v);if(igual){set_oi_sph(v)}}} opts={sphOpts} placeholder="Seleccionar"/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cilindro (CYL)</label>
                    <Select val={od_cyl} onChange={v=>{set_od_cyl(v);if(igual)set_oi_cyl(v)}} opts={cylOpts}/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Eje (AXIS)</label>
                    <Select val={od_ax} onChange={v=>{set_od_ax(v);if(igual)set_oi_ax(v)}} opts={axOpts} disabled={!od_cyl||od_cyl==='0.00'}/>
                  </div>
                </div>
              </div>

              {/* OJO IZQUIERDO */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-teal-600 rounded-full flex items-center justify-center"><span className="text-white text-xs font-black">OI</span></div>
                    <h3 className="font-bold text-gray-900">Ojo Izquierdo</h3>
                    <span className="text-xs text-gray-400">(Left Eye)</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={igual} onChange={e=>{set_igual(e.target.checked);if(e.target.checked)copyOD()}} className="w-4 h-4 accent-primary-600"/>
                    <span className="text-xs text-gray-600 font-medium">¿Igual que el derecho?</span>
                  </label>
                </div>
                <div className={`grid grid-cols-3 gap-3 transition-opacity ${igual?'opacity-50 pointer-events-none':''}`}>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Esfera (SPH) <span className="text-red-500">*</span></label>
                    <Select val={oi_sph} onChange={set_oi_sph} opts={sphOpts} disabled={igual}/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Cilindro (CYL)</label>
                    <Select val={oi_cyl} onChange={set_oi_cyl} opts={cylOpts} disabled={igual}/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Eje (AXIS)</label>
                    <Select val={oi_ax} onChange={set_oi_ax} opts={axOpts} disabled={igual||(!oi_cyl||oi_cyl==='0.00')}/>
                  </div>
                </div>
              </div>

              {/* ADD */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center"><span className="text-white text-xs font-black">+</span></div>
                  <h3 className="font-bold text-gray-900">Información adicional</h3>
                </div>
                <div className="max-w-[220px]">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Adición (ADD) <span className="text-gray-400 font-normal">— Solo si tiene presbicia</span></label>
                  <Select val={add} onChange={set_add} opts={ADD_OPTS.filter(o=>o.val!=='')} placeholder="Seleccionar"/>
                </div>
              </div>

              {/* BOTONES */}
              <div className="flex gap-3 pt-1 border-t border-gray-100">
                <button onClick={resetear} className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 font-semibold px-5 py-3 rounded-2xl hover:bg-gray-50 transition-all text-sm">
                  <RotateCcw className="w-4 h-4"/> Reiniciar
                </button>
                <button onClick={calcular} disabled={!canCalc||loading}
                  className={`flex-1 flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-2xl text-sm text-white transition-all shadow-md
                    ${canCalc&&!loading?'bg-primary-600 hover:bg-primary-700 shadow-primary-200':'bg-gray-300 cursor-not-allowed'}`}>
                  {loading?<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Calculando...</>:<><Search className="w-4 h-4"/>Calcular</>}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* RESULTADOS */}
        {done&&result&&cfg&&(
          <section id="res" className="max-w-3xl mx-auto px-4 mt-6 space-y-4">

            {/* Diagnóstico */}
            <div className={`${cfg.color.bg} ${cfg.color.border} border-2 rounded-3xl p-6`}>
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl ${cfg.color.badge} flex items-center justify-center text-3xl shrink-0`}>{cfg.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.color.badge}`}>{cfg.tag}</span>
                    <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-full font-semibold"><CheckCircle className="w-3 h-3"/>Diagnóstico completado</span>
                  </div>
                  <h3 className={`font-display text-xl font-black ${cfg.color.text} mb-1`}>{cfg.label}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{result.descripcion}</p>
                  {result.condicion.length>0&&(
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {result.condicion.map((c:string)=><span key={c} className="text-xs bg-white/70 text-gray-700 font-medium px-2 py-0.5 rounded-lg border border-white">{c}</span>)}
                    </div>
                  )}
                </div>
              </div>
              {/* Resumen receta */}
              <div className="mt-4 bg-white/60 rounded-2xl p-4 grid grid-cols-4 gap-3 text-center">
                {[
                  {label:'SPH OD',val:od_sph?fmtSph(od_sph):'—'},
                  {label:'SPH OI',val:oi_sph?fmtSph(oi_sph):'—'},
                  {label:'CYL',val:od_cyl&&od_cyl!=='0.00'?od_cyl:'—'},
                  {label:'ADD',val:add?`+${parseFloat(add).toFixed(2)}`:'—'},
                ].map(i=>(
                  <div key={i.label}>
                    <p className="text-xs text-gray-500 mb-0.5">{i.label}</p>
                    <p className="font-black text-gray-900 text-base">{i.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Productos */}
            {products.length>0&&(
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-gray-900">Lentes para tu receta</h3>
                    <p className="text-sm text-gray-500">Productos disponibles en ContactGo con tus parámetros</p>
                  </div>
                  <Link href={`/catalogo?tipo=${result.recomendacion}`} className="text-sm text-primary-600 font-semibold flex items-center gap-1 hover:text-primary-700">
                    Ver más <ChevronRight className="w-4 h-4"/>
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {products.map((p:any)=>(
                    <div key={p.id} className="border border-gray-100 rounded-2xl p-3 hover:border-primary-200 hover:-translate-y-0.5 transition-all">
                      <Link href={`/producto/${p.slug}`}>
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2">
                          {p.imagen_url?<Image src={p.imagen_url} alt={p.nombre} fill className="object-contain p-2" sizes="180px"/>:<div className="w-full h-full flex items-center justify-center text-3xl">👁️</div>}
                        </div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">{p.marca??'ContactGo'}</p>
                        <p className="font-semibold text-gray-900 text-xs leading-snug line-clamp-2 mb-1">{p.nombre}</p>
                        <p className="font-black text-primary-600 text-sm">RD${p.precio?.toLocaleString()}</p>
                      </Link>
                      <button onClick={()=>{addItem(p);toast.success('Agregado al carrito')}}
                        className={`mt-2 w-full ${cfg.color.btn} text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition-all`}>
                        <ShoppingCart className="w-3 h-3"/>Agregar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Aviso tórico */}
            {result.recomendacion==='torico'&&(
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5"/>
                <div>
                  <p className="font-semibold text-amber-800 text-sm mb-1">Tiempo de entrega especial — 20-30 días</p>
                  <p className="text-amber-700 text-xs leading-relaxed">Los lentes tóricos se fabrican a medida según tu prescripción exacta (SPH + CYL + AXIS). A diferencia de los esféricos que se envían en 24-48h, los tóricos requieren fabricación personalizada.</p>
                </div>
              </div>
            )}

            {/* CTA WhatsApp */}
            <div className="bg-gray-900 rounded-3xl p-5 flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div>
                <p className="font-bold text-white mb-0.5">¿Necesitas ayuda con tu receta?</p>
                <p className="text-gray-400 text-xs">Soporte óptico gratis por WhatsApp — respondemos en minutos</p>
              </div>
              <a href="https://wa.me/18294728328?text=Hola%20ContactGo%2C%20necesito%20ayuda%20con%20mi%20receta" target="_blank" rel="noopener noreferrer"
                className="bg-[#25D366] text-white font-bold px-5 py-2.5 rounded-2xl flex items-center gap-2 text-sm shrink-0 hover:bg-[#20ba58] transition-all">
                <svg viewBox="0 0 32 32" className="w-4 h-4 fill-white"><path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.619 4.587 1.773 6.56L2.667 29.333l6.907-1.747A13.244 13.244 0 0016.004 29.333c7.363 0 13.333-5.973 13.333-13.333S23.367 2.667 16.004 2.667z"/></svg>
                Consultar gratis
              </a>
            </div>
          </section>
        )}

        {/* CONSENTIMIENTO */}
        <section className="max-w-3xl mx-auto px-4 mt-6">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <button onClick={()=>setShowConsent(!showConsent)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-500"/>
                <span className="font-semibold text-gray-700 text-sm">Aviso legal y descargo de responsabilidad</span>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showConsent?'rotate-90':''}`}/>
            </button>
            {showConsent&&(
              <div className="px-4 pb-4 space-y-3 text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
                <p><strong className="text-gray-700">Propósito educativo:</strong> Esta calculadora se proporciona con fines informativos únicamente. Los resultados no constituyen una prescripción médica ni reemplazan la consulta con un profesional de la visión certificado.</p>
                <p><strong className="text-gray-700">Consulta profesional obligatoria:</strong> La adaptación de lentes de contacto requiere evaluación presencial por un optometrista u oftalmólogo. ContactGo no se dedica a la prescripción médica.</p>
                <p><strong className="text-gray-700">Responsabilidad:</strong> ContactGo no garantiza que los resultados sean completamente precisos para tu situación. Cada caso clínico es único. Los lentes de contacto son dispositivos médicos — su uso incorrecto puede causar daño ocular. Siga siempre las instrucciones del fabricante.</p>
                <p><strong className="text-gray-700">Los resultados mostrados</strong> se basan en los parámetros actualmente disponibles en el inventario de ContactGo para República Dominicana.</p>
                <div className="bg-primary-50 rounded-xl p-3 mt-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 w-4 h-4 accent-primary-600 shrink-0"/>
                    <span className="text-xs text-primary-800 font-medium">He leído y entiendo el aviso legal. Confirmo que consultaré a un profesional de la visión antes de usar lentes de contacto.</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* GUÍA RECETA */}
        <section className="max-w-3xl mx-auto px-4 mt-5">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-blue-600"/>
              <h3 className="font-bold text-blue-900 text-sm">¿Cómo leer mi receta óptica?</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {sigla:'SPH',desc:'Esfera — tu graduación. Negativo = miopía, positivo = hipermetropía'},
                {sigla:'CYL',desc:'Cilindro — si tienes astigmatismo. Siempre negativo'},
                {sigla:'AXIS',desc:'Eje — dirección del astigmatismo. Va de 0° a 180°'},
                {sigla:'ADD',desc:'Adición — para presbicia. Solo si tienes más de 40 años'},
              ].map(s=>(
                <div key={s.sigla} className="bg-white rounded-xl p-3">
                  <p className="font-black text-primary-600 text-base mb-1">{s.sigla}</p>
                  <p className="text-xs text-gray-600 leading-snug">{s.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-700 mt-3">¿No entiendes tu receta? <Link href="/blog/como-leer-tu-receta" className="font-semibold underline">Lee nuestra guía completa →</Link></p>
          </div>
        </section>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
