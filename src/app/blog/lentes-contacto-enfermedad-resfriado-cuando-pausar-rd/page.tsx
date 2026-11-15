export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'
const meta: BlogMeta = {
  "slug": "lentes-contacto-enfermedad-resfriado-cuando-pausar-rd",
  "title": "Lentes de contacto cuando tienes gripe o resfriado",
  "h1": "¿Debes usar lentes de contacto cuando tienes gripe o resfriado?",
  "description": "Qué considerar si estás enfermo, tienes fiebre, ojos llorosos o síntomas respiratorios. Higiene, descanso y cuándo suspender los lentes.",
  "publishedAt": "2026-11-15",
  "updatedAt": "2026-11-15",
  "readMinutes": 6,
  "category": "Salud ocular",
  "faq": [
    {
      "q": "¿Puedo usar lentes si tengo un resfriado?",
      "a": "Depende de tus síntomas. Si hay irritación, secreción o enrojecimiento ocular, suspéndelos y consulta."
    },
    {
      "q": "¿Debo desecharlos después de una gripe?",
      "a": "No hay una regla única para todos los casos. Respeta el calendario del producto y la indicación profesional."
    }
  ],
  "relatedSlugs": [
    "lentes-contacto-alergia-conjuntivitis",
    "ojo-rojo-lentes-contacto-que-hacer",
    "como-limpiar-cambiar-estuche-lentes-de-contacto"
  ]
}
export const metadata: Metadata = { title:meta.title, description:meta.description, alternates:{canonical:`https://www.contactgo.net/blog/${meta.slug}`}, openGraph:{title:meta.h1,description:meta.description,url:`https://www.contactgo.net/blog/${meta.slug}`,type:'article',locale:'es_DO',siteName:'ContactGo'}, robots:{index:true,follow:true} }
export default function Page(){return <BlogArticle meta={meta}>
<p>Un resfriado puede venir acompañado de cansancio, fiebre, congestión, lagrimeo o irritación ocular. Si usas lentes de contacto, esos síntomas son una razón para evaluar si conviene descansar de ellos.</p><h2>Cuándo es mejor usar gafas</h2><p>Si tienes ojos rojos, secreción, dolor, lagrimeo persistente o sensación de irritación, retira los lentes y utiliza gafas. Si sospechas conjuntivitis u otra infección ocular, no vuelvas a colocarlos hasta recibir orientación profesional. No compartas toallas, estuches ni productos.</p><h2>Higiene mientras estás enfermo</h2><p>Lávate las manos y sécalas antes de tocar lentes, estuches o párpados. Evita tocarte los ojos después de sonarte la nariz. Usa solución fresca y sigue las instrucciones de desinfección. No reutilices solución ni enjuagues los lentes con agua.</p><h2>Qué hacer con los lentes usados</h2><p>Respeta la modalidad de reemplazo. Los diarios son de un solo uso. Para lentes reutilizables, sigue el proceso completo indicado y consulta si hubo una infección diagnosticada. No inventes un método de esterilización casero.</p><p>Dolor, enrojecimiento intenso, fotofobia, secreción o visión borrosa ameritan evaluación rápida. Lee también nuestra guía sobre <Link href="/blog/lentes-contacto-alergia-conjuntivitis">alergias y conjuntivitis</Link>.</p>
<section className="mt-10 border-t border-gray-100 pt-6"><h2>Fuentes y lectura complementaria</h2><p>Artículo educativo; no sustituye evaluación clínica ni prescripción individual. Sigue las instrucciones del fabricante y de tu profesional de salud visual.</p><ul><li><a href="https://www.cdc.gov/contact-lenses/prevention/index.html" rel="noopener noreferrer">CDC — Prevención y cuidado de lentes</a></li><li><a href="https://www.fda.gov/medical-devices/consumer-products/contact-lenses" rel="noopener noreferrer">FDA — Información para usuarios de lentes</a></li></ul></section>
</BlogArticle>}
