/**
 * FUENTE ÚNICA DE VERDAD — Tiempos de entrega por categoría
 * Modificar SOLO aquí para actualizar en PDP, carrito, checkout, email y confirmación.
 */

export interface EntregaInfo {
  etiqueta:  string       // Texto corto para badges
  detalle:   string       // Texto completo para PDP / email
  dias_min:  number
  dias_max:  number
  especial:  boolean      // true = fabricación especial / color ámbar
  icono:     string
}

const TIEMPOS: Record<string, EntregaInfo> = {
  esferico: {
    etiqueta: 'Entrega 24 h',
    detalle:  'Entrega estimada: 24 horas laborables.',
    dias_min: 1, dias_max: 1,
    especial: false,
    icono:    '🚀',
  },
  color: {
    etiqueta: 'Entrega 24 h',
    detalle:  'Entrega estimada: 24 horas laborables.',
    dias_min: 1, dias_max: 1,
    especial: false,
    icono:    '🚀',
  },
  multifocal: {
    etiqueta: 'Pedido especial · 5-10 días',
    detalle:  'Fabricación especial. Entrega estimada de 5 a 10 días laborables.',
    dias_min: 5, dias_max: 10,
    especial: true,
    icono:    '⚗️',
  },
  torico: {
    etiqueta: 'Fabricación especial · 25-30 días',
    detalle:  'Fabricación especial. Entrega estimada de 25 a 30 días laborables.',
    dias_min: 25, dias_max: 30,
    especial: true,
    icono:    '⏱️',
  },
  solucion: {
    etiqueta: 'Entrega 24 h',
    detalle:  'Entrega estimada: 24 horas laborables.',
    dias_min: 1, dias_max: 1,
    especial: false,
    icono:    '🚀',
  },
  gota: {
    etiqueta: 'Entrega 24 h',
    detalle:  'Entrega estimada: 24 horas laborables.',
    dias_min: 1, dias_max: 1,
    especial: false,
    icono:    '🚀',
  },
}

/** Detecta si un producto es XR / alta graduación por su nombre */
function esXR(nombre: string): boolean {
  return /\bxr\b/i.test(nombre) || /alta.gradu/i.test(nombre)
}

/** Retorna la info de entrega para un producto */
export function getEntrega(tipo: string, nombre = ''): EntregaInfo {
  if (esXR(nombre) && (tipo === 'torico' || tipo === 'esferico' || tipo === 'multifocal')) {
    return {
      etiqueta: 'Fabricación bajo pedido · 25-30 días',
      detalle:  'Fabricación especial bajo pedido. Entrega estimada de 25 a 30 días laborables.',
      dias_min: 25, dias_max: 30,
      especial: true,
      icono:    '🔬',
    }
  }
  return TIEMPOS[tipo] ?? {
    etiqueta: 'Consultar disponibilidad',
    detalle:  'Consultar tiempo de entrega.',
    dias_min: 1, dias_max: 7,
    especial: false,
    icono:    '📦',
  }
}

/**
 * Calcula la fecha exacta de entrega en texto legible.
 * Saltea sábados y domingos como días no laborables.
 * Ej: "Llega el martes 10 de junio" | "Entre el 10 y 15 de julio"
 */
export function getFechaEntrega(tipo: string, nombre = ''): { texto: string; corto: string } {
  const info = getEntrega(tipo, nombre)
  const DIAS_ES = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado']
  const MESES_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']

  function addDiasLaborables(base: Date, dias: number): Date {
    const d = new Date(base)
    let added = 0
    // Si pedido después de las 3pm, empieza a contar desde el día siguiente
    if (base.getHours() >= 15) d.setDate(d.getDate() + 1)
    while (added < dias) {
      d.setDate(d.getDate() + 1)
      const dow = d.getDay()
      if (dow !== 0 && dow !== 6) added++ // saltea sábado y domingo
    }
    return d
  }

  function fmtFecha(d: Date, conDia = true): string {
    const dia  = DIAS_ES[d.getDay()]
    const num  = d.getDate()
    const mes  = MESES_ES[d.getMonth()]
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
  const textoRango = mismoMes
    ? `${fechaMin.getDate()} y ${fmtFecha(fechaMax, false)}`
    : `${fmtFecha(fechaMin, false)} y ${fmtFecha(fechaMax, false)}`

  return {
    texto: `Llega entre el ${textoRango}`,
    corto: `${fechaMin.getDate()}–${fechaMax.getDate()} ${MESES_ES[fechaMax.getMonth()]}`,
  }
}

/** Componente de texto plano para emails (sin JSX) */
export function getEntregaTextoEmail(tipo: string, nombre = ''): string {
  return getEntrega(tipo, nombre).detalle
}
