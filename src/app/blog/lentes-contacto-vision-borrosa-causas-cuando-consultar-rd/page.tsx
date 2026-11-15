export const revalidate = 86400
import type { Metadata } from 'next'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'
const meta: BlogMeta = {
  "slug": "lentes-contacto-vision-borrosa-causas-cuando-consultar-rd",
  "title": "Visión borrosa con lentes de contacto: causas y señales de alerta",
  "h1": "Visión borrosa con lentes de contacto: causas posibles y cuándo consultar",
  "description": "Conoce causas frecuentes de visión borrosa con lentes de contacto y distingue una molestia pasajera de una señal que necesita atención.",
  "publishedAt": "2026-11-15",
  "updatedAt": "2026-11-15",
  "readMinutes": 8,
  "category": "Salud ocular",
  "faq": [
    {
      "q": "¿Qué hago si veo borroso con un lente?",
      "a": "Retira el lente si no se aclara rápidamente o hay molestia, usa tus gafas y consulta. No conduzcas con visión borrosa."
    },
    {
      "q": "¿Siempre significa que necesito otra graduación?",
      "a": "No. También puede relacionarse con sequedad, depósitos, daño, lente invertido, rotación tórica o ajuste."
    }
  ],
  "relatedSlugs": [
    "ojo-rojo-lentes-contacto-que-hacer",
    "lentes-contacto-para-astigmatismo",
    "cuando-cambiar-graduacion-lentes-contacto-senales-rd"
  ]
}
export const metadata: Metadata = { title:meta.title, description:meta.description, alternates:{canonical:`https://www.contactgo.net/blog/${meta.slug}`}, openGraph:{title:meta.h1,description:meta.description,url:`https://www.contactgo.net/blog/${meta.slug}`,type:'article',locale:'es_DO',siteName:'ContactGo'}, robots:{index:true,follow:true} }
export default function Page(){return <BlogArticle meta={meta}>
<p>La visión borrosa al usar lentes de contacto no debe normalizarse, especialmente si aparece de repente, afecta un solo ojo o se acompaña de dolor. Aunque algunas causas son corregibles, también puede indicar una complicación que necesita atención.</p><h2>Causas posibles</h2><ul><li><strong>Sequedad:</strong> la película lagrimal irregular puede alterar temporalmente la nitidez.</li><li><strong>Depósitos:</strong> residuos en la superficie pueden reducir la claridad.</li><li><strong>Lente dañado o invertido:</strong> una deformación o colocación incorrecta puede afectar visión y comodidad.</li><li><strong>Rotación tórica:</strong> puede desalinear la corrección del astigmatismo.</li><li><strong>Ajuste o graduación:</strong> los parámetros pueden requerir reevaluación.</li></ul><h2>Qué revisar</h2><p>Retira el lente si hay molestia y revisa si está roto, sucio o fuera de su calendario. No lo limpies con agua ni saliva. No cambies la potencia por tu cuenta. Si la borrosidad persiste después de retirarlo, solicita evaluación.</p><h2>Señales de alerta</h2><p>Dolor, enrojecimiento inusual, sensibilidad a la luz, secreción o disminución repentina de visión requieren atención oftalmológica urgente. Retira el lente y no vuelvas a colocarlo hasta recibir indicaciones. No intentes resolver estos síntomas solamente con gotas.</p><p>Para conocer otra señal frecuente, consulta <Link href="/blog/ojo-rojo-lentes-contacto-que-hacer">qué hacer ante un ojo rojo</Link>.</p>
<section className="mt-10 border-t border-gray-100 pt-6"><h2>Fuentes y lectura complementaria</h2><p>Artículo educativo; no sustituye evaluación clínica ni prescripción individual. Sigue las instrucciones del fabricante y de tu profesional de salud visual.</p><ul><li><a href="https://www.cdc.gov/contact-lenses/prevention/index.html" rel="noopener noreferrer">CDC — Prevención y cuidado de lentes</a></li><li><a href="https://www.aao.org/eye-health/diseases/contact-lens-related-eye-infections" rel="noopener noreferrer">FDA — Información para usuarios de lentes</a></li></ul></section>
</BlogArticle>}
