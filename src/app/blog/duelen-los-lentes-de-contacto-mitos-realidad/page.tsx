export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'duelen-los-lentes-de-contacto-mitos-realidad',
  title: '¿Duelen los Lentes de Contacto? Mitos y Realidad — RD 2026',
  h1: '¿Duelen los lentes de contacto? La verdad, sin exagerar',
  description: 'Respondemos con honestidad si los lentes de contacto duelen, qué es normal sentir al principio, y cuándo una molestia sí es señal de alerta.',
  publishedAt: '2026-08-27',
  readMinutes: 5,
  category: 'Guías',
  faq: [
    { q: '¿Es normal sentir el lente los primeros días?',
      a: 'Sí, es completamente normal sentir una ligera conciencia del lente los primeros días, especialmente si nunca los has usado. No debería ser dolor — solo la sensación de "algo ahí". Suele desaparecer en pocos días de uso.' },
    { q: '¿Por qué me arden los ojos con lentes de contacto?',
      a: 'El ardor puede deberse a varias causas: lentes puestos al revés, manos no muy limpias al colocarlos, ojo seco, o una reacción a la solución de limpieza. Si persiste, quítatelos y consulta a un especialista.' },
    { q: '¿Cuándo debo preocuparme si me duelen los lentes de contacto?',
      a: 'Dolor real (no solo molestia), enrojecimiento intenso, visión borrosa repentina, o sensibilidad extrema a la luz son señales de que debes quitarte los lentes de inmediato y consultar a un oftalmólogo — no es normal y no debe ignorarse.' },
  ],
  relatedSlugs: [
    'como-usar-lentes-de-contacto-primera-vez',
    'sensacion-arenilla-irritacion-lentes-contacto-causas',
    'ojo-rojo-lentes-contacto-que-hacer',
    'guia-principiantes-lentes-contacto-rd-2026',
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
  keywords: 'duelen los lentes de contacto, lentes de contacto duelen, es normal sentir lentes de contacto, lentes de contacto molestia',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Es de las preguntas que más frenan a la gente antes de probar lentes de contacto por primera vez — y es válida. Aquí la respuesta honesta, sin minimizar ni exagerar.</p>

      <h2>La respuesta corta: no deberían doler</h2>

      <p>Un lente de contacto bien puesto, de la graduación correcta, <strong>no debe causar dolor</strong>. Si sientes dolor real (no solo la sensación de "algo ahí"), algo está mal — el lente puede estar al revés, mal colocado, o haber algo más que amerita revisión.</p>

      <h2>¿Qué es normal sentir, entonces?</h2>

      <p>Los primeros días, especialmente si nunca has usado lentes de contacto, es normal sentir una <strong>ligera conciencia</strong> del lente — casi como saber que está ahí, sin que sea molesto. Esto suele desaparecer conforme tu ojo se acostumbra, generalmente en pocos días.</p>

      <h2>Causas comunes de molestia (que no son "dolor normal")</h2>

      <ul>
        <li><strong>Lente al revés</strong> — un error común en principiantes, causa una sensación de irritación notoria</li>
        <li><strong>Manos no muy limpias</strong> al momento de colocarlo — puede introducir partículas pequeñas</li>
        <li><strong>Ojo seco</strong> — la sensación de arenilla es más común en ambientes con aire acondicionado constante o mucho tiempo frente a pantallas</li>
        <li><strong>Lente vencido o usado más tiempo del indicado</strong> — acumula depósitos que causan irritación</li>
        <li><strong>Reacción a la solución de limpieza</strong> — algunas personas son sensibles a ciertos ingredientes</li>
      </ul>

      <h2>Señales de que SÍ debes quitártelos y consultar</h2>

      <ul>
        <li>🔴 Dolor real, no solo molestia</li>
        <li>🔴 Enrojecimiento intenso del ojo</li>
        <li>🔴 Visión borrosa repentina</li>
        <li>🔴 Sensibilidad extrema a la luz</li>
        <li>🔴 Secreción o legañas inusuales</li>
      </ul>

      <p>Ante cualquiera de estas señales, quítate el lente de inmediato y consulta a un oftalmólogo — no es normal, y no debe ignorarse ni "aguantarse".</p>

      <h2>Cómo hacer que la adaptación sea más cómoda</h2>

      <ol>
        <li><strong>Empieza con lentes diarios</strong> si es tu primera vez — menos manipulación, menos riesgo de error</li>
        <li><strong>Practica la colocación con calma</strong>, sin apuro, idealmente con buena luz frente a un espejo</li>
        <li><strong>Lávate bien las manos</strong> siempre antes de tocar tus lentes</li>
        <li><strong>No te frotes los ojos</strong> los primeros minutos después de colocarlos</li>
        <li><strong>Dale tiempo</strong> — la mayoría de personas se adaptan completamente en menos de una semana</li>
      </ol>

      <h2>La conclusión honesta</h2>

      <p>Millones de personas usan lentes de contacto a diario sin ningún dolor — el miedo inicial es normal, pero no debería ser la razón para no probarlos. Con la graduación correcta y buena higiene, la experiencia debería ser cómoda desde los primeros días.</p>

      <p>Si es tu primera vez, revisa nuestra <Link href="/blog/como-usar-lentes-de-contacto-primera-vez">guía de primeros pasos</Link>, o escríbenos por WhatsApp al <strong>(809) 694-2268</strong> si tienes dudas específicas antes de empezar.</p>
    </BlogArticle>
  )
}
