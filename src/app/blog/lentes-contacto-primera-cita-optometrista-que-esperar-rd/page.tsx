export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'

const meta: BlogMeta = {
  slug: 'lentes-contacto-primera-cita-optometrista-que-esperar-rd',
  title: 'Tu Primera Cita con el Optometrista para Lentes de Contacto',
  h1: 'Qué esperar en tu primera cita con el optometrista',
  description: 'Si nunca has ido a un examen para lentes de contacto, aquí te explicamos paso a paso qué va a pasar, cuánto dura y qué preguntas hacer.',
  publishedAt: '2026-09-08',
  readMinutes: 6,
  category: 'Guías',
  faq: [
    { q: '¿Cuánto dura una cita para lentes de contacto?', a: 'Normalmente entre 30 y 60 minutos, incluyendo el examen de refracción, la evaluación de córnea, y si es tu primera vez, la práctica de inserción y retiro del lente.' },
    { q: '¿Necesito llevar algo a la cita?', a: 'Si ya usas gafas, llévalas — ayuda al optometrista a tener un punto de partida. Si ya usaste lentes de contacto antes, lleva la caja o el nombre de la marca anterior.' },
    { q: '¿La receta de gafas sirve para lentes de contacto?', a: 'No exactamente — aunque se parecen, la receta de lentes de contacto incluye datos adicionales (curvatura base, diámetro) que la de gafas no tiene, porque el lente toca directamente el ojo.' },
  ],
  relatedSlugs: [
    'como-leer-receta-optica-rd',
    'examen-visual-antes-de-comprar-lentes-contacto-rd',
    'guia-principiantes-lentes-contacto-rd-2026',
    'como-usar-lentes-de-contacto-primera-vez',
  ],
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
  openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
  keywords: 'primera cita optometrista lentes de contacto, examen visual lentes de contacto rd, que esperar examen ocular',
}

export default function Page() {
  return (
    <BlogArticle meta={meta}>
      <p>Si nunca has usado lentes de contacto y no sabes qué esperar de tu primera cita, es normal sentir un poco de incertidumbre. Aquí te explicamos el proceso completo, paso a paso, para que llegues tranquilo y sepas qué preguntar.</p>

      <h2>Paso 1: Historial y preguntas iniciales</h2>
      <p>El optometrista te va a preguntar sobre tu salud ocular general, si usas gafas actualmente, cuánto tiempo pasas frente a pantallas, y si tienes alguna condición como ojo seco o alergias. Sé honesto aquí — esta información determina qué tipo de lente te van a recomendar.</p>

      <h2>Paso 2: Examen de refracción</h2>
      <p>Es la parte que ya conoces si has usado gafas — te sientan frente a un equipo (foróptero) y te muestran distintas combinaciones de lentes mientras lees una tabla de letras, preguntando "¿mejor así, o así?". Esto determina tu graduación esférica (SPH) y, si aplica, tu astigmatismo (CYL y AXIS).</p>

      <h2>Paso 3: Evaluación de la córnea</h2>
      <p>Con un instrumento llamado queratómetro (o uno más avanzado, un topógrafo corneal), miden la curvatura exacta de tu córnea. Este dato — la curva base (BC) — es específico de lentes de contacto y no aparece en una receta de gafas, porque determina qué tan bien se va a "acomodar" el lente sobre tu ojo.</p>

      <h2>Paso 4: Evaluación de lágrima (si aplica)</h2>
      <p>Si mencionaste síntomas de ojo seco, el optometrista puede hacer una prueba rápida para medir la calidad y cantidad de tu lágrima — esto ayuda a decidir si necesitas una marca específica pensada para comodidad en ojo seco (como Proclear) en vez de una línea estándar.</p>

      <h2>Paso 5: Prueba de inserción y retiro (primera vez)</h2>
      <p>Si es tu primera vez, te van a enseñar a poner y quitar el lente tú mismo, en el consultorio, con supervisión. Esta parte puede sentirse torpe al principio — es completamente normal, la mayoría de las personas necesita varios intentos antes de sentirse cómoda.</p>

      <h2>Preguntas que vale la pena hacer</h2>
      <ul>
        <li>¿Qué modalidad me recomiendas — diario, quincenal o mensual — y por qué?</li>
        <li>¿Tengo astigmatismo o presbicia que deba corregirse específicamente?</li>
        <li>¿Cada cuánto debo hacer un chequeo de seguimiento?</li>
        <li>¿Hay alguna marca que se ajuste mejor a mi estilo de vida (pantallas, deporte, maquillaje)?</li>
      </ul>

      <h2>Después de la cita</h2>
      <p>Sales con una receta completa: SPH, CYL y AXIS si aplica, BC (curva base), DIA (diámetro), y a veces la marca específica recomendada. Esa receta es la que necesitas para pedir tus lentes — puedes usar nuestra <Link href="/receta">calculadora</Link> para encontrar el producto exacto que corresponde a tu receta, o escribirnos por WhatsApp si tienes dudas de cómo leerla.</p>
    </BlogArticle>
  )
}
