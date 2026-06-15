'use client'
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
}

export const initialEyeFlow: EyeFlowState = {
  ojoMode: null, mismaReceta: true,
  sph:'', cyl:'', axis:'', add:'',
  sph_od:'', sph_oi:'', cyl_od:'', cyl_oi:'', axis_od:'', axis_oi:'',
  color:'',
}

interface Props {
  state: EyeFlowState
  onChange: (s: EyeFlowState) => void
  // Capacidades del producto
  needsCyl:    boolean   // tórico o multifocal tórico
  needsAdd:    boolean   // multifocal
  needsColor:  boolean   // lente de color
  sphOpts:     (number|string)[]
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
    <div className="flex items-center gap-2 mb-3">
      <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-black flex items-center justify-center shrink-0">
        {n}
      </span>
      <span className="text-sm font-bold text-gray-800">{label}</span>
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
      className={`flex flex-col items-center justify-center gap-1.5 py-4 px-3 rounded-2xl border-2 transition-all duration-150 min-h-[90px] w-full ${
        selected
          ? 'border-primary-600 bg-primary-50 shadow-sm shadow-primary-100'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
      } ${highlight && !selected ? 'border-amber-200 bg-amber-50' : ''}`}>
      <span className="text-2xl">{icon}</span>
      <p className={`text-sm font-black text-center leading-tight ${selected ? 'text-primary-700' : 'text-gray-800'}`}>
        {label}
      </p>
      {sublabel && (
        <p className={`text-[10px] font-semibold ${selected ? 'text-primary-500' : 'text-gray-400'}`}>
          {sublabel}
        </p>
      )}
    </button>
  )
}

function SelectField({
  label, value, onChange, options, placeholder, hint
}: {
  label: string; value: string; onChange: (v: string) => void
  options: (string|number|any)[]; placeholder: string; hint?: string
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-bold text-gray-700">{label}</label>
      {hint && <p className="text-[10px] text-gray-400">{hint}</p>}
      <select value={value} onChange={e => onChange(e.target.value)}
        className={`w-full border-2 rounded-xl px-3 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors appearance-none bg-white ${
          value ? 'border-primary-300 text-gray-900' : 'border-gray-200 text-gray-400'
        }`}
        style={{ fontSize: '16px' }}>
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
  sphOpts, cylOpts, axisOpts, addOpts, colorOpts, prefilledRx
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

  // ── PASO 1: ¿Para cuántos ojos? ───────────────────────────────────────
  const step1 = (
    <div className="space-y-3">
      <StepLabel n={1} label="¿Para cuántos ojos necesitas lentes?" />
      <div className="grid grid-cols-2 gap-3">
        <OptionCard
          selected={s.ojoMode === 'AMBOS'}
          onClick={() => set({ ojoMode: 'AMBOS' })}
          icon="👀" label="Ambos ojos" sublabel="Lo más común" highlight />
        <OptionCard
          selected={s.ojoMode === 'OD' || s.ojoMode === 'OI'}
          onClick={() => set({ ojoMode: 'OD' })}
          icon="👁" label="Un solo ojo" sublabel="Solo uno" />
      </div>
    </div>
  )

  // ── PASO 1b: ¿Cuál ojo? (solo si eligió "un solo ojo") ───────────────
  const step1b = (s.ojoMode === 'OD' || s.ojoMode === 'OI') ? (
    <div className="space-y-3">
      <StepLabel n={2} label="¿Cuál ojo?" />
      <div className="grid grid-cols-2 gap-3">
        <OptionCard
          selected={s.ojoMode === 'OD'}
          onClick={() => set({ ojoMode: 'OD' })}
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
    <div className="space-y-3">
      <StepLabel n={2} label="¿Usas la misma graduación en ambos ojos?" />
      <div className="grid grid-cols-2 gap-3">
        <OptionCard
          selected={s.mismaReceta === true}
          onClick={() => set({ mismaReceta: true })}
          icon="✓" label="Sí, la misma" highlight />
        <OptionCard
          selected={s.mismaReceta === false}
          onClick={() => set({ mismaReceta: false })}
          icon="↕" label="No, son diferentes" />
      </div>
    </div>
  ) : null

  // ── Número del paso de graduación según el flujo ──────────────────────
  const rxStepNum = s.ojoMode === 'AMBOS' ? 3 : 3

  // ── FORMULARIO DE GRADUACIÓN — UN OJO o AMBOS+MISMA ──────────────────
  const singleRxForm = (
    <div className="space-y-3">
      <StepLabel n={rxStepNum} label={
        s.ojoMode === 'AMBOS'
          ? 'Graduación (igual para ambos ojos)'
          : s.ojoMode === 'OD' ? 'Graduación — Ojo Derecho' : 'Graduación — Ojo Izquierdo'
      } />
      <SelectField label="Esfera (SPH)" value={s.sph}
        onChange={v => set({ sph: v })}
        options={sphOpts} placeholder="Selecciona tu graduación"
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
    <div className="space-y-4">
      <StepLabel n={rxStepNum} label="Graduación por ojo" />
      {/* Ojo Derecho */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-3">
        <p className="text-xs font-black text-blue-700 uppercase tracking-wide">👁 Ojo Derecho (OD)</p>
        <SelectField label="Esfera (SPH)" value={s.sph_od}
          onChange={v => set({ sph_od: v })}
          options={sphOpts} placeholder="Graduación ojo derecho" />
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
        <SelectField label="Esfera (SPH)" value={s.sph_oi}
          onChange={v => set({ sph_oi: v })}
          options={sphOpts} placeholder="Graduación ojo izquierdo" />
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
    <div className="space-y-3">
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

  // ── RENDER CONDICIONAL ────────────────────────────────────────────────
  const showSingleRx = (s.ojoMode === 'OD' || s.ojoMode === 'OI') ||
                       (s.ojoMode === 'AMBOS' && s.mismaReceta === true)
  const showDualRx   = s.ojoMode === 'AMBOS' && s.mismaReceta === false

  return (
    <div className="space-y-5">
      {step1}
      {step1b}
      {step2a}
      {showSingleRx && singleRxForm}
      {showDualRx   && dualRxForm}
      {(showSingleRx || showDualRx) && colorStep}
    </div>
  )
}
