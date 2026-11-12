-- Actualiza el cálculo de envío con la provincia guardada en orders.ciudad.
-- El descuento de envío gratis por cupón sigue teniendo prioridad.
CREATE OR REPLACE FUNCTION public.insert_order_items_secure(
  p_order_id uuid, p_items jsonb
)
RETURNS TABLE(ok boolean, count integer, error_msg text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_order RECORD;
  v_count integer := 0;
  v_item jsonb;
  v_real_price numeric;
  v_stock_actual integer;
  v_nombre_producto text;
  v_cantidad integer;
  v_subtotal_real numeric := 0;
  v_envio_real numeric := 0;
  v_descuento_real numeric := 0;
  v_cupon_valido boolean;
  v_cupon_descuento numeric;
  v_cupon_envio_gratis boolean;
BEGIN
  SELECT id, pago_estado, user_id, created_at, cupon_aplicado, cliente_email, envio, ciudad
  INTO v_order
  FROM orders
  WHERE id = p_order_id
    AND pago_estado = 'pendiente'
    AND created_at > NOW() - INTERVAL '60 minutes'
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, 'Orden no válida o expirada.'::text;
    RETURN;
  END IF;

  DELETE FROM order_items WHERE order_id = p_order_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT precio, stock, nombre INTO v_real_price, v_stock_actual, v_nombre_producto
    FROM products
    WHERE id = (v_item->>'product_id')::uuid AND activo = true
    FOR UPDATE;

    IF v_real_price IS NULL THEN
      RETURN QUERY SELECT false, 0, 'Uno de los productos ya no está disponible.'::text;
      RETURN;
    END IF;

    v_cantidad := COALESCE((v_item->>'cantidad')::integer, 1);
    IF v_cantidad < 1 OR v_cantidad > 50 THEN
      RETURN QUERY SELECT false, 0, 'Cantidad de producto no válida.'::text;
      RETURN;
    END IF;

    IF v_stock_actual < v_cantidad THEN
      RETURN QUERY SELECT false, 0,
        ('Ya no hay suficiente stock de ' || v_nombre_producto || ' (quedan ' || v_stock_actual || ').')::text;
      RETURN;
    END IF;

    v_subtotal_real := v_subtotal_real + (v_real_price * v_cantidad);

    INSERT INTO order_items (
      order_id, product_id, nombre, precio, precio_original, descuento_pct,
      cantidad, ojo_mode, misma_receta, sph, cyl, axis, add_power,
      sph_od, sph_oi, cyl_od, cyl_oi, axis_od, axis_oi, color, size, suscripcion, ojo
    ) VALUES (
      p_order_id, (v_item->>'product_id')::uuid, v_nombre_producto,
      v_real_price, v_real_price, 0, v_cantidad,
      v_item->>'ojo_mode',
      CASE WHEN v_item->>'misma_receta' IS NOT NULL THEN (v_item->>'misma_receta')::boolean END,
      CASE WHEN v_item->>'sph' IS NOT NULL THEN (v_item->>'sph')::numeric END,
      CASE WHEN v_item->>'cyl' IS NOT NULL THEN (v_item->>'cyl')::numeric END,
      CASE WHEN v_item->>'axis' IS NOT NULL THEN (v_item->>'axis')::integer END,
      v_item->>'add_power',
      CASE WHEN v_item->>'sph_od' IS NOT NULL THEN (v_item->>'sph_od')::numeric END,
      CASE WHEN v_item->>'sph_oi' IS NOT NULL THEN (v_item->>'sph_oi')::numeric END,
      CASE WHEN v_item->>'cyl_od' IS NOT NULL THEN (v_item->>'cyl_od')::numeric END,
      CASE WHEN v_item->>'cyl_oi' IS NOT NULL THEN (v_item->>'cyl_oi')::numeric END,
      CASE WHEN v_item->>'axis_od' IS NOT NULL THEN (v_item->>'axis_od')::smallint END,
      CASE WHEN v_item->>'axis_oi' IS NOT NULL THEN (v_item->>'axis_oi')::smallint END,
      v_item->>'color', v_item->>'size', v_item->>'suscripcion',
      COALESCE(v_item->>'ojo_mode', v_item->>'ojo')
    );
    v_count := v_count + 1;
  END LOOP;

  v_envio_real := CASE
    WHEN v_order.ciudad IN ('Santo Domingo', 'Distrito Nacional') THEN 250
    ELSE 350
  END;

  IF v_subtotal_real >= 8000 THEN v_envio_real := 0; END IF;

  IF v_order.cupon_aplicado IS NOT NULL THEN
    SELECT valido, descuento, envio_gratis
    INTO v_cupon_valido, v_cupon_descuento, v_cupon_envio_gratis
    FROM validate_coupon(v_order.cupon_aplicado, v_subtotal_real, v_order.cliente_email);

    IF v_cupon_valido THEN
      v_descuento_real := v_cupon_descuento;
      IF v_cupon_envio_gratis THEN v_envio_real := 0; END IF;
    END IF;
  END IF;

  UPDATE orders SET
    total = v_subtotal_real + v_envio_real - v_descuento_real,
    subtotal = v_subtotal_real,
    envio = v_envio_real,
    descuento = v_descuento_real
  WHERE id = p_order_id;

  RETURN QUERY SELECT true, v_count, ''::text;
EXCEPTION WHEN OTHERS THEN
  RETURN QUERY SELECT false, 0, SQLERRM::text;
END;
$function$;

-- El endpoint del servidor autentica al cliente y verifica la propiedad de la orden.
-- El RPC privilegiado no debe poder invocarse directamente desde el navegador.
REVOKE ALL ON FUNCTION public.insert_order_items_secure(uuid, jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.insert_order_items_secure(uuid, jsonb) FROM anon;
REVOKE ALL ON FUNCTION public.insert_order_items_secure(uuid, jsonb) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.insert_order_items_secure(uuid, jsonb) TO service_role;
