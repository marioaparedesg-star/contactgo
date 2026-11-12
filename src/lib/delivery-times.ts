/**
 * FUENTE ÚNICA DE VERDAD — Tiempos de entrega por categoría
 *
 * REGLAS DE NEGOCIO (definidas por Mario, 2026-08-03 — aplican a TODO el país,
 * ya no varían por zona ni por signo de graduación):
 *  - Esférico   → 24-48 horas
 *  - Multifocal → 1-5 días laborables
 *  - Tórico     → 25-45 días laborables
 *  - Color CON graduación (SPH ≠ 0)  → 24-72 h  (pedido especial al distribuidor)
 *  - Color SIN graduación / plano     → 24-48 h
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
  etiqueta: 'Entrega 1-5 días',
  detalle:  'Entrega estimada: entre 1 y 5 días laborables, en toda la República Dominicana.',
  dias_min: 1, dias_max: 5,
  especial: true,
  icono:    '📦',
}

const T_TORICO: EntregaInfo = {
  etiqueta: 'Fabricación especial · 25-45 días',
  detalle:  'Lente tórico fabricado a medida. Entrega estimada de 25 a 45 días laborables (lunes a viernes), en toda la República Dominicana.',
  dias_min: 25, dias_max: 45,
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
    return T_ESFERICO
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

/** Fecha/hora de referencia siempre en la zona horaria comercial de ContactGo. */
const ZONA_HORARIA = 'America/Santo_Domingo'
const DIAS_ES = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado']
const MESES_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']

function partesFechaDR(fecha: Date) {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA_HORARIA, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', hourCycle: 'h23',
  }).formatToParts(fecha)
  const valor = (tipo: string) => Number(partes.find(p => p.type === tipo)?.value ?? 0)
  return { year: valor('year'), month: valor('month'), day: valor('day'), hour: valor('hour') }
}

// Fechas de calendario en UTC para evitar desplazamientos por la zona horaria del servidor.
function fechaCalendario(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day))
}
function sumarDiasLaborables(base: Date, dias: number): Date {
  const fecha = new Date(base)
  let contados = 0
  while (contados < dias) {
    fecha.setUTCDate(fecha.getUTCDate() + 1)
    const dia = fecha.getUTCDay()
    if (dia !== 0 && dia !== 6) contados++
  }
  return fecha
}
function formatoFecha(fecha: Date, conDia = true): string {
  const dia = fecha.getUTCDay()
  const num = fecha.getUTCDate()
  const mes = MESES_ES[fecha.getUTCMonth()]
  return conDia ? `${DIAS_ES[dia]} ${num} de ${mes}` : `${num} de ${mes}`
}
function isoFecha(fecha: Date): string {
  return `${fecha.getUTCFullYear()}-${String(fecha.getUTCMonth()+1).padStart(2,'0')}-${String(fecha.getUTCDate()).padStart(2,'0')}`
}

/**
 * Estimación dinámica para catálogo/carrito/checkout. El corte comercial es
 * a las 15:00, hora de República Dominicana; solo se cuentan lunes-viernes.
 */
export function getFechaEntrega(
  tipo: string, nombre = '', sph?: string | number | null
): { texto: string; corto: string } {
  const info = getEntrega(tipo, nombre, sph)
  const ahora = new Date()
  const local = partesFechaDR(ahora)
  let base = fechaCalendario(local.year, local.month, local.day)
  if (local.hour >= 15) base.setUTCDate(base.getUTCDate() + 1)

  const min = sumarDiasLaborables(base, info.dias_min)
  const max = sumarDiasLaborables(base, info.dias_max)
  if (info.dias_min === info.dias_max) {
    return {
      texto: `Llega el ${formatoFecha(min)}`,
      corto: `${DIAS_ES[min.getUTCDay()].charAt(0).toUpperCase()}${DIAS_ES[min.getUTCDay()].slice(1)} ${min.getUTCDate()}/${min.getUTCMonth()+1}`,
    }
  }
  const rango = min.getUTCMonth() === max.getUTCMonth() && min.getUTCFullYear() === max.getUTCFullYear()
    ? `${min.getUTCDate()} y ${formatoFecha(max, false)}`
    : `${formatoFecha(min, false)} y ${formatoFecha(max, false)}`
  return { texto: `Llega entre el ${rango}`, corto: `${min.getUTCDate()}–${max.getUTCDate()} ${MESES_ES[max.getUTCMonth()]}` }
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
  const local = partesFechaDR(new Date())
  const base = fechaCalendario(local.year, local.month, local.day)
  if (local.hour >= 15) base.setUTCDate(base.getUTCDate() + 1)
  return isoFecha(sumarDiasLaborables(base, info.dias_max))
}

/**
 * Calcula un rango fijo a partir de la fecha original de creación del pedido.
 * No utiliza la fecha actual: consultar el pedido días después no desplaza la promesa.
 * Los días contabilizados son de lunes a viernes.
 */
export function getRangoEntregaDesdeFecha(
  fechaCreacion: string | Date,
  tipo: string,
  sph?: string | number | null
): { texto: string; fechaMin: string; fechaMax: string } {
  const info = getEntrega(tipo, '', sph)
  const fecha = fechaCreacion instanceof Date ? fechaCreacion : new Date(fechaCreacion)
  if (Number.isNaN(fecha.getTime())) {
    return { texto: 'Fecha de entrega por confirmar', fechaMin: '', fechaMax: '' }
  }
  const local = partesFechaDR(fecha)
  let base = fechaCalendario(local.year, local.month, local.day)
  // Si la orden se creó desde las 15:00 (hora RD), el conteo inicia al próximo día.
  if (local.hour >= 15) base.setUTCDate(base.getUTCDate() + 1)
  const min = sumarDiasLaborables(base, info.dias_min)
  const max = sumarDiasLaborables(base, info.dias_max)
  const mismoMes = min.getUTCMonth() === max.getUTCMonth() && min.getUTCFullYear() === max.getUTCFullYear()
  const texto = mismoMes
    ? `Entre el ${min.getUTCDate()} y el ${formatoFecha(max, false)} de ${MESES_ES[max.getUTCMonth()]}`
    : `Entre el ${formatoFecha(min, false)} y el ${formatoFecha(max, false)}`
  return { texto, fechaMin: isoFecha(min), fechaMax: isoFecha(max) }
}
