'use client'
import { useState, useRef, useEffect } from 'react'
import { SlidersHorizontal, X, ChevronDown, Check } from 'lucide-react'

interface Tipo  { value: string; label: string }
interface Orden { value: string; label: string }

interface Props {
  tipos:           Tipo[]
  marcas:          string[]
  tipoActivo:      string
  marcaActiva:     string
  duracionActiva:  string
  ordenActivo:     string
  ordenes:         Orden[]
  buildUrl:        (current: any, overrides: any) => string
  currentParams:   any
}

const DURACIONES = [
  { v: '',   l: 'Todas' },
  { v: '1',  l: 'Diarios' },
  { v: '14', l: 'Quincenales' },
  { v: '30', l: 'Mensuales' },
]

export default function CatalogoFiltros({
  tipos, marcas, tipoActivo, marcaActiva, duracionActiva,
  ordenActivo, ordenes, buildUrl, currentParams
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Cerrar al click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Contar filtros activos
  const activeCount = [
    tipoActivo, marcaActiva, duracionActiva,
  ].filter(Boolean).length

  const tipoLabel     = tipos.find(t => t.value === tipoActivo)?.label ?? 'Todos'
  const duracionLabel = DURACIONES.find(d => d.v === duracionActiva)?.l
  const ordenLabel    = ordenes.find(o => o.value === ordenActivo)?.label

  return (
    <div className="mb-4 space-y-2">

      {/* Fila principal: chips activos + botón filtros + ordenar */}
      <div className="flex items-center gap-2 flex-wrap">

        {/* Chips de filtros activos */}
        {tipoActivo && (
          <a href={buildUrl(currentParams, { tipo: undefined })}
            className="flex items-center gap-1 bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-primary-200 transition-colors">
            {tipoLabel} <X className="w-3 h-3"/>
          </a>
        )}
        {marcaActiva && (
          <a href={buildUrl(currentParams, { marca: undefined })}
            className="flex items-center gap-1 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors">
            {marcaActiva} <X className="w-3 h-3"/>
          </a>
        )}
        {duracionActiva && (
          <a href={buildUrl(currentParams, { duracion: undefined })}
            className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-blue-200 transition-colors">
            {duracionLabel} <X className="w-3 h-3"/>
          </a>
        )}
        {activeCount > 0 && (
          <a href={buildUrl({}, {})}
            className="text-xs text-red-500 font-semibold hover:text-red-700 transition-colors">
            Limpiar todo
          </a>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Botón Filtrar */}
        <div className="relative" ref={ref}>
          <button onClick={() => setOpen(o => !o)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
              open || activeCount > 0
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400'
            }`}>
            <SlidersHorizontal className="w-4 h-4"/>
            Filtrar
            {activeCount > 0 && (
              <span className="w-5 h-5 bg-white text-primary-600 rounded-full text-[10px] font-black flex items-center justify-center">
                {activeCount}
              </span>
            )}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}/>
          </button>

          {/* Panel desplegable */}
          {open && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-gray-200 shadow-xl z-50 p-4 space-y-5">

              {/* Tipo */}
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Tipo de lente</p>
                <div className="flex flex-wrap gap-1.5">
                  {tipos.map(t => (
                    <a key={t.value}
                      href={buildUrl(currentParams, { tipo: t.value || undefined })}
                      onClick={() => setOpen(false)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        tipoActivo === t.value
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-primary-400'
                      }`}>
                      {t.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Marca */}
              {marcas.length > 0 && (
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Marca</p>
                  <div className="flex flex-wrap gap-1.5">
                    <a href={buildUrl(currentParams, { marca: undefined })}
                      onClick={() => setOpen(false)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        !marcaActiva ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}>
                      Todas
                    </a>
                    {marcas.map(m => (
                      <a key={m} href={buildUrl(currentParams, { marca: m })}
                        onClick={() => setOpen(false)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          marcaActiva === m ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400'
                        }`}>
                        {m}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Duración */}
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Duración</p>
                <div className="flex gap-1.5">
                  {DURACIONES.map(d => (
                    <a key={d.v} href={buildUrl(currentParams, { duracion: d.v || undefined })}
                      onClick={() => setOpen(false)}
                      className={`flex-1 text-center px-2 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        duracionActiva === d.v ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300'
                      }`}>
                      {d.l}
                    </a>
                  ))}
                </div>
              </div>

              {/* Ordenar */}
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Ordenar por</p>
                <div className="space-y-1">
                  {ordenes.map(o => (
                    <a key={o.value} href={buildUrl(currentParams, { orden: o.value })}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        ordenActivo === o.value ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}>
                      {o.label}
                      {ordenActivo === o.value && <Check className="w-3.5 h-3.5"/>}
                    </a>
                  ))}
                </div>
              </div>

              {/* Limpiar */}
              {activeCount > 0 && (
                <a href={buildUrl({}, {})}
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-red-600 border-2 border-red-200 hover:bg-red-50 transition-colors">
                  <X className="w-3.5 h-3.5"/> Limpiar todos los filtros
                </a>
              )}
            </div>
          )}
        </div>

        {/* Ordenar rápido (visible en desktop cuando el panel está cerrado) */}
        {!open && (
          <div className="hidden sm:flex items-center gap-1">
            {ordenes.slice(0,2).map(o => (
              <a key={o.value} href={buildUrl(currentParams, { orden: o.value })}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  ordenActivo === o.value
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                }`}>
                {o.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Tabs de tipo — scroll horizontal rápido (mobile-friendly) */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        {tipos.map(t => (
          <a key={t.value}
            href={buildUrl(currentParams, { tipo: t.value || undefined, q: currentParams.q, orden: currentParams.orden })}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              tipoActivo === t.value
                ? 'bg-primary-600 text-white shadow-sm shadow-primary-200'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'
            }`}>
            {t.label}
          </a>
        ))}
      </div>

    </div>
  )
}
