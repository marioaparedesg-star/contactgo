export const revalidate = 86400
import type { Metadata } from 'next'
import BlogArticle, { type BlogMeta } from '@/components/blog/BlogArticle'
const meta: BlogMeta = {
  "slug": "como-interpretar-caja-lentes-contacto-lote-bc-dia-rd",
  "title": "Cómo leer la caja de lentes de contacto: BC, DIA, lote y vencimiento",
  "h1": "Cómo leer la caja de tus lentes de contacto: graduación, BC, DIA y lote",
  "description": "Aprende a identificar los datos principales del empaque de tus lentes y qué revisar antes de abrir una caja nueva.",
  "publishedAt": "2026-11-15",
  "updatedAt": "2026-11-15",
  "readMinutes": 7,
  "category": "Guías",
  "faq": [
    {
      "q": "¿Qué significa BC en una caja?",
      "a": "BC significa curva base y describe una característica geométrica del lente."
    },
    {
      "q": "¿Puedo usar una caja si el lote no se lee?",
      "a": "No abras un producto cuyo etiquetado no puedas verificar. Consulta al proveedor o fabricante."
    }
  ],
  "relatedSlugs": [
    "como-leer-receta-optica-rd",
    "como-saber-mi-talla-curvatura-diametro-lentes-contacto-rd",
    "cuanto-tiempo-duran-lentes-contacto-sin-abrir-caja-rd"
  ]
}
export const metadata: Metadata = { title:meta.title, description:meta.description, alternates:{canonical:`https://www.contactgo.net/blog/${meta.slug}`}, openGraph:{title:meta.h1,description:meta.description,url:`https://www.contactgo.net/blog/${meta.slug}`,type:'article',locale:'es_DO',siteName:'ContactGo'}, robots:{index:true,follow:true} }
export default function Page(){return <BlogArticle meta={meta}>
<p>La caja de lentes contiene información para confirmar que recibiste el producto indicado. Antes de abrirla, compara los datos con tu prescripción y revisa que el empaque esté íntegro.</p><h2>Datos comunes del empaque</h2><ul><li><strong>PWR o SPH:</strong> potencia esférica.</li><li><strong>CYL y AXIS:</strong> cilindro y eje para lentes tóricos.</li><li><strong>ADD:</strong> adición en determinados diseños multifocales.</li><li><strong>BC:</strong> curva base.</li><li><strong>DIA:</strong> diámetro total.</li><li><strong>LOT:</strong> número de lote para trazabilidad.</li><li><strong>EXP:</strong> fecha de vencimiento del producto sellado.</li></ul><h2>Compara cada ojo</h2><p>La graduación del ojo derecho puede diferir de la del izquierdo. Verifica potencia y parámetros por separado. Confirma también el nombre exacto del modelo: una marca puede tener varias familias con materiales y diseños distintos.</p><h2>Revisa el estado del empaque</h2><p>No utilices cajas con sellos dañados, blíster abierto o información ilegible. Conserva lote y factura si necesitas hacer una consulta. Si algo no coincide, no abras el producto; confirma con el profesional o vendedor.</p><p>Aprende a interpretar los valores en nuestra <Link href="/blog/como-leer-receta-optica-rd">guía de receta óptica</Link>. Los parámetros no deben modificarse por cuenta propia.</p>
<section className="mt-10 border-t border-gray-100 pt-6"><h2>Fuentes y lectura complementaria</h2><p>Artículo educativo; no sustituye evaluación clínica ni prescripción individual. Sigue las instrucciones del fabricante y de tu profesional de salud visual.</p><ul><li><a href="https://www.cdc.gov/contact-lenses/prevention/index.html" rel="noopener noreferrer">CDC — Prevención y cuidado de lentes</a></li><li><a href="https://www.fda.gov/medical-devices/consumer-products/contact-lenses" rel="noopener noreferrer">FDA — Información para usuarios de lentes</a></li></ul></section>
</BlogArticle>}
