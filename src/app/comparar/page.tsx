import { createServerSupabaseClient } from '@/lib/supabase-server'
import ComparadorClient from './ComparadorClient'
import Navbar from '@/components/ui/Navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comparador de Lentes de Contacto | ContactGo® República Dominicana',
  description: 'Compara lentes de contacto lado a lado: marca, precio, curva base, diámetro, material, contenido de agua, oxígeno y más. El comparador más completo de RD.',
  alternates: { canonical: 'https://www.contactgo.net/comparar' },
}

export const revalidate = 3600

export default async function ComparadorPage() {
  const sb = createServerSupabaseClient()
  // BUG CORREGIDO (2026-08-13): 'ojo' y 'size' NO existen en la tabla
  // products (son campos de order_items, no del catálogo) — pedirlos
  // aquí hacía fallar la consulta completa en silencio (el código no
  // revisaba el error de Supabase), dejando productos=null y por lo
  // tanto el buscador del comparador sin ningún resultado, siempre.
  const campos: string = 'id, nombre, descripcion, marca, tipo, reemplazo, precio, costo, stock, categoria_id, precio_anterior, contenido, curva_base, diametro, material, oxígeno, agua, proteccion_uv, horas_uso, uso_recomendado, fabricante_nombre, pais_origen, dias_uso, pares_por_caja, imagen_url, slug, activo, sph_disponibles, cyl_disponibles, add_disponibles, colores_disponibles'
  const { data: productos, error: errorProductos } = await sb
    .from('products')
    .select(campos)
    .eq('activo', true)
    .not('tipo', 'in', '(solucion,gota)')
    .order('tipo')
    .order('precio')

  if (errorProductos) {
    console.error('[comparar] Error cargando productos:', errorProductos.message)
  }

  return (
    <>
      <Navbar />
      <ComparadorClient productos={(productos ?? []) as any} />
    </>
  )
}
