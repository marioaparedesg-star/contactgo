'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react'

type AuditoriaItem = {
  id: string; nombre: string; tipo: string; marca: string; activo: boolean; archivado: boolean
  imagen_url?: string; descripcion?: string; slug?: string; sph_disponibles?: any[]
  stock: number; gtin?: string; categoria_id?: number
}

type Problema = { campo: string; severidad: 'error' | 'advertencia'; msg: string }

function auditarProducto(p: AuditoriaItem): Problema[] {
  const problemas: Problema[] = []
  if (!p.imagen_url)                problemas.push({ campo:'Imagen',      severidad:'error',       msg:'Sin imagen' })
  if (!p.descripcion || p.descripcion.length < 30)
                                    problemas.push({ campo:'Descripción',  severidad:'advertencia', msg:'Descripción corta o ausente' })
  if (!p.slug)                      problemas.push({ campo:'SEO',          severidad:'error',       msg:'Sin slug (URL rota)' })
  if (!p.gtin)                      problemas.push({ campo:'GTIN',         severidad:'advertencia', msg:'Sin GTIN/EAN' })
  if (p.stock === 0 && p.activo)    problemas.push({ campo:'Inventario',   severidad:'error',       msg:'Producto activo sin stock' })
  if (!p.categoria_id)              problemas.push({ campo:'Categoría',    severidad:'advertencia', msg:'Sin categoría asignada' })
  if (p.archivado)                  problemas.push({ campo:'Estado',       severidad:'advertencia', msg:'Producto archivado' })
  if (!p.activo && !p.archivado)    problemas.push({ campo:'Estado',       severidad:'advertencia', msg:'Producto oculto (inactivo)' })
  if (['esferico','torico','multifocal','color'].includes(p.tipo) && !(p.sph_disponibles?.length))
                                    problemas.push({ campo:'SPH',          severidad:'error',       msg:'Sin rangos de SPH configurados' })
  return problemas
}

export default function AuditoriaPage() {
  const [items,    setItems]    = useState<AuditoriaItem[]>([])
  const [loading,  setLoading]  = useState(true)
  const [filtro,   setFiltro]   = useState<'todos' | 'con_errores' | 'con_advertencias'>('con_errores')
  const [ultima,   setUltima]   = useState<Date | null>(null)
  const sb = createClient()

  const cargar = async () => {
    setLoading(true)
    const { data } = await sb.from('products')
      .select('id,nombre,tipo,marca,activo,archivado,imagen_url,descripcion,slug,sph_disponibles,stock,gtin,categoria_id')
      .order('tipo').order('nombre')
    setItems(data ?? [])
    setUltima(new Date())
    setLoading(false)
  }

  useEffect(() => { cargar() }, [])

  const auditados = items.map(p => ({ ...p, problemas: auditarProducto(p) }))
  const conErrores       = auditados.filter(p => p.problemas.some(x => x.severidad === 'error'))
  const conAdvertencias  = auditados.filter(p => p.problemas.some(x => x.severidad === 'advertencia'))
  const sinProblemas     = auditados.filter(p => p.problemas.length === 0)

  const filtrados = filtro === 'todos' ? auditados
    : filtro === 'con_errores' ? conErrores
    : conAdvertencias

  const totalProblemas = auditados.reduce((s,p) => s + p.problemas.length, 0)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">Auditoría del catálogo</h1>
              <p className="text-xs text-gray-500">
                {ultima ? `Última actualización: ${ultima.toLocaleTimeString()}` : 'Cargando...'}
              </p>
            </div>
          </div>
          <button onClick={cargar} disabled={loading}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 disabled:opacity-50">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Actualizar
          </button>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { key:'con_errores',       label:'Con errores',      icon:'❌', val:conErrores.length,      color:'text-red-700',    bg:'bg-red-50' },
            { key:'con_advertencias',  label:'Con advertencias', icon:'⚠️', val:conAdvertencias.length, color:'text-amber-700',  bg:'bg-amber-50' },
            { key:'todos',             label:'Sin problemas',    icon:'✅', val:sinProblemas.length,    color:'text-green-700',  bg:'bg-green-50' },
          ].map(k => (
            <button key={k.key} onClick={() => setFiltro(k.key as any)}
              className={`${k.bg} rounded-2xl p-4 text-left border-2 transition-all ${filtro === k.key ? 'border-current shadow-md' : 'border-transparent'}`}>
              <p className="text-2xl font-black">{k.val}</p>
              <p className={`text-xs font-bold mt-1 ${k.color}`}>{k.icon} {k.label}</p>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <p className="text-xs font-black text-gray-500 uppercase tracking-wide">
              {filtrados.length} producto{filtrados.length !== 1 ? 's' : ''} · {totalProblemas} problema{totalProblemas !== 1 ? 's' : ''} detectado{totalProblemas !== 1 ? 's' : ''}
            </p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtrados.map(p => (
                <div key={p.id} className="px-4 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm">{p.nombre}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{p.marca} · {p.tipo}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {p.problemas.length === 0 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-green-100 text-green-700 font-bold px-2 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3" /> Sin problemas
                        </span>
                      ) : p.problemas.map((pr, i) => (
                        <span key={i} className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${
                          pr.severidad === 'error' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {pr.severidad === 'error' ? <XCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {pr.campo}: {pr.msg}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {filtrados.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-400" />
                  <p className="font-bold">Todos los productos están bien configurados</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
