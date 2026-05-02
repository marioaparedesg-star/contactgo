import type { Prescription, PrescriptionAnalysis } from '@/types'

export function analyzePrescription(rx: Partial<Prescription>): PrescriptionAnalysis {
  const condicion: string[] = []
  const sph = rx.od_sph ?? rx.oi_sph ?? 0
  const cyl = rx.od_cyl ?? rx.oi_cyl ?? 0
  const add = rx.add_power ?? 0

  // Miopía
  if (sph < 0) condicion.push('Miopía')
  // Hipermetropía
  if (sph > 0) condicion.push('Hipermetropía')
  // Astigmatismo
  if (cyl !== 0) condicion.push('Astigmatismo')
  // Presbicia / Visión lejana
  if (add > 0) condicion.push('Presbicia')
  // Sin graduación
  if (sph === 0 && cyl === 0 && add === 0) condicion.push('Sin graduación')

  // Determinar tipo de lente
  let recomendacion: PrescriptionAnalysis['recomendacion'] = 'esferico'
  let descripcion = ''

  if (add > 0) {
    recomendacion = 'multifocal'
    descripcion = 'Tu receta indica presbicia. Los lentes multifocales te darán visión nítida a todas las distancias.'
  } else if (cyl !== 0) {
    recomendacion = 'torico'
    descripcion = 'Tu receta tiene astigmatismo. Los lentes tóricos están diseñados específicamente para corregir esta condición.'
  } else {
    recomendacion = 'esferico'
    descripcion = sph === 0
      ? 'Tu receta es para uso cosmético o protección. Los lentes esféricos son ideales para ti.'
      : sph < 0
        ? 'Tu receta indica miopía. Los lentes esféricos corregirán tu visión de lejos.'
        : 'Tu receta indica hipermetropía. Los lentes esféricos corregirán tu visión de cerca.'
  }

  return { condicion, recomendacion, descripcion }
}

export function formatSph(val: number): string {
  return val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)
}
