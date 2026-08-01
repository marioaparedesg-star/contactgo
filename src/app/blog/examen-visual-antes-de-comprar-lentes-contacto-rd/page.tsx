export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'examen-visual-antes-de-comprar-lentes-contacto-rd',
  title: 'Examen Visual antes de Comprar Lentes de Contacto en RD',
  h1: 'Examen visual antes de comprar lentes de contacto: qué necesitas y cuánto cuesta',
  description: 'Todo sobre el examen visual necesario para obtener tu receta de lentes de contacto en República Dominicana: qué incluye, cuánto cuesta y cada cuánto repetirlo.',
  publishedAt: '2026-07-31',
  readMinutes: 6,
  category: 'Guías',
  faq: [
    { q: '¿Cuánto cuesta un examen visual para lentes de contacto en RD?',
      a: 'Una consulta oftalmológica o con óptico especializado en RD ronda entre RD$800 y RD$2,500, dependiendo del profesional y si incluye la adaptación específica de lentes de contacto (que es un examen adicional al examen visual básico de gafas).' },
    { q: '¿Es diferente el examen para lentes de contacto que para gafas?',
      a: 'Sí. El examen de gafas mide tu graduación general. El examen para lentes de contacto agrega mediciones específicas: curvatura de la córnea (topografía o queratometría), tamaño de la pupila, calidad de la película lagrimal, y salud general de la superficie ocular — todos factores que no importan para gafas pero sí para que un lente de contacto calce bien.' },
    { q: '¿Puedo usar mi receta de gafas para comprar lentes de contacto directamente?',
      a: 'Parcialmente. La graduación esférica (SPH) suele ser similar (con el ajuste de efecto vértice en graduaciones altas), pero te faltan datos clave: curvatura base y diámetro del lente. Para la primera compra de lentes de contacto, es mejor conseguir la adaptación específica.' },
  ],
  relatedSlugs: ['como-leer-tu-receta', 'guia-principiantes-lentes-contacto-rd-2026', 'pueden-usar-lentes-contacto-sin-receta-rd'],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'examen visual lentes contacto RD, cuanto cuesta consulta optica lentes contacto, adaptacion lentes contacto precio',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Antes de comprar tu primera caja de lentes de contacto (o si nunca has hecho una "adaptación" formal), necesitas pasar por un examen visual específico. No es el mismo examen que para gafas — aquí te explicamos exactamente qué incluye, cuánto cuesta en RD, y cómo prepararte.</p>

      <h2>¿Por qué necesito un examen específico para lentes de contacto?</h2>
      <p>Un lente de contacto no solo corrige tu visión — también <strong>está en contacto directo con tu córnea</strong> durante horas. Eso requiere mediciones que un examen de gafas no incluye:</p>
      <ul>
        <li><strong>Curvatura corneal (queratometría):</strong> determina qué "curvatura base" (BC) de lente calza bien en tu ojo. Valores típicos: 8.4, 8.6, 8.8.</li>
        <li><strong>Diámetro de la córnea:</strong> define el "diámetro" (DIA) del lente que necesitas, usualmente entre 14.0 y 14.5mm.</li>
        <li><strong>Evaluación de la película lagrimal:</strong> qué tan bien produces lágrimas — importante para elegir el material del lente (algunos son mejores para ojo seco).</li>
        <li><strong>Salud de la superficie ocular:</strong> el óptico revisa que no haya alergias, infecciones o condiciones que contraindiquen el uso de lentes de contacto.</li>
      </ul>

      <h2>¿Cuánto cuesta en República Dominicana?</h2>
      <p>Los precios varían según el profesional y la clínica:</p>
      <ul>
        <li><strong>Examen visual básico (solo graduación):</strong> RD$500-1,200</li>
        <li><strong>Adaptación completa de lentes de contacto</strong> (incluye queratometría y evaluación específica): RD$1,000-2,500</li>
        <li><strong>Consulta oftalmológica completa</strong> (incluye examen de salud ocular general, fondo de ojo, presión intraocular): RD$1,500-3,500</li>
      </ul>
      <p>Algunas ARS cubren parte o la totalidad de la consulta oftalmológica — verifica con tu seguro antes de la cita.</p>

      <h2>¿Qué pasa en la consulta?</h2>
      <ol>
        <li><strong>Historia clínica:</strong> te preguntan sobre síntomas visuales, uso previo de lentes, alergias, medicamentos.</li>
        <li><strong>Refracción:</strong> determinan tu graduación exacta (SPH, y si aplica CYL y AXIS).</li>
        <li><strong>Queratometría o topografía:</strong> miden la curvatura de tu córnea con un instrumento específico.</li>
        <li><strong>Evaluación de salud ocular:</strong> revisan la superficie del ojo con lámpara de hendidura.</li>
        <li><strong>Prueba de lentes (si aplica):</strong> en algunas clínicas te dan un par de prueba para verificar que la graduación calza bien antes de darte la receta final.</li>
      </ol>
      <p>El proceso completo toma entre 30 y 60 minutos.</p>

      <h2>¿Cada cuánto necesito repetirlo?</h2>
      <p>La recomendación estándar es <strong>una vez al año</strong>, incluso si sientes que tu visión no ha cambiado. Razones:</p>
      <ul>
        <li>La graduación puede cambiar gradualmente sin que lo notes</li>
        <li>La salud corneal debe revisarse periódicamente (uso prolongado de lentes de contacto puede causar cambios sutiles)</li>
        <li>Las recetas de lentes de contacto en RD generalmente se consideran vigentes por 12 meses</li>
      </ul>

      <h2>¿Puedo saltarme el examen si ya tengo receta de gafas?</h2>
      <p>Si nunca has usado lentes de contacto, <strong>no es recomendable</strong>. La receta de gafas te da tu graduación esférica, pero te faltan curvatura y diámetro — datos esenciales que no aparecen ahí.</p>

      <p>Si <strong>ya has usado lentes de contacto antes</strong> y solo necesitas reponer el mismo producto de siempre, puedes usar tu receta anterior (mientras siga vigente, menos de 12 meses) sin necesidad de una consulta nueva cada vez que compras.</p>

      <h2>Después del examen: cómo comprar</h2>
      <p>Una vez que tienes tu receta completa (graduación + curvatura + diámetro, o al menos la graduación si vas a usar valores estándar), puedes comprar directamente. Usa nuestra <Link href="/receta">calculadora gratuita</Link> ingresando tus datos para ver qué productos corresponden exactamente a tu graduación, con precios reales.</p>

      <p>Si tienes dudas sobre cómo leer tu receta después del examen, revisa nuestra guía de <Link href="/blog/como-leer-tu-receta">cómo interpretar tu receta óptica</Link>, o escríbenos por WhatsApp al <strong>(809) 694-2268</strong> y te ayudamos a identificar el producto correcto.</p>
    </BlogArticle>
  )
}
