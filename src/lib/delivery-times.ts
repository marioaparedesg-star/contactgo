/**
 * FUENTE ÚNICA DE VERDAD — Tiempos de entrega por categoría
 *
 * REGLAS DE NEGOCIO (definidas por Mario — aplican a todo el país):
 *  - Color → siguiente día laborable
 *  - Esférico → 24-72 horas
 *  - Multifocal → 1-5 días laborables
 *  - Tórico → 25-45 días laborables
 *  - Solución / Gota → 24 horas
 */

export interface EntregaInfo {
  etiqueta: string
  detalle:  string
  dias_min: number
  dias_max: number
  especial: boolean
  icono:    string
}

const T_COLOR_PLANO: EntregaInfo = {
  etiqueta: 'Entrega al siguiente día laborable',
  detalle:  'Los lentes de color planos disponibles se entregan el siguiente día laborable. Los pedidos recibidos durante fines de semana o fuera del horario operativo comienzan a procesarse el siguiente día laborable.',
  dias_min: 1, dias_max: 1,
  especial: false,
  icono:    '🚀',
}

const T_24H: EntregaInfo = {
  etiqueta: 'Entrega estimada en 24 horas',
  detalle: 'Entrega estimada en 24 horas. Los pedidos recibidos durante fines de semana o fuera del horario operativo comienzan a procesarse el siguiente día laborable.',
  dias_min: 1, dias_max: 1,
  especial: false,
  icono: '🚀',
}

const T_24_72H: EntregaInfo = {
  etiqueta: 'Entrega estimada en 24 a 72 horas',
  detalle:  'Entrega estimada en 24 a 72 horas. Los pedidos recibidos durante fines de semana o fuera del horario operativo comienzan a procesarse el siguiente día laborable.',
  dias_min: 1, dias_max: 3,
  especial: false,
  icono:    '📦',
}

const T_ESFERICO: EntregaInfo = T_24_72H

const T_MULTIFOCAL: EntregaInfo = {
  etiqueta: 'Entrega estimada de 1 a 5 días laborables',
  detalle:  'Entrega estimada del lente multifocal: de 1 a 5 días laborables, según disponibilidad y preparación. Los pedidos recibidos durante fines de semana o fuera del horario operativo comienzan a procesarse el siguiente día laborable.',
  dias_min: 1, dias_max: 5,
  especial: true,
  icono:    '📦',
}

const T_TORICO: EntregaInfo = {
  etiqueta: 'Bajo pedido · 25–45 días laborables',
  detalle:  'Lente tórico bajo pedido. Entrega estimada de 25 a 45 días laborables, según fabricación y disponibilidad. Los pedidos recibidos durante fines de semana o fuera del horario operativo comienzan a procesarse el siguiente día laborable.',
  dias_min: 25, dias_max: 45,
  especial: true,
  icono:    '⏱️',
}

/**
 * Retorna la info de entrega según tipo de producto y graduación seleccionada.
 *
 * @param tipo    - Tipo de producto: esferico | torico | multifocal | multifocal_torico | color | solucion | gota
 * @param nombre  - Nombre del producto (sin uso actualmente; se conserva por compatibilidad de firma)
 * @param sph     - Graduación seleccionada (se conserva por compatibilidad con los componentes existentes)
 */
export function getEntrega(tipo: string, nombre = '', sph?: string | number | null): EntregaInfo {

  if (tipo === 'esferico')   return T_ESFERICO
  if (tipo === 'multifocal_torico') return T_TORICO
  if (tipo === 'multifocal' && /toric|tórico|torico/i.test(nombre)) return T_TORICO
  if (tipo === 'multifocal') return T_MULTIFOCAL
  if (tipo === 'torico')     return T_TORICO

  if (tipo === 'color') return T_COLOR_PLANO

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
function normalizarInicioLaborable(base: Date, hora: number): Date {
  const fecha = new Date(base)
  if (hora >= 15) fecha.setUTCDate(fecha.getUTCDate() + 1)
  while (fecha.getUTCDay() === 0 || fecha.getUTCDay() === 6) {
    fecha.setUTCDate(fecha.getUTCDate() + 1)
  }
  return fecha
}
function sumarHorasHastaDiaLaborable(base: Date, horas: number): Date {
  const fecha = new Date(base.getTime() + horas * 60 * 60 * 1000)
  while (true) {
    const local = partesFechaDR(fecha)
    const dia = fechaCalendario(local.year, local.month, local.day).getUTCDay()
    if (dia !== 0 && dia !== 6) return fecha
    fecha.setTime(fecha.getTime() + 24 * 60 * 60 * 1000)
  }
}
function esEntregaPorHoras(tipo: string): boolean {
  return ['esferico', 'color', 'solucion', 'gota'].includes(tipo)
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
  // Promesas comerciales por categoría: no mostrar fechas de calendario
  // que cambian según la hora de compra o el día en que se consulta.
  return { texto: info.etiqueta, corto: info.etiqueta }
}

/** Texto para emails */
export function getEntregaTextoEmail(tipo: string, nombre = '', sph?: string | number | null): string {
  return getEntrega(tipo, nombre, sph).detalle
}

/**
 * Fecha estimada de entrega en formato ISO (YYYY-MM-DD), saltando fines de
 * semana. Usa el extremo máximo del plazo: 72 horas para esféricos y
 * dias_max laborables para las categorías con preparación especial. Para
 * Google Customer Reviews es preferible estimar de forma conservadora y no
 * enviar la encuesta antes de que el cliente reciba el pedido.
 */
export function getFechaEntregaISO(tipo: string, nombre = '', sph?: string | number | null): string {
  return getFechaEntregaISODesdeFecha(new Date(), tipo, nombre, sph)
}

/**
 * Calcula un rango fijo a partir de la fecha original de creación del pedido.
 * No utiliza la fecha actual: consultar el pedido días después no desplaza la promesa.
 * Los plazos en horas se calculan desde la fecha real y se desplazan si caen en fin de semana;
 * los plazos expresados en días solo cuentan de lunes a viernes.
 */
export function getFechaEntregaISODesdeFecha(fechaCreacion: string | Date, tipo: string, nombre = '', sph?: string | number | null): string {
  const info = getEntrega(tipo, nombre, sph)
  const fecha = fechaCreacion instanceof Date ? fechaCreacion : new Date(fechaCreacion)
  if (Number.isNaN(fecha.getTime())) return getFechaEntregaISO(tipo, nombre, sph)
  if (esEntregaPorHoras(tipo)) {
    const horasMax = tipo === 'esferico' ? 72 : 24
    return isoFecha(sumarHorasHastaDiaLaborable(fecha, horasMax))
  }
  const local = partesFechaDR(fecha)
  const base = fechaCalendario(local.year, local.month, local.day)
  return isoFecha(sumarDiasLaborables(normalizarInicioLaborable(base, local.hour), info.dias_max))
}

export function getRangoEntregaDesdeFecha(
  fechaCreacion: string | Date,
  tipo: string,
  sph?: string | number | null,
  nombre = ''
): { texto: string; fechaMin: string; fechaMax: string } {
  const info = getEntrega(tipo, nombre, sph)
  const fecha = fechaCreacion instanceof Date ? fechaCreacion : new Date(fechaCreacion)
  if (Number.isNaN(fecha.getTime())) {
    return { texto: 'Fecha de entrega por confirmar', fechaMin: '', fechaMax: '' }
  }
  let min: Date
  let max: Date
  if (esEntregaPorHoras(tipo)) {
    const horasMin = 24
    const horasMax = tipo === 'esferico' ? 72 : 24
    min = sumarHorasHastaDiaLaborable(fecha, horasMin)
    max = sumarHorasHastaDiaLaborable(fecha, horasMax)
  } else {
    const local = partesFechaDR(fecha)
    const base = fechaCalendario(local.year, local.month, local.day)
    const inicio = normalizarInicioLaborable(base, local.hour)
    min = sumarDiasLaborables(inicio, info.dias_min)
    max = sumarDiasLaborables(inicio, info.dias_max)
  }
  const mismoMes = min.getUTCMonth() === max.getUTCMonth() && min.getUTCFullYear() === max.getUTCFullYear()
  const texto = isoFecha(min) === isoFecha(max)
    ? `El ${formatoFecha(min)}`
    : mismoMes
      ? `Entre el ${min.getUTCDate()} y el ${max.getUTCDate()} de ${MESES_ES[max.getUTCMonth()]}`
      : `Entre el ${formatoFecha(min, false)} y el ${formatoFecha(max, false)}`
  return { texto, fechaMin: isoFecha(min), fechaMax: isoFecha(max) }
}
