'use client'
import { useState, useRef, useEffect } from 'react'
import { Search, X, ChevronDown } from 'lucide-react'

// ── Genera las opciones negativas y positivas ────────────────────────────────
function buildOptions() {
  const neg: string[] = []
  const pos: string[] = []
  // Negativos: -0.25 → -20.00
  for (let v = 25; v <= 2000; v += 25) {
    neg.push((-v / 100).toFixed(2))
  }
  // Positivos: +0.25 → +8.00
  for (let v = 25; v <= 800; v += 25) {
    pos.push(`+${(v / 100).toFixed(2)}`)
  }
  return { neg, pos }
}
const { neg: NEG, pos: POS } = buildOptions()
const ALL = [...NEG, ...POS]

interface Props {
  label:       string
  value:       string
  onChange:    (v: string) => void
  placeholder?: string
  hint?:       string
}

export default function SPHPicker({ label, value, onChange, placeholder = 'Selecciona tu graduación', hint }: Props) {
  const [open, setOpen]       = useState(false)
  const [search, setSearch]   = useState('')
  const panelRef              = useRef<HTMLDivElement>(null)
  const searchRef             = useRef<HTMLInputElement>(null)
  const selectedRef           = useRef<HTMLButtonElement>(null)

  // Filtrar por búsqueda
  const filteredNeg = search ? NEG.filter(v => v.includes(search.replace('+',''))) : NEG
  const filteredPos = search ? POS.filter(v => v.includes(search.replace('+',''))) : POS
  const hasResults  = filteredNeg.length > 0 || filteredPos.length > 0

  // Cerrar al click externo
  useEffect(() => {
    if (!open) return
    const fn = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [open])

  // Foco en buscador y scroll al valor seleccionado al abrir
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchRef.current?.focus()
        selectedRef.current?.scrollIntoView({ block: 'center', behavior: 'instant' })
      }, 50)
    } else {
      setSearch('')
    }
  }, [open])

  const select = (v: string) => {
    onChange(v)
    setOpen(false)
  }

  const isNeg = (v: string) => !v.startsWith('+')
  const displayValue = value
    ? (isNeg(value) ? value : `+${parseFloat(value).toFixed(2).replace('+','')}`)
    : null

  return (
    <div className="space-y-1.5 relative" ref={panelRef}>
      {/* Label + valor seleccionado */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">{label}</label>
        {value && (
          <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
            isNeg(value)
              ? 'bg-blue-100 text-blue-800'
              : 'bg-orange-100 text-orange-800'
          }`}>
            {displayValue}
            <span className="ml-1 font-normal opacity-60">{isNeg(value) ? 'miopía' : 'hipermetropía'}</span>
          </span>
        )}
      </div>
      {hint && <p className="text-[10px] text-gray-400">{hint}</p>}

      {/* Botón disparador */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border-2 text-sm font-semibold transition-all ${
          open
            ? 'border-primary-500 bg-primary-50 shadow-sm'
            : value
              ? 'border-primary-300 bg-white text-gray-900'
              : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
        }`}
        style={{ minHeight: '52px' }}>
        <span className={value ? 'text-gray-900 font-black' : ''}>
          {value ? `SPH ${displayValue}` : placeholder}
        </span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {value && (
            <span
              role="button"
              tabIndex={0}
              onClick={e => { e.stopPropagation(); onChange(''); setOpen(false) }}
              onKeyDown={e => e.key === 'Enter' && (e.stopPropagation(), onChange(''), setOpen(false))}
              className="w-5 h-5 rounded-full bg-gray-200 hover:bg-red-100 flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Limpiar">
              <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Panel de selección */}
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-black/10 overflow-hidden">

          {/* Búsqueda rápida */}
          <div className="p-3 border-b border-gray-50">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                inputMode="decimal"
                placeholder="Escribe tu graduación ej: -2.75"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
                style={{ fontSize: '16px' }}
              />
              {search && (
                <button onClick={() => setSearch('')} className="p-0.5">
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Cabecera de columnas */}
          <div className="grid grid-cols-2 border-b border-gray-100">
            <div className="flex items-center justify-center gap-1.5 py-2.5 bg-blue-50">
              <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white text-[10px] font-black">−</span>
              </span>
              <span className="text-[11px] font-black text-blue-800 uppercase tracking-wide">Miopía</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 py-2.5 bg-orange-50 border-l border-gray-100">
              <span className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                <span className="text-white text-[10px] font-black">+</span>
              </span>
              <span className="text-[11px] font-black text-orange-800 uppercase tracking-wide">Hipermetropía</span>
            </div>
          </div>

          {/* Grid de valores — scroll fijo */}
          <div className="overflow-y-auto" style={{ maxHeight: '260px' }}>
            {!hasResults ? (
              <div className="py-8 text-center text-sm text-gray-400">
                No encontrado — verifica tu receta
              </div>
            ) : (
              <div className="grid grid-cols-2 divide-x divide-gray-50">
                {/* Columna negativa */}
                <div>
                  {filteredNeg.map(v => {
                    const sel = value === v
                    return (
                      <button
                        key={v}
                        ref={sel ? selectedRef : undefined}
                        type="button"
                        onClick={() => select(v)}
                        className={`w-full text-center py-2.5 text-sm font-semibold transition-all border-b border-gray-50 last:border-0 ${
                          sel
                            ? 'bg-blue-600 text-white font-black'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                        }`}>
                        {v}
                      </button>
                    )
                  })}
                </div>
                {/* Columna positiva */}
                <div>
                  {filteredPos.map(v => {
                    const sel = value === v || value === v.replace('+','')
                    return (
                      <button
                        key={v}
                        ref={sel ? selectedRef : undefined}
                        type="button"
                        onClick={() => select(v.replace('+',''))}
                        className={`w-full text-center py-2.5 text-sm font-semibold transition-all border-b border-gray-50 last:border-0 ${
                          sel
                            ? 'bg-orange-500 text-white font-black'
                            : 'text-gray-700 hover:bg-orange-50 hover:text-orange-700'
                        }`}>
                        {v}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="border-t border-gray-50 px-4 py-2.5 bg-gray-50 flex items-center justify-between">
            <p className="text-[10px] text-gray-400">
              Selecciona la graduación de tu receta óptica
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[10px] font-bold text-primary-600 hover:text-primary-700">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
