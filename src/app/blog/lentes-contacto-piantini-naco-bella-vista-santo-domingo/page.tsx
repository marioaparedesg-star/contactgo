export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'lentes-contacto-piantini-naco-bella-vista-santo-domingo',
  title: 'Lentes de Contacto en Piantini, Naco y Bella Vista — Entrega 24h',
  h1: 'Lentes de contacto en Piantini, Naco y Bella Vista, Santo Domingo',
  description: 'Entrega de lentes de contacto en 24 horas en Piantini, Naco, Bella Vista, Evaristo Morales y Los Cacicazgos. Pide por WhatsApp o en línea, recíbelos en tu puerta.',
  publishedAt: '2026-08-27',
  readMinutes: 5,
  category: 'Entrega',
  faq: [
    { q: '¿Hacen entregas en Piantini el mismo día?',
      a: 'Sí — pedidos confirmados antes de las 3pm en zonas como Piantini, Naco y Bella Vista suelen salir el mismo día o llegar al siguiente, dependiendo del horario de corte del transportista.' },
    { q: '¿Necesito estar en casa para recibir el pedido?',
      a: 'Recomendamos que sí, o que alguien pueda recibirlo por ti — coordinamos contigo por WhatsApp la hora aproximada de entrega para que no se te complique.' },
    { q: '¿Cubren también las torres de oficinas en esta zona?',
      a: 'Sí, entregamos en edificios de oficinas y torres residenciales de toda esta zona — solo necesitamos el nombre del edificio y el piso/apartamento.' },
  ],
  relatedSlugs: [
    'lentes-contacto-distrito-nacional',
    'donde-comprar-lentes-contacto-santo-domingo',
    'lentes-contacto-santo-domingo-provincia',
    'contact-lenses-santo-domingo-delivery',
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
  keywords: 'lentes de contacto piantini, lentes de contacto naco, lentes de contacto bella vista, comprar lentes contacto santo domingo',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Si vives o trabajas en <strong>Piantini, Naco, Bella Vista, Evaristo Morales o Los Cacicazgos</strong>, estás en una de las zonas donde entregamos más rápido en todo Santo Domingo — son sectores céntricos, bien conectados, y parte de nuestra ruta diaria de entregas.</p>

      <h2>¿Por qué esta zona es tan rápida para entregas?</h2>

      <p>Piantini y sus alrededores concentran una alta densidad de torres residenciales y de oficinas en un área relativamente compacta — eso significa rutas de entrega eficientes, sin los tiempos largos de traslado que sí aplican a zonas más alejadas del Gran Santo Domingo.</p>

      <h2>Zonas específicas que cubrimos en esta entrega rápida</h2>
      <ul>
        <li><strong>Piantini</strong> — torres residenciales y corporativas</li>
        <li><strong>Naco</strong> — zona comercial y residencial</li>
        <li><strong>Bella Vista</strong> — incluyendo Bella Vista Mall y alrededores</li>
        <li><strong>Evaristo Morales</strong></li>
        <li><strong>Los Cacicazgos</strong></li>
        <li><strong>Gazcue</strong> y zona colonial cercana</li>
      </ul>

      <h2>Cómo funciona comprar desde aquí</h2>

      <ol>
        <li><strong>Elige tu lente</strong> en <Link href="/catalogo">nuestro catálogo</Link> o dinos tu graduación por WhatsApp</li>
        <li><strong>Confirma tu dirección exacta</strong> — edificio, piso, apartamento u oficina</li>
        <li><strong>Paga seguro</strong> con tarjeta vía AZUL, directo en el checkout</li>
        <li><strong>Recibe en 24-48h</strong> — te avisamos por WhatsApp cuando esté en camino</li>
      </ol>

      <h2>¿Por qué comprar por aquí en vez de una óptica física?</h2>

      <p>No tienes que salir de tu torre ni pedir el día libre para ir a una óptica. Pides desde tu teléfono, en tu horario, y te llega directo a la puerta — con las mismas marcas certificadas (ACUVUE, AIR OPTIX, Biofinity) que encontrarías en cualquier óptica física de la zona, generalmente a mejor precio por no tener el costo de un local físico.</p>

      <p>¿Tienes tu receta a mano? Usa nuestra <Link href="/receta">calculadora gratuita</Link> para ver qué lente corresponde a tu graduación, o escríbenos por WhatsApp al <strong>(809) 694-2268</strong> y coordinamos tu entrega hoy mismo.</p>
    </BlogArticle>
  )
}
