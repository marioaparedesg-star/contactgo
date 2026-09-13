export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'como-cancelar-pausar-suscripcion-contactgo',
  title: 'Cómo Cancelar o Pausar tu Suscripción de Recompra en ContactGo',
  h1: 'Cómo cancelar o pausar tu suscripción de recompra',
  description: 'Guía paso a paso para gestionar tu suscripción de lentes de contacto en ContactGo — cancelar, pausar temporalmente, o simplemente entender cómo funciona.',
  publishedAt: '2026-09-10',
  readMinutes: 4,
  category: 'Guías',
  faq: [
    { q: '¿Puedo pausar mi suscripción sin cancelarla por completo?', a: 'Al cancelar, el sistema te pregunta el motivo — una de las opciones es "solo quiero pausar temporalmente", lo cual queda registrado. Si luego quieres reactivarla, contáctanos por WhatsApp.' },
    { q: '¿Me cobran algo por cancelar?', a: 'No hay penalidad por cancelar. Si ya tienes un envío procesándose al momento de cancelar, ese envío se completa normalmente; los envíos futuros simplemente no se generan.' },
    { q: '¿Dónde veo mis suscripciones activas?', a: 'En tu cuenta de ContactGo (/cuenta), en la sección de suscripciones — ahí ves cada una con su producto, frecuencia, y próxima fecha de envío.' },
  ],
  relatedSlugs: [
    'suscripcion-mensual-lentes-contacto-como-funciona-rd',
    'guia-principiantes-lentes-contacto-rd-2026',
    'como-leer-receta-optica-rd',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'cancelar suscripcion contactgo, pausar suscripcion lentes de contacto, como cancelar recompra automatica',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Si tienes una suscripción de recompra automática con ContactGo y necesitas cancelarla, pausarla, o simplemente quieres entender cómo funciona, aquí el paso a paso completo.</p>

      <h2>Dónde encontrar tus suscripciones</h2>
      <p>Entra a <Link href="/cuenta">tu cuenta</Link> en ContactGo e inicia sesión con el mismo número o correo que usaste al comprar. En la sección de suscripciones verás cada una activa, con su producto, frecuencia de envío, y la fecha del próximo envío programado.</p>

      <h2>Cómo cancelar una suscripción</h2>
      <ol>
        <li>Entra a tu cuenta y ubica la suscripción que quieres cancelar</li>
        <li>Toca el botón <strong>“Cancelar suscripción”</strong></li>
        <li>El sistema te va a preguntar el motivo — puedes elegir entre varias opciones, incluyendo <strong>“solo quiero pausar temporalmente”</strong></li>
        <li>Confirma la cancelación</li>
      </ol>
      <p>No hay ninguna penalidad por cancelar. Si ya tenías un envío en proceso al momento de cancelar, ese pedido se completa con normalidad — solo los envíos futuros dejan de generarse.</p>

      <h2>¿Y si solo quiero pausar, no cancelar del todo?</h2>
      <p>Actualmente no existe un botón separado de “pausar” — el mecanismo es cancelar indicando que es temporal. Si más adelante quieres reactivar tu recompra automática con las mismas condiciones (mismo producto, misma receta), escríbenos por WhatsApp y lo configuramos de nuevo rápidamente, sin que tengas que rehacer todo el proceso desde cero.</p>

      <h2>Si quieres cambiar la frecuencia en vez de cancelar</h2>
      <p>Si el problema no es que quieras parar, sino que la frecuencia de envío no coincide con tu ritmo de uso real, contáctanos por WhatsApp antes de cancelar — muchas veces se puede ajustar la frecuencia sin necesidad de empezar una suscripción nueva.</p>

      <h2>Cuándo tiene sentido cancelar vs. simplemente dejar pasar un envío</h2>
      <p>Si sabes que vas a estar fuera del país o simplemente no necesitas el próximo envío, es más simple escribirnos para saltar ese envío específico que cancelar toda la suscripción — así no pierdes la configuración cuando quieras retomarla.</p>

      <p>¿Tienes dudas sobre tu suscripción específica? Escríbenos por WhatsApp al <strong>(809) 694-2268</strong> y te ayudamos directamente.</p>
    </BlogArticle>
  )
}
