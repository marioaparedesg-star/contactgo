export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'se-me-salio-perdio-un-lente-de-contacto-que-hacer',
  title: 'Se Me Salió o Perdió un Lente de Contacto: Qué Hacer (Guía RD)',
  h1: 'Se me salió o perdí un lente de contacto: qué hacer paso a paso',
  description: 'Desde que se te doble en el ojo hasta que sientas que "se perdió" adentro (no es posible) — guía práctica para no entrar en pánico y actuar bien.',
  publishedAt: '2026-09-04',
  readMinutes: 6,
  category: 'Cuidado',
  faq: [
    { q: '¿Un lente de contacto se puede perder detrás del ojo?',
      a: 'No — es físicamente imposible. Una membrana llamada conjuntiva conecta el párpado con el globo ocular formando un saco cerrado, así que un lente nunca puede pasar "detrás" del ojo. Si sientes que no está, casi siempre se dobló y quedó pegado bajo el párpado superior.' },
    { q: '¿Qué hago si el lente se dobló dentro del ojo?',
      a: 'Cierra el ojo, masajea suavemente el párpado con el dedo limpio, y parpadea varias veces — casi siempre el lente se desdobla y vuelve a su posición solo. Si no funciona, lubrica el ojo con gotas y repite.' },
    { q: '¿Cuándo debo ir a un oftalmólogo por esto?',
      a: 'Si después de 15-20 minutos no logras encontrar o reposicionar el lente, o si sientes dolor, visión borrosa persistente, o el ojo se pone muy rojo, consulta a un profesional de inmediato — no fuerces la situación.' },
  ],
  relatedSlugs: [
    'que-hacer-lente-contacto-roto-doblado-rasgado-rd',
    'sensacion-arenilla-irritacion-lentes-contacto-causas',
    'guia-principiantes-lentes-contacto-rd-2026',
    'como-usar-lentes-de-contacto-primera-vez',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'se me perdio un lente de contacto, se me salio el lente de contacto, lente de contacto doblado en el ojo',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Es uno de los sustos más comunes entre usuarios de lentes de contacto, especialmente al principio: sientes que el lente “desapareció” dentro del ojo y el pánico se activa. Respira — casi siempre tiene una explicación simple y una solución rápida.</p>

      <h2>Primero, un dato que te va a tranquilizar</h2>
      <p><strong>Es físicamente imposible que un lente de contacto se pierda “detrás” del ojo.</strong> Una membrana delgada (la conjuntiva) conecta el párpado con el globo ocular, formando un espacio cerrado — no hay ningún camino hacia atrás del ojo. Si el lente “desapareció”, está en alguno de estos tres lugares: doblado bajo el párpado, en la esquina del ojo, o simplemente se cayó y está en tu ropa, el lavamanos o el piso.</p>

      <h2>Paso a paso si sientes que el lente se dobló dentro del ojo</h2>
      <ol>
        <li><strong>Lávate las manos</strong> antes de tocarte el ojo, siempre.</li>
        <li><strong>Cierra el ojo y parpadea varias veces</strong> — muchas veces el lente se reacomoda solo con el movimiento natural del párpado.</li>
        <li><strong>Masajea suavemente el párpado</strong> (con el ojo cerrado) desde la esquina externa hacia el centro — esto ayuda a que un lente doblado se desenrolle.</li>
        <li><strong>Aplica gotas lubricantes</strong> si tienes — la humedad extra facilita que el lente se mueva a su posición natural.</li>
        <li><strong>Revisa bajo el párpado superior</strong> jalándolo suavemente hacia arriba y hacia afuera mientras miras hacia abajo, frente a un espejo.</li>
      </ol>

      <h2>Si el lente ya se salió del ojo</h2>
      <ul>
        <li>No lo reutilices sin limpiarlo primero con solución (si es un lente mensual o quincenal)</li>
        <li>Si es un lente diario, deséchalo y usa uno nuevo — no vale la pena arriesgar una infección por reutilizar un diario</li>
        <li>Si se rasgó o dobló de forma permanente, no intentes “enderezarlo” — deséchalo</li>
      </ul>

      <h2>Señales de que debes buscar ayuda profesional</h2>
      <p>Si después de 15-20 minutos siguiendo estos pasos no logras localizar o reposicionar el lente, o si notas <strong>dolor, visión borrosa que no mejora, o enrojecimiento fuerte</strong>, deja de intentarlo por tu cuenta y consulta con un oftalmólogo. No es común, pero es la señal de que algo necesita revisión profesional.</p>

      <h2>Cómo evitar que vuelva a pasar</h2>
      <p>Frotarte los ojos con fuerza, dormir con lentes puestos (si no son de uso extendido), o insertarlos con las manos húmedas de más son las causas más comunes de que un lente se doble o se salga. Un buen hábito de inserción y retiro reduce mucho este tipo de sustos.</p>

      <p>¿Sigues con dudas o necesitas reponer el lente que se dañó? Escríbenos por WhatsApp al <strong>(809) 694-2268</strong> o revisa nuestra <Link href="/receta">calculadora</Link> para encontrar tu marca exacta.</p>
    </BlogArticle>
  )
}
