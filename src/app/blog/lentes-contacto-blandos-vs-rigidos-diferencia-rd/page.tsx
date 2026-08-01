export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'lentes-contacto-blandos-vs-rigidos-diferencia-rd',
  title: 'Lentes de Contacto Blandos vs Rígidos: Diferencias',
  h1: 'Diferencia entre lentes de contacto blandos y rígidos (RGP)',
  description: 'Todo sobre la diferencia entre lentes de contacto blandos (los más comunes) y rígidos permeables al gas (RGP). Cuál conviene según tu caso.',
  publishedAt: '2026-08-01',
  readMinutes: 6,
  category: 'Guías',
  faq: [
    { q: '¿Qué son los lentes de contacto rígidos permeables al gas (RGP)?',
      a: 'Son lentes de contacto fabricados con un material rígido que permite el paso de oxígeno a la córnea. A diferencia de los blandos (hidrogel o silicona hidrogel), mantienen su forma y no se adaptan tanto a la superficie del ojo, lo que les da ventajas ópticas en casos específicos como astigmatismo irregular o córnea cónica (queratocono).' },
    { q: '¿Los lentes rígidos duelen más que los blandos?',
      a: 'La adaptación inicial es más notoria con lentes rígidos — se sienten desde el primer momento, mientras que los blandos casi no se sienten tras unos días. Sin embargo, con uso constante, muchos usuarios de RGP reportan comodidad completa después de 1-2 semanas de adaptación.' },
    { q: '¿ContactGo vende lentes de contacto rígidos (RGP)?',
      a: 'No, en ContactGo trabajamos exclusivamente con lentes de contacto blandos (hidrogel y silicona hidrogel) de las marcas líderes. Los lentes rígidos permeables al gas requieren un proceso de adaptación y fabricación personalizada que se maneja directamente con un especialista en contactología.' },
  ],
  relatedSlugs: ['tipos-de-lentes-de-contacto', 'lentes-de-contacto-miopia-alta-graduacion-fuerte-rd', 'como-elegir-tu-primera-marca-lentes-contacto-rd'],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'lentes de contacto blandos vs rigidos, RGP lentes contacto, diferencia lentes contacto duros y blandos',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Cuando investigas sobre lentes de contacto, tarde o temprano aparece el término "RGP" o "lentes rígidos". La gran mayoría de usuarios en República Dominicana (y en el mundo) usan <strong>lentes blandos</strong> — pero vale la pena entender la diferencia, sobre todo si tienes una condición ocular particular.</p>

      <h2>Lentes de contacto blandos (los más comunes)</h2>
      <p>Fabricados con hidrogel o silicona hidrogel — materiales flexibles que se adaptan a la forma de tu córnea. Son los que verás en el 95%+ del mercado, incluyendo todas las marcas que manejamos en ContactGo: ACUVUE, Biofinity, Air Optix, Bausch+Lomb, Avaira, entre otras.</p>

      <h3>Ventajas</h3>
      <ul>
        <li>Comodidad casi inmediata — la mayoría de usuarios se adaptan en días</li>
        <li>Amplia variedad de formatos: diarios, quincenales, mensuales</li>
        <li>Disponibles para prácticamente cualquier graduación (esférica, tórica, multifocal)</li>
        <li>Materiales modernos con excelente transmisión de oxígeno</li>
      </ul>

      <h3>Desventajas</h3>
      <ul>
        <li>Menor nitidez óptica en casos de astigmatismo muy irregular</li>
        <li>Requieren reemplazo más frecuente (a diferencia de los rígidos que pueden durar 1-2 años)</li>
        <li>Mayor absorción de depósitos y proteínas con el tiempo</li>
      </ul>

      <h2>Lentes de contacto rígidos permeables al gas (RGP)</h2>
      <p>Fabricados con un material rígido pero que permite paso de oxígeno (a diferencia de los antiguos lentes de PMMA totalmente impermeables, ya en desuso). Mantienen su forma sobre el ojo en vez de adaptarse a la córnea.</p>

      <h3>Ventajas</h3>
      <ul>
        <li>Óptica más nítida en casos de astigmatismo irregular o queratocono (córnea con forma cónica)</li>
        <li>Mayor durabilidad — un par puede durar 1-2 años con buen cuidado</li>
        <li>Menor acumulación de depósitos comparado con blandos</li>
        <li>Excelente transmisión de oxígeno</li>
      </ul>

      <h3>Desventajas</h3>
      <ul>
        <li>Adaptación inicial más incómoda — se sienten notoriamente los primeros días/semanas</li>
        <li>Requieren fabricación personalizada según la topografía exacta de tu córnea</li>
        <li>Proceso de adaptación con seguimiento profesional cercano</li>
        <li>Más propensos a moverse o salirse con impactos (deportes de contacto)</li>
      </ul>

      <h2>¿Cuándo se recomienda RGP en vez de blandos?</h2>
      <p>Los lentes rígidos se indican principalmente en casos específicos:</p>
      <ul>
        <li><strong>Queratocono</strong> — córnea con forma irregular cónica, donde los blandos no logran corregir bien la visión</li>
        <li><strong>Astigmatismo muy irregular</strong> — que los tóricos blandos no logran estabilizar correctamente</li>
        <li><strong>Después de ciertas cirugías corneales</strong> — donde la superficie del ojo tiene irregularidades</li>
        <li><strong>Usuarios que priorizan durabilidad sobre comodidad inicial</strong> — un par de RGP bien cuidado dura mucho más que múltiples cajas de blandos</li>
      </ul>

      <h2>¿Cuál es la opción correcta para ti?</h2>
      <p>Si tu graduación es esférica o tórica estándar (la gran mayoría de casos), <strong>los lentes blandos son la opción correcta</strong> — más cómodos, más accesibles, y con toda la variedad de marcas disponibles en el mercado.</p>

      <p>Si tienes una condición corneal específica (queratocono, astigmatismo muy irregular, o tu óptico ya te mencionó que los blandos no logran corregir bien tu visión), es momento de consultar sobre RGP con un especialista en contactología — este tipo de lente requiere fabricación personalizada y seguimiento profesional presencial.</p>

      <h2>Lo que ofrecemos en ContactGo</h2>
      <p>Trabajamos exclusivamente con lentes de contacto blandos de las marcas líderes — cubrimos esféricos, tóricos, multifocales y de color. Si tu caso requiere RGP, te recomendamos una consulta especializada, pero si tu necesidad es estándar, revisa nuestro <Link href="/catalogo">catálogo completo</Link> o escríbenos por WhatsApp al <strong>(809) 694-2268</strong>.</p>
    </BlogArticle>
  )
}
