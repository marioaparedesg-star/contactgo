export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'descuento-cliente-recurrente',
  title: '¿ContactGo Tiene Descuentos para Clientes Recurrentes?',
  h1: 'Descuentos para clientes recurrentes en ContactGo',
  description: 'Si ya has comprado antes, esto es lo que existe realmente en cuanto a descuentos y beneficios por seguir comprando con nosotros.',
  publishedAt: '2026-09-17',
  readMinutes: 4,
  category: 'Guías',
  faq: [
    { q: '¿La suscripción de recompra automática tiene descuento?', a: 'Sí — normalmente incluye un descuento sobre el precio de catálogo por comprometerte a la recompra automática, visible en el checkout al activarla.' },
    { q: '¿Hay cupones específicos para clientes que ya compraron antes?', a: 'Ocasionalmente se envían promociones a la base de clientes existente — la mejor forma de enterarte es estar atento a WhatsApp o correo, ya que no es un descuento fijo permanente.' },
    { q: '¿Comprar más cajas de una vez me da mejor precio?', a: 'El precio por caja no cambia según la cantidad en el mismo pedido — lo que sí ahorra dinero es la suscripción automática por su descuento propio.' },
  ],
  relatedSlugs: [
    'suscripcion-mensual-lentes-contacto-como-funciona-rd',
    'como-cancelar-pausar-suscripcion-contactgo',
    'cuanto-cuesta-usar-lentes-contacto-al-ano-rd',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'descuento cliente recurrente contactgo, cupon lentes de contacto republica dominicana, descuento suscripcion lentes de contacto',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Si ya compraste con nosotros antes y te preguntas si existe algún beneficio por seguir siendo cliente, aquí la respuesta honesta y directa — sin inventar promociones que no existen.</p>

      <h2>El beneficio real y permanente: la suscripción de recompra</h2>
      <p>La forma más consistente de pagar menos con el tiempo es activar la <Link href="/cuenta">suscripción de recompra automática</Link> — normalmente trae un descuento sobre el precio de catálogo, visible directamente en el checkout cuando la activas, además de ahorrarte el trabajo de acordarte de reordenar cada vez.</p>

      <h2>Sobre cupones y promociones puntuales</h2>
      <p>De vez en cuando se envían promociones a la base de clientes existente — por WhatsApp o correo — pero no es un descuento fijo que puedas asumir que siempre está disponible. Si te interesa no perderte estas promociones, mantén tu número de WhatsApp y correo actualizados en tu cuenta.</p>

      <h2>¿Comprar en volumen da mejor precio?</h2>
      <p>El precio por caja individual no cambia si compras 2, 3 o más cajas en el mismo pedido — no hay un descuento automático por volumen fuera de la suscripción. Si tu necesidad es simplemente asegurar suministro para varios meses, la suscripción sigue siendo la opción más económica en el tiempo.</p>

      <h2>Si tienes un código de descuento</h2>
      <p>Si recibiste un código específico (por WhatsApp, redes sociales, o de un representante), aplícalo directamente en el checkout — el sistema valida automáticamente si sigue vigente.</p>

      <p>¿Tienes dudas sobre algún descuento específico que viste o te ofrecieron? Escríbenos por WhatsApp al <strong>(809) 694-2268</strong> para confirmarlo antes de tu próxima compra.</p>
    </BlogArticle>
  )
}
