export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'
const meta: BlogMeta = {
  "slug": "un-lente-contacto-para-cada-ojo-recetas-diferentes-rd",
  "title": "¿Cada ojo necesita una graduación distinta en lentes de contacto?",
  "h1": "¿Puedes necesitar una graduación diferente para cada ojo?",
  "description": "Qué significa tener recetas distintas en cada ojo, cómo identificar OD y OI y por qué debes revisar cada caja antes de abrirla.",
  "publishedAt": "2026-11-15",
  "updatedAt": "2026-11-15",
  "readMinutes": 6,
  "category": "Guías",
  "faq": [
    {
      "q": "¿Es normal tener diferente graduación en cada ojo?",
      "a": "Sí. Muchas personas tienen potencias o parámetros distintos entre el ojo derecho y el izquierdo."
    },
    {
      "q": "¿Puedo comprar dos cajas iguales si mis ojos ven parecido?",
      "a": "No lo asumas. Verifica la prescripción y los parámetros de cada ojo antes de comprar."
    }
  ],
  "relatedSlugs": [
    "como-leer-receta-optica-rd",
    "como-saber-mi-talla-curvatura-diametro-lentes-contacto-rd"
  ]
}
export const metadata: Metadata = {title:meta.title,description:meta.description,alternates:{canonical:`https://www.contactgo.net/blog/${meta.slug}`},openGraph:{title:meta.h1,description:meta.description,url:`https://www.contactgo.net/blog/${meta.slug}`,type:'article',locale:'es_DO',siteName:'ContactGo'},robots:{index:true,follow:true}}
export default function Page(){return <BlogArticle meta={meta}>
<p>No todas las personas tienen la misma graduación en ambos ojos. Puedes necesitar potencias diferentes, astigmatismo en un solo ojo o parámetros distintos para cada lado. Una compra correcta revisa la prescripción del ojo derecho y del izquierdo por separado.</p><h2>Qué significan OD y OI</h2><p>OD identifica el ojo derecho y OI el izquierdo. En la receta pueden aparecer valores distintos de esfera (SPH), cilindro (CYL), eje (AXIS) o adición (ADD). También puede variar el diseño indicado para cada ojo.</p><h2>Por qué no debes intercambiar las cajas</h2><p>Usar el lente del ojo contrario puede producir visión borrosa o una corrección inadecuada. Aunque los números parezcan cercanos, no cambies el orden ni utilices el mismo lente en ambos ojos sin confirmación profesional.</p><h2>Cómo evitar errores</h2><ul><li>Ten a mano la prescripción completa y actualizada.</li><li>Confirma OD y OI antes de seleccionar la cantidad.</li><li>Verifica potencia, cilindro, eje, curva base y diámetro cuando correspondan.</li><li>Compara cada caja con la indicación antes de abrirla.</li></ul><p>Si algo no coincide, no abras el producto. Consulta nuestra guía para <Link href="/blog/como-leer-receta-optica-rd">leer una receta óptica</Link>.</p>
<section className="mt-10 border-t border-gray-100 pt-6"><h2>Fuentes y lectura complementaria</h2><p>Contenido educativo; no sustituye evaluación clínica ni prescripción individual. Sigue las instrucciones del fabricante y de tu profesional de salud visual.</p><ul><li><a href="https://www.cdc.gov/contact-lenses/prevention/index.html" rel="noopener noreferrer">CDC — Prevención y cuidado de lentes</a></li><li><a href="https://www.fda.gov/medical-devices/consumer-products/contact-lenses" rel="noopener noreferrer">FDA — Información para usuarios de lentes</a></li></ul></section>
</BlogArticle>}
