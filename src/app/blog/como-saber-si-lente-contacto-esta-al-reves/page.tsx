export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'como-saber-si-lente-contacto-esta-al-reves',
  title: 'Cómo Saber si un Lente de Contacto Está al Revés (Guía Rápida)',
  h1: 'Cómo saber si tu lente de contacto está al revés',
  description: 'La prueba del "tazón" y otras señales para identificar en segundos si tu lente está bien orientado antes de ponértelo.',
  publishedAt: '2026-09-04',
  readMinutes: 5,
  category: 'Cuidado',
  faq: [
    { q: '¿Es peligroso ponerse un lente al revés?',
      a: 'No es peligroso para la salud, pero sí es incómodo — el lente no se adhiere bien a la córnea, se siente raro, puede moverse demasiado y a veces se sale solo. No corrige la visión correctamente mientras está mal puesto.' },
    { q: '¿Cómo sé si ya me lo puse al revés?',
      a: 'Si sientes molestia inusual, el lente se siente "suelto" o se desliza, o notas visión borrosa que no mejora al parpadear, es buena señal de que está al revés. Retíralo, verifica con la prueba del tazón, y vuelve a intentar.' },
    { q: '¿Los lentes diarios también pueden ponerse al revés?',
      a: 'Sí, la orientación aplica a cualquier lente blando, sin importar si es diario, quincenal o mensual.' },
  ],
  relatedSlugs: [
    'como-usar-lentes-de-contacto-primera-vez',
    'guia-principiantes-lentes-contacto-rd-2026',
    'se-me-salio-perdio-un-lente-de-contacto-que-hacer',
    'sensacion-arenilla-irritacion-lentes-contacto-causas',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'lente de contacto al reves, como saber si el lente esta al reves, prueba del tazon lentes contacto',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Le pasa hasta a quienes llevan años usando lentes de contacto: agarras el lente, no estás 100% seguro de cómo va orientado, y te preguntas si está bien. Aquí tienes la prueba más rápida y confiable para saberlo en segundos.</p>

      <h2>La prueba del “tazón” (la más fácil)</h2>
      <p>Coloca el lente sobre la punta de tu dedo índice limpio y obsérvalo de perfil, a la altura de los ojos, con buena luz:</p>
      <ul>
        <li>✅ <strong>Bien orientado:</strong> forma un tazón perfecto, como una “U” — los bordes suben hacia arriba de forma uniforme y suave.</li>
        <li>❌ <strong>Al revés:</strong> los bordes se abren hacia afuera, como un plato — parece que tiene un pequeño “labio” que sobresale hacia los lados, o la forma general se ve más aplanada.</li>
      </ul>

      <h2>Otras señales útiles</h2>
      <p>Si tu lente tiene marcas de fabricante impresas (algunas marcas incluyen un número o logo diminuto en el borde), esas marcas deben leerse correctamente de frente cuando el lente está bien orientado — si se ven “espejeadas” o invertidas, está al revés.</p>

      <h2>¿Qué pasa si te lo pones al revés sin darte cuenta?</h2>
      <p>No es peligroso, pero se siente distinto de inmediato:</p>
      <ul>
        <li>Sensación de cuerpo extraño más marcada de lo normal</li>
        <li>El lente se siente “flojo” o se mueve demasiado al parpadear</li>
        <li>Visión ligeramente borrosa que no mejora aunque parpadees varias veces</li>
        <li>En algunos casos, el lente se sale solo en los primeros minutos</li>
      </ul>
      <p>Si notas cualquiera de estas señales apenas te lo pones, retíralo, haz la prueba del tazón, y vuelve a colocarlo.</p>

      <h2>Un truco para principiantes</h2>
      <p>Mientras te acostumbras a identificarlo a simple vista, revisa el lente CADA VEZ antes de ponértelo — no asumas que “seguro está bien” solo porque lo sacaste directo del blíster. Con la práctica, tu ojo entrenado hace esta verificación en 2 segundos sin pensarlo.</p>

      <p>¿Es tu primera vez usando lentes de contacto y tienes más dudas del proceso? Escríbenos por WhatsApp al <strong>(809) 694-2268</strong> — te ayudamos sin costo.</p>
    </BlogArticle>
  )
}
