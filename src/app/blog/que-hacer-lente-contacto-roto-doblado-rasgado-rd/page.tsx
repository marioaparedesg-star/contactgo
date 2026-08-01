export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'que-hacer-lente-contacto-roto-doblado-rasgado-rd',
  title: 'Se me Rompió o Dobló un Lente de Contacto, ¿Qué Hago?',
  h1: 'Se me rasgó, dobló o rompió un lente de contacto — qué hacer',
  description: 'Guía práctica si tu lente de contacto se dañó al ponértelo o quitártelo: por qué pasa, si es seguro seguir usándolo, y cómo evitarlo la próxima vez.',
  publishedAt: '2026-08-01',
  readMinutes: 5,
  category: 'Consejos',
  faq: [
    { q: '¿Puedo seguir usando un lente de contacto que se dobló pero no se rasgó?',
      a: 'No es recomendable. Un lente que se dobló, aunque recupere su forma, puede tener microfracturas invisibles a simple vista que comprometen su integridad. Lo más seguro es descartarlo y usar uno nuevo.' },
    { q: '¿Por qué se me rasgan los lentes de contacto al ponérmelos?',
      a: 'Las causas más comunes son: uñas largas o filosas al manipular el lente, sequedad excesiva del lente antes de colocarlo, o técnica incorrecta al sacarlo del blister. También puede pasar si el lente ya estaba cerca del final de su vida útil y el material perdió flexibilidad.' },
    { q: '¿Es normal que se rompan lentes de contacto ocasionalmente?',
      a: 'Ocasionalmente sí, especialmente al principio mientras aprendes la técnica correcta. Si te pasa muy frecuentemente (más de 1 de cada 5 lentes), vale la pena revisar tu técnica de manipulación o consultar si tus uñas están interfiriendo.' },
  ],
  relatedSlugs: ['como-poner-lentes-de-contacto', 'guia-principiantes-lentes-contacto-rd-2026', 'perdida-lente-contacto-ojo-que-hacer'],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'lente de contacto roto que hacer, se me dobla el lente de contacto, lente contacto rasgado RD',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Estás en pleno proceso de ponerte el lente y — se dobla, se pega a tu dedo de forma rara, o de plano se rasga. Frustrante, especialmente si vas de salida. Aquí qué hacer en el momento y cómo evitarlo la próxima vez.</p>

      <h2>Lo primero: nunca uses un lente dañado</h2>
      <p>Sin importar qué tan sutil parezca el daño, <strong>no te pongas un lente que se dobló, rasgó o rompió</strong>. Aunque recupere su forma aparente, puede tener microfracturas invisibles que:</p>
      <ul>
        <li>Comprometen la superficie lisa del lente, causando irritación constante</li>
        <li>Crean bordes ásperos que pueden rayar la córnea</li>
        <li>Reducen la efectividad óptica (visión borrosa o distorsionada)</li>
      </ul>
      <p>Descártalo y usa uno nuevo. Sé que es frustrante, especialmente con lentes mensuales donde "pierdes" parte de tu inversión — pero el riesgo para tu ojo no vale la pena.</p>

      <h2>¿Por qué se dañan los lentes al manipularlos?</h2>

      <h3>Uñas largas o filosas</h3>
      <p>La causa más común. Al sacar el lente del blister o manipularlo en tu dedo, una uña larga puede rasgarlo fácilmente. Si usas uñas largas, ten especial cuidado o considera recortarlas ligeramente para esta tarea.</p>

      <h3>Lente muy seco antes de manipular</h3>
      <p>Si el lente pierde humedad (por ejemplo, si se demora mucho fuera de la solución), se vuelve más rígido y propenso a doblarse mal o rasgarse. Trabaja con movimientos ágiles una vez que sacas el lente de su solución.</p>

      <h3>Técnica de extracción incorrecta del blister</h3>
      <p>Al abrir el blister, si tiras con fuerza en el ángulo equivocado, el lente puede quedar atrapado en un pliegue del empaque y rasgarse al despegarlo.</p>

      <h3>Lente cerca del final de su vida útil</h3>
      <p>Con lentes mensuales cerca del día 25-30 de uso, el material puede perder algo de flexibilidad, haciéndolo más frágil al manipularlo para limpieza nocturna.</p>

      <h2>Cómo evitar que se dañen la próxima vez</h2>
      <ul>
        <li><strong>Trabaja con las manos bien secas</strong> — las manos mojadas hacen que el lente se resbale y tengas que manipularlo más de lo necesario</li>
        <li><strong>Abre el blister con calma</strong>, jalando la tapa en línea recta, no en ángulo</li>
        <li><strong>Usa la yema del dedo, no la uña</strong>, para levantar el lente del blister</li>
        <li><strong>Si tienes uñas largas,</strong> considera técnicas alternativas como usar la punta de un dedo distinto para deslizar el lente</li>
        <li><strong>No dejes el lente fuera de solución por mucho tiempo</strong> antes de ponértelo — se reseca y se vuelve más frágil</li>
      </ul>

      <h2>¿Qué hago si se me acabó la caja por daños repetidos?</h2>
      <p>Si perdiste varios lentes por daños antes de tiempo, no hay una "garantía de reemplazo" estándar en la industria — es parte del uso normal del producto. Pero si el problema persiste consistentemente, puede valer la pena:</p>
      <ul>
        <li>Revisar si tu técnica necesita ajuste (mira nuestra guía de <Link href="/blog/como-poner-lentes-de-contacto">cómo poner lentes de contacto</Link>)</li>
        <li>Considerar cambiar a lentes diarios si el problema ocurre principalmente en la manipulación nocturna de mensuales (menos manipulación repetida = menos riesgo)</li>
      </ul>

      <h2>¿Es normal que pase de vez en cuando?</h2>
      <p>Sí, especialmente los primeros meses mientras desarrollas la técnica. Si te pasa ocasionalmente (1 de cada 15-20 lentes), es normal. Si te pasa muy frecuentemente, vale la pena revisar tu técnica o consultar con un óptico.</p>

      <p>Si necesitas reponer tu caja antes de lo esperado por este motivo, revisa nuestro <Link href="/catalogo">catálogo</Link> o escríbenos por WhatsApp al <strong>(809) 694-2268</strong> para el envío más rápido posible.</p>
    </BlogArticle>
  )
}
