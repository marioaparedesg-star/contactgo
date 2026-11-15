-- Dashboard finance: align receivables and reporting to actual cash movements.
-- Existing transactions are not rewritten; this migration only corrects the read model.
CREATE OR REPLACE VIEW public.admin_kpis
WITH (security_invoker = true)
AS
WITH hoy_rd AS (
  SELECT (now() AT TIME ZONE 'America/Santo_Domingo')::date AS d,
         ((now() AT TIME ZONE 'America/Santo_Domingo') - interval '30 days') AT TIME ZONE 'America/Santo_Domingo' AS desde_30d,
         ((now() AT TIME ZONE 'America/Santo_Domingo') - interval '7 days') AT TIME ZONE 'America/Santo_Domingo' AS desde_7d
),
cobros AS (
  SELECT cm.monto, cm.fecha, cm.order_id
  FROM public.cash_movements cm
  WHERE cm.categoria = 'venta' AND cm.tipo = 'ingreso'
),
cobros_por_pedido AS (
  SELECT cm.order_id, sum(cm.monto) AS cobrado
  FROM cobros cm WHERE cm.order_id IS NOT NULL GROUP BY cm.order_id
),
pedidos_activos AS (
  SELECT o.id, o.fecha, o.estado, o.total,
         GREATEST(o.total - CASE WHEN o.pago_estado = 'pagado' THEN o.total ELSE COALESCE(cpp.cobrado, 0) END, 0) AS saldo_pendiente
  FROM public.orders o LEFT JOIN cobros_por_pedido cpp ON cpp.order_id = o.id
  WHERE o.estado <> 'cancelado' AND COALESCE(o.es_prueba, false) = false
),
cobros_30d_por_pedido AS (
  SELECT c.order_id, sum(c.monto) AS cobrado
  FROM cobros c CROSS JOIN hoy_rd h
  WHERE c.fecha >= h.d - 30 AND c.order_id IS NOT NULL GROUP BY c.order_id
)
SELECT
  (SELECT count(*) FROM public.orders o CROSS JOIN hoy_rd h WHERE o.fecha >= h.desde_30d AND o.estado <> 'cancelado' AND COALESCE(o.es_prueba,false)=false) AS orders_30d,
  (SELECT count(*) FROM public.orders o CROSS JOIN hoy_rd h WHERE o.fecha >= h.desde_7d AND o.estado <> 'cancelado' AND COALESCE(o.es_prueba,false)=false) AS orders_7d,
  (SELECT COALESCE(sum(c.monto),0) FROM cobros c CROSS JOIN hoy_rd h WHERE c.fecha >= h.d - 30) AS revenue_30d,
  (SELECT COALESCE(sum(c.monto),0) FROM cobros c CROSS JOIN hoy_rd h WHERE c.fecha >= h.d - 7) AS revenue_7d,
  (SELECT COALESCE(sum(cpp.cobrado) / NULLIF(count(*),0),0) FROM cobros_30d_por_pedido cpp) AS avg_order_value,
  (SELECT count(*) FROM public.orders o WHERE o.estado='entregado' AND COALESCE(o.es_prueba,false)=false) AS delivered_total,
  (SELECT count(*) FROM public.orders o WHERE o.estado='cancelado' AND COALESCE(o.es_prueba,false)=false) AS cancelled_total,
  (SELECT count(*) FROM public.profiles p WHERE p.role='customer') AS total_customers,
  (SELECT COALESCE(sum(c.monto),0) FROM cobros c CROSS JOIN hoy_rd h WHERE c.fecha = h.d) AS revenue_hoy,
  (SELECT COALESCE(sum(pa.saldo_pendiente),0) FROM pedidos_activos pa CROSS JOIN hoy_rd h WHERE pa.saldo_pendiente > 0 AND pa.fecha >= h.desde_30d) AS por_cobrar_activo,
  (SELECT COALESCE(sum(pa.saldo_pendiente),0) FROM pedidos_activos pa CROSS JOIN hoy_rd h WHERE pa.saldo_pendiente > 0 AND pa.fecha < h.desde_30d) AS por_cobrar_viejo,
  (SELECT count(*) FROM pedidos_activos pa CROSS JOIN hoy_rd h WHERE pa.saldo_pendiente > 0 AND pa.fecha >= h.desde_30d) AS pedidos_por_cobrar_activo,
  (SELECT count(*) FROM pedidos_activos pa CROSS JOIN hoy_rd h WHERE pa.saldo_pendiente > 0 AND pa.fecha < h.desde_30d) AS pedidos_por_cobrar_viejo,
  (SELECT count(*) FROM public.orders o CROSS JOIN hoy_rd h WHERE o.estado='entregado' AND COALESCE(o.es_prueba,false)=false AND o.entregado_at >= h.desde_30d) AS delivered_30d;
