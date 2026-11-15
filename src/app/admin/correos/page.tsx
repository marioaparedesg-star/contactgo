'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Activity, ArrowLeft, CheckCircle2, Clock3, Mail, RefreshCw, Search, Settings2, ShieldCheck, Users, XCircle } from 'lucide-react'

type Log = { id:string; to_email:string; subject:string; template:string; order_id:string|null; status:string; resend_id:string|null; created_at:string }
const sections = [
  { key:'transaccional', title:'Correos transaccionales', desc:'Avisos operativos de pedidos y pagos', items:[
    ['pedido_recibido','Pedido recibido','Cliente + administrador'],['pago_aprobado','Pago aprobado','Cliente + administrador'],['pedido_confirmado','Pedido confirmado','Cliente'],['preparando','Pedido en preparación','Cliente'],['fabricante','Pedido en fabricante','Cliente'],['enviado','Pedido despachado','Cliente'],['transito','Pedido en tránsito','Cliente'],['entregado','Pedido entregado','Cliente'],['cancelado','Pedido cancelado','Cliente + administrador']
  ]},
  { key:'educacion', title:'Educación y cuidado', desc:'Contenido útil según etapa y tipo de producto', items:[
    ['bienvenida','Bienvenida a ContactGo','Cliente'],['prospecto_d2','Qué son los lentes de contacto · Día 2','Cliente con consentimiento'],['prospecto_d5','Tipos de lentes · Día 5','Cliente con consentimiento'],['prospecto_d9','Higiene y cuidado · Día 9','Cliente con consentimiento'],['prospecto_d14','Errores frecuentes · Día 14','Cliente con consentimiento'],['prospecto_d21','Cómo elegir · Día 21','Cliente con consentimiento'],['prospecto_d30','Hábitos de salud visual · Día 30','Cliente con consentimiento'],['diarios_d1','Lentes diarios · uso inicial · Día 1','Cliente'],['diarios_d3','Lentes diarios · higiene · Día 3','Cliente'],['diarios_d7','Lentes diarios · no reutilizar · Día 7','Cliente'],['diarios_d15','Lentes diarios · hábitos de comodidad · Día 15','Cliente'],['diarios_d25','Lentes diarios · planificación de reposición · Día 25','Cliente'],['mensuales_d1','Lentes mensuales · inserción y retirada · Día 1','Cliente'],['mensuales_d3','Lentes mensuales · limpieza y desinfección · Día 3','Cliente'],['mensuales_d7','Lentes mensuales · almacenamiento · Día 7','Cliente'],['mensuales_d15','Lentes mensuales · errores frecuentes · Día 15','Cliente'],['mensuales_d25','Lentes mensuales · control de reemplazo · Día 25','Cliente'],['toricos_d1','Lentes tóricos · conceptos básicos · Día 1','Cliente'],['toricos_d4','Lentes tóricos · orientación · Día 4','Cliente'],['toricos_d8','Lentes tóricos · adaptación · Día 8','Cliente'],['toricos_d15','Lentes tóricos · cuidado · Día 15','Cliente'],['toricos_d30','Lentes tóricos · seguimiento · Día 30','Cliente'],['multifocales_d1','Multifocales · funcionamiento · Día 1','Cliente'],['multifocales_d4','Multifocales · adaptación · Día 4','Cliente'],['multifocales_d10','Multifocales · comodidad · Día 10','Cliente'],['multifocales_d20','Multifocales · cuándo consultar · Día 20','Cliente'],['multifocales_d30','Multifocales · seguimiento · Día 30','Cliente'],['color_d1','Lentes de color · uso responsable · Día 1','Cliente'],['color_d3','Lentes de color · higiene · Día 3','Cliente'],['color_d7','Lentes de color · limpieza y almacenamiento · Día 7','Cliente'],['color_d15','Lentes de color · errores frecuentes · Día 15','Cliente'],['color_d25','Lentes de color · reemplazo · Día 25','Cliente'],['soluciones_d1','Soluciones y gotas · propósito · Día 1','Cliente'],['soluciones_d4','Soluciones y gotas · uso correcto · Día 4','Cliente'],['soluciones_d10','Soluciones y gotas · higiene del estuche · Día 10','Cliente'],['soluciones_d20','Soluciones y gotas · errores de almacenamiento · Día 20','Cliente'],['postcompra_producto','Secuencias segmentadas por tipo y duración real del producto','Cliente']
  ]},
  { key:'recuperacion', title:'Recuperación y recompra', desc:'Seguimientos que se detienen al convertir', items:[
    ['carrito_1h','Carrito abandonado · 1 hora','Cliente'],['carrito_24h','Carrito abandonado · 24 horas','Cliente'],['carrito_48h','Carrito abandonado · 48 horas','Cliente'],['checkout_2h','Checkout incompleto · 2 horas','Cliente'],['pago_pendiente','Pago pendiente','Cliente'],['pago_fallido','Pago no completado','Cliente'],['recompra','Recordatorio de reposición','Cliente']
  ]},
  { key:'fidelizacion', title:'Fidelización y satisfacción', desc:'Postventa, reseñas y relación a largo plazo', items:[
    ['satisfaccion_d7','Encuesta de satisfacción · Día 7','Cliente'],['resena_d14','Solicitud de reseña · Día 14','Cliente'],['inactivo','Reactivación de cliente','Cliente con consentimiento'],['newsletter','Boletín educativo mensual','Cliente con consentimiento']
  ]},
  { key:'administrador', title:'Correos para administración', desc:'Alertas para gestionar la operación', items:[
    ['admin_nuevo_pedido','Nuevo pedido recibido','Administrador'],['admin_pago','Pago aprobado','Administrador'],['admin_estado','Cambio de estado','Administrador'],['admin_error_email','Error, rebote o rechazo de entrega','Administrador'],['admin_pedido_pendiente','Pedido sin avance o pendiente de gestión','Administrador'],['admin_pago_pendiente','Pago pendiente de verificación','Administrador'],['admin_resumen','Resumen operativo diario de pedidos y correos','Administrador'],['admin_stock','Alerta de incidencias operativas','Administrador'],['admin_suscripcion','Suscripción o reposición próxima','Administrador']
  ]}
] as const

export default function AdminCorreosPage() {
  const router = useRouter()
  const [logs,setLogs] = useState<Log[]>([])
  const [stats,setStats] = useState({total:0,enviados:0,errores:0,hoy:0})
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState('')
  const [tab,setTab] = useState<'overview'|'catalog'|'history'>('overview')
  const [search,setSearch] = useState('')
  const cargar = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const r = await fetch('/api/admin/correos', { cache:'no-store' })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'No se pudo cargar el historial')
      setLogs(j.logs || []); setStats(j.stats || {total:0,enviados:0,errores:0,hoy:0})
    } catch(e:any) { setError(e.message || 'Error de conexión') }
    finally { setLoading(false) }
  },[])
  useEffect(()=>{ cargar() },[cargar])
  const filtered = useMemo(()=>logs.filter(l=>[l.to_email,l.subject,l.template,l.status].join(' ').toLowerCase().includes(search.toLowerCase())),[logs,search])
  const fmt = (v:string)=>new Date(v).toLocaleString('es-DO',{dateStyle:'medium',timeStyle:'short'})
  return <main className="min-h-screen bg-[#f5f7fa] p-4 md:p-7 space-y-6">
    <header className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <button onClick={()=>router.push('/M1Alexander')} className="h-10 w-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center"><ArrowLeft className="w-4 h-4"/></button>
        <div><div className="flex items-center gap-2"><Mail className="w-5 h-5 text-[#008f98]"/><h1 className="text-2xl font-black text-[#002455]">Centro de correos</h1></div><p className="text-sm text-slate-500 mt-1">Automatizaciones, plantillas, entregas y alertas de ContactGo</p></div>
      </div>
      <button onClick={cargar} disabled={loading} className="rounded-xl bg-[#002455] text-white px-4 py-2.5 text-sm font-bold flex items-center gap-2"><RefreshCw className={`w-4 h-4 ${loading?'animate-spin':''}`}/>Actualizar</button>
    </header>
    <div className="max-w-7xl mx-auto space-y-5">
      <nav className="flex gap-2 border-b border-slate-200">
        {([['overview','Resumen'],['catalog','Catálogo de correos'],['history','Historial de envíos']] as const).map(([k,label])=><button key={k} onClick={()=>setTab(k)} className={`px-4 py-3 text-sm font-bold border-b-2 ${tab===k?'border-[#01B2B7] text-[#002455]':'border-transparent text-slate-500'}`}>{label}</button>)}
      </nav>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-4 text-sm">{error}</div>}
      {tab==='overview' && <>
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[[Mail,'Correos registrados',stats.total],[CheckCircle2,'Enviados',stats.enviados],[XCircle,'Errores',stats.errores],[Clock3,'Actividad de hoy',stats.hoy]].map(([Icon,label,value]:any)=><div key={label} className="rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-center justify-between text-slate-500 text-xs font-semibold"><span>{label}</span><Icon className="w-4 h-4"/></div><div className="text-3xl font-black text-[#002455] mt-3 tabular-nums">{value}</div></div>)}
        </section>
        <section className="grid lg:grid-cols-[1.3fr_.7fr] gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="font-extrabold text-[#002455]">Mapa del sistema</h2><p className="text-sm text-slate-500 mt-1">Una vista central para controlar comunicaciones a clientes y administración.</p><div className="grid sm:grid-cols-2 gap-3 mt-5">{sections.map(s=><button key={s.key} onClick={()=>setTab('catalog')} className="text-left border border-slate-100 hover:border-[#01B2B7] rounded-xl p-4"><div className="font-bold text-sm text-[#002455]">{s.title}</div><p className="text-xs text-slate-500 mt-1">{s.desc}</p><div className="text-xs font-bold text-[#008f98] mt-3">{s.items.length} tipos de correo</div></button>)}</div></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4"><h2 className="font-extrabold text-[#002455]">Reglas globales</h2>{[[ShieldCheck,'Consentimiento explícito','Promociones y educación comercial solo con autorización.'],[Activity,'Control de duplicados','Registro por evento y pedido para evitar envíos repetidos.'],[Users,'Separación de destinatarios','Correos de clientes y avisos administrativos diferenciados.'],[Settings2,'Control operativo','Pausar automatizaciones y revisar errores antes de activar.']].map(([I,t,d]:any)=><div key={t} className="flex gap-3"><I className="w-5 h-5 text-[#008f98] shrink-0 mt-0.5"/><div><div className="text-sm font-bold text-slate-800">{t}</div><p className="text-xs text-slate-500 mt-1">{d}</p></div></div>)}</div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><h2 className="font-extrabold text-[#002455]">Últimos envíos</h2><button onClick={()=>setTab('history')} className="text-sm font-bold text-[#008f98]">Ver historial</button></div><div className="mt-3 divide-y divide-slate-100">{logs.slice(0,6).map(l=><div key={l.id} className="py-3 flex flex-wrap justify-between gap-2 text-sm"><div><div className="font-semibold text-slate-800">{l.subject || l.template}</div><div className="text-xs text-slate-500">{l.to_email} · {l.template}</div></div><div className="text-xs text-slate-500">{fmt(l.created_at)} · {l.status}</div></div>)}{!logs.length && <p className="py-6 text-sm text-slate-500">{loading?'Cargando…':'Aún no hay registros disponibles.'}</p>}</div></section>
      </>}
      {tab==='catalog' && <div className="space-y-4">{sections.map(s=><section key={s.key} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="mb-4"><h2 className="font-extrabold text-[#002455]">{s.title}</h2><p className="text-xs text-slate-500 mt-1">{s.desc}</p></div><div className="divide-y divide-slate-100">{s.items.map(([key,title,to])=><div key={key} className="py-3 flex flex-wrap items-center justify-between gap-2"><div><div className="text-sm font-bold text-slate-800">{title}</div><div className="text-xs text-slate-500">{key} · Destinatario: {to}</div></div><span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">En diseño / validación</span></div>)}</div></section>)}</div>}
      {tab==='history' && <section className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-extrabold text-[#002455]">Historial de correos</h2><p className="text-xs text-slate-500 mt-1">Últimos 150 registros disponibles en el sistema.</p></div><div className="relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar correo, asunto o plantilla…" className="border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm w-72 max-w-full"/></div></div><div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-left text-xs text-slate-500 border-b border-slate-100"><th className="py-3 pr-3">Fecha</th><th className="py-3 pr-3">Destinatario</th><th className="py-3 pr-3">Asunto</th><th className="py-3 pr-3">Tipo</th><th className="py-3">Estado</th></tr></thead><tbody>{filtered.map(l=><tr key={l.id} className="border-b border-slate-50"><td className="py-3 pr-3 whitespace-nowrap text-xs text-slate-500">{fmt(l.created_at)}</td><td className="py-3 pr-3">{l.to_email}</td><td className="py-3 pr-3 min-w-56">{l.subject}</td><td className="py-3 pr-3 text-xs text-slate-500">{l.template}</td><td className="py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${l.status==='sent'?'bg-emerald-50 text-emerald-700':'bg-red-50 text-red-700'}`}>{l.status}</span></td></tr>)}</tbody></table>{!filtered.length&&<p className="py-8 text-center text-sm text-slate-500">No hay resultados para esta búsqueda.</p>}</div></section>}
    </div>
  </main>
}
