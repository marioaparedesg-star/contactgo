import type { Metadata } from 'next'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Aviso Legal — ContactGo',
  description: 'Información general, titularidad del nombre comercial y canales de contacto de ContactGo.',
  alternates: { canonical: 'https://www.contactgo.net/aviso-legal' },
}

export default function AvisoLegalPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="max-w-2xl mx-auto px-4 py-12 pb-24">
        <div className="mb-4"><Link href="/" className="text-sm text-primary-600 font-semibold">← Inicio</Link></div>
        <h1 className="cg-page-title text-gray-900 mb-2">Aviso Legal</h1>
        <p className="text-gray-400 text-sm mb-8">Última actualización: 19 de noviembre de 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-gray-600">
          <section>
            <h2 className="font-bold text-gray-900 text-base mb-2">1. Identificación del sitio</h2>
            <p>Este sitio web, disponible en contactgo.net, es operado bajo el nombre comercial ContactGo, registrado ante la Oficina Nacional de la Propiedad Industrial (ONAPI), registro núm. 944205. Esta identificación comercial no sustituye los datos de identificación fiscal o societaria que deban figurar en los documentos correspondientes.</p>
          </section>
          <section>
            <h2 className="font-bold text-gray-900 text-base mb-2">2. Contacto</h2>
            <p>Para consultas relacionadas con el sitio, productos, pedidos o privacidad, puedes comunicarte por correo electrónico a <a className="text-primary-600 underline" href="mailto:info@contactgo.net">info@contactgo.net</a> o por WhatsApp al <a className="text-primary-600 underline" href="https://wa.me/18096942268" target="_blank" rel="noopener noreferrer">(809) 694-2268</a>.</p>
          </section>
          <section>
            <h2 className="font-bold text-gray-900 text-base mb-2">3. Propiedad intelectual</h2>
            <p>El nombre comercial, identidad gráfica, diseño, textos y demás contenidos propios del sitio están protegidos por las normas aplicables de propiedad intelectual e industrial. Las marcas de fabricantes que aparecen en el catálogo pertenecen a sus respectivos titulares y se utilizan únicamente para identificar los productos ofrecidos.</p>
          </section>
          <section>
            <h2 className="font-bold text-gray-900 text-base mb-2">4. Naturaleza del servicio</h2>
            <p>ContactGo es un canal de comercio electrónico especializado en lentes de contacto y productos relacionados. La información del sitio tiene fines comerciales e informativos y no reemplaza la evaluación, diagnóstico ni indicación de un profesional de la salud visual.</p>
          </section>
          <section>
            <h2 className="font-bold text-gray-900 text-base mb-2">5. Documentos relacionados</h2>
            <p>El uso del sitio y el tratamiento de datos se rigen también por nuestros <Link className="text-primary-600 underline" href="/terminos">Términos y Condiciones</Link> y la <Link className="text-primary-600 underline" href="/privacidad">Política de Privacidad</Link>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
