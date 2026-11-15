// Selección de alertas administrativas. Función PURA: no envía nada ni consulta la base.
// Reglas confirmadas por Mario:
//  - Falta de pago: pedido sin pagar a las 2 horas o más desde su creación. Un aviso por pedido.
//  - Entrega a 45 días: 45 días desde la fecha de pago sin entregar. Un aviso por pedido.
// Solo pedidos reales (es_prueba = false) y no cancelados.

export type PedidoAlerta = {
  id: string; numero_orden: string | null; cliente_nombre: string | null; total: number | null
  estado: string; pago_estado: string; created_at: string; pagado_en: string | null; es_prueba: boolean | null
}
export type TipoAlerta = 'alerta_falta_pago' | 'alerta_entrega_45d'
export type Alerta = { tipo: TipoAlerta; pedido: PedidoAlerta }

const HORA = 60 * 60 * 1000
const DIA = 24 * HORA
export const HORAS_FALTA_PAGO = 2
export const DIAS_ENTREGA = 45
// Ventana de búsqueda: evita avisar por pedidos muy antiguos la primera vez que corre.
const VENTANA_DIAS = 8

export function seleccionarAlertas(pedidos: PedidoAlerta[], ahora: Date, yaEnviadas: Set<string>): Alerta[] {
  const out: Alerta[] = []
  const t = ahora.getTime()
  for (const p of pedidos) {
    if (p.es_prueba) continue
    if (p.estado === 'cancelado' || p.estado === 'entregado') continue
    const clave = (tipo: TipoAlerta) => `${tipo}:${p.id}`

    // Falta de pago
    if (p.pago_estado !== 'pagado') {
      const creado = new Date(p.created_at).getTime()
      const edad = t - creado
      if (edad >= HORAS_FALTA_PAGO * HORA && edad <= VENTANA_DIAS * DIA && !yaEnviadas.has(clave('alerta_falta_pago'))) {
        out.push({ tipo: 'alerta_falta_pago', pedido: p })
      }
    }

    // Entrega a 45 días desde el pago
    if (p.pago_estado === 'pagado' && p.pagado_en) {
      const pagado = new Date(p.pagado_en).getTime()
      const edad = t - pagado
      const dias = DIAS_ENTREGA * DIA
      const enVentana = edad >= dias && edad <= dias + VENTANA_DIAS * DIA
      if (enVentana && !yaEnviadas.has(clave('alerta_entrega_45d'))) {
        out.push({ tipo: 'alerta_entrega_45d', pedido: p })
      }
    }
  }
  return out
}
