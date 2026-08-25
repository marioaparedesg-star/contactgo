export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'blefaritis-lentes-contacto-que-debes-saber-rd',
  title: 'Blefaritis y Lentes de Contacto: Qué Debes Saber — RD 2026',
  h1: 'Blefaritis y lentes de contacto: ¿se pueden combinar?',
  description: 'Si tienes blefaritis (inflamación de párpados), esto es lo que debes saber antes de seguir usando lentes de contacto: síntomas, cuidados, y cuándo hacer una pausa.',
  publishedAt: '2026-08-19',
  readMinutes: 6,
  category: 'Salud Visual',
  faq: [
    { q: '¿Puedo usar lentes de contacto si tengo blefaritis?',
      a: 'Depende de la severidad. En casos leves y bien controlados, muchas personas continúan usando lentes de contacto sin problema, priorizando higiene estricta y lentes diarios. En brotes activos o casos moderados-severos, lo recomendable es pausar el uso hasta que un oftalmólogo confirme que está controlada.' },
    { q: '¿La blefaritis se cura completamente?',
      a: 'En muchos casos es una condición crónica que se maneja más que se "cura" del todo — con higiene palpebral regular, muchas personas mantienen los síntomas bajo control por largos períodos, aunque puede haber brotes ocasionales.' },
    { q: '¿Qué tipo de lentes son mejores si tengo blefaritis?',
      a: 'Los lentes diarios desechables suelen ser la mejor opción, ya que evitas la acumulación de depósitos y bacterias que ocurre con lentes reutilizables — reduciendo el riesgo de irritar más la condición.' },
  ],
  relatedSlugs: [
    'lentes-contacto-ojos-secos-republica-dominicana',
    'ojo-rojo-lentes-contacto-que-hacer',
    'lentes-contacto-alergia-conjuntivitis',
    'sensacion-arenilla-irritacion-lentes-contacto-causas',
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
  keywords: 'blefaritis lentes de contacto, blefaritis republica dominicana, inflamacion parpados lentes contacto rd',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Si tus párpados amanecen rojos, con costras en la base de las pestañas, o sientes ardor y picazón constante, podrías tener blefaritis — una condición mucho más común de lo que parece, y que sí tiene relación directa con el uso de lentes de contacto.</p>

      <h2>¿Qué es la blefaritis?</h2>

      <p>Es la <strong>inflamación crónica del borde de los párpados</strong>, generalmente causada por obstrucción de las glándulas que producen la capa oleosa de la lágrima, o por una acumulación excesiva de bacterias normales de la piel en la base de las pestañas. No es contagiosa ni peligrosa en sí misma, pero sí molesta y puede afectar la comodidad de usar lentes de contacto.</p>

      <h2>Síntomas comunes</h2>
      <ul>
        <li>Párpados rojos o inflamados, especialmente al despertar</li>
        <li>Costras o escamas en la base de las pestañas</li>
        <li>Sensación de ardor o picazón en el borde del párpado</li>
        <li>Ojos llorosos o, paradójicamente, sensación de ojo seco</li>
        <li>Sensibilidad a la luz</li>
        <li>Pestañas que se caen con más frecuencia de lo normal</li>
      </ul>

      <h2>¿Por qué afecta el uso de lentes de contacto?</h2>

      <p>La blefaritis altera la composición y calidad de tu película lagrimal — la capa de lágrima que cubre tu ojo y que es fundamental para que un lente de contacto se mantenga cómodo. Cuando esa capa está alterada:</p>

      <ul>
        <li>Los lentes tienden a sentirse más secos e incómodos más rápido en el día</li>
        <li>Aumenta el riesgo de irritación e inflamación adicional</li>
        <li>Las bacterias asociadas a la blefaritis pueden acumularse más fácilmente en lentes reutilizables</li>
      </ul>

      <h2>¿Debo dejar de usar lentes de contacto?</h2>

      <p>Depende de la severidad — y esto siempre lo debe confirmar un oftalmólogo, no algo que decidas por cuenta propia:</p>

      <h3>Casos leves y controlados</h3>
      <p>Muchas personas con blefaritis leve, bien manejada con higiene palpebral regular, continúan usando lentes de contacto sin mayor problema — priorizando lentes diarios desechables (menor acumulación de depósitos) y limpieza estricta de manos antes de manipularlos.</p>

      <h3>Brotes activos o casos moderados-severos</h3>
      <p>Durante un brote activo, lo recomendable suele ser <strong>pausar el uso de lentes de contacto</strong> temporalmente y usar gafas, hasta que la inflamación esté controlada — para evitar empeorar la irritación y reducir el riesgo de infección.</p>

      <h2>Cuidados que ayudan a manejarla</h2>

      <ol>
        <li><strong>Higiene palpebral diaria:</strong> limpiar la base de las pestañas con toallitas específicas para blefaritis o compresas tibias, según indique tu oftalmólogo.</li>
        <li><strong>Preferir lentes diarios</strong> sobre reutilizables mientras manejas la condición, para minimizar acumulación de depósitos.</li>
        <li><strong>Lavarte las manos muy bien</strong> antes de tocar tus ojos o lentes.</li>
        <li><strong>No dormir con los lentes puestos</strong> bajo ninguna circunstancia si tienes blefaritis activa.</li>
        <li><strong>Usar gotas humectantes</strong> si tu oftalmólogo lo recomienda, para compensar la alteración de la película lagrimal.</li>
      </ol>

      <h2>¿Cuándo consultar a un especialista?</h2>

      <p>Si los síntomas persisten más de unos días, empeoran, o notas secreción amarillenta o dolor real (no solo molestia), consulta con un oftalmólogo. La blefaritis por sí sola no es grave, pero puede confundirse con otras condiciones que sí requieren tratamiento específico.</p>

      <p>Si tu oftalmólogo confirma que puedes seguir usando lentes de contacto mientras manejas tu blefaritis, los <strong>lentes diarios desechables</strong> suelen ser la mejor opción por su bajo riesgo de acumulación bacteriana. En ContactGo tenemos toda la línea de diarios de las marcas más certificadas — puedes ver nuestra <Link href="/blog/lentes-contacto-ojos-secos-republica-dominicana">guía de lentes para ojos secos</Link>, una condición que suele acompañar a la blefaritis, o escribirnos por WhatsApp al <strong>(809) 694-2268</strong> si tienes dudas sobre qué producto se ajusta mejor a tu situación.</p>
    </BlogArticle>
  )
}
