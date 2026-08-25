export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'ortoqueratologia-orthok-lentes-contacto-rd',
  title: 'Ortoqueratología (Orto-K) en República Dominicana — Guía 2026',
  h1: 'Ortoqueratología (Orto-K): lentes de contacto que corrigen tu visión mientras duermes',
  description: 'Qué es la ortoqueratología, cómo funciona, cuánto cuesta en RD y si es para ti. Guía completa sobre los lentes nocturnos que moldean la córnea temporalmente.',
  publishedAt: '2026-08-19',
  readMinutes: 8,
  category: 'Guías',
  faq: [
    { q: '¿La ortoqueratología es permanente?',
      a: 'No. El efecto es temporal y reversible — si dejas de usar los lentes Orto-K unas semanas, tu córnea vuelve gradualmente a su forma original y la miopía regresa. Por eso hay que usarlos casi todas las noches de forma indefinida para mantener el efecto.' },
    { q: '¿Duele dormir con lentes rígidos?',
      a: 'Al principio puedes sentir el párpado ligeramente distinto, pero no debería doler. Son lentes diseñados específicamente para uso nocturno con materiales de alta permeabilidad al oxígeno. La adaptación completa toma entre 1 y 2 semanas.' },
    { q: '¿La ortoqueratología existe en República Dominicana?',
      a: 'Sí, pero requiere un proceso de adaptación personalizado con un especialista certificado en Orto-K — no es un producto que se compre directo sin evaluación, a diferencia de los lentes blandos convencionales. ContactGo no vende lentes Orto-K por ser un proceso médico altamente individualizado, pero podemos orientarte sobre qué esperar.' },
    { q: '¿Sirve para detener el avance de la miopía en niños?',
      a: 'Es una de sus aplicaciones más estudiadas — varios estudios muestran que el uso de Orto-K en niños puede ralentizar la progresión de la miopía comparado con gafas convencionales. Debe evaluarlo un especialista caso por caso.' },
  ],
  relatedSlugs: [
    'lentes-contacto-rgp-rigidos-permeables-gas-rd',
    'lentes-contacto-vs-cirugia-lasik-cual-elegir-rd',
    'lentes-de-contacto-miopia-alta-graduacion-fuerte-rd',
    'tipos-de-lentes-de-contacto',
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
  keywords: 'ortoqueratologia republica dominicana, orto-k rd, lentes nocturnos miopia, corregir vision sin cirugia rd',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Imagina corregir tu miopía mientras duermes, y despertar viendo nítido todo el día sin lentes ni gafas. Suena a ciencia ficción, pero es exactamente lo que hace la <strong>ortoqueratología</strong> (Orto-K) — una técnica que lleva más de dos décadas usándose en el mundo y que cada vez más dominicanos preguntan por ella.</p>

      <p>Aquí te explicamos qué es, cómo funciona de verdad, y qué esperar si te interesa explorarla en RD.</p>

      <h2>¿Qué es la ortoqueratología?</h2>

      <p>Es el uso de <strong>lentes de contacto rígidos especiales, diseñados para usarse mientras duermes</strong>. Durante la noche, el lente ejerce una presión controlada y calculada sobre la córnea, aplanándola ligeramente en el centro. Al despertar y quitarte el lente, la córnea mantiene esa nueva forma temporal — suficiente para que veas nítido durante el día sin necesidad de gafas ni lentes de contacto convencionales.</p>

      <p>No es cirugía. No hay cortes ni láser. Es completamente reversible: si dejas de usar los lentes, tu córnea regresa gradualmente a su forma original en cuestión de días o semanas.</p>

      <h2>¿Cómo funciona el proceso?</h2>

      <ol>
        <li><strong>Evaluación inicial:</strong> un especialista mide la topografía exacta de tu córnea (su forma en detalle, no solo tu graduación).</li>
        <li><strong>Diseño personalizado:</strong> los lentes se fabrican a medida según esa topografía — no son lentes de talla estándar.</li>
        <li><strong>Adaptación:</strong> usas los lentes cada noche. Los primeros días la visión mejora progresivamente, no de golpe.</li>
        <li><strong>Estabilización:</strong> entre 1 y 2 semanas después, el efecto se estabiliza y mantienes visión nítida todo el día.</li>
        <li><strong>Mantenimiento:</strong> debes seguir usándolos casi todas las noches, indefinidamente, para conservar el efecto.</li>
      </ol>

      <h2>¿Para quién funciona mejor?</h2>

      <ul>
        <li><strong>Miopía baja a moderada</strong> — funciona mejor hasta aproximadamente -6.00, aunque depende del caso.</li>
        <li><strong>Astigmatismo leve</strong> — algunos diseños también lo corrigen, pero con más limitaciones.</li>
        <li><strong>Niños y adolescentes con miopía progresiva</strong> — es una de las aplicaciones más estudiadas, con evidencia de que puede ralentizar el avance de la miopía.</li>
        <li><strong>Deportistas y nadadores</strong> — personas que no quieren depender de gafas ni lentes durante el día por su actividad física.</li>
        <li><strong>Quienes no califican para cirugía láser todavía</strong> — por edad, córnea delgada, u otras razones.</li>
      </ul>

      <h2>Ventajas y limitaciones, con honestidad</h2>

      <h3>Ventajas</h3>
      <ul>
        <li>✅ Visión nítida todo el día, sin nada puesto en el ojo mientras estás despierto</li>
        <li>✅ Completamente reversible — no es un compromiso permanente</li>
        <li>✅ Puede ralentizar el avance de miopía en niños</li>
        <li>✅ Ideal para deportes acuáticos o de contacto donde gafas y lentes blandos son un problema</li>
      </ul>

      <h3>Limitaciones reales</h3>
      <ul>
        <li>❌ Requiere uso casi todas las noches, indefinidamente — no es "una vez y ya"</li>
        <li>❌ El costo inicial de evaluación y lentes personalizados es más alto que lentes convencionales</li>
        <li>❌ No todos los grados de miopía o astigmatismo son candidatos</li>
        <li>❌ Requiere seguimiento profesional periódico, no es autoservicio</li>
      </ul>

      <h2>Ortoqueratología en República Dominicana</h2>

      <p>A diferencia de los lentes de contacto blandos convencionales — que puedes pedir online con tu receta, como hacemos en ContactGo — la ortoqueratología <strong>requiere evaluación presencial con un especialista certificado</strong>, porque cada lente se diseña a la medida exacta de la topografía de tu córnea. No es un producto de catálogo.</p>

      <p>En ContactGo somos especialistas en lentes de contacto convencionales (diarios, quincenales, mensuales, blandos) — no ofrecemos Orto-K por ser un proceso clínico altamente individualizado que va más allá de nuestro modelo de venta directa. Si te interesa, lo correcto es buscar un oftalmólogo u óptico en RD certificado específicamente en esta técnica.</p>

      <h2>¿Orto-K o lentes de contacto convencionales?</h2>

      <p>Si tu prioridad es <strong>simplicidad, costo accesible y empezar ya</strong>, los lentes de contacto blandos diarios o mensuales siguen siendo la opción más práctica para la mayoría de personas en RD. Puedes ver nuestra <Link href="/blog/guia-principiantes-lentes-contacto-rd-2026">guía completa para principiantes</Link> si es tu caso.</p>

      <p>Si tu prioridad es <strong>no depender de nada durante el día</strong> — por deporte, trabajo, o simplemente preferencia — y estás dispuesto a invertir en el proceso de adaptación, vale la pena consultarlo con un especialista en Orto-K.</p>

      <p>¿Tienes dudas sobre qué tipo de lente de contacto convencional se ajusta a tu graduación mientras decides? Usa nuestra <Link href="/receta">calculadora gratuita</Link> o escríbenos por WhatsApp al <strong>(809) 694-2268</strong>.</p>
    </BlogArticle>
  )
}
