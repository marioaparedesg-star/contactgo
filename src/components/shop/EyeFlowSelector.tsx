'use client'
import SPHPicker from '@/components/shop/SPHPicker'
import { createClient } from '@/lib/supabase'
import { trackEyeFlow, trackWhatsappHelp } from '@/lib/analytics'
/**
 * EyeFlowSelector — Flujo óptico unificado ContactGo
 * ──────────────────────────────────────────────────
 * Reemplaza completamente el antiguo EyeSelector (OD/OI/AMBOS).
 * Guía al usuario paso a paso sin terminología técnica.
 * UN SOLO ITEM en carrito — nunca duplica líneas por ojo.
 */

import { useState, useEffect } from 'react'

// ── Tipos ─────────────────────────────────────────────────────────────────
export type OjoMode = 'AMBOS' | 'OD' | 'OI'

export interface EyeFlowState {
  ojoMode:      OjoMode | null
  mismaReceta:  boolean
  // Receta única (un ojo o ambos con misma receta)
  sph:    string
  cyl:    string
  axis:   string
  add:    string
  // Receta diferente por ojo
  sph_od: string; sph_oi: string
  cyl_od: string; cyl_oi: string
  axis_od: string; axis_oi: string
  // Color
  color:  string
  noEstaSeguro?: boolean
}

export const initialEyeFlow: EyeFlowState = {
  ojoMode: 'AMBOS', mismaReceta: true,  // Pre-seleccionado — menos fricción
  sph:'', cyl:'', axis:'', add:'',
  sph_od:'', sph_oi:'', cyl_od:'', cyl_oi:'', axis_od:'', axis_oi:'',
  color:'', noEstaSeguro: false,
}

interface Props {
  state: EyeFlowState
  onChange: (s: EyeFlowState) => void
  // Capacidades del producto
  needsCyl:    boolean   // tórico o multifocal tórico
  needsAdd:    boolean   // multifocal
  needsColor:  boolean   // lente de color
  sphOpts:     (number|string)[]
  sphMin?:     number
  sphMax?:     number
  sphStep?:    number
  sphPlano?:   boolean
  cylOpts:     (number|string)[]
  axisOpts:    (number|string)[]
  addOpts:     string[]
  colorOpts:   string[]
  // Rx prellenada desde calculadora/cuenta
  prefilledRx?: {
    sph_od?: number|null; sph_oi?: number|null
    cyl_od?: number|null; cyl_oi?: number|null
    axis_od?: number|null; axis_oi?: number|null
    add_power?: string|null
  } | null
}

// ── Helpers visuales ──────────────────────────────────────────────────────
function StepLabel({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
        {n}
      </span>
      <span className="text-xs font-bold text-gray-700">{label}</span>
    </div>
  )
}

function OptionCard({
  selected, onClick, icon, label, sublabel, highlight
}: {
  selected: boolean; onClick: () => void
  icon: string; label: string; sublabel?: string; highlight?: boolean
}) {
  return (
    <button type="button" onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all duration-150 min-h-[48px] w-full text-left ${
        selected
          ? 'border-primary-600 bg-primary-50 shadow-sm shadow-primary-100'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
      } ${highlight && !selected ? 'border-amber-200 bg-amber-50' : ''}`}>
      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
        selected ? 'border-primary-600 bg-primary-600' : 'border-gray-300'
      }`}>
        {selected && <span className="w-2 h-2 rounded-full bg-white block" />}
      </span>
      <span className="text-base shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className={`text-sm font-bold leading-tight ${selected ? 'text-primary-700' : 'text-gray-800'}`}>
          {label}
        </p>
        {sublabel && (
          <p className={`text-[10px] leading-tight ${selected ? 'text-primary-500' : 'text-gray-400'}`}>
            {sublabel}
          </p>
        )}
      </div>
    </button>
  )
}

function SelectField({
  label, value, onChange, options, placeholder, hint
}: {
  label: string; value: string; onChange: (v: string) => void
  options: (string|number|any)[]; placeholder: string; hint?: string
}) {

  // SELECT normal para CYL, AXIS, ADD
  return (
    <div className="space-y-1">
      <label className="block text-xs font-bold text-gray-700">{label}</label>
      {hint && <p className="text-[10px] text-gray-400">{hint}</p>}
      <select value={value} onChange={e => onChange(e.target.value)}
        className={`w-full border-2 rounded-xl px-3 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors appearance-none bg-white ${
          value ? 'border-primary-300 text-gray-900' : 'border-gray-200 text-gray-400'
        }`}
        style={{ fontSize: '16px', minHeight: '48px' }}>
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={String(o)} value={String(o)}>{String(o)}</option>
        ))}
      </select>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────
export default function EyeFlowSelector({
  state, onChange, needsCyl, needsAdd, needsColor,
  sphOpts, cylOpts, axisOpts, addOpts, colorOpts, prefilledRx,
  sphMin = -20, sphMax = 8, sphStep = 0.25, sphPlano = false
}: Props) {
  const s = state
  const set = (patch: Partial<EyeFlowState>) => onChange({ ...s, ...patch })

  // Pre-llenar desde calculadora/cuenta si disponible
  useEffect(() => {
    if (!prefilledRx) return
    const patch: Partial<EyeFlowState> = {}
    if (prefilledRx.sph_od) patch.sph_od = String(prefilledRx.sph_od)
    if (prefilledRx.sph_oi) patch.sph_oi = String(prefilledRx.sph_oi)
    if (prefilledRx.cyl_od) patch.cyl_od = String(prefilledRx.cyl_od)
    if (prefilledRx.cyl_oi) patch.cyl_oi = String(prefilledRx.cyl_oi)
    if (prefilledRx.axis_od) patch.axis_od = String(prefilledRx.axis_od)
    if (prefilledRx.axis_oi) patch.axis_oi = String(prefilledRx.axis_oi)
    if (prefilledRx.add_power) patch.add = prefilledRx.add_power
    // Detectar si son iguales
    if (prefilledRx.sph_od && prefilledRx.sph_oi &&
        prefilledRx.sph_od === prefilledRx.sph_oi) {
      patch.mismaReceta = true
      patch.sph = String(prefilledRx.sph_od)
      if (prefilledRx.cyl_od) patch.cyl = String(prefilledRx.cyl_od)
      if (prefilledRx.axis_od) patch.axis = String(prefilledRx.axis_od)
    } else if (prefilledRx.sph_od || prefilledRx.sph_oi) {
      patch.mismaReceta = false
    }
    onChange({ ...s, ...patch })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Auto-seleccionar AMBOS para lentes de color ──────────────────────
  useEffect(() => {
    if (needsColor && !s.ojoMode) {
      // Lentes de color: una caja sirve para ambos ojos, simplificar flujo
      set({ ojoMode: 'AMBOS', mismaReceta: true })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsColor])

  // ── Recetas guardadas — HOOKS deben estar antes de cualquier early return ──
  const [savedRx, setSavedRx] = useState<any[]>([])
  const [showSavedRx, setShowSavedRx] = useState(false)

  useEffect(() => {
    const loadRx = async () => {
      const sb = createClient()
      const { data: { user } } = await sb.auth.getUser()
      if (!user) return
      const { data } = await sb
        .from('saved_prescriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('es_principal', { ascending: false })
        .limit(5)
      if (data?.length) setSavedRx(data)
    }
    loadRx()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Aplicar receta guardada al estado
  const applyRx = (rx: any) => {
    onChange({
      ...s,
      ojoMode: 'AMBOS',
      mismaReceta: rx.od_sph === rx.oi_sph && rx.od_cyl === rx.oi_cyl,
      sph: rx.od_sph ? String(rx.od_sph) : s.sph,
      cyl: rx.od_cyl ? String(rx.od_cyl) : s.cyl,
      axis: rx.od_axis ? String(rx.od_axis) : s.axis,
      add: rx.add_power ? String(rx.add_power) : s.add,
    })
    setShowSavedRx(false)
  }

  // ── PASO 1: ¿Para cuántos ojos? ───────────────────────────────────────
  const step1 = (
    <div className="space-y-2.5">
      <StepLabel n={1} label="¿Para cuántos ojos necesitas lentes?" />
      <div className="grid grid-cols-2 gap-3">
        <OptionCard
          selected={s.ojoMode === 'AMBOS'}
          onClick={() => { set({ ojoMode: 'AMBOS' }); trackEyeFlow('ambos_selected') }}
          icon="👀" label="Ambos ojos" sublabel="Lo más común" highlight />
        <OptionCard
          selected={s.ojoMode === 'OD' || s.ojoMode === 'OI'}
          onClick={() => { set({ ojoMode: 'OD' }); trackEyeFlow('un_ojo_selected') }}
          icon="👁" label="Un solo ojo" sublabel="Solo uno" />
      </div>
    </div>
  )

  // ── PASO 1b: ¿Cuál ojo? (solo si eligió "un solo ojo") ───────────────
  const step1b = (s.ojoMode === 'OD' || s.ojoMode === 'OI') ? (
    <div className="space-y-2.5">
      <StepLabel n={2} label="¿Cuál ojo?" />
      <div className="grid grid-cols-2 gap-3">
        <OptionCard
          selected={s.ojoMode === 'OD'}
          onClick={() => { set({ ojoMode: 'OD' }); trackEyeFlow('un_ojo_selected') }}
          icon="→" label="Derecho (OD)" />
        <OptionCard
          selected={s.ojoMode === 'OI'}
          onClick={() => set({ ojoMode: 'OI' })}
          icon="←" label="Izquierdo (OI)" />
      </div>
    </div>
  ) : null

  // ── PASO 2a: ¿Misma graduación? (solo si eligió "ambos ojos") ─────────
  const step2a = s.ojoMode === 'AMBOS' ? (
    <div className="space-y-2.5">
      <StepLabel n={2} label="¿Usas la misma graduación en ambos ojos?" />
      <div className="grid grid-cols-2 gap-3">
        <OptionCard
          selected={s.mismaReceta === true}
          onClick={() => { set({ mismaReceta: true, noEstaSeguro: false }); trackEyeFlow('misma_receta') }}
          icon="✓" label="Sí, la misma" highlight />
        <OptionCard
          selected={s.mismaReceta === false && !s.noEstaSeguro}
          onClick={() => { set({ mismaReceta: false, noEstaSeguro: false }); trackEyeFlow('diferente_receta') }}
          icon="↕" label="No, son diferentes" />
        <OptionCard
          selected={!!s.noEstaSeguro}
          onClick={() => { set({ noEstaSeguro: true }); trackEyeFlow('no_seguro') }}
          icon="🤔" label="No estoy seguro" />
      </div>
      {/* Mensaje de ayuda cuando tienen graduaciones diferentes — común en lentes de color */}
      {s.mismaReceta === false && !s.noEstaSeguro && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700 flex items-start gap-2">
          <span className="text-base">💡</span>
          <span>Perfecto — ingresa la graduación de cada ojo por separado. Si no tienes tu receta a mano, <a href="https://wa.me/18294728328?text=Hola%2C+necesito+ayuda+con+mi+receta+para+lentes+de+color" target="_blank" rel="noopener noreferrer" className="font-bold underline">escríbenos por WhatsApp</a> y te ayudamos.</span>
        </div>
      )}
    </div>
  ) : null

  // ── Número del paso de graduación según el flujo ──────────────────────
  const rxStepNum = s.ojoMode === 'AMBOS' ? 3 : 3

  // ── FORMULARIO DE GRADUACIÓN — UN OJO o AMBOS+MISMA ──────────────────
  const singleRxForm = (
    <div className="space-y-2.5">
      <StepLabel n={rxStepNum} label={
        s.ojoMode === 'AMBOS'
          ? 'Graduación (igual para ambos ojos)'
          : s.ojoMode === 'OD' ? 'Graduación — Ojo Derecho' : 'Graduación — Ojo Izquierdo'
      } />
      <SPHPicker label="Esfera (SPH)" value={s.sph}
        onChange={v => set({ sph: v })}
        placeholder="Selecciona tu graduación"
        sphMin={sphMin} sphMax={sphMax} sphStep={sphStep} sphPlano={sphPlano}
        hint="Es el número principal de tu receta" />
      {needsCyl && (
        <SelectField label="Cilindro (CYL)" value={s.cyl}
          onChange={v => set({ cyl: v })}
          options={cylOpts} placeholder="Selecciona el cilindro" />
      )}
      {needsCyl && s.cyl && (
        <SelectField label="Eje (AXIS)" value={s.axis}
          onChange={v => set({ axis: v })}
          options={axisOpts} placeholder="Selecciona el eje" />
      )}
      {needsAdd && (
        <SelectField label="Adición (ADD)" value={s.add}
          onChange={v => set({ add: v })}
          options={addOpts} placeholder="Selecciona la adición"
          hint="Para lentes multifocales / presbicia" />
      )}
    </div>
  )

  // ── FORMULARIO DE GRADUACIÓN — AMBOS+DIFERENTE ────────────────────────
  const dualRxForm = (
    <div className="space-y-2.5">
      <StepLabel n={rxStepNum} label="Graduación por ojo" />
      {/* Ojo Derecho */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-3">
        <p className="text-xs font-black text-blue-700 uppercase tracking-wide">👁 Ojo Derecho (OD)</p>
        <SPHPicker label="Esfera (SPH) — Ojo Derecho" value={s.sph_od}
          onChange={v => set({ sph_od: v })}
          placeholder="Graduación ojo derecho"
          sphMin={sphMin} sphMax={sphMax} sphStep={sphStep} sphPlano={sphPlano} />
        {needsCyl && (
          <SelectField label="Cilindro (CYL)" value={s.cyl_od}
            onChange={v => set({ cyl_od: v })}
            options={cylOpts} placeholder="CYL ojo derecho" />
        )}
        {needsCyl && s.cyl_od && (
          <SelectField label="Eje (AXIS)" value={s.axis_od}
            onChange={v => set({ axis_od: v })}
            options={axisOpts} placeholder="AXIS ojo derecho" />
        )}
      </div>
      {/* Ojo Izquierdo */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-4 space-y-3">
        <p className="text-xs font-black text-green-700 uppercase tracking-wide">👁 Ojo Izquierdo (OI)</p>
        <SPHPicker label="Esfera (SPH) — Ojo Izquierdo" value={s.sph_oi}
          onChange={v => set({ sph_oi: v })}
          placeholder="Graduación ojo izquierdo"
          sphMin={sphMin} sphMax={sphMax} sphStep={sphStep} sphPlano={sphPlano} />
        {needsCyl && (
          <SelectField label="Cilindro (CYL)" value={s.cyl_oi}
            onChange={v => set({ cyl_oi: v })}
            options={cylOpts} placeholder="CYL ojo izquierdo" />
        )}
        {needsCyl && s.cyl_oi && (
          <SelectField label="Eje (AXIS)" value={s.axis_oi}
            onChange={v => set({ axis_oi: v })}
            options={axisOpts} placeholder="AXIS ojo izquierdo" />
        )}
      </div>
      {needsAdd && (
        <SelectField label="Adición ADD (igual para ambos)" value={s.add}
          onChange={v => set({ add: v })}
          options={addOpts} placeholder="Selecciona la adición" />
      )}
    </div>
  )

  // ── SELECTOR DE COLOR ─────────────────────────────────────────────────
  const colorStep = needsColor ? (
    <div className="space-y-2.5">
      <StepLabel n={rxStepNum + 1} label="Color del lente" />
      <div className="grid grid-cols-3 gap-2">
        {colorOpts.map(col => (
          <button key={col} type="button" onClick={() => set({ color: col })}
            className={`py-2.5 px-2 rounded-xl border-2 text-xs font-bold transition-all ${
              s.color === col
                ? 'border-primary-600 bg-primary-50 text-primary-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}>
            {col}
          </button>
        ))}
      </div>
    </div>
  ) : null


  // ── Pantalla de ayuda "No estoy seguro" ─────────────────────────
  if (s.ojoMode === 'AMBOS' && s.noEstaSeguro) return (
    <div className="space-y-5">
      {step1}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">📋</span>
          <div>
            <p className="font-bold text-gray-900 text-sm">¿Cómo saber si tus ojos son iguales?</p>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Revisa tu caja o receta médica. Si el número SPH es el mismo para OD y OI, son iguales.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Ejemplo: OD -2.75 · OI -2.75 = <strong>Iguales ✓</strong>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-2 sm:gap-2">
          <button
            type="button"
            onClick={() => { set({ mismaReceta: true, noEstaSeguro: false }); trackEyeFlow('misma_receta') }}
            className="bg-primary-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-primary-700 transition-colors">
            ✓ Son iguales
          </button>
          <button
            type="button"
            onClick={() => { set({ mismaReceta: false, noEstaSeguro: false }); trackEyeFlow('diferente_receta') }}
            className="bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm hover:border-gray-300 transition-colors">
            ↕ Son diferentes
          </button>
        </div>
        <a href="https://wa.me/18294728328?text=Hola%2C%20necesito%20ayuda%20con%20mi%20receta%20de%20lentes%20de%20contacto" onClick={() => trackWhatsappHelp('no_seguro')}
          target="_blank" rel="noopener"
          className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 rounded-xl text-sm transition-colors">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Hablar por WhatsApp
        </a>
      </div>
    </div>
  )

  // ── RENDER CONDICIONAL ────────────────────────────────────────────────
  const showSingleRx = (s.ojoMode === 'OD' || s.ojoMode === 'OI') ||
                       (s.ojoMode === 'AMBOS' && s.mismaReceta === true && !s.noEstaSeguro)
  const showDualRx   = s.ojoMode === 'AMBOS' && s.mismaReceta === false && !s.noEstaSeguro

  // Calcular progreso
  const totalSteps = needsColor ? (needsCyl ? 5 : 4) : needsCyl ? 4 : needsAdd ? 4 : 3
  let doneSteps = 0
  if (s.ojoMode) doneSteps++
  if (s.mismaReceta !== undefined) doneSteps++
  if (!needsColor && s.sph) doneSteps++
  if (needsColor && s.color) doneSteps++
  if (needsCyl && s.cyl && s.axis) doneSteps++
  if (needsAdd && s.add) doneSteps++
  const progressPct = Math.min(100, Math.round((doneSteps / totalSteps) * 100))

  return (
    <div className="space-y-2.5">
      {/* ── RECETA GUARDADA ─────────────────────────── */}
      {savedRx.length > 0 && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSavedRx(!showSavedRx)}
            className="w-full flex items-center justify-between gap-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-800 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors">
            <span className="flex items-center gap-1.5">
              <span>📋</span> Usar receta guardada ({savedRx.length})
            </span>
            <span>{showSavedRx ? '▲' : '▼'}</span>
          </button>
          {showSavedRx && (
            <div className="absolute top-full left-0 right-0 z-20 bg-white border border-blue-100 rounded-xl shadow-lg mt-1 overflow-hidden">
              {savedRx.map((rx: any) => (
                <button key={rx.id} type="button" onClick={() => applyRx(rx)}
                  className="w-full text-left px-3 py-2.5 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0">
                  <p className="text-xs font-bold text-gray-800">{rx.nombre ?? 'Mi receta'}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    OD: SPH {rx.od_sph ?? '—'}{rx.od_cyl ? ` / CYL ${rx.od_cyl}` : ''}
                    {' · '}
                    OI: SPH {rx.oi_sph ?? '—'}{rx.oi_cyl ? ` / CYL ${rx.oi_cyl}` : ''}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── PROGRESS BAR ─────────────────────────────── */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Configuración de receta</p>
          <p className="text-[10px] font-black text-primary-600">{doneSteps}/{totalSteps} pasos</p>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500"
               style={{width: `${progressPct}%`}} />
        </div>
        {progressPct === 100 && (
          <p className="text-[10px] font-black text-green-600">✓ Receta completa</p>
        )}
      </div>
      {/* Paso 1 de ojo: oculto para lentes de color (auto=ambos) */}
      {!needsColor && step1}
      {!needsColor && step1b}
      {/* Para color: mostrar badge que confirma "Para ambos ojos" */}
      {needsColor && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
          <span className="text-sm">👀</span>
          <p className="text-xs font-bold text-green-700">Una caja para ambos ojos</p>
        </div>
      )}
      {step2a}
      {showSingleRx && singleRxForm}
      {showDualRx   && dualRxForm}
      {(showSingleRx || showDualRx) && colorStep}
    </div>
  )
}
