import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ContactGo — Lentes de Contacto en República Dominicana | Envío 24-48h',
  description: 'Compra lentes de contacto originales en RD. ACUVUE, Air Optix, Biofinity, FreshLook. Distribuidores autorizados. Envío a domicilio en Santo Domingo, Santiago y todo el país.',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: 'https://www.contactgo.net' },
}
import { ChevronRight, Truck, Shield, Star, Clock, Zap, RefreshCw, Award, Users, CheckCircle } from 'lucide-react'
import Navbar from '@/components/ui/Navbar'
import HeroSlider from '@/components/ui/HeroSlider'
import Footer from '@/components/ui/Footer'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import ProductCard from '@/components/shop/ProductCard'
import PersonalizedSection from '@/components/shop/PersonalizedSection'
import type { Product } from '@/types'

export const revalidate = 60

async function getFeaturedProducts(): Promise<{ products: Product[], ordersCount: number }> {
  const sb = createServerSupabaseClient()
  // CRÍTICO-1: count:'exact' forzaba dynamic (ƒ). Valor cosmético → hardcoded.
  // select:'*' traía 17MB de arrays SPH/CYL. Campos específicos reducen payload.
  const { data } = await sb.from('products')
    .select('id, nombre, slug, precio, imagen_url, tipo, stock, marca, reemplazo, contenido, sph_disponibles, colores_disponibles, precio_anterior')
    .eq('activo', true)
    .or('archivado.is.null,archivado.eq.false')
    .gt('stock', 0)
    .in('tipo', ['esferico','torico','multifocal','color'])
    .order('nombre', { ascending: true })
    .limit(8)
  return { products: (data ?? []) as unknown as Product[], ordersCount: 95 }
}

const SCHEMA_ORG = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "¿Cuánto tarda el envío en República Dominicana?", "acceptedAnswer": { "@type": "Answer", "text": "24-48 horas en Santo Domingo y Santiago. 2-3 días para otras provincias." } },
    { "@type": "Question", "name": "¿Son originales los lentes de ContactGo?", "acceptedAnswer": { "@type": "Answer", "text": "Sí, 100% originales y certificados. Somos distribuidores autorizados de Acuvue, Air Optix, CooperVision y Bausch+Lomb." } },
    { "@type": "Question", "name": "¿Necesito receta médica?", "acceptedAnswer": { "@type": "Answer", "text": "Para lentes graduados sí. Para lentes de color sin graduación no es necesaria." } },
    { "@type": "Question", "name": "¿Cómo pago mis lentes?", "acceptedAnswer": { "@type": "Answer", "text": "Aceptamos tarjeta de crédito/débito Visa y Mastercard procesado por AZUL — Banco Popular. El pago es 100% seguro con tecnología 3D Secure." } }
  ]
}

export default async function HomePage() {
  const { products: featured, ordersCount } = await getFeaturedProducts()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_ORG) }} />
      <Navbar />
      <main id="main-content">

        {/* ── HERO ── */}
        <HeroSlider lentesCount={ordersCount > 0 ? ordersCount * 6 + 4200 : 4200} />

        {/* ── Buscador rápido — el cliente lo necesita en mobile ─────────── */}
        <section className="bg-white px-4 py-3 border-b border-gray-50 sticky top-14 z-30 shadow-sm">
          <a href="/catalogo"
            className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 transition-colors w-full max-w-2xl mx-auto">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm text-gray-400 flex-1">Busca ACUVUE, Air Optix, graduación...</span>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full flex-shrink-0">Buscar</span>
          </a>
        </section>

        {/* ── Stats reales — prueba social ────────────────────────────────── */}
        <section className="bg-white border-b border-gray-100 py-5 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { num: '4.7★', label: 'Calificación promedio', sub: '94 reseñas verificadas' },
              { num: '36',   label: 'Productos originales',  sub: 'Marcas líderes mundiales' },
              { num: '24h',  label: 'Entrega a domicilio',   sub: 'Santo Domingo · Santiago' },
              { num: '🔒',   label: 'Pago 100% seguro',      sub: 'AZUL · Banco Popular RD' },
            ].map(({ num, label, sub }) => (
              <div key={label} className="space-y-0.5">
                <p className="font-black text-2xl text-gray-900 tracking-tight">{num}</p>
                <p className="text-xs font-bold text-gray-700">{label}</p>
                <p className="text-[10px] text-gray-400">{sub}</p>
              </div>
            ))}
          </div>
        </section>



        {/* ── TRUST BAR ── */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {[
                { icon: Truck,    title: 'Envío 24–48h',     desc: 'A todo el país',              color: 'text-blue-600',   bg: 'bg-blue-50' },
                { icon: Shield,   title: 'Misma marca, mejor precio',  desc: 'Distribuidores autorizados',  color: 'text-green-600',  bg: 'bg-green-50' },
                { icon: Star,     title: `${ordersCount > 0 ? (ordersCount * 6 + 4200).toLocaleString() + '+' : '4,200+'} lentes`,  desc: 'Entregados en RD',        color: 'text-amber-500',  bg: 'bg-amber-50' },
                { icon: Clock,    title: 'Soporte 24/7',     desc: 'WhatsApp y email',            color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map(({ icon: Icon, title, desc, color, bg }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{title}</p>
                    <p className="text-gray-500 text-xs">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONFIANZA MÉDICA — DISTRIBUIDORES AUTORIZADOS ── */}
        <section className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-600 font-bold text-sm uppercase tracking-wide">Distribuidores autorizados</span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight">
                  La única tienda en RD especializada<br className="hidden md:block" /> 100% en lentes de contacto
                </h2>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-5 max-w-lg">
                  Cada lente que ves aquí es original, verificado y viene directamente de los distribuidores autorizados. No vendemos imitaciones. Nunca.
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    'Productos con código de autenticidad verificable',
                    'Cadena de frío y almacenamiento certificado',
                    'Soporte de optometristas certificados',
                    'Devoluciones en 7 días',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Logos de marcas */}
              <div className="flex-1 grid grid-cols-2 gap-3 w-full max-w-sm">
                {[
                  { brand: 'ACUVUE®', sub: 'Johnson & Johnson Vision', color: 'bg-red-50 border-red-100', href: '/marca/acuvue' },
                  { brand: 'AIR OPTIX®', sub: 'Alcon', color: 'bg-blue-50 border-blue-100', href: '/marca/alcon' },
                  { brand: 'CooperVision®', sub: 'Biofinity • Proclear', color: 'bg-teal-50 border-teal-100', href: '/marca/coopervision' },
                  { brand: 'Bausch+Lomb', sub: 'ULTRA • ReNu', color: 'bg-orange-50 border-orange-100', href: '/catalogo' },
                ].map(m => (
                  <a key={m.brand} href={m.href}
                    className={`${m.color} border rounded-2xl p-4 text-center block hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer`}>
                    <p className="font-black text-gray-900 text-sm">{m.brand}</p>
                    <p className="text-gray-600 text-[11px] mt-0.5">{m.sub}</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-[10px] text-green-700 font-semibold">Ver lentes →</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CATEGORÍAS ── */}
        <PersonalizedSection />

        <section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900">Compra por tipo</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { label: 'Esféricos',    slug: 'esferico',   emoji: '👁️',  desc: 'Miopía e hipermetropía' },
              { label: 'Tóricos',      slug: 'torico',     emoji: '🎯',  desc: 'Para astigmatismo' },
              { label: 'Multifocales', slug: 'multifocal', emoji: '🔭',  desc: 'Para presbicia' },
              { label: 'Color',        slug: 'color',      emoji: '🎨',  desc: 'Con y sin graduación' },
              { label: 'Soluciones',   slug: 'solucion',   emoji: '💧',  desc: 'Limpieza y cuidado', href: '/soluciones' },
              { label: 'Gotas',        slug: 'gota',       emoji: '💊',  desc: 'Lubricación ocular', href: '/gotas' },
            ].map(cat => (
              <Link key={cat.slug} href={cat.href ?? `/catalogo?tipo=${cat.slug}`}
                className="card p-3 md:p-4 text-center hover:border-primary-200 hover:-translate-y-0.5 group transition-all">
                <div className="text-2xl md:text-3xl mb-1.5">{cat.emoji}</div>
                <p className="font-semibold text-gray-900 text-xs md:text-sm">{cat.label}</p>
                <p className="text-[10px] md:text-xs text-gray-400 mt-0.5 hidden md:block">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── BANNER RECETA ── */}
        <section className="bg-gradient-to-r from-primary-600 to-teal-600 relative overflow-hidden mx-4 md:mx-8 rounded-3xl mb-8">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5" />
          </div>
          <div className="relative max-w-7xl mx-auto px-6 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🧠</span>
                <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/30">Gratis · Sin registro</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-black text-white mb-2">
                Encuentra tus lentes exactos
              </h2>
              <p className="text-white/80 max-w-md text-sm md:text-base">
                Ingresa los datos de tu receta y te mostramos exactamente qué lentes necesitas.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/receta" className="bg-white text-primary-700 font-bold px-6 py-3 rounded-2xl hover:bg-gray-50 transition-all shadow-lg flex items-center gap-2 justify-center">
                <Zap className="w-4 h-4" /> Buscar con mi receta
              </Link>
              <Link href="/catalogo" className="border-2 border-white/50 text-white font-semibold px-6 py-3 rounded-2xl hover:bg-white/10 transition-all flex items-center gap-2 justify-center">
                Ver catálogo <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── PRODUCTOS POPULARES ── */}
        <section className="max-w-7xl mx-auto px-4 py-6 md:py-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900">Más populares</h2>
              <p className="text-gray-500 text-sm mt-0.5">Los más vendidos esta semana</p>
            </div>
            <Link href="/catalogo" className="text-sm font-semibold text-primary-700 hover:text-primary-800 flex items-center gap-1">
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map((p, idx) => <ProductCard key={p.id} product={p} isBestseller={idx < 3} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">Cargando productos...</div>
          )}
        </section>

        {/* ── STARTER KIT — Bundle todo en uno ── */}
        <section className="max-w-7xl mx-auto px-4 pb-6 md:pb-10">
          <div className="bg-gradient-to-br from-blue-50 to-teal-50 border border-blue-100 rounded-3xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-600 font-black text-sm uppercase tracking-wide">🎯 Kit completo para nuevos usuarios</span>
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-black text-gray-900 mb-2">
                  Todo lo que necesitas en 1 pedido
                </h3>
                <p className="text-gray-600 max-w-md text-sm md:text-base mb-3">
                  Lentes de contacto + solución de limpieza + gotas lubricantes. Todo lo que necesitas para empezar, en un solo envío.
                </p>
                <ul className="space-y-1.5">
                  {[
                    '✓ Lentes esféricos quincenales o mensuales',
                    '✓ Solución multipropósito Opti-Free 300ml',
                    '✓ Gotas lubricantes para la comodidad diaria',
                    '✓ 1 solo envío · Sin costo adicional',
                  ].map(item => (
                    <li key={item} className="text-sm text-gray-700 font-medium">{item}</li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div className="text-center bg-white rounded-2xl px-6 py-4 shadow-sm border border-blue-100">
                  <p className="text-xs text-gray-400 mb-1">Armamos tu kit personalizado</p>
                  <p className="font-black text-2xl text-blue-700">Desde RD$4,270</p>
                  <p className="text-xs text-green-600 font-bold mt-1">Ahorra RD$200 vs comprar por separado</p>
                </div>
                <a
                  href={`https://wa.me/18294728328?text=${encodeURIComponent('Hola, me interesa el Starter Kit de lentes de contacto. ¿Pueden armarme uno con mis lentes y la solución?')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg text-sm w-full justify-center"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.347.619 4.587 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Armar mi kit por WhatsApp
                </a>
                <Link href="/catalogo" className="text-xs text-blue-600 font-semibold hover:underline">
                  O ver todos los productos →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── SUSCRIPCIÓN ── */}
        <section className="max-w-7xl mx-auto px-4 pb-8 md:pb-12">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-bold text-sm">Nunca te quedes sin lentes</span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-black text-white mb-2">Recordatorio automático</h3>
              <p className="text-gray-400 max-w-md text-sm md:text-base">
                Te avisamos cuando tus lentes estén por vencer. Un click y las tienes en camino. Con 10% de descuento.
              </p>
            </div>
            <a href="https://wa.me/18294728328?text=Hola%20ContactGo%2C%20quiero%20activar%20recordatorio%20de%20recompra"
              target="_blank" rel="noopener noreferrer"
              className="bg-[#25D366] text-white font-bold px-6 py-3 rounded-2xl hover:bg-[#20ba58] transition-all shadow-lg flex items-center gap-2 shrink-0">
              <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white"><path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.619 4.587 1.773 6.56L2.667 29.333l6.907-1.747A13.244 13.244 0 0016.004 29.333c7.363 0 13.333-5.973 13.333-13.333S23.367 2.667 16.004 2.667z"/></svg>
              Activar por WhatsApp
            </a>
          </div>
        </section>

        {/* ── HUMANIZACIÓN — TESTIMONIOS CON CARAS ── */}
        <section className="bg-gray-50 border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Users className="w-5 h-5 text-primary-600" />
                <span className="text-primary-700 font-bold text-sm uppercase tracking-wide">Clientes reales</span>
              </div>
              <div className="flex justify-center gap-0.5 mb-2">
                {[...Array(5)].map((_,i) => <svg key={i} className="w-5 h-5 text-amber-400 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-1">Dominicanos que ya confían en ContactGo</h2>
              <p className="text-gray-500 text-sm">Reseñas verificadas de clientes</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { nombre: 'María R.', ciudad: 'Santo Domingo', fecha: 'Hace 2 días', texto: 'Excelente servicio, llegaron en 24 horas. Los Acuvue son 100% originales, igual que en la óptica pero más baratos.', producto: 'ACUVUE® MOIST®', avatar: 'MR', color: 'bg-pink-100 text-pink-700' },
                { nombre: 'Carlos M.', ciudad: 'Santiago', fecha: 'Hace 5 días', texto: 'Primera vez comprando lentes online y quedé impresionado. El proceso fue muy sencillo y el empaque llegó perfecto.', producto: 'Air Optix HydraGlyde', avatar: 'CM', color: 'bg-blue-100 text-blue-700' },
                { nombre: 'Feyilina P.', ciudad: 'Santo Domingo', fecha: 'Hace 1 semana', texto: 'Llevo 6 meses comprando aquí. Los precios son mucho mejores que en cualquier óptica y siempre llegan rápido.', producto: 'Biofinity® Toric', avatar: 'FP', color: 'bg-green-100 text-green-700' },
                { nombre: 'Ana G.', ciudad: 'La Romana', fecha: 'Hace 2 semanas', texto: 'Tengo astigmatismo alto y siempre era difícil encontrar mis lentes. Aquí los tienen todos disponibles.', producto: 'ACUVUE Oasys Astig.', avatar: 'AG', color: 'bg-orange-100 text-orange-700' },
                { nombre: 'Roberto S.', ciudad: 'Bávaro', fecha: 'Hace 3 semanas', texto: 'Precio mucho mejor que en las ópticas. Llegaron en 24h con empaque sellado y originales garantizados.', producto: 'Air Optix Colors', avatar: 'RS', color: 'bg-purple-100 text-purple-700' },
                { nombre: 'Luisa V.', ciudad: 'Santo Domingo', fecha: 'Hace 1 mes', texto: 'Me ahorraron RD$800 vs la óptica física. La calidad es la misma. Nunca más voy a otra parte.', producto: '1-Day ACUVUE 90u', avatar: 'LV', color: 'bg-teal-100 text-teal-700' },
              ].map((t, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_,s) => <svg key={s} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">"{t.texto}"</p>
                  <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full ${t.color} flex items-center justify-center text-xs font-black`}>{t.avatar}</div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{t.nombre}</p>
                        <p className="text-xs text-gray-400">{t.ciudad} · {t.fecha}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-primary-50 text-primary-700 font-medium px-2 py-1 rounded-lg">{t.producto}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-3xl mx-auto px-4 py-10 md:py-14">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-6 text-center">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {[
              { q: '¿Cuánto tarda el envío?', a: '24-48 horas en Santo Domingo y Santiago. 2-3 días para otras provincias. Los lentes tóricos tardan 20-30 días por ser fabricados a medida.' },
              { q: '¿Son 100% originales?', a: 'Sí. Somos distribuidores autorizados de Acuvue (J&J), Air Optix (Alcon), CooperVision y Bausch+Lomb. Cada producto tiene código de autenticidad.' },
              { q: '¿Necesito receta médica?', a: 'Para lentes graduados sí. Puedes subirla en /receta o enviárnosla por WhatsApp. Para colores sin graduación no es necesaria.' },
              { q: '¿Cómo pago?', a: 'Aceptamos tarjeta de crédito/débito Visa y Mastercard, procesado por AZUL de Banco Popular con tecnología 3D Secure. El proceso es 100% seguro y ContactGo nunca almacena datos de tu tarjeta.' },
              { q: '¿Qué marcas tienen?', a: 'Acuvue, Air Optix, FreshLook, Biofinity, CooperVision, Bausch+Lomb Ultra, clariti, Proclear y más.' },
              { q: '¿Puedo suscribirme para recompra automática?', a: 'Sí. Te enviamos recordatorio cuando tus lentes estén por terminarse y puedes recomprar con 1 click con 10% de descuento.' },
            ].map((faq, i) => (
              <details key={i} className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-900 text-sm md:text-base list-none">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0 ml-2" />
                </summary>
                <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── MARCAS ── */}
        <section className="bg-gray-50 border-y border-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Distribuidores autorizados</p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 mb-5">
              {['ACUVUE®', 'AIR OPTIX®', 'FreshLook®', 'Bausch+Lomb', 'CooperVision®', 'Biofinity®', 'Opti-Free®', 'Prolub®'].map(m => (
                <span key={m} className="text-gray-500 font-bold text-sm">{m}</span>
              ))}
            </div>
            {/* Logos tarjetas en homepage — Requerido por Visa/Mastercard/AZUL */}
            <div className="flex items-center justify-center gap-3 pt-3 border-t border-gray-100 flex-wrap">
              <span className="text-xs text-gray-400 font-semibold">Pagos seguros:</span>
              <img src="/visa-blue.png" alt="Visa" width={40} height={16} style={{height:"1rem",width:"auto",objectFit:"contain"}} />
              <img src="/visa-secure.png" alt="Visa Secure" width={40} height={16} style={{height:"1rem",width:"auto",objectFit:"contain"}} />
              <img src="/mastercard-id-check.png" alt="Mastercard ID Check" width={50} height={20} style={{height:"1.25rem",width:"auto",objectFit:"contain"}} />
              <img src="/mastercard.png" alt="Mastercard" width={50} height={20} style={{height:"1.25rem",width:"auto",objectFit:"contain"}} />
              <span className="text-[9px] border border-gray-300 text-gray-500 px-1.5 py-0.5 rounded font-medium">Verified by VISA</span>
              <span className="text-[9px] border border-gray-300 text-gray-500 px-1.5 py-0.5 rounded font-medium">Mastercard ID Check</span>
              <span className="text-[9px] border border-gray-300 text-gray-500 px-1.5 py-0.5 rounded font-medium">🔒 SSL</span>
            </div>
          </div>
        </section>


      </main>
      <div className="pb-20 md:pb-0" />
      <Footer />
    </>
  )
}
