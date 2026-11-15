export const revalidate = 86400
import type { Metadata } from 'next'
import Link from 'next/link'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'
const meta: BlogMeta = {
  "slug": "lentes-contacto-polvo-humo-construccion-trabajo-rd",
  "title": "Lentes de contacto en ambientes con polvo, humo y construcción",
  "h1": "Lentes de contacto en ambientes con polvo, humo o partículas: precauciones",
  "description": "Recomendaciones para quienes trabajan en construcción, talleres o ambientes con polvo y humo, y cuándo es preferible usar gafas.",
  "publishedAt": "2026-11-15",
  "updatedAt": "2026-11-15",
  "readMinutes": 7,
  "category": "Consejos",
  "faq": [
    {
      "q": "¿Los lentes de contacto protegen del polvo?",
      "a": "No. No sustituyen gafas de seguridad ni protección ocular industrial."
    },
    {
      "q": "¿Qué hago si entra polvo debajo del lente?",
      "a": "No frotes el ojo. Sigue el protocolo de seguridad y busca atención si persiste la molestia."
    }
  ],
  "relatedSlugs": [
    "lentes-contacto-uniforme-trabajo-profesiones-rd",
    "lentes-contacto-deporte-actividad-fisica",
    "ojo-rojo-lentes-contacto-que-hacer"
  ]
}
export const metadata: Metadata = { title:meta.title, description:meta.description, alternates:{canonical:`https://www.contactgo.net/blog/${meta.slug}`}, openGraph:{title:meta.h1,description:meta.description,url:`https://www.contactgo.net/blog/${meta.slug}`,type:'article',locale:'es_DO',siteName:'ContactGo'}, robots:{index:true,follow:true} }
export default function Page(){return <BlogArticle meta={meta}>
<p>Construcción, carpintería, talleres y almacenes pueden exponer los ojos a partículas, vapores y residuos. Los lentes de contacto no son equipos de protección personal y no sustituyen las gafas de seguridad indicadas para cada tarea.</p><h2>Por qué importa el ambiente</h2><p>El polvo puede quedar atrapado entre el lente y la superficie ocular y causar irritación. El humo, los vapores y el aire seco también afectan la comodidad. En trabajos con partículas proyectadas o salpicaduras químicas se necesita protección ocular certificada para ese riesgo.</p><h2>Antes de comenzar el turno</h2><ul><li>Revisa la evaluación de riesgos del lugar de trabajo.</li><li>Utiliza gafas de seguridad o protección facial cuando corresponda.</li><li>Lleva gafas graduadas de respaldo.</li><li>No manipules lentes con manos contaminadas por polvo o químicos.</li></ul><h2>Si entra una sustancia en el ojo</h2><p>No frotes ni intentes retirar partículas con herramientas. Ante una salpicadura química, sigue inmediatamente el protocolo de emergencia del producto y del lugar de trabajo y solicita atención médica. No retrases el lavado indicado para intentar retirar primero el lente.</p><p>Consulta si puedes alternar lentes y gafas durante la jornada. Más información en <Link href="/blog/lentes-contacto-uniforme-trabajo-profesiones-rd">lentes según el trabajo</Link>.</p>
<section className="mt-10 border-t border-gray-100 pt-6"><h2>Fuentes y lectura complementaria</h2><p>Artículo educativo; no sustituye evaluación clínica ni prescripción individual. Sigue las instrucciones del fabricante y de tu profesional de salud visual.</p><ul><li><a href="https://www.cdc.gov/contact-lenses/prevention/index.html" rel="noopener noreferrer">CDC — Prevención y cuidado de lentes</a></li><li><a href="https://www.fda.gov/medical-devices/consumer-products/contact-lenses" rel="noopener noreferrer">FDA — Información para usuarios de lentes</a></li></ul></section>
</BlogArticle>}
