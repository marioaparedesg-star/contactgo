export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'primer-pedido-que-esperar-rd',
  title: 'Tu Primer Pedido con ContactGo: Qué Esperar Paso a Paso',
  h1: 'Tu primer pedido con ContactGo: qué esperar paso a paso',
  description: 'Desde que pagas hasta que recibes tus lentes en la puerta — el proceso completo, tiempos reales y qué notificaciones vas a recibir.',
  publishedAt: '2026-09-17',
  readMinutes: 5,
  category: 'Guías',
  faq: [
    { q: '¿Cuánto tarda en llegar mi primer pedido?', a: '24 horas en Santo Domingo, 24-48 horas en Santiago, 2-3 días en Punta Cana/Bávaro/La Romana, y 2-4 días en el resto del país.' },
    { q: '¿Recibo alguna confirmación después de pagar?', a: 'Sí — notificación automática por WhatsApp y correo apenas se procesa el pago, y luego actualizaciones en cada cambio de estado hasta la entrega.' },
    { q: '¿Necesito estar en casa para recibirlo?', a: 'Depende de la empresa de envío asignada — normalmente coordinan contigo directamente por teléfono antes de la entrega.' },
  ],
  relatedSlugs: [
    'guia-principiantes-lentes-contacto-rd-2026',
    'como-leer-receta-optica-rd',
    'farmacia-vs-optica-vs-online-lentes-contacto-rd',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'primer pedido contactgo, como comprar en contactgo, proceso de compra lentes de contacto rd',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Si es tu primera vez comprando con nosotros, aquí el proceso completo, paso a paso, para que sepas exactamente qué esperar desde que pagas hasta que tus lentes llegan a tu puerta.</p>

      <h2>Paso 1: Selección de producto y graduación</h2>
      <p>En la página de cada producto, ingresas tu graduación (esfera, y cilindro/eje si tienes astigmatismo). Si no estás seguro de cómo leer tu receta, revisa nuestra <Link href="/blog/como-leer-receta-optica-rd">guía de cómo leer tu receta óptica</Link>.</p>

      <h2>Paso 2: Checkout y pago</h2>
      <p>Ingresas tus datos de entrega y pagas con tarjeta (Visa o Mastercard) a través de AZUL, el procesador del Banco Popular, con tecnología 3D Secure. No almacenamos datos de tu tarjeta — todo el procesamiento es seguro del lado del banco.</p>

      <h2>Paso 3: Confirmación inmediata</h2>
      <p>Apenas se procesa el pago, recibes una confirmación automática por WhatsApp y correo con el número de tu pedido.</p>

      <h2>Paso 4: Preparación y envío</h2>
      <p>Tu pedido pasa por varias etapas internas (recibido, pago aprobado, preparando) y recibes actualizaciones automáticas en cada cambio de estado — no tienes que estar preguntando por WhatsApp para saber dónde va tu pedido.</p>

      <h2>Paso 5: Entrega</h2>
      <table>
        <thead><tr><th>Zona</th><th>Tiempo estimado</th></tr></thead>
        <tbody>
          <tr><td>Santo Domingo (todas las zonas)</td><td>24 horas</td></tr>
          <tr><td>Santiago</td><td>24-48 horas</td></tr>
          <tr><td>Punta Cana / Bávaro / La Romana</td><td>2-3 días</td></tr>
          <tr><td>Resto del país</td><td>2-4 días</td></tr>
        </tbody>
      </table>
      <p>La empresa de envío suele coordinar contigo directamente por teléfono antes de la entrega, así que ten tu número accesible los días siguientes a tu pedido.</p>

      <h2>Paso 6: Tu cuenta queda creada</h2>
      <p>Al completar tu pedido, automáticamente queda registrada tu cuenta en el sitio — puedes entrar a <Link href="/cuenta">tu cuenta</Link> para ver el historial, activar una suscripción de recompra, o hacer tu próximo pedido más rápido la próxima vez.</p>

      <h2>Si algo no llega como esperabas</h2>
      <p>Si tu graduación es muy alta o específica (rango extendido), puede requerir fabricación especial que toma 2-3 semanas adicionales — te lo confirmamos directamente si tu pedido cae en ese caso, para que no te tome por sorpresa.</p>

      <p>¿Tienes dudas antes de hacer tu primer pedido? Escríbenos por WhatsApp al <strong>(809) 694-2268</strong> — con gusto te orientamos antes de que compres.</p>
    </BlogArticle>
  )
}
