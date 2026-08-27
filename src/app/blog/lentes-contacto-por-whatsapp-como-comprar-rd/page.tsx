export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'lentes-contacto-por-whatsapp-como-comprar-rd',
  title: 'Cómo Comprar Lentes de Contacto por WhatsApp en RD — Guía 2026',
  h1: 'Cómo comprar lentes de contacto por WhatsApp en República Dominicana',
  description: 'Guía paso a paso para comprar lentes de contacto por WhatsApp en RD: qué necesitas tener a mano, cómo funciona el proceso, y qué esperar.',
  publishedAt: '2026-08-27',
  readMinutes: 6,
  category: 'Guías',
  faq: [
    { q: '¿Es seguro comprar lentes de contacto por WhatsApp?',
      a: 'Sí, siempre que la tienda tenga presencia formal (web, registro comercial visible) y no te pida pagar por transferencia a una cuenta personal sin ningún respaldo. El pago debe procesarse por un link seguro o pasarela certificada, nunca en efectivo por adelantado a un número sin verificar.' },
    { q: '¿Necesito tener cuenta en la web para comprar por WhatsApp?',
      a: 'No necesariamente para iniciar la conversación — pero al completar tu pedido con tus datos (nombre, dirección, receta), normalmente se crea tu cuenta automáticamente para que puedas ver tu historial de pedidos después.' },
    { q: '¿Puedo comprar por WhatsApp sin tener receta a mano?',
      a: 'Puedes empezar la conversación sin receta, pero para confirmar el pedido necesitarás la graduación exacta (SPH, CYL si tienes astigmatismo, ADD si tienes presbicia) — los lentes de contacto son dispositivos médicos regulados.' },
  ],
  relatedSlugs: [
    'comprar-lentes-contacto-online-republica-dominicana',
    'como-leer-receta-optica-rd',
    'donde-comprar-lentes-contacto-santo-domingo',
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
  keywords: 'comprar lentes de contacto por whatsapp, lentes de contacto whatsapp republica dominicana, pedir lentes de contacto whatsapp rd',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Para muchos dominicanos, WhatsApp no es solo para chatear — es donde de verdad se resuelven las compras del día a día. Comprar lentes de contacto por ahí es más común de lo que crees, y aquí te explicamos exactamente cómo funciona el proceso, de principio a fin.</p>

      <h2>¿Qué necesitas tener a mano antes de escribir?</h2>

      <ul>
        <li><strong>Tu receta óptica</strong> — una foto clara es suficiente, o al menos los valores de SPH (y CYL/eje si tienes astigmatismo, ADD si tienes presbicia)</li>
        <li><strong>La marca que usas actualmente</strong>, si ya usas lentes de contacto — ayuda a ir más rápido</li>
        <li><strong>Tu dirección de entrega</strong> completa, con algún punto de referencia</li>
      </ul>

      <p>Si no tienes tu receta a mano, no pasa nada — puedes empezar la conversación igual y te orientan sobre cómo conseguirla o interpretarla.</p>

      <h2>El proceso paso a paso</h2>

      <ol>
        <li><strong>Escribes al número de WhatsApp de la tienda</strong> con tu consulta o directo con tu receta</li>
        <li><strong>El equipo te asesora</strong> sobre qué producto corresponde a tu graduación y marca preferida</li>
        <li><strong>Te generan un link de pago personalizado</strong> — ahí completas tus datos (nombre, dirección, teléfono, correo)</li>
        <li><strong>Aceptas el aviso médico</strong> — una confirmación de que tienes receta vigente y entiendes que los lentes de contacto son dispositivos médicos</li>
        <li><strong>Pagas de forma segura</strong>, normalmente con tarjeta a través de una pasarela certificada</li>
        <li><strong>Recibes confirmación y seguimiento</strong> de tu pedido, generalmente por el mismo WhatsApp</li>
      </ol>

      <h2>Ventajas reales de comprar por WhatsApp en vez de la web</h2>

      <ul>
        <li>✅ <strong>Asesoría humana en tiempo real</strong> — si tienes dudas sobre tu graduación o qué marca elegir, alguien te responde directo</li>
        <li>✅ <strong>Útil si tu receta es complicada</strong> — graduaciones muy altas, astigmatismo con presbicia, o casos que no encajan claro en el catálogo estándar</li>
        <li>✅ <strong>No necesitas navegar un catálogo completo</strong> — solo describes lo que necesitas</li>
      </ul>

      <h2>¿Cómo saber si es una tienda confiable?</h2>

      <ul>
        <li>Tiene una web real (no solo un número de WhatsApp suelto)</li>
        <li>El pago se procesa por un link seguro o pasarela certificada — nunca transferencia a una cuenta personal sin respaldo</li>
        <li>Tiene reseñas verificables o historial de operación</li>
        <li>Te pide tu receta antes de vender — si te venden sin preguntar nada sobre tu graduación, es una señal de alerta</li>
      </ul>

      <h2>¿Listo para probarlo?</h2>

      <p>En ContactGo puedes escribirnos directo por WhatsApp al <strong>(809) 694-2268</strong> con tu receta, o si prefieres armar tu pedido tú mismo primero, usa nuestra <Link href="/receta">calculadora gratuita</Link> para ver qué producto corresponde a tu graduación.</p>
    </BlogArticle>
  )
}
