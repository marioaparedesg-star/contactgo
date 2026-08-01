export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'lentes-contacto-devolucion-cambio-graduacion-incorrecta-rd',
  title: 'Devolución o Cambio de Lentes de Contacto en RD: Qué Hacer',
  h1: 'Compré lentes de contacto con la graduación equivocada, ¿qué hago?',
  description: 'Guía práctica sobre devoluciones y cambios de lentes de contacto en República Dominicana: cuándo procede, cuándo no, y cómo evitar el error desde el inicio.',
  publishedAt: '2026-07-31',
  readMinutes: 6,
  category: 'Consejos',
  faq: [
    { q: '¿Puedo devolver lentes de contacto si me equivoqué de graduación?',
      a: 'Depende del estado de la caja. Si la caja sigue sellada (sin abrir), la mayoría de tiendas serias procesan el cambio sin problema por temas de higiene. Si la caja ya fue abierta, generalmente no se acepta devolución — por eso es crítico verificar tu graduación ANTES de abrir el empaque.' },
    { q: '¿Por qué las cajas abiertas de lentes de contacto no se pueden devolver?',
      a: 'Es una norma de higiene y seguridad médica estándar en toda la industria. Los lentes de contacto son dispositivos médicos de uso personal — una vez abierto el blister sellado, no se puede garantizar que el producto siga siendo seguro para otro usuario, sin importar si se usó o no.' },
    { q: '¿Qué pasa si mis lentes de contacto tóricos no fueron el eje correcto?',
      a: 'Los lentes tóricos son más sensibles a errores porque requieren graduación exacta de esfera, cilindro Y eje. Si detectas el error antes de abrir la caja, contacta a la tienda inmediatamente. ContactGo tiene una política especial de 48 horas desde la confirmación del pedido para cancelar o corregir pedidos de tóricos antes de que se procesen.' },
  ],
  relatedSlugs: ['como-leer-tu-receta', 'como-leer-receta-optica-rd', 'lentes-contacto-para-astigmatismo'],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'devolucion lentes de contacto RD, cambio lentes contacto graduacion incorrecta, que hacer si compre lentes contacto mal',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Te llegó la caja, la abriste con emoción, y al ponerte el lente notas que algo no está bien — visión borrosa, o revisando la caja te das cuenta de que pediste la graduación equivocada. Aquí lo que puedes (y no puedes) hacer, y cómo evitar que te vuelva a pasar.</p>

      <h2>La regla general: caja sellada vs caja abierta</h2>
      <p>Esta es la distinción más importante en toda la industria de lentes de contacto, no solo en ContactGo:</p>

      <h3>Si la caja sigue sellada (sin abrir)</h3>
      <p>La mayoría de tiendas serias procesan el cambio o devolución sin mayor problema. El producto no se ha usado ni expuesto, así que es seguro reintegrarlo al inventario o cambiarlo por el correcto.</p>

      <h3>Si la caja ya fue abierta</h3>
      <p>Aquí es donde la mayoría de clientes se sorprenden: <strong>generalmente no se acepta devolución</strong>, incluso si el lente nunca se usó. No es capricho del vendedor — es una norma de higiene estándar en toda la industria óptica mundial. Los lentes de contacto son dispositivos médicos de uso personal; una vez abierto el blister sellado de fábrica, no hay forma de garantizar que el producto mantenga su esterilidad original.</p>

      <h2>El caso especial de los lentes tóricos (astigmatismo)</h2>
      <p>Los lentes tóricos son los más propensos a errores porque requieren <strong>tres valores exactos</strong>: esfera (SPH), cilindro (CYL) y eje (AXIS). Un error en cualquiera de los tres hace que el lente no funcione correctamente.</p>

      <p>Por esta razón, en ContactGo tenemos una <strong>política especial para tóricos</strong>: 48 horas desde la confirmación del pedido para solicitar cancelación o corrección, <em>antes</em> de que el pedido se procese y envíe. Si detectas un error en tu graduación tórica dentro de ese plazo, contáctanos de inmediato por WhatsApp.</p>

      <h2>Cómo evitar el error desde el inicio</h2>
      <p>La mejor devolución es la que nunca necesitas hacer. Antes de confirmar tu pedido:</p>
      <ul>
        <li><strong>Verifica cada número de tu receta dos veces</strong> — especialmente el signo (+/−) de la graduación, que es el error más común.</li>
        <li><strong>Diferencia OD (ojo derecho) de OI (ojo izquierdo)</strong> — es fácil invertirlos por error al escribir.</li>
        <li><strong>Si tienes astigmatismo, verifica CYL y AXIS con cuidado</strong> — un eje de 90° y uno de 180° son completamente diferentes.</li>
        <li><strong>Usa nuestra <Link href="/receta">calculadora automática</Link></strong> en vez de escribir el pedido a mano — reduce drásticamente el margen de error humano.</li>
        <li><strong>Si tienes dudas de tu receta, pregunta antes de comprar</strong> — escríbenos por WhatsApp con una foto de tu receta y la confirmamos contigo antes de procesar el pedido.</li>
      </ul>

      <h2>¿Qué pasa si el error fue de la tienda, no tuyo?</h2>
      <p>Si recibiste un producto diferente al que pediste (por error de empaque o envío, no por equivocación tuya al ordenar), esto <strong>siempre se resuelve sin costo para ti</strong>, sin importar si abriste la caja — el error no fue tuyo. Contacta inmediatamente con evidencia (foto del producto recibido vs tu pedido original).</p>

      <h2>Qué hacer si ya abriste la caja y la graduación es incorrecta</h2>
      <p>Aunque la devolución de caja abierta generalmente no aplica, esto es lo que sí puedes hacer:</p>
      <ol>
        <li><strong>Contacta a la tienda de inmediato</strong> — explica la situación con claridad y honestidad.</li>
        <li><strong>No sigas usando el lente incorrecto</strong> — usar una graduación equivocada puede causar dolor de cabeza, fatiga visual y en algunos casos empeorar temporalmente tu visión.</li>
        <li><strong>Solicita orientación sobre la graduación correcta</strong> — la tienda puede ayudarte a identificar dónde estuvo el error para tu próximo pedido.</li>
        <li><strong>Considera el producto restante como aprendizaje</strong> — quizás puedas dárselo a alguien con esa graduación exacta, o guardarlo por si tu receta cambia en el futuro.</li>
      </ol>

      <h2>Política de ContactGo</h2>
      <p>En ContactGo, las cajas abiertas no son elegibles para devolución (norma de higiene estándar). Para lentes tóricos, tienes 48 horas desde la confirmación del pedido para solicitar cancelación antes del procesamiento. Te recomendamos siempre verificar tu receta con nuestro equipo antes de confirmar, especialmente en primeras compras o cambios de marca — es gratis y toma 2 minutos por WhatsApp.</p>

      <p>Si tienes dudas sobre tu pedido actual o uno que estás por hacer, escríbenos al <strong>(809) 694-2268</strong> antes de confirmar. Revisa también nuestra <Link href="/devoluciones">política completa de devoluciones</Link>.</p>
    </BlogArticle>
  )
}
