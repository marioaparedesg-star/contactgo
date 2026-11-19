-- Restringe la creación directa de pedidos por clientes.
-- Los pedidos creados desde checkout deben iniciar pendientes; solo el callback
-- verificado de AZUL o una acción administrativa autorizada puede marcarlos pagados.
drop policy if exists "Users can insert own orders" on public.orders;
create policy "Users can insert own orders"
on public.orders
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and pago_estado = 'pendiente'
  and estado = 'pendiente'
);
