export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'lentes-contacto-los-alcarrizos-villa-mella-santo-domingo-oeste',
  title: 'Lentes de Contacto en Los Alcarrizos, Villa Mella y Santo Domingo Oeste',
  h1: 'Lentes de contacto en Los Alcarrizos, Villa Mella y Santo Domingo Oeste/Norte',
  description: 'Entrega de lentes de contacto en Los Alcarrizos, Villa Mella, Herrera, Pantoja y todo Santo Domingo Oeste y Norte. Pide en línea o por WhatsApp, recibe en tu puerta.',
  publishedAt: '2026-08-27',
  readMinutes: 5,
  category: 'Entrega',
  faq: [
    { q: '¿Entregan en Los Alcarrizos y Villa Mella?',
      a: 'Sí, entregamos en toda la zona metropolitana de Santo Domingo, incluyendo Los Alcarrizos, Villa Mella, Herrera, Pantoja y sectores aledaños — el tiempo de entrega suele ser de 24-48 horas.' },
    { q: '¿El precio de envío es distinto en estas zonas?',
      a: 'El costo de envío se calcula según tu dirección exacta en el checkout — no asumimos un precio fijo, se te muestra el costo real antes de confirmar tu pedido.' },
    { q: '¿Puedo pagar contra entrega en estas zonas?',
      a: 'Para compras por WhatsApp, en algunos casos se puede coordinar pago contra entrega o abono parcial — se evalúa caso por caso con nuestro equipo, no es automático.' },
  ],
  relatedSlugs: [
    'lentes-contacto-santo-domingo-provincia',
    'donde-comprar-lentes-contacto-santo-domingo',
    'lentes-contacto-distrito-nacional',
    'lentes-contacto-toda-republica-dominicana',
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
  keywords: 'lentes de contacto los alcarrizos, lentes de contacto villa mella, lentes de contacto santo domingo oeste, lentes de contacto herrera',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Vivir en <strong>Los Alcarrizos, Villa Mella, Herrera o Pantoja</strong> no debería significar menos opciones para conseguir tus lentes de contacto originales. Aquí te explicamos cómo comprar y recibirlos directo en tu casa, sin tener que cruzar toda la ciudad hasta una óptica.</p>

      <h2>Zonas que cubrimos en Santo Domingo Oeste y Norte</h2>
      <ul>
        <li><strong>Los Alcarrizos</strong></li>
        <li><strong>Villa Mella</strong></li>
        <li><strong>Herrera</strong></li>
        <li><strong>Pantoja</strong></li>
        <li><strong>Manoguayabo</strong></li>
        <li><strong>Sabana Perdida</strong></li>
      </ul>

      <h2>¿Por qué comprar en línea en vez de buscar una óptica local?</h2>

      <p>Muchas de estas zonas tienen menos ópticas especializadas cerca, comparado con el centro de la ciudad — lo que suele significar más tiempo de traslado o menos variedad de marcas disponibles. Comprando en línea, tienes acceso al mismo catálogo completo (ACUVUE, AIR OPTIX, Biofinity, Bausch+Lomb) que alguien en Piantini, con el mismo tiempo de entrega.</p>

      <h2>Cómo pedir desde estas zonas</h2>

      <ol>
        <li>Ve nuestro <Link href="/catalogo">catálogo completo</Link> o escríbenos tu graduación por WhatsApp</li>
        <li>Confirma tu dirección con puntos de referencia claros (esto ayuda mucho en zonas con nomenclatura menos exacta)</li>
        <li>Paga con tarjeta de forma segura, o coordina otra opción con nuestro equipo</li>
        <li>Recibe en 24-48h con seguimiento por WhatsApp</li>
      </ol>

      <h2>Un consejo práctico para tu primera compra</h2>

      <p>Si es tu primera vez pidiendo algo por delivery a tu dirección específica, incluye un punto de referencia conocido (una iglesia, un colmado, una plaza) además de la dirección formal — ayuda mucho a que la entrega llegue sin contratiempos, especialmente en sectores donde la numeración de casas puede ser menos estándar.</p>

      <p>¿Tienes tu receta lista? Usa nuestra <Link href="/receta">calculadora gratuita</Link>, o escríbenos directo por WhatsApp al <strong>(809) 694-2268</strong> y te ayudamos a armar tu pedido.</p>
    </BlogArticle>
  )
}
