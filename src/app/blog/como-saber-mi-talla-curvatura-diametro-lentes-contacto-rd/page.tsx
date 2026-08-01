export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'como-saber-mi-talla-curvatura-diametro-lentes-contacto-rd',
  title: 'Cómo Saber tu Curvatura y Diámetro de Lentes de Contacto',
  h1: 'Curvatura base (BC) y diámetro (DIA): la "talla" de tus lentes de contacto',
  description: 'Explicación simple de qué son la curvatura base y el diámetro en tu receta de lentes de contacto, por qué importan, y qué hacer si no los tienes.',
  publishedAt: '2026-08-01',
  readMinutes: 6,
  category: 'Guías',
  faq: [
    { q: '¿Qué es la curvatura base (BC) de un lente de contacto?',
      a: 'Es una medida en milímetros que indica qué tan curvo es el lente, y debe coincidir aproximadamente con la curvatura natural de tu córnea. Valores típicos van de 8.3 a 8.9. Un lente con curvatura incorrecta puede quedar muy suelto (se mueve demasiado) o muy apretado (incómodo, reduce oxígeno).' },
    { q: '¿Qué es el diámetro (DIA) de un lente de contacto?',
      a: 'Es el tamaño total del lente medido en milímetros, generalmente entre 13.8 y 14.5mm. Determina cuánto cubre el lente sobre tu córnea y esclera (parte blanca del ojo). Cada marca tiene un diámetro específico fijo — no es algo que elijas, viene predeterminado por el fabricante.' },
    { q: '¿Puedo usar cualquier lente sin saber mi curvatura y diámetro exactos?',
      a: 'La mayoría de marcas fabrican con valores estándar (BC 8.6, DIA 14.2 son de los más comunes) que se ajustan bien a la mayoría de córneas. Si nunca has usado lentes de contacto, es recomendable hacer una adaptación con un óptico que mida tu córnea exacta antes de tu primera compra.' },
  ],
  relatedSlugs: ['como-leer-tu-receta', 'como-leer-receta-optica-rd', 'guia-principiantes-lentes-contacto-rd-2026'],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'curvatura base diametro lentes contacto, BC DIA lentes de contacto que significa, talla lentes contacto RD',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Tu receta de gafas te da la graduación (SPH, y si aplica CYL/AXIS), pero para lentes de contacto necesitas dos datos adicionales que mucha gente no conoce: la <strong>curvatura base (BC)</strong> y el <strong>diámetro (DIA)</strong>. Piénsalo como "la talla" de tu lente — sin esto correcto, el producto no calza bien sin importar que la graduación sea perfecta.</p>

      <h2>¿Qué es la curvatura base (BC)?</h2>
      <p>Es una medida en milímetros de qué tan curvo debe ser el lente para adaptarse a la curva natural de tu córnea. Valores típicos van de <strong>8.3 a 8.9</strong> — mientras más bajo el número, más curvado es el lente.</p>

      <p>¿Por qué importa? Un lente con curvatura incorrecta puede:</p>
      <ul>
        <li><strong>Muy plano para tu ojo (BC alto):</strong> se mueve demasiado, se siente suelto, puede incluso salirse fácilmente</li>
        <li><strong>Muy curvo para tu ojo (BC bajo):</strong> queda muy apretado, reduce el paso de oxígeno a la córnea, causa molestia e irritación</li>
      </ul>

      <h2>¿Qué es el diámetro (DIA)?</h2>
      <p>Es el tamaño total del lente, medido en milímetros de borde a borde, generalmente entre <strong>13.8 y 14.5mm</strong>. Determina cuánto cubre el lente sobre tu córnea y la parte blanca del ojo (esclera) que la rodea.</p>

      <p>A diferencia de la curvatura (que varía según tu ojo), el diámetro suele ser <strong>un valor fijo por marca</strong> — no es algo que tú "elijas" como si fuera una talla de ropa, viene predeterminado en el diseño del producto.</p>

      <h2>¿Dónde consigo estos valores?</h2>
      <p>Tres formas:</p>
      <ol>
        <li><strong>En tu receta de lentes de contacto</strong> (no la de gafas) — si ya tuviste una "adaptación" formal con un óptico, estos valores aparecen ahí.</li>
        <li><strong>En la caja de tu marca actual</strong> — si ya usas lentes de contacto, revisa el empaque; el BC y DIA están impresos.</li>
        <li><strong>Con una consulta de adaptación</strong> — si nunca has usado lentes de contacto, un óptico mide tu córnea con un instrumento (queratómetro o topógrafo) y te da los valores exactos.</li>
      </ol>

      <h2>¿Qué pasa si solo tengo mi receta de gafas?</h2>
      <p>La mayoría de marcas fabrican con valores estándar que se ajustan bien a la mayoría de las córneas — los más comunes son <strong>BC 8.6 y DIA 14.2</strong>. Si es tu primera vez usando lentes de contacto, empezar con estos valores estándar suele funcionar, pero:</p>
      <ul>
        <li>Si sientes molestia constante después de la adaptación normal (2-3 semanas), puede ser que tu córnea necesite un valor diferente</li>
        <li>Si tienes una córnea con forma particular (muy plana, muy curva, o irregular), es mejor hacer la medición formal antes de comprar</li>
      </ul>

      <h2>¿Cambia el BC/DIA entre marcas diferentes?</h2>
      <p>Sí, cada marca tiene su propio diseño con valores específicos. Por ejemplo:</p>
      <ul>
        <li>Biofinity: BC 8.6, DIA 14.0</li>
        <li>ACUVUE Oasys: BC 8.4 u 8.8 (según versión), DIA 14.0</li>
        <li>Air Optix: BC 8.6, DIA 14.2</li>
      </ul>
      <p>Por eso, si cambias de marca, aunque tu graduación (SPH) sea exactamente la misma, el ajuste puede sentirse ligeramente diferente al principio — es normal, tu ojo se adapta en pocos días.</p>

      <h2>¿Necesito preocuparme por esto en cada compra?</h2>
      <p>No, una vez que sabes qué marca y BC/DIA funcionan bien para tu ojo, simplemente repites la misma combinación en tus compras futuras. Solo necesitas prestar atención a esto en tu primera compra de una marca nueva, o si cambias de tipo de lente (por ejemplo, de esférico a tórico).</p>

      <p>Si tienes dudas sobre qué valores usar en tu primer pedido, escríbenos por WhatsApp al <strong>(809) 694-2268</strong> con la información que tengas de tu receta, y te orientamos. También puedes usar nuestra <Link href="/receta">calculadora</Link> que sugiere productos según tu graduación.</p>
    </BlogArticle>
  )
}
