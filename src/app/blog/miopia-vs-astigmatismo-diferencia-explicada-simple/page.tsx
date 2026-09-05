export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'miopia-vs-astigmatismo-diferencia-explicada-simple',
  title: 'Miopía vs Astigmatismo: Diferencia Explicada Simple (RD 2026)',
  h1: 'Miopía vs astigmatismo: ¿cuál es la diferencia?',
  description: 'Dos de los términos más comunes en una receta óptica, explicados sin tecnicismos — para que entiendas exactamente qué corrigen tus lentes.',
  publishedAt: '2026-09-04',
  readMinutes: 6,
  category: 'Educación',
  faq: [
    { q: '¿Puedo tener miopía y astigmatismo al mismo tiempo?',
      a: 'Sí, es muy común — de hecho es más la norma que la excepción. Si tu receta trae valores tanto en SPH (esfera) como en CYL (cilindro), tienes ambas y necesitas un lente tórico, que corrige las dos a la vez.' },
    { q: '¿Cómo sé si tengo astigmatismo con solo ver mi receta?',
      a: 'Busca la columna CYL (cilindro). Si tiene un valor distinto de cero (por ejemplo -0.75 o -1.50), tienes astigmatismo. Si dice 0.00 o está en blanco, no lo tienes.' },
    { q: '¿El astigmatismo empeora con el tiempo?',
      a: 'Puede cambiar ligeramente con los años, igual que la miopía, por eso es importante actualizar tu receta cada 12 meses aproximadamente.' },
  ],
  relatedSlugs: [
    'como-leer-receta-optica-rd',
    'lentes-de-contacto-para-astigmatismo-rd',
    'guia-marcas-lentes-contacto-republica-dominicana-cual-elegir',
    'lentes-de-contacto-miopia-alta-graduacion-fuerte-rd',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'diferencia entre miopia y astigmatismo, que es astigmatismo, que es miopia, sph cyl receta optica',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Si alguna vez viste tu receta óptica y te preguntaste qué significan esos números junto a “SPH” y “CYL”, no eres el único. Aquí te explicamos la diferencia entre estas dos condiciones tan comunes, sin lenguaje médico complicado.</p>

      <h2>Miopía: el ojo “demasiado alargado”</h2>
      <p>La miopía ocurre cuando el ojo es ligeramente más alargado de lo ideal (o la córnea tiene una curvatura muy pronunciada), lo que hace que la luz se enfoque <em>antes</em> de llegar a la retina en vez de justo sobre ella. El resultado: ves bien de cerca, pero los objetos lejanos se ven borrosos. En tu receta aparece como un valor negativo en <strong>SPH</strong> (esfera) — por ejemplo, -2.50.</p>

      <h2>Astigmatismo: una curvatura irregular</h2>
      <p>El astigmatismo no tiene que ver con qué tan alargado es el ojo, sino con su <em>forma</em>. En un ojo sin astigmatismo, la córnea es perfectamente redonda, como una pelota. Con astigmatismo, la córnea tiene una forma más ovalada, como un balón de fútbol americano — esto hace que la luz se enfoque en más de un punto a la vez, produciendo visión borrosa o distorsionada tanto de lejos como de cerca. En tu receta aparece como un valor en <strong>CYL</strong> (cilindro) junto con un <strong>AXIS</strong> (eje, el ángulo de esa irregularidad).</p>

      <table>
        <thead><tr><th></th><th>Miopía</th><th>Astigmatismo</th></tr></thead>
        <tbody>
          <tr><td>Qué afecta</td><td>Qué tan lejos ves con claridad</td><td>Nitidez general de la imagen</td></tr>
          <tr><td>Causa</td><td>Ojo más alargado de lo ideal</td><td>Córnea con forma irregular</td></tr>
          <tr><td>Aparece en receta como</td><td>SPH (esfera)</td><td>CYL + AXIS (cilindro + eje)</td></tr>
          <tr><td>Tipo de lente necesario</td><td>Esférico</td><td>Tórico</td></tr>
        </tbody>
      </table>

      <h2>¿Y si tengo las dos?</h2>
      <p>Es completamente normal — muchísimas personas tienen miopía y astigmatismo al mismo tiempo. En ese caso necesitas un <strong>lente tórico</strong>, diseñado específicamente para corregir ambas condiciones a la vez, manteniéndose además orientado en el ángulo correcto (tu AXIS) dentro del ojo mientras parpadeas.</p>

      <h2>¿Cómo leo mi propia receta?</h2>
      <p>Busca estas tres columnas: <strong>SPH</strong> (tu graduación de miopía o hipermetropía), <strong>CYL</strong> (si tienes astigmatismo, este valor no será cero), y <strong>AXIS</strong> (el ángulo del astigmatismo, siempre acompaña al CYL). Si además tienes un valor en <strong>ADD</strong>, significa que también tienes presbicia (vista cansada, común después de los 40).</p>

      <p>¿Quieres que te ayudemos a identificar exactamente qué necesitas según tu receta? Usa nuestra <Link href="/receta">calculadora gratuita</Link> — solo toma 2 minutos, o escríbenos por WhatsApp al <strong>(809) 694-2268</strong>.</p>
    </BlogArticle>
  )
}
