export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'
const meta: BlogMeta = {
  "slug": "lente-contacto-pegado-ojo-como-retirarlo-seguro-rd",
  "title": "Lente de contacto pegado al ojo: qué hacer sin lastimarte",
  "h1": "¿Sientes que el lente de contacto está pegado al ojo? Qué hacer",
  "description": "Pasos prudentes si un lente parece adherido, qué maniobras evitar y cuándo buscar atención profesional.",
  "publishedAt": "2026-11-15",
  "updatedAt": "2026-11-15",
  "readMinutes": 6,
  "category": "Consejos",
  "faq": [
    {
      "q": "¿Un lente puede quedarse detrás del ojo?",
      "a": "No. Puede desplazarse debajo del párpado, pero la anatomía impide que pase detrás del globo ocular."
    },
    {
      "q": "¿Debo usar pinzas para retirarlo?",
      "a": "No. Nunca uses pinzas, uñas ni objetos. Si no sale fácilmente, busca asistencia profesional."
    }
  ],
  "relatedSlugs": [
    "perdida-lente-contacto-ojo-que-hacer",
    "se-me-salio-perdio-un-lente-de-contacto-que-hacer"
  ]
}
export const metadata: Metadata = {
 title: meta.title, description: meta.description,
 alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
 openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
 robots: { index: true, follow: true },
}
export default function Page(){ return <BlogArticle meta={meta}>
<p>Cuando un lente se siente adherido, tirar con fuerza, presionar el ojo o usar uñas y objetos puede provocar una lesión. La prioridad es mantener la calma y evitar maniobras que dañen la córnea.</p><h2>Por qué puede sentirse pegado</h2><p>La sequedad, el uso más prolongado del indicado, el aire acondicionado o una superficie deteriorada pueden aumentar la sensación de adherencia. A veces el lente se desplaza bajo el párpado y parece que desapareció, pero no puede pasar detrás del ojo.</p><h2>Qué hacer con prudencia</h2><ul><li>Lávate y sécate bien las manos.</li><li>No frotes el ojo ni intentes despegar el lente con las uñas.</li><li>Usa solo lubricantes compatibles con lentes y según su etiqueta.</li><li>Si no se mueve o no puedes retirarlo fácilmente, detente y busca ayuda profesional.</li></ul><h2>Qué no debes hacer</h2><p>No uses pinzas, cotonetes ni herramientas. No rasques el ojo ni coloques gotas medicadas sin indicación. Si hay dolor, enrojecimiento, fotofobia, secreción o visión borrosa, busca atención urgente.</p><p>Si el problema se repite, solicita una revisión del ajuste. Lee también qué hacer si <Link href="/blog/perdida-lente-contacto-ojo-que-hacer">no encuentras el lente</Link>.</p>
<section className="mt-10 border-t border-gray-100 pt-6"><h2>Fuentes y lectura complementaria</h2><p>Contenido informativo; no sustituye una evaluación ni una prescripción individual. Sigue las instrucciones del fabricante y de tu profesional de salud visual.</p><ul><li><a href="https://www.cdc.gov/contact-lenses/prevention/index.html" rel="noopener noreferrer">CDC — Prevención y cuidado de lentes de contacto</a></li><li><a href="https://www.aao.org/eye-health/diseases/contact-lens-related-eye-infections" rel="noopener noreferrer">FDA — Información para usuarios de lentes de contacto</a></li></ul></section>
</BlogArticle> }
