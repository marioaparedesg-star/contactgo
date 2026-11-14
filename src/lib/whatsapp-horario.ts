// Ventana de envío de WhatsApp a clientes: lunes a sábado, 9:00 a. m. a 6:00 p. m.,
// hora de República Dominicana (America/Santo_Domingo). Fuera de esta ventana no se
// envía nada a clientes: el mensaje se encola y sale en la siguiente ventana.
export const ZONA_RD = 'America/Santo_Domingo'
export const HORA_INICIO = 9   // 09:00 incluido
export const HORA_FIN = 18     // 18:00 excluido

type Partes = { dow: number; hour: number; minute: number }

// dow: 0=domingo ... 6=sábado, en hora de RD
export function partesRD(d: Date): Partes {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: ZONA_RD, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  })
  const p: Record<string, string> = {}
  for (const x of f.formatToParts(d)) p[x.type] = x.value
  const dias = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return { dow: dias.indexOf(p.weekday), hour: Number(p.hour), minute: Number(p.minute) }
}

export function enVentanaWhatsApp(d: Date = new Date()): boolean {
  const { dow, hour } = partesRD(d)
  return dow >= 1 && dow <= 6 && hour >= HORA_INICIO && hour < HORA_FIN
}

// Próximo instante (>= d) en que se permite enviar: próximo día hábil a las 9:00 RD.
export function proximaVentanaWhatsApp(d: Date = new Date()): Date {
  if (enVentanaWhatsApp(d)) return d
  // RD no tiene horario de verano: UTC-4 fijo. 9:00 RD = 13:00 UTC.
  for (let k = 0; k <= 8; k++) {
    const base = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + k, 13, 0, 0))
    if (base.getTime() <= d.getTime()) continue
    const { dow } = partesRD(base)
    if (dow >= 1 && dow <= 6) return base
  }
  throw new Error('No se pudo calcular la próxima ventana de WhatsApp')
}
