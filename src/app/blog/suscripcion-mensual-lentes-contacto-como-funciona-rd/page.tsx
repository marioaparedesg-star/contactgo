export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'suscripcion-mensual-lentes-contacto-como-funciona-rd',
  title: 'Suscripción de Lentes de Contacto en RD: Cómo Funciona',
  h1: 'Suscripción de reposición automática de lentes de contacto en República Dominicana',
  description: 'Nunca más te quedes sin lentes de contacto. Cómo funciona la reposición automática cada 30, 90 o 180 días en ContactGo, sin compromisos ni sorpresas.',
  publishedAt: '2026-07-31',
  readMinutes: 6,
  category: 'Guías',
  faq: [
    { q: '¿La suscripción de lentes de contacto tiene descuento en RD?',
      a: 'En ContactGo la suscripción no aplica descuento adicional sobre el precio regular — su valor está en la conveniencia: te avisamos por WhatsApp antes de cada envío y puedes reordenar en un clic sin volver a escribir tu receta ni tus datos de entrega.' },
    { q: '¿Puedo cancelar la suscripción de lentes de contacto cuando quiera?',
      a: 'Sí. No hay contrato ni compromiso mínimo. Puedes pausar, cambiar la frecuencia o cancelar desde tu cuenta en cualquier momento antes de que se procese el siguiente envío.' },
    { q: '¿Qué frecuencias de reposición existen?',
      a: 'Tres opciones: cada 30 días (para quien usa lentes diarios o repone seguido), cada 90 días (el equilibrio ideal para la mayoría de usuarios mensuales) y cada 180 días (para quien prefiere reponer menos seguido y hacer pedidos más grandes).' },
    { q: '¿Me cobran automáticamente cada mes sin avisarme?',
      a: 'No. Antes de cada envío programado te llega un aviso por WhatsApp para que confirmes. Nada se cobra ni se envía sin que lo sepas con anticipación.' },
  ],
  relatedSlugs: ['cuanto-cuestan-lentes-contacto-rd', 'cuanto-dura-una-caja-de-lentes-de-contacto', 'comprar-lentes-contacto-online-republica-dominicana'],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'suscripcion lentes de contacto RD, reposicion automatica lentes contacto, no quedarme sin lentes de contacto',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Te ha pasado: se te acaba la caja de lentes un jueves por la noche y no tienes tiempo de pedir a nadie hasta el lunes. Terminas usando el mismo par 3-4 días de más, o peor, sacas del fondo del cajón un par vencido de hace meses.</p>

      <p>Para eso existe la <strong>reposición automática</strong>: programas tu frecuencia de compra una vez y ContactGo se encarga de recordarte y enviarte antes de que se te acaben.</p>

      <h2>¿Cómo funciona exactamente?</h2>
      <p>Al comprar cualquier lente de contacto en ContactGo, puedes activar la suscripción con 3 frecuencias posibles:</p>
      <ul>
        <li><strong>Cada 30 días</strong> — para quien usa lentes diarios o repone seguido. Te avisamos por WhatsApp antes de cada envío.</li>
        <li><strong>Cada 90 días</strong> — el equilibrio ideal para la mayoría de usuarios de lentes mensuales. Reordena en 1 clic sin tener que volver a escribir tu receta.</li>
        <li><strong>Cada 180 días</strong> — para quien prefiere hacer pedidos más grandes y espaciados. Nunca se te olvida reponer.</li>
      </ul>

      <p>El sistema calcula automáticamente cuál frecuencia le conviene a tu tipo específico de lente — no es lo mismo reponer un diario que un mensual, y ContactGo ajusta la sugerencia según el producto que compraste.</p>

      <h2>¿Qué pasa antes de cada envío?</h2>
      <p>Nunca te vamos a sorprender con un cargo o un paquete que no esperabas. El proceso es:</p>
      <ol>
        <li>Unos días antes de la fecha programada, te llega un aviso por WhatsApp.</li>
        <li>Confirmas que quieres el envío (o lo pausas/modificas si necesitas cambiar algo).</li>
        <li>Se procesa el pedido con tu receta y dirección ya guardadas — sin tener que repetir el proceso completo.</li>
        <li>Recibes en 24-48h como cualquier pedido regular.</li>
      </ol>

      <h2>¿Puedo cancelar cuando quiera?</h2>
      <p>Sí, sin letra pequeña. No hay contrato mínimo ni penalización. Puedes:</p>
      <ul>
        <li>Cambiar la frecuencia (de 30 a 90 días, por ejemplo)</li>
        <li>Pausar temporalmente (si vas a estar fuera del país o cambiaste de marca)</li>
        <li>Cancelar por completo desde tu cuenta en <Link href="/cuenta">Mi Cuenta</Link></li>
      </ul>

      <h2>¿Para quién tiene más sentido suscribirse?</h2>
      <ul>
        <li><strong>Usuarios de lentes diarios</strong> — se acaban rápido (cada 15-30 días) y es fácil perder la cuenta.</li>
        <li><strong>Personas con rutina ocupada</strong> — elimina el "se me olvidó pedir a tiempo".</li>
        <li><strong>Quien ya sabe exactamente qué producto usa</strong> — no tienes que volver a explicar tu receta cada vez.</li>
      </ul>

      <p>Si compras esporádicamente o estás probando diferentes marcas todavía, puedes seguir comprando normal sin suscripción — no es obligatoria en ningún caso.</p>

      <h2>Cómo activarla</h2>
      <p>Al momento de comprar en el <Link href="/catalogo">catálogo</Link>, verás la opción de frecuencia de reposición en la página del producto. Actívala con un clic. Si ya tienes un pedido reciente y quieres convertirlo en suscripción, escríbenos por WhatsApp al <strong>(809) 694-2268</strong> y te lo activamos manualmente.</p>
    </BlogArticle>
  )
}
