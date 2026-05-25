// Formato SPH siempre con signo
export function fmtSph(v: any): string {
  if (v == null) return ''
  const n = parseFloat(String(v))
  if (isNaN(n)) return String(v)
  if (n === 0) return 'Plano (0.00)'
  return n > 0 ? `+${n.toFixed(2)}` : n.toFixed(2)
}

export function fmtReceta(item: any): string {
  const parts: string[] = []
  if (item.sph != null) parts.push(`SPH ${fmtSph(item.sph)}`)
  if (item.cyl != null) parts.push(`CYL ${parseFloat(item.cyl).toFixed(2)}`)
  if (item.axis != null) parts.push(`${String(item.axis).padStart(3,'0')}°`)
  if (item.add_power) parts.push(`ADD ${item.add_power}`)
  if (item.color) parts.push(item.color)
  if (item.ojo) parts.push(item.ojo === 'OD' ? '👁 OD' : item.ojo === 'OI' ? '👁 OI' : '👁 Ambos')
  return parts.join(' · ')
}