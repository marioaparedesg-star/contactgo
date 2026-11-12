-- Restringe la función privilegiada para que solo pueda ejecutarla el backend.
-- El endpoint valida la sesión del usuario y la propiedad de la orden antes de invocarla.
REVOKE ALL ON FUNCTION public.insert_order_items_secure(uuid, jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.insert_order_items_secure(uuid, jsonb) FROM anon;
REVOKE ALL ON FUNCTION public.insert_order_items_secure(uuid, jsonb) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.insert_order_items_secure(uuid, jsonb) TO service_role;
