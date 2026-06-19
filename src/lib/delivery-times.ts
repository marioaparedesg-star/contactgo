/**
 * FUENTE ÚNICA DE VERDAD — Tiempos de entrega por categoría y graduación
 *
 * REGLAS DE NEGOCIO:
 *  - Color CON graduación (SPH ≠ 0)  → 24-72 h  (pedido especial al distribuidor)
 *  - Color SIN graduación / plano     → 24 h     (stock disponible)
 *  - Esférico POSITIVO (SPH > 0)      → 24-72 h  (hipermetropía, menor rotación)
 *  - Esférico NEGATIVO o plano        → 24 h     (alta rotación, siempre en stock)
 *  - Tórico                           → 25-30 días (fabricación especial)
 *  - Multifocal                       → 5-10 días (pedido al distribuidor)
 *  - Solución / Gota                  → 24 h
 *  - XR (alta graduación)             → 25-30 días
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

const T_5_10D: EntregaInfo = {
  etiqueta: 'Pedido especial · 5-10 días',
  detalle:  'Fabricado bajo pedido por el distribuidor oficial. Entrega estimada de 5 a 10 días laborables.',
  dias_min: 5, dias_max: 10,
  especial: true,
  icono:    '⚗️',
}

const T_25_30D: EntregaInfo = {
  etiqueta: 'Fabricación especial · 25-30 días',
  detalle:  'Fabricado a medida por el distribuidor oficial de la marca. Entrega estimada de 25 a 30 días laborables.',
  dias_min: 25, dias_max: 30,
  especial: true,
  icono:    '⏱️',
}

/** Detecta si el producto es XR / alta graduación */
function esXR(nombre: string): boolean {
  return /\bxr\b/i.test(nombre) || /alta.gradu/i.test(nombre)
}

/**
 * Retorna la info de entrega considerando tipo, nombre Y graduación seleccionada.
 *
 * @param tipo    - Tipo de producto: esferico | torico | multifocal | color | solucion | gota
 * @param nombre  - Nombre del producto (para detectar XR)
 * @param sph     - Graduación seleccionada por el usuario (ej: "-2.75", "+1.50", "0.00")
 */
export function getEntrega(tipo: string, nombre = '', sph?: string | number | null): EntregaInfo {

  // XR siempre fabricación especial
  if (esXR(nombre) && ['torico','esferico','multifocal'].includes(tipo)) {
    return {
      etiqueta: 'Fabricación bajo pedido · 25-30 días',
      detalle:  'Fabricado bajo pedido por el distribuidor oficial. Entrega estimada de 25 a 30 días laborables.',
      dias_min: 25, dias_max: 30,
      especial: true,
      icono:    '🔬',
    }
  }

  // Parsear SPH
  const sphNum = sph != null ? parseFloat(String(sph)) : null

  if (tipo === 'color') {
    // Color CON graduación (positivo o negativo) → 24-72h
    // Color PLANO (0.00) o sin seleccionar → 24h
    if (sphNum != null && sphNum !== 0) return T_24_72H
    return T_24H
  }

  if (tipo === 'esferico') {
    // Esférico POSITIVO (hipermetropía) → 24-72h
    // Esférico negativo o plano → 24h
    if (sphNum != null && sphNum > 0) return T_24_72H
    return T_24H
  }

  if (tipo === 'torico')     return T_25_30D
  if (tipo === 'multifocal') return T_5_10D
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
