export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'lentes-toricos-multifocales-presbicia-astigmatismo-rd',
  title: 'Lentes Tórico-Multifocales: Astigmatismo + Presbicia — RD 2026',
  h1: 'Tienes astigmatismo Y presbicia a la vez: así funcionan los lentes tórico-multifocales',
  description: 'Si necesitas corregir astigmatismo y presbicia al mismo tiempo, existen lentes que hacen ambas cosas en un solo lente. Te explicamos cómo funcionan y qué opciones hay en RD.',
  publishedAt: '2026-08-19',
  readMinutes: 7,
  category: 'Guías',
  faq: [
    { q: '¿Es normal tener astigmatismo y presbicia al mismo tiempo?',
      a: 'Sí, es muy común — el astigmatismo es una condición estructural del ojo presente desde joven en muchos casos, y la presbicia aparece con la edad (generalmente después de los 40) independientemente de si ya tenías astigmatismo o no. Muchas personas mayores de 40 con astigmatismo previo necesitan corrección para ambas condiciones.' },
    { q: '¿Los lentes tórico-multifocales son más caros?',
      a: 'Sí, al combinar dos tecnologías de corrección en un mismo lente (estabilización para astigmatismo + zonas de graduación progresiva para presbicia), suelen costar más que un lente tórico simple o un multifocal simple por separado.' },
    { q: '¿Hay alternativas si no encuentro mi combinación exacta?',
      a: 'Sí — una opción es el sistema de "monovisión modificada", donde un ojo usa lente tórico normal (para lejos) y el otro un tórico con ligero ajuste para cerca. Esto lo evalúa un especialista según tu caso, ya que no todos se adaptan bien a esta técnica.' },
  ],
  relatedSlugs: [
    'lentes-de-contacto-para-astigmatismo-rd',
    'lentes-multifocales-presbicia-rd',
    'presbicia-despues-40-lentes-contacto-multifocales-vs-gafas',
    'proclear-multifocal-precio-republica-dominicana',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: {
    title: meta.h1, description: meta.description,
    url: `https://www.contactgo.net/blog/${meta.slug}`,
    type: 'article', locale: 'es_DO', siteName: 'ContactGo',
  },
  keywords: 'lentes toricos multifocales, astigmatismo y presbicia lentes contacto, lentes contacto para dos condiciones rd',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Si tienes más de 40 años, ya usabas lentes tóricos por astigmatismo, y de repente notas que también necesitas ayuda para ver de cerca — no estás confundido, es una combinación real y más común de lo que crees. Aquí te explicamos tus opciones.</p>

      <h2>¿Por qué pasa esto?</h2>

      <p>El astigmatismo es una irregularidad en la curvatura de la córnea o el cristalino, presente desde temprana edad en la mayoría de casos. La presbicia, en cambio, es la pérdida gradual de la capacidad de enfocar objetos cercanos, causada por el endurecimiento natural del cristalino con la edad — aparece típicamente después de los 40 años, <strong>sin importar si ya tenías astigmatismo o no</strong>.</p>

      <p>Es decir: si tenías astigmatismo a los 25, es muy probable que a los 45 tengas astigmatismo <em>y</em> presbicia al mismo tiempo. No es que "empeoró" tu condición — son dos cosas distintas que coexisten.</p>

      <h2>¿Cómo funcionan los lentes tórico-multifocales?</h2>

      <p>Son lentes que combinan dos tecnologías en un solo diseño:</p>

      <ul>
        <li><strong>Estabilización tórica:</strong> el lente tiene un diseño especial (más grueso en ciertas zonas) que evita que rote sobre el ojo, manteniendo el eje de corrección del astigmatismo alineado correctamente.</li>
        <li><strong>Zonas multifocales:</strong> dentro del mismo lente, existen distintas zonas de graduación — una para visión de lejos, otra para visión de cerca, y una transición intermedia — de forma similar a como funciona un lente multifocal simple.</li>
      </ul>

      <p>El resultado es un lente que corrige ambas condiciones simultáneamente, sin necesidad de alternar entre dos pares distintos.</p>

      <h2>¿Qué opciones existen en el catálogo de ContactGo?</h2>

      <p>Uno de nuestros productos más completos para este caso es <strong>Proclear® Multifocal Toric</strong> de CooperVision — diseñado específicamente para quienes necesitan ambas correcciones en un solo lente mensual. Es un producto más especializado, por lo que su disponibilidad y precio reflejan esa complejidad de fabricación.</p>

      <p>Si tu combinación específica de astigmatismo y presbicia no está disponible directamente en nuestro catálogo estándar, contáctanos por WhatsApp — a veces existen alternativas o pedidos especiales según tu receta exacta.</p>

      <h2>Alternativas si un tórico-multifocal no es la opción ideal para ti</h2>

      <h3>Monovisión modificada</h3>
      <p>Una técnica donde un ojo usa un lente tórico enfocado principalmente para distancia, y el otro ojo usa un lente tórico con ligero ajuste para visión cercana. El cerebro aprende a usar la información de ambos ojos de forma combinada. No todas las personas se adaptan bien a esta técnica — debe evaluarla un especialista.</p>

      <h3>Gafas para complementar</h3>
      <p>Algunas personas optan por usar lentes de contacto tóricos normales (solo para el astigmatismo) y gafas de lectura por encima para las tareas de cerca — una solución más económica aunque menos práctica en el día a día.</p>

      <h2>Lo que debes saber antes de decidir</h2>

      <p>La adaptación a un lente tórico-multifocal puede tomar un poco más de tiempo que un lente simple, ya que el cerebro necesita acostumbrarse a las distintas zonas de enfoque dentro del mismo lente. Ten paciencia durante las primeras semanas — es normal.</p>

      <p>Si tienes tu receta con ambos valores (astigmatismo + adición para presbicia), usa nuestra <Link href="/receta">calculadora gratuita</Link> para ver qué opciones califican, o escríbenos directo por WhatsApp al <strong>(809) 694-2268</strong> — te ayudamos a encontrar la combinación correcta para tu caso específico.</p>
    </BlogArticle>
  )
}
