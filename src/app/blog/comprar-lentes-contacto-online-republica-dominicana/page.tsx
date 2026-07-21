export const revalidate = 86400
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comprar lentes de contacto online en RD — Guía segura 2026',
  description: 'Cómo comprar lentes de contacto online en República Dominicana de forma segura. ACUVUE, Biofinity, Air Optix certificados con entrega 24-48h. Guía completa 2026.',
  alternates: { canonical: 'https://www.contactgo.net/blog/comprar-lentes-contacto-online-republica-dominicana' },
  openGraph: {
    type: 'article',
    title: 'Comprar lentes de contacto online en RD — Guía 2026',
    description: 'Todo lo que necesitas saber para comprar lentes de contacto online en RD con seguridad. Originales, precios y entrega rápida.',
    url: 'https://www.contactgo.net/blog/comprar-lentes-contacto-online-republica-dominicana',
    siteName: 'ContactGo', locale: 'es_DO',
    images: [{ url: 'https://www.contactgo.net/blog/comprar-lentes-contacto-online-rd.webp', width: 1200, height: 630, alt: 'Comprar lentes de contacto online República Dominicana' }],
  },
}

export default function Page() {
  const FAQS = [
    { q: '¿Es seguro comprar lentes de contacto por internet en República Dominicana?', a: 'Sí, siempre que compres en una tienda especializada con garantía de autenticidad. ContactGo ofrece lentes directo del fabricante, directo del fabricante, con pago seguro mediante AZUL/Banco Popular y entrega verificada en 24-48 horas en toda la RD.' },
    { q: '¿Necesito receta para comprar lentes de contacto online?', a: 'Para lentes graduados sí. Necesitas los valores de tu receta (SPH, CYL, AXIS, ADD según el tipo). Para lentes de color sin graduación, no es necesaria. Puedes usar nuestra calculadora de receta gratuita si no tienes la tuya a mano.' },
    { q: '¿Cómo sé que los lentes son certificados?', a: 'Los lentes certificados vienen en empaque directo del fabricante con código de autenticidad verificable con el fabricante. En ContactGo todos los productos son directo del fabricante con garantía de autenticidad. Nunca vendemos imitaciones.' },
    { q: '¿Cuánto tarda la entrega de lentes de contacto en RD?', a: 'En ContactGo la entrega es en 24-48 horas en Santo Domingo y Santiago, y 24-72 horas en el resto del país.' },
    { q: '¿Puedo devolver los lentes si no son los correctos?', a: 'Sí. ContactGo acepta devoluciones de productos sellados no abiertos dentro de los 7 días de recibidos, siempre que no se haya roto el sello. Consulta nuestra política de devoluciones para más detalles.' },
    { q: '¿Cuál es la forma de pago para comprar lentes online en RD?', a: 'En ContactGo aceptamos tarjeta de crédito y débito (VISA y Mastercard) a través de AZUL/Banco Popular, el procesador de pagos más utilizado en República Dominicana.' },
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "Article",
            "headline": "Comprar lentes de contacto online en República Dominicana — Guía segura 2026",
            "description": "Guía completa para comprar lentes de contacto online en RD con seguridad.",
            "author": { "@type": "Organization", "name": "Equipo ContactGo" },
            "publisher": { "@type": "Organization", "name": "ContactGo", "url": "https://www.contactgo.net", "logo": { "@type": "ImageObject", "url": "https://www.contactgo.net/logo.png" } },
            "datePublished": "2026-06-15", "dateModified": "2026-06-27",
            "url": "https://www.contactgo.net/blog/comprar-lentes-contacto-online-republica-dominicana", "inLanguage": "es-DO" },
          { "@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": FAQS.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) },
          { "@context": "https://schema.org", "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.contactgo.net" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.contactgo.net/blog" },
              { "@type": "ListItem", "position": 3, "name": "Comprar lentes online RD", "item": "https://www.contactgo.net/blog/comprar-lentes-contacto-online-republica-dominicana" }
            ] }
        ]) }} />

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <Link href="/" className="hover:text-primary-600">Inicio</Link><span>/</span>
          <Link href="/blog" className="hover:text-primary-600">Blog</Link><span>/</span>
          <span className="text-gray-600">Comprar lentes online RD</span>
        </div>

        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">🛒 Guía de compra</span>

        <h1 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-2">
          Comprar lentes de contacto online en República Dominicana — Guía completa 2026
        </h1>

        <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0"><span className="text-white font-bold text-sm">CG</span></div>
          <div><p className="text-sm font-bold text-gray-900">Equipo ContactGo</p><p className="text-xs text-gray-500">Especialistas en lentes de contacto · Actualizado junio 2026</p></div>
        </div>

        <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-5 mb-6">
          <p className="text-sm font-bold text-primary-800 mb-1">⚡ Respuesta directa</p>
          <p className="text-sm text-primary-700 mb-3">La forma más segura y rápida de comprar lentes de contacto online en RD es través de <strong>ContactGo</strong>: la única tienda dominicana especializada 100% en lentes de contacto. Originales, entrega 24-48h y pago con AZUL.</p>
          <div className="flex gap-2">
            <Link href="/catalogo" className="flex-1 bg-primary-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs text-center hover:bg-primary-700 transition-colors">Ver catálogo completo →</Link>
            <a href="https://wa.me/18096942268" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white font-bold px-4 py-2.5 rounded-xl text-xs text-center">Comprar por WhatsApp</a>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 my-6">
          <p className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">📋 En este artículo</p>
          <ol className="space-y-1.5 text-sm list-decimal list-inside">
            {[['ventajas','Ventajas de comprar lentes online en RD'],['como-comprar','Paso a paso: cómo comprar de forma segura'],['que-verificar','Cómo verificar que son certificados'],['receta','Qué información necesitas de tu receta'],['pago','Opciones de pago disponibles'],['entrega','Tiempos de entrega por zona'],['faq','Preguntas frecuentes']].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} className="text-primary-600 hover:underline">{label}</a></li>
            ))}
          </ol>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <p>Comprar <strong>lentes de contacto online en República Dominicana</strong> se ha convertido en la opción preferida de miles de personas que quieren evitar desplazamientos, encontrar mejor precio y recibir sus lentes directamente en casa u oficina. Pero también hay dudas legítimas sobre autenticidad, recetas y seguridad. Esta guía te explica todo lo que necesitas saber.</p>

          <section id="ventajas">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Ventajas de comprar lentes de contacto online en RD</h2>
            <div className="grid gap-3">
              {[
                { icono: '⏱️', titulo: 'Ahorra tiempo', desc: 'Sin desplazamientos, sin citas, sin esperas. Compras en menos de 3 minutos desde tu teléfono y recibes en casa.' },
                { icono: '💰', titulo: 'Precios más competitivos', desc: 'Sin costos de local ni personal en sala, los precios online suelen ser más accesibles con el mismo producto original.' },
                { icono: '📦', titulo: 'Mayor disponibilidad de stock', desc: 'En tiendas físicas el stock es limitado. Online tienes acceso a toda la línea de marcas: ACUVUE, Biofinity, Air Optix, BL Ultra y más.' },
                { icono: '🔁', titulo: 'Recompra fácil', desc: 'Tu receta y dirección quedan guardadas. La próxima vez, repites pedido en un clic sin volver a ingresar datos.' },
                { icono: '🚀', titulo: 'Entrega en 24-48 horas', desc: 'En todo el país. Para Santo Domingo y Santiago, muchos pedidos llegan al día siguiente.' },
                { icono: '💳', titulo: 'Pago seguro', desc: 'Pago con tarjeta mediante AZUL/Banco Popular, el procesador más utilizado y confiable en República Dominicana.' },
              ].map(({ icono, titulo, desc }, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-xl shrink-0">{icono}</span>
                  <div><p className="font-bold text-gray-900 text-sm">{titulo}</p><p className="text-xs text-gray-600 mt-0.5">{desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section id="como-comprar">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Cómo comprar lentes de contacto online en RD — Paso a paso</h2>
            <div className="space-y-3">
              {[
                { paso: '1', titulo: 'Ten tu receta óptica actualizada', desc: 'Para lentes graduados necesitas los valores de tu última receta (no mayor a 1-2 años). Necesitarás: SPH (poder esférico), y si tienes astigmatismo: CYL y AXIS. Para presbicia además: ADD.' },
                { paso: '2', titulo: 'Usa la calculadora de receta si tienes dudas', desc: 'Si no estás seguro de qué tipo de lente necesitas, la calculadora gratuita de ContactGo te ayuda a identificarlo en segundos basándose en tu prescripción.' },
                { paso: '3', titulo: 'Elige tu marca y producto', desc: 'Explora el catálogo por marca (ACUVUE, Biofinity, Air Optix, etc.) o por categoría (esféricos, tóricos, multifocales, color). Cada producto tiene su descripción completa y especificaciones.' },
                { paso: '4', titulo: 'Selecciona tu graduación', desc: 'Ingresa el SPH (y CYL/AXIS si aplica) de cada ojo. Si los dos ojos tienen diferente graduación, puedes seleccionarlas por separado.' },
                { paso: '5', titulo: 'Completa el checkout en menos de 2 minutos', desc: 'Ingresa tu nombre, teléfono y dirección de entrega. El sistema guarda estos datos para futuros pedidos.' },
                { paso: '6', titulo: 'Paga con tu tarjeta de forma segura', desc: 'Acepta VISA y Mastercard a través de AZUL/Banco Popular. La transacción es 100% segura con cifrado SSL.' },
                { paso: '7', titulo: 'Recibe tu pedido en 24-48 horas', desc: 'El mensajero te contacta para coordinar la entrega. Sin necesidad de estar en un lugar fijo.' },
              ].map(({ paso, titulo, desc }) => (
                <div key={paso} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-black shrink-0">{paso}</div>
                  <div><p className="font-bold text-gray-900 text-sm">{titulo}</p><p className="text-xs text-gray-600 mt-0.5">{desc}</p></div>
                </div>
              ))}
            </div>
          </section>

          <section id="que-verificar">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Cómo verificar que los lentes son certificados</h2>
            <p>El riesgo real al comprar lentes de contacto online no es el pago — es recibir un producto falsificado que puede dañar la salud ocular. Aquí están las señales que distinguen una tienda confiable:</p>
            <div className="space-y-3 mt-4">
              {[
                { check: '✅', label: 'Producto directo del fabricante', desc: 'Cada caja debe venir con el sello original del fabricante intacto. Si el sellado está abierto o parece manipulado, es una señal de alarma.' },
                { check: '✅', label: 'Código de autenticidad', desc: 'Las marcas principales (ACUVUE, Biofinity, Air Optix) tienen códigos de verificación en el empaque que pueden comprobarse en el sitio oficial del fabricante.' },
                { check: '✅', label: 'Información clara del producto', desc: 'La etiqueta debe mostrar: nombre del producto, material, Dk/t, radio de curvatura (BC), diámetro (DIA), fecha de caducidad y graduación seleccionada.' },
                { check: '✅', label: 'Tienda especializada en lentes', desc: 'Una tienda que vende exclusivamente lentes de contacto tiene mayor control de autenticidad que una tienda general.' },
                { check: '❌', label: 'Desconfía de precios muy por debajo del mercado', desc: 'Si el precio es significativamente más bajo que el precio de referencia, podría indicar producto falsificado o almacenado incorrectamente.' },
                { check: '❌', label: 'Sin información de contacto ni dirección', desc: 'Una tienda legítima siempre tiene WhatsApp, email, teléfono o dirección verificable.' },
              ].map(({ check, label, desc }, i) => (
                <div key={i} className={`border rounded-xl p-3 ${check === '✅' ? 'border-green-100 bg-green-50/30' : 'border-red-100 bg-red-50/30'}`}>
                  <p className="font-bold text-gray-900 text-sm">{check} {label}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="receta">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Qué información necesitas de tu receta</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left border border-gray-100 font-bold">Valor</th>
                    <th className="p-3 text-left border border-gray-100 font-bold">Qué indica</th>
                    <th className="p-3 text-left border border-gray-100 font-bold">Cuándo aparece</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['SPH (o Esf)', 'Poder esférico — corrige miopía (-) o hipermetropía (+)', 'Siempre'],
                    ['CYL (o Cil)', 'Cilindro — indica astigmatismo', 'Solo si tienes astigmatismo'],
                    ['AXIS (o Eje)', 'Eje del astigmatismo (0-180°)', 'Solo si tienes astigmatismo'],
                    ['ADD', 'Adición — para presbicia (vista cansada)', 'Solo si tienes presbicia'],
                    ['OD / OS', 'Ojo derecho / Ojo izquierdo', 'Siempre (puede ser diferente por ojo)'],
                  ].map(([val, que, cuando], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border border-gray-100 font-mono font-bold text-primary-600">{val}</td>
                      <td className="p-3 border border-gray-100">{que}</td>
                      <td className="p-3 border border-gray-100 text-gray-500 text-xs">{cuando}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-gray-600">¿No tienes tu receta? <Link href="/receta" className="text-primary-600 font-semibold hover:underline">Usa nuestra calculadora gratuita</Link> — te ayudamos a identificar el lente correcto. También puedes consultarnos por <a href="https://wa.me/18096942268" target="_blank" rel="noopener noreferrer" className="text-primary-600 font-semibold hover:underline">WhatsApp</a>.</p>
          </section>

          <section id="entrega">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Tiempos de entrega en República Dominicana</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left border border-gray-100 font-bold">Zona</th>
                    <th className="p-3 text-center border border-gray-100 font-bold">Tiempo estimado</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Santo Domingo y Gran Santo Domingo', '24 horas'],
                    ['Santiago de los Caballeros', '24-48 horas'],
                    ['La Romana, San Pedro, San Cristóbal', '24-48 horas'],
                    ['Punta Cana / Bávaro / Cap Cana', '24-48 horas'],
                    ['Higüey, La Altagracia', '24-72 horas'],
                    ['Norte: Puerto Plata, Moca, SFM', '24-72 horas'],
                    ['Sur: Barahona, Azua, Baní', '24-72 horas'],
                    ['Otras zonas del país', '48-72 horas (consultar)'],
                  ].map(([zona, tiempo], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 border border-gray-100">{zona}</td>
                      <td className="p-3 border border-gray-100 text-center font-bold text-primary-600">{tiempo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-3">
            <h3 className="font-bold text-gray-900">Marcas disponibles en ContactGo</h3>
            {[
              { href: '/marca/acuvue', titulo: '→ ACUVUE® — Johnson & Johnson', desc: 'Oasys, 1-DAY MOIST, Astig, Multifocal' },
              { href: '/marca/alcon', titulo: '→ Air Optix® — Alcon', desc: 'HydraGlyde, Colors, Multifocal' },
              { href: '/marca/coopervision', titulo: '→ CooperVision', desc: 'Biofinity, clariti, Proclear, Avaira' },
              { href: '/marca/bausch-lomb', titulo: '→ Bausch+Lomb', desc: 'ULTRA, Ultra Astig, Biotrue ONEday' },
              { href: '/catalogo', titulo: '→ Ver catálogo completo', desc: 'Más de 35 productos disponibles' },
            ].map(({ href, titulo, desc }) => (
              <Link key={href} href={href} className="border border-gray-100 rounded-xl p-3 hover:border-primary-200 hover:bg-primary-50/20 transition-all">
                <p className="text-sm font-semibold text-primary-600">{titulo}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </Link>
            ))}
          </div>

          <section id="faq">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-5">Preguntas frecuentes</h2>
            <div className="space-y-3">
              {FAQS.map(({ q, a }, i) => (
                <details key={i} className="group bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                  <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-gray-900 text-sm list-none">
                    {q}
                    <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </summary>
                  <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-10 bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 rounded-2xl p-6 text-center">
          <h3 className="font-bold text-gray-900 text-lg mb-2">La tienda de lentes de contacto online en RD</h3>
          <p className="text-sm text-gray-600 mb-1">Originales · Entrega 24-48h · Pago seguro con AZUL</p>
          <p className="text-xs text-gray-400 mb-4">Más de 35 productos disponibles de ACUVUE, Biofinity, Air Optix y más</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/catalogo" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors text-sm">Ver catálogo completo →</Link>
            <Link href="/receta" className="inline-flex items-center justify-center gap-2 bg-white border border-primary-200 text-primary-600 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors text-sm">Calcular mi receta gratis</Link>
            <a href="https://wa.me/18096942268?text=Hola%2C%20quiero%20comprar%20lentes%20de%20contacto%20en%20RD" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#20ba58] transition-colors text-sm">Comprar por WhatsApp</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
