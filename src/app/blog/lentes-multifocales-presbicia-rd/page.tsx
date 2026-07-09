export const revalidate = 86400

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

// canonical
export const metadata = {
  openGraph: {
    images: [{ url: 'https://www.contactgo.net/og-image.jpg', width: 1200, height: 630 }],
    title: 'Lentes Multifocales para Presbicia en RD',
    url: 'https://www.contactgo.net/blog/lentes-multifocales-presbicia-rd',
    siteName: 'ContactGo',
    locale: 'es_DO',
    type: 'article',
  },
  alternates: { canonical: 'https://www.contactgo.net/blog/lentes-multifocales-presbicia-rd' },
  title: 'Lentes multifocales para presbicia en RD — ContactGo',
  description: 'Guía completa sobre lentes de contacto multifocales para presbicia en República Dominicana. Marcas disponibles, adaptación y precios.',
}

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <a href="/" className="hover:text-primary-600">Inicio</a><span>/</span>
          <a href="/blog" className="hover:text-primary-600">Blog</a><span>/</span>
          <span className="text-gray-600">Lentes multifocales para presbicia en RD</span>
        </div>

        <div className="mb-2"><Link href="/blog" className="text-sm text-primary-600 font-semibold">← Blog</Link></div>
        <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Presbicia</span>
        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">Lentes multifocales para presbicia: la guía definitiva</h1>
                <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">CG</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Equipo ContactGo</p>
            <p className="text-xs text-gray-500">Especialistas en salud visual · Revisado por optómetra certificado</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          <span>📅 10 de mayo, 2026</span>
          <span>·</span>
          <a href="/autor/equipo-contactgo" className="hover:text-primary-600 transition-colors">✍️ Equipo ContactGo</a>
          <span>·</span>
          <span>⏱ 5 min lectura</span>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 my-6">
          <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">📋 En este artículo</p>
          <ol className="space-y-1.5 list-decimal list-inside">
            <li key="0"><a href="#que-son" className="text-primary-600 hover:underline text-sm">Qué son los lentes multifocales</a></li>
            <li key="1"><a href="#como-funcionan" className="text-primary-600 hover:underline text-sm">Cómo funcionan</a></li>
            <li key="2"><a href="#marcas" className="text-primary-600 hover:underline text-sm">Marcas disponibles en RD</a></li>
            <li key="3"><a href="#precios" className="text-primary-600 hover:underline text-sm">Precios 2026</a></li>
            <li key="4"><a href="#faq" className="text-primary-600 hover:underline text-sm">Preguntas frecuentes</a></li>
          </ol>
        </div>


        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Después de los 40-45 años, casi todos necesitamos ayuda para ver de cerca. La presbicia (también llamada "vista cansada") afecta a millones de dominicanos. La buena noticia: los lentes de contacto multifocales te permiten ver bien a todas las distancias sin depender de gafas de lectura.</p>

          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
            <h2 className="font-bold text-orange-900 mb-2">¿Qué es la presbicia?</h2>
            <p className="text-sm text-orange-800">Es la pérdida natural de flexibilidad del cristalino que ocurre con la edad. Se manifiesta como dificultad para enfocar objetos cercanos — el menú en el restaurante, el teléfono, los mensajes de WhatsApp. En tu receta aparece como el valor <strong>ADD (adición)</strong>.</p>
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Lentes multifocales disponibles en ContactGo</h2>
            {[
              { nombre: 'ACUVUE® OASYS® Multifocal', reemplazo: 'Quincenal', precio: 'RD$7,500', add: 'Low / Mid / High', desc: 'Diseño PUPIL OPTIMIZED — se adapta automáticamente al tamaño de tu pupila. Excelente para trabajo con pantallas.', href: '/producto/acuvue-oasys-multifocal-lentes-contacto-dominicana' },
              { nombre: 'AIR OPTIX® plus HydraGlyde® Multifocal', reemplazo: 'Mensual', precio: 'RD$6,960', add: 'LOW / MID / HIGH', desc: 'De Alcon. Silicona hidrogel con capa HydraGlyde. Buena opción mensual con alta transmisión de oxígeno.', href: '/producto/air-optix-hydraglyde-multifocal-lentes-presbicia-dominicana' },
              { nombre: 'Biofinity® Multifocal', reemplazo: 'Mensual', precio: 'RD$9,000', add: '+1.00 a +2.50', desc: 'Diseño Balanced Progressive — zonas suaves de transición. Adaptación muy natural, especialmente para presbicia inicial.', href: '/producto/biofinity-multifocal-lentes-presbicia-coopervision-dominicana' },
              { nombre: 'Proclear® Multifocal XR', reemplazo: 'Mensual', precio: 'RD$16,800', add: '+1.00 a +4.00', desc: 'Para presbicia avanzada con ADD alto. Disponible hasta +4.00 de adición — la mayor disponibilidad del mercado.', href: '/producto/proclear-multifocal-xr-lentes-presbicia-alta-graduacion-dominicana' },
              { nombre: 'clariti® 1 day multifocal', reemplazo: 'Diario', precio: 'RD$5,760', add: 'LOW / MED / HIGH', desc: 'El único multifocal diario disponible en RD. Sin mantenimiento, máxima comodidad para presbicia leve a moderada.', href: '/producto/clariti-1-day-multifocal-lentes-presbicia-diarios-dominicana' },
            ].map(p => (
              <div key={p.nombre} className="bg-white border border-gray-100 rounded-2xl p-4 mb-3">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 text-sm">{p.nombre}</h3>
                  <span className="text-primary-600 font-black shrink-0 text-sm">{p.precio}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{p.reemplazo} · ADD disponible: {p.add}</p>
                <p className="text-xs text-gray-700 mb-2">{p.desc}</p>
                <Link href={p.href} className="text-xs text-primary-600 font-semibold">Ver producto →</Link>
              </div>
            ))}
          </div>

          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 mb-3">¿Cuánto tiempo tarda la adaptación?</h2>
            <p className="text-sm mb-3">Los lentes multifocales requieren una adaptación neurológica — tu cerebro aprende a usar las diferentes zonas del lente de forma automática. El proceso típico:</p>
            <div className="space-y-2">
              {[
                { semana: 'Semana 1', desc: 'Puede haber ligero halo o sensación de adaptación. Normal.' },
                { semana: 'Semana 2', desc: 'La mayoría nota mejoría significativa. Visión más natural.' },
                { semana: 'Semana 3-4', desc: 'Adaptación completa para la mayoría de usuarios.' },
              ].map(s => (
                <div key={s.semana} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                  <span className="text-xs font-bold bg-primary-100 text-primary-700 px-2 py-1 rounded-lg shrink-0">{s.semana}</span>
                  <p className="text-sm text-gray-700">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary-600 rounded-2xl p-5 text-white text-center">
            <p className="font-bold mb-1">¿Tienes presbicia? Encuentra tu lente</p>
            <p className="text-sm text-white/80 mb-3">Ingresa tu ADD y te mostramos las opciones exactas disponibles en RD.</p>
            <Link href="/receta" className="bg-white text-primary-700 font-bold px-5 py-2.5 rounded-2xl inline-block text-sm hover:bg-gray-50 transition-all">
              Buscar multifocales →
            </Link>
          </div>
        </div>
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["Article", "MedicalWebPage"],
        "headline": "Lentes multifocales para presbicia en RD",
        "author": {"@type": "Organization", "name": "Equipo Editorial ContactGo", "url": "https://www.contactgo.net/autor/equipo-contactgo"},
        "publisher": {"@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": {"@type": "ImageObject", "url": "https://www.contactgo.net/logo.png"}},
        "datePublished": "2026-05-10",
        "dateModified": "2026-05-17", "lastReviewed": "2026-05-19",
      "reviewedBy": {
        "@type": "Organization",
        "name": "Comité de Optometría de ContactGo",
        "url": "https://www.contactgo.net/autor/equipo-contactgo"
      },
      "specialty": "Optometry",
      "medicalAudience": {"@type": "MedicalAudience", "audienceType": "Patient"},
        "inLanguage": "es-DO",
        "url": "https://www.contactgo.net/blog/lentes-multifocales-presbicia-rd"
      })}} />
      
          {/* Autor médico verificado */}
        <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-xl p-4 my-6">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-sm">
              <p className="font-bold text-gray-900 mb-0.5">Información médica revisada</p>
              <p className="text-gray-600 leading-relaxed">
                Escrito por <strong>Equipo ContactGo</strong>, Especialistas en Salud Visual · · <span className="text-gray-400"> Última revisión: mayo 2026</span>
              </p>
            </div>
          </div>
        </div>
        {/* Disclaimer médico */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-8 text-sm text-amber-900">
            <strong>⚠️ Aviso médico:</strong> Este artículo es informativo y no sustituye la consulta con un profesional óptico u oftalmólogo. Los lentes de contacto son productos sanitarios que requieren prescripción. Si experimentas molestias, suspende su uso y consulta a tu especialista.
          </div>
      
        <div className="mt-10 bg-primary-50 border border-primary-100 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-600 mb-3">ACUVUE, Air Optix y Proclear para presbicia</p>
          <a href="/multifocales" className="inline-flex items-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">
            Ver lentes multifocales →
          </a>
        </div>

        <section id="faq">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
          <div className="space-y-3">
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Qué son los lentes de contacto multifocales?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Son lentes diseñados para personas con presbicia (vista cansada), que permiten ver bien tanto de cerca como de lejos en un solo lente. Usan zonas ópticas concéntricas o progresivas para diferentes distancias.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿A partir de qué edad se necesitan lentes multifocales?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">La presbicia suele aparecer entre los 40 y 45 años, aunque puede variar. Si notas que necesitas alejar los objetos para leer o tienes fatiga visual al trabajar de cerca, es momento de consultar a tu optometrista.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Son difíciles de adaptar los lentes multifocales?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">Requieren un período de adaptación de 2-4 semanas. El cerebro aprende a seleccionar el foco correcto automáticamente. La mayoría de usuarios se adapta sin problemas siguiendo las instrucciones del especialista.</p>
          </details>
          <details className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">¿Cuánto cuestan los lentes multifocales en RD?<svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></summary>
            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">En ContactGo desde RD$4,100 (Bausch+Lomb ULTRA for Presbyopia) hasta RD$9,500 (Biofinity Multifocal). También disponibles Air Optix Multifocal a RD$7,250 y ACUVUE Oasys Multifocal a RD$8,200.</p>
          </details>
          </div>
        </section>

        <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">Recibe tus lentes en 24-48h en toda RD</h3>
          <p className="text-sm text-gray-500 mb-4">100% originales · Sellados de fábrica · Pago seguro con AZUL</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo completo →</a>
            <a href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm">Calcular mi receta gratis</a>
            <a href="https://wa.me/18096942268" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">Comprar por WhatsApp</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
