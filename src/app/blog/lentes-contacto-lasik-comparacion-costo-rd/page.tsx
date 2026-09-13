export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'lentes-contacto-lasik-comparacion-costo-rd',
  title: 'Lentes de Contacto vs. LASIK: Comparación de Costo en RD',
  h1: 'Lentes de contacto vs. LASIK: ¿qué sale más a cuenta a largo plazo?',
  description: 'LASIK es un gasto único, lentes de contacto es un gasto recurrente — comparamos los números reales para que decidas con información, no con intuición.',
  publishedAt: '2026-09-10',
  readMinutes: 7,
  category: 'Guías',
  faq: [
    { q: '¿Cuánto cuesta LASIK en República Dominicana?', a: 'Según varias clínicas especializadas, el rango típico es de USD $600 a $3,000 por ojo, dependiendo de la clínica, la tecnología usada, y si incluye evaluaciones y seguimiento postoperatorio.' },
    { q: '¿Es mejor LASIK o lentes de contacto?', a: 'No hay una respuesta única — depende de tu presupuesto, tu graduación, tu tolerancia a cirugía, y si tu graduación aún puede estar cambiando (LASIK generalmente se recomienda después de que la graduación se estabiliza, usualmente después de los 21-25 años).' },
    { q: '¿ContactGo hace cirugías LASIK?', a: 'No — somos una tienda de lentes de contacto. Si buscas LASIK, necesitas un oftalmólogo especializado en cirugía refractiva. Podemos ayudarte con la parte de lentes de contacto mientras decides o mientras esperas tu cirugía.' },
  ],
  relatedSlugs: [
    'cuanto-cuesta-usar-lentes-contacto-al-ano-rd',
    'guia-principiantes-lentes-contacto-rd-2026',
    'como-leer-receta-optica-rd',
    'examen-visual-antes-de-comprar-lentes-contacto-rd',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'lentes de contacto vs lasik, costo lasik republica dominicana, lasik vs lentes de contacto precio',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Es una pregunta que muchos usuarios de lentes de contacto se hacen tarde o temprano: ¿vale la pena hacer LASIK de una vez, o seguir con lentes de contacto? Aquí comparamos los números reales, sin inclinar la balanza hacia ningún lado — la decisión es tuya, pero con información completa.</p>

      <h2>El costo de LASIK en República Dominicana</h2>
      <p>Según varias clínicas oftalmológicas que ofrecen el procedimiento en el país, el rango típico es de <strong>USD $600 a $3,000 por ojo</strong>, dependiendo de la clínica, la tecnología del láser, y si el paquete incluye evaluaciones preoperatorias y seguimiento postoperatorio. Es un gasto único — no se repite mes a mes.</p>

      <h2>El costo de lentes de contacto: un gasto recurrente</h2>
      <p>A diferencia de LASIK, los lentes de contacto son un gasto continuo — nunca “terminas de pagar”. Usando precios reales de nuestro catálogo, así se ve el costo anual aproximado, asumiendo la misma graduación en ambos ojos:</p>

      <table>
        <thead><tr><th>Modalidad</th><th>Costo anual aproximado</th></tr></thead>
        <tbody>
          <tr><td>Diario (PRECISION1)</td><td>~RD$73,000</td></tr>
          <tr><td>Quincenal (ACUVUE Oasys)</td><td>~RD$26,800</td></tr>
          <tr><td>Mensual (Biofinity)</td><td>~RD$14,600 + solución (~RD$3,900/año)</td></tr>
        </tbody>
      </table>

      <h2>Haciendo la cuenta simple</h2>
      <p>Si LASIK cuesta, por ejemplo, USD $1,500 por ojo (USD $3,000 los dos ojos, aproximadamente RD$180,000 al tipo de cambio actual), y usas lentes mensuales que te cuestan cerca de RD$18,500 al año (lente + solución), el punto de equilibrio estaría alrededor de los <strong>9-10 años</strong> de uso continuo. Si usas lentes diarios, el punto de equilibrio llega mucho antes — cerca de 2 años y medio.</p>

      <h2>Factores que van más allá del dinero</h2>
      <ul>
        <li><strong>Tu graduación debe estar estable</strong> — LASIK generalmente se recomienda cuando la graduación ya no está cambiando, típicamente después de los 21-25 años</li>
        <li><strong>No todos son candidatos</strong> — córneas muy delgadas, ciertas condiciones oculares, o graduaciones muy altas pueden descartar la cirugía; solo un oftalmólogo puede confirmarlo con una evaluación</li>
        <li><strong>LASIK no siempre elimina la necesidad de corrección</strong> — con la edad, la presbicia (vista cansada) puede aparecer de todas formas, incluso después de una cirugía exitosa</li>
        <li><strong>Los lentes de contacto ofrecen flexibilidad</strong> — puedes cambiar de marca, probar lentes de color, o simplemente parar si decides que ya no los necesitas, sin ningún procedimiento irreversible</li>
      </ul>

      <h2>Una opción intermedia: usar lentes de contacto mientras decides</h2>
      <p>Muchas personas usan lentes de contacto durante años mientras ahorran para LASIK o mientras esperan que su graduación se estabilice lo suficiente para calificar. No es una decisión de “uno u otro” que tengas que tomar hoy.</p>

      <p>Nosotros no hacemos cirugías — somos tu opción para lentes de contacto mientras decides, o de forma permanente si esa es tu preferencia. Si tienes dudas sobre tu graduación actual, escríbenos por WhatsApp al <strong>(809) 694-2268</strong>.</p>
    </BlogArticle>
  )
}
