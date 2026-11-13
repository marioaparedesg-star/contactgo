/** Reglas comerciales de envío de ContactGo (DOP). */
export const ENVIO_GRATIS_DESDE = 8000
export const ENVIO_SANTO_DOMINGO = 250
export const ENVIO_INTERIOR = 350

export function esGranSantoDomingo(ciudad?: string | null): boolean {
  const value = String(ciudad ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()
  return /^(santo domingo|santo domingo este|santo domingo oeste|santo domingo norte|distrito nacional|ensanche|los alcarrizos|boca chica|pantoja|pedro brand|la guayiga)/.test(value)
}

export function calcularEnvio(subtotal: number, ciudad?: string | null, envioGratisPorCupon = false): number {
  if (subtotal >= ENVIO_GRATIS_DESDE || envioGratisPorCupon) return 0
  return esGranSantoDomingo(ciudad) ? ENVIO_SANTO_DOMINGO : ENVIO_INTERIOR
}
