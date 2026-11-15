export const revalidate = 86400
import type { Metadata } from 'next'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'
const meta: BlogMeta = {
  "slug": "adaptacion-lentes-contacto-cuando-no-ajustan-correctamente-rd",
  "title": "Cómo saber si tus lentes de contacto no están bien ajustados",
  "h1": "Señales de que tus lentes de contacto podrían no ajustarse bien",
  "description": "Identifica señales de ajuste inadecuado, movimiento excesivo, incomodidad y visión inestable, y cuándo necesitas una evaluación.",
  "publishedAt": "2026-11-15",
  "updatedAt": "2026-11-15",
  "readMinutes": 7,
  "category": "Consejos",
  "faq": [
    {
      "q": "¿Un lente debe sentirse en el ojo todo el tiempo?",
      "a": "No debería causar dolor ni molestias persistentes. El movimiento y la comodidad deben evaluarse profesionalmente."
    },
    {
      "q": "¿Puedo cambiar a otra curva base?",
      "a": "No. La curva base y el diámetro deben seleccionarse mediante evaluación, no por ensayo y error."
    }
  ],
  "relatedSlugs": [
    "cuanto-tiempo-tarda-adaptarse-lentes-contacto-primera-vez",
    "lentes-contacto-para-astigmatismo",
    "lentes-esclerales-que-son-cuando-necesitas-rd"
  ]
}
export const metadata: Metadata = {title:meta.title,description:meta.description,alternates:{canonical:`https://www.contactgo.net/blog/${meta.slug}`},openGraph:{title:meta.h1,description:meta.description,url:`https://www.contactgo.net/blog/${meta.slug}`,type:'article',locale:'es_DO',siteName:'ContactGo'},robots:{index:true,follow:true}}
export default function Page(){return <BlogArticle meta={meta}>
<p>Un lente puede tener la graduación correcta y aun así no adaptarse adecuadamente al ojo. La curva base, el diámetro, el material y el diseño influyen en cómo se apoya y se mueve. La adaptación no se confirma leyendo solamente los números de la caja.</p><h2>Señales que merecen revisión</h2><ul><li>El lente se desplaza o se descentra con frecuencia.</li><li>Sientes roce, presión o cuerpo extraño persistente.</li><li>La visión fluctúa al parpadear.</li><li>El lente se adhiere o cuesta retirarlo repetidamente.</li><li>Un ojo se siente distinto al otro de forma continua.</li></ul><h2>Qué evalúa el profesional</h2><p>Puede observar la posición, el movimiento con el parpadeo, la cobertura corneal y la respuesta de la superficie ocular. También verifica visión, material y parámetros. No existe una curva base universal.</p><h2>Qué no debes hacer</h2><p>No cambies de marca, diámetro, curva base, cilindro o eje sin indicación. Retira los lentes si provocan dolor o enrojecimiento. Dolor, fotofobia, secreción o visión borrosa requieren atención pronta.</p><p>Conoce el proceso en nuestra guía sobre <Link href="/blog/cuanto-tiempo-tarda-adaptarse-lentes-contacto-primera-vez">tiempo de adaptación</Link>.</p>
<section className="mt-10 border-t border-gray-100 pt-6"><h2>Fuentes y lectura complementaria</h2><p>Contenido educativo; no sustituye evaluación clínica ni prescripción individual. Sigue las instrucciones del fabricante y de tu profesional de salud visual.</p><ul><li><a href="https://www.cdc.gov/contact-lenses/prevention/index.html" rel="noopener noreferrer">CDC — Prevención y cuidado de lentes</a></li><li><a href="https://www.aao.org/eye-health/diseases/contact-lens-related-eye-infections" rel="noopener noreferrer">FDA — Información para usuarios de lentes</a></li></ul></section>
</BlogArticle>}
