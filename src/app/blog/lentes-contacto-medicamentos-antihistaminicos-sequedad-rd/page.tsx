export const revalidate = 86400
import type { Metadata } from 'next'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'
const meta: BlogMeta = {
  "slug": "lentes-contacto-medicamentos-antihistaminicos-sequedad-rd",
  "title": "Lentes de contacto y medicamentos: antihistamínicos y sequedad",
  "h1": "Lentes de contacto y medicamentos: qué consultar antes de usarlos juntos",
  "description": "Algunos medicamentos pueden acompañarse de sequedad o cambios de comodidad ocular. Qué revisar y qué preguntar al profesional de salud.",
  "publishedAt": "2026-11-15",
  "updatedAt": "2026-11-15",
  "readMinutes": 7,
  "category": "Salud ocular",
  "faq": [
    {
      "q": "¿Los antihistamínicos pueden afectar la comodidad?",
      "a": "Algunos medicamentos pueden contribuir a la sequedad en ciertas personas. Consulta al médico o farmacéutico."
    },
    {
      "q": "¿Debo dejar de usar lentes al comenzar un medicamento?",
      "a": "Depende del medicamento, tus síntomas y tu condición ocular. Confirma con el profesional y no suspendas tratamientos por tu cuenta."
    }
  ],
  "relatedSlugs": [
    "lentes-contacto-alergia-conjuntivitis",
    "ojos-secos-lentes-contacto",
    "gotas-oftalmicas-con-lentes-contacto-cuando-retirarlos-rd"
  ]
}
export const metadata: Metadata = {title:meta.title,description:meta.description,alternates:{canonical:`https://www.contactgo.net/blog/${meta.slug}`},openGraph:{title:meta.h1,description:meta.description,url:`https://www.contactgo.net/blog/${meta.slug}`,type:'article',locale:'es_DO',siteName:'ContactGo'},robots:{index:true,follow:true}}
export default function Page(){return <BlogArticle meta={meta}>
<p>Cuando comienzas un medicamento nuevo, menciona que utilizas lentes de contacto. Algunos fármacos pueden producir sequedad, cambios en la producción lagrimal o molestias oculares en determinadas personas. El efecto depende del medicamento, la dosis y tu situación de salud.</p><h2>Qué medicamentos conviene mencionar</h2><p>Comenta si utilizas antihistamínicos para alergias, tratamientos para resfriados u otros fármacos de uso continuo. Esto no significa que debas suspenderlos: permite que el médico o farmacéutico revise posibles efectos y te oriente.</p><h2>Preguntas para tu consulta</h2><ul><li>¿Este medicamento puede aumentar la sequedad ocular?</li><li>¿Debo retirar los lentes al aplicar el tratamiento?</li><li>¿Qué gotas son compatibles con mi tipo de lente?</li><li>¿Qué señales indican que debo suspender su uso?</li></ul><h2>No te automediques</h2><p>No añadas gotas medicadas ni cambies la solución de limpieza sin verificar compatibilidad. Si necesitas lubricación frecuente, solicita una recomendación individual. Dolor, enrojecimiento, secreción, fotofobia o visión borrosa requieren evaluación.</p><p>Revisa nuestras guías sobre <Link href="/blog/ojos-secos-lentes-contacto">sequedad ocular</Link> y <Link href="/blog/lentes-contacto-alergia-conjuntivitis">alergias</Link>.</p>
<section className="mt-10 border-t border-gray-100 pt-6"><h2>Fuentes y lectura complementaria</h2><p>Contenido educativo; no sustituye evaluación clínica ni prescripción individual. Sigue las instrucciones del fabricante y de tu profesional de salud visual.</p><ul><li><a href="https://www.fda.gov/medical-devices/consumer-products/contact-lenses" rel="noopener noreferrer">CDC — Prevención y cuidado de lentes</a></li><li><a href="https://www.aao.org/eye-health/diseases/contact-lens-related-eye-infections" rel="noopener noreferrer">FDA — Información para usuarios de lentes</a></li></ul></section>
</BlogArticle>}
