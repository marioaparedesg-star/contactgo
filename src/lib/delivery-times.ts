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

/** Componente de texto plano para emails (sin JSX) */
export function getEntregaTextoEmail(tipo: string, nombre = ''): string {
  return getEntrega(tipo, nombre).detalle
}
