'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import ProductCard from '@/components/shop/ProductCard'
import Link from 'next/link'

const DIAGNOSTICO_TIPOS: Record<string, string[]> = {
  'Miopía': ['esferico'],
  'Hipermetropía': ['esferico'],
  'Astigmatismo': ['torico'],
  'Miopía + Astigmatismo': ['torico'],
  'Hipermetropía + Astigmatismo': ['torico'],
  'Presbicia': ['multifocal'],
  'Presbicia + Miopía': ['multifocal'],
  'Presbicia + Miopía + Astigmatismo': ['multifocal', 'torico'],
}

export default function PersonalizedSection() {
  const [productos, setProductos] = useState<any[]>([])
  const [diagnostico, setDiagnostico] = useState('')
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return }

      const { data: perfil } = await sb.from('profiles').select('nombre').eq('id', user.id).single()
      if (perfil?.nombre) setNombre(perfil.nombre.split(' ')[0])

      const { data: recetas } = await sb
        .from('prescriptions').select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (!recetas?.length || !recetas[0].diagnostico) { setLoading(false); return }

      const dx = recetas[0].diagnostico
      setDiagnostico(dx)

      const tipos = DIAGNOSTICO_TIPOS[dx] || ['esferico']
      const { data: prods } = await sb
        .from('products').select('*, categories(*)')
        .eq('activo', true).gt('stock', 0)
        .in('tipo', tipos).limit(4)
      setProductos(prods || [])
      setLoading(false)
    })
  }, [])

  if (loading || !diagnostico || !productos.length) return null

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-2">
        <div className="min-w-0">
          <p className="text-sm text-primary-600 font-semibold mb-0.5 truncate">
            {nombre ? `Hola ${nombre} 👋` : 'Para ti'}
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
            Lentes para tu receta
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Basado en tu diagnóstico:{' '}
            <span className="font-semibold text-gray-700">{diagnostico}</span>
          </p>
        </div>
        <Link
          href="/catalogo"
          className="text-xs sm:text-sm text-primary-600 font-semibold hover:text-primary-700 whitespace-nowrap shrink-0 mt-1"
        >
          Ver todos →
        </Link>
      </div>

      {/* Grid — 2 columnas en móvil, 4 en desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {productos.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}
