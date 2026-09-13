export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'cuanto-cuesta-usar-lentes-contacto-al-ano-rd',
  title: 'Cuánto Cuesta Usar Lentes de Contacto al Año en RD (Cálculo Real)',
  h1: 'Cuánto cuesta usar lentes de contacto al año — el cálculo real',
  description: 'Diario, quincenal o mensual: te mostramos el costo anual real de cada modalidad con precios actuales, para que compares antes de elegir.',
  publishedAt: '2026-09-10',
  readMinutes: 6,
  category: 'Guías',
  faq: [
    { q: '¿Qué modalidad es más económica al año?', a: 'Mensual suele ser la más económica en costo por año, seguida de quincenal. Diario es la más cómoda pero también la de mayor costo anual, ya que cada lente se usa una sola vez.' },
    { q: '¿El cálculo cambia si tengo astigmatismo o presbicia?', a: 'Sí — los lentes tóricos (astigmatismo) y multifocales (presbicia) cuestan más por caja que los esféricos estándar, así que el costo anual sube proporcionalmente.' },
    { q: '¿Debo sumar el costo de la solución?', a: 'Sí, si usas lentes quincenales o mensuales — una botella de solución multipropósito (~RD$650) suele durar 3-4 semanas de uso diario.' },
  ],
  relatedSlugs: [
    'lentes-contacto-lasik-comparacion-costo-rd',
    'lentes-diarios-vs-mensuales',
    'guia-marcas-lentes-contacto-republica-dominicana-cual-elegir',
    'solucion-limpieza-lentes-contacto',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'cuanto cuesta usar lentes de contacto, costo anual lentes de contacto republica dominicana, precio lentes de contacto al año',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Uno de los factores que más influye al elegir entre lentes diarios, quincenales o mensuales es el costo — pero pocas veces se compara el gasto real a lo largo de un año completo. Aquí el cálculo, con precios actuales de catálogo.</p>

      <h2>El supuesto de este cálculo</h2>
      <p>Todos los números asumen la <strong>misma graduación en ambos ojos</strong> (el caso más común), uso diario continuo, y un producto de gama media de cada modalidad. Si tu caso es distinto (graduación diferente por ojo, uso ocasional), el número real puede variar.</p>

      <h2>Diario — PRECISION1 (RD$3,000 por caja de 30)</h2>
      <p>Con la misma graduación en ambos ojos, una caja de 30 lentes se reparte entre los dos ojos y dura 15 días. Necesitas aproximadamente 24 cajas al año.</p>
      <p><strong>Costo anual: ~RD$73,000</strong> — sin necesidad de solución ni estuche.</p>

      <h2>Quincenal — ACUVUE Oasys (RD$3,350 por caja de 6)</h2>
      <p>Una caja de 6 lentes, repartida entre ambos ojos con la misma graduación, dura 6 semanas (1.5 meses). Necesitas aproximadamente 8 cajas al año.</p>
      <p><strong>Costo anual: ~RD$26,800</strong> + solución multipropósito (~RD$7,800/año en 12 botellas) = <strong>~RD$34,600 total</strong></p>

      <h2>Mensual — Biofinity (RD$3,650 por caja de 6)</h2>
      <p>Una caja de 6 lentes, repartida entre ambos ojos con la misma graduación, dura 3 meses. Necesitas aproximadamente 4 cajas al año.</p>
      <p><strong>Costo anual: ~RD$14,600</strong> + solución multipropósito (~RD$7,800/año) = <strong>~RD$22,400 total</strong></p>

      <h2>Resumen comparativo</h2>
      <table>
        <thead><tr><th>Modalidad</th><th>Costo anual (lente + solución)</th></tr></thead>
        <tbody>
          <tr><td>Diario</td><td>~RD$73,000</td></tr>
          <tr><td>Quincenal</td><td>~RD$34,600</td></tr>
          <tr><td>Mensual</td><td>~RD$22,400</td></tr>
        </tbody>
      </table>

      <h2>¿Por qué elegir diario si es más caro?</h2>
      <p>El costo no es el único factor. Los lentes diarios eliminan por completo la necesidad de limpieza y almacenamiento, reducen el riesgo de acumulación de depósitos, y son ideales para uso ocasional (no pagas por días que no usas el lente, algo que sí ocurre con mensuales y quincenales si te saltas días).</p>

      <h2>Si tienes astigmatismo o presbicia</h2>
      <p>Los lentes tóricos y multifocales cuestan más por caja que los esféricos estándar — el costo anual sube proporcionalmente, pero el mismo principio de cálculo (cajas necesarias × precio) aplica igual.</p>

      <h2>Cómo reducir el costo sin cambiar de modalidad</h2>
      <p>Una <Link href="/cuenta">suscripción de recompra automática</Link> con ContactGo suele incluir un descuento sobre el precio de catálogo, además de ahorrarte el trabajo de acordarte de reordenar cada vez.</p>

      <p>¿Quieres que te ayudemos a calcular tu costo exacto según tu graduación y marca preferida? Escríbenos por WhatsApp al <strong>(809) 694-2268</strong>.</p>
    </BlogArticle>
  )
}
