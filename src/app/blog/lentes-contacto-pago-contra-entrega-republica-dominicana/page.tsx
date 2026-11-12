export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'lentes-contacto-pago-contra-entrega-republica-dominicana',
  title: 'Cómo pagar tus lentes de contacto en línea de forma segura en RD',
  h1: 'Cómo pagar tus lentes de contacto en línea de forma segura',
  description: 'Conoce cómo completar tu compra de lentes de contacto en ContactGo con tarjeta de crédito o débito mediante el checkout seguro.',
  publishedAt: '2026-08-27',
  readMinutes: 4,
  category: 'Guías',
  faq: [
    {
      q: '¿Qué métodos de pago están disponibles en ContactGo?',
      a: 'Las compras realizadas desde nuestra tienda en línea se pagan con tarjeta de crédito o débito Visa o Mastercard mediante el checkout seguro.',
    },
    {
      q: '¿Puedo pagar en efectivo al recibir mi pedido?',
      a: 'No. ContactGo no ofrece pago contra entrega ni cobro en efectivo al momento de recibir pedidos realizados en la tienda en línea.',
    },
    {
      q: '¿ContactGo guarda los datos de mi tarjeta?',
      a: 'No. Los datos de la tarjeta se procesan en el portal seguro de pago y ContactGo no almacena los números de tu tarjeta.',
    },
  ],
  relatedSlugs: [
    'comprar-lentes-contacto-online-republica-dominicana',
    'donde-comprar-lentes-contacto-santo-domingo',
    'contactgo-vs-optica-comprar-lentes-online',
    'suscripcion-mensual-lentes-contacto-como-funciona-rd',
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
  keywords: 'pago seguro lentes de contacto, comprar lentes de contacto online, pago con tarjeta republica dominicana',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>En ContactGo puedes completar tu pedido directamente desde nuestra tienda en línea. El proceso de pago se realiza con tarjeta de crédito o débito Visa o Mastercard desde el checkout.</p>

      <h2>Cómo completar tu pago</h2>
      <ol>
        <li>Selecciona los productos y configura la graduación de cada ojo según tu receta vigente.</li>
        <li>Completa tus datos de contacto y la dirección de entrega.</li>
        <li>Revisa el resumen del pedido y acepta los términos y condiciones.</li>
        <li>Continúa al portal seguro de pago para completar la transacción con tu tarjeta.</li>
      </ol>

      <h2>Seguridad de la transacción</h2>
      <p>El pago se procesa en el portal seguro de AZUL, de Banco Popular. ContactGo no almacena los datos de tu tarjeta. Verifica siempre que estás completando la operación en el portal de pago correspondiente antes de introducir tus datos.</p>

      <h2>¿Puedo pagar al recibir el pedido?</h2>
      <p>No. Los pedidos realizados en la tienda en línea deben pagarse con tarjeta durante el proceso de compra. No ofrecemos pago contra entrega ni cobro en efectivo al momento de la entrega.</p>

      <h2>¿Necesitas ayuda con tu compra?</h2>
      <p>Si tienes alguna duda antes de pagar, puedes escribirnos por WhatsApp al <strong>(809) 694-2268</strong>. También puedes consultar nuestro <Link href="/catalogo">catálogo completo</Link> antes de iniciar tu pedido.</p>
    </BlogArticle>
  )
}
