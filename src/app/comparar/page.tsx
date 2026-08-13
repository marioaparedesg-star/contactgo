import { createServerSupabaseClient } from '@/lib/supabase-server'
import ComparadorClient from './ComparadorClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comparador de Lentes de Contacto | ContactGo® República Dominicana',
  description: 'Compara lentes de contacto lado a lado: marca, precio, curva base, diámetro, material, contenido de agua, oxígeno y más. El comparador más completo de RD.',
  alternates: { canonical: 'https://www.contactgo.net/comparar' },
}

export const revalidate = 3600

export default async function ComparadorPage() {
  const sb = createServerSupabaseClient()
  const campos: string = 'id, nombre, marca, tipo, reemplazo, precio, precio_anterior, contenido, curva_base, diametro, material, oxígeno, agua, proteccion_uv, horas_uso, uso_recomendado, fabricante_nombre, pais_origen, dias_uso, pares_por_caja, imagen_url, slug'
  const { data: productos } = await sb
    .from('products')
    .select(campos)
    .eq('activo', true)
    .not('tipo', 'in', '(solucion,gota)')
    .order('tipo')
    .order('precio')

  return <ComparadorClient productos={(productos ?? []) as any} />
}
