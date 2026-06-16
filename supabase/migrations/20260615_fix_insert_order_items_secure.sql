-- Fix: insert_order_items_secure ahora incluye las columnas del modelo EyeFlow
-- ojo_mode, misma_receta, sph_od, sph_oi, cyl_od, cyl_oi, axis_od, axis_oi
-- Ejecutado directamente en Supabase el 2026-06-15

CREATE OR REPLACE FUNCTION public.insert_order_items_secure(
  p_order_id uuid, p_items jsonb
)
RETURNS TABLE(ok boolean, count integer, error_msg text)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_order RECORD; v_count integer := 0; v_item jsonb;
BEGIN
  SELECT id, pago_estado, created_at INTO v_order FROM orders
  WHERE id = p_order_id AND pago_estado = 'pendiente'
    AND created_at > NOW() - INTERVAL '60 minutes' LIMIT 1;
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, 'Orden no válida o expirada.'::text; RETURN;
  END IF;
  DELETE FROM order_items WHERE order_id = p_order_id;
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    INSERT INTO order_items (
      order_id, product_id, nombre, precio, precio_original, descuento_pct, cantidad,
      ojo_mode, misma_receta,
      sph, cyl, axis, add_power, sph_od, sph_oi, cyl_od, cyl_oi, axis_od, axis_oi,
      color, size, suscripcion, ojo
    ) VALUES (
      p_order_id, (v_item->>'product_id')::uuid, v_item->>'nombre',
      (v_item->>'precio')::numeric,
      COALESCE((v_item->>'precio_original')::numeric, (v_item->>'precio')::numeric),
      COALESCE((v_item->>'descuento_pct')::numeric, 0),
      COALESCE((v_item->>'cantidad')::integer, 1),
      v_item->>'ojo_mode',
      CASE WHEN v_item->>'misma_receta' IS NOT NULL THEN (v_item->>'misma_receta')::boolean END,
      CASE WHEN v_item->>'sph'     IS NOT NULL THEN (v_item->>'sph')::numeric     END,
      CASE WHEN v_item->>'cyl'     IS NOT NULL THEN (v_item->>'cyl')::numeric     END,
      CASE WHEN v_item->>'axis'    IS NOT NULL THEN (v_item->>'axis')::integer    END,
      v_item->>'add_power',
      CASE WHEN v_item->>'sph_od'  IS NOT NULL THEN (v_item->>'sph_od')::numeric  END,
      CASE WHEN v_item->>'sph_oi'  IS NOT NULL THEN (v_item->>'sph_oi')::numeric  END,
      CASE WHEN v_item->>'cyl_od'  IS NOT NULL THEN (v_item->>'cyl_od')::numeric  END,
      CASE WHEN v_item->>'cyl_oi'  IS NOT NULL THEN (v_item->>'cyl_oi')::numeric  END,
      CASE WHEN v_item->>'axis_od' IS NOT NULL THEN (v_item->>'axis_od')::smallint END,
      CASE WHEN v_item->>'axis_oi' IS NOT NULL THEN (v_item->>'axis_oi')::smallint END,
      v_item->>'color', v_item->>'size', v_item->>'suscripcion',
      COALESCE(v_item->>'ojo_mode', v_item->>'ojo')
    );
    v_count := v_count + 1;
  END LOOP;
  RETURN QUERY SELECT true, v_count, ''::text;
EXCEPTION WHEN OTHERS THEN
  RETURN QUERY SELECT false, 0, SQLERRM::text;
END; $$;
