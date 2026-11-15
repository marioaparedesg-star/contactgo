export const revalidate = 86400
import type { Metadata } from 'next'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'
const meta: BlogMeta = {
  "slug": "gotas-oftalmicas-con-lentes-contacto-cuando-retirarlos-rd",
  "title": "Gotas para los ojos y lentes de contacto: cuándo retirarlos",
  "h1": "¿Puedo usar gotas para los ojos mientras llevo lentes de contacto?",
  "description": "No todas las gotas son compatibles con lentes de contacto. Aprende a revisar la etiqueta y saber cuándo retirarlos.",
  "publishedAt": "2026-11-15",
  "updatedAt": "2026-11-15",
  "readMinutes": 7,
  "category": "Salud ocular",
  "faq": [
    {
      "q": "¿Puedo usar cualquier lágrima artificial con los lentes puestos?",
      "a": "No. Solo utiliza gotas cuya etiqueta indique compatibilidad o que hayan sido recomendadas para tu caso."
    },
    {
      "q": "¿Cuánto espero para volver a colocarlos?",
      "a": "Depende del medicamento y sus instrucciones. No existe un tiempo universal para todas las gotas."
    }
  ],
  "relatedSlugs": [
    "gotas-para-ojos-secos-republica-dominicana",
    "refresh-optive-precio-republica-dominicana",
    "ojos-secos-lentes-contacto"
  ]
}
export const metadata: Metadata = {
 title: meta.title, description: meta.description,
 alternates: { canonical: `https://www.contactgo.net/blog/${meta.slug}` },
 openGraph: { title: meta.h1, description: meta.description, url: `https://www.contactgo.net/blog/${meta.slug}`, type: 'article', locale: 'es_DO', siteName: 'ContactGo' },
 robots: { index: true, follow: true },
}
export default function Page(){ return <BlogArticle meta={meta}>
<p>No todos los colirios están diseñados para utilizarse con lentes de contacto puestos. Algunos lubricantes indican expresamente que son compatibles; otros medicamentos requieren retirar los lentes antes de aplicarlos o esperar un tiempo determinado.</p><h2>Lee la etiqueta</h2><p>Busca una indicación clara de compatibilidad. Si no aparece, no asumas que el producto es seguro con el lente puesto. Revisa advertencias, frecuencia y si el envase es de dosis única o multidosis.</p><h2>Lubricantes y medicamentos son distintos</h2><p>Las lágrimas artificiales ayudan a aliviar síntomas de sequedad, pero su formulación varía. Los colirios para alergia, infección, inflamación o glaucoma tienen indicaciones específicas. Si te prescriben un medicamento, pregunta si debes retirar los lentes y cuándo puedes volver a colocarlos.</p><h2>Qué hacer si tienes molestias</h2><ul><li>Retira los lentes si hay dolor, enrojecimiento o visión borrosa.</li><li>No uses gotas para ocultar síntomas y continuar usándolos.</li><li>Utiliza solo productos compatibles y consulta si necesitas lubricación frecuente.</li></ul><p>Dolor, secreción, fotofobia o visión borrosa requieren evaluación rápida. Consulta nuestra guía de <Link href="/blog/ojos-secos-lentes-contacto">ojos secos</Link> y la información del <a href="https://www.fda.gov/medical-devices/consumer-products/contact-lenses" rel="noopener noreferrer">FDA sobre cuidado de lentes</a>.</p>
<section className="mt-10 border-t border-gray-100 pt-6"><h2>Fuentes y lectura complementaria</h2><p>Contenido informativo; no sustituye una evaluación ni una prescripción individual. Sigue las instrucciones del fabricante y de tu profesional de salud visual.</p><ul><li><a href="https://www.fda.gov/medical-devices/consumer-products/contact-lenses" rel="noopener noreferrer">CDC — Prevención y cuidado de lentes de contacto</a></li><li><a href="https://www.aao.org/eye-health/diseases/contact-lens-related-eye-infections" rel="noopener noreferrer">FDA — Información para usuarios de lentes de contacto</a></li></ul></section>
</BlogArticle> }
