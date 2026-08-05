/**
 * FUENTE ÚNICA DE VERDAD — Tiempos de entrega por categoría
 *
 * REGLAS DE NEGOCIO (definidas por Mario, 2026-08-03 — aplican a TODO el país,
 * ya no varían por zona ni por signo de graduación):
 *  - Esférico   → 24-48 horas
 *  - Multifocal → 2-6 días
 *  - Tórico     → 25-40 días
 *  - Color CON graduación (SPH ≠ 0)  → 24-72 h  (pedido especial al distribuidor)
 *  - Color SIN graduación / plano     → 24 h     (stock disponible)
 *  - Solución / Gota                  → 24 h
 */

export interface EntregaInfo {
  etiqueta: string
  detalle:  string
  dias_min: number
  dias_max: number
  especial: boolean
  icono:    string
}

const T_24H: EntregaInfo = {
  etiqueta: 'Entrega en 24 h',
  detalle:  'Entrega estimada: dentro de las próximas 24 horas laborables.',
  dias_min: 1, dias_max: 1,
  especial: false,
  icono:    '🚀',
}

const T_24_72H: EntregaInfo = {
  etiqueta: 'Entrega 24-72 h',
  detalle:  'Entrega estimada: entre 24 y 72 horas laborables.',
  dias_min: 1, dias_max: 3,
  especial: false,
  icono:    '📦',
}

const T_ESFERICO: EntregaInfo = {
  etiqueta: 'Entrega 24-48 h',
  detalle:  'Entrega estimada: entre 24 y 48 horas laborables, en toda la República Dominicana.',
  dias_min: 1, dias_max: 2,
  especial: false,
  icono:    '🚀',
}

const T_MULTIFOCAL: EntregaInfo = {
  etiqueta: 'Entrega 2-6 días',
  detalle:  'Entrega estimada: entre 2 y 6 días laborables, en toda la República Dominicana.',
  dias_min: 2, dias_max: 6,
  especial: true,
  icono:    '📦',
}

const T_TORICO: EntregaInfo = {
  etiqueta: 'Fabricación especial · 25-40 días',
  detalle:  'Lente tórico fabricado a medida. Entrega estimada de 25 a 40 días laborables, en toda la República Dominicana.',
  dias_min: 25, dias_max: 40,
  especial: true,
  icono:    '⏱️',
}

/**
 * Retorna la info de entrega según tipo de producto y graduación seleccionada.
 *
 * @param tipo    - Tipo de producto: esferico | torico | multifocal | color | solucion | gota
 * @param nombre  - Nombre del producto (sin uso actualmente; se conserva por compatibilidad de firma)
 * @param sph     - Graduación seleccionada por el usuario (ej: "-2.75", "+1.50", "0.00") — solo aplica a color
 */
export function getEntrega(tipo: string, nombre = '', sph?: string | number | null): EntregaInfo {

  if (tipo === 'esferico')   return T_ESFERICO
  if (tipo === 'multifocal') return T_MULTIFOCAL
  if (tipo === 'torico')     return T_TORICO

  // Parsear SPH (solo relevante para color: plano vs. con graduación)
  const sphNum = sph != null ? parseFloat(String(sph)) : null

  if (tipo === 'color') {
    // Color CON graduación (positivo o negativo) → 24-72h
    // Color PLANO (0.00) o sin seleccionar → 24h
    if (sphNum != null && sphNum !== 0) return T_24_72H
    return T_24H
  }

  if (tipo === 'solucion')   return T_24H
  if (tipo === 'gota')       return T_24H

  return {
    etiqueta: 'Consultar disponibilidad',
    detalle:  'Consultar tiempo de entrega.',
    dias_min: 1, dias_max: 7,
    especial: false,
    icono:    '📦',
  }
}

/**
 * Calcula la fecha exacta de entrega en texto legible.
 * Saltea sábados y domingos.
 */
export function getFechaEntrega(
  tipo: string,
  nombre = '',
  sph?: string | number | null
): { texto: string; corto: string } {
  const info = getEntrega(tipo, nombre, sph)

  const DIAS_ES  = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado']
  const MESES_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']

  function addDiasLaborables(base: Date, dias: number): Date {
    const d = new Date(base)
    let added = 0
    if (base.getHours() >= 15) d.setDate(d.getDate() + 1)
    while (added < dias) {
      d.setDate(d.getDate() + 1)
      const dow = d.getDay()
      if (dow !== 0 && dow !== 6) added++
    }
    return d
  }

  function fmtFecha(d: Date, conDia = true): string {
    const dia = DIAS_ES[d.getDay()]
    const num = d.getDate()
    const mes = MESES_ES[d.getMonth()]
    return conDia ? `${dia} ${num} de ${mes}` : `${num} de ${mes}`
  }

  const ahora = new Date()

  if (info.dias_min === info.dias_max) {
    const fecha = addDiasLaborables(ahora, info.dias_min)
    return {
      texto: `Llega el ${fmtFecha(fecha)}`,
      corto: `${DIAS_ES[fecha.getDay()].charAt(0).toUpperCase()}${DIAS_ES[fecha.getDay()].slice(1)} ${fecha.getDate()}/${fecha.getMonth()+1}`,
    }
  }

  const fechaMin = addDiasLaborables(ahora, info.dias_min)
  const fechaMax = addDiasLaborables(ahora, info.dias_max)
  const mismoMes = fechaMin.getMonth() === fechaMax.getMonth()
  const rango    = mismoMes
    ? `${fechaMin.getDate()} y ${fmtFecha(fechaMax, false)}`
    : `${fmtFecha(fechaMin, false)} y ${fmtFecha(fechaMax, false)}`

  return {
    texto: `Llega entre el ${rango}`,
    corto: `${fechaMin.getDate()}–${fechaMax.getDate()} ${MESES_ES[fechaMax.getMonth()]}`,
  }
}

/** Texto para emails */
export function getEntregaTextoEmail(tipo: string, nombre = '', sph?: string | number | null): string {
  return getEntrega(tipo, nombre, sph).detalle
}

/**
 * Fecha estimada de entrega en formato ISO (YYYY-MM-DD), saltando fines de
 * semana. Usa dias_max (el extremo más conservador del rango) a propósito:
 * para integraciones como Google Customer Reviews es preferible que la
 * encuesta llegue un poco tarde a que llegue ANTES de que el cliente reciba
 * el pedido — Google penaliza estimated_delivery_date poco fiables.
 */
export function getFechaEntregaISO(tipo: string, nombre = '', sph?: string | number | null): string {
  const info = getEntrega(tipo, nombre, sph)
  const ahora = new Date()
  const d = new Date(ahora)
  let added = 0
  if (ahora.getHours() >= 15) d.setDate(d.getDate() + 1)
  while (added < info.dias_max) {
    d.setDate(d.getDate() + 1)
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) added++
  }
  return d.toISOString().split('T')[0]
}
